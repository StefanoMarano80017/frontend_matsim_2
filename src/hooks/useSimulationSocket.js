import { useState, useEffect, useRef, useCallback } from 'react';
import AppConfig from '../config/appConfig';
import { simulationApi } from '../services/simulationApi';

/**
 * Hook for managing WebSocket connection to simulation backend
 * Provides real-time vehicle positions, hub status, and overall statistics
 * Supports both real WebSocket and mock implementation
 * Integrates with SimulationContext for centralized state
 */
export const useSimulationSocket = () => {
  const [vehicles, setVehicles] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    vehiclesCharging: 0,
    vehiclesMoving: 0,
    vehiclesIdle: 0,
    saturatedHubs: 0,
    averageSoC: 0,
  });

  const websocketRef = useRef(null);
  const mockIntervalRef = useRef(null);
  const vehicleStateRef = useRef({}); // Track mock vehicle state for smooth updates

  // Initialize WebSocket or mock connection
  useEffect(() => {
    if (AppConfig.USE_MOCK_DATA) {
      initializeMockSocket();
    } else {
      initializeRealSocket();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
    };
  }, []);

  const initializeRealSocket = () => {
    try {
      websocketRef.current = new WebSocket(AppConfig.WEBSOCKET_URL);

      websocketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleSimulationUpdate(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt reconnection after delay
        setTimeout(() => {
          initializeRealSocket();
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      setIsConnected(false);
    }
  };

  const initializeMockSocket = async () => {
    // Get initial hubs from API
    try {
      const initialState = await simulationApi.getInitialState();
      setHubs(initialState.hubs);
    } catch (error) {
      console.error('Failed to load initial hubs:', error);
    }

    setIsConnected(true);

    // Initialize vehicle state for smooth transitions
    vehicleStateRef.current = {};

    // Simulate real-time updates with slower, smoother interval
    mockIntervalRef.current = setInterval(() => {
      const mockUpdate = generateMockUpdate();
      handleSimulationUpdate(mockUpdate);
    }, 500); // Slower interval for smoother, more realistic updates
  };

  const generateMockUpdate = useCallback(() => {
    // Generate 15-35 vehicles with smooth, incremental updates
    const vehicleCount = Math.floor(Math.random() * 20) + 15;
    const vehicles = [];

    for (let i = 0; i < vehicleCount; i++) {
      const vehicleId = `vehicle-${i}`;
      
      // Initialize or retrieve vehicle state
      if (!vehicleStateRef.current[vehicleId]) {
        vehicleStateRef.current[vehicleId] = {
          basePos: [
            52.52 + (Math.random() - 0.5) * 0.1,
            13.40 + (Math.random() - 0.5) * 0.1,
          ],
          state: ['moving', 'charging', 'idle'][Math.floor(Math.random() * 3)],
          soc: Math.floor(Math.random() * 100),
          heading: Math.random() * 360,
          direction: {
            lat: (Math.random() - 0.5) * 0.002,
            lng: (Math.random() - 0.5) * 0.002,
          },
          chargingHubId: null,
        };
      }

      const state = vehicleStateRef.current[vehicleId];

      // Smooth position updates: small incremental movements
      if (state.state === 'moving') {
        state.basePos[0] += state.direction.lat;
        state.basePos[1] += state.direction.lng;
        
        // Gradually decrease SoC while moving
        state.soc = Math.max(0, state.soc - 0.5);

        // Occasionally change direction
        if (Math.random() < 0.1) {
          state.direction.lat = (Math.random() - 0.5) * 0.002;
          state.direction.lng = (Math.random() - 0.5) * 0.002;
        }
      } else if (state.state === 'charging') {
        // Gradually increase SoC while charging
        state.soc = Math.min(100, state.soc + 2);
        
        // Switch to idle/moving when fully charged
        if (state.soc >= 100) {
          state.state = Math.random() < 0.7 ? 'moving' : 'idle';
          state.chargingHubId = null;
        }

        // Assign hub if charging
        if (!state.chargingHubId) {
          state.chargingHubId = `hub-${Math.floor(Math.random() * 3) + 1}`;
        }
      } else {
        // idle state - occasional state change
        if (Math.random() < 0.15) {
          state.state = Math.random() < 0.7 ? 'moving' : 'charging';
          if (state.state === 'charging') {
            state.chargingHubId = `hub-${Math.floor(Math.random() * 3) + 1}`;
          }
        }
      }

      vehicles.push({
        id: vehicleId,
        name: `EV-${String(i).padStart(4, '0')}`,
        model: ['Tesla Model 3', 'Renault Zoe', 'Fiat 500e'][i % 3],
        type: 'vehicle',
        pos: [state.basePos[0], state.basePos[1]],
        state: state.state,
        soc: Math.floor(state.soc),
        heading: state.heading,
        speed: state.state === 'moving' ? 20 + Math.random() * 40 : 0,
        chargingHubId: state.chargingHubId,
      });
    }

    // Mock hub updates with realistic occupancy
    const hubs = [
      {
        id: 'hub-1',
        name: 'Hub Alexanderplatz',
        pos: [52.5219, 13.4132],
        type: 'hub',
        normalStations: 5,
        fastStations: 2,
        occupancy: {
          normal: Math.max(0, Math.floor(Math.random() * 6)),
          fast: Math.max(0, Math.floor(Math.random() * 3)),
        },
        totalCapacity: { normal: 5, fast: 2 },
      },
      {
        id: 'hub-2',
        name: 'Hub Tiergarten',
        pos: [52.5165, 13.3664],
        type: 'hub',
        normalStations: 8,
        fastStations: 3,
        occupancy: {
          normal: Math.max(0, Math.floor(Math.random() * 9)),
          fast: Math.max(0, Math.floor(Math.random() * 4)),
        },
        totalCapacity: { normal: 8, fast: 3 },
      },
      {
        id: 'hub-3',
        name: 'Hub Charlottenburg',
        pos: [52.5200, 13.3050],
        type: 'hub',
        normalStations: 6,
        fastStations: 2,
        occupancy: {
          normal: Math.max(0, Math.floor(Math.random() * 7)),
          fast: Math.max(0, Math.floor(Math.random() * 3)),
        },
        totalCapacity: { normal: 6, fast: 2 },
      },
    ];

    return { vehicles, hubs, timestamp: new Date().toISOString() };
  }, []);

  const handleSimulationUpdate = (data) => {
    if (data.vehicles) {
      setVehicles(data.vehicles);
    }

    if (data.hubs) {
      setHubs(data.hubs);
    }

    // Calculate statistics
    if (data.vehicles) {
      const movingCount = data.vehicles.filter((v) => v.state === 'moving').length;
      const chargingCount = data.vehicles.filter((v) => v.state === 'charging').length;
      const idleCount = data.vehicles.filter((v) => v.state === 'idle').length;
      const avgSoC =
        data.vehicles.reduce((sum, v) => sum + v.soc, 0) / data.vehicles.length || 0;

      const saturatedHubsCount = (data.hubs || []).filter((hub) => {
        const totalOccupancy = (hub.occupancy?.normal || 0) + (hub.occupancy?.fast || 0);
        const totalCapacity = (hub.totalCapacity?.normal || 0) + (hub.totalCapacity?.fast || 0);
        return totalOccupancy >= totalCapacity;
      }).length;

      setStats({
        totalVehicles: data.vehicles.length,
        vehiclesCharging: chargingCount,
        vehiclesMoving: movingCount,
        vehiclesIdle: idleCount,
        saturatedHubs: saturatedHubsCount,
        averageSoC: Math.round(avgSoC),
      });
    }
  };

  return {
    vehicles,
    hubs,
    isConnected,
    stats,
  };
};

export default useSimulationSocket;
