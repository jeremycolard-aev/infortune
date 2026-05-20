'use client';
import { Profile, ActiveNet, INDICATOR_EMOJIS } from '@/data/types';
import { SOLIDARITY_NETS } from '@/data/solidarityNets';

interface Props {
  profile: Profile;
  activeNets: ActiveNet[];
  onActivate: (profileId: number) => void;
  onClose: () => void;
}

export default function SolidarityNetModal({ profile, activeNets, onActivate, onClose }: Props) {
  const net = SOLIDARITY_NETS.find((n) => n.profileId === profile.id);
  if (!net) return null;

  const activeNet = activeNets.find(
    (n) => n.profileId === profile.id && !n.applied
  );
  const appliedNet = activeNets.find(
    (n) => n.profileId === profile.id && n.applied
  );
  const isActive = Boolean(activeNet);
  const isApplied = Boolean(appliedNet);

  const canActivate = !isActive && !isApplied;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Filet de solidarité pour ${profile.name}`}
    >
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div
          style={{
            width: 40,
            height: 4,
            background: 'var(--color-border)',
            borderRadius: 99,
            margin: '0 auto 1.25rem',
          }}
          aria-hidden="true"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="portrait" style={{ background: profile.portraitColor }}>
            {profile.portraitEmoji}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
              Filet de solidarité
            </div>
          </div>
        </div>

        {/* Net info */}
        <div
          style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
            🏛️ {net.organization}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
            Bonus : {INDICATOR_EMOJIS[net.bonus.indicator]} +{net.bonus.delta}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
            ⏳ Délai administratif : {net.delay} tour{net.delay > 1 ? 's' : ''}
          </div>
        </div>

        {/* Status */}
        {isApplied && (
          <div
            style={{
              background: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            ✅ Filet activé et appliqué !
          </div>
        )}

        {isActive && activeNet && (
          <div className="timer-badge" style={{ marginBottom: '1rem', fontSize: 'var(--font-size-sm)' }}>
            ⏳ En cours — encore {activeNet.turnsRemaining} tour{activeNet.turnsRemaining > 1 ? 's' : ''} avant l'effet
          </div>
        )}

        {canActivate && (
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)', marginBottom: '1rem' }}>
            Activer le filet de solidarité pour déclencher l'aide de {net.organization}.
            Le bonus sera appliqué dans {net.delay} tour{net.delay > 1 ? 's' : ''}.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={() => {
              onActivate(profile.id);
              onClose();
            }}
            disabled={!canActivate}
            aria-label={`Activer ${net.organization} pour ${profile.name}`}
          >
            {isApplied
              ? '✅ Déjà appliqué'
              : isActive
              ? '⏳ En cours…'
              : `Activer — ${net.organization}`}
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
