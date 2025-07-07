import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PoseDetector from '../poseDetection.js';

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

    // Instructions overlay
    const [instructions] = useState(
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '400px',
            fontFamily: 'Arial, sans-serif',
            zIndex: 100
        }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>Tennis Game Controls</h2>
            <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
                <li>Players move automatically</li>
                <li>SPACEBAR: Swing racket at ball</li>
                <li>Swing your arm to hit the ball (using webcam)</li>
                <li>Press SPACEBAR first to serve the ball</li>
                <li>Click anywhere to restart game</li>
            </ul>
            <p style={{ fontSize: '14px', color: '#aaa', margin: '10px 0 0 0' }}>
                If nothing moves, check browser console for errors
            </p>
        </div>
    );

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

        // Function to start the game
        function startGame() {
            initializeGame(players, ball, gameStateRef.current, playerDataRef.current);
        }
        
        // Setup pose detection
        async function setupPoseDetection() {
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
            console.log(`Key pressed: ${event.code}`);
            
            if (event.code === 'Space') {
                handleSwing();
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
            updateBallPhysics(ball, gameStateRef.current, delta, clock, players);
            
            // Update player AI behavior
            updatePlayer1AI(players, gameStateRef.current, playerDataRef.current, ball);
            updatePlayer2AI(players, gameStateRef.current, playerDataRef.current, ball);
            
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
        if (gameStateRef.current.usePoseDetection) {
            setupPoseDetection();
        }
        
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
            {instructions}
        </>
    );
}

export default TennisGame; 