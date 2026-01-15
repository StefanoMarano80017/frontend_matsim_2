/**
 * Dashboard Architecture
 * 
 * Dashboard Selection (/)
 * ├── User Dashboard (/user/dashboard)
 * ├── Simulation Dashboard (/simulation/*)
 * │   ├── Setup (/simulation/setup)
 * │   └── Monitoring (/simulation/map)
 * └── Hub Manager Dashboard (/hub/dashboard)
 * 
 * State Management:
 * - SimulationContext: Central state for all dashboards
 * - Vehicles, Hubs, Vehicle Config, Simulation Stats
 * 
 * Services:
 * - RouteCalculationService: Route planning with charging stops
 * - SimulationApi: Backend communication
 * 
 * Protected Routes:
 * - /simulation/map: Requires completed setup
 * - /hub/dashboard: Requires at least one hub
 */

export const DASHBOARDS = {
  DASHBOARD_SELECTION: '/',
  USER_DASHBOARD: '/user/dashboard',
  SIMULATION_SETUP: '/simulation/setup',
  SIMULATION_MONITORING: '/simulation/map',
  SIMULATION_DASHBOARD: '/simulation/*',
  HUB_MANAGER_DASHBOARD: '/hub/dashboard',
};

export const DASHBOARD_INFO = {
  user: {
    name: 'User Dashboard',
    description: 'Plan your route with optimal charging stops',
    icon: 'DirectionsCar',
    requiresHubs: true,
    requiresSetup: false,
  },
  simulation: {
    name: 'Simulation Dashboard',
    description: 'Setup and monitor multi-vehicle simulations',
    icon: 'Timeline',
    requiresHubs: false,
    requiresSetup: false,
  },
  hub: {
    name: 'Hub Manager Dashboard',
    description: 'Manage charging hubs and monitor stall occupancy',
    icon: 'EvStation',
    requiresHubs: true,
    requiresSetup: false,
  },
};

export default DASHBOARDS;
