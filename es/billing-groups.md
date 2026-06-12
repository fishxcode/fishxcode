---
title: Reglas de facturación y resumen de grupos
description: Unidades de facturación de FishXCode, multiplicadores, grupos de tokens, uso por saldo y relación con planes.
---

# Reglas de facturación y resumen de grupos

Esta página explica cómo se relacionan la facturación de FishXCode, los grupos de tokens y los planes de suscripción. Úsala como lista de revisión antes de comprar o crear una clave: revisa precios y alcance del plan, elige el grupo correcto y confirma el consumo real en logs y estado de grupos.

::: tip Alcance actual
La página de precios actual tiene **49 modelos y 14 grupos seleccionables**. Modelos, precios, grupos y disponibilidad pueden cambiar; la [página de precios](https://fishxcode.com/pricing?currency=CNY) y la consola son la referencia.
:::

## Mapa de capturas

| Captura | Qué explica |
| --- | --- |
| Lista de planes | Campos del plan que afectan la facturación |
| Beneficios por número de veces | Límite diario, total, reinicio y modelos |
| Diálogo de compra | Qué revisar antes de pagar |
| Crear token | Cómo se vincula un grupo a una API key |
| Crear token desde plan | Cómo repartir cuota de plan en un equipo |
| Lista de tokens | Grupo, multiplicador, modelos y vencimiento |
| Estado de grupos | Coste, caché y alcance de incidentes |

## 1. Tres entradas de facturación

| Entrada | Qué mirar | Uso |
| --- | --- | --- |
| Uso por saldo | Precio base, entrada/salida/caché, grupo | Llamadas con saldo, pruebas, modelos mixtos |
| Planes | Validez, cuota total, límites día/mes, grupo aplicable | Presupuesto de equipo y uso Codex / Claude sostenido |
| Grupos de tokens | Modelos disponibles, pool y multiplicador | Crear keys, separar proyectos, atribuir costes |

Léelo junto con [Planes de suscripción](/es/subscription-plans): esta página explica precios, multiplicadores y grupos; la página de planes explica cuota comprada, validez, conteo y límites.

## 2. Página de precios: lee primero las tarjetas

![Ejemplo de lista de planes](/img/plans/subscription-plans.png)

| Campo | Significado | Cómo leerlo |
| --- | --- | --- |
| Precio actual | Precio y validez | `¥320.00 / 1 mes` |
| Coste por solicitud | Precio dividido por total | Comparar planes similares |
| Límite del plan | Cuota o número total | `15000 solicitudes` es el total |
| Límite diario | Uso máximo por día | `500/día` suele bloquear hasta reinicio |
| Reinicio | Cuándo se recupera el límite | Por ejemplo 08:00 diario |
| Alcance | Grupo, modelos, proveedores | Ejemplo: `sub_plan_claude_mini_plus` |
| Conversión | Modelos que cuentan más | Claude Opus 4.8 / GPT-5.5 pueden contar `2.5 × 1 solicitud` |

::: tip Ejemplo
Con `500/día, 15000/mes` y regla `2.5 × 1 solicitud`, los modelos normales suelen contar 1. Claude Opus 4.8 o GPT-5.5 cuentan 2.5; unas 200 solicitudes exitosas pueden alcanzar el límite diario de 500.
:::

## 3. Beneficios del plan

![Ejemplo de beneficios por número de veces](/img/plans/by-number-of-times.png)

Revisa límite diario, límite total, reinicio, ventana de compra, proveedores, modelos disponibles y grupo de actualización que se aplica tras comprar.

## 4. Compra: confirma antes de pagar

![Ejemplo de compra de suscripción](/img/plans/buyplan.png)

Confirma precio, validez, cuota o número de solicitudes, tipo de plan, método de pago y notas de compra. Reembolsos, entrega y soporte siguen lo indicado en la página.

## 5. Uso por saldo

El uso por saldo consume directamente el saldo de la cuenta sin comprar un plan fijo. Sirve para pruebas, uso poco frecuente, experimentos con varios modelos o antes de decidir qué plan comprar.

1. Comprueba en la [página de precios](https://fishxcode.com/pricing?currency=CNY) qué grupos soportan el modelo.
2. Crea un token normal en **Consola -> Gestión de tokens**.
3. Configura la clave en tu herramienta o código.
4. Cada solicitud exitosa descuenta saldo según precio del modelo, tokens entrada/salida, caché y multiplicador.
5. Verifica el consumo en **Consola -> Logs de uso**.

```text
Consumo estimado ~= consumo base del modelo × multiplicador del grupo + diferencias de salida/caché
```

| Tipo | Comportamiento | Uso |
| --- | --- | --- |
| Saldo por uso | Descuenta al usar; se detiene si no hay saldo | Pruebas y modelos mixtos |
| Planes Codex | Validez y cuota | Equipos Codex / GPT |
| Planes por número de veces | Solicitudes exitosas y límites | Presupuesto fijo por solicitudes |
| Planes ClaudeMax | Beneficios de cuenta y flujo Claude Code | Claude Code oficial |

## 6. Grupos de tokens

Un grupo define **modelos disponibles, multiplicador y pool upstream** para la API key.

![Selección de grupo al crear token](/img/start/api-06-token-create.png)

Si el grupo es incorrecto, pueden aparecer `model not found`, `model not available`, errores de permiso, coste inesperado o confusión entre saldo y plan.

## 7. Tokens de plan para equipos

![Crear token desde plan](/img/plans/create.png)

| Campo | Significado |
| --- | --- |
| Crear desde plan | Vincula el token a un plan; vencimiento, grupo y modelos siguen el plan |
| Nombre | Usa miembro, proyecto o servicio |
| Grupo | Normalmente sigue el plan o el grupo de usuario |
| Vencimiento | No debería superar la validez del plan |
| Cuota del token | Limita cuánto puede consumir esta clave |

Crear un token por miembro o servicio facilita el seguimiento.

![Ejemplo de token de plan](/img/plans/tokens.png)

## 8. Los 14 grupos actuales

| Grupo | Descripción | Uso recomendado |
| --- | --- | --- |
| `OpenRouter` | Agregación oficial OpenRouter; soporta Claude, Codex y otras familias. | Acceso unificado |
| `cc-max` | Canal API oficial Claude Code; prioriza estabilidad. | Claude Code producción |
| `cc_export` | Grupo externo Claude Code sin límite de cliente. | Herramientas terceras |
| `cc_max` | Pool Claude MAX autogestionado. | Claude Code o plugins oficiales |
| `claudemax_x20` | Grupo oficial ClaudeMax x20. | Equipo o uso intensivo |
| `claudemax_x5` | Grupo oficial ClaudeMax x5. | Uso individual o ligero |
| `codex_plus` | Pool externo Codex Plus. | Código frecuente |
| `codex_pro` | Pool externo Codex Pro. | Codex / GPT más estable |
| `codex_sub` | Pool estándar de suscripción Codex. | Suscripción Codex estándar |
| `codex_sub_june` | Nuevo pool Codex para GPT-5.x / Codex. | Nuevos modelos Codex |
| `deepseek` | Canal oficial DeepSeek. | DeepSeek |
| `default` | Grupo general por saldo. | Pruebas y uso normal |
| `gemini` | Grupo Gemini multimodal y contexto largo. | Gemini |
| `grok` | Grupo xAI Grok. | Grok |

## 9. Ejemplos de multiplicadores

| Consumo base | Multiplicador | Deducción estimada |
| --- | --- | --- |
| 10 créditos | `1x` | 10 créditos |
| 10 créditos | `0.5x` | 5 créditos |
| 10 créditos | `0.1x` | 1 crédito |
| 10 créditos | `2.5x` | 25 créditos |

## 10. Verificar consumo real

![Ejemplo de estado de grupos](/img/plans/statistics.png)

Usa logs y estado de grupos para saber qué grupo consume más, si solo un miembro está anómalo, si la caché funciona y si el problema viene del pool.

## 11. Selección rápida

| Escenario | Empieza con |
| --- | --- |
| Duda inicial | `default` |
| Claude Code estable | `cc-max`, `cc_max`, ClaudeMax |
| Cliente Claude externo | `cc_export` |
| Codex / GPT código | `codex_plus`, `codex_pro`, `codex_sub_june` |
| Varias familias | `OpenRouter` |
| Gemini | `gemini` |
| Grok | `grok` |
| DeepSeek | `deepseek` |

## 12. Diagnóstico

1. Confirma que el grupo del token incluye el modelo.
2. Revisa saldo, validez, límites y cuota total.
3. Filtra logs por hora, modelo, token, grupo o request ID.
4. Compara [Estado de salud de grupos](/es/group-health).
5. Para soporte, proporciona pedido, token, grupo, modelo, hora y request ID.
