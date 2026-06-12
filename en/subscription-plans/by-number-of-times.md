---
title: By-number-of-times Plans
description: FishXCode by-number-of-times plans covering available models, request counts, daily limits, delivery time, and 2.5x counting rules.
---

# By-number-of-times Plans

The system counts successful requests and applies daily, monthly, and total limits according to plan configuration. Counts are based on platform logs. Usually, each successful request log counts as one base request.

View current [by-number-of-times plans](https://fishxcode.com/pricing?currency=CNY&plan_series=mixed&plan_sort=price_asc&tab=subscription-plans).

## 1. Plan Description

- Benefits are counted by successful requests.
- Each plan has its own total count, daily limit, monthly limit, or other periodic limits.
- Actual limits follow the plan page.
- By-number-of-times plans are for personal use only.
- The daily limit cannot be disabled.
- All by-number-of-times plans are limited to at most 10 requests per minute.
- The plan page shows total count, daily limit, reset time, per-request cost, original price, and discount price. Daily limits usually reset at 08:00 UTC+8. Final rules follow the purchase page.
- After purchase, you can create Keys from the plan. Requests made through those Keys count against the plan's total count, daily limit, monthly limit, and rate limit.

![By-number-of-times plan purchase example](/img/plans/subscription-plans.png)

## 2. Available Models

Available models include:

- `claude-haiku-4-5-20251001`
- `claude-opus-4-5-20251101`
- `claude-opus-4-6`
- `claude-opus-4-7`
- `claude-opus-4-8`
- `claude-sonnet-4-5-20250929`
- `claude-sonnet-4-6`
- `gpt-5.5`

The available range includes the corresponding Claude and Codex model series. Actual model availability follows the plan page, console, and API response.

## 3. Counting Rules

By-number-of-times plans use "count" as the base unit. High-cost models are multiplied:

| Model | Counting method |
| --- | --- |
| Claude Opus 4.8 | `2.5 × actual successful requests` |
| GPT-5.5 | `2.5 × actual successful requests` |
| Other models | `1 × actual successful requests` |

Examples:

- 1 successful Claude Opus 4.8 request counts as 2.5.
- 10 successful GPT-5.5 requests count as 25.
- 10 successful requests to other available models count as 10.

Counts are based on platform logs. Usually, each successful request log in the console maps to one base request. Claude Opus 4.8 and GPT-5.5 are then counted at 2.5x.

You can convert total plan count into actual usable requests by model multiplier. For example, a 100-count plan can handle about 100 successful requests if all requests use other models, or about 40 successful requests if all requests use Claude Opus 4.8 or GPT-5.5.

## 4. Delivery Time

After purchase:

- Day cards are usually delivered within 10 minutes.
- Monthly cards have higher benefits and are automatically submitted to the upstream supplier server. After upstream confirmation, activation and delivery usually complete within 30 minutes.

Actual delivery time can be affected by inventory, upstream confirmation, and manual handling. Page or support notification prevails.

## 5. Daily and Monthly Limits

If a plan includes daily and monthly limits, multiplied counts are applied to the corresponding cycle. After reaching the daily, monthly, or total plan limit, benefits pause or become restricted according to plan rules.

Daily limit, monthly limit, total count, and reset time vary by plan. Check the plan page before purchase.

The daily limit cannot be disabled. Confirm it fits your usage intensity before purchase.

All by-number-of-times plans are limited to at most 10 requests per minute. If you exceed this rate limit, reduce concurrency or retry later.

Daily limits usually reset at 08:00 UTC+8. For example, if you reach a 500-count daily limit today, you must wait until 08:00 UTC+8 the next day for the daily count to reset.

Example: a monthly card showing `500/day, 15000/month, monthly reset` means up to 500 base requests per day and 15000 total counts per month. The daily limit resets at 08:00 UTC+8, and the monthly total resets according to the plan rule.

## 6. Price and Per-request Cost

The "per-request cost" on the plan page helps compare value:

- Original per-request cost = original price / total plan count.
- Discounted per-request cost = discount price / total plan count.

Example: if a plan has 15000 monthly counts and an original price of `¥336.00`, the original per-request cost is `¥0.0224`. If the discount price is `¥320.00`, the discounted per-request cost is about `¥0.0213`.

If you use Claude Opus 4.8 or GPT-5.5, apply the 2.5x multiplier before estimating actual per-request cost.

## 7. Before Purchase

- Total plan count.
- Daily and monthly limits.
- Reset time, especially whether daily limits reset at 08:00 UTC+8.
- Original price, discount price, and converted per-request cost.
- Whether you will use Claude Opus 4.8 or GPT-5.5. If yes, calculate consumption at 2.5x.
- Whether you accept personal-use-only, the 10 requests/minute rate limit, and the daily limit that cannot be disabled.
- Whether you need to create Keys from the plan. New Keys' benefit counts are included in the plan limits.
- Whether you need an invoice.

## 8. Upgrade, Refund, and Invoice

- After buying a day card, contact support to upgrade to any monthly card if needed.
- Monthly cards cannot be changed.
- Refund rules follow the plan page, in-site notifications, and [Refund Policy](/en/refund).
- Invoices are supported.
