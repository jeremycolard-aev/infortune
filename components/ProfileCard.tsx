'use client';
import { Profile } from '@/data/types';
import { INDICATOR_KEYS, INDICATOR_EMOJIS, MOBILITY_LABELS } from '@/data/types';

interface Props {
  profile: Profile;
  selected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
  compact?: boolean;
  showCompatBadge?: boolean;
}

function ScoreDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="score-dots" aria-label={`Score : ${value} sur ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`score-dot${i < value ? ' filled' : ''}`} />
      ))}
    </div>
  );
}

export default function ProfileCard({
  profile,
  selected = false,
  onSelect,
  onDeselect,
  compact = false,
  showCompatBadge = false,
}: Props) {
  const handleClick = () => {
    if (selected && onDeselect) onDeselect();
    else if (!selected && onSelect) onSelect();
  };

  const isInteractive = Boolean(onSelect || onDeselect);

  return (
    <article
      onClick={isInteractive ? handleClick : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? selected : undefined}
      onKeyDown={isInteractive ? (e) => e.key === 'Enter' && handleClick() : undefined}
      style={{
        background: selected ? `${profile.portraitColor}99` : '#fff',
        borderRadius: 'var(--radius-md)',
        border: selected ? `2.5px solid var(--color-accent)` : '2px solid var(--color-border)',
        padding: compact ? '0.75rem' : '1rem',
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'border-color 0.15s, background 0.15s',
        boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {/* Header: portrait + nom + infos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          className="portrait"
          style={{ background: profile.portraitColor }}
          aria-hidden="true"
        >
          {profile.portraitEmoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: 'var(--font-size-lg)' }}>{profile.name}</strong>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
              {profile.age} ans
            </span>
            {showCompatBadge && selected && (
              <span className="badge badge-compat">✓ En coloc</span>
            )}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
            {profile.fragility}
          </div>
        </div>
        {selected && (
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>✅</span>
        )}
      </div>

      {!compact && (
        <>
          {/* Histoire */}
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', lineHeight: 1.4 }}>
            {profile.story}
          </p>

          {/* Scores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {INDICATOR_KEYS.map((key) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', width: '1.25rem', textAlign: 'center' }}>
                  {INDICATOR_EMOJIS[key]}
                </span>
                <ScoreDots value={profile.scores[key]} />
              </div>
            ))}
          </div>

          {/* Traits + mobilité */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                background: 'var(--color-bg)',
                borderRadius: 99,
                padding: '0.2rem 0.6rem',
              }}
            >
              {MOBILITY_LABELS[profile.mobility]}
            </span>
            {profile.hasHome && (
              <span className="badge badge-home">🏠 Logement</span>
            )}
            {profile.traits.map((trait, i) => (
              <span key={i} style={{ fontSize: '1.1rem' }} aria-hidden="true">
                {trait}
              </span>
            ))}
          </div>

          {/* Besoins */}
          <div
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-accent)',
              background: 'rgba(61,107,143,0.06)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.6rem',
            }}
          >
            🎯 {profile.needs}
          </div>
        </>
      )}
    </article>
  );
}
