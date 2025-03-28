import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import PoseDetector from './poseDetection';

function createPlayer(x, z, rotation, scale = 1) {
    const group = new THREE.Group();
    
    // Body (red shirt)
    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcc3333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.2;
    group.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE6D5 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.9;
    group.add(head);

    // Hair
    const hairGeometry = new THREE.BoxGeometry(0.65, 0.2, 0.65);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 2.3;
    group.add(hair);

    // Eyes
    const eyeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x4FA4FF });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.9, 0.3);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.9, 0.3);
    group.add(rightEye);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.3);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE6D5 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.55, 1.3, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.55, 1.3, 0);
    group.add(rightArm);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.35, 0.8, 0.35);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4477CC });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.4, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.4, 0);
    group.add(rightLeg);

    // Lower body (waist/shorts) - adjusted to fix intersection with shirt
    const pantsGeometry = new THREE.BoxGeometry(0.6, 0.25, 0.45);
    const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x4477CC });
    const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
    pants.position.y = 0.75; // Lowered slightly to avoid intersection with shirt
    group.add(pants);

    // Racket
    const racketGroup = new THREE.Group();
    
    // Racket head - make it bigger
    const racketHeadGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.05); // Increased from 0.4 to 0.7
    const racketHeadMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const racketHead = new THREE.Mesh(racketHeadGeometry, racketHeadMaterial);
    racketGroup.add(racketHead);

    // Racket handle - slightly longer
    const handleGeometry = new THREE.BoxGeometry(0.08, 0.6, 0.08); // Increased from 0.5 to 0.6
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -0.6; // Adjusted to match longer handle
    racketGroup.add(handle);

    // Position racket in right hand - attach to arm properly and move it outward
    if (rotation === Math.PI/2) { // Player 1 facing +Z axis
        // Attach racket directly to the right arm, but position it more outward
        racketGroup.position.set(0.2, 0, 0.4); // More outward from the body on Z axis
        rightArm.add(racketGroup); // Add to right arm
    } else { // Player 2 facing -Z axis
        // Attach racket directly to the right arm, but position it more outward
        racketGroup.position.set(0.2, 0, -0.4); // More outward from the body on negative Z axis
        rightArm.add(racketGroup); // Add to right arm
    }
    // Adjust initial orientation to be more natural with arm
    racketGroup.rotation.z = -Math.PI / 4;
    racketGroup.rotation.y = rotation === Math.PI/2 ? -Math.PI/8 : Math.PI/8;

    // Scale the entire player
    group.scale.set(scale, scale, scale);
    
    // Position the entire player
    group.position.set(x, 0, z);
    group.rotation.y = rotation;

    // Store references for animation
    group.userData = {
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        racketGroup,
        body,
        head
    };

    return group;
}

