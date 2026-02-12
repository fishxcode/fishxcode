# 常见问题

## 通用

### FishXCode 是什么？

FishXCode 是一个 AI Coding 中转站，支持 Claude、Codex、Gemini 模型在多种平台使用。

### 支持哪些工具？

目前支持以下工具：

- **Claude Code** — Anthropic 官方 CLI
- **OpenAI Codex** — OpenAI 官方编程助手
- **Gemini CLI** — Google 的命令行 AI 工具
- **RooCode** — VS Code AI 编程插件
- **Qwen Code** — 阿里通义千问编程工具
- **Droid CLI** — 轻量级 AI 编程 CLI

### 数据隐私如何保障？

FishXCode 仅作为 API 中转服务，不存储你的代码和对话内容。所有请求直接转发至对应的模型提供商。

::: tip 建议
敏感项目建议在使用前阅读各模型提供商的隐私政策。
:::

## 账户与 Token

### 如何注册？

访问 [fishxcode.com/register](https://fishxcode.com/register?aff=9CTW)，按提示完成注册即可。

### 如何获取 API Token？

注册后登录控制台，前往 [Token 管理页](https://fishxcode.com/console/token) 创建新的 Token。

### Token 有效期多长？

Token 在手动删除或重新生成前持续有效。建议定期轮换以确保安全。

### 免费额度有多少？

FishXCode 为每个用户提供免费额度，具体数量根据平台资源动态调整。请关注控制台中的用量信息。

::: warning 注意
免费额度用尽后请求会被拒绝，请合理规划用量。
:::

## 工具配置

### 环境变量设置后不生效怎么办？

检查以下常见原因：

1. **未重启终端** — 修改 `.bashrc` / `.zshrc` 后需要执行 `source ~/.bashrc` 或新开终端
2. **变量名拼写错误** — 注意区分大小写，如 `ANTHROPIC_BASE_URL` 不能写成 `Anthropic_Base_Url`
3. **多余的引号或空格** — `export KEY="value"` 中 value 前后不要有多余空格

::: details 快速排查命令
```bash
# 检查变量是否已设置
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_API_KEY

# 如果为空，说明变量未生效
```
:::

### 配置文件路径在哪里？

| 工具 | 配置文件路径 |
|------|-------------|
| Claude Code | 环境变量方式配置 |
| Codex | `~/.codex/config.toml` 和 `~/.codex/auth.json` |
| RooCode | VS Code 设置 JSON |
| Qwen Code | 环境变量方式配置 |

### 连接不上 FishXCode 服务怎么办？

1. 确认 `BASE_URL` 设置为 `https://fishxcode.com/`（注意末尾的 `/`）
2. 检查网络是否能访问 `fishxcode.com`
3. 如果在公司网络中，确认代理设置是否正确

## 模型选择

### 如何选择合适的模型？

根据使用场景选择：

| 场景 | 推荐模型 | 理由 |
|------|---------|------|
| 日常编程 | `claude-sonnet-4-5-20250929` | 能力与速度均衡 |
| 快速补全 | `claude-3-5-haiku-20241022` | 响应速度快 |
| 复杂架构 | `claude-sonnet-4-5-20250514` | 推理能力强 |

### 不同模型之间有什么差异？

- **Sonnet 系列**：能力全面，适合大多数编程任务
- **Haiku 系列**：轻量快速，适合简单补全和格式化任务
- 具体的模型能力差异请参考各提供商的官方文档

### 如何切换模型？

通过环境变量 `ANTHROPIC_MODEL` 指定：

```bash
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

## 故障排除

### 提示认证失败（Auth Error）

::: warning 常见原因
- Token 输入有误（多余空格或不完整）
- Token 已被删除或重新生成
- `API_KEY` 和 `AUTH_TOKEN` 未同时设置
:::

解决方法：前往 [控制台](https://fishxcode.com/console/token) 确认 Token 状态，重新复制粘贴。

### 请求超时（Timeout）

可能原因：
1. 网络延迟过高
2. 请求的上下文过长，模型处理时间较久
3. 当前服务负载较高

建议：减小输入上下文，或稍后重试。

### 触发频率限制（Rate Limit）

收到 `429` 状态码表示请求过于频繁。

::: tip 应对方法
- 降低请求频率，间隔几秒后重试
- 避免在脚本中无间隔循环调用 API
- 检查是否有其他进程在同时使用同一 Token
:::

### 返回模型不可用（Model Not Available）

检查指定的模型名称是否正确，参考 [快速开始](/start) 中的推荐模型列表。部分模型可能尚未在 FishXCode 上线。
