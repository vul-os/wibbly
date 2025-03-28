import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

class PoseDetector {
  constructor() {
    this.detector = null;
    this.video = null;
    this.canvas = null;
    this.canvasCtx = null;
    this.isSetup = false;
    this.swingCallback = null;
    this.lastPoses = [];
    this.swingCooldown = false;
    this.rightWristHistory = [];
    this.historyLength = 5; // Reduced from 10 to 5 for better performance
    this.isRightHanded = true;
    this.debugMode = true;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 15; // Target 15 FPS instead of 30
    this.skipFrames = 2; // Process every 3rd frame
    
    // Connection pairs for visualization
    this.POSE_CONNECTIONS = [
      // Face connections
      ['nose', 'left_eye'], ['left_eye', 'left_ear'], 
      ['nose', 'right_eye'], ['right_eye', 'right_ear'],
      
      // Torso connections
      ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_hip'], 
      ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'],
      
      // Arms connections
      ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
      
      // Legs connections
      ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
    ];
  }

  async setup() {
    if (this.isSetup) return;
    
    try {
      // Load TF.js backend
      await tf.ready();
      console.log('TensorFlow.js is ready');
      
      // Create pose detector with optimized settings
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        // modelType: 'lightning', // Use lightning model for better performance
        enableSmoothing: true,
        minPoseScore: 0.5,
        minPartScore: 0.5
      };
      
      this.detector = await poseDetection.createDetector(model, detectorConfig);
      console.log('Pose detector created');
      
      // Create container for video and canvas
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '20px';
      container.style.bottom = '20px';
      container.style.width = '320px';
      container.style.height = '240px';
      container.style.borderRadius = '8px';
      container.style.overflow = 'hidden';
      container.style.zIndex = '100';
      container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      container.style.backgroundColor = '#000';
      document.body.appendChild(container);
      
      // Setup webcam with lower resolution
      this.video = document.createElement('video');
      this.video.setAttribute('playsinline', true);
      this.video.style.transform = 'scaleX(-1)';
      this.video.style.width = '100%';
      this.video.style.height = '100%';
      this.video.style.objectFit = 'cover';
      this.video.style.display = 'block';
      container.appendChild(this.video);
      
      // Setup canvas overlay
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'absolute';
      this.canvas.style.left = '0';
      this.canvas.style.top = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.transform = 'scaleX(-1)';
      this.canvas.style.pointerEvents = 'none';
      container.appendChild(this.canvas);
      
      this.canvasCtx = this.canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
      
      // Add toggle button
      const toggleButton = document.createElement('button');
      toggleButton.textContent = 'Hide Camera';
      toggleButton.style.position = 'absolute';
      toggleButton.style.left = '20px';
      toggleButton.style.bottom = '270px';
      toggleButton.style.padding = '5px 10px';
      toggleButton.style.backgroundColor = '#333';
      toggleButton.style.color = 'white';
      toggleButton.style.border = 'none';
      toggleButton.style.borderRadius = '4px';
      toggleButton.style.cursor = 'pointer';
      toggleButton.style.zIndex = '101';
      document.body.appendChild(toggleButton);
      
      toggleButton.addEventListener('click', () => {
        if (container.style.display === 'none') {
          container.style.display = 'block';
          toggleButton.textContent = 'Hide Camera';
        } else {
          container.style.display = 'none';
          toggleButton.textContent = 'Show Camera';
        }
      });
      
      // Get webcam access with lower resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 480 }, // Reduced from 640
          height: { ideal: 360 }, // Reduced from 480
          facingMode: 'user',
          frameRate: { ideal: 15 } // Reduced from 30
        }
      });
      
      this.video.srcObject = stream;
      
      // Ensure video plays
      this.video.play().catch(error => {
        console.error('Error playing video:', error);
      });
      
      return new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.isSetup = true;
          this.startDetection();
          resolve(true);
        };
      });
    } catch (error) {
      console.error('Error setting up pose detection:', error);
      return false;
    }
  }
  
  // Register callback to be called when swing is detected
  onSwing(callback) {
    this.swingCallback = callback;
  }
  
  // Start continuous pose detection with frame skipping
  startDetection() {
    if (!this.isSetup) return;
    
    let frameCount = 0;
    
    const detectPose = async () => {
      if (this.detector && this.video && this.video.readyState === 4) {
        const currentTime = performance.now();
        
        // Skip frames to maintain target frame rate
        if (currentTime - this.lastFrameTime < this.frameInterval) {
          requestAnimationFrame(detectPose);
          return;
        }
        
        // Process every nth frame
        frameCount++;
        if (frameCount % this.skipFrames !== 0) {
          requestAnimationFrame(detectPose);
          return;
        }
        
        try {
          // Update canvas size to match video dimensions
          this.canvas.width = this.video.videoWidth;
          this.canvas.height = this.video.videoHeight;
          
          const poses = await this.detector.estimatePoses(this.video);
          
          // Clear the canvas for new frame
          this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Draw the detected poses
          this.drawPose(poses[0]);
          
          // Process the poses for swing detection
          this.processPoses(poses);
          
          this.lastFrameTime = currentTime;
        } catch (error) {
          console.error('Error detecting poses:', error);
        }
      }
      
      requestAnimationFrame(detectPose);
    };
    
    detectPose();
  }
  
  // Draw the detected pose on the canvas
  drawPose(pose) {
    if (!pose || !this.canvasCtx) return;
    
    const ctx = this.canvasCtx;
    const keypoints = pose.keypoints;
    
    // Create a mapping of keypoint names to their positions
    const keypointMap = {};
    keypoints.forEach(keypoint => {
      keypointMap[keypoint.name] = {
        x: keypoint.x,
        y: keypoint.y,
        score: keypoint.score
      };
    });
    
    // Draw connections
    ctx.strokeStyle = 'white';
    ctx.lineWidth = Math.max(2, this.canvas.width / 320); // Scale line width with canvas size
    
    for (const [start, end] of this.POSE_CONNECTIONS) {
      const startPoint = keypointMap[start];
      const endPoint = keypointMap[end];
      
      if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
      }
    }
    
    // Highlight the right arm (for right-handed swings)
    if (this.isRightHanded) {
      const right_shoulder = keypointMap['right_shoulder'];
      const right_elbow = keypointMap['right_elbow'];
      const right_wrist = keypointMap['right_wrist'];
      
      if (right_shoulder && right_elbow && right_wrist &&
          right_shoulder.score > 0.3 && right_elbow.score > 0.3 && right_wrist.score > 0.3) {
        ctx.strokeStyle = '#00ff00'; // Bright green
        ctx.lineWidth = Math.max(3, this.canvas.width / 320) * 1.5; // Thicker line for right arm
        
        ctx.beginPath();
        ctx.moveTo(right_shoulder.x, right_shoulder.y);
        ctx.lineTo(right_elbow.x, right_elbow.y);
        ctx.lineTo(right_wrist.x, right_wrist.y);
        ctx.stroke();
      }
    }
    
    // Draw keypoints
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        const { x, y, name } = keypoint;
        
        // Use different colors for different body parts
        let color = 'white';
        let size = Math.max(4, this.canvas.width / 320); // Scale point size with canvas
        
        if (name === 'nose' || name.includes('eye') || name.includes('ear')) {
          color = '#ff9999'; // Face points
        } else if (name.includes('shoulder') || name.includes('hip')) {
          color = '#99ccff'; // Torso points
          size *= 1.2; // Slightly larger for torso points
        } else if (name.includes('elbow') || name.includes('wrist')) {
          color = '#99ff99'; // Arm points
        } else if (name.includes('knee') || name.includes('ankle')) {
          color = '#ffcc99'; // Leg points
        }
        
        // Highlight the right wrist for swing detection
        if (name === 'right_wrist' && this.isRightHanded) {
          color = '#00ff00'; // Bright green
          size *= 2; // Larger for right wrist
        }
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // Draw swing trail for right wrist if we have history
    if (this.rightWristHistory.length > 0 && this.isRightHanded) {
      // Make trail more visible with gradient
      const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
      gradient.addColorStop(0, 'rgba(0, 255, 0, 0.2)'); // Start with transparent green
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0.8)'); // End with more opaque green
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = Math.max(4, this.canvas.width / 320); // Thicker trail
      ctx.lineCap = 'round'; // Rounded line ends
      ctx.lineJoin = 'round'; // Rounded line joins
      
      ctx.beginPath();
      const firstPoint = this.rightWristHistory[0];
      ctx.moveTo(firstPoint.wristX, firstPoint.wristY);
      
      for (let i = 1; i < this.rightWristHistory.length; i++) {
        const point = this.rightWristHistory[i];
        ctx.lineTo(point.wristX, point.wristY);
      }
      
      ctx.stroke();
      
      // Add glow effect to trail
      ctx.shadowColor = 'rgba(0, 255, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    }
    
    // Add status text for debugging
    if (this.debugMode) {
      ctx.fillStyle = 'white';
      ctx.font = `${Math.max(12, this.canvas.width / 40)}px Arial`;
      ctx.fillText('Tennis Swing Detection', 10, 20);
      
      if (this.swingCooldown) {
        ctx.fillStyle = '#00ff00';
        ctx.fillText('SWING DETECTED!', 10, 40);
      }
    }
  }
  
  // Process detected poses to identify swinging motion
  processPoses(poses) {
    if (!poses || poses.length === 0) return;
    
    const pose = poses[0]; // Get first person detected
    
    // Get all required keypoints for swing detection
    const keypoints = {};
    
    // Map all keypoints by name for easier access
    pose.keypoints.forEach(kp => {
      keypoints[kp.name] = kp;
    });
    
    // Get the specific keypoints we need
    const {
      right_wrist, right_elbow, right_shoulder, right_hip,
      left_wrist, left_elbow, left_shoulder, left_hip
    } = keypoints;
    
    if (this.isRightHanded) {
      // Use right arm for swing detection
      if (right_wrist && right_wrist.score > 0.3 && // Lowered threshold from 0.5
          right_elbow && right_elbow.score > 0.3 && 
          right_shoulder && right_shoulder.score > 0.3) {
        
        // Add current position to history with torso reference points
        this.rightWristHistory.push({
          wristX: right_wrist.x,
          wristY: right_wrist.y,
          shoulderX: right_shoulder.x,
          shoulderY: right_shoulder.y,
          elbowX: right_elbow.x,
          elbowY: right_elbow.y,
          time: Date.now()
        });
        
        // Keep history at fixed length
        if (this.rightWristHistory.length > this.historyLength) {
          this.rightWristHistory.shift();
        }
        
        // Detect swinging motion if we have enough history
        if (this.rightWristHistory.length >= 3 && !this.swingCooldown) { // Reduced from 5 to 3
          const swingResult = this.detectRightHandedSwing();
          
          if (swingResult.isSwing) {
            // Log debug information about the detected swing
            if (this.debugMode) {
              console.log('Swing detected!', swingResult);
            }
            
            // Call the callback if registered, passing the swing direction
            if (this.swingCallback) {
              this.swingCallback(swingResult.swingDirection);
            }
            
            // Set cooldown to prevent multiple detections
            this.swingCooldown = true;
            setTimeout(() => {
              this.swingCooldown = false;
            }, 500); // Reduced from 1000 to 500ms for faster response
          }
        }
      }
    } else {
      // TODO: Left-handed detection will be implemented later
      // This is a placeholder for future left-handed swing detection
    }
  }
  
  // Enhanced algorithm to detect a right-handed tennis swing
  detectRightHandedSwing() {
    if (this.rightWristHistory.length < 3) {
      return { isSwing: false, reason: "Not enough history" };
    }
    
    // Calculate movement over the last few frames
    const recentPositions = this.rightWristHistory.slice(-3);
    
    // Get the oldest and newest positions
    const oldest = recentPositions[0];
    const newest = recentPositions[recentPositions.length - 1];
    
    // Calculate horizontal movement
    const horizontalDistance = newest.wristX - oldest.wristX;
    const verticalDistance = newest.wristY - oldest.wristY;
    
    // Calculate speed
    const timeElapsed = newest.time - oldest.time;
    const speed = Math.sqrt(horizontalDistance * horizontalDistance + 
                           verticalDistance * verticalDistance) / timeElapsed;
    
    // Simplified swing detection:
    // 1. Moving right (positive horizontal distance)
    // 2. Fast enough movement
    // 3. Some vertical movement (to avoid tiny movements)
    const isSwing = 
      horizontalDistance > 30 && // Moving right at least 30 pixels
      speed > 0.2 && // Fast enough movement
      Math.abs(verticalDistance) > 10; // Some vertical movement
    
    // Determine swing direction based on horizontal movement
    let swingDirection = 'right';
    if (horizontalDistance < -30) { // Moving left
      swingDirection = 'left';
    }
    
    return {
      isSwing,
      horizontalDistance,
      verticalDistance,
      speed,
      swingDirection,
      reason: isSwing ? `Tennis swing detected (${swingDirection})` : "Not a tennis swing"
    };
  }
  
  // Clean up resources
  cleanup() {
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.video.srcObject = null;
    }
    
    // Remove all created elements
    const container = this.video?.parentElement;
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
    
    // Remove toggle button
    const toggleButton = document.querySelector('button');
    if (toggleButton && document.body.contains(toggleButton)) {
      document.body.removeChild(toggleButton);
    }
    
    this.detector = null;
    this.isSetup = false;
  }
}

export default PoseDetector; 