# Animation Decision Skill - 动画决策技能

> 这是一个用于AI动画选择的决策框架，让AI能够根据内容类型、使用场景自动选择最合适的动画效果。

## 🎯 技能目标

帮助AI Agent在生成HTML演示文稿时：
1. **智能识别**内容类型（标题、内容、列表、图表等）
2. **自动适配**使用场景（商务、创意、学术、营销）
3. **统一风格**保持整个演示的动画一致性
4. **性能优先**选择高效、不干扰的动画效果

---

## 📋 决策流程

### Step 1: 内容分析
```
输入: 页面内容
├─ 标题识别 (H1, 大号文字)
├─ 列表识别 (多个<li>或<ul>)
├─ 图表识别 (包含数字、统计)
├─ 段落识别 (长文本块)
└─ 图片识别 (视觉元素)
输出: 内容类型
```

### Step 2: 场景判断
```
输入: 演示主题 + 目标受众
├─ 商务场景 → "professional"
├─ 创意场景 → "creative"  
├─ 学术场景 → "academic"
└─ 营销场景 → "marketing"
输出: 动画风格
```

### Step 3: 动画选择
```
输入: 内容类型 + 动画风格
├─ 从规范库选择匹配动画
├─ 调整时长参数
└─ 添加延迟序列
输出: 动画配置
```

### Step 4: 风格验证
```
输入: 所有动画配置
├─ 检查是否超过2种风格
├─ 验证动画参数一致性
└─ 确保无冲突动画
输出: 最终动画方案
```

---

## 🎨 动画风格映射

### Professional (专业商务)
**使用场景**: 商务汇报、工作总结、项目展示

**动画选择规则**:
```javascript
{
  "title": ["fade-in", "scale-in"],
  "subtitle": ["fade-in"],
  "content": ["fade-in", "slide-in-left"],
  "list": ["fade-in", "stagger-in"],
  "chart": ["fade-in", "scale-in"],
  "image": ["fade-in"],
  "summary": ["fade-in"]
}
```

**参数规范**:
- 时长: 0.5-0.8秒
- 延迟: 0.1-0.2秒
- 缓动: ease-out

---

### Creative (创意活泼)
**使用场景**: 创意提案、设计展示、年轻化演示

**动画选择规则**:
```javascript
{
  "title": ["bounce-in", "rotate-in", "elastic-in"],
  "subtitle": ["bounce-in"],
  "content": ["bounce-in", "elastic-in", "scale-in"],
  "list": ["bounce-in", "stagger-in", "wave-in"],
  "chart": ["flip-in-x", "flip-in-y", "scale-in"],
  "image": ["bounce-in", "rotate-in"],
  "summary": ["bounce-in", "pulse"]
}
```

**参数规范**:
- 时长: 0.6-1.0秒
- 延迟: 0.15-0.25秒
- 缓动: cubic-bezier(0.68, -0.55, 0.265, 1.55)

---

### Academic (学术严谨)
**使用场景**: 学术报告、论文答辩、教学演示

**动画选择规则**:
```javascript
{
  "title": ["slide-in-left", "fade-in"],
  "subtitle": ["fade-in"],
  "content": ["slide-in-left", "slide-in-right"],
  "list": ["slide-in-left", "stagger-in"],
  "chart": ["fade-in", "scale-in"],
  "image": ["fade-in"],
  "summary": ["fade-in", "slide-in-right"]
}
```

**参数规范**:
- 时长: 0.5-0.7秒
- 延迟: 0.1秒
- 缓动: ease

---

### Marketing (营销吸引)
**使用场景**: 产品发布、广告宣传、市场推广

**动画选择规则**:
```javascript
{
  "title": ["flip-in-x", "flip-in-y", "perspective-in", "scale-in"],
  "subtitle": ["flip-in-x"],
  "content": ["flip-in-x", "perspective-in", "scale-in"],
  "list": ["stagger-in", "flip-in-x"],
  "chart": ["flip-in-x", "scale-in", "glow"],
  "image": ["flip-in-x", "rotate-in", "scale-in"],
  "summary": ["scale-in", "pulse", "glow"]
}
```

