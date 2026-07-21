import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';

const ConnectionManager = ({ selectedObjects, mode, sceneRef }) => {
  const [connectionType, setConnectionType] = useState('liquid');

  const connectionTypes = [
    { type: 'liquid', label: 'Liquid', color: 'bg-blue-500', icon: '💧' },
    { type: 'gas', label: 'Gas', color: 'bg-yellow-500', icon: '💨' },
    { type: 'electric', label: 'Electric', color: 'bg-red-500', icon: '⚡' }
  ];

  const createConnection = (type) => {
    if (sceneRef.current && selectedObjects.length === 2) {
      sceneRef.current.createConnection(selectedObjects[0], selectedObjects[1], type);
    }
  };

  if (mode !== 'connect' || selectedObjects.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-10 bg-black/80 p-4 rounded-lg text-white min-w-[200px]">
      <h4 className="text-sm font-semibold mb-3">Connection Types</h4>
      
      <div className="space-y-2 mb-4">
        {connectionTypes.map(type => (
          <Button
            key={type.type}
            onClick={() => setConnectionType(type.type)}
            className={`w-full text-xs h-8 flex items-center gap-2 ${
              connectionType === type.type ? type.color : 'bg-gray-600'
            }`}
            variant={connectionType === type.type ? "default" : "outline"}
          >
            <span>{type.icon}</span>
            {type.label}
          </Button>
        ))}
      </div>

      {selectedObjects.length === 1 && (
        <div className="text-xs text-gray-300">
          Select another object to connect
        </div>
      )}

      {selectedObjects.length === 2 && (
        <Button
          onClick={() => createConnection(connectionType)}
          className="w-full text-xs h-8 bg-green-600 hover:bg-green-700"
        >
          Create {connectionType} Connection
        </Button>
      )}

      <div className="mt-3 text-xs text-gray-400">
        <div className="mb-1"><strong>Connection Types:</strong></div>
        <div>💧 Liquid: Process fluids, water</div>
        <div>💨 Gas: Steam, air, process gases</div>
        <div>⚡ Electric: Power, control signals</div>
      </div>
    </div>
  );
};

export default ConnectionManager; 