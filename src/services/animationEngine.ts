/**
 * AnimationEngine - 统一动画引擎
 * 提供统一的动画接口，支持CSS动画和交互动画
 * 
 * @version 1.0.0
 * @description 为HTML演示文稿提供高性能、场景适配的动画解决方案
 */

// 动画配置接口
export interface AnimationConfig {
  className: string;
  duration: number;
  delay?: number;
  easing?: string;
}

export interface AnimationPlan {
  scenario: 'professional' | 'creative' | 'academic' | 'marketing';
  pages: PageAnimation[];
  css: string;
  validation?: {
    valid: boolean;
    message?: string;
    suggestion?: string;
  };
}

export interface PageAnimation {
  pageId: string;
  contentType: 'title' | 'subtitle' | 'content' | 'list' | 'chart' | 'image' | 'summary';
  animation: {
    class: string;
    duration: number;
    delay: number;
  };
}

// ============================================
// 动画引擎核心类
// ============================================

export class AnimationEngine {
  /**
   * 播放入场动画
   */
  public playEntrance(
    elements: HTMLElement | HTMLElement[] | NodeListOf<Element> | Element[],
    config: AnimationConfig
  ): void {
    const targets: HTMLElement[] = elements instanceof HTMLElement 
      ? [elements] 
      : Array.from(elements) as HTMLElement[];
    
    targets.forEach((target, index) => {
      const delay = ((config.delay || 0) + (index * (config.delay || 0))) * 1000;
      
      setTimeout(() => {
        target.style.opacity = '0';
        target.classList.add(config.className);
        
        // 自动在动画结束后移除类
        setTimeout(() => {
          target.classList.remove(config.className);
        }, (config.duration || 0.6) * 1000);
      }, delay);
    });
  }
  
  /**
   * 播放持续动画
   */
  public playContinuous(
    elements: HTMLElement | HTMLElement[],
    animationClass: string
  ): void {
    const targets = elements instanceof HTMLElement 
      ? [elements] 
      : Array.from(elements);
    
    targets.forEach(target => {
      target.classList.add(animationClass);
    });
  }
  
  /**
   * 停止持续动画
   */
  public stopContinuous(
    elements: HTMLElement | HTMLElement[],
    animationClass: string
  ): void {
    const targets = elements instanceof HTMLElement 
      ? [elements] 
      : Array.from(elements);
    
    targets.forEach(target => {
      target.classList.remove(animationClass);
    });
  }
  
  /**
   * 播放交错动画（列表项逐个出现）
   */
  public playStagger(
    elements: HTMLElement[],
    baseConfig: AnimationConfig
  ): Promise<void> {
    return new Promise((resolve) => {
      elements.forEach((target, index) => {
        const delay = ((baseConfig.delay || 0.15) + (index * (baseConfig.delay || 0.15))) * 1000;
        
        setTimeout(() => {
          target.style.opacity = '0';
          target.classList.add(baseConfig.className || 'fade-in');
        }, delay);
      });
      
      // 假设所有动画完成后resolve
      const totalDuration = elements.length * ((baseConfig.delay || 0.15) * 1000) + ((baseConfig.duration || 0.5) * 1000);
      setTimeout(resolve, totalDuration);
    });
  }
  
  /**
   * 播放数字滚动动画
   */
  public playCounter(
    element: HTMLElement,
    endValue: number,
    duration: number = 1
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const startValue = 0;
      
      const update = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // 使用easeOutExpo缓动
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (endValue - startValue) * eased);
        
        element.innerHTML = currentValue.toString();
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(update);
    });
  }
}

// ============================================
// AI动画推荐系统
// ============================================

export class AnimationRecommender {
  /**
   * 分析内容类型
   */
  public analyzeContentType(element: HTMLElement | string): string {
    if (typeof element === 'string') {
      return this.inferContentType(element);
    }
    
    const text = element.textContent?.trim() || '';
    const tagName = element.tagName?.toLowerCase() || '';
    
    return this.inferContentType(text, tagName);
  }
  
  /**
   * 根据文本推断内容类型
   */
  private inferContentType(text: string, tagName: string = ''): string {
    // 标题判断
    if (tagName === 'h1' || tagName === 'h2') {
      return 'title';
    }
    
    // 副标题判断
    if (tagName === 'h3' || tagName === 'h4') {
      return 'subtitle';
    }
    
    // 列表判断
    if (tagName === 'ul' || tagName === 'ol' || tagName === 'li') {
      return 'list';
    }
    
    // 图表判断（包含数字或统计）
    if (/\d+%|\d+\.\d+|\$\d+/.test(text) && text.length < 50) {
      return 'chart';
    }
    
    // 图片判断
    if (tagName === 'img' || text.includes('image')) {
      return 'image';
    }
    
    // 总结/要点判断
    if (text.includes('总结') || text.includes('要点') || 
        text.includes('结论') || text.includes('关键')) {
      return 'summary';
    }
    
    // 默认正文
    return 'content';
  }
  
