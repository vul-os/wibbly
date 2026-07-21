import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Remove OrbitControls import since we're implementing Wii Sports style camera
import {
    Calibration,
    SpatialBinder,
    SwingRecognizer,
    WibblyInput,
    equalClaimZones,
} from '@vulos/wibbly-input';
import { PeerSession } from '@vulos/wibbly-p2p';
import CameraPreview from './camera-preview.jsx';
import { assertNoPeerSession, currentMode, isDemo, modelUrl, resolvePeerTransport } from '../mode.js';
import { startMagnetiteAuthority } from './magnetite-authority.js';

// Import game modules
import { createPlayer, updatePlayerMovement, updatePlayerSwing, updateRacketAlignment, toggleHitBoxVisibility } from './player.js';
import { loadCourt } from './court.js';
import { createBall, updateBallPhysics, handleBallHit } from './ball.js';
import { 
    createGameState, 
    createPlayerData, 
    updatePlayerPositions, 
    updatePlayer1AI, 
    updatePlayer2AI, 
    initializeGame 
} from './game-logic.js';

/**
 * Optional peer transport for wibbly's peer-to-peer multiplayer. **OFF unless
 * a host page hands one in, and null unconditionally in demo mode.** The
 * resolution rules, and why there is no build-time config for this the way
 * there is for mode/model, live in ../mode.js.
 */
function peerTransport() {
    return resolvePeerTransport(
        import.meta.env ?? {},
        typeof window !== 'undefined' ? window : null,
    );
}

/**
 * Frees the GPU-side resources (vertex/index buffers, textures) held by
 * every mesh under `root`. `WebGLRenderer.dispose()` only releases what the
 * renderer itself owns — geometries, materials and their texture maps are
 * the scene graph's own responsibility, and three.js never frees them on
 * its own just because the JS objects became unreachable. Without this, a
 * settings change or a restart (both remount TennisGame and build an
 * entirely new scene) leaks the previous ball, both players and the court
 * model's GPU memory for the rest of the tab's life.
 */
function disposeObject3D(root) {
    if (!root) return;
    root.traverse((obj) => {
        obj.geometry?.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
        for (const material of materials) {
            for (const key of Object.keys(material)) {
                const value = material[key];
                if (value && typeof value === 'object' && value.isTexture) value.dispose();
            }
            material.dispose();
        }
    });
}

/**
 * Props are additive and all optional — the component still works standalone.
 *
 *   paused        pause/resume from the in-game menu. Read through a ref by the
 *                 animation loop; it skips simulation and keeps rendering the
 *                 frozen frame, and suppresses the spacebar so menu keystrokes
 *                 never reach the racket.
 *   settings      applied to the game state once, at mount, before the input
 *                 pipeline is built. The page remounts this component when they
 *                 change, which is why nothing here re-reads them.
 *   calibration   shared Calibration instance, so setup and the in-game menu
 *                 write to the same object the recogniser reads.
 *   onInputState  reports 'live' | 'keyboard' once the camera resolves.
 *   onSwing       fired on every swing the player makes, however it was
 *                 triggered — gesture or spacebar. The demo shell uses it
 *                 to time its "run your own node" prompt to a moment the
 *                 player has already been playing, rather than blocking them
 *                 with an interstitial first.
 */
