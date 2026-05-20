'use client';

import { useEffect, useRef, useState } from 'react';
import { INDICATOR_ICONS, type IndicatorKey } from '@/data/profiles';
import type { WheelResult } from '@/lib/gameLogic';
import { getProfile } from '@/lib/gameLogic';

interface Props {
  result: WheelResult | null;
  onClose: () => void;
}

const SEGMENTS = [
  '#d4e6c3', '#c5d9ed', '#f0d6dc', '#ddd3c5',
  '#d4e6c3', '#f0d6dc', '#c5d9ed', '#ddd3c5',
];

function WheelSvg({ spinning, finalAngle }: { spinning: boolean; finalAngle: number }) {
  const n = SEGMENTS.length;
  const r = 90;
  const cx = 100;
  const cy = 100;
  const sliceAngle = (2 * Math.PI) / n;

  const paths = SEGMENTS.map((color, i) => {
    const startAngle = i * sliceAngle - Math.PI / 2;
    const endAngle = startAngle + sliceAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    return (
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
        fill={color}
        stroke="#fff"
        strokeWidth="2"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 200 200"
      width="200"
      height="200"
      style={{
        borderRadius: '50%',
        boxShadow: '0 4px 20px rgba(0,0,0,.2)',
        transform: spinning
          ? undefined
          : `rotate(${finalAngle}deg)`,
        animation: spinning
          ? `spin 2.4s cubic-bezier(.4,0,.2,1) forwards`
          : undefined,
        ['--final-angle' as string]: `${finalAngle + 720}deg`,
      }}
      aria-hidden="true"
    >
      {paths}
      <circle cx={cx} cy={cy} r="18" fill="#fff" />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill="#3d6b8f">
        🎡
      </text>
    </svg>
  );
}

export default function WheelSpinner({ result, onClose }: Props) {
  const [phase, setPhase] = useState<'spinning' | 'result'>('spinning');
  const finalAngle = useRef(Math.floor(Math.random() * 360));

  useEffect(() => {
    const t = setTimeout(() => setPhase('result'), 2600);
    return () => clearTimeout(t);
  }, []);

  if (!result) return null;

  const profile = getProfile(result.profileId);
  const isSpinning = phase === 'spinning';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Résultat de la Roue">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="wheel-wrapper">
          <div className="wheel-svg-container">
            <div className="wheel-pointer" aria-hidden="true">▼</div>
            <WheelSvg spinning={isSpinning} finalAngle={finalAngle.current} />
          </div>

          {isSpinning && (
            <p className="title-md" aria-live="polite">La Roue tourne…</p>
          )}

          {!isSpinning && (
            <>
              <p className="caption">
                La Roue désigne : <strong>{profile.name}</strong>
              </p>

              <div className={`wheel-result-card ${result.isFortune ? 'fortune' : 'infortune'}`}>
                <div className="wheel-result-header">
                  <span className="wheel-result-icon" aria-hidden="true">
                    {result.isFortune ? '🟢' : '🔴'}
                  </span>
                  <div>
                    <div className={`wheel-result-type ${result.isFortune ? 'fortune-label' : 'infortune-label'}`}>
                      {result.isFortune ? '✨ Fortune' : '⚡ Infortune'}
                    </div>
                    <div className="wheel-result-title">{result.event.title}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {(Object.entries(result.event.effect) as [IndicatorKey, number][]).map(([k, v]) => (
                    <span key={k} className={`wheel-effect-badge ${v > 0 ? 'effect-up' : 'effect-dn'}`}>
                      {INDICATOR_ICONS[k]} {v > 0 ? `+${v}` : v}
                    </span>
                  ))}
                </div>

                <p className="wheel-phrase">« {result.event.phrase} »</p>
              </div>

              <button className="btn btn-primary" onClick={onClose} aria-label="Fermer et reprendre le jeu">
                Continuer →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
