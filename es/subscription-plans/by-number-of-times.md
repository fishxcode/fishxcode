---
title: Planes por número de veces
description: Modelos disponibles, conteo de solicitudes, límites diarios, entrega y regla 2.5x.
---

# Planes por número de veces

El sistema cuenta solicitudes exitosas y aplica límites diarios, mensuales y totales según el plan. El conteo se basa en los logs de la plataforma; normalmente cada log exitoso equivale a una solicitud base.

Ver [planes por número de veces](https://fishxcode.com/pricing?currency=CNY&plan_series=mixed&plan_sort=price_asc&tab=subscription-plans).

## 1. Descripción

- Los beneficios se cuentan por solicitudes exitosas.
- Cada plan tiene conteo total, límite diario, límite mensual u otros límites.
- Los límites reales siguen la página del plan.
- Solo para uso personal.
- No se puede cancelar el límite diario.
- Todos los planes limitan a máximo 10 solicitudes por minuto.
- La página muestra conteo total, límite diario, reinicio, coste por solicitud, precio original y descuento. El límite diario suele reiniciarse a las 08:00 UTC+8.
- Tras la compra puedes crear Keys desde el plan; sus solicitudes cuentan dentro del total, límites diarios/mensuales y límite de frecuencia del plan.

![Ejemplo de compra](/img/plans/subscription-plans.png)

## 2. Modelos disponibles

- `claude-haiku-4-5-20251001`
- `claude-opus-4-5-20251101`
- `claude-opus-4-6`
- `claude-opus-4-7`
- `claude-opus-4-8`
- `claude-sonnet-4-5-20250929`
- `claude-sonnet-4-6`
- `gpt-5.5`

El alcance incluye modelos Claude y Codex correspondientes. La disponibilidad real sigue la página, consola y respuesta de API.

## 3. Reglas de conteo

| Modelo | Método de conteo |
| --- | --- |
| Claude Opus 4.8 | `2.5 × solicitudes exitosas reales` |
| GPT-5.5 | `2.5 × solicitudes exitosas reales` |
| Otros modelos | `1 × solicitudes exitosas reales` |

Ejemplos:

- 1 solicitud exitosa a Claude Opus 4.8 cuenta como 2.5.
- 10 solicitudes exitosas a GPT-5.5 cuentan como 25.
- 10 solicitudes a otros modelos cuentan como 10.

El conteo se basa en logs de plataforma. Un plan de 100 veces equivale a unas 100 solicitudes con otros modelos, o unas 40 solicitudes si todo se usa en Claude Opus 4.8 o GPT-5.5.

## 4. Entrega

- Las tarjetas de día suelen entregarse en 10 minutos.
- Las tarjetas mensuales, por tener mayor beneficio, se envían automáticamente al servidor del proveedor upstream. Tras confirmación, la activación y entrega suelen completarse en 30 minutos.

El tiempo real depende de inventario, confirmación upstream y operación manual.

## 5. Límites diarios y mensuales

Si el plan incluye límites diarios y mensuales, el conteo multiplicado entra en el ciclo correspondiente. Al alcanzar el límite diario, mensual o total, el beneficio se pausa o restringe.

El límite diario no se puede cancelar. Todos los planes tienen máximo 10 solicitudes por minuto.

El límite diario suele reiniciarse a las 08:00 UTC+8. Si hoy alcanzas 500 solicitudes, debes esperar hasta mañana a las 08:00 UTC+8.

Ejemplo: `500/día, 15000/mes, reinicio mensual` significa 500 solicitudes base por día y 15000 totales al mes.

## 6. Precio y coste por solicitud

- Coste original por solicitud = precio original / conteo total.
- Coste con descuento = precio con descuento / conteo total.

Ejemplo: 15000 veces y precio original `¥336.00` da `¥0.0224`; con descuento `¥320.00`, el coste aproximado es `¥0.0213`.

Si usas Claude Opus 4.8 o GPT-5.5, aplica primero el multiplicador 2.5x.

## 7. Antes de comprar

- Conteo total.
- Límites diario y mensual.
- Hora de reinicio, especialmente 08:00 UTC+8.
- Precio original, descuento y coste convertido.
- Si usarás Claude Opus 4.8 o GPT-5.5.
- Si aceptas uso personal, 10 solicitudes/minuto y límite diario no cancelable.
- Si necesitas crear Keys desde el plan.
- Si necesitas factura.

## 8. Upgrade, reembolso y factura

- Tras comprar una tarjeta diaria puedes contactar soporte para subir a cualquier tarjeta mensual.
- Las tarjetas mensuales no se pueden cambiar.
- El reembolso sigue la página del plan, notificaciones y [Política de reembolso](/es/refund).
- Se puede emitir factura.
