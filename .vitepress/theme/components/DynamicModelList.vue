<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

interface ApiModel {
  model_name: string
  description?: string
  tags?: string
  vendor_id: number
  quota_type?: number
  model_ratio: number
  completion_ratio: number
  cache_ratio?: number
  create_cache_ratio?: number
  enable_groups: string[]
  supported_endpoint_types: string[]
}

interface ApiResponse {
  data: ApiModel[]
  vendors: Array<{ id: number; name: string; icon: string }>
  success: boolean
}

type VendorKey = 'all' | 'claude' | 'codex'

const PRICING_PAGE_URL = 'https://fishxcode.com/pricing'

const { lang, site } = useData()
const models = ref<ApiModel[]>([])
const loading = ref(true)
const error = ref('')
const copiedModel = ref('')
const searchQuery = ref('')
const activeVendor = ref<VendorKey>('all')
const activeTag = ref('all')
const activeGroup = ref('all')
const activeEndpoint = ref('all')
const selectedModel = ref<ApiModel | null>(null)
const vendors = ref<Array<{ id: number; name: string; icon: string }>>([])

function vendorInfo(model: ApiModel) {
  return vendors.value.find(v => v.id === model.vendor_id) ?? { id: model.vendor_id, name: '?', icon: '' }
}

function vendorIconUrl(model: ApiModel): string {
  const icon = vendorInfo(model).icon ?? ''
  return icon.startsWith('http') ? icon : ''
}

