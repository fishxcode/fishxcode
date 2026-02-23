# Utiliser FishXCode avec OpenClaw

::: info Présentation du projet
OpenClaw est une plateforme d'assistant IA personnel open-source et auto-hébergée qui connecte les applications de messagerie à des agents IA fonctionnant sur votre propre matériel. Conçue pour les développeurs et les utilisateurs avancés souhaitant des assistants IA autonomes sans céder le contrôle de leurs données.

- Site officiel : [https://openclaw.ai](https://openclaw.ai)
- Documentation : [https://docs.openclaw.ai](https://docs.openclaw.ai)
- GitHub : [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
:::

## Fonctionnalités principales

### Intégration multi-canaux

- **Couverture complète** : Supporte Lark (Feishu), Discord, Slack, Microsoft Teams et plus
- **Passerelle unique** : Gérez tous les canaux via un seul processus Gateway
- **Support vocal** : Interaction vocale sur macOS/iOS/Android
- **Interface Canvas** : Rendu d'interfaces Canvas interactives

### Auto-hébergement et sécurité des données

- **Entièrement auto-hébergé** : Fonctionne sur votre propre machine ou serveur
- **Open source** : Licence MIT, code entièrement transparent
- **Stockage local** : Contexte et compétences stockés localement, pas dans le cloud

### Capacités d'agent intelligent

- **Toujours actif** : Opération persistante en arrière-plan avec mémoire persistante
- **Tâches planifiées** : Supporte les tâches cron
- **Isolation des sessions** : Sessions isolées par agent/espace de travail/expéditeur
- **Routage multi-agents** : Collaboration entre plusieurs agents
- **Appel d'outils** : Support natif des appels d'outils et de l'exécution de code

## Installation

::: info Prérequis
- Node.js 22 ou supérieur
- Clé API FishXCode
:::

```bash
npm install -g openclaw@latest
```

Après l'installation, lancez l'assistant de configuration :

```bash
openclaw onboard
```

## Configuration

### Emplacement du fichier de configuration

Le fichier de configuration OpenClaw se trouve à `~/.openclaw/config.json`. Il peut être généré automatiquement via l'assistant ou modifié manuellement.

### Exemple de configuration

Voici un exemple complet utilisant FishXCode comme fournisseur de modèles :

```json
{
  "models": {
    "providers": {
      "fishxcode": {
        "baseUrl": "https://fishxcode.com/v1",
        "apiKey": "sk-votre-token-fishxcode",
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
      "workspace": "/home/votre-utilisateur/.openclaw/workspace",
      "maxConcurrent": 4,
      "subagents": { "maxConcurrent": 8 }
    }
  },
  "channels": {
    "lark": {
      "enabled": true,
      "dmPolicy": "pairing",
      "appId": "votre-lark-app-id",
      "appSecret": "votre-lark-app-secret",
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
      "token": "votre-token-securise"
    }
  }
}
```

::: warning Important
Remplacez `sk-votre-token-fishxcode` par votre token réel obtenu depuis la [console FishXCode](https://fishxcode.com/console/token).
:::

### Détails de configuration

| Paramètre | Description |
| --- | --- |
| `models.providers.fishxcode.baseUrl` | Point de terminaison FishXCode, fixé à `https://fishxcode.com/v1` |
| `models.providers.fishxcode.apiKey` | Token obtenu depuis la console FishXCode |
| `models.providers.fishxcode.models` | Liste de modèles, ajoutez-en selon vos besoins |
| `agents.defaults.model.primary` | Modèle principal par défaut, format : `fournisseur/id-modele` |
| `agents.defaults.model.fallbacks` | Modèles de secours, bascule automatiquement si le principal est indisponible |
| `channels.lark.appId` | App ID Lark depuis la plateforme ouverte Lark |
| `channels.lark.appSecret` | App Secret Lark depuis la plateforme ouverte Lark |
| `gateway.port` | Port d'écoute de la passerelle |
| `gateway.auth.token` | Jeton de sécurité d'accès à la passerelle |

## Démarrer le service

Une fois la configuration terminée, démarrez OpenClaw :

```bash
openclaw start
```

Une fois démarré, vous pouvez interagir avec l'assistant IA via les canaux configurés.
