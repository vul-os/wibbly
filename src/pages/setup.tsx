import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calibration,
  WibblyInput,
  checkFraming,
  drawSkeletons,
  isPermissionDenial,
  type CalibrationWarning,
  type Handedness,
  type PipelineStats,
} from '@vulos/wibbly-input';
import { recordSetup, type SetupOutcome } from '../components/game-settings';
import { modelUrl } from '../mode';

/**
 * `--i` is a CSS custom property the stylesheet reads for staggered entrance
 * animation (`.wb-rise`). React's `CSSProperties` type has no room for custom
 * properties, so this is the same `{ '--i': n }` object the JSX used to write
 * inline, just constructed through a typed helper instead of an object
 * literal TypeScript would otherwise reject.
 */
const riseDelay = (i: number): React.CSSProperties => ({ '--i': i }) as React.CSSProperties;

type SetupStep = 'intro' | 'handedness' | 'framing';
type CameraState = 'idle' | 'starting' | 'live' | 'failed';

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
 *      is what SwingRecognizer reads live, every frame.
 *   3. FRAMING. checkFraming() from the real library, fed the bound person from
 *      the live pipeline. Not a mock, and not a decorative "looks good" badge:
 *      the messages come from the same function the game would use.
 *
 * The spacebar route is offered at every step, including after a refusal. A
 * player who says no to the camera still gets a game.
 *
 * ── Presentation ──────────────────────────────────────────────────────────
 * The camera stage is the HERO here, not a thumbnail in a corner. It is the
 * most distinctive thing this product has — a live skeleton drawn over your own
 * body — so once the camera is on it takes the larger half of the screen, wears
 * the registration brackets, and carries a broadcast-style label bar. The
 * controls sit beside it as the smaller column. On a narrow screen the stage
 * stays on top, because the picture is what tells you whether setup is working.
 */

const PLAYER_ID = 'player_1';

const STEPS: SetupStep[] = ['intro', 'handedness', 'framing'];
const STEP_LABELS: Record<SetupStep, string> = { intro: 'Permission', handedness: 'Handedness', framing: 'Framing' };

