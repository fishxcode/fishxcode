# Usar FishXCode con Codex

## Tutorial en video

<VideoPlayer src="https://www.hi168.com/api/v2/s3/api/public/share/dl/992402691ac054896144c542cd7003e5" />

## Instalación

::: code-group

```bash [pnpm]
pnpm install -g @openai/codex
```

```bash [npm]
npm install -g @openai/codex
```

```bash [yarn]
yarn global add @openai/codex
```

```bash [bunx]
bunx --global @openai/codex
```

:::

## Configurar Variables de Entorno

1. Visita [https://fishxcode.com/console/token](https://fishxcode.com/console/token) para obtener tu API Key
2. Crea `~/.codex/config.toml`:

   ```toml
   model_provider = "fishxcode"
   model = "gpt-5.4"
   review_model = "gpt-5.4"
   model_reasoning_effort = "medium"
   model_reasoning_summary = "detailed"
   disable_response_storage = true
   preferred_auth_method = "apikey"
   model_verbosity = "high"

   [model_providers.fishxcode]
   name = "OpenAI using Chat Completions"
   base_url = "https://api.fishxcode.com/v1"
   wire_api = "responses"
   requires_openai_auth = true

   [features]
   skills = true
   image_generation = false

   ```

3. Crea `~/.codex/auth.json`, estableciendo `OPENAI_API_KEY` con tu API Key de FishXCode:

   ```json
   {
     "OPENAI_API_KEY": "tu_api_key"
   }
   ```

## Lanzamiento Directo

```bash
cd mi-proyecto
codex
```

## Usar Codex en VSCode

1. Instala la extensión Codex
2. Accede a configuración en modo JSON
3. Agrega:

```json
{
  "chatgpt.apiBase": "https://api.fishxcode.com/v1",
  "chatgpt.config": {
    "preferred_auth_method": "api_key",
    "model_provider": "fishxcode"
  }
}
```
