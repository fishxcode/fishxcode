---
title: Planos Codex
description: Crédito, validade, compra, renovação, chaves e métricas de equipe dos planos Codex FishXCode.
---

# Planos Codex

Planos Codex são gerenciados por **crédito + validade**. Após a compra, o sistema gera automaticamente uma chave de acesso; também é possível criar chaves filhas para equipe.

Veja [planos Codex](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex).

## 1. Descrição

- Inclui crédito disponível e validade.
- Benefícios expiram ao fim da validade.
- Reset diário, semanal, mensal ou personalizado depende do plano.
- Suporta equipes e múltiplos usuários; créditos diferentes atendem diferentes tamanhos.
- Chamadas por chaves criadas do plano consomem o mesmo crédito total.
- Emite fatura.

## 2. Cobrança

- **Crédito**: total ou periódico.
- **Validade**: mensal, semanal, diária ou outra.
- **Reset**: nenhum, diário, semanal, mensal ou personalizado.
- **Escopo**: modelos, grupos e APIs seguem a página.
- **Consumo de chaves**: chave automática e chaves de equipe consomem o crédito do plano.

## 3. Antes de comprar

Verifique validade, crédito total/periódico, modelos, benefícios, grupos, reset, suporte, tamanho da equipe e necessidade de chaves separadas.

## 4. Compra e renovação

[Planos Codex](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex)

Compre pela lista ou detalhe de gestão. Confirme benefícios, validade, crédito, pagamento e notas.

![Exemplo de compra](/img/plans/buyplan.png)

Renovação exige plano válido, não removido, renovável e dentro da janela permitida. Normalmente, renova nos 3 dias antes de expirar. Após expirar, as chaves ficam indisponíveis.

## 5. Cupom

Se tiver cupom, valide na compra. O valor final segue a página.

## 6. Chave automática

Após pagamento, uma chave é criada em [Console -> Gestão de tokens](https://fishxcode.com/console/token). Prefixo:

```text
Subscription Access - plan id
```

Ela herda crédito, validade, grupos, modelos e regras.

![Exemplo de chave](/img/plans/tokens.png)

## 7. Chaves de equipe

Crie chaves para membros ou serviços em [Console -> Gestão de tokens](https://fishxcode.com/console/token). Configure nome, grupo, validade, quantidade e crédito máximo.

O consumo entra no crédito total do plano original.

![Criar chave](/img/plans/create.png)

## 8. Logs e métricas

Consulte [Console -> Logs de uso](https://fishxcode.com/console/log). Filtre por hora, modelo, token, grupo ou ID. Veja [Logs de erro](/pt/error-logs).

Métricas de equipe ficam em **Logs -> Status de saúde dos grupos**. Veja [Status de saúde dos grupos](/pt/group-health).

![Exemplo de métricas](/img/plans/statistics.png)

## 9. Expiração e limites

Após expirar, a chave automática e as chaves de equipe ficam indisponíveis. Ao atingir limite periódico, a gestão do plano pode permitir cancelar o limite para consumir crédito total.

Se o crédito total acabar, contate-nos para renovação direta e manter plano e chaves originais.

## 10. Reembolsos

Regras seguem a página, descrição do plano e [Política de reembolso](/pt/refund). Informe pedido, plano, chave, horário e ID de solicitação.
