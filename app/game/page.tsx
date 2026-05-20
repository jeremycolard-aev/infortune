'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { profiles, type Profile, type Scores, INDICATOR_KEYS } from '@/data/profiles';
import { wheelEvents } from '@/data/events';
import { solidarityNets } from '@/data/solidarityNets';
import {
  getThreshold,
  drawProfiles,
  computeColocationScores,
  checkWin,
  pickWheelOutcome,
  applyWheelEffect,
  areCompatible,
  type Difficulty,
} from '@/lib/gameLogic';
import { saveGame, loadGame, clearSave, type NetState } from '@/lib/storage';

import ProfileCard from '@/components/ProfileCard';
import ColocationBoard from '@/components/ColocationBoard';
import WheelSpinner from '@/components/WheelSpinner';
import ResultScreen from '@/components/ResultScreen';
import styles from './game.module.css';

// ─── State ───────────────────────────────────────────────────────────────────

type Screen =
  | 'difficulty'
  | 'waiting-room'
  | 'board'
  | 'wheel'
  | 'result'
  | 'journal';

interface WheelResult {
  profileId: number;
  outcome: 'fortune' | 'infortune';
}

interface GameState {
  screen: Screen;
  season: number;
  difficulty: Difficulty;
  threshold: number;
  availableProfiles: Profile[];
  selectedProfiles: Profile[];
  scoreOverrides: Record<number, Partial<Scores>>;
  nets: Record<number, NetState>;
  wheelUsed: boolean;
  wheelResult: WheelResult | null;
  history: Array<{
    season: number;
    profileIds: number[];
    success: boolean;
    scores: Scores;
    compatibilityCount: number;
    date: string;
  }>;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SELECT_PROFILE'; profile: Profile }
  | { type: 'DESELECT_PROFILE'; profileId: number }
  | { type: 'START_BOARD' }
  | { type: 'ACTIVATE_NET'; profileId: number }
  | { type: 'SPIN_WHEEL' }
  | { type: 'CLOSE_WHEEL' }
  | { type: 'VALIDATE' }
  | { type: 'NEXT_SEASON' }
  | { type: 'LOAD'; state: GameState };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function createInitialState(): GameState {
  return {
    screen: 'difficulty',
    season: 1,
    difficulty: 3,
    threshold: 12,
    availableProfiles: [],
    selectedProfiles: [],
    scoreOverrides: {},
    nets: {},
    wheelUsed: false,
    wheelResult: null,
    history: [],
  };
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD':
      return action.state;

    case 'SET_DIFFICULTY': {
      const threshold = getThreshold(action.difficulty);
      const poolSize = action.difficulty === 'expert' ? 6 : 5;
      return {
        ...state,
        difficulty: action.difficulty,
        threshold,
        availableProfiles: drawProfiles(poolSize),
        screen: 'waiting-room',
      };
    }

    case 'SELECT_PROFILE': {
      const max = state.difficulty === 'expert' ? 4 : (state.difficulty as number);
      if (state.selectedProfiles.length >= max) return state;
      if (state.selectedProfiles.some((p) => p.id === action.profile.id)) return state;
      return {
        ...state,
        selectedProfiles: [...state.selectedProfiles, action.profile],
      };
    }

    case 'DESELECT_PROFILE':
      return {
        ...state,
        selectedProfiles: state.selectedProfiles.filter((p) => p.id !== action.profileId),
      };

    case 'START_BOARD': {
      const nets: Record<number, NetState> = {};
      for (const p of state.selectedProfiles) {
        nets[p.id] = { activated: false, turnsLeft: 0, applied: false };
      }
      return { ...state, screen: 'board', nets, scoreOverrides: {}, wheelUsed: false };
    }

    case 'ACTIVATE_NET': {
      const net = solidarityNets.find((n) => n.profileId === action.profileId);
      if (!net) return state;
      return {
        ...state,
        nets: {
          ...state.nets,
          [action.profileId]: {
            activated: true,
            turnsLeft: net.delayTurns,
            applied: false,
          },
        },
      };
    }

    case 'SPIN_WHEEL': {
      const profile =
        state.selectedProfiles[Math.floor(Math.random() * state.selectedProfiles.length)];
      const event = wheelEvents.find((e) => e.profileId === profile.id);
      if (!event) return { ...state, wheelUsed: true };
      const outcome = pickWheelOutcome(event);
      const effect = event[outcome].effect;

      const current = state.scoreOverrides[profile.id] ?? {};
      const updated = applyWheelEffect(current, effect);

      const newNets = { ...state.nets };
      for (const p of state.selectedProfiles) {
        const n = newNets[p.id];
        if (n?.activated && !n.applied) {
          const remaining = n.turnsLeft - 1;
          if (remaining <= 0) {
            const net = solidarityNets.find((s) => s.profileId === p.id);
            const bonusOverride = applyWheelEffect(state.scoreOverrides[p.id] ?? {}, net?.bonus ?? {});
            newNets[p.id] = { activated: true, turnsLeft: 0, applied: true };
            return {
              ...state,
              scoreOverrides: {
                ...state.scoreOverrides,
                [profile.id]: updated,
                [p.id]: bonusOverride,
              },
              nets: newNets,
              wheelUsed: true,
              wheelResult: { profileId: profile.id, outcome },
              screen: 'wheel',
            };
          } else {
            newNets[p.id] = { ...n, turnsLeft: remaining };
          }
        }
      }

      return {
        ...state,
        scoreOverrides: { ...state.scoreOverrides, [profile.id]: updated },
        nets: newNets,
        wheelUsed: true,
        wheelResult: { profileId: profile.id, outcome },
        screen: 'wheel',
      };
    }

    case 'CLOSE_WHEEL':
      return { ...state, screen: 'board' };

    case 'VALIDATE': {
      const scores = computeColocationScores(state.selectedProfiles, state.scoreOverrides);
      const success = checkWin(scores, state.threshold);
      const compatCount = countCompat(state.selectedProfiles);
      return {
        ...state,
        screen: 'result',
        history: [
          ...state.history,
          {
            season: state.season,
            profileIds: state.selectedProfiles.map((p) => p.id),
            success,
            scores,
            compatibilityCount: compatCount,
            date: new Date().toISOString(),
          },
        ],
      };
    }

    case 'NEXT_SEASON': {
      return {
        ...state,
        screen: 'difficulty',
        season: state.season + 1,
        availableProfiles: [],
        selectedProfiles: [],
        scoreOverrides: {},
        nets: {},
        wheelUsed: false,
        wheelResult: null,
      };
    }

    default:
      return state;
  }
}

