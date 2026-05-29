# MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可用的最小演示生成器，支持输入主题 → 选择模板 → AI 生成可预览的 HTML → 全屏演示

**Architecture:** 
- 使用 Tauri v2 作为桌面应用框架
- React + TypeScript 构建前端界面
- TailwindCSS 实现样式
- SQLite 存储项目元数据
- OpenAI API 实现 AI 生成功能

**Tech Stack:** 
- Tauri v2 + React 18 + TypeScript
- TailwindCSS + Lucide Icons
- SQLite (via better-sqlite3 or tauri-plugin-sql)
- OpenAI API (GPT-4o)
- Vite (构建工具)

---

## 文件结构

```
html-slides-studio/
├── src/                          # React 源代码
│   ├── main.tsx                  # 应用入口
│   ├── App.tsx                   # 根组件
│   ├── components/               # UI 组件
│   │   ├── Layout/
│   │   │   └── MainLayout.tsx   # 主布局
│   │   ├── Project/
│   │   │   ├── ProjectList.tsx  # 项目列表
│   │   │   └── ProjectCard.tsx  # 项目卡片
│   │   ├── Editor/
│   │   │   ├── TopicInput.tsx   # 主题输入
│   │   │   ├── OutlineEditor.tsx # 大纲编辑
│   │   │   └── TemplateSelect.tsx # 模板选择
│   │   └── Preview/
│   │       ├── SlidePreview.tsx  # 预览组件
│   │       └── PresentationMode.tsx # 全屏演示
│   ├── pages/                   # 页面
│   │   ├── HomePage.tsx         # 首页（项目列表）
│   │   ├── CreatePage.tsx       # 创建页
│   │   └── PresentationPage.tsx  # 演示页
│   ├── services/                # 服务
│   │   ├── ai.ts                # AI 服务
│   │   ├── storage.ts           # 存储服务
│   │   └── templates.ts         # 模板服务
│   ├── stores/                  # 状态管理
│   │   ├── projectStore.ts      # 项目状态
│   │   └── editorStore.ts       # 编辑器状态
│   ├── types/                   # 类型定义
│   │   └── index.ts             # 共享类型
│   └── styles/                  # 样式
│       └── index.css            # 全局样式
├── src-tauri/                    # Tauri 原生代码
│   ├── src/
│   │   └── main.rs              # Rust 入口
│   ├── Cargo.toml               # Rust 依赖
│   └── tauri.conf.json          # Tauri 配置
├── templates/                    # 演示模板
│   ├── business.html            # 商务专业
│   ├── academic.html            # 学术教育
│   ├── creative.html            # 创意展示
│   ├── minimal.html             # 清新简约
│   └── formal.html              # 政府公文
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 任务列表

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/index.css`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "html-slides-studio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "lucide-react": "^0.400.0",
    "@tauri-apps/api": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@tauri-apps/cli": "^2.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.1.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 5: 创建 src/main.tsx**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: 创建 src/App.tsx**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import PresentationPage from './pages/PresentationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="present/:projectId" element={<PresentationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 7: 创建 src/styles/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
}

body {
  margin: 0;
  min-height: 100vh;
}
```

- [ ] **Step 8: 安装依赖**

```bash
npm install
```

- [ ] **Step 9: 提交**

```bash
git add .
git commit -m "feat: 项目初始化，搭建 Vite + React + TailwindCSS 基础架构"
```

---

### Task 2: Tauri 配置

**Files:**
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/src/main.rs`
- Create: `src-tauri/build.rs`

- [ ] **Step 1: 创建 src-tauri/Cargo.toml**

```toml
[package]
name = "html-slides-studio"
version = "0.1.0"
description = "AI驱动的HTML演示文稿创作工具"
authors = ["you"]
edition = "2021"

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-shell = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "s"
strip = true
```

- [ ] **Step 2: 创建 src-tauri/tauri.conf.json**

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "HTML Slides Studio",
  "version": "0.1.0",
  "identifier": "com.htmlslides.studio",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "HTML Slides Studio",
        "width": 1280,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

- [ ] **Step 3: 创建 src-tauri/src/main.rs**

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 4: 创建 src-tauri/build.rs**

```rust
fn main() {
    tauri_build::build()
}
```

- [ ] **Step 5: 初始化 Tauri 项目**

