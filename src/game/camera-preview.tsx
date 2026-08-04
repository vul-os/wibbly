import React, { useEffect, useRef, useState } from 'react';
import {
    drawSkeletons,
    type Calibration,
    type Handedness,
    type PipelineStats,
    type PlayerId,
    type SwingRecognizer,
    type WibblyInput,
} from '@vulos/wibbly-input';

/**
 * Camera preview — owned by React, not by the input library.
 *
 * The old PoseDetector appended its own preview <div>, its own <canvas> and a
 * "Hide Camera" <button> straight onto document.body with inline styles, which
 * is exactly why it could not be imported as a library. The library now hands
 * us a detached <video> and a pure `drawSkeletons(ctx, people)` helper; where
 * and whether any of it appears on screen is entirely this component's call.
 *
 * ── Why this is big now ───────────────────────────────────────────────────
 * A live skeleton drawn over your own body, in magenta, moving as you move, is
 * the single most distinctive image this product has. It was a 320×240 box in
 * the corner with two grey buttons above it. It is now the broadcast inset: a
 * framed camera feed with registration brackets, a CAM label, and a telemetry
 * strip carrying the pipeline's real numbers.
 *
 * It collapses to a slim tab rather than disappearing, so the player can always
 * see that the camera is on and get it back in one click — a preview that
 * vanishes completely is how people end up unsure whether they are being
 * filmed.
 *
 * Everything displayed here is measured, not decorative: `stats` comes straight
 * off the pipeline's adaptive pacer. There are no invented numbers.
 */
export interface CameraPreviewProps {
    input: WibblyInput;
    calibration?: Calibration | null;
    players?: PlayerId[];
}

