import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SimulationSetupPage from './pages/SimulationSetupPage';
import SimulationMapPage from './pages/SimulationMapPage';
import { SimulationProvider } from './contexts/SimulationContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <SimulationProvider>
      <Router>
        <Routes>
          <Route path="/simulation/setup" element={<SimulationSetupPage />} />
          <Route
            path="/simulation/map"
            element={
              <ProtectedRoute>
                <SimulationMapPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/simulation/setup" replace />} />
        </Routes>
      </Router>
    </SimulationProvider>
  );
}

export default App;