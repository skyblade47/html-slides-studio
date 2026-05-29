export interface GenerateOutlineRequest {
  topic: string;
}

export interface GenerateOutlineResponse {
  outline: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export interface GenerateSlidesRequest {
  templateId: string;
  outline: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  topic: string;
}

export interface GenerateSlidesResponse {
  html: string;
}

export async function generateOutline(request: GenerateOutlineRequest): Promise<GenerateOutlineResponse> {
  const response = await fetch('/api/generate-outline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('生成大纲失败');
  }

  return response.json();
}

export async function generateSlides(request: GenerateSlidesRequest): Promise<GenerateSlidesResponse> {
  const response = await fetch('/api/generate-slides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('生成演示失败');
  }

  return response.json();
}

export function buildOutlinePrompt(topic: string): string {
  return `请为以下主题创建一个演示文稿大纲。

主题：${topic}

请生成4-6个页面的大纲，每个页面包含标题和简要内容说明。
以JSON格式返回，格式如下：
{
  "outline": [
    {"id": "1", "title": "页面标题", "content": "页面内容简介"},
    ...
  ]
}`;
}

export function buildSlidesPrompt(topic: string, outline: any[], template: any): string {
  return `请根据以下大纲和模板风格，为每个页面生成详细内容。

主题：${topic}

大纲：
${outline.map((item, i) => `${i + 1}. ${item.title}: ${item.content}`).join('\n')}

模板风格：
- 主色调：${template.cssVariables.primaryColor}
- 背景色：${template.cssVariables.backgroundColor}
- 正文字体：${template.cssVariables.fontFamily}
- 标题字体：${template.cssVariables.headingFont}

请生成完整的HTML代码，包含每个页面的详细内容。`;
}
