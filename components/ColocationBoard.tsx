'use client';
import { useState } from 'react';
import { useGame } from '@/app/game/context';
import { Profile } from '@/data/types';
import { DIFFICULTY_CONFIGS, getCompatibilityPairs } from '@/lib/gameLogic';
import { SOLIDARITY_NETS } from '@/data/solidarityNets';
import IndicatorBars from './IndicatorBars';
import WheelSpinner from './WheelSpinner';
import SolidarityNetModal from './SolidarityNetModal';

const QUADRANT_COLORS = [
  'var(--color-vert)',
  'var(--color-bleu)',
  'var(--color-rose)',
  'var(--color-beige)',
];

interface ProfileSlotProps {
  profile: Profile;
  scores: { [key: string]: number };
  color: string;
  position: string;
  onNetClick: () => void;
  hasActiveNet: boolean;
  netTurns?: number;
  netApplied: boolean;
}

function ProfileSlot({
  profile,
  scores,
  color,
  position,
  onNetClick,
  hasActiveNet,
  netTurns,
  netApplied,
}: ProfileSlotProps) {
  const net = SOLIDARITY_NETS.find((n) => n.profileId === profile.id);

  return (
    <div
      style={{
        background: color,
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        minHeight: 140,
      }}
      aria-label={`Profil ${profile.name} — ${position}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
          className="portrait-sm"
          style={{ background: 'rgba(255,255,255,0.7)' }}
          aria-hidden="true"
        >
          {profile.portraitEmoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{profile.name}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(0,0,0,0.55)' }}>
            {profile.fragility}
          </div>
        </div>
      </div>

      {/* Mini scores */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {(['financial', 'health', 'social', 'rights', 'resilience'] as const).map((key) => {
          const emojis: Record<string, string> = {
            financial: '💶', health: '💪', social: '🧑‍🤝‍🧑', rights: '⚖️', resilience: '🚀',
          };
          return (
            <span
              key={key}
              style={{
                fontSize: 'var(--font-size-xs)',
                background: 'rgba(255,255,255,0.55)',
                borderRadius: 99,
                padding: '0.15rem 0.4rem',
              }}
            >
              {emojis[key]}{scores[key]}
            </span>
          );
        })}
      </div>

      {/* Net button */}
      {net && (
        <button
          onClick={onNetClick}
          disabled={hasActiveNet || netApplied}
          aria-label={`Filet de solidarité de ${profile.name} : ${net.organization}`}
          style={{
            background: netApplied
              ? '#e8f5e9'
              : hasActiveNet
              ? '#fff3e0'
              : 'rgba(255,255,255,0.75)',
            color: netApplied ? '#2e7d32' : hasActiveNet ? '#e65100' : 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.3rem 0.5rem',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            cursor: hasActiveNet || netApplied ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: 'auto',
          }}
        >
          {netApplied ? '✅' : hasActiveNet ? `⏳ ${netTurns}t` : '🏛️'}
          {' '}
          {netApplied ? 'Filet appliqué' : hasActiveNet ? `En cours` : net.organization}
        </button>
      )}
    </div>
  );
}

export default function ColocationBoard() {
  const { state, dispatch, collectiveScores, isThresholdMet } = useGame();
  const [selectedNetProfile, setSelectedNetProfile] = useState<Profile | null>(null);

  const cfg = state.difficulty ? DIFFICULTY_CONFIGS[state.difficulty] : null;
  const threshold = cfg?.threshold ?? 12;
  const colSize = state.selectedProfiles.length;
  const maxPossible = colSize * 5;
  const compatPairs = getCompatibilityPairs(state.selectedProfiles);

  const getNetState = (profileId: number) => {
    const active = state.activeSolidarityNets.find(
      (n) => n.profileId === profileId && !n.applied
    );
    const applied = state.activeSolidarityNets.find(
      (n) => n.profileId === profileId && n.applied
    );
    return { hasActiveNet: Boolean(active), netTurns: active?.turnsRemaining, netApplied: Boolean(applied) };
  };

  const positions = ['Haut-gauche', 'Haut-droite', 'Bas-gauche', 'Bas-droite'];

  const gridStyle: React.CSSProperties =
    colSize === 3
      ? {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '0.5rem',
        }
      : {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '0.5rem',
        };

  return (
    <div className="screen">
      {/* Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <div style={{ fontWeight: 700 }}>
            Saison {state.season} — Tour {state.turn}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
            {cfg?.label} · Seuil : {threshold} par indicateur
          </div>
        </div>
        {isThresholdMet && (
          <span
            style={{
              marginLeft: 'auto',
              background: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: 99,
              padding: '0.3rem 0.75rem',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
            }}
          >
            ✅ Seuils atteints !
          </span>
        )}
      </div>

      <div className="screen-content" style={{ gap: '0.75rem' }}>
        {/* Plateau: quadrants */}
        <div style={gridStyle}>
          {state.selectedProfiles.map((profile, i) => {
            const netState = getNetState(profile.id);
            const profileScore = state.profileScores[profile.id] ?? profile.scores;
            const isThirdInGrid3 = colSize === 3 && i === 2;
            return (
              <div
                key={profile.id}
                style={
                  isThirdInGrid3
                    ? { gridColumn: '1 / -1' }
                    : {}
                }
              >
                <ProfileSlot
                  profile={profile}
                  scores={profileScore}
                  color={QUADRANT_COLORS[i % 4]}
                  position={positions[i] ?? `Position ${i + 1}`}
                  onNetClick={() => setSelectedNetProfile(profile)}
                  hasActiveNet={netState.hasActiveNet}
                  netTurns={netState.netTurns}
                  netApplied={netState.netApplied}
                />
              </div>
            );
          })}
        </div>

        {/* Compatibilités */}
        {compatPairs.length > 0 && (
          <div
            style={{
              background: '#e8f5e9',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--font-size-xs)',
              color: '#2e7d32',
            }}
          >
            🤝 {compatPairs.length} paire{compatPairs.length > 1 ? 's' : ''} compatible{compatPairs.length > 1 ? 's' : ''} dans cette coloc !
          </div>
        )}

        {/* Indicateurs collectifs */}
        <div className="card card-elevated">
          <h2
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Indicateurs collectifs
          </h2>
          <IndicatorBars
            scores={collectiveScores}
            threshold={threshold}
            maxPossible={maxPossible}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="screen-footer">
        {isThresholdMet ? (
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: 'VALIDATE_COLOCATION' })}
            aria-label="Valider la colocation"
            style={{ background: 'var(--color-fortune)' }}
          >
            🏆 Valider la colocation !
          </button>
        ) : (
          <button
            className="btn-secondary"
            onClick={() => dispatch({ type: 'FAIL_SEASON' })}
            aria-label="Abandonner cette saison"
          >
            Terminer la saison
          </button>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: 'SPIN_WHEEL' })}
            disabled={state.wheelUsedThisTurn}
            aria-label="Lancer la Roue de l'Infortune"
            style={{ flex: 1 }}
          >
            {state.wheelUsedThisTurn ? '🎡 Roue utilisée' : '🎡 Lancer la Roue'}
          </button>
          <button
            className="btn-secondary"
            onClick={() => dispatch({ type: 'NEXT_TURN' })}
            aria-label="Passer au tour suivant"
            style={{ flex: 1 }}
          >
            ⏭️ Tour suivant
          </button>
        </div>
      </div>

      {/* Modales */}
      <WheelSpinner
        isOpen={state.showWheelModal}
        result={state.wheelResult}
        onClose={() => dispatch({ type: 'CLOSE_WHEEL_MODAL' })}
      />

      {selectedNetProfile && (
        <SolidarityNetModal
          profile={selectedNetProfile}
          activeNets={state.activeSolidarityNets}
          onActivate={(id) => dispatch({ type: 'ACTIVATE_NET', payload: id })}
          onClose={() => setSelectedNetProfile(null)}
        />
      )}
    </div>
  );
}
