import { PAGE_ACTION_CONFIG, type LocaleCode } from '../config/page-actions'

const HOME_PATHS = new Set([
  '/',
  '/en/',
  '/fr/',
  '/es/',
  '/pt/',
  '/en',
  '/fr',
  '/es',
  '/pt',
  '/index',
  '/en/index',
  '/fr/index',
  '/es/index',
  '/pt/index',
])

function trimTrailingSlash(path: string): string {
  if (path === '/') return path
  return path.endsWith('/') ? path.slice(0, -1) : path
}

function normalizePrefix(prefix: string): string {
  if (!prefix) return ''
  const p = prefix.startsWith('/') ? prefix.slice(1) : prefix
  return p.endsWith('/') ? p : `${p}/`
}

export function normalizePath(path: string): string {
  const noHash = path.split('#')[0] ?? path
  const noQuery = noHash.split('?')[0] ?? noHash
  if (!noQuery) return '/'
  return noQuery.startsWith('/') ? noQuery : `/${noQuery}`
}

export function isHomePath(path: string): boolean {
  const normalized = normalizePath(path)
  if (HOME_PATHS.has(normalized)) return true
  const compact = trimTrailingSlash(normalized)
  return HOME_PATHS.has(compact)
}

export function isDocPath(path: string): boolean {
  const normalized = trimTrailingSlash(normalizePath(path))
  return normalized.length > 0
}

export function toMarkdownPath(path: string): string | null {
  const normalized = trimTrailingSlash(normalizePath(path))
  if (normalized === '/') return 'index.md'

  const stripped = normalized.replace(/^\//, '')
  if (!stripped) return 'index.md'

  if (/\.md$/i.test(stripped)) return stripped

  return `${stripped}.md`
}

export function toLocale(path: string): LocaleCode {
  const normalized = normalizePath(path)
  if (normalized.startsWith('/en/')) return 'en-US'
  if (normalized.startsWith('/fr/')) return 'fr-FR'
  if (normalized.startsWith('/es/')) return 'es-ES'
  if (normalized.startsWith('/pt/')) return 'pt-BR'
  return 'zh-CN'
}

export function resolvePageActionContext(path: string) {
  const normalizedPath = normalizePath(path)
  const mdPath = toMarkdownPath(normalizedPath)
  const docUrl = `${PAGE_ACTION_CONFIG.siteBaseUrl}${normalizedPath}`

  const pathPrefix = normalizePrefix(PAGE_ACTION_CONFIG.github.pathPrefix)
  const fullMdPath = mdPath ? `${pathPrefix}${mdPath}` : null

  const githubMdUrl = fullMdPath
    ? `https://github.com/${PAGE_ACTION_CONFIG.github.owner}/${PAGE_ACTION_CONFIG.github.repo}/blob/${PAGE_ACTION_CONFIG.github.branch}/${fullMdPath}`
    : null

  const githubRawMdUrl = fullMdPath
    ? `https://raw.githubusercontent.com/${PAGE_ACTION_CONFIG.github.owner}/${PAGE_ACTION_CONFIG.github.repo}/${PAGE_ACTION_CONFIG.github.branch}/${fullMdPath}`
    : null

  return {
    path: normalizedPath,
    lang: toLocale(normalizedPath),
    docUrl,
    githubMdPath: fullMdPath,
    githubMdUrl,
    githubRawMdUrl,
    preferredReadUrl: githubMdUrl ?? docUrl,
  }
}
