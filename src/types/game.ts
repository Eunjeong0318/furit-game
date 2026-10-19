export type FruitTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface FruitDef {
  tier: FruitTier;
  name: string;
  nameEn: string;
  radius: number;
  score: number;
  color: string;
  accentColor: string;
  borderColor: string;
  dropWeight: number; // probability weight for dropping (0 for non-droppable high tier)
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  score: number;
  combo?: number;
  opacity: number;
  createdAt: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  highestTier: FruitTier;
  watermelonsCreated: number;
  fruitsMerged: number;
  gamesPlayed: number;
  jigglesRemaining: number;
}

export type GameState = 'PLAYING' | 'PAUSED' | 'GAME_OVER';
