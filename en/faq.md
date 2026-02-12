# FAQ

## General

### What is FishXCode?

FishXCode is an AI Coding relay that supports Claude, Codex, and Gemini models across multiple platforms.

### Which tools are supported?

Currently supported tools:

- **Claude Code** — Anthropic's official CLI
- **OpenAI Codex** — OpenAI's coding assistant
- **Gemini CLI** — Google's command-line AI tool
- **RooCode** — AI coding extension for VS Code
- **Qwen Code** — Alibaba's Qwen-based coding tool
- **Droid CLI** — Lightweight AI coding CLI

### How is my data handled?

FishXCode acts solely as an API relay service. Your code and conversations are not stored on our servers. All requests are forwarded directly to the respective model providers.

::: tip
For sensitive projects, we recommend reviewing each model provider's privacy policy before use.
:::

## Account & Token

### How do I sign up?

Visit [fishxcode.com/register](https://fishxcode.com/register?aff=9CTW) and follow the prompts to create an account.

### How do I get an API token?

After signing in, go to the [Token Management page](https://fishxcode.com/console/token) in the console to generate a new token.

### How long does a token last?

Tokens remain valid until you manually delete or regenerate them. We recommend rotating tokens periodically for security.

### What are the free tier limits?

Every user receives a free quota. The exact amount adjusts dynamically based on platform resources. Check the console for your current usage.

::: warning
Once your free quota is exhausted, requests will be rejected. Plan your usage accordingly.
:::

## Tool Configuration

### My environment variables don't seem to work

Check these common issues:

1. **Terminal not restarted** — After editing `.bashrc` / `.zshrc`, run `source ~/.bashrc` or open a new terminal
2. **Typos in variable names** — Names are case-sensitive; `ANTHROPIC_BASE_URL` is not the same as `Anthropic_Base_Url`
3. **Extra quotes or spaces** — Make sure there are no stray spaces around the value in `export KEY="value"`

::: details Quick diagnostic commands
```bash
# Verify that variables are set
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_API_KEY

# Empty output means the variable is not set
```
:::

### Where are configuration files located?

| Tool | Config Location |
|------|----------------|
| Claude Code | Environment variables |
| Codex | `~/.codex/config.toml` and `~/.codex/auth.json` |
| RooCode | VS Code Settings JSON |
| Qwen Code | Environment variables |

### I can't connect to FishXCode

1. Confirm the `BASE_URL` is set to `https://fishxcode.com/` (note the trailing `/`)
2. Verify that `fishxcode.com` is reachable from your network
3. If you're behind a corporate proxy, ensure your proxy settings are configured correctly

## Model Selection

### How do I choose the right model?

Pick based on your use case:

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| Everyday coding | `claude-sonnet-4-5-20250929` | Good balance of capability and speed |
| Quick completions | `claude-3-5-haiku-20241022` | Fast response times |
| Complex architecture | `claude-sonnet-4-5-20250514` | Strong reasoning ability |

### What are the differences between models?

- **Sonnet series** — Well-rounded, suitable for most coding tasks
- **Haiku series** — Lightweight and fast, ideal for simple completions and formatting
- For detailed capability comparisons, refer to each provider's official documentation

### How do I switch models?

Set the `ANTHROPIC_MODEL` environment variable:

```bash
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

## Troubleshooting

### Authentication failure (Auth Error)

::: warning Common causes
- Token contains extra spaces or is incomplete
- Token has been deleted or regenerated
- Both `API_KEY` and `AUTH_TOKEN` must be set
:::

Fix: Go to the [console](https://fishxcode.com/console/token), verify your token status, and copy-paste it again.

### Request timeout

Possible causes:
1. High network latency
2. Very large input context requiring longer processing
3. Service under heavy load

Try reducing the input context or retry after a short wait.

### Rate limit hit (429)

A `429` status code means you're sending requests too frequently.

::: tip How to handle it
- Slow down and wait a few seconds between requests
- Avoid calling the API in tight loops without delays
- Make sure no other process is using the same token simultaneously
:::

### Model not available

Double-check the model name you specified. Refer to the recommended model list in [Get Started](/en/start). Some models may not yet be available on FishXCode.
