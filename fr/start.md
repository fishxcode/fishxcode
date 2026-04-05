# Utiliser FishXCode avec Claude Code

> Première utilisation ? Commencez par [créer votre compte](/fr/account).

## Tutoriel vidéo

<VideoPlayer src="https://s3.hi168.com/hi168-27900-8344owwk/claude0401.mp4" />

## 1. Préparation de l'environnement

### Installer Node.js

Claude Code s'installe via npm. Vérifiez d'abord que Node.js est disponible.

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

Si Node.js n'est pas installé, téléchargez le package correspondant à votre plateforme depuis [nodejs.org/zh-cn/download](https://nodejs.cn/download/current/). **Windows nécessite un redémarrage** après l'installation.

### Windows uniquement : installer Git Bash

Claude Code requiert un environnement bash. Les utilisateurs Windows doivent installer Git Bash :

1. Téléchargez depuis [git-scm.com/install/windows](https://git-scm.com/install) et installez la version correspondante.
2. Vérification : clic droit sur le bureau — si **Open Git Bash here** apparaît, l'installation est réussie.

---

## 2. Installer Claude Code via ZCF

::: code-group

```bash [npm]
npx zcf
```

:::

---

## 3. Configurer FishXCode

1. Dans le terminal, saisissez `npx zcf` et appuyez sur Entrée.
   Lorsque `Ok to proceed? (y)` apparaît, saisissez `y` et appuyez sur Entrée.

2. Sélectionnez la langue d'affichage de ZCF :
   Choisissez **English**.

3. Une fois l'installation terminée, sélectionnez :
   `1. Full Initialization - Install Claude Code + Import Workflows + Configure API or CCR Proxy + Configure MCP Services`

4. Modifier la configuration de la langue du modèle :
   Sélectionnez `No`

5. Langue de sortie de l'IA :
   Sélectionnez `English`

6. Installer Claude :
   Sélectionnez `Yes`

7. Mode de configuration de l'API :
   Sélectionnez `Custom API Configuration`

8. Fournisseur d'API :
   Sélectionnez `Custom Configuration`

9. Nom de la configuration :
   Saisissez un nom personnalisé en anglais

10. Type d'authentification :
    Sélectionnez `API Key`

11. URL de base de l'API :
    ```
    https://fishxcode.com
    ```

12. Clé API :
    Saisissez le token généré dans la console FishXCode

13. Configuration liée au modèle :
    Appuyez sur Entrée pour ignorer les valeurs par défaut

14. Type de workflow :
    Sélectionnez `General Tools`

15. Style de sortie :
    Choisissez selon vos préférences personnelles

16. Configurer MCP :
    Sélectionnez `Yes`

17. Services MCP :
    Utilisez la barre d'espace pour sélectionner les services souhaités, puis appuyez sur Entrée

18. Configurer CCometixLine :
    Appuyez directement sur Entrée

19. De retour au menu principal, saisissez :
    ```
    q
    ```

20. Dans le terminal, saisissez :
    ```
    claude
    ```
    - Sélectionnez `Yes, I trust this folder`
    - Pour la sélection de l'API, veillez à choisir **YES (la première option)**

---

## 4. Démarrage

```bash
cd my-project
claude
```

---

## 5. Sélection du modèle

Tapez `/model` dans l'interface de conversation de Claude Code pour changer de modèle :

| Option | Modèle réel | Notes |
|---|---|---|
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Sélection automatique selon la tâche. Recommandé pour un usage quotidien |
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

::: tip Mettre à jour Claude Code
Si la version du modèle n'est pas la plus récente, exécutez la commande de mise à jour puis redémarrez les outils concernés :
```bash
npm install -g @anthropic-ai/claude-code
```
:::

---

## 6. Intégration IDE

### IntelliJ IDEA

Chemin : Fichier → Paramètres → Plugins → Marketplace → recherchez `claude code`, puis installez **Claude Code Terminal** :

![Installer Claude Code Terminal](/img/start/idea-01-install.png)

Redémarrez IDEA après l'installation et vérifiez que le plugin est bien chargé :

![Vérification du plugin chargé](/img/start/idea-02-verify.png)

::: info
Si le plugin n'apparaît pas dans le Marketplace, votre version d'IDEA est trop ancienne — mettez-la à jour vers la dernière version.
:::

### VSCode

Appuyez sur `Ctrl + Shift + X` pour ouvrir le panneau des extensions, recherchez `claude code` et installez **Claude Code for VSCode**.

![Rechercher et installer le plugin Claude Code](/img/start/vscode-01-install.png)

Une fois installé, le plugin propose trois méthodes de connexion :

![Méthodes de connexion du plugin Claude Code](/img/start/vscode-02-login.png)

Il est recommandé de configurer la connexion à FishXCode via `settings.json`. Cliquez sur l'**icône d'engrenage** en bas à droite du plugin → **Modifier dans settings.json** :

![Ouvrir l'édition de settings.json](/img/start/vscode-03-settings.png)

Ajoutez les éléments suivants dans le `settings.json` de VSCode :

```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "Remplacez par votre clé API" },
    { "name": "ANTHROPIC_BASE_URL", "value": "https://fishxcode.com/" }
  ]
}
```

![Exemple de configuration settings.json](/img/start/vscode-04-config.png)

Après avoir sauvegardé, **quittez et rouvrez VSCode** ; le plugin se connectera normalement à FishXCode.

![Utiliser Claude Code dans VSCode](/img/start/vscode-05-demo.gif)

---

## 7. Questions fréquentes

### Erreur 403

Le solde du token est insuffisant. Rechargez dans la console et réessayez.

### Windows : erreur de connexion ou 400/401

Exécutez à nouveau la commande `setx` dans PowerShell pour écrire les variables système, puis rouvrez le terminal :

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

Cela se produit car Claude Code n'a pas terminé l'onboarding et tente toujours de se connecter à `api.anthropic.com`. **Aucun VPN requis.** Ouvrez `~/.claude.json` (le fichier `.claude.json` dans votre répertoire home — pas `.claude/settings.json`) et ajoutez `"hasCompletedOnboarding": true` à la fin :

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Ajoutez une virgule après le champ précédent avant d'insérer la nouvelle entrée (syntaxe JSON obligatoire). Relancez `claude` après la sauvegarde pour rétablir la connexion.
:::
