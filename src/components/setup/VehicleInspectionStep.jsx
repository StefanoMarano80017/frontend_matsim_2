import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import VehicleList from './VehicleList';
import VehicleRouteLayer from './VehicleRouteLayer';
import VehicleEditCard from './VehicleEditCard';
import { simulationApi } from '../../services/simulationApi';
import { useSimulation } from '../../contexts/SimulationContext.jsx';

const VehicleInspectionStep = ({ vehicleConfig, chargingHubs }) => {
  const {
    vehicles,
    selectedVehicleId,
    setGeneratedVehicles,
    setSelectedVehicleId,
    deleteVehicle,
    updateVehicle,
  } = useSimulation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  // Fetch generated vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const generatedVehicles = await simulationApi.generateVehicles(
          vehicleConfig,
          chargingHubs
        );
        setGeneratedVehicles(generatedVehicles);
      } catch (err) {
        setError(err.message || 'Failed to generate vehicles');
      } finally {
        setLoading(false);
      }
    };

    if (!vehicles || vehicles.length === 0) {
      fetchVehicles();
    }
  }, [vehicleConfig, chargingHubs, vehicles.length, setGeneratedVehicles]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const editingVehicle = vehicles.find((v) => v.id === editingVehicleId);

  const handleEditRoute = (vehicleId) => {
    setEditingVehicleId(vehicleId);
  };

  const handleSaveRoute = (updatedVehicle) => {
    updateVehicle(updatedVehicle.id, {
      startPosition: updatedVehicle.startPosition,
      endPosition: updatedVehicle.endPosition,
      initialSoC: updatedVehicle.initialSoC,
    });
    setEditingVehicleId(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', gap: 2 }}>
      {/* Left: Vehicle List (30%) */}
      <Box sx={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Typography variant="h6" gutterBottom>
          Vehicles ({vehicles.length})
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {editingVehicleId ? (
              <Box>
                {editingVehicle && (
                  <VehicleEditCard
                    vehicle={editingVehicle}
                    onSave={handleSaveRoute}
                    onCancel={() => setEditingVehicleId(null)}
                  />
                )}
                <VehicleList
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  onSelectVehicle={setSelectedVehicleId}
                  onDeleteVehicle={deleteVehicle}
                  onEditRoute={handleEditRoute}
                />
              </Box>
            ) : (
              <VehicleList
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={setSelectedVehicleId}
                onDeleteVehicle={deleteVehicle}
                onEditRoute={handleEditRoute}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Right: Map (70%) */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Typography variant="h6" gutterBottom>
          Route Preview
        </Typography>

        {selectedVehicle ? (
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <VehicleRouteLayer
              vehicle={selectedVehicle}
              chargingHubs={chargingHubs}
            />
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography color="text.secondary">
              {loading ? 'Loading...' : 'Select a vehicle to view its route'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VehicleInspectionStep;
