# 外卖骑手算法透明助手

一个让骑手真正看懂平台算法的 Web App Demo。

**🔗 Live Demo：** *(部署后填入 Railway 地址)*

---

## 功能

| 模块 | 说明 |
|------|------|
| 🏠 实时风险评分 | 综合路况、疲劳、天气的动态风险仪表盘 |
| 📦 订单风险卡片 | 每单展示平台原时效 → AI 安全调整后时间，附风险原因标签 |
| 🤖 查看 AI 解释 | Claude 用自然语言解释为什么时间从 X 变成 Y |
| 📣 骑手反馈/申诉 | 选择路况异常/疲劳/出餐慢/地址不清，AI 给出处理结果 |
| 👤 我的安全报告 | 积分明细、激励成长轨道、HR 绿色通道 |

## 技术栈

- **前端**：React 18 (CDN) + Tailwind CSS (CDN)，零构建步骤
- **后端**：Node.js + Express
- **AI**：Anthropic Claude (`claude-sonnet-4-6`)

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 配置 API Key
cp .env.example .env
# 编辑 .env，填入你的 ANTHROPIC_API_KEY

# 3. 启动
ANTHROPIC_API_KEY=你的密钥 npm start

# 4. 浏览器打开
open http://localhost:3000
```

## 项目结构

```
delivery-transparency/
├── server.js          # Express 后端，三个 API 端点
├── public/
│   └── index.html     # React 单页应用
└── package.json
```
