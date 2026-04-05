# Modelos suportados

O FishXCode oferece suporte a uma variedade de modelos de IA de diversos provedores, cobrindo diferentes casos de uso e cadeias de ferramentas. Voce pode escolher e trocar de modelo livremente conforme suas necessidades.

<DynamicModelList />

## Trocar de modelo

### Claude Code

Defina o modelo principal atraves de variaveis de ambiente:

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

Edite o arquivo `~/.codex/config.toml` e altere o campo `model`:

```toml
model = "gpt-5"
```

### RooCode / Qwen Code

Altere o campo **Model** diretamente na configuracao do provedor. Qualquer ID de modelo compativel listado acima pode ser utilizado.

## Recomendacoes

::: tip Melhor para codificacao
**claude-sonnet-4-5-20250929** — Maior capacidade geral de codificacao, ideal para projetos complexos e tarefas de arquitetura.
:::

::: tip Melhor velocidade
**claude-3-5-haiku-20241022** — Tempo de resposta mais rapido, ideal para chamadas frequentes e completacoes em tempo real.
:::

::: tip Melhor equilibrio
**claude-haiku-4-5-20251001** — Excelente equilibrio entre velocidade e qualidade, adequado para a maioria das tarefas de desenvolvimento diarias.
:::
