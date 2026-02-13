# Usar FishXCode con OpenCode

## Instalar OpenCode

::: code-group

```bash [npm]
npm install -g opencode-ai@latest
```

```bash [brew]
brew install opencode
```

```bash [scoop]
scoop install opencode
```

:::

## Configurar FishXCode

1. Obtén tu API Key en [https://fishxcode.com/console/token](https://fishxcode.com/console/token)
2. Configura la variable de entorno:

::: code-group

```bash [Linux/macOS]
export FISHXCODE_TOKEN=sk-xxx
```

```powershell [Windows PowerShell]
$env:FISHXCODE_TOKEN="sk-xxx"
```

:::

3. Crea `opencode.json` en la raíz de tu proyecto o en `~/.config/opencode/`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "fishxcode": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "FishXCode",
      "options": {
        "baseURL": "https://fishxcode.com/v1",
        "apiKey": "{env:FISHXCODE_TOKEN}"
      },
      "models": {
        "gpt-5": { "name": "GPT-5" },
        "claude-sonnet-4-5-20250929": { "name": "Claude Sonnet 4.5" }
      }
    }
  }
}
```

::: warning Importante
Reemplaza `sk-xxx` por tu token real obtenido en la [consola de FishXCode](https://fishxcode.com/console/token).
:::

## Iniciar

```bash
cd my-project
opencode
```

Una vez iniciado, selecciona un modelo del proveedor FishXCode para comenzar.
