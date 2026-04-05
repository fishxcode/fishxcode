# 支持的模型

FishXCode 平台支持来自多个供应商的 AI 模型，覆盖不同的使用场景和工具链。你可以根据实际需求自由选择和切换模型。

<DynamicModelList />

## 切换模型

### Claude Code

通过环境变量设置主模型：

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

编辑 `~/.codex/config.toml`，修改 `model` 字段：

```toml
model = "gpt-5"
```

### RooCode / Qwen Code

在提供商配置中直接修改 **Model** 字段即可。支持填写上述任何兼容模型的 ID。

## 模型推荐

::: tip 最佳编码能力
**claude-sonnet-4-5-20250929** — 综合编码能力最强，适合复杂项目和架构级任务。
:::

::: tip 最佳响应速度
**claude-3-5-haiku-20241022** — 响应速度最快，适合高频调用和实时补全场景。
:::

::: tip 最佳性价比
**claude-haiku-4-5-20251001** — 在速度和质量之间取得良好平衡，适合大多数日常开发任务。
:::
