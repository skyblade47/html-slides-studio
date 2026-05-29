import { create } from 'zustand';
import type { Project } from '../types';

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
    const updatedProjects = [...get().projects, project];
    set({ projects: updatedProjects });
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  },

  updateProject: (id, updates) => {
    const updatedProjects = get().projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
    );
    set({ projects: updatedProjects });
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    if (get().currentProject?.id === id) {
      set({ currentProject: { ...get().currentProject!, ...updates, updatedAt: Date.now() } });
    }
  },

  deleteProject: (id) => {
    const updatedProjects = get().projects.filter((p) => p.id !== id);
    set({ projects: updatedProjects });
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    if (get().currentProject?.id === id) {
      set({ currentProject: null });
    }
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
