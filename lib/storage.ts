import type { Difficulty, NetStatus, SeasonRecord, WheelResult } from './gameLogic';
import type { IndicatorScores } from '@/data/profiles';

const STORAGE_KEY = 'mcs_save_v1';

export interface SaveData {
  screen: string;
  season: number;
  difficulty: Difficulty;
  availableIds: number[];
  colocationIds: number[];
  profileScores: Record<number, IndicatorScores>;
  netStatus: Record<number, NetStatus>;
  turnNumber: number;
  wheelSpun: boolean;
  lastWheelResult: WheelResult | null;
  history: SeasonRecord[];
}

export function saveGame(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
