import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { Feed } from 'feed'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const SITE_URL = 'https://doc.fishxcode.com'
const SITE_TITLE = 'FishXCode'
const SITE_DESC = 'AI Coding 中转站 - 支持 Claude、Codex 模型在多种平台使用'

const LOCALES = [
  { lang: 'zh-CN', prefix: '' },
  { lang: 'en-US', prefix: 'en' },
  { lang: 'fr-FR', prefix: 'fr' },
  { lang: 'es-ES', prefix: 'es' },
  { lang: 'pt-BR', prefix: 'pt' },
] as const

const VERIFICATION_META = [
  { env: 'GOOGLE_SITE_VERIFICATION', name: 'google-site-verification' },
  { env: 'BING_SITE_VERIFICATION', name: 'msvalidate.01' },
  { env: 'BAIDU_SITE_VERIFICATION', name: 'baidu-site-verification' },
  { env: 'SOGOU_SITE_VERIFICATION', name: 'sogou_site_verification' },
  { env: 'SO360_SITE_VERIFICATION', name: '360-site-verification' },
  { env: 'YANDEX_SITE_VERIFICATION', name: 'yandex-verification' },
  { env: 'NAVER_SITE_VERIFICATION', name: 'naver-site-verification' },
  { env: 'SEZNAM_SITE_VERIFICATION', name: 'seznam-wmt' },
] as const

const VERIFICATION_META_TAGS = buildVerificationMetaTags()

// GitHub Pages 子路径支持：
//   - 本地开发 / Docker / 自定义域名：BASE = '/'
//   - GitHub Pages 无自定义域名：CI 传入 VITEPRESS_BASE=/fishxcode/
const BASE = (process.env.VITEPRESS_BASE ?? '/').replace(/([^/])$/, '$1/')

/** 将站内绝对路径加上 base 前缀（供 head 标签使用，VitePress 不自动处理） */
function p(path: string) {
  return BASE.replace(/\/$/, '') + path
}

function normalizeRelativePath(relativePath: string): string {
  return relativePath.replace(/\\/g, '/').replace(/\.md$/, '')
}

function buildVerificationMetaTags() {
  const tags: any[] = []

  for (const item of VERIFICATION_META) {
    const value = process.env[item.env]
    if (value) {
      tags.push(['meta', { name: item.name, content: value }])
    }
  }

  const extra = process.env.SEO_VERIFICATION_EXTRA
  if (extra) {
    extra
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .forEach((entry) => {
        const [name, ...rest] = entry.split('=')
        const content = rest.join('=').trim()
        if (name && content) {
          tags.push(['meta', { name: name.trim(), content }])
        }
      })
  }

  return tags
}

function stripLocalePrefix(path: string): string {
  for (const locale of LOCALES) {
    if (!locale.prefix) continue
    if (path === locale.prefix) return ''
    if (path.startsWith(`${locale.prefix}/`)) {
      return path.slice(locale.prefix.length + 1)
    }
  }
  return path
}

function toRoutePath(path: string): string {
  if (!path || path === 'index') return '/'
  if (path.endsWith('/index')) return `/${path.slice(0, -'/index'.length)}/`
  return `/${path}`
}

function buildCanonical(relativePath: string): string {
  const normalized = normalizeRelativePath(relativePath)
  return `${SITE_URL}${toRoutePath(normalized)}`
}

function buildAlternate(relativePath: string, prefix: string): string {
  const normalized = normalizeRelativePath(relativePath)
  const basePath = stripLocalePrefix(normalized)
  const localizedPath = prefix ? `${prefix}/${basePath}` : basePath
  return `${SITE_URL}${toRoutePath(localizedPath)}`
}

function shouldIndexUrl(url: string): boolean {
  if (!url) return false
  return !/(^|\/)(README|CLAUDE)(\/|$)/i.test(url)
}

function stripFrontmatter(content: string): string {
  if (!content.startsWith('---')) return content
  const end = content.indexOf('\n---', 3)
  if (end === -1) return content
  return content.slice(end + '\n---'.length).replace(/^\s+/, '')
}

