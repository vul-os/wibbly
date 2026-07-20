import React, { useEffect, useMemo, useState } from 'react';

/**
 * In-game menu — pause, settings, camera, help, quit.
 *
 * Salvaged from the CAMERA contributor branch and kept structurally intact:
 * same tabbed shell, same header/content/footer rhythm, same animated
 * background. What changed is (a) the palette, which is now the product's
 * "Court Lights" identity instead of the branch's teal, and (b) honesty —
 * every control below is either wired to something real or rendered visibly
 * disabled with the reason. There are no decorative toggles.
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

const TABS = [
  { id: 'controls', label: 'Controls', icon: '🎮' },
  { id: 'camera', label: 'Camera', icon: '📷' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'help', label: 'Help', icon: '❓' },
];

const VIEW_MODES = [
  {
    id: 'follow',
    name: 'Follow cam',
    description: 'Wii-Sports-style chase camera that tracks behind your player and the ball.',
    icon: '🎯',
    built: true,
  },
  {
    id: 'orbital',
    name: 'Free camera',
    description: 'Orbit and zoom with the mouse. No orbital controller exists in the game yet.',
    icon: '🌐',
    built: false,
  },
  {
    id: 'fixed',
    name: 'Fixed',
    description: 'Static camera behind the baseline. Not implemented.',
    icon: '📐',
    built: false,
  },
];

/** A control that is drawn, disabled, and labelled with why. */
const PlannedRow = ({ label, note, children }) => (
  <div className="setting-item is-planned">
    <label>
      {label}
      <span className="planned-tag">planned</span>
    </label>
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

  useEffect(() => {
    if (!isOpen && isClosing) setIsClosing(false);
  }, [isOpen, isClosing]);

  // Re-read handedness whenever the menu opens: it can also be changed from
  // the setup flow, and this instance is shared with the game.
  useEffect(() => {
    if (isOpen && calibration) setHandedness(calibration.handednessFor(PLAYER_ID));
  }, [isOpen, calibration]);

  // Motion trail sparks — the one moving thing, in the accent that always
  // means movement in this product.
  const sparks = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * -20,
        opacity: Math.random() * 0.35 + 0.1,
      })),
    [],
  );

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose?.(), 220);
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
            <div className="content-header">
              <h3>Controls</h3>
              <div className="header-line" />
            </div>
            <div className="controls-grid">
              <div className="control-section">
                <h4>Tennis</h4>
                <div className="control-list">
                  <div className="control-item">
                    <div className="control-key">SPACE</div>
                    <div className="control-desc">Serve, and swing the racket</div>
                  </div>
                  <div className="control-item">
                    <div className="control-key">ARM SWING</div>
                    <div className="control-desc">Same as SPACE, detected from your camera</div>
                  </div>
                  <div className="control-item">
                    <div className="control-key">CLICK</div>
                    <div className="control-desc">Restart the match</div>
                  </div>
                </div>
              </div>

              <div className="control-section">
                <h4>System</h4>
                <div className="control-list">
                  <div className="control-item">
                    <div className="control-key">ESC</div>
                    <div className="control-desc">Open and close this menu (pauses the match)</div>
                  </div>
                  <div className="control-item">
                    <div className="control-key">H</div>
                    <div className="control-desc">Toggle collision hit boxes</div>
                  </div>
                </div>
                <p className="section-note">
                  The mouse does not move the camera: tennis ships one camera and it drives itself.
                </p>
              </div>
            </div>
          </div>
        );

      case 'camera':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h3>Camera</h3>
              <div className="header-line" />
            </div>

            <div className="setting-group">
              <h4>Your webcam</h4>
              <div className="status-row">
                <span className={`status-dot status-dot--${cameraStatus}`} />
                <span className="status-text">
                  {cameraStatus === 'live' && 'Gesture tracking is running in this tab.'}
                  {cameraStatus === 'keyboard' && 'No camera — playing on the spacebar.'}
                  {cameraStatus === 'unknown' && 'Camera state unknown until the pipeline reports in.'}
                </span>
              </div>

              <div className="hand-row">
                <label>Racket hand</label>
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
                Written to Calibration for {PLAYER_ID}; the swing recogniser picks it up on the next
                frame, mid-rally. No restart needed.
              </p>
            </div>

            <div className="setting-group">
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
                      className={`camera-option ${active ? 'active' : ''} ${mode.built ? '' : 'is-planned'}`}
                      role={selectable ? 'button' : undefined}
                      tabIndex={selectable ? 0 : undefined}
                      aria-disabled={!mode.built}
                      onClick={() => selectable && onCameraChange(mode.id)}
                    >
                      <div className="camera-icon">{mode.icon}</div>
                      <div className="camera-info">
                        <div className="camera-name">
                          {mode.name}
                          {!mode.built && <span className="planned-tag">planned</span>}
                        </div>
                        <div className="camera-desc">{mode.description}</div>
                      </div>
                      <div className={`radio-button ${active ? 'checked' : ''}`}>
                        <div className="radio-inner" />
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
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h3>Settings</h3>
              <div className="header-line" />
            </div>
            <div className="settings-grid">
              <div className="setting-group">
                <h4>Input</h4>
                <div className="setting-item toggle-item">
                  <label>Camera gesture input</label>
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
                  <label>Debug logging</label>
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
              </div>

              <div className="setting-group">
                <h4>Not wired up yet</h4>
                <p className="section-note">
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
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h3>How to play</h3>
              <div className="header-line" />
            </div>
            <div className="help-content">
              <div className="help-section">
                <h4>Getting started</h4>
                <ol>
                  <li>Stand where your head, shoulders and hips are all in frame.</li>
                  <li>Press <strong>SPACE</strong> to serve.</li>
                  <li>Swing your racket arm — or press <strong>SPACE</strong> — to return the ball.</li>
                  <li>Timing is the whole game: your player moves to the ball on its own.</li>
                </ol>
              </div>

              <div className="help-section">
                <h4>Camera setup</h4>
                <ul>
                  <li>Roughly two metres back, facing the camera.</li>
                  <li>Light on your face, not behind you — backlight destroys tracking confidence.</li>
                  <li>One person in frame. Tennis routes only the first tracked player to the racket.</li>
                </ul>
              </div>

              <div className="help-section">
                <h4>If tracking misbehaves</h4>
                <ul>
                  <li>Check the racket hand above — a mirrored setting turns forehands into backhands.</li>
                  <li>Swing from the shoulder. The detector watches wrist velocity, not wrist position.</li>
                  <li>If the camera fails outright, the spacebar plays the whole game.</li>
                </ul>
              </div>

              <div className="help-section">
                <h4>What this build is not</h4>
                <ul>
                  <li>One gesture only: a swing. No punch, pinch or point.</li>
                  <li>One player to the racket, even though the tracker binds two.</li>
                  <li>No network play, no lobbies, no scores kept between sessions.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`menu-overlay ${isClosing ? 'closing' : ''}`} role="dialog" aria-modal="true" aria-label="Game menu">
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

      <div className="menu-container">
        <div className="menu-header">
          <div className="menu-title">
            <span className="menu-eyebrow">Paused</span>
            <span className="title-text">Game menu</span>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Resume game">
            <span className="close-icon">✕</span>
          </button>
        </div>

        <div className="menu-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="menu-content">{renderTabContent()}</div>

        <div className="menu-footer">
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
            <span className="btn-key">ESC</span>
          </button>
        </div>
      </div>

      <style>{`
        .menu-overlay {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at center, rgba(19, 16, 23, .74) 0%, rgba(13, 10, 16, .93) 100%);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: menuOpen .28s var(--ease, cubic-bezier(.22,.61,.36,1));
          overflow: hidden;
          font-family: var(--sans, system-ui, sans-serif);
        }
        .menu-overlay.closing { animation: menuClose .22s ease-in forwards; }

        @keyframes menuOpen { from { opacity: 0; } to { opacity: 1; } }
        @keyframes menuClose { from { opacity: 1; } to { opacity: 0; } }

        .sparks-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .spark {
          position: absolute;
          bottom: -10px;
          border-radius: 50%;
          background: var(--accent, #FF4D9D);
          box-shadow: 0 0 8px var(--accent-glow, rgba(255,77,157,.26));
          animation: spark-rise linear infinite;
        }
        @keyframes spark-rise {
          from { transform: translateY(0); }
          to { transform: translateY(-110vh); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sparks-container { display: none; }
          .menu-overlay, .menu-container { animation: none; }
        }

        .menu-container {
          width: 95%;
          max-width: 940px;
          max-height: 88vh;
          background: linear-gradient(160deg, var(--bg-secondary, #191521), var(--bg-primary, #131017));
          border-radius: var(--r-xl, 26px);
          border: 1px solid var(--border-strong, #3E3451);
          box-shadow: var(--shadow-lg, 0 30px 80px -24px rgba(0,0,0,.85));
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: containerSlide .34s var(--ease, cubic-bezier(.22,.61,.36,1));
        }
        @keyframes containerSlide {
          from { transform: translateY(14px) scale(.985); opacity: 0; }
          to { transform: none; opacity: 1; }
        }

        .menu-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.5rem 1.75rem 1.25rem;
          border-bottom: 1px solid var(--border, #272031);
        }
        .menu-title { display: flex; flex-direction: column; gap: .15rem; }
        .menu-eyebrow {
          font-family: var(--mono, monospace); font-size: .66rem; letter-spacing: .22em;
          text-transform: uppercase; color: var(--accent, #FF4D9D);
        }
        .title-text {
          font-size: 1.6rem; font-weight: 700; letter-spacing: -.02em;
          color: var(--text, #F3EFF7); line-height: 1.1;
        }

        .close-btn {
          width: 2.5rem; height: 2.5rem;
          background: transparent;
          border: 1px solid var(--border-strong, #3E3451);
          border-radius: 50%;
          color: var(--text-2, #A79DB4);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: .95rem; transition: all .2s var(--ease, ease);
        }
        .close-btn:hover {
          color: var(--accent, #FF4D9D); border-color: var(--accent, #FF4D9D);
          transform: rotate(90deg);
        }

        .menu-tabs {
          display: flex; gap: .4rem; padding: .75rem 1.75rem 0;
          border-bottom: 1px solid var(--border, #272031);
        }
        .tab-btn {
          display: flex; align-items: center; gap: .5rem;
          padding: .7rem 1rem;
          background: transparent; border: 0;
          border-bottom: 2px solid transparent;
          color: var(--text-3, #6E6479);
          font-family: inherit; font-size: .88rem; font-weight: 600;
          cursor: pointer; transition: color .18s var(--ease, ease), border-color .18s var(--ease, ease);
        }
        .tab-btn:hover { color: var(--text-2, #A79DB4); }
        .tab-btn.active { color: var(--text, #F3EFF7); border-bottom-color: var(--accent, #FF4D9D); }
        .tab-icon { font-size: 1rem; }

        .menu-content { flex: 1; overflow-y: auto; padding: 1.75rem; }
        .content-header { margin-bottom: 1.5rem; }
        .content-header h3 {
          margin: 0 0 .6rem; color: var(--text, #F3EFF7);
          font-size: 1.35rem; font-weight: 700; letter-spacing: -.02em;
        }
        .header-line {
          height: 2px; width: 64px; border-radius: 2px;
          background: linear-gradient(90deg, var(--accent, #FF4D9D), transparent);
        }

        .controls-grid, .settings-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;
        }
        .control-section, .setting-group {
          background: var(--bg-elevated, #1E1928);
          border: 1px solid var(--border, #272031);
          border-radius: var(--r-lg, 18px);
          padding: 1.25rem;
        }
        .setting-group + .setting-group { margin-top: 1.25rem; }
        .control-section h4, .setting-group h4 {
          margin: 0 0 1rem; color: var(--text, #F3EFF7);
          font-size: .82rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
        }
        .control-list { display: flex; flex-direction: column; gap: .5rem; }
        .control-item {
          display: flex; align-items: center; gap: 1rem;
          padding: .65rem .85rem;
          background: var(--bg-primary, #131017);
          border: 1px solid var(--border, #272031);
          border-radius: var(--r-md, 12px);
        }
        .control-item.toggle-item { justify-content: space-between; }
        .control-key {
          font-family: var(--mono, monospace); font-weight: 600; font-size: .72rem;
          letter-spacing: .08em;
          color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
          border: 1px solid rgba(255,77,157,.28);
          padding: .3rem .6rem; border-radius: 6px;
          min-width: 92px; text-align: center;
        }
        .control-desc { color: var(--text-2, #A79DB4); font-size: .88rem; }
        .section-note {
          margin: .85rem 0 0; padding-left: .8rem;
          border-left: 2px solid var(--border-strong, #3E3451);
          color: var(--text-3, #6E6479); font-size: .8rem; line-height: 1.5;
        }

        .status-row { display: flex; align-items: center; gap: .6rem; margin-bottom: 1rem; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
        .status-dot--live { background: var(--shipped, #4ADE80); box-shadow: 0 0 10px rgba(74,222,128,.6); }
        .status-dot--keyboard { background: var(--planned, #FFB020); }
        .status-dot--unknown { background: var(--text-3, #6E6479); }
        .status-text { color: var(--text-2, #A79DB4); font-size: .88rem; }

        .hand-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .hand-row label { color: var(--text, #F3EFF7); font-weight: 600; font-size: .9rem; }
        .hand-toggle { display: flex; gap: .35rem; }
        .hand-toggle button {
          padding: .45rem 1rem; border-radius: var(--r-sm, 8px);
          border: 1px solid var(--border-strong, #3E3451);
          background: var(--bg-primary, #131017);
          color: var(--text-2, #A79DB4);
          font-family: inherit; font-size: .85rem; font-weight: 600; cursor: pointer;
          transition: all .18s var(--ease, ease);
        }
        .hand-toggle button:hover:not(:disabled) { color: var(--text, #F3EFF7); }
        .hand-toggle button.is-active {
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-color: var(--accent, #FF4D9D);
          color: var(--accent, #FF4D9D);
        }
        .hand-toggle button:disabled { opacity: .4; cursor: not-allowed; }

        .toggle { position: relative; display: inline-block; width: 46px; height: 24px; flex: none; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; inset: 0; cursor: pointer;
          background: var(--bg-primary, #131017);
          border: 1px solid var(--border-strong, #3E3451);
          border-radius: 24px; transition: .25s var(--ease, ease);
        }
        .toggle-slider::before {
          content: ""; position: absolute;
          height: 16px; width: 16px; left: 3px; bottom: 3px;
          background: var(--text-3, #6E6479); border-radius: 50%; transition: .25s var(--ease, ease);
        }
        .toggle input:checked + .toggle-slider {
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-color: var(--accent, #FF4D9D);
        }
        .toggle input:checked + .toggle-slider::before {
          transform: translateX(22px); background: var(--accent, #FF4D9D);
        }
        /* A disabled control never wears the accent: in this product magenta
           means "live", so a planned toggle goes grey even when it is "on". */
        .toggle.is-disabled { opacity: .5; }
        .toggle.is-disabled .toggle-slider { cursor: not-allowed; }
        .toggle.is-disabled input:checked + .toggle-slider {
          background: var(--bg-primary, #131017);
          border-color: var(--border-strong, #3E3451);
        }
        .toggle.is-disabled input:checked + .toggle-slider::before {
          background: var(--text-3, #6E6479);
        }

        .camera-options { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1.25rem; }
        .camera-option {
          display: flex; align-items: center; gap: 1rem; padding: 1rem;
          background: var(--bg-primary, #131017);
          border: 1px solid var(--border, #272031);
          border-radius: var(--r-md, 12px);
          transition: all .2s var(--ease, ease);
        }
        .camera-option[role="button"] { cursor: pointer; }
        .camera-option[role="button"]:hover { border-color: var(--border-strong, #3E3451); }
        .camera-option.active { border-color: var(--accent, #FF4D9D); background: var(--accent-dim, rgba(255,77,157,.13)); }
        .camera-option.is-planned { opacity: .55; }
        .camera-icon { font-size: 1.5rem; width: 2.2rem; text-align: center; }
        .camera-info { flex: 1; }
        .camera-name {
          display: flex; align-items: center; gap: .5rem;
          font-weight: 600; color: var(--text, #F3EFF7); font-size: .98rem; margin-bottom: .2rem;
        }
        .camera-desc { color: var(--text-3, #6E6479); font-size: .82rem; line-height: 1.45; }
        .radio-button {
          width: 18px; height: 18px; flex: none;
          border: 2px solid var(--border-strong, #3E3451); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .radio-button.checked { border-color: var(--accent, #FF4D9D); }
        .radio-inner {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent, #FF4D9D); transform: scale(0); transition: transform .2s var(--ease, ease);
        }
        .radio-button.checked .radio-inner { transform: scale(1); }

        .planned-tag {
          font-family: var(--mono, monospace); font-size: .6rem; font-weight: 600;
          letter-spacing: .14em; text-transform: uppercase;
          color: var(--planned, #FFB020);
          background: var(--planned-dim, rgba(255,176,32,.13));
          border: 1px solid rgba(255,176,32,.3);
          padding: .1rem .4rem; border-radius: 999px;
        }
        .planned-note { color: var(--text-3, #6E6479); font-size: .76rem; }
        .planned-control { display: flex; flex-direction: column; gap: .35rem; flex: 1; }

        .setting-item {
          display: flex; align-items: center; gap: 1rem; justify-content: space-between;
          padding: .75rem .9rem;
          background: var(--bg-primary, #131017);
          border: 1px solid var(--border, #272031);
          border-radius: var(--r-md, 12px);
        }
        .setting-item + .setting-item { margin-top: .5rem; }
        .setting-item.is-planned { align-items: flex-start; }
        .setting-item label {
          display: flex; align-items: center; gap: .5rem;
          color: var(--text, #F3EFF7); font-weight: 600; font-size: .9rem;
        }
        .setting-item.is-planned > label { color: var(--text-2, #A79DB4); }
        .setting-item select, .setting-item input[type="range"] { width: 100%; max-width: 220px; }
        .setting-item select {
          padding: .45rem .7rem; border-radius: var(--r-sm, 8px);
          border: 1px solid var(--border-strong, #3E3451);
          background: var(--bg-elevated, #1E1928); color: var(--text-2, #A79DB4);
          font-family: inherit; font-size: .85rem;
        }
        .setting-item :disabled { cursor: not-allowed; opacity: .55; }
        .setting-item input[type="range"] { accent-color: var(--accent, #FF4D9D); }

        .help-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; }
        .help-section {
          background: var(--bg-elevated, #1E1928);
          border: 1px solid var(--border, #272031);
          border-radius: var(--r-lg, 18px);
          padding: 1.25rem;
        }
        .help-section h4 {
          margin: 0 0 .85rem; color: var(--text, #F3EFF7);
          font-size: .82rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
        }
        .help-section ol, .help-section ul {
          margin: 0; padding-left: 1.15rem;
          color: var(--text-2, #A79DB4); font-size: .88rem; line-height: 1.65;
        }
        .help-section li { margin-bottom: .4rem; }
        .help-section strong {
          font-family: var(--mono, monospace); font-size: .78rem;
          color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
          padding: .1rem .35rem; border-radius: 4px;
        }

        .menu-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1.1rem 1.75rem;
          border-top: 1px solid var(--border, #272031);
          background: var(--bg-primary, #131017);
        }
        .footer-left { display: flex; gap: .5rem; flex-wrap: wrap; }
        .footer-btn {
          padding: .6rem 1rem; border-radius: var(--r-md, 12px);
          background: transparent; border: 1px solid var(--border, #272031);
          color: var(--text-2, #A79DB4);
          font-family: inherit; font-size: .85rem; font-weight: 600; cursor: pointer;
          transition: all .18s var(--ease, ease);
        }
        .footer-btn:hover { color: var(--text, #F3EFF7); border-color: var(--border-strong, #3E3451); }

        .apply-btn {
          display: inline-flex; align-items: center; gap: .6rem;
          padding: .75rem 1.6rem; border-radius: var(--r-md, 12px);
          background: var(--accent, #FF4D9D); border: 1px solid var(--accent, #FF4D9D);
          color: var(--accent-ink, #16000A);
          font-family: inherit; font-size: .95rem; font-weight: 700; cursor: pointer;
          box-shadow: 0 10px 30px -12px var(--accent-glow, rgba(255,77,157,.26));
          transition: all .18s var(--ease, ease);
        }
        .apply-btn:hover { background: var(--accent-hover, #FF7FB8); transform: translateY(-1px); }
        .btn-key {
          font-family: var(--mono, monospace); font-size: .66rem; letter-spacing: .08em;
          padding: .12rem .4rem; border-radius: 4px;
          background: rgba(22,0,10,.18); border: 1px solid rgba(22,0,10,.3);
        }

        @media (max-width: 768px) {
          .menu-container { width: 97%; max-height: 94vh; }
          .menu-header, .menu-content, .menu-footer { padding-left: 1.1rem; padding-right: 1.1rem; }
          .menu-tabs { padding-left: 1.1rem; padding-right: 1.1rem; overflow-x: auto; }
          .tab-label { display: none; }
          .controls-grid, .settings-grid, .help-content { grid-template-columns: 1fr; }
          .menu-footer { flex-direction: column-reverse; align-items: stretch; }
          .apply-btn { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default InGameMenu;
