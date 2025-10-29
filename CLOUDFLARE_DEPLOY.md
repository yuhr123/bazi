# Cloudflare Workers 部署指南

本项目支持部署到 Cloudflare Workers，实现全球边缘网络加速访问。

## 部署方式

### 方式一：使用 Wrangler CLI（推荐）

这是最简单直接的部署方式。

#### 1. 安装依赖

```bash
npm install
```

#### 2. 登录 Cloudflare

```bash
npx wrangler login
```

这会打开浏览器让你授权 Wrangler 访问你的 Cloudflare 账号。

#### 3. 配置 wrangler.toml

编辑 `wrangler.toml` 文件，确认或修改配置：

```toml
name = "bazi"  # 你的 Worker 名称
main = "src/worker.ts"
compatibility_date = "2024-10-01"
compatibility_flags = ["nodejs_compat"]
```

#### 4. 部署到 Cloudflare

```bash
npm run cf:deploy
```

或者直接使用：

```bash
npx wrangler deploy
```

部署成功后，Wrangler 会显示你的 Worker URL，例如：
```
https://bazi.your-subdomain.workers.dev
```

#### 5. 本地测试（可选）

在部署之前，可以本地测试：

```bash
npm run cf:dev
```

这会启动本地开发服务器，访问 `http://localhost:8787`

---

### 方式二：通过 Cloudflare Dashboard

如果你更喜欢使用 Web 界面：

#### 1. 构建项目

```bash
npm run build:worker
```

#### 2. 登录 Cloudflare Dashboard

访问 https://dash.cloudflare.com/ 并登录

#### 3. 创建 Worker

1. 进入 "Workers & Pages" 部分
2. 点击 "Create Application"
3. 选择 "Create Worker"
4. 给 Worker 命名（例如：bazi）
5. 点击 "Deploy"

#### 4. 上传代码

创建完成后：
1. 点击 "Quick Edit" 或进入 Worker 编辑界面
2. 删除默认代码
3. 复制 `dist/worker.js` 的内容
4. 粘贴到编辑器
5. 点击 "Save and Deploy"

---

### 方式三：GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build:worker
        
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

然后在 GitHub 仓库设置中添加 `CLOUDFLARE_API_TOKEN` secret。

---

## 配置自定义域名

### 1. 在 Cloudflare Dashboard 中

1. 进入你的 Worker
2. 点击 "Triggers" 标签
3. 点击 "Add Custom Domain"
4. 输入你的域名（需要已在 Cloudflare 托管）
5. 点击 "Add Custom Domain"

### 2. 在 wrangler.toml 中配置

```toml
routes = [
  { pattern = "bazi.yourdomain.com", custom_domain = true }
]
```

然后重新部署：

```bash
npm run cf:deploy
```

---

## 环境变量配置

如果需要配置环境变量，在 `wrangler.toml` 中添加：

```toml
[vars]
MY_VARIABLE = "production_value"
```

或通过命令行设置 secret：

```bash
npx wrangler secret put MY_SECRET
```

---

## 注意事项

### Cloudflare Workers 限制

1. **免费套餐限制**：
   - 每天 100,000 次请求
   - CPU 时间：每次请求 10ms（免费）/ 50ms（付费）
   - 内存：128MB
   - 脚本大小：1MB（压缩后）

2. **兼容性**：
   - 项目使用了 `nodejs_compat` 标志来支持 Node.js API
   - 某些 Node.js 模块可能不完全兼容
   - 如遇到问题，可能需要调整依赖或使用 polyfill

3. **冷启动**：
   - Workers 可能会有冷启动时间
   - 首次请求可能较慢

### 与 GitHub 集成

如果你的代码在 GitHub 上：

1. Cloudflare 支持直接连接 GitHub 仓库
2. 可以实现自动部署
3. 在 Dashboard 中选择 "Workers & Pages" → "Create Application" → "Pages" → "Connect to Git"

---

## 故障排查

### 部署失败

```bash
# 查看详细日志
npx wrangler deploy --verbose

# 验证配置
npx wrangler whoami
```

### 运行时错误

```bash
# 查看实时日志
npx wrangler tail

# 查看特定 Worker 的日志
npx wrangler tail bazi
```

### 依赖问题

如果某些 npm 包在 Workers 中不兼容：

1. 检查 Cloudflare Workers 文档的兼容性说明
2. 考虑使用 Web 标准 API 替代
3. 或使用轻量级的替代包

---

## 监控和分析

Cloudflare 提供了 Workers 的分析面板：

1. 访问 Dashboard
2. 进入你的 Worker
3. 查看 "Metrics" 标签
4. 可以看到请求量、错误率、CPU 时间等

---

## 成本估算

- **免费套餐**：每天 100,000 次请求
- **付费套餐**：$5/月起，包含 1000 万次请求

对于个人使用或小型项目，免费套餐完全够用。

---

## 更多资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Workers 示例](https://developers.cloudflare.com/workers/examples/)
