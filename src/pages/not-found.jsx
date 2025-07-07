import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const NotFound = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    canvasRef.current.appendChild(renderer.domElement);

    // Store references for cleanup
    sceneRef.current = { scene, camera, renderer };

    // Lighting with Wibbly colors
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x6366f1, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x10b981, 0.6);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // Create floating geometric shapes with Wibbly colors
    const shapes = [];
    const shapeCount = 40;

    for (let i = 0; i < shapeCount; i++) {
      let geometry, material, mesh;
      
      const shapeType = Math.floor(Math.random() * 4);
      const colors = [0x6366f1, 0x10b981, 0x8b5cf6, 0xf59e0b];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      material = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.6,
        wireframe: Math.random() > 0.7
      });

      switch(shapeType) {
        case 0:
          geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
          break;
        case 1:
          geometry = new THREE.SphereGeometry(0.3, 8, 8);
          break;
        case 2:
          geometry = new THREE.ConeGeometry(0.3, 0.8, 6);
          break;
        case 3:
          geometry = new THREE.TetrahedronGeometry(0.4);
          break;
      }

      mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 20;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 20;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      
      // Random scale
      const scale = 0.5 + Math.random() * 0.5;
      mesh.scale.setScalar(scale);
      
      // Store original position and add movement properties
      mesh.userData = {
        originalPosition: mesh.position.clone(),
        floatSpeed: 0.01 + Math.random() * 0.02,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        floatRange: 1 + Math.random() * 2
      };
      
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Camera position
    camera.position.z = 10;

    // Mouse interaction setup
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Subtle camera movement based on mouse
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Animation loop
    let time = 0;
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Animate shapes
      shapes.forEach((shape, index) => {
        // Float animation
        shape.position.y = shape.userData.originalPosition.y + 
          Math.sin(time * shape.userData.floatSpeed + index) * shape.userData.floatRange;
        
        // Rotation animation
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;

        // Gentle drift
        shape.position.x = shape.userData.originalPosition.x + 
          Math.sin(time * 0.5 + index) * 0.5;
        shape.position.z = shape.userData.originalPosition.z + 
          Math.cos(time * 0.3 + index) * 0.5;
      });

      // Camera gentle movement
      camera.position.x += Math.sin(time * 0.2) * 0.1;
      camera.position.y += Math.cos(time * 0.15) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      // Stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Remove event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Clean up Three.js objects
      if (sceneRef.current) {
        const { scene, renderer } = sceneRef.current;
        
        // Dispose of geometries and materials
        scene.traverse((child) => {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });

        // Remove renderer
        if (canvasRef.current && renderer.domElement) {
          canvasRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleStartGame = () => {
    navigate('/play');
  };

  return (
    <div className="not-found-container">
      {/* Three.js Canvas Container */}
      <div 
        ref={canvasRef} 
        className="background-canvas"
      />
      
      {/* UI Overlay */}
      <div className="content-overlay">
        {/* Header with logo */}
        <header className="header">
          <div className="logo" onClick={handleGoHome}>
            <span className="logo-text">Wibbly</span>
            <span className="logo-suffix">.io</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
        {/* Error Code */}
          <div className="error-code">404</div>
        
        {/* Error Message */}
          <h1 className="error-title">Page Not Found</h1>
        
        {/* Subtitle */}
          <p className="error-description">
            Oops! It looks like this page got lost in cyberspace. 
            The digital dimension you're looking for doesn't exist in our reality.
          </p>
        
        {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleGoHome} className="btn btn-primary">
              <span>Back to Home</span>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
          </button>
          
                         <button onClick={handleStartGame} className="btn btn-secondary">
               <span>🎾 Play Game</span>
               <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </button>
        </div>
        </main>
      </div>

      <style jsx>{`
        .not-found-container {
          position: relative;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #fff;
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
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          padding: 2rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .logo {
          font-size: 1.75rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
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

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .error-code {
          font-size: clamp(6rem, 15vw, 12rem);
          font-weight: 900;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 1rem;
          animation: glow 2s ease-in-out infinite alternate;
        }

        .error-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          animation: slideInUp 0.8s ease-out 0.2s both;
        }
        
        .error-description {
          font-size: 1.1rem;
          color: #a1a1aa;
          margin-bottom: 3rem;
          max-width: 500px;
          line-height: 1.6;
          animation: slideInUp 0.8s ease-out 0.4s both;
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: slideInUp 0.8s ease-out 0.6s both;
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
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          font-family: inherit;
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
          border-color: rgba(16, 185, 129, 0.3);
        }

        .btn-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        @keyframes glow {
          from {
            filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.3));
          }
          to {
            filter: drop-shadow(0 0 40px rgba(99, 102, 241, 0.6));
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .main-content {
            padding: 1rem;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          
          .btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
          
          .error-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;