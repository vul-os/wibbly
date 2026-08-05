import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Calibration } from '@vulos/wibbly-input';
import TennisGame from '../../games/tennis';
import InGameMenu from '../components/InGameMenu';
import { loadSettings, saveSettings, setupState, type GameSettings } from '../components/game-settings';
import type { AuthorityTelemetry } from '../../games/tennis/magnetite-authority';

type CameraStatus = 'unknown' | 'live' | 'keyboard';

/**
 * Play surface — the tennis game plus its chrome.
 *
 * This page owns everything the game itself should not: pause state, the
 * settings store, the shared Calibration instance, and the route back to the
 * title. The game component stays a game.
 *
 * A player who has never seen the setup flow is sent through it first. That is
 * the whole point of the flow: the browser's camera prompt should never be the
 * first thing that happens to someone.
 */
export default function Play() {
  const navigate = useNavigate();
  const [setup] = useState(() => setupState());

  // Lazy state init, not a ref: the instance is created once for the
  // component's life, but it's also read during render (passed straight
  // down to TennisGame/InGameMenu below), which react-hooks/refs disallows
  // for a ref's `.current`.
  const [calibration] = useState(() => new Calibration());

  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [menuOpen, setMenuOpen] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('unknown');
  // Live telemetry from the magnetite authority running in the tab. Null until
  // the wasm module has loaded and taken its first authoritative tick.
  const [authority, setAuthority] = useState<AuthorityTelemetry | null>(null);
  // Remounting the game is how a settings change takes effect: the input
  // pipeline is built once, at mount, so a new pipeline means a new match.
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const changeSetting = useCallback((key: keyof GameSettings, value: boolean) => {
    setSettings((prev) => {
      if (prev[key] === value) return prev;
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
    // Both live settings are read at mount, so both need a fresh game.
    setGameKey((k) => k + 1);
    setCameraStatus('unknown');
  }, []);

  const restart = useCallback(() => {
    setGameKey((k) => k + 1);
    setCameraStatus('unknown');
    setMenuOpen(false);
  }, []);

  if (!setup.seen) return <Navigate to="/setup" replace />;

  return (
    <div className="wb-play">
      <TennisGame
        key={gameKey}
        paused={menuOpen}
        settings={settings}
        calibration={calibration}
        onInputState={setCameraStatus}
        onAuthority={setAuthority}
      />

      {/* The score bug. Broadcast furniture: a brand block, a live input
          readout, and the menu affordance — one unit, top-left, always on. */}
      <div className="wb-hud">
        <button
          type="button"
          className="wb-hud__brand"
          onClick={() => navigate('/')}
          title="Quit to title"
        >
          wibbly
        </button>

        <span className="wb-hud__divider" aria-hidden="true" />

        <span className={`wb-hud__status wb-hud__status--${cameraStatus}`}>
          <span className="wb-hud__dot" />
          {cameraStatus === 'live' && 'camera tracking'}
          {cameraStatus === 'keyboard' && 'spacebar only'}
          {cameraStatus === 'unknown' && 'starting…'}
        </span>

        {authority?.ready && (
          <span
            className="wb-hud__mag"
            title={
              'A real magnetite AuthoritativeGame (compiled to wasm) is running in this ' +
              'tab as a SingleRoom authority — the bottom rung of magnetite’s topology ladder. ' +
              'It is the authoritative simulation; it does not verify gesture input.'
            }
          >
            <span className="wb-hud__dot" />
            magnetite · tick {authority.tick}
          </span>
        )}

        <button type="button" className="wb-hud__menu" onClick={() => setMenuOpen(true)}>
          Menu <span className="wb-hud__key">Esc</span>
        </button>
      </div>

      <InGameMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentCamera="follow"
        /* onCameraChange is deliberately not passed: tennis implements exactly
           one camera, so the other perspectives render disabled rather than
           looking selectable. */
        gameSettings={settings}
        onSettingsChange={changeSetting}
        calibration={calibration}
        cameraStatus={cameraStatus}
        onRestart={restart}
        onQuit={() => navigate('/')}
      />

      <style>{`
        .wb-play {
          position: relative; width: 100%; overflow: hidden;
          /* Safari reports 100vh as the viewport WITHOUT its toolbars, so a
             100vh play surface is taller than the visible area and the page
             scrolls under the chrome. dvh is the correct unit; the vh line
             remains as the fallback for older engines. */
          height: 100vh;
          height: 100dvh;
        }

        /* ── Score bug ────────────────────────────────────────────────────
           One unit rather than three floating chips: brand, a hairline rule,
           the live input readout, then the menu. Reads as broadcast furniture
           laid over the court. */
        .wb-hud {
          position: fixed; top: 16px; left: 16px; z-index: 1000;
          display: flex; align-items: center; gap: .7rem;
          padding: .38rem .42rem .38rem .85rem;
          border-radius: 12px;
          background: rgba(8, 6, 16, .78);
          border: 1px solid var(--border-strong, #3D3253);
          /* Safari requires the -webkit- prefix for backdrop-filter; without it
             the panel is simply flat, which is a graceful degradation. */
          -webkit-backdrop-filter: blur(14px) saturate(1.2);
          backdrop-filter: blur(14px) saturate(1.2);
          font-family: var(--sans, system-ui, sans-serif);
          box-shadow: 0 18px 44px -20px rgba(0,0,0,.9);
        }

        .wb-hud__brand {
          background: none; border: 0; padding: 0;
          color: var(--text, #F4F0F8);
          font-family: var(--display, system-ui, sans-serif);
          font-weight: 800;
          font-stretch: 106%;
          font-size: 1.02rem; letter-spacing: -.035em;
          text-transform: lowercase; cursor: pointer;
          transition: color .18s ease;
        }
        .wb-hud__brand:hover { color: var(--accent, #FF4D9D); }

        .wb-hud__divider {
          width: 1px; height: 18px; flex: none;
          background: var(--border-strong, #3D3253);
        }

        .wb-hud__status {
          display: inline-flex; align-items: center; gap: .4rem;
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 600;
          letter-spacing: .16em; text-transform: uppercase;
          color: var(--text-3, #6F6580);
        }
        .wb-hud__dot {
          width: 6px; height: 6px; border-radius: 50%; flex: none;
          background: currentColor;
        }
        .wb-hud__status--live { color: var(--shipped, #4ADE80); }
        .wb-hud__status--live .wb-hud__dot {
          box-shadow: 0 0 8px currentColor;
          animation: wb-hudpulse 2.2s ease-in-out infinite;
        }
        .wb-hud__status--keyboard { color: var(--planned, #FFB020); }
        @keyframes wb-hudpulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }

        /* Live magnetite authority readout. Present only in the full app: the
           demo embed cannot compile wasm under its CSP, so the authority never
           runs there and this chip never appears. */
        .wb-hud__mag {
          display: inline-flex; align-items: center; gap: .4rem;
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
          cursor: help;
        }
        .wb-hud__mag .wb-hud__dot {
          box-shadow: 0 0 8px currentColor;
          animation: wb-hudpulse 2.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .wb-hud__mag .wb-hud__dot { animation: none; }
        }
        @media (max-width: 600px) {
          .wb-hud__mag { display: none; }
        }

        .wb-hud__menu {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .42rem .8rem; border-radius: 8px;
          background: var(--accent, #FF4D9D); border: 0;
          color: var(--accent-ink, #16000A);
          font-family: inherit; font-size: .8rem; font-weight: 700;
          cursor: pointer; transition: background .18s ease;
        }
        .wb-hud__menu:hover { background: var(--accent-hover, #FF7FB8); }
        .wb-hud__key {
          font-family: var(--mono, monospace); font-size: .58rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .12rem .32rem; border-radius: 4px; background: rgba(22,0,10,.2);
        }

        @media (prefers-reduced-motion: reduce) {
          .wb-hud__status--live .wb-hud__dot { animation: none; }
        }

        @media (max-width: 600px) {
          .wb-hud { top: 10px; left: 10px; gap: .5rem; }
          .wb-hud__status, .wb-hud__divider { display: none; }
        }
      `}</style>
    </div>
  );
}
