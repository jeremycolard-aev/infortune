export type Mobility = 'walking' | 'bike' | 'car';
export type TraitEmoji = '🍲' | '💬' | '🌿' | '🧹' | '💻' | '📋';
export type IndicatorKey = 'financial' | 'health' | 'social' | 'rights' | 'resilience';
export type Difficulty = 'easy' | 'medium' | 'expert';
export type GameScreen = 'difficulty' | 'waitingRoom' | 'colocationBoard' | 'result' | 'journal';

export const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  financial: '💶 Stabilité financière',
  health: '💪 Santé / bien-être',
  social: '🧑‍🤝‍🧑 Réseau social',
  rights: '⚖️ Accès aux droits',
  resilience: '🚀 Capacité à rebondir',
};

export const INDICATOR_EMOJIS: Record<IndicatorKey, string> = {
  financial: '💶',
  health: '💪',
  social: '🧑‍🤝‍🧑',
  rights: '⚖️',
  resilience: '🚀',
};

export const INDICATOR_KEYS: IndicatorKey[] = [
  'financial',
  'health',
  'social',
  'rights',
  'resilience',
];

export const MOBILITY_LABELS: Record<Mobility, string> = {
  walking: '🚶 à pied',
  bike: '🚲 vélo',
  car: '🚗 voiture',
};

export interface Scores {
  financial: number;
  health: number;
  social: number;
  rights: number;
  resilience: number;
}

export interface KnowHow {
  score: number;
  description: string;
}

export interface Profile {
  id: number;
  name: string;
  age: number;
  story: string;
  fragility: string;
  compatibles: number[];
  scores: Scores;
  mobility: Mobility;
  hasHome: boolean;
  traits: TraitEmoji[];
  knowHow: KnowHow;
  needs: string;
  portraitColor: string;
  portraitEmoji: string;
}

export interface EventEffect {
  indicator: IndicatorKey;
  delta: number;
}

export interface WheelEventSide {
  title: string;
  effects: EventEffect[];
  phrase: string;
}

export interface WheelEvent {
  profileId: number;
  fortune: WheelEventSide;
  infortune: WheelEventSide;
}

export interface SolidarityNet {
  profileId: number;
  organization: string;
  bonus: EventEffect;
  delay: number;
}

export interface DifficultyConfig {
  label: string;
  colocationSize: number;
  threshold: number;
  drawnCount: number;
  description: string;
}

export interface ActiveNet {
  profileId: number;
  turnsRemaining: number;
  applied: boolean;
}

export interface WheelResult {
  profileId: number;
  profileName: string;
  isFortune: boolean;
  event: WheelEventSide;
}

export interface SeasonRecord {
  id: string;
  season: number;
  difficulty: Difficulty;
  profiles: { id: number; name: string; portraitEmoji: string; portraitColor: string }[];
  success: boolean;
  wheelResults: WheelResult[];
  finalScores: Scores;
  createdAt: string;
}
