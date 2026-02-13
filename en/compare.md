# Tool Comparison

Choose the right AI coding tool for your workflow. Here is a comprehensive comparison of all tools available on the FishXCode platform.

## Basic Information

| Tool | Developer | Type |
|------|-----------|------|
| **Claude Code** | Anthropic | CLI Terminal Tool |
| **OpenAI Codex** | OpenAI | CLI + VSCode Extension |
| **Gemini CLI** | Google | CLI Terminal Tool |
| **RooCode** | Roo Veterinary | VSCode Extension |
| **Qwen Code** | Alibaba | CLI Terminal Tool |
| **Droid CLI** | Factory AI | CLI Terminal Tool |
| **OpenCode** | OpenCode AI | CLI Terminal Tool (TUI) |

## Platform Support

| Tool | macOS | Windows | Linux |
|------|:-----:|:-------:|:-----:|
| **Claude Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Gemini CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **RooCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Droid CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |

## IDE Integration

| Tool | Terminal | VSCode | Other IDEs |
|------|:-------:|:------:|:----------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | - |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | :white_check_mark: | - |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | :white_check_mark: | - | - |
| **OpenCode** | :white_check_mark: | - | - |

## Configuration Method

| Tool | Environment Variables | Config Files | GUI Settings |
|------|:---------------------:|:------------:|:------------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | TOML + JSON | VSCode Settings |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | - | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | - | JSON | CLI Interactive |
| **OpenCode** | :white_check_mark: | JSON | TUI Interactive |

## FishXCode Compatibility

| Tool | Status | Setup Difficulty | Notes |
|------|:------:|:----------------:|-------|
| **Claude Code** | :white_check_mark: Supported | Easy | Set environment variables |
| **OpenAI Codex** | :white_check_mark: Supported | Medium | Requires TOML and JSON config files |
| **Gemini CLI** | :x: Not Supported | - | No custom routing support |
| **RooCode** | :white_check_mark: Supported | Easy | GUI provider configuration |
| **Qwen Code** | :white_check_mark: Supported | Easy | Set environment variables |
| **Droid CLI** | :white_check_mark: Supported | Medium | Requires JSON config editing |
| **OpenCode** | :white_check_mark: Supported | Medium | Requires JSON config editing |

::: warning Gemini CLI Not Yet Supported
Gemini CLI does not currently support custom API routing, making it incompatible with FishXCode. If you are looking for an alternative, consider any of the other supported tools listed above.
:::

## Key Features

| Tool | Highlights |
|------|------------|
| **Claude Code** | Superior code understanding and generation, native terminal experience, multi-model switching |
| **OpenAI Codex** | Dual CLI and VSCode modes, GPT model family support, mature ecosystem |
| **Gemini CLI** | Powered by Google AI, deep integration with Google ecosystem |
| **RooCode** | Full VSCode graphical experience, OpenAI Compatible protocol, zero terminal barrier |
| **Qwen Code** | Backed by Alibaba's Qwen models, optimized for multilingual scenarios, lightweight |
| **Droid CLI** | Flexible custom model support, extra-large context windows, terminal-focused workflow |
| **OpenCode** | Open-source TUI interface, 75+ model support, built-in build/plan dual-mode agents, GitHub Copilot integration |

## How to Choose

::: tip Terminal Workflow
If you prefer working entirely in the terminal, go with **Claude Code** or **OpenAI Codex**. Both offer a smooth command-line experience. Claude Code has the simplest setup, while Codex also provides a VSCode extension.
:::

::: tip VSCode Integration
If you prefer a graphical IDE experience, choose **RooCode** or **OpenAI Codex**. RooCode offers a pure GUI experience with easy setup, while Codex gives you both terminal and editor modes.
:::

::: tip Quickest Setup
If you want to get started as fast as possible, pick **Claude Code**, **RooCode**, or **Qwen Code**. All three can be configured and running within minutes.
:::

::: tip Maximum Customization
If you need flexible model configuration and extra-large context support, try **Droid CLI**. It supports custom model parameters with up to 1.28 million token context windows.
:::

::: tip Multilingual Development
If your projects involve Chinese documentation or comments, **Qwen Code** offers the best understanding and generation for Chinese-language code scenarios.
:::
