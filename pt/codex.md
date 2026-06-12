# Usando FishXCode com Codex

## Tutorial em vídeo

<VideoPlayer src="https://www.hi168.com/api/v2/s3/api/public/share/dl/992402691ac054896144c542cd7003e5" />

## Instalação

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

## Configurar Variáveis de Ambiente

1. Visite [https://fishxcode.com/console/token](https://fishxcode.com/console/token) para obter sua API Key
2. Crie `~/.codex/config.toml`:

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

3. Crie `~/.codex/auth.json`, definindo `OPENAI_API_KEY` com sua API Key do FishXCode:

   ```json
   {
     "OPENAI_API_KEY": "sua_api_key"
   }
   ```

## Iniciar Diretamente

```bash
cd meu-projeto
codex
```

## Usar Codex no VSCode

1. Instale a extensão Codex
2. Acesse configurações em modo JSON
3. Adicione:

```json
{
  "chatgpt.apiBase": "https://api.fishxcode.com/v1",
  "chatgpt.config": {
    "preferred_auth_method": "api_key",
    "model_provider": "fishxcode"
  }
}
```
