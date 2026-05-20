import { Difficulty, GameScreen, ActiveNet, Scores, WheelResult, SeasonRecord } from '@/data/types';

export interface GameSave {
  screen: GameScreen;
  season: number;
  difficulty: Difficulty | null;
  drawnProfileIds: number[];
  selectedProfileIds: number[];
  profileScores: Record<number, Scores>;
  activeSolidarityNets: ActiveNet[];
  turn: number;
  wheelUsedThisTurn: boolean;
  wheelResults: WheelResult[];
  history: SeasonRecord[];
}

const SAVE_KEY = 'ma-coloc-solidaire-v1';

export function saveGame(state: GameSave): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, quota exceeded)
  }
}

export function loadGame(): GameSave | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as GameSave) : null;
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearSave(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
