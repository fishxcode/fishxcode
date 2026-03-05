# 在 Claude  Code 中使用 FishXCode

> 首次使用？请先完成 [账户注册与充值](/account)。

## 视频教程

<VideoPlayer src="https://s3.hi168.com/hi168-27900-8344owwk/fishxcode_claude.mp4" />

## 一、环境准备

### 安装 Node.js

Claude  Code 通过 npm 安装，需先确认 Node.js 已就绪。

::: code-group

```bash [macOS - 验证]
node -v
npm -v
```

```bash [macOS - Homebrew 安装]
brew install node
```

```bash [Windows - 验证（CMD/PowerShell）]
node -v
npm -v
```

:::

若未安装，前往 [nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download) 下载对应平台安装包，安装完成后 **Windows 需重启**。

### Windows 额外：安装 Git Bash

Claude  Code 依赖 bash 运行环境，Windows 用户需安装 Git Bash：

1. 下载地址：[git-scm.com/install/windows](https://git-scm.com/download/windows)，选择对应版本安装。
2. 验证：右键桌面，出现 **Open Git Bash here** 选项即安装成功。

---

## 二、安装 Claude  Code

::: code-group

```bash [npm]
npm install -g @anthropic-ai/claude-code
```

```bash [pnpm]
pnpm install -g @anthropic-ai/claude-code
```

```bash [yarn]
yarn global add @anthropic-ai/claude-code
```

:::

验证安装：

```bash
claude --version
```

---

## 三、配置 FishXCode

### 方式一：settings.json（推荐）

编辑 `~/.claude/settings.json`（Windows 路径：`C:\Users\<用户名>\.claude\settings.json`），写入以下内容：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "替换为您的 API Key",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  },
  "permissions": {
    "allow": [
      "Bash",
      "LS(*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "MultiEdit(*)",
      "Glob(*)",
      "Grep(*)",
      "Task(*)",
      "WebFetch(domain:*)",
      "WebSearch",
      "TodoWrite(*)",
      "NotebookRead(*)",
      "NotebookEdit(*)"
    ],
    "defaultMode": "bypassPermissions",
    "deny": []
  },
}
```

此方式**永久生效**，无需每次配置环境变量。

### 方式二：临时环境变量

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_BASE_URL=https://fishxcode.com/
export ANTHROPIC_AUTH_TOKEN=sk-xxx
```

```powershell [Windows PowerShell（临时）]
$env:ANTHROPIC_BASE_URL="https://fishxcode.com/"
$env:ANTHROPIC_AUTH_TOKEN="sk-xxx"
```

```cmd [Windows CMD（临时）]
set ANTHROPIC_BASE_URL=https://fishxcode.com/
set ANTHROPIC_AUTH_TOKEN=sk-xxx
```

:::

如需 Windows 永久写入系统变量，在 PowerShell 中执行：

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

执行后需重新打开终端窗口生效。

::: warning
请将 `sk-xxx` 替换为你在 [FishXCode 控制台](https://fishxcode.com/console/token) 获取的实际 Token。
:::

---

## 四、启动使用

```bash
cd my-project
claude
```

---

## 五、模型切换

在 Claude  Code 对话界面中输入 `/model` 即可切换模型：

| 选项 | 实际模型 | 说明 |
|---|---|---|
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | 根据任务自动选择，推荐日常使用 |
| **Opus** | `claude-opus-4-5-20251101` | 最强推理能力，消耗较高 |
| **Haiku** | `claude-haiku-4-5-20251001` | 轻量快速 |

也可通过环境变量固定模型：

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
claude
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_MODEL="claude-sonnet-4-5-20250929"
claude
```

:::

::: tip 升级 Claude  Code
如发现模型版本不是最新，执行升级命令后重启相关工具：
```bash
npm install -g @anthropic-ai/claude-code
```
:::

---

## 六、IDE 集成

### IntelliJ IDEA

操作路径：文件 → 设置 → 插件 → Marketplace → 搜索 `claude code`，找到 **Claude  Code Terminal** 并安装：

![安装 Claude  Code Terminal](/img/start/idea-01-install.png)

安装完成后重启 IDEA，验证插件已加载：

![验证插件已加载](/img/start/idea-02-verify.png)

::: info
若在插件市场搜索不到，说明当前 IDEA 版本过低，需升级至最新版本。
:::

### VSCode

按 `Ctrl + Shift + X` 打开扩展面板，搜索 `claude code`，找到 **Claude  Code for VSCode** 安装。

![搜索并安装 Claude  Code 插件](/img/start/vscode-01-install.png)

安装完成后，插件提供三种接入方式：

![Claude  Code 插件接入方式](/img/start/vscode-02-login.png)

推荐通过 `settings.json` 配置接入 FishXCode。点击插件右下角**齿轮图标** → **在 settings.json 中编辑**：

![打开 settings.json 编辑](/img/start/vscode-03-settings.png)

在 VSCode 的 `settings.json` 中添加：

```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "替换为您的 API Key" },
    { "name": "ANTHROPIC_BASE_URL", "value": "https://fishxcode.com/" }
  ]
}
```

![settings.json 配置示例](/img/start/vscode-04-config.png)

保存后**退出并重新打开 VSCode**，插件即可正常连接 FishXCode。

![在 VSCode 中使用 Claude  Code](/img/start/vscode-05-demo.gif)

---

## 七、常见问题

### 出现 403 错误

Token 余额不足，前往控制台充值后重试。

### Windows 出现连接异常或 400/401 错误

在 PowerShell 中重新执行 `setx` 命令写入系统变量，然后重新打开终端：

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

### 提示"Unable to connect to Anthropic services"

完整错误如下：

```
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR_BAD_REQUEST
Please check your internet connection and network settings.
```

这是因为 Claude  Code 尚未完成 onboarding，仍尝试连接官方 `api.anthropic.com`。**无需科学上网**，在 `~/.claude.json`（注意是 home 目录下的 `.claude.json`，不是 `.claude/settings.json`）末尾添加 `"hasCompletedOnboarding": true` 即可跳过：

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
添加前注意在上一个字段末尾补逗号（JSON 语法要求）。修改后重新运行 `claude` 即可正常连接。
:::
