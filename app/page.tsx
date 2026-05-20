'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasSave, clearSave } from '@/lib/storage';
import styles from './home.module.css';

export default function HomePage() {
  const router = useRouter();
  const [saveExists, setSaveExists] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    setSaveExists(hasSave());
  }, []);

  function handleNew() {
    clearSave();
    router.push('/game');
  }

  function handleResume() {
    router.push('/game?resume=1');
  }

  return (
    <main className={styles.home}>
      <div className={styles.hero}>
        {/* Logo placeholder LpL */}
        <div className={styles.logoPlaceholder} aria-label="Logo LpL">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <circle cx="40" cy="40" r="38" fill="#3d6b8f" />
            <text x="50%" y="55%" textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="system-ui">
              LpL
            </text>
          </svg>
        </div>

        <h1 className={styles.title}>Ma Coloc Solidaire</h1>
        <p className={styles.subtitle}>
          Construis une colocation qui change des vies
        </p>
        <p className={styles.tagline}>
          Inspiré de{' '}
          <em>La Roue de l&apos;Infortune</em> · Association Lien pour l&apos;Autre
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className="btn btn-primary"
          onClick={handleNew}
          aria-label="Démarrer une nouvelle saison"
        >
          🏠 Nouvelle saison
        </button>

        {saveExists && (
          <button
            className="btn btn-secondary"
            onClick={handleResume}
            aria-label="Reprendre la partie sauvegardée"
          >
            ▶️ Reprendre
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={() => setShowRules(true)}
          aria-label="Lire les règles du jeu"
        >
          ❓ Comment jouer
        </button>
      </div>

      {showRules && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Règles du jeu">
          <div className="modal-box">
            <h2 className={styles.rulesTitle}>Comment jouer</h2>

            <ol className={styles.rulesList}>
              <li>
                <strong>Choisis la difficulté</strong> — 3 ou 4 colocataires, ou mode Expert.
              </li>
              <li>
                <strong>Salle d&apos;attente</strong> — Pioche 5 profils et sélectionne ceux qui formeront la coloc. Repère les compatibilités !
              </li>
              <li>
                <strong>Plateau</strong> — Les 5 indicateurs collectifs (💶💪🧑‍🤝‍🧑⚖️🚀) doivent tous atteindre le seuil de ta difficulté.
              </li>
              <li>
                <strong>Filets de solidarité</strong> — Chaque personnage peut activer un organisme d&apos;aide (+1 sur un indicateur), mais avec un délai simulant la réalité administrative.
              </li>
              <li>
                <strong>La Roue</strong> — Elle tourne 1 fois par saison et peut améliorer ou compliquer la situation d&apos;un colocataire au hasard.
              </li>
              <li>
                <strong>Valider</strong> — Si tous les seuils sont atteints, la saison est gagnée !
              </li>
            </ol>

            <div className={styles.indicatorLegend}>
              <span>💶 Stabilité financière</span>
              <span>💪 Santé / bien-être</span>
              <span>🧑‍🤝‍🧑 Réseau social</span>
              <span>⚖️ Accès aux droits</span>
              <span>🚀 Capacité à rebondir</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={() => setShowRules(false)}
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
