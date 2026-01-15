import AppConfig from '../config/appConfig';

class RouteCalculationService {
  constructor() {
    this.baseUrl = AppConfig.API_BASE_URL;
  }

  async calculateRoutes(config) {
    if (AppConfig.USE_MOCK_DATA) {
      return this._mockCalculateRoutes(config);
    }

    const response = await fetch(`${this.baseUrl}/routing/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Route calculation failed: ${response.statusText}`);
    }

    return response.json();
  }

  _mockCalculateRoutes(config) {
    const { origin, destination, vehicleData, chargingHubs } = config;

    // Calculate distance (Haversine formula approximation)
    const distance = this._calculateDistance(origin, destination);
    const baseSpeed = 100; // km/h
    const duration = (distance / baseSpeed).toFixed(1);

    // Calculate battery consumption
    const consumptionRate = 15; // kWh/100km
    const batteryUsage = (distance / 100) * consumptionRate;
    const arrivalSoC = Math.max(vehicleData.initialSoC - batteryUsage, 0);

    // Determine charging stops
    const chargingStops = [];
    if (arrivalSoC < vehicleData.targetSoC) {
      const closestHub = this._findClosestHub(destination, chargingHubs);
      if (closestHub) {
        chargingStops.push({
          hubId: closestHub.id,
          hubName: closestHub.name,
          position: closestHub.pos,
          chargingTime: 45,
          cost: 12.5,
        });
      }
    }

    const route = {
      id: 1,
      distance: parseFloat(distance.toFixed(1)),
      duration: parseFloat(duration),
      chargingStops,
      totalCost: 18.75 + (chargingStops.length * 12.5),
      estimatedArrivalSoC: Math.min(Math.max(arrivalSoC + (chargingStops.length * 30), 0), 100),
    };

    return Promise.resolve([route]);
  }

  _calculateDistance(origin, destination) {
    const [lat1, lon1] = origin;
    const [lat2, lon2] = destination;

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  _findClosestHub(point, hubs) {
    if (!hubs || hubs.length === 0) return null;

    let closest = hubs[0];
    let minDistance = this._calculateDistance(point, closest.pos);

    for (let i = 1; i < hubs.length; i++) {
      const distance = this._calculateDistance(point, hubs[i].pos);
      if (distance < minDistance) {
        minDistance = distance;
        closest = hubs[i];
      }
    }

    return closest;
  }
}

export const routeCalculationService = new RouteCalculationService();
export default RouteCalculationService;
