# Animation Design Guide - 动画设计规范

> 本规范用于指导AI如何为HTML演示文稿选择合适的动画效果，确保动画风格统一、场景适配。

## 🎯 设计原则

### 1. 场景适配原则
- 根据内容类型选择动画
- 根据演示目的选择动画风格
- 动画时长与内容重要性匹配

### 2. 风格统一原则
- 整个演示使用1-2种动画风格
- 同类元素使用相同的动画效果
- 动画参数（时长、延迟）保持一致

### 3. 用户体验原则
- 动画不应分散用户注意力
- 动画时长控制在0.3-1.5秒
- 避免过度使用动画效果

---

## 📊 内容类型与动画推荐

### 1. 标题页 (Title Slides)
**特点**: 第一印象，需要有冲击力
**推荐动画**:
- `fadeIn` + `scaleIn` (淡入缩放)
- `rotateIn` (旋转进入)
- `bounceIn` (弹跳进入)

**动画时长**: 0.8-1.2秒

---

### 2. 内容页 (Content Slides)
**特点**: 传递信息，需要清晰展示
**推荐动画**:
- `slideInLeft` / `slideInRight` (滑动进入)
- `fadeIn` (淡入)
- `waveIn` (波浪进入)

**动画时长**: 0.5-0.8秒

---

### 3. 列表页 (List Slides)
**特点**: 多项内容，需要逐条展示
**推荐动画**:
- `staggerIn` (交错进入)
- `slideInBottom` (从下往上)
- `fadeIn` + 延迟 (逐个淡入)

**动画时长**: 0.3-0.5秒/项
**延迟间隔**: 0.1-0.2秒

---

### 4. 图表页 (Chart Slides)
**特点**: 数据展示，需要渐进可视化
**推荐动画**:
- `fadeIn` (先显示)
- `scaleIn` (数据放大)
- `counterIn` (数字滚动)

**动画时长**: 0.6-1.0秒

---

### 5. 对比页 (Comparison Slides)
**特点**: 对比展示，需要突出差异
**推荐动画**:
- `slideInLeft` (左侧内容)
- `slideInRight` (右侧内容)
- 同时进入，形成对比

**动画时长**: 0.5-0.8秒

---

### 6. 总结页 (Summary Slides)
**特点**: 回顾要点，需要强调记忆
**推荐动画**:
- `fadeIn` (依次显示)
- `pulseIn` (重点强调)
- `scaleIn` (关键信息放大)

**动画时长**: 0.4-0.7秒

---

## 🎨 动画风格分类

### A. 专业商务型 (Professional)
**适用场景**: 商务汇报、工作汇报、正式演讲
**特点**: 简洁、快速、专业
**推荐动画**:
```css
.fade-in { animation: fadeIn 0.6s ease forwards; }
.scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.slide-in-left { animation: slideInLeft 0.5s ease forwards; }
```
**禁止使用**: bounceIn、wiggle、rainbow等花哨动画

---

### B. 创意活泼型 (Creative)
**适用场景**: 创意提案、设计展示、年轻化演示
**特点**: 生动、有趣、富有变化
**推荐动画**:
```css
.bounce-in { animation: bounceIn 0.8s ease forwards; }
.elastic-in { animation: elasticIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
.wiggle { animation: wiggle 1s ease-in-out infinite; }
.pulse { animation: pulse 2s ease-in-out infinite; }
```
**注意**: 保持节制，不要过度使用

---

### C. 学术严谨型 (Academic)
**适用场景**: 学术报告、论文答辩、教学演示
**特点**: 清晰、有序、逻辑性强
**推荐动画**:
```css
.slide-in-left { animation: slideInLeft 0.6s ease forwards; }
.slide-in-right { animation: slideInRight 0.6s ease forwards; }
.fade-in { animation: fadeIn 0.5s ease forwards; }
```
**动画间隔**: 统一使用0.1-0.2秒延迟

---

### D. 营销吸引型 (Marketing)
**适用场景**: 产品发布、广告宣传、市场推广
**特点**: 震撼、吸引眼球、印象深刻
**推荐动画**:
```css
.flip-in-x { animation: flipInX 0.8s ease forwards; }
.perspective-in { animation: perspectiveIn 1s ease forwards; }
.glow { animation: glow 2s ease-in-out infinite; }
.scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
```
**特点**: 可使用3D效果和发光效果

---

## ⏱️ 动画时长规范

### 根据内容重要性
- **标题**: 0.8-1.2秒（需要冲击力）
- **正文**: 0.5-0.7秒（适中速度）
- **列表项**: 0.3-0.5秒（快速清晰）
- **强调内容**: 0.4-0.6秒（突出重点）

### 根据动画类型
- **入场动画**: 0.5-1.0秒
- **退出动画**: 0.3-0.6秒
- **持续动画**: 2-5秒循环
- **交互动画**: 0.1-0.3秒（即时响应）

---

## 🎯 动画选择决策树

```
输入: 内容类型 + 演示场景 + 风格偏好
      ↓
内容类型识别
  ├─ 标题页 → 冲击力优先
  ├─ 内容页 → 清晰展示
  ├─ 列表页 → 逐项渐进
  ├─ 图表页 → 数据渐进
  └─ 总结页 → 强调记忆
      ↓
场景适配
  ├─ 商务汇报 → 专业商务型
  ├─ 创意展示 → 创意活泼型
  ├─ 学术教学 → 学术严谨型
  └─ 营销推广 → 营销吸引型
      ↓
风格统一检查
  └─ 保持全演示1-2种风格
      ↓
输出: 具体动画效果 + 参数配置
```

