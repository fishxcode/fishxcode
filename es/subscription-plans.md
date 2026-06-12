---
title: Planes de suscripción de FishXCode
description: Entradas, categorías y reglas de facturación de los planes de suscripción de FishXCode.
---

# Planes de suscripción de FishXCode

Esta página resume las entradas, categorías y reglas de facturación de los planes de suscripción de FishXCode. Los precios, inventario, límites de compra, periodos de validez y límites periódicos se rigen por la página de precios.

Entradas comunes:

- [Todos los planes de suscripción](https://fishxcode.com/pricing?currency=CNY&plan_series=all&tab=subscription-plans)
- [Planes Claude](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans)
- [Planes Codex](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex)
- [Planes por número de veces](https://fishxcode.com/pricing?currency=CNY&plan_series=mixed&plan_sort=price_asc&tab=subscription-plans)
- [Reglas de facturación y grupos](/es/billing-groups)

## 1. Categorías

| Serie | Entrada | Descripción |
| --- | --- | --- |
| Claude | [Planes Claude](/es/subscription-plans/claude) | Suscripción de cuenta oficial ClaudeMax y servicio alojado de Claude Code |
| Codex | [Planes Codex](/es/subscription-plans/codex) | Gestionados por crédito y periodo de validez, para uso individual o de equipo |
| Por número de veces | [Planes por número de veces](/es/subscription-plans/by-number-of-times) | Acumulan solicitudes exitosas y admiten modelos Claude y Codex relacionados |

## 2. Resumen de reglas

- Los planes Claude son suscripciones de cuenta oficial. Consulta [Planes Claude](/es/subscription-plans/claude).
- Los planes Codex se basan en crédito + periodo de validez; no son simples paquetes por solicitud.
- Los planes por número de veces cuentan solicitudes exitosas. Los límites diarios, mensuales y totales dependen de la configuración del plan, y se pueden usar con los modelos Claude y Codex correspondientes.
- Claude Opus 4.8 y GPT-5.5 cuentan como `2.5 × solicitudes exitosas reales`.
- Para entender cómo se relacionan precios de modelos, grupos de tokens, multiplicadores y alcance del plan, consulta [Reglas de facturación y grupos](/es/billing-groups).

## 3. Flujo de compra

1. Abre la [página de precios](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans).
2. Cambia a “Planes de suscripción”.
3. Filtra por Claude, Codex o planes por número de veces.
4. Revisa precio, validez, crédito, número de solicitudes, modelos aplicables, reglas de reinicio y restricciones.
5. Tras el pago, revisa el estado en la página de planes o suscripciones de la consola.
6. Si el plan genera una Key independiente, copia el Base URL y la Key según las instrucciones y configúralos en la herramienta correspondiente.

## 4. Notas

### Los precios siguen la página de precios

Los precios, inventario, límites, descuentos y disponibilidad pueden cambiar. Este documento explica reglas; el precio exacto sigue la página oficial.

### No todos los modelos cuestan 1 vez

Los planes por número de veces usan solicitudes exitosas como unidad base. Claude Opus 4.8 y GPT-5.5 cuentan como `2.5 × solicitudes exitosas reales`.

### Codex frente a planes por número de veces

Codex se centra en crédito y validez. Los planes por número de veces se centran en solicitudes, límites diarios, mensuales y totales.

### Vencimiento, consumo o límite alcanzado

Al llegar a la validez, crédito total, conteo total, límite diario o límite mensual, el sistema restringe el uso según las reglas del plan. Puedes esperar el reinicio del ciclo, comprar un nuevo plan o usar saldo.

### Problemas de uso

Primero confirma la validez del plan, los límites diarios o mensuales y los modelos aplicables. Después revisa [Registros de error](/es/error-logs) y [Estado de salud de grupos](/es/group-health). Al contactar soporte, proporciona número de pedido, hora de solicitud e ID de solicitud.
