'use client';

import { type Profile, INDICATOR_KEYS } from '@/data/profiles';
import styles from './ProfileCard.module.css';

interface Props {
  profile: Profile;
  selected?: boolean;
  compatible?: boolean;
  compact?: boolean;
  onSelect?: (profile: Profile) => void;
  onDeselect?: (profile: Profile) => void;
  selectable?: boolean;
}

const INDICATOR_EMOJIS: Record<string, string> = {
  financial: '💶',
  health: '💪',
  social: '🧑‍🤝‍🧑',
  rights: '⚖️',
  resilience: '🚀',
};

export default function ProfileCard({
  profile,
  selected = false,
  compatible = false,
  compact = false,
  onSelect,
  onDeselect,
  selectable = false,
}: Props) {
  function handleClick() {
    if (!selectable) return;
    if (selected && onDeselect) onDeselect(profile);
    else if (!selected && onSelect) onSelect(profile);
  }

  return (
    <article
      className={`${styles.card} ${selected ? styles.selected : ''} ${compact ? styles.compact : ''}`}
      onClick={handleClick}
      role={selectable ? 'button' : 'article'}
      tabIndex={selectable ? 0 : undefined}
      aria-pressed={selectable ? selected : undefined}
      aria-label={`${profile.name}, ${profile.age} ans — ${profile.fragility}`}
      onKeyDown={(e) => {
        if (selectable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className={styles.header}>
        <div
          className={styles.avatar}
          style={{ background: profile.avatarBg }}
          aria-hidden="true"
        >
          {profile.avatar}
        </div>
        <div className={styles.identity}>
          <div className={styles.name}>
            {profile.name}
            <span className={styles.age}>{profile.age} ans</span>
          </div>
          <span className="badge badge-fragility">{profile.fragility}</span>
        </div>
        {compatible && (
          <span className="badge badge-compatible" aria-label="Compatible">
            ✓ Compatibles
          </span>
        )}
        {selected && (
          <div className={styles.selectedCheck} aria-hidden="true">✓</div>
        )}
      </div>

      {!compact && (
        <p className={styles.story}>{profile.story}</p>
      )}

      <div className={styles.scores} aria-label="Scores des indicateurs">
        {INDICATOR_KEYS.map((key) => (
          <div key={key} className={styles.scoreRow}>
            <span className={styles.scoreEmoji} aria-hidden="true">
              {INDICATOR_EMOJIS[key]}
            </span>
            <div
              className={styles.pips}
              aria-label={`${INDICATOR_EMOJIS[key]} : ${profile.scores[key]} sur 5`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`${styles.pip} ${i < profile.scores[key] ? styles.pipFilled : ''}`}
                />
              ))}
            </div>
            <span className={styles.scoreNum}>{profile.scores[key]}</span>
          </div>
        ))}
      </div>

      {!compact && (
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span title="Mobilité">{profile.mobility}</span>
            <span title="Logement">{profile.housing}</span>
            <span className={styles.traits} aria-label="Traits de personnalité">
              {profile.traits.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </span>
          </div>
          <p className={styles.needs} aria-label="Besoins">
            <strong>Besoins :</strong> {profile.needs}
          </p>
        </div>
      )}
    </article>
  );
}
