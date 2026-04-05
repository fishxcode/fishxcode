type DurationUnit = "day" | "month" | "year" | string;
type QuotaResetPeriod = "never" | "daily" | "monthly" | string;
type CycleKey = "daily" | "weekly" | "monthly";
type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

type Env = {
  LANDING_KV?: KVNamespace;
  SUBSCRIPTION_API_URL?: string;
  SUBSCRIPTION_ACCESS_TOKEN?: string;
  SUBSCRIPTION_USER_ID?: string;
  SUBSCRIPTION_JSON?: string;
};

type RawSubscriptionPlan = {
  id: number;
  title: string;
  subtitle: string;
  price_amount: number;
  currency: string;
  duration_unit: DurationUnit;
  duration_value: number;
  enabled: boolean;
  total_amount: number;
  quota_reset_period: QuotaResetPeriod;
};

const SUB_CYCLES: { key: CycleKey; label: string }[] = [
  { key: "daily", label: "天订阅" },
  { key: "weekly", label: "周订阅" },
  { key: "monthly", label: "月订阅" },
];

type GroupKey = "claude" | "codex" | "other";

function formatResetRuleLabel(period: QuotaResetPeriod): string {
  if (period === "never") return "订阅周期内不重置（用完或到期结束）";
  if (period === "daily") return "每日重置（按自然日刷新）";
  if (period === "monthly") return "每月重置（按自然月刷新）";
  return "按平台规则重置";
}

function formatDurationLabel(unit: DurationUnit, value: number): string {
  if (unit === "day") return `${value}天`;
  if (unit === "month") return `${value}个月`;
  if (unit === "year") return `${value}年`;
  return `${value}${unit}`;
}

function matchCycle(plan: RawSubscriptionPlan, cycle: CycleKey): boolean {
  if (cycle === "daily") return plan.duration_unit === "day" && plan.duration_value === 1;
  if (cycle === "weekly") return plan.duration_unit === "day" && plan.duration_value === 7;
  return plan.duration_unit === "month" && plan.duration_value === 1;
}

function detectGroupKey(title: string): GroupKey {
  const lowered = title.toLowerCase();
  if (lowered.includes("claude")) return "claude";
  if (lowered.includes("codex")) return "codex";
  return "other";
}

function resolveCycleKey(plan: RawSubscriptionPlan): CycleKey | null {
  if (matchCycle(plan, "daily")) return "daily";
  if (matchCycle(plan, "weekly")) return "weekly";
  if (matchCycle(plan, "monthly")) return "monthly";
  return null;
}

function buildSubscriptionMatrix(plans: RawSubscriptionPlan[]) {
  const enabledPlans = plans.filter((plan) => plan.enabled);

  const groupedByProduct: Record<GroupKey, RawSubscriptionPlan[]> = {
    claude: [],
    codex: [],
    other: [],
  };

  for (const plan of enabledPlans) {
    groupedByProduct[detectGroupKey(plan.title)].push(plan);
  }

  const cycleOrder: Record<CycleKey, number> = { daily: 0, weekly: 1, monthly: 2 };
  const groupOrder: Record<GroupKey, number> = { claude: 0, codex: 1, other: 2 };
  const groupLabel: Record<GroupKey, string> = { claude: "Claude 套餐", codex: "Codex 套餐", other: "其他套餐" };

  const groups = (Object.keys(groupedByProduct) as GroupKey[])
    .filter((groupKey) => groupedByProduct[groupKey].length > 0)
    .sort((a, b) => groupOrder[a] - groupOrder[b])
    .map((groupKey) => {
      const items = groupedByProduct[groupKey]
        .map((plan) => {
          const cycleKey = resolveCycleKey(plan);
          return {
            id: plan.id,
            title: plan.title,
            subtitle: plan.subtitle,
            priceAmount: plan.price_amount,
            currency: plan.currency,
            cycleKey,
            durationLabel: formatDurationLabel(plan.duration_unit, plan.duration_value),
            resetRuleLabel: formatResetRuleLabel(plan.quota_reset_period),
            totalAmount: plan.total_amount,
          };
        })
        .sort((a, b) => {
          const cycleA = a.cycleKey ? cycleOrder[a.cycleKey] : 99;
          const cycleB = b.cycleKey ? cycleOrder[b.cycleKey] : 99;
          if (cycleA !== cycleB) return cycleA - cycleB;
          return a.priceAmount - b.priceAmount;
        });

      return {
        groupKey,
        label: groupLabel[groupKey],
        plans: items,
      };
    });

  return { groups };
}

const VISIT_COUNTER_KEY = "landing:visits";

// ─── robots.txt ────────────────────────────────────────────────────────────
const ROBOTS_TXT = `User-agent: *
Allow: /
Sitemap: https://fishxcode.com/sitemap.xml`;

// ─── sitemap.xml ───────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0];
const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://fishxcode.com/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://doc.fishxcode.com/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doc.fishxcode.com/account</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://doc.fishxcode.com/start</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://doc.fishxcode.com/faq</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

