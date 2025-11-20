export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  LEARNING_MAP = 'LEARNING_MAP',
  PRACTICE = 'PRACTICE',
  SCENARIO = 'SCENARIO',
  AI_COMPANION = 'AI_COMPANION',
  FOCUS_MODE = 'FOCUS_MODE',
  KNOWLEDGE_HUB = 'KNOWLEDGE_HUB'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface UserProfile {
  name: string;
  level: string;
  xp: number;
  streak: number;
  completedModules: string[];
  confidence: {
    research: number;
    strategy: number;
    technical: number;
    communication: number;
  };
  learningStyle: 'visual' | 'reading' | 'doing' | 'mixed';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: 'Foundation' | 'Core' | 'Advanced' | 'Expert';
  duration: string; // e.g., "15 mins"
  locked: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
  feedback?: 'up' | 'down';
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  context: string;
  task: string;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'ARTICLE' | 'VIDEO' | 'GUIDE';
  difficulty: Difficulty;
  category: string;
  duration: string;
  tags: string[];
  content?: string; // Markdown/Text content
}