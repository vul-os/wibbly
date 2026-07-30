import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calibration, MemoryStorage } from '@vulos/wibbly-input';
import TennisGame from '../game';
import { clearOwnedStorage } from '../mode.js';

/**
 * Demo surface — the whole demo build, one route, no navigation.
 *
 * This is what gets embedded at `vulos.org/projects/wibbly/play/` in a
 * same-origin iframe. It is not the app with bits hidden; it is a different
 * shell with different obligations:
 *
 *   INSTANT     one screen, then tennis. The full app's three-step setup
 *               (permission → handedness → framing) is collapsed into a single
 *               inline card. Framing feedback is dropped from the demo path —
 *               it is genuinely useful and genuinely slow, and a visitor who
 *               came from a product page will close the tab before finishing a
 *               wizard.
 *
 *   BUT NOT COLD. The camera explainer is NOT skipped. A `getUserMedia` prompt
 *               with no preceding context is the worst moment in this UX, and
 *               inside an iframe it is worse still: the prompt names the
 *               EMBEDDING origin, so a visitor sees a permission dialog from a
 *               site they were reading, not from the game they were looking
 *               at. Explain, then ask. The handedness pick sits on that same
 *               card, so the explanation costs no extra step.
 *
 *   EPHEMERAL   Calibration is constructed over MemoryStorage, and settings
 *               live in React state instead of the persistent store, so
 *               nothing is written. A public demo that remembers a stranger's
 *               handedness and hands it to the next visitor is a bug. The
 *               unload sweep below is defence in depth, not the mechanism.
 *
 *   IFRAME-SAFE no fullscreen, no window.top, no router, no links that
 *               navigate this frame — the two outbound links open in a new tab
 *               with `rel="noopener"` so the visitor is never yanked out of
 *               the page they were reading.
 *
 *   HONEST      a permanent "Demo" marker, an explicit statement that this is
 *               one game and one gesture, and a link to the repo.
 *
 *   DEGRADABLE  "Play with the spacebar" is offered before the camera is ever
 *               requested, and again if it fails. Camera denial or a model
 *               that will not load still leaves a playable game.
 */

const PLAYER_ID = 'player_1';
const REPO_URL = 'https://github.com/vul-os/wibbly';

/**
 * When the multiplayer note is offered.
 *
 * Whichever comes first: a few swings, or a while spent on the court. The
 * timer exists because a visitor who is watching the AI rally rather than
 * swinging has still been playing, and should still see the note eventually.
 * Neither number blocks anything; the note is dismissible either way.
 */
const SWINGS_BEFORE_CTA = 6;
const MS_BEFORE_CTA = 90_000;

