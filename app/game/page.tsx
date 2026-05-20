'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { GameProvider, useGame } from './context';
import { loadGame } from '@/lib/storage';
import { DIFFICULTY_CONFIGS } from '@/lib/gameLogic';
import { Difficulty, Profile } from '@/data/types';
import { GameSave } from '@/lib/storage';
import ProfileCard from '@/components/ProfileCard';
import ColocationBoard from '@/components/ColocationBoard';
import ResultScreen from '@/components/ResultScreen';

// ── Difficulty Screen ──────────────────────────────────────────────────────

function DifficultyScreen() {
  const { dispatch } = useGame();
  const router = useRouter();

  const options: { key: Difficulty; emoji: string }[] = [
    { key: 'easy', emoji: '🌱' },
    { key: 'medium', emoji: '🌿' },
    { key: 'expert', emoji: '🌳' },
  ];

  return (
    <div className="screen">
      <div className="screen-header">
        <button
          onClick={() => router.push('/')}
          className="btn-ghost"
          aria-label="Retour à l'accueil"
          style={{ padding: '0.5rem' }}
        >
          ← Accueil
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 1.5rem 2rem',
          gap: '1.25rem',
        }}
      >
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, textAlign: 'center' }}>
          Choisis ta difficulté
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', textAlign: 'center' }}>
          Le seuil détermine la somme minimale par indicateur pour réussir la colocation.
        </p>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {options.map(({ key, emoji }) => {
            const cfg = DIFFICULTY_CONFIGS[key];
            return (
              <button
                key={key}
                onClick={() => dispatch({ type: 'SET_DIFFICULTY', payload: key })}
                aria-label={`Difficulté : ${cfg.label}`}
                style={{
                  background: 'var(--color-blanc)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
                }}
              >
                <span style={{ fontSize: '2rem' }}>{emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-base)' }}>
                    {cfg.label}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
                    {cfg.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Waiting Room ───────────────────────────────────────────────────────────

function WaitingRoom() {
  const { state, dispatch } = useGame();
  const cfg = state.difficulty ? DIFFICULTY_CONFIGS[state.difficulty] : null;
  if (!cfg) return null;

  const isSelected = (p: Profile) => state.selectedProfiles.some((s) => s.id === p.id);
  const canSelect = state.selectedProfiles.length < cfg.colocationSize;
  const canStart = state.selectedProfiles.length === cfg.colocationSize;

  return (
    <div className="screen">
      <div
        className="screen-header"
        style={{ borderBottom: '1px solid var(--color-border)', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <h1 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
          🏠 Salle d&apos;attente
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
          Sélectionne {cfg.colocationSize} profil{cfg.colocationSize > 1 ? 's' : ''} pour ta colocation
          ({state.selectedProfiles.length}/{cfg.colocationSize})
        </p>
      </div>

      <div className="screen-content">
        {state.drawnProfiles.map((profile) => {
          const selected = isSelected(profile);
          return (
            <ProfileCard
              key={profile.id}
              profile={profile}
              selected={selected}
              onSelect={canSelect || selected ? () => dispatch({ type: 'SELECT_PROFILE', payload: profile }) : undefined}
              onDeselect={() => dispatch({ type: 'DESELECT_PROFILE', payload: profile.id })}
              showCompatBadge
            />
          );
        })}
      </div>

      <div className="screen-footer">
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'START_GAME' })}
          disabled={!canStart}
          aria-label="Lancer la colocation avec les profils sélectionnés"
        >
          {canStart
            ? '🚀 Lancer la colocation !'
            : `Sélectionne encore ${cfg.colocationSize - state.selectedProfiles.length} profil${cfg.colocationSize - state.selectedProfiles.length > 1 ? 's' : ''}`}
        </button>
        <button
          className="btn-ghost"
          onClick={() => dispatch({ type: 'GO_DIFFICULTY' })}
        >
          ← Changer de difficulté
        </button>
      </div>
    </div>
  );
}

// ── Journal ────────────────────────────────────────────────────────────────

function JournalScreen() {
  const { state, dispatch } = useGame();

  return (
    <div className="screen">
      <div className="screen-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <h1 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
          📖 Journal des colocations
        </h1>
      </div>

      <div className="screen-content">
        {state.history.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--color-muted)',
              padding: '3rem 1rem',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Aucune saison terminée encore. Lance ta première colocation !
          </div>
        ) : (
          [...state.history].reverse().map((record) => (
            <div
              key={record.id}
              className={`journal-card ${record.success ? 'success' : 'failure'}`}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {record.success ? '✅' : '💪'} Saison {record.season}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
                  {DIFFICULTY_CONFIGS[record.difficulty].label}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {record.profiles.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: p.portraitColor,
                      borderRadius: 99,
                      padding: '0.2rem 0.6rem',
                      fontSize: 'var(--font-size-xs)',
                    }}
                  >
                    {p.portraitEmoji} {p.name}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
                {new Date(record.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="screen-footer">
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'NEW_SEASON' })}
          aria-label="Démarrer une nouvelle saison"
        >
          🏠 Nouvelle saison
        </button>
        <button
          className="btn-secondary"
          onClick={() => dispatch({ type: 'GO_DIFFICULTY' })}
        >
          ← Changer de difficulté
        </button>
      </div>
    </div>
  );
}

// ── Game Router ────────────────────────────────────────────────────────────

function GameRouter() {
  const { state } = useGame();

  switch (state.screen) {
    case 'difficulty':
      return <DifficultyScreen />;
    case 'waitingRoom':
      return <WaitingRoom />;
    case 'colocationBoard':
      return <ColocationBoard />;
    case 'result':
      return <ResultScreen />;
    case 'journal':
      return <JournalScreen />;
    default:
      return <DifficultyScreen />;
  }
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function GamePage() {
  const searchParams = useSearchParams();
  const shouldResume = searchParams.get('resume') === '1';
  const [save, setSave] = useState<GameSave | null | undefined>(undefined);

  useEffect(() => {
    if (shouldResume) {
      setSave(loadGame());
    } else {
      setSave(null);
    }
  }, [shouldResume]);

  if (save === undefined) return null;

  return (
    <GameProvider initialSave={save}>
      <GameRouter />
    </GameProvider>
  );
}