export default function CameraPreview({ input, calibration, players = [] }: CameraPreviewProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [visible, setVisible] = useState(true);
    const [stats, setStats] = useState<PipelineStats | null>(null);
    const [handedness, setHandedness] = useState<Handedness>(() =>
        calibration ? calibration.handednessFor('player_1') : 'right',
    );

    // Attach the library's detached <video> into our own container.
    useEffect(() => {
        const video = input?.videoElement;
        const mount = mountRef.current;
        if (!video || !mount) return;

        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.display = 'block';
        video.style.transform = 'scaleX(-1)'; // mirror for the player's benefit only
        mount.appendChild(video);

        return () => {
            if (video.parentElement === mount) mount.removeChild(video);
        };
    }, [input]);

    // Draw skeletons onto our canvas from the pipeline's per-frame callback.
    useEffect(() => {
        if (!input) return;
        const off = input.onPeople((people) => {
            const canvas = canvasRef.current;
            const video = input.videoElement;
            if (!canvas || !video) return;

            const w = video.videoWidth || 480;
            const h = video.videoHeight || 360;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            drawSkeletons(ctx, people, {
                showLabels: people.length > 1,
                highlightArm: (playerId) =>
                    calibration ? calibration.handednessFor(playerId) : 'right',
                trailFor: (playerId) =>
                    (input.recognizers[0] as SwingRecognizer | undefined)?.historyFor?.(playerId) ?? [],
            });
        });
        return off;
    }, [input, calibration]);

    // Cheap pacing readout — proves the adaptive pacer is doing something.
    useEffect(() => {
        if (!input) return;
        const id = setInterval(() => setStats(input.stats), 1000);
        return () => clearInterval(id);
    }, [input]);

    const toggleHandedness = () => {
        const next = handedness === 'right' ? 'left' : 'right';
        setHandedness(next);
        // Applies to every currently bound player, and to player_1 by default
        // so the setting survives before anyone has been detected.
        const ids = players.length > 0 ? players : ['player_1'];
        for (const id of ids) calibration?.setHandedness(id, next);
    };

    const tracking = (stats?.peopleLastFrame ?? 0) > 0;

    return (
        <div className={`wbcam ${visible ? '' : 'is-collapsed'}`}>
            {visible ? (
                <div className={`wbcam__unit wb-bracket ${tracking ? 'is-live' : ''}`}>
                    {/* Label bar — the broadcast slug. */}
                    <div className="wbcam__bar">
                        <span className="wbcam__id">
                            <span className={`wbcam__rec ${tracking ? 'is-tracking' : ''}`} />
                            CAM 01
                        </span>
                        <button
                            type="button"
                            className="wbcam__collapse"
                            onClick={() => setVisible(false)}
                            aria-label="Collapse camera preview"
                            title="Collapse camera preview"
                        >
                            <svg viewBox="0 0 12 12" aria-hidden="true">
                                <path d="M2 6 h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="wbcam__frame">
                        <div ref={mountRef} className="wbcam__video" />
                        <canvas ref={canvasRef} className="wbcam__overlay" />
                        {!tracking && (
                            <div className="wbcam__searching">
                                <span className="wbcam__searchdot" />
                                searching
                            </div>
                        )}
                    </div>

                    {/* Telemetry strip. Real pipeline numbers, tabular, mono. */}
                    <div className="wbcam__tele">
                        <span className="wbcam__stat">
                            <b>{stats?.peopleLastFrame ?? 0}</b>
                            <i>tracked</i>
                        </span>
                        <span className="wbcam__stat">
                            <b>{stats ? Math.round(stats.targetFps) : '—'}</b>
                            <i>fps</i>
                        </span>
                        <span className="wbcam__stat">
                            <b>{stats?.inferenceMs != null ? Math.round(stats.inferenceMs) : '—'}</b>
                            <i>ms</i>
                        </span>
                        <button
                            type="button"
                            className="wbcam__hand"
                            onClick={toggleHandedness}
                            title="Switch racket hand"
                        >
                            {handedness === 'right' ? 'R' : 'L'}
                            <i>hand</i>
                        </button>
                    </div>
                </div>
            ) : (
                /* Collapsed: a slim tab that still says the camera is running.
                   Never a total disappearance — see the note at the top. */
                <button
                    type="button"
                    className="wbcam__tab"
                    onClick={() => setVisible(true)}
                    aria-label="Show camera preview"
                >
                    <span className={`wbcam__rec ${tracking ? 'is-tracking' : ''}`} />
                    CAM 01
                </button>
            )}

            <style>{`
                .wbcam {
                    position: fixed;
                    left: 16px;
                    bottom: 16px;
                    z-index: 100;
                    font-family: var(--sans, system-ui, sans-serif);
                }

                .wbcam__unit {
                    width: clamp(260px, 26vw, 400px);
                    border-radius: var(--r-lg, 16px);
                    overflow: hidden;
                    background: var(--bg-sunken, #080610);
                    border: 1px solid var(--border-strong, #3D3253);
                    box-shadow: 0 26px 60px -26px rgba(0,0,0,.95), 0 4px 16px rgba(0,0,0,.5);
                }

                /* ── Label bar ─────────────────────────────────────────── */
                .wbcam__bar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: .42rem .5rem .42rem .62rem;
                    background: var(--bg-primary, #110D17);
                    border-bottom: 1px solid var(--border, #251E33);
                }
                .wbcam__id {
                    display: inline-flex; align-items: center; gap: .42rem;
                    font-family: var(--mono, monospace);
                    font-size: .6rem; font-weight: 700;
                    letter-spacing: .18em; text-transform: uppercase;
                    color: var(--text-2, #A99FB8);
                }
                .wbcam__rec {
                    width: 6px; height: 6px; border-radius: 50%; flex: none;
                    background: var(--text-4, #4B4359);
                }
                .wbcam__rec.is-tracking {
                    background: var(--accent, #FF4D9D);
                    box-shadow: 0 0 8px var(--accent, #FF4D9D);
                    animation: wbcam-pulse 2s ease-in-out infinite;
                }
                @keyframes wbcam-pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }

                .wbcam__collapse {
                    display: grid; place-items: center;
                    width: 20px; height: 20px; padding: 0;
                    background: transparent; border: 1px solid var(--border, #251E33);
                    border-radius: 4px; color: var(--text-3, #6F6580);
                    cursor: pointer; transition: all .18s ease;
                }
                .wbcam__collapse svg { width: 11px; height: 11px; }
                .wbcam__collapse:hover {
                    color: var(--text, #F4F0F8);
                    border-color: var(--border-bright, #52456E);
                }

                /* ── The picture ───────────────────────────────────────── */
                .wbcam__frame {
                    position: relative;
                    aspect-ratio: 4 / 3;
                    width: 100%;
                    background: #000;
                    overflow: hidden;
                }
                .wbcam__video,
                .wbcam__overlay {
                    position: absolute; inset: 0; width: 100%; height: 100%;
                }
                .wbcam__overlay { transform: scaleX(-1); pointer-events: none; }

                .wbcam__searching {
                    position: absolute; left: 50%; top: 50%;
                    transform: translate(-50%, -50%);
                    display: inline-flex; align-items: center; gap: .4rem;
                    padding: .3rem .6rem; border-radius: 999px;
                    background: rgba(8,6,16,.72);
                    border: 1px solid var(--border, #251E33);
                    font-family: var(--mono, monospace);
                    font-size: .58rem; font-weight: 600;
                    letter-spacing: .18em; text-transform: uppercase;
                    color: var(--text-3, #6F6580);
                }
                .wbcam__searchdot {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: var(--planned, #FFB020);
                    animation: wbcam-pulse 1.5s ease-in-out infinite;
                }

                /* ── Telemetry strip ───────────────────────────────────── */
                .wbcam__tele {
                    display: flex; align-items: stretch;
                    background: var(--bg-primary, #110D17);
                    border-top: 1px solid var(--border, #251E33);
                }
                .wbcam__stat {
                    flex: 1;
                    display: flex; flex-direction: column; align-items: center;
                    gap: .05rem; padding: .4rem .3rem;
                    border-right: 1px solid var(--border, #251E33);
                }
                .wbcam__stat b {
                    font-family: var(--mono, monospace);
                    font-size: .85rem; font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    color: var(--text, #F4F0F8); line-height: 1;
                }
                .wbcam__stat i,
                .wbcam__hand i {
                    font-family: var(--mono, monospace); font-style: normal;
                    font-size: .53rem; font-weight: 600;
                    letter-spacing: .16em; text-transform: uppercase;
                    color: var(--text-4, #4B4359);
                }

                /* The one control in the strip. It IS wired — it writes straight
                   through to Calibration — so it is allowed the accent. */
                .wbcam__hand {
                    flex: 1;
                    display: flex; flex-direction: column; align-items: center;
                    gap: .05rem; padding: .4rem .3rem;
                    background: transparent; border: 0; cursor: pointer;
                    font-family: var(--mono, monospace);
                    font-size: .85rem; font-weight: 700;
                    color: var(--accent, #FF4D9D); line-height: 1;
                    transition: background .18s ease;
                }
                .wbcam__hand:hover { background: var(--accent-dim, rgba(255,77,157,.13)); }

                /* ── Collapsed tab ─────────────────────────────────────── */
                .wbcam__tab {
                    display: inline-flex; align-items: center; gap: .45rem;
                    padding: .45rem .8rem; border-radius: 999px;
                    background: rgba(8,6,16,.86);
                    border: 1px solid var(--border-strong, #3D3253);
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    color: var(--text-2, #A99FB8);
                    font-family: var(--mono, monospace);
                    font-size: .6rem; font-weight: 700;
                    letter-spacing: .18em; text-transform: uppercase;
                    cursor: pointer; transition: all .18s ease;
                }
                .wbcam__tab:hover {
                    color: var(--text, #F4F0F8);
                    border-color: var(--border-bright, #52456E);
                }

                @media (prefers-reduced-motion: reduce) {
                    .wbcam__rec.is-tracking,
                    .wbcam__searchdot { animation: none; }
                }

                @media (max-width: 768px) {
                    .wbcam { left: 10px; bottom: 10px; }
                    .wbcam__unit { width: min(220px, 46vw); }
                    .wbcam__tele .wbcam__stat:nth-child(3) { display: none; }
                }
            `}</style>
        </div>
    );
}
