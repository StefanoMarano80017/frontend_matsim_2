/**
 * Dashboard Access Control
 * Determines which dashboards are accessible based on current state
 */

export const canAccessDashboard = (dashboardId, state) => {
  const { chargingHubs, vehicleConfig, vehicles } = state;

  switch (dashboardId) {
    case 'user':
      // User dashboard is always accessible
      return true;

    case 'simulation':
      // Simulation dashboard is always accessible
      return true;

    case 'hub':
      // Hub manager requires at least one hub
      return chargingHubs && chargingHubs.length > 0;

    default:
      return false;
  }
};

export const canAccessSimulationMonitoring = (state) => {
  const { vehicleConfig, chargingHubs, vehicles } = state;
  return (
    vehicleConfig &&
    chargingHubs &&
    vehicles.length > 0 &&
    vehicleConfig.totalVehicles > 0
  );
};

export const getAccessRestrictionMessage = (dashboardId) => {
  switch (dashboardId) {
    case 'hub':
      return 'Hub Manager requires at least one charging hub. Please setup a simulation first.';
    default:
      return 'Access denied';
  }
};

export default {
  canAccessDashboard,
  canAccessSimulationMonitoring,
  getAccessRestrictionMessage,
};
