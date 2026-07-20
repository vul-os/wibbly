import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../components/catalogue.js';
import { setupState } from '../components/game-settings.js';

/**
 * Title screen — the first thing a player sees.
 *
 * Drives like a console menu, not a form: ← / → move between games, Enter
 * starts the selected one, S opens camera setup. Every claim on this screen is
 * checkable against the repo — there are no counters, no leaderboards and no
 * player numbers, because there are no players to count.
 */

const GameArt = ({ kind, planned }) => {
  const stroke = planned ? 'var(--planned)' : 'var(--accent)';
  const dim = 'var(--text-3)';
  return (
    <svg viewBox="0 0 120 80" className="wb-card__art" aria-hidden="true">
      {/* Every card shares a figure + a trail: the figure is the tracked
          person, the trail is the gesture the game needs. */}
      <circle cx="42" cy="20" r="7" fill="none" stroke={dim} strokeWidth="2" />
      <path d="M42 27 L42 48 M42 34 L30 42 M42 48 L34 66 M42 48 L50 66" fill="none" stroke={dim} strokeWidth="2" strokeLinecap="round" />
      {kind === 'tennis' && (
        <>
          <path d="M42 34 L58 26" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="64" cy="23" rx="7" ry="9" fill="none" stroke={stroke} strokeWidth="2.5" transform="rotate(28 64 23)" />
          <path d="M74 20 Q88 12 100 22" fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
          <circle cx="102" cy="24" r="3.5" fill={stroke} />
        </>
      )}
      {kind === 'soccer' && (
        <>
          <path d="M42 48 L58 62" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M64 60 Q80 44 98 50" fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
          <circle cx="62" cy="63" r="7" fill="none" stroke={stroke} strokeWidth="2.5" />
          <path d="M58 60 L66 66 M62 56 L62 70" stroke={stroke} strokeWidth="1.2" />
        </>
      )}
      {kind === 'boxing' && (
        <>
          <path d="M42 34 L60 30" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 38 L58 46" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="65" cy="29" r="6" fill="none" stroke={stroke} strokeWidth="2.5" />
          <circle cx="63" cy="48" r="6" fill="none" stroke={stroke} strokeWidth="2.5" />
          <path d="M74 27 L92 24 M72 50 L90 53" stroke={stroke} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export default function Title() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [setup] = useState(() => setupState());
  const selected = GAMES[index];
  const playable = selected.status === 'playable';

  const start = useCallback(
    (game) => {
      if (game.status !== 'playable') return;
      // First run goes through the explainer: a cold getUserMedia prompt with
      // no context is the worst moment in this app's UX.
      navigate(setup.seen ? game.path : '/setup');
    },
    [navigate, setup.seen],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        setIndex((i) => (i + 1) % GAMES.length);
      } else if (e.key === 'ArrowLeft') {
        setIndex((i) => (i - 1 + GAMES.length) % GAMES.length);
      } else if (e.key === 'Enter') {
        start(GAMES[index]);
      } else if (e.key.toLowerCase() === 's') {
        navigate('/setup');
      } else {
        return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, navigate, start]);

  return (
    <div className="wb-court">
      <div className="wb-stage wb-title">
        <header className="wb-title__head">
          <div>
            <p className="wb-eyebrow">Camera gesture games · browser · no install</p>
            <h1 className="wb-wordmark">wibbly</h1>
            <p className="wb-tagline">Your camera is the controller.</p>
          </div>
          <div className="wb-title__privacy">
            <span className="wb-pill wb-pill--accent">on-device</span>
            <p>
              Tracking runs in this tab. Camera frames are never uploaded — there is no
              server in this build to upload them to.
            </p>
          </div>
        </header>

        <div className="wb-title__games" role="listbox" aria-label="Games" aria-activedescendant={`game-${selected.id}`}>
          {GAMES.map((game, i) => {
            const planned = game.status === 'planned';
            return (
              <button
                key={game.id}
                id={`game-${game.id}`}
                type="button"
                role="option"
                aria-selected={i === index}
                aria-disabled={planned}
                className={`wb-card ${i === index ? 'is-selected' : ''} ${planned ? 'is-planned' : ''}`}
                onMouseEnter={() => setIndex(i)}
                onFocus={() => setIndex(i)}
                onClick={() => (planned ? setIndex(i) : start(game))}
              >
                <span className={`wb-pill ${planned ? 'wb-pill--planned' : 'wb-pill--playable'} wb-card__status`}>
                  {planned ? 'Planned' : 'Playable'}
                </span>
                <GameArt kind={game.art} planned={planned} />
                <span className="wb-card__name">{game.name}</span>
                <span className="wb-card__blurb">{game.blurb}</span>
                <span className="wb-card__gesture wb-mono">{game.gesture}</span>
              </button>
            );
          })}
        </div>

        <section className="wb-title__detail" aria-live="polite">
          <div>
            <h2 className="wb-h2">{selected.name}</h2>
            <p className="wb-lede">{selected.detail}</p>
          </div>
          <div className="wb-title__actions">
            {playable ? (
              <button type="button" className="wb-btn wb-btn--primary" onClick={() => start(selected)}>
                {setup.seen ? 'Play' : 'Set up & play'} <span className="wb-key">Enter</span>
              </button>
            ) : (
              <button type="button" className="wb-btn" disabled>
                Not built yet
              </button>
            )}
            <button type="button" className="wb-btn wb-btn--ghost" onClick={() => navigate('/setup')}>
              Camera setup <span className="wb-key">S</span>
            </button>
          </div>
        </section>

        <footer className="wb-title__foot">
          <p className="wb-note wb-note--accent">
            Early build. Tennis is single-player against an AI, tracks one person, and knows
            exactly one gesture — a swing. Multi-person tracking, a second gesture and networked
            play are specified in <code className="wb-mono">WIBBLY.md</code>, not built.
          </p>
          <p className="wb-note">
            No camera? Everything is playable on the spacebar. Setup will offer you that path
            before it asks for permission, and again if permission is refused.
          </p>
        </footer>
      </div>

      <style>{`
        .wb-title { display: flex; flex-direction: column; gap: clamp(1.5rem, 4vh, 2.75rem); }

        .wb-title__head {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 2rem; flex-wrap: wrap;
        }
        .wb-title__privacy { max-width: 300px; }
        .wb-title__privacy p {
          margin: 0.55rem 0 0; color: var(--text-3);
          font-size: 0.82rem; line-height: 1.5;
        }

        .wb-title__games {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .wb-card {
          position: relative;
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem;
          padding: 1.25rem 1.25rem 1.1rem;
          text-align: left;
          background: linear-gradient(165deg, var(--bg-secondary), var(--bg-primary));
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          color: var(--text);
          font-family: var(--sans);
          cursor: pointer;
          transition: transform .22s var(--ease), border-color .22s var(--ease),
                      box-shadow .22s var(--ease), background .22s var(--ease);
        }
        .wb-card.is-selected {
          border-color: var(--accent);
          transform: translateY(-4px);
          box-shadow: 0 18px 50px -20px var(--accent-glow), inset 0 0 0 1px var(--accent-dim);
        }
        .wb-card.is-planned { cursor: default; }
        .wb-card.is-planned.is-selected { border-color: var(--planned); box-shadow: 0 18px 50px -22px rgba(255,176,32,.35); }
        .wb-card.is-planned .wb-card__name,
        .wb-card.is-planned .wb-card__blurb { opacity: .72; }

        .wb-card__status { position: absolute; top: 1rem; right: 1rem; }
        .wb-card__art { width: 100%; height: 84px; margin: .4rem 0 .5rem; }
        .wb-card__name {
          font-family: var(--display); font-size: 1.5rem; font-weight: 700;
          letter-spacing: -.02em; line-height: 1.1;
        }
        .wb-card__blurb { color: var(--text-2); font-size: .86rem; line-height: 1.45; }
        .wb-card__gesture {
          margin-top: .35rem; color: var(--text-3);
          letter-spacing: .1em; text-transform: uppercase; font-size: .66rem;
        }

        .wb-title__detail {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 2rem; flex-wrap: wrap;
          padding: 1.5rem; border-radius: var(--r-lg);
          background: linear-gradient(160deg, var(--bg-secondary), var(--bg-primary));
          border: 1px solid var(--border);
        }
        .wb-title__detail > div:first-child { max-width: 62ch; }
        .wb-title__actions { display: flex; gap: .75rem; flex-wrap: wrap; }

        .wb-title__foot { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .wb-title__foot code { color: var(--text-2); }

        @media (max-width: 720px) {
          .wb-title__head { align-items: flex-start; }
          .wb-title__detail { align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
