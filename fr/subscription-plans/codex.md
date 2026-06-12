---
title: Offres Codex
description: Crédit, validité, achat, renouvellement, clés et métriques d'équipe des offres Codex FishXCode.
---

# Offres Codex

Les offres Codex sont gérées par **crédit + durée de validité**. Après achat, le système génère automatiquement une clé d'accès; vous pouvez aussi créer des clés enfant pour une équipe.

Voir les [offres Codex](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex).

## 1. Description

- Crédit disponible et durée de validité.
- Les avantages expirent à la fin de la validité.
- Reset quotidien, hebdomadaire, mensuel ou personnalisé selon la configuration.
- Usage équipe et multi-utilisateur pris en charge; différents crédits conviennent à différentes tailles.
- Les appels via clés créées depuis l'offre consomment le même crédit total.
- Facture disponible.

## 2. Facturation

- **Crédit** : crédit total ou périodique.
- **Validité** : mensuelle, hebdomadaire, quotidienne ou autre.
- **Reset** : aucun, quotidien, hebdomadaire, mensuel ou personnalisé.
- **Portée** : modèles, groupes et API disponibles selon la page.
- **Consommation des clés** : clé automatique et clés d'équipe consomment le crédit de l'offre.

## 3. Avant achat

Vérifiez validité, crédit total et périodique, modèles pris en charge, règles de reset, support, taille d'équipe et besoin de clés séparées avec limites.

## 4. Achat et renouvellement

[Offres Codex](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex)

Achetez depuis la liste ou le détail de gestion. Confirmez avantages, validité, crédit, paiement et notes.

![Exemple d'achat](/img/plans/buyplan.png)

Le renouvellement exige que l'offre soit valide, non retirée, renouvelable et dans la fenêtre autorisée. En général, le renouvellement est disponible dans les 3 jours avant expiration. Après expiration, les clés ne fonctionnent plus.

## 5. Code promo

Un code promo peut être saisi et vérifié lors de l'achat. Le montant final suit la page d'achat.

## 6. Clé automatique

Après paiement, une clé est créée dans [Console -> Gestion des tokens](https://fishxcode.com/console/token). Préfixe :

```text
Subscription Access - plan id
```

Elle hérite crédit, validité, groupes, modèles et règles.

![Exemple de clé](/img/plans/tokens.png)

## 7. Clés d'équipe

Depuis [Console -> Gestion des tokens](https://fishxcode.com/console/token), créez des clés pour membres ou services. Définissez nom, groupe, expiration, quantité et crédit maximal.

La consommation entre dans le crédit total de l'offre.

![Créer une clé](/img/plans/create.png)

## 8. Logs et métriques

Consultez [Console -> Logs d'utilisation](https://fishxcode.com/console/log). Filtrez par heure, modèle, token, groupe ou ID. Voir [Journaux d'erreur](/fr/error-logs).

Les métriques d'équipe sont dans **Logs -> État de santé des groupes**. Voir [État de santé des groupes](/fr/group-health).

![Exemple de métriques](/img/plans/statistics.png)

## 9. Expiration et limites

Après expiration, la clé automatique et les clés d'équipe sont indisponibles. Si une limite périodique est atteinte, la gestion de l'offre peut permettre de désactiver cette limite pour consommer le crédit total.

Si le crédit total est épuisé, contactez-nous pour un renouvellement direct afin de conserver l'offre et les clés d'origine.

## 10. Remboursements

Les règles suivent la page d'achat, la description et la [politique de remboursement](/fr/refund). Fournissez commande, offre, clé, heure et ID de requête.
