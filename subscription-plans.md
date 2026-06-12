---
title: FishXCode Subscription Plans
description: FishXCode 订阅套餐入口、分类和扣费口径。
---

# FishXCode Subscription Plans（订阅套餐）

这里列出 FishXCode 订阅套餐的入口、分类和扣费口径。价格、库存、限购、有效期和周期上限以定价页为准。

常用入口：

- [全部订阅套餐](https://fishxcode.com/pricing?currency=CNY&plan_series=all&tab=subscription-plans)
- [Claude 系列套餐](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans)
- [Codex 系列套餐](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex)
- [按次系列套餐](https://fishxcode.com/pricing?currency=CNY&plan_series=mixed&plan_sort=price_asc&tab=subscription-plans)
- [站点计费规则与分组简介](/billing-groups)

## 一、套餐分类

| 系列 | 入口 | 说明 |
| --- | --- | --- |
| Claude 系列 | [Claude 系列](/subscription-plans/claude) | ClaudeMax 官方号订阅与 Claude Code 托管服务 |
| Codex 系列 | [Codex 系列](/subscription-plans/codex) | 按额度和有效期管理，适合个人或团队按额度使用 |
| 按次系列 | [按次系列](/subscription-plans/by-number-of-times) | 按成功请求次数累计，支持 Claude、Codex 相关模型 |

## 二、规则摘要

- Claude 系列是官方号订阅，购买入口见 [Claude 系列](/subscription-plans/claude)。
- Codex 系列是按量额度 + 有效期限制，不是单纯按次售卖。
- 按次系列是按次套餐，日上限、月上限和总次数以套餐配置为准，可用于对应的 Claude 和 Codex 系列模型。
- Claude Opus 4.8 和 GPT-5.5 在按次数系列中按 `2.5 × 实际成功请求次数` 累计。
- 如果需要理解模型价格、令牌分组、倍率和套餐适用范围之间的关系，请先看 [站点计费规则与分组简介](/billing-groups)。

## 三、购买流程

1. 打开 [定价页](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans)。
2. 切换到“订阅套餐”。
3. 按系列筛选 Claude、Codex 或 按次套餐。
4. 查看套餐详情，确认价格、有效期、额度、次数、适用模型、重置规则和购买限制。
5. 支付后，在控制台的套餐或订阅页面查看状态。
6. 如套餐生成独立 Key，按页面提示复制 Base URL 和 Key，并配置到对应工具中。

## 四、说明

### 价格以定价页为准

套餐价格、库存、限购、优惠和可售状态会调整。文档只写规则，具体价格以官网定价页为准。

### 按次不等于所有模型都按 1 次扣

By number of times 系列以成功请求次数为基础。Claude Opus 4.8 和 GPT-5.5 按 `2.5 × 实际成功请求次数` 累计。

### Codex 系列和 By number of times 系列的区别

Codex 系列看额度和有效期；By number of times 系列看请求次数、每日上限、每月上限和总次数。

### 到期、用完或达到上限

达到有效期、总额度、总次数、每日上限或每月上限后，系统按套餐规则限制继续使用。后续可等待周期重置、购买新套餐，或改用余额。

### 使用异常

先确认套餐有效期、当日或当月上限、模型适用范围。再查看 [错误日志说明](/error-logs) 和 [分组健康状态](/group-health)。联系售后时请提供订单号、请求时间和请求 ID。
