import React, { useState, useEffect } from 'react';

const InGameMenu = ({ 
  isOpen, 
  onClose, 
  onCameraChange, 
  currentCamera, 
  gameSettings, 
  onSettingsChange 
}) => {
  const [activeTab, setActiveTab] = useState('controls');
  const [isClosing, setIsClosing] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isOpen && isClosing) {
      setIsClosing(false);
    }
  }, [isOpen, isClosing]);

  // Generate floating particles for background effect
  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const tabs = [
    { id: 'controls', label: 'Controls', icon: '🎮', color: '#FF6B6B' },
    { id: 'camera', label: 'Camera', icon: '📷', color: '#4ECDC4' },
    { id: 'settings', label: 'Settings', icon: '⚙️', color: '#45B7D1' },
    { id: 'help', label: 'Help', icon: '❓', color: '#96CEB4' }
  ];

  const cameraOptions = [
    { 
      id: 'orbital', 
      name: 'Free Camera', 
      description: 'Orbital camera that you can control with mouse/touch',
      icon: '🌐'
    },
    { 
      id: 'fixed', 
      name: 'Fixed', 
      description: 'Camera fixed behind player, always facing forward',
      icon: '👤'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'controls':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h3>🎮 Game Controls</h3>
              <div className="header-line"></div>
            </div>
            <div className="controls-grid">
              <div className="control-section">
                <h4>🎾 Tennis Controls</h4>
                <div className="control-list">
                  <div className="control-item">
                    <div className="control-key">SPACEBAR</div>
                    <div className="control-desc">Swing racket / Serve ball</div>
                  </div>
                  <div className="control-item">
                    <div className="control-key">ARM SWING</div>
                    <div className="control-desc">Swing your arm (camera detection)</div>
                  </div>
                  <div className="control-item">
                    <div className="control-key">CLICK</div>
                    <div className="control-desc">Restart game</div>
                  </div>
                </div>
              </div>
              
              <div className="control-section">
                <h4>📷 Camera Controls</h4>
                <div className="control-list">
                  <div className="control-item">
                    <div className="control-key">LEFT MOUSE</div>
                    <div className="control-desc">Rotate camera (Free mode only)</div>
                  </div>
                  <div className="control-item">
                    <div className="control-key">SCROLL</div>
                    <div className="control-desc">Zoom in/out (Free mode only)</div>
                  </div>
                  <div className="control-item">
                    <div className="control-key">ESC</div>
                    <div className="control-desc">Open/close this menu</div>
                  </div>
                </div>
              </div>
              
              <div className="control-section">
                <h4>🎯 Pose Detection</h4>
                <div className="control-list">
                  <div className="control-item">
                    <div className="control-key">WEBCAM</div>
                    <div className="control-desc">Enable camera for motion control</div>
                  </div>
                  <div className="control-item toggle-item">
                    <div className="control-desc">Pose Detection</div>
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={gameSettings?.usePoseDetection || false}
                        onChange={(e) => onSettingsChange?.('usePoseDetection', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'camera':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h3>📷 Camera Settings</h3>
              <div className="header-line"></div>
            </div>
            <div className="camera-options">
              {cameraOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`camera-option ${currentCamera === option.id ? 'active' : ''}`}
                  onClick={() => onCameraChange?.(option.id)}
                >
                  <div className="camera-icon">{option.icon}</div>
                  <div className="camera-info">
                    <div className="camera-name">{option.name}</div>
                    <div className="camera-desc">{option.description}</div>
                  </div>
                  <div className="camera-radio">
                    <div className={`radio-button ${currentCamera === option.id ? 'checked' : ''}`}>
                      <div className="radio-inner"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="camera-settings">
              <h4>🔧 Camera Options</h4>
              <div className="setting-item">
                <label>Field of View</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="45" 
                    max="120" 
                    value={gameSettings?.fov || 75}
                    onChange={(e) => onSettingsChange?.('fov', parseInt(e.target.value))}
                  />
                  <span className="slider-value">{gameSettings?.fov || 75}°</span>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Camera Smoothing</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={gameSettings?.cameraSmoothing || 0.5}
                    onChange={(e) => onSettingsChange?.('cameraSmoothing', parseFloat(e.target.value))}
                  />
                  <span className="slider-value">{((gameSettings?.cameraSmoothing || 0.5) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h3>⚙️ Game Settings</h3>
              <div className="header-line"></div>
            </div>
            <div className="settings-grid">
              <div className="setting-group">
                <h4>🎮 Gameplay</h4>
                <div className="setting-item">
                  <label>Game Difficulty</label>
                  <select 
                    value={gameSettings?.difficulty || 'medium'}
                    onChange={(e) => onSettingsChange?.('difficulty', e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div className="setting-item toggle-item">
                  <label>AI Player Enabled</label>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={gameSettings?.aiEnabled || true}
                      onChange={(e) => onSettingsChange?.('aiEnabled', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item toggle-item">
                  <label>Debug Mode</label>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={gameSettings?.debug || false}
                      onChange={(e) => onSettingsChange?.('debug', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="setting-group">
                <h4>🔧 Performance</h4>
                <div className="setting-item">
                  <label>Graphics Quality</label>
                  <select 
                    value={gameSettings?.quality || 'high'}
                    onChange={(e) => onSettingsChange?.('quality', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
                
                <div className="setting-item toggle-item">
                  <label>Shadows</label>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={gameSettings?.shadows || true}
                      onChange={(e) => onSettingsChange?.('shadows', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item toggle-item">
                  <label>Anti-aliasing</label>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={gameSettings?.antialiasing || true}
                      onChange={(e) => onSettingsChange?.('antialiasing', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h3>❓ How to Play</h3>
              <div className="header-line"></div>
            </div>
            <div className="help-content">
              <div className="help-section">
                <h4>🎾 Getting Started</h4>
                <ol>
                  <li>Position yourself in front of your camera</li>
                  <li>Press <strong>SPACEBAR</strong> to serve the ball</li>
                  <li>Swing your arm or press <strong>SPACEBAR</strong> to hit the ball</li>
                  <li>Try to return the ball to the opponent's side</li>
                </ol>
              </div>
              
              <div className="help-section">
                <h4>📱 Camera Setup</h4>
                <ul>
                  <li>Make sure your camera is enabled</li>
                  <li>Stand 3-6 feet away from your camera</li>
                  <li>Ensure good lighting for better detection</li>
                  <li>Your full upper body should be visible</li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>🎯 Pro Tips</h4>
                <ul>
                  <li>Natural arm swings work best</li>
                  <li>Time your swings with the ball's arrival</li>
                  <li>Use different camera angles to find your preference</li>
                  <li>Practice serving to start rallies</li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>⚠️ Troubleshooting</h4>
                <ul>
                  <li>If nothing moves, check browser console for errors</li>
                  <li>Refresh the page if camera stops working</li>
                  <li>Try different lighting conditions</li>
                  <li>Use keyboard controls if camera fails</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`menu-overlay ${isClosing ? 'closing' : ''}`}>
      {/* Animated background particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.speed}s`
            }}
          />
        ))}
      </div>

      <div className="menu-container">
        {/* Header */}
        <div className="menu-header">
          <div className="menu-title">
            <div className="title-glow">
              <span className="menu-icon">⚙️</span>
              <span className="title-text">GAME MENU</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <span className="close-icon">✕</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="menu-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ '--tab-color': tab.color }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <div className="tab-glow"></div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="menu-content">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="menu-footer">
          <button className="apply-btn" onClick={handleClose}>
            <span className="btn-text">RESUME GAME</span>
            <div className="btn-particles"></div>
          </button>
        </div>
      </div>

      <style jsx>{`
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: radial-gradient(ellipse at center, rgba(20, 25, 40, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%);
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: menuOpen 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }

        .menu-overlay.closing {
          animation: menuClose 0.3s ease-in;
        }

        @keyframes menuOpen {
          from {
            opacity: 0;
            backdrop-filter: blur(0);
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(15px);
            transform: scale(1);
          }
        }

        @keyframes menuClose {
          from {
            opacity: 1;
            backdrop-filter: blur(15px);
            transform: scale(1);
          }
          to {
            opacity: 0;
            backdrop-filter: blur(0);
            transform: scale(0.9);
          }
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: linear-gradient(45deg, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7);
          border-radius: 50%;
          animation: float infinite linear;
          filter: blur(1px);
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
          }
        }

        .menu-container {
          width: 95%;
          max-width: 1000px;
          max-height: 90vh;
          background: linear-gradient(135deg, rgba(26, 32, 44, 0.95) 0%, rgba(20, 25, 38, 0.98) 100%);
          border-radius: 24px;
          border: 2px solid rgba(100, 150, 255, 0.3);
          backdrop-filter: blur(25px);
          box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 100px rgba(100, 150, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: containerSlide 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .menu-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(100, 150, 255, 0.05) 50%, transparent 70%);
          animation: shimmer 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes containerSlide {
          from {
            transform: translateY(-30px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2.5rem;
          background: linear-gradient(135deg, rgba(100, 150, 255, 0.2) 0%, rgba(50, 100, 200, 0.15) 100%);
          border-bottom: 1px solid rgba(100, 150, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .menu-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: headerGlow 2s ease-in-out infinite;
        }

        @keyframes headerGlow {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .title-glow {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .menu-icon {
          font-size: 2rem;
          filter: drop-shadow(0 0 10px rgba(100, 150, 255, 0.6));
          animation: iconPulse 2s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .title-text {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          text-shadow: 
            0 0 20px rgba(100, 150, 255, 0.6),
            0 0 40px rgba(100, 150, 255, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.5);
          letter-spacing: 2px;
          font-family: 'Arial Black', sans-serif;
        }

        .close-btn {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, rgba(255, 100, 100, 0.2), rgba(200, 50, 50, 0.3));
          border: 2px solid rgba(255, 100, 100, 0.4);
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: bold;
          position: relative;
          overflow: hidden;
        }

        .close-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255, 100, 100, 0.3) 0%, transparent 70%);
          transform: scale(0);
          transition: transform 0.3s ease;
        }

        .close-btn:hover::before {
          transform: scale(1);
        }

        .close-btn:hover {
          background: linear-gradient(135deg, rgba(255, 100, 100, 0.4), rgba(200, 50, 50, 0.5));
          border-color: rgba(255, 100, 100, 0.8);
          transform: rotate(90deg) scale(1.1);
          box-shadow: 0 0 20px rgba(255, 100, 100, 0.4);
        }

        .close-icon {
          position: relative;
          z-index: 1;
        }

        .menu-tabs {
          display: flex;
          background: linear-gradient(135deg, rgba(30, 40, 60, 0.8) 0%, rgba(20, 30, 50, 0.9) 100%);
          border-bottom: 1px solid rgba(100, 150, 255, 0.2);
          position: relative;
          padding: 0.5rem;
          gap: 0.5rem;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, rgba(40, 50, 70, 0.6), rgba(30, 40, 60, 0.8));
          border: 2px solid rgba(100, 150, 255, 0.2);
          border-radius: 16px;
          color: #cbd5e0;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-weight: 600;
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .tab-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--tab-color, #4ECDC4), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tab-btn:hover::before {
          opacity: 0.1;
        }

        .tab-btn:hover {
          background: linear-gradient(135deg, rgba(50, 65, 85, 0.8), rgba(40, 55, 75, 0.9));
          border-color: rgba(100, 150, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, var(--tab-color, #4ECDC4), rgba(100, 150, 255, 0.3));
          border-color: var(--tab-color, #4ECDC4);
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 
            0 12px 30px rgba(0, 0, 0, 0.4),
            0 0 20px var(--tab-color, #4ECDC4);
        }

        .tab-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, var(--tab-color, #4ECDC4) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tab-btn.active .tab-glow {
          opacity: 0.2;
        }

        .tab-icon {
          font-size: 1.5rem;
          filter: drop-shadow(0 0 8px var(--tab-color, #4ECDC4));
        }

        .tab-label {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .menu-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          background: rgba(15, 20, 35, 0.3);
        }

        .content-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .content-header h3 {
          color: #fff;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 0 0 20px rgba(100, 150, 255, 0.5);
          letter-spacing: 1px;
        }

        .header-line {
          height: 3px;
          background: linear-gradient(90deg, transparent, #4ECDC4, #45B7D1, #96CEB4, transparent);
          border-radius: 2px;
          margin: 0 auto;
          width: 200px;
          animation: linePulse 2s ease-in-out infinite;
        }

        @keyframes linePulse {
          0%, 100% { transform: scaleX(1); opacity: 0.7; }
          50% { transform: scaleX(1.2); opacity: 1; }
        }

        .controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .control-section {
          background: linear-gradient(135deg, rgba(40, 50, 70, 0.6), rgba(30, 40, 60, 0.8));
          border-radius: 20px;
          padding: 2rem;
          border: 2px solid rgba(100, 150, 255, 0.2);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .control-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .control-section:hover::before {
          left: 100%;
        }

        .control-section:hover {
          border-color: rgba(100, 150, 255, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .control-section h4 {
          color: #4ECDC4;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }

        .control-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .control-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, rgba(50, 60, 80, 0.6), rgba(40, 50, 70, 0.8));
          border-radius: 12px;
          border: 1px solid rgba(100, 150, 255, 0.2);
          transition: all 0.3s ease;
        }

        .control-item:hover {
          background: linear-gradient(135deg, rgba(60, 70, 90, 0.8), rgba(50, 60, 80, 0.9));
          border-color: rgba(100, 150, 255, 0.4);
          transform: translateX(5px);
        }

        .control-item.toggle-item {
          justify-content: space-between;
        }

        .control-key {
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #4ECDC4, #45B7D1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          min-width: 100px;
          text-align: center;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }

        .control-desc {
          color: #cbd5e0;
          font-size: 1rem;
          font-weight: 500;
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 30px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #2d3748, #4a5568);
          transition: 0.4s;
          border-radius: 30px;
          border: 2px solid rgba(100, 150, 255, 0.3);
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 2px;
          bottom: 2px;
          background: linear-gradient(135deg, #cbd5e0, #e2e8f0);
          transition: 0.4s;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .toggle input:checked + .toggle-slider {
          background: linear-gradient(135deg, #4ECDC4, #45B7D1);
          border-color: #4ECDC4;
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.4);
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(28px);
          background: linear-gradient(135deg, #fff, #f7fafc);
          box-shadow: 0 2px 15px rgba(78, 205, 196, 0.3);
        }

        .camera-options {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .camera-option {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(40, 50, 70, 0.6), rgba(30, 40, 60, 0.8));
          border: 2px solid rgba(100, 150, 255, 0.2);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .camera-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(69, 183, 209, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .camera-option:hover::before {
          opacity: 1;
        }

        .camera-option:hover {
          background: linear-gradient(135deg, rgba(50, 65, 85, 0.8), rgba(40, 55, 75, 0.9));
          border-color: rgba(100, 150, 255, 0.4);
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .camera-option.active {
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(69, 183, 209, 0.15));
          border-color: #4ECDC4;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(78, 205, 196, 0.3);
          transform: translateY(-8px);
        }

        .camera-icon {
          font-size: 3rem;
          width: 4rem;
          text-align: center;
          filter: drop-shadow(0 0 10px rgba(78, 205, 196, 0.5));
        }

        .camera-info {
          flex: 1;
        }

        .camera-name {
          font-weight: 700;
          color: #fff;
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(100, 150, 255, 0.5);
        }

        .camera-desc {
          color: #cbd5e0;
          font-size: 1rem;
          line-height: 1.5;
        }

        .radio-button {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(100, 150, 255, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(40, 50, 70, 0.8), rgba(30, 40, 60, 0.9));
        }

        .radio-button.checked {
          border-color: #4ECDC4;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.4);
        }

        .radio-inner {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4ECDC4, #45B7D1);
          transform: scale(0);
          transition: transform 0.3s ease;
        }

        .radio-button.checked .radio-inner {
          transform: scale(1);
        }

        .camera-settings {
          background: linear-gradient(135deg, rgba(40, 50, 70, 0.6), rgba(30, 40, 60, 0.8));
          border-radius: 20px;
          padding: 2rem;
          border: 2px solid rgba(100, 150, 255, 0.2);
        }

        .camera-settings h4 {
          color: #4ECDC4;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, rgba(50, 60, 80, 0.6), rgba(40, 50, 70, 0.8));
          border-radius: 12px;
          border: 1px solid rgba(100, 150, 255, 0.2);
        }

        .setting-item label {
          min-width: 140px;
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
        }

        .slider-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .setting-item input[type="range"] {
          flex: 1;
          height: 6px;
          background: linear-gradient(135deg, #2d3748, #4a5568);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .setting-item input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #4ECDC4, #45B7D1);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(78, 205, 196, 0.4);
          transition: all 0.3s ease;
        }

        .setting-item input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 20px rgba(78, 205, 196, 0.6);
        }

        .setting-item select {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(100, 150, 255, 0.3);
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(30, 40, 60, 0.9), rgba(20, 30, 50, 0.95));
          color: #fff;
          font-size: 1rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s ease;
        }

        .setting-item select:focus {
          border-color: #4ECDC4;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
        }

        .slider-value {
          min-width: 50px;
          text-align: center;
          color: #4ECDC4;
          font-weight: 700;
          font-size: 1rem;
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(69, 183, 209, 0.2));
          padding: 0.5rem;
          border-radius: 8px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .setting-group {
          background: linear-gradient(135deg, rgba(40, 50, 70, 0.6), rgba(30, 40, 60, 0.8));
          border-radius: 20px;
          padding: 2rem;
          border: 2px solid rgba(100, 150, 255, 0.2);
          transition: all 0.3s ease;
        }

        .setting-group:hover {
          border-color: rgba(100, 150, 255, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .setting-group h4 {
          color: #4ECDC4;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }

        .help-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .help-section {
          background: linear-gradient(135deg, rgba(40, 50, 70, 0.6), rgba(30, 40, 60, 0.8));
          border-radius: 20px;
          padding: 2rem;
          border: 2px solid rgba(100, 150, 255, 0.2);
          transition: all 0.3s ease;
        }

        .help-section:hover {
          border-color: rgba(100, 150, 255, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .help-section h4 {
          color: #4ECDC4;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }

        .help-section ol,
        .help-section ul {
          color: #cbd5e0;
          line-height: 1.8;
          padding-left: 2rem;
          font-size: 1rem;
        }

        .help-section li {
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
        }

        .help-section li:hover {
          color: #fff;
        }

        .help-section strong {
          color: #4ECDC4;
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(69, 183, 209, 0.2));
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-weight: 700;
        }

        .menu-footer {
          padding: 2rem;
          background: linear-gradient(135deg, rgba(30, 40, 60, 0.8) 0%, rgba(20, 30, 50, 0.9) 100%);
          border-top: 1px solid rgba(100, 150, 255, 0.3);
          display: flex;
          justify-content: center;
        }

        .apply-btn {
          padding: 1.25rem 3rem;
          background: linear-gradient(135deg, #4ECDC4 0%, #45B7D1 50%, #96CEB4 100%);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 
            0 8px 25px rgba(78, 205, 196, 0.4),
            0 0 0 2px rgba(78, 205, 196, 0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
        }

        .apply-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .apply-btn:hover::before {
          left: 100%;
        }

        .apply-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 
            0 15px 40px rgba(78, 205, 196, 0.6),
            0 0 0 3px rgba(78, 205, 196, 0.3);
          background: linear-gradient(135deg, #5FDED7 0%, #56C8E0 50%, #A7D9C5 100%);
        }

        .apply-btn:active {
          transform: translateY(-1px) scale(1.02);
        }

        .btn-text {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .menu-container {
            width: 98%;
            max-height: 95vh;
          }

          .menu-header {
            padding: 1.5rem;
          }

          .title-text {
            font-size: 1.5rem;
          }

          .tab-btn .tab-label {
            display: none;
          }

          .menu-content {
            padding: 1.5rem;
          }

          .controls-grid,
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .control-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .control-item.toggle-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .camera-option {
            padding: 1.5rem;
          }

          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .slider-container {
            width: 100%;
          }

          .setting-item label {
            min-width: auto;
          }

          .setting-item input[type="range"],
          .setting-item select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default InGameMenu; 