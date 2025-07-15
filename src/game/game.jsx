import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PoseDetector from '../poseDetection.js';

// Import game modules
import { createPlayer, updatePlayerMovement, updatePlayerSwing, updatePlayerPose, toggleRacketDebug } from './player.js';
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

// Create in-game menu system using DOM overlay
function createInGameMenu(onMenuAction) {
    console.log('🎮 Creating DOM-based in-game menu...');
    
    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.id = 'game-menu';
    menuContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        font-family: 'Inter', Arial, sans-serif;
    `;
    
    // Create menu panel
    const menuPanel = document.createElement('div');
    menuPanel.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        border: 3px solid #4fd1c7;
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        max-width: 500px;
        width: 90%;
    `;
    
    // Create menu title
    const title = document.createElement('h1');
    title.textContent = 'GAME MENU';
    title.style.cssText = `
        color: #4fd1c7;
        font-size: 48px;
        font-weight: bold;
        margin: 0 0 30px 0;
        text-shadow: 0 0 20px rgba(79, 209, 199, 0.5);
    `;
    
    // Menu options data
    const menuOptions = [
        { text: '▶ Resume Game', key: 'ESC', action: 'resume' },
        { text: '🎮 Toggle Camera', key: 'C', action: 'camera' },
        { text: '⚙️ Debug Mode', key: 'D', action: 'debug' },
        { text: '🔄 Restart Game', key: '', action: 'restart' }
    ];
    
    // Create menu buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 30px;
    `;
    
    const buttons = [];
    menuOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.dataset.action = option.action;
        button.style.cssText = `
            background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 20px;
            font-weight: bold;
            padding: 15px 30px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
        
        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
            button.style.background = 'linear-gradient(135deg, #81c784 0%, #4fd1c7 100%)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            button.style.background = 'linear-gradient(135deg, #4fd1c7 0%, #81c784 100%)';
        });
        
        // Click handler
        button.addEventListener('click', () => {
            console.log('Menu button clicked:', option.action);
            onMenuAction(option.action);
        });
        
        buttons.push(button);
        buttonContainer.appendChild(button);
    });
    
    // Create instructions
    const instructions = document.createElement('div');
    instructions.innerHTML = `
        <div style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            <p><strong>Game Controls:</strong></p>
            <p>ESC - Toggle this menu</p>
            <p>SPACEBAR - Swing racket</p>
            <p>Mouse - Rotate camera (free mode)</p>
            <p>Scroll - Zoom in/out (free mode)</p>
        </div>
    `;
    
    // Assemble menu
    menuPanel.appendChild(title);
    menuPanel.appendChild(buttonContainer);
    menuPanel.appendChild(instructions);
    menuContainer.appendChild(menuPanel);
    
    // Add to document
    document.body.appendChild(menuContainer);
    
    console.log('✅ DOM menu created and added to document body');
    
    return {
        show: () => {
            console.log('📖 SHOWING MENU - DOM overlay');
            menuContainer.style.display = 'flex';
        },
        hide: () => {
            console.log('📖 HIDING MENU - DOM overlay');
            menuContainer.style.display = 'none';
        },
        isVisible: () => {
            const visible = menuContainer.style.display === 'flex';
            return visible;
        },
        destroy: () => {
            if (document.body.contains(menuContainer)) {
                document.body.removeChild(menuContainer);
            }
        }
    };
}