const I18N = {
  'zh-CN': {
    loading: '加载中...',
    error: '加载失败',
    retry: '重试',
    modelCatalog: '模型目录',
    heroTitle: '像模型广场一样浏览 FishXCode 支持模型',
    helper: '按供应商、标签快速筛选，点击模型卡片即可复制模型 ID。需要查看完整计费信息时，直接进入定价页面。',
    pricingPage: '查看定价页面',
    pricingHint: '打开完整模型广场',
    providers: '供应商',
    tagsTitle: '标签',
    groupsTitle: '可用分组',
    endpointsTitle: '端点类型',
    allProviders: '全部供应商',
    allTags: '全部标签',
    allGroups: '全部分组',
    allEndpoints: '全部端点',
    claudeTitle: 'Anthropic',
    codexTitle: 'OpenAI',
    modelId: '模型 ID',
    description: '说明',
    tags: '标签',
    ratio: '倍率',
    completionRatio: '补全倍率',
    total: '模型总数',
    filtered: '当前结果',
    copy: '复制',
    copied: '已复制',
    details: '查看详情',
    detailTitle: '模型详情',
    close: '关闭',
    search: '模糊搜索模型名称',
    noDescription: '暂无描述',
    noTags: '通用',
    noGroups: '未标记分组',
    noEndpoints: '未标记端点',
    empty: '没有匹配的模型',
    reset: '重置筛选',
    modelUnit: '个模型',
    cardHint: '点击复制模型 ID',
    pricingLinkLabel: '定价模型地址',
    basicInfo: '基本信息',
    apiEndpoints: 'API 端点',
    groupPricing: '分组价格',
    inputRatio: '输入',
    outputRatio: '输出',
    cacheRatio: '缓存命中',
    createCacheRatio: '创建缓存',
    availableGroups: '可用分组'
  },
  en: {
    loading: 'Loading...',
    error: 'Failed to load',
    retry: 'Retry',
    modelCatalog: 'Model Catalog',
    heroTitle: 'Browse FishXCode models like the pricing plaza',
    helper: 'Filter by provider or tags and copy model IDs directly from each card. Open the pricing page when you need the full billing view.',
    pricingPage: 'Open Pricing Page',
    pricingHint: 'Go to the full model plaza',
    providers: 'Providers',
    tagsTitle: 'Tags',
    groupsTitle: 'Groups',
    endpointsTitle: 'Endpoint Types',
    allProviders: 'All Providers',
    allTags: 'All Tags',
    allGroups: 'All Groups',
    allEndpoints: 'All Endpoints',
    claudeTitle: 'Anthropic',
    codexTitle: 'OpenAI',
    modelId: 'Model ID',
    description: 'Description',
    tags: 'Tags',
    ratio: 'Ratio',
    completionRatio: 'Completion Ratio',
    total: 'Total Models',
    filtered: 'Filtered Results',
    copy: 'Copy',
    copied: 'Copied',
    details: 'Details',
    detailTitle: 'Model Details',
    close: 'Close',
    search: 'Search model names',
    noDescription: 'No description available',
    noTags: 'General',
    noGroups: 'No groups',
    noEndpoints: 'No endpoints',
    empty: 'No matching models',
    reset: 'Reset Filters',
    modelUnit: 'models',
    cardHint: 'Click to copy model ID',
    pricingLinkLabel: 'Pricing page',
    basicInfo: 'Basic Info',
    apiEndpoints: 'API Endpoints',
    groupPricing: 'Group Pricing',
    inputRatio: 'Input',
    outputRatio: 'Output',
    cacheRatio: 'Cache Hit',
    createCacheRatio: 'Cache Write',
    availableGroups: 'Groups'
  },
  fr: {
    loading: 'Chargement...',
    error: 'Échec du chargement',
    retry: 'Réessayer',
    modelCatalog: 'Catalogue des modèles',
    heroTitle: 'Parcourez les modèles FishXCode comme dans la place tarifaire',
    helper: 'Filtrez par fournisseur ou étiquette et copiez l"ID du modèle depuis chaque carte. Ouvrez la page tarifaire pour la vue complète de facturation.',
    pricingPage: 'Ouvrir la page tarifaire',
    pricingHint: 'Accéder à la place complète',
    providers: 'Fournisseurs',
    tagsTitle: 'Étiquettes',
    groupsTitle: 'Groupes',
    endpointsTitle: 'Types de point de terminaison',
    allProviders: 'Tous les fournisseurs',
    allTags: 'Toutes les étiquettes',
    allGroups: 'Tous les groupes',
    allEndpoints: 'Tous les points de terminaison',
    claudeTitle: 'Anthropic',
    codexTitle: 'OpenAI',
    modelId: 'ID du modèle',
    description: 'Description',
    tags: 'Étiquettes',
    ratio: 'Ratio',
    completionRatio: 'Ratio de complétion',
    total: 'Total des modèles',
    filtered: 'Résultats filtrés',
    copy: 'Copier',
    copied: 'Copié',
    details: 'Détails',
    detailTitle: 'Détails du modèle',
    close: 'Fermer',
    search: 'Recherche du nom du modèle',
    noDescription: 'Aucune description disponible',
    noTags: 'Général',
    noGroups: 'Aucun groupe',
    noEndpoints: 'Aucun point',
    empty: 'Aucun modèle correspondant',
    reset: 'Réinitialiser',
    modelUnit: 'modèles',
    cardHint: "Cliquez pour copier lID du modèle",
    pricingLinkLabel: "Page tarifaire",
    basicInfo: "Informations",
    apiEndpoints: "Endpoints API",
    groupPricing: "Prix par groupe",
    inputRatio: "Entrée",
    outputRatio: "Sortie",
    cacheRatio: "Cache",
    createCacheRatio: "Écriture cache",
    availableGroups: "Groupes"
  },
  es: {
    loading: 'Cargando...',
    error: 'Error al cargar',
    retry: 'Reintentar',
    modelCatalog: 'Catálogo de modelos',
    heroTitle: 'Explora los modelos de FishXCode como en la plaza de precios',
    helper: 'Filtra por proveedor o etiquetas y copia el ID del modelo desde cada tarjeta. Abre la página de precios para ver la facturación completa.',
    pricingPage: 'Abrir página de precios',
    pricingHint: 'Ir a la plaza completa',
    providers: 'Proveedores',
    tagsTitle: 'Etiquetas',
    groupsTitle: 'Grupos',
    endpointsTitle: 'Tipos de endpoint',
    allProviders: 'Todos los proveedores',
    allTags: 'Todas las etiquetas',
    allGroups: 'Todos los grupos',
    allEndpoints: 'Todos los endpoints',
    claudeTitle: 'Anthropic',
    codexTitle: 'OpenAI',
    modelId: 'ID del modelo',
    description: 'Descripción',
    tags: 'Etiquetas',
    ratio: 'Ratio',
    completionRatio: 'Ratio de finalización',
    total: 'Modelos totales',
    filtered: 'Resultados filtrados',
    copy: 'Copiar',
    copied: 'Copiado',
    details: 'Detalles',
    detailTitle: 'Detalles del modelo',
    close: 'Cerrar',
    search: 'Buscar nombres de modelos',
    noDescription: 'Sin descripción disponible',
    noTags: 'General',
    noGroups: 'Sin grupos',
    noEndpoints: 'Sin endpoints',
    empty: 'No hay modelos coincidentes',
    reset: 'Restablecer filtros',
    modelUnit: 'modelos',
    cardHint: 'Haz clic para copiar el ID del modelo',
    pricingLinkLabel: 'Página de precios',
    basicInfo: 'Información básica',
    apiEndpoints: 'Endpoints de API',
    groupPricing: 'Precios por grupo',
    inputRatio: 'Entrada',
    outputRatio: 'Salida',
    cacheRatio: 'Caché',
    createCacheRatio: 'Escritura caché',
    availableGroups: 'Grupos'
  },
  pt: {
    loading: 'Carregando...',
    error: 'Falha ao carregar',
    retry: 'Tentar novamente',
    modelCatalog: 'Catálogo de modelos',
    heroTitle: 'Navegue pelos modelos FishXCode como na praça de preços',
    helper: 'Filtre por provedor ou tags e copie o ID do modelo direto do card. Abra a página de preços para ver a cobrança completa.',
    pricingPage: 'Abrir página de preços',
    pricingHint: 'Ir para a praça completa',
    providers: 'Provedores',
    tagsTitle: 'Tags',
    groupsTitle: 'Grupos',
    endpointsTitle: 'Tipos de endpoint',
    allProviders: 'Todos os provedores',
    allTags: 'Todas as tags',
    allGroups: 'Todos os grupos',
    allEndpoints: 'Todos os endpoints',
    claudeTitle: 'Anthropic',
    codexTitle: 'OpenAI',
    modelId: 'ID do modelo',
    description: 'Descrição',
    tags: 'Tags',
    ratio: 'Proporção',
    completionRatio: 'Proporção de conclusão',
    total: 'Total de modelos',
    filtered: 'Resultados filtrados',
    copy: 'Copiar',
    copied: 'Copiado',
    details: 'Detalhes',
    detailTitle: 'Detalhes do modelo',
    close: 'Fechar',
    search: 'Buscar nomes de modelos',
    noDescription: 'Sem descrição disponível',
    noTags: 'Geral',
    noGroups: 'Sem grupos',
    noEndpoints: 'Sem endpoints',
    empty: 'Nenhum modelo correspondente',
    reset: 'Redefinir filtros',
    modelUnit: 'modelos',
    cardHint: 'Clique para copiar o ID do modelo',
    pricingLinkLabel: 'Página de preços',
    basicInfo: 'Informações básicas',
    apiEndpoints: 'Endpoints de API',
    groupPricing: 'Preços por grupo',
    inputRatio: 'Entrada',
    outputRatio: 'Saída',
    cacheRatio: 'Cache',
    createCacheRatio: 'Gravação cache',
    availableGroups: 'Grupos'
  }
}

const t = computed(() => {
  const raw = lang.value ?? ''
  // VitePress lang 可能是 'en-US', 'fr-FR' 等，I18N key 用短码
  const locale = (raw.split('-')[0] === 'zh' ? 'zh-CN' : raw.split('-')[0]) as keyof typeof I18N
  return I18N[locale] || I18N['zh-CN']
})

