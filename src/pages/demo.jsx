import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calibration, MemoryStorage } from '@vulos/wibbly-input';
import TennisGame from '../game';
import { clearOwnedStorage } from '../mode.js';

/**
 * Demo surface — the whole demo build, one route, no navigation.
 *
 * This is what gets embedded at `vulos.org/products/wibbly/play/` in a
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
const MAGNETITE_URL = 'https://github.com/vul-os/magnetite';
const MAGNETITE_PRODUCT_URL = '/products/magnetite';

/**
 * When the magnetite note is offered.
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
        <div className="wb-demo__card">
          <div className="wb-demo__cardhead">
            <span className="wb-demo__badge">Demo</span>
            <h1>Tennis, in this tab.</h1>
            <p className="wb-demo__lede">
              Swing your arm and the racket swings. Your webcam is read locally to work out
              where your body is — <strong>frames never leave this tab</strong>, and there is no
              server here to send them to.
            </p>
          </div>

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

      {cta === 'open' && <MagnetiteNote onClose={() => setCta('dismissed')} />}

      {cta === 'dismissed' && (
        <button type="button" className="wb-demo__reopen" onClick={() => setCta('open')}>
          Host your own?
        </button>
      )}
    </div>
  );
}

/**
 * The magnetite step.
 *
 * Every sentence here has to survive being checked against the two repos,
 * because the interesting part of this claim is the part that is NOT true yet:
 *
 *   TRUE  solo tennis runs entirely in this tab with no server. That is what
 *         the visitor just did.
 *   TRUE  playing against another person needs something to host the session,
 *         and magnetite is a game server you run yourself.
 *   TRUE  wibbly's side of that is wired and proven: packages/wibbly-magnetite
 *         delivers signed, attested gesture events to a live magnetite node
 *         and gets `attested_ack` back, pinned to magnetite's Rust verifier by
 *         golden vectors.
 *   NOT TRUE — and said so, in the same size type: nothing on the far side
 *         reads those events. No game in either repo consumes gesture input
 *         from that queue. So this is emphatically NOT "install magnetite and
 *         play with a friend", and it is not one install away.
 *
 * What magnetite genuinely does today — a deterministic authoritative runtime,
 * a WASM sandbox, replay verification, and hosting on any box you own — is
 * what the link is actually for. Leaning on that is honest. Leaning on wibbly
 * multiplayer is not.
 *
 * It appears after ~6 swings, is dismissible, and never blocks play. A demo
 * that nags is a demo people close.
 */
