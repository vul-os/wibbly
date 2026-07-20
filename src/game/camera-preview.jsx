import React, { useEffect, useRef, useState } from 'react';
import { drawSkeletons } from '@vulos/wibbly-input';

/**
 * Camera preview — owned by React, not by the input library.
 *
 * The old PoseDetector appended its own preview <div>, its own <canvas> and a
 * "Hide Camera" <button> straight onto document.body with inline styles, which
 * is exactly why it could not be imported as a library. The library now hands
 * us a detached <video> and a pure `drawSkeletons(ctx, people)` helper; where
 * and whether any of it appears on screen is entirely this component's call.
 */
export default function CameraPreview({ input, calibration, players = [] }) {
    const mountRef = useRef(null);
    const canvasRef = useRef(null);
    const [visible, setVisible] = useState(true);
    const [stats, setStats] = useState(null);
    const [handedness, setHandedness] = useState(() =>
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
                trailFor: (playerId) => input.recognizers[0]?.historyFor?.(playerId) ?? [],
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

    return (
        <div className="wibbly-preview">
            <div className="wibbly-preview__controls">
                <button type="button" onClick={() => setVisible((v) => !v)}>
                    {visible ? 'Hide camera' : 'Show camera'}
                </button>
                <button type="button" onClick={toggleHandedness}>
                    {handedness === 'right' ? 'Right-handed' : 'Left-handed'}
                </button>
            </div>

            <div
                className="wibbly-preview__stage"
                style={{ display: visible ? 'block' : 'none' }}
            >
                <div ref={mountRef} className="wibbly-preview__video" />
                <canvas ref={canvasRef} className="wibbly-preview__overlay" />
                {stats && (
                    <div className="wibbly-preview__stats">
                        {stats.peopleLastFrame} tracked · {Math.round(stats.targetFps)} fps
                        {stats.inferenceMs != null && ` · ${Math.round(stats.inferenceMs)}ms`}
                    </div>
                )}
            </div>

            <style>{`
                .wibbly-preview {
                    position: fixed;
                    left: 20px;
                    bottom: 20px;
                    z-index: 100;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                .wibbly-preview__controls {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .wibbly-preview__controls button {
                    padding: 0.4rem 0.7rem;
                    background: rgba(20, 20, 20, 0.85);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    font-size: 0.78rem;
                    cursor: pointer;
                }
                .wibbly-preview__controls button:hover {
                    background: rgba(40, 40, 40, 0.95);
                }
                .wibbly-preview__stage {
                    position: relative;
                    width: 320px;
                    height: 240px;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #000;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }
                .wibbly-preview__video,
                .wibbly-preview__overlay {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }
                .wibbly-preview__overlay {
                    transform: scaleX(-1);
                    pointer-events: none;
                }
                .wibbly-preview__stats {
                    position: absolute;
                    left: 6px;
                    top: 6px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.55);
                    color: #9ef;
                    font-size: 0.7rem;
                    font-variant-numeric: tabular-nums;
                }
                @media (max-width: 768px) {
                    .wibbly-preview__stage { width: 200px; height: 150px; }
                }
            `}</style>
        </div>
    );
}
