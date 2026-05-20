'use client';

import { INDICATOR_ICONS, type IndicatorKey } from '@/data/profiles';
import { getSolidarityNet, getProfile, type NetStatus } from '@/lib/gameLogic';

interface Props {
  profileId: number;
  netStatus: NetStatus;
  onActivate: () => void;
  onClose: () => void;
}

export default function SolidarityNetModal({ profileId, netStatus, onActivate, onClose }: Props) {
  const net = getSolidarityNet(profileId);
  const profile = getProfile(profileId);

  if (!net) return null;

  const isActive = netStatus.turnsLeft !== null && !netStatus.applied;
  const isApplied = netStatus.applied;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Filet de Solidarité">
      <div className="modal-sheet">
        <div className="modal-handle" />

        <p className="title-md" style={{ marginBottom: 12 }}>
          Filet de Solidarité
        </p>

        <p className="caption" style={{ marginBottom: 16 }}>
          Pour <strong>{profile.name}</strong>
        </p>

        <div className="net-modal-info">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="title-sm">{net.organization}</p>
            <p className="body" style={{ color: 'var(--color-muted)', fontSize: '.88rem' }}>
              {net.description}
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {(Object.entries(net.bonus) as [IndicatorKey, number][]).map(([k, v]) => (
                <span key={k} className="wheel-effect-badge effect-up">
                  {INDICATOR_ICONS[k]} +{v}
                </span>
              ))}
            </div>
          </div>

          {!isApplied && (
            <div className="net-delay-note">
              ⏳ Délai administratif : <strong>{net.delay} tour{net.delay > 1 ? 's' : ''}</strong> avant effet.
              Les rouages de l'administration tournent à leur propre rythme…
            </div>
          )}

          {isActive && netStatus.turnsLeft !== null && (
            <div className="net-delay-note" style={{ background: '#fff3cd' }}>
              ⌛ En cours — encore <strong>{netStatus.turnsLeft} tour{netStatus.turnsLeft > 1 ? 's' : ''}</strong> avant résolution.
            </div>
          )}

          {isApplied && (
            <div className="net-delay-note" style={{ background: '#e8f5e9', color: '#388e3c' }}>
              ✅ Filet appliqué ! Le bonus a été ajouté aux scores de {profile.name}.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          {!isActive && !isApplied && (
            <button
              className="btn btn-primary"
              onClick={() => { onActivate(); onClose(); }}
              aria-label={`Activer le filet ${net.organization} pour ${profile.name}`}
            >
              Activer — {net.organization}
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={onClose}
            aria-label="Fermer"
          >
            {isApplied || isActive ? 'Fermer' : 'Pas maintenant'}
          </button>
        </div>
      </div>
    </div>
  );
}
