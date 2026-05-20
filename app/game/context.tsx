'use client';
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  Difficulty,
  GameScreen,
  Profile,
  Scores,
  ActiveNet,
  WheelResult,
  SeasonRecord,
  INDICATOR_KEYS,
} from '@/data/types';
import {
  DIFFICULTY_CONFIGS,
  drawProfiles,
  calculateCollectiveScores,
  checkThresholds,
  spinWheel,
  applyEffects,
  applyBonus,
  initProfileScores,
} from '@/lib/gameLogic';
import { SOLIDARITY_NETS } from '@/data/solidarityNets';
import { saveGame, loadGame, GameSave } from '@/lib/storage';
import { PROFILES } from '@/data/profiles';

// ── State ──────────────────────────────────────────────────────────────────

export interface GameState {
  screen: GameScreen;
  season: number;
  difficulty: Difficulty | null;
  drawnProfiles: Profile[];
  selectedProfiles: Profile[];
  profileScores: Record<number, Scores>;
  activeSolidarityNets: ActiveNet[];
  turn: number;
  wheelUsedThisTurn: boolean;
  wheelResult: WheelResult | null;
  showWheelModal: boolean;
  wheelResults: WheelResult[];
  history: SeasonRecord[];
}

const INITIAL_STATE: GameState = {
  screen: 'difficulty',
  season: 1,
  difficulty: null,
  drawnProfiles: [],
  selectedProfiles: [],
  profileScores: {},
  activeSolidarityNets: [],
  turn: 1,
  wheelUsedThisTurn: false,
  wheelResult: null,
  showWheelModal: false,
  wheelResults: [],
  history: [],
};

// ── Actions ────────────────────────────────────────────────────────────────

export type GameAction =
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'SELECT_PROFILE'; payload: Profile }
  | { type: 'DESELECT_PROFILE'; payload: number }
  | { type: 'START_GAME' }
  | { type: 'SPIN_WHEEL' }
  | { type: 'CLOSE_WHEEL_MODAL' }
  | { type: 'ACTIVATE_NET'; payload: number }
  | { type: 'NEXT_TURN' }
  | { type: 'VALIDATE_COLOCATION' }
  | { type: 'FAIL_SEASON' }
  | { type: 'NEW_SEASON' }
  | { type: 'VIEW_JOURNAL' }
  | { type: 'GO_DIFFICULTY' }
  | { type: 'LOAD_SAVE'; payload: GameSave };

