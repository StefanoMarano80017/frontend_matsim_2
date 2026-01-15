import React, { useState } from 'react';
import { Box } from '@mui/material';
import MapView from '../components/map';
import EnhancedFloatingMenu from '../components/EnhancedFloatingMenu';
import { useSimulationSocket } from '../hooks/useSimulationSocket';
import { useMockSimulation } from '../hooks/useMockSimulation';
import { useSimulation } from '../contexts/SimulationContext.jsx';
import './SimulationMapPage.css';

const SimulationMapPage = () => {
  const { isSimulationRunning, monitoringVehicles, monitoringHubs, simulationStats } = useSimulation();
  const { vehicles, hubs, isConnected, stats } = useSimulationSocket();
  useMockSimulation(); // Start mock updates when simulation is running
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filters, setFilters] = useState({
    showCharging: true,
    showIdle: true,
    showMoving: true,
  });

  // Use monitoring data from context if simulation is running, otherwise use WebSocket
  const displayVehicles = isSimulationRunning ? monitoringVehicles : vehicles;
  const displayHubs = isSimulationRunning ? monitoringHubs : hubs;
  const displayStats = isSimulationRunning ? simulationStats : stats;

  console.log('[SimulationMapPage] isSimulationRunning:', isSimulationRunning, 'displayHubs:', displayHubs);

  // Filter vehicles based on state
  const filteredVehicles = displayVehicles.filter((v) => {
    if (v.state === 'charging' && !filters.showCharging) return false;
    if (v.state === 'idle' && !filters.showIdle) return false;
    if (v.state === 'moving' && !filters.showMoving) return false;
    return true;
  });

  const allPois = [
    ...filteredVehicles,
    ...displayHubs,
  ];

  const handleMarkerClick = (poi) => {
    if (poi.type === 'vehicle') {
      setSelectedVehicle(poi);
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <EnhancedFloatingMenu
        vehicles={filteredVehicles}
        hubs={displayHubs}
        stats={displayStats}
        onSelectVehicle={setSelectedVehicle}
        filters={filters}
        onFiltersChange={setFilters}
        isConnected={isConnected || isSimulationRunning}
      />
      <MapView pois={allPois} onSelectPoi={handleMarkerClick} selectedVehicle={selectedVehicle} />
    </Box>
  );
};

export default SimulationMapPage;
