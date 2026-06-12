---
title: Planes Codex
description: Planes Codex de FishXCode con crédito, validez, compra, renovación, claves y métricas de equipo.
---

# Planes Codex

Los planes Codex se gestionan por **crédito + periodo de validez**. Tras la compra, el sistema genera automáticamente una clave de acceso de suscripción. Puedes usarla directamente o crear claves secundarias desde el plan para equipos u otros usuarios.

Ver [planes Codex](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex).

## 1. Descripción

- Incluye crédito disponible y periodo de validez.
- Al vencer, los beneficios dejan de estar disponibles.
- El reinicio diario, semanal, mensual o personalizado depende de la configuración. En algunos casos se puede cancelar el límite diario en gestión del plan para consumir crédito total.
- Admite gestión de equipo y uso multiusuario. Diferentes créditos se adaptan a distintos tamaños e intensidades de equipo.
- Las llamadas con claves creadas desde el plan consumen el mismo crédito total.
- Se puede emitir factura.

## 2. Facturación

- **Crédito del plan**: crédito total o periódico disponible.
- **Validez**: límite mensual, semanal, diario u otro.
- **Reinicio**: sin reinicio o por día, semana, mes o ciclo personalizado.
- **Alcance**: modelos, grupos y tipos de API disponibles siguen la página del plan.
- **Consumo de claves**: la clave generada y las claves de equipo consumen el crédito del plan.

## 3. Antes de comprar

- Validez del plan.
- Crédito total y periódico.
- Si el modelo usado está incluido.
- Beneficios, modelos, grupos, reinicio y soporte.
- Si el crédito se ajusta al tamaño del equipo y uso esperado.
- Si necesitas claves separadas para miembros o servicios, con límite de crédito y vencimiento.

## 4. Compra y renovación

[Planes Codex](https://fishxcode.com/pricing?currency=CNY&tab=subscription-plans&plan_series=codex)

Puedes comprar desde la lista o detalle de gestión de planes. Confirma beneficios, validez, crédito, horario de compra, pago y notas antes de pagar.

![Ejemplo de compra de suscripción](/img/plans/buyplan.png)

La renovación requiere que el plan siga vigente, no esté retirado, tenga renovación habilitada y esté dentro de la ventana permitida. Normalmente se puede renovar dentro de los 3 días antes del vencimiento. Tras vencer, las claves no están disponibles y debes recomprar o contactar soporte.

## 5. Código de descuento

Si tienes un código de descuento, introdúcelo y valídalo al comprar. Solo aplica si la validación pasa y el método de pago lo admite. El importe final sigue la página de compra.

## 6. Clave automática tras el pago

Tras pagar, el sistema crea una clave en [Consola -> Gestión de tokens](https://fishxcode.com/console/token). Prefijo:

```text
Subscription Access - plan id
```

La clave se vincula al plan y hereda crédito, validez, grupos, límites de modelo y reglas.

![Ejemplo de clave de suscripción](/img/plans/tokens.png)

## 7. Crear claves de equipo

El comprador puede crear nuevas claves desde el plan en [Consola -> Gestión de tokens](https://fishxcode.com/console/token) para miembros, servicios o proyectos.

- **Crear desde plan**: selecciona el plan.
- **Nombre**: distingue miembro, proyecto o servicio.
- **Grupo de clave**: usa el grupo por defecto o elige otro.
- **Vencimiento**: controla hasta cuándo se puede usar.
- **Cantidad**: al crear en lote se añaden sufijos aleatorios.
- **Crédito de clave**: limita el crédito máximo que consume esa clave.

El consumo de claves de equipo entra en el crédito total del plan original.

![Ejemplo de crear clave desde plan](/img/plans/create.png)

## 8. Logs y métricas de equipo

Los registros se consultan en [Consola -> Logs de uso](https://fishxcode.com/console/log). Para una solicitud concreta, filtra por hora, modelo, token, grupo, ID o estado. Consulta [Registros de error](/es/error-logs).

Las métricas de equipo están en **Logs de uso -> Estado de salud de grupos**, con solicitudes, tasa de éxito, consumo, caché, latencia media y última solicitud por grupo, usuario y clave. Consulta [Estado de salud de grupos](/es/group-health).

![Ejemplo de estado de salud](/img/plans/statistics.png)

## 9. Vencimiento y límites

Tras vencer, la clave automática y las claves de equipo dejan de estar disponibles.

Al alcanzar un límite periódico, puedes cancelar el límite del plan en la gestión para seguir consumiendo crédito total, si la página lo permite.

Si el crédito total se consume, contáctanos para una renovación directa y conservar el plan y claves originales. Esto evita generar una nueva Key y reduce cambios en equipos, servicios y clientes.

## 10. Reembolsos

Las reglas siguen la página de compra, descripción del plan y [Política de reembolso](/es/refund). Para problemas de entrega, claves o crédito, proporciona pedido, plan, clave, hora de solicitud e ID de solicitud.
