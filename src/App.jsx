import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardSelection from './pages/DashboardSelection';
import SimulationSetupPage from './pages/SimulationSetupPage';
import SimulationMapPage from './pages/SimulationMapPage';
import SimulationDashboard from './pages/SimulationDashboard';
import UserDashboard from './pages/UserDashboard';
import HubManagerDashboard from './pages/HubManagerDashboard';
import { SimulationProvider } from './contexts/SimulationContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <SimulationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardSelection />} />

          {/* Simulation Dashboard */}
          <Route path="/simulation/*" element={<SimulationDashboard />} />
          <Route path="/simulation/setup" element={<SimulationSetupPage />} />
          <Route
            path="/simulation/map"
            element={
              <ProtectedRoute>
                <SimulationMapPage />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard */}
          <Route path="/user/dashboard" element={<UserDashboard />} />

          {/* Hub Manager Dashboard */}
          <Route path="/hub/dashboard" element={<HubManagerDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SimulationProvider>
  );
}

export default App;