**参数规范**:
- 时长: 0.6-1.0秒
- 延迟: 0.2-0.3秒
- 缓动: cubic-bezier(0.34, 1.56, 0.64, 1)

---

## 🛠️ AI决策工具函数

### 1. 分析内容类型
```javascript
function analyzeContentType(element) {
  const text = element.textContent.trim();
  const tagName = element.tagName.toLowerCase();
  
  // 标题判断
  if (tagName === 'h1' || tagName === 'h2') {
    return 'title';
  }
  
  // 列表判断
  if (tagName === 'ul' || tagName === 'ol' || tagName === 'li') {
    return 'list';
  }
  
  // 图表判断（包含数字）
  if (/\d+%|\d+\.\d+|\$\d+/.test(text) && text.length < 50) {
    return 'chart';
  }
  
  // 图片判断
  if (tagName === 'img' || element.classList.contains('image')) {
    return 'image';
  }
  
  // 副标题判断
  if (tagName === 'h3' || tagName === 'h4') {
    return 'subtitle';
  }
  
  // 默认正文
  return 'content';
}
```

### 2. 判断使用场景
```javascript
function determineScenario(topic, audience, context) {
  // 主题关键词判断
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('方案') || 
      topicLower.includes('汇报') || 
      topicLower.includes('总结') ||
      topicLower.includes('计划')) {
    return 'professional';
  }
  
  if (topicLower.includes('创意') || 
      topicLower.includes('设计') ||
      topicLower.includes('展示') ||
      topicLower.includes('作品')) {
    return 'creative';
  }
  
  if (topicLower.includes('研究') || 
      topicLower.includes('学术') ||
      topicLower.includes('教学') ||
      topicLower.includes('课程')) {
    return 'academic';
  }
  
  if (topicLower.includes('产品') || 
      topicLower.includes('发布') ||
      topicLower.includes('推广') ||
      topicLower.includes('营销')) {
    return 'marketing';
  }
  
  // 受众判断
  if (audience === 'business' || audience === 'client') {
    return 'professional';
  }
  
  if (audience === 'creative' || audience === 'designer') {
    return 'creative';
  }
  
  if (audience === 'academic' || audience === 'student') {
    return 'academic';
  }
  
  if (audience === 'customer' || audience === 'marketing') {
    return 'marketing';
  }
  
  // 默认商务场景
  return 'professional';
}
```

### 3. 选择动画效果
```javascript
function selectAnimation(contentType, scenario) {
  const animationMap = {
    professional: {
      title: { class: 'fade-in', duration: 0.8, delay: 0 },
      subtitle: { class: 'fade-in', duration: 0.6, delay: 0.1 },
      content: { class: 'fade-in', duration: 0.5, delay: 0.2 },
      list: { class: 'stagger-in', duration: 0.4, delay: 0.15 },
      chart: { class: 'scale-in', duration: 0.6, delay: 0.3 },
      image: { class: 'fade-in', duration: 0.5, delay: 0.2 },
      summary: { class: 'fade-in', duration: 0.5, delay: 0.1 }
    },
    creative: {
      title: { class: 'bounce-in', duration: 1.0, delay: 0 },
      subtitle: { class: 'bounce-in', duration: 0.8, delay: 0.1 },
      content: { class: 'elastic-in', duration: 0.7, delay: 0.2 },
      list: { class: 'stagger-in', duration: 0.5, delay: 0.2 },
      chart: { class: 'flip-in-x', duration: 0.8, delay: 0.3 },
      image: { class: 'rotate-in', duration: 0.8, delay: 0.2 },
      summary: { class: 'bounce-in', duration: 0.6, delay: 0.1 }
    },
    academic: {
      title: { class: 'slide-in-left', duration: 0.6, delay: 0 },
      subtitle: { class: 'fade-in', duration: 0.5, delay: 0.1 },
      content: { class: 'slide-in-left', duration: 0.5, delay: 0.15 },
      list: { class: 'stagger-in', duration: 0.4, delay: 0.1 },
      chart: { class: 'scale-in', duration: 0.6, delay: 0.2 },
      image: { class: 'fade-in', duration: 0.5, delay: 0.2 },
      summary: { class: 'slide-in-right', duration: 0.5, delay: 0.1 }
    },
    marketing: {
      title: { class: 'flip-in-x', duration: 0.8, delay: 0 },
      subtitle: { class: 'flip-in-x', duration: 0.6, delay: 0.1 },
      content: { class: 'perspective-in', duration: 0.7, delay: 0.2 },
      list: { class: 'stagger-in', duration: 0.5, delay: 0.25 },
      chart: { class: 'flip-in-x', duration: 0.8, delay: 0.3 },
      image: { class: 'scale-in', duration: 0.6, delay: 0.2 },
      summary: { class: 'scale-in', duration: 0.5, delay: 0.1 }
    }
  };
  
  return animationMap[scenario]?.[contentType] || animationMap.professional.content;
}
```

