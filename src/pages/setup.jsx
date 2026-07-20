import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calibration, WibblyInput, checkFraming, drawSkeletons } from '@vulos/wibbly-input';
import { recordSetup } from '../components/game-settings.js';

/**
 * First-run setup.
 *
 * Three things, in the order that respects the player:
 *
 *   1. EXPLAIN, THEN ASK. The browser's camera prompt only fires when the
 *      player presses a button on a screen that has already said what the
 *      camera is for and where the frames go. A cold getUserMedia prompt is
 *      the single worst moment in the old flow, and this exists to delete it.
 *   2. HANDEDNESS. Written straight into Calibration (§3.5) for player_1, which
 *      is what SwingRecognizer reads live, every frame. Previously this was
 *      only reachable from a toggle buried in the in-game camera preview.
 *   3. FRAMING. checkFraming() from the real library, fed the bound person from
 *      the live pipeline. Not a mock, and not a decorative "looks good" badge:
 *      the messages come from the same function the game would use.
 *
 * The spacebar route is offered at every step, including after a refusal. A
 * player who says no to the camera still gets a game.
 */

const PLAYER_ID = 'player_1';

const STEPS = ['intro', 'handedness', 'framing'];

export default function Setup() {
  const navigate = useNavigate();

  const calibrationRef = useRef(null);
  if (!calibrationRef.current) calibrationRef.current = new Calibration();

  const inputRef = useRef(null);
  const videoMountRef = useRef(null);
  const canvasRef = useRef(null);

  const [step, setStep] = useState('intro');
  const [camera, setCamera] = useState('idle'); // idle | starting | live | failed
  const [cameraError, setCameraError] = useState(null);
  const [handedness, setHandedness] = useState(() => calibrationRef.current.handednessFor(PLAYER_ID));
  const [warnings, setWarnings] = useState(null); // null until the first frame is scored
  const [seenPerson, setSeenPerson] = useState(false);

  /* ── Camera lifecycle ─────────────────────────────────────────────────── */

  const startCamera = useCallback(async () => {
    if (inputRef.current) return;
    setCamera('starting');
    setCameraError(null);

    const wibbly = new WibblyInput({
      calibration: calibrationRef.current,
      frame: { width: 640, height: 480, fps: 30 },
      onError: (err) => console.error('[setup] pipeline error:', err),
    });

    wibbly.onPeople((people) => {
      const person = people[0] ?? null;
      if (person) setSeenPerson(true);
      setWarnings(checkFraming(person));

      // Widen the reach envelope while the player is standing there anyway —
      // this is exactly the "calibration wave" moment §3.5 describes.
      if (person) calibrationRef.current.observeReach(PLAYER_ID, person);

      const canvas = canvasRef.current;
      const video = wibbly.videoElement;
      if (!canvas || !video) return;
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawSkeletons(ctx, people, {
        highlightArm: () => calibrationRef.current.handednessFor(PLAYER_ID),
      });
    });

    try {
      await wibbly.start();
      inputRef.current = wibbly;
      setCamera('live');
      setStep('handedness');
    } catch (err) {
      // Denied permission, no camera, or — commonly in headless browsers — no
      // GPU backend for the pose model. Say which, and offer the spacebar.
      console.error('[setup] camera unavailable:', err);
      setCameraError(err instanceof Error ? err.message : String(err));
      setCamera('failed');
      try {
        wibbly.stop();
      } catch {
        /* already torn down */
      }
    }
  }, []);

  // Attach the library's detached <video> wherever the current step renders a
  // stage for it. The library never injects DOM of its own — that is the whole
  // point of the rebuild — so mounting it is this component's job.
  useEffect(() => {
    const video = inputRef.current?.videoElement;
    const mount = videoMountRef.current;
    if (!video || !mount) return;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.display = 'block';
    video.style.transform = 'scaleX(-1)';
    mount.appendChild(video);
    return () => {
      if (video.parentElement === mount) mount.removeChild(video);
    };
  }, [camera, step]);

  // Always release the camera on the way out, whichever exit the player takes.
  useEffect(
    () => () => {
      inputRef.current?.stop();
      inputRef.current = null;
    },
    [],
  );

  /* ── Actions ──────────────────────────────────────────────────────────── */

  const chooseHand = (hand) => {
    calibrationRef.current.setHandedness(PLAYER_ID, hand);
    setHandedness(hand);
  };

  const finish = (outcome) => {
    recordSetup(outcome);
    inputRef.current?.stop();
    inputRef.current = null;
    navigate('/play');
  };

  const stepIndex = STEPS.indexOf(step);

  /* ── Render ───────────────────────────────────────────────────────────── */

  const stage = (
    <div className="wb-setup__stage">
      <div ref={videoMountRef} className="wb-setup__video" />
      <canvas ref={canvasRef} className="wb-setup__overlay" />
      {camera === 'live' && !seenPerson && (
        <div className="wb-setup__stage-hint">
          Waiting for a person… stand back so your head, shoulders and hips are all in frame.
        </div>
      )}
    </div>
  );

  return (
    <div className="wb-court">
      <div className="wb-stage wb-setup">
        <header className="wb-setup__head">
          <div>
            <p className="wb-eyebrow">Setup · {stepIndex + 1} of {STEPS.length}</p>
            <h1 className="wb-h2">Get your camera ready</h1>
          </div>
          <button type="button" className="wb-btn wb-btn--ghost wb-btn--small" onClick={() => navigate('/')}>
            Back to title
          </button>
        </header>

        <ol className="wb-setup__rail">
          {STEPS.map((s, i) => (
            <li key={s} className={i === stepIndex ? 'is-current' : i < stepIndex ? 'is-done' : ''}>
              <span className="wb-mono">{String(i + 1).padStart(2, '0')}</span>
              {s === 'intro' ? 'Permission' : s === 'handedness' ? 'Handedness' : 'Framing'}
            </li>
          ))}
        </ol>

        {step === 'intro' && (
          <section className="wb-panel wb-setup__panel">
            <h2 className="wb-h2">Before the browser asks</h2>
            <p className="wb-lede">
              Wibbly reads your body position from your webcam to turn a swing into a game input.
              When you press the button below, your browser will ask for camera permission — that
              prompt comes from the browser, not from us.
            </p>
            <ul className="wb-setup__facts">
              <li>
                <strong>Frames stay in this tab.</strong> Pose estimation runs locally in your
                browser. Nothing is uploaded; this build has no server to upload to.
              </li>
              <li>
                <strong>Nothing is recorded.</strong> The video element is live only. Closing the
                tab or leaving this page stops the camera and releases the device.
              </li>
              <li>
                <strong>A model downloads once.</strong> The pose model is fetched from Google's
                TFJS CDN the first time, then cached by your browser.
              </li>
              <li>
                <strong>You can say no.</strong> The whole game is playable on the spacebar.
              </li>
            </ul>
            <div className="wb-setup__actions">
              <button
                type="button"
                className="wb-btn wb-btn--primary"
                onClick={startCamera}
                disabled={camera === 'starting'}
              >
                {camera === 'starting' ? 'Starting camera…' : 'Turn on my camera'}
              </button>
              <button type="button" className="wb-btn wb-btn--ghost" onClick={() => finish('keyboard')}>
                Skip — play with the spacebar
              </button>
            </div>

            {camera === 'failed' && (
              <div className="wb-setup__failure">
                <p className="wb-note wb-note--danger">
                  <strong>The camera pipeline did not start.</strong> The browser reported:{' '}
                  <code className="wb-mono">{cameraError}</code>
                  <br />
                  Common causes: permission was refused, another app holds the camera, or this
                  browser cannot give the pose model a GPU backend. None of them stop you playing.
                </p>
                <div className="wb-setup__actions">
                  <button type="button" className="wb-btn" onClick={startCamera}>
                    Try again
                  </button>
                  <button type="button" className="wb-btn wb-btn--primary" onClick={() => finish('keyboard')}>
                    Play with the spacebar
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {step === 'handedness' && (
          <section className="wb-setup__split">
            {stage}
            <div className="wb-panel wb-setup__panel">
              <h2 className="wb-h2">Which hand holds the racket?</h2>
              <p className="wb-lede">
                This is the arm the swing detector watches, and it decides whether a stroke counts
                as a forehand or a backhand. It is saved to your device for this player only.
              </p>
              <div className="wb-setup__hands">
                {['left', 'right'].map((hand) => (
                  <button
                    key={hand}
                    type="button"
                    className={`wb-hand ${handedness === hand ? 'is-active' : ''}`}
                    onClick={() => chooseHand(hand)}
                    aria-pressed={handedness === hand}
                  >
                    <svg viewBox="0 0 60 60" aria-hidden="true" style={{ transform: hand === 'left' ? 'scaleX(-1)' : 'none' }}>
                      <circle cx="22" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
                      <path d="M22 20 L22 40 M22 26 L12 33 M22 40 L15 55 M22 40 L29 55" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M22 26 L40 20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                      <circle cx="45" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="2.6" />
                    </svg>
                    <span>{hand === 'left' ? 'Left-handed' : 'Right-handed'}</span>
                  </button>
                ))}
              </div>
              <p className="wb-note wb-note--accent">
                Saved live — the recogniser reads it again on the very next frame, so you can flip
                it mid-match from the in-game menu.
              </p>
              <div className="wb-setup__actions">
                <button type="button" className="wb-btn wb-btn--primary" onClick={() => setStep('framing')}>
                  Next — check my framing
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'framing' && (
          <section className="wb-setup__split">
            {stage}
            <div className="wb-panel wb-setup__panel">
              <h2 className="wb-h2">Framing &amp; light</h2>
              <p className="wb-lede">
                Stand back until your head, shoulders and hips are all visible, with room to swing.
                These checks come from the library's <code className="wb-mono">checkFraming()</code> —
                the same function the game itself uses.
              </p>

              <div className="wb-setup__checks" aria-live="polite">
                {warnings === null && <p className="wb-note">Scoring the first frame…</p>}
                {warnings !== null && warnings.length === 0 && (
                  <p className="wb-note wb-note--accent">
                    <strong>Framing looks good.</strong> Head, shoulders, hips and at least one
                    wrist are all tracked with confidence.
                  </p>
                )}
                {warnings !== null &&
                  warnings.map((w) => (
                    <p key={w.code + w.message} className="wb-note wb-note--planned">
                      <strong>{w.code === 'lighting' ? 'Light' : 'Framing'}:</strong> {w.message}
                    </p>
                  ))}
              </div>

              <div className="wb-setup__actions">
                <button type="button" className="wb-btn wb-btn--primary" onClick={() => finish('camera')}>
                  Start playing
                </button>
                <button type="button" className="wb-btn wb-btn--ghost" onClick={() => setStep('handedness')}>
                  Back
                </button>
              </div>
              <p className="wb-note">
                You can continue with warnings showing — they degrade tracking, they do not block
                it, and the spacebar always works.
              </p>
            </div>
          </section>
        )}
      </div>

      <style>{`
        .wb-setup { display: flex; flex-direction: column; gap: 1.5rem; }
        .wb-setup__head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; }

        .wb-setup__rail { display: flex; gap: .5rem; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; }
        .wb-setup__rail li {
          display: flex; align-items: center; gap: .5rem;
          padding: .4rem .85rem; border-radius: 999px;
          border: 1px solid var(--border); color: var(--text-3);
          font-size: .82rem;
        }
        .wb-setup__rail li span { color: var(--text-3); font-size: .68rem; letter-spacing: .1em; }
        .wb-setup__rail li.is-current { border-color: var(--accent); color: var(--text); background: var(--accent-dim); }
        .wb-setup__rail li.is-current span { color: var(--accent); }
        .wb-setup__rail li.is-done { color: var(--text-2); border-color: var(--border-strong); }

        .wb-setup__panel { display: flex; flex-direction: column; gap: 1rem; }
        .wb-setup__panel > .wb-h2 { margin: 0; }
        .wb-setup__facts { margin: 0; padding-left: 1.1rem; color: var(--text-2); display: grid; gap: .5rem; font-size: .9rem; }
        .wb-setup__facts strong { color: var(--text); }
        .wb-setup__actions { display: flex; gap: .75rem; flex-wrap: wrap; }
        .wb-setup__failure { display: flex; flex-direction: column; gap: 1rem; }
        .wb-setup__failure code { word-break: break-word; color: var(--text); }

        .wb-setup__split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
        @media (max-width: 860px) { .wb-setup__split { grid-template-columns: 1fr; } }

        .wb-setup__stage {
          position: relative; aspect-ratio: 4 / 3; width: 100%;
          border-radius: var(--r-lg); overflow: hidden;
          background: #000; border: 1px solid var(--border-strong);
          box-shadow: var(--shadow-lg);
        }
        .wb-setup__video, .wb-setup__overlay { position: absolute; inset: 0; width: 100%; height: 100%; }
        .wb-setup__overlay { transform: scaleX(-1); pointer-events: none; }
        .wb-setup__stage-hint {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: .7rem .9rem; font-size: .8rem; color: var(--text-2);
          background: linear-gradient(to top, rgba(13,10,16,.92), transparent);
        }

        .wb-setup__hands { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
        .wb-hand {
          display: flex; flex-direction: column; align-items: center; gap: .5rem;
          padding: 1rem .75rem; border-radius: var(--r-md);
          border: 1px solid var(--border); background: var(--bg-elevated);
          color: var(--text-2); font-family: var(--sans); font-size: .9rem; font-weight: 600;
          cursor: pointer; transition: all .18s var(--ease);
        }
        .wb-hand svg { width: 56px; height: 56px; }
        .wb-hand:hover { border-color: var(--border-strong); color: var(--text); }
        .wb-hand.is-active {
          border-color: var(--accent); color: var(--accent);
          background: var(--accent-dim);
          box-shadow: 0 12px 34px -18px var(--accent-glow);
        }

        .wb-setup__checks { display: grid; gap: .6rem; }
      `}</style>
    </div>
  );
}
