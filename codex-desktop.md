---
title: 在 Codex Desktop 中使用 FishXCode
description: 用 Codex Desktop 接入 FishXCode 的安装、配置复用、登录和常见功能说明。
---

# 在 Codex Desktop 中使用 FishXCode

> 首次使用？请先完成 [账户注册与充值](/account)，并在 [FishXCode 控制台](https://fishxcode.com/console/token) 创建可用 Token。

## 适用范围

本文适用于 OpenAI Codex 桌面端接入 FishXCode。命令行版 Codex 的安装和配置可直接参考 [在 Codex 中使用 FishXCode](/codex)，桌面端也建议复用同一套 `~/.codex` 配置，减少重复维护。

::: tip 推荐路径
先写好本地 Codex 配置，再打开 Codex Desktop 登录。这样桌面端和 CLI 使用同一套 FishXCode API 地址、模型和 Token。
:::

## 一、安装 Codex Desktop

Windows 用户可在 Microsoft Store 搜索 `Codex`，找到官方应用后安装：

![从 Microsoft Store 安装 Codex Desktop](/img/start/codex-desktop/microsoft-store-codex.png)

安装完成后，先不要急着登录，建议先完成下一步本地配置。若无法访问 Microsoft Store，请优先使用 OpenAI 官方发布渠道或可信的软件分发渠道下载安装包。

## 二、复用 Codex 配置接入 FishXCode

Codex Desktop 与 Codex CLI 建议使用同一套用户配置。配置内容与 [Codex 命令行教程](/codex) 保持一致。

### 1. 创建配置目录

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.codex
```

```powershell [Windows PowerShell]
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex"
```

:::

### 2. 写入 `config.toml`

在 `~/.codex/config.toml` 中写入：

```toml
model_provider = "fishxcode"
model = "gpt-5.4"
review_model = "gpt-5.4"
model_reasoning_effort = "medium"
model_reasoning_summary = "detailed"
disable_response_storage = true
preferred_auth_method = "apikey"
model_verbosity = "high"

[model_providers.fishxcode]
name = "OpenAI using Chat Completions"
base_url = "https://api.fishxcode.com/v1"
wire_api = "responses"
requires_openai_auth = true

[features]
skills = true
image_generation = false

```

::: info
`model` 和 `review_model` 可按你的套餐和分组改成其它可用模型。若不确定，先使用 `gpt-5.4`。
:::

### 3. 写入 `auth.json`

在 `~/.codex/auth.json` 中写入 FishXCode Token：

```json
{
  "OPENAI_API_KEY": "your_api_key_here"
}
```

::: warning 注意
`auth.json` 包含密钥，不要提交到 Git，也不要发给他人。
:::

## 三、登录 Codex Desktop

打开 Codex Desktop 后，如果出现登录页，选择 **使用其他方式登录**：

![选择使用其他方式登录](/img/start/codex-desktop/codex-login-options.png)

然后粘贴 FishXCode 控制台中复制的 Token。若你已经写入 `~/.codex/auth.json`，仍然遇到登录提示，也可以在这里再次粘贴同一个 Token。

如果需要复制 Token，可在 FishXCode 控制台令牌页找到对应 Token，点击密钥旁的复制按钮。截图中不展示复制菜单，避免教程图片暴露不必要的密钥信息。

登录后进入项目目录，选择要让 Codex 操作的文件夹，即可开始使用。

## 四、可选：用 CC Switch 管理多渠道

如果你同时维护多个 Codex 渠道，可以使用 CC Switch 做快速切换；如果只使用 FishXCode，一个 `~/.codex/config.toml` 通常已经足够。

在 FishXCode 控制台令牌页找到目标令牌后，点击 `codex_sub_june` 分组对应行的 **导入**：

![在 FishXCode 控制台点击 Codex 分组导入](/img/start/codex-desktop/cc-switch-import-channel.png)

CC Switch 导入弹窗中选择 `Codex` 应用后，核心字段建议保持：

| 字段 | FishXCode 推荐值 |
| --- | --- |
| API 端点 | `https://api.fishxcode.com/v1` |
| API 密钥 | FishXCode Token |
| 主模型 | `gpt-5.4` 或你的套餐可用模型 |

主模型切换到 `gpt-5.4` 后点击 **测试**，看到“测试通过 / 模型连通性测试成功”后再导入：

![在 CC Switch 导入弹窗中测试 gpt-5.4](/img/start/codex-desktop/cc-switch-select-model.png)

浏览器唤起 CC Switch 后，核对 API 端点、模型和备注信息，确认无误再点击 **导入**：

![确认导入 FishXCode Codex 配置](/img/start/codex-desktop/cc-switch-import-success.png)

配置完成后，确认当前切换到 FishXCode 对应渠道，再重新打开 Codex Desktop。

## 五、常用功能

### 模型、推理强度和权限

Codex Desktop 的输入框附近通常会显示模型、推理强度、权限模式和工作目录：

![Codex Desktop 对话框选项](/img/start/codex-desktop/codex-dialog-options.png)

建议日常使用：

- 模型：选择 FishXCode 可用模型，例如 `gpt-5.4`
- 推理强度：普通任务用中等，高复杂度任务再调高
- 权限模式：需要频繁改代码时可使用完全访问模式；不熟悉项目时先保持手动确认
- 工作目录：选择当前要分析或修改的项目目录

### `/` 和 `@`

在输入框中可以使用两个常见快捷入口：

| 符号 | 用途 |
| --- | --- |
| `/` | 打开命令或 Skill 列表 |
| `@` | 引用当前项目中的文件或目录 |

如果符号没有触发菜单，先确认 `/` 或 `@` 前有空格，且输入框焦点在 Codex Desktop 内。

### 计划模式

复杂任务建议先使用 Plan Mode。Codex 会先拆解任务、提出澄清问题，确认后再执行。

![进入计划模式](/img/start/codex-desktop/codex-plan-mode.png)

当 Codex 提出澄清问题时，按实际需求选择方向：

![回答澄清问题](/img/start/codex-desktop/codex-clarify-question.png)

确认计划后再让 Codex 执行，并在过程中检查变更范围：

![执行计划并跟踪进度](/img/start/codex-desktop/codex-execute-plan.png)

## 六、常见问题

### 登录后请求仍然没有走 FishXCode？

按顺序检查：

1. `~/.codex/config.toml` 是否存在
2. `model_provider` 是否为 `fishxcode`
3. `base_url` 是否为 `https://api.fishxcode.com/v1`
4. `~/.codex/auth.json` 中是否写入 FishXCode Token
5. 修改配置后是否彻底退出并重新打开 Codex Desktop

### 报 401 或 403 怎么办？

优先检查 Token 是否复制完整、是否启用、余额是否充足，以及当前模型是否在你的套餐或分组中可用。

### 模型显示和预期不一致？

先确认 `config.toml` 中的 `model`，再检查 Codex Desktop 内部模型选择器。如果使用 CC Switch，还要确认当前切换的是 FishXCode 渠道。

### 出现 CC Switch 未配置提示？

如果你使用 CC Switch 并看到类似提示，说明当前渠道没有切换好：

![CC Switch 未配置好时的提示](/img/start/codex-desktop/cc-switch-not-configured.png)

处理方式：

1. 完全退出 Codex Desktop，包括托盘进程
2. 打开 CC Switch，确认已切换到 FishXCode 渠道
3. 重新打开 Codex Desktop

如果你不使用 CC Switch，则回到第二步，直接检查 `~/.codex/config.toml` 和 `~/.codex/auth.json`。
