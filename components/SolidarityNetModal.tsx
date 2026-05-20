'use client';

import { solidarityNets } from '@/data/solidarityNets';
import { formatEffect } from '@/lib/gameLogic';
import type { Profile } from '@/data/profiles';
import type { NetState } from '@/lib/storage';
import styles from './SolidarityNetModal.module.css';

interface Props {
  profile: Profile;
  netState: NetState;
  onActivate: (profileId: number) => void;
  onClose: () => void;
}

export default function SolidarityNetModal({ profile, netState, onActivate, onClose }: Props) {
  const net = solidarityNets.find((n) => n.profileId === profile.id);
  if (!net) return null;

  const canActivate = !netState.activated && !netState.applied;
  const isPending = netState.activated && !netState.applied;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Filet de solidarité de ${profile.name}`}
    >
      <div className="modal-box">
        <div className={styles.header}>
          <div
            className={styles.avatar}
            style={{ background: profile.avatarBg }}
            aria-hidden="true"
          >
            {profile.avatar}
          </div>
          <div>
            <h2 className={styles.title}>Filet de solidarité</h2>
            <p className={styles.who}>{profile.name}</p>
          </div>
        </div>

        <div className={styles.orgCard}>
          <p className={styles.orgName}>🏛️ {net.organisme}</p>
          <p className={styles.orgDesc}>{net.description}</p>
          <div className={styles.orgDetails}>
            <span className={styles.bonus} aria-label={`Bonus : ${formatEffect(net.bonus)}`}>
              Bonus {formatEffect(net.bonus)}
            </span>
            <span className={styles.delay}>
              ⏳ Délai : {net.delayTurns} tour{net.delayTurns > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {isPending && (
          <div className={styles.pendingBanner} role="status">
            <span>⏳</span>
            <span>
              Dossier en cours… encore {netState.turnsLeft} tour{netState.turnsLeft > 1 ? 's' : ''} d&apos;attente.
            </span>
          </div>
        )}

        {netState.applied && (
          <div className={styles.appliedBanner} role="status">
            <span>✓</span>
            <span>Filet activé — bonus déjà appliqué.</span>
          </div>
        )}

        <div className={styles.actions}>
          {canActivate && (
            <button
              className="btn btn-primary"
              onClick={() => onActivate(profile.id)}
              aria-label={`Activer ${net.organisme} pour ${profile.name}`}
            >
              Envoyer le dossier
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
