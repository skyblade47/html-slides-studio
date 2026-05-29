import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Sparkles } from 'lucide-react';

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
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: inputValue }),
      });
      
      if (!response.ok) throw new Error('生成失败');
      
      const data = await response.json();
      setOutline(data.outline);
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