---

## 📦 动画效果库

### 入场动画 (Entrance)
| 动画名称 | CSS类名 | 适用场景 | 时长建议 |
|---------|---------|---------|---------|
| 淡入 | `.fade-in` | 通用 | 0.5-0.8s |
| 缩放进入 | `.scale-in` | 强调 | 0.6-1.0s |
| 滑动左侧 | `.slide-in-left` | 列表 | 0.5-0.7s |
| 滑动右侧 | `.slide-in-right` | 列表 | 0.5-0.7s |
| 弹跳进入 | `.bounce-in` | 创意 | 0.8-1.2s |
| 旋转进入 | `.rotate-in` | 标题 | 0.6-0.9s |
| 翻转X轴 | `.flip-in-x` | 强调 | 0.7-1.0s |
| 交错进入 | `.stagger-in` | 列表 | 0.3-0.5s/项 |

### 持续动画 (Continuous)
| 动画名称 | CSS类名 | 适用场景 | 循环时长 |
|---------|---------|---------|---------|
| 浮动 | `.float-animation` | 装饰 | 3s |
| 脉冲 | `.pulse-animation` | 强调 | 2s |
| 发光 | `.glow-animation` | 亮点 | 2s |
| 呼吸 | `.breathing-animation` | 柔和 | 3s |

### 交互动画 (Interactive)
| 动画名称 | CSS类名 | 触发条件 | 响应时长 |
|---------|---------|---------|---------|
| 悬停放大 | `.hover-scale` | 鼠标悬停 | 0.2s |
| 点击脉冲 | `.click-pulse` | 点击 | 0.3s |
| 拖拽 | `.drag-active` | 拖拽中 | 即时 |

---

## 🚫 动画使用禁忌

### 1. 禁止过度使用
- 单页不超过3种动画效果
- 持续动画不超过2个
- 避免动画冲突（如同时缩放和旋转）

### 2. 禁止干扰内容
- 动画时长不超过1.5秒
- 避免使用闪烁超过2次
- 不使用与内容无关的装饰动画

### 3. 禁止风格混乱
- 不混用专业和活泼风格
- 不在同一演示中使用超过2种动画风格
- 保持动画参数一致性

---

## 💡 AI动画选择指南

### 步骤1: 分析内容
```javascript
function analyzeContent(content) {
  // 识别内容类型
  if (isTitlePage(content)) return 'title';
  if (isListPage(content)) return 'list';
  if (isChartPage(content)) return 'chart';
  if (isSummaryPage(content)) return 'summary';
  return 'content';
}
```

### 步骤2: 确定场景
```javascript
function determineScenario(topic, audience) {
  if (audience === 'business') return 'professional';
  if (audience === 'creative') return 'creative';
  if (audience === 'academic') return 'academic';
  if (audience === 'marketing') return 'marketing';
  return 'professional'; // 默认商务
}
```

### 步骤3: 选择动画
```javascript
function selectAnimation(contentType, scenario) {
  const animations = {
    professional: {
      title: ['fade-in', 'scale-in'],
      content: ['fade-in', 'slide-in-left'],
      list: ['fade-in', 'stagger-in'],
      chart: ['fade-in', 'scale-in'],
      summary: ['fade-in', 'pulse']
    },
    creative: {
      title: ['bounce-in', 'rotate-in'],
      content: ['bounce-in', 'elastic-in'],
      list: ['bounce-in', 'stagger-in'],
      chart: ['flip-in-x', 'scale-in'],
      summary: ['bounce-in', 'pulse']
    }
    // ... 其他场景
  };
  return animations[scenario][contentType];
}
```

### 步骤4: 统一风格
```javascript
function validateStyleConsistency(animations) {
  // 检查是否超过2种风格
  const styles = new Set(animations.map(a => getAnimationStyle(a)));
  return styles.size <= 2;
}
```

---

## 📊 性能优化建议

### 1. CSS动画优先
- 简单动画使用纯CSS实现
- 减少JavaScript动画开销

### 2. GPU加速
```css
.transform-enabled {
  transform: translateZ(0);
  will-change: transform, opacity;
}
```

### 3. 动画合并
- 使用`animation`简写属性
- 避免多个独立动画同时运行

---

## 🎓 最佳实践

### ✅ 推荐做法
1. 先确定整体风格，再选择具体动画
2. 动画时长从短到长：列表项 → 正文 → 标题
3. 使用延迟实现自然的出现顺序
4. 测试不同设备上的动画效果
5. 考虑减少动画以提升性能

### ❌ 避免做法
1. 不要让动画成为主角，内容才是
2. 不要为了动画而添加动画
3. 不要忽视动画对可访问性的影响
4. 不要在快速翻页时使用长时间动画

---

## 🔗 相关资源

- **Anime.js**: https://animejs.com/ - 轻量级JavaScript动画库
- **GSAP**: https://greensock.com/ - 专业级动画平台
- **CSS动画**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

---

## 📝 版本信息

- **版本**: 1.0.0
- **创建日期**: 2026-06-02
- **适用项目**: HTML演示文稿生成系统
- **维护者**: AI Animation System

---

*本规范旨在帮助AI系统生成统一，专业、场景适配的动画效果。在实际应用中，应根据具体需求灵活调整。*