function extractDescriptionFromMarkdown(content: string): string | null {
  const withoutFrontmatter = stripFrontmatter(content)
  const withoutFences = withoutFrontmatter.replace(/```[\s\S]*?```/g, '')
  const withoutHtml = withoutFences.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '')
  const withoutImages = withoutHtml.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
  const withoutLinks = withoutImages.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  const withoutInlineCode = withoutLinks.replace(/`[^`]+`/g, '')

  const lines = withoutInlineCode
    .split('\n')
    .map((line) =>
      line
        .replace(/^\s*#{1,6}\s+/, '')
        .replace(/^\s*>+\s*/, '')
        .replace(/^\s*[-*+]\s+/, '')
        .replace(/^\s*\d+\.\s+/, '')
        .trim()
    )
    .filter(Boolean)

  if (lines.length === 0) return null

  const joined = lines.join(' ').replace(/\s+/g, ' ').trim()
  if (!joined) return null

  return joined.length > 160 ? `${joined.slice(0, 157)}...` : joined
}

function readPageSource(relativePath: string, filePath?: string): string | null {
  const candidates = [filePath, resolve(process.cwd(), relativePath)].filter(Boolean) as string[]
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFileSync(candidate, 'utf-8')
    }
  }
  return null
}

async function generateFeed(siteConfig: SiteConfig) {
  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESC,
    id: SITE_URL,
    link: SITE_URL,
    language: 'zh-CN',
    image: `${SITE_URL}/img/logo.jpg`,
    favicon: `${SITE_URL}/img/logo.svg`,
    copyright: `Copyright © ${new Date().getFullYear()} FishXCode`,
    updated: new Date(),
  })

  const pages = await createContentLoader('*.md', { excerpt: true, render: true }).load()

  for (const page of pages) {
    if (!page.url || page.url === '/' || !shouldIndexUrl(page.url)) continue
    const title = page.frontmatter?.title || page.url.replace(/^\/|\.html$/g, '')
    feed.addItem({
      title,
      id: `${SITE_URL}${page.url}`,
      link: `${SITE_URL}${page.url}`,
      description: page.excerpt || '',
      date: page.frontmatter?.lastUpdated ? new Date(page.frontmatter.lastUpdated) : new Date(),
    })
  }

  const outDir = siteConfig.outDir
  writeFileSync(resolve(outDir, 'feed.xml'), feed.rss2())
  writeFileSync(resolve(outDir, 'feed.atom'), feed.atom1())
}

export default withPwa(defineConfig({
  base: BASE,
  title: SITE_TITLE,
  description: SITE_DESC,
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: SITE_URL,
    transformItems: (items) => items.filter((item) => shouldIndexUrl(item.url ?? ''))
  },
  head: [
    ['link', { rel: 'icon', href: p('/img/logo.svg') }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'FishXCode RSS', href: p('/feed.xml') }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'FishXCode Atom', href: p('/feed.atom') }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'FishXCode' }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/img/logo.jpg` }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site', content: '@fishxcode' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}/img/logo.jpg` }],
  ],
  transformHead: (ctx) => {
    const relativePath = ctx.pageData?.relativePath ?? ''
    const canonical = ctx.pageData?.frontmatter?.canonical || (relativePath ? buildCanonical(relativePath) : SITE_URL)
    const title = ctx.pageData?.title || SITE_TITLE
    const description = ctx.pageData?.frontmatter?.description || ctx.pageData?.description || SITE_DESC

    const head: any[] = [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { name: 'description', content: description }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]

    if (relativePath) {
      for (const locale of LOCALES) {
        head.push([
          'link',
          { rel: 'alternate', hreflang: locale.lang, href: buildAlternate(relativePath, locale.prefix) },
        ])
      }
      head.push([
        'link',
        { rel: 'alternate', hreflang: 'x-default', href: buildAlternate(relativePath, '') },
      ])
    }

    if (VERIFICATION_META_TAGS.length > 0) {
      head.push(...VERIFICATION_META_TAGS)
    }

    return head
  },
  transformPageData: (pageData) => {
    if (pageData.frontmatter?.description || pageData.description) {
      return pageData
    }

    const relativePath = pageData.relativePath ?? ''
    if (!relativePath) return pageData

    const source = readPageSource(relativePath, (pageData as any).filePath)
    if (!source) return pageData

    const derived = extractDescriptionFromMarkdown(source)
    if (!derived) return pageData

    pageData.description = derived
    pageData.frontmatter = {
      ...pageData.frontmatter,
      description: derived,
    }
    return pageData
  },
  buildEnd: generateFeed,
  vite: {
    server: {
      proxy: {
        '/api/pricing': {
          target: 'https://fishxcode.com',
          changeOrigin: true
        }
      }
    },
    plugins: [
      groupIconVitePlugin()
    ]
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'FishXCode - AI Coding 中转站',
      short_name: 'FishXCode',
      description: SITE_DESC,
      theme_color: '#6366f1',
      icons: [
        { src: '/img/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,jpg,ico,txt,woff2}']
    }
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '快速开始', link: '/start' },
          {
            text: '订阅套餐',
            items: [
              { text: '套餐总览', link: '/subscription-plans' },
              { text: 'Claude', link: '/subscription-plans/claude' },
              { text: 'Codex', link: '/subscription-plans/codex' },
              { text: '按次套餐', link: '/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: '工具指南',
            items: [
              { text: 'Claude Code', link: '/start' },
              { text: 'Claude Desktop', link: '/claude-desktop' },
              { text: 'OpenAI Codex', link: '/codex' },
              { text: 'Cursor', link: '/cursor' },
              { text: 'RooCode', link: '/roocode' },
              { text: 'Qwen Code', link: '/qwencode' },
              { text: 'Droid CLI', link: '/droid' },
              { text: 'OpenCode', link: '/opencode' },
              { text: 'Hermes', link: '/hermes' },
              { text: 'OpenClaw', link: '/openclaw' },
              { text: 'WorkBuddy', link: '/workbuddy' },
              { text: 'CodeBuddy', link: '/codebuddy' },
              { text: 'QClaw', link: '/qclaw' }
            ]
          },
          {
            text: '更多',
            items: [
              {
                items: [
                  { text: '工具对比', link: '/compare' },
                  { text: '支持的模型', link: '/models' },
                  { text: '分组健康状态', link: '/group-health' },
                  { text: '错误日志说明', link: '/error-logs' },
                  { text: '常见问题', link: '/faq' },
                  { text: '更新日志', link: '/changelog' },
                  { text: '用户协议', link: '/terms' },
                  { text: '退款政策', link: '/refund' },
                  { text: '隐私政策', link: '/privacy' }
                ]
              },
              {
                text: '常用链接',
                items: [
                  { text: '控制台', link: 'https://fishxcode.com/console' },
                  { text: '服务状态', link: 'https://status.fishxcode.com' },
                  { text: '额度查询', link: 'https://api-key-tool.fishxcode.com' }
                ]
              }
            ]
          },
          { text: '立即注册', link: 'https://fishxcode.com/register?aff=9CTW' }
        ],
        sidebar: [
          {
            text: '快速开始',
            items: [
              { text: '账户注册', link: '/account' },
              { text: 'Claude Code', link: '/start' },
              { text: 'Claude Desktop', link: '/claude-desktop' },
              { text: 'ZCF 快速接入', link: '/zcf' },
              { text: 'OpenAI Codex', link: '/codex' },
              { text: 'Cursor', link: '/cursor' },
              { text: 'RooCode', link: '/roocode' },
              { text: 'Qwen Code', link: '/qwencode' },
              { text: 'Droid CLI', link: '/droid' },
              { text: 'OpenCode', link: '/opencode' },
              { text: 'Hermes', link: '/hermes' },
              { text: 'OpenClaw', link: '/openclaw' },
              { text: 'WorkBuddy', link: '/workbuddy' },
              { text: 'CodeBuddy', link: '/codebuddy' },
              { text: 'QClaw', link: '/qclaw' }
            ]
          },
          {
            text: '订阅套餐',
            items: [
              { text: '套餐总览', link: '/subscription-plans' },
              { text: 'Claude', link: '/subscription-plans/claude' },
              { text: 'Codex', link: '/subscription-plans/codex' },
              { text: '按次套餐', link: '/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: '参考',
            items: [
              { text: '平台导航', link: '/platform' },
              { text: '工具对比', link: '/compare' },
              { text: '支持的模型', link: '/models' },
              { text: '分组健康状态', link: '/group-health' },
              { text: '错误日志说明', link: '/error-logs' },
              { text: 'GPT-Image-2 绘图', link: '/gpt-image-2' },
              { text: '常见问题', link: '/faq' },
              { text: '更新日志', link: '/changelog' },
              { text: '用户协议', link: '/terms' },
              { text: '退款政策', link: '/refund' },
              { text: '隐私政策', link: '/privacy' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode/edit/main/:path',
          text: '在 GitHub 上编辑此页'
        },
        lastUpdated: {
          text: '最后更新于'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outline: {
          label: '页面导航',
          level: [2, 3]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Get Started', link: '/en/start' },
          {
            text: 'Subscription Plans',
            items: [
              { text: 'Overview', link: '/en/subscription-plans' },
              { text: 'Claude', link: '/en/subscription-plans/claude' },
              { text: 'Codex', link: '/en/subscription-plans/codex' },
              { text: 'By-number-of-times', link: '/en/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Tool Guides',
            items: [
              { text: 'Claude Code', link: '/en/start' },
              { text: 'Claude Desktop', link: '/en/claude-desktop' },
              { text: 'OpenAI Codex', link: '/en/codex' },
              { text: 'Cursor', link: '/en/cursor' },
              { text: 'RooCode', link: '/en/roocode' },
              { text: 'Qwen Code', link: '/en/qwencode' },
              { text: 'Droid CLI', link: '/en/droid' },
              { text: 'OpenCode', link: '/en/opencode' },
              { text: 'Hermes', link: '/en/hermes' },
              { text: 'OpenClaw', link: '/en/openclaw' },
              { text: 'WorkBuddy', link: '/en/workbuddy' },
              { text: 'CodeBuddy', link: '/en/codebuddy' },
              { text: 'QClaw', link: '/en/qclaw' }
            ]
          },
          {
            text: 'More',
            items: [
              {
                items: [
                  { text: 'Tool Comparison', link: '/en/compare' },
                  { text: 'Supported Models', link: '/en/models' },
                  { text: 'Group Health Status', link: '/en/group-health' },
                  { text: 'Error Logs', link: '/en/error-logs' },
                  { text: 'FAQ', link: '/en/faq' },
                  { text: 'Changelog', link: '/en/changelog' },
                  { text: 'Terms', link: '/en/terms' },
                  { text: 'Refund Policy', link: '/en/refund' },
                  { text: 'Privacy', link: '/en/privacy' }
                ]
              },
              {
                text: 'Quick Links',
                items: [
                  { text: 'Console', link: 'https://fishxcode.com/console' },
                  { text: 'Service Status', link: 'https://status.fishxcode.com' },
                  { text: 'Credit Balance', link: 'https://api-key-tool.fishxcode.com' }
                ]
              }
            ]
          },
          { text: 'Register Now', link: 'https://fishxcode.com/register?aff=9CTW' }
        ],
        sidebar: [
          {
            text: 'Get Started',
            items: [
              { text: 'Account Setup', link: '/en/account' },
              { text: 'Claude Code', link: '/en/start' },
              { text: 'Claude Desktop', link: '/en/claude-desktop' },
              { text: 'ZCF Quick Setup', link: '/en/zcf' },
              { text: 'OpenAI Codex', link: '/en/codex' },
              { text: 'Cursor', link: '/en/cursor' },
              { text: 'RooCode', link: '/en/roocode' },
              { text: 'Qwen Code', link: '/en/qwencode' },
              { text: 'Droid CLI', link: '/en/droid' },
              { text: 'OpenCode', link: '/en/opencode' },
              { text: 'Hermes', link: '/en/hermes' },
              { text: 'OpenClaw', link: '/en/openclaw' },
              { text: 'WorkBuddy', link: '/en/workbuddy' },
              { text: 'CodeBuddy', link: '/en/codebuddy' },
              { text: 'QClaw', link: '/en/qclaw' }
            ]
          },
          {
            text: 'Subscription Plans',
            items: [
              { text: 'Overview', link: '/en/subscription-plans' },
              { text: 'Claude', link: '/en/subscription-plans/claude' },
              { text: 'Codex', link: '/en/subscription-plans/codex' },
              { text: 'By-number-of-times', link: '/en/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Reference',
            items: [
              { text: 'Platform Guide', link: '/en/platform' },
              { text: 'Tool Comparison', link: '/en/compare' },
              { text: 'Supported Models', link: '/en/models' },
              { text: 'Group Health Status', link: '/en/group-health' },
              { text: 'Error Logs', link: '/en/error-logs' },
              { text: 'GPT-Image-2 Guide', link: '/en/gpt-image-2' },
              { text: 'FAQ', link: '/en/faq' },
              { text: 'Changelog', link: '/en/changelog' },
              { text: 'Terms', link: '/en/terms' },
              { text: 'Refund Policy', link: '/en/refund' },
              { text: 'Privacy', link: '/en/privacy' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode/edit/main/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdated: {
          text: 'Last updated'
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        outline: {
          label: 'On this page',
          level: [2, 3]
        }
      }
    },
    fr: {
      label: 'Français',
      lang: 'fr-FR',
      link: '/fr/',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Démarrage rapide', link: '/fr/start' },
          {
            text: 'Abonnements',
            items: [
              { text: 'Vue d’ensemble', link: '/fr/subscription-plans' },
              { text: 'Claude', link: '/fr/subscription-plans/claude' },
              { text: 'Codex', link: '/fr/subscription-plans/codex' },
              { text: 'Nombre de requêtes', link: '/fr/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Guide des outils',
            items: [
              { text: 'Claude Code', link: '/fr/start' },
              { text: 'Claude Desktop', link: '/fr/claude-desktop' },
              { text: 'OpenAI Codex', link: '/fr/codex' },
              { text: 'Cursor', link: '/fr/cursor' },
              { text: 'RooCode', link: '/fr/roocode' },
              { text: 'Qwen Code', link: '/fr/qwencode' },
              { text: 'Droid CLI', link: '/fr/droid' },
              { text: 'OpenCode', link: '/fr/opencode' },
              { text: 'Hermes', link: '/fr/hermes' },
              { text: 'OpenClaw', link: '/fr/openclaw' },
              { text: 'WorkBuddy', link: '/fr/workbuddy' },
              { text: 'CodeBuddy', link: '/fr/codebuddy' },
              { text: 'QClaw', link: '/fr/qclaw' }
            ]
          },
          {
            text: 'Plus',
            items: [
              {
                items: [
                  { text: 'Comparaison des outils', link: '/fr/compare' },
                  { text: 'Modèles supportés', link: '/fr/models' },
                  { text: 'Etat de sante des groupes', link: '/fr/group-health' },
                  { text: "Journaux d'erreur", link: '/fr/error-logs' },
                  { text: 'FAQ', link: '/fr/faq' },
                  { text: 'Journal des modifications', link: '/fr/changelog' },
                  { text: 'Conditions', link: '/fr/terms' },
                  { text: 'Remboursement', link: '/fr/refund' },
                  { text: 'Confidentialité', link: '/fr/privacy' }
                ]
              },
              {
                text: 'Liens utiles',
                items: [
                  { text: 'Console', link: 'https://fishxcode.com/console' },
                  { text: 'État du service', link: 'https://status.fishxcode.com' },
                  { text: 'Vérifier le solde', link: 'https://api-key-tool.fishxcode.com' }
                ]
              }
            ]
          },
          { text: "S'inscrire", link: 'https://fishxcode.com/register?aff=9CTW' }
        ],
        sidebar: [
          {
            text: 'Démarrage rapide',
            items: [
              { text: 'Création de compte', link: '/fr/account' },
              { text: 'Claude Code', link: '/fr/start' },
              { text: 'Claude Desktop', link: '/fr/claude-desktop' },
              { text: 'ZCF Configuration', link: '/fr/zcf' },
              { text: 'OpenAI Codex', link: '/fr/codex' },
              { text: 'Cursor', link: '/fr/cursor' },
              { text: 'RooCode', link: '/fr/roocode' },
              { text: 'Qwen Code', link: '/fr/qwencode' },
              { text: 'Droid CLI', link: '/fr/droid' },
              { text: 'OpenCode', link: '/fr/opencode' },
              { text: 'Hermes', link: '/fr/hermes' },
              { text: 'OpenClaw', link: '/fr/openclaw' },
              { text: 'WorkBuddy', link: '/fr/workbuddy' },
              { text: 'CodeBuddy', link: '/fr/codebuddy' },
              { text: 'QClaw', link: '/fr/qclaw' }
            ]
          },
          {
            text: 'Abonnements',
            items: [
              { text: 'Vue d’ensemble', link: '/fr/subscription-plans' },
              { text: 'Claude', link: '/fr/subscription-plans/claude' },
              { text: 'Codex', link: '/fr/subscription-plans/codex' },
              { text: 'Nombre de requêtes', link: '/fr/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Référence',
            items: [
              { text: 'Guide plateforme', link: '/fr/platform' },
              { text: 'Comparaison des outils', link: '/fr/compare' },
              { text: 'Modèles supportés', link: '/fr/models' },
              { text: 'Etat de sante des groupes', link: '/fr/group-health' },
              { text: "Journaux d'erreur", link: '/fr/error-logs' },
              { text: 'Guide GPT-Image-2', link: '/fr/gpt-image-2' },
              { text: 'FAQ', link: '/fr/faq' },
              { text: 'Journal des modifications', link: '/fr/changelog' },
              { text: 'Conditions', link: '/fr/terms' },
              { text: 'Remboursement', link: '/fr/refund' },
              { text: 'Confidentialité', link: '/fr/privacy' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode/edit/main/:path',
          text: 'Modifier cette page sur GitHub'
        },
        lastUpdated: {
          text: 'Dernière mise à jour'
        },
        docFooter: {
          prev: 'Page précédente',
          next: 'Page suivante'
        },
        outline: {
          label: 'Sur cette page',
          level: [2, 3]
        }
      }
    },
    es: {
      label: 'Español',
      lang: 'es-ES',
      link: '/es/',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Comenzar', link: '/es/start' },
          {
            text: 'Suscripciones',
            items: [
              { text: 'Resumen', link: '/es/subscription-plans' },
              { text: 'Claude', link: '/es/subscription-plans/claude' },
              { text: 'Codex', link: '/es/subscription-plans/codex' },
              { text: 'Por número de veces', link: '/es/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Guía de herramientas',
            items: [
              { text: 'Claude Code', link: '/es/start' },
              { text: 'Claude Desktop', link: '/es/claude-desktop' },
              { text: 'OpenAI Codex', link: '/es/codex' },
              { text: 'Cursor', link: '/es/cursor' },
              { text: 'RooCode', link: '/es/roocode' },
              { text: 'Qwen Code', link: '/es/qwencode' },
              { text: 'Droid CLI', link: '/es/droid' },
              { text: 'OpenCode', link: '/es/opencode' },
              { text: 'Hermes', link: '/es/hermes' },
              { text: 'OpenClaw', link: '/es/openclaw' },
              { text: 'WorkBuddy', link: '/es/workbuddy' },
              { text: 'CodeBuddy', link: '/es/codebuddy' },
              { text: 'QClaw', link: '/es/qclaw' }
            ]
          },
          {
            text: 'Más',
            items: [
              {
                items: [
                  { text: 'Comparación de herramientas', link: '/es/compare' },
                  { text: 'Modelos soportados', link: '/es/models' },
                  { text: 'Estado de salud de grupos', link: '/es/group-health' },
                  { text: 'Registros de error', link: '/es/error-logs' },
                  { text: 'Preguntas frecuentes', link: '/es/faq' },
                  { text: 'Registro de cambios', link: '/es/changelog' },
                  { text: 'Términos', link: '/es/terms' },
                  { text: 'Reembolso', link: '/es/refund' },
                  { text: 'Privacidad', link: '/es/privacy' }
                ]
              },
              {
                text: 'Enlaces útiles',
                items: [
                  { text: 'Consola', link: 'https://fishxcode.com/console' },
                  { text: 'Estado del servicio', link: 'https://status.fishxcode.com' },
                  { text: 'Consultar saldo', link: 'https://api-key-tool.fishxcode.com' }
                ]
              }
            ]
          },
          { text: 'Registrarse', link: 'https://fishxcode.com/register?aff=9CTW' }
        ],
        sidebar: [
          {
            text: 'Comenzar',
            items: [
              { text: 'Registro de cuenta', link: '/es/account' },
              { text: 'Claude Code', link: '/es/start' },
              { text: 'Claude Desktop', link: '/es/claude-desktop' },
              { text: 'ZCF Configuración', link: '/es/zcf' },
              { text: 'OpenAI Codex', link: '/es/codex' },
              { text: 'Cursor', link: '/es/cursor' },
              { text: 'RooCode', link: '/es/roocode' },
              { text: 'Qwen Code', link: '/es/qwencode' },
              { text: 'Droid CLI', link: '/es/droid' },
              { text: 'OpenCode', link: '/es/opencode' },
              { text: 'Hermes', link: '/es/hermes' },
              { text: 'OpenClaw', link: '/es/openclaw' },
              { text: 'WorkBuddy', link: '/es/workbuddy' },
              { text: 'CodeBuddy', link: '/es/codebuddy' },
              { text: 'QClaw', link: '/es/qclaw' }
            ]
          },
          {
            text: 'Suscripciones',
            items: [
              { text: 'Resumen', link: '/es/subscription-plans' },
              { text: 'Claude', link: '/es/subscription-plans/claude' },
              { text: 'Codex', link: '/es/subscription-plans/codex' },
              { text: 'Por número de veces', link: '/es/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Referencia',
            items: [
              { text: 'Guía de plataforma', link: '/es/platform' },
              { text: 'Comparación de herramientas', link: '/es/compare' },
              { text: 'Modelos soportados', link: '/es/models' },
              { text: 'Estado de salud de grupos', link: '/es/group-health' },
              { text: 'Registros de error', link: '/es/error-logs' },
              { text: 'Guía GPT-Image-2', link: '/es/gpt-image-2' },
              { text: 'Preguntas frecuentes', link: '/es/faq' },
              { text: 'Registro de cambios', link: '/es/changelog' },
              { text: 'Términos', link: '/es/terms' },
              { text: 'Reembolso', link: '/es/refund' },
              { text: 'Privacidad', link: '/es/privacy' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode/edit/main/:path',
          text: 'Editar esta página en GitHub'
        },
        lastUpdated: {
          text: 'Última actualización'
        },
        docFooter: {
          prev: 'Página anterior',
          next: 'Página siguiente'
        },
        outline: {
          label: 'En esta página',
          level: [2, 3]
        }
      }
    },
    pt: {
      label: 'Português',
      lang: 'pt-BR',
      link: '/pt/',
      themeConfig: {
        nav: [
          { text: 'Início', link: '/pt/' },
          { text: 'Começar', link: '/pt/start' },
          {
            text: 'Assinaturas',
            items: [
              { text: 'Visão geral', link: '/pt/subscription-plans' },
              { text: 'Claude', link: '/pt/subscription-plans/claude' },
              { text: 'Codex', link: '/pt/subscription-plans/codex' },
              { text: 'Por número de vezes', link: '/pt/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Guias de ferramentas',
            items: [
              { text: 'Claude Code', link: '/pt/start' },
              { text: 'Claude Desktop', link: '/pt/claude-desktop' },
              { text: 'OpenAI Codex', link: '/pt/codex' },
              { text: 'Cursor', link: '/pt/cursor' },
              { text: 'RooCode', link: '/pt/roocode' },
              { text: 'Qwen Code', link: '/pt/qwencode' },
              { text: 'Droid CLI', link: '/pt/droid' },
              { text: 'OpenCode', link: '/pt/opencode' },
              { text: 'Hermes', link: '/pt/hermes' },
              { text: 'OpenClaw', link: '/pt/openclaw' },
              { text: 'WorkBuddy', link: '/pt/workbuddy' },
              { text: 'CodeBuddy', link: '/pt/codebuddy' },
              { text: 'QClaw', link: '/pt/qclaw' }
            ]
          },
          {
            text: 'Mais',
            items: [
              {
                items: [
                  { text: 'Comparação de ferramentas', link: '/pt/compare' },
                  { text: 'Modelos suportados', link: '/pt/models' },
                  { text: 'Status de saude dos grupos', link: '/pt/group-health' },
                  { text: 'Logs de erro', link: '/pt/error-logs' },
                  { text: 'Perguntas frequentes', link: '/pt/faq' },
                  { text: 'Registro de alterações', link: '/pt/changelog' },
                  { text: 'Termos', link: '/pt/terms' },
                  { text: 'Reembolso', link: '/pt/refund' },
                  { text: 'Privacidade', link: '/pt/privacy' }
                ]
              },
              {
                text: 'Links úteis',
                items: [
                  { text: 'Console', link: 'https://fishxcode.com/console' },
                  { text: 'Status do serviço', link: 'https://status.fishxcode.com' },
                  { text: 'Verificar saldo', link: 'https://api-key-tool.fishxcode.com' }
                ]
              }
            ]
          },
          { text: 'Registrar', link: 'https://fishxcode.com/register?aff=9CTW' }
        ],
        sidebar: [
          {
            text: 'Começar',
            items: [
              { text: 'Configuração de conta', link: '/pt/account' },
              { text: 'Claude Code', link: '/pt/start' },
              { text: 'Claude Desktop', link: '/pt/claude-desktop' },
              { text: 'ZCF Configuração', link: '/pt/zcf' },
              { text: 'OpenAI Codex', link: '/pt/codex' },
              { text: 'Cursor', link: '/pt/cursor' },
              { text: 'RooCode', link: '/pt/roocode' },
              { text: 'Qwen Code', link: '/pt/qwencode' },
              { text: 'Droid CLI', link: '/pt/droid' },
              { text: 'OpenCode', link: '/pt/opencode' },
              { text: 'Hermes', link: '/pt/hermes' },
              { text: 'OpenClaw', link: '/pt/openclaw' },
              { text: 'WorkBuddy', link: '/pt/workbuddy' },
              { text: 'CodeBuddy', link: '/pt/codebuddy' },
              { text: 'QClaw', link: '/pt/qclaw' }
            ]
          },
          {
            text: 'Assinaturas',
            items: [
              { text: 'Visão geral', link: '/pt/subscription-plans' },
              { text: 'Claude', link: '/pt/subscription-plans/claude' },
              { text: 'Codex', link: '/pt/subscription-plans/codex' },
              { text: 'Por número de vezes', link: '/pt/subscription-plans/by-number-of-times' }
            ]
          },
          {
            text: 'Referência',
            items: [
              { text: 'Guia da plataforma', link: '/pt/platform' },
              { text: 'Comparação de ferramentas', link: '/pt/compare' },
              { text: 'Modelos suportados', link: '/pt/models' },
              { text: 'Status de saude dos grupos', link: '/pt/group-health' },
              { text: 'Logs de erro', link: '/pt/error-logs' },
              { text: 'Guia GPT-Image-2', link: '/pt/gpt-image-2' },
              { text: 'Perguntas frequentes', link: '/pt/faq' },
              { text: 'Registro de alterações', link: '/pt/changelog' },
              { text: 'Termos', link: '/pt/terms' },
              { text: 'Reembolso', link: '/pt/refund' },
              { text: 'Privacidade', link: '/pt/privacy' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode/edit/main/:path',
          text: 'Editar esta página no GitHub'
        },
        lastUpdated: {
          text: 'Última atualização'
        },
        docFooter: {
          prev: 'Página anterior',
          next: 'Próxima página'
        },
        outline: {
          label: 'Nesta página',
          level: [2, 3]
        }
      }
    }
  },
  themeConfig: {
    logo: '/img/logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          },
          fr: {
            translations: {
              button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher' },
              modal: {
                noResultsText: 'Aucun résultat trouvé',
                resetButtonTitle: 'Réinitialiser la recherche',
                footer: { selectText: 'Sélectionner', navigateText: 'Naviguer', closeText: 'Fermer' }
              }
            }
          },
          es: {
            translations: {
              button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
              modal: {
                noResultsText: 'No se encontraron resultados',
                resetButtonTitle: 'Restablecer búsqueda',
                footer: { selectText: 'Seleccionar', navigateText: 'Navegar', closeText: 'Cerrar' }
              }
            }
          },
          pt: {
            translations: {
              button: { buttonText: 'Pesquisar', buttonAriaLabel: 'Pesquisar' },
              modal: {
                noResultsText: 'Nenhum resultado encontrado',
                resetButtonTitle: 'Limpar pesquisa',
                footer: { selectText: 'Selecionar', navigateText: 'Navegar', closeText: 'Fechar' }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'x', link: 'https://x.com/fishxcode' },
      { icon: 'github', link: 'https://github.com/fishxcode' }
    ],
    footer: {
      message: '<a href="https://fishxcode.com" target="_blank">主站</a> | <a href="https://doc.fishxcode.com/feed.xml" target="_blank">RSS</a> | <a href="https://doc.fishxcode.com/feed.atom" target="_blank">Atom</a> | <a href="https://doc.fishxcode.com/sitemap.xml" target="_blank">Sitemap</a> | <a href="https://github.com/fishxcode" target="_blank">GitHub</a>',
      copyright: `Copyright © ${new Date().getFullYear()} FishXCode`
    }
  }
}))
