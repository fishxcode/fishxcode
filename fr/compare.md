# Comparaison des outils

Choisissez l'outil de codage IA adapte a votre flux de travail. Voici une comparaison complete de tous les outils disponibles sur la plateforme FishXCode.

## Informations generales

| Outil | Developpeur | Type |
|-------|-------------|------|
| **Claude Code** | Anthropic | Outil CLI en terminal |
| **OpenAI Codex** | OpenAI | CLI + Extension VSCode |
| **Gemini CLI** | Google | Outil CLI en terminal |
| **RooCode** | Roo Veterinary | Extension VSCode |
| **Qwen Code** | Alibaba | Outil CLI en terminal |
| **Droid CLI** | Factory AI | Outil CLI en terminal |
| **OpenCode** | OpenCode AI | Outil CLI en terminal (TUI) |

## Support des plateformes

| Outil | macOS | Windows | Linux |
|-------|:-----:|:-------:|:-----:|
| **Claude Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Gemini CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **RooCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Droid CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |

## Integration IDE

| Outil | Terminal | VSCode | Autres IDE |
|-------|:-------:|:------:|:----------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | - |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | :white_check_mark: | - |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | :white_check_mark: | - | - |
| **OpenCode** | :white_check_mark: | - | - |

## Methode de configuration

| Outil | Variables d'environnement | Fichiers de config | Interface graphique |
|-------|:-------------------------:|:------------------:|:-------------------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | TOML + JSON | Parametres VSCode |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | - | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | - | JSON | CLI interactif |
| **OpenCode** | :white_check_mark: | JSON | TUI interactif |

## Compatibilite FishXCode

| Outil | Statut | Difficulte | Remarques |
|-------|:------:|:----------:|-----------|
| **Claude Code** | :white_check_mark: Supporte | Facile | Variables d'environnement |
| **OpenAI Codex** | :white_check_mark: Supporte | Moyen | Fichiers TOML et JSON requis |
| **Gemini CLI** | :x: Non supporte | - | Pas de routage personnalise |
| **RooCode** | :white_check_mark: Supporte | Facile | Configuration du fournisseur via GUI |
| **Qwen Code** | :white_check_mark: Supporte | Facile | Variables d'environnement |
| **Droid CLI** | :white_check_mark: Supporte | Moyen | Edition du fichier JSON requise |
| **OpenCode** | :white_check_mark: Supporte | Moyen | Edition du fichier JSON requise |

::: warning Gemini CLI non supporte pour le moment
Gemini CLI ne prend actuellement pas en charge le routage API personnalise, ce qui le rend incompatible avec FishXCode. Si vous cherchez une alternative, consultez les autres outils supportes ci-dessus.
:::

## Fonctionnalites cles

| Outil | Points forts |
|-------|--------------|
| **Claude Code** | Comprehension et generation de code avancees, experience terminal native, selection multi-modeles |
| **OpenAI Codex** | Double mode CLI et VSCode, support des modeles GPT, ecosysteme mature |
| **Gemini CLI** | Propulse par Google AI, integration profonde avec l'ecosysteme Google |
| **RooCode** | Experience 100% graphique dans VSCode, protocole OpenAI Compatible, aucun prerequis terminal |
| **Qwen Code** | Modeles Qwen d'Alibaba, optimise pour les scenarios multilingues, leger et simple |
| **Droid CLI** | Configuration de modeles flexible, fenetres de contexte extra-larges, axe sur le terminal |
| **OpenCode** | Interface TUI open source, support de 75+ modeles, agents build/plan integres, integration GitHub Copilot |

## Comment choisir

::: tip Flux de travail en terminal
Si vous preferez travailler exclusivement en terminal, optez pour **Claude Code** ou **OpenAI Codex**. Les deux offrent une experience en ligne de commande fluide. Claude Code a la configuration la plus simple, tandis que Codex propose aussi une extension VSCode.
:::

::: tip Integration VSCode
Si vous preferez une experience graphique dans votre IDE, choisissez **RooCode** ou **OpenAI Codex**. RooCode offre une experience purement graphique avec une configuration facile, tandis que Codex combine terminal et editeur.
:::

::: tip Configuration la plus rapide
Si vous voulez demarrer le plus vite possible, choisissez **Claude Code**, **RooCode** ou **Qwen Code**. Ces trois outils peuvent etre configures et operationnels en quelques minutes.
:::

::: tip Personnalisation maximale
Si vous avez besoin d'une configuration de modeles flexible et d'un support de contexte extra-large, essayez **Droid CLI**. Il supporte des parametres de modeles personnalises avec des fenetres de contexte allant jusqu'a 1,28 million de tokens.
:::

::: tip Developpement multilingue
Si vos projets impliquent de la documentation ou des commentaires en chinois, **Qwen Code** offre la meilleure comprehension et generation pour les scenarios de code en langue chinoise.
:::
