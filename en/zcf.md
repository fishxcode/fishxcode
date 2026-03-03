# Quick Setup with ZCF

[ZCF](https://github.com/UfoMiao/zcf) is a zero-config enhancement tool for Claude  Code / Codex. A single `zcf init` command handles API setup, workflow import, and MCP service integration.

> No account yet? Complete [Account Setup](/en/account) to get your API Key first.

## Quick Connect

::: code-group

```bash [One-liner]
npx zcf i -s -t api_key -k "your-api-key" -u "https://fishxcode.com/"
```

```bash [Full init (recommended)]
npx zcf i -s \
  -t api_key \
  -k "your-api-key" \
  -u "https://fishxcode.com/" \
  -g en \
  --workflows all \
  --mcp-services context7,open-websearch \
  --output-styles engineer-professional
```

```bash [Interactive (first time)]
npx zcf init
# ZCF guides you through API type, MCP services, workflows, etc.
```

:::

::: warning
Replace `your-api-key` with the `sk-xxx` token from your [FishXCode Console](https://fishxcode.com/console/token).
:::

This writes to `~/.claude/settings.json` automatically:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/"
  }
}
```

---

## Parameters

### API Configuration

| Parameter | Description |
|---|---|
| `-t api_key` | Use API Key mode |
| `-k "sk-xxx"` | Your API Key |
| `-u "https://fishxcode.com/"` | FishXCode Base URL |
| `-M "claude-sonnet-4-5-20250929"` | Primary model |
| `-H "claude-haiku-4-5-20251001"` | Fast model |

Pin specific models:

```bash
npx zcf i -s -t api_key -k "sk-xxx" -u "https://fishxcode.com/" \
  -M "claude-sonnet-4-5-20250929" \
  -H "claude-haiku-4-5-20251001"
```

### Workflows

| Parameter | Description |
|---|---|
| `-w all` | Install all workflows |
| `-w sixStepsWorkflow,gitWorkflow` | Install specific workflows |
| `-w skip` | Skip |

Available: `commonTools` / `sixStepsWorkflow` / `featPlanUx` / `gitWorkflow` / `bmadWorkflow`

### MCP Services

| Parameter | Description |
|---|---|
| `-m all` | Install all MCP services |
| `-m context7,open-websearch` | Install specific services |
| `-m skip` | Skip |

Available: `context7` / `open-websearch` / `spec-workflow` / `mcp-deepwiki` / `Playwright` / `exa` / `serena`

### Other Options

| Parameter | Description |
|---|---|
| `-g en` | Set interface, template, and AI output language |
| `-s` | Non-interactive mode, skip all prompts |
| `-r backup` | Config strategy: `backup` / `merge` / `docs-only` / `skip` |
| `-x false` | Skip CCometixLine status bar installation |

---

## Workflow Commands

After installation, use these slash commands in Claude  Code:

| Command | Description |
|---|---|
| `/zcf:workflow` | Six-phase workflow (Research → Ideate → Plan → Execute → Optimize → Review) |
| `/zcf:feat` | Feature development with planning and UI/UX design |
| `/zcf:git-commit` | Auto-generate Git commit messages |
| `/zcf:git-rollback` | Interactive rollback to previous versions |
| `/zcf:git-worktree` | Manage Git Worktrees |
| `/zcf:bmad-init` | Enterprise agile workflow |

---

## MCP Services

MCP (Model Context Protocol) extends Claude  Code with external tools. ZCF bundles the following services:

| Service | Description | Key Required |
|---|---|---|
| `context7` | Latest library docs and code examples | No |
| `open-websearch` | DuckDuckGo/Bing/Brave web search | No |
| `spec-workflow` | Requirements → Design → Implementation workflow | No |
| `mcp-deepwiki` | GitHub repository documentation | No |
| `Playwright` | Browser automation | No |
| `exa` | Exa AI semantic search | Yes (`EXA_API_KEY`) |
| `serena` | IDE assistant, semantic code retrieval | No |

### Service Details

**context7** — Queries up-to-date library docs to avoid stale API usage:
```
Get the latest React useState hook documentation and examples
```

**open-websearch** — Multi-engine search (DuckDuckGo, Bing, Brave), no API key needed:
```
Search for the latest TypeScript 5.0 features
```

**spec-workflow** — Structured feature workflow with requirement analysis, design, and task breakdown:
```bash
npx -y @pimzino/spec-workflow-mcp@latest --dashboard  # Visual dashboard
```

**mcp-deepwiki** — Query GitHub repository documentation:
```
Query the Composition API docs in vuejs/core
```

**Playwright** — Browser control, screenshots, form filling, and interaction simulation.

**exa** — AI-powered semantic web search, requires API key:
```bash
export EXA_API_KEY="your-api-key"  # Get from dashboard.exa.ai
```

**serena** — Semantic code retrieval and intelligent edit suggestions.

### Config File Location

MCP config is written to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context-labs/context7"]
    },
    "open-websearch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-open-websearch"]
    }
  }
}
```

::: tip Windows Users
ZCF auto-corrects Windows path formats. If MCP services fail to connect, run `npx zcf` → select `4. Configure MCP` to auto-fix.
:::

---

## Update

```bash
npx zcf update
# or
npx zcf u -s -g en
```

Update only syncs workflow templates and prompts — **API config is untouched**.

---

## FAQ

### Will my existing settings.json be overwritten?

ZCF backs up to `~/.claude/backup/YYYY-MM-DD_HH-mm-ss/` before any changes, with four strategies:

```bash
npx zcf i -s -r backup    # Backup then overwrite (default)
npx zcf i -s -r merge     # Smart merge
npx zcf i -s -r docs-only # Update workflow docs only
npx zcf i -s -r skip      # Skip, no changes
```

### How do I switch back to manual config?

The generated `settings.json` is standard format — edit it directly. See [Claude  Code Setup](/en/start).

### Node.js version requirement

ZCF requires Node.js >= 18:

```bash
node --version
```
