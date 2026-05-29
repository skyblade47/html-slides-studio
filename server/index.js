import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const templateStyles: Record<string, string> = {
  business: '商务专业风格：深蓝色主调，白底，简洁扁平，数据图表优先',
  academic: '学术教育风格：清晰层级，图表+公式，温和配色',
  creative: '创意展示风格：大图背景，渐变色彩，动感排版',
  minimal: '清新简约风格：大量留白，柔和色调，极简图标',
  formal: '政府公文风格：正式庄重，规范化排版',
};

app.post('/api/generate-outline', async (req, res) => {
  const { topic } = req.body;

  if (!OPENAI_API_KEY) {
    const mockOutline = [
      { id: '1', title: '简介', content: '介绍主题背景和重要性' },
      { id: '2', title: '主要内容', content: '核心要点分析' },
      { id: '3', title: '案例分析', content: '实际应用场景' },
      { id: '4', title: '总结', content: '关键结论和建议' },
    ];
    return res.json({ outline: mockOutline });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的演示文稿策划专家。请为用户提供的大纲生成4-6个页面的结构。
每个页面需要包含标题和简要内容说明。
只返回JSON格式，不要包含其他内容。`,
          },
          {
            role: 'user',
            content: `主题：${topic}\n\n请生成演示文稿大纲。`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let outline;
    try {
      outline = JSON.parse(content).outline.map((item: any, index: number) => ({
        id: String(index + 1),
        title: item.title,
        content: item.content || '',
      }));
    } catch {
      outline = [
        { id: '1', title: '简介', content: '介绍主题背景和重要性' },
        { id: '2', title: '主要内容', content: '核心要点分析' },
        { id: '3', title: '案例分析', content: '实际应用场景' },
        { id: '4', title: '总结', content: '关键结论和建议' },
      ];
    }

    res.json({ outline });
  } catch (error) {
    console.error('生成大纲失败:', error);
    res.status(500).json({ error: '生成大纲失败' });
  }
});

app.post('/api/generate-slides', async (req, res) => {
  const { templateId, outline, topic } = req.body;

  if (!OPENAI_API_KEY) {
    const template = {
      business: { primaryColor: '#1e40af', backgroundColor: '#ffffff', fontFamily: 'Inter, sans-serif', headingFont: 'PingFang SC, sans-serif', textColor: '#1f2937' },
      academic: { primaryColor: '#059669', backgroundColor: '#fafafa', fontFamily: 'Georgia, serif', headingFont: 'PingFang SC, sans-serif', textColor: '#374151' },
      creative: { primaryColor: '#7c3aed', backgroundColor: '#0f172a', fontFamily: 'Inter, sans-serif', headingFont: 'PingFang SC, sans-serif', textColor: '#f8fafc' },
      minimal: { primaryColor: '#0891b2', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', headingFont: 'PingFang SC, sans-serif', textColor: '#334155' },
      formal: { primaryColor: '#b91c1c', backgroundColor: '#ffffff', fontFamily: 'SimSun, serif', headingFont: 'SimHei, sans-serif', textColor: '#111827' },
    };
    const t = template[templateId as keyof typeof template] || template.business;
    const slidesHtml = outline.map((item: any) => `<div class="slide"><h2>${item.title}</h2><p>${item.content}</p></div>`).join('');
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${t.fontFamily}; background: ${t.backgroundColor}; color: ${t.textColor}; }
    .slide { max-width: 1200px; margin: 0 auto; padding: 60px 80px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
    h1 { font-family: ${t.headingFont}; color: ${t.primaryColor}; font-size: 3em; margin-bottom: 0.5em; }
    h2 { font-family: ${t.headingFont}; color: ${t.primaryColor}; font-size: 2.2em; margin: 1em 0 0.5em; border-bottom: 3px solid ${t.primaryColor}; padding-bottom: 0.3em; }
    p { font-size: 1.3em; line-height: 1.8; margin-bottom: 1em; color: ${t.textColor}; }
    @media print { .slide { page-break-after: always; } }
  </style>
</head>
<body>
  <div class="slide"><h1>${topic}</h1></div>
  ${slidesHtml}
</body>
</html>`;
    return res.json({ html });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的HTML演示文稿生成专家。请根据提供的大纲和风格要求，生成完整的HTML代码。

要求：
1. 使用单个HTML文件，包含内联CSS
2. 每个页面使用class="slide"的div包裹
3. 支持打印和响应式布局
4. 不要使用外部依赖
5. 只返回HTML代码，不要有其他说明`,
          },
          {
            role: 'user',
            content: `主题：${topic}

风格：${templateStyles[templateId] || templateStyles.business}

大纲：
${outline.map((item: any, i: number) => `${i + 1}. ${item.title}\n   ${item.content}`).join('\n')}

请生成完整的HTML代码。`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let html = data.choices[0].message.content;

    if (html.includes('```html')) {
      html = html.replace(/```html\n?/, '').replace(/\n?```$/, '');
    }

    res.json({ html });
  } catch (error) {
    console.error('生成演示失败:', error);
    res.status(500).json({ error: '生成演示失败' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API服务器运行在 http://localhost:${PORT}`);
});
