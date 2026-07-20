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
import CameraPreview from './camera-preview.jsx';

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

function TennisGame() {
    const containerRef = useRef(null);
    const playersRef = useRef([]);
    const ballRef = useRef(null);
    const inputRef = useRef(null);
    const gameStateRef = useRef(createGameState());
    const playerDataRef = useRef(createPlayerData());

    // Calibration is per-player, persisted locally, and is what kills the old
    // `isRightHanded = true` hardcode. Created once for the component's life.
    const calibrationRef = useRef(null);
    if (!calibrationRef.current) calibrationRef.current = new Calibration();

    // Instructions dropdown state
    const [showInstructions, setShowInstructions] = useState(false);
    // Exposed to the preview component so it can render video + skeletons.
    const [input, setInput] = useState(null);
    const [trackedPlayers, setTrackedPlayers] = useState([]);

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    useEffect(() => {
        if (!containerRef.current) return;
        console.log("Game initializing...");
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);

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
                console.log('Gesture input initialized');
            } catch (error) {
                // Camera denied or unavailable — the game stays fully playable
                // on the spacebar, which is the correct degradation.
                console.error('Gesture input unavailable, falling back to keyboard:', error);
                gameStateRef.current.usePoseDetection = false;
                wibbly.stop();
            }
        }

        // Function to handle swings (from pose detection or spacebar)
        function handleSwing(swingDirection = 'right') {
            console.log("Handling swing!", swingDirection);
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

            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <>
            <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />

            {/* Camera preview is rendered by the app, never injected by the
                input library. Absent until the camera actually starts. */}
            {input && (
                <CameraPreview
                    input={input}
                    calibration={calibrationRef.current}
                    players={trackedPlayers}
                />
            )}

            {/* Instructions Dropdown Button */}
            <div className="instructions-container">
                <button 
                    className="instructions-toggle"
                    onClick={toggleInstructions}
                    aria-label="Toggle instructions"
                >
                    <svg 
                        className="instructions-icon"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                    >
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                    </svg>
                    <span className="instructions-text">Help</span>
                    <svg 
                        className={`chevron ${showInstructions ? 'rotated' : ''}`}
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                    >
                        <polyline points="6,9 12,15 18,9"/>
                    </svg>
                </button>
                
                {/* Instructions Panel */}
                {showInstructions && (
                    <div className="instructions-panel">
                        <h3>Wii Sports Tennis Controls</h3>
                        <ul>
                            <li>🎾 <strong>Wii Sports Style:</strong> Your player automatically tracks the ball!</li>
                            <li>📹 <strong>Camera:</strong> Follows behind you like Wii Sports</li>
                            <li><strong>SPACEBAR:</strong> Swing racket (timing is everything!)</li>
                            <li><strong>H KEY:</strong> Toggle collision hit boxes</li>
                            <li>🤳 <strong>Webcam:</strong> Swing your arm to hit the ball</li>
                            <li>🏁 Press SPACEBAR first to serve the ball</li>
                            <li>🔄 Click anywhere to restart game</li>
                        </ul>
                        <p className="debug-note">
                            Just like Wii Sports - focus on timing your swings! Your player moves automatically.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .instructions-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    font-family: 'Inter', sans-serif;
                }

                .instructions-toggle {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(79, 209, 199, 0.3);
                    border-radius: 12px;
                    color: #2e7d6b;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    min-width: 120px;
                    justify-content: space-between;
                }

                .instructions-toggle:hover {
                    background: rgba(255, 255, 255, 1);
                    border-color: rgba(79, 209, 199, 0.5);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(79, 209, 199, 0.2);
                }

                .instructions-icon {
                    width: 1rem;
                    height: 1rem;
                    flex-shrink: 0;
                }

                .chevron {
                    width: 0.8rem;
                    height: 0.8rem;
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }

                .chevron.rotated {
                    transform: rotate(180deg);
                }

                .instructions-panel {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    background: rgba(255, 255, 255, 0.98);
                    border: 1px solid rgba(79, 209, 199, 0.3);
                    border-radius: 12px;
                    padding: 1.5rem;
                    min-width: 300px;
                    max-width: 400px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .instructions-panel h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #2e7d6b;
                }

                .instructions-panel ul {
                    margin: 0 0 1rem 0;
                    padding-left: 1.2rem;
                    color: #333;
                    line-height: 1.6;
                }

                .instructions-panel li {
                    margin-bottom: 0.5rem;
                }

                .instructions-panel strong {
                    color: #2e7d6b;
                    font-weight: 600;
                }

                .debug-note {
                    font-size: 0.8rem;
                    color: #666;
                    margin: 0;
                    padding-top: 0.5rem;
                    border-top: 1px solid rgba(79, 209, 199, 0.2);
                }

                /* Mobile Styles */
                @media (max-width: 768px) {
                    .instructions-container {
                        top: 15px;
                        right: 15px;
                    }

                    .instructions-toggle {
                        padding: 0.6rem 0.8rem;
                        font-size: 0.8rem;
                        min-width: 100px;
                    }

                    .instructions-text {
                        display: none;
                    }

                    .instructions-panel {
                        min-width: 280px;
                        max-width: calc(100vw - 30px);
                        right: 0;
                        padding: 1.25rem;
                        font-size: 0.9rem;
                    }

                    .instructions-panel h3 {
                        font-size: 1rem;
                    }

                    .instructions-panel ul {
                        padding-left: 1rem;
                    }
                }

                /* Extra small mobile screens */
                @media (max-width: 480px) {
                    .instructions-panel {
                        position: fixed;
                        top: 60px;
                        right: 15px;
                        left: 15px;
                        max-width: none;
                        min-width: auto;
                    }
                }
            `}</style>
        </>
    );
}

export default TennisGame; 