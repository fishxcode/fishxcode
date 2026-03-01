# Usando FishXCode com Claude  Code

## 1. Obter uma API Key

### Criar conta

Acesse [fishxcode.com](https://fishxcode.com/register?aff=9CTW) para se registrar (senha 8–20 caracteres, e-mail obrigatório).

### Criar um token

Faça login e vá em **Console → Gerenciamento de tokens → Adicionar token**. Ao criar:

- Em **Grupo de tokens**, selecione o **canal oficial**. Este grupo inclui `claude-opus-4-5-20251101`, `claude-haiku-4-5-20251001`, `claude-opus-4-6`, `claude-sonnet-4-5-20250929`, `claude-sonnet-4-6`, etc. O modelo é selecionado automaticamente com base na complexidade da tarefa.
- Após a criação, clique no botão de copiar para obter sua API Key (formato: `sk-xxx`).

### Recarregar saldo

| Método | Caminho |
| --- | --- |
| Alipay | Console → Carteira → Valor → Alipay |
| WeChat Pay | Console → Carteira → Valor → WeChat |
| Código de resgate | Console → Carteira → Inserir código → Resgatar |

::: tip Multiplicador de taxa
Um grupo rotulado como `0.5x` significa que você obtém o dobro de tokens em relação ao preço oficial. Exemplo: `0.5x` = 10M tokens por ¥1 (vs. 5M no preço oficial).
:::

---

## 2. Preparação do ambiente

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

## 3. Instalar Claude  Code

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

## 4. Configurar FishXCode

### Opção 1: settings.json (Recomendado)

Edite `~/.claude/settings.json` (Windows: `C:\Users\<usuário>\.claude\settings.json`):

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sua-api-key",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  },
  "permissions": {
    "allow": [
      "Bash",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "Glob(*)",
      "Grep(*)"
    ],
    "deny": []
  }
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

## 5. Iniciar

```bash
cd meu-projeto
claude
```

---

## 6. Seleção de modelo

Digite `/model` dentro do Claude  Code para trocar de modelo:

| Opção | Modelo | Notas |
| --- | --- | --- |
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

## 7. Integração com IDE (IntelliJ IDEA)

**Caminho**: IDEA → Arquivo → Configurações → Plugins → Marketplace → buscar `claude code` → instalar **Claude  Code Terminal**.

::: info
Se o plugin não aparecer no Marketplace, sua versão do IDEA é muito antiga — atualize para a versão mais recente.
:::

---

## 8. Solução de problemas

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
