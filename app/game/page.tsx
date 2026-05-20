'use client';

import { useReducer, useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

import ProfileCard from '@/components/ProfileCard';
import IndicatorBars from '@/components/IndicatorBars';
import WheelSpinner from '@/components/WheelSpinner';
import SolidarityNetModal from '@/components/SolidarityNetModal';
import ResultScreen from '@/components/ResultScreen';

import { PROFILES, INDICATOR_ICONS, INDICATORS, type IndicatorKey, type IndicatorScores } from '@/data/profiles';
import {
  type Difficulty,
  type NetStatus,
  type WheelResult,
  type SeasonRecord,
  DIFFICULTY_CONFIG,
  drawProfiles,
  initialScores,
  sumScores,
  checkThresholds,
  areCompatible,
  spinWheel,
  applyScoreChanges,
  getSolidarityNet,
  buildInitialNetStatus,
  tickNets,
  getProfile,
} from '@/lib/gameLogic';
import { saveGame, loadGame, clearSave } from '@/lib/storage';

/* ─────────────────────────── State ─────────────────────────── */

type GameScreen = 'difficulty' | 'waitingRoom' | 'board' | 'result' | 'journal';

interface GameState {
  screen: GameScreen;
  season: number;
  difficulty: Difficulty | null;
  availableIds: number[];
  colocationIds: number[];
  profileScores: Record<number, IndicatorScores>;
  netStatus: Record<number, NetStatus>;
  turnNumber: number;
  wheelSpun: boolean;
  lastWheelResult: WheelResult | null;
  showWheelModal: boolean;
  netModalFor: number | null;
  history: SeasonRecord[];
  resolvedNets: number[];
}

type Action =
  | { type: 'SET_DIFFICULTY'; diff: Difficulty }
  | { type: 'CONFIRM_DIFFICULTY' }
  | { type: 'TOGGLE_PROFILE'; id: number }
  | { type: 'CONFIRM_COLOCATION' }
  | { type: 'SPIN_WHEEL' }
  | { type: 'CLOSE_WHEEL' }
  | { type: 'OPEN_NET_MODAL'; profileId: number }
  | { type: 'CLOSE_NET_MODAL' }
  | { type: 'ACTIVATE_NET'; profileId: number }
  | { type: 'NEXT_TURN' }
  | { type: 'VALIDATE_SEASON' }
  | { type: 'ABANDON_SEASON' }
  | { type: 'NEW_SEASON' }
  | { type: 'GOTO_JOURNAL' }
  | { type: 'BACK_HOME' }
  | { type: 'LOAD'; state: GameState };

function makeInitialState(): GameState {
  return {
    screen: 'difficulty',
    season: 1,
    difficulty: null,
    availableIds: [],
    colocationIds: [],
    profileScores: {},
    netStatus: {},
    turnNumber: 1,
    wheelSpun: false,
    lastWheelResult: null,
    showWheelModal: false,
    netModalFor: null,
    history: [],
    resolvedNets: [],
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'LOAD':
      return action.state;

    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.diff };

    case 'CONFIRM_DIFFICULTY': {
      if (!state.difficulty) return state;
      const cfg = DIFFICULTY_CONFIG[state.difficulty];
      const available = drawProfiles(Math.min(6, PROFILES.length));
      return {
        ...state,
        screen: 'waitingRoom',
        availableIds: available,
        colocationIds: [],
      };
    }

    case 'TOGGLE_PROFILE': {
      if (!state.difficulty) return state;
      const cfg = DIFFICULTY_CONFIG[state.difficulty];
      const already = state.colocationIds.includes(action.id);
      if (already) {
        return { ...state, colocationIds: state.colocationIds.filter((x) => x !== action.id) };
      }
      if (state.colocationIds.length >= cfg.slots) return state;
      return { ...state, colocationIds: [...state.colocationIds, action.id] };
    }

    case 'CONFIRM_COLOCATION': {
      if (!state.difficulty) return state;
      const cfg = DIFFICULTY_CONFIG[state.difficulty];
      if (state.colocationIds.length !== cfg.slots) return state;
      const profileScores: Record<number, IndicatorScores> = {};
      for (const id of state.colocationIds) {
        profileScores[id] = initialScores(id);
      }
      const netStatus = buildInitialNetStatus(state.colocationIds);
      return {
        ...state,
        screen: 'board',
        profileScores,
        netStatus,
        turnNumber: 1,
        wheelSpun: false,
        lastWheelResult: null,
        showWheelModal: false,
      };
    }

    case 'SPIN_WHEEL': {
      if (state.wheelSpun || !state.difficulty) return state;
      const result = spinWheel(state.colocationIds, state.difficulty === 'expert');
      const profileId = result.profileId;
      const current = state.profileScores[profileId];
      if (!current) return state;
      const updated = applyScoreChanges(current, result.event.effect);
      return {
        ...state,
        wheelSpun: true,
        lastWheelResult: result,
        showWheelModal: true,
        profileScores: { ...state.profileScores, [profileId]: updated },
      };
    }

    case 'CLOSE_WHEEL':
      return { ...state, showWheelModal: false };

    case 'OPEN_NET_MODAL':
      return { ...state, netModalFor: action.profileId };

    case 'CLOSE_NET_MODAL':
      return { ...state, netModalFor: null };

    case 'ACTIVATE_NET': {
      const net = getSolidarityNet(action.profileId);
      if (!net) return state;
      const existing = state.netStatus[action.profileId];
      if (!existing || existing.turnsLeft !== null) return state;
      return {
        ...state,
        netStatus: {
          ...state.netStatus,
          [action.profileId]: { turnsLeft: net.delay, applied: false },
        },
        netModalFor: null,
      };
    }

    case 'NEXT_TURN': {
      const { netStatus, scores, resolved } = tickNets(state.netStatus, state.profileScores);
      return {
        ...state,
        turnNumber: state.turnNumber + 1,
        netStatus,
        profileScores: scores,
        resolvedNets: resolved,
      };
    }

    case 'VALIDATE_SEASON': {
      if (!state.difficulty) return state;
      const threshold = DIFFICULTY_CONFIG[state.difficulty].threshold;
      const total = sumScores(state.colocationIds, state.profileScores);
      const success = checkThresholds(total, threshold);
      const record: SeasonRecord = {
        season: state.season,
        difficulty: state.difficulty,
        profileIds: state.colocationIds,
        success,
        turns: state.turnNumber,
        scoreSnapshot: { ...state.profileScores },
      };
      return {
        ...state,
        screen: 'result',
        history: [...state.history, record],
      };
    }

    case 'ABANDON_SEASON': {
      const record: SeasonRecord = {
        season: state.season,
        difficulty: state.difficulty ?? 'easy',
        profileIds: state.colocationIds,
        success: false,
        turns: state.turnNumber,
        scoreSnapshot: { ...state.profileScores },
      };
      return {
        ...state,
        screen: 'result',
        history: [...state.history, record],
      };
    }

    case 'NEW_SEASON':
      return {
        ...makeInitialState(),
        season: state.season + 1,
        history: state.history,
      };

    case 'GOTO_JOURNAL':
      return { ...state, screen: 'journal' };

    case 'BACK_HOME':
      return makeInitialState();

    default:
      return state;
  }
}

