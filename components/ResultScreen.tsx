'use client';
import { useGame } from '@/app/game/context';
import { INDICATOR_KEYS, INDICATOR_EMOJIS, INDICATOR_LABELS } from '@/data/types';
import { DIFFICULTY_CONFIGS, getFailingIndicators } from '@/lib/gameLogic';

export default function ResultScreen() {
  const { state, dispatch, collectiveScores } = useGame();
  const cfg = state.difficulty ? DIFFICULTY_CONFIGS[state.difficulty] : null;
  const threshold = cfg?.threshold ?? 12;
  const lastRecord = state.history[state.history.length - 1];
  const success = lastRecord?.success ?? false;
  const failing = getFailingIndicators(collectiveScores, threshold);

  return (
    <div className="screen" style={{ background: success ? '#f1f8e9' : '#fff5f5' }}>
      {/* Header */}
      <div
        style={{
          padding: '2rem 1.5rem 1rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
          {success ? '🎉' : '💪'}
        </div>
        <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.5rem' }}>
          {success ? 'Colocation réussie !' : 'Saison terminée'}
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>
          {success
            ? "Bravo ! Tu as trouvé le bon équilibre pour cette colocation solidaire."
            : "Pas encore le bon équilibre — mais chaque tentative enrichit l'expérience !"}
        </p>
      </div>

      <div className="screen-content">
        {/* Scores finaux */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '0.75rem', fontWeight: 700 }}>
            Scores finaux (seuil : {threshold})
          </h2>
          {INDICATOR_KEYS.map((key) => {
            const value = collectiveScores[key];
            const met = value >= threshold;
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.4rem 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                  {INDICATOR_EMOJIS[key]} {INDICATOR_LABELS[key].split(' ').slice(1).join(' ')}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: met ? 'var(--color-fortune)' : 'var(--color-infortune)',
                  }}
                >
                  {value} {met ? '✓' : '✗'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Personnages en coloc */}
        {lastRecord && (
          <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '0.75rem', fontWeight: 700 }}>
              La colocation
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {lastRecord.profiles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--color-bg)',
                    borderRadius: 99,
                    padding: '0.35rem 0.75rem',
                  }}
                >
                  <div className="portrait-sm" style={{ background: p.portraitColor }}>
                    {p.portraitEmoji}
                  </div>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Points d'amélioration si échec */}
        {!success && failing.length > 0 && (
          <div
            className="card"
            style={{ borderLeft: '4px solid var(--color-infortune)', background: '#fff5f5' }}
          >
            <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Points à renforcer
            </h2>
            {failing.map((key) => (
              <div key={key} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-muted)' }}>
                {INDICATOR_EMOJIS[key]} {INDICATOR_LABELS[key]} — manque{' '}
                {threshold - collectiveScores[key]} point{threshold - collectiveScores[key] > 1 ? 's' : ''}
              </div>
            ))}
          </div>
        )}

        {/* Événements de la Roue */}
        {state.wheelResults.length > 0 && (
          <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: '0.75rem', fontWeight: 700 }}>
              Événements vécus
            </h2>
            {state.wheelResults.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.4rem 0',
                  borderBottom: i < state.wheelResults.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <span>{r.isFortune ? '🎁' : '⚡'}</span>
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                    {r.profileName} — {r.event.title}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-muted)' }}>
                    {r.event.effects.map((e, j) => (
                      <span key={j}>
                        {INDICATOR_EMOJIS[e.indicator]} {e.delta > 0 ? `+${e.delta}` : e.delta}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="screen-footer">
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'NEW_SEASON' })}
          aria-label="Démarrer une nouvelle saison"
        >
          🏠 Nouvelle saison
        </button>
        <button
          className="btn-secondary"
          onClick={() => dispatch({ type: 'VIEW_JOURNAL' })}
          aria-label="Voir le journal des colocations"
        >
          📖 Journal des colocations
        </button>
        <button
          className="btn-ghost"
          onClick={() => dispatch({ type: 'GO_DIFFICULTY' })}
        >
          Changer de difficulté
        </button>
      </div>
    </div>
  );
}
