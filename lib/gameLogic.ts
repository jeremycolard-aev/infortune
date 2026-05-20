import { profiles, type Profile, type Scores, INDICATOR_KEYS } from '@/data/profiles';
import type { WheelEvent } from '@/data/events';

export type Difficulty = 3 | 4 | 'expert';

export function getThreshold(difficulty: Difficulty): number {
  if (difficulty === 3) return 12;
  if (difficulty === 4) return 15;
  return 18;
}

export function drawProfiles(count: number = 5): Profile[] {
  const shuffled = [...profiles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function areCompatible(a: Profile, b: Profile): boolean {
  return a.compatible.includes(b.id) || b.compatible.includes(a.id);
}

export function computeColocationScores(
  selectedProfiles: Profile[],
  overrides: Record<number, Partial<Scores>>
): Scores {
  const base: Scores = {
    financial: 0,
    health: 0,
    social: 0,
    rights: 0,
    resilience: 0,
  };

  for (const profile of selectedProfiles) {
    const override = overrides[profile.id] ?? {};
    for (const key of INDICATOR_KEYS) {
      const raw = profile.scores[key] + (override[key] ?? 0);
      base[key] += Math.max(0, Math.min(5, raw));
    }
  }

  return base;
}

export function checkWin(scores: Scores, threshold: number): boolean {
  return INDICATOR_KEYS.every((k) => scores[k] >= threshold);
}

export function getWeakIndicators(
  scores: Scores,
  threshold: number
): (keyof Scores)[] {
  return INDICATOR_KEYS.filter((k) => scores[k] < threshold);
}

export function applyWheelEffect(
  current: Partial<Scores>,
  effect: Partial<Scores>
): Partial<Scores> {
  const result = { ...current };
  for (const key of INDICATOR_KEYS) {
    if (effect[key] !== undefined) {
      result[key] = (result[key] ?? 0) + effect[key]!;
    }
  }
  return result;
}

export function pickWheelOutcome(event: WheelEvent): 'fortune' | 'infortune' {
  return Math.random() < 0.5 ? 'fortune' : 'infortune';
}

export function getCompatibilityScore(selectedProfiles: Profile[]): number {
  let count = 0;
  for (let i = 0; i < selectedProfiles.length; i++) {
    for (let j = i + 1; j < selectedProfiles.length; j++) {
      if (areCompatible(selectedProfiles[i], selectedProfiles[j])) count++;
    }
  }
  return count;
}

export function getProfileById(id: number): Profile | undefined {
  return profiles.find((p) => p.id === id);
}

export function formatEffect(effect: Partial<Scores>): string {
  const parts: string[] = [];
  const emojis: Record<keyof Scores, string> = {
    financial: '💶',
    health: '💪',
    social: '🧑‍🤝‍🧑',
    rights: '⚖️',
    resilience: '🚀',
  };
  for (const key of INDICATOR_KEYS) {
    const val = effect[key];
    if (val !== undefined && val !== 0) {
      parts.push(`${emojis[key]}${val > 0 ? '+' : ''}${val}`);
    }
  }
  return parts.join('  ');
}
