export interface Project {
  id: string;
  name: string;
  topic: string;
  outline: OutlineItem[];
  templateId: string;
  htmlContent: string;
  createdAt: number;
  updatedAt: number;
}

export interface OutlineItem {
  id: string;
  title: string;
  content: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview?: string;
  cssVariables?: TemplateCSS;
}

export interface TemplateCSS {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headingFont: string;
  backgroundColor: string;
  textColor: string;
}

export interface SlideData {
  title: string;
  content: string;
  layout: 'title' | 'content' | 'split' | 'full';
}

export type EditorStep = 'topic' | 'outline' | 'template' | 'animation' | 'preview';

export interface AnimationConfig {
  id: string;
  name: string;
  type: 'entrance' | 'exit' | 'continuous';
  className: string;
  duration: 'fast' | 'normal' | 'slow';
  delay: number;
  repeat: number | 'infinite';
  easing: string;
}

export interface ElementAnimation {
  elementId: string;
  animationId: string;
  order: number;
}

export interface SlideElement {
  id: string;
  type: 'title' | 'subtitle' | 'text' | 'card' | 'image' | 'chart';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  animations: ElementAnimation[];
}

export interface SlideConfig {
  id: string;
  title: string;
  layout: 'title' | 'content' | 'split' | 'full';
  elements: SlideElement[];
}

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  animations: AnimationConfig[];
}
