import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import { Switch } from '../../components/ui/switch';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const OilTankControlInterface = ({ isOpen, onClose, tankId = "TANK-001" }) => {
  // System Status States
  const [systemStatus, setSystemStatus] = useState({
    isRunning: false,
    isEmergencyStop: false,
    isMaintenanceMode: false,
    lastUpdate: new Date()
  });

  // Level Control States
  const [levelData, setLevelData] = useState({
    currentLevel: 75.5, // percentage
    minLevel: 10,
    maxLevel: 95,
    targetLevel: 80,
    levelAlarm: false,
    overfillProtection: true
  });

  // Temperature Control States
  const [temperatureData, setTemperatureData] = useState({
    currentTemp: 45.2, // Celsius
    targetTemp: 50,
    minTemp: 20,
    maxTemp: 80,
    heatingEnabled: false,
    coolingEnabled: false,
    tempAlarm: false
  });

  // Pressure Control States
  const [pressureData, setPressureData] = useState({
    currentPressure: 2.3, // bar
    maxPressure: 5.0,
    pressureAlarm: false,
    reliefValveOpen: false
  });

  // Flow Control States
  const [flowData, setFlowData] = useState({
    inletFlow: 125.4, // L/min
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
    pump1Speed: 85, // percentage
    pump2Speed: 0,
    pump1Pressure: 3.2,
    pump2Pressure: 0,
    autoMode: true
  });

  // Valve Control States
  const [valveData, setValveData] = useState({
    inletValve: 75, // percentage open
    outletValve: 60,
    bypassValve: 10,
    drainValve: 0,
    ventValve: 25,
    autoValveControl: true
  });

  // Filtration System States
  const [filtrationData, setFiltrationData] = useState({
    filter1Active: true,
    filter2Active: false,
    filter1Pressure: 1.8,
    filter2Pressure: 0,
    filterCleaningDue: false,
    lastCleaning: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  });

  // Alarm States
  const [alarms, setAlarms] = useState([
    { id: 1, type: 'warning', message: 'Filter cleaning due in 2 days', timestamp: new Date(), acknowledged: false },
    { id: 2, type: 'info', message: 'Maintenance scheduled for next week', timestamp: new Date(), acknowledged: true }
  ]);

  // Simulation effect for live data
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Simulate live data updates
      setLevelData(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + (Math.random() - 0.5) * 0.5,
        levelAlarm: prev.currentLevel < prev.minLevel || prev.currentLevel > prev.maxLevel
      }));

      setTemperatureData(prev => ({
        ...prev,
        currentTemp: prev.currentTemp + (Math.random() - 0.5) * 2,
        tempAlarm: prev.currentTemp < prev.minTemp || prev.currentTemp > prev.maxTemp
      }));

      setPressureData(prev => ({
        ...prev,
        currentPressure: Math.max(0, prev.currentPressure + (Math.random() - 0.5) * 0.2),
        pressureAlarm: prev.currentPressure > prev.maxPressure * 0.9
      }));

      setFlowData(prev => ({
        ...prev,
        inletFlow: Math.max(0, prev.inletFlow + (Math.random() - 0.5) * 10),
        outletFlow: Math.max(0, prev.outletFlow + (Math.random() - 0.5) * 8),
        returnFlow: Math.max(0, prev.returnFlow + (Math.random() - 0.5) * 5)
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

  const acknowledgeAlarm = (alarmId) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId ? { ...alarm, acknowledged: true } : alarm
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Industrial Oil Tank Control Panel - {tankId}</span>
            <div className="flex gap-2">
              <Badge variant={getStatusColor(systemStatus.isRunning)}>
                {systemStatus.isEmergencyStop ? 'EMERGENCY STOP' : 
                 systemStatus.isRunning ? 'RUNNING' : 'STOPPED'}
              </Badge>
              <Badge variant="outline">
                Last Update: {systemStatus.lastUpdate.toLocaleTimeString()}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Emergency Controls */}
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-600">Emergency Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  variant={systemStatus.isEmergencyStop ? "default" : "destructive"}
                  size="lg"
                  onClick={handleEmergencyStop}
                  className="min-w-[150px]"
                >
                  {systemStatus.isEmergencyStop ? "RESET E-STOP" : "EMERGENCY STOP"}
                </Button>
                <Button 
                  variant={systemStatus.isRunning ? "destructive" : "default"}
                  size="lg"
                  onClick={handleSystemStart}
                  disabled={systemStatus.isEmergencyStop}
                  className="min-w-[150px]"
                >
                  {systemStatus.isRunning ? "STOP SYSTEM" : "START SYSTEM"}
                </Button>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={systemStatus.isMaintenanceMode}
                    onCheckedChange={(checked) => 
                      setSystemStatus(prev => ({ ...prev, isMaintenanceMode: checked }))
                    }
                  />
                  <Label>Maintenance Mode</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Alarms */}
          {alarms.filter(alarm => !alarm.acknowledged).length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <strong>Active Alarms:</strong>
                  {alarms.filter(alarm => !alarm.acknowledged).map(alarm => (
                    <div key={alarm.id} className="flex items-center justify-between">
                      <span>{alarm.message}</span>
                      <Button size="sm" onClick={() => acknowledgeAlarm(alarm.id)}>
                        Acknowledge
                      </Button>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="level">Level Control</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="flow">Flow Control</TabsTrigger>
              <TabsTrigger value="pumps">Pumps & Valves</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tank Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{levelData.currentLevel.toFixed(1)}%</div>
                      <Progress value={levelData.currentLevel} className="w-full" />
                      <div className="text-xs text-gray-500">
                        Target: {levelData.targetLevel}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{temperatureData.currentTemp.toFixed(1)}°C</div>
                      <Progress value={(temperatureData.currentTemp / temperatureData.maxTemp) * 100} className="w-full" />
                      <div className="text-xs text-gray-500">
                        Target: {temperatureData.targetTemp}°C
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pressure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{pressureData.currentPressure.toFixed(1)} bar</div>
                      <Progress value={(pressureData.currentPressure / pressureData.maxPressure) * 100} className="w-full" />
                      <div className="text-xs text-gray-500">
                        Max: {pressureData.maxPressure} bar
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Flow Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-lg font-bold">In: {flowData.inletFlow.toFixed(0)} L/min</div>
                      <div className="text-lg font-bold">Out: {flowData.outletFlow.toFixed(0)} L/min</div>
                      <div className="text-xs text-gray-500">
                        Net: {(flowData.inletFlow - flowData.outletFlow).toFixed(0)} L/min
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Level Control Tab */}
            <TabsContent value="level" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Level Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Level: {levelData.currentLevel.toFixed(1)}%</Label>
                      <Progress value={levelData.currentLevel} className="mt-2" />
                    </div>
                    
                    <div>
                      <Label>Target Level</Label>
                      <Slider
                        value={[levelData.targetLevel]}
                        onValueChange={(value) => setLevelData(prev => ({ ...prev, targetLevel: value[0] }))}
                        max={95}
                        min={10}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-sm text-gray-500 mt-1">{levelData.targetLevel}%</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Level</Label>
                        <Input 
                          type="number" 
                          value={levelData.minLevel}
                          onChange={(e) => setLevelData(prev => ({ ...prev, minLevel: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label>Max Level</Label>
                        <Input 
                          type="number" 
                          value={levelData.maxLevel}
                          onChange={(e) => setLevelData(prev => ({ ...prev, maxLevel: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Level Control Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={levelData.overfillProtection}
                        onCheckedChange={(checked) => setLevelData(prev => ({ ...prev, overfillProtection: checked }))}
                      />
                      <Label>Overfill Protection</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={levelData.levelAlarm}
                        onCheckedChange={(checked) => setLevelData(prev => ({ ...prev, levelAlarm: checked }))}
                      />
                      <Label>Level Alarm Active</Label>
                    </div>

                    {levelData.levelAlarm && (
                      <Alert>
                        <AlertDescription>
                          Level alarm: Current level is outside safe operating range
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Temperature Control Tab */}
            <TabsContent value="temperature" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Temperature: {temperatureData.currentTemp.toFixed(1)}°C</Label>
                      <Progress value={(temperatureData.currentTemp / temperatureData.maxTemp) * 100} className="mt-2" />
                    </div>
                    
                    <div>
                      <Label>Target Temperature</Label>
                      <Slider
                        value={[temperatureData.targetTemp]}
                        onValueChange={(value) => setTemperatureData(prev => ({ ...prev, targetTemp: value[0] }))}
                        max={temperatureData.maxTemp}
                        min={temperatureData.minTemp}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-sm text-gray-500 mt-1">{temperatureData.targetTemp}°C</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={temperatureData.heatingEnabled}
                          onCheckedChange={(checked) => setTemperatureData(prev => ({ ...prev, heatingEnabled: checked }))}
                        />
                        <Label>Heating</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={temperatureData.coolingEnabled}
                          onCheckedChange={(checked) => setTemperatureData(prev => ({ ...prev, coolingEnabled: checked }))}
                        />
                        <Label>Cooling</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Limits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Temperature</Label>
                        <Input 
                          type="number" 
                          value={temperatureData.minTemp}
                          onChange={(e) => setTemperatureData(prev => ({ ...prev, minTemp: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label>Max Temperature</Label>
                        <Input 
                          type="number" 
                          value={temperatureData.maxTemp}
                          onChange={(e) => setTemperatureData(prev => ({ ...prev, maxTemp: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    {temperatureData.tempAlarm && (
                      <Alert>
                        <AlertDescription>
                          Temperature alarm: Current temperature is outside safe operating range
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Flow Control Tab */}
            <TabsContent value="flow" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inlet Flow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current: {flowData.inletFlow.toFixed(1)} L/min</Label>
                      <Progress value={(flowData.inletFlow / 200) * 100} className="mt-2" />
                    </div>
                    
                    <div>
                      <Label>Target Flow Rate</Label>
                      <Slider
                        value={[flowData.targetInletFlow]}
                        onValueChange={(value) => setFlowData(prev => ({ ...prev, targetInletFlow: value[0] }))}
                        max={200}
                        min={0}
                        step={5}
                        className="mt-2"
                      />
                      <div className="text-sm text-gray-500 mt-1">{flowData.targetInletFlow} L/min</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Outlet Flow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current: {flowData.outletFlow.toFixed(1)} L/min</Label>
                      <Progress value={(flowData.outletFlow / 200) * 100} className="mt-2" />
                    </div>
                    
                    <div>
                      <Label>Target Flow Rate</Label>
                      <Slider
                        value={[flowData.targetOutletFlow]}
                        onValueChange={(value) => setFlowData(prev => ({ ...prev, targetOutletFlow: value[0] }))}
                        max={200}
                        min={0}
                        step={5}
                        className="mt-2"
                      />
                      <div className="text-sm text-gray-500 mt-1">{flowData.targetOutletFlow} L/min</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Return Flow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current: {flowData.returnFlow.toFixed(1)} L/min</Label>
                      <Progress value={(flowData.returnFlow / 100) * 100} className="mt-2" />
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-4">
                      Net Flow: {(flowData.inletFlow - flowData.outletFlow).toFixed(1)} L/min
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pumps & Valves Tab */}
            <TabsContent value="pumps" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pump Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={pumpData.autoMode}
                        onCheckedChange={(checked) => setPumpData(prev => ({ ...prev, autoMode: checked }))}
                      />
                      <Label>Auto Mode</Label>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Pump 1</Label>
                          <Switch 
                            checked={pumpData.pump1Running}
                            onCheckedChange={(checked) => setPumpData(prev => ({ ...prev, pump1Running: checked }))}
                            disabled={pumpData.autoMode}
                          />
                        </div>
                        <Label className="text-sm">Speed: {pumpData.pump1Speed}%</Label>
                        <Slider
                          value={[pumpData.pump1Speed]}
                          onValueChange={(value) => setPumpData(prev => ({ ...prev, pump1Speed: value[0] }))}
                          max={100}
                          min={0}
                          step={5}
                          className="mt-2"
                          disabled={pumpData.autoMode || !pumpData.pump1Running}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Pressure: {pumpData.pump1Pressure} bar
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Pump 2</Label>
                          <Switch 
                            checked={pumpData.pump2Running}
                            onCheckedChange={(checked) => setPumpData(prev => ({ ...prev, pump2Running: checked }))}
                            disabled={pumpData.autoMode}
                          />
                        </div>
                        <Label className="text-sm">Speed: {pumpData.pump2Speed}%</Label>
                        <Slider
                          value={[pumpData.pump2Speed]}
                          onValueChange={(value) => setPumpData(prev => ({ ...prev, pump2Speed: value[0] }))}
                          max={100}
                          min={0}
                          step={5}
                          className="mt-2"
                          disabled={pumpData.autoMode || !pumpData.pump2Running}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Pressure: {pumpData.pump2Pressure} bar
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Valve Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={valveData.autoValveControl}
                        onCheckedChange={(checked) => setValveData(prev => ({ ...prev, autoValveControl: checked }))}
                      />
                      <Label>Auto Valve Control</Label>
                    </div>

                    {Object.entries(valveData).filter(([key]) => key.includes('Valve') && key !== 'autoValveControl').map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}%</Label>
                        <Slider
                          value={[value]}
                          onValueChange={(newValue) => setValveData(prev => ({ ...prev, [key]: newValue[0] }))}
                          max={100}
                          min={0}
                          step={5}
                          className="mt-2"
                          disabled={valveData.autoValveControl}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtration System</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Filter 1</Label>
                        <Badge variant={filtrationData.filter1Active ? "default" : "secondary"}>
                          {filtrationData.filter1Active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Pressure: {filtrationData.filter1Pressure} bar
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Filter 2</Label>
                        <Badge variant={filtrationData.filter2Active ? "default" : "secondary"}>
                          {filtrationData.filter2Active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Pressure: {filtrationData.filter2Pressure} bar
                      </div>
                    </div>

                    <div className="text-sm">
                      Last Cleaning: {filtrationData.lastCleaning.toLocaleDateString()}
                    </div>

                    {filtrationData.filterCleaningDue && (
                      <Alert>
                        <AlertDescription>
                          Filter cleaning is due. Schedule maintenance.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Alarms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {alarms.length === 0 ? (
                        <div className="text-sm text-gray-500">No active alarms</div>
                      ) : (
                        alarms.map(alarm => (
                          <div key={alarm.id} className={`p-2 rounded border ${alarm.acknowledged ? 'bg-gray-50' : 'bg-yellow-50'}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{alarm.message}</span>
                              {!alarm.acknowledged && (
                                <Button size="sm" onClick={() => acknowledgeAlarm(alarm.id)}>
                                  Ack
                                </Button>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {alarm.timestamp.toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OilTankControlInterface; 