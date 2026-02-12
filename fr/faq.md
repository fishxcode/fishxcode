# Foire aux questions

## Informations generales

### Qu'est-ce que FishXCode ?

FishXCode est un relais AI Coding qui prend en charge les modeles Claude, Codex et Gemini sur plusieurs plateformes.

### Quels outils sont pris en charge ?

Les outils actuellement compatibles :

- **Claude Code** — CLI officiel d'Anthropic
- **OpenAI Codex** — Assistant de programmation d'OpenAI
- **Gemini CLI** — Outil IA en ligne de commande de Google
- **RooCode** — Extension IA pour VS Code
- **Qwen Code** — Outil de programmation base sur Qwen d'Alibaba
- **Droid CLI** — CLI leger pour la programmation IA

### Qu'en est-il de la confidentialite de mes donnees ?

FishXCode fonctionne uniquement comme un relais d'API. Votre code et vos conversations ne sont pas stockes sur nos serveurs. Toutes les requetes sont transmises directement aux fournisseurs de modeles.

::: tip Conseil
Pour les projets sensibles, nous vous recommandons de consulter la politique de confidentialite de chaque fournisseur de modeles.
:::

## Compte et Token

### Comment creer un compte ?

Rendez-vous sur [fishxcode.com/register](https://fishxcode.com/register?aff=9CTW) et suivez les instructions pour vous inscrire.

### Comment obtenir un token API ?

Apres connexion, accedez a la [page de gestion des tokens](https://fishxcode.com/console/token) dans la console pour generer un nouveau token.

### Quelle est la duree de validite d'un token ?

Les tokens restent valides jusqu'a leur suppression ou regeneration manuelle. Nous recommandons de les renouveler regulierement pour des raisons de securite.

### Quelles sont les limites du forfait gratuit ?

Chaque utilisateur beneficie d'un quota gratuit. Le montant exact varie en fonction des ressources disponibles sur la plateforme. Consultez votre console pour suivre votre consommation.

::: warning Attention
Une fois le quota gratuit epuise, les requetes seront rejetees. Prevoyez votre utilisation en consequence.
:::

## Configuration des outils

### Mes variables d'environnement ne fonctionnent pas

Verifiez les points suivants :

1. **Terminal non recharge** — Apres avoir modifie `.bashrc` / `.zshrc`, executez `source ~/.bashrc` ou ouvrez un nouveau terminal
2. **Erreur de saisie** — Les noms de variables sont sensibles a la casse : `ANTHROPIC_BASE_URL` n'est pas equivalent a `Anthropic_Base_Url`
3. **Espaces ou guillemets superflus** — Assurez-vous qu'il n'y a pas d'espaces parasites dans `export KEY="value"`

::: details Commandes de diagnostic rapide
```bash
# Verifier que les variables sont definies
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_API_KEY

# Si la sortie est vide, la variable n'est pas definie
```
:::

### Ou se trouvent les fichiers de configuration ?

| Outil | Emplacement |
|-------|-------------|
| Claude Code | Variables d'environnement |
| Codex | `~/.codex/config.toml` et `~/.codex/auth.json` |
| RooCode | Parametres JSON de VS Code |
| Qwen Code | Variables d'environnement |

### Impossible de se connecter a FishXCode

1. Verifiez que le `BASE_URL` est bien `https://fishxcode.com/` (attention au `/` final)
2. Assurez-vous que `fishxcode.com` est accessible depuis votre reseau
3. Si vous etes derriere un proxy d'entreprise, verifiez la configuration du proxy

## Choix du modele

### Comment choisir le bon modele ?

Selectionnez en fonction de votre besoin :

| Cas d'usage | Modele recommande | Raison |
|-------------|-------------------|--------|
| Programmation courante | `claude-sonnet-4-5-20250929` | Bon equilibre performance/rapidite |
| Completions rapides | `claude-3-5-haiku-20241022` | Temps de reponse court |
| Architecture complexe | `claude-sonnet-4-5-20250514` | Excellente capacite de raisonnement |

### Quelles sont les differences entre les modeles ?

- **Serie Sonnet** — Polyvalente, adaptee a la plupart des taches de programmation
- **Serie Haiku** — Legere et rapide, ideale pour les completions simples et le formatage
- Pour des comparaisons detaillees, consultez la documentation officielle de chaque fournisseur

### Comment changer de modele ?

Definissez la variable d'environnement `ANTHROPIC_MODEL` :

```bash
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

## Depannage

### Erreur d'authentification (Auth Error)

::: warning Causes frequentes
- Le token contient des espaces supplementaires ou est incomplet
- Le token a ete supprime ou regenere
- `API_KEY` et `AUTH_TOKEN` doivent etre definis simultanement
:::

Solution : Accedez a la [console](https://fishxcode.com/console/token), verifiez l'etat de votre token et copiez-le a nouveau.

### Delai d'attente depasse (Timeout)

Causes possibles :
1. Latence reseau elevee
2. Contexte d'entree trop volumineux necessitant un traitement plus long
3. Charge importante sur le service

Essayez de reduire le contexte d'entree ou reessayez apres quelques instants.

### Limite de debit atteinte (429)

Un code `429` signifie que vos requetes sont trop frequentes.

::: tip Comment reagir
- Ralentissez et attendez quelques secondes entre les requetes
- Evitez les appels API en boucle sans delai
- Verifiez qu'aucun autre processus n'utilise le meme token en parallele
:::

### Modele non disponible

Verifiez le nom exact du modele que vous avez specifie. Consultez la liste des modeles recommandes dans [Demarrage rapide](/fr/start). Certains modeles peuvent ne pas encore etre disponibles sur FishXCode.
