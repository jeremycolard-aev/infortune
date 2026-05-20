'use client';

import { INDICATOR_LABELS, INDICATOR_ICONS, INDICATORS, type IndicatorKey, type IndicatorScores } from '@/data/profiles';

interface Props {
  total: IndicatorScores;
  threshold: number;
  maxValue?: number;
}

export default function IndicatorBars({ total, threshold, maxValue = 20 }: Props) {
  return (
    <div className="indicator-bars" role="region" aria-label="Indicateurs collectifs de la colocation">
      {(INDICATORS as IndicatorKey[]).map((key) => {
        const value = total[key];
        const pct = Math.min(100, (value / maxValue) * 100);
        const thresholdPct = Math.min(100, (threshold / maxValue) * 100);
        const isOk = value >= threshold;
        const isAlmost = !isOk && value >= threshold * 0.8;

        let fillClass = 'low';
        if (isOk) fillClass = 'ok';
        else if (isAlmost) fillClass = 'almost';

        return (
          <div key={key} className="indicator-row">
            <div className="indicator-label-row">
              <span className="indicator-label">{INDICATOR_LABELS[key]}</span>
              <span
                className={`indicator-value ${isOk ? 'ok' : 'not-ok'}`}
                aria-label={`${value} sur ${threshold} requis`}
              >
                {value}/{threshold}
                {isOk ? ' ✓' : ''}
              </span>
            </div>
            <div className="bar-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={maxValue}>
              <div
                className={`bar-fill ${fillClass}`}
                style={{ width: `${pct}%` }}
              />
              <div
                className="bar-threshold"
                style={{ left: `${thresholdPct}%` }}
                title={`Seuil : ${threshold}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
