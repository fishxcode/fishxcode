# Using FishXCode with Codex

## Video Tutorial

<VideoPlayer src="https://www.hi168.com/api/v2/s3/api/public/share/dl/992402691ac054896144c542cd7003e5" />

## Install Codex

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

## Configure Environment Variables

1. Visit [https://fishxcode.com/console/token](https://fishxcode.com/console/token) to obtain your API Key
2. Create `~/.codex/config.toml` with this configuration:

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

3. Create `~/.codex/auth.json`, setting `OPENAI_API_KEY` to your FishXCode API Key:

   ```json
   {
     "OPENAI_API_KEY": "your_api_key_here"
   }
   ```

## Launch Directly

```bash
cd my-project
codex
```

## Using Codex in VSCode

1. Install the Codex extension
2. Access settings and switch to JSON configuration mode
3. Add these settings:

```json
{
  "chatgpt.apiBase": "https://api.fishxcode.com/v1",
  "chatgpt.config": {
    "preferred_auth_method": "api_key",
    "model_provider": "fishxcode"
  }
}
```

4. Click the Codex icon to begin using it