```bash
npm run tauri init
```

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: 添加 Tauri 桌面应用配置"
```

---

### Task 3: 类型定义和状态管理

**Files:**
- Create: `src/types/index.ts`
- Create: `src/stores/projectStore.ts`
- Create: `src/stores/editorStore.ts`

- [ ] **Step 1: 创建 src/types/index.ts**

```typescript
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
  subItems?: OutlineItem[];
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
```

- [ ] **Step 2: 创建 src/stores/projectStore.ts**

```typescript
import { create } from 'zustand';
import type { Project, OutlineItem } from '../types';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  loadProjects: () => void;
  generateId: () => string;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  addProject: (project) => {
    set((state) => ({ projects: [...state.projects, project] }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates, updatedAt: Date.now() }
          : state.currentProject,
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  loadProjects: () => {
    const stored = localStorage.getItem('projects');
    if (stored) {
      set({ projects: JSON.parse(stored) });
    }
  },

  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
}));
```

- [ ] **Step 3: 创建 src/stores/editorStore.ts**

```typescript
import { create } from 'zustand';
import type { OutlineItem, SlideData } from '../types';

interface EditorStore {
  topic: string;
  outline: OutlineItem[];
  selectedTemplateId: string;
  generatedHtml: string;
  currentStep: 'topic' | 'outline' | 'template' | 'preview';
  isGenerating: boolean;
  
  setTopic: (topic: string) => void;
  setOutline: (outline: OutlineItem[]) => void;
  setSelectedTemplateId: (id: string) => void;
  setGeneratedHtml: (html: string) => void;
  setCurrentStep: (step: 'topic' | 'outline' | 'template' | 'preview') => void;
  setIsGenerating: (isGenerating: boolean) => void;
  reset: () => void;
}

const initialState = {
  topic: '',
  outline: [],
  selectedTemplateId: 'business',
  generatedHtml: '',
  currentStep: 'topic' as const,
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
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 添加类型定义和 Zustand 状态管理"
```

---

### Task 4: 页面组件 - 首页和布局

**Files:**
- Create: `src/components/Layout/MainLayout.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/CreatePage.tsx`
- Create: `src/pages/PresentationPage.tsx`

- [ ] **Step 1: 创建 src/components/Layout/MainLayout.tsx**

```typescript
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Plus, Settings } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">HTML Slides Studio</h1>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              项目
            </Link>
            <Link
              to="/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              新建
            </Link>
          </nav>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 创建 src/pages/HomePage.tsx**

```typescript
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { Play, Trash2, Calendar } from 'lucide-react';

export default function HomePage() {
  const { projects, loadProjects, deleteProject } = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">我的项目</h2>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          创建新演示
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">还没有任何演示项目</p>
          <Link
            to="/create"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            创建第一个演示
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                {project.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {project.topic}
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                {formatDate(project.updatedAt)}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/present/${project.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Play className="w-4 h-4" />
                  演示
                </Link>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 创建 src/pages/CreatePage.tsx**

```typescript
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { useEditorStore } from '../stores/editorStore';
import TopicInput from '../components/Editor/TopicInput';
import OutlineEditor from '../components/Editor/OutlineEditor';
import TemplateSelect from '../components/Editor/TemplateSelect';
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
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
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

      <div className="bg-white rounded-xl border border-gray-200 p-8 min-h-[400px]">
        {currentStep === 'topic' && <TopicInput />}
        {currentStep === 'outline' && <OutlineEditor />}
        {currentStep === 'template' && <TemplateSelect />}
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
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
            完成并保存
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentStep(steps[currentIndex + 1].key as typeof currentStep);
            }}
            disabled={!topic || (currentStep === 'outline' && outline.length === 0)}
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
```

- [ ] **Step 4: 创建 src/pages/PresentationPage.tsx**

```typescript
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import PresentationMode from '../components/Preview/PresentationMode';
import { ArrowLeft, Edit2 } from 'lucide-react';
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
    return <div>加载中...</div>;
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
```

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: 添加首页、创建页和演示页"
```

---

### Task 5: 编辑器组件

**Files:**
- Create: `src/components/Editor/TopicInput.tsx`
- Create: `src/components/Editor/OutlineEditor.tsx`
- Create: `src/components/Editor/TemplateSelect.tsx`

- [ ] **Step 1: 创建 src/components/Editor/TopicInput.tsx**

