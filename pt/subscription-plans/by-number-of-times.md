---
title: Planos por número de vezes
description: Modelos disponíveis, contagem, limites diários, entrega e regra 2.5x.
---

# Planos por número de vezes

O sistema conta solicitações bem-sucedidas e aplica limites diários, mensais e totais. A contagem segue os logs da plataforma; normalmente cada log bem-sucedido vale uma solicitação base.

Veja [planos por número de vezes](https://fishxcode.com/pricing?currency=CNY&plan_series=mixed&plan_sort=price_asc&tab=subscription-plans).

## 1. Descrição

- Benefícios contados por solicitações bem-sucedidas.
- Cada plano tem total, limite diário, mensal ou outros limites.
- Uso pessoal apenas.
- Não é possível cancelar limite diário.
- Todos os planos limitam a 10 solicitações por minuto.
- A página mostra total, limite diário, reset, custo por solicitação, preço original e desconto. O limite diário normalmente reinicia às 08:00 UTC+8.
- Após compra, é possível criar Keys do plano; elas contam nos limites do plano.

![Exemplo de compra](/img/plans/subscription-plans.png)

## 2. Modelos disponíveis

- `claude-haiku-4-5-20251001`
- `claude-opus-4-5-20251101`
- `claude-opus-4-6`
- `claude-opus-4-7`
- `claude-opus-4-8`
- `claude-sonnet-4-5-20250929`
- `claude-sonnet-4-6`
- `gpt-5.5`

Disponibilidade real segue a página, console e resposta da API.

## 3. Contagem

| Modelo | Método |
| --- | --- |
| Claude Opus 4.8 | `2.5 × solicitações bem-sucedidas reais` |
| GPT-5.5 | `2.5 × solicitações bem-sucedidas reais` |
| Outros modelos | `1 × solicitações bem-sucedidas reais` |

Um plano de 100 vezes equivale a cerca de 100 solicitações com outros modelos, ou 40 com Claude Opus 4.8 / GPT-5.5.

## 4. Entrega

- Cartões diários: normalmente 10 minutos.
- Cartões mensais: enviados ao fornecedor upstream e ativados após confirmação, normalmente em 30 minutos.

## 5. Limites

Limites diários, mensais e totais seguem o plano. O limite diário não pode ser desativado. Todos os planos têm 10 solicitações/minuto.

O limite diário normalmente reinicia às 08:00 UTC+8. Se usar 500 hoje, espere até amanhã às 08:00 UTC+8.

## 6. Preço e custo

- Custo original = preço original / total.
- Custo com desconto = preço com desconto / total.

Exemplo: 15000 vezes e `¥336.00` resultam em `¥0.0224`; com `¥320.00`, cerca de `¥0.0213`. Para Claude Opus 4.8 ou GPT-5.5, aplique 2.5x antes.

## 7. Antes de comprar

Confira total, limites, hora de reset, preço, uso de Claude Opus 4.8 ou GPT-5.5, uso pessoal, limite 10/minuto, Keys a criar e fatura.

## 8. Upgrade, reembolso e fatura

- Cartão diário pode ser atualizado para cartão mensal via suporte.
- Cartões mensais não podem ser trocados.
- Reembolso segue a página, notificações e [Política de reembolso](/pt/refund).
- Fatura disponível.
