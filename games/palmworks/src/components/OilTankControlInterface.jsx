import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';

const OilTankControlInterface = ({ isOpen, onClose, tankId = "TANK-001" }) => {
  if (!isOpen) return null;
  
  const [systemStatus, setSystemStatus] = useState({
    isRunning: false,
    isEmergencyStop: false,
    isMaintenanceMode: false,
    lastUpdate: new Date()
  });

  // Level Control States
  const [levelData, setLevelData] = useState({
    currentLevel: 75.5,
    minLevel: 10,
    maxLevel: 95,
    targetLevel: 80,
    levelAlarm: false,
    overfillProtection: true
  });

  // Temperature Control States
  const [temperatureData, setTemperatureData] = useState({
    currentTemp: 45.2,
    targetTemp: 50,
    minTemp: 20,
    maxTemp: 80,
    heatingEnabled: false,
    coolingEnabled: false,
    tempAlarm: false
  });

  // Pressure Control States
  const [pressureData, setPressureData] = useState({
    currentPressure: 2.3,
    maxPressure: 5.0,
    pressureAlarm: false,
    reliefValveOpen: false
  });

  // Flow Control States
  const [flowData, setFlowData] = useState({
    inletFlow: 125.4,
    outletFlow: 98.7,
    returnFlow: 26.7,
    targetInletFlow: 150,
    targetOutletFlow: 100,
    flowAlarm: false
  });

  // Pump Control States
  const [pumpData, setPumpData] = useState({
    pump1Running: true,
    pump2Running: false,
    pump1Speed: 85,
    pump2Speed: 0,
    pump1Pressure: 3.2,
    pump2Pressure: 0,
    autoMode: true
  });

  // Valve Control States
  const [valveData, setValveData] = useState({
    inletValve: 75,
    outletValve: 60,
    bypassValve: 10,
    drainValve: 0,
    ventValve: 25,
    autoValveControl: true
  });

  // Simulation effect for live data
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setLevelData(prev => ({
        ...prev,
        currentLevel: Math.max(0, Math.min(100, prev.currentLevel + (Math.random() - 0.5) * 0.5))
      }));

      setTemperatureData(prev => ({
        ...prev,
        currentTemp: Math.max(0, prev.currentTemp + (Math.random() - 0.5) * 2)
      }));

      setPressureData(prev => ({
        ...prev,
        currentPressure: Math.max(0, prev.currentPressure + (Math.random() - 0.5) * 0.2)
      }));

      setFlowData(prev => ({
        ...prev,
        inletFlow: Math.max(0, prev.inletFlow + (Math.random() - 0.5) * 10),
        outletFlow: Math.max(0, prev.outletFlow + (Math.random() - 0.5) * 8)
      }));

      setSystemStatus(prev => ({ ...prev, lastUpdate: new Date() }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleEmergencyStop = () => {
    setSystemStatus(prev => ({
      ...prev,
      isEmergencyStop: !prev.isEmergencyStop,
      isRunning: prev.isEmergencyStop ? prev.isRunning : false
    }));
  };

  const handleSystemStart = () => {
    if (!systemStatus.isEmergencyStop) {
      setSystemStatus(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }
  };

  const getStatusColor = (status) => {
    if (systemStatus.isEmergencyStop) return 'destructive';
    if (!systemStatus.isRunning) return 'secondary';
    return status ? 'default' : 'destructive';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Oil Tank Control Panel - {tankId}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold">Tank Level</h3>
            <div className="text-2xl font-bold">{levelData.currentLevel.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Target: {levelData.targetLevel}%</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold">System Status</h3>
            <div className="text-lg font-bold">
              {systemStatus.isEmergencyStop ? 'EMERGENCY STOP' : 
               systemStatus.isRunning ? 'RUNNING' : 'STOPPED'}
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-semibold">Temperature</h3>
            <div className="text-2xl font-bold">{temperatureData.currentTemp.toFixed(1)}°C</div>
            <div className="text-sm text-gray-500">Target: {temperatureData.targetTemp}°C</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-semibold">Pressure</h3>
            <div className="text-2xl font-bold">{pressureData.currentPressure.toFixed(1)} bar</div>
            <div className="text-sm text-gray-500">Max: {pressureData.maxPressure} bar</div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <button 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleEmergencyStop}
          >
            {systemStatus.isEmergencyStop ? "RESET E-STOP" : "EMERGENCY STOP"}
          </button>
          
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSystemStart}
            disabled={systemStatus.isEmergencyStop}
          >
            {systemStatus.isRunning ? "STOP SYSTEM" : "START SYSTEM"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OilTankControlInterface; 