function ModelViewer() {
    const containerRef = useRef(null);
    const playersRef = useRef([]);
    const ballRef = useRef(null);
    const poseDetectorRef = useRef(null);
    const gameStateRef = useRef({
        ballVelocity: new THREE.Vector3(0, 0, 0),
        ballInPlay: false,
        waitingToServe: true,
        lastHitBy: null,
        score: { player1: 0, player2: 0 },
        debug: true, // Enable debugging
        lastMoveTime: 0, // Track last time players changed positions
        returnToCenter: {
            player1: false,
            player2: false
        },
        usePoseDetection: true // Enable pose detection
    });
    
    // Temp vars to store player movement data with court ends positions
    const playerData = useRef([
        { targetX: -8, targetZ: 0, isLeftSide: true, moveTime: 0, swinging: false, swingTime: 0 },
        { targetX: 8, targetZ: 0, isLeftSide: false, moveTime: 0, swinging: false, swingTime: 0 }
    ]);

    // Instructions overlay updated with pose detection
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

        // Load the original 3D court model
        const loader = new GLTFLoader();
        loader.load(
            '/models/court.glb',
            (gltf) => {
                console.log('Court loaded successfully');
                const model = gltf.scene;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.side = THREE.DoubleSide;
                            child.material.needsUpdate = true;
                        }
                    }
                });
                scene.add(model);
            },
            undefined,
            (error) => {
                console.error('Error loading court model:', error);
                // Fallback to simple court if model fails to load
                createSimpleCourt();
            }
        );

        // Fallback court creation function
        function createSimpleCourt() {
            const courtGeometry = new THREE.PlaneGeometry(20, 10);
            const courtMaterial = new THREE.MeshStandardMaterial({ color: 0x538a35, side: THREE.DoubleSide });
            const court = new THREE.Mesh(courtGeometry, courtMaterial);
            court.rotation.x = -Math.PI / 2; // Horizontal
            court.position.y = -0.01; // Slightly below players
            court.receiveShadow = true;
            scene.add(court);
            console.log('Using fallback simple court');
        }

        // Create ball - smaller ball for more realistic play
        const ballGeometry = new THREE.SphereGeometry(0.14, 32, 32); // Increased by 40% from 0.1
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow ball
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(-8, 1, 0); // Start position near player 1 at court end
        ball.castShadow = true;
        scene.add(ball);
        ballRef.current = ball;

        // Create players (smaller scale - now 70% of previous size)
        const playerStartPositions = [
            { x: -8, z: 0, rotation: Math.PI/2 }, // Left player facing forward (+Z axis)
            { x: 8, z: 0, rotation: -Math.PI/2 }  // Right player facing toward us (-Z axis)
        ];

        const players = playerStartPositions.map((pos, index) => {
            // Make players 70% of their previous size (0.84 = 1.2 * 0.7)
            const player = createPlayer(pos.x, pos.z, pos.rotation, 0.84);
            scene.add(player);
            
            // Store the initial player data
            playerData.current[index] = {
                ...playerData.current[index],
                legPhase: 0,
                x: pos.x,
                z: pos.z,
                homeX: pos.x, // Store home position
                homeZ: pos.z   // Store home position
            };
            
            return player;
        });
        
        playersRef.current = players;

        // Function to start the game
        function startGame() {
            console.log("Starting game!");
            
            // Reset player positions to court ends
            players[0].position.set(-8, 0, 0);
            players[1].position.set(8, 0, 0);
            
            // Players face head-on (toward center court Z axis)
            players[0].rotation.y = Math.PI/2; // Facing forward (+Z axis)
            players[1].rotation.y = -Math.PI/2; // Facing toward us (-Z axis)
            
            // Reset ball position to be in front of player 1's racket
            const player1 = players[0];
            // Position ball where the racket can hit it
            ball.position.set(
                player1.position.x + 0.6, // Slightly in front
                1.3,                      // Racket height
                player1.position.z + 0.5  // Offset to be hittable by racket
            );
            
            // Initial state
            const gameState = gameStateRef.current;
            gameState.ballVelocity.set(0, 0, 0);
            gameState.ballInPlay = false;
            gameState.waitingToServe = true;
            gameState.lastHitBy = null;
            gameState.lastMoveTime = 0;
            gameState.returnToCenter = { player1: false, player2: false };
            
            // Set players to be at center of their court sides, but further back
            playerData.current[0].targetX = -8;
            playerData.current[0].targetZ = 0;
            playerData.current[1].targetX = 8;
            playerData.current[1].targetZ = 0;
            
            console.log("Game started. Press SPACEBAR to serve the ball.");
        }
        
        // Function to update random player positions occasionally
        function updatePlayerPositions() {
            const now = clock.getElapsedTime();
            const gameState = gameStateRef.current;
            
            // Update positions every 3-5 seconds - but only if players are not returning to center
            // and not actively chasing the ball
            if (now - gameState.lastMoveTime > 3 + Math.random() * 2 && 
                !gameState.returnToCenter.player1 && 
                !gameState.returnToCenter.player2 && 
                (!gameState.ballInPlay || 
                (gameState.ballVelocity.x > 0 && gameState.lastHitBy === 0) || 
                (gameState.ballVelocity.x < 0 && gameState.lastHitBy === 1))) {
                
                gameState.lastMoveTime = now;
                
                // Player 1 - left side of court (-9 to -4)
                const player1Data = playerData.current[0];
                player1Data.targetX = -9 + Math.random() * 5; // Stay on left side, further back
                player1Data.targetZ = -4 + Math.random() * 8; // Full width of court
                
                // Player 2 - right side of court (4 to 9)
                const player2Data = playerData.current[1];
                player2Data.targetX = 4 + Math.random() * 5; // Stay on right side, further back
                player2Data.targetZ = -4 + Math.random() * 8; // Full width of court
                
                console.log(`Players moving to new positions: P1(${player1Data.targetX.toFixed(1)}, ${player1Data.targetZ.toFixed(1)}), P2(${player2Data.targetX.toFixed(1)}, ${player2Data.targetZ.toFixed(1)})`);
            }
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
            
            // Swing racket animation
            const playerData1 = playerData.current[0];
            if (!playerData1.swinging) {
                playerData1.swinging = true;
                playerData1.swingTime = 0;
                
                console.log("Player 1 swinging racket!");
                
                // Get racket position in world space
                const rightArm = player1.userData.rightArm;
                const racketGroup = player1.userData.racketGroup;
                const racketPos = new THREE.Vector3();
                
                // Get racket's world position for more accurate collision
                racketGroup.getWorldPosition(racketPos);
                
                // Calculate racket-to-ball distance instead of player-to-ball
                const racketToBallDistance = racketPos.distanceTo(ball.position);
                console.log("Racket to ball distance: " + racketToBallDistance.toFixed(2));
                
                // If ball not in play yet and racket is close enough, serve it
                if (!gameState.ballInPlay && racketToBallDistance < 1.2) {
                    gameState.ballInPlay = true;
                    gameState.waitingToServe = false;
                    
                    // Direct the serve clearly toward player 2 with better trajectory
                    const targetX = 8; // Player 2's position
                    const targetZ = 0; // Center of the court
                    
                    // Calculate direction to target
                    const dirVec = new THREE.Vector3(targetX - player1.position.x, 6, targetZ - player1.position.z);
                    dirVec.normalize();
                    
                    // Add velocity with slight randomness for variation
                    gameState.ballVelocity.set(
                        dirVec.x * (12 + Math.random() * 2), // Consistent X direction toward player 2
                        6 + Math.random(),                   // Good arc height
                        dirVec.z * (4 + Math.random() * 2)   // Z direction toward center with slight variation
                    );
                    
                    gameState.lastHitBy = 0;
                    console.log("Ball served toward player 2!");
                } 
                // If ball is close to racket during play, hit it
                else if (racketToBallDistance < 1.0) { 
                    // Calculate new velocity based on swing direction
                    const baseSpeed = 12 + Math.random() * 3; // Base speed
                    const arcHeight = 6 + Math.random() * 2;  // Arc height
                    
                    // Determine Z direction based on swing direction
                    let zVelocity;
                    if (swingDirection === 'left') {
                        zVelocity = -4 - Math.random() * 2; // Hit to the left
                    } else if (swingDirection === 'right') {
                        zVelocity = 4 + Math.random() * 2;  // Hit to the right
                    } else {
                        zVelocity = (Math.random() - 0.5) * 4; // Random direction
                    }
                    
                    // Set velocity with the determined direction
                    gameState.ballVelocity.set(
                        baseSpeed,  // Always going right from player 1
                        arcHeight,  // Arc height
                        zVelocity   // Z direction based on swing
                    );
                    
                    gameState.lastHitBy = 0;
                    // Flag player 1 to return to center
                    gameState.returnToCenter.player1 = true;
                    console.log("Ball hit by player 1! Direction:", swingDirection);
                } else {
                    console.log("Swing missed - ball too far from racket! Distance: " + racketToBallDistance.toFixed(2));
                }
            }
        }
        
        // Function to handle keyboard input - updated to use handleSwing
        function handleKeyDown(event) {
            console.log(`Key pressed: ${event.code}`);
            
            if (event.code === 'Space') {
                handleSwing();
            }
        }
        
        // Ball physics update
        function updateBallPhysics(delta) {
            const gameState = gameStateRef.current;
            
            // Keep ball with player 1 if waiting to serve
            if (!gameState.ballInPlay && gameState.waitingToServe) {
                const player1 = players[0];
                
                // Position ball in front of player's racket - aligned with bigger racket
                const rightArm = player1.userData.rightArm;
                // Convert position from local space to world space
                const worldPos = new THREE.Vector3();
                rightArm.getWorldPosition(worldPos);
                
                ball.position.x = worldPos.x + 0.4; // Adjusted for bigger racket
                ball.position.z = worldPos.z + 0.6; // Adjusted for bigger racket
                ball.position.y = 1.3;              // Racket height
                return;
            }
            
            if (!gameState.ballInPlay) return;
            
            // Apply gravity
            gameState.ballVelocity.y -= 9.8 * delta;
            
            // Update position
            ball.position.x += gameState.ballVelocity.x * delta;
            ball.position.y += gameState.ballVelocity.y * delta;
            ball.position.z += gameState.ballVelocity.z * delta;
            
            // Prevent ball from going below ground with stronger bounce
            if (ball.position.y < 0.14) { // Adjusted for new ball size (from 0.1 to 0.14)
                ball.position.y = 0.14;
                // Stronger bounce - increased from 0.7 to 0.85
                gameState.ballVelocity.y = Math.abs(gameState.ballVelocity.y) * 0.85;
                
                // If ball hits ground, check for scoring
                if (Math.abs(ball.position.x) > 10) {
                    console.log("Ball out of bounds!");
                    resetBall();
                }
            }
            
            // Ball out of bounds check
            if (Math.abs(ball.position.x) > 12 || Math.abs(ball.position.z) > 7 || ball.position.y > 15) {
                console.log("Ball out of bounds!");
                resetBall();
            }
            
            // Log ball state every few seconds for debugging
            if (gameState.debug && Math.floor(clock.elapsedTime * 10) % 30 === 0) {
                console.log(`Ball pos: (${ball.position.x.toFixed(2)}, ${ball.position.y.toFixed(2)}, ${ball.position.z.toFixed(2)})`);
                console.log(`Ball velocity: (${gameState.ballVelocity.x.toFixed(2)}, ${gameState.ballVelocity.y.toFixed(2)}, ${gameState.ballVelocity.z.toFixed(2)})`);
            }
        }
        
        // Reset ball after point
        function resetBall() {
            const gameState = gameStateRef.current;
            gameState.ballInPlay = false;
            gameState.waitingToServe = true;
            
            // Set ball back to player 1's racket position
            const player1 = players[0];
            // Position ball where the racket can hit it
            ball.position.set(
                player1.position.x + 0.6, // Slightly in front
                1.3,                      // Racket height
                player1.position.z + 0.5  // Offset to be hittable by racket
            );
            gameState.ballVelocity.set(0, 0, 0);
            
            console.log("Ball reset. Press SPACEBAR to serve again.");
        }
        
        // Player 1 AI movement (simpler than player 2)
        function updatePlayer1AI(delta) {
            const player1 = players[0];
            const gameState = gameStateRef.current;
            const playerData1 = playerData.current[0];
            
            // Check if player should return to center
            if (gameState.returnToCenter.player1) {
                playerData1.targetX = playerData1.homeX; // Return to home X position
                playerData1.targetZ = playerData1.homeZ; // Return to home Z position
                
                // Check if player is close to center position
                const dx = playerData1.targetX - player1.position.x;
                const dz = playerData1.targetZ - player1.position.z;
                const distanceToCenter = Math.sqrt(dx * dx + dz * dz);
                
                if (distanceToCenter < 0.5) {
                    gameState.returnToCenter.player1 = false; // Reset the flag once player reaches center
                    console.log("Player 1 reached home position");
                }
            }
            // Chase the ball only if not returning to center and ball is coming toward player
            else if (gameState.ballInPlay && gameState.lastHitBy !== 0 && gameState.ballVelocity.x < 0) {
                // Predict where ball will land
                let targetX = -8;
                let targetZ = 0;
                
                // Ball coming toward player 1
                const timeToReach = (player1.position.x - ball.position.x) / gameState.ballVelocity.x;
                if (timeToReach > 0) {
                    // Calculate predicted landing position
                    targetZ = ball.position.z + gameState.ballVelocity.z * timeToReach;
                    
                    // Position player to the right of the ball from their perspective
                    // For player 1 (facing +Z), the right side is +Z direction
                    targetZ = targetZ + 1.2; // Position more to the right of the ball
                    
                    // Keep player 1 in his half of the court - but closer to center for better reach
                    targetX = Math.min(-4, Math.max(-9, ball.position.x - 0.8));
                }
                
                // Clamp to court bounds
                targetZ = Math.max(-4, Math.min(4, targetZ));
                
                // Update target
                playerData1.targetX = targetX;
                playerData1.targetZ = targetZ;
                
                // Add debug logging to track player 1's target when ball approaches
                if (gameState.debug && ball.position.x < -3 && Math.abs(ball.position.x - player1.position.x) < 5) {
                    console.log(`Player 1 targeting: X=${targetX.toFixed(2)}, Z=${targetZ.toFixed(2)}, Ball at: X=${ball.position.x.toFixed(2)}, Z=${ball.position.z.toFixed(2)}`);
                }
            }
        }
        
        // AI player logic
        function updatePlayerAI(delta) {
            // Player 2 AI
            const player2 = players[1];
            const gameState = gameStateRef.current;
            const playerData2 = playerData.current[1];
            
            // Check if player should return to center
            if (gameState.returnToCenter.player2) {
                playerData2.targetX = playerData2.homeX; // Return to home X position 
                playerData2.targetZ = playerData2.homeZ; // Return to home Z position
                
                // Check if player is close to center position
                const dx = playerData2.targetX - player2.position.x;
                const dz = playerData2.targetZ - player2.position.z;
                const distanceToCenter = Math.sqrt(dx * dx + dz * dz);
                
                if (distanceToCenter < 0.5) {
                    gameState.returnToCenter.player2 = false; // Reset the flag once player reaches center
                    console.log("Player 2 reached home position");
                }
            }
            // Chase the ball only if not returning to center and ball is coming toward player
            else if (gameState.ballInPlay && gameState.lastHitBy !== 1) {
                // Predict where ball will land
                let targetX = 8;
                let targetZ = 0;
                
                // Simple prediction - improve accuracy
                if (gameState.ballVelocity.x > 0) {
                    // Ball coming toward player 2
                    const timeToReach = (player2.position.x - ball.position.x) / gameState.ballVelocity.x;
                    if (timeToReach > 0) {
                        // Calculate predicted landing position
                        targetZ = ball.position.z + gameState.ballVelocity.z * timeToReach;
                        
                        // Position player to the right of the ball from their perspective
                        // For player 2 (facing -Z), the right side is -Z direction
                        targetZ = targetZ - 1.5; // Position more to the right of the ball
                        
                        // Move closer to ball for better chance of hitting
                        targetX = Math.max(4, Math.min(9, ball.position.x + 0.8));
                    }
                }
                
                // Clamp to court bounds
                targetZ = Math.max(-4, Math.min(4, targetZ));
                
                // Update target
                playerData2.targetX = targetX;
                playerData2.targetZ = targetZ;
                
                // Add debug logging to track player 2's target when ball approaches
                if (gameState.debug && ball.position.x > 3 && Math.abs(ball.position.x - player2.position.x) < 5) {
                    console.log(`Player 2 targeting: X=${targetX.toFixed(2)}, Z=${targetZ.toFixed(2)}, Ball at: X=${ball.position.x.toFixed(2)}, Z=${ball.position.z.toFixed(2)}`);
                }
            }
            
            // Improve player 2's ability to hit the ball with racket-based detection
            if (gameState.ballInPlay && !playerData2.swinging) {
                // Get racket position in world space
                const rightArm = player2.userData.rightArm;
                const racketGroup = player2.userData.racketGroup;
                const racketPos = new THREE.Vector3();
                
                // Get racket's world position for more accurate collision
                racketGroup.getWorldPosition(racketPos);
                
                // Calculate racket-to-ball distance instead of player-to-ball
                const racketToBallDistance = racketPos.distanceTo(ball.position);
                
                // More precise hit detection based on racket position
                if (racketToBallDistance < 1.0 && gameState.ballVelocity.x > 0) {
                    playerData2.swinging = true;
                    playerData2.swingTime = 0;
                    
                    // Calculate new velocity with more controlled randomness
                    const angleVariation = Math.random() * 0.3 - 0.15; // -15% to +15% angle variation
                    
                    // Apply angle variation to create more varied shots
                    const xVelocity = -1 * (12 + Math.random() * 3); // Faster return
                    const yVelocity = 6 + Math.random() * 2; // Higher arc
                    const zVelocity = (Math.random() - 0.5) * 4; // More controlled z variation
                    
                    // Calculate normalized direction vector and then apply angle variation
                    const magnitude = Math.sqrt(xVelocity * xVelocity + zVelocity * zVelocity);
                    const normalizedX = xVelocity / magnitude;
                    const normalizedZ = zVelocity / magnitude;
                    
                    // Apply rotation to the normalized vector
                    const rotatedX = normalizedX * Math.cos(angleVariation) - normalizedZ * Math.sin(angleVariation);
                    const rotatedZ = normalizedX * Math.sin(angleVariation) + normalizedZ * Math.cos(angleVariation);
                    
                    // Set final velocity
                    gameState.ballVelocity.set(
                        rotatedX * magnitude,
                        yVelocity,
                        rotatedZ * magnitude
                    );
                    
                    gameState.lastHitBy = 1;
                    // Flag player 2 to return to center
                    gameState.returnToCenter.player2 = true;
                    console.log("Ball hit by player 2! Racket distance: " + racketToBallDistance.toFixed(2));
                }
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
            updatePlayerPositions();
            
            // Update ball physics
            updateBallPhysics(delta);
            
            // Update player AI behavior
            updatePlayerAI(delta);
            updatePlayer1AI(delta);
            
            // Move players
            players.forEach((player, index) => {
                const data = playerData.current[index];
                
                // Calculate direction to target
                const dx = data.targetX - player.position.x;
                const dz = data.targetZ - player.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // Movement speed
                const speed = 4.5; // Even faster movement
                const moveSpeed = speed * delta;
                
                // If not at target, move toward it
                if (distance > 0.1) {
                    // Movement direction
                    const moveX = (dx / distance) * moveSpeed;
                    const moveZ = (dz / distance) * moveSpeed;
                    
                    // Update position
                    player.position.x += moveX;
                    player.position.z += moveZ;
                    
                    // Player rotation - always face head-on (along Z axis)
                    player.rotation.y = index === 0 ? Math.PI/2 : -Math.PI/2;
                    
                    // Walking animation
                    data.legPhase += delta * 8;
                    
                    // Leg movement
                    const legRotation = Math.sin(data.legPhase) * 0.4;
                    player.userData.leftLeg.rotation.x = legRotation;
                    player.userData.rightLeg.rotation.x = -legRotation;
                    
                    // Head bounce
                    const bounce = Math.abs(Math.sin(data.legPhase * 2)) * 0.05;
                    player.userData.head.position.y = 1.9 + bounce;
                    
                    // Arm swing while walking
                    if (!data.swinging) {
                        const armRotation = Math.sin(data.legPhase) * 0.3;
                        player.userData.leftArm.rotation.x = armRotation;
                        player.userData.rightArm.rotation.x = -armRotation;
                        player.userData.racketGroup.rotation.x = -armRotation * 0.5;
                    }
                } else {
                    // Reset walking animation when stopped
                    if (!data.swinging) {
                        player.userData.leftLeg.rotation.x = 0;
                        player.userData.rightLeg.rotation.x = 0;
                        player.userData.leftArm.rotation.x = 0;
                        player.userData.rightArm.rotation.x = 0;
                        player.userData.racketGroup.rotation.x = 0;
                    }
                    player.userData.head.position.y = 1.9;
                }
                
                // Manage racket swing animation
                if (data.swinging) {
                    data.swingTime += delta;
                    
                    // Swing animation over 0.25 seconds (faster)
                    const swingProgress = Math.min(data.swingTime / 0.25, 1);
                    
                    // Create a more realistic tennis swing
                    if (index === 0) { // Player 1 (facing +Z)
                        // Forehand swing animation (combination of arm rotations)
                        const armRotZ = Math.sin(swingProgress * Math.PI) * -0.8; // Side swing
                        const armRotY = Math.sin(swingProgress * Math.PI) * 0.4;  // Forward rotation
                        const armRotX = Math.sin(swingProgress * Math.PI) * -1.2; // Downward/upward motion
                        
                        player.userData.rightArm.rotation.z = armRotZ;
                        player.userData.rightArm.rotation.y = armRotY;
                        player.userData.rightArm.rotation.x = armRotX;
                    } else { // Player 2 (facing -Z)
                        // Mirror the swing for player 2
                        const armRotZ = Math.sin(swingProgress * Math.PI) * 0.8;  // Side swing (mirrored)
                        const armRotY = Math.sin(swingProgress * Math.PI) * -0.4; // Forward rotation (mirrored)
                        const armRotX = Math.sin(swingProgress * Math.PI) * -1.2; // Downward/upward motion
                        
                        player.userData.rightArm.rotation.z = armRotZ;
                        player.userData.rightArm.rotation.y = armRotY;
                        player.userData.rightArm.rotation.x = armRotX;
                    }
                    
                    // End swing
                    if (swingProgress >= 1) {
                        data.swinging = false;
                        // Reset arm rotation
                        player.userData.rightArm.rotation.set(0, 0, 0);
                    }
                }
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

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ModelViewer />
    </React.StrictMode>
); 