  /**
   * 判断使用场景
   */
  public determineScenario(
    topic: string,
    audience?: string
  ): 'professional' | 'creative' | 'academic' | 'marketing' {
    const topicLower = topic.toLowerCase();
    
    // 商务场景
    if (topicLower.includes('方案') || 
        topicLower.includes('汇报') || 
        topicLower.includes('总结') ||
        topicLower.includes('计划') ||
        topicLower.includes('报告') ||
        topicLower.includes('工作')) {
      return 'professional';
    }
    
    // 创意场景
    if (topicLower.includes('创意') || 
        topicLower.includes('设计') ||
        topicLower.includes('展示') ||
        topicLower.includes('作品') ||
        topicLower.includes('艺术')) {
      return 'creative';
    }
    
    // 学术场景
    if (topicLower.includes('研究') || 
        topicLower.includes('学术') ||
        topicLower.includes('教学') ||
        topicLower.includes('课程') ||
        topicLower.includes('论文') ||
        topicLower.includes('答辩')) {
      return 'academic';
    }
    
    // 营销场景
    if (topicLower.includes('产品') || 
        topicLower.includes('发布') ||
        topicLower.includes('推广') ||
        topicLower.includes('营销') ||
        topicLower.includes('宣传') ||
        topicLower.includes('广告')) {
      return 'marketing';
    }
    
    // 受众判断
    if (audience) {
      const audienceLower = audience.toLowerCase();
      if (audienceLower.includes('商务') || audienceLower.includes('客户')) {
        return 'professional';
      }
      if (audienceLower.includes('创意') || audienceLower.includes('设计')) {
        return 'creative';
      }
      if (audienceLower.includes('学术') || audienceLower.includes('学生')) {
        return 'academic';
      }
      if (audienceLower.includes('市场') || audienceLower.includes('客户')) {
        return 'marketing';
      }
    }
    
    // 默认商务场景
    return 'professional';
  }
  
  /**
   * 选择动画效果
   */
  public selectAnimation(
    contentType: string,
    scenario: string
  ): { class: string; duration: number; delay: number } {
    const animationMap: Record<string, Record<string, { class: string; duration: number; delay: number }>> = {
      professional: {
        title: { class: 'fade-in', duration: 0.8, delay: 0 },
        subtitle: { class: 'fade-in', duration: 0.6, delay: 0.1 },
        content: { class: 'fade-in', duration: 0.5, delay: 0.2 },
        list: { class: 'fade-in', duration: 0.4, delay: 0.15 },
        chart: { class: 'scale-in', duration: 0.6, delay: 0.3 },
        image: { class: 'fade-in', duration: 0.5, delay: 0.2 },
        summary: { class: 'fade-in', duration: 0.5, delay: 0.1 }
      },
      creative: {
        title: { class: 'bounce-in', duration: 1.0, delay: 0 },
        subtitle: { class: 'bounce-in', duration: 0.8, delay: 0.1 },
        content: { class: 'scale-in', duration: 0.7, delay: 0.2 },
        list: { class: 'bounce-in', duration: 0.5, delay: 0.2 },
        chart: { class: 'flip-in-x', duration: 0.8, delay: 0.3 },
        image: { class: 'rotate-in', duration: 0.8, delay: 0.2 },
        summary: { class: 'bounce-in', duration: 0.6, delay: 0.1 }
      },
      academic: {
        title: { class: 'slide-in-left', duration: 0.6, delay: 0 },
        subtitle: { class: 'fade-in', duration: 0.5, delay: 0.1 },
        content: { class: 'slide-in-left', duration: 0.5, delay: 0.15 },
        list: { class: 'fade-in', duration: 0.4, delay: 0.1 },
        chart: { class: 'scale-in', duration: 0.6, delay: 0.2 },
        image: { class: 'fade-in', duration: 0.5, delay: 0.2 },
        summary: { class: 'slide-in-right', duration: 0.5, delay: 0.1 }
      },
      marketing: {
        title: { class: 'flip-in-x', duration: 0.8, delay: 0 },
        subtitle: { class: 'flip-in-x', duration: 0.6, delay: 0.1 },
        content: { class: 'scale-in', duration: 0.7, delay: 0.2 },
        list: { class: 'scale-in', duration: 0.5, delay: 0.25 },
        chart: { class: 'flip-in-x', duration: 0.8, delay: 0.3 },
        image: { class: 'scale-in', duration: 0.6, delay: 0.2 },
        summary: { class: 'scale-in', duration: 0.5, delay: 0.1 }
      }
    };
    
    return animationMap[scenario]?.[contentType] || animationMap.professional.content;
  }
  
