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
import { MagnetiteSession } from '@vulos/wibbly-magnetite';
import CameraPreview from './camera-preview.jsx';
import { assertNoMagnetite, currentMode, modelUrl, resolveMagnetiteConfig } from '../mode.js';

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
 * Optional magnetite networking config. **OFF unless explicitly configured,
 * and null unconditionally in demo mode.** The resolution rules, and why demo
 * mode can never reach a node, live in ../mode.js.
 */
function magnetiteConfig() {
    return resolveMagnetiteConfig(
        import.meta.env ?? {},
        typeof window !== 'undefined' ? window : null,
    );
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
}) {
    const containerRef = useRef(null);
    const playersRef = useRef([]);
    const ballRef = useRef(null);
    const inputRef = useRef(null);
    // Optional magnetite session (§6 networked play). Null unless configured —
    // see `magnetiteConfig()` below. Local play never touches this.
    const magnetiteRef = useRef(null);
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

        // Load the court
        loadCourt(scene);

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
                // Stream to magnetite BEFORE the tennis-specific filtering
                // below: the session is the input layer for whatever game is
                // hosted, not for tennis' idea of a relevant gesture. Absent
                // unless configured, and fire-and-forget — `submit` never
                // throws and never blocks, so a dead node cannot stall or break
                // the local swing that follows.
                magnetiteRef.current?.submit(event);

                if (event.kind !== 'swing') return;
                // Only player 1 controls the racket in tennis today.
                if (event.playerId !== 'player_1') return;

                // Map the handedness-relative stroke onto the ball physics'
                // left/right convention. Using `stroke` rather than the raw
                // image-space `direction` is what makes a left-handed player's
                // forehand behave like a right-handed player's forehand,
                // instead of being mirrored into the wrong shot.
                const swingDirection = event.detail?.stroke === 'backhand' ? 'left' : 'right';
                handleSwing(swingDirection);
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
                inputRef.current = wibbly;
                setInput(wibbly);
                onInputState?.('live');
                console.log('Gesture input initialized');
            } catch (error) {
                // Camera denied or unavailable — the game stays fully playable
                // on the spacebar, which is the correct degradation.
                console.error('Gesture input unavailable, falling back to keyboard:', error);
                gameStateRef.current.usePoseDetection = false;
                onInputState?.('keyboard');
                wibbly.stop();
            }
        }

        /**
         * Optional magnetite session. Every failure path here is a no-op that
         * leaves local play exactly as it was — an unreachable node, a missing
         * client module, or an engine with no Ed25519 must never cost the
         * player their game. That is why it is `catch`-and-log rather than
         * anything louder, and why it is never awaited by the setup path.
         */
        async function setupMagnetite() {
            const cfg = magnetiteConfig();
            if (!cfg) return; // default: pure local play, no server involved.

            // Belt to the brace above. `magnetiteConfig()` already returns null
            // in demo mode, so reaching here at all would mean that gate broke;
            // throwing makes that a loud bug rather than a silent outbound
            // WebSocket from an embedded demo. Held by test/mode.test.js.
            assertNoMagnetite(currentMode());

            const session = new MagnetiteSession({
                url: cfg.url,
                token: cfg.token,
                clientModule: cfg.clientModule,
                playerKeyHex: cfg.playerKeyHex,
                // Tennis only produces swings today; telling the host so lets it
                // reject anything else outright.
                limits: { acceptedKinds: ['swing'] },
                onStatusChange: (status) => console.log('[magnetite] session', status),
                onError: (err) => console.warn('[magnetite] transport error:', err),
            });

            try {
                await session.connect();
                if (cancelled) {
                    session.close();
                    return;
                }
                magnetiteRef.current = session;
                console.log(
                    `[magnetite] streaming gesture events to ${cfg.url}` +
                        (session.signed
                            ? ' (signed — authorship only, NOT verification)'
                            : ' (UNSIGNED — no authorship binding at all)'),
                );
            } catch (error) {
                // Stay local. This is the designed degradation, not a failure.
                console.warn('[magnetite] unavailable, continuing with local play:', error);
                session.close();
            }
        }

        // Function to handle swings (from pose detection or spacebar)
        function handleSwing(swingDirection = 'right') {
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
            const gameState = gameStateRef.current;
            const player1 = players[0];
            const playerData1 = playerDataRef.current[0];
            
            // Swing racket animation
            if (!playerData1.swinging) {
                playerData1.swinging = true;
                playerData1.swingTime = 0;
                
                console.log("Player 1 swinging racket!");

                // Try to hit the ball
                handleBallHit(ballGroup, gameState, player1, 0, swingDirection);
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
        
        function animate() {
            requestAnimationFrame(animate);

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
            onInputState?.('keyboard');
        }

        // Optional, and deliberately not awaited: the game starts immediately
        // and the session joins it if and when it connects.
        setupMagnetite();

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
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', startGame);
            renderer.domElement.removeEventListener('click', startGame);
            renderer.dispose();
            
            // Tear down gesture input: stops the camera tracks, disposes the
            // model and clears binder/recognizer state.
            if (inputRef.current) {
                inputRef.current.stop();
                inputRef.current = null;
            }
            setInput(null);

            // Close the socket and clear pre-flight state. No-op when magnetite
            // was never configured, which is the default.
            if (magnetiteRef.current) {
                magnetiteRef.current.close();
                magnetiteRef.current = null;
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