export default function Setup() {
  const navigate = useNavigate();

  const calibrationRef = useRef<Calibration | null>(null);
  if (!calibrationRef.current) calibrationRef.current = new Calibration();

  const inputRef = useRef<WibblyInput | null>(null);
  const videoMountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState<SetupStep>('intro');
  const [camera, setCamera] = useState<CameraState>('idle'); // idle | starting | live | failed
  const [cameraError, setCameraError] = useState<string | null>(null);
  // Whether the failure was the player saying no, as opposed to a device or
  // backend problem. Classified from `err.name` by the library — never from
  // message text, which is not stable across browser engines.
  const [denied, setDenied] = useState(false);
  // Degradations the pipeline reports while still working: a loosened
  // constraint set, a rejected autoplay, the rAF frame-pacing fallback. These
  // are surfaced rather than swallowed — a camera that came up at the wrong
  // resolution should say so.
  const [pipelineWarning, setPipelineWarning] = useState<string | null>(null);
  const [handedness, setHandedness] = useState<Handedness>(() => calibrationRef.current!.handednessFor(PLAYER_ID));
  const [warnings, setWarnings] = useState<CalibrationWarning[] | null>(null); // null until the first frame is scored
  const [seenPerson, setSeenPerson] = useState(false);
  // Live pacing readout for the stage label bar. Purely observational — these
  // are the pipeline's own numbers, not invented ones.
  const [stats, setStats] = useState<PipelineStats | null>(null);

  /* ── Camera lifecycle ─────────────────────────────────────────────────── */

  const startCamera = useCallback(async () => {
    if (inputRef.current) return;
    // Never null in practice: calibrationRef.current is set synchronously
    // above, before this callback can ever run.
    const calibration = calibrationRef.current!;
    setCamera('starting');
    setCameraError(null);
    setDenied(false);
    setPipelineWarning(null);

    const wibbly = new WibblyInput({
      calibration,
      // Same-origin vendored weights — see src/mode.js.
      trackerConfig: { modelUrl: modelUrl() },
      frame: {
        // `ideal`, not `exact`, is applied inside the library: Safari rejects
        // an over-specified request outright rather than approximating it, so
        // these are a preference and the library walks a loosening ladder if
        // the device cannot oblige.
        width: 640,
        height: 480,
        fps: 30,
        onWarning: (message) => {
          console.warn('[setup]', message);
          setPipelineWarning(message);
        },
      },
      onError: (err) => console.error('[setup] pipeline error:', err),
    });

    // Bind the instance BEFORE awaiting start(), not after. `wibbly.start()`
    // requests the camera partway through its own await chain — by the time
    // it resolves, the permission light may already be lit — and the unmount
    // effect below can only stop whatever `inputRef.current` points to.
    // Binding late left a real gap: a player who presses "Turn on my camera"
    // and immediately backs out (or whose device is slow to load the model)
    // unmounts this component while `wibbly.start()` is still in flight,
    // `inputRef.current` was still null, and nothing was ever told to release
    // the stream — the camera stayed on until the tab itself closed.
    inputRef.current = wibbly;

    wibbly.onPeople((people) => {
      const person = people[0] ?? null;
      if (person) setSeenPerson(true);
      setWarnings(checkFraming(person));

      // Widen the reach envelope while the player is standing there anyway —
      // this is exactly the "calibration wave" moment §3.5 describes.
      if (person) calibration.observeReach(PLAYER_ID, person);

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
        highlightArm: () => calibration.handednessFor(PLAYER_ID),
      });
    });

    try {
      await wibbly.start();
      // The unmount effect may have already stopped and cleared this exact
      // instance while start() was in flight — WibblyInput.start() does not
      // itself abort on a concurrent stop() the way the underlying frame
      // source does (see packages/wibbly-input/src/pipeline.ts). If
      // `inputRef.current` no longer points at `wibbly`, this component has
      // moved on (unmounted, or a fresh attempt is under way), and finishing
      // here would silently reopen a camera nobody is asking for. Shut it
      // straight back down instead of touching state that nobody will read.
      if (inputRef.current !== wibbly) {
        wibbly.stop();
        return;
      }
      setCamera('live');
      setStep('handedness');
    } catch (err) {
      // Denied permission, no camera, or — commonly in headless browsers — no
      // GPU backend for the pose model. Say which, and offer the spacebar.
      //
      // The distinction is drawn on `err.name` via the library's
      // isPermissionDenial(), not on message text: every engine words these
      // differently and Safari's wording has changed between releases. A
      // refusal is a CHOICE and gets different copy from a fault — telling
      // somebody who just clicked "Block" to check whether their camera is
      // plugged in is how you look like you are not listening.
      console.error('[setup] camera unavailable:', err);
      setDenied(isPermissionDenial(err));
      setCameraError(err instanceof Error ? err.message : String(err));
      setCamera('failed');
      try {
        wibbly.stop();
      } catch {
        /* already torn down */
      }
      // Only clear the ref if it is still ours — an unmount in the meantime
      // already did this and already stopped this same instance.
      if (inputRef.current === wibbly) inputRef.current = null;
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

  // Pacing readout for the label bar.
  useEffect(() => {
    if (camera !== 'live') return undefined;
    const id = setInterval(() => setStats(inputRef.current?.stats ?? null), 1000);
    return () => clearInterval(id);
  }, [camera]);

  // Always release the camera on the way out, whichever exit the player takes.
  useEffect(
    () => () => {
      inputRef.current?.stop();
      inputRef.current = null;
    },
    [],
  );

  /* ── Actions ──────────────────────────────────────────────────────────── */

  const chooseHand = (hand: Handedness) => {
    calibrationRef.current!.setHandedness(PLAYER_ID, hand);
    setHandedness(hand);
  };

  const finish = (outcome: SetupOutcome) => {
    recordSetup(outcome);
    inputRef.current?.stop();
    inputRef.current = null;
    navigate('/play');
  };

  const stepIndex = STEPS.indexOf(step);

  /* ── The stage ────────────────────────────────────────────────────────── */

  const stage = (
    <div className={`wb-stagecam wb-bracket ${seenPerson ? 'is-live' : ''}`}>
      <div className="wb-stagecam__bar">
        <span className="wb-stagecam__id">
          <span className={`wb-stagecam__rec ${seenPerson ? 'is-tracking' : ''}`} />
          CAM 01 <span className="wb-stagecam__sub">/ front</span>
        </span>
        <span className="wb-stagecam__tele">
          {stats ? (
            <>
              {stats.peopleLastFrame} tracked
              <i>·</i>
              {Math.round(stats.targetFps)} fps
              {stats.inferenceMs != null && (
                <>
                  <i>·</i>
                  {Math.round(stats.inferenceMs)} ms
                </>
              )}
            </>
          ) : (
            'standby'
          )}
        </span>
      </div>

      <div className="wb-stagecam__frame">
        <div ref={videoMountRef} className="wb-stagecam__video" />
        <canvas ref={canvasRef} className="wb-stagecam__overlay" />
        {/* Framing guide: where a person should stand. Chalk, not chrome. */}
        <div className="wb-stagecam__guide" aria-hidden="true" />
        {camera === 'live' && !seenPerson && (
          <div className="wb-stagecam__hint">
            <span className="wb-stagecam__hintdot" />
            Waiting for a person — stand back so your head, shoulders and hips are all in frame.
          </div>
        )}
      </div>

      {/* A degradation the pipeline reported while still working — a loosened
          constraint set, a rejected autoplay, the rAF pacing fallback. Stated
          rather than swallowed: a camera running at a resolution nobody asked
          for should say so, because it explains tracking that feels worse than
          it should. Amber, because this is "working, but not as specified". */}
      {pipelineWarning && (
        <p className="wb-stagecam__warn" role="status">
          {pipelineWarning}
        </p>
      )}
    </div>
  );

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="wb-court">
      <div className="wb-grain" aria-hidden="true" />
      <div className="wb-stage wb-setup">
        <header className="wb-setup__head wb-rise" style={riseDelay(0)}>
          <div>
            <p className="wb-eyebrow">Setup</p>
            <h1 className="wb-h2">Get your camera ready</h1>
          </div>
          <button
            type="button"
            className="wb-btn wb-btn--ghost wb-btn--small"
            onClick={() => navigate('/')}
          >
            Back to title
          </button>
        </header>

        {/* Progress track — a chalk line with the live segment lit. */}
        <ol className="wb-setup__rail wb-rise" style={riseDelay(1)}>
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={i === stepIndex ? 'is-current' : i < stepIndex ? 'is-done' : ''}
              aria-current={i === stepIndex ? 'step' : undefined}
            >
              <span className="wb-setup__railno wb-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="wb-setup__raillabel">{STEP_LABELS[s]}</span>
              <span className="wb-setup__railtrack" />
            </li>
          ))}
        </ol>

        {step === 'intro' && (
          <section className="wb-setup__intro wb-rise" style={riseDelay(2)}>
            <div className="wb-panel wb-panel--framed wb-setup__panel">
              <div>
                <p className="wb-eyebrow">Step 01</p>
                <h2 className="wb-h2">Before the browser asks</h2>
              </div>
              <p className="wb-lede">
                Wibbly reads your body position from your webcam to turn a swing into a game input.
                When you press the button below, your browser will ask for camera permission — that
                prompt comes from the browser, not from us.
              </p>

              <ul className="wb-setup__facts">
                <li>
                  <span className="wb-setup__facticon" aria-hidden="true">
                    <svg viewBox="0 0 20 20"><path d="M10 2 L17 5 v5c0 4-3 6.5-7 8-4-1.5-7-4-7-8V5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                  </span>
                  <span>
                    <strong>Frames stay in this tab.</strong> Pose estimation runs locally in your
                    browser. Nothing is uploaded; this build has no server to upload to.
                  </span>
                </li>
                <li>
                  <span className="wb-setup__facticon" aria-hidden="true">
                    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M5 15 L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  </span>
                  <span>
                    <strong>Nothing is recorded.</strong> The video element is live only. Closing the
                    tab or leaving this page stops the camera and releases the device.
                  </span>
                </li>
                <li>
                  <span className="wb-setup__facticon" aria-hidden="true">
                    <svg viewBox="0 0 20 20"><path d="M10 3 v9 M6.5 8.5 L10 12 l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 15 h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  </span>
                  <span>
                    <strong>The model ships with the app.</strong> The ~9&nbsp;MB pose model is served
                    from this same origin, not fetched from a third-party CDN. It loads once, then
                    your browser caches it.
                  </span>
                </li>
                <li>
                  <span className="wb-setup__facticon" aria-hidden="true">
                    <svg viewBox="0 0 20 20"><rect x="2.5" y="6.5" width="15" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M6 10 h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  </span>
                  <span>
                    <strong>You can say no.</strong> The whole game is playable on the spacebar.
                  </span>
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
                <button
                  type="button"
                  className="wb-btn wb-btn--ghost"
                  onClick={() => finish('keyboard')}
                >
                  Skip — play with the spacebar
                </button>
              </div>

              {camera === 'failed' && (
                <div className="wb-setup__failure">
                  {denied ? (
                    /* The player said no. That is a valid answer, not an error
                       to be argued with — so no red, no diagnostics, and the
                       spacebar becomes the primary action. */
                    <p className="wb-note wb-note--planned">
                      <strong>No camera, then.</strong> That is a perfectly good answer — the whole
                      game is playable on the spacebar, and nothing below is missing from it except
                      the arm swing. If you change your mind, your browser keeps this permission in
                      its site settings.
                    </p>
                  ) : (
                    <p className="wb-note wb-note--danger">
                      <strong>The camera pipeline did not start.</strong> The browser reported:{' '}
                      <code className="wb-mono">{cameraError}</code>
                      <br />
                      Common causes: another app is holding the camera, there is no camera attached,
                      or this browser cannot give the pose model a GPU backend. None of them stop you
                      playing.
                    </p>
                  )}

                  <div className="wb-setup__actions">
                    {denied ? (
                      <>
                        <button
                          type="button"
                          className="wb-btn wb-btn--primary"
                          onClick={() => finish('keyboard')}
                        >
                          Play with the spacebar
                        </button>
                        <button type="button" className="wb-btn wb-btn--ghost" onClick={startCamera}>
                          Ask again
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="wb-btn" onClick={startCamera}>
                          Try again
                        </button>
                        <button
                          type="button"
                          className="wb-btn wb-btn--primary"
                          onClick={() => finish('keyboard')}
                        >
                          Play with the spacebar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* A still diagram of what the camera should see. Not a fake
                preview — line art, clearly drawn, so nobody mistakes it for a
                live feed before permission has been granted. */}
            <aside className="wb-setup__diagram wb-bracket">
              <p className="wb-eyebrow">What good framing looks like</p>
              <svg viewBox="0 0 200 150" aria-hidden="true">
                <rect x="1" y="1" width="198" height="148" rx="6" fill="none" stroke="var(--border)" />
                <rect x="30" y="14" width="140" height="122" rx="4" fill="none" stroke="var(--court-line-bright)" strokeDasharray="4 5" />
                <circle cx="100" cy="42" r="13" fill="none" stroke="var(--text-3)" strokeWidth="2.2" />
                <path
                  d="M100 55 L100 95 M100 66 L74 82 M100 66 L126 78 M100 95 L86 132 M100 95 L114 132"
                  fill="none" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round"
                />
                <circle cx="126" cy="78" r="4.5" fill="var(--accent)" />
                <circle cx="74" cy="82" r="4.5" fill="var(--accent)" />
                <circle cx="100" cy="55" r="4.5" fill="var(--accent)" />
                <text x="100" y="146" textAnchor="middle" fill="var(--text-4)" style={{ font: "600 8px var(--mono)", letterSpacing: '.14em' }}>
                  HEAD · SHOULDERS · HIPS
                </text>
              </svg>
              <p className="wb-note">
                Roughly two metres back, light on your face rather than behind you, and room either
                side to swing.
              </p>
            </aside>
          </section>
        )}

        {step === 'handedness' && (
          <section className="wb-setup__split wb-rise" style={riseDelay(2)}>
            {stage}
            <div className="wb-panel wb-panel--framed wb-setup__panel">
              <div>
                <p className="wb-eyebrow">Step 02</p>
                <h2 className="wb-h2">Which hand holds the racket?</h2>
              </div>
              <p className="wb-lede">
                This is the arm the swing detector watches, and it decides whether a stroke counts
                as a forehand or a backhand. It is saved to your device for this player only.
              </p>

              <div className="wb-setup__hands">
                {(['left', 'right'] as const).map((hand) => (
                  <button
                    key={hand}
                    type="button"
                    className={`wb-hand ${handedness === hand ? 'is-active' : ''}`}
                    onClick={() => chooseHand(hand)}
                    aria-pressed={handedness === hand}
                  >
                    <svg
                      viewBox="0 0 60 60"
                      aria-hidden="true"
                      style={{ transform: hand === 'left' ? 'scaleX(-1)' : 'none' }}
                    >
                      <circle cx="22" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
                      <path
                        d="M22 20 L22 40 M22 26 L12 33 M22 40 L15 55 M22 40 L29 55"
                        fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                      />
                      <path d="M22 26 L40 20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                      <circle cx="45" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="2.6" />
                    </svg>
                    <span className="wb-hand__label">{hand === 'left' ? 'Left-handed' : 'Right-handed'}</span>
                    <span className="wb-hand__state wb-mono">
                      {handedness === hand ? 'selected' : 'select'}
                    </span>
                  </button>
                ))}
              </div>

              <p className="wb-note wb-note--accent">
                <strong>Saved live.</strong> The recogniser reads it again on the very next frame,
                so you can flip it mid-match from the in-game menu.
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
          <section className="wb-setup__split wb-rise" style={riseDelay(2)}>
            {stage}
            <div className="wb-panel wb-panel--framed wb-setup__panel">
              <div>
                <p className="wb-eyebrow">Step 03</p>
                <h2 className="wb-h2">Framing &amp; light</h2>
              </div>
              <p className="wb-lede">
                Stand back until your head, shoulders and hips are all visible, with room to swing.
                These checks come from the library's <code className="wb-mono">checkFraming()</code> —
                the same function the game itself uses.
              </p>

              <div className="wb-setup__checks" aria-live="polite">
                {warnings === null && (
                  <p className="wb-note">
                    <span className="wb-setup__spin" aria-hidden="true" /> Scoring the first frame…
                  </p>
                )}
                {warnings !== null && warnings.length === 0 && (
                  <p className="wb-note wb-note--shipped">
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
                <button
                  type="button"
                  className="wb-btn wb-btn--ghost"
                  onClick={() => setStep('handedness')}
                >
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
        .wb-setup { display: flex; flex-direction: column; gap: 1.4rem; }
        .wb-setup__head {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 1rem; flex-wrap: wrap;
        }
        .wb-setup__head .wb-eyebrow { margin-bottom: .35rem; }

        /* ── Progress track ───────────────────────────────────────────── */

        .wb-setup__rail {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: .9rem; list-style: none; margin: 0; padding: 0;
        }
        .wb-setup__rail li {
          display: flex; align-items: baseline; gap: .5rem; flex-wrap: wrap;
          color: var(--text-4); font-size: .82rem;
        }
        .wb-setup__railno {
          font-size: .66rem; font-weight: 700; letter-spacing: .14em; color: inherit;
        }
        .wb-setup__raillabel {
          font-family: var(--mono); font-size: .66rem; font-weight: 600;
          letter-spacing: .16em; text-transform: uppercase;
        }
        .wb-setup__railtrack {
          flex: 1 1 100%; height: 2px; border-radius: 2px;
          background: var(--border); margin-top: .3rem;
          transition: background .3s var(--ease);
        }
        .wb-setup__rail li.is-current { color: var(--accent); }
        .wb-setup__rail li.is-current .wb-setup__railtrack { background: var(--accent); }
        .wb-setup__rail li.is-done { color: var(--text-2); }
        .wb-setup__rail li.is-done .wb-setup__railtrack { background: var(--border-bright); }

        /* ── Panels ───────────────────────────────────────────────────── */

        .wb-setup__panel { display: flex; flex-direction: column; gap: 1rem; }
        .wb-setup__panel > div > .wb-eyebrow { margin-bottom: .3rem; }
        .wb-setup__panel .wb-h2 { margin: 0; }

        .wb-setup__facts { margin: 0; padding: 0; list-style: none; display: grid; gap: .7rem; }
        .wb-setup__facts li {
          display: grid; grid-template-columns: auto minmax(0,1fr); gap: .7rem;
          align-items: start;
          color: var(--text-2); font-size: .88rem; line-height: 1.5;
        }
        .wb-setup__facts strong { color: var(--text); font-weight: 650; }
        .wb-setup__facticon {
          display: grid; place-items: center;
          width: 26px; height: 26px; border-radius: var(--r-sm);
          border: 1px solid var(--border); background: var(--bg-sunken);
          color: var(--accent);
        }
        .wb-setup__facticon svg { width: 15px; height: 15px; }

        .wb-setup__actions { display: flex; gap: .7rem; flex-wrap: wrap; }
        .wb-setup__failure { display: flex; flex-direction: column; gap: 1rem; }
        .wb-setup__failure code { word-break: break-word; color: var(--text); }

        /* ── Intro two-up ─────────────────────────────────────────────── */

        .wb-setup__intro {
          display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 1.15rem; align-items: start;
        }
        .wb-setup__diagram {
          padding: 1.15rem; border-radius: var(--r-lg);
          background: var(--bg-sunken); border: 1px solid var(--border);
          display: flex; flex-direction: column; gap: .8rem;
        }
        .wb-setup__diagram svg { width: 100%; height: auto; }

        /* ── Stage split: the picture gets the bigger half ────────────── */

        .wb-setup__split {
          display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: 1.15rem; align-items: start;
        }

        /* ── The camera stage ─────────────────────────────────────────── */

        .wb-stagecam {
          border-radius: var(--r-lg); overflow: hidden;
          background: var(--bg-sunken);
          border: 1px solid var(--border-strong);
          box-shadow: var(--shadow-lg);
        }
        .wb-stagecam__bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: .75rem; padding: .5rem .7rem;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          font-family: var(--mono); font-size: .62rem; font-weight: 600;
          letter-spacing: .16em; text-transform: uppercase;
          font-variant-numeric: tabular-nums;
        }
        .wb-stagecam__id { display: inline-flex; align-items: center; gap: .45rem; color: var(--text-2); }
        .wb-stagecam__sub { color: var(--text-4); }
        .wb-stagecam__rec {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--text-4); flex: none;
        }
        .wb-stagecam__rec.is-tracking {
          background: var(--accent); box-shadow: 0 0 9px var(--accent);
          animation: wb-pulse 2s ease-in-out infinite;
        }
        .wb-stagecam__tele {
          display: inline-flex; align-items: center; gap: .3rem;
          color: var(--text-3);
        }
        .wb-stagecam__tele i { color: var(--text-4); font-style: normal; }

        .wb-stagecam__frame {
          position: relative; aspect-ratio: 4 / 3; width: 100%;
          background: #000; overflow: hidden;
        }
        .wb-stagecam__video, .wb-stagecam__overlay {
          position: absolute; inset: 0; width: 100%; height: 100%;
        }
        .wb-stagecam__overlay { transform: scaleX(-1); pointer-events: none; }
        /* The standing guide — chalk on the floor, not a UI element. */
        .wb-stagecam__guide {
          position: absolute; inset: 8% 18%;
          border: 1px dashed rgba(244,240,248,.13);
          border-radius: 4px; pointer-events: none;
        }
        .wb-stagecam__hint {
          position: absolute; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; gap: .5rem;
          padding: .75rem .85rem; font-size: .8rem; color: var(--text-2);
          background: linear-gradient(to top, rgba(8,6,16,.95), transparent);
        }
        .wb-stagecam__warn {
          margin: 0; padding: .6rem .75rem;
          border-top: 1px solid var(--planned-line);
          background: var(--planned-dim);
          color: var(--planned);
          font-family: var(--mono); font-size: .7rem; line-height: 1.5;
        }
        .wb-stagecam__hintdot {
          width: 6px; height: 6px; border-radius: 50%; flex: none;
          background: var(--planned);
          animation: wb-pulse 1.6s ease-in-out infinite;
        }

        /* ── Handedness ───────────────────────────────────────────────── */

        .wb-setup__hands { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
        .wb-hand {
          display: flex; flex-direction: column; align-items: center; gap: .45rem;
          padding: 1.1rem .75rem .85rem; border-radius: var(--r-md);
          border: 1px solid var(--border); background: var(--bg-sunken);
          color: var(--text-3); font-family: var(--sans);
          cursor: pointer; transition: all .18s var(--ease);
        }
        .wb-hand svg { width: 54px; height: 54px; }
        .wb-hand__label { font-size: .88rem; font-weight: 650; color: var(--text-2); }
        .wb-hand__state {
          font-size: .6rem; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: var(--text-4);
        }
        .wb-hand:hover { border-color: var(--border-bright); color: var(--text-2); }
        .wb-hand:hover .wb-hand__label { color: var(--text); }
        .wb-hand.is-active {
          border-color: var(--accent); color: var(--accent);
          background: var(--accent-dim);
          box-shadow: 0 14px 36px -20px var(--accent-glow);
        }
        .wb-hand.is-active .wb-hand__label,
        .wb-hand.is-active .wb-hand__state { color: var(--accent); }

        .wb-setup__checks { display: grid; gap: .55rem; }
        .wb-setup__spin {
          display: inline-block; width: 9px; height: 9px; margin-right: .35rem;
          border-radius: 50%; border: 1.5px solid var(--border-bright);
          border-top-color: var(--accent);
          animation: wb-spin .9s linear infinite;
        }
        @keyframes wb-spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .wb-setup__split, .wb-setup__intro { grid-template-columns: 1fr; }
          .wb-setup__rail { grid-template-columns: 1fr; gap: .5rem; }
          .wb-setup__railtrack { flex-basis: auto; min-width: 60px; }
        }
      `}</style>
    </div>
  );
}