export default function Demo() {
  // MemoryStorage, explicitly. Not "localStorage that we try to remember to
  // clean up" — a store that cannot persist in the first place.
  const calibrationRef = useRef(null);
  if (!calibrationRef.current) calibrationRef.current = new Calibration(new MemoryStorage());

  const [stage, setStage] = useState('intro'); // intro | playing
  const [handedness, setHandedness] = useState('right');
  const [starting, setStarting] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('unknown');
  const [swings, setSwings] = useState(0);
  // Null while fine. Set when pose tracking came up on a backend that is slow
  // or — under the embed's CSP — cannot work at all.
  const [backendWarning, setBackendWarning] = useState(null);
  const [cta, setCta] = useState('hidden'); // hidden | open | dismissed
  // Settings are held here rather than in the persistent settings store.
  const [usePoseDetection, setUsePoseDetection] = useState(true);

  /* ── Ephemerality ──────────────────────────────────────────────────────── */

  useEffect(() => {
    // Nothing above writes to localStorage, so in practice this removes
    // nothing. It exists so that a future edit which reintroduces a write
    // cannot quietly leave one visitor's state for the next — on a shared
    // public surface that is the failure worth engineering against.
    const sweep = () => {
      if (typeof localStorage !== 'undefined') clearOwnedStorage(localStorage);
    };
    // `pagehide` fires on bfcache eviction and iframe teardown where `unload`
    // is unreliable and increasingly ignored by browsers.
    window.addEventListener('pagehide', sweep);
    return () => {
      window.removeEventListener('pagehide', sweep);
      sweep();
    };
  }, []);

  /* ── Actions ───────────────────────────────────────────────────────────── */

  const chooseHand = useCallback((hand) => {
    setHandedness(hand);
    calibrationRef.current.setHandedness(PLAYER_ID, hand);
  }, []);

  // Write the default through too, so the recogniser reads a profile that was
  // deliberately set rather than inferred from an absent one.
  useEffect(() => {
    calibrationRef.current.setHandedness(PLAYER_ID, handedness);
  }, [handedness]);

  const play = useCallback((withCamera) => {
    setStarting(true);
    setUsePoseDetection(withCamera);
    // The camera prompt itself is raised by the game's pipeline a moment from
    // now, on the same user gesture that got us here. The explainer the
    // visitor just read is the context that prompt otherwise lacks.
    setStage('playing');
  }, []);

  const onSwing = useCallback(() => {
    setSwings((n) => n + 1);
  }, []);

  /**
   * The failure this exists for: pose tracking that starts, loads the model,
   * reports no error, and then never detects anybody — because it landed on a
   * TFJS backend the page's CSP will not let run. From the player's side that
   * is indistinguishable from a game that ignores them, and it is the single
   * worst outcome for a demo. So it is stated, and the spacebar is offered.
   */
  const onTrackerBackend = useCallback((info) => {
    // Diagnostic hook. Which backend the detector actually got is invisible
    // from the outside and decides whether this demo works in production, so
    // scripts/verify-demo.mjs reads it instead of inferring from behaviour.
    if (typeof window !== 'undefined') window.__WIBBLY_BACKEND__ = info;
    setBackendWarning(
      info.cspHostile
        ? 'Camera tracking cannot run in this page — swing detection is off. Press space to play.'
        : info.preferred
          ? null
          : 'Camera tracking is running without GPU acceleration, so it will be slow to start and laggy. The spacebar always works.',
    );
  }, []);

  useEffect(() => {
    if (swings >= SWINGS_BEFORE_CTA && cta === 'hidden') setCta('open');
  }, [swings, cta]);

  useEffect(() => {
    if (stage !== 'playing' || cta !== 'hidden') return undefined;
    const t = setTimeout(() => setCta((c) => (c === 'hidden' ? 'open' : c)), MS_BEFORE_CTA);
    return () => clearTimeout(t);
  }, [stage, cta]);

  /* ── Intro ─────────────────────────────────────────────────────────────── */

  if (stage === 'intro') {
    return (
      <div className="wb-demo wb-demo--intro">
        <DemoStyles />
        <div className="wb-demo__card wb-bracket">
          <div className="wb-demo__cardhead">
            <div className="wb-demo__slug">
              <span className="wb-demo__badge">Demo</span>
              <span className="wb-demo__slugline" />
            </div>
            <h1>Tennis, in this tab.</h1>
            <p className="wb-demo__lede">
              Swing your arm and the racket swings. Your webcam is read locally to work out
              where your body is — <strong>frames never leave this tab</strong>, and there is no
              server here to send them to.
            </p>
          </div>

          {/* The one setting the demo asks for. Everything else is defaulted,
              because a visitor who came from a product page will not finish a
              wizard. */}
          <div className="wb-demo__row">
            <span className="wb-demo__label">Racket hand</span>
            <div className="wb-demo__hands">
              {['left', 'right'].map((hand) => (
                <button
                  key={hand}
                  type="button"
                  className={`wb-demo__hand ${handedness === hand ? 'is-active' : ''}`}
                  aria-pressed={handedness === hand}
                  onClick={() => chooseHand(hand)}
                >
                  {hand === 'left' ? 'Left' : 'Right'}
                </button>
              ))}
            </div>
          </div>

          <div className="wb-demo__actions">
            <button
              type="button"
              className="wb-demo__btn wb-demo__btn--primary"
              disabled={starting}
              onClick={() => play(true)}
            >
              Turn on my camera &amp; play
            </button>
            <button
              type="button"
              className="wb-demo__btn"
              disabled={starting}
              onClick={() => play(false)}
            >
              Play with the spacebar
            </button>
          </div>

          <p className="wb-demo__fine">
            Your browser will ask for camera permission next — that prompt comes from the
            browser, not from us, and inside an embedded page it will name the site you are
            reading. Nothing is recorded and nothing is saved: this demo writes no cookies and
            no local storage, so it forgets you completely when you close it.
          </p>

          <p className="wb-demo__fine wb-demo__fine--muted">
            This is one game driven by one gesture — a swing — from one player, against a local
            AI. That is the honest extent of it today.{' '}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              Source and full status table
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  /* ── Playing ───────────────────────────────────────────────────────────── */

  return (
    <div className="wb-demo wb-demo--playing">
      <DemoStyles />

      <TennisGame
        settings={{ usePoseDetection, debug: false }}
        calibration={calibrationRef.current}
        onInputState={setCameraStatus}
        onSwing={onSwing}
        onTrackerBackend={onTrackerBackend}
      />

      <div className="wb-demo__hud">
        <span className="wb-demo__badge">Demo</span>
        <span className={`wb-demo__status wb-demo__status--${cameraStatus}`}>
          <span className="wb-demo__statusdot" />
          {cameraStatus === 'live' && 'camera tracking'}
          {cameraStatus === 'keyboard' && 'spacebar'}
          {cameraStatus === 'unknown' && 'starting…'}
        </span>
        <a className="wb-demo__link" href={REPO_URL} target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </div>

      {cameraStatus === 'keyboard' && (
        <div className="wb-demo__toast">
          No camera — press <kbd>space</kbd> to swing. The game is fully playable this way.
        </div>
      )}

      {cameraStatus !== 'keyboard' && backendWarning && (
        <div className="wb-demo__toast wb-demo__toast--warn" role="status">
          {backendWarning}
        </div>
      )}

      {cta === 'open' && <MultiplayerNote onClose={() => setCta('dismissed')} />}

      {cta === 'dismissed' && (
        <button type="button" className="wb-demo__reopen" onClick={() => setCta('open')}>
          Play with a friend?
        </button>
      )}
    </div>
  );
}

/**
 * The multiplayer step.
 *
 * Every sentence here has to survive being checked against the repo, because
 * the interesting part of this claim is the part that is NOT true yet. This
 * used to describe a magnetite-server path; that is gone — see
 * packages/wibbly-p2p/README.md's "What this used to be" for why a
 * rented or self-hosted authoritative server was retired rather than wired
 * up (gesture input cannot be replay-verified, so a server buys nothing a
 * host's own browser tab doesn't). The design that replaced it:
 *
 *   TRUE  solo tennis runs entirely in this tab with no server. That is what
 *         the visitor just did.
 *   TRUE  wibbly's plan for a second player is peer-to-peer: one player's
 *         browser tab holds authority and simulates the match, a WebRTC
 *         `DataChannel` carries the other player's gesture events across,
 *         and the one-time connection handshake is a link or QR code — no
 *         server, ever, for anyone to run or rent. See
 *         site/docs/MULTIPLAYER.md for the full design.
 *   TRUE  the transport is built and unit-tested in isolation:
 *         packages/wibbly-p2p has a working `PeerSession`, WebRTC
 *         offer/answer helpers, and a codec that fits a connection
 *         description in a link.
 *   NOT TRUE — and said so, in the same size type: there is no lobby screen
 *         anywhere in wibbly. Nothing turns that transport into a button a
 *         visitor can click. So this is emphatically NOT "open a link and
 *         play with a friend" today, and it is not one click away.
 *
 * It appears after ~6 swings, is dismissible, and never blocks play. A demo
 * that nags is a demo people close.
 */
function MultiplayerNote({ onClose }) {
  return (
    <aside className="wb-demo__cta" role="complementary" aria-label="About multiplayer">
      <button type="button" className="wb-demo__ctaclose" onClick={onClose} aria-label="Dismiss">
        ×
      </button>

      <p className="wb-demo__ctaeyebrow">The ceiling of one browser tab</p>
      <h2>What you are playing is solo. A second player is designed, not built.</h2>

      <p>
        The pose model, the physics and the AI opponent all ran here. Nothing was hosted. Playing
        against a real person needs the two browsers to find each other — and wibbly's answer to
        that is peer-to-peer, not a server. Nobody would run it, and nobody would need to.
      </p>

      <p>
        One player's tab holds authority and simulates the match. A <strong>WebRTC DataChannel</strong>{' '}
        would carry the other player's gesture events across, opened by a one-time exchange — a
        link or a QR code — instead of a server in the middle.
      </p>

      <p className="wb-demo__ctawarn">
        <strong>In progress, plainly: wibbly multiplayer does not work yet.</strong> The transport
        side is built and tested on its own — the peer session, the WebRTC offer/answer handshake,
        a compact code for putting a connection in a link — with no code path that touches a
        server anywhere in it. What is missing is a lobby: nothing in wibbly turns that into a
        screen you can actually use, so there is no invite link and nothing to click yet.
      </p>

      <div className="wb-demo__ctalinks">
        <a
          className="wb-demo__btn wb-demo__btn--primary"
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
        <button type="button" className="wb-demo__btn wb-demo__btn--ghost" onClick={onClose}>
          Keep playing
        </button>
      </div>
    </aside>
  );
}

/* Styles are inline and scoped by class so the demo build carries no
   dependency on the full app's stylesheet LAYOUT, and so the whole surface
   survives being sized down to an iframe column. Everything is fluid; nothing
   assumes a window size.

   The design TOKENS (fonts, palette) do come from src/style.css, which
   main.jsx imports in both modes — that is how the demo gets the vendored
   Archivo/JetBrains faces without a second @font-face block. Every var()
   below still carries a literal fallback, so if that import were ever dropped
   the demo degrades to the right colours rather than to browser defaults.

   Restraint is deliberate here. The full app can afford a broadcast graphics
   package across a whole screen; this is one card in a column that may be
   360px wide, embedded in somebody else's page. It gets the registration
   brackets, the type hierarchy and the palette — and stops there. */
function DemoStyles() {
  return (
    <style>{`
      .wb-demo { position: relative; width: 100%; min-height: 100%; }
      .wb-demo * { box-sizing: border-box; }

      .wb-demo--intro {
        display: flex; align-items: center; justify-content: center;
        min-height: 100vh; min-height: 100dvh;
        padding: clamp(.75rem, 3vw, 2rem);
        background:
          radial-gradient(120% 100% at 50% -10%, rgba(255,77,157,.09) 0%, transparent 58%),
          radial-gradient(100% 80% at 50% 0%, #171221 0%, #0B0810 72%);
      }
      /* vh fallback first, dvh where supported — Safari measures vh against the
         viewport with toolbars hidden, which overflows inside an iframe. */
      .wb-demo--playing { width: 100%; height: 100vh; height: 100dvh; overflow: hidden; }

      /* ── The card ───────────────────────────────────────────────────── */

      .wb-demo__card {
        position: relative;
        width: min(560px, 100%);
        display: flex; flex-direction: column; gap: clamp(.9rem, 2.5vw, 1.3rem);
        padding: clamp(1.2rem, 4vw, 2rem);
        border-radius: 16px;
        background: linear-gradient(162deg, #171221, #110D17);
        border: 1px solid var(--border-strong, #3D3253);
        box-shadow: 0 30px 80px -40px rgba(0,0,0,.92);
        color: var(--text, #F4F0F8);
        font-family: var(--sans, system-ui, -apple-system, sans-serif);
      }
      /* Registration brackets, the product's signature. Defined locally so the
         demo card keeps them even in isolation. */
      .wb-demo__card.wb-bracket::before,
      .wb-demo__card.wb-bracket::after {
        content: ''; position: absolute; width: 16px; height: 16px;
        pointer-events: none; border-style: solid;
        border-color: var(--accent, #FF4D9D);
      }
      .wb-demo__card.wb-bracket::before {
        top: -1px; left: -1px; border-width: 2px 0 0 2px; border-top-left-radius: 3px;
      }
      .wb-demo__card.wb-bracket::after {
        bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-bottom-right-radius: 3px;
      }

      .wb-demo__cardhead { display: flex; flex-direction: column; gap: .55rem; }
      .wb-demo__slug { display: flex; align-items: center; gap: .6rem; }
      .wb-demo__slugline {
        flex: 1; height: 1px;
        background: linear-gradient(90deg, var(--border-strong, #3D3253), transparent);
      }
      .wb-demo__card h1 {
        margin: 0;
        font-family: var(--display, system-ui, sans-serif);
        font-weight: 800;
        font-stretch: 114%;
        font-size: clamp(1.65rem, 5.5vw, 2.35rem);
        letter-spacing: -.04em; line-height: 1;
      }
      .wb-demo__lede {
        margin: 0; color: var(--text-2, #A99FB8);
        font-size: clamp(.88rem, 2.4vw, .97rem); line-height: 1.58;
      }
      .wb-demo__lede strong { color: var(--text, #F4F0F8); font-weight: 650; }

      .wb-demo__badge {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .58rem; font-weight: 700;
        letter-spacing: .2em; text-transform: uppercase;
        padding: .2rem .5rem; border-radius: 3px;
        color: var(--accent, #FF4D9D);
        border: 1px solid var(--accent-line, rgba(255,77,157,.34));
        background: var(--accent-dim, rgba(255,77,157,.1));
      }

      /* ── Racket hand ────────────────────────────────────────────────── */

      .wb-demo__row {
        display: flex; align-items: center; gap: .85rem; flex-wrap: wrap;
        padding: .7rem .8rem; border-radius: 10px;
        background: var(--bg-sunken, #080610);
        border: 1px solid var(--border, #251E33);
      }
      .wb-demo__label {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .6rem; font-weight: 700;
        letter-spacing: .18em; text-transform: uppercase;
        color: var(--text-3, #6F6580);
      }
      .wb-demo__hands { display: flex; gap: .3rem; margin-left: auto; }
      .wb-demo__hand {
        padding: .4rem .95rem; border-radius: 6px;
        border: 1px solid var(--border-strong, #3D3253);
        background: var(--bg-elevated, #1D1729);
        color: var(--text-3, #6F6580);
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .68rem; font-weight: 700;
        letter-spacing: .12em; text-transform: uppercase;
        cursor: pointer; transition: all .16s ease;
      }
      .wb-demo__hand:hover { color: var(--text, #F4F0F8); border-color: var(--border-bright, #52456E); }
      .wb-demo__hand.is-active {
        border-color: var(--accent, #FF4D9D);
        color: var(--accent, #FF4D9D);
        background: var(--accent-dim, rgba(255,77,157,.12));
      }

      /* ── Actions ────────────────────────────────────────────────────── */

      .wb-demo__actions { display: flex; gap: .5rem; flex-wrap: wrap; }
      .wb-demo__btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: .68rem 1.2rem; border-radius: 9px;
        border: 1px solid var(--border-strong, #3D3253);
        background: var(--bg-elevated, #1D1729);
        color: var(--text, #F4F0F8);
        font: inherit; font-size: .88rem; font-weight: 650;
        cursor: pointer; text-decoration: none; transition: all .16s ease;
      }
      .wb-demo__btn:hover { border-color: var(--border-bright, #52456E); }
      .wb-demo__btn--primary {
        background: var(--accent, #FF4D9D); border-color: var(--accent, #FF4D9D);
        color: var(--accent-ink, #16000A); font-weight: 700;
        box-shadow: 0 10px 30px -12px var(--accent-glow, rgba(255,77,157,.26));
      }
      .wb-demo__btn--primary:hover {
        background: var(--accent-hover, #FF7FB8); border-color: var(--accent-hover, #FF7FB8);
      }
      .wb-demo__btn--ghost { background: none; border-color: transparent; color: var(--text-3, #6F6580); }
      .wb-demo__btn:disabled { opacity: .55; cursor: default; }

      .wb-demo__fine { margin: 0; color: var(--text-3, #6F6580); font-size: .75rem; line-height: 1.58; }
      .wb-demo__fine--muted { padding-top: .8rem; border-top: 1px solid var(--border, #251E33); }
      .wb-demo__fine a { color: var(--accent, #FF4D9D); }

      /* ── In-play chrome ─────────────────────────────────────────────── */

      .wb-demo__hud {
        position: absolute; top: 12px; left: 12px; z-index: 1000;
        display: flex; align-items: center; gap: .6rem;
        padding: .34rem .7rem .34rem .5rem; border-radius: 10px;
        background: rgba(8,6,16,.8);
        border: 1px solid var(--border-strong, #3D3253);
        /* Safari needs the prefix; without it the bar is simply opaque. */
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        font-family: var(--sans, system-ui, sans-serif);
      }
      .wb-demo__status {
        display: inline-flex; align-items: center; gap: .38rem;
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .58rem; font-weight: 600;
        letter-spacing: .16em; text-transform: uppercase;
        color: var(--text-3, #6F6580);
      }
      .wb-demo__statusdot {
        width: 5px; height: 5px; border-radius: 50%; flex: none; background: currentColor;
      }
      .wb-demo__status--live { color: var(--shipped, #4ADE80); }
      .wb-demo__status--live .wb-demo__statusdot {
        box-shadow: 0 0 7px currentColor;
        animation: wb-demopulse 2.2s ease-in-out infinite;
      }
      .wb-demo__status--keyboard { color: var(--planned, #FFB020); }
      @keyframes wb-demopulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }

      .wb-demo__link {
        color: var(--text-3, #6F6580); font-size: .7rem; text-decoration: none;
      }
      .wb-demo__link:hover { color: var(--text, #F4F0F8); }

      .wb-demo__toast {
        position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%);
        z-index: 1000; max-width: calc(100% - 24px);
        display: flex; align-items: center; gap: .4rem;
        padding: .55rem .95rem; border-radius: 8px;
        background: rgba(8,6,16,.9);
        border: 1px solid var(--border-strong, #3D3253);
        color: var(--text-2, #A99FB8);
        font-family: var(--sans, system-ui, sans-serif); font-size: .78rem;
        text-align: center;
      }
      .wb-demo__toast--warn {
        border-color: var(--planned-line, rgba(255,176,32,.32));
        color: var(--planned, #FFB020);
      }
      .wb-demo__toast kbd {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .68rem; font-weight: 700;
        letter-spacing: .1em; text-transform: uppercase;
        padding: .08rem .34rem; border-radius: 4px;
        background: var(--accent-dim, rgba(255,77,157,.13));
        border: 1px solid var(--accent-line, rgba(255,77,157,.34));
        color: var(--accent, #FF4D9D);
      }

      /* ── multiplayer note ───────────────────────────────────────────── */

      .wb-demo__cta {
        position: absolute; z-index: 1200;
        right: 12px; bottom: 12px; width: min(400px, calc(100% - 24px));
        max-height: min(78dvh, 660px); overflow-y: auto;
        padding: 1.15rem;
        border-radius: 14px;
        background: linear-gradient(162deg, #171221, #110D17);
        border: 1px solid var(--border-strong, #3D3253);
        box-shadow: 0 26px 70px -34px rgba(0,0,0,.95);
        color: var(--text-2, #A99FB8);
        font-family: var(--sans, system-ui, sans-serif);
        font-size: .82rem; line-height: 1.55;
      }
      .wb-demo__cta h2 {
        margin: .35rem 0 .7rem;
        font-family: var(--display, system-ui, sans-serif);
        font-weight: 700;
        font-stretch: 108%;
        color: var(--text, #F4F0F8);
        font-size: 1.12rem; line-height: 1.18; letter-spacing: -.025em;
      }
      .wb-demo__cta p { margin: 0 0 .7rem; }
      .wb-demo__cta strong { color: var(--text, #F4F0F8); font-weight: 650; }
      .wb-demo__ctaeyebrow {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .58rem; font-weight: 700;
        letter-spacing: .2em; text-transform: uppercase;
        color: var(--accent, #FF4D9D);
      }
      .wb-demo__ctaclose {
        position: absolute; top: 8px; right: 10px;
        background: none; border: 0; color: var(--text-3, #6F6580);
        font-size: 1.2rem; line-height: 1; cursor: pointer; padding: .2rem .35rem;
      }
      .wb-demo__ctaclose:hover { color: var(--text, #F4F0F8); }
      /* The "not built yet" block wears the blueprint language used everywhere
         else in the product for things that are specified and absent. */
      .wb-demo__ctawarn {
        padding: .65rem .7rem; border-radius: 8px;
        border: 1px dashed var(--planned-line, rgba(255,176,32,.32));
        background-image: repeating-linear-gradient(45deg,
          rgba(255,176,32,.05) 0, rgba(255,176,32,.05) 1px,
          transparent 1px, transparent 7px);
        color: #C9BCA6; font-size: .76rem;
      }
      .wb-demo__ctawarn strong { color: var(--planned, #FFB020); }
      .wb-demo__ctawarn code {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .71rem; color: var(--text, #F4F0F8);
      }
      .wb-demo__ctalinks { display: flex; gap: .45rem; flex-wrap: wrap; margin-top: .85rem; }
      .wb-demo__ctalinks .wb-demo__btn { padding: .5rem .9rem; font-size: .8rem; }

      .wb-demo__reopen {
        position: absolute; right: 12px; bottom: 12px; z-index: 1200;
        padding: .42rem .85rem; border-radius: 999px;
        background: rgba(8,6,16,.85);
        border: 1px solid var(--border-strong, #3D3253);
        color: var(--text-3, #6F6580);
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .62rem; font-weight: 600;
        letter-spacing: .14em; text-transform: uppercase;
        cursor: pointer;
      }
      .wb-demo__reopen:hover { color: var(--text, #F4F0F8); border-color: var(--border-bright, #52456E); }

      @media (prefers-reduced-motion: reduce) {
        .wb-demo__status--live .wb-demo__statusdot { animation: none; }
      }

      /* A narrow iframe column: the CTA becomes a full-width sheet rather than
         a card that overhangs the frame. */
      @media (max-width: 520px) {
        .wb-demo__cta { left: 12px; right: 12px; width: auto; max-height: 70dvh; }
        .wb-demo__actions .wb-demo__btn { flex: 1 1 100%; }
        .wb-demo__row { flex-direction: column; align-items: flex-start; gap: .5rem; }
        .wb-demo__hands { margin-left: 0; }
      }
    `}</style>
  );
}
