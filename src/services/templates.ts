// 简化版本 - 避免TypeScript编译器误解析HTML字符串中的代码
import type { OutlineItem } from '../types';

export function generateHtml(_templateId: string, outline: OutlineItem[], topic: string): string {
  const slides = outline.map((item, index) => {
    // 简单的动画效果
    const titleAnimation = 'fade-in';
    const contentAnimation = 'slide-in-left';
    
    // 生成幻灯片HTML
    return `
      <div class="slide" id="slide-${index}">
        <div class="slide-content">
          <h2 class="${titleAnimation}" style="animation-delay: 0.1s">${item.title}</h2>
          ${item.content.split('\n').map((p, i) => `
            <p class="${contentAnimation}" style="animation-delay: ${0.2 + i * 0.1}s">${p}</p>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      overflow: hidden;
      height: 100vh;
    }
    .slide {
      position: absolute;
      width: 100%;
      height: 100%;
      display: none;
      padding: 60px;
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
    }
    .slide.active { display: flex; align-items: center; justify-content: center; }
    .slide-content {
      max-width: 900px;
      width: 100%;
      text-align: center;
    }
    h2 {
      font-size: 3rem;
      color: #1e3a8a;
      margin-bottom: 2rem;
    }
    p {
      font-size: 1.5rem;
      color: #475569;
      line-height: 1.8;
      margin-bottom: 1rem;
    }
    
    /* 导航按钮 */
    .nav-buttons {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 20px;
      z-index: 100;
    }
    .nav-btn {
      padding: 12px 24px;
      background: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      color: #1e3a8a;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s;
    }
    .nav-btn:hover {
      background: #1e3a8a;
      color: white;
      transform: translateY(-2px);
    }
    
    /* 幻灯片指示器 */
    .slide-indicator {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 100;
    }
    .indicator-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: all 0.3s;
    }
    .indicator-dot.active {
      background: #1e3a8a;
      transform: scale(1.3);
    }
    
    /* 动画效果 */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fadeIn 0.6s ease forwards; }
    
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .slide-in-left { animation: slideInLeft 0.6s ease forwards; }
  </style>
</head>
<body>
  ${slides}
  
  <!-- 导航 -->
  <div class="slide-indicator" id="indicator"></div>
  <div class="nav-buttons">
    <button class="nav-btn" id="prevBtn">← 上一页</button>
    <button class="nav-btn" id="fullscreenBtn">全屏</button>
    <button class="nav-btn" id="nextBtn">下一页 →</button>
  </div>

  <script>
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const indicator = document.getElementById('indicator');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // 初始化指示器
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goToSlide(i);
      indicator.appendChild(dot);
    });
    
    function goToSlide(index) {
      if (index < 0 || index >= totalSlides) return;
      
      slides[currentIndex].classList.remove('active');
      currentIndex = index;
      slides[currentIndex].classList.add('active');
      
      // 更新指示器
      document.querySelectorAll('.indicator-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }
    
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevSlide();
          break;
      }
    });
    
    // 显示第一页
    goToSlide(0);
  </script>
</body>
</html>`;
}

// 模板配置
export const templates = [
  { id: 'business', name: '商务风格', description: '专业简洁的商务演示' },
  { id: 'creative', name: '创意风格', description: '富有创意的演示设计' },
  { id: 'education', name: '教育风格', description: '适合教学的演示' },
];
