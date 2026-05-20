'use client';

import { useState } from 'react';
import type { Profile, Scores } from '@/data/profiles';
import type { NetState } from '@/lib/storage';
import IndicatorBars from './IndicatorBars';
import SolidarityNetModal from './SolidarityNetModal';
import styles from './ColocationBoard.module.css';

interface Props {
  profiles: Profile[];
  scores: Scores;
  threshold: number;
  nets: Record<number, NetState>;
  wheelUsed: boolean;
  canValidate: boolean;
  onActivateNet: (profileId: number) => void;
  onSpinWheel: () => void;
  onValidate: () => void;
}

const QUADRANT_COLORS = [
  'var(--color-green)',
  'var(--color-blue)',
  'var(--color-pink)',
  'var(--color-beige)',
];

export default function ColocationBoard({
  profiles,
  scores,
  threshold,
  nets,
  wheelUsed,
  canValidate,
  onActivateNet,
  onSpinWheel,
  onValidate,
}: Props) {
  const [netModal, setNetModal] = useState<Profile | null>(null);

  const gridClass =
    profiles.length === 3
      ? `${styles.boardGrid} ${styles.cols3}`
      : styles.boardGrid;

  function getNetLabel(profileId: number): string {
    const net = nets[profileId];
    if (!net) return 'Filet de solidarité';
    if (net.applied) return 'Filet ✓';
    if (net.activated) return `⏳ ${net.turnsLeft} tour${net.turnsLeft > 1 ? 's' : ''}`;
    return 'Activer filet';
  }

  function isNetDisabled(profileId: number): boolean {
    const net = nets[profileId];
    return !!net?.activated || !!net?.applied;
  }

  return (
    <div className={styles.board}>
      <div className={gridClass}>
        {profiles.map((profile, i) => {
          const netState = nets[profile.id] ?? { activated: false, turnsLeft: 0, applied: false };
          return (
            <div
              key={profile.id}
              className={styles.quadrant}
              style={{ background: QUADRANT_COLORS[i % QUADRANT_COLORS.length] }}
            >
              <div
                className={styles.avatar}
                style={{ background: profile.avatarBg }}
                aria-hidden="true"
              >
                {profile.avatar}
              </div>
              <div className={styles.profileName}>{profile.name}</div>
              <div className={styles.profileAge}>{profile.age} ans</div>
              <div className={styles.profileFragility}>{profile.fragility}</div>

              <div className={styles.miniScores} aria-label={`Scores de ${profile.name}`}>
                <span title="Stabilité financière">💶{profile.scores.financial}</span>
                <span title="Santé">💪{profile.scores.health}</span>
                <span title="Réseau social">🧑‍🤝‍🧑{profile.scores.social}</span>
                <span title="Droits">⚖️{profile.scores.rights}</span>
                <span title="Résilience">🚀{profile.scores.resilience}</span>
              </div>

              <button
                className={`${styles.netBtn} ${netState.applied ? styles.netApplied : ''}`}
                onClick={() => setNetModal(profile)}
                disabled={false}
                aria-label={`Filet de solidarité de ${profile.name} — ${getNetLabel(profile.id)}`}
              >
                {isNetDisabled(profile.id) ? (
                  netState.applied ? '✓ Filet activé' : `⏳ ${netState.turnsLeft}t`
                ) : (
                  '🏛️ Filet'
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.indicatorsSection}>
        <h2 className={styles.indicatorsTitle}>Indicateurs collectifs</h2>
        <IndicatorBars
          scores={scores}
          threshold={threshold}
          maxPerProfile={5}
          profileCount={profiles.length}
        />
      </div>

      <div className={styles.actions}>
        <button
          className="btn btn-primary"
          onClick={onSpinWheel}
          disabled={wheelUsed}
          aria-label={wheelUsed ? 'Roue déjà utilisée ce tour' : 'Lancer la Roue de l\'Infortune'}
        >
          {wheelUsed ? '🎡 Roue utilisée' : '🎡 Lancer la Roue'}
        </button>

        <button
          className={`btn ${canValidate ? 'btn-fortune' : 'btn-secondary'}`}
          onClick={onValidate}
          disabled={!canValidate}
          aria-label={
            canValidate
              ? 'Valider la colocation — tous les seuils sont atteints'
              : 'Valider la colocation — seuils non atteints'
          }
        >
          {canValidate ? '✅ Valider la coloc !' : '🔒 Seuils non atteints'}
        </button>
      </div>

      {netModal && (
        <SolidarityNetModal
          profile={netModal}
          netState={nets[netModal.id] ?? { activated: false, turnsLeft: 0, applied: false }}
          onActivate={(id) => {
            onActivateNet(id);
            setNetModal(null);
          }}
          onClose={() => setNetModal(null)}
        />
      )}
    </div>
  );
}
