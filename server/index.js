import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const templateStyles = {
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
      outline = JSON.parse(content).outline.map((item, index) => ({
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

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

app.post('/api/generate-slides', async (req, res) => {
  const { templateId, outline, topic } = req.body;

  if (!OPENAI_API_KEY) {
    const template = {
      business: { primaryColor: '#1e40af', secondaryColor: '#3b82f6', backgroundColor: '#ffffff', fontFamily: 'Inter, sans-serif', headingFont: 'PingFang SC, sans-serif', textColor: '#1f2937' },
      academic: { primaryColor: '#059669', secondaryColor: '#10b981', backgroundColor: '#fafafa', fontFamily: 'Georgia, serif', headingFont: 'PingFang SC, sans-serif', textColor: '#374151' },
      creative: { primaryColor: '#7c3aed', secondaryColor: '#a78bfa', backgroundColor: '#0f172a', fontFamily: 'Inter, sans-serif', headingFont: 'PingFang SC, sans-serif', textColor: '#f8fafc' },
      minimal: { primaryColor: '#0891b2', secondaryColor: '#22d3ee', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', headingFont: 'PingFang SC, sans-serif', textColor: '#334155' },
      formal: { primaryColor: '#b91c1c', secondaryColor: '#dc2626', backgroundColor: '#ffffff', fontFamily: 'SimSun, serif', headingFont: 'SimHei, sans-serif', textColor: '#111827' },
    };
    const t = template[templateId] || template.business;
    
    const allSlides = [
      { title: topic, content: '', isTitle: true },
      ...outline,
    ];
    
    const slidesHtml = allSlides
      .map(
        (item, index) => `
    <div class="slide" data-index="${index}">
      ${item.isTitle 
        ? `<h1 class="animate-title">${item.title}</h1><div class="animate-subtitle">点击或按空格键开始</div>` 
        : `<h2>${item.title}</h2><div class="slide-content">${item.content}</div>`
      }
    </div>
  `
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; }
    body {
      font-family: ${t.fontFamily};
      background: ${t.backgroundColor};
      color: ${t.textColor};
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
      font-family: ${t.headingFont};
      color: ${t.primaryColor};
      font-size: 4em;
      margin-bottom: 0.5em;
      text-align: center;
    }
    h2 {
      font-family: ${t.headingFont};
      color: ${t.primaryColor};
      font-size: 2.5em;
      margin-bottom: 0.8em;
      padding-bottom: 0.3em;
      border-bottom: 3px solid ${t.primaryColor};
    }
    .slide-content {
      font-size: 1.4em;
      line-height: 2;
      color: ${t.textColor};
    }
    .slide-content p { margin-bottom: 1em; }
    .slide-content ul { list-style: none; padding-left: 0; }
    .slide-content li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 0.8em;
    }
    .slide-content li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: ${t.primaryColor};
      border-radius: 50%;
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
    }
    .card-title {
      font-size: 1.3em;
      font-weight: bold;
      color: ${t.primaryColor};
      margin-bottom: 10px;
    }
    .card-content {
      font-size: 1em;
      color: ${t.textColor};
      opacity: 0.8;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 40px;
    }
    .stat-item { text-align: center; }
    .stat-value {
      font-size: 3em;
      font-weight: bold;
      color: ${t.primaryColor};
    }
    .stat-label {
      font-size: 1em;
      color: ${t.textColor};
      opacity: 0.7;
      margin-top: 5px;
    }
    .interactive-box {
      background: linear-gradient(135deg, ${t.primaryColor}20 0%, transparent 100%);
      border-radius: 16px;
      padding: 30px;
      margin-top: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .interactive-box.expanded {
      background: linear-gradient(135deg, ${t.primaryColor}30 0%, transparent 100%);
    }
    .expandable-title {
      font-size: 1.3em;
      font-weight: bold;
      color: ${t.primaryColor};
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
      color: ${t.textColor};
    }
    .interactive-box.expanded .expandable-content { max-height: 500px; }
    .interactive-box.expanded .expand-icon { transform: rotate(180deg); }
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
      background: ${t.primaryColor};
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1em;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(${hexToRgb(t.primaryColor)}, 0.3);
    }
    .control-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(${hexToRgb(t.primaryColor)}, 0.4);
    }
    .control-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .progress {
      position: fixed;
      bottom: 110px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2em;
      color: ${t.primaryColor};
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .progress-dots { display: flex; gap: 6px; }
    .progress-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(${hexToRgb(t.primaryColor)}, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .progress-dot.active {
      background: ${t.primaryColor};
      transform: scale(1.3);
    }
    .fullscreen-btn {
      position: fixed;
      top: 30px;
      right: 30px;
      padding: 12px 22px;
      background: ${t.primaryColor};
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      z-index: 100;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(${hexToRgb(t.primaryColor)}, 0.3);
    }
    .fullscreen-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(${hexToRgb(t.primaryColor)}, 0.4);
    }
    .hint {
      position: fixed;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.9em;
      color: ${t.textColor};
      opacity: 0.5;
    }
    .mouse-follower {
      position: fixed;
      width: 20px;
      height: 20px;
      background: ${t.primaryColor};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease-out;
      opacity: 0;
    }
    .mouse-follower.active { opacity: 0.6; }
    .animation-panel {
      position: fixed;
      top: 30px;
      left: 30px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 12px;
      padding: 15px;
      z-index: 1000;
      color: white;
      min-width: 200px;
    }
    .animation-panel.hidden { display: none; }
    .animation-panel-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: ${t.primaryColor};
    }
    .animation-select {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: none;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
    }
    .animation-select option { background: #1a1a1a; color: white; }
    .animation-btn {
      width: 100%;
      padding: 8px;
      margin-bottom: 5px;
      border: none;
      border-radius: 6px;
      background: ${t.primaryColor};
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .animation-btn:hover { background: ${t.secondaryColor}; }
    .animation-btn.secondary { background: rgba(255, 255, 255, 0.2); }
    .animation-btn.secondary:hover { background: rgba(255, 255, 255, 0.3); }
    .toggle-panel-btn {
      position: fixed;
      top: 30px;
      left: 30px;
      padding: 10px 15px;
      background: ${t.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      z-index: 999;
      transition: all 0.2s ease;
      font-size: 14px;
    }
    .float-animation { animation: float 3s ease-in-out infinite; }
    .bounce-animation { animation: bounce 1s ease infinite; }
    .shake-animation { animation: shake 0.5s ease-in-out; }
    .spin-animation { animation: spin 1s linear infinite; }
    .pulse-animation { animation: pulse 2s ease-in-out infinite; }
    .glow-animation { animation: glow 2s ease-in-out infinite; }
    .wiggle-animation { animation: wiggle 0.5s ease-in-out infinite; }
    .slide-in-left { animation: slideInLeft 0.6s ease forwards; }
    .slide-in-right { animation: slideInRight 0.6s ease forwards; }
    .slide-in-top { animation: slideInTop 0.6s ease forwards; }
    .slide-in-bottom { animation: slideInBottom 0.6s ease forwards; }
    .fade-in { animation: fadeIn 0.6s ease forwards; }
    .scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .rotate-in { animation: rotateIn 0.6s ease forwards; }
    .bounce-in { animation: bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-title { animation: titleScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-subtitle { animation: fadeInUp 0.6s ease 0.4s forwards; opacity: 0; }
    .hover-bold { transition: font-weight 0.3s ease; }
    .hover-bold:hover { font-weight: bold; }
    .draggable { cursor: move; user-select: none; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes titleScale {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px ${t.primaryColor}; }
      50% { box-shadow: 0 0 20px ${t.primaryColor}, 0 0 30px ${t.secondaryColor}; }
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInTop {
      from { opacity: 0; transform: translateY(-100px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInBottom {
      from { opacity: 0; transform: translateY(100px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes rotateIn {
      from { opacity: 0; transform: rotate(-180deg) scale(0.5); }
      to { opacity: 1; transform: rotate(0deg) scale(1); }
    }
    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    @media print {
      .controls, .progress, .fullscreen-btn, .hint, .animation-panel, .toggle-panel-btn { display: none !important; }
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
  
  <div class="hint">按 ESC 退出 | ← → 键翻页 | 空格键下一页 | A 键打开动画面板</div>
  
  <button class="toggle-panel-btn" id="togglePanelBtn">🎬 动画</button>
  
  <div class="animation-panel hidden" id="animationPanel">
    <div class="animation-panel-title">🎬 动画控制面板</div>
    <select class="animation-select" id="animationSelect">
      <option value="">选择动画效果</option>
      <option value="fadeIn">淡入</option>
      <option value="slideInLeft">从左飞入</option>
      <option value="slideInRight">从右飞入</option>
      <option value="slideInTop">从上方飞入</option>
      <option value="slideInBottom">从下方飞入</option>
      <option value="scaleIn">缩放进入</option>
      <option value="rotateIn">旋转进入</option>
      <option value="bounceIn">弹跳进入</option>
      <option value="float">浮动</option>
      <option value="pulse">脉冲</option>
      <option value="glow">发光</option>
      <option value="shake">摇摆</option>
      <option value="wiggle">扭动</option>
      <option value="spin">旋转</option>
    </select>
    <button class="animation-btn" id="applyAnimationBtn">应用到当前元素</button>
    <button class="animation-btn" id="applyAllBtn">应用到所有元素</button>
    <button class="animation-btn secondary" id="clearAnimationBtn">清除动画</button>
    <button class="animation-btn secondary" id="toggleMouseFollowBtn">🔴 鼠标跟随</button>
    <button class="animation-btn secondary" id="toggleHoverBoldBtn">🔵 悬停加粗</button>
    <button class="animation-btn secondary" id="toggleDraggableBtn">🟢 可拖拽</button>
  </div>

  <div class="mouse-follower" id="mouseFollower"></div>

  <script>
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const progressText = document.getElementById('progressText');
    const progressDots = document.getElementById('progressDots');
    const slidesContainer = document.getElementById('slidesContainer');
    const togglePanelBtn = document.getElementById('togglePanelBtn');
    const animationPanel = document.getElementById('animationPanel');
    const animationSelect = document.getElementById('animationSelect');
    const applyAnimationBtn = document.getElementById('applyAnimationBtn');
    const applyAllBtn = document.getElementById('applyAllBtn');
    const clearAnimationBtn = document.getElementById('clearAnimationBtn');
    const toggleMouseFollowBtn = document.getElementById('toggleMouseFollowBtn');
    const toggleHoverBoldBtn = document.getElementById('toggleHoverBoldBtn');
    const toggleDraggableBtn = document.getElementById('toggleDraggableBtn');
    const mouseFollower = document.getElementById('mouseFollower');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let mouseFollowEnabled = false;
    let hoverBoldEnabled = false;
    let draggableEnabled = false;
    let draggedElement = null;
    let dragOffset = { x: 0, y: 0 };

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
      const animatedElements = slide.querySelectorAll('h1, h2, .slide-content, .card, .stat-item, .interactive-box');
      animatedElements.forEach((el, i) => {
        el.style.opacity = '0';
        setTimeout(() => {
          el.style.opacity = '1';
          el.classList.add('fade-in');
        }, i * 150);
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

    function applyAnimation(animationType, elements) {
      const animations = {
        fadeIn: 'fade-in',
        slideInLeft: 'slide-in-left',
        slideInRight: 'slide-in-right',
        slideInTop: 'slide-in-top',
        slideInBottom: 'slide-in-bottom',
        scaleIn: 'scale-in',
        rotateIn: 'rotate-in',
        bounceIn: 'bounce-in',
        float: 'float-animation',
        pulse: 'pulse-animation',
        glow: 'glow-animation',
        shake: 'shake-animation',
        wiggle: 'wiggle-animation',
        spin: 'spin-animation',
      };
      
      const animationClass = animations[animationType];
      if (!animationClass) return;
      
      elements.forEach(el => {
        clearAnimation(el);
        el.classList.add(animationClass);
      });
    }

    function clearAnimation(el) {
      const animationClasses = [
        'fade-in', 'slide-in-left', 'slide-in-right', 'slide-in-top', 'slide-in-bottom',
        'scale-in', 'rotate-in', 'bounce-in', 'float-animation', 'pulse-animation',
        'glow-animation', 'shake-animation', 'wiggle-animation', 'spin-animation'
      ];
      animationClasses.forEach(cls => el.classList.remove(cls));
    }

    function clearAllAnimations() {
      const allElements = document.querySelectorAll('h1, h2, p, li, .card, .stat-item, .interactive-box');
      allElements.forEach(el => clearAnimation(el));
    }

    function toggleMouseFollow() {
      mouseFollowEnabled = !mouseFollowEnabled;
      mouseFollower.classList.toggle('active', mouseFollowEnabled);
      toggleMouseFollowBtn.textContent = mouseFollowEnabled ? '🟢 鼠标跟随' : '🔴 鼠标跟随';
    }

    function toggleHoverBold() {
      hoverBoldEnabled = !hoverBoldEnabled;
      const textElements = document.querySelectorAll('p, li, .card-content');
      textElements.forEach(el => el.classList.toggle('hover-bold', hoverBoldEnabled));
      toggleHoverBoldBtn.textContent = hoverBoldEnabled ? '🟢 悬停加粗' : '🔵 悬停加粗';
    }

    function toggleDraggable() {
      draggableEnabled = !draggableEnabled;
      const elements = document.querySelectorAll('.card, .stat-item');
      elements.forEach(el => el.classList.toggle('draggable', draggableEnabled));
      toggleDraggableBtn.textContent = draggableEnabled ? '🟢 可拖拽' : '🔵 可拖拽';
    }

    function nextSlide() { if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1); }
    function prevSlide() { if (currentIndex > 0) goToSlide(currentIndex - 1); }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.textContent = '退出全屏';
      } else {
        document.exitFullscreen();
        fullscreenBtn.textContent = '全屏演示';
      }
    }

    togglePanelBtn.addEventListener('click', () => {
      animationPanel.classList.toggle('hidden');
      togglePanelBtn.style.display = animationPanel.classList.contains('hidden') ? 'block' : 'none';
    });

    applyAnimationBtn.addEventListener('click', () => {
      const animationType = animationSelect.value;
      if (!animationType) return;
      const currentSlide = slides[currentIndex];
      const elements = currentSlide.querySelectorAll('h2, p, li, .card');
      applyAnimation(animationType, elements);
    });

    applyAllBtn.addEventListener('click', () => {
      const animationType = animationSelect.value;
      if (!animationType) return;
      const allElements = document.querySelectorAll('h2, p, li, .card');
      applyAnimation(animationType, allElements);
    });

    clearAnimationBtn.addEventListener('click', clearAllAnimations);
    toggleMouseFollowBtn.addEventListener('click', toggleMouseFollow);
    toggleHoverBoldBtn.addEventListener('click', toggleHoverBold);
    toggleDraggableBtn.addEventListener('click', toggleDraggable);

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('mousemove', (e) => {
      if (mouseFollowEnabled) {
        mouseFollower.style.left = e.clientX - 10 + 'px';
        mouseFollower.style.top = e.clientY - 10 + 'px';
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!draggableEnabled) return;
      const target = e.target.closest('.draggable');
      if (target) {
        draggedElement = target;
        dragOffset = {
          x: e.clientX - draggedElement.getBoundingClientRect().left,
          y: e.clientY - draggedElement.getBoundingClientRect().top
        };
        draggedElement.style.position = 'fixed';
        draggedElement.style.zIndex = '1000';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!draggedElement) return;
      draggedElement.style.left = e.clientX - dragOffset.x + 'px';
      draggedElement.style.top = e.clientY - dragOffset.y + 'px';
    });

    document.addEventListener('mouseup', () => {
      draggedElement = null;
    });

    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
          e.preventDefault(); nextSlide(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
          e.preventDefault(); prevSlide(); break;
        case 'Escape':
          if (document.fullscreenElement) toggleFullscreen();
          else animationPanel.classList.add('hidden'), togglePanelBtn.style.display = 'block';
          break;
        case 'a': case 'A':
          e.preventDefault();
          animationPanel.classList.toggle('hidden');
          togglePanelBtn.style.display = animationPanel.classList.contains('hidden') ? 'block' : 'none';
          break;
        case 'f': case 'F':
          e.preventDefault(); toggleMouseFollow(); break;
        case 'h': case 'H':
          e.preventDefault(); toggleHoverBold(); break;
        case 'd': case 'D':
          e.preventDefault(); toggleDraggable(); break;
      }
    });

    document.querySelectorAll('.interactive-box').forEach(box => {
      box.addEventListener('click', () => box.classList.toggle('expanded'));
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
1. 使用单个HTML文件，包含内联CSS和内联JavaScript
2. 每个页面使用class="slide"的div包裹，默认隐藏，添加class="active"显示
3. 必须包含以下功能：
   - 幻灯片导航按钮（上一页、下一页）
   - 全屏按钮
   - 键盘快捷键（← → 键、空格键、PageUp/PageDown翻页，ESC退出全屏）
   - 进度显示（x / y）和进度点
   - 打印时显示所有页面
4. 添加丰富的动画效果：
   - 淡入淡出过渡
   - 滑动翻页效果（从左/右/上/下飞入）
   - 标题缩放动画
   - 浮动、脉冲、发光、摇摆、扭动、旋转等动画
   - 弹跳进入、缩放进入、旋转进入
5. 支持交互式元素：
   - 可点击展开/折叠的内容框
   - 悬停效果的卡片
   - 点击幻灯片任意位置翻页
6. 添加动画控制面板：
   - 动画选择下拉菜单（包含所有动画效果）
   - 应用到当前元素按钮
   - 应用到所有元素按钮
   - 清除动画按钮
   - 鼠标跟随开关
   - 悬停加粗开关
   - 可拖拽开关
7. 不要使用外部依赖
8. 只返回HTML代码，不要有其他说明`,
          },
          {
            role: 'user',
            content: `主题：${topic}

风格：${templateStyles[templateId] || templateStyles.business}

大纲：
${outline.map((item, i) => `${i + 1}. ${item.title}\n   ${item.content}`).join('\n')}

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
