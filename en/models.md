# Supported Models

FishXCode supports a variety of AI models from multiple providers, covering different use cases and toolchains. You can freely choose and switch models based on your needs.

<DynamicModelList />

## Switching Models

### Claude Code

Set the primary model via environment variables:

::: code-group

```bash [Linux/macOS]
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
claude
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929"
claude
```

:::

### Codex

Edit `~/.codex/config.toml` and change the `model` field:

```toml
model = "gpt-5"
```

### RooCode / Qwen Code

Change the **Model** field directly in the provider configuration. Any compatible model ID listed above can be used.

## Model Recommendations

::: tip Best for Coding
**claude-sonnet-4-5-20250929** — Strongest overall coding capability, ideal for complex projects and architecture-level tasks.
:::

::: tip Best for Speed
**claude-3-5-haiku-20241022** — Fastest response time, ideal for high-frequency calls and real-time completion scenarios.
:::

::: tip Best Balance
**claude-haiku-4-5-20251001** — Great balance between speed and quality, suitable for most daily development tasks.
:::
