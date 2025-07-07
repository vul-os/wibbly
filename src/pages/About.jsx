import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const About = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup with subtle background animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    canvasRef.current.appendChild(renderer.domElement);

    sceneRef.current = { scene, camera, renderer };

    // Subtle lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create minimal geometric shapes
    const shapes = [];
    const shapeCount = 15;

    for (let i = 0; i < shapeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x6366f1,
        transparent: true,
        opacity: 0.3
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.x = (Math.random() - 0.5) * 40;
      mesh.position.y = (Math.random() - 0.5) * 30;
      mesh.position.z = (Math.random() - 0.5) * 30;
      
      mesh.userData = {
        floatSpeed: 0.002 + Math.random() * 0.003,
        originalPosition: mesh.position.clone()
      };
      
      scene.add(mesh);
      shapes.push(mesh);
    }

    camera.position.z = 20;

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

      shapes.forEach((shape, index) => {
        shape.position.y = shape.userData.originalPosition.y + 
          Math.sin(time * shape.userData.floatSpeed + index) * 2;
      });

      camera.position.x = Math.sin(time * 0.1) * 1;
      camera.position.y = Math.cos(time * 0.08) * 0.5;

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

  return (
    <div className="about-container">
      {/* Three.js Background */}
      <div ref={canvasRef} className="background-canvas" />
      
      {/* Content */}
      <div className="content">
        {/* Header */}
        <header className="header">
          <Link to="/" className="logo">
            <span className="logo-text">Wibbly</span>
            <span className="logo-suffix">.io</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/play" className="nav-link nav-btn">🎾 Play Now</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="main">
          <div className="hero-section">
            <h1 className="title">About Wibbly.io</h1>
            <p className="subtitle">
              Pioneering the future of motion-controlled web gaming
            </p>
          </div>

          <div className="content-sections">
            <section className="section">
              <h2>🎮 What is Wibbly?</h2>
              <p>
                Wibbly.io is a cutting-edge platform that brings motion-controlled gaming 
                directly to your web browser. Using advanced computer vision and pose detection 
                technology, we enable players to control games using natural body movements 
                captured through their device's camera.
              </p>
            </section>

            <section className="section">
              <h2>🚀 Technology</h2>
              <p>
                Our platform leverages modern web technologies including WebGL for 3D graphics, 
                TensorFlow.js for real-time pose detection, and Three.js for immersive 3D 
                environments. All processing happens locally in your browser for privacy and 
                low latency.
              </p>
            </section>

            <section className="section">
              <h2>🎾 Current Games</h2>
              <div className="games-grid">
                <div className="game-card">
                  <div className="game-icon">🎾</div>
                  <h3>Motion Tennis</h3>
                  <p>Swing your arm to hit the ball in this immersive 3D tennis experience</p>
                  <Link to="/play" className="game-link">Play Now</Link>
                </div>
                
                <div className="game-card coming-soon">
                  <div className="game-icon">⚽</div>
                  <h3>Soccer Skills</h3>
                  <p>Coming soon: Use your legs to control the ball</p>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>🔒 Privacy & Security</h2>
              <p>
                Your privacy is our priority. All motion detection happens locally on your 
                device. No video data is transmitted or stored on our servers. We only process 
                pose keypoints for game interaction.
              </p>
            </section>

            <section className="section">
              <h2>🌐 Browser Support</h2>
              <p>
                Wibbly.io works best on modern browsers with camera access including Chrome, 
                Firefox, Safari, and Edge. For the best experience, use a device with a 
                front-facing camera and ensure good lighting.
              </p>
            </section>
          </div>

          <div className="cta-section">
            <h2>Ready to Play?</h2>
            <p>Experience the future of web gaming today</p>
            <div className="cta-buttons">
              <Link to="/play" className="btn btn-primary">
                🎾 Play Tennis Now
              </Link>
              <Link to="/" className="btn btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .about-container {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          color: #ffffff;
          font-family: 'Inter', sans-serif;
        }

        .background-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          font-size: 1.75rem;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-suffix {
          color: #a1a1aa;
        }

        .nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #a1a1aa;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .nav-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white !important;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .nav-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        }

        .main {
          padding: 4rem 0;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
        }

        .title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #a1a1aa;
          max-width: 600px;
          margin: 0 auto;
        }

        .content-sections {
          display: grid;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .section p {
          color: #a1a1aa;
          line-height: 1.6;
          font-size: 1rem;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .game-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .game-card:hover:not(.coming-soon) {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .coming-soon {
          opacity: 0.6;
        }

        .game-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .game-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .game-card p {
          color: #a1a1aa;
          margin-bottom: 1rem;
        }

        .game-link {
          display: inline-block;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .game-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        }

        .coming-soon-badge {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .cta-section {
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 3rem 2rem;
          backdrop-filter: blur(10px);
        }

        .cta-section h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .cta-section p {
          color: #a1a1aa;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .content {
            padding: 0 1rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .nav {
            gap: 1rem;
          }

          .main {
            padding: 2rem 0;
          }

          .content-sections {
            gap: 2rem;
          }

          .section {
            padding: 1.5rem;
          }

          .cta-section {
            padding: 2rem 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default About; 