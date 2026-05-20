'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasSave } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [saveExists, setSaveExists] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    setSaveExists(hasSave());
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: 'linear-gradient(160deg, var(--color-vert) 0%, var(--color-bleu) 100%)',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '1.5rem' }}>
        <svg
          viewBox="0 0 100 100"
          width="90"
          height="90"
          aria-label="Logo Lien pour l'Autre"
          role="img"
        >
          <circle cx="50" cy="50" r="48" fill="var(--color-accent)" />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="white"
            fontSize="26"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            LpL
          </text>
        </svg>
      </div>

      {/* Titre */}
      <h1
        style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 700,
          color: 'var(--color-texte)',
          textAlign: 'center',
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}
      >
        Ma Coloc Solidaire
      </h1>
      <p
        style={{
          fontSize: 'var(--font-size-base)',
          color: 'rgba(44,62,80,0.72)',
          textAlign: 'center',
          marginBottom: '2.5rem',
          maxWidth: 280,
        }}
      >
        Construis une colocation qui change des vies
      </p>

      {/* Actions */}
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          className="btn-primary"
          onClick={() => router.push('/game')}
          aria-label="Démarrer une nouvelle saison"
        >
          🏠 Nouvelle saison
        </button>

        {saveExists && (
          <button
            className="btn-secondary"
            onClick={() => router.push('/game?resume=1')}
            aria-label="Reprendre la partie sauvegardée"
            style={{ background: 'rgba(255,255,255,0.7)' }}
          >
            ▶️ Reprendre
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={() => setShowRules(true)}
          aria-label="Voir les règles du jeu"
          style={{ background: 'rgba(255,255,255,0.7)' }}
        >
          ❓ Comment jouer
        </button>
      </div>

      {/* Crédit */}
      <p
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 'var(--font-size-xs)',
          color: 'rgba(44,62,80,0.5)',
        }}
      >
        Inspiré de La Roue de l&apos;Infortune — Association Lien pour l&apos;Autre
      </p>

      {/* Modal règles */}
      {showRules && (
        <div
          className="modal-overlay"
          onClick={() => setShowRules(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Règles du jeu"
        >
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
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
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem' }}>
              🎲 Comment jouer
            </h2>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '🎯', text: 'Choisis une difficulté (3 ou 4 colocataires).' },
                { icon: '👥', text: 'Sélectionne tes colocataires dans la salle d\'attente parmi les profils disponibles.' },
                { icon: '📊', text: 'Équilibre les 5 indicateurs collectifs : Finances, Santé, Réseau, Droits, Rebond.' },
                { icon: '🎡', text: 'Lance la Roue une fois par tour pour vivre des événements Fortune ou Infortune.' },
                { icon: '🏛️', text: 'Active les Filets de Solidarité pour obtenir une aide (avec délai administratif !).' },
                { icon: '🏆', text: 'Valide la coloc quand tous les seuils sont atteints !' },
              ].map(({ icon, text }, i) => (
                <li key={i} style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                  {icon} {text}
                </li>
              ))}
            </ol>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                className="btn-primary"
                onClick={() => setShowRules(false)}
                aria-label="Fermer les règles"
              >
                C'est parti !
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
