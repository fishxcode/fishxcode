# Utiliser FishXCode avec Claude  Code

## 1. Obtenir une clé API

### Créer un compte

Rendez-vous sur [fishxcode.com](https://fishxcode.com/register?aff=9CTW) pour vous inscrire (mot de passe 8–20 caractères, e-mail obligatoire).

### Créer un token

Connectez-vous, puis allez dans **Console → Gestion des tokens → Ajouter un token**. Lors de la création :

- Pour le **groupe de tokens**, choisissez le **canal officiel**. Ce groupe inclut `claude-opus-4-5-20251101`, `claude-haiku-4-5-20251001`, `claude-opus-4-6`, `claude-sonnet-4-5-20250929`, `claude-sonnet-4-6`, etc. Le modèle est sélectionné automatiquement selon la complexité de la tâche.
- Après création, cliquez sur le bouton de copie pour récupérer votre clé API (format : `sk-xxx`).

### Recharger le solde

| Méthode | Chemin |
| --- | --- |
| Alipay | Console → Portefeuille → Montant → Alipay |
| WeChat Pay | Console → Portefeuille → Montant → WeChat |
| Code de recharge | Console → Portefeuille → Saisir le code → Échanger |

::: tip Multiplicateur de taux
Un groupe libellé `0.5x` signifie que vous obtenez deux fois plus de tokens par rapport au tarif officiel. Exemple : `0.5x` = 10M tokens pour ¥1 (contre 5M au tarif officiel).
:::

---

## 2. Préparation de l'environnement

### Installer Node.js

Claude  Code s'installe via npm. Vérifiez d'abord que Node.js est disponible.

::: code-group

```bash [macOS - Vérifier]
node -v
npm -v
```

```bash [macOS - Installation via Homebrew]
brew install node
```

```bash [Windows - Vérifier (CMD/PowerShell)]
node -v
npm -v
```

:::

Si non installé, téléchargez depuis [nodejs.org/fr/download](https://nodejs.org/fr/download). **Windows nécessite un redémarrage** après l'installation.

### Windows uniquement : installer Git Bash

Claude  Code requiert un environnement bash. Les utilisateurs Windows doivent installer Git Bash :

1. Téléchargez depuis [git-scm.com/download/windows](https://git-scm.com/download/windows) et installez.
2. Vérification : clic droit sur le bureau — si **Open Git Bash here** apparaît, l'installation est réussie.

---

## 3. Installer Claude  Code

::: code-group

```bash [npm]
npm install -g @anthropic-ai/claude-code
```

```bash [pnpm]
pnpm install -g @anthropic-ai/claude-code
```

```bash [yarn]
yarn global add @anthropic-ai/claude-code
```

:::

Vérifier l'installation :

```bash
claude --version
```

---

## 4. Configurer FishXCode

### Option 1 : settings.json (Recommandé)

Éditez `~/.claude/settings.json` (Windows : `C:\Users\<nom_utilisateur>\.claude\settings.json`) :

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "votre-clé-api",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  },
  "permissions": {
    "allow": [
      "Bash",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "Glob(*)",
      "Grep(*)"
    ],
    "deny": []
  }
}
```

Cette configuration est **permanente** — inutile de redéfinir les variables à chaque session.

### Option 2 : Variables d'environnement temporaires

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_BASE_URL=https://fishxcode.com/
export ANTHROPIC_AUTH_TOKEN=sk-xxx
```

```powershell [Windows PowerShell (temporaire)]
$env:ANTHROPIC_BASE_URL="https://fishxcode.com/"
$env:ANTHROPIC_AUTH_TOKEN="sk-xxx"
```

```cmd [Windows CMD (temporaire)]
set ANTHROPIC_BASE_URL=https://fishxcode.com/
set ANTHROPIC_AUTH_TOKEN=sk-xxx
```

:::

Pour écrire définitivement dans les variables système Windows, exécutez dans PowerShell :

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

Rouvrez le terminal après l'exécution.

::: warning
Remplacez `sk-xxx` par votre token réel obtenu depuis la [Console FishXCode](https://fishxcode.com/console/token).
:::

---

## 5. Lancement

```bash
cd mon-projet
claude
```

---

## 6. Sélection du modèle

Tapez `/model` dans Claude  Code pour changer de modèle :

| Option | Modèle | Notes |
| --- | --- | --- |
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Sélection automatique selon la tâche. Recommandé. |
| **Opus** | `claude-opus-4-5-20251101` | Raisonnement le plus puissant, coût plus élevé |
| **Haiku** | `claude-haiku-4-5-20251001` | Léger et rapide |

Vous pouvez également fixer un modèle via une variable d'environnement :

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
claude
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_MODEL="claude-sonnet-4-5-20250929"
claude
```

:::

::: tip Mettre à jour Claude  Code
Si la version du modèle semble obsolète, mettez à jour et redémarrez vos outils :

```bash
npm install -g @anthropic-ai/claude-code
```

:::

---

## 7. Intégration IDE (IntelliJ IDEA)

**Chemin** : IDEA → Fichier → Paramètres → Plugins → Marketplace → rechercher `claude code` → installer **Claude  Code Terminal**.

::: info
Si le plugin n'apparaît pas dans le Marketplace, votre version d'IDEA est trop ancienne — mettez-la à jour.
:::

---

## 8. Dépannage

### Erreur 403

Le solde du token est insuffisant. Rechargez dans la console et réessayez.

### Windows : erreur de connexion ou 400/401

Exécutez ces commandes dans PowerShell pour écrire des variables système permanentes, puis rouvrez le terminal :

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

### "Unable to connect to Anthropic services"

Erreur complète :

```
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR_BAD_REQUEST
Please check your internet connection and network settings.
```

Cela se produit car Claude  Code n'a pas terminé l'onboarding et tente toujours de se connecter à `api.anthropic.com`. **Aucun VPN requis.** Ouvrez `~/.claude.json` (le fichier `.claude.json` dans votre répertoire home — pas `.claude/settings.json`) et ajoutez `"hasCompletedOnboarding": true` :

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Ajoutez une virgule après le champ précédent avant d'ajouter la nouvelle entrée. Relancez `claude` après la sauvegarde.
:::
