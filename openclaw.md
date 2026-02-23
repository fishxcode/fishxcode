# 在 OpenClaw 中使用 FishXCode

::: info 项目简介
OpenClaw 是一个开源、自托管的个人 AI 助手平台，将消息应用连接到运行在你自己硬件上的 AI Agent。专为希望在不放弃数据控制权的前提下使用自主 AI 助手的开发者和高级用户设计。

- 官方网站：[https://openclaw.ai](https://openclaw.ai)
- 文档：[https://docs.openclaw.ai](https://docs.openclaw.ai)
- GitHub：[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
:::

## 核心特性

### 多渠道集成

- **全平台覆盖**：支持飞书（Lark）、Discord、Slack、Microsoft Teams 等
- **单一网关**：通过单个 Gateway 进程管理所有渠道
- **语音支持**：支持 macOS/iOS/Android 语音交互
- **画布界面**：可渲染交互式 Canvas 界面

### 自托管与数据安全

- **完全自托管**：运行在你自己的机器或服务器上
- **开源**：MIT 协议，代码完全透明
- **本地数据存储**：上下文与技能存储在本地，不上传云端

### 智能 Agent 能力

- **持久运行**：支持后台持久运行与持久记忆
- **定时任务**：支持 cron 定时任务
- **会话隔离**：按 Agent/工作区/发送者隔离会话
- **多 Agent 路由**：支持多 Agent 协作
- **工具调用**：原生支持工具调用与代码执行

## 安装

::: info 环境要求
- Node.js 22 或更高版本
- FishXCode API Key
:::

```bash
npm install -g openclaw@latest
```

安装完成后运行引导向导：

```bash
openclaw onboard
```

## 配置

### 配置文件位置

OpenClaw 配置文件位于 `~/.openclaw/config.json`，可通过引导向导自动生成，也可手动编辑。

### 配置示例

以下是使用 FishXCode 作为模型提供商的完整配置示例：

```json
{
  "models": {
    "providers": {
      "fishxcode": {
        "baseUrl": "https://fishxcode.com/v1",
        "apiKey": "sk-你的FishXCode-Token",
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

::: warning 重要
请将 `sk-你的FishXCode-Token` 替换为你在 [FishXCode 控制台](https://fishxcode.com/console/token) 获取的实际 Token。
:::

### 关键配置说明

| 配置项 | 说明 |
| --- | --- |
| `models.providers.fishxcode.baseUrl` | FishXCode API 地址，固定为 `https://fishxcode.com/v1` |
| `models.providers.fishxcode.apiKey` | 在 FishXCode 控制台获取的 Token |
| `models.providers.fishxcode.models` | 模型列表，可按需添加多个模型 |
| `agents.defaults.model.primary` | 默认主模型，格式：`提供商/模型ID` |
| `agents.defaults.model.fallbacks` | 备选模型列表，主模型不可用时自动切换 |
| `channels.lark.appId` | 飞书开放平台的 App ID |
| `channels.lark.appSecret` | 飞书开放平台的 App Secret |
| `gateway.port` | Gateway 监听端口 |
| `gateway.auth.token` | Gateway 访问安全令牌 |

## 启动服务

配置完成后，启动 OpenClaw：

```bash
openclaw start
```

启动后即可通过配置的渠道与 AI 助手交互。
