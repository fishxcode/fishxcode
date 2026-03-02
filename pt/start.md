# Usando FishXCode com Claude  Code

> Primeira vez? Primeiro complete a [Configuração de conta](/pt/account).

## 1. Preparação do ambiente

### Instalar Node.js

Claude  Code é instalado via npm. Verifique primeiro se o Node.js está disponível.

::: code-group

```bash [macOS - Verificar]
node -v
npm -v
```

```bash [macOS - Instalar via Homebrew]
brew install node
```

```bash [Windows - Verificar (CMD/PowerShell)]
node -v
npm -v
```

:::

Se não estiver instalado, baixe em [nodejs.org/pt-br/download](https://nodejs.org/pt-br/download). **Windows requer reinicialização** após a instalação.

### Somente Windows: instalar Git Bash

Claude  Code requer um ambiente bash. Usuários Windows devem instalar o Git Bash:

1. Baixe em [git-scm.com/download/windows](https://git-scm.com/download/windows) e instale.
2. Verificação: clique com o botão direito na área de trabalho — se aparecer **Open Git Bash here**, a instalação foi bem-sucedida.

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

Verificar instalação:

```bash
claude --version
```

---

## 3. Configurar FishXCode

### Opção 1: settings.json (Recomendado)

Edite `~/.claude/settings.json` (Windows: `C:\Users\<usuário>\.claude\settings.json`):

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "substitua pela sua API Key",
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

Esta configuração é **permanente** — não é necessário definir variáveis a cada sessão.

### Opção 2: Variáveis de ambiente temporárias

::: code-group

```bash [macOS/Linux]
export ANTHROPIC_BASE_URL=https://fishxcode.com/
export ANTHROPIC_AUTH_TOKEN=sk-xxx
```

```powershell [Windows PowerShell (temporário)]
$env:ANTHROPIC_BASE_URL="https://fishxcode.com/"
$env:ANTHROPIC_AUTH_TOKEN="sk-xxx"
```

```cmd [Windows CMD (temporário)]
set ANTHROPIC_BASE_URL=https://fishxcode.com/
set ANTHROPIC_AUTH_TOKEN=sk-xxx
```

:::

Para gravar permanentemente nas variáveis do sistema Windows, execute no PowerShell:

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

Reabra o terminal após executar esses comandos.

::: warning
Substitua `sk-xxx` pelo seu token real obtido no [Console FishXCode](https://fishxcode.com/console/token).
:::

---

## 4. Iniciar

```bash
cd my-project
claude
```

---

## 5. Seleção de modelo

Digite `/model` dentro do Claude  Code para trocar de modelo:

| Opção | Modelo | Notas |
|---|---|---|
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Seleção automática por complexidade da tarefa. Recomendado. |
| **Opus** | `claude-opus-4-5-20251101` | Raciocínio mais poderoso, custo mais alto |
| **Haiku** | `claude-haiku-4-5-20251001` | Leve e rápido |

Você também pode fixar um modelo via variável de ambiente:

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

::: tip Atualizar Claude  Code
Se a versão do modelo parecer desatualizada, atualize e reinicie suas ferramentas:
```bash
npm install -g @anthropic-ai/claude-code
```
:::

---

## 6. Integração com IDE

### IntelliJ IDEA

Caminho: Arquivo → Configurações → Plugins → Marketplace → buscar `claude code`, encontrar **Claude  Code Terminal** e instalar:

![Instalar Claude  Code Terminal](/img/start/idea-01-install.png)

Após a instalação, reinicie o IDEA e verifique se o plugin foi carregado:

![Verificar plugin carregado](/img/start/idea-02-verify.png)

::: info
Se o plugin não aparecer no Marketplace, sua versão do IDEA é muito antiga — atualize para a versão mais recente.
:::

### VSCode

Pressione `Ctrl + Shift + X` para abrir o painel de extensões, busque `claude code` e instale o **Claude  Code for VSCode**.

![Buscar e instalar o plugin Claude  Code](/img/start/vscode-01-install.png)

Após a instalação, o plugin oferece três métodos de conexão:

![Métodos de conexão do plugin Claude  Code](/img/start/vscode-02-login.png)

Recomenda-se configurar via `settings.json`. Clique no **ícone de engrenagem** do plugin → **Editar em settings.json**:

![Abrir edição do settings.json](/img/start/vscode-03-settings.png)

Adicione ao `settings.json` do VSCode:

```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "substitua pela sua API Key" },
    { "name": "ANTHROPIC_BASE_URL", "value": "https://fishxcode.com/" }
  ]
}
```

![Exemplo de configuração no settings.json](/img/start/vscode-04-config.png)

Após salvar, **feche e reabra o VSCode** — o plugin estará conectado ao FishXCode.

![Usando Claude  Code no VSCode](/img/start/vscode-05-demo.gif)

---

## 7. Solução de problemas

### Erro 403

Saldo do token insuficiente. Recarregue no console e tente novamente.

### Windows: erro de conexão ou 400/401

Execute estes comandos no PowerShell para gravar variáveis permanentes do sistema e reabra o terminal:

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

### "Unable to connect to Anthropic services"

Erro completo:

```
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR_BAD_REQUEST
Please check your internet connection and network settings.
```

Isso acontece porque o Claude  Code não concluiu o onboarding e ainda tenta se conectar a `api.anthropic.com`. **Nenhuma VPN é necessária.** Abra `~/.claude.json` (o arquivo `.claude.json` no seu diretório home — não `.claude/settings.json`) e adicione `"hasCompletedOnboarding": true`:

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Adicione uma vírgula após o campo anterior antes de inserir a nova entrada. Reinicie o `claude` após salvar.
:::
