# Comparacion de herramientas

Elige la herramienta de codificacion con IA que mejor se adapte a tu flujo de trabajo. A continuacion, una comparacion completa de todas las herramientas disponibles en la plataforma FishXCode.

## Informacion basica

| Herramienta | Desarrollador | Tipo |
|-------------|---------------|------|
| **Claude Code** | Anthropic | Herramienta CLI de terminal |
| **OpenAI Codex** | OpenAI | CLI + Extension VSCode |
| **Gemini CLI** | Google | Herramienta CLI de terminal |
| **RooCode** | Roo Veterinary | Extension VSCode |
| **Qwen Code** | Alibaba | Herramienta CLI de terminal |
| **Droid CLI** | Factory AI | Herramienta CLI de terminal |
| **OpenCode** | OpenCode AI | Herramienta CLI de terminal (TUI) |

## Soporte de plataformas

| Herramienta | macOS | Windows | Linux |
|-------------|:-----:|:-------:|:-----:|
| **Claude Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Gemini CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **RooCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Droid CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |

## Integracion con IDE

| Herramienta | Terminal | VSCode | Otros IDE |
|-------------|:-------:|:------:|:---------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | - |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | :white_check_mark: | - |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | :white_check_mark: | - | - |
| **OpenCode** | :white_check_mark: | - | - |

## Metodo de configuracion

| Herramienta | Variables de entorno | Archivos de config | Configuracion grafica |
|-------------|:--------------------:|:------------------:|:---------------------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | TOML + JSON | Ajustes de VSCode |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | - | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | - | JSON | CLI interactivo |
| **OpenCode** | :white_check_mark: | JSON | TUI interactivo |

## Compatibilidad con FishXCode

| Herramienta | Estado | Dificultad | Notas |
|-------------|:------:|:----------:|-------|
| **Claude Code** | :white_check_mark: Compatible | Facil | Variables de entorno |
| **OpenAI Codex** | :white_check_mark: Compatible | Media | Requiere archivos TOML y JSON |
| **Gemini CLI** | :x: No compatible | - | Sin soporte de enrutamiento personalizado |
| **RooCode** | :white_check_mark: Compatible | Facil | Configuracion del proveedor via GUI |
| **Qwen Code** | :white_check_mark: Compatible | Facil | Variables de entorno |
| **Droid CLI** | :white_check_mark: Compatible | Media | Requiere editar archivo JSON |
| **OpenCode** | :white_check_mark: Compatible | Media | Requiere editar archivo JSON |

::: warning Gemini CLI no compatible por ahora
Gemini CLI actualmente no soporta enrutamiento de API personalizado, lo que lo hace incompatible con FishXCode. Si buscas una alternativa, consulta las demas herramientas compatibles listadas arriba.
:::

## Caracteristicas principales

| Herramienta | Puntos destacados |
|-------------|-------------------|
| **Claude Code** | Comprension y generacion de codigo avanzadas, experiencia nativa en terminal, cambio entre multiples modelos |
| **OpenAI Codex** | Doble modo CLI y VSCode, soporte de modelos GPT, ecosistema maduro |
| **Gemini CLI** | Impulsado por Google AI, integracion profunda con el ecosistema de Google |
| **RooCode** | Experiencia 100% grafica en VSCode, protocolo OpenAI Compatible, sin barrera de terminal |
| **Qwen Code** | Respaldado por los modelos Qwen de Alibaba, optimizado para escenarios multilingues, ligero |
| **Droid CLI** | Soporte flexible de modelos personalizados, ventanas de contexto extra grandes, enfocado en terminal |
| **OpenCode** | Interfaz TUI de codigo abierto, soporte de 75+ modelos, agentes build/plan integrados, integracion con GitHub Copilot |

## Como elegir

::: tip Flujo de trabajo en terminal
Si prefieres trabajar completamente en la terminal, elige **Claude Code** o **OpenAI Codex**. Ambos ofrecen una experiencia fluida en linea de comandos. Claude Code tiene la configuracion mas simple, mientras que Codex tambien ofrece una extension para VSCode.
:::

::: tip Integracion con VSCode
Si prefieres una experiencia grafica en tu IDE, elige **RooCode** o **OpenAI Codex**. RooCode ofrece una experiencia puramente grafica con configuracion sencilla, mientras que Codex combina terminal y editor.
:::

::: tip Configuracion mas rapida
Si quieres empezar lo antes posible, elige **Claude Code**, **RooCode** o **Qwen Code**. Los tres pueden configurarse y estar operativos en pocos minutos.
:::

::: tip Maxima personalizacion
Si necesitas una configuracion de modelos flexible y soporte de contexto extra grande, prueba **Droid CLI**. Soporta parametros de modelos personalizados con ventanas de contexto de hasta 1,28 millones de tokens.
:::

::: tip Desarrollo multilingue
Si tus proyectos incluyen documentacion o comentarios en chino, **Qwen Code** ofrece la mejor comprension y generacion para escenarios de codigo en idioma chino.
:::
