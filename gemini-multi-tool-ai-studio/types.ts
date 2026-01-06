
export enum ToolType {
  CHAT = 'CHAT',
  VISION = 'VISION',
  ANALYZE = 'ANALYZE'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number;
  topics: { name: string; relevance: number }[];
  summary: string;
}

export interface VisionResult {
  description: string;
  objects: string[];
  colors: string[];
  labels: string[];
}
