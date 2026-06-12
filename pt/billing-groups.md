---
title: Regras de cobrança e visão geral dos grupos
description: Unidades de cobrança do FishXCode, multiplicadores, grupos de tokens, uso por saldo e relação com planos.
---

# Regras de cobrança e visão geral dos grupos

Esta página explica como cobrança, grupos de tokens e planos de assinatura se conectam no FishXCode. Use como checklist antes de comprar ou criar uma chave: confira preços e escopo do plano, escolha o grupo correto e depois valide o consumo real em logs e status dos grupos.

::: tip Escopo atual
A página de preços atual tem **49 modelos e 14 grupos selecionáveis**. Modelos, preços, grupos e disponibilidade podem mudar; a [página de preços](https://fishxcode.com/pricing?currency=CNY) e o console são a referência.
:::

## Mapa das capturas

| Captura | O que explica |
| --- | --- |
| Lista de planos | Campos do plano que afetam a cobrança |
| Benefícios por número de vezes | Limite diário, total, reset e modelos |
| Diálogo de compra | O que conferir antes do pagamento |
| Criar token | Como um grupo é ligado a uma API key |
| Criar token a partir de plano | Como dividir quota do plano na equipe |
| Lista de tokens | Grupo, multiplicador, modelos e expiração |
| Status dos grupos | Custo, cache e escopo de incidente |

## 1. Três entradas de cobrança

| Entrada | O que olhar | Uso |
| --- | --- | --- |
| Uso por saldo | Preço base, entrada/saída/cache, grupo | Chamadas com saldo, testes, modelos mistos |
| Planos | Validade, quota total, limites dia/mês, grupo aplicável | Orçamento de equipe e uso Codex / Claude contínuo |
| Grupos de tokens | Modelos disponíveis, pool e multiplicador | Criar chaves, separar projetos, atribuir custos |

Leia junto com [Planos de assinatura](/pt/subscription-plans): esta página explica preços, multiplicadores e grupos; a página de planos explica quota comprada, validade, contagem e limites.

## 2. Página de preços: leia os cards primeiro

![Exemplo de lista de planos](/img/plans/subscription-plans.png)

| Campo | Significado | Como ler |
| --- | --- | --- |
| Preço atual | Preço e validade | `¥320.00 / 1 mês` |
| Custo por solicitação | Preço dividido pelo total | Comparar planos semelhantes |
| Limite do plano | Quota ou número total | `15000 solicitações` é o total |
| Limite diário | Uso máximo por dia | `500/dia` geralmente bloqueia até reset |
| Reset | Quando o limite volta | Por exemplo 08:00 diário |
| Escopo | Grupo, modelos, fornecedores | Exemplo: `sub_plan_claude_mini_plus` |
| Conversão | Modelos que contam mais | Claude Opus 4.8 / GPT-5.5 podem contar `2.5 × 1 solicitação` |

::: tip Exemplo
Com `500/dia, 15000/mês` e regra `2.5 × 1 solicitação`, modelos normais contam 1. Claude Opus 4.8 ou GPT-5.5 contam 2.5; cerca de 200 chamadas bem-sucedidas podem atingir o limite diário de 500.
:::

## 3. Benefícios do plano

![Exemplo de benefícios por número de vezes](/img/plans/by-number-of-times.png)

Confira limite diário, limite total, reset, janela de compra, fornecedores, modelos disponíveis e grupo de upgrade aplicado após a compra.

## 4. Compra: confirme antes de pagar

![Exemplo de compra de assinatura](/img/plans/buyplan.png)

Confira preço, validade, quota ou número de solicitações, tipo de plano, método de pagamento e notas de compra. Reembolso, entrega e suporte seguem o que está na página.

## 5. Uso por saldo

Uso por saldo consome diretamente o saldo da conta sem comprar plano fixo. Serve para testes, uso pouco frequente, experimentos com vários modelos ou antes de escolher um plano.

1. Confira na [página de preços](https://fishxcode.com/pricing?currency=CNY) quais grupos suportam o modelo.
2. Crie um token normal em **Console -> Gerenciamento de tokens**.
3. Configure a chave na ferramenta ou código.
4. Cada solicitação bem-sucedida desconta saldo conforme preço do modelo, tokens de entrada/saída, cache e multiplicador.
5. Confira o consumo em **Console -> Logs de uso**.

```text
Consumo estimado ~= consumo base do modelo × multiplicador do grupo + diferenças de saída/cache
```

| Tipo | Comportamento | Uso |
| --- | --- | --- |
| Saldo por uso | Desconta ao usar; para se o saldo acabar | Testes e modelos mistos |
| Planos Codex | Validade e quota | Equipes Codex / GPT |
| Planos por número de vezes | Solicitações bem-sucedidas e limites | Orçamento fixo por solicitações |
| Planos ClaudeMax | Benefícios de conta e fluxo Claude Code | Claude Code oficial |

## 6. Grupos de tokens

Um grupo define **modelos disponíveis, multiplicador e pool upstream** para a API key.

![Seleção de grupo ao criar token](/img/start/api-06-token-create.png)

Se o grupo estiver errado, podem aparecer `model not found`, `model not available`, erro de permissão, custo inesperado ou confusão entre saldo e plano.

## 7. Tokens de plano para equipes

![Criar token a partir de plano](/img/plans/create.png)

| Campo | Significado |
| --- | --- |
| Criar a partir de plano | Liga o token a um plano; expiração, grupo e modelos seguem o plano |
| Nome | Use membro, projeto ou serviço |
| Grupo | Normalmente segue o plano ou grupo do usuário |
| Expiração | Não deve passar da validade do plano |
| Quota do token | Limita quanto essa chave pode consumir |

Criar um token por membro ou serviço facilita acompanhamento.

![Exemplo de token de plano](/img/plans/tokens.png)

## 8. Os 14 grupos atuais

| Grupo | Descrição | Uso recomendado |
| --- | --- | --- |
| `OpenRouter` | Agregação oficial OpenRouter; suporta Claude, Codex e outras famílias. | Acesso unificado |
| `cc-max` | Canal API oficial Claude Code; prioriza estabilidade. | Claude Code produção |
| `cc_export` | Grupo externo Claude Code sem limite de cliente. | Ferramentas terceiras |
| `cc_max` | Pool Claude MAX autogerenciado. | Claude Code ou plugins oficiais |
| `claudemax_x20` | Grupo oficial ClaudeMax x20. | Equipe ou uso intenso |
| `claudemax_x5` | Grupo oficial ClaudeMax x5. | Uso individual ou leve |
| `codex_plus` | Pool externo Codex Plus. | Código frequente |
| `codex_pro` | Pool externo Codex Pro. | Codex / GPT mais estável |
| `codex_sub` | Pool padrão de assinatura Codex. | Assinatura Codex padrão |
| `codex_sub_june` | Novo pool Codex para GPT-5.x / Codex. | Novos modelos Codex |
| `deepseek` | Canal oficial DeepSeek. | DeepSeek |
| `default` | Grupo geral por saldo. | Testes e uso normal |
| `gemini` | Grupo Gemini multimodal e contexto longo. | Gemini |
| `grok` | Grupo xAI Grok. | Grok |

## 9. Exemplos de multiplicadores

| Consumo base | Multiplicador | Dedução estimada |
| --- | --- | --- |
| 10 créditos | `1x` | 10 créditos |
| 10 créditos | `0.5x` | 5 créditos |
| 10 créditos | `0.1x` | 1 crédito |
| 10 créditos | `2.5x` | 25 créditos |

## 10. Verificar consumo real

![Exemplo de status de grupos](/img/plans/statistics.png)

Use logs e status dos grupos para saber qual grupo consome mais, se só um membro está anormal, se o cache funciona e se o problema vem do pool.

## 11. Seleção rápida

| Cenário | Comece com |
| --- | --- |
| Dúvida inicial | `default` |
| Claude Code estável | `cc-max`, `cc_max`, ClaudeMax |
| Cliente Claude externo | `cc_export` |
| Codex / GPT código | `codex_plus`, `codex_pro`, `codex_sub_june` |
| Várias famílias | `OpenRouter` |
| Gemini | `gemini` |
| Grok | `grok` |
| DeepSeek | `deepseek` |

## 12. Diagnóstico

1. Confirme que o grupo do token inclui o modelo.
2. Verifique saldo, validade, limites e quota total.
3. Filtre logs por horário, modelo, token, grupo ou request ID.
4. Compare [Status de saude dos grupos](/pt/group-health).
5. Para suporte, informe pedido, token, grupo, modelo, horário e request ID.
