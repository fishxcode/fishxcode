# Using FishXCode with OpenClaw

::: info Project Introduction
OpenClaw is an open-source, self-hosted personal AI assistant platform that bridges messaging apps to AI agents running on your own hardware. Designed for developers and power users who want autonomous AI assistants without surrendering data control.

- Official Website: [https://openclaw.ai](https://openclaw.ai)
- Documentation: [https://docs.openclaw.ai](https://docs.openclaw.ai)
- GitHub: [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
:::

## Core Features

### Multi-Channel Integration

- **Full Platform Coverage**: Supports Lark (Feishu), Discord, Slack, Microsoft Teams, and more
- **Single Gateway**: Manage all channels through a single Gateway process
- **Voice Support**: Voice interaction on macOS/iOS/Android
- **Canvas Interface**: Render interactive Canvas interfaces

### Self-Hosted & Data Security

- **Fully Self-Hosted**: Runs on your own machine or server
- **Open Source**: MIT licensed, fully transparent code
- **Local Data Storage**: Context and skills stored on your local computer, not in the cloud

### Intelligent Agent Capabilities

- **Always-On**: Supports background persistent operation with persistent memory
- **Scheduled Tasks**: Supports cron scheduled tasks
- **Session Isolation**: Sessions isolated per agent/workspace/sender
- **Multi-Agent Routing**: Supports multi-agent collaborative work
- **Tool Calling**: Native support for tool calling and code execution

## Installation

::: info Requirements
- Node.js 22 or higher
- FishXCode API Key
:::

```bash
npm install -g openclaw@latest
```

After installation, run the onboarding wizard:

```bash
openclaw onboard
```

## Configuration

### Configuration File Location

The OpenClaw configuration file is located at `~/.openclaw/config.json`. It can be auto-generated through the onboarding wizard or manually edited.

### Configuration Example

Here is a complete configuration example using FishXCode as the model provider:

```json
{
  "models": {
    "providers": {
      "fishxcode": {
        "baseUrl": "https://fishxcode.com/v1",
        "apiKey": "sk-your-fishxcode-token",
        "auth": "api-key",
        "api": "openai-completions",
        "models": [
          {
            "id": "claude-sonnet-4-5-20250929",
            "name": "claude-sonnet-4-5-20250929",
            "api": "openai-completions",
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 64000
          },
          {
            "id": "gpt-5",
            "name": "gpt-5",
            "api": "openai-completions",
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 128000,
            "maxTokens": 64000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "fishxcode/claude-sonnet-4-5-20250929",
        "fallbacks": ["fishxcode/gpt-5"]
      },
      "workspace": "/home/your-username/.openclaw/workspace",
      "maxConcurrent": 4,
      "subagents": { "maxConcurrent": 8 }
    }
  },
  "channels": {
    "lark": {
      "enabled": true,
      "dmPolicy": "pairing",
      "appId": "your-lark-app-id",
      "appSecret": "your-lark-app-secret",
      "groupPolicy": "allowlist",
      "streamMode": "partial"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}
```

::: warning Important
Replace `sk-your-fishxcode-token` with your actual Token from the [FishXCode console](https://fishxcode.com/console/token).
:::

### Key Configuration Details

| Configuration Item | Description |
| --- | --- |
| `models.providers.fishxcode.baseUrl` | FishXCode API endpoint, fixed as `https://fishxcode.com/v1` |
| `models.providers.fishxcode.apiKey` | Token obtained from the FishXCode console |
| `models.providers.fishxcode.models` | Model list, add multiple models as needed |
| `agents.defaults.model.primary` | Default primary model, format: `provider/model-id` |
| `agents.defaults.model.fallbacks` | Fallback model list, auto-switches when primary is unavailable |
| `channels.lark.appId` | Lark App ID from the Lark Open Platform |
| `channels.lark.appSecret` | Lark App Secret from the Lark Open Platform |
| `gateway.port` | Gateway listening port |
| `gateway.auth.token` | Gateway access security token |

## Start the Service

After configuration is complete, start OpenClaw:

```bash
openclaw start
```

Once started, you can interact with the AI assistant through the configured channels.
