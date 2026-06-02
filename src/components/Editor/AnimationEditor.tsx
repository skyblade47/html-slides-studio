import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Trash2, MoveUp, MoveDown, Settings } from 'lucide-react';

export default function AnimationEditor() {
  const { 
    outline, 
    slideConfigs, 
    setSlideConfigs, 
    animations, 
    addAnimation, 
    elementAnimations, 
    addElementAnimation,
    removeElementAnimation,
    selectedSlideId,
    setSelectedSlideId,
    selectedElementId,
    setSelectedElementId
  } = useEditorStore();

  const [selectedAnimationType, setSelectedAnimationType] = useState<'entrance' | 'exit' | 'continuous'>('entrance');

  const availableAnimations = [
    { id: 'fadeIn', name: '淡入', type: 'entrance' as const, className: 'fade-in' },
    { id: 'slideInLeft', name: '从左飞入', type: 'entrance' as const, className: 'slide-in-left' },
    { id: 'slideInRight', name: '从右飞入', type: 'entrance' as const, className: 'slide-in-right' },
    { id: 'slideInTop', name: '从上方飞入', type: 'entrance' as const, className: 'slide-in-top' },
    { id: 'slideInBottom', name: '从下方飞入', type: 'entrance' as const, className: 'slide-in-bottom' },
    { id: 'scaleIn', name: '缩放进入', type: 'entrance' as const, className: 'scale-in' },
    { id: 'rotateIn', name: '旋转进入', type: 'entrance' as const, className: 'rotate-in' },
    { id: 'bounceIn', name: '弹跳进入', type: 'entrance' as const, className: 'bounce-in' },
    { id: 'flipInX', name: 'X轴翻转', type: 'entrance' as const, className: 'flip-in-x' },
    { id: 'flipInY', name: 'Y轴翻转', type: 'entrance' as const, className: 'flip-in-y' },
    { id: 'fadeOut', name: '淡出', type: 'exit' as const, className: 'fade-out' },
    { id: 'slideOutLeft', name: '向左滑出', type: 'exit' as const, className: 'slide-out-left' },
    { id: 'slideOutRight', name: '向右滑出', type: 'exit' as const, className: 'slide-out-right' },
    { id: 'scaleOut', name: '缩放消失', type: 'exit' as const, className: 'scale-out' },
    { id: 'float', name: '浮动', type: 'continuous' as const, className: 'float-animation' },
    { id: 'pulse', name: '脉冲', type: 'continuous' as const, className: 'pulse-animation' },
    { id: 'glow', name: '发光', type: 'continuous' as const, className: 'glow-animation' },
    { id: 'spin', name: '旋转', type: 'continuous' as const, className: 'spin-animation' },
    { id: 'breathing', name: '呼吸', type: 'continuous' as const, className: 'breathing-animation' },
  ];

  const filteredAnimations = availableAnimations.filter(a => a.type === selectedAnimationType);

  const currentSlideConfig = slideConfigs.find(s => s.id === selectedSlideId);

  const handleAddAnimation = (animId: string) => {
    const anim = availableAnimations.find(a => a.id === animId);
    if (!anim || !selectedElementId) return;
    
    const newAnimation: typeof animations[0] = {
      id: Date.now().toString(),
      name: anim.name,
      type: anim.type,
      className: anim.className,
      duration: 'normal',
      delay: 0,
      repeat: 1,
      easing: 'ease',
    };
    
    addAnimation(newAnimation);
    
    const elementAnim: typeof elementAnimations[0] = {
      elementId: selectedElementId,
      animationId: newAnimation.id,
      order: elementAnimations.filter(ea => ea.elementId === selectedElementId).length + 1,
    };
    
    addElementAnimation(elementAnim);
  };

  const handleRemoveAnimation = (elementId: string, animationId: string) => {
    removeElementAnimation(elementId, animationId);
  };

  const getSlideElements = () => {
    if (!currentSlideConfig) return [];
    return currentSlideConfig.elements;
  };

  const initSlideConfigs = () => {
    const configs = outline.map((item, index) => {
      const layout = (index === 0 ? 'title' : 'content') as 'title' | 'content' | 'split' | 'full';
      return {
        id: item.id,
        title: item.title,
        layout,
        elements: [
          {
            id: `title-${item.id}`,
            type: 'title' as const,
            content: item.title,
            position: { x: 0, y: 0 },
            size: { width: 800, height: 60 },
            animations: [],
          },
          {
            id: `content-${item.id}`,
            type: 'text' as const,
            content: item.content,
            position: { x: 0, y: 100 },
            size: { width: 800, height: 200 },
            animations: [],
          },
        ],
      };
    });
    setSlideConfigs(configs);
    if (configs.length > 0) {
      setSelectedSlideId(configs[0].id);
      setSelectedElementId(configs[0].elements[0].id);
    }
  };

  return (
    <div className="flex gap-6 h-[500px]">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">动画设置</h3>
          <button
            onClick={initSlideConfigs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Settings className="w-4 h-4" />
            初始化元素
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedAnimationType('entrance')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedAnimationType === 'entrance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            入场动画
          </button>
          <button
            onClick={() => setSelectedAnimationType('exit')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedAnimationType === 'exit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            出场动画
          </button>
          <button
            onClick={() => setSelectedAnimationType('continuous')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedAnimationType === 'continuous'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            持续动画
          </button>
        </div>

        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="w-1/3 bg-gray-50 rounded-xl p-4 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">幻灯片列表</h4>
            <div className="space-y-2">
              {slideConfigs.map((slide) => (
                <div
                  key={slide.id}
                  onClick={() => setSelectedSlideId(slide.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSlideId === slide.id
                      ? 'bg-blue-100 border border-blue-300'
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-900 truncate">{slide.title}</p>
                  <p className="text-xs text-gray-500">
                    {slide.elements.length} 个元素
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/3 bg-gray-50 rounded-xl p-4 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">元素列表</h4>
            <div className="space-y-2">
              {getSlideElements().map((element) => (
                <div
                  key={element.id}
                  onClick={() => setSelectedElementId(element.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedElementId === element.id
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-900 truncate">{element.content.slice(0, 20)}</p>
                  <p className="text-xs text-gray-500">
                    {element.type} | {element.animations.length} 个动画
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/3 bg-gray-50 rounded-xl p-4 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">可用动画</h4>
            <div className="space-y-2">
              {filteredAnimations.map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => handleAddAnimation(anim.id)}
                  disabled={!selectedElementId}
                  className="w-full p-3 rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 border border-gray-200"
                >
                  <p className="font-medium text-gray-900">{anim.name}</p>
                  <p className="text-xs text-gray-500">{anim.className}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 bg-gray-50 rounded-xl p-4 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-3">已添加动画</h4>
        {selectedElementId ? (
          <div className="space-y-2">
            {elementAnimations
              .filter(ea => ea.elementId === selectedElementId)
              .sort((a, b) => a.order - b.order)
              .map((ea) => {
                const anim = animations.find(a => a.id === ea.animationId);
                return (
                  <div
                    key={`${ea.elementId}-${ea.animationId}`}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{anim?.name || '未知动画'}</span>
                      <button
                        onClick={() => handleRemoveAnimation(ea.elementId, ea.animationId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-gray-500">顺序: {ea.order}</span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            {elementAnimations.filter(ea => ea.elementId === selectedElementId).length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">
                暂无动画，请添加
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 text-sm">
            请先选择元素
          </p>
        )}
      </div>
    </div>
  );
}
