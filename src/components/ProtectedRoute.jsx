import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSimulation } from '../contexts/SimulationContext.jsx';

/**
 * ProtectedRoute
 * Prevents navigation to monitoring page without completed setup
 */
const ProtectedRoute = ({ children }) => {
  const { isSetupComplete } = useSimulation();

  if (!isSetupComplete()) {
    return <Navigate to="/simulation/setup" replace />;
  }

  return children;
};

export default ProtectedRoute;
