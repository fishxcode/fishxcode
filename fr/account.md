# Création de compte

> Vous avez déjà un compte ? Rendez-vous directement sur [Démarrage rapide](/fr/start) pour configurer vos outils.

## 1. Obtenir la clé API

### 1. Créer un compte

Rendez-vous sur [fishxcode.com](https://fishxcode.com/register?aff=9CTW) et cliquez sur **S'inscrire** :

![Page d'accueil FishXCode](/img/start/api-01-home.png)

Choisissez votre méthode d'inscription (GitHub, LinuxDO ou nom d'utilisateur) :

![Choix de la méthode d'inscription](/img/start/api-02-register.png)

Renseignez votre nom d'utilisateur, mot de passe et confirmation du mot de passe pour finaliser l'inscription :

![Formulaire d'inscription](/img/start/api-03-register-form.png)

### 2. Se connecter

Une fois inscrit, connectez-vous avec votre nom d'utilisateur et votre mot de passe :

![Page de connexion](/img/start/api-04-login.png)

Après connexion, vous accédez à la console :

![Page d'accueil de la console](/img/start/api-05-console.png)

### 3. Créer un token

Allez dans **Console → Gestion des tokens → Ajouter un token** et remplissez le formulaire :

![Ajouter un token](/img/start/api-06-token-create.png)

- Pour le **groupe de tokens**, choisissez de préférence le **canal officiel**. Ce groupe inclut `claude-opus-4-5-20251101`, `claude-haiku-4-5-20251001`, `claude-opus-4-6`, `claude-sonnet-4-5-20250929`, `claude-sonnet-4-6`, etc. Le modèle est sélectionné automatiquement selon la complexité de la tâche, sans intervention manuelle.

Une fois créé, cliquez sur le bouton **Copier** dans la liste des tokens pour récupérer votre clé API (format : `sk-xxx`) :

![Copier le token](/img/start/api-07-token-copy.png)

### 4. Recharger le solde

Allez dans **Console → Gestion du portefeuille** ; les paiements Alipay, WeChat et codes de recharge sont acceptés :

![Page de recharge](/img/start/api-08-wallet.png)

| Méthode | Chemin |
|---|---|
| Alipay | Saisir/sélectionner le montant → Alipay |
| WeChat | Saisir/sélectionner le montant → WeChat |
| Code de recharge | Saisir le code dans la zone dédiée → Cliquer sur Échanger |

::: tip Multiplicateur de taux
Le `0.5x` dans le nom d'un groupe indique le multiplicateur de consommation. Plus la valeur est faible, plus vous obtenez de tokens. Par exemple, `0.5x` signifie 10 millions de tokens officiels pour 1 yuan (contre 5 millions au tarif officiel).
:::
