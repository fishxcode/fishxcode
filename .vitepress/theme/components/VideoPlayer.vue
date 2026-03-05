<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  poster?: string
}>(), {
  poster: '',
})

const containerRef = ref<HTMLDivElement>()
const artInstance = shallowRef<any>(null)

onMounted(async () => {
  // Dynamic import to avoid SSR issues
  const Artplayer = (await import('artplayer')).default

  if (!containerRef.value) return

  artInstance.value = new Artplayer({
    container: containerRef.value,
    url: props.src,
    poster: props.poster || '',
    volume: 0.7,
    muted: false,
    autoplay: false,
    pip: true,
    autoSize: false,
    autoMini: false,
    screenshot: true,
    setting: true,
    loop: false,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    miniProgressBar: true,
    mutex: true,
    backdrop: true,
    playsInline: true,
    autoPlayback: false,
    theme: 'var(--vp-c-brand-1, #646cff)',
  })
})

onBeforeUnmount(() => {
  if (artInstance.value) {
    artInstance.value.destroy(false)
  }
})
</script>

<template>
  <div class="video-player-wrapper">
    <div ref="containerRef" class="video-player-container"></div>
  </div>
</template>

<style scoped>
.video-player-wrapper {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  isolation: isolate;
  position: relative;
}

.video-player-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
</style>
