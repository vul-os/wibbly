import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Calibration } from '@vulos/wibbly-input';
import TennisGame from '../game';
import InGameMenu from '../components/InGameMenu.jsx';
import { loadSettings, saveSettings, setupState } from '../components/game-settings.js';

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

  const calibrationRef = useRef(null);
  if (!calibrationRef.current) calibrationRef.current = new Calibration();

  const [settings, setSettings] = useState(() => loadSettings());
  const [menuOpen, setMenuOpen] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('unknown');
  // Remounting the game is how a settings change takes effect: the input
  // pipeline is built once, at mount, so a new pipeline means a new match.
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const changeSetting = useCallback((key, value) => {
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
        calibration={calibrationRef.current}
        onInputState={setCameraStatus}
      />

      <div className="wb-hud">
        <button type="button" className="wb-hud__brand" onClick={() => navigate('/')} title="Quit to title">
          wibbly
        </button>
        <span className={`wb-hud__status wb-hud__status--${cameraStatus}`}>
          {cameraStatus === 'live' && 'camera tracking'}
          {cameraStatus === 'keyboard' && 'spacebar only'}
          {cameraStatus === 'unknown' && 'starting…'}
        </span>
        <button type="button" className="wb-hud__menu" onClick={() => setMenuOpen(true)}>
          Menu <span className="wb-hud__key">ESC</span>
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
        calibration={calibrationRef.current}
        cameraStatus={cameraStatus}
        onRestart={restart}
        onQuit={() => navigate('/')}
      />

      <style>{`
        .wb-play { position: relative; width: 100%; height: 100vh; overflow: hidden; }

        .wb-hud {
          position: fixed; top: 16px; left: 16px; z-index: 1000;
          display: flex; align-items: center; gap: .6rem;
          padding: .4rem .5rem .4rem .75rem;
          border-radius: 999px;
          background: rgba(13, 10, 16, .72);
          border: 1px solid var(--border-strong, #3E3451);
          backdrop-filter: blur(12px);
          font-family: var(--sans, system-ui, sans-serif);
          box-shadow: var(--shadow-sm, 0 4px 14px rgba(0,0,0,.4));
        }
        .wb-hud__brand {
          background: none; border: 0; padding: 0;
          color: var(--text, #F3EFF7);
          font-family: inherit; font-size: 1rem; font-weight: 700;
          letter-spacing: -.02em; cursor: pointer;
        }
        .wb-hud__brand:hover { color: var(--accent, #FF4D9D); }

        .wb-hud__status {
          font-family: var(--mono, monospace); font-size: .66rem;
          letter-spacing: .12em; text-transform: uppercase;
          padding: .2rem .55rem; border-radius: 999px;
          border: 1px solid var(--border, #272031); color: var(--text-3, #6E6479);
        }
        .wb-hud__status--live { color: var(--shipped, #4ADE80); border-color: rgba(74,222,128,.3); }
        .wb-hud__status--keyboard { color: var(--planned, #FFB020); border-color: rgba(255,176,32,.3); }

        .wb-hud__menu {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .4rem .8rem; border-radius: 999px;
          background: var(--accent, #FF4D9D); border: 0;
          color: var(--accent-ink, #16000A);
          font-family: inherit; font-size: .82rem; font-weight: 700; cursor: pointer;
          transition: background .18s ease;
        }
        .wb-hud__menu:hover { background: var(--accent-hover, #FF7FB8); }
        .wb-hud__key {
          font-family: var(--mono, monospace); font-size: .6rem; letter-spacing: .08em;
          padding: .1rem .3rem; border-radius: 4px; background: rgba(22,0,10,.2);
        }

        @media (max-width: 600px) {
          .wb-hud { top: 10px; left: 10px; }
          .wb-hud__status { display: none; }
        }
      `}</style>
    </div>
  );
}
