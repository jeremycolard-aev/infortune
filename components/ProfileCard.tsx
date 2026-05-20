'use client';

import { type Profile, MOBILITY_LABELS, INDICATOR_ICONS, INDICATORS, type IndicatorKey } from '@/data/profiles';

interface Props {
  profile: Profile;
  selected?: boolean;
  showCompat?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const AVATAR_EMOJIS: Record<string, string> = {
  '🍲': '👩‍🍳', '💬': '🗣️', '🌿': '🌱', '🧹': '🧽', '💻': '💻', '📋': '📋',
};

function getAvatarEmoji(traits: string[]): string {
  const first = traits[0];
  return first ? (AVATAR_EMOJIS[first] ?? '🙂') : '🙂';
}

export default function ProfileCard({ profile, selected, showCompat, onClick, disabled }: Props) {
  const emoji = getAvatarEmoji(profile.traits);

  return (
    <div
      className={`profile-card${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-pressed={selected}
      aria-disabled={disabled}
      onKeyDown={onClick && !disabled ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <div
        className="profile-avatar"
        style={{ background: profile.avatarBg }}
        aria-hidden="true"
      >
        {emoji}
      </div>

      <div className="profile-info">
        <div className="profile-name">
          {profile.name}, {profile.age} ans
        </div>
        <div className="profile-fragility">{profile.fragility}</div>

        {showCompat && (
          <div className="compat-badge" aria-label="Compatible avec la sélection">
            ✓ Compatibilité
          </div>
        )}

        <div className="profile-mini-scores" aria-label="Scores individuels">
          {(INDICATORS as IndicatorKey[]).map((k) => (
            <span key={k} className="mini-score" title={k}>
              {INDICATOR_ICONS[k]} {profile.scores[k]}
            </span>
          ))}
        </div>

        <div className="profile-traits" aria-label="Traits de personnalité">
          {profile.traits.map((t, i) => (
            <span key={i} className="trait-badge" title={t} aria-label={t}>
              {t}
            </span>
          ))}
          <span className="mini-score">
            {MOBILITY_LABELS[profile.mobility]}
          </span>
          <span className="mini-score">
            {profile.hasHome ? '🏠 Logé' : '❌ Sans logis'}
          </span>
        </div>
      </div>
    </div>
  );
}