// ── Reducer ────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_DIFFICULTY': {
      const cfg = DIFFICULTY_CONFIGS[action.payload];
      const drawn = drawProfiles(cfg.drawnCount);
      return {
        ...state,
        difficulty: action.payload,
        drawnProfiles: drawn,
        selectedProfiles: [],
        profileScores: {},
        activeSolidarityNets: [],
        turn: 1,
        wheelUsedThisTurn: false,
        wheelResult: null,
        wheelResults: [],
        screen: 'waitingRoom',
      };
    }

    case 'SELECT_PROFILE': {
      if (!state.difficulty) return state;
      const cfg = DIFFICULTY_CONFIGS[state.difficulty];
      if (state.selectedProfiles.length >= cfg.colocationSize) return state;
      if (state.selectedProfiles.some((p) => p.id === action.payload.id)) return state;
      return {
        ...state,
        selectedProfiles: [...state.selectedProfiles, action.payload],
      };
    }

    case 'DESELECT_PROFILE': {
      return {
        ...state,
        selectedProfiles: state.selectedProfiles.filter((p) => p.id !== action.payload),
      };
    }

    case 'START_GAME': {
      if (!state.difficulty) return state;
      const cfg = DIFFICULTY_CONFIGS[state.difficulty];
      if (state.selectedProfiles.length < cfg.colocationSize) return state;
      return {
        ...state,
        screen: 'colocationBoard',
        profileScores: initProfileScores(state.selectedProfiles),
        activeSolidarityNets: [],
        turn: 1,
        wheelUsedThisTurn: false,
        wheelResult: null,
        wheelResults: [],
      };
    }

    case 'SPIN_WHEEL': {
      if (state.wheelUsedThisTurn || state.selectedProfiles.length === 0) return state;
      const result = spinWheel(state.selectedProfiles);
      const updatedScores = { ...state.profileScores };
      updatedScores[result.profileId] = applyEffects(
        result.profileId,
        state.profileScores[result.profileId] ?? state.selectedProfiles.find(p => p.id === result.profileId)!.scores,
        result
      );
      return {
        ...state,
        wheelUsedThisTurn: true,
        wheelResult: result,
        showWheelModal: true,
        profileScores: updatedScores,
        wheelResults: [...state.wheelResults, result],
      };
    }

    case 'CLOSE_WHEEL_MODAL': {
      return { ...state, showWheelModal: false };
    }

    case 'ACTIVATE_NET': {
      const profileId = action.payload;
      const alreadyActive = state.activeSolidarityNets.some(
        (n) => n.profileId === profileId && !n.applied
      );
      if (alreadyActive) return state;
      const net = SOLIDARITY_NETS.find((n) => n.profileId === profileId);
      if (!net) return state;
      return {
        ...state,
        activeSolidarityNets: [
          ...state.activeSolidarityNets,
          { profileId, turnsRemaining: net.delay, applied: false },
        ],
      };
    }

    case 'NEXT_TURN': {
      const updatedNets: ActiveNet[] = [];
      const updatedScores = { ...state.profileScores };

      state.activeSolidarityNets.forEach((net) => {
        if (net.applied) {
          updatedNets.push(net);
          return;
        }
        const newRemaining = net.turnsRemaining - 1;
        if (newRemaining <= 0) {
          const solidarityNet = SOLIDARITY_NETS.find((n) => n.profileId === net.profileId);
          if (solidarityNet) {
            const current = updatedScores[net.profileId];
            if (current) {
              updatedScores[net.profileId] = applyBonus(
                current,
                solidarityNet.bonus.indicator,
                solidarityNet.bonus.delta
              );
            }
          }
          updatedNets.push({ ...net, turnsRemaining: 0, applied: true });
        } else {
          updatedNets.push({ ...net, turnsRemaining: newRemaining });
        }
      });

      return {
        ...state,
        turn: state.turn + 1,
        wheelUsedThisTurn: false,
        activeSolidarityNets: updatedNets,
        profileScores: updatedScores,
      };
    }

    case 'VALIDATE_COLOCATION': {
      const record: SeasonRecord = {
        id: `season-${state.season}-${Date.now()}`,
        season: state.season,
        difficulty: state.difficulty!,
        profiles: state.selectedProfiles.map((p) => ({
          id: p.id,
          name: p.name,
          portraitEmoji: p.portraitEmoji,
          portraitColor: p.portraitColor,
        })),
        success: true,
        wheelResults: state.wheelResults,
        finalScores: calculateCollectiveScores(state.selectedProfiles, state.profileScores),
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        screen: 'result',
        history: [...state.history, record],
      };
    }

    case 'FAIL_SEASON': {
      const record: SeasonRecord = {
        id: `season-${state.season}-${Date.now()}`,
        season: state.season,
        difficulty: state.difficulty!,
        profiles: state.selectedProfiles.map((p) => ({
          id: p.id,
          name: p.name,
          portraitEmoji: p.portraitEmoji,
          portraitColor: p.portraitColor,
        })),
        success: false,
        wheelResults: state.wheelResults,
        finalScores: calculateCollectiveScores(state.selectedProfiles, state.profileScores),
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        screen: 'result',
        history: [...state.history, record],
      };
    }

    case 'NEW_SEASON': {
      if (!state.difficulty) return { ...INITIAL_STATE, history: state.history };
      const cfg = DIFFICULTY_CONFIGS[state.difficulty];
      const drawn = drawProfiles(cfg.drawnCount);
      return {
        ...state,
        screen: 'waitingRoom',
        season: state.season + 1,
        drawnProfiles: drawn,
        selectedProfiles: [],
        profileScores: {},
        activeSolidarityNets: [],
        turn: 1,
        wheelUsedThisTurn: false,
        wheelResult: null,
        showWheelModal: false,
        wheelResults: [],
      };
    }

    case 'VIEW_JOURNAL': {
      return { ...state, screen: 'journal' };
    }

    case 'GO_DIFFICULTY': {
      return { ...state, screen: 'difficulty' };
    }

    case 'LOAD_SAVE': {
      const save = action.payload;
      const drawnProfiles = save.drawnProfileIds
        .map((id) => PROFILES.find((p) => p.id === id))
        .filter(Boolean) as Profile[];
      const selectedProfiles = save.selectedProfileIds
        .map((id) => PROFILES.find((p) => p.id === id))
        .filter(Boolean) as Profile[];
      return {
        screen: save.screen,
        season: save.season,
        difficulty: save.difficulty,
        drawnProfiles,
        selectedProfiles,
        profileScores: save.profileScores,
        activeSolidarityNets: save.activeSolidarityNets,
        turn: save.turn,
        wheelUsedThisTurn: save.wheelUsedThisTurn,
        wheelResult: null,
        showWheelModal: false,
        wheelResults: save.wheelResults,
        history: save.history,
      };
    }

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  collectiveScores: Scores;
  isThresholdMet: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
  initialSave,
}: {
  children: React.ReactNode;
  initialSave?: GameSave | null;
}) {
  const [state, dispatch] = useReducer(
    gameReducer,
    INITIAL_STATE,
    (init) => {
      if (initialSave) {
        return gameReducer(init, { type: 'LOAD_SAVE', payload: initialSave });
      }
      return init;
    }
  );

  const collectiveScores = calculateCollectiveScores(state.selectedProfiles, state.profileScores);
  const threshold = state.difficulty ? DIFFICULTY_CONFIGS[state.difficulty].threshold : 12;
  const isThresholdMet = state.selectedProfiles.length > 0 && checkThresholds(collectiveScores, threshold);

  // Persist on every state change
  useEffect(() => {
    if (!state.difficulty) return;
    saveGame({
      screen: state.screen,
      season: state.season,
      difficulty: state.difficulty,
      drawnProfileIds: state.drawnProfiles.map((p) => p.id),
      selectedProfileIds: state.selectedProfiles.map((p) => p.id),
      profileScores: state.profileScores,
      activeSolidarityNets: state.activeSolidarityNets,
      turn: state.turn,
      wheelUsedThisTurn: state.wheelUsedThisTurn,
      wheelResults: state.wheelResults,
      history: state.history,
    });
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch, collectiveScores, isThresholdMet }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
