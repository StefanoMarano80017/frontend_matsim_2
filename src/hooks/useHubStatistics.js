import { useState, useEffect } from 'react';
import { useSimulation } from '../contexts/SimulationContext';

export const useHubStatistics = () => {
  const { monitoringHubs, chargingHubs } = useSimulation();
  const [hubStats, setHubStats] = useState({});

  useEffect(() => {
    const hubs = monitoringHubs.length > 0 ? monitoringHubs : chargingHubs || [];

    const stats = {};
    hubs.forEach((hub) => {
      const normalOccupancy = (hub.occupancy?.normal || 0) / (hub.totalCapacity?.normal || 1);
      const fastOccupancy = (hub.occupancy?.fast || 0) / (hub.totalCapacity?.fast || 1);
      const isSaturated = normalOccupancy >= 1 || fastOccupancy >= 1;

      stats[hub.id] = {
        normalOccupancy: Math.round(normalOccupancy * 100),
        fastOccupancy: Math.round(fastOccupancy * 100),
        isSaturated,
        totalOccupied: (hub.occupancy?.normal || 0) + (hub.occupancy?.fast || 0),
        totalCapacity: (hub.totalCapacity?.normal || 0) + (hub.totalCapacity?.fast || 0),
      };
    });

    setHubStats(stats);
  }, [monitoringHubs, chargingHubs]);

  return hubStats;
};

export default useHubStatistics;