// ─── manifest.json ─────────────────────────────────────────────────────────
const MANIFEST_JSON = JSON.stringify({
  name: "FishXCode - AI Coding 中转站",
  short_name: "FishXCode",
  description: "支持 Claude、Codex 等主流 AI 模型的 Coding 中转站",
  start_url: "/",
  display: "standalone",
  background_color: "#fdf9f5",
  theme_color: "#c9973e",
  orientation: "portrait-primary",
  lang: "zh-CN",
  categories: ["productivity", "developer-tools"],
  icons: [
    {
      src: "https://free.picui.cn/free/2026/02/11/698c585ee1b64.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
});

// ─── sw.js ─────────────────────────────────────────────────────────────────
const SW_JS = `const CACHE = 'fishxcode-v1';
const SHELL = ['/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')));
  }
});`;

type SubscriptionPayload = {
  data?: Array<{ plan?: RawSubscriptionPlan }>;
};

function parseSubscriptionPlans(raw: string | undefined): RawSubscriptionPlan[] {
  if (!raw) return [];

  try {
    const payload = JSON.parse(raw) as SubscriptionPayload;
    return (payload.data ?? [])
      .map((item) => item.plan)
      .filter((plan): plan is RawSubscriptionPlan => Boolean(plan));
  } catch {
    return [];
  }
}

function getSubscriptionConfig(env: Env) {
  return {
    apiUrl: env.SUBSCRIPTION_API_URL?.trim() ?? "",
    accessToken: env.SUBSCRIPTION_ACCESS_TOKEN?.trim() ?? "",
    userId: env.SUBSCRIPTION_USER_ID?.trim() ?? "",
    localJson: env.SUBSCRIPTION_JSON?.trim() ?? "",
  };
}

async function fetchRemoteSubscriptionPlans(env: Env): Promise<RawSubscriptionPlan[]> {
  const config = getSubscriptionConfig(env);
  if (!config.apiUrl || !config.accessToken) return [];

  try {
    const resp = await fetch(config.apiUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.accessToken}`,
        ...(config.userId ? { "New-Api-User": config.userId } : {}),
      },
    });

    if (!resp.ok) return [];

    const payload = (await resp.json()) as SubscriptionPayload;
    return (payload.data ?? [])
      .map((item) => item.plan)
      .filter((plan): plan is RawSubscriptionPlan => Boolean(plan));
  } catch {
    return [];
  }
}

async function getSubscriptionPlans(env: Env): Promise<{ plans: RawSubscriptionPlan[]; source: "remote" | "local" | "empty" }> {
  const remotePlans = await fetchRemoteSubscriptionPlans(env);
  if (remotePlans.length > 0) {
    return { plans: remotePlans, source: "remote" };
  }

  const localPlans = parseSubscriptionPlans(getSubscriptionConfig(env).localJson);
  if (localPlans.length > 0) {
    return { plans: localPlans, source: "local" };
  }

  return { plans: [], source: "empty" };
}

async function incrementVisitCount(env: Env): Promise<number> {
  const kv = env.LANDING_KV;
  if (!kv) return 1;

  const current = Number(await kv.get(VISIT_COUNTER_KEY)) || 0;
  const next = current + 1;
  await kv.put(VISIT_COUNTER_KEY, String(next));
  return next;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function buildHtml(visitCount: number): string { return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- ═══ Primary SEO ═══ -->
  <title>FishXCode · 订阅制 Claude Codex 国际中转站 | 个人/团队主打订阅包月制</title>
  <meta name="description" content="FishXCode 是订阅制 Claude Codex 国际中转站，面向个人与团队，主打订阅包月制，同时支持天卡、周卡与月度订阅套餐。" />
  <meta name="keywords" content="订阅制,Claude,Codex,国际中转站,包月,个人,团队,AI Coding,FishXCode" />
  <meta name="author" content="FishXCode" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://fishxcode.com/" />

  <!-- ═══ Favicon ═══ -->
  <link rel="icon" type="image/png" href="https://free.picui.cn/free/2026/02/11/698c585ee1b64.png" />
  <link rel="apple-touch-icon" href="https://free.picui.cn/free/2026/02/11/698c585ee1b64.png" />

  <!-- ═══ Open Graph ═══ -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="FishXCode" />
  <meta property="og:title" content="FishXCode · 订阅制 Claude Codex 国际中转站" />
  <meta property="og:description" content="主打订阅包月制，支持个人与团队订阅方案，覆盖天卡、周卡、月度套餐。" />
  <meta property="og:image" content="https://free.picui.cn/free/2026/02/11/698c585ee1b64.png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:url" content="https://fishxcode.com/" />
  <meta property="og:locale" content="zh_CN" />

  <!-- ═══ Twitter / X Card ═══ -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@fishxcode" />
  <meta name="twitter:title" content="FishXCode · 订阅制 Claude Codex 国际中转站" />
  <meta name="twitter:description" content="主打订阅包月制，面向个人与团队的 Claude/Codex 国际中转订阅服务。" />
  <meta name="twitter:image" content="https://free.picui.cn/free/2026/02/11/698c585ee1b64.png" />

  <!-- ═══ Schema.org JSON-LD ═══ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FishXCode",
    "url": "https://fishxcode.com/",
    "description": "AI Coding 中转站，支持 Claude、Codex 等主流模型",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://doc.fishxcode.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  <\/script>

  <!-- ═══ PWA ═══ -->
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#c9973e" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="FishXCode" />

  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: #c9973e;
      --primary-light: #d4b04a;
      --primary-soft: #fdf2e0;
      --accent: #de7898;
      /* light theme tokens */
      --bg: #fdf9f5;
      --bg-soft: #f8f2ea;
      --surface: #ffffff;
      --surface-border: rgba(185,134,46,0.12);
      --text: #2d200e;
      --text-muted: #6b7280;
      --text-sub: #9ca3af;
      --nav-bg: rgba(253,249,245,0.88);
      --nav-border: rgba(185,134,46,0.12);
      --card-shadow: 0 4px 24px rgba(185,134,46,0.07);
      --card-shadow-hover: 0 20px 48px rgba(185,134,46,0.16);
      --glass-bg: rgba(255,255,255,0.72);
      --glass-border: rgba(255,255,255,0.5);
      --footer-bg: #1c1814;
      --footer-text: #f5e6c8;
      --scrollbar: rgba(185,134,46,0.4);
      --divider: rgba(185,134,46,0.22);
      --blob-opacity: 0.18;
    }

    [data-theme="dark"] {
      --bg: #1c1814;
      --bg-soft: #231f1a;
      --surface: #2a251f;
      --surface-border: rgba(196,148,56,0.16);
      --text: #e2d8c8;
      --text-muted: #94a3b8;
      --text-sub: #64748b;
      --nav-bg: rgba(28,24,20,0.92);
      --nav-border: rgba(196,148,56,0.14);
      --card-shadow: 0 4px 24px rgba(0,0,0,0.3);
      --card-shadow-hover: 0 20px 48px rgba(196,148,56,0.22);
      --glass-bg: rgba(28,24,20,0.82);
      --glass-border: rgba(196,148,56,0.18);
      --footer-bg: #14100c;
      --footer-text: #f0d9a8;
      --scrollbar: rgba(196,148,56,0.32);
      --divider: rgba(196,148,56,0.18);
      --blob-opacity: 0.08;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
      background: var(--bg);
      color: var(--text);
      overflow-x: hidden;
      transition: background 0.3s, color 0.3s;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 3px; }

    /* Gradient utilities */
    .grad-text {
      background: linear-gradient(135deg, #c9973e 0%, #de7898 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .grad-bg { background: linear-gradient(135deg, #c9973e 0%, #de7898 100%); }

    .grad-bg-soft {
      background: var(--bg-soft);
    }

    /* Glass morphism */
    .glass {
      background: var(--glass-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
    }

    /* Cards */
    .card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 20px;
      box-shadow: var(--card-shadow);
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .card:hover {
      transform: translateY(-8px);
      box-shadow: var(--card-shadow-hover);
      border-color: rgba(185, 134, 46, 0.28);
    }

    /* Navigation */
    .nav-blur {
      background: var(--nav-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--nav-border);
    }

    /* Blobs */
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: var(--blob-opacity);
      pointer-events: none;
    }

    /* Button */
    .btn-primary {
      background: linear-gradient(135deg, #c9973e 0%, #de7898 100%);
      color: #fff;
      border-radius: 12px;
      padding: 14px 32px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(185, 134, 46, 0.35);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(185, 134, 46, 0.45);
    }

    .btn-ghost {
      background: var(--surface);
      color: #7a5020;
      border: 2px solid #f0e0b0;
      border-radius: 12px;
      padding: 12px 30px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    [data-theme="dark"] .btn-ghost { color: #e0c870; border-color: #7a5020; }
    .btn-ghost:hover {
      background: var(--primary-soft);
      border-color: #d4b04a;
      transform: translateY(-2px);
    }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      background: var(--primary-soft);
      color: var(--primary);
      border: 1px solid #f0e0b0;
    }
    [data-theme="dark"] .badge { background: rgba(185,134,46,0.18); border-color: rgba(185,134,46,0.3); }

    /* Divider */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--divider), transparent);
      margin: 0 auto;
      max-width: 1152px;
    }

    /* Step number */
    .step-num {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 16px; flex-shrink: 0;
      background: linear-gradient(135deg, #c9973e 0%, #de7898 100%);
      color: #fff;
    }

    /* Tool tag */
    .tool-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 16px; border-radius: 10px;
      background: var(--bg-soft);
      border: 1px solid var(--surface-border);
      color: var(--text);
      font-size: 14px; font-weight: 500;
      transition: all 0.2s;
    }
    .tool-tag:hover { background: var(--primary-soft); border-color: #d4b04a; }

    /* Migration card */
    .migration-card {
      background: linear-gradient(135deg, #fefce8 0%, #fff7ed 100%);
      border: 2px solid #fde68a;
      border-radius: 24px;
      padding: 40px;
    }
    [data-theme="dark"] .migration-card {
      background: linear-gradient(135deg, #1c1a0a 0%, #1c130a 100%);
      border-color: #713f12;
    }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes floatY {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }

    @keyframes pulse-ring {
      0%   { transform: scale(0.9); opacity: 0.6; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    .anim-fade-up   { animation: fadeUp 0.7s ease-out both; }
    .anim-fade-in   { animation: fadeIn 0.7s ease-out both; }
    .anim-float     { animation: floatY 4s ease-in-out infinite; }

    .delay-1 { animation-delay: 0.15s; }
    .delay-2 { animation-delay: 0.30s; }
    .delay-3 { animation-delay: 0.45s; }
    .delay-4 { animation-delay: 0.60s; }
    .delay-5 { animation-delay: 0.75s; }

    /* Scroll reveal (JS fallback) */
    .reveal { opacity: 0; transform: translateY(24px); transition: all 0.6s ease-out; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* Footer link */
    .foot-link {
      color: var(--text-muted);
      font-size: 14px;
      transition: color 0.2s;
      text-decoration: none;
    }
    .foot-link:hover { color: #c9973e; }

    .support-qr-list {
      display: grid;
      gap: 10px;
    }
    .support-qr-trigger {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: 10px;
      border: 1px solid rgba(224, 200, 112, 0.25);
      background: rgba(224, 200, 112, 0.08);
      text-decoration: none;
      color: #e0c870;
      font-size: 13px;
      line-height: 1.4;
      transition: all 0.2s ease;
    }
    .support-qr-trigger:hover {
      border-color: rgba(224, 200, 112, 0.45);
      background: rgba(224, 200, 112, 0.16);
      transform: translateY(-1px);
    }
    .support-qr-thumb {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      object-fit: cover;
      background: #fff;
      border: 1px solid rgba(224, 200, 112, 0.35);
      flex-shrink: 0;
    }

    .support-gallery {
      position: fixed;
      inset: 0;
      z-index: 1200;
      display: none;
    }
    .support-gallery.open { display: block; }
    .support-gallery-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(2px);
    }
    .support-gallery-panel {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
    }
    .support-gallery-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.3);
      background: rgba(0,0,0,0.5);
      color: #fff;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      z-index: 2;
    }
    .support-gallery-stage {
      width: min(92vw, 740px);
      height: min(74vh, 740px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 14px;
      background: rgba(17, 17, 17, 0.72);
      border: 1px solid rgba(255,255,255,0.18);
      touch-action: none;
      user-select: none;
    }
    .support-gallery-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transform-origin: center center;
      transition: transform 0.15s ease;
      will-change: transform;
    }
    .support-gallery-caption {
      color: #f8e7b8;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      max-width: min(92vw, 740px);
    }
    .support-gallery-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .support-gallery-btn {
      border: 1px solid rgba(255,255,255,0.28);
      background: rgba(0,0,0,0.45);
      color: #fff;
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      min-width: 44px;
    }
    .support-gallery-counter {
      color: #d1d5db;
      font-size: 13px;
      min-width: 56px;
      text-align: center;
    }
    body.support-gallery-open { overflow: hidden; }

    [data-theme="dark"] .text-gray-900 { color: #e2d8c8 !important; }
    [data-theme="dark"] .text-gray-800 { color: #cdc4b4 !important; }
    [data-theme="dark"] .text-gray-700 { color: #94a3b8 !important; }
    [data-theme="dark"] .text-gray-600 { color: #64748b !important; }
    [data-theme="dark"] .text-gray-500 { color: #64748b !important; }
    [data-theme="dark"] .text-gray-400 { color: #475569 !important; }
    [data-theme="dark"] .border-purple-50 { border-color: rgba(185,134,46,0.18) !important; }
    [data-theme="dark"] .border-amber-200 { border-color: #7a5020 !important; }
    [data-theme="dark"] .tool-brand { background: var(--surface); border-color: var(--surface-border); }
    [data-theme="dark"] .cta-box {
      background: linear-gradient(135deg, #1a1510 0%, #150f0a 50%, #0f0d0a 100%) !important;
      border-color: #7a5020 !important;
    }
    [data-theme="dark"] .cta-box h2 { color: #e2d8c8 !important; }
    [data-theme="dark"] .cta-box p { color: #94a3b8 !important; }

    [data-theme="dark"] .url-bar { background: var(--surface); border-color: #7a5020; }
    [data-theme="dark"] .url-bar-text { color: #e0c870; }
    [data-theme="dark"] section[style*="background:linear-gradient(135deg,#fdf2e0"] {
      background: linear-gradient(135deg, #231f1a 0%, #1c1510 50%, #150f0a 100%) !important;
      border-color: #7a5020 !important;
    }

    /* iframe detection: hide own nav, add top offset for parent nav */
    body.in-iframe { padding-top: 64px !important; }
    body.in-iframe nav.nav-blur { display: none !important; }
    body.in-iframe section:first-of-type { padding-top: 16px !important; min-height: calc(100vh - 64px) !important; }

    /* In-iframe light mode: footer 使用浅色背景，防止深色 footer 透过父页面透明 header 显现 */
    body.in-iframe footer {
      background: var(--bg-soft) !important;
      border-top: 1px solid var(--surface-border) !important;
    }
    body.in-iframe footer,
    body.in-iframe footer * { color: var(--text-muted) !important; }
    body.in-iframe footer h4,
    body.in-iframe footer .text-lg { color: var(--text) !important; }
    body.in-iframe footer a,
    body.in-iframe footer .foot-link { color: var(--primary) !important; }
    body.in-iframe footer a:hover,
    body.in-iframe footer .foot-link:hover { opacity: 0.75; }
    body.in-iframe footer [style*="background:rgba(165"] { background: var(--surface-border) !important; }

    /* In-iframe dark mode: 恢复深色 footer（深色模式下父页面 header 也是深色，无透明溢出问题） */
    [data-theme="dark"] body.in-iframe footer { background: var(--footer-bg) !important; border-top: none !important; }
    [data-theme="dark"] body.in-iframe footer,
    [data-theme="dark"] body.in-iframe footer * { color: var(--footer-text) !important; }
    [data-theme="dark"] body.in-iframe footer h4,
    [data-theme="dark"] body.in-iframe footer .text-lg { color: #fff !important; }
    [data-theme="dark"] body.in-iframe footer a,
    [data-theme="dark"] body.in-iframe footer .foot-link { color: #e0c870 !important; }

    /* Terminal window */
    .terminal {
      background: #2a251f;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.25);
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
      font-size: 13px;
      line-height: 1.7;
      text-align: left;
    }
    .terminal-bar {
      background: #1c1814;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .terminal-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .terminal-body {
      padding: 18px 22px;
      color: #a3b8d0;
      overflow-x: auto;
    }
    .terminal-docs {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
    }
    .terminal-doc-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 8px;
      padding: 6px 10px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid rgba(163,184,208,0.2);
      color: #a3b8d0;
      background: rgba(163,184,208,0.08);
      transition: all 0.2s;
    }
    .terminal-doc-link.primary {
      color: #86efac;
      border-color: rgba(134,239,172,0.35);
      background: rgba(134,239,172,0.1);
    }
    .terminal-doc-link:hover { opacity: 0.9; }
    .terminal-tabs {
      display: inline-flex;
      gap: 8px;
      margin-bottom: 14px;
    }
    .terminal-tab {
      background: rgba(163,184,208,0.12);
      color: #a3b8d0;
      border: 1px solid rgba(163,184,208,0.2);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .terminal-tab.active {
      color: #2a251f;
      background: #86efac;
      border-color: #86efac;
    }
    #terminalContent p { margin: 0; }
    .terminal-body .cm { color: #6a7a8e; }
    .terminal-body .kw { color: #c084fc; }
    .terminal-body .str { color: #86efac; }
    .terminal-body .var { color: #93c5fd; }
    .terminal-body .op { color: #fbbf24; }
    .terminal-body .run { color: #34d399; }

    /* Copyable URL bar */
    .url-bar {
      display: flex;
      align-items: center;
      gap: 0;
      background: #fff;
      border: 2px solid #f0e0b0;
      border-radius: 12px;
      padding: 4px;
      max-width: 480px;
      margin: 0 auto;
      transition: border-color 0.2s;
    }
    .url-bar:hover { border-color: #d4b04a; }
    .url-bar-text {
      flex: 1;
      padding: 8px 14px;
      font-family: 'SF Mono', monospace;
      font-size: 14px;
      color: #c9973e;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: all;
    }
    .url-bar-btn {
      flex-shrink: 0;
      background: linear-gradient(135deg, #c9973e, #de7898);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .url-bar-btn:hover { opacity: 0.9; transform: scale(1.02); }
    .url-bar-btn.copied { background: linear-gradient(135deg, #10b981, #059669); }

    /* Tool brand card */
    .tool-brand {
      background: #fff;
      border: 1px solid rgba(124,58,237,0.08);
      border-radius: 16px;
      padding: 28px;
      text-align: center;
      transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow: 0 2px 12px rgba(99,102,241,0.05);
    }
    .tool-brand:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(99,102,241,0.14);
      border-color: rgba(124,58,237,0.2);
    }
    .tool-brand-icon {
      width: 56px; height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 28px;
    }

    /* Subscription groups */
    .subscription-wrap {
      display: grid;
      gap: 14px;
    }
    .sub-group {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 18px;
      box-shadow: var(--card-shadow);
      overflow: hidden;
    }
    .sub-group-head {
      width: 100%;
      border: 0;
      background: var(--bg-soft);
      color: var(--text);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      font-weight: 700;
      font-size: 15px;
      text-align: left;
    }
    .sub-group-meta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
    }
    .sub-group-chevron {
      transition: transform 0.2s ease;
      display: inline-flex;
      align-items: center;
    }
    .sub-group.open .sub-group-chevron { transform: rotate(90deg); }
    .sub-group-body {
      display: none;
      padding: 14px;
      background: var(--surface);
    }
    .sub-group.open .sub-group-body { display: block; }
    .sub-cards {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
    .sub-cell {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      padding: 14px;
    }
    .sub-title { font-size: 14px; font-weight: 700; color: var(--text); }
    .sub-cycle {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      color: #7a5020;
      background: var(--bg-soft);
      border: 1px solid var(--surface-border);
      margin-bottom: 8px;
    }
    [data-theme="dark"] .sub-cycle { color: #e0c870; }
    .sub-price { font-size: 24px; line-height: 1.1; font-weight: 800; color: #c9973e; margin-top: 8px; }
    .sub-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 8px; }
    .sub-expand {
      margin-top: 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #7a5020;
      cursor: pointer;
      background: transparent;
      border: 0;
      padding: 0;
      font-weight: 600;
    }
    [data-theme="dark"] .sub-expand { color: #e0c870; }
    .sub-detail {
      margin-top: 10px;
      background: var(--bg-soft);
      border: 1px solid var(--surface-border);
      border-radius: 10px;
      padding: 10px;
      display: none;
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .sub-detail.open { display: block; }
    .sub-coming {
      display: inline-flex;
      padding: 6px 10px;
      border-radius: 999px;
      background: var(--bg-soft);
      border: 1px solid var(--surface-border);
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }


    @media (max-width: 640px) {
      /* 终端在小屏上字体缩小，确保不横溢 */
      .terminal { font-size: 11px; }
      .terminal-body { padding: 14px 16px; }

      /* URL bar 在小屏上换行 */
      .url-bar { flex-wrap: wrap; max-width: 100%; }
      .url-bar-text { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .url-bar-btn { width: 100%; justify-content: center; border-radius: 6px; margin-top: 2px; }

      .subscription-wrap { border-radius: 16px; }
      .sub-cards { grid-template-columns: 1fr; }

      /* 迁移卡片内边距缩小 */
      .migration-card { padding: 24px 20px; }

      /* CTA 内边距缩小 */
      section .max-w-6xl > div[style*="border-radius:28px"] { padding: 36px 20px !important; }

      /* 工具品牌卡片紧凑 */
      .tool-brand { padding: 20px; }
    }

    @media (max-width: 480px) {
      /* Hero 标题字号在超小屏进一步缩小 */
      h1 { font-size: 2.4rem !important; line-height: 1.15 !important; }
      /* badge 字号缩小 */
      .badge { font-size: 12px; padding: 5px 12px; }
    }
  </style>
</head>
<body>
  <script>
    // ─── iframe 检测 ─────────────────────────────────────────────────────────
    var _isIframe = false;
    try { _isIframe = window.self !== window.top; } catch(e) { _isIframe = true; }
    if (_isIframe) document.body.classList.add('in-iframe');

    // ─── 主题同步 ─────────────────────────────────────────────────────────────
    (function() {
      function applyTheme(mode) {
        // 支持：'dark' | 'light' | 'auto' | null
        if (mode === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (mode === 'light') {
          document.documentElement.removeAttribute('data-theme');
        } else {
          // auto / null：跟随系统
          var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (dark) document.documentElement.setAttribute('data-theme', 'dark');
          else document.documentElement.removeAttribute('data-theme');
        }
      }

      // 初始化：先跟随系统，等待父窗口 postMessage 覆盖
      applyTheme(null);

      // 监听系统偏好变化（独立访问或 auto 模式下生效）
      try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
          // 只有没收到过父窗口主题时才响应系统变化
          if (!window._parentThemeSet) applyTheme(null);
        });
      } catch(e) {}

      // 监听父窗口 postMessage：主题同步 + 语言同步
      // fishxcode.com 发送 {themeMode:'dark'|'light'} 和 {lang:'zh-CN'|'en'|...}
      window.addEventListener('message', function(e) {
        if (e.data && typeof e.data === 'object') {
          if ('themeMode' in e.data) {
            window._parentThemeSet = true;
            applyTheme(e.data.themeMode);
          }
          if ('lang' in e.data) {
            applyLang(e.data.lang);
          }
        }
      });

      // 在 iframe 中：通知父页面隐藏 .semi-layout-footer
      if (_isIframe) {
        try { window.parent.postMessage({ action: 'hideFooter' }, '*'); } catch(e) {}
      }
    })();
  </script>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║         NAVIGATION           ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="https://fishxcode.com/" target="_blank" class="flex items-center gap-2.5 group" style="text-decoration:none">
          <div class="w-9 h-9 rounded-xl grad-bg flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform">
            F
          </div>
          <span class="font-bold text-gray-900 text-base hidden sm:block">FishXCode</span>
        </a>

        <!-- Nav Links -->
        <div class="flex items-center gap-2 sm:gap-4">
          <a href="https://doc.fishxcode.com/" target="_blank" class="text-gray-600 hover:text-purple-700 transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
            <span data-i18n="nav.docs">文档</span>
          </a>
          <a href="https://doc.fishxcode.com/start" target="_blank" class="text-gray-600 hover:text-purple-700 transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-purple-50 hidden sm:block">
            <span data-i18n="nav.start">快速开始</span>
          </a>
          <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="btn-primary text-sm" style="padding:10px 22px">
            <span data-i18n="nav.enter">进入平台</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║           HERO               ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <section class="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <!-- Background blobs -->
    <div class="blob w-96 h-96 bg-purple-400 top-10 -left-20"></div>
    <div class="blob w-80 h-80 bg-indigo-400 bottom-10 -right-10"></div>
    <div class="blob w-64 h-64 bg-violet-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

    <div class="relative max-w-4xl mx-auto text-center">

      <!-- Badge -->
      <div class="anim-fade-up mb-6">
        <span class="badge">
          <span class="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
          <span data-i18n="hero.badge">订阅制 Claude · Codex｜个人与团队国际中转站</span>
        </span>
      </div>

      <!-- Headline -->
      <h1 class="anim-fade-up delay-1 text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
        <span class="grad-text">AI Coding</span>
        <br/>
        <span class="text-gray-900" data-i18n="hero.title">订阅制 Claude Codex 个人/团队国际中转站</span>
      </h1>

      <!-- Subline -->
      <p class="anim-fade-up delay-2 text-lg sm:text-xl text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed" data-i18n="hero.desc">
        主打订阅包月制，同时支持天卡与周卡，覆盖个人与团队的国际中转订阅需求
      </p>
      <p class="anim-fade-up delay-2 text-base sm:text-lg font-semibold grad-text mb-10" data-i18n="hero.bonus">
        注册送 Token · 每日签到送 Token · 邀请好友再送 Token
      </p>

      <!-- CTA Buttons -->
      <div class="anim-fade-up delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="btn-primary text-base" style="padding:16px 36px;justify-content:center">
          <span data-i18n="hero.btn1">立即注册，按需订阅</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="https://doc.fishxcode.com/" target="_blank" class="btn-ghost text-base" style="padding:14px 36px;justify-content:center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span data-i18n="hero.btn2">查看使用文档</span>
        </a>
      </div>

      <!-- Hero Stats -->
      <div class="anim-fade-up delay-4 mb-10">
        <div class="glass rounded-2xl px-6 py-5 inline-grid grid-cols-3 gap-8 sm:gap-12 shadow-xl">
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-black grad-text mb-1">⚡</div>
            <div class="text-xs sm:text-sm text-gray-500 font-medium" data-i18n="hero.stat1">低延迟响应</div>
          </div>
          <div class="text-center border-x border-purple-100 px-4">
            <div class="flex justify-center mb-1">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" stroke-width="2.2">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c9973e"/><stop offset="100%" stop-color="#de7898"/></linearGradient></defs>
                <path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>
              </svg>
            </div>
            <div class="text-xs sm:text-sm text-gray-500 font-medium" data-i18n="hero.stat2">多模型切换</div>
          </div>
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-black grad-text mb-1">🛠️</div>
            <div class="text-xs sm:text-sm text-gray-500 font-medium" data-i18n="hero.stat3">全工具支持</div>
          </div>
        </div>
      </div>

      <!-- Copy URL Bar -->
      <div class="anim-fade-up delay-4 mb-10">
        <p class="text-gray-400 text-xs mb-2 tracking-wide"><span data-i18n="hero.urlHint">▸ 替换 Base URL 即可接入</span></p>
        <div class="url-bar">
          <span class="url-bar-text" id="apiUrl">https://fishxcode.com</span>
          <button class="url-bar-btn" id="copyBtn" onclick="copyUrl()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span data-i18n="hero.copy">复制</span>
          </button>
        </div>
      </div>

      <!-- Terminal Code Preview -->
      <div class="anim-fade-up delay-5 max-w-lg mx-auto">
        <div class="terminal">
          <div class="terminal-bar">
            <span class="terminal-dot" style="background:#ff5f57"></span>
            <span class="terminal-dot" style="background:#febc2e"></span>
            <span class="terminal-dot" style="background:#28c840"></span>
            <span style="color:#6a7a8e;font-size:12px;margin-left:8px;font-family:inherit">TERMINAL — zsh</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-docs">
              <a id="terminalPrimaryDoc" href="https://doc.fishxcode.com/start" target="_blank" class="terminal-doc-link primary"></a>
              <a id="terminalSecondaryDoc" href="https://doc.fishxcode.com/codex" target="_blank" class="terminal-doc-link secondary"></a>
            </div>
            <div class="terminal-tabs" role="tablist" aria-label="Tool Tabs">
              <button id="terminalTabClaude" class="terminal-tab active" role="tab" aria-selected="true" onclick="setTerminalTab('claude')" data-i18n="terminal.tab.claude">Claude</button>
              <button id="terminalTabCodex" class="terminal-tab" role="tab" aria-selected="false" onclick="setTerminalTab('codex')" data-i18n="terminal.tab.codex">Codex</button>
            </div>
            <div id="terminalContent"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="divider px-6"></div>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║      SUBSCRIPTION MATRIX     ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <section class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto reveal">
      <div class="text-center mb-12">
        <span class="badge mb-4" data-i18n="sub.badge">主打订阅制套餐</span>
        <h2 class="text-4xl sm:text-5xl font-black text-gray-900 mb-4" data-i18n="sub.title">统一价格矩阵：天 / 周 / 月</h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto" data-i18n="sub.desc">覆盖个人、团队、企业三类使用场景，按需选择订阅周期与档位</p>
      </div>

      <div class="subscription-wrap" id="subscriptionMatrix"></div>

      <div class="text-center mt-8">
        <a href="https://fishxcode.com/console/topup" target="_blank" class="btn-primary text-base" style="padding:14px 34px;justify-content:center">
          <span data-i18n="sub.cta">前往充值并选择订阅套餐</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║          FEATURES            ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <section class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="badge mb-4" data-i18n="feat.badge">核心优势</span>
        <h2 class="text-4xl sm:text-5xl font-black text-gray-900 mb-4" data-i18n="feat.title">
          为什么开发者选择 FishXCode？
        </h2>
        <p class="text-gray-500 text-lg max-w-xl mx-auto" data-i18n="feat.desc">
          专为 AI Coding 场景打磨，省去一切繁琐配置
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mb-16">
        <!-- F1 -->
        <div class="card p-8 reveal">
          <div class="w-12 h-12 rounded-2xl grad-bg-soft flex items-center justify-center text-2xl mb-5">⚡</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2" data-i18n="feat.f1.title">极致编码提效</h3>
          <p class="text-gray-500 text-sm leading-relaxed" data-i18n="feat.f1.desc">专为程序员优化的响应链路，支持流式输出，让代码生成几乎零感知延迟</p>
        </div>
        <!-- F2 -->
        <div class="card p-8 reveal" style="transition-delay:0.1s">
          <div class="w-12 h-12 rounded-2xl grad-bg-soft flex items-center justify-center text-2xl mb-5">🔧</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2" data-i18n="feat.f2.title">多端完美适配</h3>
          <p class="text-gray-500 text-sm leading-relaxed" data-i18n="feat.f2.desc">完美集成 Claude Code、Codex 等生产力工具，一键替换 API 地址即可起飞</p>
        </div>
        <!-- F3 -->
        <div class="card p-8 reveal" style="transition-delay:0.2s">
          <div class="w-12 h-12 rounded-2xl grad-bg-soft flex items-center justify-center text-2xl mb-5">📦</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2" data-i18n="feat.f3.title">开箱即用</h3>
          <p class="text-gray-500 text-sm leading-relaxed" data-i18n="feat.f3.desc">注册账户后立即可用，无需繁琐的本地配置，5 分钟内接入完整 AI 工作流</p>
        </div>
      </div>

      <!-- Tool Brand Cards -->
      <div class="text-center mb-10 reveal">
        <span class="badge mb-4" data-i18n="brand.badge">原生支持</span>
        <h3 class="text-2xl sm:text-3xl font-black text-gray-900" data-i18n="brand.title">极致工具链</h3>
        <p class="text-gray-500 text-sm mt-2" data-i18n="brand.desc">深度优化 API 路由，确保在 CLI 环境下依然拥有流畅的流式交互体验</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Claude Code -->
        <div class="tool-brand reveal">
          <div class="tool-brand-icon" style="background:linear-gradient(135deg,#fef3c7,#fde68a)">
            <span>🟠</span>
          </div>
          <span class="text-xs text-gray-400 font-semibold tracking-wider uppercase" data-i18n="brand.claude.label">Anthropic</span>
          <h4 class="text-lg font-bold text-gray-900 mt-1 mb-2">Claude Code</h4>
          <p class="text-gray-500 text-sm leading-relaxed" data-i18n="brand.claude.desc">代码执行能力强劲，高效理解需求，快速生成精准代码</p>
          <a href="https://doc.fishxcode.com/start" target="_blank" class="inline-flex items-center gap-1 text-purple-600 text-sm font-semibold mt-4 hover:underline">
            <span data-i18n="brand.guide">接入指南</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        <!-- Codex -->
        <div class="tool-brand reveal" style="transition-delay:0.1s">
          <div class="tool-brand-icon" style="background:linear-gradient(135deg,#fdf2e0,#f8e0c0)">
            <span>⚪</span>
          </div>
          <span class="text-xs text-gray-400 font-semibold tracking-wider uppercase" data-i18n="brand.codex.label">OpenAI</span>
          <h4 class="text-lg font-bold text-gray-900 mt-1 mb-2">OpenAI Codex</h4>
          <p class="text-gray-500 text-sm leading-relaxed" data-i18n="brand.codex.desc">深度思考模式，慢工出细活，复杂逻辑处理更严谨</p>
          <a href="https://doc.fishxcode.com/codex" target="_blank" class="inline-flex items-center gap-1 text-purple-600 text-sm font-semibold mt-4 hover:underline">
            <span data-i18n="brand.guide">接入指南</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <div class="divider px-6"></div>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║      TOOLS + QUICKSTART      ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <section class="py-24 px-4 sm:px-6 lg:px-8 grad-bg-soft">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="badge mb-4" data-i18n="compat.badge">全面兼容</span>
        <h2 class="text-4xl sm:text-5xl font-black text-gray-900 mb-4" data-i18n="compat.title">支持的工具 & 快速接入</h2>
        <p class="text-gray-500 text-lg" data-i18n="compat.desc">与你日常使用的所有 AI 开发工具无缝衔接</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Supported Tools -->
        <div class="card p-8 reveal">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-xl grad-bg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900" data-i18n="compat.listTitle">支持的工具清单</h3>
          </div>
          <div class="flex flex-wrap gap-3">
            <span class="tool-tag">🤖 Claude  Code</span>
            <span class="tool-tag">💻 OpenAI Codex</span>
            <span class="tool-tag">🦘 RooCode</span>
            <span class="tool-tag">🇨🇳 Qwen Code</span>
            <span class="tool-tag">🤖 Droid</span>
            <span class="tool-tag">💡 OpenCode</span>
          </div>
          <div class="mt-6 pt-6 border-t border-purple-50">
            <p class="text-sm text-gray-400"><span data-i18n="compat.more">更多工具持续接入中，欢迎提交建议 →</span>
              <a href="https://fishxcode.com/" target="_blank" class="text-purple-600 hover:underline font-medium" data-i18n="compat.enterPlatform">进入平台</a>
            </p>
          </div>
        </div>

        <!-- Quick Start -->
        <div class="card p-8 reveal" style="transition-delay:0.15s">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-xl grad-bg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900" data-i18n="compat.startTitle">5 分钟快速开始</h3>
          </div>
          <ol class="space-y-5">
            <li class="flex gap-4 items-start">
              <div class="step-num">1</div>
              <div>
                <p class="font-semibold text-gray-800" data-i18n="step1.title">注册账户</p>
                <p class="text-gray-500 text-sm mt-0.5" data-i18n-html="step1.desc">访问 <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> 注册，几秒即可完成</p>
              </div>
            </li>
            <li class="flex gap-4 items-start">
              <div class="step-num">2</div>
              <div>
                <p class="font-semibold text-gray-800" data-i18n="step2.title">获取 API Key</p>
                <p class="text-gray-500 text-sm mt-0.5" data-i18n="step2.desc">在账户设置中一键生成专属 API Key</p>
              </div>
            </li>
            <li class="flex gap-4 items-start">
              <div class="step-num">3</div>
              <div>
                <p class="font-semibold text-gray-800" data-i18n="step3.title">配置你的工具</p>
                <p class="text-gray-500 text-sm mt-0.5" data-i18n-html="step3.desc">Claude 教程：<a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Codex 教程：<a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a></p>
              </div>
            </li>
            <li class="flex gap-4 items-start">
              <div class="step-num">4</div>
              <div>
                <p class="font-semibold text-gray-800" data-i18n="step4.title">开始 AI 编码！</p>
                <p class="text-gray-500 text-sm mt-0.5" data-i18n="step4.desc">一切就绪，享受 AI Coding 加持的开发体验</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>

  <div class="divider px-6"></div>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║      MIGRATION NOTICE        ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <section class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto reveal">
      <div class="migration-card">
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div class="w-14 h-14 rounded-2xl" style="background:linear-gradient(135deg,#f59e0b,#f97316);display:flex;align-items:center;justify-content:center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-3">
              <span style="font-size:13px;font-weight:600;color:#92400e;background:#fef3c7;border:1px solid #fde68a;padding:3px 10px;border-radius:100px" data-i18n="mig.badge">
                老用户专属
              </span>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-4" data-i18n="mig.title">平台迁移，额度全保障</h3>

            <div class="space-y-4">
              <div class="flex gap-3 items-start">
                <span class="text-amber-500 font-bold text-lg mt-0.5">✓</span>
                <div>
                  <p class="font-semibold text-gray-800" data-i18n="mig.item1.title">旧平台未使用额度，同等迁移至新平台</p>
                  <p class="text-gray-600 text-sm mt-0.5" data-i18n="mig.item1.desc">无论余额多少，全部等值迁移，您的每一分投入都不会浪费</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <span class="text-amber-500 font-bold text-lg mt-0.5">✓</span>
                <div>
                  <p class="font-semibold text-gray-800" data-i18n="mig.item2.title">专属客服，全程协助迁移</p>
                  <p class="text-gray-600 text-sm mt-0.5" data-i18n="mig.item2.desc">遇到任何疑问，联系客服即可，我们帮您一对一处理</p>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-5 border-t border-amber-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <p class="text-gray-600 text-sm" data-i18n="mig.contact.hint">需要迁移帮助或有其他问题？</p>
              <a href="mailto:support@fishxcode.com" class="btn-primary text-sm" style="padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#f97316);box-shadow:0 4px 14px rgba(245,158,11,0.35)">
                <span data-i18n="mig.contact.btn">联系客服</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="divider px-6"></div>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║           CTA                ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <section class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto text-center reveal">
      <div class="cta-box" style="background:linear-gradient(135deg,#fdf2e0 0%,#fde8d0 50%,#fdf5e0 100%);border:1px solid #f0e0b0;border-radius:28px;padding:60px 40px">
        <h2 class="text-4xl sm:text-5xl font-black text-gray-900 mb-4" data-i18n="cta.title">
          随时出发，AI 助力编码
        </h2>
        <p class="text-gray-500 text-lg mb-10 max-w-xl mx-auto" data-i18n="cta.desc">
          数千位开发者已在使用 FishXCode，现在加入，体验更高效的 AI 工作流
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://fishxcode.com/" target="_blank" class="btn-primary text-base" style="padding:16px 40px;justify-content:center">
            <span data-i18n="cta.btn1">立即注册，按需订阅</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="https://doc.fishxcode.com/account" target="_blank" class="btn-ghost text-base" style="padding:14px 36px;justify-content:center">
            <span data-i18n="cta.btn2">查看接入文档</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ╔══════════════════════════════╗ -->
  <!-- ║          FOOTER              ║ -->
  <!-- ╚══════════════════════════════╝ -->
  <footer style="background:var(--footer-bg);color:var(--footer-text)">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <!-- Top -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        <!-- Brand -->
        <div class="sm:col-span-2 lg:col-span-1">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-9 h-9 rounded-xl grad-bg flex items-center justify-center text-white font-black text-base">F</div>
            <span class="font-bold text-white text-lg">FishXCode</span>
          </div>
          <p style="color:#e0c870;font-size:14px;line-height:1.7;white-space:pre-line" data-i18n="footer.brand">AI Coding 中转站
连接全球顶尖 AI 模型
让代码工作流更高效</p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider" data-i18n="footer.product">产品</h4>
          <ul class="space-y-2.5">
            <li><a href="https://fishxcode.com/" target="_blank" class="foot-link" style="color:#e0c870" data-i18n="footer.home">平台首页</a></li>
            <li><a href="https://fishxcode.com/console" target="_blank" class="foot-link" style="color:#e0c870" data-i18n="footer.console">控制台</a></li>
            <li><a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="foot-link" style="color:#e0c870" data-i18n="footer.register">立即注册</a></li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider" data-i18n="footer.resources">资源</h4>
          <ul class="space-y-2.5">
            <li><a href="https://doc.fishxcode.com/faq" target="_blank" class="foot-link" style="color:#e0c870" data-i18n="footer.faq">常见问题</a></li>
            <li><a href="https://doc.fishxcode.com/models" target="_blank" class="foot-link" style="color:#e0c870" data-i18n="footer.models">支持的模型</a></li>
            <li><a href="https://doc.fishxcode.com/changelog" target="_blank" class="foot-link" style="color:#e0c870" data-i18n="footer.changelog">更新日志</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider" data-i18n="footer.support">支持</h4>
          <ul class="space-y-2.5 support-qr-list">
            <li>
              <a href="https://pre.fishxcode.com/qq_group.jpg" target="_blank" class="support-qr-trigger" style="color:#e0c870" data-gallery-index="0">
                <img src="https://pre.fishxcode.com/qq_group.jpg" alt="QQ群二维码" class="support-qr-thumb" loading="lazy" />
                <span>QQ群：373865837（点击查看）</span>
              </a>
            </li>
            <li>
              <a href="https://pre.fishxcode.com/fishxcode_user.jpg" target="_blank" class="support-qr-trigger" style="color:#e0c870" data-gallery-index="1">
                <img src="https://pre.fishxcode.com/fishxcode_user.jpg" alt="微信号二维码" class="support-qr-thumb" loading="lazy" />
                <span>微信号：fishxcode（点击查看）</span>
              </a>
            </li>
            <li>
              <a href="https://pre.fishxcode.com/wechat_group.jpg" target="_blank" class="support-qr-trigger" style="color:#e0c870" data-gallery-index="2">
                <img src="https://pre.fishxcode.com/wechat_group.jpg" alt="微信群二维码" class="support-qr-thumb" loading="lazy" />
                <span>微信群（点击查看）</span>
              </a>
            </li>
            <li>
              <a href="https://pre.fishxcode.com/qq.png" target="_blank" class="support-qr-trigger" style="color:#e0c870" data-gallery-index="3">
                <img src="https://pre.fishxcode.com/qq.png" alt="QQ客服二维码" class="support-qr-thumb" loading="lazy" />
                <span>QQ客服：2013571175（点击查看）</span>
              </a>
            </li>
            <li><a href="mailto:support@fishxcode.com" class="foot-link" style="color:#e0c870" data-i18n="footer.cs">联系客服邮箱</a></li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div style="height:1px;background:rgba(165,180,252,0.15);margin-bottom:28px"></div>

      <!-- Bottom -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div style="color:#6272a4;font-size:13px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span>&copy; 2026 FishXCode. All rights reserved.</span>
          <span style="color:#374163">·</span>
          <span><span data-i18n="footer.visits.prefix">累计访问</span>
            <span style="color:#e0c870;font-weight:700">${visitCount.toLocaleString()}</span>
            <span data-i18n="footer.visits.suffix">次</span>
          </span>
        </div>
        <div class="flex flex-wrap gap-5 justify-center">
          <a href="https://doc.fishxcode.com/terms" target="_blank" class="foot-link" style="color:#6272a4;font-size:13px" data-i18n="footer.terms">用户协议</a>
          <a href="https://doc.fishxcode.com/privacy" target="_blank" class="foot-link" style="color:#6272a4;font-size:13px" data-i18n="footer.privacy">隐私政策</a>
          <a href="mailto:support@fishxcode.com" class="foot-link" style="color:#6272a4;font-size:13px" data-i18n="footer.contact">联系我们</a>
          <a href="https://github.com/fishxcode" target="_blank" class="foot-link" style="color:#6272a4;font-size:13px">GitHub</a>
        </div>
      </div>
    </div>
  </footer>

  <div id="supportGallery" class="support-gallery" aria-hidden="true">
    <div class="support-gallery-backdrop" onclick="closeSupportGallery()"></div>
    <div class="support-gallery-panel" role="dialog" aria-modal="true" aria-label="Support QR Gallery" onclick="onSupportGalleryPanelClick(event)">
      <button class="support-gallery-close" type="button" onclick="closeSupportGallery()" aria-label="Close">×</button>
      <div id="supportGalleryStage" class="support-gallery-stage" ondblclick="toggleSupportGalleryZoom()">
        <img id="supportGalleryImage" class="support-gallery-image" alt="Support QR Code" />
      </div>
      <div id="supportGalleryCaption" class="support-gallery-caption"></div>
      <div class="support-gallery-controls">
        <button class="support-gallery-btn" type="button" onclick="prevSupportGallery()" aria-label="Previous">‹</button>
        <button class="support-gallery-btn" type="button" onclick="zoomOutSupportGallery()" aria-label="Zoom out">−</button>
        <button class="support-gallery-btn" type="button" onclick="zoomInSupportGallery()" aria-label="Zoom in">+</button>
        <span id="supportGalleryCounter" class="support-gallery-counter">1 / 4</span>
        <button class="support-gallery-btn" type="button" onclick="nextSupportGallery()" aria-label="Next">›</button>
      </div>
    </div>
  </div>

  <script>
    // ─── i18n 翻译系统 ─────────────────────────────────────────────────────────
    var _T = {
      'zh-CN': {
        'nav.docs':'文档','nav.start':'快速开始','nav.enter':'进入平台',
        'hero.badge':'订阅制 Claude · Codex｜个人与团队国际中转站',
        'hero.title':'订阅制 Claude Codex 个人/团队国际中转站',
        'hero.desc':'主打订阅包月制，同时支持天卡与周卡，覆盖个人与团队的国际中转订阅需求',
        'hero.bonus':'注册送 Token · 每日签到送 Token · 邀请好友再送 Token',
        'hero.btn1':'立即注册，按需订阅','hero.btn2':'查看使用文档',
        'hero.stat1':'低延迟响应','hero.stat2':'多模型切换','hero.stat3':'全工具支持',
        'hero.urlHint':'▸ 替换 Base URL 即可接入','hero.copy':'复制','hero.copied':'已复制',
        'sub.badge':'主打订阅制套餐','sub.title':'统一价格矩阵：天 / 周 / 月','sub.desc':'覆盖个人、团队、企业三类使用场景，按需选择订阅周期与档位',
        'sub.cta':'前往充值并选择订阅套餐','sub.expand':'查看规则','sub.hide':'收起规则','sub.comingSoon':'即将上线','sub.loadFail':'套餐加载失败',
        'sub.validity':'有效期','sub.resetRule':'重置规则','sub.totalAmount':'总额度',
        'sub.cycle.daily':'天订阅','sub.cycle.weekly':'周订阅','sub.cycle.monthly':'月订阅',
        'sub.audience.personal':'个人','sub.audience.team':'团队','sub.audience.enterprise':'企业',
        'feat.badge':'核心优势','feat.title':'为什么开发者选择 FishXCode？',
        'feat.desc':'专为 AI Coding 场景打磨，省去一切繁琐配置',
        'feat.f1.title':'极致编码提效','feat.f1.desc':'专为程序员优化的响应链路，支持流式输出，让代码生成几乎零感知延迟',
        'feat.f2.title':'多端完美适配','feat.f2.desc':'完美集成 Claude  Code、Codex 等生产力工具，一键替换 API 地址即可起飞',
        'feat.f3.title':'开箱即用','feat.f3.desc':'注册账户后立即可用，无需繁琐的本地配置，5 分钟内接入完整 AI 工作流',
        'brand.badge':'原生支持','brand.title':'极致工具链','brand.guide':'接入指南',
        'brand.desc':'深度优化 API 路由，确保在 CLI 环境下依然拥有流畅的流式交互体验',
        'brand.claude.label':'Anthropic','brand.claude.desc':'代码执行能力强劲，高效理解需求，快速生成精准代码',
        'brand.codex.label':'OpenAI','brand.codex.desc':'深度思考模式，慢工出细活，复杂逻辑处理更严谨',
        'compat.badge':'全面兼容','compat.title':'支持的工具 & 快速接入','compat.desc':'与你日常使用的所有 AI 开发工具无缝衔接',
        'compat.listTitle':'支持的工具清单','compat.startTitle':'5 分钟快速开始',
        'step1.title':'注册账户','step2.title':'获取 API Key',
        'step3.title':'配置你的工具','step4.title':'开始 AI 编码！',
        'mig.badge':'老用户专属','mig.title':'平台迁移，额度全保障',
        'mig.item1.title':'旧平台未使用额度，同等迁移至新平台',
        'mig.item2.title':'专属客服，全程协助迁移',
        'cta.title':'随时出发，AI 助力编码',
        'cta.desc':'数千位开发者已在使用 FishXCode，现在加入，体验更高效的 AI 工作流',
        'cta.btn1':'立即注册，按需订阅','cta.btn2':'查看接入文档',
        'footer.product':'产品','footer.resources':'资源','footer.support':'支持',
        'footer.home':'平台首页','footer.console':'控制台','footer.register':'立即注册',
        'footer.faq':'常见问题','footer.models':'支持的模型','footer.changelog':'更新日志',
        'footer.cs':'联系客服','footer.status':'服务状态','footer.quota':'额度查询',
        'footer.terms':'用户协议','footer.privacy':'隐私政策','footer.contact':'联系我们',
        'terminal.tab.claude':'Claude','terminal.tab.codex':'Codex','terminal.docs.claude':'Claude 教程','terminal.docs.codex':'Codex 教程','terminal.comment.claude':'// 配置 Claude','terminal.comment.codex':'// 配置 Codex','terminal.start':'# 开始编码',
        'step1.desc':'访问 <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> 注册，几秒即可完成',
        'step2.desc':'在账户设置中一键生成专属 API Key',
        'step3.desc':'Claude 教程：<a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Codex 教程：<a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a>',
        'step4.desc':'一切就绪，享受 AI Coding 加持的开发体验',
        'mig.item1.desc':'无论余额多少，全部等值迁移，您的每一分投入都不会浪费',
        'mig.item2.desc':'遇到任何疑问，联系客服即可，我们帮您一对一处理',
        'mig.contact.hint':'需要迁移帮助或有其他问题？','mig.contact.btn':'联系客服',
        'compat.more':'更多工具持续接入中，欢迎提交建议 →','compat.enterPlatform':'进入平台',
        'footer.brand':'AI Coding 中转站\\n连接全球顶尖 AI 模型\\n让代码工作流更高效',
        'footer.visits.prefix':'累计访问 ','footer.visits.suffix':' 次'
      },
      'zh-TW': {
        'nav.docs':'文檔','nav.start':'快速開始','nav.enter':'進入平台',
        'hero.badge':'Claude · Codex 全支援',
        'hero.title':'最順手的中繼站',
        'hero.desc':'註冊即用，無縫連接全球頂尖 AI 模型，讓你的程式工作流快上加快',
        'hero.bonus':'註冊送 Token · 每日簽到送 Token · 邀請好友再送 Token',
        'hero.btn1':'免費註冊，立即使用','hero.btn2':'查看使用文檔',
        'hero.stat1':'低延遲響應','hero.stat2':'多模型切換','hero.stat3':'全工具支援',
        'hero.urlHint':'▸ 替換 Base URL 即可接入','hero.copy':'複製','hero.copied':'已複製',
        'feat.badge':'核心優勢','feat.title':'為什麼開發者選擇 FishXCode？',
        'feat.desc':'專為 AI Coding 場景打磨，省去一切繁瑣配置',
        'feat.f1.title':'極致編碼提效','feat.f1.desc':'專為程式設計師最佳化的響應鏈路，支援串流輸出，讓程式碼生成幾乎零感知延遲',
        'feat.f2.title':'多端完美適配','feat.f2.desc':'完美整合 Claude  Code、Codex 等生產力工具，一鍵替換 API 地址即可起飛',
        'feat.f3.title':'開箱即用','feat.f3.desc':'註冊帳戶後立即可用，無需繁瑣的本地設定，5 分鐘內接入完整 AI 工作流',
        'brand.badge':'原生支援','brand.title':'極致工具鏈','brand.guide':'接入指南',
        'brand.desc':'深度最佳化 API 路由，確保在 CLI 環境下依然擁有流暢的串流互動體驗',
        'brand.claude.label':'Anthropic','brand.claude.desc':'程式碼執行能力強勁，高效理解需求，快速生成精準程式碼',
        'brand.codex.label':'OpenAI','brand.codex.desc':'深度思考模式，慢工出細活，複雜邏輯處理更嚴謹',
        'compat.badge':'全面相容','compat.title':'支援的工具 & 快速接入','compat.desc':'與你日常使用的所有 AI 開發工具無縫銜接',
        'compat.listTitle':'支援的工具清單','compat.startTitle':'5 分鐘快速開始',
        'step1.title':'註冊帳戶','step2.title':'取得 API Key',
        'step3.title':'設定你的工具','step4.title':'開始 AI 編碼！',
        'mig.badge':'舊用戶專屬','mig.title':'平台遷移，額度全保障',
        'mig.item1.title':'舊平台未使用額度，等同遷移至新平台',
        'mig.item2.title':'專屬客服，全程協助遷移',
        'cta.title':'隨時出發，AI 助力編碼',
        'cta.desc':'數千位開發者已在使用 FishXCode，現在加入，體驗更高效的 AI 工作流',
        'cta.btn1':'免費註冊並使用','cta.btn2':'查看接入文檔',
        'footer.product':'產品','footer.resources':'資源','footer.support':'支援',
        'footer.home':'平台首頁','footer.console':'控制台','footer.register':'立即註冊',
        'footer.faq':'常見問題','footer.models':'支援的模型','footer.changelog':'更新日誌',
        'footer.cs':'聯繫客服','footer.status':'服務狀態','footer.quota':'額度查詢',
        'footer.terms':'用戶協議','footer.privacy':'隱私政策','footer.contact':'聯繫我們',
        'terminal.tab.claude':'Claude','terminal.tab.codex':'Codex','terminal.docs.claude':'Claude 教程','terminal.docs.codex':'Codex 教程','terminal.comment.claude':'// 設定 Claude','terminal.comment.codex':'// 設定 Codex','terminal.start':'# 開始編碼',
        'step1.desc':'訪問 <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> 註冊，幾秒即可完成',
        'step2.desc':'在帳戶設定中一鍵生成專屬 API Key',
        'step3.desc':'Claude 教程：<a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Codex 教程：<a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a>',
        'step4.desc':'一切就緒，享受 AI Coding 加持的開發體驗',
        'mig.item1.desc':'無論餘額多少，全部等值遷移，您的每一分投入都不會浪費',
        'mig.item2.desc':'遇到任何疑問，聯繫客服即可，我們幫您一對一處理',
        'mig.contact.hint':'需要遷移幫助或有其他問題？','mig.contact.btn':'聯繫客服',
        'compat.more':'更多工具持續接入中，歡迎提交建議 →','compat.enterPlatform':'進入平台',
        'footer.brand':'AI Coding 中繼站\\n連接全球頂尖 AI 模型\\n讓程式工作流更高效',
        'footer.visits.prefix':'累計訪問 ','footer.visits.suffix':' 次'
      },
      'en': {
        'nav.docs':'Docs','nav.start':'Quick Start','nav.enter':'Enter Platform',
        'hero.badge':'Claude · Codex Supported',
        'hero.title':'Best AI Coding Relay',
        'hero.desc':'Connect to top AI models globally. Supercharge your coding workflow instantly.',
        'hero.bonus':'Free Token on signup · daily check-in · invite rewards',
        'hero.btn1':'Sign Up Free','hero.btn2':'View Docs',
        'hero.stat1':'Low Latency','hero.stat2':'Multi-Model','hero.stat3':'All Tools',
        'hero.urlHint':'▸ Replace Base URL to connect','hero.copy':'Copy','hero.copied':'Copied!',
        'sub.badge':'Subscription Plans','sub.title':'Unified Pricing Matrix: Daily / Weekly / Monthly','sub.desc':'Covers personal, team, and enterprise usage scenarios. Choose your cycle and tier as needed.',
        'sub.cta':'Go to Top Up and choose subscription','sub.expand':'View Rules','sub.hide':'Hide Rules','sub.comingSoon':'Coming Soon','sub.loadFail':'Failed to load plans',
        'sub.validity':'Validity','sub.resetRule':'Reset Rule','sub.totalAmount':'Total Quota',
        'sub.cycle.daily':'Daily','sub.cycle.weekly':'Weekly','sub.cycle.monthly':'Monthly',
        'sub.audience.personal':'Personal','sub.audience.team':'Team','sub.audience.enterprise':'Enterprise',
        'feat.badge':'Key Advantages','feat.title':'Why FishXCode?',
        'feat.desc':'Built for AI Coding. Maximum performance and stability.',
        'feat.f1.title':'Blazing Fast','feat.f1.desc':'Optimized response pipeline with streaming support for near-zero perceived latency.',
        'feat.f2.title':'Universal Compatibility','feat.f2.desc':'Seamlessly integrates with Claude  Code and Codex. Just swap the API URL.',
        'feat.f3.title':'Ready in Minutes','feat.f3.desc':'Sign up and start immediately. Full AI workflow in 5 minutes.',
        'brand.badge':'Native Support','brand.title':'Ultimate Toolchain','brand.guide':'Setup Guide',
        'brand.desc':'Deeply optimized API routing for smooth streaming in CLI environments.',
        'brand.claude.label':'Anthropic','brand.claude.desc':'Powerful code execution. Understands requirements fast, generates precise code.',
        'brand.codex.label':'OpenAI','brand.codex.desc':'Deep thinking mode for rigorous and complex logic processing.',
        'compat.badge':'Full Compatibility','compat.title':'Supported Tools & Quick Start','compat.desc':'Works seamlessly with all AI development tools you use daily.',
        'compat.listTitle':'Supported Tools','compat.startTitle':'Get Started in 5 Min',
        'step1.title':'Create Account','step2.title':'Get API Key',
        'step3.title':'Configure Your Tool','step4.title':'Start AI Coding!',
        'mig.badge':'Existing Users','mig.title':'Migration: Credits Fully Guaranteed',
        'mig.item1.title':'Unused credits transferred at equal value',
        'mig.item2.title':'Dedicated support throughout migration',
        'cta.title':'Start Now. AI-Powered Coding.',
        'cta.desc':'Thousands of developers use FishXCode. Join now for a more efficient AI workflow.',
        'cta.btn1':'Sign Up Free','cta.btn2':'View Setup Docs',
        'footer.product':'Product','footer.resources':'Resources','footer.support':'Support',
        'footer.home':'Home','footer.console':'Console','footer.register':'Register',
        'footer.faq':'FAQ','footer.models':'Models','footer.changelog':'Changelog',
        'footer.cs':'Contact Support','footer.status':'Status','footer.quota':'Usage Checker',
        'footer.terms':'Terms','footer.privacy':'Privacy','footer.contact':'Contact Us',
        'terminal.tab.claude':'Claude','terminal.tab.codex':'Codex','terminal.docs.claude':'Claude Guide','terminal.docs.codex':'Codex Guide','terminal.comment.claude':'// Setup Claude','terminal.comment.codex':'// Setup Codex','terminal.start':'# Start coding',
        'step1.desc':'Visit <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> to sign up — takes just seconds',
        'step2.desc':'Generate your API Key in account settings with one click',
        'step3.desc':'Claude guide: <a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Codex guide: <a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a>',
        'step4.desc':'All set! Enjoy AI-powered coding experience',
        'mig.item1.desc':'All remaining credits transferred at equal value — nothing wasted',
        'mig.item2.desc':'Got questions? Contact support for one-on-one assistance',
        'mig.contact.hint':'Need migration help or have questions?','mig.contact.btn':'Contact Support',
        'compat.more':'More tools coming soon. Suggestions welcome →','compat.enterPlatform':'Enter Platform',
        'footer.brand':'AI Coding Relay\\nConnect to Top AI Models\\nSupercharge Your Workflow',
        'footer.visits.prefix':'Total Visits: ','footer.visits.suffix':''
      },
      'fr': {
        'nav.docs':'Docs','nav.start':'Démarrage','nav.enter':'Accéder',
        'hero.badge':'Claude · Codex Supportés',
        'hero.title':'Meilleur Relais AI Coding',
        'hero.desc':'Connectez-vous aux meilleurs modèles IA mondiaux. Boostez votre développement.',
        'hero.bonus':'Token offert à l’inscription · check-in quotidien · récompense d’invitation',
        'hero.btn1':'Inscription gratuite','hero.btn2':'Documentation',
        'hero.stat1':'Faible latence','hero.stat2':'Multi-modèle','hero.stat3':'Tous les outils',
        'hero.urlHint':"▸ Remplacez l'URL de base","hero.copy":'Copier','hero.copied':'Copié !',
        'feat.badge':'Avantages clés','feat.title':'Pourquoi FishXCode ?',
        'feat.desc':'Conçu pour le AI Coding. Performance et stabilité maximales.',
        'feat.f1.title':'Faible latence','feat.f1.desc':'Pipeline de réponse optimisé pour les développeurs avec support du streaming.',
        'feat.f2.title':'Compatibilité universelle','feat.f2.desc':"Intégration parfaite avec Claude  Code et Codex. Changez l'URL API.",
        'feat.f3.title':'Prêt en minutes','feat.f3.desc':'Inscrivez-vous et commencez immédiatement. Workflow IA complet en 5 minutes.',
        'brand.badge':'Support natif','brand.title':"Chaîne d'outils ultime",'brand.guide':"Guide d'intégration",
        'brand.desc':'Routage API profondément optimisé pour un streaming fluide en CLI.',
        'brand.claude.label':'Anthropic','brand.claude.desc':'Exécution de code puissante, comprend rapidement les besoins.',
        'brand.codex.label':'OpenAI','brand.codex.desc':'Mode de réflexion approfondie pour logique complexe.',
        'compat.badge':'Compatibilité totale','compat.title':'Outils & Démarrage rapide','compat.desc':'Intégration parfaite avec tous vos outils de développement IA.',
        'compat.listTitle':'Outils supportés','compat.startTitle':'Démarrez en 5 min',
        'step1.title':'Créer un compte','step2.title':"Obtenir une clé API",
        'step3.title':'Configurer votre outil','step4.title':'Commencez à coder !',
        'mig.badge':'Utilisateurs existants','mig.title':'Migration : crédits garantis',
        'mig.item1.title':'Crédits inutilisés transférés à valeur égale',
        'mig.item2.title':'Support dédié tout au long de la migration',
        'cta.title':'Partez maintenant. Codez avec IA.',
        'cta.desc':'Des milliers de développeurs utilisent FishXCode. Rejoignez-les.',
        'cta.btn1':"S'inscrire gratuitement",'cta.btn2':'Documentation',
        'footer.product':'Produit','footer.resources':'Ressources','footer.support':'Support',
        'footer.home':'Accueil','footer.console':'Console','footer.register':"S'inscrire",
        'footer.faq':'FAQ','footer.models':'Modèles','footer.changelog':'Changelog',
        'footer.cs':'Support','footer.status':'Statut','footer.quota':"Vérifier l'usage",
        'footer.terms':'CGU','footer.privacy':'Confidentialité','footer.contact':'Contact',
        'terminal.tab.claude':'Claude','terminal.tab.codex':'Codex','terminal.docs.claude':'Guide Claude','terminal.docs.codex':'Guide Codex','terminal.comment.claude':'// Configurer Claude','terminal.comment.codex':'// Configurer Codex','terminal.start':'# Commencer à coder',
        'step1.desc':'Visitez <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> pour vous inscrire — quelques secondes',
        'step2.desc':"Générez votre clé API en un clic dans les paramètres du compte",
        'step3.desc':'Suivez le guide Claude : <a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Guide Codex : <a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a>',
        'step4.desc':'Tout est prêt ! Profitez du développement assisté par IA',
        'mig.item1.desc':'Tous les crédits restants transférés à valeur égale — rien de perdu',
        'mig.item2.desc':'Des questions ? Contactez le support pour une assistance personnalisée',
        'mig.contact.hint':"Besoin d'aide pour la migration ?",'mig.contact.btn':'Contacter le support',
        'compat.more':"Plus d'outils à venir. Suggestions bienvenues →",'compat.enterPlatform':'Accéder',
        'footer.brand':'Relais AI Coding\\nConnexion aux meilleurs modèles IA\\nOptimisez votre workflow',
        'footer.visits.prefix':'Visites totales : ','footer.visits.suffix':''
      },
      'ja': {
        'nav.docs':'ドキュメント','nav.start':'クイックスタート','nav.enter':'プラットフォームへ',
        'hero.badge':'Claude · Codex 全対応',
        'hero.title':'最高の AI Coding リレー',
        'hero.desc':'世界トップクラスの AI モデルへシームレスに接続。コーディングを加速。',
        'hero.bonus':'登録でToken付与・毎日チェックインでToken・招待でさらにToken',
        'hero.btn1':'無料登録して使う','hero.btn2':'ドキュメントを見る',
        'hero.stat1':'低レイテンシ','hero.stat2':'マルチモデル','hero.stat3':'全ツール対応',
        'hero.urlHint':'▸ Base URL を置き換えて接続','hero.copy':'コピー','hero.copied':'コピー済み',
        'feat.badge':'主な特長','feat.title':'FishXCode を選ぶ理由',
        'feat.desc':'AI Coding のために設計。最高のパフォーマンスと安定性。',
        'feat.f1.title':'高速レスポンス','feat.f1.desc':'開発者向けに最適化されたパイプライン。ストリーミング対応で遅延ほぼゼロ。',
        'feat.f2.title':'ユニバーサル対応','feat.f2.desc':'Claude  Code、Codex とシームレスに統合。API URL を変えるだけ。',
        'feat.f3.title':'即時使用可能','feat.f3.desc':'登録後すぐに使用可能。5 分で AI ワークフローを完全接続。',
        'brand.badge':'ネイティブ対応','brand.title':'究極のツールチェーン','brand.guide':'導入ガイド',
        'brand.desc':'CLI 環境でもスムーズなストリーミングを実現する最適化 API ルーティング。',
        'brand.claude.label':'Anthropic','brand.claude.desc':'強力なコード実行能力。要件を素早く理解し、精確なコードを生成。',
        'brand.codex.label':'OpenAI','brand.codex.desc':'深い思考モードで複雑なロジックも丁寧に処理。',
        'compat.badge':'完全互換','compat.title':'対応ツール & クイックスタート','compat.desc':'日常使う AI 開発ツールとすべてシームレスに連携。',
        'compat.listTitle':'対応ツール一覧','compat.startTitle':'5 分でスタート',
        'step1.title':'アカウント登録','step2.title':'API キーを取得',
        'step3.title':'ツールを設定','step4.title':'AI コーディング開始！',
        'mig.badge':'既存ユーザー向け','mig.title':'移行：クレジット完全保証',
        'mig.item1.title':'旧プラットフォームの未使用クレジットを等価移行',
        'mig.item2.title':'移行全般を専任サポートが支援',
        'cta.title':'さあ出発。AI でコーディング。',
        'cta.desc':'数千人の開発者が FishXCode を使用中。今すぐ参加しましょう。',
        'cta.btn1':'無料で登録する','cta.btn2':'導入ドキュメント',
        'footer.product':'プロダクト','footer.resources':'リソース','footer.support':'サポート',
        'footer.home':'ホーム','footer.console':'コンソール','footer.register':'登録',
        'footer.faq':'よくある質問','footer.models':'モデル一覧','footer.changelog':'更新履歴',
        'footer.cs':'サポートへ連絡','footer.status':'サービス状態','footer.quota':'使用量確認',
        'footer.terms':'利用規約','footer.privacy':'プライバシー','footer.contact':'お問い合わせ',
        'terminal.tab.claude':'Claude','terminal.tab.codex':'Codex','terminal.docs.claude':'Claude ガイド','terminal.docs.codex':'Codex ガイド','terminal.comment.claude':'// Claude を設定','terminal.comment.codex':'// Codex を設定','terminal.start':'# コーディング開始',
        'step1.desc':'<a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> でアカウント登録 — 数秒で完了',
        'step2.desc':'アカウント設定からワンクリックで API Key を発行',
        'step3.desc':'Claude ガイド：<a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Codex ガイド：<a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a>',
        'step4.desc':'準備完了！AI 搭載のコーディング体験をお楽しみください',
        'mig.item1.desc':'残高はすべて等価で移行 — 無駄になりません',
        'mig.item2.desc':'ご不明な点はサポートまでお気軽にお問い合わせください',
        'mig.contact.hint':'移行に関するご質問はありますか？','mig.contact.btn':'サポートへ連絡',
        'compat.more':'対応ツールを拡大中。ご提案歓迎 →','compat.enterPlatform':'プラットフォームへ',
        'footer.brand':'AI Coding リレー\\n世界トップクラスの AI モデルに接続\\nワークフローを加速',
        'footer.visits.prefix':'累計訪問数: ','footer.visits.suffix':''
      },
      'ru': {
        'nav.docs':'Документация','nav.start':'Быстрый старт','nav.enter':'Войти',
        'hero.badge':'Claude · Codex Поддерживаются',
        'hero.title':'Лучший ретранслятор AI Coding',
        'hero.desc':'Подключайтесь к лучшим AI-моделям мира. Ускорьте рабочий процесс разработки.',
        'hero.bonus':'Токены за регистрацию · ежедневный check-in · приглашения друзей',
        'hero.btn1':'Зарегистрироваться бесплатно','hero.btn2':'Документация',
        'hero.stat1':'Низкая задержка','hero.stat2':'Мульти-модель','hero.stat3':'Все инструменты',
        'hero.urlHint':'▸ Замените Base URL для подключения','hero.copy':'Копировать','hero.copied':'Скопировано!',
        'feat.badge':'Ключевые преимущества','feat.title':'Почему FishXCode?',
        'feat.desc':'Создан для AI Coding. Максимальная производительность и стабильность.',
        'feat.f1.title':'Низкая задержка','feat.f1.desc':'Оптимизированный конвейер для разработчиков с поддержкой стриминга.',
        'feat.f2.title':'Универсальная совместимость','feat.f2.desc':'Интеграция с Claude  Code и Codex. Просто замените URL API.',
        'feat.f3.title':'Готов за минуты','feat.f3.desc':'Зарегистрируйтесь и начните немедленно. Полный AI-воркфлоу за 5 минут.',
        'brand.badge':'Нативная поддержка','brand.title':'Полный набор инструментов','brand.guide':'Руководство',
        'brand.desc':'Глубоко оптимизированная маршрутизация API для плавного стриминга в CLI.',
        'brand.claude.label':'Anthropic','brand.claude.desc':'Мощное выполнение кода, быстро понимает требования.',
        'brand.codex.label':'OpenAI','brand.codex.desc':'Режим глубокого мышления для сложной логики.',
        'compat.badge':'Полная совместимость','compat.title':'Поддерживаемые инструменты','compat.desc':'Бесшовная интеграция со всеми AI-инструментами разработки.',
        'compat.listTitle':'Список инструментов','compat.startTitle':'Старт за 5 минут',
        'step1.title':'Создать аккаунт','step2.title':'Получить API-ключ',
        'step3.title':'Настроить инструмент','step4.title':'Начать AI-кодинг!',
        'mig.badge':'Для существующих пользователей','mig.title':'Миграция: кредиты гарантированы',
        'mig.item1.title':'Неиспользованные кредиты перенесены по равной стоимости',
        'mig.item2.title':'Персональная поддержка на всём пути миграции',
        'cta.title':'Начните сейчас. Кодирование с AI.',
        'cta.desc':'Тысячи разработчиков уже используют FishXCode. Присоединяйтесь.',
        'cta.btn1':'Зарегистрироваться','cta.btn2':'Документация по настройке',
        'footer.product':'Продукт','footer.resources':'Ресурсы','footer.support':'Поддержка',
        'footer.home':'Главная','footer.console':'Консоль','footer.register':'Регистрация',
        'footer.faq':'FAQ','footer.models':'Модели','footer.changelog':'Изменения',
        'footer.cs':'Поддержка','footer.status':'Статус','footer.quota':'Проверка лимитов',
        'footer.terms':'Условия','footer.privacy':'Конфиденциальность','footer.contact':'Контакты',
        'terminal.tab.claude':'Claude','terminal.tab.codex':'Codex','terminal.docs.claude':'Гайд Claude','terminal.docs.codex':'Гайд Codex','terminal.comment.claude':'// Настройка Claude','terminal.comment.codex':'// Настройка Codex','terminal.start':'# Начало кодирования',
        'step1.desc':'Зарегистрируйтесь на <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> — за несколько секунд',
        'step2.desc':'Сгенерируйте API-ключ в настройках аккаунта одним кликом',
        'step3.desc':'Гайд Claude: <a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Гайд Codex: <a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a>',
        'step4.desc':'Всё готово! Наслаждайтесь разработкой с AI',
        'mig.item1.desc':'Все оставшиеся кредиты переносятся по равной стоимости — ничего не теряется',
        'mig.item2.desc':'Есть вопросы? Обратитесь в поддержку для персональной помощи',
        'mig.contact.hint':'Нужна помощь с миграцией?','mig.contact.btn':'Связаться с поддержкой',
        'compat.more':'Новые инструменты добавляются. Предложения приветствуются →','compat.enterPlatform':'Войти',
        'footer.brand':'Ретранслятор AI Coding\\nПодключение к лучшим AI-моделям\\nУскорьте рабочий процесс',
        'footer.visits.prefix':'Всего посещений: ','footer.visits.suffix':''
      },
      'vi': {
        'nav.docs':'Tài liệu','nav.start':'Bắt đầu nhanh','nav.enter':'Vào nền tảng',
        'hero.badge':'Claude · Codex Hỗ trợ',
        'hero.title':'Trạm chuyển tiếp AI Coding tốt nhất',
        'hero.desc':'Kết nối với các mô hình AI hàng đầu thế giới. Tăng tốc quy trình làm việc.',
        'hero.bonus':'Tặng Token khi đăng ký · điểm danh hằng ngày · mời bạn nhận thêm Token',
        'hero.btn1':'Đăng ký miễn phí','hero.btn2':'Xem tài liệu',
        'hero.stat1':'Độ trễ thấp','hero.stat2':'Đa mô hình','hero.stat3':'Mọi công cụ',
        'hero.urlHint':'▸ Thay Base URL để kết nối','hero.copy':'Sao chép','hero.copied':'Đã sao chép!',
        'feat.badge':'Ưu điểm chính','feat.title':'Tại sao chọn FishXCode?',
        'feat.desc':'Được xây dựng cho AI Coding. Hiệu suất và độ ổn định tối đa.',
        'feat.f1.title':'Tốc độ cao','feat.f1.desc':'Pipeline phản hồi được tối ưu hóa cho lập trình viên, hỗ trợ streaming.',
        'feat.f2.title':'Tương thích toàn diện','feat.f2.desc':'Tích hợp hoàn hảo với Claude  Code và Codex. Chỉ cần đổi URL API.',
        'feat.f3.title':'Sẵn sàng trong vài phút','feat.f3.desc':'Đăng ký và bắt đầu ngay. Quy trình AI đầy đủ trong 5 phút.',
        'brand.badge':'Hỗ trợ gốc','brand.title':'Chuỗi công cụ tối ưu','brand.guide':'Hướng dẫn tích hợp',
        'brand.desc':'Định tuyến API được tối ưu hóa sâu để streaming mượt mà trong CLI.',
        'brand.claude.label':'Anthropic','brand.claude.desc':'Thực thi code mạnh mẽ, hiểu yêu cầu nhanh chóng, tạo code chính xác.',
        'brand.codex.label':'OpenAI','brand.codex.desc':'Chế độ suy nghĩ sâu cho logic phức tạp.',
        'compat.badge':'Tương thích đầy đủ','compat.title':'Công cụ được hỗ trợ & Bắt đầu','compat.desc':'Tích hợp hoàn hảo với mọi công cụ phát triển AI.',
        'compat.listTitle':'Danh sách công cụ','compat.startTitle':'Bắt đầu trong 5 phút',
        'step1.title':'Tạo tài khoản','step2.title':'Lấy API Key',
        'step3.title':'Cấu hình công cụ','step4.title':'Bắt đầu AI Coding!',
        'mig.badge':'Người dùng cũ','mig.title':'Di chuyển: tín dụng được đảm bảo',
        'mig.item1.title':'Tín dụng chưa dùng được chuyển với giá trị tương đương',
        'mig.item2.title':'Hỗ trợ riêng trong suốt quá trình di chuyển',
        'cta.title':'Bắt đầu ngay. Code với AI.',
        'cta.desc':'Hàng nghìn lập trình viên đã sử dụng FishXCode. Tham gia ngay.',
        'cta.btn1':'Đăng ký miễn phí','cta.btn2':'Xem tài liệu tích hợp',
        'footer.product':'Sản phẩm','footer.resources':'Tài nguyên','footer.support':'Hỗ trợ',
        'footer.home':'Trang chủ','footer.console':'Bảng điều khiển','footer.register':'Đăng ký',
        'footer.faq':'FAQ','footer.models':'Mô hình','footer.changelog':'Nhật ký thay đổi',
        'footer.cs':'Hỗ trợ','footer.status':'Trạng thái','footer.quota':'Kiểm tra quota',
        'footer.terms':'Điều khoản','footer.privacy':'Quyền riêng tư','footer.contact':'Liên hệ',
        'terminal.tab.claude':'Claude','terminal.tab.codex':'Codex','terminal.docs.claude':'Hướng dẫn Claude','terminal.docs.codex':'Hướng dẫn Codex','terminal.comment.claude':'// Cấu hình Claude','terminal.comment.codex':'// Cấu hình Codex','terminal.start':'# Bắt đầu code',
        'step1.desc':'Truy cập <a href="https://fishxcode.com/register?aff=9CTW" target="_blank" class="text-purple-600 hover:underline">fishxcode.com</a> để đăng ký — chỉ vài giây',
        'step2.desc':'Tạo API Key trong cài đặt tài khoản chỉ với một cú nhấp',
        'step3.desc':'Hướng dẫn Claude: <a href="https://doc.fishxcode.com/start" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/start</a><br/>Hướng dẫn Codex: <a href="https://doc.fishxcode.com/codex" target="_blank" class="text-purple-600 hover:underline">https://doc.fishxcode.com/codex</a>',
        'step4.desc':'Sẵn sàng! Tận hưởng trải nghiệm lập trình với AI',
        'mig.item1.desc':'Tất cả tín dụng còn lại được chuyển với giá trị tương đương — không lãng phí',
        'mig.item2.desc':'Có thắc mắc? Liên hệ hỗ trợ để được tư vấn riêng',
        'mig.contact.hint':'Cần hỗ trợ di chuyển hoặc có câu hỏi?','mig.contact.btn':'Liên hệ hỗ trợ',
        'compat.more':'Thêm công cụ đang được hỗ trợ. Đề xuất luôn được chào đón →','compat.enterPlatform':'Vào nền tảng',
        'footer.brand':'Trạm chuyển tiếp AI Coding\\nKết nối mô hình AI hàng đầu\\nTối ưu quy trình làm việc',
        'footer.visits.prefix':'Tổng lượt truy cập: ','footer.visits.suffix':''
      }
    };

    function applyLang(lang) {
      var t = _T[lang] || _T[_T[lang.split('-')[0]] ? lang.split('-')[0] : 'zh-CN'];
      if (!t) return;
      // textContent replacement
      document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
      });
      // innerHTML replacement (for elements containing links)
      document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) el.innerHTML = t[key];
      });
      // 同步复制按钮（防止 copied 状态中切换）
      var copyBtn = document.getElementById('copyBtn');
      if (copyBtn && !copyBtn.classList.contains('copied')) {
        var copySpan = copyBtn.querySelector('[data-i18n="hero.copy"]');
        if (copySpan && t['hero.copy']) copySpan.textContent = t['hero.copy'];
      }
      // 渲染 terminal 预览（需要在文案应用后执行）
      renderTerminalPreview();

      // 更新 html lang 属性
      document.documentElement.lang = lang;
    }

    var _terminalTab = 'claude';

    function _terminalCommand(tab) {
      return tab === 'codex' ? 'codex' : 'claude';
    }

    function setTerminalTab(tab) {
      _terminalTab = tab === 'codex' ? 'codex' : 'claude';
      renderTerminalPreview();
    }

    function renderTerminalPreview() {
      var t = _getT();
      var tab = _terminalTab === 'codex' ? 'codex' : 'claude';
      var other = tab === 'claude' ? 'codex' : 'claude';

      var content = document.getElementById('terminalContent');
      var tabClaude = document.getElementById('terminalTabClaude');
      var tabCodex = document.getElementById('terminalTabCodex');
      var primaryDoc = document.getElementById('terminalPrimaryDoc');
      var secondaryDoc = document.getElementById('terminalSecondaryDoc');

      if (tabClaude) {
        var activeClaude = tab === 'claude';
        tabClaude.classList.toggle('active', activeClaude);
        tabClaude.setAttribute('aria-selected', activeClaude ? 'true' : 'false');
      }
      if (tabCodex) {
        var activeCodex = tab === 'codex';
        tabCodex.classList.toggle('active', activeCodex);
        tabCodex.setAttribute('aria-selected', activeCodex ? 'true' : 'false');
      }

      if (primaryDoc) {
        primaryDoc.href = tab === 'claude' ? 'https://doc.fishxcode.com/start' : 'https://doc.fishxcode.com/codex';
        primaryDoc.textContent = tab === 'claude'
          ? (t['terminal.docs.claude'] || 'Claude 教程')
          : (t['terminal.docs.codex'] || 'Codex 教程');
      }
      if (secondaryDoc) {
        secondaryDoc.href = other === 'claude' ? 'https://doc.fishxcode.com/start' : 'https://doc.fishxcode.com/codex';
        secondaryDoc.textContent = other === 'claude'
          ? (t['terminal.docs.claude'] || 'Claude 教程')
          : (t['terminal.docs.codex'] || 'Codex 教程');
      }

      if (content) {
        var comment = tab === 'claude'
          ? (t['terminal.comment.claude'] || '// 配置 Claude')
          : (t['terminal.comment.codex'] || '// 配置 Codex');

        var configLines = tab === 'claude'
          ? [
            '<p><span class="kw">export</span> <span class="var">ANTHROPIC_BASE_URL</span><span class="op">=</span><span class="str">"https://fishxcode.com"</span></p>',
            '<p><span class="kw">export</span> <span class="var">ANTHROPIC_API_KEY</span><span class="op">=</span><span class="str">"sk-..."</span></p>'
          ]
          : [
            '<p><span class="kw">export</span> <span class="var">OPENAI_BASE_URL</span><span class="op">=</span><span class="str">"https://fishxcode.com/v1"</span></p>',
            '<p><span class="kw">export</span> <span class="var">OPENAI_API_KEY</span><span class="op">=</span><span class="str">"your_api_key_here"</span></p>'
          ];

        content.innerHTML = [
          '<p><span class="cm">' + comment + '</span></p>',
          configLines.join(''),
          '<p></p>',
          '<p><span class="cm">' + (t['terminal.start'] || '# 开始编码') + '</span></p>',
          '<p><span class="run">$</span> <span style="color:#e2e8f0">' + _terminalCommand(tab) + '</span></p>'
        ].join('');
      }
    }

    var _supportGalleryItems = [];
    var _supportGalleryIndex = 0;
    var _supportGalleryScale = 1;
    var _supportTouchStartX = 0;
    var _supportTouchEndX = 0;

    function _collectSupportGalleryItems() {
      return Array.prototype.slice.call(document.querySelectorAll('.support-qr-trigger')).map(function(el, idx) {
        var text = '';
        var labelEl = el.querySelector('span');
        if (labelEl) text = (labelEl.textContent || '').trim();
        return {
          src: el.getAttribute('href') || '',
          label: text || ('QR ' + (idx + 1))
        };
      }).filter(function(item) { return Boolean(item.src); });
    }

    function _applySupportGalleryZoom() {
      var img = document.getElementById('supportGalleryImage');
      if (!img) return;
      img.style.transform = 'scale(' + _supportGalleryScale + ')';
    }

    function _renderSupportGallery() {
      if (!_supportGalleryItems.length) return;
      var item = _supportGalleryItems[_supportGalleryIndex];
      var img = document.getElementById('supportGalleryImage');
      var caption = document.getElementById('supportGalleryCaption');
      var counter = document.getElementById('supportGalleryCounter');
      if (img) {
        img.src = item.src;
        img.alt = item.label;
      }
      if (caption) caption.textContent = item.label;
      if (counter) counter.textContent = (_supportGalleryIndex + 1) + ' / ' + _supportGalleryItems.length;
      _supportGalleryScale = 1;
      _applySupportGalleryZoom();
    }

    function openSupportGallery(index) {
      _supportGalleryItems = _collectSupportGalleryItems();
      if (!_supportGalleryItems.length) return;
      _supportGalleryIndex = Math.max(0, Math.min(Number(index) || 0, _supportGalleryItems.length - 1));
      var root = document.getElementById('supportGallery');
      if (!root) return;
      root.classList.add('open');
      root.setAttribute('aria-hidden', 'false');
      document.body.classList.add('support-gallery-open');
      _renderSupportGallery();
    }

    function closeSupportGallery() {
      var root = document.getElementById('supportGallery');
      if (!root) return;
      root.classList.remove('open');
      root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('support-gallery-open');
    }

    function onSupportGalleryPanelClick(e) {
      if (!e) return;
      var closeBtn = e.target && e.target.closest && e.target.closest('.support-gallery-close');
      var controls = e.target && e.target.closest && e.target.closest('.support-gallery-controls');
      var stage = e.target && e.target.closest && e.target.closest('.support-gallery-stage');
      if (closeBtn || (!controls && !stage)) closeSupportGallery();
    }

    function nextSupportGallery() {
      if (!_supportGalleryItems.length) return;
      _supportGalleryIndex = (_supportGalleryIndex + 1) % _supportGalleryItems.length;
      _renderSupportGallery();
    }

    function prevSupportGallery() {
      if (!_supportGalleryItems.length) return;
      _supportGalleryIndex = (_supportGalleryIndex - 1 + _supportGalleryItems.length) % _supportGalleryItems.length;
      _renderSupportGallery();
    }

    function zoomInSupportGallery() {
      _supportGalleryScale = Math.min(4, Math.round((_supportGalleryScale + 0.25) * 100) / 100);
      _applySupportGalleryZoom();
    }

    function zoomOutSupportGallery() {
      _supportGalleryScale = Math.max(1, Math.round((_supportGalleryScale - 0.25) * 100) / 100);
      _applySupportGalleryZoom();
    }

    function toggleSupportGalleryZoom() {
      _supportGalleryScale = _supportGalleryScale > 1 ? 1 : 2;
      _applySupportGalleryZoom();
    }

    function initSupportGallery() {
      document.querySelectorAll('.support-qr-trigger').forEach(function(el) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          var idx = Number(el.getAttribute('data-gallery-index') || '0');
          openSupportGallery(idx);
        });
      });

      document.addEventListener('keydown', function(e) {
        var root = document.getElementById('supportGallery');
        if (!root || !root.classList.contains('open')) return;
        if (e.key === 'Escape') closeSupportGallery();
        else if (e.key === 'ArrowRight') nextSupportGallery();
        else if (e.key === 'ArrowLeft') prevSupportGallery();
      });

      var stage = document.getElementById('supportGalleryStage');
      if (!stage) return;

      stage.addEventListener('touchstart', function(e) {
        if (!e.touches || !e.touches.length) return;
        _supportTouchStartX = e.touches[0].clientX;
      }, { passive: true });

      stage.addEventListener('touchend', function(e) {
        if (!e.changedTouches || !e.changedTouches.length) return;
        _supportTouchEndX = e.changedTouches[0].clientX;
        var dx = _supportTouchEndX - _supportTouchStartX;
        if (Math.abs(dx) < 36) return;
        if (dx < 0) nextSupportGallery();
        else prevSupportGallery();
      }, { passive: true });
    }

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // ─── 复制 URL（兼容 iframe Permissions Policy 限制）───────────────────────
    function _getT() {
      var lang = document.documentElement.lang || 'zh-CN';
      return _T[lang] || _T[_T[lang.split('-')[0]] ? lang.split('-')[0] : 'zh-CN'];
    }

    function _showCopied(btn) {
      var t = _getT();
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ' + (t['hero.copied'] || '已复制');
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> <span data-i18n="hero.copy">' + (t['hero.copy'] || '复制') + '</span>';
      }, 2000);
    }

    function _execCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta);
      return ok;
    }

    function copyUrl() {
      var url = document.getElementById('apiUrl').textContent.trim();
      var btn = document.getElementById('copyBtn');
      // 优先使用 Clipboard API，失败时降级到 execCommand（兼容 iframe 场景）
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function() {
          _showCopied(btn);
        }).catch(function() {
          if (_execCopy(url)) _showCopied(btn);
        });
      } else {
        if (_execCopy(url)) _showCopied(btn);
      }
    }

    function _fmtPrice(v, c) {
      var n = Number(v || 0);
      if (Number.isInteger(n)) return '¥' + n;
      return '¥' + n.toFixed(2);
    }

    function _fmtAmount(v) {
      var n = Number(v || 0);
      if (!n) return '--';
      return n.toLocaleString();
    }

    function _groupStorageKey(groupKey) {
      return 'sub-group-open:' + groupKey;
    }

    function _getGroupOpenState(groupKey, defaultOpen) {
      try {
        var saved = localStorage.getItem(_groupStorageKey(groupKey));
        if (saved === '1') return true;
        if (saved === '0') return false;
      } catch (_) {}
      return defaultOpen;
    }

    function _setGroupOpenState(groupKey, isOpen) {
      try {
        localStorage.setItem(_groupStorageKey(groupKey), isOpen ? '1' : '0');
      } catch (_) {}
    }

    function toggleSubGroup(btn) {
      var group = btn && btn.closest('.sub-group');
      if (!group) return;
      var isOpen = group.classList.toggle('open');
      var groupKey = group.getAttribute('data-group-key') || '';
      if (groupKey) _setGroupOpenState(groupKey, isOpen);
    }

    function toggleSubDetail(btn) {
      var detail = btn && btn.nextElementSibling;
      if (!detail) return;
      detail.classList.toggle('open');
      var t = _getT();
      var opened = detail.classList.contains('open');
      btn.textContent = opened ? (t['sub.hide'] || '收起规则') : (t['sub.expand'] || '查看规则');
    }

    function renderSubscriptionMatrix(matrix) {
      var root = document.getElementById('subscriptionMatrix');
      if (!root) return;

      var t = _getT();
      if (!matrix || !matrix.groups || !matrix.groups.length) {
        root.innerHTML = '<div class="sub-group"><div class="sub-group-body" style="display:block"><span class="sub-coming">' + (t['sub.loadFail'] || '套餐加载失败') + '</span></div></div>';
        return;
      }

      var cycleText = {
        daily: t['sub.cycle.daily'] || '天订阅',
        weekly: t['sub.cycle.weekly'] || '周订阅',
        monthly: t['sub.cycle.monthly'] || '月订阅',
      };

      root.innerHTML = matrix.groups.map(function(group, idx) {
        var defaultOpen = group.groupKey === 'claude';
        var isOpen = _getGroupOpenState(group.groupKey, defaultOpen);

        var cardsHtml = (group.plans || []).map(function(plan) {
          var amountLine = Number(plan.totalAmount || 0) > 0
            ? '<div>' + (t['sub.totalAmount'] || '总额度') + '：' + _fmtAmount(plan.totalAmount) + '</div>'
            : '';
          var cycleBadge = plan.cycleKey
            ? '<span class="sub-cycle">' + (cycleText[plan.cycleKey] || plan.cycleKey) + '</span>'
            : '';

          return [
            '<div class="sub-cell">',
            cycleBadge,
            '<div class="sub-title">' + plan.title + '</div>',
            '<div class="sub-price">' + _fmtPrice(plan.priceAmount, plan.currency) + '</div>',
            '<div class="sub-subtitle">' + (plan.subtitle || '') + '</div>',
            '<button class="sub-expand" onclick="toggleSubDetail(this)">' + (t['sub.expand'] || '查看规则') + '</button>',
            '<div class="sub-detail">',
            '<div>' + (t['sub.validity'] || '有效期') + '：' + (plan.durationLabel || '--') + '</div>',
            '<div>' + (t['sub.resetRule'] || '重置规则') + '：' + (plan.resetRuleLabel || '--') + '</div>',
            amountLine,
            '</div>',
            '</div>'
          ].join('');
        }).join('');

        return [
          '<div class="sub-group ' + (isOpen ? 'open' : '') + '" data-group-key="' + group.groupKey + '">',
          '<button class="sub-group-head" type="button" onclick="toggleSubGroup(this)">',
          '<span>' + group.label + '</span>',
          '<span class="sub-group-meta">',
          '<span>' + (group.plans ? group.plans.length : 0) + ' ' + (t['sub.planCount'] || '个套餐') + '</span>',
          '<span class="sub-group-chevron">▶</span>',
          '</span>',
          '</button>',
          '<div class="sub-group-body">',
          '<div class="sub-cards">' + cardsHtml + '</div>',
          '</div>',
          '</div>'
        ].join('');
      }).join('');
    }

    async function initSubscriptionMatrix() {
      try {
        var resp = await fetch('/api/subscription-matrix', { cache: 'no-store' });
        if (!resp.ok) throw new Error('load failed');
        var payload = await resp.json();
        renderSubscriptionMatrix(payload.matrix);
      } catch (_) {
        renderSubscriptionMatrix(null);
      }
    }

    renderTerminalPreview();
    initSubscriptionMatrix();
    initSupportGallery();
  </script>

  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  </script>
</body>
</html>`; }

function textResponse(body: BodyInit, contentType: string, cacheControl: string): Response {
  return new Response(body, {
    headers: {
      "content-type": contentType,
      "cache-control": cacheControl,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    if (path === "/robots.txt") {
      return textResponse(ROBOTS_TXT, "text/plain; charset=utf-8", "public, max-age=86400");
    }

    if (path === "/sitemap.xml") {
      return textResponse(SITEMAP_XML, "application/xml; charset=utf-8", "public, max-age=3600");
    }

    if (path === "/manifest.json") {
      return textResponse(MANIFEST_JSON, "application/manifest+json; charset=utf-8", "public, max-age=86400");
    }

    if (path === "/sw.js") {
      return textResponse(SW_JS, "application/javascript; charset=utf-8", "no-cache");
    }

    if (path === "/api/subscription-matrix") {
      const { plans, source } = await getSubscriptionPlans(env);
      const matrix = buildSubscriptionMatrix(plans);
      return jsonResponse({ success: true, source, matrix });
    }

    const visitCount = await incrementVisitCount(env);
    return textResponse(buildHtml(visitCount), "text/html; charset=utf-8", "no-store");
  },
};
