<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { PAGE_ACTION_CONFIG } from '../config/page-actions'
import { isDocPath, isHomePath, resolvePageActionContext, toLocale } from '../utils/pageContext'

const route = useRoute()
const { lang } = useData()

const menuOpen = ref(false)
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer: number | null = null

const I18N: Record<string, Record<string, string>> = {
  'zh-CN': {
    copyMarkdown: '复制 Markdown',
    open: '打开',
    copyRawMd: '复制原始 md',
    copyArticleLink: '复制文章链接',
    openInGithub: '在 GitHub 中打开',
    openInChatClaude: '在 ChatClaude 中打开',
    openInClaude: '在 Claude 中打开',
    openInSciraAI: '在 Scira AI 中打开',
    openInT3Chat: '在 T3 Chat 中打开',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    linkUnavailable: '链接不可用',
  },
  'en-US': {
    copyMarkdown: 'Copy Markdown',
    open: 'Open',
    copyRawMd: 'Copy Raw md',
    copyArticleLink: 'Copy Article Link',
    openInGithub: 'Open in GitHub',
    openInChatClaude: 'Open in ChatClaude',
    openInClaude: 'Open in Claude',
    openInSciraAI: 'Open in Scira AI',
    openInT3Chat: 'Open in T3 Chat',
    copySuccess: 'Copied',
    copyFailed: 'Copy failed',
    linkUnavailable: 'Link unavailable',
  },
  'fr-FR': {
    copyMarkdown: 'Copier le Markdown',
    open: 'Ouvrir',
    copyRawMd: 'Copier le md brut',
    copyArticleLink: "Copier le lien de l'article",
    openInGithub: 'Ouvrir dans GitHub',
    openInChatClaude: 'Ouvrir dans ChatClaude',
    openInClaude: 'Ouvrir dans Claude',
    openInSciraAI: 'Ouvrir dans Scira AI',
    openInT3Chat: 'Ouvrir dans T3 Chat',
    copySuccess: 'Copié',
    copyFailed: 'Échec de la copie',
    linkUnavailable: 'Lien indisponible',
  },
  'es-ES': {
    copyMarkdown: 'Copiar Markdown',
    open: 'Abrir',
    copyRawMd: 'Copiar md original',
    copyArticleLink: 'Copiar enlace del artículo',
    openInGithub: 'Abrir en GitHub',
    openInChatClaude: 'Abrir en ChatClaude',
    openInClaude: 'Abrir en Claude',
    openInSciraAI: 'Abrir en Scira AI',
    openInT3Chat: 'Abrir en T3 Chat',
    copySuccess: 'Copiado',
    copyFailed: 'Error al copiar',
    linkUnavailable: 'Enlace no disponible',
  },
  'pt-BR': {
    copyMarkdown: 'Copiar Markdown',
    open: 'Abrir',
    copyRawMd: 'Copiar md bruto',
    copyArticleLink: 'Copiar link do artigo',
    openInGithub: 'Abrir no GitHub',
    openInChatClaude: 'Abrir no ChatClaude',
    openInClaude: 'Abrir no Claude',
    openInSciraAI: 'Abrir no Scira AI',
    openInT3Chat: 'Abrir no T3 Chat',
    copySuccess: 'Copiado',
    copyFailed: 'Falha ao copiar',
    linkUnavailable: 'Link indisponível',
  },
}

const currentLang = computed(() => lang.value || toLocale(route.path))
const t = computed(() => I18N[currentLang.value] ?? I18N['zh-CN'])
const ctx = computed(() => resolvePageActionContext(route.path))
const isVisible = computed(() => isDocPath(route.path) && !isHomePath(route.path))

const platformEntries = computed(() => {
  return PAGE_ACTION_CONFIG.platforms
    .filter((platform) => platform.enabled)
    .map((platform) => {
      const href = platform.urlBuilder(ctx.value)
      const label = platform.labelByLocale?.[currentLang.value as keyof typeof platform.labelByLocale] ??
        (platform.labelI18nKey ? t.value[platform.labelI18nKey] : '')

      if (!href || !label) return null

      return {
        id: platform.id,
        href,
        label,
      }
    })
    .filter((entry): entry is { id: string; href: string; label: string } => !!entry)
})

function showToast(message: string) {
  toastMessage.value = message
  toastVisible.value = true

  if (toastTimer) {
    window.clearTimeout(toastTimer)
  }

  toastTimer = window.setTimeout(() => {
    toastVisible.value = false
  }, 1600)
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    } catch {
      return false
    }
  }
}