```typescript
import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { Sparkles } from 'lucide-react';

export default function TopicInput() {
  const { topic, setTopic, setOutline, setIsGenerating } = useEditorStore();
  const [inputValue, setInputValue] = useState(topic);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  const handleGenerateOutline = async () => {
    if (!inputValue.trim()) return;
    
    setTopic(inputValue);
    setIsGeneratingOutline(true);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: inputValue }),
      });
      
      if (!response.ok) throw new Error('生成失败');
      
      const data = await response.json();
      setOutline(data.outline);
      setOutline(data.outline);
    } catch (error) {
      console.error('生成大纲失败:', error);
      const mockOutline = [
        {
          id: '1',
          title: '简介',
          content: '介绍主题背景和重要性',
        },
        {
          id: '2',
          title: '主要内容',
          content: '核心要点分析',
        },
        {
          id: '3',
          title: '案例分析',
          content: '实际应用场景',
        },
        {
          id: '4',
          title: '总结',
          content: '关键结论和建议',
        },
      ];
      setOutline(mockOutline);
    } finally {
      setIsGeneratingOutline(false);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        请描述你想创建的演示主题
      </h3>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="例如：人工智能在教育领域的应用，包括技术现状、应用场景、未来发展趋势"
        className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleGenerateOutline}
          disabled={!inputValue.trim() || isGeneratingOutline}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          {isGeneratingOutline ? 'AI 正在生成大纲...' : '让 AI 生成大纲'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 src/components/Editor/OutlineEditor.tsx**

```typescript
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
```

- [ ] **Step 3: 创建 src/components/Editor/TemplateSelect.tsx**

```typescript
import { useEditorStore } from '../../stores/editorStore';
import { templates, getTemplateById } from '../../services/templates';
import { Check } from 'lucide-react';

export default function TemplateSelect() {
  const { selectedTemplateId, setSelectedTemplateId, setGeneratedHtml, setIsGenerating } =
    useEditorStore();

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          outline: useEditorStore.getState().outline,
          topic: useEditorStore.getState().topic,
        }),
      });

      if (!response.ok) throw new Error('生成失败');

      const data = await response.json();
      setGeneratedHtml(data.html);
    } catch (error) {
      const template = getTemplateById(templateId);
      const mockHtml = generateMockHtml(templateId);
      setGeneratedHtml(mockHtml);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">选择演示模板</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              selectedTemplateId === template.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className="h-32 rounded-lg mb-3 flex items-center justify-center text-white text-sm font-medium"
              style={{ background: template.cssVariables.primaryColor }}
            >
              模板预览
            </div>
            <h4 className="font-semibold text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function generateMockHtml(templateId: string): string {
  const template = getTemplateById(templateId);
  const { outline, topic } = useEditorStore.getState();
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${template.cssVariables.fontFamily};
      background: ${template.cssVariables.backgroundColor};
      color: ${template.cssVariables.textColor};
      padding: 40px;
    }
    .slide {
      max-width: 1000px;
      margin: 0 auto;
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    h1 {
      font-family: ${template.cssVariables.headingFont};
      color: ${template.cssVariables.primaryColor};
      font-size: 3em;
      margin-bottom: 1em;
    }
    h2 {
      font-family: ${template.cssVariables.headingFont};
      color: ${template.cssVariables.primaryColor};
      font-size: 2em;
      margin: 1em 0 0.5em;
    }
    p { font-size: 1.2em; line-height: 1.8; margin-bottom: 1em; }
    ul { font-size: 1.2em; line-height: 2; padding-left: 2em; }
  </style>
</head>
<body>
  <div class="slide">
    <h1>${topic}</h1>
    ${outline
      .map(
        (item) => `
    <h2>${item.title}</h2>
    <p>${item.content}</p>
  `
      )
      .join('')}
  </div>
</body>
</html>`;
}
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 添加编辑器组件（主题输入、大纲编辑、模板选择）"
```

---

### Task 6: 预览和演示组件

**Files:**
- Create: `src/components/Preview/SlidePreview.tsx`
- Create: `src/components/Preview/PresentationMode.tsx`

- [ ] **Step 1: 创建 src/components/Preview/SlidePreview.tsx**

```typescript
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">预览演示</h3>
        {generatedHtml && (
          <a
            href={URL.createObjectURL(
              new Blob([generatedHtml], { type: 'text/html' })
            )}
            download="presentation.html"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            下载 HTML
          </a>
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
```

- [ ] **Step 2: 创建 src/components/Preview/PresentationMode.tsx**

```typescript
import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

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
```

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: 添加预览和全屏演示组件"
```

---

### Task 7: 模板服务和 AI 服务

**Files:**
- Create: `src/services/templates.ts`
- Create: `src/services/ai.ts`
- Create: `src/services/storage.ts`

- [ ] **Step 1: 创建 src/services/templates.ts**

```typescript
import type { Template, TemplateCSS } from '../types';

export const templates: Template[] = [
  {
    id: 'business',
    name: '商务专业',
    description: '深蓝+白底，适合商业汇报',
    preview: '/templates/business.html',
    cssVariables: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    },
  },
  {
    id: 'academic',
    name: '学术教育',
    description: '清晰层级，适合课程讲解',
    preview: '/templates/academic.html',
    cssVariables: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      fontFamily: 'Georgia, serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#fafafa',
      textColor: '#374151',
    },
  },
  {
    id: 'creative',
    name: '创意展示',
    description: '大图背景，适合产品发布',
    preview: '/templates/creative.html',
    cssVariables: {
      primaryColor: '#7c3aed',
      secondaryColor: '#a78bfa',
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
    },
  },
  {
    id: 'minimal',
    name: '清新简约',
    description: '大量留白，适合个人分享',
    preview: '/templates/minimal.html',
    cssVariables: {
      primaryColor: '#0891b2',
      secondaryColor: '#22d3ee',
      fontFamily: 'system-ui, sans-serif',
      headingFont: 'PingFang SC, Microsoft YaHei, sans-serif',
      backgroundColor: '#f8fafc',
      textColor: '#334155',
    },
  },
  {
    id: 'formal',
    name: '政府公文',
    description: '正式庄重，适合政策宣讲',
    preview: '/templates/formal.html',
    cssVariables: {
      primaryColor: '#b91c1c',
      secondaryColor: '#dc2626',
      fontFamily: 'SimSun, serif',
      headingFont: 'SimHei, Microsoft YaHei, sans-serif',
      backgroundColor: '#ffffff',
      textColor: '#111827',
    },
  },
];

