import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * In-game menu — pause, settings, camera, help, quit.
 *
 * Salvaged from the CAMERA contributor branch. The structure it contributed is
 * sound and is kept: a tabbed shell with a header/content/footer rhythm over an
 * animated backdrop. What has changed is everything about how it looks and one
 * thing about what it claims.
 *
 * ── Honesty, which is load-bearing here ───────────────────────────────────
 * Every control below is either wired to something real or rendered visibly
 * disabled with the reason attached. There are no decorative toggles and no
 * no-ops dressed up as features. The controls with nothing behind them —
 * camera perspectives, field of view, smoothing, difficulty, graphics quality,
 * shadows, anti-aliasing — are drawn as BLUEPRINT: dashed amber outline over a
 * hatched fill, never a solid surface and never the accent colour. In this
 * product magenta means "live", so a control that is not live may not wear it.
 * Greying things out would read as "temporarily unavailable"; the blueprint
 * treatment reads as "drawn but not built", which is what is actually true.
 *
 * ── Presentation ──────────────────────────────────────────────────────────
 * Recast as the broadcast pause card: registration brackets on the container,
 * a mono telemetry register for every label and key cap, drawn SVG tab glyphs
 * in place of the emoji the branch shipped (emoji render differently on every
 * platform and were the loudest thing on the screen), and a left-hand tab rail
 * on wide screens so the tabs read as channels rather than browser chrome.
 *
 * Props:
 *   isOpen, onClose          — pause/resume. Real: the caller freezes the
 *                              simulation while this is open.
 *   gameSettings             — { usePoseDetection, debug }; both are read by
 *   onSettingsChange(k, v)     the game. Changing either restarts the match,
 *                              which the UI says out loud.
 *   currentCamera            — the view mode the game is actually running.
 *                              Tennis implements exactly one ('follow').
 *   onCameraChange           — optional. Omit it and every perspective option
 *                              renders disabled, which is the truth today.
 *   calibration              — the live Calibration instance (§3.5). Handedness
 *                              writes here and the recogniser re-reads it on
 *                              the next frame.
 *   cameraStatus             — 'live' | 'keyboard' | 'unknown', for the readout.
 *   onRestart, onQuit        — real navigation/lifecycle actions.
 */

const PLAYER_ID = 'player_1';

/* Drawn glyphs, not emoji. Emoji are a different typeface on every OS, they
   carry their own colour that fights the palette, and at this size they are
   mush. These are 20×20 line icons on the same 1.6 stroke as the rest of the
   app's line art. */
const Glyph = ({ name }) => {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg viewBox="0 0 20 20" className="tab-glyph" aria-hidden="true">
      {name === 'controls' && (
        <>
          <rect x="2" y="6" width="16" height="9" rx="3.5" {...p} />
          <path d="M6 10.5 h2.6 M7.3 9.2 v2.6 M12.6 9.8 h.01 M14.2 11.4 h.01" {...p} />
        </>
      )}
      {name === 'camera' && (
        <>
          <path d="M2.5 7 h3l1.2-1.8h4.6L12.5 7h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-14a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" {...p} />
          <circle cx="9.5" cy="11" r="2.8" {...p} />
        </>
      )}
      {name === 'settings' && (
        <>
          <circle cx="10" cy="10" r="2.6" {...p} />
          <path d="M10 2.5v2.2M10 15.3v2.2M17.5 10h-2.2M4.7 10H2.5M15.3 4.7l-1.6 1.6M6.3 13.7l-1.6 1.6M15.3 15.3l-1.6-1.6M6.3 6.3 4.7 4.7" {...p} />
        </>
      )}
      {name === 'help' && (
        <>
          <circle cx="10" cy="10" r="7.5" {...p} />
          <path d="M7.8 7.8a2.2 2.2 0 1 1 2.9 2.1c-.5.2-.7.6-.7 1.1v.4" {...p} />
          <path d="M10 14.4h.01" {...p} />
        </>
      )}
    </svg>
  );
};

const TABS = [
  { id: 'controls', label: 'Controls' },
  { id: 'camera', label: 'Camera' },
  { id: 'settings', label: 'Settings' },
  { id: 'help', label: 'Help' },
];

const VIEW_MODES = [
  {
    id: 'follow',
    name: 'Follow cam',
    description: 'Chase camera that tracks behind your player and the ball.',
    built: true,
  },
  {
    id: 'orbital',
    name: 'Free camera',
    description: 'Orbit and zoom with the mouse. No orbital controller exists in the game yet.',
    built: false,
  },
  {
    id: 'fixed',
    name: 'Fixed',
    description: 'Static camera behind the baseline. Not implemented.',
    built: false,
  },
];

