import { Database, Layers, Code2, Cpu, FileCode, BookOpen, Sparkles } from 'lucide-react';

// Default tabs configuration
export const DEFAULT_TABS = [
  { id: 'dsa', name: 'DSA', icon: 'Database', color: '#00d9ff' },
  { id: 'design', name: 'Design', icon: 'Layers', color: '#bf7fff' },
  { id: 'java', name: 'Java', icon: 'Code2', color: '#ff9f43' },
  { id: 'springboot', name: 'Spring Boot', icon: 'Cpu', color: '#00ff94' },
  { id: 'javascript', name: 'JavaScript', icon: 'FileCode', color: '#ff6b9d' },
];

// Icon mapping
export const IconMap = {
  Database, Layers, Code2, Cpu, FileCode, BookOpen, Sparkles
};

// Data version - increment this to reset localStorage with new structure
export const DATA_VERSION = 4;

