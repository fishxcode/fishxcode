# Utiliser FishXCode avec OpenCode

## Installer OpenCode

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

## Configurer FishXCode

1. Obtenez votre cle API sur [https://fishxcode.com/console/token](https://fishxcode.com/console/token)
2. Definissez la variable d'environnement :

::: code-group

```bash [Linux/macOS]
export FISHXCODE_TOKEN=sk-xxx
```

```powershell [Windows PowerShell]
$env:FISHXCODE_TOKEN="sk-xxx"
```

:::

3. Creez `opencode.json` a la racine de votre projet ou dans `~/.config/opencode/` :

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

::: warning Important
Remplacez `sk-xxx` par votre token reel obtenu depuis la [console FishXCode](https://fishxcode.com/console/token).
:::

## Demarrage

```bash
cd my-project
opencode
```

Une fois lance, selectionnez un modele sous le fournisseur FishXCode pour commencer.
