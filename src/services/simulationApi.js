import AppConfig from '../config/appConfig';

/**
 * Simulation API Service
 * Handles all communication with the backend
 * Supports both real and mock modes via AppConfig.USE_MOCK_DATA
 */

class SimulationApiService {
  constructor() {
    this.baseUrl = AppConfig.API_BASE_URL;
  }

  /**
   * Setup a new simulation
   * @param {Object} config - Simulation configuration
   * @returns {Promise<Object>} - Simulation ID and initial state
   */
  async setupSimulation(config) {
    if (AppConfig.USE_MOCK_DATA) {
      return this._mockSetupSimulation(config);
    }

    const response = await fetch(`${this.baseUrl}/simulation/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Setup failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get initial simulation state (vehicles and hubs)
   * @returns {Promise<Object>} - Contains vehicles and hubs arrays
   */
  async getInitialState() {
    if (AppConfig.USE_MOCK_DATA) {
      return this._mockGetInitialState();
    }

    const response = await fetch(`${this.baseUrl}/simulation/initial-state`);
    if (!response.ok) {
      throw new Error(`Failed to fetch initial state: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate vehicles based on configuration
   * @param {Object} vehicleConfig - Vehicle configuration
   * @param {Array} chargingHubs - Available charging hubs
   * @returns {Promise<Array>} - Generated vehicles array
   */
  async generateVehicles(vehicleConfig, chargingHubs) {
    if (AppConfig.USE_MOCK_DATA) {
      return this._mockGenerateVehicles(vehicleConfig, chargingHubs);
    }

    const response = await fetch(`${this.baseUrl}/simulation/vehicles/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleConfig, chargingHubs }),
    });

    if (!response.ok) {
      throw new Error(`Vehicle generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Stop the running simulation
   * @returns {Promise<void>}
   */
  async stopSimulation() {
    if (AppConfig.USE_MOCK_DATA) {
      return Promise.resolve();
    }

    const response = await fetch(`${this.baseUrl}/simulation/stop`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Stop failed: ${response.statusText}`);
    }
  }

  // ============ MOCK DATA IMPLEMENTATIONS ============

  _mockSetupSimulation(config) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          simulationId: `SIM-${Date.now()}`,
          status: 'initialized',
          timestamp: new Date().toISOString(),
        });
      }, 800);
    });
  }

  _mockGenerateVehicles(vehicleConfig, chargingHubs) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicles = [];
        const models = ['Tesla Model 3', 'Renault Zoe', 'Fiat 500e', 'Nissan Leaf'];
        const userTypes = ['commuter', 'occasional', 'others'];

        for (let i = 0; i < vehicleConfig.totalVehicles; i++) {
          const userType =
            Math.random() < vehicleConfig.userTypes.commuter / 100
              ? 'commuter'
              : Math.random() < vehicleConfig.userTypes.occasional / 100
                ? 'occasional'
                : 'others';

          // Generate SoC from normal distribution
          const soc = Math.max(
            0,
            Math.min(
              100,
              vehicleConfig.socMean +
                vehicleConfig.socStdDev * this._normalRandom()
            )
          );

          // Generate random route
          const startPos = [
            52.52 + (Math.random() - 0.5) * 0.15,
            13.40 + (Math.random() - 0.5) * 0.15,
          ];
          const endPos = [
            52.52 + (Math.random() - 0.5) * 0.15,
            13.40 + (Math.random() - 0.5) * 0.15,
          ];

          // Randomly assign charging hub if needed
          const needsCharging = soc < 30;
          const hub = needsCharging
            ? chargingHubs[Math.floor(Math.random() * chargingHubs.length)]
            : null;

          // Create simplified route with hub if applicable
          const plannedRoute = hub
            ? [startPos, [hub.pos[0], hub.pos[1]], endPos]
            : [startPos, endPos];

          vehicles.push({
            id: `VEH-${String(i + 1).padStart(4, '0')}`,
            type: 'vehicle',
            name: `VEH-${String(i + 1).padStart(4, '0')}`,
            model: models[Math.floor(Math.random() * models.length)],
            initialSoC: Math.round(soc),
            userType,
            startPosition: startPos,
            endPosition: endPos,
            chargingHubId: hub ? hub.id : null,
            plannedRoute,
          });
        }

        resolve(vehicles);
      }, 1200);
    });
  }

  _mockGetInitialState() {
    return Promise.resolve({
      vehicles: [],
      hubs: this._generateMockHubs(),
    });
  }

  _generateMockHubs() {
    return [
      {
        id: 'hub-1',
        name: 'Hub Alexanderplatz',
        pos: [52.5219, 13.4132],
        type: 'hub',
        normalStations: 5,
        fastStations: 2,
        occupancy: { normal: 3, fast: 1 },
        totalCapacity: { normal: 5, fast: 2 },
      },
      {
        id: 'hub-2',
        name: 'Hub Tiergarten',
        pos: [52.5165, 13.3664],
        type: 'hub',
        normalStations: 8,
        fastStations: 3,
        occupancy: { normal: 5, fast: 2 },
        totalCapacity: { normal: 8, fast: 3 },
      },
      {
        id: 'hub-3',
        name: 'Hub Charlottenburg',
        pos: [52.5200, 13.3050],
        type: 'hub',
        normalStations: 6,
        fastStations: 2,
        occupancy: { normal: 2, fast: 0 },
        totalCapacity: { normal: 6, fast: 2 },
      },
    ];
  }

  /**
   * Box-Muller transform for normal distribution sampling
   */
  _normalRandom() {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}

export const simulationApi = new SimulationApiService();
export default simulationApi;
