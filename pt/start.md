# Usando FishXCode com Claude Code

> Primeira vez? Primeiro complete a [Configuração de conta](/pt/account).

## Tutorial em vídeo

<VideoPlayer src="https://s3.hi168.com/hi168-27900-8344owwk/claude0401.mp4" />

## 1. Preparação do ambiente

### Instalar Node.js

Claude Code é instalado via npm. Verifique primeiro se o Node.js está disponível.

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

Se não estiver instalado, acesse [nodejs.org/pt-br/download](https://nodejs.cn/download/current/) para baixar o instalador correspondente à sua plataforma. **Windows requer reinicialização** após a instalação.

### Somente Windows: instalar Git Bash

Claude Code requer um ambiente bash. Usuários Windows devem instalar o Git Bash:

1. Baixe em [git-scm.com/install/windows](https://git-scm.com/install) e instale a versão correspondente.
2. Verificação: clique com o botão direito na área de trabalho — se aparecer **Open Git Bash here**, a instalação foi bem-sucedida.

---

## 2. Instalar Claude Code via ZCF

::: code-group

```bash [npm]
npx zcf
```

:::

---

## 3. Configurar FishXCode

1. Digite `npx zcf` no terminal e pressione Enter.
   Quando aparecer `Ok to proceed? (y)`, digite `y` e pressione Enter.

2. Selecione o idioma de exibição do ZCF:
   Escolha **English**.

3. Após a instalação, selecione:
   `1. Full Initialization - Install Claude Code + Import Workflows + Configure API or CCR Proxy + Configure MCP Services`

4. Modificar configuração de idioma do template:
   Selecione `No`

5. Idioma de saída da IA:
   Selecione `English`

6. Instalar Claude:
   Selecione `Yes`

7. Modo de configuração da API:
   Selecione `Custom API Configuration`

8. Provedor de API:
   Selecione `Custom Configuration`

9. Nome da configuração:
   Defina um nome em inglês de sua preferência

10. Tipo de autenticação:
    Selecione `API Key`

11. URL base da API:
    ```
    https://fishxcode.com
    ```

12. Chave de API:
    Insira o token gerado no console do FishXCode

13. Configurações relacionadas ao modelo:
    Pressione Enter para pular com os valores padrão

14. Tipo de workflow:
    Selecione `General Tools`

15. Estilo de saída:
    Escolha conforme sua preferência pessoal

16. Configurar MCP:
    Selecione `Yes`

17. Serviços MCP:
    Use a barra de espaço para selecionar os serviços desejados e pressione Enter para continuar

18. Configurar CCometixLine:
    Pressione Enter diretamente

19. Após retornar ao menu principal, digite:
    ```
    q
    ```

20. No terminal, digite:
    ```
    claude
    ```
    - Selecione `Yes, I trust this folder`
    - Na seleção de API, certifique-se de escolher **YES (a primeira opção)**

---

## 4. Iniciar

```bash
cd my-project
claude
```

---

## 5. Seleção de modelo

Digite `/model` dentro do Claude Code para trocar de modelo:

| Opção | Modelo real | Notas |
|---|---|---|
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | Seleção automática por complexidade da tarefa. Recomendado para uso diário. |
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

::: tip Atualizar Claude Code
Se a versão do modelo parecer desatualizada, execute o comando de atualização e reinicie as ferramentas relacionadas:
```bash
npm install -g @anthropic-ai/claude-code
```
:::

---

## 6. Integração com IDE

### IntelliJ IDEA

Caminho: Arquivo → Configurações → Plugins → Marketplace → buscar `claude code`, encontrar **Claude Code Terminal** e instalar:

![Instalar Claude Code Terminal](/img/start/idea-01-install.png)

Após a instalação, reinicie o IDEA e verifique se o plugin foi carregado:

![Verificar plugin carregado](/img/start/idea-02-verify.png)

::: info
Se o plugin não aparecer no Marketplace, sua versão do IDEA é muito antiga — atualize para a versão mais recente.
:::

### VSCode

Pressione `Ctrl + Shift + X` para abrir o painel de extensões, busque `claude code` e instale o **Claude Code for VSCode**.

![Buscar e instalar o plugin Claude Code](/img/start/vscode-01-install.png)

Após a instalação, o plugin oferece três métodos de conexão:

![Métodos de conexão do plugin Claude Code](/img/start/vscode-02-login.png)

Recomenda-se configurar via `settings.json`. Clique no **ícone de engrenagem** no canto inferior direito do plugin → **Editar em settings.json**:

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

Após salvar, **feche e reabra o VSCode** — o plugin estará conectado ao FishXCode normalmente.

![Usando Claude Code no VSCode](/img/start/vscode-05-demo.gif)

---

## 7. Solução de problemas

### Erro 403

Saldo do token insuficiente. Recarregue no console e tente novamente.

### Windows: erro de conexão ou 400/401

Execute estes comandos no PowerShell para gravar as variáveis permanentes do sistema e reabra o terminal:

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

Isso acontece porque o Claude Code não concluiu o onboarding e ainda tenta se conectar a `api.anthropic.com`. **Nenhuma VPN é necessária.** Abra `~/.claude.json` (o arquivo `.claude.json` no seu diretório home — não `.claude/settings.json`) e adicione `"hasCompletedOnboarding": true` ao final:

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
Adicione uma vírgula após o campo anterior antes de inserir a nova entrada (requisito de sintaxe JSON). Reinicie o `claude` após salvar para que a conexão funcione normalmente.
:::