const pricingApiUrl = computed(() => {
  const base = site.value.base.endsWith('/') ? site.value.base : `${site.value.base}/`
  return `${base}api/pricing`
})

const vendorMap = computed(() => ({
  all: { key: 'all' as const, title: t.value.allProviders, ids: [] as number[], tone: 'all' },
  claude: { key: 'claude' as const, title: t.value.claudeTitle, ids: [1], tone: 'claude' },
  codex: { key: 'codex' as const, title: t.value.codexTitle, ids: [13], tone: 'codex' }
}))

const allTags = computed(() => {
  const tagCounts = new Map<string, number>()

  for (const model of models.value) {
    for (const tag of parseTags(model.tags)) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    }
  }

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }))
})

const allGroups = computed(() => {
  const groupCounts = new Map<string, number>()

  for (const model of models.value) {
    for (const group of model.enable_groups || []) {
      const normalized = group.trim()
      if (!normalized) continue
      groupCounts.set(normalized, (groupCounts.get(normalized) || 0) + 1)
    }
  }

  return Array.from(groupCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }))
})

const allEndpoints = computed(() => {
  const endpointCounts = new Map<string, number>()

  for (const model of models.value) {
    for (const endpoint of model.supported_endpoint_types || []) {
      const normalized = endpoint.trim()
      if (!normalized) continue
      endpointCounts.set(normalized, (endpointCounts.get(normalized) || 0) + 1)
    }
  }

  return Array.from(endpointCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }))
})

const providerOptions = computed(() => [
  { ...vendorMap.value.all, count: models.value.length },
  {
    ...vendorMap.value.claude,
    count: models.value.filter(model => vendorMap.value.claude.ids.includes(model.vendor_id)).length
  },
  {
    ...vendorMap.value.codex,
    count: models.value.filter(model => vendorMap.value.codex.ids.includes(model.vendor_id)).length
  }
])

const filteredModels = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const selectedVendor = vendorMap.value[activeVendor.value]

  return models.value.filter(model => {
    const matchesVendor =
      selectedVendor.key === 'all' || selectedVendor.ids.includes(model.vendor_id)

    const tags = parseTags(model.tags)
    const matchesTag = activeTag.value === 'all' || tags.includes(activeTag.value)
    const groups = model.enable_groups || []
    const matchesGroup = activeGroup.value === 'all' || groups.includes(activeGroup.value)
    const endpoints = model.supported_endpoint_types || []
    const matchesEndpoint =
      activeEndpoint.value === 'all' || endpoints.includes(activeEndpoint.value)

    const haystack = [
      model.model_name,
      model.description || '',
      model.tags || '',
      groups.join(' '),
      endpoints.join(' ')
    ].join(' ').toLowerCase()

    const matchesQuery = !query || haystack.includes(query)

    return matchesVendor && matchesTag && matchesGroup && matchesEndpoint && matchesQuery
  })
})

const filteredSections = computed(() =>
  providerOptions.value
    .filter(option => option.key !== 'all')
    .map(option => ({
      id: option.key,
      title: option.title,
      tone: option.tone,
      models: filteredModels.value
        .filter(model => option.ids.includes(model.vendor_id))
        .sort((a, b) => b.model_ratio - a.model_ratio || a.model_name.localeCompare(b.model_name))
    }))
    .filter(section => section.models.length > 0)
)