export function getTemplateById(id: string): Template {
  return templates.find((t) => t.id === id) || templates[0];
}

export function generateHtml(templateId: string, outline: any[], topic: string): string {
  const template = getTemplateById(templateId);
  const { primaryColor, backgroundColor, textColor, fontFamily, headingFont } = template.cssVariables;

  const slidesHtml = outline
    .map(
      (item) => `
    <div class="slide">
      <h2>${item.title}</h2>
      <p>${item.content}</p>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      background: ${backgroundColor};
      color: ${textColor};
      line-height: 1.6;
    }
    .slide {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 80px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    h1 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 3em;
      margin-bottom: 0.5em;
    }
    h2 {
      font-family: ${headingFont};
      color: ${primaryColor};
      font-size: 2.2em;
      margin: 1em 0 0.5em;
      border-bottom: 3px solid ${primaryColor};
      padding-bottom: 0.3em;
    }
    p {
      font-size: 1.3em;
      line-height: 1.8;
      margin-bottom: 1em;
      color: ${textColor};
    }
    @media print {
      .slide { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="slide">
    <h1>${topic}</h1>
  </div>
  ${slidesHtml}
</body>
</html>`;
}
```

- [ ] **Step 2: 创建 src/services/ai.ts**

```typescript
const API_BASE = '/api';

interface GenerateOutlineRequest {
  topic: string;
}

interface GenerateOutlineResponse {
  outline: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

interface GenerateSlidesRequest {
  templateId: string;
  outline: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  topic: string;
}

interface GenerateSlidesResponse {
  html: string;
}

export async function generateOutline(request: GenerateOutlineRequest): Promise<GenerateOutlineResponse> {
  const response = await fetch(`${API_BASE}/generate-outline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('生成大纲失败');
  }

  return response.json();
}

export async function generateSlides(request: GenerateSlidesRequest): Promise<GenerateSlidesResponse> {
  const response = await fetch(`${API_BASE}/generate-slides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('生成演示失败');
  }

  return response.json();
}

export function buildOutlinePrompt(topic: string): string {
  return `请为以下主题创建一个演示文稿大纲。

主题：${topic}

请生成4-6个页面的大纲，每个页面包含标题和简要内容说明。
以JSON格式返回，格式如下：
{
  "outline": [
    {"id": "1", "title": "页面标题", "content": "页面内容简介"},
    ...
  ]
}`;
}

export function buildSlidesPrompt(topic: string, outline: any[], template: any): string {
  return `请根据以下大纲和模板风格，为每个页面生成详细内容。

主题：${topic}

大纲：
${outline.map((item, i) => `${i + 1}. ${item.title}: ${item.content}`).join('\n')}

模板风格：
- 主色调：${template.cssVariables.primaryColor}
- 背景色：${template.cssVariables.backgroundColor}
- 正文字体：${template.cssVariables.fontFamily}
- 标题字体：${template.cssVariables.headingFont}

请生成完整的HTML代码，包含每个页面的详细内容。`;
}
```

- [ ] **Step 3: 创建 src/services/storage.ts**

```typescript
const STORAGE_KEY = 'html-slides-studio';

export interface StoredProject {
  id: string;
  name: string;
  topic: string;
  outline: any[];
  templateId: string;
  htmlContent: string;
  createdAt: number;
  updatedAt: number;
}

export function saveProjects(projects: StoredProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProjects(): StoredProject[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveProject(project: StoredProject): void {
  const projects = loadProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
}

export function deleteProject(id: string): void {
  const projects = loadProjects();
  const filtered = projects.filter((p) => p.id !== id);
  saveProjects(filtered);
}

export function getProject(id: string): StoredProject | undefined {
  const projects = loadProjects();
  return projects.find((p) => p.id === id);
}
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 添加模板服务、AI服务和存储服务"
```

---

### Task 8: API 路由（后端）

**Files:**
- Create: `server/index.js` (简单的 Express 服务器)
- Modify: `vite.config.ts` (添加代理)

- [ ] **Step 1: 创建 server/index.js**

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/generate-outline', async (req, res) => {
  const { topic } = req.body;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: '未配置 OpenAI API Key' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的演示文稿策划专家。请为用户提供的大纲生成4-6个页面的结构。
每个页面需要包含标题和简要内容说明。
只返回JSON格式，不要包含其他内容。`,
          },
          {
            role: 'user',
            content: `主题：${topic}\n\n请生成演示文稿大纲。`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const outline = JSON.parse(content).outline.map((item, index) => ({
      id: String(index + 1),
      title: item.title,
      content: item.content || '',
    }));

    res.json({ outline });
  } catch (error) {
    console.error('生成大纲失败:', error);
    res.status(500).json({ error: '生成大纲失败' });
  }
});

app.post('/api/generate-slides', async (req, res) => {
  const { templateId, outline, topic } = req.body;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: '未配置 OpenAI API Key' });
  }

  try {
    const templatePrompts = {
      business: '商务专业风格：深蓝色主调，白底，简洁扁平，数据图表优先',
      academic: '学术教育风格：清晰层级，图表+公式，温和配色',
      creative: '创意展示风格：大图背景，渐变色彩，动感排版',
      minimal: '清新简约风格：大量留白，柔和色调，极简图标',
      formal: '政府公文风格：正式庄重，规范化排版',
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的HTML演示文稿生成专家。请根据提供的大纲和风格要求，生成完整的HTML代码。

要求：
1. 使用单个HTML文件，包含内联CSS
2. 每个页面使用class="slide"的div包裹
3. 支持打印和响应式布局
4. 不要使用外部依赖
5. 只返回HTML代码，不要有其他说明`,
          },
          {
            role: 'user',
            content: `主题：${topic}

风格：${templatePrompts[templateId] || '商务专业'}

大纲：
${outline.map((item, i) => `${i + 1}. ${item.title}\n   ${item.content}`).join('\n')}

请生成完整的HTML代码。`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const html = data.choices[0].message.content;

    res.json({ html });
  } catch (error) {
    console.error('生成演示失败:', error);
    res.status(500).json({ error: '生成演示失败' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API服务器运行在 http://localhost:${PORT}`);
});
```

- [ ] **Step 2: 更新 vite.config.ts 添加代理**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
```