function TennisGame({
    paused = false,
    settings = null,
    calibration = null,
    onInputState = null,
    onSwing = null,
    onTrackerBackend = null,
    onAuthority = null,
}) {
    const containerRef = useRef(null);
    const playersRef = useRef([]);
    const ballRef = useRef(null);
    const inputRef = useRef(null);
    // Optional peer session (networked play). Null unless a transport was
    // handed in — see `peerTransport()` above. Local play never touches this.
    const peerRef = useRef(null);
    // The magnetite authority: a real magnetite AuthoritativeGame (wasm) run as
    // a SingleRoom match in this tab, stepped from the animation loop below.
    // Full app only — never started in demo mode (the demo CSP blocks wasm).
    const authorityRef = useRef(null);
    const gameStateRef = useRef(createGameState());
    const playerDataRef = useRef(createPlayerData());

    // Calibration is per-player, persisted locally, and is what kills the old
    // `isRightHanded = true` hardcode. Created once for the component's life.
    const calibrationRef = useRef(null);
    if (!calibrationRef.current) calibrationRef.current = calibration ?? new Calibration();

    // Pause flag, read by the animation loop and the key handler.
    const pausedRef = useRef(paused);
    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    // Held in a ref because the setup effect runs once with [] deps; reading
    // the prop directly there would pin whatever was passed at mount.
    const onSwingRef = useRef(onSwing);
    useEffect(() => {
        onSwingRef.current = onSwing;
    }, [onSwing]);

    const onBackendRef = useRef(onTrackerBackend);
    useEffect(() => {
        onBackendRef.current = onTrackerBackend;
    }, [onTrackerBackend]);

    // Same ref-pinning reasoning as onSwingRef: the setup effect runs once, so
    // the authority telemetry callback is read through a ref that later renders
    // can update without re-running setup.
    const onAuthorityRef = useRef(onAuthority);
    useEffect(() => {
        onAuthorityRef.current = onAuthority;
    }, [onAuthority]);

    // Same reasoning as onSwingRef above. This one was previously read
    // directly off the closed-over prop, which happened to be harmless only
    // because Play.jsx's only caller passes a useState setter (a stable
    // identity forever) — any caller passing a fresh function each render
    // would have gotten 'starting…' stuck forever after the first camera
    // resolution, since the setup effect that calls this never re-runs.
    const onInputStateRef = useRef(onInputState);
    useEffect(() => {
        onInputStateRef.current = onInputState;
    }, [onInputState]);

    // Exposed to the preview component so it can render video + skeletons.
    const [input, setInput] = useState(null);
    const [trackedPlayers, setTrackedPlayers] = useState([]);

    useEffect(() => {
        if (!containerRef.current) return;
        console.log("Game initializing...");

        // Set by cleanup so async setup that resolves after unmount tears its
        // own resources down instead of leaking a live socket.
        let cancelled = false;

        // Settings the menu owns, applied once before anything reads them.
        if (settings) {
            if (typeof settings.usePoseDetection === 'boolean') {
                gameStateRef.current.usePoseDetection = settings.usePoseDetection;
            }
            if (typeof settings.debug === 'boolean') {
                gameStateRef.current.debug = settings.debug;
            }
        }
        
        // Scene setup.
        //
        // The court is lit as a sports hall after dark, not an afternoon
        // outdoors — this is the "Court Lights" identity the whole UI is built
        // on, and a daylight-blue sky behind a violet-black interface was the
        // single loudest inconsistency in the product. The fog is what makes it
        // read as an enclosed hall: the far end of the court falls off into the
        // dark instead of ending at a hard horizon.
        //
        // Only the ambience changes here. The lights below still key the court
        // itself, so play readability is unaffected.
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b0810);
        scene.fog = new THREE.Fog(0x0b0810, 26, 74);

        // Wii Sports style camera - positioned behind player 1
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Wii Sports camera system - smoothly follow behind player 1
        const cameraTarget = new THREE.Vector3();
        const cameraPosition = new THREE.Vector3();
        
        function updateWiiSportsCamera(player1, ballGroup, gameState) {
            // Base camera position - lowered height with downward angle
            const baseOffset = new THREE.Vector3(-4.5, 4.8, 0); // Behind player 1, elevated but lower
            
            // Dynamic camera adjustment based on game state
            let dynamicOffset = baseOffset.clone();
            
            if (gameState.ballInPlay) {
                // During play, adjust camera to follow the action
                const ballPos = ballGroup.position;
                const player1Pos = player1.position;
                
                // Calculate midpoint between player and ball for better framing
                const actionCenter = new THREE.Vector3()
                    .addVectors(player1Pos, ballPos)
                    .multiplyScalar(0.5);
                
                // Adjust camera height based on ball height (but stay elevated)
                const ballHeight = Math.max(1, ballPos.y);
                dynamicOffset.y = 4.8 + (ballHeight - 1) * 0.3; // Less height variation to maintain downward angle
                
                // Slightly adjust side position based on ball Z position
                dynamicOffset.z = ballPos.z * 0.15; // Reduced for smoother movement
                
                // Move camera back more if ball is far from player
                const distanceToBall = player1Pos.distanceTo(ballPos);
                dynamicOffset.x = -4.5 - Math.min(distanceToBall * 0.12, 1.2); // Reduced for smoother movement
                
                // Camera target is the action center, but lower for downward angle
                const desiredTarget = actionCenter.clone();
                desiredTarget.y += 0.5; // Look down at the action
                
                // Smooth target movement as well
                cameraTarget.lerp(desiredTarget, 0.05);
            } else {
                // When not in play, focus on player 1 with downward angle
                const desiredTarget = player1.position.clone();
                desiredTarget.y += 1.0; // Look down at player
                
                // Smooth target movement
                cameraTarget.lerp(desiredTarget, 0.05);
            }
            
            // Calculate desired camera position relative to player 1
            const desiredCameraPos = new THREE.Vector3()
                .copy(player1.position)
                .add(dynamicOffset);
            
            // Smoother camera movement with slower interpolation
            const smoothFactor = 0.04; // Reduced from 0.08 for much smoother movement
            cameraPosition.lerp(desiredCameraPos, smoothFactor);
            
            // Update camera with smooth target
            camera.position.copy(cameraPosition);
            camera.lookAt(cameraTarget);
        }

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        renderer.shadowMap.enabled = true;
        containerRef.current.appendChild(renderer.domElement);

        // No OrbitControls - Wii Sports has fixed camera behavior
        
        // Lights for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Load the court. Async and not awaited — the match starts on the
        // fallback/empty ground and the real model slots in whenever it
        // arrives.
        loadCourt(scene).then((model) => {
            if (cancelled) {
                // Cleanup already ran and already disposed whatever was in
                // the scene at that point; this model attached itself
                // after that, so it has to free its own geometry/textures
                // here or they leak for the rest of the tab's life.
                disposeObject3D(model);
            }
        });

        // Create ball
        const ballGroup = createBall(scene);
        ballRef.current = ballGroup;

        // Create players
        const playerStartPositions = [
            { x: -8, z: 0, rotation: Math.PI/2 }, // Left player facing forward (+Z axis)
            { x: 8, z: 0, rotation: -Math.PI/2 }  // Right player facing toward us (-Z axis)
        ];

        const players = playerStartPositions.map((pos, index) => {
            // Make players 25% smaller than current size (0.63 = 0.84 * 0.75)
            const player = createPlayer(pos.x, pos.z, pos.rotation, 0.63);
            scene.add(player);
            
            // Store the initial player data
            const playerData = playerDataRef.current[index];
            playerData.x = pos.x;
            playerData.z = pos.z;
            playerData.homeX = pos.x; // Store home position
            playerData.homeZ = pos.z; // Store home position
            
            return player;
        });
        
        playersRef.current = players;

        // Initialize camera position - lowered height for better angle
        cameraPosition.set(-12.5, 4.8, 0); // Start behind and above player 1
        cameraTarget.set(-8, 1.0, 0); // Look down at player 1

        // Function to start the game
        function startGame() {
            initializeGame(players, ballGroup, gameStateRef.current, playerDataRef.current);
        }
        
        // Setup gesture input via the @vulos/wibbly-input seams.
        //
        // The game names no model, no runtime and no vendor here — only the
        // seams. Swapping MoveNet for something else later is a constructor
        // argument, not a rewrite of this file.
        async function setupGestureInput() {
            const calibration = calibrationRef.current;

            const wibbly = new WibblyInput({
                calibration,
                // Point the DEFAULT tracker at the vendored, same-origin model.
                // The game still names no model and no vendor — it hands the
                // seam a URL and the seam decides what to do with it. Without
                // this the weights come from tfhub.dev, which a page served
                // under `default-src 'self'` cannot fetch at all.
                trackerConfig: {
                    modelUrl: modelUrl(),
                    // WebGL explicitly, not TFJS auto-selection. The embedded
                    // build runs under `script-src 'self' 'unsafe-inline'` with
                    // no 'wasm-unsafe-eval', so the WASM backend cannot
                    // instantiate there; auto-selection would be a decision
                    // made by whatever happened to register first.
                    preferredBackends: ['webgl'],
                    onBackend: (info) => {
                        // Surfaced to the shell so a degraded or unusable
                        // backend can be said out loud rather than looking
                        // like a game that ignores the player.
                        try {
                            onBackendRef.current?.(info);
                        } catch (err) {
                            console.warn('onTrackerBackend handler threw:', err);
                        }
                    },
                },
                // Two claim zones so a second player on the couch can join by
                // standing in the right half of the frame. Tennis only drives
                // player 1 today, but the binder is already multi-player.
                binder: new SpatialBinder({
                    maxPlayers: 2,
                    claimZones: equalClaimZones(2),
                    forgetAfterMs: 2000,
                }),
                recognizers: [
                    new SwingRecognizer({
                        // Live lookup: flipping handedness in the preview takes
                        // effect on the very next frame.
                        handedness: (playerId) => calibration.handednessFor(playerId),
                    }),
                ],
                frame: { width: 640, height: 480, fps: 30 },
                onError: (err) => console.error('Gesture input error:', err),
            });

            wibbly.onGesture((event) => {
                // Stream to the peer session BEFORE the tennis-specific
                // filtering below: PeerSession is the input layer for
                // whatever game is hosted, not for tennis' idea of a relevant
                // gesture. Absent unless a transport was handed in, and
                // fire-and-forget — `sendGesture` never throws and reports
                // failure through its return value rather than an exception,
                // so a disconnected peer cannot stall or break the local
                // swing that follows.
                peerRef.current?.sendGesture(event);

                if (event.kind !== 'swing') return;
                // Only player 1 controls the racket in tennis today.
                if (event.playerId !== 'player_1') return;

                // Map the handedness-relative stroke onto the ball physics'
                // left/right convention. Using `stroke` rather than the raw
                // image-space `direction` is what makes a left-handed player's
                // forehand behave like a right-handed player's forehand,
                // instead of being mirrored into the wrong shot.
                const swingDirection = event.detail?.stroke === 'backhand' ? 'left' : 'right';
                // event.confidence is 0..1 and never a certainty — an
                // Attested gesture is not replay-verifiable and this game
                // must not treat it as a clean signal (see GestureEvent's
                // doc comment in wibbly-input). Threaded through to the hit
                // physics rather than dropped on the floor, so a marginal
                // detection produces a visibly softer shot instead of the
                // same full-power swing as a confident one.
                handleSwing(swingDirection, event.confidence);
            });

            wibbly.onPeople((people) => {
                const ids = people.map((p) => p.playerId);
                setTrackedPlayers((prev) =>
                    prev.length === ids.length && prev.every((id, i) => id === ids[i]) ? prev : ids,
                );
                // Continuously widen each player's reach envelope during play.
                for (const person of people) calibration.observeReach(person.playerId, person);
            });

            try {
                await wibbly.start();
                if (cancelled) {
                    // Unmounted (settings change, restart, navigation) while
                    // the camera/model was still starting. Nothing is left
                    // to consume this pipeline's output, so stop it here
                    // rather than handing a live camera stream + tracker to
                    // refs the cleanup below already nulled out — the same
                    // leak setupPeerSession guards against for its transport.
                    wibbly.stop();
                    return;
                }
                inputRef.current = wibbly;
                setInput(wibbly);
                onInputStateRef.current?.('live');
                console.log('Gesture input initialized');
            } catch (error) {
                // Camera denied or unavailable — the game stays fully playable
                // on the spacebar, which is the correct degradation.
                console.error('Gesture input unavailable, falling back to keyboard:', error);
                gameStateRef.current.usePoseDetection = false;
                if (!cancelled) onInputStateRef.current?.('keyboard');
                wibbly.stop();
            }
        }

        /**
         * Optional peer session. There is no signalling here — by the time a
         * transport exists at all, some other surface (a lobby screen, a
         * host page) has already run the offer/answer exchange in
         * site/docs/MULTIPLAYER.md's design and handed the resulting
         * `PeerTransport` in via `window.__WIBBLY_PEER_TRANSPORT__`. This
         * function only wraps it in a `PeerSession` and wires it to the local
         * gesture stream. Every failure path here is a no-op that leaves
         * local play exactly as it was — a peer that never connects, or one
         * that drops mid-match, must never cost the player their own game.
         * That is why it is `catch`-and-log rather than anything louder, and
         * why it is never awaited by the setup path.
         */
        async function setupPeerSession() {
            const transport = peerTransport();
            if (!transport) return; // default: pure local play, no peer involved.

            // Belt to the brace above. `peerTransport()` already returns null
            // in demo mode, so reaching here at all would mean that gate broke;
            // throwing makes that a loud bug rather than a silent outbound
            // peer connection from an embedded demo. Held by test/mode.test.js.
            assertNoPeerSession(currentMode());

            const session = new PeerSession({
                transport,
                // Tennis only produces swings today; telling the session so
                // lets it reject anything else outright.
                limits: { acceptedKinds: ['swing'] },
                onStatusChange: (status) => console.log('[peer] session', status),
                onError: (err) => console.warn('[peer] transport error:', err),
            });

            try {
                await session.connect();
                if (cancelled) {
                    session.close();
                    return;
                }
                peerRef.current = session;
                // No signed/unsigned distinction to report here, deliberately:
                // this design never signs events. A signature would only prove
                // "this connection sent this", which the RTCDataChannel this
                // transport wraps already gives for free — see inbound-gate.ts.
                console.log('[peer] connected — streaming local gesture events to the peer');
            } catch (error) {
                // Stay local. This is the designed degradation, not a failure.
                console.warn('[peer] unavailable, continuing with local play:', error);
                session.close();
            }
        }

        // Function to handle swings (from pose detection or spacebar).
        // `confidence` defaults to 1 (full, deterministic power) which is
        // exactly right for the keyboard fallback below — a keypress has no
        // notion of "how sure" it is. Only the gesture path above ever
        // passes something less than that.
        function handleSwing(swingDirection = 'right', confidence = 1) {
            console.log("Handling swing!", swingDirection);

            // Reported for EVERY swing the player makes, before the animation
            // gate below. The gate is about whether the racket is mid-swing,
            // not about whether the player is playing — counting only the
            // swings that pass it would make a shell's "has this person been
            // playing?" question depend on ball position and AI timing.
            // Never allowed to break the game if a handler throws.
            try {
                onSwingRef.current?.(swingDirection);
            } catch (err) {
                console.warn('onSwing handler threw:', err);
            }
            // One authoritative `attack` pulse per swing, consumed by the
            // magnetite authority step in the animation loop.
            pendingMagnetiteSwing = true;

            const gameState = gameStateRef.current;
            const player1 = players[0];
            const playerData1 = playerDataRef.current[0];

            // Swing racket animation
            if (!playerData1.swinging) {
                playerData1.swinging = true;
                playerData1.swingTime = 0;
                
                console.log("Player 1 swinging racket!");

                // Try to hit the ball
                handleBallHit(ballGroup, gameState, player1, 0, swingDirection, confidence);
            }
        }
        
        // Function to handle keyboard input
        function handleKeyDown(event) {
            // While the menu is open the game takes no input at all.
            if (pausedRef.current) return;
            console.log(`Key pressed: ${event.code}`);

            if (event.code === 'Space') {
                handleSwing();
            } else if (event.code === 'KeyH') {
                // Toggle hit boxes with 'H' key
                toggleHitBoxVisibility(players, ballGroup);
            }
        }
        
        // Animation loop with performance monitoring
        const clock = new THREE.Clock();
        let logTimer = 0;
        
        // Performance monitoring for deployment debugging
        let frameCount = 0;
        let lastFpsTime = performance.now();
        let currentFps = 60;
        
        let animationFrameId = null;

        // Set on every swing, consumed by the magnetite authority step below so
        // each swing becomes exactly one authoritative `attack` input pulse.
        let pendingMagnetiteSwing = false;
        // Telemetry is pushed to the HUD at most a few times a second, not every
        // frame — the authority still steps every frame, this only throttles the
        // React state update.
        let authorityTelemetryTimer = 0;

        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            // Paused: keep presenting the frozen frame under the menu, advance
            // nothing. getDelta() is still drained so the first frame after a
            // resume is not a giant time step.
            if (pausedRef.current) {
                clock.getDelta();
                renderer.render(scene, camera);
                return;
            }

            const delta = Math.min(clock.getDelta(), 0.1);
            logTimer += delta;
            
            // Calculate FPS for deployment debugging
            frameCount++;
            const currentTime = performance.now();
            if (currentTime - lastFpsTime >= 1000) { // Update FPS every second
                currentFps = Math.round((frameCount * 1000) / (currentTime - lastFpsTime));
                frameCount = 0;
                lastFpsTime = currentTime;
                
                // Log performance issues if FPS is low
                if (currentFps < 30 && gameStateRef.current.debug) {
                    console.warn(`Low FPS detected: ${currentFps} FPS - AI may struggle in deployment`);
                }
            }
            
            // Debug logging every 5 seconds with performance info
            if (gameStateRef.current.debug && logTimer > 5) {
                console.log(`Animation loop running... FPS: ${currentFps}, Delta: ${delta.toFixed(3)}s`);
                logTimer = 0;
            }
            
            // Update player positions occasionally even when ball not in play
            updatePlayerPositions(gameStateRef.current, playerDataRef.current, clock);
            
            // Update ball physics
            updateBallPhysics(ballGroup, gameStateRef.current, delta, clock, players);

            // Step the magnetite authority: one authoritative tick per rendered
            // frame, fed the match's own input (a swing → an `attack` pulse).
            // This is the real magnetite simulation running in the tab — the
            // bottom rung of the topology ladder. Guarded so a fault here can
            // never take down the tennis render loop; on error the authority is
            // dropped and tennis continues untouched.
            if (authorityRef.current) {
                try {
                    const telemetry = authorityRef.current.step({ p1Swing: pendingMagnetiteSwing });
                    pendingMagnetiteSwing = false;
                    window.__WIBBLY_MAGNETITE__ = telemetry;
                    authorityTelemetryTimer += delta;
                    if (authorityTelemetryTimer >= 0.25) {
                        authorityTelemetryTimer = 0;
                        try {
                            onAuthorityRef.current?.(telemetry);
                        } catch (err) {
                            console.warn('onAuthority handler threw:', err);
                        }
                    }
                } catch (err) {
                    console.warn('magnetite authority step failed; dropping it:', err);
                    authorityRef.current = null;
                    window.__WIBBLY_MAGNETITE__ = { ready: false, error: String(err && err.message ? err.message : err) };
                }
            }

            // Update player AI behavior
            updatePlayer1AI(players, gameStateRef.current, playerDataRef.current, ballGroup);
            updatePlayer2AI(players, gameStateRef.current, playerDataRef.current, ballGroup);
            
            // Move players
            players.forEach((player, index) => {
                const data = playerDataRef.current[index];
                
                // Update player movement
                updatePlayerMovement(player, data, delta);
                
                // Update player rotation - always face head-on (along Z axis)
                player.rotation.y = index === 0 ? Math.PI/2 : -Math.PI/2;
                
                // Update racket alignment with ball trajectory
                updateRacketAlignment(player, data, ballGroup, gameStateRef.current, index);
                
                // Update swing animation
                updatePlayerSwing(player, data, delta, index);
            });
            
            // Update Wii Sports style camera
            updateWiiSportsCamera(players[0], ballGroup, gameStateRef.current);
            
            // Render
            renderer.render(scene, camera);
        }
        
        // Setup gesture input early
        if (gameStateRef.current.usePoseDetection) {
            console.log("Starting gesture input setup...");
            setupGestureInput();
        } else {
            onInputStateRef.current?.('keyboard');
        }

        // Optional, and deliberately not awaited: the game starts immediately
        // and the peer session joins it if and when it connects.
        setupPeerSession();

        // Bring up the magnetite authority. Full app only — startMagnetiteAuthority
        // refuses in demo mode, and we don't even call it there. Not awaited: the
        // tennis match starts immediately and the authority attaches whenever its
        // wasm finishes loading. Never allowed to break the game if it fails.
        if (!isDemo()) {
            startMagnetiteAuthority()
                .then((runner) => {
                    if (cancelled) return;
                    authorityRef.current = runner;
                    window.__WIBBLY_MAGNETITE__ = runner.telemetry();
                    try {
                        onAuthorityRef.current?.(runner.telemetry());
                    } catch (err) {
                        console.warn('onAuthority handler threw:', err);
                    }
                })
                .catch((err) => {
                    console.warn('magnetite authority failed to start:', err);
                    window.__WIBBLY_MAGNETITE__ = { ready: false, error: String(err && err.message ? err.message : err) };
                });
        }

        // Start game
        startGame();
        
        // Start animation
        animate();
        
        // Add event listeners
        window.addEventListener('keydown', handleKeyDown);
        renderer.domElement.addEventListener('click', startGame);
        
        // Window resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            cancelled = true;

            // Stop the render/simulation loop FIRST. Nothing below is safe
            // to skip this: without it, the previous instance's `animate`
            // keeps calling requestAnimationFrame on itself forever — every
            // settings change and every restart (both remount this
            // component via a fresh `key`) would leave one more zombie loop
            // running full physics/AI and rendering into a renderer that
            // `renderer.dispose()` below is about to tear down.
            if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);

            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('click', startGame);
            renderer.dispose();

            // renderer.dispose() only releases what the renderer itself
            // owns. The scene's own geometries/materials/textures (ball,
            // both players, the court) are freed here — see
            // disposeObject3D's doc comment for why this is required.
            disposeObject3D(scene);

            // Tear down gesture input: stops the camera tracks, disposes the
            // model and clears binder/recognizer state.
            if (inputRef.current) {
                inputRef.current.stop();
                inputRef.current = null;
            }
            setInput(null);

            // Close the transport and clear gate state. No-op when no peer
            // session was ever configured, which is the default.
            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
            }

            // Drop the magnetite authority. The wasm instance is owned by the
            // runner; clearing the ref lets it be collected, and the diagnostic
            // global is removed so a later mount cannot read a stale tick.
            authorityRef.current = null;
            if (typeof window !== 'undefined') {
                delete window.__WIBBLY_MAGNETITE__;
            }

            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <>
            {/* 100dvh, not 100vh: Safari measures vh against the viewport with
                its toolbars hidden, so a 100vh canvas overflows the visible
                area and the page scrolls by the height of the browser chrome —
                worst inside the demo's iframe. The class carries a vh fallback
                for engines without dvh. */}
            <div ref={containerRef} className="wb-gamecanvas" />
            <style>{`
                .wb-gamecanvas {
                    width: 100%;
                    height: 100vh;
                    height: 100dvh;
                }
            `}</style>

            {/* Camera preview is rendered by the app, never injected by the
                input library. Absent until the camera actually starts. */}
            {input && (
                <CameraPreview
                    input={input}
                    calibration={calibrationRef.current}
                    players={trackedPlayers}
                />
            )}

            {/* The old fixed-position "Help" dropdown lived here. It is gone:
                the in-game menu (ESC) owns controls and help now, and two
                differently-styled help widgets on one screen is one too many.
                Its state and toggler went with it. */}
        </>
    );
}

export default TennisGame; 