# 使用 ZCF 接入 FishXCode

[ZCF](https://github.com/UfoMiao/zcf) 是 Claude  Code / Codex 的零配置增强工具，`zcf init` 一条命令完成 API 配置、工作流导入、MCP 服务集成等全部初始化。

> 没有账号？先完成 [账户注册](/account) 获取 API Key。

## 快速接入

::: code-group

```bash [推荐写法（-p custom）]
npx zcf i -s -p custom -k "你的API Key" -u "https://fishxcode.com/"
```

```bash [等价写法（-t api_key）]
npx zcf i -s -t api_key -k "你的API Key" -u "https://fishxcode.com/"
```

```bash [完整初始化]
npx zcf i -s \
  -p custom \
  -k "你的API Key" \
  -u "https://fishxcode.com/" \
  -g zh-CN \
  --workflows all \
  --mcp-services context7,open-websearch \
  --output-styles engineer-professional
```

```bash [交互式（首次使用）]
npx zcf init
# ZCF 会逐步引导选择 API 类型、MCP 服务、工作流等
```

:::

::: warning
将 `你的API Key` 替换为 [FishXCode 控制台](https://fishxcode.com/console/token) 中的 `sk-xxx` Token。
:::

执行后自动写入 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://fishxcode.com/"
  }
}
```

---

## 常用参数

### API 配置

| 参数 | 说明 |
|---|---|
| `-p custom` | 使用自定义提供商（FishXCode 即用此方式） |
| `-t api_key` | 等价写法，与 `-p custom` 效果相同 |
| `-k "sk-xxx"` | API Key |
| `-u "https://fishxcode.com/"` | FishXCode Base URL |
| `-M "claude-sonnet-4-5-20250929"` | 指定主模型 |
| `-H "claude-haiku-4-5-20251001"` | 指定快速模型 |

指定模型示例：

```bash
npx zcf i -s -t api_key -k "sk-xxx" -u "https://fishxcode.com/" \
  -M "claude-sonnet-4-5-20250929" \
  -H "claude-haiku-4-5-20251001"
```

### 工作流

| 参数 | 说明 |
|---|---|
| `-w all` | 安装全部工作流 |
| `-w sixStepsWorkflow,gitWorkflow` | 安装指定工作流 |
| `-w skip` | 跳过 |

可选工作流：`commonTools` / `sixStepsWorkflow` / `featPlanUx` / `gitWorkflow` / `bmadWorkflow`

### MCP 服务

| 参数 | 说明 |
|---|---|
| `-m all` | 安装全部 MCP |
| `-m context7,open-websearch` | 安装指定服务 |
| `-m skip` | 跳过 |

可选服务：`context7` / `open-websearch` / `spec-workflow` / `mcp-deepwiki` / `Playwright` / `exa` / `serena`

### 其他

| 参数 | 说明 |
|---|---|
| `-g zh-CN` | 统一设置界面、模板、AI 输出为中文 |
| `-s` | 非交互模式，跳过所有提示 |
| `-r backup` | 配置处理策略（`backup` / `merge` / `docs-only` / `skip`） |
| `-x false` | 不安装 CCometixLine 状态栏 |

---

## 工作流命令

安装完成后，在 Claude  Code 中可以使用以下斜杠命令：

| 命令 | 说明 |
|---|---|
| `/zcf:workflow` | 六阶段开发工作流（研究→构思→计划→执行→优化→评审） |
| `/zcf:feat` | 新功能开发，含规划与 UI/UX 设计 |
| `/zcf:git-commit` | 自动生成 Git commit 信息 |
| `/zcf:git-rollback` | 交互式回滚历史版本 |
| `/zcf:git-worktree` | 管理 Git Worktree |
| `/zcf:bmad-init` | 企业级敏捷开发流程 |

---

## MCP 服务说明

MCP（Model Context Protocol）允许 Claude  Code 访问外部工具与服务，ZCF 内置以下服务：

| 服务 | 说明 | 是否需要 Key |
|---|---|---|
| `context7` | 查询库的最新文档与代码示例 | 否 |
| `open-websearch` | DuckDuckGo/Bing/Brave 网页搜索 | 否 |
| `spec-workflow` | 需求→设计→实现的结构化工作流 | 否 |
| `mcp-deepwiki` | GitHub 仓库文档查询 | 否 |
| `Playwright` | 浏览器自动化操作 | 否 |
| `exa` | Exa AI 语义搜索 | 是（`EXA_API_KEY`） |
| `serena` | IDE 助手，语义代码检索 | 否 |

### 各服务说明

**context7** — 查询任意库的最新文档和代码示例，避免 AI 使用过期 API：
```
请查询 React useState hook 的最新文档和示例
```

**open-websearch** — 支持 DuckDuckGo、Bing、Brave 多引擎搜索，无需 API Key：
```
搜索最新的 TypeScript 5.0 新特性
```

**spec-workflow** — 从需求到实现的结构化工作流，含需求分析、技术设计、任务拆解：
```bash
npx -y @pimzino/spec-workflow-mcp@latest --dashboard  # 启动可视化仪表板
```

**mcp-deepwiki** — 查询 GitHub 仓库文档：
```
查询 vuejs/core 仓库的 Composition API 文档
```

**Playwright** — 控制浏览器截图、表单填写、模拟交互，首次运行需下载浏览器。

**exa** — Exa AI 语义网络搜索，需要配置 API Key：
```bash
export EXA_API_KEY="your-api-key"  # 从 dashboard.exa.ai 获取
```

**serena** — 语义代码检索与智能编辑建议，类 IDE 能力。

### 配置文件位置

ZCF 安装后，MCP 配置写入 `~/.claude/settings.json`：

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context-labs/context7"]
    },
    "open-websearch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-open-websearch"]
    }
  }
}
```

::: tip Windows 用户
ZCF 会自动修正 Windows 路径格式，如遇 MCP 连接问题运行 `npx zcf` → 选择 `4. 配置 MCP` 自动修复。
:::

---

## 更新

```bash
npx zcf update
# 或
npx zcf u -s -g zh-CN
```

更新只同步工作流模板和提示词，**不会修改 API 配置**。

---

## 常见问题

### 已有 settings.json 会被覆盖吗？

ZCF 在修改前自动备份至 `~/.claude/backup/YYYY-MM-DD_HH-mm-ss/`，并提供四种处理策略：

```bash
npx zcf i -s -r backup    # 备份并覆盖（默认）
npx zcf i -s -r merge     # 智能合并
npx zcf i -s -r docs-only # 仅更新工作流文档
npx zcf i -s -r skip      # 跳过不修改
```

### 如何切回手动配置？

ZCF 生成的 `settings.json` 是标准格式，可直接编辑。详见 [Claude  Code 配置](/start)。

### Node.js 版本要求

ZCF 需要 Node.js >= 18：

```bash
node --version
```
