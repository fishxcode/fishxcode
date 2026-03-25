export type ParentOriginState = {
  inIframe: boolean
  parentOrigin: string | null
  allowed: boolean
}

const PARENT_HELLO_TYPE = 'fishxcode:parent-hello'
const SET_LANG_TYPE = 'fishxcode:set-lang'
const DOC_SCROLL_TYPE = 'fishxcode:doc-scroll'
const MAX_SCROLL_REPORT_INTERVAL_MS = 100

const SUPPORTED_LOCALE_PREFIXES = ['/en/', '/fr/', '/es/', '/pt/'] as const

type LocaleBasePath = '/' | '/en/' | '/fr/' | '/es/' | '/pt/'

let initialized = false
let scrollReportingEnabled = false
let trustedParentOrigin: string | null = null
let messageHandler: ((event: MessageEvent) => void) | null = null
let scrollHandler: (() => void) | null = null
let resizeHandler: (() => void) | null = null
let rafId: number | null = null
let throttleTimerId: number | null = null
let lastScrollReportAt = 0
let hasPendingScrollReport = false

function isInIframe(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

function isAllowedParentOrigin(origin: string): boolean {
  let url: URL

  try {
    url = new URL(origin)
  } catch {
    return false
  }

  if (url.protocol !== 'https:') return false

  const isAllowedHost = url.hostname === 'fishxcode.com' || url.hostname.endsWith('.fishxcode.com')
  if (!isAllowedHost) return false

  return url.port === '' || url.port === '443'
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function clearScheduledScrollReport(): void {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }

  if (throttleTimerId !== null) {
    window.clearTimeout(throttleTimerId)
    throttleTimerId = null
  }

  hasPendingScrollReport = false
}

function createScrollPayload() {
  const doc = document.documentElement
  const body = document.body

  const scrollTop = Math.max(0, window.scrollY || doc.scrollTop || body?.scrollTop || 0)
  const scrollHeight = Math.max(doc.scrollHeight, body?.scrollHeight || 0)
  const clientHeight = Math.max(window.innerHeight || 0, doc.clientHeight || 0, body?.clientHeight || 0)

  const maxScrollable = Math.max(scrollHeight - clientHeight, 0)
  const rawProgress = maxScrollable === 0 ? (scrollTop > 0 ? 1 : 0) : scrollTop / maxScrollable
  const progress = Math.min(1, Math.max(0, Number.isFinite(rawProgress) ? rawProgress : 0))

  return {
    type: DOC_SCROLL_TYPE,
    scrollTop,
    scrollHeight,
    clientHeight,
    progress,
  }
}

function postToTrustedParent(message: ReturnType<typeof createScrollPayload>): void {
  if (!trustedParentOrigin) return
  window.parent.postMessage(message, trustedParentOrigin)
}

function emitScrollReport(force = false): void {
  if (!trustedParentOrigin) return

  const now = Date.now()
  if (!force && now - lastScrollReportAt < MAX_SCROLL_REPORT_INTERVAL_MS) {
    hasPendingScrollReport = true
    return
  }

  postToTrustedParent(createScrollPayload())
  lastScrollReportAt = now
  hasPendingScrollReport = false
}

function flushScrollReport(): void {
  rafId = null

  if (!trustedParentOrigin || !hasPendingScrollReport) return

  const elapsed = Date.now() - lastScrollReportAt
  if (elapsed >= MAX_SCROLL_REPORT_INTERVAL_MS) {
    emitScrollReport()
    return
  }

  if (throttleTimerId !== null) return

  throttleTimerId = window.setTimeout(() => {
    throttleTimerId = null
    if (!hasPendingScrollReport || !trustedParentOrigin) return
    if (rafId !== null) return
    rafId = window.requestAnimationFrame(flushScrollReport)
  }, MAX_SCROLL_REPORT_INTERVAL_MS - elapsed)
}

function scheduleScrollReport(): void {
  if (!trustedParentOrigin) return

  hasPendingScrollReport = true

  if (rafId !== null) return
  rafId = window.requestAnimationFrame(flushScrollReport)
}

function enableScrollReporting(): void {
  if (scrollReportingEnabled) return
  if (!trustedParentOrigin) return

  scrollHandler = () => {
    scheduleScrollReport()
  }

  resizeHandler = () => {
    scheduleScrollReport()
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', resizeHandler)

  scrollReportingEnabled = true
  emitScrollReport(true)
}

function disableScrollReporting(): void {
  if (!scrollReportingEnabled) return

  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }

  clearScheduledScrollReport()
  scrollHandler = null
  resizeHandler = null
  scrollReportingEnabled = false
}

function normalizeLanguageTag(rawLang: string): string {
  return rawLang.trim().toLowerCase()
}

function mapLangToLocaleBasePath(rawLang: string): LocaleBasePath | null {
  const normalized = normalizeLanguageTag(rawLang)

  if (normalized === 'zh' || normalized === 'zh-cn' || normalized === 'zh-hans') {
    return '/'
  }

  if (normalized === 'en' || normalized === 'en-us') {
    return '/en/'
  }

  if (normalized === 'fr' || normalized === 'fr-fr') {
    return '/fr/'
  }

  if (normalized === 'es' || normalized === 'es-es') {
    return '/es/'
  }

  if (normalized === 'pt' || normalized === 'pt-br') {
    return '/pt/'
  }

  return null
}

function extractRelativeDocPath(pathname: string): string | null {
  if (!pathname.startsWith('/')) return null

  for (const localePrefix of SUPPORTED_LOCALE_PREFIXES) {
    const noTrailingSlashPrefix = localePrefix.slice(0, -1)

    if (pathname === noTrailingSlashPrefix || pathname === localePrefix) {
      return ''
    }

    if (pathname.startsWith(localePrefix)) {
      return pathname.slice(localePrefix.length)
    }
  }

  if (pathname === '/') {
    return ''
  }

  return pathname.slice(1)
}

function isSafeRelativeDocPath(path: string): boolean {
  if (path.startsWith('/')) return false

  const segments = path.split('/').filter(Boolean)

  for (const segment of segments) {
    let decodedSegment: string

    try {
      decodedSegment = decodeURIComponent(segment)
    } catch {
      return false
    }

    if (decodedSegment === '.' || decodedSegment === '..') {
      return false
    }
  }

  return true
}

function buildLocalizedPathname(localeBase: LocaleBasePath, relativeDocPath: string): string {
  if (!relativeDocPath) return localeBase

  if (!isSafeRelativeDocPath(relativeDocPath)) {
    return localeBase
  }

  if (localeBase === '/') {
    return `/${relativeDocPath}`
  }

  return `${localeBase}${relativeDocPath}`
}

function applyLanguageFromParent(lang: string): void {
  const localeBase = mapLangToLocaleBasePath(lang)
  if (!localeBase) return

  const currentPathname = window.location.pathname
  const relativeDocPath = extractRelativeDocPath(currentPathname)

  const targetPathname = relativeDocPath === null
    ? localeBase
    : buildLocalizedPathname(localeBase, relativeDocPath)

  const targetUrl = `${targetPathname}${window.location.search}${window.location.hash}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (targetUrl === currentUrl) return

  window.location.assign(targetUrl)
}

export function detectParentOrigin(): ParentOriginState {
  const inIframe = isInIframe()
  const parentOrigin = trustedParentOrigin

  return {
    inIframe,
    parentOrigin,
    allowed: inIframe && parentOrigin !== null && isAllowedParentOrigin(parentOrigin),
  }
}

export function initIframeBridge(): void {
  if (typeof window === 'undefined') return
  if (initialized) return

  const inIframe = isInIframe()
  if (!inIframe) return

  messageHandler = (event: MessageEvent) => {
    if (event.source !== window.parent) return

    const data = event.data
    if (!isPlainObject(data)) return

    if (data.type === PARENT_HELLO_TYPE) {
      if (!isAllowedParentOrigin(event.origin)) return

      trustedParentOrigin = event.origin
      enableScrollReporting()
      return
    }

    if (event.origin !== trustedParentOrigin) return
    if (data.type !== SET_LANG_TYPE) return

    const { lang } = data
    if (typeof lang !== 'string') return

    applyLanguageFromParent(lang)
  }

  window.addEventListener('message', messageHandler)
  initialized = true
}

export function notifyRouteChange(): void {
  if (typeof window === 'undefined') return
  if (!initialized) return
  if (!trustedParentOrigin) return

  emitScrollReport(true)
}

export function destroyIframeBridge(): void {
  if (typeof window !== 'undefined') {
    disableScrollReporting()

    if (messageHandler) {
      window.removeEventListener('message', messageHandler)
    }
  }

  messageHandler = null
  trustedParentOrigin = null
  lastScrollReportAt = 0
  initialized = false
}
