import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { Feed } from 'feed'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const SITE_URL = 'https://doc.fishxcode.com'
const SITE_TITLE = 'FishXCode'
const SITE_DESC = 'AI Coding 中转站 - 支持 Claude、Codex、Gemini 模型在多种平台使用'

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
    if (!page.url || page.url === '/') continue
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
  title: SITE_TITLE,
  description: SITE_DESC,
  lastUpdated: true,
  sitemap: {
    hostname: SITE_URL
  },
  head: [
    ['link', { rel: 'icon', href: '/img/logo.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'FishXCode RSS', href: '/feed.xml' }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'FishXCode Atom', href: '/feed.atom' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'FishXCode' }],
    ['meta', { property: 'og:title', content: 'FishXCode - AI Coding 中转站' }],
    ['meta', { property: 'og:description', content: SITE_DESC }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/img/logo.jpg` }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site', content: '@fishxcode' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}/img/logo.jpg` }],
  ],
  buildEnd: generateFeed,
  vite: {
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
            text: '工具指南',
            items: [
              { text: 'Claude Code', link: '/start' },
              { text: 'OpenAI Codex', link: '/codex' },
              { text: 'Gemini Cli', link: '/gemini' },
              { text: 'RooCode', link: '/roocode' },
              { text: 'Qwen Code', link: '/qwencode' },
              { text: 'Droid CLI', link: '/droid' },
              { text: 'OpenCode', link: '/opencode' },
              { text: 'OpenClaw', link: '/openclaw' }
            ]
          },
          {
            text: '更多',
            items: [
              {
                items: [
                  { text: '工具对比', link: '/compare' },
                  { text: '支持的模型', link: '/models' },
                  { text: '常见问题', link: '/faq' },
                  { text: '更新日志', link: '/changelog' },
                  { text: '社区公告', link: '/announcement' },
                  { text: '用户协议', link: '/terms' },
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
              { text: 'Claude Code', link: '/start' },
              { text: 'OpenAI Codex', link: '/codex' },
              { text: 'Gemini Cli', link: '/gemini' },
              { text: 'RooCode', link: '/roocode' },
              { text: 'Qwen Code', link: '/qwencode' },
              { text: 'Droid CLI', link: '/droid' },
              { text: 'OpenCode', link: '/opencode' },
              { text: 'OpenClaw', link: '/openclaw' }
            ]
          },
          {
            text: '参考',
            items: [
              { text: '工具对比', link: '/compare' },
              { text: '支持的模型', link: '/models' },
              { text: '常见问题', link: '/faq' },
              { text: '更新日志', link: '/changelog' },
              { text: '社区公告', link: '/announcement' },
              { text: '用户协议', link: '/terms' },
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
          label: '页面导航'
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
            text: 'Tool Guides',
            items: [
              { text: 'Claude Code', link: '/en/start' },
              { text: 'OpenAI Codex', link: '/en/codex' },
              { text: 'Gemini Cli', link: '/en/gemini' },
              { text: 'RooCode', link: '/en/roocode' },
              { text: 'Qwen Code', link: '/en/qwencode' },
              { text: 'Droid CLI', link: '/en/droid' },
              { text: 'OpenCode', link: '/en/opencode' },
              { text: 'OpenClaw', link: '/en/openclaw' }
            ]
          },
          {
            text: 'More',
            items: [
              {
                items: [
                  { text: 'Tool Comparison', link: '/en/compare' },
                  { text: 'Supported Models', link: '/en/models' },
                  { text: 'FAQ', link: '/en/faq' },
                  { text: 'Changelog', link: '/en/changelog' },
                  { text: 'Announcement', link: '/en/announcement' },
                  { text: 'Terms', link: '/en/terms' },
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
              { text: 'Claude Code', link: '/en/start' },
              { text: 'OpenAI Codex', link: '/en/codex' },
              { text: 'Gemini Cli', link: '/en/gemini' },
              { text: 'RooCode', link: '/en/roocode' },
              { text: 'Qwen Code', link: '/en/qwencode' },
              { text: 'Droid CLI', link: '/en/droid' },
              { text: 'OpenCode', link: '/en/opencode' },
              { text: 'OpenClaw', link: '/en/openclaw' }
            ]
          },
          {
            text: 'Reference',
            items: [
              { text: 'Tool Comparison', link: '/en/compare' },
              { text: 'Supported Models', link: '/en/models' },
              { text: 'FAQ', link: '/en/faq' },
              { text: 'Changelog', link: '/en/changelog' },
              { text: 'Announcement', link: '/en/announcement' },
              { text: 'Terms', link: '/en/terms' },
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
          label: 'On this page'
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
            text: 'Guide des outils',
            items: [
              { text: 'Claude Code', link: '/fr/start' },
              { text: 'OpenAI Codex', link: '/fr/codex' },
              { text: 'Gemini Cli', link: '/fr/gemini' },
              { text: 'RooCode', link: '/fr/roocode' },
              { text: 'Qwen Code', link: '/fr/qwencode' },
              { text: 'Droid CLI', link: '/fr/droid' },
              { text: 'OpenCode', link: '/fr/opencode' },
              { text: 'OpenClaw', link: '/fr/openclaw' }
            ]
          },
          {
            text: 'Plus',
            items: [
              {
                items: [
                  { text: 'Comparaison des outils', link: '/fr/compare' },
                  { text: 'Modèles supportés', link: '/fr/models' },
                  { text: 'FAQ', link: '/fr/faq' },
                  { text: 'Journal des modifications', link: '/fr/changelog' },
                  { text: 'Annonce', link: '/fr/announcement' },
                  { text: 'Conditions', link: '/fr/terms' },
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
              { text: 'Claude Code', link: '/fr/start' },
              { text: 'OpenAI Codex', link: '/fr/codex' },
              { text: 'Gemini Cli', link: '/fr/gemini' },
              { text: 'RooCode', link: '/fr/roocode' },
              { text: 'Qwen Code', link: '/fr/qwencode' },
              { text: 'Droid CLI', link: '/fr/droid' },
              { text: 'OpenCode', link: '/fr/opencode' },
              { text: 'OpenClaw', link: '/fr/openclaw' }
            ]
          },
          {
            text: 'Référence',
            items: [
              { text: 'Comparaison des outils', link: '/fr/compare' },
              { text: 'Modèles supportés', link: '/fr/models' },
              { text: 'FAQ', link: '/fr/faq' },
              { text: 'Journal des modifications', link: '/fr/changelog' },
              { text: 'Annonce', link: '/fr/announcement' },
              { text: 'Conditions', link: '/fr/terms' },
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
          label: 'Sur cette page'
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
            text: 'Guía de herramientas',
            items: [
              { text: 'Claude Code', link: '/es/start' },
              { text: 'OpenAI Codex', link: '/es/codex' },
              { text: 'Gemini Cli', link: '/es/gemini' },
              { text: 'RooCode', link: '/es/roocode' },
              { text: 'Qwen Code', link: '/es/qwencode' },
              { text: 'Droid CLI', link: '/es/droid' },
              { text: 'OpenCode', link: '/es/opencode' },
              { text: 'OpenClaw', link: '/es/openclaw' }
            ]
          },
          {
            text: 'Más',
            items: [
              {
                items: [
                  { text: 'Comparación de herramientas', link: '/es/compare' },
                  { text: 'Modelos soportados', link: '/es/models' },
                  { text: 'Preguntas frecuentes', link: '/es/faq' },
                  { text: 'Registro de cambios', link: '/es/changelog' },
                  { text: 'Anuncio', link: '/es/announcement' },
                  { text: 'Términos', link: '/es/terms' },
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
              { text: 'Claude Code', link: '/es/start' },
              { text: 'OpenAI Codex', link: '/es/codex' },
              { text: 'Gemini Cli', link: '/es/gemini' },
              { text: 'RooCode', link: '/es/roocode' },
              { text: 'Qwen Code', link: '/es/qwencode' },
              { text: 'Droid CLI', link: '/es/droid' },
              { text: 'OpenCode', link: '/es/opencode' },
              { text: 'OpenClaw', link: '/es/openclaw' }
            ]
          },
          {
            text: 'Referencia',
            items: [
              { text: 'Comparación de herramientas', link: '/es/compare' },
              { text: 'Modelos soportados', link: '/es/models' },
              { text: 'Preguntas frecuentes', link: '/es/faq' },
              { text: 'Registro de cambios', link: '/es/changelog' },
              { text: 'Anuncio', link: '/es/announcement' },
              { text: 'Términos', link: '/es/terms' },
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
          label: 'En esta página'
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
            text: 'Guias de ferramentas',
            items: [
              { text: 'Claude Code', link: '/pt/start' },
              { text: 'OpenAI Codex', link: '/pt/codex' },
              { text: 'Gemini Cli', link: '/pt/gemini' },
              { text: 'RooCode', link: '/pt/roocode' },
              { text: 'Qwen Code', link: '/pt/qwencode' },
              { text: 'Droid CLI', link: '/pt/droid' },
              { text: 'OpenCode', link: '/pt/opencode' },
              { text: 'OpenClaw', link: '/pt/openclaw' }
            ]
          },
          {
            text: 'Mais',
            items: [
              {
                items: [
                  { text: 'Comparação de ferramentas', link: '/pt/compare' },
                  { text: 'Modelos suportados', link: '/pt/models' },
                  { text: 'Perguntas frequentes', link: '/pt/faq' },
                  { text: 'Registro de alterações', link: '/pt/changelog' },
                  { text: 'Comunicado', link: '/pt/announcement' },
                  { text: 'Termos', link: '/pt/terms' },
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
              { text: 'Claude Code', link: '/pt/start' },
              { text: 'OpenAI Codex', link: '/pt/codex' },
              { text: 'Gemini Cli', link: '/pt/gemini' },
              { text: 'RooCode', link: '/pt/roocode' },
              { text: 'Qwen Code', link: '/pt/qwencode' },
              { text: 'Droid CLI', link: '/pt/droid' },
              { text: 'OpenCode', link: '/pt/opencode' },
              { text: 'OpenClaw', link: '/pt/openclaw' }
            ]
          },
          {
            text: 'Referência',
            items: [
              { text: 'Comparação de ferramentas', link: '/pt/compare' },
              { text: 'Modelos suportados', link: '/pt/models' },
              { text: 'Perguntas frequentes', link: '/pt/faq' },
              { text: 'Registro de alterações', link: '/pt/changelog' },
              { text: 'Comunicado', link: '/pt/announcement' },
              { text: 'Termos', link: '/pt/terms' },
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
          label: 'Nesta página'
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
