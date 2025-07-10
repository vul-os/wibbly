import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PoseDetector from '../poseDetection.js';

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
    const poseDetectorRef = useRef(null);
    const gameStateRef = useRef(createGameState());
    const playerDataRef = useRef(createPlayerData());

    // Instructions dropdown state
    const [showInstructions, setShowInstructions] = useState(false);
    
    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    useEffect(() => {
        if (!containerRef.current) return;
        console.log("Game initializing...");
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);

        // Camera with debug view
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 30, 20); // Camera farther back with overview of scene
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        renderer.shadowMap.enabled = true;
        containerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
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

        // Function to start the game
        function startGame() {
            initializeGame(players, ballGroup, gameStateRef.current, playerDataRef.current);
        }
        
        // Setup pose detection
        async function setupPoseDetection() {
            try {
                console.log("Setting up pose detection...");
                const poseDetector = new PoseDetector();
                const setupSuccess = await poseDetector.setup();
                
                if (setupSuccess !== false) {
                    // Register swing callback
                    poseDetector.onSwing((swingDirection) => {
                        console.log("Pose detection: Swing detected!", swingDirection);
                        handleSwing(swingDirection);
                    });
                    
                    poseDetectorRef.current = poseDetector;
                    console.log("Pose detection initialized successfully");
                } else {
                    console.log("Pose detection setup failed, disabling");
                    gameStateRef.current.usePoseDetection = false;
                }
            } catch (error) {
                console.error("Error setting up pose detection:", error);
                console.log("Trying to request camera permissions manually...");
                
                // Try requesting camera permissions first
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    console.log("Camera permissions granted, retrying pose detection setup...");
                    stream.getTracks().forEach(track => track.stop()); // Stop the test stream
                    
                    // Retry setup
                    const poseDetector = new PoseDetector();
                    const setupSuccess = await poseDetector.setup();
                    
                    if (setupSuccess !== false) {
                        poseDetector.onSwing((swingDirection) => {
                            console.log("Pose detection: Swing detected!", swingDirection);
                            handleSwing(swingDirection);
                        });
                        
                        poseDetectorRef.current = poseDetector;
                        console.log("Pose detection initialized successfully on retry");
                    } else {
                        gameStateRef.current.usePoseDetection = false;
                    }
                } catch (permissionError) {
                    console.error("Camera permissions denied:", permissionError);
                    gameStateRef.current.usePoseDetection = false;
                }
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
        
        // Animation loop
        const clock = new THREE.Clock();
        let logTimer = 0;
        
        function animate() {
            requestAnimationFrame(animate);
            
            const delta = Math.min(clock.getDelta(), 0.1);
            logTimer += delta;
            
            // Debug logging every 5 seconds
            if (gameStateRef.current.debug && logTimer > 5) {
                console.log("Animation loop running...");
                logTimer = 0;
            }
            
            // Update controls
            controls.update();
            
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
            
            // Render
            renderer.render(scene, camera);
        }
        
        // Setup pose detection early
        if (gameStateRef.current.usePoseDetection) {
            console.log("Starting pose detection setup...");
            setupPoseDetection();
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
            
            // Clean up pose detector
            if (poseDetectorRef.current) {
                poseDetectorRef.current.cleanup();
            }
            
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <>
            <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
            
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
                        <h3>Tennis Game Controls</h3>
                        <ul>
                            <li>Players move automatically</li>
                            <li><strong>SPACEBAR:</strong> Swing racket at ball</li>
                            <li><strong>H KEY:</strong> Toggle collision hit boxes</li>
                            <li>Swing your arm to hit the ball (using webcam)</li>
                            <li>Press SPACEBAR first to serve the ball</li>
                            <li>Click anywhere to restart game</li>
                        </ul>
                        <p className="debug-note">
                            If nothing moves, check browser console for errors
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