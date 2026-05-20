'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hasSave } from '@/lib/storage';

function HowToPlayModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Comment jouer">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <h2 className="title-lg" style={{ marginBottom: 16 }}>Comment jouer ?</h2>

        <div className="howto-section">
          <h3>🎯 Objectif</h3>
          <p>Compose une colocation solidaire de 3 ou 4 personnes en équilibrant leurs 5 indicateurs collectifs jusqu'au seuil requis.</p>
        </div>

        <div className="howto-section">
          <h3>📋 Les 5 indicateurs</h3>
          <ul>
            <li>💶 Stabilité financière</li>
            <li>💪 Santé / bien-être</li>
            <li>🧑‍🤝‍🧑 Réseau social</li>
            <li>⚖️ Accès aux droits</li>
            <li>🚀 Capacité à rebondir</li>
          </ul>
        </div>

        <div className="howto-section">
          <h3>🎡 La Roue</h3>
          <p>À chaque saison, la Roue tourne une fois et tombe sur Fortune 🟢 ou Infortune 🔴 pour un colocataire aléatoire, modifiant ses indicateurs.</p>
        </div>

        <div className="howto-section">
          <h3>🤝 Filets de Solidarité</h3>
          <p>Chaque colocataire peut activer son filet de solidarité (organisme officiel) pour un bonus. Attention au délai administratif !</p>
        </div>

        <div className="howto-section">
          <h3>✨ Compatibilité</h3>
          <p>Certains profils sont compatibles entre eux — cherche les bonnes combinaisons pour maximiser les synergies.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{ marginTop: 8 }}
          aria-label="Fermer l'aide"
        >
          J'ai compris !
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [saveExists, setSaveExists] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setSaveExists(hasSave());
  }, []);

  return (
    <main className="screen home-screen" aria-label="Accueil — Ma Coloc Solidaire">
      <div className="home-logo" aria-hidden="true">🏘️</div>

      <div>
        <h1 className="title-xl" style={{ color: 'var(--color-accent)' }}>
          Ma Coloc Solidaire
        </h1>
        <p className="body" style={{ color: 'var(--color-muted)', marginTop: 8 }}>
          Construis une colocation qui change des vies
        </p>
        <p className="caption" style={{ marginTop: 6, fontStyle: 'italic' }}>
          Inspiré du jeu de société <em>La Roue de l'Infortune</em> — Lien pour l'Autre (LpL)
        </p>
      </div>

      <nav className="home-buttons" aria-label="Menu principal">
        <Link
          href="/game/"
          className="btn btn-primary"
          aria-label="Lancer une nouvelle saison"
        >
          🌱 Nouvelle saison
        </Link>

        {saveExists && (
          <Link
            href="/game/?resume=1"
            className="btn btn-secondary"
            aria-label="Reprendre la partie sauvegardée"
          >
            ▶️ Reprendre
          </Link>
        )}

        <button
          className="btn btn-secondary"
          onClick={() => setShowHelp(true)}
          aria-label="Voir les règles du jeu"
        >
          ❓ Comment jouer
        </button>
      </nav>

      <p className="caption" style={{ textAlign: 'center' }}>
        Jeu statique · Données locales · Zéro serveur
      </p>

      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
    </main>
  );
}