function TennisGame() {
    const containerRef = useRef(null);
    const playersRef = useRef([]);
    const ballRef = useRef(null);
    const poseDetectorRef = useRef(null);
    const gameStateRef = useRef(createGameState());
    const playerDataRef = useRef(createPlayerData());
    const menuRef = useRef(null);
    const controlsRef = useRef(null);
    const cameraRef = useRef(null);
    const cameraModeRef = useRef('free'); // Start in free mode so controls work
    
    // Instructions overlay (coexists with menu)
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
                <li>ESC - Toggle menu</li>
                <li>SPACEBAR - Swing racket at ball</li>
                <li>C - Toggle camera mode</li>
                <li>Mouse drag - Rotate camera (free mode)</li>
                <li>Scroll - Zoom in/out (free mode)</li>
            </ul>
            <p style={{ fontSize: '14px', color: '#aaa', margin: '10px 0 0 0' }}>
                Camera controls work in FREE mode only!
            </p>
        </div>
    );

    useEffect(() => {
        if (!containerRef.current) return;
        console.log("Game initializing...");
        console.log("🎮 Camera mode:", cameraModeRef.current);
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);

        // Camera setup - start in free mode for working controls
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;
        
        // Free camera with overview of scene
        camera.position.set(0, 30, 20);
        camera.lookAt(0, 0, 0);
        console.log('Camera mode: FREE - Orbital controls enabled');

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        renderer.shadowMap.enabled = true;
        containerRef.current.appendChild(renderer.domElement);
        
        // Ensure canvas can receive mouse events properly
        const canvas = renderer.domElement;
        canvas.style.display = 'block';
        canvas.style.outline = 'none';
        canvas.style.userSelect = 'none';
        canvas.style.touchAction = 'none';
        
        console.log('🖼️ Renderer setup complete');

        // Controls - PROPERLY configured for working camera controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 5;
        controls.maxDistance = 100;
        controls.maxPolarAngle = Math.PI * 0.85;
        controls.minPolarAngle = Math.PI * 0.1;
        controls.target.set(0, 0, 0);
        
        // Enable controls since we start in free mode
        controls.enabled = (cameraModeRef.current === 'free');
        controlsRef.current = controls;
        
        console.log('✅ Orbital controls created, enabled:', controls.enabled);
        
        // Create in-game menu
        const menu = createInGameMenu((action) => {
            if (action === 'resume') {
                menu.hide();
            } else if (action === 'camera') {
                toggleCameraMode();
                menu.hide();
            } else if (action === 'debug') {
                gameStateRef.current.debug = !gameStateRef.current.debug;
                console.log('Debug mode:', gameStateRef.current.debug ? 'ON' : 'OFF');
                playersRef.current.forEach((player, index) => {
                    toggleRacketDebug(player, gameStateRef.current.debug);
                });
                menu.hide();
            } else if (action === 'restart') {
                startGame();
                menu.hide();
            }
        });
        menuRef.current = menu;
        
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
            { x: -8, z: -1, rotation: Math.PI/2 }, // Left player slightly left of center
            { x: 8, z: 1, rotation: -Math.PI/2 }   // Right player slightly right of center
        ];

        const players = playerStartPositions.map((pos, index) => {
            const player = createPlayer(pos.x, pos.z, pos.rotation, 0.84);
            scene.add(player);
            
            // Store the initial player data
            const playerData = playerDataRef.current[index];
            playerData.x = pos.x;
            playerData.z = pos.z;
            playerData.homeX = pos.x;
            playerData.homeZ = pos.z;
            
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
            const menu = menuRef.current;
            if (!menu) {
                console.error('Menu not found in menuRef.current');
                return;
            }

            if (menu.isVisible()) {
                console.log("Menu is visible, not swinging.");
                return;
            }
            
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
        
        // Function to toggle camera mode
        function toggleCameraMode() {
            const newMode = cameraModeRef.current === 'fixed' ? 'free' : 'fixed';
            cameraModeRef.current = newMode;
            
            const camera = cameraRef.current;
            const controls = controlsRef.current;
            
            if (newMode === 'fixed') {
                // Switch to fixed camera
                camera.position.set(-14, 8, 0);
                camera.lookAt(0, 2, 0);
                controls.enabled = false;
                console.log('Switched to FIXED camera mode - controls disabled');
            } else {
                // Switch to free camera
                camera.position.set(0, 30, 20);
                camera.lookAt(0, 0, 0);
                controls.target.set(0, 0, 0);
                controls.enabled = true;
                controls.update();
                console.log('Switched to FREE camera mode - controls enabled!');
            }
        }
        
        // Function to handle keyboard input
        function handleKeyDown(event) {
            console.log(`Key pressed: ${event.code}`);
            
            if (event.code === 'Escape') {
                // Toggle menu
                const menu = menuRef.current;
                if (!menu) {
                    console.error('Menu not found in menuRef.current');
                    return;
                }
                
                if (menu.isVisible()) {
                    console.log('Hiding menu');
                    menu.hide();
                } else {
                    console.log('Showing menu');
                    menu.show();
                }
            } else if (event.code === 'Space') {
                handleSwing();
            } else if (event.code === 'KeyC') {
                toggleCameraMode();
            } else if (event.code === 'KeyD') {
                // Toggle debug mode
                gameStateRef.current.debug = !gameStateRef.current.debug;
                console.log('Debug mode:', gameStateRef.current.debug ? 'ON' : 'OFF');
                
                // Toggle racket collision debug spheres
                players.forEach((player, index) => {
                    toggleRacketDebug(player, gameStateRef.current.debug);
                });
            }
        }
        
        // Handle clicks on canvas
        function handleCanvasClick(event) {
            const menu = menuRef.current;
            if (!menu) {
                console.error('Menu not found in menuRef.current');
                return;
            }

            // If menu is visible, don't start game
            if (menu.isVisible()) {
                return;
            }
            
            // Start game if menu is closed and canvas is clicked
            startGame();
        }
        
        // Animation loop
        const clock = new THREE.Clock();
        
        // Create status display element
        const statusDisplay = document.createElement('div');
        statusDisplay.style.position = 'absolute';
        statusDisplay.style.top = '20px';
        statusDisplay.style.right = '20px';
        statusDisplay.style.background = 'rgba(0,0,0,0.7)';
        statusDisplay.style.color = '#00ff00';
        statusDisplay.style.padding = '10px';
        statusDisplay.style.borderRadius = '5px';
        statusDisplay.style.fontFamily = 'monospace';
        statusDisplay.style.fontSize = '14px';
        statusDisplay.style.zIndex = '102';
        statusDisplay.innerHTML = 'Camera: FREE | Controls: ✅ WORKING';
        document.body.appendChild(statusDisplay);
        
        function animate() {
            requestAnimationFrame(animate);
            
            const delta = Math.min(clock.getDelta(), 0.1);
            
            // Update status display
            statusDisplay.innerHTML = `Camera: ${cameraModeRef.current.toUpperCase()} | Controls: ${cameraModeRef.current === 'free' ? '✅ ACTIVE' : '🔒 FIXED'} | Menu: ${menuRef.current?.isVisible() ? '🟢 OPEN' : '🔴 CLOSED'}`;
            
            // Update controls in free camera mode
            if (controls && cameraModeRef.current === 'free') {
                controls.update();
            }
            
            // Update fixed camera to follow player 1 in fixed mode
            if (cameraModeRef.current === 'fixed' && players.length > 0) {
                const player1 = players[0];
                
                // Position camera behind player 1
                const targetCameraX = player1.position.x - 6;
                const targetCameraY = player1.position.y + 6;
                const targetCameraZ = player1.position.z;
                
                // Smooth camera following with lerp
                camera.position.x += (targetCameraX - camera.position.x) * 0.05;
                camera.position.y += (targetCameraY - camera.position.y) * 0.05;
                camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
                
                // Always look straight ahead toward court center
                camera.lookAt(0, 2, player1.position.z);
            }
            
            // Update game only when menu is closed
            if (!menuRef.current?.isVisible()) {
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
                    
                    // Update player pose based on pose detection (only for player 1)
                    if (index === 0 && poseDetectorRef.current) {
                        updatePlayerPose(player, poseDetectorRef.current, index);
                    }
                });
            }
            
            // Render
            renderer.render(scene, camera);
        }
        
        // Start game
        startGame();
        
        // Display helpful controls in console
        console.log("🎾 TENNIS GAME CONTROLS:");
        console.log("⌨️  ESC - Toggle in-game menu");
        console.log("⌨️  SPACEBAR - Serve/Hit ball");
        console.log("⌨️  C - Toggle camera mode (Fixed/Free)");
        console.log("⌨️  D - Toggle debug mode");
        console.log("🖱️  MOUSE - Click and drag to rotate camera (free mode)");
        console.log("🖱️  SCROLL - Zoom in/out (free mode)");
        
        // Start animation
        animate();
        
        // Setup pose detection if enabled
        if (gameStateRef.current.usePoseDetection) {
            setupPoseDetection();
        }
        
        // Add event listeners
        window.addEventListener('keydown', handleKeyDown);
        renderer.domElement.addEventListener('click', handleCanvasClick);
        
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
            renderer.domElement.removeEventListener('click', handleCanvasClick);
            
            // Clean up orbital controls
            if (controls) {
                controls.dispose();
            }
            
            renderer.dispose();
            
            // Clean up pose detector
            if (poseDetectorRef.current) {
                poseDetectorRef.current.cleanup();
            }
            
            // Clean up status display
            if (statusDisplay && document.body.contains(statusDisplay)) {
                document.body.removeChild(statusDisplay);
            }
            
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }

            // Clean up DOM menu
            if (menuRef.current) {
                menuRef.current.destroy();
            }
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