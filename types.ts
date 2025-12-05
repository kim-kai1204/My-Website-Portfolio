export interface Site {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  imageUrl?: string;
  createdAt: number;
}

export interface GeneratedMetadata {
  title?: string;
  description?: string;
  category?: string;
}

export enum GameState {
  IDLE = 'IDLE',
  WAITING = 'WAITING',
  READY = 'READY',
  TOO_EARLY = 'TOO_EARLY',
  ROUND_RESULT = 'ROUND_RESULT',
  GAME_OVER = 'GAME_OVER'
}

export interface ScoreData {
  round: number;
  timeMs: number;
}