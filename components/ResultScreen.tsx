'use client';

import { useEffect, useState } from 'react';
import type { Profile } from '@/data/profiles';
import type { Scores } from '@/data/profiles';
import { INDICATOR_KEYS, INDICATOR_LABELS } from '@/data/profiles';
import { getWeakIndicators, getCompatibilityScore } from '@/lib/gameLogic';
import styles from './ResultScreen.module.css';

interface Props {
  success: boolean;
  selectedProfiles: Profile[];
  scores: Scores;
  threshold: number;
  season: number;
  onNext: () => void;
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
}

const CONFETTI_COLORS = ['#d4e6c3', '#c5d9ed', '#f0d6dc', '#4caf50', '#3d6b8f', '#f59e0b'];

export default function ResultScreen({
  success,
  selectedProfiles,
  scores,
  threshold,
  season,
  onNext,
}: Props) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const weak = getWeakIndicators(scores, threshold);
  const compat = getCompatibilityScore(selectedProfiles);

  useEffect(() => {
    if (!success) return;
    const items: Confetti[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(items);
  }, [success]);

  return (
    <div className={styles.wrapper}>
      {/* Confettis */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className={styles.confetti}
          aria-hidden="true"
          style={{
            left: `${c.x}%`,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}

      <div className={styles.card}>
        <div className={styles.seasonBadge} aria-label={`Saison ${season}`}>
          Saison {season}
        </div>

        {success ? (
          <>
            <div className={styles.resultIcon} aria-hidden="true">🏆</div>
            <h1 className={styles.resultTitle}>Colocation réussie !</h1>
            <p className={styles.resultSub}>
              Tous les indicateurs ont atteint le seuil. Bravo coordinateur·rice !
            </p>
          </>
        ) : (
          <>
            <div className={styles.resultIcon} aria-hidden="true">🌱</div>
            <h1 className={styles.resultTitle}>Pas encore le bon équilibre</h1>
            <p className={styles.resultSub}>
              La coloc a besoin d&apos;un peu plus de travail. Chaque tentative est une leçon !
            </p>
          </>
        )}

        {/* Récap profils */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Les colocataires</h2>
          <div className={styles.profileChips}>
            {selectedProfiles.map((p) => (
              <div key={p.id} className={styles.chip}>
                <span
                  className={styles.chipAvatar}
                  style={{ background: p.avatarBg }}
                  aria-hidden="true"
                >
                  {p.avatar}
                </span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          {compat > 0 && (
            <p className={styles.synergy}>
              ✓ {compat} synergie{compat > 1 ? 's' : ''} de compatibilité trouvée{compat > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Indicateurs */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Bilan des indicateurs</h2>
          <div className={styles.indicators}>
            {INDICATOR_KEYS.map((key) => {
              const val = scores[key];
              const ok = val >= threshold;
              return (
                <div
                  key={key}
                  className={`${styles.indicatorRow} ${ok ? styles.ok : styles.notOk}`}
                >
                  <span>{INDICATOR_LABELS[key]}</span>
                  <span className={styles.indicatorVal}>
                    {val}/{threshold} {ok ? '✓' : '✗'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateurs faibles */}
        {!success && weak.length > 0 && (
          <div className={styles.weakBox}>
            <p className={styles.weakTitle}>À renforcer la prochaine fois :</p>
            <div className={styles.weakList}>
              {weak.map((k) => (
                <span key={k} className={styles.weakTag}>
                  {INDICATOR_LABELS[k]}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          onClick={onNext}
          autoFocus
        >
          {success ? '🏠 Nouvelle saison' : '🔄 Recommencer'}
        </button>
      </div>
    </div>
  );
}
