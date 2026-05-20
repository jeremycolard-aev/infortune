'use client';

import { INDICATOR_KEYS, INDICATOR_LABELS, type Scores } from '@/data/profiles';
import styles from './IndicatorBars.module.css';

interface Props {
  scores: Scores;
  threshold: number;
  maxPerProfile: number;
  profileCount: number;
}

export default function IndicatorBars({ scores, threshold, profileCount }: Props) {
  const maxTotal = profileCount * 5;

  return (
    <div className={styles.bars} role="list" aria-label="Indicateurs collectifs de la colocation">
      {INDICATOR_KEYS.map((key) => {
        const value = scores[key];
        const pct = Math.min(100, (value / maxTotal) * 100);
        const thresholdPct = Math.min(100, (threshold / maxTotal) * 100);
        const reached = value >= threshold;
        const fillClass = reached
          ? styles.fillOk
          : value >= threshold * 0.6
          ? styles.fillWarn
          : styles.fillDanger;

        return (
          <div key={key} className={styles.row} role="listitem">
            <div className={styles.label}>
              <span aria-hidden="true">{INDICATOR_LABELS[key]}</span>
              <span className={`${styles.value} ${reached ? styles.valueOk : ''}`}>
                {value}/{threshold}
                {reached && <span aria-hidden="true"> ✓</span>}
              </span>
            </div>
            <div
              className={styles.track}
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={maxTotal}
              aria-label={`${INDICATOR_LABELS[key]} : ${value} sur ${threshold} requis`}
            >
              <div
                className={`${styles.fill} ${fillClass}`}
                style={{ width: `${pct}%` }}
              />
              <div
                className={styles.threshold}
                style={{ left: `${thresholdPct}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
