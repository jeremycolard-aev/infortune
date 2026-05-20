import { PROFILES, type IndicatorKey, type IndicatorScores, type Profile } from '@/data/profiles';
import { WHEEL_EVENTS, type WheelEvent } from '@/data/events';
import { SOLIDARITY_NETS } from '@/data/solidarityNets';

export type Difficulty = 'easy' | 'medium' | 'expert';

export const DIFFICULTY_CONFIG: Record<Difficulty, { slots: number; threshold: number; label: string; description: string }> = {
  easy:   { slots: 3, threshold: 12, label: '3 colocataires', description: 'Seuil ≥ 12 sur chaque indicateur' },
  medium: { slots: 4, threshold: 15, label: '4 colocataires', description: 'Seuil ≥ 15 sur chaque indicateur' },
  expert: { slots: 4, threshold: 18, label: 'Expert',          description: 'Seuil ≥ 18 — Roue plus imprévisible' },
};

export const INDICATORS: IndicatorKey[] = ['finance', 'health', 'social', 'rights', 'resilience'];

export interface WheelResult {
  profileId: number;
  isFortune: boolean;
  event: WheelEvent['fortune'] | WheelEvent['infortune'];
}

export interface SeasonRecord {
  season: number;
  difficulty: Difficulty;
  profileIds: number[];
  success: boolean;
  turns: number;
  scoreSnapshot: Record<number, IndicatorScores>;
}

export interface NetStatus {
  turnsLeft: number | null;
  applied: boolean;
}

export function drawProfiles(count: number, excludeIds: number[] = []): number[] {
  const available = PROFILES
    .filter((p) => !excludeIds.includes(p.id))
    .map((p) => p.id);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getProfile(id: number): Profile {
  const p = PROFILES.find((pr) => pr.id === id);
  if (!p) throw new Error(`Profile ${id} not found`);
  return p;
}

export function initialScores(profileId: number): IndicatorScores {
  return { ...getProfile(profileId).scores };
}

export function sumScores(profileIds: number[], scores: Record<number, IndicatorScores>): IndicatorScores {
  const total: IndicatorScores = { finance: 0, health: 0, social: 0, rights: 0, resilience: 0 };
  for (const id of profileIds) {
    const s = scores[id];
    if (s) {
      for (const k of INDICATORS) {
        total[k] += s[k];
      }
    }
  }
  return total;
}

export function checkThresholds(total: IndicatorScores, threshold: number): boolean {
  return INDICATORS.every((k) => total[k] >= threshold);
}

export function getThresholdStatus(total: IndicatorScores, threshold: number): Record<IndicatorKey, boolean> {
  const result: Partial<Record<IndicatorKey, boolean>> = {};
  for (const k of INDICATORS) {
    result[k] = total[k] >= threshold;
  }
  return result as Record<IndicatorKey, boolean>;
}

export function areCompatible(idA: number, idB: number): boolean {
  const a = getProfile(idA);
  const b = getProfile(idB);
  return a.compatibles.includes(idB) || b.compatibles.includes(idA);
}

export function countCompatiblePairs(ids: number[]): number {
  let count = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (areCompatible(ids[i]!, ids[j]!)) count++;
    }
  }
  return count;
}

export function spinWheel(colocationIds: number[], isExpert: boolean): WheelResult {
  const idx = Math.floor(Math.random() * colocationIds.length);
  const profileId = colocationIds[idx]!;
  const event = WHEEL_EVENTS.find((e) => e.profileId === profileId);
  if (!event) throw new Error(`No event for profile ${profileId}`);

  const fortuneChance = isExpert ? 0.4 : 0.5;
  const isFortune = Math.random() < fortuneChance;
  return {
    profileId,
    isFortune,
    event: isFortune ? event.fortune : event.infortune,
  };
}

export function applyScoreChanges(
  current: IndicatorScores,
  changes: Partial<IndicatorScores>,
): IndicatorScores {
  const next = { ...current };
  for (const k of INDICATORS) {
    const delta = changes[k];
    if (delta !== undefined) {
      next[k] = Math.max(0, Math.min(10, next[k] + delta));
    }
  }
  return next;
}

export function getSolidarityNet(profileId: number) {
  return SOLIDARITY_NETS.find((n) => n.profileId === profileId) ?? null;
}

export function buildInitialNetStatus(profileIds: number[]): Record<number, NetStatus> {
  const result: Record<number, NetStatus> = {};
  for (const id of profileIds) {
    result[id] = { turnsLeft: null, applied: false };
  }
  return result;
}

export function tickNets(
  netStatus: Record<number, NetStatus>,
  profileScores: Record<number, IndicatorScores>,
): { netStatus: Record<number, NetStatus>; scores: Record<number, IndicatorScores>; resolved: number[] } {
  const next: Record<number, NetStatus> = {};
  const scores = { ...profileScores };
  const resolved: number[] = [];

  for (const [idStr, status] of Object.entries(netStatus)) {
    const id = Number(idStr);
    if (status.turnsLeft === null || status.applied) {
      next[id] = status;
      continue;
    }
    if (status.turnsLeft <= 1) {
      const net = getSolidarityNet(id);
      if (net && scores[id]) {
        scores[id] = applyScoreChanges(scores[id]!, net.bonus);
        resolved.push(id);
      }
      next[id] = { turnsLeft: 0, applied: true };
    } else {
      next[id] = { ...status, turnsLeft: status.turnsLeft - 1 };
    }
  }

  return { netStatus: next, scores, resolved };
}
