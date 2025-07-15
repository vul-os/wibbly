import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PoseDetector from '../poseDetection.js';
import InGameMenu from '../components/InGameMenu.jsx';

// Import game modules
import { createPlayer, updatePlayerMovement, updatePlayerSwing } from './player.js';
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
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);

    // Menu and settings state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentCamera, setCurrentCamera] = useState('orbital');
    const currentCameraRef = useRef('orbital'); // Add ref to track current camera mode
    const [gameSettings, setGameSettings] = useState({
        usePoseDetection: true,
        fov: 75,
        cameraSmoothing: 0.5,
        difficulty: 'medium',
        aiEnabled: true,
        debug: false,
        quality: 'high',
        shadows: true,
        antialiasing: true
    });

    // Camera target for fixed behind player mode
    const cameraTargetRef = useRef(new THREE.Vector3());
    const cameraPositionRef = useRef(new THREE.Vector3());

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSettingsChange = (key, value) => {
        setGameSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const setupCamera = (camera, mode, players) => {
        console.log(`Setting up camera mode: ${mode}`);
        currentCameraRef.current = mode; // Update the ref
        switch (mode) {
            case 'orbital':
                camera.position.set(0, 30, 20);
                camera.lookAt(0, 0, 0);
                if (controlsRef.current) {
                    controlsRef.current.enabled = true;
                    controlsRef.current.target.set(0, 0, 0);
                    controlsRef.current.update();
                }
                break;
                
            case 'fixed':
                // Position camera behind player 1 (left player)
                if (players && players[0]) {
                    const player1 = players[0];
                    // Initialize fixed camera position
                    cameraPositionRef.current.set(player1.position.x - 10, 12, player1.position.z);
                    cameraTargetRef.current.set(player1.position.x + 15, 3, player1.position.z);
                    
                    camera.position.copy(cameraPositionRef.current);
                    camera.lookAt(cameraTargetRef.current);
                    console.log("Fixed camera positioned behind player", cameraPositionRef.current);
                }
                if (controlsRef.current) {
                    controlsRef.current.enabled = false;
                }
                break;
                
            default:
                camera.position.set(0, 30, 20);
                camera.lookAt(0, 0, 0);
        }
    };

    const updateFixedBehindCamera = (camera, player) => {
        if (!player) {
            console.log("No player found for fixed camera");
            return;
        }
        
        const smoothing = gameSettings.cameraSmoothing;
        
        // Target position: behind and above the player, always facing forward
        const targetPosition = new THREE.Vector3(
            player.position.x - 10, // Behind player
            player.position.y + 12,  // Above player
            player.position.z        // Same Z level as player
        );
        
        // Target look-at: ahead of the player
        const targetLookAt = new THREE.Vector3(
            player.position.x + 15,  // Look ahead
            player.position.y + 3,   // Slightly above court
            player.position.z        // Same Z level
        );
        
        // Debug logging occasionally
        if (Math.random() < 0.01) { // 1% chance each frame
            console.log("Fixed camera update:");
            console.log("Player position:", player.position);
            console.log("Target camera position:", targetPosition);
            console.log("Current camera position:", cameraPositionRef.current);
            console.log("Smoothing factor:", smoothing);
        }
        
        // Smooth camera movement
        cameraPositionRef.current.lerp(targetPosition, smoothing);
        cameraTargetRef.current.lerp(targetLookAt, smoothing);
        
        // Update camera position and look-at
        camera.position.copy(cameraPositionRef.current);
        camera.lookAt(cameraTargetRef.current);
    };

    const handleCameraChange = (newCamera) => {
        console.log(`Changing camera from ${currentCamera} to ${newCamera}`);
        setCurrentCamera(newCamera);
        currentCameraRef.current = newCamera; // Update the ref immediately
        
        // Also immediately setup the camera if refs are available
        if (cameraRef.current && playersRef.current && playersRef.current.length > 0) {
            console.log("Immediately setting up camera for mode:", newCamera);
            setupCamera(cameraRef.current, newCamera, playersRef.current);
        } else {
            console.log("Camera refs not ready yet, will setup in useEffect");
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;
        console.log("Game initializing...");
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        sceneRef.current = scene;

        // Camera with configurable FOV
        const camera = new THREE.PerspectiveCamera(gameSettings.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

        // Renderer with configurable quality
        const renderer = new THREE.WebGLRenderer({ antialias: gameSettings.antialiasing });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, gameSettings.quality === 'ultra' ? 2 : 1));
        renderer.shadowMap.enabled = gameSettings.shadows;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;
        containerRef.current.appendChild(renderer.domElement);

        // Controls (will be enabled/disabled based on camera mode)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;
        
        // Lights for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        if (gameSettings.shadows) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
        }
        scene.add(directionalLight);

        // Load the court
        loadCourt(scene);

        // Create ball
        const ball = createBall(scene);
        ballRef.current = ball;

        // Create players
        const playerStartPositions = [
            { x: -8, z: 0, rotation: Math.PI/2 }, // Left player facing forward (+Z axis)
            { x: 8, z: 0, rotation: -Math.PI/2 }  // Right player facing toward us (-Z axis)
        ];

        const players = playerStartPositions.map((pos, index) => {
            // Make players 70% of their previous size (0.84 = 1.2 * 0.7)
            const player = createPlayer(pos.x, pos.z, pos.rotation, 0.84);
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

        // Initialize camera position for fixed-behind mode
        cameraPositionRef.current.set(-18, 12, 0);
        cameraTargetRef.current.set(7, 3, 0);

        // Setup initial camera
        console.log("Setting up initial camera mode:", currentCamera);
        setupCamera(camera, currentCamera, players);

        // Update game settings
        if (gameStateRef.current) {
            gameStateRef.current.usePoseDetection = gameSettings.usePoseDetection;
            gameStateRef.current.debug = gameSettings.debug;
        }

        // Function to start the game
        function startGame() {
            initializeGame(players, ball, gameStateRef.current, playerDataRef.current);
        }
        
        // Setup pose detection
        async function setupPoseDetection() {
            if (!gameSettings.usePoseDetection) return;
            
            try {
                const poseDetector = new PoseDetector();
                await poseDetector.setup();
                
                // Register swing callback
                poseDetector.onSwing(() => {
                    console.log("Pose detection: Swing detected!");
                    handleSwing();
                });
                
                poseDetectorRef.current = poseDetector;
                console.log("Pose detection initialized");
            } catch (error) {
                console.error("Error setting up pose detection:", error);
                gameStateRef.current.usePoseDetection = false;
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
                handleBallHit(ball, gameState, player1, 0, swingDirection);
            }
        }
        
        // Function to handle keyboard input
        function handleKeyDown(event) {
            if (isMenuOpen) return; // Don't handle game keys when menu is open
            
            console.log(`Key pressed: ${event.code}`);
            
            if (event.code === 'Space') {
                event.preventDefault();
                handleSwing();
            } else if (event.code === 'Escape') {
                event.preventDefault();
                handleMenuToggle();
            }
        }

        // Menu toggle handler
        function handleGlobalKeyDown(event) {
            if (event.code === 'Escape') {
                event.preventDefault();
                handleMenuToggle();
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
                console.log("Animation loop running...", "Camera mode:", currentCameraRef.current);
                if (currentCameraRef.current === 'fixed' && players[0]) {
                    console.log("Player 1 position:", players[0].position);
                    console.log("Camera position:", camera.position);
                }
                logTimer = 0;
            }
            
            // Update controls only if enabled
            if (controlsRef.current && controlsRef.current.enabled) {
                controls.update();
            }
            
            // Update camera for fixed mode - Use ref instead of state
            if (currentCameraRef.current === 'fixed' && players[0]) {
                updateFixedBehindCamera(camera, players[0]);
            }
            
            // Update player positions occasionally even when ball not in play
            updatePlayerPositions(gameStateRef.current, playerDataRef.current, clock);
            
            // Update ball physics
            updateBallPhysics(ball, gameStateRef.current, delta, clock, players);
            
            // Update player AI behavior (only if AI is enabled)
            if (gameSettings.aiEnabled) {
                updatePlayer1AI(players, gameStateRef.current, playerDataRef.current, ball);
                updatePlayer2AI(players, gameStateRef.current, playerDataRef.current, ball);
            }
            
            // Move players
            players.forEach((player, index) => {
                const data = playerDataRef.current[index];
                
                // Update player movement
                updatePlayerMovement(player, data, delta);
                
                // Update player rotation - always face head-on (along Z axis)
                player.rotation.y = index === 0 ? Math.PI/2 : -Math.PI/2;
                
                // Update swing animation
                updatePlayerSwing(player, data, delta, index);
            });
            
            // Render
            renderer.render(scene, camera);
        }
        
        // Start game
        startGame();
        
        // Start animation
        animate();
        
        // Setup pose detection if enabled
        if (gameSettings.usePoseDetection) {
            setupPoseDetection();
        }
        
        // Add event listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleGlobalKeyDown);
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
            window.removeEventListener('keydown', handleGlobalKeyDown);
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
    }, [gameSettings]); // Removed currentCamera from dependency array

    // Separate effect to handle camera changes
    useEffect(() => {
        console.log("Camera change effect triggered. New camera:", currentCamera);
        if (cameraRef.current && playersRef.current && playersRef.current.length > 0) {
            console.log("Calling setupCamera for mode:", currentCamera);
            setupCamera(cameraRef.current, currentCamera, playersRef.current);
        }
    }, [currentCamera]);

    // Update game settings when they change
    useEffect(() => {
        if (gameStateRef.current) {
            gameStateRef.current.usePoseDetection = gameSettings.usePoseDetection;
            gameStateRef.current.debug = gameSettings.debug;
        }
        
        // Update camera FOV
        if (cameraRef.current) {
            cameraRef.current.fov = gameSettings.fov;
            cameraRef.current.updateProjectionMatrix();
        }
        
        // Update renderer settings
        if (rendererRef.current) {
            rendererRef.current.shadowMap.enabled = gameSettings.shadows;
            rendererRef.current.setPixelRatio(
                Math.min(window.devicePixelRatio, gameSettings.quality === 'ultra' ? 2 : 1)
            );
        }
    }, [gameSettings]);

    return (
        <>
            <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
            
            {/* Menu Button - Always visible */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 9999
            }}>
                <button
                    onClick={handleMenuToggle}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(79, 209, 199, 0.9)',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 5px 20px rgba(79, 209, 199, 0.4)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 8px 30px rgba(79, 209, 199, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 5px 20px rgba(79, 209, 199, 0.4)';
                    }}
                >
                    ⚙️
                </button>
            </div>

            {/* ESC Hint - Bottom right */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 9998,
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(10px)',
                opacity: isMenuOpen ? 0 : 1,
                transition: 'opacity 0.3s ease'
            }}>
                Press <strong>ESC</strong> for menu
            </div>

            {/* In-Game Menu */}
            <InGameMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onCameraChange={handleCameraChange}
                currentCamera={currentCamera}
                gameSettings={gameSettings}
                onSettingsChange={handleSettingsChange}
            />
        </>
    );
}

export default TennisGame; 