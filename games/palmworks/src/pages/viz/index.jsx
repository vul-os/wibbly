import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Button } from '../../components/ui/button';
import PlantScene from './components/PlantScene';
import {
  Zap,
  Cog,
  Move,
  Truck,
  Battery,
  Cylinder,
  Box,
  Trash2,
  RotateCcw,
  X,
  Grid2x2,
  MapPin,
  Flame,
  MousePointer,
  Layout,
  Factory,
  Cpu,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowLeft,
  Package,
  Microchip,
  Container,
  Fuel,
  FlaskConical,
  Blend,
  Fan,
  Wind,
  Droplets
} from 'lucide-react';

const PlantVisualization = () => {
  const [currentMode, setCurrentMode] = useState('select');
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [gridSnap, setGridSnap] = useState(true);
  const [gridSize, setGridSize] = useState(1.0);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showCADControls, setShowCADControls] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const sceneRef = useRef();
  const cameraControlsRef = useRef();

  // Categorized plant objects - expandable to 1000s
  const componentCategories = {
    'Processing Equipment': [
    { 
      type: 'boiler', 
      label: 'Boiler', 
      icon: Cylinder,
      color: '#4CAF50', 
        description: 'Steam generator with electric + liquid I/O',
        keywords: ['steam', 'heat', 'water', 'electric', 'generator']
      },
      { 
        type: 'heatExchanger', 
        label: 'Heat Exchanger', 
        icon: Flame,
        color: '#FF9800', 
        description: 'Heat transfer unit with electric + water I/O',
        keywords: ['heat', 'transfer', 'thermal', 'water', 'electric']
    },
    { 
      type: 'pump', 
      label: 'Pump', 
      icon: Cog,
      color: '#F44336', 
        description: 'Liquid pump with motor and I/O ports',
        keywords: ['liquid', 'flow', 'pressure', 'motor', 'fluid']
      },
      { 
        type: 'oilTankControlPanel', 
        label: 'Oil Tank Control Panel', 
        icon: Factory,
        color: '#1565C0', 
        description: 'Complete oil tank system with integrated control panel',
        keywords: ['oil', 'tank', 'control', 'panel', 'storage', 'industrial', 'monitoring']
      },
      { 
        type: 'distillationColumn', 
        label: 'Distillation Column', 
        icon: FlaskConical,
        color: '#9C27B0', 
        description: 'Tall separation tower for separating mixtures by boiling point with reboiler and condenser',
        keywords: ['distillation', 'separation', 'boiling', 'point', 'column', 'tower', 'reboiler', 'condenser', 'processing']
      },
      { 
        type: 'mixerAgitator', 
        label: 'Mixer/Agitator', 
        icon: Blend,
        color: '#00BCD4', 
        description: 'Industrial fluid mixing tank with rotating agitator blades for homogeneous mixing',
        keywords: ['mixer', 'agitator', 'mixing', 'blending', 'stirring', 'homogeneous', 'fluid', 'tank', 'rotating', 'blades']
      },
      { 
        type: 'centrifugalCompressor', 
        label: 'Centrifugal Compressor', 
        icon: Fan,
        color: '#607D8B', 
        description: 'High-performance centrifugal compressor with motor drive, intercoolers, and anti-surge control',
        keywords: ['compressor', 'centrifugal', 'gas', 'air', 'pressure', 'motor', 'impeller', 'intercooler', 'antisurge', 'industrial']
      },
      { 
        type: 'coolingTower', 
        label: 'Cooling Tower', 
        icon: Wind,
        color: '#17A2B8', 
        description: 'Mechanical draft cooling tower with fan system, fill material, and water distribution for heat removal',
        keywords: ['cooling', 'tower', 'heat', 'removal', 'fan', 'water', 'air', 'thermal', 'draft', 'evaporation', 'industrial']
      },
      { 
        type: 'stirredTankReactor', 
        label: 'Stirred Tank Reactor', 
        icon: Factory,
        color: '#8E44AD', 
        description: 'Chemical reactor with multi-level agitation system, heating/cooling jacket, and instrumentation for controlled reactions',
        keywords: ['reactor', 'stirred', 'tank', 'chemical', 'reaction', 'agitator', 'mixing', 'heating', 'cooling', 'jacket', 'catalyst', 'process']
      },
      { 
        type: 'extruder', 
        label: 'Extruder', 
        icon: Package,
        color: '#D35400', 
        description: 'Industrial extruder for shaping materials by forcing through dies with screw mechanism, heating zones, and control system',
        keywords: ['extruder', 'extrusion', 'shape', 'forming', 'screw', 'die', 'heating', 'barrel', 'plastic', 'material', 'processing', 'molding']
      },
      { 
        type: 'heatPump', 
        label: 'Heat Pump', 
        icon: Flame,
        color: '#E65100', 
        description: 'Pool heat pump system with scroll compressor, heat exchanger, and digital temperature control (28°C setpoint) for efficient water heating',
        keywords: ['heat', 'pump', 'pool', 'heating', 'temperature', 'control', '28c', 'setpoint', 'compressor', 'heat exchanger', 'efficient', 'water']
      }
    ],
    'Storage & Transport': [
      { 
        type: 'storageTank', 
        label: 'Storage Tank', 
        icon: Cylinder,
        color: '#607D8B', 
        description: 'Large water storage with inlet/outlet',
        keywords: ['storage', 'tank', 'water', 'container', 'vessel']
      },
      { 
        type: 'conveyorBelt', 
        label: 'Conveyor Belt', 
        icon: Truck,
        color: '#607D8B', 
        description: 'Material transport with electric power',
        keywords: ['conveyor', 'transport', 'material', 'belt', 'moving']
      },
      { 
        type: 'pressureVessel', 
        label: 'Pressure Vessel', 
        icon: Container,
        color: '#455A64', 
        description: 'Pressurized containment vessel with safety valves and monitoring',
        keywords: ['pressure', 'vessel', 'containment', 'tank', 'pressurized', 'safety', 'industrial']
      },
      { 
        type: 'dayTank', 
        label: 'Day Tank', 
        icon: Fuel,
        color: '#6D4C41', 
        description: 'Daily supply storage tank with level monitoring and dispensing',
        keywords: ['day', 'tank', 'daily', 'supply', 'storage', 'fuel', 'dispensing', 'level', 'monitoring']
      },
      { 
        type: 'rackSystem', 
        label: 'Rack System', 
        icon: Container,
        color: '#546E7A', 
        description: 'Multi-level industrial storage rack for organizing and storing packaged goods vertically with forklift access',
        keywords: ['rack', 'storage', 'shelving', 'warehouse', 'vertical', 'organize', 'pallet', 'forklift', 'industrial', 'goods', 'inventory']
      },
      { 
        type: 'pipelineSystem', 
        label: 'Pipeline System', 
        icon: Truck,
        color: '#455A64', 
        description: 'Long-distance pipeline transport system for liquids and gases with professional instrumentation, valves, and safety systems',
        keywords: ['pipeline', 'transport', 'long', 'distance', 'liquid', 'gas', 'flow', 'pressure', 'valve', 'instrumentation', 'safety', 'transmission']
      },
      { 
        type: 'waterSupply', 
        label: 'Water Supply', 
        icon: Fuel,
        color: '#2196F3', 
        description: 'Fresh water supply system with pumps, filtration, and distribution infrastructure for providing clean water input to industrial processes',
        keywords: ['water', 'supply', 'fresh', 'clean', 'input', 'distribution', 'pumps', 'filtration', 'treatment', 'municipal', 'well', 'source']
      },
      { 
        type: 'waterDrain', 
        label: 'Water Drain', 
        icon: Droplets,
        color: '#1565C0', 
        description: 'Industrial water drainage system with sump pit, lift pumps, floor drains, and automated level control for removing water when needed',
        keywords: ['water', 'drain', 'drainage', 'sump', 'removal', 'floor', 'lift', 'pump', 'level', 'control', 'automated', 'waste', 'emergency']
      },
      { 
        type: 'waterPump', 
        label: 'Water Pump', 
        icon: Cog,
        color: '#0277BD', 
        description: 'Pool water circulation pump with variable speed drive, strainer basket, filtration system, and automated flow control for pool maintenance',
        keywords: ['water', 'pump', 'pool', 'circulation', 'filtration', 'variable', 'speed', 'strainer', 'basket', 'flow', 'control', 'automated', 'maintenance']
      }
    ],
    'Control Systems': [
      { 
        type: 'controlUnit', 
        label: 'Control Unit', 
        icon: Cpu,
        color: '#2196F3', 
        description: 'Central control hub with multiple I/O',
        keywords: ['control', 'automation', 'plc', 'hub', 'logic']
    },
    { 
      type: 'valve', 
      label: 'Valve', 
      icon: Move,
      color: '#FF9800', 
        description: 'Flow control with electric actuation',
        keywords: ['valve', 'flow', 'control', 'actuator', 'regulation']
    },
    { 
      type: 'sensor', 
      label: 'Sensor', 
        icon: Gauge,
      color: '#9C27B0', 
        description: 'Process monitoring with signal output',
        keywords: ['sensor', 'measurement', 'monitoring', 'signal', 'feedback']
      },
      { 
        type: 'temperatureSwitch', 
        label: 'Temperature Switch', 
        icon: Gauge,
        color: '#E74C3C', 
        description: 'High/low temperature alarm and shutdown device',
        keywords: ['temperature', 'switch', 'alarm', 'shutdown', 'safety', 'monitoring', 'thermal']
      },
      { 
        type: 'pressureSensor', 
        label: 'Pressure Sensor', 
        icon: Gauge,
        color: '#3498DB', 
        description: 'Industrial pressure transmitter with 4-20mA signal and alarms',
        keywords: ['pressure', 'sensor', 'transmitter', '4-20ma', 'alarm', 'monitoring', 'process']
      },
      { 
        type: 'pressureControlValve', 
        label: 'Pressure Control Valve', 
        icon: Move,
        color: '#8B5CF6', 
        description: 'Automated pressure control valve with high/low alarms and monitoring',
                keywords: ['pressure', 'control', 'valve', 'alarm', 'actuator', 'automation', 'regulation', 'monitoring']
      }
    ],
    'Electrical': [
    { 
      type: 'powerBox', 
      label: 'Power Box', 
      icon: Battery,
      color: '#FF9800', 
        description: 'Electrical distribution with 4 outputs',
        keywords: ['power', 'electrical', 'distribution', 'supply', 'voltage']
      },
      { 
        type: 'motorStarter', 
        label: 'Motor Starter', 
        icon: Zap,
        color: '#7C3AED', 
        description: 'Motor control and protection with contactors and overload relay',
                keywords: ['motor', 'starter', 'contactor', 'overload', 'control', 'protection', 'electrical']
      }
    ]
  };

  // Category information with icons and colors
  const categoryInfo = {
    'Processing Equipment': {
      icon: Factory,
      color: '#FF9800',
      description: 'Manufacturing and processing components'
    },
    'Storage & Transport': {
      icon: Package,
      color: '#607D8B',
      description: 'Storage vessels and material handling'
    },
    'Control Systems': {
      icon: Microchip,
      color: '#2196F3',
      description: 'Automation and control devices'
    },
    'Electrical': {
      icon: Zap,
      color: '#FFC107',
      description: 'Power distribution and electrical equipment'
    }
  };

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

  const handleTooltipShow = (component, event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setActiveTooltip(component);
  };

  const handleTooltipHide = () => {
    setActiveTooltip(null);
  };

  const getFilteredComponents = () => {
    if (selectedCategory) {
      const categoryComponents = componentCategories[selectedCategory] || [];
      if (!searchTerm) return categoryComponents;
      
      return categoryComponents.filter(component =>
        component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (!searchTerm) return [];
    
    return Object.values(componentCategories).flat().filter(component =>
      component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getFilteredCategories = () => {
    if (!searchTerm) return Object.keys(componentCategories);
    
    return Object.keys(componentCategories).filter(category => {
      const categoryComponents = componentCategories[category];
      return categoryComponents.some(component =>
        component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  };

  React.useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCameraControlsRef(cameraControlsRef.current);
    }
  }, []);

  const sidebarWidth = sidebarCollapsed ? '60px' : '320px';

  return (
    <div className="relative w-screen h-screen bg-gray-900 overflow-hidden">
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.9);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 114, 128, 0.8) rgba(55, 65, 81, 0.3);
        }
      `}</style>

      {/* Full Screen 3D Canvas */}
      <Canvas
        camera={{ position: [15, 10, 15], fov: 50 }}
        shadows
        className="absolute inset-0"
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

      {/* Floating Mode Controls - Top Center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-lg p-1 border border-gray-700 shadow-xl">
        <Button
          onClick={() => setMode('select')}
          className={`h-8 w-8 p-0 flex items-center justify-center text-white ${
            currentMode === 'select' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-transparent hover:bg-gray-700'
          }`}
          variant={currentMode === 'select' ? "default" : "ghost"}
          title="Select Mode"
        >
          <MousePointer size={16} className="text-white" />
        </Button>
        <Button
          onClick={() => setMode('delete')}
          className={`h-8 w-8 p-0 flex items-center justify-center text-white ${
            currentMode === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-transparent hover:bg-gray-700'
          }`}
          variant={currentMode === 'delete' ? "default" : "ghost"}
          title="Delete Mode"
        >
          <Trash2 size={16} className="text-white" />
        </Button>
      </div>

      {/* Floating Scene Controls - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Button
          onClick={autoLayout}
          className="h-8 w-8 p-0 bg-black/80 backdrop-blur-sm hover:bg-gray-700 border border-gray-700 shadow-xl text-white"
          variant="outline"
          title="Auto Layout Objects"
        >
          <Layout size={16} className="text-white" />
        </Button>

        <Button
          onClick={clearAll}
          className="h-8 w-8 p-0 bg-black/80 backdrop-blur-sm hover:bg-red-700 border border-gray-700 shadow-xl text-white"
          variant="outline"
          title="Clear All Objects"
        >
          <RotateCcw size={16} className="text-white" />
        </Button>

        {/* CAD Controls Dropdown */}
        <div className="relative">
          <Button
            onClick={() => setShowCADControls(!showCADControls)}
            className="h-8 w-8 p-0 bg-black/80 backdrop-blur-sm hover:bg-gray-700 border border-gray-700 shadow-xl text-white"
            variant="outline"
            title="CAD Controls"
          >
            <Grid2x2 size={16} className="text-white" />
          </Button>
          
          {showCADControls && (
            <div className="absolute right-0 top-10 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl min-w-[280px] z-30">
              <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Grid2x2 size={16} />
                CAD Controls
              </h4>
              
              {/* Grid Snap Toggle */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm">Grid Snap:</span>
                <Button
                  onClick={() => setGridSnap(!gridSnap)}
                  className={`h-7 px-3 flex items-center gap-2 ${
                    gridSnap ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  variant={gridSnap ? "default" : "outline"}
                >
                  <Grid2x2 size={12} />
                  <span className="text-xs">{gridSnap ? 'ON' : 'OFF'}</span>
                </Button>
              </div>
              
              {/* Grid Size Selection */}
              <div className="mb-3">
                <span className="text-gray-300 text-sm block mb-2">Grid Size:</span>
                <div className="grid grid-cols-4 gap-1">
                  {gridSizes.map(size => (
                    <Button
                      key={size.value}
                      onClick={() => setGridSize(size.value)}
                      className={`h-7 text-xs ${
                        gridSize === size.value ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
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
                <span className="text-gray-300 text-sm">Coordinates:</span>
                <Button
                  onClick={() => setShowCoordinates(!showCoordinates)}
                  className={`h-7 px-3 flex items-center gap-2 ${
                    showCoordinates ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  variant={showCoordinates ? "default" : "outline"}
                >
                  <MapPin size={12} />
                  <span className="text-xs">{showCoordinates ? 'ON' : 'OFF'}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Components Panel - Left Side */}
      <div 
        className="absolute top-4 left-4 bottom-4 z-20 bg-black/80 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg transition-all duration-300 flex flex-col" 
        style={{ width: sidebarWidth }}
      >
        {/* Header with Collapse/Expand */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700/50 flex-shrink-0">
          {!sidebarCollapsed && (
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <Factory size={16} className="text-white" />
              Components
            </h3>
          )}
          <Button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-6 w-6 p-0 bg-gray-700/50 hover:bg-gray-600 border-0 text-white"
            variant="outline"
            title={sidebarCollapsed ? "Expand Components" : "Collapse Components"}
          >
            {sidebarCollapsed ? <ChevronRight size={12} className="text-white" /> : <ChevronLeft size={12} className="text-white" />}
          </Button>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-700/50 flex-shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation */}
            {selectedCategory && (
              <div className="p-3 border-b border-gray-700/50 flex-shrink-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Categories
                </button>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {!selectedCategory ? (
                /* Category Selection */
                <div className="space-y-2">
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    {searchTerm ? 'Matching Categories' : 'Select Category'}
                  </h4>
                  {getFilteredCategories().map(category => {
                    const categoryComponents = componentCategories[category];
                    const matchingCount = searchTerm ? 
                      categoryComponents.filter(comp => 
                        comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        comp.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
                      ).length : categoryComponents.length;

                    const catInfo = categoryInfo[category];
                    const CategoryIcon = catInfo?.icon || Box;

                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="w-full p-4 bg-gray-900/50 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-500 rounded-lg text-left transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="flex items-center justify-center w-10 h-10 rounded-lg"
                            style={{ backgroundColor: `${catInfo?.color}20`, borderColor: `${catInfo?.color}40` }}
                          >
                            <CategoryIcon 
                              size={20} 
                              style={{ color: catInfo?.color }} 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm group-hover:text-blue-200">
                              {category}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {catInfo?.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-1">
                          <span>{matchingCount} component{matchingCount !== 1 ? 's' : ''}</span>
                          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Component Grid */
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      const catInfo = categoryInfo[selectedCategory];
                      const CategoryIcon = catInfo?.icon || Box;
                      return (
                        <>
                          <div 
                            className="flex items-center justify-center w-8 h-8 rounded-lg"
                            style={{ backgroundColor: `${catInfo?.color}20` }}
                          >
                            <CategoryIcon 
                              size={16} 
                              style={{ color: catInfo?.color }} 
                            />
                          </div>
                          <div>
                            <h4 className="text-white text-sm font-semibold">
                              {selectedCategory}
                              {searchTerm && <span className="text-gray-400 ml-2 text-xs">(filtered)</span>}
                            </h4>
                            <p className="text-gray-400 text-xs">{catInfo?.description}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {getFilteredComponents().map(component => {
                      const IconComponent = component.icon;
                      return (
                        <Button
                          key={component.type}
                          onClick={() => addObject(component.type)}
                          onMouseEnter={(e) => handleTooltipShow(component, e)}
                          onMouseLeave={handleTooltipHide}
                          className="h-20 bg-gray-900/70 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-500 flex flex-col items-center justify-center gap-2 transition-all duration-200 text-white p-2"
                          variant="outline"
                        >
                          <IconComponent 
                            size={20} 
                            style={{ color: component.color }}
                            className="flex-shrink-0"
                          />
                          <span className="text-xs text-white leading-tight text-center" style={{ wordBreak: 'break-word' }}>
                            {component.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Collapsed View */}
        {sidebarCollapsed && (
          <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              {Object.values(componentCategories).flat().map(component => {
                const IconComponent = component.icon;
                return (
                  <Button
                    key={component.type}
                    onClick={() => addObject(component.type)}
                    onMouseEnter={(e) => handleTooltipShow(component, e)}
                    onMouseLeave={handleTooltipHide}
                    className="h-10 w-10 p-0 bg-gray-900/70 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-500 flex items-center justify-center text-white mx-auto"
                    variant="outline"
                  >
                    <IconComponent 
                      size={18} 
                      style={{ color: component.color }}
                    />
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Global Tooltip - Rendered outside all containers */}
      {activeTooltip && (
        <div 
          className="fixed bg-gray-900/95 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm border border-gray-600 shadow-2xl pointer-events-none transition-all duration-200 min-w-max max-w-xs"
          style={{ 
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 99999
          }}
        >
          <div className="font-semibold text-white mb-1 flex items-center gap-2">
            <activeTooltip.icon size={14} style={{ color: activeTooltip.color }} />
            {activeTooltip.label}
          </div>
          <div className="text-gray-300 text-xs leading-relaxed">
            {activeTooltip.description}
          </div>
          {/* Arrow pointing down */}
          <div 
            className="absolute top-full left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-gray-900/95"
            style={{ transform: 'translateX(-50%)' }}
          ></div>
        </div>
      )}

      {/* Floating Status Info - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
        <div className="flex items-center gap-4 text-xs text-gray-300">
          <span>Mode: <span className="text-white font-medium">{currentMode}</span></span>
          <span>Grid: <span className="text-white font-medium">{gridSize}m</span></span>
          <span className={gridSnap ? 'text-green-400' : 'text-red-400'}>
            {gridSnap ? '● Snap' : '○ Free'}
          </span>
        </div>
      </div>

      {/* Click overlay to close CAD controls */}
      {showCADControls && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowCADControls(false)}
        />
      )}
    </div>
  );
};

export default PlantVisualization;
