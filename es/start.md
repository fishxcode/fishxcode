# Usar FishXCode con Claude  Code

## 1. Obtener una API Key

### Registrarse

Visita [fishxcode.com](https://fishxcode.com/register?aff=9CTW) para crear una cuenta (contraseña 8–20 caracteres, correo electrónico obligatorio).

### Crear un token

Inicia sesión y ve a **Consola → Gestión de tokens → Agregar token**. Al crear:

- En **Grupo de tokens**, selecciona el **canal oficial**. Este grupo incluye `claude-opus-4-5-20251101`, `claude-haiku-4-5-20251001`, `claude-opus-4-6`, `claude-sonnet-4-5-20250929`, `claude-sonnet-4-6`, etc. El modelo se selecciona automáticamente según la complejidad de la tarea.
- Tras la creación, haz clic en el botón de copiar para obtener tu API Key (formato: `sk-xxx`).

### Recargar saldo

| Método | Ruta |
| --- | --- |
| Alipay | Consola → Billetera → Monto → Alipay |
| WeChat Pay | Consola → Billetera → Monto → WeChat |
| Código de canje | Consola → Billetera → Ingresar código → Canjear |

::: tip Multiplicador de tasa
Un grupo etiquetado como `0.5x` significa que obtienes el doble de tokens respecto al precio oficial. Ejemplo: `0.5x` = 10M tokens por ¥1 (frente a 5M al precio oficial).
:::

---

## 2. Preparación del entorno

### Instalar Node.js

Claude  Code se instala via npm. Verifica primero que Node.js esté disponible.

::: code-group

```bash [macOS - Verificar]
node -v
npm -v
```

```bash [macOS - Instalar con Homebrew]
brew install node
```

```bash [Windows - Verificar (CMD/PowerShell)]
node -v
npm -v
```

:::

Si no está instalado, descarga desde [nodejs.org/es/download](https://nodejs.org/es/download). **Windows requiere reiniciar** después de la instalación.

### Solo Windows: instalar Git Bash

Claude  Code requiere un entorno bash. Los usuarios de Windows deben instalar Git Bash:

1. Descarga desde [git-scm.com/download/windows](https://git-scm.com/download/windows) e instala.
2. Verificación: clic derecho en el escritorio — si aparece **Open Git Bash here**, la instalación fue exitosa.

---

## 3. Instalar Claude  Code

::: code-group

```bash [npm]
npm install -g @anthropic-ai/claude-code
```

```bash [pnpm]
pnpm install -g @anthropic-ai/claude-code
```

```bash [yarn]
yarn global add @anthropic-ai/claude-code
```

:::

Verificar la instalación:

```bash
claude --version
```

---

## 4. Configurar FishXCode

### Opción 1: settings.json (Recomendado)

Edita `~/.claude/settings.json` (Windows: `C:\Users\<usuario>\.claude\settings.json`):

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "tu-api-key",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  },
  "permissions": {
    "allow": [
      "Bash",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "Glob(*)",
      "Grep(*)"
    ],
    "deny": []
  }
}
```

Esta configuración es **permanente** — no es necesario definir variables en cada sesión.

### Opción 2: Variables de entorno temporales

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_BASE_URL=https://fishxcode.com/
export ANTHROPIC_AUTH_TOKEN=sk-xxx
```

```powershell [Windows PowerShell (temporal)]
$env:ANTHROPIC_BASE_URL="https://fishxcode.com/"
$env:ANTHROPIC_AUTH_TOKEN="sk-xxx"
```

```cmd [Windows CMD (temporal)]
set ANTHROPIC_BASE_URL=https://fishxcode.com/
set ANTHROPIC_AUTH_TOKEN=sk-xxx
```

:::

Para escribir permanentemente en las variables del sistema Windows, ejecuta en PowerShell:

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

Vuelve a abrir la terminal después de ejecutar estos comandos.

::: warning
Reemplaza `sk-xxx` con tu token real obtenido en la [Consola FishXCode](https://fishxcode.com/console/token).
:::

---

## 5. Iniciar

```bash
cd mi-proyecto
claude
```

---

## 6. Selección de modelo

Escribe `/model` dentro de Claude  Code para cambiar de modelo:

| Opción | Modelo | Notas |
| --- | --- | --- |
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Selección automática según la tarea. Recomendado. |
| **Opus** | `claude-opus-4-5-20251101` | Razonamiento más potente, mayor costo |
| **Haiku** | `claude-haiku-4-5-20251001` | Ligero y rápido |

También puedes fijar un modelo mediante variable de entorno:

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
claude
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_MODEL="claude-sonnet-4-5-20250929"
claude
```

:::

::: tip Actualizar Claude  Code
Si la versión del modelo parece desactualizada, actualiza y reinicia tus herramientas:

```bash
npm install -g @anthropic-ai/claude-code
```

:::

---

## 7. Integración con IDE (IntelliJ IDEA)

**Ruta**: IDEA → Archivo → Configuración → Plugins → Marketplace → buscar `claude code` → instalar **Claude  Code Terminal**.

::: info
Si el plugin no aparece en el Marketplace, tu versión de IDEA es demasiado antigua — actualízala a la última versión.
:::

---

## 8. Solución de problemas

### Error 403

El saldo del token es insuficiente. Recarga en la consola y vuelve a intentarlo.

### Windows: error de conexión o 400/401

Ejecuta estos comandos en PowerShell para escribir variables del sistema permanentes y luego reabre la terminal:

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

### "Unable to connect to Anthropic services"

Error completo:

```
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR_BAD_REQUEST
Please check your internet connection and network settings.
```

Esto ocurre porque Claude  Code no ha completado el onboarding y sigue intentando conectarse a `api.anthropic.com`. **No se necesita VPN.** Abre `~/.claude.json` (el archivo `.claude.json` en tu directorio home — no `.claude/settings.json`) y añade `"hasCompletedOnboarding": true`:

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Añade una coma después del campo anterior antes de agregar la nueva entrada. Reinicia `claude` después de guardar.
:::
