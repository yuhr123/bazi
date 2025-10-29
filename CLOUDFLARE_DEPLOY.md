# Cloudflare Workers 部署指南

本项目支持部署到 Cloudflare Workers，实现全球边缘网络加速访问。

## 🚀 快速开始（3 分钟）

### 前提条件

- ✅ Node.js 22+ 已安装
- ✅ Cloudflare 账号（免费即可，[注册地址](https://dash.cloudflare.com/sign-up)）

### 一键部署

```bash
# 1. 安装依赖（如果还没安装）
npm install

# 2. 登录 Cloudflare
npx wrangler login

# 3. 部署
npm run cf:deploy
```

部署成功后，你会看到类似这样的输出：
```
✨ Deployment complete!
🌐 https://bazi.your-username.workers.dev
```

**就这么简单！** 访问上面的 URL 即可使用。

---

## 📋 三种部署方式

### 方式 1: 命令行部署（推荐）⭐

**适用场景**: 快速部署、手动控制

```bash
# 首次部署
npx wrangler login
npm run cf:deploy

# 后续更新
npm run cf:deploy
```

**优点**: 
- 最快速直接
- 本地完全控制
- 适合开发调试

### 方式 2: GitHub 自动部署（推荐长期使用）🔄

**适用场景**: 团队协作、CI/CD

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create Application** → **Pages**
3. 点击 **Connect to Git**
4. 选择你的 GitHub 仓库 `yuhr123/bazi`
5. 配置构建设置：
   - **构建命令**: `npm run build:worker`
   - **输出目录**: `dist`
   - **根目录**: `/`
6. 点击 **Save and Deploy**

**优点**:
- ✅ 推送代码自动部署
- ✅ 每次提交都有部署记录
- ✅ 支持预览部署（Preview Deployments）
- ✅ 零手动操作

**完成后**: 每次 push 到 GitHub，Cloudflare 自动部署最新版本！

### 方式 3: Dashboard 手动部署

**适用场景**: 临时测试、不想用命令行

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages** → **Create Application** → **Create Worker**
3. 给 Worker 命名（如 `bazi`）
4. 本地运行 `npm run build:worker`
5. 复制 `dist/worker.js` 的内容
6. 粘贴到 Cloudflare 编辑器
7. 点击 **Save and Deploy**

**优点**: 可视化操作，适合非技术用户

---

## ⚙️ 自定义配置

### 修改 Worker 名称

编辑 `wrangler.toml`:

```toml
name = "your-project-name"  # 改成你想要的名字
```

重新部署即可。

### 绑定自定义域名

#### 方法 1: Dashboard（推荐）

1. 确保域名在 Cloudflare 托管
2. 进入你的 Worker 设置
3. **Triggers** 标签 → **Add Custom Domain**
4. 输入域名（如 `bazi.yourdomain.com`）
5. 点击 **Add Domain**

Cloudflare 会自动配置 DNS 和 SSL。

#### 方法 2: wrangler.toml

```toml
routes = [
  { pattern = "bazi.yourdomain.com", custom_domain = true }
]
```

### 环境变量

如需配置环境变量，在 `wrangler.toml` 中添加：

```toml
[vars]
MY_VARIABLE = "production_value"
```

或使用 secrets（敏感信息）：

```bash
npx wrangler secret put MY_SECRET
# 会提示输入密钥值
```

---

## 🔧 本地开发与测试

### 启动本地开发服务器

```bash
npm run cf:dev
```

访问 http://localhost:8787 查看效果。

**特点**:
- 热重载（修改代码自动刷新）
- 模拟 Cloudflare Workers 环境
- 支持断点调试

### 查看部署日志

```bash
npx wrangler tail
```

实时查看 Worker 的运行日志，方便调试。

---

## 📊 免费额度说明

Cloudflare Workers **免费套餐**：

| 项目 | 额度 |
|-----|------|
| 请求数 | 每天 100,000 次 |
| CPU 时间 | 每次请求 10ms |
| 流量 | 无限制 |
| SSL | 自动 HTTPS |
| 全球节点 | 300+ 边缘节点 |

**对个人项目完全够用！** 超出后按量计费，价格很低：
- $5/月：1000 万次请求
- 每百万次额外请求：$0.50

---

## ❓ 常见问题

### 1. 部署失败：权限错误

**问题**: `Error: Authentication error`

**解决**:
```bash
npx wrangler logout
npx wrangler login
```

### 2. 部署失败：编译错误

**问题**: TypeScript 编译失败

**解决**:
```bash
npm run tsc
# 查看错误，修复后重试
npm run cf:deploy
```

### 3. 访问 404

**问题**: Worker URL 返回 404

**可能原因**:
- Worker 名称冲突
- 部署未完成

**解决**:
```bash
# 查看 Worker 列表
npx wrangler list

# 查看特定 Worker 状态
npx wrangler status
```

### 4. 如何回滚版本？

在 Cloudflare Dashboard:
1. 进入你的 Worker
2. **Deployments** 标签
3. 找到之前的版本
4. 点击 **Rollback**

### 5. 如何查看使用量？

Dashboard → **Workers & Pages** → 选择你的 Worker → **Metrics**

可以看到：
- 请求数
- 错误率
- CPU 时间
- 流量统计

### 6. 本地测试报错怎么办？

```bash
# 清理缓存重试
rm -rf .wrangler
npm run cf:dev
```

---

## 🎯 部署最佳实践

### 开发流程

```bash
# 1. 修改代码
vim public/css/style.css

# 2. 本地测试
npm run dev:web          # Web 服务器
# 或
npm run cf:dev           # Workers 环境

# 3. 同步静态资源（如果修改了 HTML/CSS/JS）
npm run sync:worker

# 4. 部署
npm run cf:deploy
```

### 生产环境建议

1. **使用 GitHub 自动部署**: 代码 push 即部署
2. **绑定自定义域名**: 更专业
3. **监控使用量**: 避免超出免费额度
4. **定期查看日志**: 及时发现问题

### 版本管理

利用 Git 标签管理版本：

```bash
# 标记版本
git tag v1.0.0
git push origin v1.0.0

# 部署特定版本
git checkout v1.0.0
npm run cf:deploy
```

---

## 🔒 安全注意事项

1. **不要提交 secrets**: 使用 `wrangler secret` 管理敏感信息
2. **API 限流**: 考虑添加速率限制
3. **CORS 配置**: 生产环境建议限制来源
4. **日志脱敏**: 不要记录敏感信息

---

## 📚 相关资源

- [Cloudflare Workers 官方文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Workers 示例](https://developers.cloudflare.com/workers/examples/)
- [社区讨论](https://discord.gg/cloudflaredev)

---

## 🆘 获取帮助

遇到问题？

1. 查看本文档的[常见问题](#-常见问题)部分
2. 运行 `npx wrangler tail` 查看实时日志
3. 查看 [GitHub Issues](https://github.com/yuhr123/bazi/issues)
4. Cloudflare Workers 社区很活跃，可以在 Discord 提问

---

## 📝 更新日志

- **2024-10**: 添加资源拆分支持，优化部署流程
- **2024-10**: 初始版本，支持 Cloudflare Workers 部署