function MagnetiteNote({ onClose }) {
  return (
    <aside className="wb-demo__cta" role="complementary" aria-label="Run your own node">
      <button type="button" className="wb-demo__ctaclose" onClick={onClose} aria-label="Dismiss">
        ×
      </button>

      <p className="wb-demo__ctaeyebrow">The ceiling of one browser tab</p>
      <h2>What you are playing needs no server. A second player would.</h2>

      <p>
        The pose model, the physics and the AI opponent all ran here. Nothing was hosted. But two
        people in different rooms need something in the middle to hold the match — and we would
        rather that be a box you own than a cloud account you rent.
      </p>

      <p>
        That is <strong>magnetite</strong>: a self-hosted game server in Rust. Deterministic
        authoritative simulation, a WASM sandbox, replay verification, bring-any-box hosting. No
        cloud, no account.
      </p>

      <pre className="wb-demo__code">
        <code>
          git clone https://github.com/vul-os/magnetite{'\n'}
          cd magnetite{'\n'}
          cargo run -p magnetite-cli -- dev
        </code>
      </pre>

      <p className="wb-demo__ctawarn">
        <strong>In progress, plainly: wibbly multiplayer does not work yet.</strong> The input
        path is proven — wibbly signs gesture events and a live magnetite node returns{' '}
        <code>attested_ack</code>. The game side is not built: nothing in either repo reads those
        events back out. Run magnetite for what it already does, not for wibbly matches.
      </p>

      <div className="wb-demo__ctalinks">
        <a
          className="wb-demo__btn wb-demo__btn--primary"
          href={MAGNETITE_PRODUCT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          About magnetite
        </a>
        <a
          className="wb-demo__btn"
          href={MAGNETITE_URL}
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
   dependency on the full app's stylesheet layout, and so the whole surface
   survives being sized down to an iframe column. Everything is fluid; nothing
   assumes a window size. */
function DemoStyles() {
  return (
    <style>{`
      .wb-demo { position: relative; width: 100%; min-height: 100%; }
      .wb-demo * { box-sizing: border-box; }

      .wb-demo--intro {
        display: flex; align-items: center; justify-content: center;
        min-height: 100dvh; padding: clamp(.75rem, 3vw, 2rem);
        background: radial-gradient(120% 100% at 50% 0%, #1B1524 0%, #0D0A10 70%);
      }
      .wb-demo--playing { width: 100%; height: 100dvh; overflow: hidden; }

      .wb-demo__card {
        width: min(560px, 100%);
        display: flex; flex-direction: column; gap: clamp(.9rem, 2.5vw, 1.35rem);
        padding: clamp(1.1rem, 4vw, 2rem);
        border-radius: 18px;
        background: linear-gradient(165deg, #171021, #100C15);
        border: 1px solid #3E3451;
        box-shadow: 0 30px 80px -40px rgba(0,0,0,.9);
        color: #F3EFF7;
        font-family: var(--sans, system-ui, -apple-system, sans-serif);
      }
      .wb-demo__cardhead { display: flex; flex-direction: column; gap: .6rem; }
      .wb-demo__card h1 {
        margin: 0; font-size: clamp(1.5rem, 5vw, 2.1rem);
        letter-spacing: -.03em; line-height: 1.05;
      }
      .wb-demo__lede { margin: 0; color: #BDB3C9; font-size: clamp(.88rem, 2.4vw, .98rem); line-height: 1.55; }
      .wb-demo__lede strong { color: #F3EFF7; }

      .wb-demo__badge {
        align-self: flex-start;
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
        padding: .22rem .55rem; border-radius: 999px;
        color: #FF4D9D; border: 1px solid rgba(255,77,157,.4); background: rgba(255,77,157,.1);
      }

      .wb-demo__row { display: flex; align-items: center; gap: .85rem; flex-wrap: wrap; }
      .wb-demo__label {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .64rem; letter-spacing: .14em; text-transform: uppercase; color: #8B8095;
      }
      .wb-demo__hands { display: flex; gap: .4rem; }
      .wb-demo__hand {
        padding: .45rem 1.05rem; border-radius: 999px;
        border: 1px solid #3E3451; background: #1B1524; color: #BDB3C9;
        font: inherit; font-size: .88rem; font-weight: 600; cursor: pointer;
        transition: all .16s ease;
      }
      .wb-demo__hand:hover { color: #F3EFF7; border-color: #574A6D; }
      .wb-demo__hand.is-active { border-color: #FF4D9D; color: #FF4D9D; background: rgba(255,77,157,.12); }

      .wb-demo__actions { display: flex; gap: .55rem; flex-wrap: wrap; }
      .wb-demo__btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: .62rem 1.15rem; border-radius: 999px;
        border: 1px solid #3E3451; background: #1B1524; color: #F3EFF7;
        font: inherit; font-size: .88rem; font-weight: 600;
        cursor: pointer; text-decoration: none; transition: all .16s ease;
      }
      .wb-demo__btn:hover { border-color: #574A6D; }
      .wb-demo__btn--primary { background: #FF4D9D; border-color: #FF4D9D; color: #16000A; }
      .wb-demo__btn--primary:hover { background: #FF7FB8; border-color: #FF7FB8; }
      .wb-demo__btn--ghost { background: none; border-color: transparent; color: #8B8095; }
      .wb-demo__btn:disabled { opacity: .55; cursor: default; }

      .wb-demo__fine { margin: 0; color: #8B8095; font-size: .76rem; line-height: 1.55; }
      .wb-demo__fine--muted { padding-top: .75rem; border-top: 1px solid #272031; }
      .wb-demo__fine a { color: #FF4D9D; }

      .wb-demo__hud {
        position: absolute; top: 12px; left: 12px; z-index: 1000;
        display: flex; align-items: center; gap: .5rem;
        padding: .35rem .6rem .35rem .5rem; border-radius: 999px;
        background: rgba(13,10,16,.78); border: 1px solid #3E3451;
        backdrop-filter: blur(10px);
        font-family: var(--sans, system-ui, sans-serif);
      }
      .wb-demo__status {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .6rem; letter-spacing: .12em; text-transform: uppercase;
        color: #6E6479;
      }
      .wb-demo__status--live { color: #4ADE80; }
      .wb-demo__status--keyboard { color: #FFB020; }
      .wb-demo__link { color: #8B8095; font-size: .72rem; text-decoration: none; }
      .wb-demo__link:hover { color: #F3EFF7; }

      .wb-demo__toast {
        position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%);
        z-index: 1000; max-width: calc(100% - 24px);
        padding: .5rem .9rem; border-radius: 999px;
        background: rgba(13,10,16,.85); border: 1px solid #3E3451;
        color: #BDB3C9; font-family: var(--sans, system-ui, sans-serif); font-size: .78rem;
        text-align: center;
      }
      .wb-demo__toast--warn {
        border-color: rgba(255,176,32,.4); color: #FFB020;
      }
      .wb-demo__toast kbd {
        font-family: var(--mono, ui-monospace, monospace); font-size: .72rem;
        padding: .05rem .35rem; border-radius: 4px;
        background: #272031; border: 1px solid #3E3451; color: #F3EFF7;
      }

      .wb-demo__cta {
        position: absolute; z-index: 1200;
        right: 12px; bottom: 12px; width: min(400px, calc(100% - 24px));
        max-height: min(78dvh, 660px); overflow-y: auto;
        padding: 1.1rem 1.15rem 1.15rem;
        border-radius: 16px;
        background: linear-gradient(165deg, #171021, #100C15);
        border: 1px solid #3E3451;
        box-shadow: 0 26px 70px -34px rgba(0,0,0,.95);
        color: #BDB3C9; font-family: var(--sans, system-ui, sans-serif);
        font-size: .82rem; line-height: 1.55;
      }
      .wb-demo__cta h2 {
        margin: .35rem 0 .7rem; color: #F3EFF7;
        font-size: 1.08rem; line-height: 1.2; letter-spacing: -.02em;
      }
      .wb-demo__cta p { margin: 0 0 .7rem; }
      .wb-demo__cta strong { color: #F3EFF7; }
      .wb-demo__ctaeyebrow {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; color: #FF4D9D;
      }
      .wb-demo__ctaclose {
        position: absolute; top: 8px; right: 10px;
        background: none; border: 0; color: #6E6479;
        font-size: 1.25rem; line-height: 1; cursor: pointer; padding: .2rem .35rem;
      }
      .wb-demo__ctaclose:hover { color: #F3EFF7; }
      .wb-demo__code {
        margin: 0 0 .7rem; padding: .6rem .7rem; overflow-x: auto;
        border-radius: 8px; background: #0D0A10; border: 1px solid #272031;
      }
      .wb-demo__code code {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .72rem; color: #BDB3C9; white-space: pre;
      }
      .wb-demo__ctawarn {
        padding: .6rem .7rem; border-radius: 8px;
        background: rgba(255,176,32,.08); border: 1px solid rgba(255,176,32,.28);
        color: #C9BCA6; font-size: .76rem;
      }
      .wb-demo__ctawarn strong { color: #FFB020; }
      .wb-demo__ctawarn code {
        font-family: var(--mono, ui-monospace, monospace); font-size: .72rem; color: #F3EFF7;
      }
      .wb-demo__ctalinks { display: flex; gap: .45rem; flex-wrap: wrap; margin-top: .85rem; }
      .wb-demo__ctalinks .wb-demo__btn { padding: .5rem .9rem; font-size: .8rem; }

      .wb-demo__reopen {
        position: absolute; right: 12px; bottom: 12px; z-index: 1200;
        padding: .42rem .85rem; border-radius: 999px;
        background: rgba(13,10,16,.82); border: 1px solid #3E3451; color: #8B8095;
        font-family: var(--sans, system-ui, sans-serif); font-size: .74rem; cursor: pointer;
      }
      .wb-demo__reopen:hover { color: #F3EFF7; border-color: #574A6D; }

      /* A narrow iframe column: the CTA becomes a full-width sheet rather than
         a card that overhangs the frame. */
      @media (max-width: 520px) {
        .wb-demo__cta { left: 12px; right: 12px; width: auto; max-height: 70dvh; }
        .wb-demo__actions .wb-demo__btn { flex: 1 1 100%; }
      }
    `}</style>
  );
}
