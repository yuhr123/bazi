# Bazi (八字命盘生成器)

> 基于 [cantian-ai/bazi-mcp](https://github.com/cantian-ai/bazi-mcp) 的 Web 界面版本  
> 为 AI 提供标准化的 JSON 格式八字数据

## 🌟 项目愿景

这是一个开源项目，旨在让传统命理学与现代 AI 技术更好地结合。我们相信：

- ✨ **开放共享**：命理知识应该开放，技术实现应该透明
- 🤝 **协作创新**：站在巨人的肩膀上，与社区一起成长
- 🎯 **实用主义**：工具应该简单易用，数据应该标准化
- 🌍 **全球可访问**：通过云部署，让世界各地的用户都能使用

## 📖 项目背景

本项目是 [cantian-ai/bazi-mcp](https://github.com/cantian-ai/bazi-mcp) 的一个分支实现。

**原项目（bazi-mcp）**提供了：
- 精准的八字排盘核心库
- MCP (Model Context Protocol) 服务
- 让 AI 助手（如 Claude）能够准确计算八字

**本项目在此基础上增加了：**

1. 🎨 **Web 可视化界面**：让非技术用户也能轻松使用
2. 📊 **JSON 格式输出**：标准化数据格式，方便 AI 理解和处理
3. ☁️ **云部署支持**：一键部署到 Cloudflare Workers，全球加速
4. 🔧 **开发体验优化**：模块化代码结构，易于二次开发和定制

### 致谢 🙏

- 感谢 [Cantian AI](https://cantian.ai) 团队开发的精准八字排盘核心库
- 感谢 [tyme4ts](https://github.com/6tail/tyme4ts) 提供的专业天文历法计算库
- 感谢所有为中国传统文化数字化做出贡献的开发者们

## ✨ 主要特点

### 🎯 核心价值

- **为 AI 优化**：输出标准 JSON 格式，AI 可以直接理解和分析
- **精准排盘**：继承原项目的天文历法算法，确保数据准确性
- **可视化界面**：直观的表单输入，即时生成八字命盘
- **全球部署**：支持 Cloudflare Workers，全球 300+ 边缘节点加速

### 📦 完整功能

- ✅ 支持公历/农历日期输入
- ✅ 完整的四柱八字信息（年月日时）
- ✅ 十神、纳音、神煞详细分析
- ✅ 大运推算（10 步大运）
- ✅ 刑冲合会关系
- ✅ 黄历查询
- ✅ 一键复制/下载 JSON 数据
- ✅ RESTful API 支持
- ✅ MCP 协议支持（继承自原项目）

## 🚀 快速开始

### 在线试用

部署后访问：`https://bazi.你的域名.workers.dev`

### 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/yuhr123/bazi.git
cd bazi

# 2. 安装依赖
npm install

# 3. 启动服务
npm start

# 4. 在浏览器访问
# http://localhost:8080
```

### 部署到云端（推荐）

一键部署到 Cloudflare Workers（完全免费，每天 10 万次请求额度）：

```bash
# 登录 Cloudflare
npx wrangler login

# 一键部署
npm run cf:deploy
```

部署成功后，你会获得一个全球访问的 URL！

详细部署指南：[CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md)

## 💻 开发指南

### 项目结构

```
bazi/
├── public/              # 前端资源
│   ├── index.html      # 页面结构 (129 行)
│   ├── css/
│   │   └── style.css   # 样式 (310 行)
│   └── js/
│       └── app.js      # 交互逻辑 (176 行)
├── src/                # 后端代码
│   ├── worker.ts       # Cloudflare Workers 入口
│   ├── webServer.ts    # 本地 Web 服务器
│   ├── index.ts        # 八字计算核心
│   └── lib/            # 工具库
├── scripts/
│   └── sync-worker.cjs # 自动同步脚本
└── wrangler.toml       # Cloudflare 配置
```

### 开发工作流

```bash
# 1. 修改前端代码
vim public/css/style.css

# 2. 本地测试
npm run dev:web

# 3. 同步到 Worker（如果修改了 HTML/CSS/JS）
npm run sync:worker

# 4. 部署
npm run cf:deploy
```

### API 文档

#### 生成八字命盘

```bash
POST /api/bazi
Content-Type: application/json

{
  "dateType": "solar",           # "solar" 或 "lunar"
  "solarDatetime": "2000-05-15T12:00:00+08:00",
  "gender": 1,                   # 0-女, 1-男
  "eightCharProviderSect": 2     # 1 或 2（子时配置）
}
```

**响应示例**：

```json
{
  "success": true,
  "data": {
    "性别": "男",
    "阳历": "2000年5月15日 12:00:00",
    "农历": "农历庚辰年四月十二戊午时",
    "八字": "庚辰 辛巳 癸酉 戊午",
    "生肖": "龙",
    "日主": "癸",
    "年柱": { ... },
    "月柱": { ... },
    "日柱": { ... },
    "时柱": { ... },
    "神煞": { ... },
    "大运": { ... },
    "刑冲合会": { ... }
  }
}
```

#### 其他 API

```bash
# 健康检查
GET /api/health

# 获取黄历
POST /api/calendar
{ "solarDatetime": "2024-10-29T12:00:00+08:00" }

# 根据八字获取可能的阳历时间
POST /api/solar-times
{ "bazi": "庚辰 辛巳 癸酉 戊午" }
```

### MCP 协议支持（可选）

如需在 AI 应用（如 Claude Desktop）中使用：

```json
{
  "mcpServers": {
    "Bazi": {
      "command": "npx",
      "args": ["bazi"]
    }
  }
}
```

或使用 HTTP 模式：

```bash
npm run mcp:http
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. 🍴 **Fork 本仓库**
2. 🌿 **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. 💾 **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **推送到分支** (`git push origin feature/AmazingFeature`)
5. 🔃 **发起 Pull Request**

### 贡献方向

- 🐛 **修复 Bug**：发现问题？欢迎提交 PR
- ✨ **新增功能**：有好的想法？一起实现
- 📖 **完善文档**：让文档更清晰
- 🌍 **国际化**：添加多语言支持
- 🎨 **UI 优化**：让界面更美观易用
- 🧪 **测试用例**：提高代码质量

### 行为准则

- 尊重所有贡献者
- 建设性的讨论和反馈
- 保持代码质量和一致性
- 遵循开源协议

## 📊 技术栈

- **后端**: Node.js + TypeScript + Express
- **前端**: 原生 HTML/CSS/JavaScript
- **八字计算**: [tyme4ts](https://github.com/6tail/tyme4ts)
- **部署**: Cloudflare Workers
- **协议**: HTTP API + MCP

## 🔗 相关链接

- 📦 **原项目**: [cantian-ai/bazi-mcp](https://github.com/cantian-ai/bazi-mcp)
- 🌐 **Cantian AI**: [cantian.ai](https://cantian.ai)
- 📚 **天文历法库**: [tyme4ts](https://github.com/6tail/tyme4ts)
- ☁️ **Cloudflare Workers**: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/)

## 📄 许可证

本项目采用 ISC 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 ⭐️！

你的支持是我们持续改进的动力。

---

## 💬 联系方式

- 📧 **Issues**: [GitHub Issues](https://github.com/yuhr123/bazi/issues)
- 🐛 **Bug 反馈**: 请通过 Issues 提交
- 💡 **功能建议**: 欢迎在 Issues 中讨论

---

<div align="center">

**让传统文化与现代技术相遇** 🎋

Made with ❤️ by the Open Source Community

</div>
