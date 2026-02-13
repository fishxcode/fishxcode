# Usar FishXCode com OpenCode

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

1. Obtenha sua API Key em [https://fishxcode.com/console/token](https://fishxcode.com/console/token)
2. Configure a variavel de ambiente:

::: code-group

```bash [Linux/macOS]
export FISHXCODE_TOKEN=sk-xxx
```

```powershell [Windows PowerShell]
$env:FISHXCODE_TOKEN="sk-xxx"
```

:::

3. Crie `opencode.json` na raiz do seu projeto ou em `~/.config/opencode/`:

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
Substitua `sk-xxx` pelo seu token real obtido no [console do FishXCode](https://fishxcode.com/console/token).
:::

## Iniciar

```bash
cd my-project
opencode
```

Apos iniciar, selecione um modelo do provedor FishXCode para comecar.
