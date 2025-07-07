import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TennisGame from '../game';

const TennisGamePage = () => {
  const navigate = useNavigate();
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    // Auto-start the game after a short delay
    const timer = setTimeout(() => {
      setIsGameStarted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  if (!isGameStarted) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-logo">
            <span className="logo-text">Wibbly</span>
            <span className="logo-suffix">.io</span>
          </div>
          <div className="loading-text">Loading Tennis Game...</div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>

        <style jsx>{`
          .loading-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .loading-content {
            text-align: center;
          }

          .loading-logo {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            font-family: 'Inter', sans-serif;
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

          .loading-text {
            color: #a1a1aa;
            font-size: 1.1rem;
            margin-bottom: 2rem;
            font-family: 'Inter', sans-serif;
          }

          .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto;
          }

          .loading-progress {
            height: 100%;
            background: linear-gradient(135deg, #6366f1 0%, #10b981 100%);
            border-radius: 2px;
            animation: loading 1.5s ease-in-out infinite;
          }

          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tennis-game-page">
      {/* Game Navigation Overlay */}
      <div className="game-nav">
        <button onClick={handleGoHome} className="home-btn">
          <svg className="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </button>
      </div>

      {/* Tennis Game */}
      <TennisGame />

      <style jsx>{`
        .tennis-game-page {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .game-nav {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          pointer-events: auto;
        }

        .home-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(15, 15, 35, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .home-btn:hover {
          background: rgba(15, 15, 35, 0.95);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .home-icon {
          width: 1rem;
          height: 1rem;
        }

        @media (max-width: 768px) {
          .game-nav {
            top: 15px;
            left: 15px;
          }

          .home-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }

          .home-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TennisGamePage; 