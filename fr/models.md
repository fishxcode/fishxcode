# Modeles supportes

FishXCode prend en charge une variete de modeles d'IA de plusieurs fournisseurs, couvrant differents cas d'utilisation et chaines d'outils. Vous pouvez librement choisir et changer de modele selon vos besoins.

<DynamicModelList />

## Changer de modele

### Claude Code

Definissez le modele principal via les variables d'environnement :

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

Modifiez le fichier `~/.codex/config.toml` et changez le champ `model` :

```toml
model = "gpt-5"
```

### RooCode / Qwen Code

Modifiez le champ **Model** directement dans la configuration du fournisseur. Tout identifiant de modele compatible liste ci-dessus peut etre utilise.

## Recommandations

::: tip Meilleur pour le codage
**claude-sonnet-4-5-20250929** — Capacite de codage globale la plus forte, ideal pour les projets complexes et les taches d'architecture.
:::

::: tip Meilleur pour la vitesse
**claude-3-5-haiku-20241022** — Temps de reponse le plus rapide, ideal pour les appels frequents et les completions en temps reel.
:::

::: tip Meilleur equilibre
**claude-haiku-4-5-20251001** — Excellent equilibre entre vitesse et qualite, adapte a la plupart des taches de developpement quotidiennes.
:::
