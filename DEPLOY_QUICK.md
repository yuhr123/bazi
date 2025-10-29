# Cloudflare Workers 快速部署

## 📋 前提条件

1. ✅ 已有 Cloudflare 账号（免费即可）
2. ✅ 项目代码已推送到 GitHub

## 🚀 三种部署方式

### 方式 1: 命令行部署（最简单）⭐

```bash
# 1. 安装依赖（已完成）
npm install

# 2. 登录 Cloudflare
npx wrangler login

# 3. 一键部署
npm run cf:deploy
```

完成！你的网站会部署到 `https://bazi.你的用户名.workers.dev`

### 方式 2: Cloudflare Dashboard（可视化）

1. 登录 https://dash.cloudflare.com/
2. 进入 "Workers & Pages" → "Create Application"
3. 选择 "Create Worker"
4. 给 Worker 命名
5. 在编辑器中粘贴 `dist/worker.js` 的内容
6. 点击 "Save and Deploy"

### 方式 3: GitHub 直接连接（推荐长期使用）

Cloudflare 支持直接连接 GitHub 仓库自动部署：

1. 登录 Cloudflare Dashboard
2. "Workers & Pages" → "Create Application" → "Pages"
3. "Connect to Git" → 选择你的 GitHub 仓库
4. 构建配置：
   - 构建命令: `npm run build:worker`
   - 输出目录: `dist`
   - 根目录: `/`
5. 点击 "Save and Deploy"

之后每次推送到 main 分支都会自动部署！

## ⚙️ 自定义配置

### 修改 Worker 名称

编辑 `wrangler.toml`:
```toml
name = "你的项目名"  # 修改这里
```

### 绑定自定义域名

1. 域名需要在 Cloudflare 托管
2. 在 Worker 设置中添加 Custom Domain
3. 或在 `wrangler.toml` 中配置：
```toml
routes = [
  { pattern = "bazi.yourdomain.com", custom_domain = true }
]
```

## 📊 免费额度

Cloudflare Workers 免费套餐：
- ✅ 每天 100,000 次请求
- ✅ 无限流量
- ✅ 全球边缘网络加速
- ✅ 自动 HTTPS

对个人项目完全够用！

## 🔧 本地测试

部署前可以本地测试：

```bash
npm run cf:dev
```

访问 http://localhost:8787

## ❓ 常见问题

### 1. 提示没有权限？
运行 `npx wrangler login` 重新登录

### 2. 部署失败？
检查 `wrangler.toml` 配置是否正确

### 3. 想查看日志？
```bash
npx wrangler tail
```

### 4. 如何更新？
修改代码后重新运行 `npm run cf:deploy`

## 📝 注意事项

1. **代码适配**: 已经为 Cloudflare Workers 做了适配，无需额外修改
2. **HTML 内联**: HTML 页面已内联到 worker.ts，无需单独部署静态文件
3. **兼容性**: 使用了 `nodejs_compat` 标志确保兼容性
4. **依赖检查**: tyme4ts 等核心依赖已验证可在 Workers 运行

## 🎯 推荐流程

**初次部署**:
```bash
npx wrangler login
npm run cf:deploy
```

**后续更新**:
- 修改代码
- 推送到 GitHub（如果配置了自动部署）
- 或运行 `npm run cf:deploy`

---

详细文档: [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md)
