---
title: FishXCode Subscription Plans
description: FishXCode subscription plan entry points, categories, and billing rules.
---

# FishXCode Subscription Plans

This page lists FishXCode subscription plan entry points, categories, and billing rules. Prices, inventory, purchase limits, validity periods, and periodic limits are subject to the pricing page.

Common entry points:

- [All subscription plans](https://fishxcode.com/pricing?currency=CNY&plan_series=all&tab=subscription-plans)
- [Claude plans](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans)
- [Codex plans](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex)
- [By-number-of-times plans](https://fishxcode.com/pricing?currency=CNY&plan_series=mixed&plan_sort=price_asc&tab=subscription-plans)

## 1. Plan Categories

| Series | Entry | Description |
| --- | --- | --- |
| Claude | [Claude plans](/en/subscription-plans/claude) | ClaudeMax official-account subscription and Claude Code hosted service |
| Codex | [Codex plans](/en/subscription-plans/codex) | Managed by credit amount and validity period, suitable for individual or team usage |
| By number of times | [By-number-of-times plans](/en/subscription-plans/by-number-of-times) | Counts successful requests and supports related Claude and Codex models |

## 2. Rule Summary

- Claude plans are official-account subscriptions. See [Claude plans](/en/subscription-plans/claude).
- Codex plans are based on credit amount plus validity period. They are not simple request-count packages.
- By-number-of-times plans count successful requests. Daily limits, monthly limits, and total counts depend on plan configuration, and they can be used with the corresponding Claude and Codex model series.
- Claude Opus 4.8 and GPT-5.5 count as `2.5 × actual successful requests` in by-number-of-times plans.

## 3. Purchase Flow

1. Open the [pricing page](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans).
2. Switch to Subscription Plans.
3. Filter by Claude, Codex, or By-number-of-times plans.
4. Review the plan details, including price, validity period, credit amount, request count, supported models, reset rules, and purchase restrictions.
5. After payment, check the plan or subscription status in the console.
6. If the plan generates a separate Key, copy the Base URL and Key as instructed and configure them in the corresponding tool.

## 4. Notes

### Prices Follow the Pricing Page

Plan prices, inventory, purchase limits, discounts, and availability may change. This document explains the rules; exact prices follow the official pricing page.

### By-number-of-times Does Not Mean Every Model Costs 1 Count

By-number-of-times plans use successful requests as the base unit. Claude Opus 4.8 and GPT-5.5 count as `2.5 × actual successful requests`.

### Codex vs. By-number-of-times

Codex plans focus on credit amount and validity period. By-number-of-times plans focus on request counts, daily limits, monthly limits, and total counts.

### Expiration, Exhaustion, or Limit Reached

After reaching the validity period, total credit, total count, daily limit, or monthly limit, the system restricts further use according to the plan rules. You can wait for the cycle reset, buy a new plan, or use balance instead.

### Usage Issues

First confirm the plan validity period, daily or monthly limits, and supported model range. Then check [Error Logs](/en/error-logs) and [Group Health Status](/en/group-health). When contacting support, provide the order number, request time, and request ID.
