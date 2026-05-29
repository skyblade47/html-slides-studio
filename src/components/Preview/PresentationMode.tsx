import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PresentationModeProps {
  html: string;
  onExit: () => void;
}

export default function PresentationMode({ html, onExit }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        setCurrentSlide((prev) => prev + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        setCurrentSlide((prev) => Math.max(0, prev - 1));
        break;
      case 'Escape':
        onExit();
        break;
    }
  }, [onExit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
        <span className="text-white text-lg">
          {currentSlide + 1} / 1
        </span>
        <button
          onClick={onExit}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <iframe
          srcDoc={html}
          className="w-full h-full"
          title="全屏演示"
        />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="p-3 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-full text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => prev + 1)}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        按 ESC 退出 | ← → 键翻页
      </div>
    </div>
  );
}
