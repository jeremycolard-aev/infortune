'use client';

import { useEffect, useState } from 'react';
import { formatEffect } from '@/lib/gameLogic';
import type { WheelEvent } from '@/data/events';
import type { Profile } from '@/data/profiles';
import styles from './WheelSpinner.module.css';

interface Props {
  event: WheelEvent;
  profile: Profile;
  outcome: 'fortune' | 'infortune';
  onClose: () => void;
}

export default function WheelSpinner({ event, profile, outcome, onClose }: Props) {
  const [phase, setPhase] = useState<'spinning' | 'result'>('spinning');

  useEffect(() => {
    const t = setTimeout(() => setPhase('result'), 2500);
    return () => clearTimeout(t);
  }, []);

  const result = event[outcome];
  const isGood = outcome === 'fortune';

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={phase === 'spinning' ? 'La roue tourne…' : `Résultat : ${outcome}`}
    >
      <div className={`modal-box ${styles.box}`}>
        {phase === 'spinning' ? (
          <div className={styles.spinPhase}>
            <p className={styles.spinTitle}>La Roue tourne…</p>
            <div
              className={styles.wheel}
              aria-busy="true"
              aria-label="Roue en rotation"
            />
            <p className={styles.spinSub}>Quel sort attend la coloc ?</p>
          </div>
        ) : (
          <div className={styles.resultPhase}>
            <div
              className={`${styles.resultBanner} ${isGood ? styles.fortune : styles.infortune}`}
            >
              <span className={styles.bannerEmoji}>{isGood ? '🟢' : '🔴'}</span>
              <span className={styles.bannerLabel}>
                {isGood ? 'Fortune !' : 'Infortune…'}
              </span>
            </div>

            <div className={styles.profileLine}>
              <div
                className={styles.miniAvatar}
                style={{ background: profile.avatarBg }}
                aria-hidden="true"
              >
                {profile.avatar}
              </div>
              <strong>{profile.name}</strong> est touché·e
            </div>

            <div className={`${styles.eventCard} ${isGood ? styles.eventGood : styles.eventBad}`}>
              <p className={styles.eventLabel}>{result.label}</p>
              <p
                className={styles.effectLine}
                aria-label={`Effet : ${formatEffect(result.effect)}`}
              >
                {formatEffect(result.effect)}
              </p>
            </div>

            <p className={styles.phrase}>
              <em>&ldquo;{result.phrase}&rdquo;</em>
            </p>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={onClose}
              autoFocus
            >
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
