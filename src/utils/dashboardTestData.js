/**
 * Dashboard Testing & Initialization
 * 
 * This file provides utilities for testing the dashboard system
 */

export const mockSimulationState = {
  vehicleConfig: {
    totalVehicles: 100,
    socMean: 50,
    socStdDev: 15,
    userTypes: {
      commuter: 60,
      occasional: 30,
      others: 10,
    },
  },
  chargingHubs: [
    {
      id: 'hub-1',
      name: 'Hub Alexanderplatz',
      type: 'hub',
      pos: [52.5219, 13.4132],
      normalStations: 5,
      fastStations: 2,
      totalCapacity: { normal: 5, fast: 2 },
      occupancy: { normal: 3, fast: 1 },
    },
    {
      id: 'hub-2',
      name: 'Hub Tiergarten',
      type: 'hub',
      pos: [52.5165, 13.3664],
      normalStations: 8,
      fastStations: 3,
      totalCapacity: { normal: 8, fast: 3 },
      occupancy: { normal: 5, fast: 2 },
    },
  ],
  vehicles: [],
  simulationStats: {
    totalVehicles: 100,
    vehiclesCharging: 15,
    vehiclesMoving: 65,
    vehiclesIdle: 20,
    saturatedHubs: 0,
    averageSoC: 52,
  },
};

export const testDashboardAccess = (state) => {
  return {
    userDashboard: true,
    simulationDashboard: true,
    hubManager: state.chargingHubs && state.chargingHubs.length > 0,
  };
};

export const mockRoutes = [
  {
    id: 1,
    distance: 245.5,
    duration: 2.5,
    chargingStops: [
      {
        hubId: 'hub-1',
        hubName: 'Hub Alexanderplatz',
        position: [52.5219, 13.4132],
        chargingTime: 45,
        cost: 12.5,
      },
    ],
    totalCost: 18.75,
    estimatedArrivalSoC: 75,
  },
];

export default {
  mockSimulationState,
  testDashboardAccess,
  mockRoutes,
};
