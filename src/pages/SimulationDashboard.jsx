import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Button, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SimulationSetupPage from './SimulationSetupPage';
import SimulationMapPage from './SimulationMapPage';
import { useSimulation } from '../contexts/SimulationContext';

const SimulationDashboard = () => {
  const navigate = useNavigate();
  const { isSimulationRunning } = useSimulation();
  const [tabIndex, setTabIndex] = useState(isSimulationRunning ? 1 : 0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 0,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back to Dashboards
          </Button>
          <Typography variant="h6" fontWeight="bold">
            Simulation Dashboard
          </Typography>
        </Stack>

        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ ml: 'auto' }}>
          <Tab label="Setup" disabled={isSimulationRunning} />
          <Tab label="Monitoring" disabled={!isSimulationRunning} />
        </Tabs>
      </Paper>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {tabIndex === 0 && <SimulationSetupPage />}
        {tabIndex === 1 && <SimulationMapPage />}
      </Box>
    </Box>
  );
};

export default SimulationDashboard;
