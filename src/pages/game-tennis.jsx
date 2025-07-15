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

  const handleExitToHome = () => {
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
            background: linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .loading-content {
            text-align: center;
            animation: fadeInScale 1s ease-out;
          }

          .loading-logo {
            font-size: 3rem;
            font-weight: 900;
            font-family: 'Inter', sans-serif;
            margin-bottom: 1rem;
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

          .loading-text {
            font-size: 1.2rem;
            color: #2e7d6b;
            margin-bottom: 2rem;
            font-weight: 500;
          }

          .loading-bar {
            width: 300px;
            height: 6px;
            background: rgba(79, 209, 199, 0.2);
            border-radius: 3px;
            overflow: hidden;
          }

          .loading-progress {
            height: 100%;
            background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
            border-radius: 3px;
            animation: loading 2s ease-in-out infinite;
          }

          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes loading {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 75%; margin-left: 12.5%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tennis-game-page">
      {/* Tennis Game with exit callback */}
      <TennisGame onExitToHome={handleExitToHome} />

      <style jsx>{`
        .tennis-game-page {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TennisGamePage; 