/* ─────────────────── Sub-screens ────────────────────────────── */

const PASTEL_COLORS = [
  'var(--color-green)',
  'var(--color-blue)',
  'var(--color-rose)',
  'var(--color-beige)',
];

function DifficultyScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="screen" aria-label="Sélection de difficulté">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/" className="btn btn-ghost btn-sm" aria-label="Retour à l'accueil">← Accueil</Link>
        <span className="title-md">Choisir la difficulté</span>
      </div>
      <p className="caption">Saison {state.season}</p>

      <div className="diff-grid">
        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, cfg]) => (
          <div
            key={key}
            className={`diff-card${state.difficulty === key ? ' selected' : ''}`}
            onClick={() => dispatch({ type: 'SET_DIFFICULTY', diff: key })}
            role="radio"
            aria-checked={state.difficulty === key}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') dispatch({ type: 'SET_DIFFICULTY', diff: key }); }}
          >
            <div className="diff-card-header">
              <span className="title-sm">{cfg.label}</span>
              {state.difficulty === key && <span aria-hidden="true">✓</span>}
            </div>
            <p className="caption">{cfg.description}</p>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        disabled={!state.difficulty}
        onClick={() => dispatch({ type: 'CONFIRM_DIFFICULTY' })}
        aria-label="Valider la difficulté et passer à la sélection des profils"
      >
        Choisir les colocataires →
      </button>
    </div>
  );
}

function WaitingRoomScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  if (!state.difficulty) return null;
  const cfg = DIFFICULTY_CONFIG[state.difficulty];
  const selectedCount = state.colocationIds.length;

  return (
    <div className="screen" aria-label="Salle d'attente — choix des colocataires">
      <div className="waiting-header">
        <h2 className="title-md">Salle d'attente</h2>
        <p className="waiting-subtitle">
          Sélectionne {cfg.slots} colocataire{cfg.slots > 1 ? 's' : ''} ({selectedCount}/{cfg.slots})
        </p>
      </div>

      <div className="selection-bar">
        <div className="selection-avatars">
          {Array.from({ length: cfg.slots }, (_, i) => {
            const id = state.colocationIds[i];
            const p = id !== undefined ? getProfile(id) : null;
            return (
              <div
                key={i}
                className={`selection-slot${p ? ' filled' : ''}`}
                style={p ? { background: p.avatarBg, border: '2px solid var(--color-accent)' } : {}}
                aria-label={p ? `Sélectionné : ${p.name}` : 'Emplacement vide'}
              >
                {p ? '✓' : ''}
              </div>
            );
          })}
          <span className="caption" style={{ marginLeft: 'auto' }}>
            {selectedCount === cfg.slots ? '✅ Prêt !' : `${cfg.slots - selectedCount} manquant${cfg.slots - selectedCount > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      <div className="profile-grid">
        {state.availableIds.map((id) => {
          const profile = getProfile(id);
          const selected = state.colocationIds.includes(id);
          const disabled = !selected && selectedCount >= cfg.slots;
          const showCompat = selected
            ? false
            : state.colocationIds.some((selId) => areCompatible(id, selId));

          return (
            <ProfileCard
              key={id}
              profile={profile}
              selected={selected}
              showCompat={showCompat}
              disabled={disabled}
              onClick={() => dispatch({ type: 'TOGGLE_PROFILE', id })}
            />
          );
        })}
      </div>

      <button
        className="btn btn-primary"
        disabled={selectedCount !== cfg.slots}
        onClick={() => dispatch({ type: 'CONFIRM_COLOCATION' })}
        aria-label="Confirmer la colocation et commencer la saison"
      >
        🏘️ Lancer la colocation
      </button>

      <button
        className="btn btn-ghost"
        onClick={() => dispatch({ type: 'BACK_HOME' })}
        aria-label="Retour à l'accueil"
      >
        ← Retour
      </button>
    </div>
  );
}

function BoardScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  if (!state.difficulty) return null;
  const cfg = DIFFICULTY_CONFIG[state.difficulty];
  const total = sumScores(state.colocationIds, state.profileScores);
  const allGood = checkThresholds(total, cfg.threshold);
  const maxPossible = cfg.slots * 5;

  return (
    <div className="screen board-screen" aria-label="Plateau de la colocation">
      <div className="board-top">
        <span className="turn-badge">Tour {state.turnNumber}</span>
        <span className="caption">{cfg.label} — seuil {cfg.threshold}</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => dispatch({ type: 'ABANDON_SEASON' })}
          aria-label="Abandonner cette saison"
        >
          ✕ Quitter
        </button>
      </div>

      <div className="board-grid" aria-label="Colocation">
        {Array.from({ length: 4 }, (_, i) => {
          const id = state.colocationIds[i];
          if (!id) {
            return (
              <div key={i} className="board-cell board-cell-empty" aria-hidden="true" />
            );
          }
          const p = getProfile(id);
          const scores = state.profileScores[id];
          const netSt = state.netStatus[id] ?? { turnsLeft: null, applied: false };
          const netAvailable = getSolidarityNet(id);

          return (
            <div key={id} className="board-cell" style={{ background: PASTEL_COLORS[i % PASTEL_COLORS.length] }}>
              <div className="board-profile-name">{p.name}</div>
              <div className="board-profile-fragility">{p.fragility}</div>

              {scores && (
                <div className="board-scores">
                  {(INDICATORS as IndicatorKey[]).map((k) => {
                    const v = scores[k];
                    return (
                      <div key={k} className="board-score-row" aria-label={`${k} : ${v}`}>
                        <span className="icon" aria-hidden="true">{INDICATOR_ICONS[k]}</span>
                        <div className="score-pip-row">
                          {Array.from({ length: 5 }, (_, j) => (
                            <div
                              key={j}
                              className={`score-pip${j < v ? ' filled' : ''}`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '.72rem', color: 'rgba(44,62,80,.7)' }}>{v}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {netAvailable && (
                <button
                  className={`board-net-btn${
                    netSt.applied ? ' applied' :
                    netSt.turnsLeft !== null ? ' active' : ''
                  }`}
                  onClick={() => dispatch({ type: 'OPEN_NET_MODAL', profileId: id })}
                  aria-label={`Filet de solidarité pour ${p.name} : ${netAvailable.organization}`}
                  aria-disabled={netSt.applied}
                >
                  {netSt.applied
                    ? '✅ Filet appliqué'
                    : netSt.turnsLeft !== null
                    ? `⏳ ${netSt.turnsLeft}t — ${netAvailable.organization}`
                    : `🤝 ${netAvailable.organization}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <IndicatorBars total={total} threshold={cfg.threshold} maxValue={maxPossible} />

      {state.resolvedNets.length > 0 && (
        <div className="card" style={{ background: '#e8f5e9', border: '1.5px solid var(--color-fortune)' }}>
          {state.resolvedNets.map((id) => {
            const p = getProfile(id);
            const net = getSolidarityNet(id);
            return (
              <p key={id} style={{ fontSize: '.88rem' }}>
                ✅ Filet de <strong>{p.name}</strong> ({net?.organization}) appliqué !
              </p>
            );
          })}
        </div>
      )}

      <div className="board-actions">
        <div className="board-actions-row">
          <button
            className="btn-wheel"
            onClick={() => dispatch({ type: 'SPIN_WHEEL' })}
            disabled={state.wheelSpun}
            aria-label={state.wheelSpun ? 'Roue déjà tournée cette saison' : 'Lancer la Roue de l\'Infortune'}
          >
            🎡 {state.wheelSpun ? 'Roue tournée' : 'Lancer la Roue'}
          </button>
          <button
            className="btn-next-turn"
            onClick={() => dispatch({ type: 'NEXT_TURN' })}
            aria-label="Passer au tour suivant"
          >
            ⏭ Tour suivant
          </button>
        </div>

        {allGood && (
          <button
            className="btn btn-fortune"
            onClick={() => dispatch({ type: 'VALIDATE_SEASON' })}
            aria-label="Valider la colocation — tous les seuils sont atteints"
          >
            🎉 Valider la colocation !
          </button>
        )}
      </div>

      {state.showWheelModal && state.lastWheelResult && (
        <WheelSpinner
          result={state.lastWheelResult}
          onClose={() => dispatch({ type: 'CLOSE_WHEEL' })}
        />
      )}

      {state.netModalFor !== null && (
        <SolidarityNetModal
          profileId={state.netModalFor}
          netStatus={state.netStatus[state.netModalFor] ?? { turnsLeft: null, applied: false }}
          onActivate={() => dispatch({ type: 'ACTIVATE_NET', profileId: state.netModalFor! })}
          onClose={() => dispatch({ type: 'CLOSE_NET_MODAL' })}
        />
      )}
    </div>
  );
}

function JournalScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  const sorted = [...state.history].reverse();

  return (
    <div className="screen" aria-label="Journal des colocations">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'NEW_SEASON' })} aria-label="Nouvelle saison">← Retour</button>
        <h2 className="title-md">Journal</h2>
      </div>

      {sorted.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="caption">Aucune saison jouée pour l'instant.</p>
        </div>
      ) : (
        <div className="journal-list">
          {sorted.map((rec, i) => {
            const profiles = rec.profileIds.map(getProfile);
            const cfg = DIFFICULTY_CONFIG[rec.difficulty];
            return (
              <div key={i} className="journal-entry">
                <div className="journal-entry-header">
                  <span className="title-sm">Saison {rec.season}</span>
                  <span className={`journal-badge ${rec.success ? 'success' : 'fail'}`}>
                    {rec.success ? '✅ Réussie' : '💙 Inachevée'}
                  </span>
                </div>
                <p className="caption">{cfg.label} · {rec.turns} tour{rec.turns > 1 ? 's' : ''}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {profiles.map((p, j) => (
                    <span
                      key={p.id}
                      style={{
                        background: PASTEL_COLORS[j % PASTEL_COLORS.length],
                        borderRadius: 20,
                        padding: '3px 10px',
                        fontSize: '.82rem',
                        fontWeight: 600,
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="btn btn-primary" onClick={() => dispatch({ type: 'NEW_SEASON' })} aria-label="Lancer une nouvelle saison">
        🌱 Nouvelle saison
      </button>
    </div>
  );
}

/* ──────────────────── Main component ───────────────────────── */

function GameInner() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (searchParams.get('resume') === '1') {
      const saved = loadGame();
      if (saved) {
        dispatch({
          type: 'LOAD',
          state: {
            screen: saved.screen ?? 'board',
            season: saved.season,
            difficulty: saved.difficulty,
            availableIds: saved.availableIds,
            colocationIds: saved.colocationIds,
            profileScores: saved.profileScores,
            netStatus: saved.netStatus,
            turnNumber: saved.turnNumber,
            wheelSpun: saved.wheelSpun,
            lastWheelResult: saved.lastWheelResult,
            showWheelModal: false,
            netModalFor: null,
            history: saved.history,
            resolvedNets: [],
          } as GameState,
        });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.screen === 'board' && state.difficulty) {
      saveGame({
        screen: state.screen,
        season: state.season,
        difficulty: state.difficulty,
        availableIds: state.availableIds,
        colocationIds: state.colocationIds,
        profileScores: state.profileScores,
        netStatus: state.netStatus,
        turnNumber: state.turnNumber,
        wheelSpun: state.wheelSpun,
        lastWheelResult: state.lastWheelResult,
        history: state.history,
      });
    }
    if (state.screen === 'result') {
      clearSave();
    }
  }, [state, hydrated]);

  if (!hydrated) {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p className="caption">Chargement…</p>
      </div>
    );
  }

  if (state.screen === 'result') {
    const last = state.history[state.history.length - 1];
    if (!last || !state.difficulty) return null;
    return (
      <ResultScreen
        success={last.success}
        profileIds={last.profileIds}
        difficulty={state.difficulty}
        scores={last.scoreSnapshot}
        turnNumber={last.turns}
        onNewSeason={() => dispatch({ type: 'NEW_SEASON' })}
        onJournal={() => dispatch({ type: 'GOTO_JOURNAL' })}
      />
    );
  }

  if (state.screen === 'journal') {
    return <JournalScreen state={state} dispatch={dispatch} />;
  }

  if (state.screen === 'board') {
    return <BoardScreen state={state} dispatch={dispatch} />;
  }

  if (state.screen === 'waitingRoom') {
    return <WaitingRoomScreen state={state} dispatch={dispatch} />;
  }

  return <DifficultyScreen state={state} dispatch={dispatch} />;
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p className="caption">Chargement…</p>
        </div>
      }
    >
      <GameInner />
    </Suspense>
  );
}
