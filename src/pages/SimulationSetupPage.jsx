import React, { useState } from 'react';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import VehiclesConfigSection from '../components/setup/VehiclesConfigSection';
import HubsConfigSection from '../components/setup/HubsConfigSection';
import VehicleInspectionStep from '../components/setup/VehicleInspectionStep';
import { simulationApi } from '../services/simulationApi';
import { useSimulation } from '../contexts/SimulationContext.jsx';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Vehicles Configuration',
  'Charging Hubs Configuration',
  'Vehicle Inspection',
  'Review & Start',
];

const SimulationSetupPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { initializeSetup, startSimulation, vehicles } = useSimulation();

  // Vehicle configuration state
  const [vehicleConfig, setVehicleConfig] = useState({
    totalVehicles: 100,
    socMean: 50,
    socStdDev: 15,
    userTypes: {
      commuter: 60,
      occasional: 30,
      others: 10,
    },
  });

  // Hubs configuration state
  const [hubs, setHubs] = useState([
    {
      id: 1,
      name: 'Hub 1',
      latitude: 52.52,
      longitude: 13.40,
      normalStations: 5,
      fastStations: 2,
      plugsPerStation: 2,
    },
  ]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Transform hubs to charging hub format
      const transformedHubs = hubs.map((hub) => ({
        id: `hub-${hub.id}`,
        name: hub.name,
        type: 'hub',
        pos: [hub.latitude, hub.longitude],
        normalStations: hub.normalStations,
        fastStations: hub.fastStations,
        totalCapacity: {
          normal: hub.normalStations,
          fast: hub.fastStations,
        },
        occupancy: { normal: 0, fast: 0 },
      }));

      // Initialize setup in context
      initializeSetup(vehicleConfig, transformedHubs);

      // Call setup API
      const payload = {
        vehicles: vehicleConfig,
        chargingHubs: hubs,
      };
      const response = await simulationApi.setupSimulation(payload);

      // Start simulation with returned ID and pass hubs directly
      startSimulation(response.simulationId, transformedHubs);

      // Navigate to monitoring
      navigate('/simulation/map');
    } catch (err) {
      setError(err.message || 'Failed to setup simulation');
    } finally {
      setLoading(false);
    }
  };

  // Convert hubs to charging hub format for inspection step
  const chargingHubs = hubs.map((hub) => ({
    id: `hub-${hub.id}`,
    name: hub.name,
    type: 'hub',
    pos: [hub.latitude, hub.longitude],
    normalStations: hub.normalStations,
    fastStations: hub.fastStations,
    totalCapacity: {
      normal: hub.normalStations,
      fast: hub.fastStations,
    },
    occupancy: { normal: 0, fast: 0 },
  }));

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4, md: 6 }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Simulation Setup
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#ffebee',
              borderLeft: '4px solid #f44336',
              borderRadius: 1,
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Box sx={{ minHeight: { xs: 400, sm: 500, md: 600 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeStep === 0 && (
            <VehiclesConfigSection
              config={vehicleConfig}
              onChange={setVehicleConfig}
            />
          )}
          {activeStep === 1 && (
            <HubsConfigSection hubs={hubs} onChange={setHubs} />
          )}
          {activeStep === 2 && (
            <VehicleInspectionStep
              vehicleConfig={vehicleConfig}
              chargingHubs={chargingHubs}
            />
          )}
          {activeStep === 3 && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Review Configuration
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Vehicles
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Total: {vehicleConfig.totalVehicles}
                    </Typography>
                    <Typography variant="body2">
                      SoC Mean: {vehicleConfig.socMean}%
                    </Typography>
                    <Typography variant="body2">
                      SoC StdDev: {vehicleConfig.socStdDev}%
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>User Types:</strong>
                    </Typography>
                    <Typography variant="caption">
                      • Commuter: {vehicleConfig.userTypes.commuter}%
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      • Occasional: {vehicleConfig.userTypes.occasional}%
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      • Others: {vehicleConfig.userTypes.others}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Charging Hubs ({hubs.length})
                    </Typography>
                    {hubs.map((hub) => (
                      <Box key={hub.id} sx={{ mt: 1 }}>
                        <Typography variant="caption" fontWeight="bold">
                          {hub.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Pos: {hub.latitude.toFixed(4)}, {hub.longitude.toFixed(4)}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Stations: {hub.normalStations} normal + {hub.fastStations} fast
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            {loading
              ? 'Starting...'
              : activeStep === steps.length - 1
                ? 'Start Simulation'
                : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SimulationSetupPage;
