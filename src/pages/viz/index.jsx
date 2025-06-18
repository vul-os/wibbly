import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Button } from '../../components/ui/button';
import PlantScene from './components/PlantScene';
import ConnectionManager from './components/ConnectionManager';

const PlantVisualization = () => {
  const [currentMode, setCurrentMode] = useState('select');
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [gridSnap, setGridSnap] = useState(true);
  const [gridSize, setGridSize] = useState(1.0);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const sceneRef = useRef();
  const cameraControlsRef = useRef();

  const modes = {
    select: { label: 'Select', color: 'bg-blue-500' },
    connect: { label: 'Connect', color: 'bg-orange-500' },
    delete: { label: 'Delete', color: 'bg-red-500' }
  };

  const plantObjects = [
    { type: 'boiler', label: 'Boiler', color: '#4CAF50', description: 'Electric + Liquid I/O' },
    { type: 'pump', label: 'Pump', color: '#F44336', description: 'Electric + Liquid I/O' },
    { type: 'valve', label: 'Valve', color: '#FF9800', description: 'Electric Control + Liquid I/O' },
    { type: 'sensor', label: 'Sensor', color: '#9C27B0', description: 'Signal Output' },
    { type: 'controlUnit', label: 'Control Unit', color: '#2196F3', description: 'Multi-Connection Hub' }
  ];

  const gridSizes = [
    { value: 0.5, label: '0.5m' },
    { value: 1.0, label: '1.0m' },
    { value: 2.0, label: '2.0m' },
    { value: 5.0, label: '5.0m' }
  ];

  const addObject = (type) => {
    if (sceneRef.current) {
      sceneRef.current.addObject(type);
    }
  };

  const setMode = (mode) => {
    setCurrentMode(mode);
    setSelectedObjects([]);
  };

  const autoLayout = () => {
    if (sceneRef.current) {
      sceneRef.current.autoLayout();
    }
  };

  const clearAll = () => {
    if (sceneRef.current) {
      sceneRef.current.clearAll();
    }
    setSelectedObjects([]);
  };

  // Listen for manual connection state changes from PlantScene
  React.useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCameraControlsRef(cameraControlsRef.current);
    }
  }, []);

  return (
    <div className="relative w-screen h-screen bg-gray-900">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 p-4 rounded-lg text-white min-w-[250px]">
        <h3 className="text-lg font-bold mb-3">Plant 3D Visualizer</h3>
        
        {/* CAD Controls */}
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <h4 className="text-sm font-semibold mb-2">CAD Controls:</h4>
          
          {/* Grid Snap Toggle */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs">Grid Snap:</span>
            <Button
              onClick={() => setGridSnap(!gridSnap)}
              className={`text-xs h-6 px-2 ${gridSnap ? 'bg-green-600' : 'bg-gray-600'}`}
              variant={gridSnap ? "default" : "outline"}
            >
              {gridSnap ? 'ON' : 'OFF'}
            </Button>
          </div>
          
          {/* Grid Size Selection */}
          <div className="mb-2">
            <span className="text-xs block mb-1">Grid Size:</span>
            <div className="grid grid-cols-2 gap-1">
              {gridSizes.map(size => (
                <Button
                  key={size.value}
                  onClick={() => setGridSize(size.value)}
                  className={`text-xs h-6 ${
                    gridSize === size.value ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                  variant={gridSize === size.value ? "default" : "outline"}
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Show Coordinates Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs">Coordinates:</span>
            <Button
              onClick={() => setShowCoordinates(!showCoordinates)}
              className={`text-xs h-6 px-2 ${showCoordinates ? 'bg-green-600' : 'bg-gray-600'}`}
              variant={showCoordinates ? "default" : "outline"}
            >
              {showCoordinates ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
        
        {/* Add Objects */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Add Components:</h4>
          <div className="space-y-1">
            {plantObjects.map(obj => (
              <div key={obj.type} className="flex flex-col">
                <Button
                  onClick={() => addObject(obj.type)}
                  className="text-xs h-8 mb-1"
                  variant="outline"
                >
                  {obj.label}
                </Button>
                <span className="text-xs text-gray-400 mb-2">{obj.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mode Controls */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Interaction Mode:</h4>
          <div className="space-y-1">
            {Object.entries(modes).map(([mode, config]) => (
              <Button
                key={mode}
                onClick={() => setMode(mode)}
                className={`w-full text-xs h-8 ${
                  currentMode === mode ? config.color : 'bg-gray-600'
                }`}
                variant={currentMode === mode ? "default" : "outline"}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Scene Controls */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Scene Controls:</h4>
          <div className="space-y-1">
            <Button 
              onClick={autoLayout} 
              className="w-full text-xs h-8" 
              variant="outline"
            >
              Auto Layout
            </Button>
            <Button 
              onClick={clearAll} 
              className="w-full text-xs h-8 bg-red-600 hover:bg-red-700"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Current Mode Indicator */}
        <div className={`p-2 rounded text-center text-xs font-bold ${modes[currentMode].color}`}>
          Mode: {modes[currentMode].label}
        </div>
      </div>

      {/* CAD Status Info */}
      <div className="absolute top-4 right-4 z-10 bg-black/80 p-3 rounded-lg text-white text-xs">
        <div className="space-y-1">
          <div><strong>Grid:</strong> {gridSnap ? `${gridSize}m snap` : 'Free'}</div>
          <div><strong>Objects:</strong> {selectedObjects.length} selected</div>
          {showCoordinates && selectedObjects.length > 0 && (
            <div><strong>Position:</strong> Tracking...</div>
          )}
        </div>
      </div>

      {/* Connection Types Info */}
      <div className="absolute top-4 right-48 z-10 bg-black/80 p-3 rounded-lg text-white text-xs">
        <div className="space-y-1">
          <div className="mb-1"><strong>Auto-Routing Types:</strong></div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Liquid (Auto-Routes)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Gas (Auto-Routes)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Electric (Auto-Routes)</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/60 p-3 rounded text-white text-xs max-w-xs">
        <div className="space-y-1">
          <div><strong>Select Mode:</strong> Click and drag objects (Grid snap: {gridSnap ? 'ON' : 'OFF'})</div>
          <div><strong>Connect Mode:</strong> Click source → Click destination (auto-routes)</div>
          <div><strong>Delete Mode:</strong> Click objects or pipes to delete</div>
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div><strong>Realistic Plumbing System:</strong></div>
            <div>• Two-click connections</div>
            <div>• Outward routing from port directions</div>
            <div>• Gravity-fed routing (prefers downward)</div>
            <div>• Intelligent obstacle avoidance</div>
            <div>• Automatic 90° bends</div>
            <div>• Compatible port detection</div>
            <div>• Dynamic re-routing when objects move</div>
            <div>• Click connections to edit (Select mode)</div>
            <div>• Professional plumbing appearance</div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 10, 15], fov: 75 }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Enhanced Grid with snap indicators */}
          <Grid
            infiniteGrid
            size={gridSize}
            color={gridSnap ? "#666666" : "#444444"}
            sectionColor={gridSnap ? "#888888" : "#666666"}
            fadeDistance={50}
            fadeStrength={1}
          />

          {/* Visual ground plane */}
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshLambertMaterial 
              color="#2a2a2a" 
              transparent 
              opacity={0.1}
            />
          </mesh>

          {/* Main Scene */}
          <PlantScene
            ref={sceneRef}
            mode={currentMode}
            selectedObjects={selectedObjects}
            setSelectedObjects={setSelectedObjects}
            gridSnap={gridSnap}
            gridSize={gridSize}
            showCoordinates={showCoordinates}
          />

          {/* Camera Controls */}
          <OrbitControls
            ref={cameraControlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            panSpeed={0.5}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Connection Manager */}
      <ConnectionManager
        selectedObjects={selectedObjects}
        mode={currentMode}
        sceneRef={sceneRef}
      />
    </div>
  );
};

export default PlantVisualization;
