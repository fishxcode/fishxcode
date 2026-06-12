---
title: Usar FishXCode com Codex Desktop
description: Instale o Codex Desktop, reutilize a configuração Codex do FishXCode, faça login e importe o canal pelo CC Switch.
---

# Usar FishXCode com Codex Desktop

> Primeira vez? Conclua a [configuração da conta](/pt/account) primeiro e crie um token utilizável no [console FishXCode](https://fishxcode.com/console/token).

## Escopo

Este guia mostra como conectar o OpenAI Codex Desktop ao FishXCode. Para instalação e configuração do Codex CLI, consulte [Usando FishXCode com Codex](/pt/codex). O Codex Desktop deve reutilizar a mesma configuração `~/.codex`, evitando duas configurações separadas.

::: tip Caminho recomendado
Crie primeiro a configuração local do Codex e depois abra o Codex Desktop para fazer login. Assim o app desktop e o CLI usam a mesma URL base da API FishXCode, o mesmo modelo e o mesmo token.
:::

## 1. Instalar o Codex Desktop

No Windows, abra a Microsoft Store, pesquise `Codex` e instale o aplicativo oficial:

![Instalar o Codex Desktop pela Microsoft Store](/img/start/codex-desktop/microsoft-store-codex.png)

Após instalar, configure o FishXCode antes de fazer login. Se a Microsoft Store não estiver disponível, use um canal oficial da OpenAI ou outra fonte confiável de distribuição de software.

## 2. Reutilizar a configuração Codex para FishXCode

Codex Desktop e Codex CLI devem usar a mesma configuração de usuário. A configuração abaixo segue o [guia do Codex CLI](/pt/codex).

### 1. Criar o diretório de configuração

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.codex
```

```powershell [Windows PowerShell]
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex"
```

:::

### 2. Escrever `config.toml`

Crie `~/.codex/config.toml` com:

```toml
model_provider = "fishxcode"
model = "gpt-5.4"
review_model = "gpt-5.4"
model_reasoning_effort = "medium"
model_reasoning_summary = "detailed"
disable_response_storage = true
preferred_auth_method = "apikey"
model_verbosity = "high"

[model_providers.fishxcode]
name = "OpenAI using Chat Completions"
base_url = "https://api.fishxcode.com/v1"
wire_api = "responses"
requires_openai_auth = true

[features]
skills = true
image_generation = false

```

::: info
Você pode trocar `model` e `review_model` por outro modelo disponível no seu plano ou grupo. Em caso de dúvida, comece com `gpt-5.4`.
:::

### 3. Escrever `auth.json`

Crie `~/.codex/auth.json` com seu token FishXCode:

```json
{
  "OPENAI_API_KEY": "your_api_key_here"
}
```

::: warning Atenção
`auth.json` contém seu token secreto. Não envie esse arquivo para o Git e não compartilhe.
:::

## 3. Fazer login no Codex Desktop

Abra o Codex Desktop. Se a tela de login aparecer, escolha **Usar outro método de login**:

![Escolher outro método de login](/img/start/codex-desktop/codex-login-options.png)

Cole o token copiado do console FishXCode. Se você já escreveu `~/.codex/auth.json` mas o Codex ainda pedir login, cole o mesmo token aqui.

Para copiar um token, encontre-o na página de tokens do FishXCode e use o botão de cópia ao lado da chave. Este guia não mostra o menu de cópia nas capturas para evitar expor detalhes desnecessários da chave.

Depois de fazer login, selecione a pasta do projeto em que o Codex deve trabalhar.

## 4. Opcional: gerenciar canais com CC Switch

Use o CC Switch se você mantém vários canais Codex. Se FishXCode for seu único canal, um único `~/.codex/config.toml` normalmente é suficiente.

Na página de tokens do FishXCode, encontre o token alvo e clique em **Importar** na linha do grupo `codex_sub_june`:

![Importar o grupo Codex do FishXCode](/img/start/codex-desktop/cc-switch-import-channel.png)

Na janela de importação do CC Switch, mantenha estes valores principais:

| Campo | Valor FishXCode |
| --- | --- |
| Endpoint da API | `https://api.fishxcode.com/v1` |
| Chave da API | Token FishXCode |
| Modelo principal | `gpt-5.4` ou outro modelo disponível no seu plano |

Mude o modelo principal para `gpt-5.4`, clique em **Testar** e importe somente depois de ver que o teste de conectividade do modelo foi bem-sucedido:

![Testar gpt-5.4 na janela de importação do CC Switch](/img/start/codex-desktop/cc-switch-select-model.png)

Quando o navegador abrir o CC Switch, revise o endpoint da API, o modelo e a observação, então clique em **Importar**:

![Confirmar a importação Codex do FishXCode](/img/start/codex-desktop/cc-switch-import-success.png)

Após importar, confirme que o CC Switch está usando o canal FishXCode e reinicie o Codex Desktop.

## 5. Controles comuns

### Modelo, esforço de raciocínio e permissões

O Codex Desktop geralmente mostra modelo, esforço de raciocínio, modo de permissão e pasta de trabalho perto da caixa de entrada:

![Controles de conversa do Codex Desktop](/img/start/codex-desktop/codex-dialog-options.png)

Configurações recomendadas:

- Modelo: escolha um modelo FishXCode, como `gpt-5.4`
- Esforço de raciocínio: use médio no dia a dia e aumente apenas em tarefas complexas
- Permissões: use acesso total para edições frequentes; use aprovação manual ao explorar um projeto desconhecido
- Pasta de trabalho: escolha o projeto que o Codex deve analisar ou modificar

### `/` e `@`

Dois atalhos são úteis na caixa de entrada:

| Símbolo | Uso |
| --- | --- |
| `/` | Abrir comandos ou a lista de Skills |
| `@` | Referenciar um arquivo ou diretório do projeto atual |

Se o menu não abrir, confirme que existe um espaço antes de `/` ou `@` e que o foco está dentro do Codex Desktop.

### Modo Plan

Para tarefas complexas, comece pelo modo Plan. O Codex divide o trabalho, faz perguntas de esclarecimento e aguarda sua confirmação antes de editar.

![Entrar no modo Plan](/img/start/codex-desktop/codex-plan-mode.png)

Quando o Codex fizer perguntas de esclarecimento, escolha a opção que corresponde à sua intenção:

![Responder perguntas de esclarecimento](/img/start/codex-desktop/codex-clarify-question.png)

Depois de revisar o plano, deixe o Codex executá-lo e monitore o escopo das alterações:

![Executar e acompanhar o plano](/img/start/codex-desktop/codex-execute-plan.png)

## 6. Perguntas frequentes

### As solicitações ainda não passam pelo FishXCode após o login?

Verifique em ordem:

1. `~/.codex/config.toml` existe
2. `model_provider` é `fishxcode`
3. `base_url` é `https://api.fishxcode.com/v1`
4. `~/.codex/auth.json` contém o token FishXCode
5. O Codex Desktop foi completamente fechado e aberto novamente após alterações de configuração

### Erro 401 ou 403?

Verifique se o token foi copiado por completo, está habilitado, tem saldo suficiente e pode acessar o modelo selecionado.

### O modelo exibido não é o esperado?

Confira `model` em `config.toml` e depois o seletor de modelo do Codex Desktop. Se usar CC Switch, confirme também que o canal atual é FishXCode.

### Mensagem de CC Switch não configurado?

Se você usa CC Switch e vê uma mensagem semelhante, o canal atual não está configurado corretamente:

![CC Switch não configurado](/img/start/codex-desktop/cc-switch-not-configured.png)

Siga esta ordem:

1. Feche completamente o Codex Desktop, incluindo o processo da bandeja
2. Abra o CC Switch e mude para o canal FishXCode
3. Abra novamente o Codex Desktop

Se você não usa CC Switch, volte à etapa 2 e revise `~/.codex/config.toml` e `~/.codex/auth.json`.