function countCompat(selected: Profile[]): number {
  let count = 0;
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      if (areCompatible(selected[i], selected[j])) count++;
    }
  }
  return count;
}

// ─── Persistence helper ───────────────────────────────────────────────────────

function persist(state: GameState) {
  saveGame({
    season: state.season,
    difficulty: state.difficulty as 3 | 4 | 'expert',
    threshold: state.threshold,
    selectedProfileIds: state.selectedProfiles.map((p) => p.id),
    scoreOverrides: state.scoreOverrides as Record<number, Record<string, number>>,
    nets: state.nets,
    wheelUsed: state.wheelUsed,
    history: state.history.map((h) => ({
      ...h,
      scores: Object.fromEntries(
        INDICATOR_KEYS.map((k) => [k, h.scores[k]])
      ) as Record<string, number>,
    })),
    screen: state.screen,
  });
}

// ─── Inner component ─────────────────────────────────────────────────────────

function GameInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  // Load save on mount
  useEffect(() => {
    if (params.get('resume') === '1') {
      const saved = loadGame();
      if (saved) {
        const rehydrated: GameState = {
          screen: (saved.screen as Screen) ?? 'difficulty',
          season: saved.season,
          difficulty: saved.difficulty,
          threshold: saved.threshold,
          availableProfiles: [],
          selectedProfiles: saved.selectedProfileIds
            .map((id) => profiles.find((p) => p.id === id))
            .filter(Boolean) as Profile[],
          scoreOverrides: saved.scoreOverrides as Record<number, Partial<Scores>>,
          nets: saved.nets,
          wheelUsed: saved.wheelUsed,
          wheelResult: null,
          history: saved.history.map((h) => ({
            ...h,
            scores: h.scores as unknown as Scores,
          })),
        };
        dispatch({ type: 'LOAD', state: rehydrated });
        return;
      }
    }
    clearSave();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save
  useEffect(() => {
    if (state.screen !== 'difficulty') {
      persist(state);
    }
  }, [state]);

  const { screen, season, difficulty, threshold, availableProfiles, selectedProfiles } = state;

  const scores = computeColocationScores(selectedProfiles, state.scoreOverrides);
  const canValidate = checkWin(scores, threshold);

  const maxSelect = difficulty === 'expert' ? 4 : (difficulty as number);

  function isCompatibleWithSelection(profile: Profile): boolean {
    return selectedProfiles.some((p) => areCompatible(p, profile));
  }

  // ── Difficulty screen ──
  if (screen === 'difficulty') {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => router.push('/')} aria-label="Retour à l'accueil">
            ← Accueil
          </button>
          <span className={styles.seasonLabel}>Saison {season}</span>
        </div>

        <div className={styles.difficultyScreen}>
          <h1 className={styles.screenTitle}>Choisis ta difficulté</h1>
          <p className={styles.screenSub}>Combien de colocataires vas-tu accueillir ?</p>

          <div className={styles.diffCards}>
            {([
              { val: 3 as Difficulty, label: '3 colocataires', emoji: '🏠', desc: 'Seuil ≥ 12 par indicateur', color: 'var(--color-green)' },
              { val: 4 as Difficulty, label: '4 colocataires', emoji: '🏘️', desc: 'Seuil ≥ 15 par indicateur', color: 'var(--color-blue)' },
              { val: 'expert' as Difficulty, label: 'Expert', emoji: '⭐', desc: 'Seuil ≥ 18 — événements plus fréquents', color: 'var(--color-pink)' },
            ]).map(({ val, label, emoji, desc, color }) => (
              <button
                key={String(val)}
                className={styles.diffCard}
                style={{ background: color }}
                onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: val })}
                aria-label={`Difficulté : ${label} — ${desc}`}
              >
                <span className={styles.diffEmoji}>{emoji}</span>
                <span className={styles.diffLabel}>{label}</span>
                <span className={styles.diffDesc}>{desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Waiting room ──
  if (screen === 'waiting-room') {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button
            className={styles.backBtn}
            onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: difficulty })}
            aria-label="Retour au choix de difficulté"
          >
            ← Difficulté
          </button>
          <span className={styles.seasonLabel}>Saison {season}</span>
        </div>

        <div className={styles.waitingRoom}>
          <h1 className={styles.screenTitle}>Salle d&apos;attente</h1>
          <p className={styles.screenSub}>
            Sélectionne {maxSelect} colocataire{maxSelect > 1 ? 's' : ''} pour ta coloc
            <span className={styles.selectCount}>
              {selectedProfiles.length}/{maxSelect}
            </span>
          </p>

          <div className={styles.profileList}>
            {availableProfiles.map((profile) => {
              const isSelected = selectedProfiles.some((p) => p.id === profile.id);
              const isCompat = !isSelected && isCompatibleWithSelection(profile);
              return (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  selected={isSelected}
                  compatible={isCompat}
                  selectable
                  onSelect={(p) => dispatch({ type: 'SELECT_PROFILE', profile: p })}
                  onDeselect={(p) => dispatch({ type: 'DESELECT_PROFILE', profileId: p.id })}
                />
              );
            })}
          </div>

          <div className={styles.stickyFooter}>
            <button
              className="btn btn-primary"
              disabled={selectedProfiles.length < maxSelect}
              onClick={() => dispatch({ type: 'START_BOARD' })}
              aria-label={
                selectedProfiles.length < maxSelect
                  ? `Sélectionne encore ${maxSelect - selectedProfiles.length} profil(s)`
                  : 'Lancer la partie'
              }
            >
              {selectedProfiles.length < maxSelect
                ? `Encore ${maxSelect - selectedProfiles.length} profil(s)…`
                : '🏠 Lancer la coloc !'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Board ──
  if (screen === 'board' || screen === 'wheel') {
    const wheelRes = state.wheelResult;
    const wheelProfile = wheelRes
      ? selectedProfiles.find((p) => p.id === wheelRes.profileId)
      : undefined;
    const wheelEvent = wheelRes
      ? wheelEvents.find((e) => e.profileId === wheelRes.profileId)
      : undefined;

    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button
            className={styles.backBtn}
            onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: difficulty })}
            aria-label="Recommencer la sélection"
          >
            ← Resélectionner
          </button>
          <span className={styles.seasonLabel}>Saison {season}</span>
        </div>

        <h1 className={styles.boardTitle}>Plateau de la Coloc</h1>

        <ColocationBoard
          profiles={selectedProfiles}
          scores={scores}
          threshold={threshold}
          nets={state.nets}
          wheelUsed={state.wheelUsed}
          canValidate={canValidate}
          onActivateNet={(id) => dispatch({ type: 'ACTIVATE_NET', profileId: id })}
          onSpinWheel={() => dispatch({ type: 'SPIN_WHEEL' })}
          onValidate={() => dispatch({ type: 'VALIDATE' })}
        />

        {screen === 'wheel' && wheelEvent && wheelProfile && wheelRes && (
          <WheelSpinner
            event={wheelEvent}
            profile={wheelProfile}
            outcome={wheelRes.outcome}
            onClose={() => dispatch({ type: 'CLOSE_WHEEL' })}
          />
        )}
      </div>
    );
  }

  // ── Result ──
  if (screen === 'result') {
    const last = state.history[state.history.length - 1];
    const success = last?.success ?? false;
    return (
      <ResultScreen
        success={success}
        selectedProfiles={selectedProfiles}
        scores={scores}
        threshold={threshold}
        season={season}
        onNext={() => dispatch({ type: 'NEXT_SEASON' })}
      />
    );
  }

  return null;
}

// ─── Page export ─────────────────────────────────────────────────────────────

export default function GamePage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Chargement…</div>}>
      <GameInner />
    </Suspense>
  );
}