- [ ] **Step 3: 创建 .env.example**

```
OPENAI_API_KEY=sk-your-api-key-here
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 添加API服务器和OpenAI集成"
```

---

### Task 9: 模板 HTML 文件

**Files:**
- Create: `templates/business.html`
- Create: `templates/academic.html`
- Create: `templates/creative.html`
- Create: `templates/minimal.html`
- Create: `templates/formal.html`

- [ ] **Step 1: 创建模板文件（基础框架）**

每个模板包含基本结构和样式占位符，供 AI 生成时参考。

- [ ] **Step 2: 提交**

```bash
git add templates/
git commit -m "feat: 添加演示模板文件"
```

---

## 验收标准

完成 MVP 后，验收标准：

1. ✅ 用户可以创建新项目
2. ✅ 输入主题后 AI 生成大纲
3. ✅ 可以调整大纲（增删改排序）
4. ✅ 可以选择 5 种预设模板
5. ✅ AI 根据大纲和模板生成 HTML
6. ✅ 可以在应用内预览 HTML
7. ✅ 可以进入全屏演示模式
8. ✅ 可以查看项目列表
9. ✅ 可以删除项目
10. ✅ 数据持久化到 localStorage

---

## 自检清单

- [ ] Spec coverage: 所有设计功能都有对应任务
- [ ] Placeholder scan: 无 TBD/TODO
- [ ] Type consistency: 类型定义一致
- [ ] 测试覆盖: 核心功能有测试
- [ ] 文档完整: README 包含运行说明
