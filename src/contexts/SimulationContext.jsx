import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * SimulationContext
 * Central state management for simulation setup, vehicle data, and monitoring
 */
const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
  // Setup configuration
  const [vehicleConfig, setVehicleConfig] = useState(null);
  const [chargingHubs, setChargingHubs] = useState(null);

  // Vehicle list
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Simulation state
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationId, setSimulationId] = useState(null);

  // Monitoring data (real-time updates)
  const [monitoringVehicles, setMonitoringVehicles] = useState([]);
  const [monitoringHubs, setMonitoringHubs] = useState([]);
  const [simulationStats, setSimulationStats] = useState({
    totalVehicles: 0,
    vehiclesCharging: 0,
    vehiclesMoving: 0,
    vehiclesIdle: 0,
    saturatedHubs: 0,
    averageSoC: 0,
  });

  // Setup phase: store initial config
  const initializeSetup = useCallback((config, hubs) => {
    console.log('[SimulationContext] Initializing setup with hubs:', hubs);
    setVehicleConfig(config);
    setChargingHubs(hubs);
  }, []);

  // Vehicle generation: store vehicles after inspection
  const setGeneratedVehicles = useCallback((vehicleList) => {
    setVehicles(vehicleList);
    if (vehicleList.length > 0) {
      setSelectedVehicleId(vehicleList[0].id);
    }
  }, []);

  // Delete a vehicle from inspection
  const deleteVehicle = useCallback((vehicleId) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    if (selectedVehicleId === vehicleId) {
      setVehicles((prevVehicles) => {
        const remaining = prevVehicles.filter((v) => v.id !== vehicleId);
        setSelectedVehicleId(remaining.length > 0 ? remaining[0].id : null);
        return remaining;
      });
    }
  }, [selectedVehicleId]);

  // Update a vehicle's route/SoC in inspection
  const updateVehicle = useCallback((vehicleId, updates) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, ...updates } : v))
    );
  }, []);

  // Start simulation: transition from setup to monitoring
  const startSimulation = useCallback((simId, providedHubs = null) => {
    const hubsToUse = providedHubs || chargingHubs;
    console.log('[SimulationContext] Starting simulation with hubs:', hubsToUse);
    setIsSimulationRunning(true);
    setSimulationId(simId);
    // Initialize monitoring vehicles from inspection vehicles
    setMonitoringVehicles(
      vehicles.map((v) => ({
        ...v,
        pos: v.startPosition,
        state: 'idle',
        soc: v.initialSoC,
        heading: 0,
        speed: 0,
        chargingHubId: null,
      }))
    );
    // Initialize monitoring hubs from setup hubs
    if (hubsToUse) {
      console.log('[SimulationContext] Setting monitoring hubs:', hubsToUse);
      setMonitoringHubs(
        hubsToUse.map((h) => ({
          ...h,
          occupancy: { normal: 0, fast: 0 },
        }))
      );
    } else {
      console.warn('[SimulationContext] No hubs provided to startSimulation');
    }
  }, [vehicles, chargingHubs]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    setIsSimulationRunning(false);
    setSimulationId(null);
    setMonitoringVehicles([]);
    setMonitoringHubs([]);
  }, []);

  // Update monitoring vehicles (from WebSocket/mock)
  const updateMonitoringData = useCallback((vehiclesList, hubsList, stats) => {
    setMonitoringVehicles(vehiclesList);
    setMonitoringHubs(hubsList);
    if (stats) {
      setSimulationStats(stats);
    }
  }, []);

  // Check if setup is complete
  const isSetupComplete = useCallback(() => {
    return (
      vehicleConfig &&
      chargingHubs &&
      vehicles.length > 0 &&
      vehicleConfig.totalVehicles > 0
    );
  }, [vehicleConfig, chargingHubs, vehicles]);

  const value = {
    // Setup data
    vehicleConfig,
    chargingHubs,
    initializeSetup,

    // Vehicle inspection
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    setGeneratedVehicles,
    deleteVehicle,
    updateVehicle,

    // Simulation state
    isSimulationRunning,
    simulationId,
    startSimulation,
    stopSimulation,

    // Monitoring data
    monitoringVehicles,
    monitoringHubs,
    simulationStats,
    updateMonitoringData,

    // Helpers
    isSetupComplete,
  };

  return (
    <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};

export default SimulationContext;
