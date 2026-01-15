import React, { useState } from 'react';
import MapView from './components/map';
import FloatingMenu from './components/FloatingMenu';
import { Box } from '@mui/material';
import './App.css';

function App() {

  const [pois, setPois] = useState([
    { id: 1, name: "Alexanderplatz", pos: [52.5219, 13.4132], type: 'home' },
    { id: 2, name: "Reichstag", pos: [52.5186, 13.3761], type: 'work' },
    { id: 3, name: "Waldeckpark", pos: [52.5065, 13.4042], type: 'hub' },
  ]);

  const togglePin = (id) => {
    setPois(prevPois => prevPois.map(poi => 
      poi.id === id ? { ...poi, pinned: !poi.pinned } : poi
    ));
  };

  const handleAddPoi = (type) => {
    const newPoi = {
      id: `DEV-${Math.floor(Math.random() * 9000 + 1000)}`,
      type: type,
      name: type === 'vehicle' ? `Tesla Model 3` : `Hub Berlino`,
      model: type === 'vehicle' ? 'Tesla Model 3' : 'N/A',
      status: type === 'vehicle' ? 'In Movimento' : 'Attivo',
      soc: Math.floor(Math.random() * 100),
      pos: [52.52 + (Math.random() - 0.5) * 0.05, 13.40 + (Math.random() - 0.5) * 0.05]
    };
    setPois([...pois, newPoi]);
  };

  const onMarkerClick = (poi) => {
    if (poi.type === 'vehicle') {
      setSelectedVehicle(poi);
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <FloatingMenu pois={pois} onTogglePin={togglePin} onAddPoi={handleAddPoi}/>
      <MapView pois={pois} onSelectPoi={onMarkerClick}/>
    </Box>
  );
}

export default App;