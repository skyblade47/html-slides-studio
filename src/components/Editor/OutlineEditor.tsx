import { useEditorStore } from '../../stores/editorStore';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

export default function OutlineEditor() {
  const { outline, setOutline } = useEditorStore();

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: '新页面',
      content: '页面内容',
    };
    setOutline([...outline, newItem]);
  };

  const handleUpdateItem = (id: string, field: 'title' | 'content', value: string) => {
    setOutline(
      outline.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setOutline(outline.filter((item) => item.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOutline = [...outline];
    [newOutline[index - 1], newOutline[index]] = [newOutline[index], newOutline[index - 1]];
    setOutline(newOutline);
  };

  const handleMoveDown = (index: number) => {
    if (index === outline.length - 1) return;
    const newOutline = [...outline];
    [newOutline[index], newOutline[index + 1]] = [newOutline[index + 1], newOutline[index]];
    setOutline(newOutline);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">调整演示大纲</h3>
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          添加页面
        </button>
      </div>

      <div className="space-y-4">
        {outline.map((item, index) => (
          <div
            key={item.id}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="pt-2 text-gray-400 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                  className="w-full text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none pb-1"
                />
                <textarea
                  value={item.content}
                  onChange={(e) => handleUpdateItem(item.id, 'content', e.target.value)}
                  className="w-full bg-transparent border border-gray-200 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === outline.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {outline.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>暂无页面，请添加页面或返回上一步让 AI 生成</p>
        </div>
      )}
    </div>
  );
}
