import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../components/catalogue.js';
import { setupState } from '../components/game-settings.js';

/**
 * Title screen — the first thing a player sees.
 *
 * Composed as a broadcast title card, not a landing page: an oversized wordmark
 * bleeding off the left, a fixture strip of games, and a "now selected" panel
 * that behaves like the graphic a director cuts to. The selected card wears the
 * registration brackets, so the thing you are pointed at is always the thing
 * that is framed.
 *
 * Drives like a console menu: ← / → move between games, Enter starts the
 * selected one, S opens camera setup. The keyboard is the primary input and the
 * key caps are drawn as such, not hidden in a tooltip.
 *
 * Every claim on this screen is checkable against the repo — there are no
 * counters, no leaderboards and no player numbers, because there are no players
 * to count and inventing them would be the easiest lie in this product.
 */

/* Line art, one system: a tracked figure in neutral grey, and the gesture the
   game needs drawn over it in the status colour. Magenta when the gesture is
   real and running; amber when it is specified and not built. The figure is
   identical on every card because the tracker is identical — only the gesture
   differs, which is precisely the product's story. */
const GameArt = ({ kind, planned }) => {
  const stroke = planned ? 'var(--planned)' : 'var(--accent)';
  const dim = 'var(--text-4)';
  return (
    <svg viewBox="0 0 120 80" className="wb-card__art" aria-hidden="true">
      <circle cx="42" cy="20" r="7" fill="none" stroke={dim} strokeWidth="2" />
      <path
        d="M42 27 L42 48 M42 34 L30 42 M42 48 L34 66 M42 48 L50 66"
        fill="none"
        stroke={dim}
        strokeWidth="2"
        strokeLinecap="round"
      />
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
      {kind === 'palmworks' && (
        <>
          {/* arm out to a pinching hand, then the piece it is placing */}
          <path d="M42 34 L57 29" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M58 24 Q64 27 62 30" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M58 34 Q64 33 62 30" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M68 29 Q79 24 88 33" fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
          <rect x="84" y="34" width="16" height="21" rx="3" fill="none" stroke={stroke} strokeWidth="2.5" />
          <path d="M84 41 L100 41" stroke={stroke} strokeWidth="1.2" />
          <path d="M92 55 L92 64 L106 64" fill="none" stroke={dim} strokeWidth="2" strokeLinecap="round" />
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
      <div className="wb-grain" aria-hidden="true" />
      <div className="wb-stage wb-title">
        {/* ── Title card ────────────────────────────────────────────────── */}
        <header className="wb-title__head wb-rise" style={{ '--i': 0 }}>
          <div className="wb-title__mark">
            <p className="wb-eyebrow">
              Camera gesture games <span className="wb-title__sep">/</span> browser{' '}
              <span className="wb-title__sep">/</span> no install
            </p>
            <h1 className="wb-wordmark">wibbly</h1>
            <p className="wb-tagline">Your camera is the controller.</p>
          </div>

          <aside className="wb-title__privacy">
            <span className="wb-pill wb-pill--accent">
              <span className="wb-dot" /> on-device
            </span>
            <p>
              Tracking runs in this tab. Camera frames are never uploaded — there is no
              server in this build to upload them to.
            </p>
          </aside>
        </header>

        {/* ── Fixture strip ─────────────────────────────────────────────── */}
        <div
          className="wb-title__games wb-rise"
          style={{ '--i': 1 }}
          role="listbox"
          aria-label="Games"
          aria-activedescendant={`game-${selected.id}`}
        >
          {GAMES.map((game, i) => {
            const planned = game.status === 'planned';
            const active = i === index;
            return (
              <button
                key={game.id}
                id={`game-${game.id}`}
                type="button"
                role="option"
                aria-selected={active}
                aria-disabled={planned}
                className={[
                  'wb-card',
                  'wb-bracket',
                  active ? 'is-selected' : '',
                  planned ? 'is-planned' : '',
                  // The brackets light only on the selected card, and take the
                  // status colour: magenta for a live game, amber for a planned
                  // one. A planned card never wears the accent.
                  active ? (planned ? 'is-planned' : 'is-live') : '',
                ].join(' ')}
                onMouseEnter={() => setIndex(i)}
                onFocus={() => setIndex(i)}
                onClick={() => (planned ? setIndex(i) : start(game))}
              >
                <span className="wb-card__top">
                  <span className="wb-card__index wb-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`wb-pill ${planned ? 'wb-pill--planned' : 'wb-pill--playable'}`}>
                    {planned ? 'Planned' : 'Playable'}
                  </span>
                </span>

                <GameArt kind={game.art} planned={planned} />

                <span className="wb-card__name">{game.name}</span>
                <span className="wb-card__blurb">{game.blurb}</span>
                <span className={`wb-card__gesture wb-mono ${planned ? 'is-planned' : ''}`}>
                  {game.gesture}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Now selected ──────────────────────────────────────────────── */}
        <section className="wb-title__detail wb-rise" style={{ '--i': 2 }} aria-live="polite">
          <div className="wb-title__detailtext">
            <p className="wb-eyebrow">Selected</p>
            <h2 className="wb-h2">{selected.name}</h2>
            <p className="wb-lede">{selected.detail}</p>
          </div>

          <div className="wb-title__actions">
            {playable ? (
              <button type="button" className="wb-btn wb-btn--primary" onClick={() => start(selected)}>
                {setup.seen ? 'Play' : 'Set up & play'} <span className="wb-key">Enter</span>
              </button>
            ) : (
              /* Not a greyed-out button pretending it might work — a blueprint
                 slab that says what is missing. Soccer and Boxing are visible
                 and permanently unplayable, by design. */
              <div className="wb-title__unbuilt wb-blueprint">
                <span className="wb-pill wb-pill--planned">Not built</span>
                <span>No code exists for this game. It is a tracked backlog item, not a release.</span>
              </div>
            )}
            <button type="button" className="wb-btn wb-btn--ghost" onClick={() => navigate('/setup')}>
              Camera setup <span className="wb-key">S</span>
            </button>
          </div>
        </section>

        {/* ── Footer: the honest small print ────────────────────────────── */}
        <footer className="wb-title__foot wb-rise" style={{ '--i': 3 }}>
          <p className="wb-note wb-note--accent">
            <strong>Early build.</strong> Tennis is single-player against an AI, tracks one person,
            and knows exactly one gesture — a swing. Multi-person tracking, a second gesture and
            networked play are specified in <code className="wb-mono">WIBBLY.md</code>, not built.
          </p>
          <p className="wb-note">
            <strong>No camera?</strong> Everything is playable on the spacebar. Setup will offer you
            that path before it asks for permission, and again if permission is refused.
          </p>
          <p className="wb-title__keys wb-mono">
            <span className="wb-key">←</span>
            <span className="wb-key">→</span> select
            <span className="wb-title__sep">·</span>
            <span className="wb-key">Enter</span> play
            <span className="wb-title__sep">·</span>
            <span className="wb-key">S</span> setup
          </p>
        </footer>
      </div>

      <style>{`
        .wb-title {
          display: flex; flex-direction: column;
          gap: clamp(1.5rem, 4vh, 2.75rem);
        }

        /* The wordmark bleeds left out of the content column, so the title card
           reads as a graphic laid over the court rather than a centred header. */
        .wb-title__head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(200px, 280px);
          align-items: end;
          gap: 2rem;
        }
        .wb-title__mark { margin-left: -0.06em; }
        .wb-title__sep { color: var(--text-4); padding: 0 .35em; }

        .wb-title__privacy {
          padding-left: 1.1rem;
          border-left: 1px solid var(--border);
        }
        .wb-title__privacy p {
          margin: .6rem 0 0; color: var(--text-3);
          font-size: .8rem; line-height: 1.55;
        }

        /* ── Fixture strip ─────────────────────────────────────────────── */

        .wb-title__games {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: .85rem;
        }

        .wb-card {
          position: relative;
          display: flex; flex-direction: column; align-items: flex-start; gap: .35rem;
          padding: 1.1rem 1.15rem 1rem;
          text-align: left;
          background: linear-gradient(168deg, var(--bg-secondary), var(--bg-primary));
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          color: var(--text);
          font-family: var(--sans);
          cursor: pointer;
          overflow: hidden;
          transition: transform .24s var(--ease), border-color .24s var(--ease),
                      box-shadow .24s var(--ease), background .24s var(--ease);
        }
        /* A magenta wash that rises from the floor of the selected card — the
           floodlight hitting the thing the director cut to. */
        .wb-card::after { z-index: 3; }
        .wb-card__wash { display: none; }
        .wb-card.is-selected {
          border-color: var(--accent);
          transform: translateY(-5px);
          background:
            radial-gradient(120% 80% at 50% 120%, var(--accent-dim) 0%, transparent 62%),
            linear-gradient(168deg, var(--bg-secondary), var(--bg-primary));
          box-shadow: 0 22px 56px -22px var(--accent-glow);
        }
        .wb-card.is-planned { cursor: default; }
        .wb-card.is-planned.is-selected {
          border-color: var(--planned-line);
          background:
            radial-gradient(120% 80% at 50% 120%, var(--planned-dim) 0%, transparent 62%),
            linear-gradient(168deg, var(--bg-secondary), var(--bg-primary));
          box-shadow: 0 22px 56px -24px rgba(255,176,32,.3);
        }
        .wb-card.is-planned .wb-card__name { color: var(--text-2); }

        .wb-card__top {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; gap: .5rem;
        }
        .wb-card__index {
          color: var(--text-4); font-weight: 700;
          letter-spacing: .1em; font-size: .68rem;
        }
        .wb-card__art { width: 100%; height: 86px; margin: .5rem 0 .45rem; }
        .wb-card__name {
          font-family: var(--display);
          font-weight: 700;
          font-stretch: 110%;
          font-size: 1.6rem; letter-spacing: -.03em; line-height: 1.05;
        }
        .wb-card__blurb { color: var(--text-2); font-size: .84rem; line-height: 1.45; }
        .wb-card__gesture {
          margin-top: .45rem; padding-top: .45rem; width: 100%;
          border-top: 1px dashed var(--border);
          color: var(--text-3);
          letter-spacing: .14em; text-transform: uppercase; font-size: .62rem; font-weight: 600;
        }
        .wb-card__gesture.is-planned { color: var(--planned); opacity: .8; }

        /* ── Now-selected panel ────────────────────────────────────────── */

        .wb-title__detail {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end; gap: 2rem;
          padding: 1.5rem;
          border-radius: var(--r-lg);
          background: linear-gradient(162deg, var(--bg-secondary), var(--bg-primary));
          border: 1px solid var(--border);
        }
        .wb-title__detailtext { max-width: 66ch; }
        .wb-title__detailtext .wb-eyebrow { margin-bottom: .4rem; }
        .wb-title__actions { display: flex; gap: .7rem; flex-wrap: wrap; align-items: center; }

        .wb-title__unbuilt {
          display: flex; align-items: center; gap: .7rem; flex-wrap: wrap;
          max-width: 42ch;
          padding: .7rem .9rem; border-radius: var(--r-md);
          color: var(--text-3); font-size: .8rem; line-height: 1.45;
        }

        /* ── Footer ────────────────────────────────────────────────────── */

        .wb-title__foot {
          display: grid; gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          align-items: start;
        }
        .wb-title__foot code { color: var(--text-2); }
        .wb-title__keys {
          display: flex; align-items: center; gap: .4rem; flex-wrap: wrap;
          color: var(--text-4); font-size: .68rem;
          letter-spacing: .12em; text-transform: uppercase;
          align-self: center;
        }

        @media (max-width: 860px) {
          .wb-title__head { grid-template-columns: 1fr; align-items: start; }
          .wb-title__privacy { border-left: 0; padding-left: 0; }
          .wb-title__detail { grid-template-columns: 1fr; align-items: start; }
        }
      `}</style>
    </div>
  );
}
