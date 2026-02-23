# Usar FishXCode com OpenClaw

::: info Introdução ao projeto
OpenClaw é uma plataforma de assistente de IA pessoal de código aberto e auto-hospedada que conecta aplicativos de mensagens a agentes de IA executados no seu próprio hardware. Projetada para desenvolvedores e usuários avançados que desejam assistentes de IA autônomos sem abrir mão do controle dos seus dados.

- Site oficial: [https://openclaw.ai](https://openclaw.ai)
- Documentação: [https://docs.openclaw.ai](https://docs.openclaw.ai)
- GitHub: [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
:::

## Recursos principais

### Integração multicanal

- **Cobertura completa**: Suporta Lark (Feishu), Discord, Slack, Microsoft Teams e mais
- **Gateway único**: Gerencie todos os canais através de um único processo Gateway
- **Suporte de voz**: Interação por voz no macOS/iOS/Android
- **Interface Canvas**: Renderiza interfaces Canvas interativas

### Auto-hospedagem e segurança de dados

- **Totalmente auto-hospedado**: Funciona na sua própria máquina ou servidor
- **Código aberto**: Licença MIT, código totalmente transparente
- **Armazenamento local**: Contexto e habilidades armazenados localmente, não na nuvem

### Capacidades de agente inteligente

- **Sempre ativo**: Operação persistente em segundo plano com memória persistente
- **Tarefas agendadas**: Suporta tarefas cron
- **Isolamento de sessões**: Sessões isoladas por agente/espaço de trabalho/remetente
- **Roteamento multi-agente**: Colaboração entre múltiplos agentes
- **Chamada de ferramentas**: Suporte nativo a chamadas de ferramentas e execução de código

## Instalação

::: info Requisitos
- Node.js 22 ou superior
- API Key do FishXCode
:::

```bash
npm install -g openclaw@latest
```

Após a instalação, execute o assistente de configuração:

```bash
openclaw onboard
```

## Configuração

### Localização do arquivo de configuração

O arquivo de configuração do OpenClaw está em `~/.openclaw/config.json`. Pode ser gerado automaticamente pelo assistente ou editado manualmente.

### Exemplo de configuração

Abaixo está um exemplo completo usando FishXCode como provedor de modelos:

```json
{
  "models": {
    "providers": {
      "fishxcode": {
        "baseUrl": "https://fishxcode.com/v1",
        "apiKey": "sk-seu-token-fishxcode",
        "auth": "api-key",
        "api": "openai-completions",
        "models": [
          {
            "id": "claude-sonnet-4-5-20250929",
            "name": "claude-sonnet-4-5-20250929",
            "api": "openai-completions",
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 64000
          },
          {
            "id": "gpt-5",
            "name": "gpt-5",
            "api": "openai-completions",
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 128000,
            "maxTokens": 64000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "fishxcode/claude-sonnet-4-5-20250929",
        "fallbacks": ["fishxcode/gpt-5"]
      },
      "workspace": "/home/seu-usuario/.openclaw/workspace",
      "maxConcurrent": 4,
      "subagents": { "maxConcurrent": 8 }
    }
  },
  "channels": {
    "lark": {
      "enabled": true,
      "dmPolicy": "pairing",
      "appId": "seu-lark-app-id",
      "appSecret": "seu-lark-app-secret",
      "groupPolicy": "allowlist",
      "streamMode": "partial"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "seu-token-seguro"
    }
  }
}
```

::: warning Importante
Substitua `sk-seu-token-fishxcode` pelo seu token real obtido no [console FishXCode](https://fishxcode.com/console/token).
:::

### Detalhes de configuração

| Parâmetro | Descrição |
| --- | --- |
| `models.providers.fishxcode.baseUrl` | Endpoint do FishXCode, fixo como `https://fishxcode.com/v1` |
| `models.providers.fishxcode.apiKey` | Token obtido no console do FishXCode |
| `models.providers.fishxcode.models` | Lista de modelos, adicione quantos precisar |
| `agents.defaults.model.primary` | Modelo principal padrão, formato: `provedor/id-modelo` |
| `agents.defaults.model.fallbacks` | Modelos de fallback, troca automaticamente se o principal estiver indisponível |
| `channels.lark.appId` | App ID do Lark na plataforma aberta do Lark |
| `channels.lark.appSecret` | App Secret do Lark na plataforma aberta do Lark |
| `gateway.port` | Porta de escuta do gateway |
| `gateway.auth.token` | Token de segurança de acesso ao gateway |

## Iniciar o serviço

Após a configuração, inicie o OpenClaw:

```bash
openclaw start
```

Uma vez iniciado, você pode interagir com o assistente de IA através dos canais configurados.
