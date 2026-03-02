# Usar FishXCode con Claude  Code

> ¿Primera vez? Primero completa el [Registro de cuenta](/es/account).

## 1. Preparación del entorno

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

1. Descarga desde [git-scm.com/download/windows](https://git-scm.com/download/windows) e instala la versión correspondiente.
2. Verificación: clic derecho en el escritorio — si aparece **Open Git Bash here**, la instalación fue exitosa.

---

## 2. Instalar Claude  Code

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

## 3. Configurar FishXCode

### Opción 1: settings.json (Recomendado)

Edita `~/.claude/settings.json` (Windows: `C:\Users\<usuario>\.claude\settings.json`) con el siguiente contenido:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "reemplaza con tu API Key",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  },
  "permissions": {
    "allow": [
      "Bash",
      "LS(*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "MultiEdit(*)",
      "Glob(*)",
      "Grep(*)",
      "Task(*)",
      "WebFetch(domain:*)",
      "WebSearch",
      "TodoWrite(*)",
      "NotebookRead(*)",
      "NotebookEdit(*)"
    ],
    "defaultMode": "bypassPermissions",
    "deny": []
  },
}
```

Esta configuración es **permanente** — no es necesario definir variables de entorno en cada sesión.

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

## 4. Iniciar

```bash
cd mi-proyecto
claude
```

---

## 5. Selección de modelo

Escribe `/model` dentro de Claude  Code para cambiar de modelo:

| Opción | Modelo real | Notas |
|---|---|---|
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Selección automática según la tarea. Recomendado para uso diario. |
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
Si la versión del modelo parece desactualizada, ejecuta el comando de actualización y reinicia tus herramientas:
```bash
npm install -g @anthropic-ai/claude-code
```
:::

---

## 6. Integración con IDE

### IntelliJ IDEA

Ruta: Archivo → Configuración → Plugins → Marketplace → buscar `claude code` → encontrar **Claude  Code Terminal** e instalar:

![Instalar Claude  Code Terminal](/img/start/idea-01-install.png)

Reinicia IDEA tras la instalación y verifica que el plugin se haya cargado:

![Verificar que el plugin está cargado](/img/start/idea-02-verify.png)

::: info
Si el plugin no aparece en el Marketplace, tu versión de IDEA es demasiado antigua — actualízala a la última versión.
:::

### VSCode

Presiona `Ctrl + Shift + X` para abrir el panel de extensiones, busca `claude code` y encuentra **Claude  Code for VSCode** para instalar.

![Buscar e instalar el plugin de Claude  Code](/img/start/vscode-01-install.png)

Una vez instalado, el plugin ofrece tres métodos de conexión:

![Métodos de conexión del plugin Claude  Code](/img/start/vscode-02-login.png)

Se recomienda conectar FishXCode mediante `settings.json`. Haz clic en el **icono de engranaje** en la esquina inferior derecha del plugin → **Editar en settings.json**:

![Abrir settings.json para editar](/img/start/vscode-03-settings.png)

Añade lo siguiente en el `settings.json` de VSCode:

```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "reemplaza con tu API Key" },
    { "name": "ANTHROPIC_BASE_URL", "value": "https://fishxcode.com/" }
  ]
}
```

![Ejemplo de configuración en settings.json](/img/start/vscode-04-config.png)

Tras guardar, **cierra y vuelve a abrir VSCode**; el plugin se conectará correctamente a FishXCode.

![Usando Claude  Code en VSCode](/img/start/vscode-05-demo.gif)

---

## 7. Preguntas frecuentes

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

Esto ocurre porque Claude  Code no ha completado el onboarding y sigue intentando conectarse a `api.anthropic.com`. **No se necesita VPN.** Abre `~/.claude.json` (el archivo `.claude.json` en tu directorio home — no `.claude/settings.json`) y añade `"hasCompletedOnboarding": true` al final:

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Añade una coma después del campo anterior antes de agregar la nueva entrada (requisito de sintaxis JSON). Reinicia `claude` después de guardar.
:::
