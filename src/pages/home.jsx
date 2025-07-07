import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const Home = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameStats, setGameStats] = useState({
    players: 1250,
    matches: 8473,
    accuracy: 94
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Enhanced scene setup with more dynamic elements
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    canvasRef.current.appendChild(renderer.domElement);

    sceneRef.current = { scene, camera, renderer };

    // Enhanced lighting for more dramatic effect
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Updated lighting colors to match ocean breeze theme
    const pointLight1 = new THREE.PointLight(0x4fd1c7, 1.2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x81c784, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x26a69a, 0.8);
    pointLight3.position.set(0, 10, -5);
    scene.add(pointLight3);

    // Create more dynamic geometric shapes
    const shapes = [];
    const shapeCount = 40;

    for (let i = 0; i < shapeCount; i++) {
      let geometry, material, mesh;
      
      const shapeType = Math.floor(Math.random() * 5);
      // Updated colors to ocean breeze palette
      const colors = [0x4fd1c7, 0x81c784, 0x26a69a, 0x66bb6a, 0xa5d6a7];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      material = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.6,
        wireframe: Math.random() > 0.6
      });

      switch(shapeType) {
        case 0:
          geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
          break;
        case 1:
          geometry = new THREE.SphereGeometry(0.25, 8, 8);
          break;
        case 2:
          geometry = new THREE.ConeGeometry(0.25, 0.6, 6);
          break;
        case 3:
          geometry = new THREE.TetrahedronGeometry(0.3);
          break;
        case 4:
          geometry = new THREE.OctahedronGeometry(0.3);
          break;
      }

      mesh = new THREE.Mesh(geometry, material);
      
      // More spread out positions
      mesh.position.x = (Math.random() - 0.5) * 40;
      mesh.position.y = (Math.random() - 0.5) * 25;
      mesh.position.z = (Math.random() - 0.5) * 25;
      
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      
      // Store movement properties
      mesh.userData = {
        floatSpeed: 0.008 + Math.random() * 0.015,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        orbitRadius: 2 + Math.random() * 3,
        orbitSpeed: 0.005 + Math.random() * 0.01
      };
      
      scene.add(mesh);
      shapes.push(mesh);
    }

    camera.position.z = 18;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Enhanced animation loop
    let time = 0;
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.008;

      // More complex shape animations
      shapes.forEach((shape, index) => {
        // Orbital motion
        const orbitX = Math.cos(time * shape.userData.orbitSpeed + index) * shape.userData.orbitRadius;
        const orbitY = Math.sin(time * shape.userData.orbitSpeed + index * 0.5) * shape.userData.orbitRadius;
        
        shape.position.x += orbitX * 0.01;
        shape.position.y += orbitY * 0.01;
        
        // Floating motion
        shape.position.y += Math.sin(time * shape.userData.floatSpeed + index) * 0.005;
        shape.position.x += Math.cos(time * shape.userData.floatSpeed + index) * 0.003;
        
        // Enhanced rotation
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;
      });

      // More dynamic camera movement
      camera.position.x = Math.sin(time * 0.15) * 3;
      camera.position.y = Math.cos(time * 0.12) * 2;
      camera.position.z = 18 + Math.sin(time * 0.1) * 2;

      renderer.render(scene, camera);
    };

    animate();
    
    // Mark as loaded and start stat animation
    setTimeout(() => {
      setIsLoaded(true);
      animateStats();
    }, 800);

    // Animate stats counter
    const animateStats = () => {
      const duration = 2000;
      const startTime = Date.now();
      const startStats = { players: 0, matches: 0, accuracy: 0 };
      const endStats = { players: 1250, matches: 8473, accuracy: 94 };
      
      const updateStats = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setGameStats({
          players: Math.floor(startStats.players + (endStats.players - startStats.players) * easeOut),
          matches: Math.floor(startStats.matches + (endStats.matches - startStats.matches) * easeOut),
          accuracy: Math.floor(startStats.accuracy + (endStats.accuracy - startStats.accuracy) * easeOut)
        });
        
        if (progress < 1) {
          requestAnimationFrame(updateStats);
        }
      };
      
      updateStats();
    };

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

  return (
    <div className="home-container">
      {/* Enhanced Three.js Background */}
      <div 
        ref={canvasRef} 
        className="background-canvas"
      />
      
      {/* Content Overlay */}
      <div className={`content-overlay ${isLoaded ? 'loaded' : ''}`}>
        {/* Gaming Header */}
        <header className="header">
          <div className="logo">
            <span className="logo-text">Wibbly</span>
            <span className="logo-suffix">.io</span>
            <div className="logo-glow"></div>
          </div>
          
          {/* Game Stats Bar */}
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">{gameStats.players.toLocaleString()}</span>
              <span className="stat-label">Players</span>
            </div>
            <div className="stat">
              <span className="stat-number">{gameStats.matches.toLocaleString()}</span>
              <span className="stat-label">Matches</span>
            </div>
            <div className="stat">
              <span className="stat-number">{gameStats.accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="hero">
          <div className="hero-content">
            {/* Game Title */}
            <div className="game-badge">🚀 FREE MOVEMENT GAMES • P2P COMING SOON</div>
            
            <h1 className="hero-title">
              Movement Games for
              <span className="gradient-text"> Everyone</span>
            </h1>
            
            <p className="hero-description">
              🎮 Browser-based movement games designed for maximum accessibility! Play tennis with your body - 
              no special equipment, no downloads, completely free. Just your camera and natural movements. 
              P2P multiplayer coming soon!
            </p>

            {/* Games Section */}
            <div className="games-section">
              <h2 className="section-title">Choose Your Game</h2>
              <div className="games-grid">
                <Link to="/play" className="game-card featured">
                  <div className="game-icon">🎾</div>
                  <h3>Tennis</h3>
                  <p>Play Now</p>
                  <span className="status available">Available</span>
                </Link>
                <div className="game-card coming-soon">
                  <div className="game-icon">⚽</div>
                  <h3>Soccer</h3>
                  <p>Movement-based football</p>
                  <span className="status coming">Coming Soon</span>
                </div>
                <div className="game-card coming-soon">
                  <div className="game-icon">🥊</div>
                  <h3>Boxing</h3>
                  <p>Motion boxing trainer</p>
                  <span className="status coming">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Features Section - In Same Line */}
            <div className="features-section">
              <h2 className="section-title">Why Wibbly?</h2>
              <div className="features">
                <div className="feature">
                  <div className="feature-icon">🌍</div>
                  <div className="feature-text">
                    <h3>Maximum Accessibility</h3>
                    <p>Works on any device with a camera</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">💰</div>
                  <div className="feature-text">
                    <h3>100% Free</h3>
                    <p>No payments, no downloads required</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-text">
                    <h3>Natural Movement</h3>
                    <p>Use your body as the controller</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">🌐</div>
                  <div className="feature-text">
                    <h3>Browser-Based</h3>
                    <p>Instant access, no installation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Content (hidden but crawlable) */}
            <div className="seo-content">
              <h2>Free Movement-Based Browser Games - Accessible Gaming for Everyone</h2>
              <p>
                Wibbly.io brings you revolutionary movement-based games directly in your browser, designed for 
                maximum accessibility across all devices. Our mission is to make gaming inclusive by using your 
                body as the controller - no special equipment, no downloads, completely free to play. Currently 
                featuring motion-controlled tennis with P2P multiplayer and additional sports coming soon.
              </p>
              
              <h3>Why Movement-Based Browser Games?</h3>
              <ul>
                <li>Accessible on any device with a camera - phones, tablets, laptops</li>
                <li>No downloads or installations required</li>
                <li>100% free to play with no hidden costs</li>
                <li>Natural body movements replace traditional controllers</li>
                <li>Instant browser-based gameplay</li>
                <li>Privacy-focused - all processing happens locally</li>
              </ul>
              
              <h3>Tennis - Our First Movement Game</h3>
              <p>
                Play tennis using your body movements! Simply swing your arm naturally to hit the ball. 
                Our advanced computer vision technology tracks your movements in real-time for responsive, 
                intuitive gameplay.
              </p>
              
              <h3>Coming Soon</h3>
              <ul>
                <li>Peer-to-peer (P2P) multiplayer tennis matches</li>
                <li>Additional sports games with movement controls</li>
                <li>Enhanced social features</li>
                <li>Tournament modes</li>
              </ul>
              
              <h3>How to Play Tennis Free</h3>
              <ul>
                <li>Click "Play Tennis Free" to start instantly</li>
                <li>Allow camera access when prompted</li>
                <li>Stand in front of your camera with good lighting</li>
                <li>Swing your arm naturally to hit the tennis ball</li>
                <li>Use SPACEBAR as backup control if needed</li>
                <li>Enjoy 3D tennis with AI opponent</li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .home-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%);
        }

        .background-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .content-overlay {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1.2s ease-out;
        }

        .content-overlay.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .header {
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .logo {
          font-size: 2.2rem;
          font-weight: 900;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .logo-text {
          background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 2;
        }

        .logo-suffix {
          color: #2e7d6b;
        }

        .logo-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
          opacity: 0.2;
          filter: blur(20px);
          z-index: 1;
          animation: logoGlow 3s ease-in-out infinite alternate;
        }

        .stats-bar {
          display: flex;
          gap: 2rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(79, 209, 199, 0.2);
          border-radius: 12px;
          padding: 1rem 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #2e7d6b;
          background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }

        .hero-content {
          max-width: 1200px;
          animation: slideInUp 1s ease-out 0.3s both;
        }

        .game-badge {
          display: inline-block;
          background: linear-gradient(135deg, #4fd1c7 0%, #26a69a 100%);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 2rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .hero-title {
          font-size: clamp(2.8rem, 7vw, 5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 2rem;
          color: #2e7d6b;
        }

        .gradient-text {
          background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.3rem;
          color: #388e3c;
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2e7d6b;
          margin-bottom: 2rem;
          text-align: center;
        }

        .games-section {
          margin-bottom: 4rem;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .game-card {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(79, 209, 199, 0.2);
          border-radius: 20px;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .game-card.featured {
          background: linear-gradient(135deg, #4fd1c7 0%, #26a69a 100%);
          color: white;
          transform: scale(1.05);
          border-color: #4fd1c7;
        }

        .game-card.coming-soon {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .game-card:hover:not(.coming-soon) {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(79, 209, 199, 0.3);
          border-color: #4fd1c7;
        }

        .game-card.featured:hover {
          transform: translateY(-10px) scale(1.08);
        }

        .game-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .game-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .game-card p {
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status.available {
          background: #81c784;
          color: white;
        }

        .status.coming {
          background: rgba(255, 255, 255, 0.3);
          color: #666666;
        }

        .features-section {
          margin-bottom: 4rem;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(79, 209, 199, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(15px);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .feature::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(79, 209, 199, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .feature:hover::before {
          left: 100%;
        }

        .feature:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 1);
          border-color: #4fd1c7;
          box-shadow: 0 20px 40px rgba(79, 209, 199, 0.2);
        }

        .feature-icon {
          font-size: 2.5rem;
          min-width: 3.5rem;
          text-align: center;
        }

        .feature-text h3 {
          color: #2e7d6b;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .feature-text p {
          color: #666666;
          font-size: 0.95rem;
        }

        .seo-content {
          position: absolute;
          left: -9999px;
          opacity: 0;
          pointer-events: none;
        }

        @keyframes logoGlow {
          0% { opacity: 0.2; }
          100% { opacity: 0.4; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @media (max-width: 1024px) {
          .features {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .games-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            padding: 1.5rem 1rem;
          }
          
          .stats-bar {
            gap: 1rem;
            padding: 0.75rem 1.5rem;
          }
          
          .hero {
            padding: 1rem;
          }
          
          .features {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .games-grid {
            grid-template-columns: 1fr;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 