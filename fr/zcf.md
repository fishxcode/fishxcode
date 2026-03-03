# Configuration rapide avec ZCF

[ZCF](https://github.com/UfoMiao/zcf) est un outil de configuration zéro pour Claude  Code / Codex. Une seule commande `zcf init` gère la configuration de l'API, l'import des workflows et l'intégration des services MCP.

> Pas encore de compte ? Complétez d'abord la [Création de compte](/fr/account) pour obtenir votre clé API.

## Connexion rapide

::: code-group

```bash [Commande unique]
npx zcf i -s -t api_key -k "votre-clé-api" -u "https://fishxcode.com/"
```

```bash [Init complète (recommandé)]
npx zcf i -s \
  -t api_key \
  -k "votre-clé-api" \
  -u "https://fishxcode.com/" \
  -g en \
  --workflows all \
  --mcp-services context7,open-websearch \
  --output-styles engineer-professional
```

```bash [Interactif (première fois)]
npx zcf init
# ZCF vous guide à travers le type d'API, les services MCP, les workflows, etc.
```

:::

::: warning
Remplacez `votre-clé-api` par le token `sk-xxx` de votre [Console FishXCode](https://fishxcode.com/console/token).
:::

Cela écrit automatiquement dans `~/.claude/settings.json` :

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/"
  }
}
```

---

## Paramètres

### Configuration API

| Paramètre | Description |
|---|---|
| `-t api_key` | Mode API Key |
| `-k "sk-xxx"` | Votre clé API |
| `-u "https://fishxcode.com/"` | URL de base FishXCode |
| `-M "claude-sonnet-4-5-20250929"` | Modèle principal |
| `-H "claude-haiku-4-5-20251001"` | Modèle rapide |

### Workflows

Valeurs disponibles : `commonTools` / `sixStepsWorkflow` / `featPlanUx` / `gitWorkflow` / `bmadWorkflow` / `all` / `skip`

### Services MCP

Valeurs disponibles : `context7` / `open-websearch` / `spec-workflow` / `mcp-deepwiki` / `Playwright` / `exa` / `serena` / `all` / `skip`

### Autres options

| Paramètre | Description |
|---|---|
| `-s` | Mode non-interactif |
| `-r backup` | Stratégie : `backup` / `merge` / `docs-only` / `skip` |
| `-x false` | Ne pas installer CCometixLine |

---

## Commandes de workflow

| Commande | Description |
|---|---|
| `/zcf:workflow` | Workflow six phases (Recherche → Idée → Plan → Exécution → Optimisation → Révision) |
| `/zcf:feat` | Développement de fonctionnalités avec UI/UX |
| `/zcf:git-commit` | Génération automatique de messages de commit |
| `/zcf:git-rollback` | Rollback interactif |
| `/zcf:git-worktree` | Gestion des Git Worktrees |
| `/zcf:bmad-init` | Workflow agile entreprise |

---

## Services MCP

| Service | Description | Clé requise |
|---|---|---|
| `context7` | Docs et exemples de bibliothèques à jour | Non |
| `open-websearch` | Recherche DuckDuckGo/Bing/Brave | Non |
| `spec-workflow` | Workflow Exigences → Design → Implémentation | Non |
| `mcp-deepwiki` | Documentation des dépôts GitHub | Non |
| `Playwright` | Automatisation du navigateur | Non |
| `exa` | Recherche sémantique Exa AI | Oui (`EXA_API_KEY`) |
| `serena` | Assistant IDE, récupération sémantique de code | Non |

La configuration MCP est écrite dans `~/.claude/settings.json` :

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

::: tip Utilisateurs Windows
ZCF corrige automatiquement les formats de chemins Windows. En cas de problème de connexion MCP, exécutez `npx zcf` → sélectionnez `4. Configurer MCP`.
:::

---

## Mise à jour

```bash
npx zcf update
```

---

## FAQ

### Mon settings.json sera-t-il écrasé ?

ZCF sauvegarde dans `~/.claude/backup/` avant toute modification, avec quatre stratégies : `backup` / `merge` / `docs-only` / `skip`.

### Node.js requis >= 18

```bash
node --version
```
