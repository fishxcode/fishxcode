---
title: Règles de facturation et aperçu des groupes
description: Unités de facturation FishXCode, multiplicateurs, groupes de tokens, usage à la demande et lien avec les offres.
---

# Règles de facturation et aperçu des groupes

Cette page explique le lien entre facturation FishXCode, groupes de tokens et offres d'abonnement. Vérifiez d'abord la page de prix et le périmètre de l'offre, choisissez ensuite le bon groupe pour la clé, puis contrôlez l'usage réel dans les journaux et l'état de santé des groupes.

::: tip Périmètre actuel
La page de tarification actuelle contient **49 modèles et 14 groupes sélectionnables**. Les modèles, prix, groupes et disponibilités peuvent changer; la [page de tarification](https://fishxcode.com/pricing?currency=CNY) et la console font foi.
:::

## Correspondance des captures

| Capture | Ce qu'elle explique |
| --- | --- |
| Liste des offres | Champs de carte qui influencent la facturation |
| Droits d'une offre au nombre de requêtes | Limite quotidienne, total, reset, modèles pris en charge |
| Fenêtre d'achat | Points à vérifier avant paiement |
| Création de token | Comment un groupe est lié à une clé API |
| Token basé sur une offre | Comment répartir un quota d'offre dans une équipe |
| Liste des tokens | Groupe, multiplicateur, modèles et expiration |
| État de santé des groupes | Coût, cache et périmètre d'incident après usage |

## 1. Trois entrées de facturation

| Entrée | À lire | Usage |
| --- | --- | --- |
| Usage à la demande | Prix modèle, input/output/cache, groupe du token | Appels sur solde, tests, modèles mixtes |
| Offres | Validité, quota total, limites jour/mois, groupe applicable | Budget d'équipe et usage Codex / Claude durable |
| Groupes de tokens | Modèles accessibles, pool, multiplicateur | Création de clé, séparation projet, attribution des coûts |

À lire avec [Offres d'abonnement](/fr/subscription-plans) : cette page explique prix, multiplicateurs et groupes; la page des offres explique quota acheté, validité, nombre de requêtes et limites.

## 2. Page de prix : commencer par les cartes d'offres

![Exemple de liste d'offres](/img/plans/subscription-plans.png)

| Champ | Signification | Lecture |
| --- | --- | --- |
| Prix actuel | Prix d'achat et validité | `¥320.00 / 1 mois` |
| Coût unitaire | Prix divisé par nombre total | Comparer les offres similaires |
| Limite de l'offre | Quota ou nombre total | `15000 requêtes` indique la limite totale |
| Limite quotidienne | Usage maximum par jour | `500/jour` bloque généralement jusqu'au reset |
| Reset | Moment de remise à zéro | Par exemple 08:00 chaque jour |
| Périmètre | Groupe, modèles, fournisseurs | Exemple : `sub_plan_claude_mini_plus` |
| Conversion | Modèles qui comptent plus | Claude Opus 4.8 / GPT-5.5 peuvent compter `2.5 × 1 requête` |

::: tip Exemple
Avec `500/jour, 15000/mois` et une règle `2.5 × 1 requête`, les modèles normaux comptent souvent 1 requête. Claude Opus 4.8 ou GPT-5.5 comptent 2.5; environ 200 appels réussis peuvent donc atteindre une limite quotidienne de 500.
:::

## 3. Droits d'offre : limites, reset et modèles

![Exemple de droits d'offre](/img/plans/by-number-of-times.png)

Vérifiez la limite quotidienne, la limite totale, le reset, la période d'achat, les fournisseurs, les modèles disponibles et le groupe d'upgrade appliqué après achat.

## 4. Achat : vérifier avant paiement

![Exemple d'achat d'offre](/img/plans/buyplan.png)

Vérifiez prix, validité, quota ou nombre de requêtes, type d'offre, moyen de paiement et conditions d'achat. Les règles de remboursement, livraison et support suivent la page affichée.

## 5. Usage à la demande

L'usage à la demande consomme directement le solde du compte sans acheter d'offre fixe. Il convient aux tests, usages peu fréquents, essais multi-modèles ou avant de choisir une offre.

1. Vérifiez sur la [page de tarification](https://fishxcode.com/pricing?currency=CNY) quels groupes supportent le modèle.
2. Créez un token normal dans **Console -> Gestion des tokens**.
3. Configurez la clé dans votre outil ou code.
4. Chaque requête réussie déduit le solde selon prix modèle, tokens input/output, cache et multiplicateur.
5. Vérifiez dans **Console -> Journaux d'utilisation**.

```text
Consommation estimée ~= consommation modèle × multiplicateur du groupe + écarts output/cache
```

| Type | Comportement | Usage |
| --- | --- | --- |
| Solde à la demande | Déduction à l'usage; arrêt si solde insuffisant | Tests et modèles mixtes |
| Offres Codex | Validité et quota | Équipes Codex / GPT |
| Offres au nombre de requêtes | Requêtes réussies et limites jour/mois | Budget fixe en requêtes |
| Offres ClaudeMax | Droits de compte et parcours Claude Code | Usage Claude Code officiel |

## 6. Groupes de tokens

Un groupe définit **les modèles disponibles, le multiplicateur et le pool amont** de la clé API.

![Choix du groupe lors de la création du token](/img/start/api-06-token-create.png)

Si le groupe est incorrect, vous pouvez voir `model not found`, `model not available`, une erreur de permission, une facturation inattendue ou une confusion entre solde et offre.

## 7. Tokens d'offre pour équipe

![Création de token basé sur une offre](/img/plans/create.png)

| Champ | Signification |
| --- | --- |
| Créer depuis une offre | Lie le token à une offre; expiration, groupe et modèles suivent l'offre |
| Nom | Utilisez membre, projet ou service |
| Groupe | Suit généralement l'offre ou le groupe utilisateur |
| Expiration | Ne devrait pas dépasser la validité de l'offre |
| Quota du token | Limite la part de quota consommable par cette clé |

Créer un token par membre ou service facilite le suivi et la limitation.

![Exemple de token d'offre](/img/plans/tokens.png)

## 8. Les 14 groupes actuels

| Groupe | Description | Usage conseillé |
| --- | --- | --- |
| `OpenRouter` | Agrégation officielle OpenRouter; supporte Claude, Codex et autres familles. | Accès unifié |
| `cc-max` | Canal API officiel Claude Code; priorité stabilité. | Claude Code production |
| `cc_export` | Groupe externe Claude Code sans restriction client. | Outils tiers |
| `cc_max` | Pool Claude MAX auto-géré. | Claude Code ou plugins officiels |
| `claudemax_x20` | Groupe d'abonnement officiel ClaudeMax x20. | Équipe ou usage intensif |
| `claudemax_x5` | Groupe d'abonnement officiel ClaudeMax x5. | Usage individuel ou léger |
| `codex_plus` | Pool externe Codex Plus. | Code fréquent |
| `codex_pro` | Pool externe Codex Pro. | Codex / GPT plus stable |
| `codex_sub` | Pool standard d'abonnement Codex. | Abonnement Codex standard |
| `codex_sub_june` | Nouveau pool Codex pour GPT-5.x / Codex. | Nouveaux modèles Codex |
| `deepseek` | Canal officiel DeepSeek. | DeepSeek |
| `default` | Groupe général à la demande. | Tests et usage normal |
| `gemini` | Groupe Gemini multimodal et long contexte. | Gemini |
| `grok` | Groupe xAI Grok. | Grok |

## 9. Exemples de multiplicateurs

| Consommation modèle | Multiplicateur | Déduction estimée |
| --- | --- | --- |
| 10 crédits | `1x` | 10 crédits |
| 10 crédits | `0.5x` | 5 crédits |
| 10 crédits | `0.1x` | 1 crédit |
| 10 crédits | `2.5x` | 25 crédits |

## 10. Vérifier l'usage réel

![Exemple d'état de santé des groupes](/img/plans/statistics.png)

Utilisez les journaux et l'état de santé des groupes pour savoir quel groupe consomme le plus, si un seul membre est anormal, si le cache fonctionne et si le problème vient d'un pool.

## 11. Choix rapide

| Scénario | Commencer par |
| --- | --- |
| Hésitation | `default` |
| Claude Code stable | `cc-max`, `cc_max`, ClaudeMax |
| Client Claude tiers | `cc_export` |
| Codex / GPT code | `codex_plus`, `codex_pro`, `codex_sub_june` |
| Multi-familles | `OpenRouter` |
| Gemini | `gemini` |
| Grok | `grok` |
| DeepSeek | `deepseek` |

## 12. Dépannage

1. Confirmez que le groupe du token inclut le modèle.
2. Vérifiez solde, validité, limites et quota total.
3. Filtrez les journaux par heure, modèle, token, groupe ou request ID.
4. Comparez [État de santé des groupes](/fr/group-health).
5. Pour le support, fournissez commande, token, groupe, modèle, heure et request ID.
