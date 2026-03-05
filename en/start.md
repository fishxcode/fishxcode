# Using FishXCode with Claude  Code

> New here? Complete [Account Setup](/en/account) first.

## Video Tutorial

<VideoPlayer src="https://s3.hi168.com/hi168-27900-8344owwk/fishxcode_claude.mp4" />

## 1. Environment Setup

### Install Node.js

Claude  Code is installed via npm. Confirm Node.js is available first.

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

If not installed, download from [nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download) for your platform. **Windows requires a restart** after installation.

### Windows Only: Install Git Bash

Claude  Code requires a bash environment. Windows users must install Git Bash:

1. Download from [git-scm.com/install/windows](https://git-scm.com/download/windows) and install the appropriate version.
2. Verify: right-click the desktop — if **Open Git Bash here** appears, installation succeeded.

---

## 2. Install Claude  Code

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

## 3. Configure FishXCode

### Option 1: settings.json (Recommended)

Edit `~/.claude/settings.json` (Windows: `C:\Users\<username>\.claude\settings.json`) with the following content:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "replace with your API Key",
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

This configuration **persists permanently** — no need to set environment variables each session.

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

Reopen the terminal after running these commands for the changes to take effect.

::: warning
Replace `sk-xxx` with your actual Token from the [FishXCode Console](https://fishxcode.com/console/token).
:::

---

## 4. Launch

```bash
cd my-project
claude
```

---

## 5. Model Selection

Type `/model` inside Claude  Code to switch models:

| Option | Model | Notes |
|---|---|---|
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Auto-selected by task complexity. Recommended for daily use. |
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
If the model version appears outdated, run the upgrade command and restart your tools:
```bash
npm install -g @anthropic-ai/claude-code
```
:::

---

## 6. IDE Integration

### IntelliJ IDEA

Navigate to: File → Settings → Plugins → Marketplace → search `claude code`, find **Claude  Code Terminal** and install:

![Install Claude  Code Terminal](/img/start/idea-01-install.png)

After installation, restart IDEA and verify the plugin has loaded:

![Verify Plugin Loaded](/img/start/idea-02-verify.png)

::: info
If the plugin does not appear in the Marketplace, your current IDEA version is too old — upgrade to the latest release.
:::

### VSCode

Press `Ctrl + Shift + X` to open the Extensions panel, search `claude code`, and install **Claude  Code for VSCode**.

![Search and Install Claude  Code Extension](/img/start/vscode-01-install.png)

After installation, the extension offers three connection methods:

![Claude  Code Extension Connection Methods](/img/start/vscode-02-login.png)

It is recommended to connect to FishXCode via `settings.json`. Click the **gear icon** in the bottom-right of the extension → **Edit in settings.json**:

![Open settings.json for Editing](/img/start/vscode-03-settings.png)

Add the following to VSCode's `settings.json`:

```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "replace with your API Key" },
    { "name": "ANTHROPIC_BASE_URL", "value": "https://fishxcode.com/" }
  ]
}
```

![settings.json Configuration Example](/img/start/vscode-04-config.png)

After saving, **quit and reopen VSCode** — the extension will connect to FishXCode normally.

![Using Claude  Code in VSCode](/img/start/vscode-05-demo.gif)

---

## 7. FAQ

### 403 Error

Token balance is insufficient. Top up in the console and retry.

### Windows: Connection Error or 400/401

Re-run the `setx` commands in PowerShell to write system variables, then reopen the terminal:

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

This happens because Claude  Code has not completed onboarding and is still trying to connect to `api.anthropic.com`. **No VPN required.** Open `~/.claude.json` (the `.claude.json` in your home directory — not `.claude/settings.json`) and add `"hasCompletedOnboarding": true` at the end:

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Make sure to add a comma after the preceding field (required by JSON syntax). Restart `claude` after saving to connect normally.
:::
