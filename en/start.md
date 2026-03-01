# Using FishXCode with Claude  Code

## 1. Get Your API Key

### Register

Visit [fishxcode.com](https://fishxcode.com/register?aff=9CTW) to create an account (password 8–20 characters, email required).

### Create a Token

Log in and go to **Console → Token Management → Add Token**. When creating:

- For **Token Group**, select **Official Channel**. This group includes `claude-opus-4-5-20251101`, `claude-haiku-4-5-20251001`, `claude-opus-4-6`, `claude-sonnet-4-5-20250929`, `claude-sonnet-4-6`, and more. The model is selected automatically based on task complexity.
- After creation, click the copy button to get your API Key (format: `sk-xxx`).

### Top Up

| Method | Path |
| --- | --- |
| Alipay | Console → Wallet → Enter amount → Alipay |
| WeChat Pay | Console → Wallet → Enter amount → WeChat |
| Redeem Code | Console → Wallet → Enter code → Redeem |

::: tip Rate Multiplier
A group labeled `0.5x` means you get double the tokens compared to the official price. For example, `0.5x` = 10M tokens for ¥1 (vs. 5M at official pricing).
:::

---

## 2. Environment Setup

### Install Node.js

Claude  Code is installed via npm. Verify Node.js is available first.

::: code-group

```bash [macOS - Verify]
node -v
npm -v
```

```bash [macOS - Install via Homebrew]
brew install node
```

```bash [Windows - Verify (CMD/PowerShell)]
node -v
npm -v
```

:::

If not installed, download from [nodejs.org/en/download](https://nodejs.org/en/download). **Windows requires a restart** after installation.

### Windows Only: Install Git Bash

Claude  Code requires a bash environment. Windows users must install Git Bash:

1. Download from [git-scm.com/download/windows](https://git-scm.com/download/windows) and install.
2. Verify: right-click the desktop — if **Open Git Bash here** appears, installation succeeded.

---

## 3. Install Claude  Code

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

Verify installation:

```bash
claude --version
```

---

## 4. Configure FishXCode

### Option 1: settings.json (Recommended)

Edit `~/.claude/settings.json` (Windows: `C:\Users\<username>\.claude\settings.json`):

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-key-here",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  },
  "permissions": {
    "allow": [
      "Bash",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "Glob(*)",
      "Grep(*)"
    ],
    "deny": []
  }
}
```

This configuration **persists permanently** — no need to set variables each session.

### Option 2: Temporary Environment Variables

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_BASE_URL=https://fishxcode.com/
export ANTHROPIC_AUTH_TOKEN=sk-xxx
```

```powershell [Windows PowerShell (temporary)]
$env:ANTHROPIC_BASE_URL="https://fishxcode.com/"
$env:ANTHROPIC_AUTH_TOKEN="sk-xxx"
```

```cmd [Windows CMD (temporary)]
set ANTHROPIC_BASE_URL=https://fishxcode.com/
set ANTHROPIC_AUTH_TOKEN=sk-xxx
```

:::

To write permanently to Windows system variables, run in PowerShell:

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

Reopen the terminal after running these commands.

::: warning
Replace `sk-xxx` with your actual Token from the [FishXCode Console](https://fishxcode.com/console/token).
:::

---

## 5. Launch

```bash
cd my-project
claude
```

---

## 6. Model Selection

Type `/model` inside Claude  Code to switch models:

| Option | Model | Notes |
| --- | --- | --- |
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Auto-selected by task complexity. Recommended. |
| **Opus** | `claude-opus-4-5-20251101` | Strongest reasoning, higher cost |
| **Haiku** | `claude-haiku-4-5-20251001` | Lightweight and fast |

You can also pin a model via environment variable:

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

::: tip Upgrade Claude  Code
If the model version appears outdated, upgrade and restart your tools:

```bash
npm install -g @anthropic-ai/claude-code
```

:::

---

## 7. IDE Integration (IntelliJ IDEA)

**Path**: IDEA → File → Settings → Plugins → Marketplace → search `claude code` → install **Claude  Code Terminal**.

::: info
If the plugin doesn't appear in the Marketplace, your IDEA version is too old — upgrade to the latest release.
:::

---

## 8. Troubleshooting

### 403 Error

Token balance is insufficient. Top up in the console and retry.

### Windows: Connection Error or 400/401

Run these commands in PowerShell to write permanent system variables, then reopen the terminal:

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

### "Unable to connect to Anthropic services"

Full error:

```
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR_BAD_REQUEST
Please check your internet connection and network settings.
```

This happens because Claude  Code hasn't completed onboarding and still tries to connect to `api.anthropic.com`. **No VPN required.** Open `~/.claude.json` (the `.claude.json` in your home directory — not `.claude/settings.json`) and add `"hasCompletedOnboarding": true`:

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Make sure to add a comma after the preceding field before adding the new entry. Restart `claude` after saving.
:::
