'use client';
import { useState, useEffect } from 'react';
import { WheelResult, INDICATOR_EMOJIS } from '@/data/types';

interface Props {
  isOpen: boolean;
  result: WheelResult | null;
  onClose: () => void;
}

export default function WheelSpinner({ isOpen, result, onClose }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isOpen && result) {
      setSpinning(true);
      setRevealed(false);
      const timer = setTimeout(() => {
        setSpinning(false);
        setRevealed(true);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  const isFortune = result?.isFortune ?? true;
  const colors = isFortune
    ? ['#4caf50', '#66bb6a', '#81c784', '#a5d6a7']
    : ['#e53935', '#ef5350', '#f44336', '#ef9a9a'];

  return (
    <div
      className="modal-overlay"
      onClick={revealed ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="La Roue tourne"
    >
      <div className="modal-center" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-xl)' }}>
          🎡 La Roue tourne…
        </h2>

        {/* SVG Wheel */}
        <div className="wheel-container">
          <svg
            className={spinning ? 'wheel-svg spin-anim' : 'wheel-svg'}
            width="160"
            height="160"
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            {/* 8 sectors alternating */}
            {Array.from({ length: 8 }, (_, i) => {
              const startAngle = (i / 8) * 360;
              const endAngle = ((i + 1) / 8) * 360;
              const start = polarToCartesian(80, 80, 75, endAngle);
              const end = polarToCartesian(80, 80, 75, startAngle);
              const largeArc = 0;
              const color = (i % 2 === 0 ? colors[0] : colors[2]);
              return (
                <path
                  key={i}
                  d={`M 80 80 L ${start.x} ${start.y} A 75 75 0 ${largeArc} 0 ${end.x} ${end.y} Z`}
                  fill={color}
                />
              );
            })}
            <circle cx="80" cy="80" r="18" fill="#fff" />
            <text
              x="80"
              y="87"
              textAnchor="middle"
              fontSize="22"
              style={{ userSelect: 'none' }}
            >
              🎡
            </text>
          </svg>

          {spinning && (
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>
              Le sort en est jeté…
            </p>
          )}
        </div>

        {/* Result */}
        {revealed && result && (
          <div className="animate-bounce-in" style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2.5rem',
                marginBottom: '0.5rem',
              }}
            >
              {isFortune ? '🎁' : '⚡'}
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '0.4rem 1rem',
                borderRadius: 99,
                background: isFortune ? '#e8f5e9' : '#fce4ec',
                color: isFortune ? 'var(--color-fortune)' : 'var(--color-infortune)',
                fontWeight: 700,
                marginBottom: '0.75rem',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {isFortune ? 'Fortune !' : 'Infortune…'}
            </div>

            <div
              style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                {result.profileName} — {result.event.title}
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
                {result.event.effects.map((e, i) => (
                  <span key={i}>
                    {INDICATOR_EMOJIS[e.indicator]}{' '}
                    {e.delta > 0 ? `+${e.delta}` : e.delta}{' '}
                  </span>
                ))}
              </div>
            </div>

            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-muted)',
                fontStyle: 'italic',
                marginBottom: '1.25rem',
              }}
            >
              {result.event.phrase}
            </p>

            <button
              className={isFortune ? 'btn-fortune' : 'btn-infortune'}
              onClick={onClose}
              aria-label="Fermer et continuer"
            >
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}
