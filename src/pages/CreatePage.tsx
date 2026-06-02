import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { useEditorStore } from '../stores/editorStore';
import TopicInput from '../components/Editor/TopicInput';
import OutlineEditor from '../components/Editor/OutlineEditor';
import TemplateSelect from '../components/Editor/TemplateSelect';
import AnimationEditor from '../components/Editor/AnimationEditor';
import SlidePreview from '../components/Preview/SlidePreview';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function CreatePage() {
  const navigate = useNavigate();
  const { addProject, generateId } = useProjectStore();
  const { currentStep, setCurrentStep, generatedHtml, topic, outline, selectedTemplateId } =
    useEditorStore();

  const steps = [
    { key: 'topic', label: '输入主题' },
    { key: 'outline', label: '调整大纲' },
    { key: 'template', label: '选择模板' },
    { key: 'animation', label: '动画设置' },
    { key: 'preview', label: '预览生成' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const handleComplete = () => {
    const project = {
      id: generateId(),
      name: topic.slice(0, 30) || '未命名演示',
      topic,
      outline,
      templateId: selectedTemplateId,
      htmlContent: generatedHtml,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addProject(project);
    useEditorStore.getState().reset();
    navigate('/');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'topic':
        return topic.trim().length > 0;
      case 'outline':
        return outline.length > 0;
      case 'template':
        return true;
      case 'animation':
        return true;
      case 'preview':
        return generatedHtml.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">创建新演示</h2>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentIndex ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  index <= currentIndex ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[550px]">
        {currentStep === 'topic' && <TopicInput />}
        {currentStep === 'outline' && <OutlineEditor />}
        {currentStep === 'template' && <TemplateSelect />}
        {currentStep === 'animation' && <AnimationEditor />}
        {currentStep === 'preview' && <SlidePreview />}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentStep(steps[currentIndex - 1].key as typeof currentStep);
            }
          }}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          上一步
        </button>
        {currentStep === 'preview' ? (
          <button
            onClick={handleComplete}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            完成并保存
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentStep(steps[currentIndex + 1].key as typeof currentStep);
            }}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            下一步
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
