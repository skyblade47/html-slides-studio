import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import PresentationMode from '../components/Preview/PresentationMode';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PresentationPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects } = useProjectStore();
  const [isPresenting, setIsPresenting] = useState(false);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!project && projectId) {
      navigate('/');
    }
  }, [project, projectId, navigate]);

  if (!project) {
    return <div className="text-center py-20">加载中...</div>;
  }

  if (isPresenting) {
    return <PresentationMode html={project.htmlContent} onExit={() => setIsPresenting(false)} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
        </div>
        <button
          onClick={() => setIsPresenting(true)}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg"
        >
          开始全屏演示
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <iframe
          srcDoc={project.htmlContent}
          className="w-full h-[600px]"
          title="演示预览"
        />
      </div>
    </div>
  );
}
