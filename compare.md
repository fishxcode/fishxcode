# 工具对比

选择适合你的 AI 编程工具。以下是 FishXCode 平台支持的各工具全面对比。

## 基本信息

| 工具 | 开发者 | 类型 |
|------|--------|------|
| **Claude Code** | Anthropic | CLI 终端工具 |
| **OpenAI Codex** | OpenAI | CLI + VSCode 扩展 |
| **Gemini CLI** | Google | CLI 终端工具 |
| **RooCode** | Roo Veterinary | VSCode 扩展 |
| **Qwen Code** | 阿里巴巴 | CLI 终端工具 |
| **Droid CLI** | Factory AI | CLI 终端工具 |
| **OpenCode** | OpenCode AI | CLI 终端工具 (TUI) |

## 平台支持

| 工具 | macOS | Windows | Linux |
|------|:-----:|:-------:|:-----:|
| **Claude Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Gemini CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **RooCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Droid CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |

## IDE 集成

| 工具 | 终端 | VSCode | 其他 IDE |
|------|:----:|:------:|:--------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | - |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | :white_check_mark: | - |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | :white_check_mark: | - | - |
| **OpenCode** | :white_check_mark: | - | - |

## 配置方式

| 工具 | 环境变量 | 配置文件 | GUI 设置 |
|------|:--------:|:--------:|:--------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | TOML + JSON | VSCode 设置 |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | - | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | - | JSON | CLI 交互 |
| **OpenCode** | :white_check_mark: | JSON | TUI 交互 |

## FishXCode 兼容性

| 工具 | 支持状态 | 接入难度 | 备注 |
|------|:--------:|:--------:|------|
| **Claude Code** | :white_check_mark: 已支持 | 简单 | 设置环境变量即可 |
| **OpenAI Codex** | :white_check_mark: 已支持 | 中等 | 需配置 TOML 和 JSON 文件 |
| **Gemini CLI** | :x: 暂不支持 | - | 不支持自定义路由 |
| **RooCode** | :white_check_mark: 已支持 | 简单 | GUI 界面配置提供商 |
| **Qwen Code** | :white_check_mark: 已支持 | 简单 | 设置环境变量即可 |
| **Droid CLI** | :white_check_mark: 已支持 | 中等 | 需编辑 JSON 配置文件 |
| **OpenCode** | :white_check_mark: 已支持 | 中等 | 需编辑 JSON 配置文件 |

::: warning Gemini CLI 暂不支持
Gemini CLI 目前不支持自定义 API 路由，因此无法接入 FishXCode。如需使用 Google 生态，建议选择其他已支持的工具作为替代。
:::

## 核心特性

| 工具 | 核心亮点 |
|------|----------|
| **Claude Code** | 强大的代码理解与生成能力，原生终端体验，支持多模型切换 |
| **OpenAI Codex** | CLI 与 VSCode 双模式，GPT 系列模型支持，生态成熟 |
| **Gemini CLI** | Google AI 驱动，与 Google 生态深度集成 |
| **RooCode** | 纯 VSCode 图形化体验，OpenAI Compatible 协议，零终端门槛 |
| **Qwen Code** | 阿里通义系列加持，对中文代码场景优化，轻量易用 |
| **Droid CLI** | 自定义模型灵活，支持超大上下文窗口，专注终端工作流 |
| **OpenCode** | 开源 TUI 界面，支持 75+ 模型，内置 build/plan 双模式 Agent，GitHub Copilot 集成 |

## 如何选择

::: tip 偏好终端工作流
如果你习惯在终端中完成所有操作，推荐 **Claude Code** 或 **OpenAI Codex**。两者都提供流畅的命令行体验，其中 Claude Code 配置最简单，Codex 则额外支持 VSCode。
:::

::: tip 偏好 VSCode 图形化
如果你更喜欢在 VSCode 中操作，推荐 **RooCode** 或 **OpenAI Codex**。RooCode 提供纯图形化体验且配置简单，Codex 则兼具终端和编辑器两种模式。
:::

::: tip 追求最简配置
如果你希望最快上手，推荐 **Claude Code**、**RooCode** 或 **Qwen Code**。三者均可在数分钟内完成配置并开始使用。
:::

::: tip 需要高度自定义
如果你需要灵活的模型配置和超大上下文支持，推荐 **Droid CLI**。它支持自定义模型参数，最大可配置 128 万 Token 上下文。
:::

::: tip 中文开发场景
如果你的项目以中文为主，推荐 **Qwen Code**。它对中文代码注释和文档有更好的理解和生成能力。
:::
