---
title: Offres au nombre de requêtes
description: Modèles disponibles, comptage, limites quotidiennes, livraison et règle 2.5x.
---

# Offres au nombre de requêtes

Le système compte les requêtes réussies et applique limites quotidiennes, mensuelles et totales. Le comptage se base sur les logs de plateforme; chaque log réussi équivaut généralement à une requête de base.

Voir les [offres au nombre de requêtes](https://fishxcode.com/pricing?currency=CNY&plan_series=mixed&plan_sort=price_asc&tab=subscription-plans).

## 1. Description

- Avantages comptés par requêtes réussies.
- Chaque offre a total, limite quotidienne, mensuelle ou autres limites.
- Usage personnel uniquement.
- La limite quotidienne ne peut pas être supprimée.
- Maximum 10 requêtes par minute pour toutes les offres.
- La page affiche total, limite quotidienne, reset, coût par requête, prix original et remisé. La limite quotidienne se réinitialise généralement à 08:00 UTC+8.
- Des Keys peuvent être créées depuis l'offre; elles comptent dans les limites de l'offre.

![Exemple d'achat](/img/plans/subscription-plans.png)

## 2. Modèles disponibles

- `claude-haiku-4-5-20251001`
- `claude-opus-4-5-20251101`
- `claude-opus-4-6`
- `claude-opus-4-7`
- `claude-opus-4-8`
- `claude-sonnet-4-5-20250929`
- `claude-sonnet-4-6`
- `gpt-5.5`

La disponibilité réelle suit la page, la console et la réponse API.

## 3. Règles de comptage

| Modèle | Méthode |
| --- | --- |
| Claude Opus 4.8 | `2.5 × requêtes réussies réelles` |
| GPT-5.5 | `2.5 × requêtes réussies réelles` |
| Autres modèles | `1 × requêtes réussies réelles` |

Un forfait de 100 requêtes donne environ 100 requêtes avec les autres modèles, ou 40 requêtes avec Claude Opus 4.8 / GPT-5.5.

## 4. Livraison

- Cartes journalières : généralement 10 minutes.
- Cartes mensuelles : envoyées au fournisseur upstream, puis activées après confirmation, généralement en 30 minutes.

## 5. Limites

Les limites quotidiennes, mensuelles et totales suivent l'offre. Le quotidien ne peut pas être désactivé. Toutes les offres limitent à 10 requêtes/minute.

La limite quotidienne se réinitialise généralement à 08:00 UTC+8. Si 500 requêtes sont utilisées aujourd'hui, il faut attendre demain 08:00 UTC+8.

## 6. Prix et coût

- Coût original = prix original / total.
- Coût remisé = prix remisé / total.

Exemple : 15000 requêtes et `¥336.00` donnent `¥0.0224`; à `¥320.00`, environ `¥0.0213`. Pour Claude Opus 4.8 ou GPT-5.5, appliquez d'abord 2.5x.

## 7. Avant achat

Vérifiez total, limites, heure de reset, prix, usage de Claude Opus 4.8 ou GPT-5.5, usage personnel, limite 10/minute, Keys à créer et facture.

## 8. Upgrade, remboursement et facture

- Une carte journalière peut être mise à niveau vers une carte mensuelle via support.
- Les cartes mensuelles ne peuvent pas être changées.
- Le remboursement suit la page, notifications et [politique de remboursement](/fr/refund).
- Facture disponible.
