import {
  Difficulty,
  DifficultyConfig,
  IndicatorKey,
  INDICATOR_KEYS,
  Profile,
  Scores,
  WheelEvent,
  WheelResult,
} from '@/data/types';
import { PROFILES } from '@/data/profiles';
import { WHEEL_EVENTS } from '@/data/events';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: '3 colocataires',
    colocationSize: 3,
    threshold: 12,
    drawnCount: 5,
    description: 'Seuil ≥ 12 par indicateur',
  },
  medium: {
    label: '4 colocataires',
    colocationSize: 4,
    threshold: 15,
    drawnCount: 6,
    description: 'Seuil ≥ 15 par indicateur',
  },
  expert: {
    label: 'Expert',
    colocationSize: 4,
    threshold: 18,
    drawnCount: 6,
    description: 'Seuil ≥ 18 + événements fréquents',
  },
};

export function drawProfiles(count: number): Profile[] {
  const shuffled = [...PROFILES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function calculateCollectiveScores(
  selectedProfiles: Profile[],
  profileScores: Record<number, Scores>
): Scores {
  const base: Scores = { financial: 0, health: 0, social: 0, rights: 0, resilience: 0 };
  return selectedProfiles.reduce((acc, profile) => {
    const scores = profileScores[profile.id] ?? profile.scores;
    INDICATOR_KEYS.forEach((key) => {
      acc[key] += scores[key];
    });
    return acc;
  }, base);
}

export function checkThresholds(collective: Scores, threshold: number): boolean {
  return INDICATOR_KEYS.every((key) => collective[key] >= threshold);
}

export function getFailingIndicators(collective: Scores, threshold: number): IndicatorKey[] {
  return INDICATOR_KEYS.filter((key) => collective[key] < threshold);
}

export function areCompatible(p1: Profile, p2: Profile): boolean {
  return p1.compatibles.includes(p2.id) || p2.compatibles.includes(p1.id);
}

export function getCompatibilityPairs(profiles: Profile[]): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      if (areCompatible(profiles[i], profiles[j])) {
        pairs.push([profiles[i].id, profiles[j].id]);
      }
    }
  }
  return pairs;
}

export function spinWheel(selectedProfiles: Profile[]): WheelResult {
  const randomProfile = selectedProfiles[Math.floor(Math.random() * selectedProfiles.length)];
  const isFortune = Math.random() < 0.5;
  const event = WHEEL_EVENTS.find((e) => e.profileId === randomProfile.id);

  if (!event) {
    return {
      profileId: randomProfile.id,
      profileName: randomProfile.name,
      isFortune,
      event: isFortune
        ? { title: 'Bonne nouvelle', effects: [{ indicator: 'resilience', delta: 1 }], phrase: '« Ça va mieux ! »' }
        : { title: 'Coup dur', effects: [{ indicator: 'financial', delta: -1 }], phrase: '« Courage... »' },
    };
  }

  return {
    profileId: randomProfile.id,
    profileName: randomProfile.name,
    isFortune,
    event: isFortune ? event.fortune : event.infortune,
  };
}

export function applyEffects(
  profileId: number,
  currentScores: Scores,
  result: WheelResult
): Scores {
  if (result.profileId !== profileId) return currentScores;
  const updated = { ...currentScores };
  result.event.effects.forEach(({ indicator, delta }) => {
    updated[indicator] = Math.max(0, Math.min(10, updated[indicator] + delta));
  });
  return updated;
}

export function applyBonus(current: Scores, indicator: IndicatorKey, delta: number): Scores {
  return {
    ...current,
    [indicator]: Math.max(0, Math.min(10, current[indicator] + delta)),
  };
}

export function initProfileScores(profiles: Profile[]): Record<number, Scores> {
  return profiles.reduce<Record<number, Scores>>((acc, p) => {
    acc[p.id] = { ...p.scores };
    return acc;
  }, {});
}
