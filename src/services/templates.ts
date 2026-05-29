import type { Template, OutlineItem } from '../types';

export const templates: Template[] = [
  {
    id: 'business',
    name: '商务专业',
    description: '深蓝+白底，适合商业汇报',
    preview: '/templates/business.html',
    cssVariables: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    },
  },
  {
    id: 'academic',
    name: '学术教育',
    description: '清晰层级，适合课程讲解',
    preview: '/templates/academic.html',
    cssVariables: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      fontFamily: 'Georgia, serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#fafafa',
      textColor: '#374151',
    },
  },
  {
    id: 'creative',
    name: '创意展示',
    description: '大图背景，适合产品发布',
    preview: '/templates/creative.html',
    cssVariables: {
      primaryColor: '#7c3aed',
      secondaryColor: '#a78bfa',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
    },
  },
  {
    id: 'minimal',
    name: '清新简约',
    description: '大量留白，适合个人分享',
    preview: '/templates/minimal.html',
    cssVariables: {
      primaryColor: '#0891b2',
      secondaryColor: '#22d3ee',
      fontFamily: 'system-ui, sans-serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#f8fafc',
      textColor: '#334155',
    },
  },
  {
    id: 'formal',
    name: '政府公文',
    description: '正式庄重，适合政策宣讲',
    preview: '/templates/formal.html',
    cssVariables: {
      primaryColor: '#b91c1c',
      secondaryColor: '#dc2626',
      fontFamily: 'SimSun, serif',
      headingFont: 'SimHei, Microsoft YaHei, sans-serif',
      backgroundColor: '#ffffff',
      textColor: '#111827',
    },
  },
];

export function getTemplateById(id: string): Template {
  return templates.find((t) => t.id === id) || templates[0];
}

export function generateHtml(templateId: string, outline: OutlineItem[], topic: string): string {
  const template = getTemplateById(templateId);
  const { primaryColor, backgroundColor, textColor, fontFamily, headingFont } = template.cssVariables;

  const slidesHtml = outline
    .map(
      (item) => `
    <div class="slide">
      <h2>${item.title}</h2>
      <p>${item.content}</p>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      background: ${backgroundColor};
      color: ${textColor};
      line-height: 1.6;
    }
    .slide {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 80px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    h1 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 3em;
      margin-bottom: 0.5em;
    }
    h2 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 2.2em;
      margin: 1em 0 0.5em;
      border-bottom: 3px solid ${primaryColor};
      padding-bottom: 0.3em;
    }
    p {
      font-size: 1.3em;
      line-height: 1.8;
      margin-bottom: 1em;
      color: ${textColor};
    }
    @media print {
      .slide { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="slide">
    <h1>${topic}</h1>
  </div>
  ${slidesHtml}
</body>
</html>`;
}
