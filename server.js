import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const client = new Anthropic();

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.post('/api/explain', async (req, res) => {
  const { orderData } = req.body;
  const { distance, traffic, allocatedTime, suggestedTime, riskReasons = [] } = orderData;
  const added = suggestedTime - allocatedTime;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `你是外卖平台的骑手安全助手。请向骑手解释这次时间调整的原因。

背景：
- 平台原本给这单分配了 ${allocatedTime} 分钟
- AI 安全系统检测到风险后，把时间调整为 ${suggestedTime} 分钟（增加了 ${added} 分钟缓冲）
- 配送距离：${distance}km
- 当前路况：${traffic}
- 检测到的风险因素：${riskReasons.length ? riskReasons.join('、') : '无特殊风险'}

请用2-3句话解释：为什么原来的 ${allocatedTime} 分钟不够、AI 为什么把时间调整到 ${suggestedTime} 分钟。重点说清楚"从${allocatedTime}分钟变成${suggestedTime}分钟"这个变化的原因。语气像朋友解释，不要用技术术语。`,
      }],
    });
    res.json({ explanation: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appeal', async (req, res) => {
  const { orderData, appealReason } = req.body;
  const { distance, traffic, allocatedTime, suggestedTime } = orderData;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `你是外卖平台的申诉处理助手，负责审核骑手的配送时间申诉。

订单信息：
- 配送距离：${distance}公里
- 路况：${traffic}
- 分配时间：${allocatedTime}分钟（系统建议${suggestedTime}分钟）
- 被压缩：${suggestedTime - allocatedTime}分钟

骑手申诉理由：${appealReason}

请给出申诉处理结果，包括：是否支持申诉、处理措施（如时间补偿或维持原判）、简短说明。语气专业但友好，控制在3句话以内。`,
      }],
    });
    res.json({ result: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/report', async (req, res) => {
  const { fatigueLevel, safetyScore, deliveryCount } = req.body;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `你是骑手安全助手。今日数据：疲劳等级${fatigueLevel}、安全积分${safetyScore}分、已接单${deliveryCount}单。用一句温暖的话给骑手今日建议，像朋友提醒，不超过30字。`,
      }],
    });
    res.json({ suggestion: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
