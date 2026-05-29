import { useEditorStore } from '../../stores/editorStore';
import { ExternalLink } from 'lucide-react';

export default function SlidePreview() {
  const { generatedHtml, isGenerating } = useEditorStore();

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">AI 正在生成演示...</p>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">预览演示</h3>
        {generatedHtml && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            下载 HTML
          </button>
        )}
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <iframe
          srcDoc={generatedHtml}
          className="w-full h-[500px]"
          title="演示预览"
        />
      </div>
    </div>
  );
}
