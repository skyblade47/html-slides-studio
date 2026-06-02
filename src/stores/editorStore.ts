import { create } from 'zustand';
import type { OutlineItem, EditorStep, AnimationConfig, ElementAnimation, SlideConfig } from '../types';

interface EditorStore {
  topic: string;
  outline: OutlineItem[];
  selectedTemplateId: string;
  generatedHtml: string;
  currentStep: EditorStep;
  isGenerating: boolean;
  
  // 动画配置
  slideConfigs: SlideConfig[];
  selectedSlideId: string | null;
  selectedElementId: string | null;
  animations: AnimationConfig[];
  elementAnimations: ElementAnimation[];
  
  setTopic: (topic: string) => void;
  setOutline: (outline: OutlineItem[]) => void;
  setSelectedTemplateId: (id: string) => void;
  setGeneratedHtml: (html: string) => void;
  setCurrentStep: (step: EditorStep) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  
  // 动画相关方法
  setSlideConfigs: (configs: SlideConfig[]) => void;
  addSlideConfig: (config: SlideConfig) => void;
  updateSlideConfig: (id: string, updates: Partial<SlideConfig>) => void;
  setSelectedSlideId: (id: string | null) => void;
  setSelectedElementId: (id: string | null) => void;
  
  addAnimation: (animation: AnimationConfig) => void;
  removeAnimation: (id: string) => void;
  updateAnimation: (id: string, updates: Partial<AnimationConfig>) => void;
  
  addElementAnimation: (elementAnimation: ElementAnimation) => void;
  removeElementAnimation: (elementId: string, animationId: string) => void;
  updateElementAnimation: (elementId: string, animationId: string, updates: Partial<ElementAnimation>) => void;
  
  reset: () => void;
}

const initialState = {
  topic: '',
  outline: [],
  selectedTemplateId: 'business',
  generatedHtml: '',
  currentStep: 'topic' as EditorStep,
  isGenerating: false,
  slideConfigs: [],
  selectedSlideId: null,
  selectedElementId: null,
  animations: [],
  elementAnimations: [],
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setTopic: (topic) => set({ topic }),
  setOutline: (outline) => set({ outline }),
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  setGeneratedHtml: (html) => set({ generatedHtml: html }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  setSlideConfigs: (configs) => set({ slideConfigs: configs }),
  addSlideConfig: (config) => set((state) => ({ slideConfigs: [...state.slideConfigs, config] })),
  updateSlideConfig: (id, updates) => set((state) => ({
    slideConfigs: state.slideConfigs.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  setSelectedSlideId: (id) => set({ selectedSlideId: id }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  
  addAnimation: (animation) => set((state) => ({ animations: [...state.animations, animation] })),
  removeAnimation: (id) => set((state) => ({ animations: state.animations.filter(a => a.id !== id) })),
  updateAnimation: (id, updates) => set((state) => ({
    animations: state.animations.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  
  addElementAnimation: (elementAnimation) => set((state) => ({
    elementAnimations: [...state.elementAnimations, elementAnimation]
  })),
  removeElementAnimation: (elementId, animationId) => set((state) => ({
    elementAnimations: state.elementAnimations.filter(
      ea => !(ea.elementId === elementId && ea.animationId === animationId)
    )
  })),
  updateElementAnimation: (elementId, animationId, updates) => set((state) => ({
    elementAnimations: state.elementAnimations.map(
      ea => ea.elementId === elementId && ea.animationId === animationId
        ? { ...ea, ...updates }
        : ea
    )
  })),
  
  reset: () => set(initialState),
}));
