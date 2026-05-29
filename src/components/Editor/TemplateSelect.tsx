import { useEditorStore } from '../../stores/editorStore';
import { templates, getTemplateById, generateHtml } from '../../services/templates';
import { Check } from 'lucide-react';

export default function TemplateSelect() {
  const { selectedTemplateId, setSelectedTemplateId, setGeneratedHtml, setIsGenerating, topic, outline } =
    useEditorStore();

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          outline,
          topic,
        }),
      });

      if (!response.ok) throw new Error('生成失败');

      const data = await response.json();
      setGeneratedHtml(data.html);
    } catch (error) {
      console.error('生成失败，使用默认模板:', error);
      const html = generateHtml(templateId, outline, topic);
      setGeneratedHtml(html);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">选择演示模板</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              selectedTemplateId === template.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className="h-32 rounded-lg mb-3 flex items-center justify-center text-white text-sm font-medium"
              style={{ background: template.cssVariables.primaryColor }}
            >
              模板预览
            </div>
            <h4 className="font-semibold text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
