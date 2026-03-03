# Configuración rápida con ZCF

[ZCF](https://github.com/UfoMiao/zcf) es una herramienta de configuración cero para Claude  Code / Codex. Un solo comando `zcf init` gestiona la configuración de la API, importación de workflows e integración de servicios MCP.

> ¿Sin cuenta? Completa primero el [Registro de cuenta](/es/account) para obtener tu API Key.

## Conexión rápida

::: code-group

```bash [Un solo comando]
npx zcf i -s -t api_key -k "tu-clave-api" -u "https://fishxcode.com/"
```

```bash [Init completa (recomendado)]
npx zcf i -s \
  -t api_key \
  -k "tu-clave-api" \
  -u "https://fishxcode.com/" \
  -g en \
  --workflows all \
  --mcp-services context7,open-websearch \
  --output-styles engineer-professional
```

```bash [Interactivo (primera vez)]
npx zcf init
```

:::

::: warning
Reemplaza `tu-clave-api` con el token `sk-xxx` de tu [Consola FishXCode](https://fishxcode.com/console/token).
:::

Esto escribe automáticamente en `~/.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/"
  }
}
```

---

## Parámetros

### Configuración API

| Parámetro | Descripción |
|---|---|
| `-t api_key` | Modo API Key |
| `-k "sk-xxx"` | Tu API Key |
| `-u "https://fishxcode.com/"` | URL base de FishXCode |
| `-M "claude-sonnet-4-5-20250929"` | Modelo principal |
| `-H "claude-haiku-4-5-20251001"` | Modelo rápido |

### Workflows

Disponibles: `commonTools` / `sixStepsWorkflow` / `featPlanUx` / `gitWorkflow` / `bmadWorkflow` / `all` / `skip`

### Servicios MCP

Disponibles: `context7` / `open-websearch` / `spec-workflow` / `mcp-deepwiki` / `Playwright` / `exa` / `serena` / `all` / `skip`

### Otras opciones

| Parámetro | Descripción |
|---|---|
| `-s` | Modo no interactivo |
| `-r backup` | Estrategia: `backup` / `merge` / `docs-only` / `skip` |
| `-x false` | No instalar CCometixLine |

---

## Comandos de workflow

| Comando | Descripción |
|---|---|
| `/zcf:workflow` | Workflow de seis fases |
| `/zcf:feat` | Desarrollo de funcionalidades con UI/UX |
| `/zcf:git-commit` | Generación automática de commits |
| `/zcf:git-rollback` | Rollback interactivo |
| `/zcf:git-worktree` | Gestión de Git Worktrees |
| `/zcf:bmad-init` | Workflow ágil empresarial |

---

## Servicios MCP

| Servicio | Descripción | Key requerida |
|---|---|---|
| `context7` | Docs y ejemplos de bibliotecas actualizados | No |
| `open-websearch` | Búsqueda DuckDuckGo/Bing/Brave | No |
| `spec-workflow` | Workflow Requisitos → Diseño → Implementación | No |
| `mcp-deepwiki` | Documentación de repositorios GitHub | No |
| `Playwright` | Automatización del navegador | No |
| `exa` | Búsqueda semántica Exa AI | Sí (`EXA_API_KEY`) |
| `serena` | Asistente IDE, recuperación semántica de código | No |

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

::: tip Usuarios de Windows
ZCF corrige automáticamente los formatos de rutas de Windows. Si tienes problemas de conexión MCP, ejecuta `npx zcf` → selecciona `4. Configurar MCP`.
:::

---

## Actualización

```bash
npx zcf update
```

---

## Preguntas frecuentes

### ¿Se sobrescribirá mi settings.json?

ZCF hace copia de seguridad en `~/.claude/backup/` antes de cualquier cambio: `backup` / `merge` / `docs-only` / `skip`.

### Node.js >= 18 requerido

```bash
node --version
```
