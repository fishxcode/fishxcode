---
title: Utiliser FishXCode avec Codex Desktop
description: Installer Codex Desktop, réutiliser la configuration Codex FishXCode, se connecter et importer le canal via CC Switch.
---

# Utiliser FishXCode avec Codex Desktop

> Première utilisation ? Effectuez d'abord la [création du compte](/fr/account), puis créez un token utilisable dans la [console FishXCode](https://fishxcode.com/console/token).

## Portée

Ce guide explique comment connecter OpenAI Codex Desktop à FishXCode. Pour l'installation et la configuration de Codex CLI, consultez [Utiliser FishXCode avec Codex](/fr/codex). Codex Desktop devrait réutiliser la même configuration `~/.codex` afin d'éviter deux configurations séparées.

::: tip Parcours recommandé
Créez d'abord la configuration Codex locale, puis ouvrez Codex Desktop et connectez-vous. L'application desktop et le CLI utiliseront ainsi la même URL API FishXCode, le même modèle et le même token.
:::

## 1. Installer Codex Desktop

Sous Windows, ouvrez Microsoft Store, recherchez `Codex`, puis installez l'application officielle :

![Installer Codex Desktop depuis Microsoft Store](/img/start/codex-desktop/microsoft-store-codex.png)

Après l'installation, configurez FishXCode avant de vous connecter. Si Microsoft Store n'est pas accessible, utilisez un canal officiel OpenAI ou une source logicielle fiable.

## 2. Réutiliser la configuration Codex pour FishXCode

Codex Desktop et Codex CLI devraient utiliser la même configuration utilisateur. La configuration ci-dessous reprend celle du [guide Codex CLI](/fr/codex).

### 1. Créer le dossier de configuration

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.codex
```

```powershell [Windows PowerShell]
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex"
```

:::

### 2. Écrire `config.toml`

Créez `~/.codex/config.toml` avec :

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

::: info
Vous pouvez remplacer `model` et `review_model` par un autre modèle disponible dans votre offre ou votre groupe. En cas de doute, commencez par `gpt-5.4`.
:::

### 3. Écrire `auth.json`

Créez `~/.codex/auth.json` avec votre token FishXCode :

```json
{
  "OPENAI_API_KEY": "your_api_key_here"
}
```

::: warning Attention
`auth.json` contient votre token secret. Ne le commitez pas dans Git et ne le partagez pas.
:::

## 3. Se connecter à Codex Desktop

Ouvrez Codex Desktop. Si l'écran de connexion apparaît, choisissez **Utiliser une autre méthode de connexion** :

![Choisir une autre méthode de connexion](/img/start/codex-desktop/codex-login-options.png)

Collez le token copié depuis la console FishXCode. Si `~/.codex/auth.json` est déjà renseigné mais que Codex demande encore une connexion, collez le même token ici.

Pour copier un token, trouvez-le dans la page des tokens FishXCode et utilisez le bouton de copie à côté de la clé. Ce guide ne montre pas le menu de copie afin d'éviter d'exposer des détails inutiles de la clé.

Après connexion, sélectionnez le dossier projet sur lequel Codex doit travailler.

## 4. Optionnel : gérer plusieurs canaux avec CC Switch

Utilisez CC Switch si vous gérez plusieurs canaux Codex. Si FishXCode est votre seul canal, un seul `~/.codex/config.toml` suffit généralement.

Sur la page des tokens FishXCode, trouvez le token cible et cliquez sur **Importer** sur la ligne du groupe `codex_sub_june` :

![Importer le groupe Codex depuis FishXCode](/img/start/codex-desktop/cc-switch-import-channel.png)

Dans la fenêtre d'import CC Switch, conservez ces valeurs principales :

| Champ | Valeur FishXCode |
| --- | --- |
| Endpoint API | `https://api.fishxcode.com/v1` |
| Clé API | Token FishXCode |
| Modèle principal | `gpt-5.4` ou un autre modèle disponible dans votre offre |

