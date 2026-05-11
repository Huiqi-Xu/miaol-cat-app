export type Tab = 'translate' | 'mood' | 'archive' | 'encyclopedia';

export interface CatProfile {
  name: string;
  age: number;
  personality: string[];
  breed: string;
  avatar: string;
}

export interface EncyclopediaEntry {
  id: string;
  title: string;
  description: string;
  moodTag: string;
  icon: string;
  color: string;
}

export interface TranslationResult {
  translation: string;
  mood: string;
  confidence: number;
  tips: string[];
  tag: string;
}
