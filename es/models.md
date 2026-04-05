# Modelos compatibles

FishXCode es compatible con una variedad de modelos de IA de multiples proveedores, cubriendo diferentes casos de uso y cadenas de herramientas. Puedes elegir y cambiar de modelo libremente segun tus necesidades.

<DynamicModelList />

## Cambiar de modelo

### Claude Code

Configura el modelo principal mediante variables de entorno:

::: code-group

```bash [Linux/macOS]
export ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
claude
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929"
claude
```

:::

### Codex

Edita `~/.codex/config.toml` y cambia el campo `model`:

```toml
model = "gpt-5"
```

### RooCode / Qwen Code

Cambia el campo **Model** directamente en la configuracion del proveedor. Se puede usar cualquier ID de modelo compatible de la lista anterior.

## Recomendaciones

::: tip Mejor para codificacion
**claude-sonnet-4-5-20250929** — La mayor capacidad de codificacion general, ideal para proyectos complejos y tareas de arquitectura.
:::

::: tip Mejor velocidad
**claude-3-5-haiku-20241022** — Tiempo de respuesta mas rapido, ideal para llamadas frecuentes y completaciones en tiempo real.
:::

::: tip Mejor equilibrio
**claude-haiku-4-5-20251001** — Excelente equilibrio entre velocidad y calidad, adecuado para la mayoria de las tareas de desarrollo diarias.
:::
