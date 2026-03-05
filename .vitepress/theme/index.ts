// https://vitepress.dev/guide/custom-theme
import { h, onMounted, watch, nextTick } from 'vue'
import type { Theme } from 'vitepress'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import NotFound from './NotFound.vue'
import BackToTop from './components/BackToTop.vue'
import AnnouncementBar from './components/AnnouncementBar.vue'
import ModelCards from './components/ModelCards.vue'
import ToolWizard from './components/ToolWizard.vue'
import Timeline from './components/Timeline.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import './style.css'
import './dark-mode.css'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'layout-top': () => h(AnnouncementBar),
      'layout-bottom': () => h(BackToTop),
    })
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(initZoom)
    watch(() => route.path, () => nextTick(initZoom))
  },
  enhanceApp({ app }) {
    app.component('ModelCards', ModelCards)
    app.component('ToolWizard', ToolWizard)
    app.component('Timeline', Timeline)
    app.component('VideoPlayer', VideoPlayer)
  }
} satisfies Theme
