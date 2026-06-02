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
      ${item.isTitle 
        ? `<h1 class="title-fade-in">${item.title}</h1><div class="subtitle-fade-in">点击或按空格键开始</div>` 
        : `<h2 class="slide-heading">${item.title}</h2><div class="slide-content">${item.content}</div>`
      }
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
      position: relative;
    }
    .slide {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 80px;
      height: 100vh;
      display: none;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease;
    }
    .slide.active {
      display: flex;
      transform: translateX(0);
      opacity: 1;
      z-index: 10;
    }
    .slide.incoming {
      display: flex;
      transform: translateX(100%);
      opacity: 0;
    }
    .slide.outgoing {
      display: flex;
      transform: translateX(-100%);
      opacity: 0;
    }
    h1 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 4em;
      margin-bottom: 0.5em;
      text-align: center;
      animation: titleScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      opacity: 0;
    }
    .subtitle-fade-in {
      text-align: center;
      color: ${textColor};
      opacity: 0.6;
      font-size: 1.2em;
      animation: fadeInUp 0.6s ease 0.4s forwards;
      opacity: 0;
    }
    h2 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 2.5em;
      margin-bottom: 0.8em;
      padding-bottom: 0.3em;
      border-bottom: 3px solid ${primaryColor};
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
    }
    .slide-content {
      font-size: 1.4em;
      line-height: 2;
      color: ${textColor};
      animation: fadeInUp 0.5s ease 0.2s forwards;
      opacity: 0;
    }
    .slide-content p {
      margin-bottom: 1em;
      animation: fadeInUp 0.5s ease forwards;
    }
    .slide-content ul {
      list-style: none;
      padding-left: 0;
    }
    .slide-content li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 0.8em;
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
    }
    .slide-content li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: ${primaryColor};
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 25px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
    }
    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    .card-title {
      font-size: 1.3em;
      font-weight: bold;
      color: ${primaryColor};
      margin-bottom: 10px;
    }
    .card-content {
      font-size: 1em;
      color: ${textColor};
      opacity: 0.8;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 40px;
    }
    .stat-item {
      text-align: center;
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
    }
    .stat-value {
      font-size: 3em;
      font-weight: bold;
      color: ${primaryColor};
      animation: countUp 2s ease forwards;
    }
    .stat-label {
      font-size: 1em;
      color: ${textColor};
      opacity: 0.7;
      margin-top: 5px;
    }
    .interactive-box {
      background: linear-gradient(135deg, ${primaryColor}20 0%, transparent 100%);
      border-radius: 16px;
      padding: 30px;
      margin-top: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
    }
    .interactive-box:hover {
      transform: scale(1.02);
      box-shadow: 0 10px 30px rgba(${hexToRgb(primaryColor)}, 0.2);
    }
    .interactive-box.expanded {
      background: linear-gradient(135deg, ${primaryColor}30 0%, transparent 100%);
    }
    .expandable-title {
      font-size: 1.3em;
      font-weight: bold;
      color: ${primaryColor};
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .expand-icon {
      font-size: 1.5em;
      transition: transform 0.3s ease;
    }
    .expandable-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease;
      margin-top: 15px;
      color: ${textColor};
    }
    .interactive-box.expanded .expandable-content {
      max-height: 500px;
    }
    .interactive-box.expanded .expand-icon {
      transform: rotate(180deg);
    }
    .progress-bar-container {
      height: 8px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      margin-top: 20px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, ${primaryColor}, ${primaryColor}cc);
      border-radius: 4px;
      animation: progressAnimation 2s ease forwards;
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
      padding: 14px 28px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1em;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(${hexToRgb(primaryColor)}, 0.3);
    }
    .control-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(${hexToRgb(primaryColor)}, 0.4);
    }
    .control-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .control-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none;
    }
    .progress {
      position: fixed;
      bottom: 110px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2em;
      color: ${primaryColor};
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .progress-dots {
      display: flex;
      gap: 6px;
    }
    .progress-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(${hexToRgb(primaryColor)}, 0.3);
      transition: all 0.3s ease;
    }
    .progress-dot.active {
      background: ${primaryColor};
      transform: scale(1.3);
    }
    .fullscreen-btn {
      position: fixed;
      top: 30px;
      right: 30px;
      padding: 12px 22px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      z-index: 100;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(${hexToRgb(primaryColor)}, 0.3);
    }
    .fullscreen-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(${hexToRgb(primaryColor)}, 0.4);
    }
    .hint {
      position: fixed;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.9em;
      color: ${textColor};
      opacity: 0.5;
      animation: fadeIn 2s ease;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 0.5; }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes titleScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes pulse {
      0%, 100% {
        transform: translateY(-50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translateY(-50%) scale(1.3);
        opacity: 0.7;
      }
    }
    @keyframes countUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes progressAnimation {
      from {
        width: 0%;
      }
      to {
        width: 100%;
      }
    }
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @media print {
      .controls, .progress, .fullscreen-btn, .hint { display: none !important; }
      .slide { display: flex !important; page-break-after: always; position: relative; }
    }
  </style>
</head>
<body>
  <div class="slides-container" id="slidesContainer">
    ${slidesHtml}
  </div>
  
  <div class="progress" id="progress">
    <span id="progressText">1 / ${allSlides.length}</span>
    <div class="progress-dots" id="progressDots"></div>
  </div>
  
  <div class="controls">
    <button class="control-btn" id="prevBtn">← 上一页</button>
    <button class="control-btn" id="nextBtn">下一页 →</button>
  </div>
  
  <button class="fullscreen-btn" id="fullscreenBtn">全屏演示</button>
  
  <div class="hint">按 ESC 退出 | ← → 键翻页 | 空格键下一页</div>

  <script>
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const progressText = document.getElementById('progressText');
    const progressDots = document.getElementById('progressDots');
    const slidesContainer = document.getElementById('slidesContainer');
    let currentIndex = 0;
    const totalSlides = slides.length;

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      progressDots.appendChild(dot);
    }

    function updateProgress() {
      progressText.textContent = (currentIndex + 1) + ' / ' + totalSlides;
      document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalSlides - 1;
    }

    function goToSlide(index) {
      if (index === currentIndex) return;
      
      const currentSlide = slides[currentIndex];
      const nextSlide = slides[index];
      
      currentSlide.classList.add(index > currentIndex ? 'outgoing' : 'incoming');
      nextSlide.classList.remove('active', 'outgoing', 'incoming');
      nextSlide.classList.add('active');
      
      setTimeout(() => {
        currentSlide.classList.remove('active', 'outgoing', 'incoming');
        currentIndex = index;
        updateProgress();
        animateSlideContent(index);
      }, 600);
    }

    function animateSlideContent(index) {
      const slide = slides[index];
      const animatedElements = slide.querySelectorAll('h2, .slide-content, .card, .stat-item, .interactive-box');
      animatedElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.animationDelay = (i * 0.1) + 's';
        setTimeout(() => {
          el.style.opacity = '';
          el.style.animationDelay = '';
        }, 100);
      });
      
      animateNumbers();
    }

    function animateNumbers() {
      const statValues = document.querySelectorAll('.stat-value');
      statValues.forEach(el => {
        const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
        if (isNaN(target)) return;
        
        let current = 0;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const interval = duration / steps;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = Math.round(target).toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = Math.round(current).toLocaleString();
          }
        }, interval);
      });
    }

    function nextSlide() {
      if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      if (currentIndex > 0) goToSlide(currentIndex - 1);
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.textContent = '退出全屏';
      } else {
        document.exitFullscreen();
        fullscreenBtn.textContent = '全屏演示';
      }
    }

    slidesContainer.addEventListener('click', (e) => {
      if (e.target === slidesContainer || e.target.closest('.slide')) {
        nextSlide();
      }
    });

    document.querySelectorAll('.interactive-box').forEach(box => {
      box.addEventListener('click', () => {
        box.classList.toggle('expanded');
      });
    });

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
    function showSlide(index) {
      slides[index].classList.add('active');
      currentIndex = index;
      updateProgress();
      animateSlideContent(index);
    }
  </script>
</body>
</html>`;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}