async function fetchModels() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(pricingApiUrl.value, {
      headers: {
        accept: 'application/json, text/plain, */*'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data: ApiResponse = await response.json()

    if (data.success && data.data) {
      models.value = data.data
      vendors.value = data.vendors || []
    } else {
      throw new Error('Invalid response format')
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
    console.error('Failed to fetch models:', e)
  } finally {
    loading.value = false
  }
}

function fmtRatio(v: number): string {
  const n = parseFloat(v.toPrecision(6))
  return n % 1 === 0 ? `${n}x` : `${n}x`
}

function parseTags(tags?: string): string[] {
  if (!tags) return []
  return tags.split(',').map(tag => tag.trim()).filter(Boolean)
}

function displayTags(tags?: string): string[] {
  const parsedTags = parseTags(tags)
  return parsedTags.length > 0 ? parsedTags : [t.value.noTags]
}

function resetFilters() {
  searchQuery.value = ''
  activeVendor.value = 'all'
  activeTag.value = 'all'
  activeGroup.value = 'all'
  activeEndpoint.value = 'all'
}

function detailTags(model: ApiModel) {
  return displayTags(model.tags)
}

function detailGroups(model: ApiModel) {
  return model.enable_groups?.length ? model.enable_groups : [t.value.noGroups]
}

function detailEndpoints(model: ApiModel) {
  return model.supported_endpoint_types?.length
    ? model.supported_endpoint_types
    : [t.value.noEndpoints]
}

function openDetails(model: ApiModel) {
  selectedModel.value = model
  document.addEventListener('keydown', onEsc)
  document.body.style.overflow = 'hidden'
}

function closeDetails() {
  selectedModel.value = null
  document.removeEventListener('keydown', onEsc)
  document.body.style.overflow = ''
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') closeDetails()
}

async function copyModelName(modelName: string) {
  try {
    await navigator.clipboard.writeText(modelName)
    copiedModel.value = modelName
    window.setTimeout(() => {
      if (copiedModel.value === modelName) {
        copiedModel.value = ''
      }
    }, 1600)
  } catch (e) {
    console.error('Failed to copy model name:', e)
  }
}

onMounted(() => {
  fetchModels()
})
</script>

<template>
  <div class="dynamic-model-list">
    <div v-if="loading" class="loading">
      {{ t.loading }}
    </div>

    <div v-else-if="error" class="error">
      <p>{{ t.error }}: {{ error }}</p>
      <button @click="fetchModels" class="retry-btn">{{ t.retry }}</button>
    </div>

    <div v-else class="pricing-layout">
      <aside class="filter-panel">
        <div class="filter-block">
          <div class="filter-head">
            <span class="filter-kicker">{{ t.modelCatalog }}</span>
            <button type="button" class="reset-btn" @click="resetFilters">{{ t.reset }}</button>
          </div>

          <h3 class="filter-title">{{ t.providers }}</h3>
          <div class="filter-stack">
            <button
              v-for="provider in providerOptions"
              :key="provider.key"
              type="button"
              class="filter-pill"
              :class="[{ active: activeVendor === provider.key }, provider.tone]"
              @click="activeVendor = provider.key"
            >
              <span>{{ provider.title }}</span>
              <span class="count">{{ provider.count }}</span>
            </button>
          </div>
        </div>

        <div class="filter-block">
          <h3 class="filter-title">{{ t.tagsTitle }}</h3>
          <div class="filter-stack">
            <button
              type="button"
              class="filter-pill all"
              :class="{ active: activeTag === 'all' }"
              @click="activeTag = 'all'"
            >
              <span>{{ t.allTags }}</span>
              <span class="count">{{ allTags.length }}</span>
            </button>
            <button
              v-for="tag in allTags"
              :key="tag.label"
              type="button"
              class="filter-pill soft"
              :class="{ active: activeTag === tag.label }"
              @click="activeTag = tag.label"
            >
              <span>{{ tag.label }}</span>
              <span class="count">{{ tag.count }}</span>
            </button>
          </div>
        </div>

        <div class="filter-block">
          <h3 class="filter-title">{{ t.groupsTitle }}</h3>
          <div class="filter-stack">
            <button
              type="button"
              class="filter-pill all"
              :class="{ active: activeGroup === 'all' }"
              @click="activeGroup = 'all'"
            >
              <span>{{ t.allGroups }}</span>
              <span class="count">{{ allGroups.length }}</span>
            </button>
            <button
              v-for="group in allGroups"
              :key="group.label"
              type="button"
              class="filter-pill soft"
              :class="{ active: activeGroup === group.label }"
              @click="activeGroup = group.label"
            >
              <span>{{ group.label }}</span>
              <span class="count">{{ group.count }}</span>
            </button>
          </div>
        </div>

        <div class="filter-block">
          <h3 class="filter-title">{{ t.endpointsTitle }}</h3>
          <div class="filter-stack">
            <button
              type="button"
              class="filter-pill all"
              :class="{ active: activeEndpoint === 'all' }"
              @click="activeEndpoint = 'all'"
            >
              <span>{{ t.allEndpoints }}</span>
              <span class="count">{{ allEndpoints.length }}</span>
            </button>
            <button
              v-for="endpoint in allEndpoints"
              :key="endpoint.label"
              type="button"
              class="filter-pill soft"
              :class="{ active: activeEndpoint === endpoint.label }"
              @click="activeEndpoint = endpoint.label"
            >
              <span>{{ endpoint.label }}</span>
              <span class="count">{{ endpoint.count }}</span>
            </button>
          </div>
        </div>
      </aside>

      <section class="content-panel">
        <div class="hero-card">
          <div class="hero-copy">
            <p class="hero-kicker">{{ t.modelCatalog }}</p>
            <h2 class="hero-title">{{ t.heroTitle }}</h2>
            <p class="hero-text">{{ t.helper }}</p>
          </div>

          <div class="hero-side">
            <div class="stat-grid">
              <div class="stat-card">
                <span class="stat-label">{{ t.total }}</span>
                <strong class="stat-value">{{ models.length }}</strong>
              </div>
              <div class="stat-card">
                <span class="stat-label">{{ t.filtered }}</span>
                <strong class="stat-value">{{ filteredModels.length }}</strong>
              </div>
            </div>

            <a
              class="pricing-link"
              :href="PRICING_PAGE_URL"
              target="_blank"
              rel="noreferrer"
              :aria-label="t.pricingLinkLabel"
            >
              <span>{{ t.pricingPage }}</span>
              <small>{{ t.pricingHint }}</small>
            </a>
          </div>
        </div>

        <div class="toolbar">
          <label class="search-box">
            <span class="search-icon">⌕</span>
            <input v-model="searchQuery" :placeholder="t.search" type="search">
          </label>
        </div>

        <div v-if="filteredSections.length" class="section-stack">
          <section
            v-for="section in filteredSections"
            :key="section.id"
            class="vendor-section"
            :class="section.tone"
          >
            <div class="section-header">
              <div>
                <p class="section-kicker">{{ section.models.length }} {{ t.modelUnit }}</p>
                <h3 class="section-title">{{ section.title }}</h3>
              </div>
            </div>

            <div class="model-grid">
              <article v-for="model in section.models" :key="model.model_name" class="model-card">
                <div class="model-card-head">
                  <div class="model-meta-top">
                    <span class="vendor-badge" :class="section.tone">{{ section.title }}</span>
                    <strong class="ratio-badge">{{ fmtRatio(model.model_ratio) }}</strong>
                  </div>
                  <button
                    type="button"
                    class="copy-btn"
                    @click="copyModelName(model.model_name)"
                  >
                    {{ copiedModel === model.model_name ? t.copied : t.copy }}
                  </button>
                </div>

                <div class="model-body">
                  <p class="field-label">{{ t.modelId }}</p>
                  <code class="model-id">{{ model.model_name }}</code>
                  <p class="model-desc">{{ model.description || t.noDescription }}</p>
                </div>

                <div class="tag-row">
                  <span v-for="tag in displayTags(model.tags)" :key="tag" class="tag-chip">
                    {{ tag }}
                  </span>
                </div>

                <div class="card-actions">
                  <button type="button" class="detail-btn" @click="openDetails(model)">
                    {{ t.details }}
                  </button>
                  <p class="card-hint">{{ t.cardHint }}</p>
                </div>
              </article>
            </div>
          </section>
        </div>

        <div v-else class="empty-state">
          <p>{{ t.empty }}</p>
          <button type="button" class="retry-btn" @click="resetFilters">{{ t.reset }}</button>
        </div>
      </section>
    </div>

    <Transition name="modal-fade">
    <div v-if="selectedModel" class="detail-backdrop" @click.self="closeDetails">
      <div class="detail-modal" role="dialog" aria-modal="true" :aria-label="selectedModel.model_name">
        <!-- Modal header: vendor icon + model name + actions -->
        <div class="detail-modal-header">
          <div class="modal-header-left">
            <div class="vendor-avatar">
              <img
                v-if="vendorIconUrl(selectedModel)"
                :src="vendorIconUrl(selectedModel)"
                :alt="vendorInfo(selectedModel).name"
                class="vendor-avatar-img"
              />
              <span v-else class="vendor-avatar-text">{{ vendorInfo(selectedModel).name.charAt(0) }}</span>
            </div>
            <div class="modal-title-info">
              <span class="modal-vendor-label">{{ vendorInfo(selectedModel).name }}</span>
              <code class="modal-model-name">{{ selectedModel.model_name }}</code>
            </div>
          </div>
          <div class="modal-header-actions">
            <button
              type="button"
              class="icon-btn"
              :title="copiedModel === selectedModel.model_name ? t.copied : t.copy"
              @click="copyModelName(selectedModel.model_name)"
            >
              <svg v-if="copiedModel !== selectedModel.model_name" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
            <button type="button" class="icon-btn" :title="t.close" @click="closeDetails">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="detail-modal-body">
          <!-- 基本信息 -->
          <div class="detail-section">
            <div class="section-heading info-heading">
              <span class="section-dot info-dot">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M11 7h2v2h-2zm0 4h2v6h-2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
              </span>
              <span>{{ t.basicInfo }}</span>
            </div>
            <p class="detail-desc">{{ selectedModel.description || t.noDescription }}</p>
            <div class="tag-row">
              <span v-for="tag in detailTags(selectedModel)" :key="tag" class="tag-chip info-chip">{{ tag }}</span>
            </div>
          </div>

          <!-- API 端点 -->
          <div class="detail-section">
            <div class="section-heading endpoint-heading">
              <span class="section-dot endpoint-dot">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </span>
              <span>{{ t.apiEndpoints }}</span>
            </div>
            <div class="endpoint-chips">
              <span v-for="ep in detailEndpoints(selectedModel)" :key="ep" class="endpoint-chip">{{ ep }}</span>
            </div>
          </div>

          <!-- 分组价格 -->
          <div class="detail-section">
            <div class="section-heading pricing-heading">
              <span class="section-dot pricing-dot">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
              </span>
              <span>{{ t.groupPricing }}</span>
            </div>

            <!-- 比率网格 -->
            <div class="ratio-grid">
              <div class="ratio-item">
                <span class="ratio-label">{{ t.inputRatio }}</span>
                <strong class="ratio-value">{{ fmtRatio(selectedModel.model_ratio) }}</strong>
              </div>
              <div class="ratio-item">
                <span class="ratio-label">{{ t.outputRatio }}</span>
                <strong class="ratio-value">{{ fmtRatio(selectedModel.completion_ratio) }}</strong>
              </div>
              <div v-if="selectedModel.cache_ratio" class="ratio-item">
                <span class="ratio-label">{{ t.cacheRatio }}</span>
                <strong class="ratio-value cache-value">{{ fmtRatio(selectedModel.cache_ratio) }}</strong>
              </div>
              <div v-if="selectedModel.create_cache_ratio" class="ratio-item">
                <span class="ratio-label">{{ t.createCacheRatio }}</span>
                <strong class="ratio-value cache-value">{{ fmtRatio(selectedModel.create_cache_ratio) }}</strong>
              </div>
            </div>

            <!-- 可用分组 chips -->
            <div class="group-section">
              <span class="group-section-label">{{ t.availableGroups }}</span>
              <div class="group-chips">
                <span v-for="group in detailGroups(selectedModel)" :key="group" class="group-chip">{{ group }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Transition>
  </div>
</template>

<style scoped>
.dynamic-model-list {
  width: 100%;
  max-width: 100%;
  margin: 24px 0;
  box-sizing: border-box;
}

/* ── Loading / Error / Empty ── */
.loading,
.error,
.empty-state {
  padding: 48px 32px;
  text-align: center;
  color: var(--vp-c-text-2);
  border: 2px solid var(--fishx-warm-border);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, var(--fishx-gold-soft), transparent 50%),
    radial-gradient(circle at bottom right, var(--fishx-pink-soft), transparent 50%),
    var(--vp-c-bg-soft);
  box-shadow:
    0 20px 40px rgba(185, 134, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.loading {
  position: relative;
  overflow: hidden;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--vp-c-brand-1), transparent);
  animation: loading-bar 1.5s ease-in-out infinite;
}

.loading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, var(--fishx-gold-soft), transparent);
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

.error {
  color: var(--vp-c-danger-1);
  font-weight: 600;
}

/* ── Buttons base ── */
.retry-btn,
.reset-btn,
.copy-btn,
.detail-btn,
.close-btn {
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.retry-btn::before,
.reset-btn::before,
.copy-btn::before,
.detail-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.retry-btn:hover::before,
.reset-btn:hover::before,
.copy-btn:hover::before,
.detail-btn:hover::before {
  opacity: 1;
}

.retry-btn {
  margin-top: 16px;
  padding: 12px 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--fishx-gold-3) 0%, var(--fishx-gold-2) 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(185, 134, 46, 0.3);
}

.retry-btn:hover,
.reset-btn:hover,
.copy-btn:hover,
.detail-btn:hover,
.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(185, 134, 46, 0.35);
}