  /**
   * 验证风格统一性
   */
  public validateStyleConsistency(animations: string[]): {
    valid: boolean;
    message?: string;
    suggestion?: string;
  } {
    const styles = new Set<string>();
    
    animations.forEach(anim => {
      if (anim.includes('bounce') || anim.includes('elastic') || anim.includes('rotate')) {
        styles.add('vivid');
      } else if (anim.includes('flip') || anim.includes('perspective') || anim.includes('scale')) {
        styles.add('dramatic');
      } else if (anim.includes('slide')) {
        styles.add('systematic');
      } else {
        styles.add('minimal');
      }
    });
    
    if (styles.size > 2) {
      return {
        valid: false,
        message: `使用了${styles.size}种动画风格，建议控制在2种以内`,
        suggestion: '请统一为minimal+systematic或minimal+vivid组合'
      };
    }
    
    return { valid: true };
  }
}

// ============================================
// 导出单例
// ============================================

export const animationEngine = new AnimationEngine();
export const animationRecommender = new AnimationRecommender();

// 导出工具函数
export function analyzeAndRecommend(
  topic: string,
  pages: Array<{ id: string; content: string | HTMLElement }>,
  audience?: string
): AnimationPlan {
  const scenario = animationRecommender.determineScenario(topic, audience);
  
  const pageAnimations: PageAnimation[] = pages.map(page => {
    const contentType = animationRecommender.analyzeContentType(
      typeof page.content === 'string' ? page.content : page.content
    ) as PageAnimation['contentType'];
    
    const animation = animationRecommender.selectAnimation(contentType, scenario);
    
    return {
      pageId: page.id,
      contentType,
      animation
    };
  });
  
  // 验证风格
  const allAnimations = pageAnimations.map(p => p.animation.class);
  const validation = animationRecommender.validateStyleConsistency(allAnimations);
  
  // 生成CSS
  const uniqueClasses = [...new Set(allAnimations)];
  const css = generateAnimationCSS(uniqueClasses);
  
  return {
    scenario,
    pages: pageAnimations,
    css,
    validation
  };
}

function generateAnimationCSS(classes: string[]): string {
  const cssRules: string[] = [];
  
  classes.forEach(className => {
    if (className === 'fade-in') {
      cssRules.push(`
.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`);
    } else if (className === 'scale-in') {
      cssRules.push(`
.scale-in {
  opacity: 0;
  transform: scale(0.8);
  animation: scaleIn 0.6s ease forwards;
}
@keyframes scaleIn {
  to { opacity: 1; transform: scale(1); }
}`);
    } else if (className === 'slide-in-left') {
      cssRules.push(`
.slide-in-left {
  opacity: 0;
  transform: translateX(-50px);
  animation: slideInLeft 0.5s ease forwards;
}
@keyframes slideInLeft {
  to { opacity: 1; transform: translateX(0); }
}`);
    } else if (className === 'slide-in-right') {
      cssRules.push(`
.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  animation: slideInRight 0.5s ease forwards;
}
@keyframes slideInRight {
  to { opacity: 1; transform: translateX(0); }
}`);
    } else if (className === 'bounce-in') {
      cssRules.push(`
.bounce-in {
  opacity: 0;
  animation: bounceIn 0.8s ease forwards;
}
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}`);
    } else if (className === 'flip-in-x') {
      cssRules.push(`
.flip-in-x {
  opacity: 0;
  animation: flipInX 0.8s ease forwards;
}
@keyframes flipInX {
  0% { opacity: 0; transform: perspective(400px) rotateX(90deg); }
  40% { transform: perspective(400px) rotateX(-10deg); }
  70% { transform: perspective(400px) rotateX(10deg); }
  100% { opacity: 1; transform: perspective(400px) rotateX(0deg); }
}`);
    } else if (className === 'rotate-in') {
      cssRules.push(`
.rotate-in {
  opacity: 0;
  animation: rotateIn 0.8s ease forwards;
}
@keyframes rotateIn {
  0% { opacity: 0; transform: rotate(-200deg); }
  100% { opacity: 1; transform: rotate(0); }
}`);
    }
  });
  
  return cssRules.join('\n');
}

// 默认导出
export default {
  engine: animationEngine,
  recommender: animationRecommender,
  analyzeAndRecommend
};