### 4. 验证风格统一性
```javascript
function validateStyleConsistency(animations) {
  const styles = new Set();
  
  animations.forEach(anim => {
    // 从动画类名推断风格
    if (anim.includes('bounce') || anim.includes('elastic')) {
      styles.add('vivid');
    } else if (anim.includes('flip') || anim.includes('perspective')) {
      styles.add('dramatic');
    } else if (anim.includes('slide')) {
      styles.add('systematic');
    } else {
      styles.add('minimal');
    }
  });
  
  // 风格不应超过2种
  if (styles.size > 2) {
    return {
      valid: false,
      message: `使用了${styles.size}种动画风格，建议控制在2种以内`,
      suggestion: '请统一为minimal+systematic或minimal+vivid组合'
    };
  }
  
  return { valid: true };
}
```

---

## 📊 动画参数配置

### 时长配置
```javascript
const durationConfig = {
  fast: 0.3,    // 快速：列表项
  normal: 0.5,  // 正常：正文
  slow: 0.8,   // 慢速：标题
  verySlow: 1.2 // 极慢：强调
};
```

### 延迟配置
```javascript
const delayConfig = {
  instant: 0,      // 即时：主要元素
  short: 0.1,     // 短延迟：次要元素
  medium: 0.2,    // 中延迟：辅助元素
  long: 0.3,      // 长延迟：装饰元素
  stagger: 0.15   // 交错：列表项之间
};
```

### 缓动函数
```javascript
const easingConfig = {
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};
```

---

## ⚠️ 决策约束

### 禁止规则
1. **不混用风格**: 同一演示不超过2种动画风格
2. **控制时长**: 单个动画不超过1.5秒
3. **限制数量**: 单页不超过3种动画效果
4. **避免冲突**: 不同时使用rotate和scale等冲突动画

### 性能优先
1. **CSS优先**: 简单动画使用纯CSS实现
2. **GPU加速**: 使用transform和opacity进行动画
3. **减少重绘**: 避免动画导致页面重排

---

## 🎯 实际应用示例

### 示例1: 商务汇报
**输入**:
```javascript
{
  topic: "2024年Q3季度工作总结",
  audience: "business",
  slides: [
    { type: "title", content: "Q3季度工作总结" },
    { type: "content", content: "本季度完成情况..." },
    { type: "list", content: ["销售额增长20%", "客户满意度提升"] },
    { type: "chart", content: "Q3数据统计" }
  ]
}
```

**AI决策**:
```javascript
// 分析: 商务场景 + 专业风格
scenario = determineScenario("2024年Q3季度工作总结", "business");
// → "professional"

animations = slides.map(slide => ({
  ...slide,
  animation: selectAnimation(slide.type, scenario)
}));

// 输出:
// - title: fade-in, duration: 0.8s
// - content: fade-in, duration: 0.5s
// - list: stagger-in, duration: 0.4s, delay: 0.15s
// - chart: scale-in, duration: 0.6s
```

