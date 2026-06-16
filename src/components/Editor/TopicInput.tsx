import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Sparkles } from 'lucide-react';

// 智能大纲生成函数
function generateSmartOutline(topicText: string) {
  const topicLower = topicText.toLowerCase();
  
  // 基础结构
  let outline = [
    { id: '1', title: '简介', content: '介绍' + topicText + '的背景和重要性' },
    { id: '2', title: '主要内容', content: '核心要点分析' },
    { id: '3', title: '应用场景', content: '实际应用案例' },
    { id: '4', title: '总结', content: '关键结论和未来展望' },
  ];
  
  // 根据主题类型调整
  if (topicLower.includes('教育') || topicLower.includes('学习')) {
    outline = [
      { id: '1', title: '课程概述', content: '介绍本课程的目标和意义' },
      { id: '2', title: '核心概念', content: '重点知识讲解' },
      { id: '3', title: '实践案例', content: '实际应用场景分析' },
      { id: '4', title: '总结', content: '关键要点回顾' },
    ];
  } else if (topicLower.includes('商业') || topicLower.includes('市场') || topicLower.includes('销售')) {
    outline = [
      { id: '1', title: '市场分析', content: '行业现状和趋势' },
      { id: '2', title: '产品介绍', content: '核心产品和服务' },
      { id: '3', title: '商业计划', content: '商业模式和策略' },
      { id: '4', title: '总结', content: '未来展望' },
    ];
  } else if (topicLower.includes('技术') || topicLower.includes('编程') || topicLower.includes('开发')) {
    outline = [
      { id: '1', title: '技术概述', content: '介绍技术背景和应用场景' },
      { id: '2', title: '核心原理', content: '技术原理解析' },
      { id: '3', title: '实践应用', content: '代码示例和演示' },
      { id: '4', title: '总结', content: '关键要点和最佳实践' },
    ];
  }
  
  return outline;
}

export default function TopicInput() {
  const { topic, setTopic, setOutline, setIsGenerating } = useEditorStore();
  const [inputValue, setInputValue] = useState(topic);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  const handleGenerateOutline = async () => {
    if (!inputValue.trim()) return;
    
    setTopic(inputValue);
    setIsGeneratingOutline(true);
    setIsGenerating(true);

    try {
      // 模拟API调用延迟，让用户有正在生成的感觉
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 根据主题生成智能大纲
      const mockOutline = generateSmartOutline(inputValue);
      setOutline(mockOutline);
    } catch (error) {
      console.error('生成大纲失败:', error);
      const mockOutline = [
        { id: '1', title: '简介', content: '介绍主题背景和重要性' },
        { id: '2', title: '主要内容', content: '核心要点分析' },
        { id: '3', title: '案例分析', content: '实际应用场景' },
        { id: '4', title: '总结', content: '关键结论和建议' },
      ];
      setOutline(mockOutline);
    } finally {
      setIsGeneratingOutline(false);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        请描述你想创建的演示主题
      </h3>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="例如：人工智能在教育领域的应用，包括技术现状、应用场景、未来发展趋势"
        className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleGenerateOutline}
          disabled={!inputValue.trim() || isGeneratingOutline}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          {isGeneratingOutline ? 'AI 正在生成大纲...' : '让 AI 生成大纲'}
        </button>
      </div>
    </div>
  );
}
