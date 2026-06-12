---
title: Usar FishXCode con Codex Desktop
description: Instala Codex Desktop, reutiliza la configuración de Codex para FishXCode, inicia sesión e importa el canal con CC Switch.
---

# Usar FishXCode con Codex Desktop

> ¿Primera vez? Completa primero el [registro de cuenta](/es/account) y crea un token disponible en la [consola de FishXCode](https://fishxcode.com/console/token).

## Alcance

Esta guía explica cómo conectar OpenAI Codex Desktop a FishXCode. Para instalar y configurar Codex CLI, consulta [Usar FishXCode con Codex](/es/codex). Codex Desktop debería reutilizar la misma configuración `~/.codex` para no mantener dos configuraciones separadas.

::: tip Ruta recomendada
Crea primero la configuración local de Codex y luego abre Codex Desktop para iniciar sesión. Así la app de escritorio y el CLI usan la misma URL base de FishXCode, el mismo modelo y el mismo token.
:::

## 1. Instalar Codex Desktop

En Windows, abre Microsoft Store, busca `Codex` e instala la aplicación oficial:

![Instalar Codex Desktop desde Microsoft Store](/img/start/codex-desktop/microsoft-store-codex.png)

Después de instalar, configura FishXCode antes de iniciar sesión. Si Microsoft Store no está disponible, usa un canal oficial de OpenAI u otra fuente de software confiable.

## 2. Reutilizar la configuración de Codex para FishXCode

Codex Desktop y Codex CLI deberían usar la misma configuración de usuario. La configuración siguiente coincide con la [guía de Codex CLI](/es/codex).

### 1. Crear el directorio de configuración

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.codex
```

```powershell [Windows PowerShell]
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex"
```

:::

### 2. Escribir `config.toml`

Crea `~/.codex/config.toml` con:

```toml
model_provider = "fishxcode"
model = "gpt-5.4"
review_model = "gpt-5.4"
model_reasoning_effort = "medium"
model_reasoning_summary = "detailed"
disable_response_storage = true
preferred_auth_method = "apikey"
model_verbosity = "high"

[model_providers.fishxcode]
name = "OpenAI using Chat Completions"
base_url = "https://api.fishxcode.com/v1"
wire_api = "responses"
requires_openai_auth = true

[features]
skills = true
image_generation = false

```

::: info
Puedes cambiar `model` y `review_model` por otro modelo disponible en tu plan o grupo. Si tienes dudas, empieza con `gpt-5.4`.
:::

### 3. Escribir `auth.json`

Crea `~/.codex/auth.json` con tu token de FishXCode:

```json
{
  "OPENAI_API_KEY": "your_api_key_here"
}
```

::: warning Atención
`auth.json` contiene tu token secreto. No lo subas a Git ni lo compartas.
:::

## 3. Iniciar sesión en Codex Desktop

Abre Codex Desktop. Si aparece la pantalla de inicio de sesión, elige **Usar otro método de inicio de sesión**:

![Elegir otro método de inicio de sesión](/img/start/codex-desktop/codex-login-options.png)

Pega el token copiado desde la consola de FishXCode. Si ya escribiste `~/.codex/auth.json` pero Codex sigue pidiendo inicio de sesión, pega el mismo token aquí.

Para copiar un token, búscalo en la página de tokens de FishXCode y usa el botón de copia junto a la clave. Esta guía no muestra el menú de copia en capturas para evitar exponer detalles innecesarios de la clave.

Después de iniciar sesión, selecciona la carpeta del proyecto donde Codex debe trabajar.

## 4. Opcional: gestionar canales con CC Switch

Usa CC Switch si mantienes varios canales de Codex. Si FishXCode es tu único canal, normalmente basta con un solo `~/.codex/config.toml`.

En la página de tokens de FishXCode, encuentra el token objetivo y haz clic en **Importar** en la fila del grupo `codex_sub_june`:

![Importar el grupo Codex desde FishXCode](/img/start/codex-desktop/cc-switch-import-channel.png)

En el cuadro de importación de CC Switch, mantén estos valores principales:

| Campo | Valor FishXCode |
| --- | --- |
| Endpoint API | `https://api.fishxcode.com/v1` |
| API Key | Token de FishXCode |
| Modelo principal | `gpt-5.4` u otro modelo disponible en tu plan |

Cambia el modelo principal a `gpt-5.4`, haz clic en **Probar** e importa solo después de ver que la prueba de conectividad del modelo fue correcta:

![Probar gpt-5.4 en el cuadro de importación de CC Switch](/img/start/codex-desktop/cc-switch-select-model.png)

Cuando el navegador abra CC Switch, revisa el endpoint API, el modelo y la nota, y luego haz clic en **Importar**:

![Confirmar la importación de Codex con FishXCode](/img/start/codex-desktop/cc-switch-import-success.png)

Tras importar, confirma que CC Switch esté usando el canal FishXCode y reinicia Codex Desktop.

## 5. Controles comunes

### Modelo, esfuerzo de razonamiento y permisos

Codex Desktop suele mostrar el modelo, el esfuerzo de razonamiento, el modo de permisos y la carpeta de trabajo cerca del cuadro de entrada:

![Controles de conversación de Codex Desktop](/img/start/codex-desktop/codex-dialog-options.png)

Valores recomendados:

- Modelo: elige un modelo de FishXCode, por ejemplo `gpt-5.4`
- Esfuerzo de razonamiento: usa nivel medio para trabajo diario y uno más alto solo en tareas complejas
- Permisos: usa acceso completo para ediciones frecuentes; usa aprobación manual al explorar un proyecto desconocido
- Carpeta de trabajo: elige el proyecto que Codex debe analizar o modificar

### `/` y `@`

Dos accesos directos útiles en el cuadro de entrada:

| Símbolo | Uso |
| --- | --- |
| `/` | Abrir comandos o la lista de Skills |
| `@` | Referenciar un archivo o directorio del proyecto actual |

Si el menú no se abre, comprueba que haya un espacio antes de `/` o `@` y que el foco esté dentro de Codex Desktop.

### Modo Plan

Para tareas complejas, empieza con el modo Plan. Codex divide el trabajo, hace preguntas de aclaración y espera tu confirmación antes de editar.

![Entrar en modo Plan](/img/start/codex-desktop/codex-plan-mode.png)

Cuando Codex haga preguntas de aclaración, elige la opción que coincida con tu intención:

![Responder preguntas de aclaración](/img/start/codex-desktop/codex-clarify-question.png)

Después de revisar el plan, deja que Codex lo ejecute y supervisa el alcance de los cambios:

![Ejecutar y seguir el plan](/img/start/codex-desktop/codex-execute-plan.png)

## 6. Preguntas frecuentes

### ¿Las solicitudes todavía no pasan por FishXCode después de iniciar sesión?

Comprueba en orden:

1. Existe `~/.codex/config.toml`
2. `model_provider` es `fishxcode`
3. `base_url` es `https://api.fishxcode.com/v1`
4. `~/.codex/auth.json` contiene el token de FishXCode
5. Codex Desktop se cerró por completo y se volvió a abrir después de cambiar la configuración

### ¿Error 401 o 403?

Comprueba que el token esté copiado completo, esté habilitado, tenga saldo suficiente y pueda acceder al modelo seleccionado.

### ¿El modelo mostrado no es el esperado?

Revisa `model` en `config.toml` y luego el selector de modelo de Codex Desktop. Si usas CC Switch, confirma también que el canal actual sea FishXCode.

### ¿Aparece un mensaje de CC Switch no configurado?

Si usas CC Switch y ves un mensaje similar, el canal actual no está configurado correctamente:

![CC Switch no configurado](/img/start/codex-desktop/cc-switch-not-configured.png)

Sigue este orden:

1. Cierra Codex Desktop por completo, incluido el proceso de la bandeja
2. Abre CC Switch y cambia al canal FishXCode
3. Vuelve a abrir Codex Desktop

Si no usas CC Switch, vuelve al paso 2 y revisa `~/.codex/config.toml` y `~/.codex/auth.json`.