.retry-btn:active,
.reset-btn:active,
.copy-btn:active,
.detail-btn:active,
.close-btn:active {
  transform: translateY(0);
}

/* ── Layout ── */
.pricing-layout {
  display: grid;
  grid-template-columns: minmax(190px, 220px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  width: 100%;
  max-width: 100%;
}

/* ── Filter Panel ── */
.filter-panel {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-block {
  padding: 16px;
  border: 1.5px solid var(--fishx-warm-border);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, var(--fishx-gold-soft), transparent 60%),
    var(--vp-c-bg);
  box-shadow:
    0 8px 24px rgba(185, 134, 46, 0.07),
    0 1px 3px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transition: box-shadow 0.3s ease;
}

.filter-block:hover {
  box-shadow:
    0 12px 32px rgba(185, 134, 46, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.filter-head,
.section-header,
.model-card-head,
.model-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-kicker,
.hero-kicker,
.section-kicker,
.field-label,
.stat-label {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.filter-title,
.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.reset-btn {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 700;
  border: 1.5px solid var(--fishx-warm-border);
  letter-spacing: 0.03em;
}

.filter-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
  padding: 9px 12px;
  border: 1.5px solid var(--fishx-warm-border);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-pill:hover {
  border-color: rgba(185, 134, 46, 0.3);
  background: var(--fishx-gold-soft);
  color: var(--vp-c-text-1);
  transform: translateX(2px);
}

.filter-pill.active {
  border-color: transparent;
  background: linear-gradient(135deg, var(--fishx-gold-soft), var(--fishx-pink-soft));
  color: var(--vp-c-brand-1);
  font-weight: 700;
  box-shadow:
    0 4px 12px rgba(185, 134, 46, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.filter-pill.claude.active {
  background: linear-gradient(135deg, var(--fishx-pink-soft), rgba(222, 120, 152, 0.06));
  color: var(--fishx-pink-1);
  box-shadow: 0 4px 12px rgba(222, 120, 152, 0.18);
}

.filter-pill.codex.active {
  background: linear-gradient(135deg, var(--fishx-gold-soft), rgba(185, 134, 46, 0.06));
  color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(185, 134, 46, 0.18);
}

.filter-pill.soft {
  width: auto;
}

.count {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 800;
  min-width: 22px;
  text-align: center;
}

/* ── Content Panel ── */
.content-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* ── Hero Card ── */
.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 28px;
  border-radius: 24px;
  border: 1.5px solid rgba(222, 120, 152, 0.25);
  background:
    radial-gradient(ellipse at top right, rgba(222, 120, 152, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(185, 134, 46, 0.22) 0%, transparent 50%),
    linear-gradient(135deg, #7a2c3e 0%, #9a3a2a 30%, #7a5520 60%, #5c4010 100%);
  color: #fff;
  box-shadow:
    0 24px 64px rgba(154, 58, 42, 0.3),
    0 8px 24px rgba(185, 134, 46, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  position: relative;
  overflow: hidden;
}

.hero-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 60%;
  height: 200%;
  background: radial-gradient(ellipse, rgba(255, 255, 255, 0.07), transparent 60%);
  pointer-events: none;
}

.hero-card::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 50%;
  height: 150%;
  background: radial-gradient(ellipse, rgba(222, 120, 152, 0.1), transparent 60%);
  pointer-events: none;
}

.hero-copy {
  max-width: 58ch;
  position: relative;
  z-index: 1;
}

.hero-kicker,
.hero-card .stat-label {
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.12em;
}

.hero-title {
  margin: 10px 0 12px;
  font-size: 26px;
  line-height: 1.15;
  color: #fff;
  font-weight: 800;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.hero-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
}

.hero-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  min-width: min(250px, 40%);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-value {
  font-size: 28px;
  line-height: 1;
  font-weight: 800;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.pricing-link {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  text-decoration: none;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.pricing-link:hover {
  background: rgba(255, 255, 255, 0.26);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.pricing-link span {
  font-weight: 700;
  font-size: 14px;
}

.pricing-link small {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
}

/* ── Toolbar / Search ── */
.toolbar {
  display: flex;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--fishx-warm-border);
  border-radius: 18px;
  background: var(--vp-c-bg);
  box-shadow:
    0 4px 16px rgba(185, 134, 46, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: rgba(185, 134, 46, 0.45);
  box-shadow:
    0 4px 20px rgba(185, 134, 46, 0.15),
    0 0 0 3px rgba(185, 134, 46, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.search-icon {
  color: var(--vp-c-brand-1);
  font-size: 16px;
  flex-shrink: 0;
}

/* ── Sections ── */
.section-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vendor-section {
  min-width: 0;
  padding: 20px;
  border-radius: 24px;
  border: 1.5px solid var(--fishx-warm-border);
  background:
    radial-gradient(circle at top right, var(--fishx-gold-soft), transparent 60%),
    var(--vp-c-bg);
  box-shadow:
    0 12px 32px rgba(185, 134, 46, 0.07),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transition: box-shadow 0.3s ease;
}

.vendor-section:hover {
  box-shadow:
    0 16px 40px rgba(185, 134, 46, 0.11),
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.vendor-section.claude {
  border-color: var(--fishx-pink-soft);
  background:
    radial-gradient(circle at top right, var(--fishx-pink-soft), transparent 60%),
    var(--vp-c-bg);
}

.vendor-section.codex {
  border-color: var(--fishx-warm-border);
  background:
    radial-gradient(circle at top right, rgba(185, 134, 46, 0.06), transparent 60%),
    var(--vp-c-bg);
}

.section-title {
  margin-bottom: 0;
  font-size: 20px;
  font-weight: 800;
}

/* ── Model Grid & Cards ── */
.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
  width: 100%;
}

.model-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1.5px solid var(--fishx-warm-border);
  border-radius: 20px;
  background: var(--vp-c-bg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.model-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--fishx-gold-3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.model-card:hover {
  transform: translateY(-4px);
  border-color: rgba(185, 134, 46, 0.28);
  box-shadow:
    0 20px 40px rgba(185, 134, 46, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.05);
}

.model-card:hover::before {
  opacity: 1;
}

.vendor-badge,
.ratio-badge,
.tag-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

/* vendor badge: 默认用金色 */
.vendor-badge {
  padding: 4px 10px;
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--fishx-warm-border);
}

/* Anthropic → 玫瑰粉 */
.vendor-badge.claude {
  background: var(--fishx-pink-soft);
  color: var(--fishx-pink-1);
  border-color: rgba(222, 120, 152, 0.2);
}

/* OpenAI → 金色（与默认相同，可加深） */
.vendor-badge.codex {
  background: linear-gradient(135deg, rgba(185, 134, 46, 0.14), rgba(201, 151, 62, 0.08));
  color: var(--fishx-gold-1);
  border-color: rgba(185, 134, 46, 0.22);
}

.ratio-badge {
  padding: 4px 10px;
  background: var(--fishx-pink-soft);
  color: var(--fishx-pink-1);
  border: 1px solid rgba(222, 120, 152, 0.2);
  font-weight: 800;
}

.copy-btn {
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 700;
  border: 1px solid var(--fishx-warm-border);
}

.copy-btn:hover {
  background: linear-gradient(135deg, rgba(185, 134, 46, 0.18), rgba(201, 151, 62, 0.12));
  box-shadow: 0 4px 12px rgba(185, 134, 46, 0.22);
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
}

.detail-btn {
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--fishx-pink-soft);
  color: var(--fishx-pink-1);
  font-size: 11px;
  font-weight: 700;
  border: 1px solid rgba(222, 120, 152, 0.2);
}

.detail-btn:hover {
  background: linear-gradient(135deg, rgba(222, 120, 152, 0.18), rgba(200, 92, 128, 0.1));
  box-shadow: 0 4px 12px rgba(222, 120, 152, 0.22);
}

.model-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.model-id {
  display: inline-block;
  max-width: 100%;
  width: fit-content;
  padding: 8px 12px;
  overflow-wrap: anywhere;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1.5px solid var(--fishx-warm-border);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  line-height: 1.5;
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.25s ease;
}

.model-card:hover .model-id {
  border-color: rgba(185, 134, 46, 0.3);
  background: var(--vp-c-bg-mute);
}

.model-desc {
  margin: 0;
  min-height: 38px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  padding: 3px 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--fishx-warm-border);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.card-hint {
  margin: 0;
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* ── Modal Transition ── */
.modal-fade-enter-active {
  transition: opacity 0.22s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .detail-modal {
  animation: modal-pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.modal-fade-leave-active .detail-modal {
  animation: modal-pop-out 0.18s ease both;
}
@keyframes modal-pop-in {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modal-pop-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.94) translateY(6px); }
}

/* ── Detail Modal ── */
.detail-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(10px);
  padding: 24px;
}

.detail-modal {
  width: min(600px, 100%);
  max-height: min(85vh, 800px);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background:
    radial-gradient(circle at top left, var(--fishx-gold-soft), transparent 45%),
    radial-gradient(circle at bottom right, var(--fishx-pink-soft), transparent 45%),
    var(--vp-c-bg);
  border: 1.5px solid var(--fishx-warm-border);
  box-shadow:
    0 32px 80px rgba(17, 24, 39, 0.22),
    0 8px 24px rgba(185, 134, 46, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.detail-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 16px;
  border-bottom: 1.5px solid var(--fishx-warm-border);
  flex-shrink: 0;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.vendor-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--fishx-gold-soft), var(--fishx-pink-soft));
  border: 1.5px solid var(--fishx-warm-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.vendor-avatar-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.vendor-avatar-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

.modal-title-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.modal-vendor-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.modal-model-name {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: transparent;
  border: none;
  padding: 0;
  display: block;
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 1.5px solid var(--fishx-warm-border);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: var(--fishx-gold-soft);
  border-color: rgba(185, 134, 46, 0.3);
  color: var(--vp-c-brand-1);
}

.detail-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: 0.01em;
}

.section-dot {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-dot {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

.endpoint-dot {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
}

.pricing-dot {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.detail-desc {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.info-chip {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.endpoint-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.endpoint-chip {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: #8b5cf6;
  letter-spacing: 0.01em;
}

.ratio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.ratio-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: var(--fishx-gold-soft);
  border: 1.5px solid var(--fishx-warm-border);
  border-radius: 10px;
}

.ratio-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ratio-value {
  font-family: var(--vp-font-family-mono);
  font-size: 20px;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

.ratio-value.cache-value {
  font-size: 16px;
  color: var(--vp-c-text-2);
}

.group-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.group-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.group-chip {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: var(--fishx-gold-soft);
  border: 1px solid var(--fishx-warm-border);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.01em;
}

/* ── Dark mode: detail modal ── */
.dark .detail-modal {
  background:
    radial-gradient(circle at top left, var(--fishx-gold-soft), transparent 45%),
    radial-gradient(circle at bottom right, var(--fishx-pink-soft), transparent 45%),
    var(--vp-c-bg);
  border-color: var(--fishx-warm-border);
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.55),
    0 8px 24px rgba(196, 148, 56, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.dark .detail-modal-header {
  border-bottom-color: var(--fishx-warm-border);
}

.dark .vendor-avatar {
  background: linear-gradient(135deg, var(--fishx-gold-soft), var(--fishx-pink-soft));
  border-color: var(--fishx-warm-border);
}

.dark .icon-btn {
  background: var(--vp-c-bg-soft);
  border-color: var(--fishx-warm-border);
  color: var(--vp-c-text-2);
}

.dark .icon-btn:hover {
  background: var(--fishx-gold-soft);
  border-color: rgba(196, 148, 56, 0.35);
  color: var(--vp-c-brand-1);
}

.dark .section-heading {
  color: var(--vp-c-text-1);
}

.dark .info-chip {
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.25);
  color: #60a5fa;
}

.dark .endpoint-chip {
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.25);
  color: #a78bfa;
}

.dark .ratio-item {
  background: rgba(196, 148, 56, 0.08);
  border-color: var(--fishx-warm-border);
}

.dark .group-chip {
  background: rgba(196, 148, 56, 0.08);
  border-color: var(--fishx-warm-border);
  color: var(--vp-c-brand-1);
}

/* ── 暗色模式适配 ── */
.dark .filter-block {
  background:
    radial-gradient(circle at top right, var(--fishx-gold-soft), transparent 60%),
    var(--vp-c-bg);
  border-color: var(--fishx-warm-border);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.dark .filter-pill {
  background: var(--vp-c-bg-soft);
  border-color: var(--fishx-warm-border);
}

.dark .filter-pill:hover {
  background: var(--fishx-gold-soft);
  border-color: rgba(196, 148, 56, 0.3);
}

.dark .filter-pill.active {
  background: linear-gradient(135deg, var(--fishx-gold-soft), var(--fishx-pink-soft));
  color: var(--vp-c-brand-1);
}

.dark .filter-pill.claude.active {
  background: linear-gradient(135deg, var(--fishx-pink-soft), rgba(232, 144, 170, 0.08));
  color: var(--fishx-pink-1);
}

.dark .filter-pill.codex.active {
  background: linear-gradient(135deg, var(--fishx-gold-soft), rgba(196, 148, 56, 0.06));
  color: var(--vp-c-brand-1);
}

.dark .count {
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
}

.dark .search-box {
  background: var(--vp-c-bg-soft);
  border-color: var(--fishx-warm-border);
}

.dark .search-box:focus-within {
  border-color: rgba(196, 148, 56, 0.45);
  box-shadow:
    0 4px 20px rgba(196, 148, 56, 0.18),
    0 0 0 3px rgba(196, 148, 56, 0.1);
}

.dark .vendor-section {
  background:
    radial-gradient(circle at top right, var(--fishx-gold-soft), transparent 60%),
    var(--vp-c-bg);
  border-color: var(--fishx-warm-border);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.dark .vendor-section.claude {
  border-color: var(--fishx-pink-soft);
  background:
    radial-gradient(circle at top right, var(--fishx-pink-soft), transparent 60%),
    var(--vp-c-bg);
}

.dark .model-card {
  background: var(--vp-c-bg-soft);
  border-color: var(--fishx-warm-border);
}

.dark .model-card:hover {
  border-color: rgba(196, 148, 56, 0.32);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 4px 12px rgba(196, 148, 56, 0.12);
}

.dark .model-id {
  background: var(--vp-c-bg-mute);
  border-color: var(--fishx-warm-border);
  color: var(--vp-c-brand-1);
}

.dark .model-card:hover .model-id {
  border-color: rgba(196, 148, 56, 0.35);
  background: var(--vp-c-bg);
}

.dark .tag-chip {
  background: var(--vp-c-bg-mute);
  border-color: var(--fishx-warm-border);
}

.dark .vendor-badge {
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--fishx-warm-border);
}

.dark .vendor-badge.claude {
  background: var(--fishx-pink-soft);
  color: var(--fishx-pink-1);
  border-color: rgba(232, 144, 170, 0.2);
}

.dark .vendor-badge.codex {
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--fishx-warm-border);
}

.dark .ratio-badge {
  background: var(--fishx-pink-soft);
  color: var(--fishx-pink-1);
  border-color: rgba(232, 144, 170, 0.2);
}

.dark .copy-btn {
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--fishx-warm-border);
}

.dark .detail-btn {
  background: var(--fishx-pink-soft);
  color: var(--fishx-pink-1);
  border-color: rgba(232, 144, 170, 0.2);
}

.dark .reset-btn {
  background: var(--fishx-gold-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--fishx-warm-border);
}


.dark .loading,
.dark .error,
.dark .empty-state {
  background:
    radial-gradient(circle at top left, var(--fishx-gold-soft), transparent 50%),
    var(--vp-c-bg-soft);
  border-color: var(--fishx-warm-border);
}

@keyframes shimmer {
  to { transform: translateX(100%); }
}

@keyframes loading-bar {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ── Responsive ── */
@media (max-width: 960px) {
  .pricing-layout {
    grid-template-columns: 1fr;
  }

  .filter-panel {
    position: static;
    gap: 12px;
  }

  .filter-block {
    padding: 14px;
  }

  .filter-stack {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;
  }

  .filter-pill,
  .filter-pill.soft {
    width: auto;
    flex: 0 0 auto;
    white-space: nowrap;
  }

  .hero-card {
    flex-direction: column;
  }

  .hero-side {
    min-width: 0;
  }

  .model-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 640px) {
  .dynamic-model-list {
    margin: 20px 0;
  }

  .filter-block,
  .hero-card,
  .vendor-section,
  .loading,
  .error,
  .empty-state {
    padding: 16px;
    border-radius: 20px;
  }

  .hero-card {
    padding: 20px;
  }

  .hero-title {
    font-size: 22px;
  }

  .hero-text {
    font-size: 13px;
  }

  .stat-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-value {
    font-size: 22px;
  }

  .model-card-head {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .model-meta-top {
    align-items: center;
  }

  .copy-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 14px;
  }

  .card-actions {
    flex-direction: column;
    align-items: start;
    gap: 8px;
  }

  .section-title {
    font-size: 18px;
  }

  .model-card {
    padding: 14px;
  }

  .model-id {
    width: 100%;
    box-sizing: border-box;
  }

  .model-grid {
    grid-template-columns: 1fr;
  }

  /* modal on small screens */
  .detail-backdrop {
    padding: 12px;
    align-items: flex-end;
  }

  .detail-modal {
    width: 100%;
    max-height: 88vh;
    border-radius: 20px 20px 16px 16px;
  }

  .modal-model-name {
    font-size: 12px;
  }

  .pricing-table th,
  .pricing-table td {
    padding: 7px 10px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .detail-backdrop {
    padding: 0;
    align-items: flex-end;
  }

  .detail-modal {
    width: 100%;
    max-height: 92vh;
    border-radius: 16px 16px 0 0;
  }

  .detail-modal-header {
    padding: 16px 16px 12px;
  }

  .detail-modal-body {
    padding: 14px 16px 20px;
    gap: 16px;
  }
}
</style>