function markdownFromVpDoc(): string {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return ''

  const lines: string[] = []

  Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, pre code, blockquote')).forEach((node) => {
    if (node.tagName.startsWith('H')) {
      const level = Number(node.tagName[1])
      lines.push(`${'#'.repeat(level)} ${node.textContent?.trim() ?? ''}`)
      return
    }

    if (node.tagName === 'P') {
      let text = ''
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName === 'A') {
          const a = child as HTMLAnchorElement
          text += `[${a.textContent?.trim() ?? ''}](${a.href})`
        } else {
          text += child.textContent ?? ''
        }
      })
      if (text.trim()) lines.push(text.trim())
      return
    }

    if (node.tagName === 'UL' || node.tagName === 'OL') {
      const items = Array.from(node.querySelectorAll(':scope > li'))
      items.forEach((li, index) => {
        const marker = node.tagName === 'OL' ? `${index + 1}.` : '-'
        lines.push(`${marker} ${li.textContent?.trim() ?? ''}`)
      })
      return
    }

    if (node.tagName === 'PRE' || node.tagName === 'CODE') {
      const code = (node.textContent ?? '').replace(/\n+$/, '')
      if (code.trim()) {
        lines.push('```')
        lines.push(code)
        lines.push('```')
      }
      return
    }

    if (node.tagName === 'BLOCKQUOTE') {
      const text = node.textContent?.trim() ?? ''
      if (text) lines.push(`> ${text}`)
    }
  })

  return lines.join('\n\n').trim()
}

async function handleCopyMarkdown() {
  const markdown = markdownFromVpDoc()
  if (!markdown) {
    showToast(t.value.copyFailed)
    return
  }

  const ok = await copyText(markdown)
  showToast(ok ? t.value.copySuccess : t.value.copyFailed)
}

async function handleCopyRawMd() {
  if (!PAGE_ACTION_CONFIG.copyOptions.copyRawMd || !ctx.value.githubRawMdUrl) {
    showToast(t.value.linkUnavailable)
    return
  }

  try {
    const response = await fetch(ctx.value.githubRawMdUrl)
    if (!response.ok) {
      showToast(t.value.copyFailed)
      return
    }

    const raw = await response.text()
    const ok = await copyText(raw)
    showToast(ok ? t.value.copySuccess : t.value.copyFailed)
  } catch {
    showToast(t.value.copyFailed)
  }
}

async function handleCopyArticleLink() {
  if (!PAGE_ACTION_CONFIG.copyOptions.copyArticleLink) return
  const ok = await copyText(ctx.value.preferredReadUrl)
  showToast(ok ? t.value.copySuccess : t.value.copyFailed)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onDocumentClick(event: MouseEvent) {
  const root = document.querySelector('.page-action-bar')
  if (!root) return
  if (!root.contains(event.target as Node)) {
    closeMenu()
  }
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onEscape)
  if (toastTimer) window.clearTimeout(toastTimer)
})
</script>

<template>
  <div v-if="isVisible" class="page-action-bar">
    <div class="button-group">
      <button class="btn btn-main" type="button" @click="handleCopyMarkdown">
        {{ t.copyMarkdown }}
      </button>
      <button
        class="btn btn-sub"
        type="button"
        aria-haspopup="menu"
        :aria-expanded="String(menuOpen)"
        @click="toggleMenu"
      >
        {{ t.open }}
      </button>
    </div>

    <div v-if="menuOpen" class="dropdown" role="menu">
      <button
        class="menu-item"
        :class="{ 'is-disabled': !ctx.githubRawMdUrl }"
        :disabled="!ctx.githubRawMdUrl"
        type="button"
        role="menuitem"
        @click="handleCopyRawMd"
      >
        {{ t.copyRawMd }}
      </button>
      <button class="menu-item" type="button" role="menuitem" @click="handleCopyArticleLink">
        {{ t.copyArticleLink }}
      </button>
      <a
        v-for="entry in platformEntries"
        :key="entry.id"
        class="menu-item"
        role="menuitem"
        :href="entry.href"
        target="_blank"
        rel="noreferrer noopener"
      >
        {{ entry.label }}
      </a>
    </div>

    <Transition name="fade">
      <div v-if="toastVisible" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.page-action-bar {
  position: relative;
  margin: 16px 0 20px;
}

.button-group {
  display: inline-flex;
  gap: 8px;
}

.btn {
  height: 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.btn:hover {
  border-color: var(--vp-c-brand-2);
}

.btn-main {
  min-width: 156px;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 260px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
  z-index: 20;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  text-align: left;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.menu-item:hover {
  background: var(--vp-c-bg-soft);
}

.menu-item.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-item.is-disabled:hover {
  background: transparent;
}

.toast {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--vp-c-brand-2);
  color: #fff;
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
