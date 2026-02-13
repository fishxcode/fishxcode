<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(defineProps<{
  storageKey?: string
}>(), {
  storageKey: 'announcement-dismissed'
})

const I18N: Record<string, { text: string; linkText: string }> = {
  'zh-CN': { text: '欢迎使用 FishXCode — AI Coding 中转站', linkText: '立即注册' },
  'en-US': { text: 'Welcome to FishXCode — AI Coding Relay', linkText: 'Register Now' },
  'fr-FR': { text: 'Bienvenue sur FishXCode — Relais AI Coding', linkText: "S'inscrire" },
  'es-ES': { text: 'Bienvenido a FishXCode — Relay AI Coding', linkText: 'Registrarse' },
  'pt-BR': { text: 'Bem-vindo ao FishXCode — Relay AI Coding', linkText: 'Registrar' },
}

const { lang } = useData()
const t = computed(() => I18N[lang.value] ?? I18N['zh-CN'])

const BAR_HEIGHT = '36px'

const visible = ref(false)

function setLayoutOffset(height: string) {
  document.documentElement.style.setProperty('--vp-layout-top-height', height)
}

onMounted(() => {
  if (!localStorage.getItem(props.storageKey)) {
    visible.value = true
    setLayoutOffset(BAR_HEIGHT)
  }
})

function dismiss() {
  visible.value = false
  localStorage.setItem(props.storageKey, '1')
  setLayoutOffset('0px')
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="visible" class="announcement-bar">
      <div class="content">
        <span>{{ t.text }}</span>
        <a href="https://fishxcode.com/register?aff=9CTW" class="link">{{ t.linkText }}</a>
      </div>
      <button class="close" aria-label="Close" @click="dismiss">&times;</button>
    </div>
  </Transition>
</template>

<style scoped>
.announcement-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  background-color: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-size: 14px;
}

.content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.link {
  color: var(--vp-c-white);
  text-decoration: underline;
  font-weight: 500;
}

.close {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: var(--vp-c-white);
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close:hover {
  opacity: 1;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
