/**
 * Route Calculation Tests
 */

import { routeCalculationService } from '../services/routeCalculationService';

export const testRouteCalculation = async () => {
  const testConfig = {
    origin: [52.52, 13.40],
    destination: [52.60, 13.50],
    vehicleData: {
      model: 'Tesla Model 3',
      initialSoC: 50,
      targetSoC: 80,
    },
    chargingHubs: [
      {
        id: 'hub-1',
        name: 'Hub Alexanderplatz',
        pos: [52.5219, 13.4132],
      },
      {
        id: 'hub-2',
        name: 'Hub Tiergarten',
        pos: [52.5165, 13.3664],
      },
    ],
  };

  try {
    const routes = await routeCalculationService.calculateRoutes(testConfig);
    console.log('Route calculation successful:', routes);
    return routes;
  } catch (error) {
    console.error('Route calculation failed:', error);
    throw error;
  }
};

export const testDistanceCalculation = () => {
  const berlin = [52.52, 13.40];
  const potsdam = [52.39, 13.07];

  const distance = routeCalculationService._calculateDistance(berlin, potsdam);
  console.log(`Distance from Berlin to Potsdam: ${distance.toFixed(2)} km`);

  return distance;
};

export default {
  testRouteCalculation,
  testDistanceCalculation,
};
