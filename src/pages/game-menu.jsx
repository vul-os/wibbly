import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const GameMenu = ({ onStartTennis }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedGame, setSelectedGame] = useState('tennis');

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup for rotating court
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xe0f2f1, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);

    sceneRef.current = { scene, camera, renderer };

    // Enhanced lighting for ocean breeze theme
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x4fd1c7, 1.2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x81c784, 0.8);
    pointLight1.position.set(-10, 15, -10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x26a69a, 0.6);
    pointLight2.position.set(10, 15, -10);
    scene.add(pointLight2);

    // Court group for rotation
    const courtGroup = new THREE.Group();
    scene.add(courtGroup);

    // Load the tennis court
    const loader = new GLTFLoader();
    loader.load(
      '/models/court.glb',
      (gltf) => {
        console.log('Court loaded for menu');
        const court = gltf.scene;
        court.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
            }
          }
        });
        court.scale.set(1.2, 1.2, 1.2); // Make court slightly bigger
        courtGroup.add(court);
        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Error loading court:', error);
        // Fallback court
        createFallbackCourt();
        setIsLoaded(true);
      }
    );

    // Fallback court if model fails
    function createFallbackCourt() {
      const courtGeometry = new THREE.PlaneGeometry(24, 12);
      const courtMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2d7d32,
        side: THREE.DoubleSide 
      });
      const court = new THREE.Mesh(courtGeometry, courtMaterial);
      court.rotation.x = -Math.PI / 2;
      court.receiveShadow = true;
      
      // Add court lines
      const lineGeometry = new THREE.PlaneGeometry(24.2, 12.2);
      const lineMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide 
      });
      const lines = new THREE.Mesh(lineGeometry, lineMaterial);
      lines.rotation.x = -Math.PI / 2;
      lines.position.y = 0.01;
      
      courtGroup.add(court);
      courtGroup.add(lines);
    }

    // Add floating tennis balls around the court
    const balls = [];
    for (let i = 0; i < 8; i++) {
      const ballGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffff00,
        emissive: 0x333300
      });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      ball.position.x = Math.cos(angle) * 15;
      ball.position.y = 3 + Math.sin(i) * 2;
      ball.position.z = Math.sin(angle) * 15;
      
      ball.userData = {
        originalY: ball.position.y,
        floatSpeed: 0.02 + Math.random() * 0.01,
        phase: i
      };
      
      scene.add(ball);
      balls.push(ball);
    }

    // Position camera for good menu view
    camera.position.set(0, 25, 30);
    camera.lookAt(0, 0, 0);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let time = 0;
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.005;

      // Slowly rotate the court
      courtGroup.rotation.y = time * 0.3;

      // Float the tennis balls
      balls.forEach((ball) => {
        ball.position.y = ball.userData.originalY + 
          Math.sin(time * ball.userData.floatSpeed + ball.userData.phase) * 1.5;
        ball.rotation.x += 0.01;
        ball.rotation.y += 0.015;
      });

      // Gentle camera sway
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.position.z = 30 + Math.cos(time * 0.1) * 2;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        const { scene, renderer } = sceneRef.current;
        scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        if (canvasRef.current && renderer.domElement) {
          canvasRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, []);

  const handlePlayTennis = () => {
    if (onStartTennis) {
      onStartTennis();
    } else {
      navigate('/play/tennis');
    }
  };

  const handlePlayerProfile = () => {
    // TODO: Implement player profile
    console.log('Player profile clicked');
  };

  const handleSettings = () => {
    // TODO: Implement settings
    console.log('Settings clicked');
  };

  return (
    <div className="game-menu">
      {/* 3D Court Background */}
      <div ref={canvasRef} className="court-background" />
      
      {/* Menu Overlay */}
      <div className={`menu-overlay ${isLoaded ? 'loaded' : ''}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-text">Wibbly</span>
              <span className="logo-suffix">.io</span>
            </div>
            <div className="tagline">Motion Gaming Platform</div>
          </div>
          
          <div className="top-actions">
            <button className="player-btn" onClick={handlePlayerProfile}>
              <div className="player-avatar">👤</div>
              <div className="player-info">
                <div className="player-name">Player</div>
                <div className="player-level">Level 1</div>
              </div>
            </button>
            
            <button className="settings-btn" onClick={handleSettings}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Menu */}
        <div className="main-menu">
          <div className="menu-content">
            <h1 className="welcome-title">
              Welcome to <span className="highlight">Wibbly</span>
            </h1>
            <p className="welcome-subtitle">
              Experience the future of motion-controlled gaming
            </p>

            {/* Game Selection */}
            <div className="game-selection">
              <h2 className="section-title">Select Game Mode</h2>
              
              <div className="game-grid">
                <div 
                  className={`game-card ${selectedGame === 'tennis' ? 'selected' : ''}`}
                  onClick={() => setSelectedGame('tennis')}
                >
                  <div className="game-icon">🎾</div>
                  <div className="game-info">
                    <h3>Motion Tennis</h3>
                    <p>Swing your arm to play tennis</p>
                    <div className="game-status">Available</div>
                  </div>
                  <div className="game-stats">
                    <div className="stat">
                      <span className="stat-value">1.2K</span>
                      <span className="stat-label">Players</span>
                    </div>
                  </div>
                </div>

                <div className="game-card coming-soon">
                  <div className="game-icon">⚽</div>
                  <div className="game-info">
                    <h3>Motion Soccer</h3>
                    <p>Kick with your legs</p>
                    <div className="game-status coming-soon">Coming Soon</div>
                  </div>
                </div>

                <div className="game-card coming-soon">
                  <div className="game-icon">🥊</div>
                  <div className="game-info">
                    <h3>Motion Boxing</h3>
                    <p>Punch with your fists</p>
                    <div className="game-status coming-soon">Coming Soon</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="play-section">
              <button 
                className="play-btn"
                onClick={handlePlayTennis}
                disabled={selectedGame !== 'tennis'}
              >
                <div className="btn-content">
                  <span className="btn-icon">🚀</span>
                  <span className="btn-text">Start Tennis</span>
                </div>
                <div className="btn-glow"></div>
              </button>
              
              <div className="play-info">
                <p>🎯 Use your camera for motion control</p>
                <p>📱 Works on desktop and mobile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bottom-info">
          <div className="info-item">
            <span className="info-icon">🎮</span>
            <span>No downloads required</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔒</span>
            <span>Privacy-focused</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <span>Instant play</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .game-menu {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%);
        }

        .court-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .menu-overlay {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: rgba(224, 242, 241, 0.7);
          backdrop-filter: blur(8px);
          opacity: 0;
          transition: opacity 1s ease-out;
        }

        .menu-overlay.loaded {
          opacity: 1;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(79, 209, 199, 0.2);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .logo {
          font-size: 2.5rem;
          font-weight: 900;
          font-family: 'Inter', sans-serif;
        }

        .logo-text {
          background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-suffix {
          color: #66bb6a;
        }

        .tagline {
          font-size: 0.9rem;
          color: #388e3c;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .top-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .player-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(79, 209, 199, 0.2);
          border-radius: 12px;
          color: #2e7d6b;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .player-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          border-color: rgba(79, 209, 199, 0.4);
          box-shadow: 0 4px 20px rgba(79, 209, 199, 0.2);
        }

        .player-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #4fd1c7 0%, #26a69a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: white;
        }

        .player-info {
          text-align: left;
        }

        .player-name {
          font-weight: 600;
          font-size: 1rem;
          color: #2e7d6b;
        }

        .player-level {
          font-size: 0.8rem;
          color: #388e3c;
        }

        .settings-btn {
          width: 3rem;
          height: 3rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(79, 209, 199, 0.2);
          border-radius: 50%;
          color: #2e7d6b;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .settings-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: rotate(45deg) translateY(-2px);
          border-color: rgba(79, 209, 199, 0.4);
          box-shadow: 0 4px 20px rgba(79, 209, 199, 0.2);
        }

        .settings-btn svg {
          width: 1.2rem;
          height: 1.2rem;
        }

        .main-menu {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .menu-content {
          max-width: 1000px;
          width: 100%;
          text-align: center;
        }

        .welcome-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: #2e7d6b;
          margin-bottom: 1rem;
        }

        .highlight {
          background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 1.2rem;
          color: #388e3c;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2e7d6b;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .game-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .game-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(79, 209, 199, 0.2);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.4s ease;
          backdrop-filter: blur(15px);
          position: relative;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .game-card:not(.coming-soon):hover {
          transform: translateY(-8px);
          border-color: rgba(79, 209, 199, 0.5);
          box-shadow: 0 20px 40px rgba(79, 209, 199, 0.2);
        }

        .game-card.selected {
          border-color: #4fd1c7;
          background: rgba(79, 209, 199, 0.1);
          transform: translateY(-4px);
        }

        .game-card.coming-soon {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .game-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .game-info h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2e7d6b;
          margin-bottom: 0.5rem;
        }

        .game-info p {
          color: #388e3c;
          margin-bottom: 1rem;
        }

        .game-status {
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .game-status:not(.coming-soon) {
          background: rgba(129, 199, 132, 0.2);
          color: #2e7d6b;
        }

        .game-status.coming-soon {
          background: rgba(255, 193, 7, 0.2);
          color: #ff8f00;
        }

        .game-stats {
          margin-top: 1rem;
          text-align: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 800;
          color: #26a69a;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #388e3c;
          text-transform: uppercase;
        }

        .play-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .play-btn {
          position: relative;
          padding: 1.5rem 3rem;
          background: linear-gradient(135deg, #4fd1c7 0%, #26a69a 100%);
          border: none;
          border-radius: 20px;
          color: white;
          font-size: 1.3rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.4s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(79, 209, 199, 0.4);
        }

        .play-btn:not(:disabled):hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 40px rgba(79, 209, 199, 0.6);
        }

        .play-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          z-index: 2;
        }

        .btn-icon {
          font-size: 1.5rem;
        }

        .btn-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135degrees, #ffffff 0%, #4fd1c7 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .play-btn:hover .btn-glow {
          opacity: 0.2;
        }

        .play-info {
          display: flex;
          gap: 2rem;
          font-size: 0.9rem;
          color: #388e3c;
        }

        .bottom-info {
          display: flex;
          justify-content: center;
          gap: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-top: 1px solid rgba(79, 209, 199, 0.2);
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #388e3c;
          font-size: 0.9rem;
        }

        .info-icon {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .top-bar {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .main-menu {
            padding: 1rem;
          }

          .game-grid {
            grid-template-columns: 1fr;
          }

          .play-info {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }

          .bottom-info {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default GameMenu; 