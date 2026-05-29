import { create } from 'zustand';
import type { OutlineItem, EditorStep } from '../types';

interface EditorStore {
  topic: string;
  outline: OutlineItem[];
  selectedTemplateId: string;
  generatedHtml: string;
  currentStep: EditorStep;
  isGenerating: boolean;
  
  setTopic: (topic: string) => void;
  setOutline: (outline: OutlineItem[]) => void;
  setSelectedTemplateId: (id: string) => void;
  setGeneratedHtml: (html: string) => void;
  setCurrentStep: (step: EditorStep) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  reset: () => void;
}

const initialState = {
  topic: '',
  outline: [],
  selectedTemplateId: 'business',
  generatedHtml: '',
  currentStep: 'topic' as EditorStep,
  isGenerating: false,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setTopic: (topic) => set({ topic }),
  setOutline: (outline) => set({ outline }),
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  setGeneratedHtml: (html) => set({ generatedHtml: html }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  reset: () => set(initialState),
}));
