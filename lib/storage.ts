const SAVE_KEY = 'ma-coloc-solidaire-save';

export interface NetState {
  activated: boolean;
  turnsLeft: number;
  applied: boolean;
}

export interface SeasonRecord {
  season: number;
  profileIds: number[];
  success: boolean;
  scores: Record<string, number>;
  compatibilityCount: number;
  date: string;
}

export interface SaveData {
  season: number;
  difficulty: 3 | 4 | 'expert';
  threshold: number;
  selectedProfileIds: number[];
  scoreOverrides: Record<number, Record<string, number>>;
  nets: Record<number, NetState>;
  wheelUsed: boolean;
  history: SeasonRecord[];
  screen: string;
}

export function saveGame(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
