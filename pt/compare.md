# Comparacao de ferramentas

Escolha a ferramenta de codificacao com IA ideal para o seu fluxo de trabalho. Veja abaixo uma comparacao completa de todas as ferramentas disponiveis na plataforma FishXCode.

## Informacoes basicas

| Ferramenta | Desenvolvedor | Tipo |
|------------|---------------|------|
| **Claude Code** | Anthropic | Ferramenta CLI de terminal |
| **OpenAI Codex** | OpenAI | CLI + Extensao VSCode |
| **Gemini CLI** | Google | Ferramenta CLI de terminal |
| **RooCode** | Roo Veterinary | Extensao VSCode |
| **Qwen Code** | Alibaba | Ferramenta CLI de terminal |
| **Droid CLI** | Factory AI | Ferramenta CLI de terminal |
| **OpenCode** | OpenCode AI | Ferramenta CLI de terminal (TUI) |

## Suporte de plataformas

| Ferramenta | macOS | Windows | Linux |
|------------|:-----:|:-------:|:-----:|
| **Claude Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Gemini CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **RooCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Droid CLI** | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **OpenCode** | :white_check_mark: | :white_check_mark: | :white_check_mark: |

## Integracao com IDE

| Ferramenta | Terminal | VSCode | Outros IDEs |
|------------|:-------:|:------:|:-----------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | :white_check_mark: | - |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | :white_check_mark: | - |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | :white_check_mark: | - | - |
| **OpenCode** | :white_check_mark: | - | - |

## Metodo de configuracao

| Ferramenta | Variaveis de ambiente | Arquivos de config | Interface grafica |
|------------|:---------------------:|:------------------:|:-----------------:|
| **Claude Code** | :white_check_mark: | - | - |
| **OpenAI Codex** | :white_check_mark: | TOML + JSON | Configuracoes VSCode |
| **Gemini CLI** | :white_check_mark: | - | - |
| **RooCode** | - | - | :white_check_mark: |
| **Qwen Code** | :white_check_mark: | - | - |
| **Droid CLI** | - | JSON | CLI interativo |
| **OpenCode** | :white_check_mark: | JSON | TUI interativo |

## Compatibilidade com FishXCode

| Ferramenta | Status | Dificuldade | Observacoes |
|------------|:------:|:-----------:|-------------|
| **Claude Code** | :white_check_mark: Compativel | Facil | Variaveis de ambiente |
| **OpenAI Codex** | :white_check_mark: Compativel | Media | Requer arquivos TOML e JSON |
| **Gemini CLI** | :x: Nao compativel | - | Sem suporte a roteamento personalizado |
| **RooCode** | :white_check_mark: Compativel | Facil | Configuracao do provedor via GUI |
| **Qwen Code** | :white_check_mark: Compativel | Facil | Variaveis de ambiente |
| **Droid CLI** | :white_check_mark: Compativel | Media | Requer edicao de arquivo JSON |
| **OpenCode** | :white_check_mark: Compativel | Media | Requer edicao de arquivo JSON |

::: warning Gemini CLI ainda nao compativel
O Gemini CLI atualmente nao suporta roteamento de API personalizado, o que o torna incompativel com o FishXCode. Se voce procura uma alternativa, confira as demais ferramentas compativeis listadas acima.
:::

## Funcionalidades principais

| Ferramenta | Destaques |
|------------|-----------|
| **Claude Code** | Compreensao e geracao de codigo avancadas, experiencia nativa no terminal, alternancia entre multiplos modelos |
| **OpenAI Codex** | Modo duplo CLI e VSCode, suporte a modelos GPT, ecossistema maduro |
| **Gemini CLI** | Impulsionado por Google AI, integracao profunda com o ecossistema Google |
| **RooCode** | Experiencia 100% grafica no VSCode, protocolo OpenAI Compatible, sem barreira de terminal |
| **Qwen Code** | Modelos Qwen da Alibaba, otimizado para cenarios multilinguais, leve e simples |
| **Droid CLI** | Suporte flexivel a modelos personalizados, janelas de contexto extra grandes, focado no terminal |
| **OpenCode** | Interface TUI de codigo aberto, suporte a 75+ modelos, agentes build/plan integrados, integracao com GitHub Copilot |

## Como escolher

::: tip Fluxo de trabalho no terminal
Se voce prefere trabalhar inteiramente no terminal, escolha **Claude Code** ou **OpenAI Codex**. Ambos oferecem uma experiencia fluida na linha de comando. O Claude Code tem a configuracao mais simples, enquanto o Codex tambem oferece uma extensao para VSCode.
:::

::: tip Integracao com VSCode
Se voce prefere uma experiencia grafica no IDE, escolha **RooCode** ou **OpenAI Codex**. O RooCode oferece uma experiencia puramente grafica com configuracao facil, enquanto o Codex combina terminal e editor.
:::

::: tip Configuracao mais rapida
Se voce quer comecar o mais rapido possivel, escolha **Claude Code**, **RooCode** ou **Qwen Code**. Os tres podem ser configurados e estar funcionando em poucos minutos.
:::

::: tip Maxima personalizacao
Se voce precisa de configuracao flexivel de modelos e suporte a contexto extra grande, experimente o **Droid CLI**. Ele suporta parametros de modelos personalizados com janelas de contexto de ate 1,28 milhao de tokens.
:::

::: tip Desenvolvimento multilingual
Se seus projetos envolvem documentacao ou comentarios em chines, o **Qwen Code** oferece a melhor compreensao e geracao para cenarios de codigo em lingua chinesa.
:::
