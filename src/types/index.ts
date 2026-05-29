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
  preview: string;
  cssVariables: TemplateCSS;
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

export type EditorStep = 'topic' | 'outline' | 'template' | 'preview';
