# Registro de cuenta

> ¿Ya tienes cuenta? Ve directamente a [Comenzar](/es/start) para configurar tus herramientas.

## 1. Obtener una API Key

### 1. Registrarse

Visita [fishxcode.com](https://fishxcode.com/register?aff=9CTW) y haz clic en **Registrarse**:

![Página de inicio de FishXCode](/img/start/api-01-home.png)

Elige el método de registro (GitHub, LinuxDO o nombre de usuario):

![Selección del método de registro](/img/start/api-02-register.png)

Completa el formulario con nombre de usuario, contraseña y confirmación de contraseña:

![Formulario de registro](/img/start/api-03-register-form.png)

### 2. Iniciar sesión

Una vez registrado, inicia sesión con tu nombre de usuario y contraseña:

![Página de inicio de sesión](/img/start/api-04-login.png)

Tras iniciar sesión, accederás a la consola:

![Página principal de la consola](/img/start/api-05-console.png)

### 3. Crear un token

Ve a **Consola → Gestión de tokens → Agregar token** y rellena el formulario:

![Agregar token](/img/start/api-06-token-create.png)

- En **Grupo de tokens**, se recomienda seleccionar el **canal oficial**. Este grupo incluye `claude-opus-4-5-20251101`, `claude-haiku-4-5-20251001`, `claude-opus-4-6`, `claude-sonnet-4-5-20250929`, `claude-sonnet-4-6`, etc. El modelo se selecciona automáticamente según la complejidad de la tarea, sin necesidad de cambiarlo manualmente.

Una vez creado, haz clic en el botón **Copiar** en la lista de tokens para obtener tu API Key (formato: `sk-xxx`):

![Copiar token](/img/start/api-07-token-copy.png)

### 4. Recargar saldo

Ve a **Consola → Gestión de billetera**. Se admite Alipay, WeChat o código de canje:

![Página de recarga](/img/start/api-08-wallet.png)

| Método | Ruta |
|---|---|
| Alipay | Ingresar/seleccionar monto → Alipay |
| WeChat Pay | Ingresar/seleccionar monto → WeChat |
| Código de canje | Ingresar código en el área de canje → Clic en Canjear saldo |

::: tip Explicación del multiplicador
El `0.5x multiplicador` en el nombre del grupo indica la tasa de consumo. Cuanto menor sea el valor, más tokens obtienes. Por ejemplo, `0.5x` significa que por ¥1 puedes usar 10 millones de tokens oficiales (frente a los 5 millones al precio oficial).
:::
