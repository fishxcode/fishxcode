# Configuração rápida com ZCF

[ZCF](https://github.com/UfoMiao/zcf) é uma ferramenta de configuração zero para Claude  Code / Codex. Um único comando `zcf init` gerencia a configuração da API, importação de workflows e integração de serviços MCP.

> Sem conta? Conclua primeiro a [Configuração de conta](/pt/account) para obter sua API Key.

## Conexão rápida

::: code-group

```bash [Um comando]
npx zcf i -s -t api_key -k "sua-chave-api" -u "https://fishxcode.com/"
```

```bash [Init completa (recomendado)]
npx zcf i -s \
  -t api_key \
  -k "sua-chave-api" \
  -u "https://fishxcode.com/" \
  -g en \
  --workflows all \
  --mcp-services context7,open-websearch \
  --output-styles engineer-professional
```

```bash [Interativo (primeira vez)]
npx zcf init
```

:::

::: warning
Substitua `sua-chave-api` pelo token `sk-xxx` do seu [Console FishXCode](https://fishxcode.com/console/token).
:::

Isso escreve automaticamente em `~/.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/"
  }
}
```

---

## Parâmetros

### Configuração API

| Parâmetro | Descrição |
|---|---|
| `-t api_key` | Modo API Key |
| `-k "sk-xxx"` | Sua API Key |
| `-u "https://fishxcode.com/"` | URL base do FishXCode |
| `-M "claude-sonnet-4-5-20250929"` | Modelo principal |
| `-H "claude-haiku-4-5-20251001"` | Modelo rápido |

### Workflows

Disponíveis: `commonTools` / `sixStepsWorkflow` / `featPlanUx` / `gitWorkflow` / `bmadWorkflow` / `all` / `skip`

### Serviços MCP

Disponíveis: `context7` / `open-websearch` / `spec-workflow` / `mcp-deepwiki` / `Playwright` / `exa` / `serena` / `all` / `skip`

### Outras opções

| Parâmetro | Descrição |
|---|---|
| `-s` | Modo não-interativo |
| `-r backup` | Estratégia: `backup` / `merge` / `docs-only` / `skip` |
| `-x false` | Não instalar CCometixLine |

---

## Comandos de workflow

| Comando | Descrição |
|---|---|
| `/zcf:workflow` | Workflow de seis fases |
| `/zcf:feat` | Desenvolvimento de funcionalidades com UI/UX |
| `/zcf:git-commit` | Geração automática de commits |
| `/zcf:git-rollback` | Rollback interativo |
| `/zcf:git-worktree` | Gerenciamento de Git Worktrees |
| `/zcf:bmad-init` | Workflow ágil empresarial |

---

## Serviços MCP

| Serviço | Descrição | Key necessária |
|---|---|---|
| `context7` | Docs e exemplos de bibliotecas atualizados | Não |
| `open-websearch` | Pesquisa DuckDuckGo/Bing/Brave | Não |
| `spec-workflow` | Workflow Requisitos → Design → Implementação | Não |
| `mcp-deepwiki` | Documentação de repositórios GitHub | Não |
| `Playwright` | Automação de navegador | Não |
| `exa` | Pesquisa semântica Exa AI | Sim (`EXA_API_KEY`) |
| `serena` | Assistente IDE, recuperação semântica de código | Não |

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context-labs/context7"]
    }
  }
}
```

::: tip Usuários Windows
O ZCF corrige automaticamente os formatos de caminhos do Windows. Se os serviços MCP falharem, execute `npx zcf` → selecione `4. Configurar MCP`.
:::

---

## Atualização

```bash
npx zcf update
```

---

## Perguntas frequentes

### Meu settings.json será sobrescrito?

O ZCF faz backup em `~/.claude/backup/` antes de qualquer alteração: `backup` / `merge` / `docs-only` / `skip`.

### Node.js >= 18 necessário

```bash
node --version
```
