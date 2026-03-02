# 账户注册

> 已有账号？直接查看 [快速开始](/start) 配置工具。

## 一、获取 API Key

### 1. 注册账号

访问 [fishxcode.com](https://fishxcode.com/register?aff=9CTW)，点击**注册**：

![FishXCode 首页](/img/start/api-01-home.png)

选择注册方式（GitHub、LinuxDO 或用户名注册）：

![注册方式选择](/img/start/api-02-register.png)

填写用户名、密码和确认密码完成注册：

![填写注册信息](/img/start/api-03-register-form.png)

### 2. 登录

注册完成后使用用户名和密码登录：

![登录页面](/img/start/api-04-login.png)

登录后进入控制台：

![控制台首页](/img/start/api-05-console.png)

### 3. 创建令牌

进入**控制台 → 令牌管理 → 添加令牌**，填写表单：

![添加令牌](/img/start/api-06-token-create.png)

- **令牌分组**建议选择 **官渠**，该分组包含 `claude-opus-4-5-20251101`、`claude-haiku-4-5-20251001`、`claude-opus-4-6`、`claude-sonnet-4-5-20250929`、`claude-sonnet-4-6` 等模型，会根据任务复杂度自动选择，无需手动切换。

创建完成后在令牌列表点击**复制**按钮获取 API Key（格式为 `sk-xxx`）：

![复制令牌](/img/start/api-07-token-copy.png)

### 4. 充值

进入**控制台 → 钱包管理**，支持支付宝、微信或兑换码：

![充值页面](/img/start/api-08-wallet.png)

| 方式 | 操作路径 |
|---|---|
| 支付宝 | 输入/选择金额 → 支付宝 |
| 微信 | 输入/选择金额 → 微信 |
| 兑换码 | 兑换码区域输入 → 点击兑换额度 |

::: tip 倍率说明
分组名称中的 `0.5x倍率` 表示消费倍率，数值越小获得更多 Token，如 `0.5x` 即 1 元可使用官方 1000 万 Token（官方原价 500 万）。
:::
