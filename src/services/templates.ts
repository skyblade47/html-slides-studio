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

  const allSlides = [
    { title: topic, content: '', isTitle: true },
    ...outline,
  ];

  const slidesHtml = allSlides
    .map(
      (item, index) => `
    <div class="slide" data-index="${index}">
      ${item.isTitle ? `<h1>${item.title}</h1>` : `<h2>${item.title}</h2><p>${item.content}</p>`}
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
    html, body { height: 100%; overflow: hidden; }
    body {
      font-family: ${fontFamily};
      background: ${backgroundColor};
      color: ${textColor};
      line-height: 1.6;
    }
    .slides-container {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .slide {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 80px;
      height: 100vh;
      display: none;
      flex-direction: column;
      justify-content: center;
    }
    .slide.active { display: flex; }
    h1 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 3.5em;
      margin-bottom: 0.5em;
      text-align: center;
    }
    h2 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 2.5em;
      margin-bottom: 0.8em;
      padding-bottom: 0.3em;
      border-bottom: 3px solid ${primaryColor};
    }
    p {
      font-size: 1.4em;
      line-height: 2;
      color: ${textColor};
    }
    .controls {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
      z-index: 100;
    }
    .control-btn {
      padding: 12px 24px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1em;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .control-btn:hover { opacity: 0.85; }
    .control-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .progress {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2em;
      color: ${primaryColor};
      opacity: 0.8;
    }
    .fullscreen-btn {
      position: fixed;
      top: 30px;
      right: 30px;
      padding: 10px 18px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      z-index: 100;
    }
    .exit-btn {
      position: fixed;
      top: 30px;
      left: 30px;
      padding: 10px 18px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      z-index: 100;
    }
    .hint {
      position: fixed;
      bottom: 130px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.9em;
      color: ${textColor};
      opacity: 0.6;
    }
    @media print {
      .controls, .progress, .fullscreen-btn, .exit-btn, .hint { display: none !important; }
      .slide { display: flex !important; page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="slides-container">
    ${slidesHtml}
  </div>
  
  <div class="progress" id="progress">1 / ${allSlides.length}</div>
  
  <div class="controls">
    <button class="control-btn" id="prevBtn">← 上一页</button>
    <button class="control-btn" id="nextBtn">下一页 →</button>
  </div>
  
  <button class="fullscreen-btn" id="fullscreenBtn">全屏</button>
  
  <div class="hint">按 ESC 退出 | ← → 键翻页 | 空格键下一页</div>

  <script>
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const progress = document.getElementById('progress');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');
      currentIndex = index;
      progress.textContent = (index + 1) + ' / ' + totalSlides;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === totalSlides - 1;
    }

    function nextSlide() {
      if (currentIndex < totalSlides - 1) showSlide(currentIndex + 1);
    }

    function prevSlide() {
      if (currentIndex > 0) showSlide(currentIndex - 1);
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.textContent = '退出全屏';
      } else {
        document.exitFullscreen();
        fullscreenBtn.textContent = '全屏';
      }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          if (document.fullscreenElement) toggleFullscreen();
          break;
      }
    });

    showSlide(0);
  </script>
</body>
</html>`;
}
