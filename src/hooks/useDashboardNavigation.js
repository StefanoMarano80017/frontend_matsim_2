import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../contexts/SimulationContext';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const { vehicleConfig, chargingHubs, isSetupComplete } = useSimulation();

  const navigateToDashboard = useCallback(
    (dashboard) => {
      switch (dashboard) {
        case 'user':
          navigate('/user/dashboard');
          break;
        case 'simulation':
          navigate('/simulation/setup');
          break;
        case 'hub':
          if (chargingHubs && chargingHubs.length > 0) {
            navigate('/hub/dashboard');
          } else {
            alert('No charging hubs available. Setup a simulation first.');
          }
          break;
        default:
          break;
      }
    },
    [navigate, chargingHubs]
  );

  const canAccessSimulation = useCallback(() => {
    return true; // Simulation dashboard is always accessible
  }, []);

  const canAccessHubManager = useCallback(() => {
    return chargingHubs && chargingHubs.length > 0;
  }, [chargingHubs]);

  const canAccessUser = useCallback(() => {
    return true; // User dashboard is always accessible
  }, []);

  return {
    navigateToDashboard,
    canAccessSimulation,
    canAccessHubManager,
    canAccessUser,
  };
};

export default useDashboardNavigation;
