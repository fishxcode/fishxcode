# 在 Claude  Code 中使用 FishXCode

## 一、获取 API Key

### 1. 注册账号

访问 [fishxcode.com](https://fishxcode.com/register?aff=9CTW) 完成注册。

### 2. 创建令牌

登录后进入**控制台 → 令牌管理 → 添加令牌**，创建时注意：

- **令牌分组**建议选择 **官渠**，该分组包含 `claude-opus-4-5-20251101`、`claude-haiku-4-5-20251001`、`claude-opus-4-6`、`claude-sonnet-4-5-20250929`、`claude-sonnet-4-6` 等模型，会根据任务复杂度自动选择，无需手动切换。
- 创建完成后点击拷贝按钮获取 API Key（格式为 `sk-xxx`）。

### 3. 充值

| 方式 | 操作路径 |
|---|---|
| 支付宝 | 控制台 → 钱包管理 → 输入/选择金额 → 支付宝 |
| 微信 | 控制台 → 钱包管理 → 输入/选择金额 → 微信 |
| 兑换码 | 控制台 → 钱包管理 → 兑换码区域输入 → 点击兑换额度 |

::: tip 倍率说明
分组名称中的 `0.5x倍率` 表示消费倍率，数值越小获得更多 Token，如 `0.5x` 即 1 元可使用官方 1000 万 Token（官方原价 500 万）。
:::

---

## 二、环境准备

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

## 三、安装 Claude  Code

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

## 四、配置 FishXCode

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

## 五、启动使用

```bash
cd my-project
claude
```

---

## 六、模型切换

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

## 七、IDE 集成（IntelliJ IDEA）

**安装路径**：IDEA → 文件 → 设置 → 插件 → Marketplace → 搜索 `claude code` → 找到 **Claude Code Terminal** → 安装。

::: info
若在插件市场搜索不到，说明当前 IDEA 版本过低，需升级至最新版本。
:::

---

## 八、常见问题

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
