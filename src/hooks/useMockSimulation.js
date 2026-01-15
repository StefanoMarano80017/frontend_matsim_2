import { useEffect, useRef, useCallback } from 'react';
import { useSimulation } from '../contexts/SimulationContext.jsx';

/**
 * Hook to manage mock simulation updates
 * Updates vehicle positions and SoC in real-time
 * Integrates with SimulationContext for centralized state
 */
export const useMockSimulation = () => {
  const {
    isSimulationRunning,
    monitoringVehicles,
    monitoringHubs,
    updateMonitoringData,
  } = useSimulation();

  const vehicleStateRef = useRef({});
  const intervalRef = useRef(null);

  // Initialize vehicle state for smooth tracking
  const initializeVehicleStates = useCallback(() => {
    vehicleStateRef.current = {};
    monitoringVehicles.forEach((v) => {
      if (!vehicleStateRef.current[v.id]) {
        vehicleStateRef.current[v.id] = {
          pos: [...v.pos],
          direction: {
            lat: (Math.random() - 0.5) * 0.001,
            lng: (Math.random() - 0.5) * 0.001,
          },
          soc: v.soc,
          state: v.state,
          speed: 0,
          heading: Math.random() * 360,
          chargingHubId: null,
        };
      }
    });
  }, [monitoringVehicles]);

  // Generate mock update
  const generateMockUpdate = useCallback(() => {
    const updatedVehicles = monitoringVehicles.map((vehicle) => {
      const state = vehicleStateRef.current[vehicle.id];
      if (!state) return vehicle;

      // Update vehicle state
      let newState = state.state;
      let newSoc = state.soc;
      let newPos = [...state.pos];
      let newSpeed = 0;

      if (state.state === 'moving') {
        // Move vehicle incrementally
        newPos[0] += state.direction.lat;
        newPos[1] += state.direction.lng;
        
        // Decrease SoC while moving
        newSoc = Math.max(0, state.soc - 0.3);
        newSpeed = 25 + Math.random() * 35; // 25-60 km/h
        
        // Occasionally change direction
        if (Math.random() < 0.1) {
          state.direction.lat = (Math.random() - 0.5) * 0.001;
          state.direction.lng = (Math.random() - 0.5) * 0.001;
        }
        
        // 10% chance to start charging
        if (newSoc < 30 && Math.random() < 0.1) {
          newState = 'charging';
          state.chargingHubId = `hub-${Math.floor(Math.random() * 3) + 1}`;
        }
      } else if (state.state === 'charging') {
        // Increase SoC while charging
        newSoc = Math.min(100, state.soc + 1.5);
        
        // Transition to idle/moving when fully charged
        if (newSoc >= 100) {
          newState = Math.random() < 0.7 ? 'moving' : 'idle';
          state.chargingHubId = null;
        }
      } else if (state.state === 'idle') {
        // 5% chance to start moving
        if (Math.random() < 0.05) {
          newState = 'moving';
        }
      }

      // Update state ref
      state.pos = newPos;
      state.soc = newSoc;
      state.state = newState;
      state.speed = newSpeed;

      return {
        ...vehicle,
        pos: newPos,
        soc: newSoc,
        state: newState,
        speed: newSpeed,
        chargingHubId: state.chargingHubId,
      };
    });

    // Update hub occupancy
    const updatedHubs = monitoringHubs.map((hub) => {
      const chargingCount = updatedVehicles.filter(
        (v) => v.state === 'charging' && v.chargingHubId === hub.id
      ).length;
      
      return {
        ...hub,
        occupancy: {
          normal: Math.min(chargingCount, hub.totalCapacity?.normal || 0),
          fast: Math.max(0, chargingCount - (hub.totalCapacity?.normal || 0)),
        },
      };
    });

    // Calculate stats
    const movingCount = updatedVehicles.filter((v) => v.state === 'moving').length;
    const chargingCount = updatedVehicles.filter((v) => v.state === 'charging').length;
    const idleCount = updatedVehicles.filter((v) => v.state === 'idle').length;
    const avgSoc = Math.round(
      updatedVehicles.reduce((sum, v) => sum + v.soc, 0) / updatedVehicles.length || 0
    );

    const stats = {
      totalVehicles: updatedVehicles.length,
      vehiclesMoving: movingCount,
      vehiclesCharging: chargingCount,
      vehiclesIdle: idleCount,
      saturatedHubs: updatedHubs.filter((h) => {
        const totalOcc = (h.occupancy?.normal || 0) + (h.occupancy?.fast || 0);
        const totalCap = (h.totalCapacity?.normal || 0) + (h.totalCapacity?.fast || 0);
        return totalOcc >= totalCap;
      }).length,
      averageSoC: avgSoc,
    };

    return { vehicles: updatedVehicles, hubs: updatedHubs, stats };
  }, [monitoringVehicles, monitoringHubs]);

  // Start mock simulation when simulation is running
  useEffect(() => {
    if (!isSimulationRunning) return;

    initializeVehicleStates();

    // Update every 500ms for smooth, realistic movement
    intervalRef.current = setInterval(() => {
      const { vehicles, hubs, stats } = generateMockUpdate();
      updateMonitoringData(vehicles, hubs, stats);
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulationRunning, initializeVehicleStates, generateMockUpdate, updateMonitoringData]);

  return { isRunning: isSimulationRunning };
};

export default useMockSimulation;
