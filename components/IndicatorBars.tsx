'use client';
import { Scores, INDICATOR_KEYS, INDICATOR_LABELS, INDICATOR_EMOJIS } from '@/data/types';

interface Props {
  scores: Scores;
  threshold: number;
  maxPossible?: number;
}

function getColor(value: number, threshold: number): string {
  if (value >= threshold) return 'var(--color-fortune)';
  if (value >= threshold * 0.7) return '#ff9800';
  return 'var(--color-infortune)';
}

export default function IndicatorBars({ scores, threshold, maxPossible = 20 }: Props) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
      aria-label="Indicateurs collectifs de la colocation"
    >
      {INDICATOR_KEYS.map((key) => {
        const value = scores[key];
        const pct = Math.min(100, (value / maxPossible) * 100);
        const thresholdPct = Math.min(100, (threshold / maxPossible) * 100);
        const met = value >= threshold;
        const color = getColor(value, threshold);

        return (
          <div key={key}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                {INDICATOR_EMOJIS[key]} {INDICATOR_LABELS[key].split(' ').slice(1).join(' ')}
              </span>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 700,
                  color,
                }}
                aria-label={`${value} sur ${threshold} requis`}
              >
                {value}/{threshold}
                {met && ' ✓'}
              </span>
            </div>
            <div
              className="progress-bar-track"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={maxPossible}
            >
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
              <div
                className="progress-bar-threshold"
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
