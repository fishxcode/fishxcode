# Usar FishXCode con OpenClaw

::: info Introducción al proyecto
OpenClaw es una plataforma de asistente de IA personal de código abierto y auto-alojada que conecta aplicaciones de mensajería con agentes de IA que se ejecutan en tu propio hardware. Diseñada para desarrolladores y usuarios avanzados que desean asistentes de IA autónomos sin ceder el control de sus datos.

- Sitio oficial: [https://openclaw.ai](https://openclaw.ai)
- Documentación: [https://docs.openclaw.ai](https://docs.openclaw.ai)
- GitHub: [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
:::

## Características principales

### Integración multicanal

- **Cobertura completa**: Soporta Lark (Feishu), Discord, Slack, Microsoft Teams y más
- **Pasarela única**: Gestiona todos los canales a través de un único proceso Gateway
- **Soporte de voz**: Interacción por voz en macOS/iOS/Android
- **Interfaz Canvas**: Renderiza interfaces Canvas interactivas

### Auto-alojamiento y seguridad de datos

- **Completamente auto-alojado**: Se ejecuta en tu propia máquina o servidor
- **Código abierto**: Licencia MIT, código completamente transparente
- **Almacenamiento local**: Contexto y habilidades almacenados localmente, no en la nube

### Capacidades de agente inteligente

- **Siempre activo**: Operación persistente en segundo plano con memoria persistente
- **Tareas programadas**: Soporta tareas cron
- **Aislamiento de sesiones**: Sesiones aisladas por agente/espacio de trabajo/remitente
- **Enrutamiento multi-agente**: Colaboración entre múltiples agentes
- **Llamada a herramientas**: Soporte nativo para llamadas a herramientas y ejecución de código

## Instalación

::: info Requisitos
- Node.js 22 o superior
- API Key de FishXCode
:::

```bash
npm install -g openclaw@latest
```

Tras la instalación, ejecuta el asistente de configuración:

```bash
openclaw onboard
```

## Configuración

### Ubicación del archivo de configuración

El archivo de configuración de OpenClaw se encuentra en `~/.openclaw/config.json`. Puede generarse automáticamente mediante el asistente o editarse manualmente.

### Ejemplo de configuración

A continuación se muestra un ejemplo completo usando FishXCode como proveedor de modelos:

```json
{
  "models": {
    "providers": {
      "fishxcode": {
        "baseUrl": "https://fishxcode.com/v1",
        "apiKey": "sk-tu-token-fishxcode",
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
      "workspace": "/home/tu-usuario/.openclaw/workspace",
      "maxConcurrent": 4,
      "subagents": { "maxConcurrent": 8 }
    }
  },
  "channels": {
    "lark": {
      "enabled": true,
      "dmPolicy": "pairing",
      "appId": "tu-lark-app-id",
      "appSecret": "tu-lark-app-secret",
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
      "token": "tu-token-seguro"
    }
  }
}
```

::: warning Importante
Reemplaza `sk-tu-token-fishxcode` por tu token real obtenido en la [consola de FishXCode](https://fishxcode.com/console/token).
:::

### Detalles de configuración

| Parámetro | Descripción |
| --- | --- |
| `models.providers.fishxcode.baseUrl` | Endpoint de FishXCode, fijo como `https://fishxcode.com/v1` |
| `models.providers.fishxcode.apiKey` | Token obtenido desde la consola de FishXCode |
| `models.providers.fishxcode.models` | Lista de modelos, añade los que necesites |
| `agents.defaults.model.primary` | Modelo principal por defecto, formato: `proveedor/id-modelo` |
| `agents.defaults.model.fallbacks` | Modelos de respaldo, cambia automáticamente si el principal no está disponible |
| `channels.lark.appId` | App ID de Lark desde la plataforma abierta de Lark |
| `channels.lark.appSecret` | App Secret de Lark desde la plataforma abierta de Lark |
| `gateway.port` | Puerto de escucha de la pasarela |
| `gateway.auth.token` | Token de seguridad de acceso a la pasarela |

## Iniciar el servicio

Una vez completada la configuración, inicia OpenClaw:

```bash
openclaw start
```

Una vez iniciado, puedes interactuar con el asistente de IA a través de los canales configurados.