Passez le modèle principal à `gpt-5.4`, cliquez sur **Tester**, puis importez seulement après le message de réussite du test de connectivité :

![Tester gpt-5.4 dans la fenêtre d'import CC Switch](/img/start/codex-desktop/cc-switch-select-model.png)

Lorsque le navigateur ouvre CC Switch, vérifiez l'endpoint API, le modèle et la note, puis cliquez sur **Importer** :

![Confirmer l'import Codex FishXCode](/img/start/codex-desktop/cc-switch-import-success.png)

Après l'import, vérifiez que CC Switch utilise le canal FishXCode, puis redémarrez Codex Desktop.

## 5. Contrôles courants

### Modèle, effort de raisonnement et permissions

Codex Desktop affiche généralement le modèle, l'effort de raisonnement, le mode de permission et le dossier de travail près de la zone de saisie :

![Contrôles de conversation Codex Desktop](/img/start/codex-desktop/codex-dialog-options.png)

Réglages recommandés :

- Modèle : choisissez un modèle FishXCode, par exemple `gpt-5.4`
- Effort de raisonnement : utilisez un niveau moyen au quotidien, plus élevé seulement pour les tâches complexes
- Permissions : utilisez l'accès complet pour les modifications fréquentes ; gardez l'approbation manuelle sur un projet inconnu
- Dossier de travail : choisissez le projet que Codex doit analyser ou modifier

### `/` et `@`

Deux raccourcis sont utiles dans la zone de saisie :

| Symbole | Usage |
| --- | --- |
| `/` | Ouvrir les commandes ou la liste des Skills |
| `@` | Référencer un fichier ou dossier du projet courant |

Si le menu ne s'ouvre pas, vérifiez qu'il y a un espace avant `/` ou `@`, et que le focus est dans Codex Desktop.

### Mode Plan

Pour les tâches complexes, commencez par le mode Plan. Codex décompose le travail, pose des questions de clarification et attend votre confirmation avant de modifier les fichiers.

![Entrer en mode Plan](/img/start/codex-desktop/codex-plan-mode.png)

Quand Codex pose une question, choisissez l'option correspondant à votre intention :

![Répondre aux questions de clarification](/img/start/codex-desktop/codex-clarify-question.png)

Après validation du plan, laissez Codex l'exécuter et surveillez l'étendue des changements :

![Exécuter et suivre le plan](/img/start/codex-desktop/codex-execute-plan.png)

## 6. FAQ

### Les requêtes ne passent toujours pas par FishXCode après connexion ?

Vérifiez dans l'ordre :

1. `~/.codex/config.toml` existe
2. `model_provider` vaut `fishxcode`
3. `base_url` vaut `https://api.fishxcode.com/v1`
4. `~/.codex/auth.json` contient le token FishXCode
5. Codex Desktop a été complètement fermé puis rouvert après modification

### Erreur 401 ou 403 ?

Vérifiez que le token est copié entièrement, activé, suffisamment crédité et autorisé à utiliser le modèle sélectionné.

### Le modèle affiché n'est pas celui attendu ?

Vérifiez `model` dans `config.toml`, puis le sélecteur de modèle dans Codex Desktop. Si vous utilisez CC Switch, vérifiez aussi que le canal courant est FishXCode.

### Message indiquant que CC Switch n'est pas configuré ?

Si vous utilisez CC Switch et voyez un message similaire, le canal courant n'est pas correct :

![CC Switch non configuré](/img/start/codex-desktop/cc-switch-not-configured.png)

Procédez ainsi :

1. Fermez complètement Codex Desktop, y compris le processus de la zone de notification
2. Ouvrez CC Switch et passez sur le canal FishXCode
3. Rouvrez Codex Desktop

Si vous n'utilisez pas CC Switch, revenez à l'étape 2 et vérifiez `~/.codex/config.toml` et `~/.codex/auth.json`.
