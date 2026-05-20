'use client';

import { useEffect, useState } from 'react';
import { getProfile, countCompatiblePairs, type Difficulty, DIFFICULTY_CONFIG } from '@/lib/gameLogic';
import { INDICATOR_LABELS, type IndicatorScores, type IndicatorKey, INDICATORS } from '@/data/profiles';

const PASTEL_COLORS = ['var(--color-green)', 'var(--color-blue)', 'var(--color-rose)', 'var(--color-beige)'];

const CONFETTI_COLORS = ['#d4e6c3', '#c5d9ed', '#f0d6dc', '#ddd3c5', '#3d6b8f', '#4caf50'];

interface Props {
  success: boolean;
  profileIds: number[];
  difficulty: Difficulty;
  scores: Record<number, IndicatorScores>;
  turnNumber: number;
  onNewSeason: () => void;
  onJournal: () => void;
}

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
    left: `${(i / 28) * 100}%`,
    dur: `${1.5 + Math.random() * 1.5}s`,
    delay: `${Math.random() * 0.6}s`,
  }));

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            ['--dur' as string]: p.dur,
            ['--delay' as string]: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function ResultScreen({ success, profileIds, difficulty, scores, turnNumber, onNewSeason, onJournal }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const threshold = DIFFICULTY_CONFIG[difficulty].threshold;
  const compatPairs = countCompatiblePairs(profileIds);
  const profiles = profileIds.map(getProfile);

  return (
    <div className="screen result-screen">
      {success && show && <Confetti />}

      {show && (
        <>
          <div className="result-icon" aria-hidden="true">
            {success ? '🎉' : '💙'}
          </div>

          <div>
            <h2 className="title-lg" style={{ textAlign: 'center' }}>
              {success
                ? 'Colocation réussie !'
                : 'Pas encore le bon équilibre'}
            </h2>
            <p className="caption" style={{ textAlign: 'center', marginTop: 6 }}>
              {success
                ? `Tous les seuils atteints en ${turnNumber} tour${turnNumber > 1 ? 's' : ''}.`
                : 'Certains indicateurs n\'ont pas encore atteint leur seuil — mais chaque essai enrichit les profils.'}
            </p>
          </div>

          <div className="result-summary">
            <p className="title-sm" style={{ marginBottom: 4 }}>Les colocataires</p>
            <div className="result-profile-row">
              {profiles.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: PASTEL_COLORS[i % PASTEL_COLORS.length],
                    borderRadius: 20,
                    padding: '4px 12px',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{p.name}</span>
                </div>
              ))}
            </div>

            <p className="result-compat-count">
              {compatPairs > 0
                ? `✨ ${compatPairs} paire${compatPairs > 1 ? 's' : ''} compatible${compatPairs > 1 ? 's' : ''} trouvée${compatPairs > 1 ? 's' : ''}`
                : '⚠️ Aucune paire de compatibilité — à travailler la prochaine saison'}
            </p>

            {!success && (
              <div style={{ marginTop: 8 }}>
                <p className="title-sm" style={{ marginBottom: 6 }}>Indicateurs insuffisants</p>
                {(INDICATORS as IndicatorKey[]).map((k) => {
                  let total = 0;
                  for (const id of profileIds) {
                    const s = scores[id];
                    if (s) total += s[k];
                  }
                  if (total >= threshold) return null;
                  return (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', padding: '2px 0' }}>
                      <span>{INDICATOR_LABELS[k]}</span>
                      <span style={{ color: 'var(--color-misfort)', fontWeight: 700 }}>
                        {total} / {threshold}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button className="btn btn-primary" onClick={onNewSeason} aria-label="Lancer une nouvelle saison">
              {success ? '🌟 Nouvelle saison' : '🔄 Réessayer'}
            </button>
            <button className="btn btn-secondary" onClick={onJournal} aria-label="Voir le journal des colocations">
              📖 Journal des colocations
            </button>
          </div>
        </>
      )}
    </div>
  );
}
