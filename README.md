<p align="center">
  <img src="public/img/logo.svg" width="120" alt="FishXCode Logo">
</p>

<h1 align="center">FishXCode</h1>

<p align="center">
  AI Coding 中转站 — 支持 Claude、Codex、Gemini 模型在多种平台使用
</p>

<p align="center">
  <a href="https://doc.fishxcode.com">文档</a> ·
  <a href="https://doc.fishxcode.com/en/">English</a> ·
  <a href="https://fishxcode.com/register">注册</a> ·
  <a href="https://doc.fishxcode.com/faq">FAQ</a>
</p>

---

## 简介

FishXCode 是一个面向开发者的 AI Coding 公益服务平台，提供免费 API 额度，帮助开发者零成本使用主流 AI 编程工具。

**支持的工具：**

| 工具 | 类型 | 文档 |
|------|------|------|
| Claude Code | Anthropic 官方 CLI | [查看](/start) |
| OpenAI Codex | OpenAI 官方编程助手 | [查看](/codex) |
| Gemini CLI | Google 命令行 AI 工具 | [查看](/gemini) |
| RooCode | VS Code AI 编程插件 | [查看](/roocode) |
| Qwen Code | 阿里通义千问编程工具 | [查看](/qwencode) |
| Droid CLI | 轻量级 AI 编程 CLI | [查看](/droid) |

## 本地开发

```bash
pnpm install
pnpm dev
```

构建：

```bash
pnpm build
pnpm preview
```

## 项目结构

```
├── .github/workflows/  # GitHub Actions 部署
├── .vitepress/
│   ├── config.mts      # 站点配置（i18n / SEO / Feed）
│   └── theme/          # 自定义主题（404 页面）
├── public/
│   ├── img/            # Logo 及 OG 图片
│   └── robots.txt
├── en/                 # English
├── fr/                 # Français
├── es/                 # Español
├── pt/                 # Português
├── *.md                # 中文（默认语言）
├── vercel.json         # Vercel 部署配置
└── package.json
```

## 多语言

文档支持 5 种语言：简体中文（默认）、English、Français、Español、Português。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

构建产物包含：
- `sitemap.xml` — 站点地图
- `feed.xml` — RSS 2.0
- `feed.atom` — Atom 1.0
- `robots.txt` — 爬虫规则

## License

[MIT](LICENSE)
