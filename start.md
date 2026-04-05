# 在 Claude  Code 中使用 FishXCode

> 首次使用？请先完成 [账户注册与充值](/account)。

## 视频教程

<VideoPlayer src="https://s3.hi168.com/hi168-27900-8344owwk/claude0401.mp4" />

## 一、环境准备

### 安装 Node.js

Claude  Code 通过 npm 安装，需先确认 Node.js 已就绪。

::: code-group

```bash [macOS - 验证]
node -v
npm -v
```

```bash [macOS - Homebrew 安装]
brew install node
```

```bash [Windows - 验证（CMD/PowerShell）]
node -v
npm -v
```

:::

若未安装，前往 [nodejs.org/zh-cn/download](https://nodejs.cn/download/current/) 下载对应平台安装包，安装完成后 **Windows 需重启**。

### Windows 额外：安装 Git Bash

Claude  Code 依赖 bash 运行环境，Windows 用户需安装 Git Bash：

1. 下载地址：[git-scm.com/install/windows](https://git-scm.com/install)，选择对应版本安装。
2. 验证：右键桌面，出现 **Open Git Bash here** 选项即安装成功。

---

## 二、通过ZCF安装 Claude  Code

::: code-group

```bash [npm]
npx zcf
```

:::

---
## 三、配置 FishXCode

1. 终端输入 `npx zcf`，回车运行。
   出现 `Ok to proceed? (y)` 时输入 `y` 回车。

2. 选择 ZCF 显示语言：
   选择 **简体中文**。

3. 安装完成后，选择：
   `1. 完整初始化 - 安装 Claude Code + 导入工作流 + 配置 API 或 CCR 代理 + 配置 MCP 服务`

4. 是否修改模板语言配置：
   选择 `No`

5. AI 输出语言：
   选择 `简体中文`

6. 是否安装 Claude：
   选择 `Yes`

7. API 配置模式：
   选择 `自定义 API 配置`

8. API 供应商：
   选择 `自定义配置`

9. 配置名称：
   自定义英文名称

10. 认证类型：
    选择 `API Key`

11. API 基础 URL：
    ```
    https://fishxcode.com
    ```

12. API 密钥：
    填写 FishXCode 控制台生成的令牌

13. 模型相关配置：
    默认回车跳过即可

14. 工作流类型：
    选择 `通用工具`

15. 输出风格：
    根据个人喜好选择

16. 是否配置 MCP：
    选择 `Yes`

17. MCP 服务：
    使用空格选择需要的服务，回车运行

18. 配置 CCometixLine：
    直接回车

19. 返回主菜单后输入：
    ```
    q
    ```

20. 终端输入：
    ```
    claude
    ```
    - 选择 `Yes, I trust this folder`
    - API 选择，一定要选择 **YES（第一个）**

---

## 四、启动使用

```bash
cd my-project
claude
```

---

## 五、模型切换

在 Claude  Code 对话界面中输入 `/model` 即可切换模型：

| 选项 | 实际模型 | 说明 |
|---|---|---|
| **Default** | `claude-sonnet-4-5-20250929` + `claude-haiku-4-5-20251001` | 根据任务自动选择，推荐日常使用 |
| **Opus** | `claude-opus-4-5-20251101` | 最强推理能力，消耗较高 |
| **Haiku** | `claude-haiku-4-5-20251001` | 轻量快速 |

也可通过环境变量固定模型：

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

::: tip 升级 Claude  Code
如发现模型版本不是最新，执行升级命令后重启相关工具：
```bash
npm install -g @anthropic-ai/claude-code
```
:::

---

## 六、IDE 集成

### IntelliJ IDEA

操作路径：文件 → 设置 → 插件 → Marketplace → 搜索 `claude code`，找到 **Claude  Code Terminal** 并安装：

![安装 Claude  Code Terminal](/img/start/idea-01-install.png)

安装完成后重启 IDEA，验证插件已加载：

![验证插件已加载](/img/start/idea-02-verify.png)

::: info
若在插件市场搜索不到，说明当前 IDEA 版本过低，需升级至最新版本。
:::

### VSCode

按 `Ctrl + Shift + X` 打开扩展面板，搜索 `claude code`，找到 **Claude  Code for VSCode** 安装。

![搜索并安装 Claude  Code 插件](/img/start/vscode-01-install.png)

安装完成后，插件提供三种接入方式：

![Claude  Code 插件接入方式](/img/start/vscode-02-login.png)

推荐通过 `settings.json` 配置接入 FishXCode。点击插件右下角**齿轮图标** → **在 settings.json 中编辑**：

![打开 settings.json 编辑](/img/start/vscode-03-settings.png)

在 VSCode 的 `settings.json` 中添加：

```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "替换为您的 API Key" },
    { "name": "ANTHROPIC_BASE_URL", "value": "https://fishxcode.com/" }
  ]
}
```

![settings.json 配置示例](/img/start/vscode-04-config.png)

保存后**退出并重新打开 VSCode**，插件即可正常连接 FishXCode。

![在 VSCode 中使用 Claude  Code](/img/start/vscode-05-demo.gif)

---

## 七、常见问题

### 出现 403 错误

Token 余额不足，前往控制台充值后重试。

### Windows 出现连接异常或 400/401 错误

在 PowerShell 中重新执行 `setx` 命令写入系统变量，然后重新打开终端：

```powershell
setx ANTHROPIC_AUTH_TOKEN "sk-xxx"
setx ANTHROPIC_BASE_URL "https://fishxcode.com/"
```

### 提示"Unable to connect to Anthropic services"

完整错误如下：

```
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR_BAD_REQUEST
Please check your internet connection and network settings.
```

这是因为 Claude  Code 尚未完成 onboarding，仍尝试连接官方 `api.anthropic.com`。**无需科学上网**，在 `~/.claude.json`（注意是 home 目录下的 `.claude.json`，不是 `.claude/settings.json`）末尾添加 `"hasCompletedOnboarding": true` 即可跳过：

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "projects": { ... },
  "hasCompletedOnboarding": true
}
```

::: tip
添加前注意在上一个字段末尾补逗号（JSON 语法要求）。修改后重新运行 `claude` 即可正常连接。
:::