---

### 示例2: 产品发布
**输入**:
```javascript
{
  topic: "智能手表Pro新品发布会",
  audience: "marketing",
  slides: [
    { type: "title", content: "智能手表Pro" },
    { type: "list", content: ["心率监测", "GPS定位", "防水功能"] },
    { type: "image", content: "产品图片" }
  ]
}
```

**AI决策**:
```javascript
scenario = determineScenario("智能手表Pro新品发布会", "marketing");
// → "marketing"

animations = slides.map(slide => ({
  ...slide,
  animation: selectAnimation(slide.type, scenario)
}));

// 输出:
// - title: flip-in-x, duration: 0.8s
// - list: stagger-in, duration: 0.5s, delay: 0.25s
// - image: scale-in, duration: 0.6s
```

---

## 🔧 工具调用接口

### 主入口函数
```javascript
async function generateAnimationPlan(outline, scenario) {
  // 1. 分析每个页面
  const pageAnalysis = outline.map(page => ({
    pageId: page.id,
    contentType: analyzeContentType(page.content),
    recommendedAnimation: selectAnimation(
      analyzeContentType(page.content),
      scenario
    )
  }));
  
  // 2. 验证风格统一性
  const allAnimations = pageAnalysis.map(p => p.recommendedAnimation.class);
  const validation = validateStyleConsistency(allAnimations);
  
  // 3. 返回完整动画方案
  return {
    scenario,
    pages: pageAnalysis,
    validation,
    css: generateCSS(pageAnalysis),
    usage: generateUsageGuide(pageAnalysis)
  };
}
```

---

## 📦 输出格式

### AI响应示例
```markdown
## 动画方案

### 使用场景: 商务汇报 (Professional)

### 动画配置
| 页面 | 内容类型 | 动画效果 | 时长 | 延迟 |
|------|---------|---------|------|------|
| 1 | 标题 | fade-in | 0.8s | 0s |
| 2 | 内容 | fade-in | 0.5s | 0.2s |
| 3 | 列表 | stagger-in | 0.4s | 0.15s |
| 4 | 图表 | scale-in | 0.6s | 0.3s |

### CSS动画类
```css
.fade-in { animation: fadeIn 0.6s ease forwards; }
.stagger-in { animation: fadeIn 0.4s ease forwards; }
.scale-in { animation: scaleIn 0.6s ease forwards; }
```

### 使用说明
1. 将上述CSS添加到演示文稿样式中
2. 为每个元素添加对应的动画类名
3. 列表项会自动应用交错延迟

### 风格验证
✅ 通过 - 使用了1种动画风格 (minimal)

### 建议
- 整体风格简洁专业，适合商务汇报场景
- 动画时长适中，不会分散注意力
- 建议在演示时使用键盘或鼠标控制动画触发
```

---

## 🎓 技能使用指南

### 适用场景
- ✅ AI生成HTML演示文稿
- ✅ 自动选择动画效果
- ✅ 确保动画风格统一
- ✅ 生成符合场景的动画配置

### 不适用场景
- ❌ 需要复杂交互动画
- ❌ 需要3D动画效果
- ❌ 需要自定义动画序列

### 集成方式
1. 将本Skill加载到AI Agent
2. 在生成演示时调用 `generateAnimationPlan`
3. 将生成的CSS和类名应用到HTML中

---

## 🔗 相关资源

- [Animation Design Guide](./ANIMATION_DESIGN.md) - 完整的动画设计规范
- [Anime.js](https://animejs.com/) - 轻量级JavaScript动画库
- [GSAP](https://greensock.com/) - 专业级动画平台

---

## 📝 版本信息

- **版本**: 1.0.0
- **创建日期**: 2026-06-02
- **适用系统**: HTML演示文稿生成系统
- **维护者**: AI Animation Decision System

---

*本技能旨在帮助AI系统做出专业、一致的动画决策，提升演示文稿的视觉质量和用户体验。*