/**
 * A control that is drawn, disabled, and labelled with why.
 *
 * The whole row wears `.wb-blueprint`, so the treatment is identical everywhere
 * it is used and cannot drift into looking live. The child control is always
 * genuinely `disabled` — the styling states the truth, it does not substitute
 * for it.
 */
const PlannedRow = ({ label, note, children }) => (
  <div className="setting-item is-planned wb-blueprint">
    <div className="planned-head">
      <span className="planned-label">{label}</span>
      <span className="planned-tag">not built</span>
    </div>
    <div className="planned-control">
      {children}
      <span className="planned-note">{note}</span>
    </div>
  </div>
);

const InGameMenu = ({
  isOpen,
  onClose,
  onCameraChange,
  currentCamera = 'follow',
  gameSettings,
  onSettingsChange,
  calibration = null,
  cameraStatus = 'unknown',
  onRestart,
  onQuit,
}) => {
  const [activeTab, setActiveTab] = useState('controls');
  const [isClosing, setIsClosing] = useState(false);
  const [handedness, setHandedness] = useState(() =>
    calibration ? calibration.handednessFor(PLAYER_ID) : 'right',
  );

  const menuRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen && isClosing) setIsClosing(false);
  }, [isOpen, isClosing]);

  // Re-read handedness whenever the menu opens: it can also be changed from
  // the setup flow, and this instance is shared with the game.
  useEffect(() => {
    if (isOpen && calibration) setHandedness(calibration.handednessFor(PLAYER_ID));
  }, [isOpen, calibration]);

  // `role="dialog" aria-modal="true"` is a promise, not a decoration: while
  // this is open, focus has to actually live inside it. Without this, Tab
  // walks straight through the overlay into the paused game behind it, which
  // is the one thing aria-modal exists to prevent. Whatever had focus before
  // opening (the HUD's "Menu" button, typically) gets it back on the way out,
  // so resuming does not strand keyboard focus on a control that just closed.
  useEffect(() => {
    if (!isOpen) return undefined;
    previousFocusRef.current = document.activeElement;
    closeBtnRef.current?.focus();
    return () => {
      const el = previousFocusRef.current;
      if (el && typeof el.focus === 'function' && document.contains(el)) el.focus();
      previousFocusRef.current = null;
    };
  }, [isOpen]);

  // Trap Tab/Shift+Tab within the dialog's own focusable elements. Computed
  // fresh on every keypress rather than cached, because which controls are
  // focusable changes with the active tab (a disabled row has none).
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== 'Tab' || !menuRef.current) return;
      const focusables = menuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
          'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // handleClose's timer below outlives a single render; if the whole page
  // unmounts mid-animation (e.g. "Quit to title" fired a navigation while the
  // close transition was still running) nothing else would ever clear it.
  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  // Motion-trail sparks — the one moving thing, in the accent that always means
  // movement in this product. Suppressed entirely under reduced motion.
  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 2.6 + 1.4,
        duration: Math.random() * 12 + 11,
        delay: Math.random() * -20,
        opacity: Math.random() * 0.3 + 0.08,
      })),
    [],
  );

  const handleClose = () => {
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      onClose?.();
    }, 220);
  };

  const setHand = (hand) => {
    calibration?.setHandedness(PLAYER_ID, hand);
    setHandedness(hand);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'controls':
        return (
          <div className="tab-content">
            <header className="content-header">
              <p className="content-eyebrow">Tab 01</p>
              <h3>Controls</h3>
              <hr className="wb-rule" />
            </header>

            <div className="controls-grid">
              <section className="panel">
                <h4>Tennis</h4>
                <div className="control-list">
                  <div className="control-item">
                    <span className="control-key">Space</span>
                    <span className="control-desc">Serve, and swing the racket</span>
                  </div>
                  <div className="control-item">
                    <span className="control-key">Arm swing</span>
                    <span className="control-desc">Same as Space, detected from your camera</span>
                  </div>
                  <div className="control-item">
                    <span className="control-key">Click</span>
                    <span className="control-desc">Restart the match</span>
                  </div>
                </div>
              </section>

              <section className="panel">
                <h4>System</h4>
                <div className="control-list">
                  <div className="control-item">
                    <span className="control-key">Esc</span>
                    <span className="control-desc">Open and close this menu (pauses the match)</span>
                  </div>
                  <div className="control-item">
                    <span className="control-key">H</span>
                    <span className="control-desc">Toggle collision hit boxes</span>
                  </div>
                </div>
                <p className="section-note">
                  The mouse does not move the camera: tennis ships one camera and it drives itself.
                </p>
              </section>
            </div>
          </div>
        );

      case 'camera':
        return (
          <div className="tab-content">
            <header className="content-header">
              <p className="content-eyebrow">Tab 02</p>
              <h3>Camera</h3>
              <hr className="wb-rule" />
            </header>

            <section className="panel">
              <h4>Your webcam</h4>

              <div className={`status-row status-row--${cameraStatus}`}>
                <span className="status-dot" />
                <span className="status-text">
                  {cameraStatus === 'live' && 'Gesture tracking is running in this tab.'}
                  {cameraStatus === 'keyboard' && 'No camera — playing on the spacebar.'}
                  {cameraStatus === 'unknown' && 'Camera state unknown until the pipeline reports in.'}
                </span>
              </div>

              <div className="hand-row">
                <span className="hand-label">Racket hand</span>
                <div className="hand-toggle" role="group" aria-label="Handedness">
                  {['left', 'right'].map((hand) => (
                    <button
                      key={hand}
                      type="button"
                      className={handedness === hand ? 'is-active' : ''}
                      onClick={() => setHand(hand)}
                      disabled={!calibration}
                      aria-pressed={handedness === hand}
                    >
                      {hand === 'left' ? 'Left' : 'Right'}
                    </button>
                  ))}
                </div>
              </div>
              <p className="section-note">
                Written to Calibration for <code>{PLAYER_ID}</code>; the swing recogniser picks it
                up on the next frame, mid-rally. No restart needed.
              </p>
            </section>

            <section className="panel">
              <h4>View perspective</h4>
              <div className="camera-options">
                {VIEW_MODES.map((mode) => {
                  const active = currentCamera === mode.id;
                  // Only offer a click when there is both a handler AND an
                  // implementation behind it. Anything else would be a control
                  // that looks live and does nothing.
                  const selectable = mode.built && typeof onCameraChange === 'function' && !active;
                  return (
                    <div
                      key={mode.id}
                      className={[
                        'camera-option',
                        active ? 'active' : '',
                        mode.built ? '' : 'is-planned wb-blueprint',
                      ].join(' ')}
                      role={selectable ? 'button' : undefined}
                      tabIndex={selectable ? 0 : undefined}
                      aria-disabled={!mode.built}
                      onClick={() => selectable && onCameraChange(mode.id)}
                    >
                      <div className={`radio-button ${active ? 'checked' : ''}`}>
                        <div className="radio-inner" />
                      </div>
                      <div className="camera-info">
                        <div className="camera-name">
                          {mode.name}
                          {!mode.built && <span className="planned-tag">not built</span>}
                          {active && <span className="live-tag">running</span>}
                        </div>
                        <div className="camera-desc">{mode.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <PlannedRow label="Field of view" note="The game does not expose its camera yet.">
                <input type="range" min="45" max="120" defaultValue="75" disabled />
              </PlannedRow>
              <PlannedRow label="Camera smoothing" note="Smoothing is a constant in game.jsx.">
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.5" disabled />
              </PlannedRow>
            </section>
          </div>
        );

      case 'settings':
        return (
          <div className="tab-content">
            <header className="content-header">
              <p className="content-eyebrow">Tab 03</p>
              <h3>Settings</h3>
              <hr className="wb-rule" />
            </header>

            <div className="settings-grid">
              <section className="panel">
                <h4>Input</h4>

                <div className="setting-item toggle-item">
                  <span className="setting-label">Camera gesture input</span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={gameSettings?.usePoseDetection ?? true}
                      onChange={(e) => onSettingsChange?.('usePoseDetection', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <p className="section-note">
                  Turning this off releases the camera entirely and leaves the spacebar. Either way
                  the match restarts, because the pipeline is built once when the game mounts.
                </p>

                <div className="setting-item toggle-item">
                  <span className="setting-label">Debug logging</span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={gameSettings?.debug ?? false}
                      onChange={(e) => onSettingsChange?.('debug', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <p className="section-note">
                  Frame timing, AI decisions and ball state to the browser console. Also restarts
                  the match.
                </p>
              </section>

              <section className="panel panel--blueprint">
                <h4>
                  Not wired up yet
                  <span className="panel-count wb-mono">05</span>
                </h4>
                <p className="section-note section-note--top">
                  These exist in the design and nowhere in the code. They are drawn so the shape of
                  the menu is honest about what is missing, and disabled so they cannot lie.
                </p>

                <PlannedRow label="Difficulty" note="The AI opponent has no difficulty parameter.">
                  <select disabled defaultValue="medium">
                    <option value="medium">Medium</option>
                  </select>
                </PlannedRow>
                <PlannedRow label="AI opponent" note="Both players are always AI-driven.">
                  <span className="toggle is-disabled">
                    <input type="checkbox" checked readOnly disabled />
                    <span className="toggle-slider" />
                  </span>
                </PlannedRow>
                <PlannedRow label="Graphics quality" note="The renderer has no quality tiers.">
                  <select disabled defaultValue="high">
                    <option value="high">High</option>
                  </select>
                </PlannedRow>
                <PlannedRow label="Shadows" note="Shadow maps are on unconditionally.">
                  <span className="toggle is-disabled">
                    <input type="checkbox" checked readOnly disabled />
                    <span className="toggle-slider" />
                  </span>
                </PlannedRow>
                <PlannedRow label="Anti-aliasing" note="Set once at renderer construction.">
                  <span className="toggle is-disabled">
                    <input type="checkbox" checked readOnly disabled />
                    <span className="toggle-slider" />
                  </span>
                </PlannedRow>
              </section>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="tab-content">
            <header className="content-header">
              <p className="content-eyebrow">Tab 04</p>
              <h3>How to play</h3>
              <hr className="wb-rule" />
            </header>

            <div className="help-content">
              <section className="panel">
                <h4>Getting started</h4>
                <ol className="help-list">
                  <li>Stand where your head, shoulders and hips are all in frame.</li>
                  <li>Press <kbd>Space</kbd> to serve.</li>
                  <li>Swing your racket arm — or press <kbd>Space</kbd> — to return the ball.</li>
                  <li>Timing is the whole game: your player moves to the ball on its own.</li>
                </ol>
              </section>

              <section className="panel">
                <h4>Camera setup</h4>
                <ul className="help-list">
                  <li>Roughly two metres back, facing the camera.</li>
                  <li>Light on your face, not behind you — backlight destroys tracking confidence.</li>
                  <li>One person in frame. Tennis routes only the first tracked player to the racket.</li>
                </ul>
              </section>

              <section className="panel">
                <h4>If tracking misbehaves</h4>
                <ul className="help-list">
                  <li>Check the racket hand above — a mirrored setting turns forehands into backhands.</li>
                  <li>Swing from the shoulder. The detector watches wrist velocity, not wrist position.</li>
                  <li>If the camera fails outright, the spacebar plays the whole game.</li>
                </ul>
              </section>

              <section className="panel panel--blueprint">
                <h4>What this build is not</h4>
                <ul className="help-list help-list--planned">
                  <li>One gesture only: a swing. No punch, pinch or point.</li>
                  <li>One player to the racket, even though the tracker binds two.</li>
                  <li>No network play, no lobbies, no scores kept between sessions.</li>
                </ul>
              </section>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`menu-overlay ${isClosing ? 'closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Game menu"
    >
      <div className="sparks-container" aria-hidden="true">
        {sparks.map((s) => (
          <div
            key={s.id}
            className="spark"
            style={{
              left: `${s.x}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="menu-container wb-bracket is-live" ref={menuRef}>
        <header className="menu-header">
          <div className="menu-title">
            <span className="menu-eyebrow">
              <span className="menu-pausebars" aria-hidden="true" />
              Paused
            </span>
            <span className="title-text">Game menu</span>
          </div>
          <button className="close-btn" ref={closeBtnRef} onClick={handleClose} aria-label="Resume game">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="menu-body">
          <nav className="menu-tabs" aria-label="Menu sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <Glyph name={tab.id} />
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="menu-content">{renderTabContent()}</div>
        </div>

        <footer className="menu-footer">
          <div className="footer-left">
            {onQuit && (
              <button className="footer-btn" onClick={onQuit}>
                Quit to title
              </button>
            )}
            {onRestart && (
              <button className="footer-btn" onClick={onRestart}>
                Restart match
              </button>
            )}
          </div>
          <button className="apply-btn" onClick={handleClose}>
            <span className="btn-text">Resume</span>
            <span className="btn-key">Esc</span>
          </button>
        </footer>
      </div>

      <style>{`
        .menu-overlay {
          position: fixed; inset: 0; z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(.75rem, 3vw, 2rem);
          background:
            radial-gradient(ellipse at center, rgba(23, 18, 33, .72) 0%, rgba(8, 6, 16, .95) 100%);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          overflow: hidden;
          font-family: var(--sans, system-ui, sans-serif);
          animation: menuOpen .28s var(--ease, cubic-bezier(.22,.61,.36,1));
        }
        .menu-overlay.closing { animation: menuClose .22s ease-in forwards; }
        @keyframes menuOpen { from { opacity: 0; } to { opacity: 1; } }
        @keyframes menuClose { from { opacity: 1; } to { opacity: 0; } }

        .sparks-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .spark {
          position: absolute; bottom: -10px; border-radius: 50%;
          background: var(--accent, #FF4D9D);
          box-shadow: 0 0 8px var(--accent-glow, rgba(255,77,157,.26));
          animation: spark-rise linear infinite;
        }
        @keyframes spark-rise { from { transform: translateY(0); } to { transform: translateY(-110vh); } }

        /* ── Container ──────────────────────────────────────────────────── */

        .menu-container {
          width: 100%; max-width: 1000px;
          max-height: 88vh; max-height: 88dvh;
          display: flex; flex-direction: column; overflow: hidden;
          background: linear-gradient(162deg, var(--bg-secondary, #171221), var(--bg-primary, #110D17));
          border-radius: var(--r-xl, 24px);
          border: 1px solid var(--border-strong, #3D3253);
          box-shadow: var(--shadow-lg, 0 30px 80px -24px rgba(0,0,0,.88));
          animation: containerSlide .34s var(--ease, cubic-bezier(.22,.61,.36,1));
        }
        @keyframes containerSlide {
          from { transform: translateY(14px) scale(.985); opacity: 0; }
          to { transform: none; opacity: 1; }
        }

        /* ── Header ─────────────────────────────────────────────────────── */

        .menu-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.35rem 1.6rem 1.15rem;
          border-bottom: 1px solid var(--border, #251E33);
        }
        .menu-title { display: flex; flex-direction: column; gap: .3rem; }
        .menu-eyebrow {
          display: inline-flex; align-items: center; gap: .45rem;
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 700;
          letter-spacing: .24em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
        }
        /* Two bars — the pause glyph, drawn rather than typed. */
        .menu-pausebars {
          width: 9px; height: 10px; flex: none;
          background: linear-gradient(90deg, currentColor 0 3px, transparent 3px 6px, currentColor 6px 9px);
        }
        .title-text {
          font-family: var(--display, system-ui, sans-serif);
          font-weight: 700;
          font-stretch: 112%;
          font-size: 1.65rem; letter-spacing: -.03em; line-height: 1.05;
          color: var(--text, #F4F0F8);
        }

        .close-btn {
          display: grid; place-items: center;
          width: 2.3rem; height: 2.3rem; padding: 0;
          background: transparent;
          border: 1px solid var(--border-strong, #3D3253);
          border-radius: 50%;
          color: var(--text-2, #A99FB8);
          cursor: pointer; transition: all .22s var(--ease, ease);
        }
        .close-btn svg { width: 15px; height: 15px; }
        .close-btn:hover {
          color: var(--accent, #FF4D9D);
          border-color: var(--accent, #FF4D9D);
          transform: rotate(90deg);
        }

        /* ── Body: tab rail + content ───────────────────────────────────── */

        .menu-body { display: grid; grid-template-columns: 190px minmax(0, 1fr); flex: 1; min-height: 0; }

        .menu-tabs {
          display: flex; flex-direction: column; gap: .15rem;
          padding: 1rem .7rem;
          border-right: 1px solid var(--border, #251E33);
          background: rgba(8,6,16,.35);
        }
        .tab-btn {
          display: flex; align-items: center; gap: .65rem;
          padding: .6rem .7rem;
          background: transparent; border: 0; border-radius: var(--r-sm, 6px);
          border-left: 2px solid transparent;
          color: var(--text-3, #6F6580);
          font-family: var(--mono, monospace); font-size: .68rem; font-weight: 600;
          letter-spacing: .14em; text-transform: uppercase;
          cursor: pointer; text-align: left;
          transition: color .18s var(--ease, ease), background .18s var(--ease, ease),
                      border-color .18s var(--ease, ease);
        }
        .tab-btn:hover { color: var(--text-2, #A99FB8); background: rgba(255,255,255,.02); }
        .tab-btn.active {
          color: var(--text, #F4F0F8);
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-left-color: var(--accent, #FF4D9D);
        }
        .tab-glyph { width: 17px; height: 17px; flex: none; }
        .tab-btn.active .tab-glyph { color: var(--accent, #FF4D9D); }

        .menu-content { overflow-y: auto; padding: 1.5rem 1.6rem; min-height: 0; }

        /* ── Content headers ────────────────────────────────────────────── */

        .content-header { margin-bottom: 1.35rem; }
        .content-eyebrow {
          margin: 0 0 .3rem;
          font-family: var(--mono, monospace); font-size: .6rem; font-weight: 600;
          letter-spacing: .24em; text-transform: uppercase; color: var(--text-4, #4B4359);
        }
        .content-header h3 {
          margin: 0 0 .7rem;
          font-family: var(--display, system-ui, sans-serif);
          font-weight: 700;
          font-stretch: 110%;
          font-size: 1.4rem; letter-spacing: -.03em; color: var(--text, #F4F0F8);
        }
        .wb-rule {
          height: 1px; border: 0; margin: 0;
          background: linear-gradient(90deg,
            var(--accent, #FF4D9D) 0, var(--accent, #FF4D9D) 42px,
            var(--border, #251E33) 42px, var(--border, #251E33) 100%);
        }

        /* ── Panels ─────────────────────────────────────────────────────── */

        .controls-grid, .settings-grid, .help-content {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1rem;
        }
        .panel {
          background: var(--bg-elevated, #1D1729);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-lg, 16px);
          padding: 1.15rem;
        }
        .panel + .panel { margin-top: 1rem; }
        /* A whole panel of unbuilt things gets a muted surface so it recedes
           behind the panels that actually do something. */
        .panel--blueprint { background: rgba(8,6,16,.4); border-style: dashed; }

        .panel h4 {
          display: flex; align-items: center; justify-content: space-between; gap: .5rem;
          margin: 0 0 .9rem;
          font-family: var(--mono, monospace); font-size: .66rem; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase; color: var(--text-2, #A99FB8);
        }
        .panel-count { color: var(--text-4, #4B4359); font-size: .66rem; letter-spacing: .1em; }

        /* ── Controls list ──────────────────────────────────────────────── */

        .control-list { display: flex; flex-direction: column; gap: .4rem; }
        .control-item {
          display: flex; align-items: center; gap: .9rem;
          padding: .6rem .75rem;
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-md, 10px);
        }
        /* Key caps are live inputs — they may wear the accent. */
        .control-key {
          flex: none; min-width: 96px; text-align: center;
          font-family: var(--mono, monospace); font-size: .66rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
          border: 1px solid var(--accent-line, rgba(255,77,157,.34));
          padding: .3rem .5rem; border-radius: 5px;
        }
        .control-desc { color: var(--text-2, #A99FB8); font-size: .86rem; line-height: 1.4; }

        .section-note {
          margin: .85rem 0 0; padding-left: .8rem;
          border-left: 2px solid var(--border-strong, #3D3253);
          color: var(--text-3, #6F6580); font-size: .78rem; line-height: 1.5;
        }
        .section-note--top { margin: 0 0 .9rem; }
        .section-note code {
          font-family: var(--mono, monospace); font-size: .74rem; color: var(--text-2, #A99FB8);
        }

        /* ── Camera status ──────────────────────────────────────────────── */

        .status-row {
          display: flex; align-items: center; gap: .6rem; margin-bottom: 1rem;
          padding: .6rem .75rem; border-radius: var(--r-md, 10px);
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          color: var(--text-3, #6F6580);
        }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: currentColor; }
        .status-row--live { color: var(--shipped, #4ADE80); border-color: var(--shipped-line, rgba(74,222,128,.3)); }
        .status-row--live .status-dot { box-shadow: 0 0 10px currentColor; }
        .status-row--keyboard { color: var(--planned, #FFB020); border-color: var(--planned-line, rgba(255,176,32,.32)); }
        .status-text { color: var(--text-2, #A99FB8); font-size: .85rem; }

        .hand-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .hand-label { color: var(--text, #F4F0F8); font-weight: 650; font-size: .88rem; }
        .hand-toggle { display: flex; gap: .3rem; }
        .hand-toggle button {
          padding: .42rem .95rem; border-radius: var(--r-sm, 6px);
          border: 1px solid var(--border-strong, #3D3253);
          background: var(--bg-sunken, #080610);
          color: var(--text-3, #6F6580);
          font-family: var(--mono, monospace); font-size: .68rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          cursor: pointer; transition: all .18s var(--ease, ease);
        }
        .hand-toggle button:hover:not(:disabled) { color: var(--text, #F4F0F8); }
        .hand-toggle button.is-active {
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-color: var(--accent, #FF4D9D);
          color: var(--accent, #FF4D9D);
        }
        .hand-toggle button:disabled { opacity: .4; cursor: not-allowed; }

        /* ── View perspective ───────────────────────────────────────────── */

        .camera-options { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1rem; }
        .camera-option {
          display: flex; align-items: flex-start; gap: .85rem; padding: .85rem;
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-md, 10px);
          transition: all .2s var(--ease, ease);
        }
        .camera-option[role="button"] { cursor: pointer; }
        .camera-option[role="button"]:hover { border-color: var(--border-bright, #52456E); }
        .camera-option.active {
          border-color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
        }
        .camera-info { flex: 1; min-width: 0; }
        .camera-name {
          display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;
          font-weight: 650; color: var(--text, #F4F0F8); font-size: .92rem; margin-bottom: .2rem;
        }
        .camera-option.is-planned .camera-name { color: var(--text-2, #A99FB8); }
        .camera-desc { color: var(--text-3, #6F6580); font-size: .8rem; line-height: 1.45; }
        .radio-button {
          width: 16px; height: 16px; flex: none; margin-top: .15rem;
          border: 2px solid var(--border-strong, #3D3253); border-radius: 50%;
          display: grid; place-items: center;
        }
        .radio-button.checked { border-color: var(--accent, #FF4D9D); }
        .radio-inner {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent, #FF4D9D);
          transform: scale(0); transition: transform .2s var(--ease, ease);
        }
        .radio-button.checked .radio-inner { transform: scale(1); }

        /* ── Tags ───────────────────────────────────────────────────────── */

        .planned-tag {
          font-family: var(--mono, monospace); font-size: .56rem; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase;
          color: var(--planned, #FFB020);
          background: var(--planned-dim, rgba(255,176,32,.1));
          border: 1px solid var(--planned-line, rgba(255,176,32,.32));
          padding: .1rem .4rem; border-radius: 3px;
        }
        .live-tag {
          font-family: var(--mono, monospace); font-size: .56rem; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase;
          color: var(--shipped, #4ADE80);
          background: var(--shipped-dim, rgba(74,222,128,.1));
          border: 1px solid var(--shipped-line, rgba(74,222,128,.3));
          padding: .1rem .4rem; border-radius: 3px;
        }

        /* ── Settings rows ──────────────────────────────────────────────── */

        .setting-item {
          display: flex; align-items: center; gap: 1rem; justify-content: space-between;
          padding: .7rem .85rem;
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-md, 10px);
        }
        .setting-item + .setting-item { margin-top: .45rem; }
        .setting-label { color: var(--text, #F4F0F8); font-weight: 650; font-size: .88rem; }

        /* The blueprint row: dashed amber over hatching, laid out as a stack so
           the reason sits directly under the dead control. The .wb-blueprint
           class in style.css supplies the border and hatch; this is only the
           layout. */
        .setting-item.is-planned {
          flex-direction: column; align-items: stretch; gap: .5rem;
        }
        .planned-head { display: flex; align-items: center; justify-content: space-between; gap: .6rem; }
        .planned-label { color: var(--text-2, #A99FB8); font-weight: 650; font-size: .86rem; }
        .planned-control { display: flex; flex-direction: column; gap: .35rem; }
        .planned-note { color: var(--text-3, #6F6580); font-size: .74rem; line-height: 1.4; }

        .setting-item select, .setting-item input[type="range"] { width: 100%; max-width: 240px; }
        .setting-item select {
          padding: .4rem .65rem; border-radius: var(--r-sm, 6px);
          border: 1px solid var(--border-strong, #3D3253);
          background: var(--bg-elevated, #1D1729); color: var(--text-3, #6F6580);
          font-family: var(--mono, monospace); font-size: .76rem;
        }
        .setting-item :disabled { cursor: not-allowed; opacity: .6; }
        /* A dead range slider must not wear the accent: the accent-color
           property would paint its track magenta, which in this product reads
           as "live". */
        .setting-item input[type="range"]:disabled { accent-color: var(--text-4, #4B4359); }

        /* ── Toggles ────────────────────────────────────────────────────── */

        .toggle { position: relative; display: inline-block; width: 44px; height: 23px; flex: none; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; inset: 0; cursor: pointer;
          background: var(--bg-elevated, #1D1729);
          border: 1px solid var(--border-strong, #3D3253);
          border-radius: 23px; transition: .25s var(--ease, ease);
        }
        .toggle-slider::before {
          content: ""; position: absolute;
          height: 15px; width: 15px; left: 3px; bottom: 3px;
          background: var(--text-3, #6F6580); border-radius: 50%;
          transition: .25s var(--ease, ease);
        }
        .toggle input:checked + .toggle-slider {
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-color: var(--accent, #FF4D9D);
        }
        .toggle input:checked + .toggle-slider::before {
          transform: translateX(21px); background: var(--accent, #FF4D9D);
        }
        /* A disabled control never wears the accent: in this product magenta
           means "live", so a planned toggle goes grey even when it is "on". */
        .toggle.is-disabled { opacity: .55; }
        .toggle.is-disabled .toggle-slider { cursor: not-allowed; }
        .toggle.is-disabled input:checked + .toggle-slider {
          background: var(--bg-elevated, #1D1729);
          border-color: var(--border-strong, #3D3253);
        }
        .toggle.is-disabled input:checked + .toggle-slider::before {
          background: var(--text-4, #4B4359);
        }

        /* ── Help ───────────────────────────────────────────────────────── */

        .help-list {
          margin: 0; padding-left: 1.1rem;
          color: var(--text-2, #A99FB8); font-size: .86rem; line-height: 1.6;
        }
        .help-list li { margin-bottom: .4rem; }
        .help-list li::marker { color: var(--text-4, #4B4359); }
        .help-list--planned li::marker { color: var(--planned, #FFB020); }
        .help-list kbd {
          font-family: var(--mono, monospace); font-size: .68rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
          border: 1px solid var(--accent-line, rgba(255,77,157,.34));
          padding: .08rem .32rem; border-radius: 4px;
        }

        /* ── Footer ─────────────────────────────────────────────────────── */

        .menu-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1rem 1.6rem;
          border-top: 1px solid var(--border, #251E33);
          background: rgba(8,6,16,.45);
        }
        .footer-left { display: flex; gap: .45rem; flex-wrap: wrap; }
        .footer-btn {
          padding: .55rem .95rem; border-radius: var(--r-md, 10px);
          background: transparent; border: 1px solid var(--border, #251E33);
          color: var(--text-2, #A99FB8);
          font-family: inherit; font-size: .84rem; font-weight: 600;
          cursor: pointer; transition: all .18s var(--ease, ease);
        }
        .footer-btn:hover { color: var(--text, #F4F0F8); border-color: var(--border-bright, #52456E); }

        .apply-btn {
          display: inline-flex; align-items: center; gap: .6rem;
          padding: .7rem 1.5rem; border-radius: var(--r-md, 10px);
          background: var(--accent, #FF4D9D); border: 1px solid var(--accent, #FF4D9D);
          color: var(--accent-ink, #16000A);
          font-family: inherit; font-size: .92rem; font-weight: 700; cursor: pointer;
          box-shadow: 0 10px 30px -12px var(--accent-glow, rgba(255,77,157,.26));
          transition: all .18s var(--ease, ease);
        }
        .apply-btn:hover { background: var(--accent-hover, #FF7FB8); transform: translateY(-1px); }
        .btn-key {
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .12rem .38rem; border-radius: 4px;
          background: rgba(22,0,10,.18); border: 1px solid rgba(22,0,10,.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .sparks-container { display: none; }
          .menu-overlay, .menu-container { animation: none; }
          .close-btn:hover { transform: none; }
        }

        @media (max-width: 820px) {
          .menu-container { max-height: 94vh; max-height: 94dvh; }
          .menu-header, .menu-content, .menu-footer { padding-left: 1.1rem; padding-right: 1.1rem; }
          /* The rail becomes a strip above the content on narrow screens. */
          .menu-body { grid-template-columns: 1fr; }
          .menu-tabs {
            flex-direction: row; overflow-x: auto;
            border-right: 0; border-bottom: 1px solid var(--border, #251E33);
            padding: .6rem 1.1rem;
          }
          .tab-btn { border-left: 0; border-bottom: 2px solid transparent; flex: none; }
          .tab-btn.active { border-left: 0; border-bottom-color: var(--accent, #FF4D9D); }
          .controls-grid, .settings-grid, .help-content { grid-template-columns: 1fr; }
          .menu-footer { flex-direction: column-reverse; align-items: stretch; }
          .apply-btn { justify-content: center; }
        }

        @media (max-width: 480px) {
          .tab-label { display: none; }
          .tab-btn { padding: .6rem .75rem; }
        }
      `}</style>
    </div>
  );
};

export default InGameMenu;
