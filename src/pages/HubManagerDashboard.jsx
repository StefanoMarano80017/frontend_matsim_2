import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress, Select, MenuItem, FormControl, InputLabel, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MapView from '../components/map';
import { useSimulation } from '../contexts/SimulationContext';

const HubManagerDashboard = () => {
  const navigate = useNavigate();
  const { monitoringHubs, chargingHubs } = useSimulation();
  const hubs = monitoringHubs.length > 0 ? monitoringHubs : chargingHubs || [];
  const [selectedHubId, setSelectedHubId] = useState(hubs.length > 0 ? hubs[0].id : null);

  const selectedHub = hubs.find((h) => h.id === selectedHubId);

  const mockStalls = selectedHub
    ? [
        {
          id: 'stall-1',
          type: 'normal',
          occupied: true,
          vehicleId: 'V-001',
          energyDelivered: 45.2,
          chargingTime: 120,
        },
        {
          id: 'stall-2',
          type: 'normal',
          occupied: false,
          vehicleId: null,
          energyDelivered: 0,
          chargingTime: 0,
        },
        {
          id: 'stall-3',
          type: 'normal',
          occupied: true,
          vehicleId: 'V-003',
          energyDelivered: 62.5,
          chargingTime: 180,
        },
        {
          id: 'stall-4',
          type: 'fast',
          occupied: true,
          vehicleId: 'V-002',
          energyDelivered: 88.0,
          chargingTime: 45,
        },
        {
          id: 'stall-5',
          type: 'fast',
          occupied: false,
          vehicleId: null,
          energyDelivered: 0,
          chargingTime: 0,
        },
      ]
    : [];

  const totalEnergyDelivered = mockStalls.reduce((sum, stall) => sum + stall.energyDelivered, 0);
  const occupiedStalls = mockStalls.filter((s) => s.occupied).length;

  const mapPois = hubs.map((hub) => ({
    ...hub,
    type: 'hub',
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fafafa' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 0 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 1 }}
        >
          Back to Dashboards
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Hub Manager
        </Typography>
      </Paper>

      {/* Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Hub Selection & Stats */}
        <Paper
          elevation={2}
          sx={{
            width: { xs: '100%', sm: '100%', md: '40%', lg: '35%' },
            p: 3,
            overflowY: 'auto',
            borderRadius: 0,
            minWidth: 320,
          }}
        >
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Hub Selection & Statistics
        </Typography>

        {/* Hub Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Hub</InputLabel>
          <Select
            value={selectedHubId || ''}
            onChange={(e) => setSelectedHubId(e.target.value)}
            label="Select Hub"
          >
            {hubs.map((hub) => (
              <MenuItem key={hub.id} value={hub.id}>
                {hub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedHub && (
          <>
            {/* Hub Summary */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
              Hub Overview
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ pb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {selectedHub.pos[0].toFixed(4)}, {selectedHub.pos[1].toFixed(4)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ pb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Occupied Stalls
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {occupiedStalls} / {mockStalls.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Energy Metrics */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
              Energy Delivery
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption">Total Energy Delivered</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {totalEnergyDelivered.toFixed(1)} kWh
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Math.min((totalEnergyDelivered / 500) * 100, 100)} />
                </Box>
              </CardContent>
            </Card>

            {/* Stall Status */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
              Charging Stalls
            </Typography>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Stall</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Energy (kWh)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockStalls.map((stall) => (
                    <TableRow key={stall.id}>
                      <TableCell variant="head">{stall.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={stall.type}
                          size="small"
                          variant="outlined"
                          color={stall.type === 'fast' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {stall.occupied ? (
                          <Chip label="Charging" size="small" color="success" variant="filled" />
                        ) : (
                          <Chip label="Idle" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="right">{stall.energyDelivered.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Normal & Fast Breakdown */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
              Capacity Breakdown
            </Typography>
            <Stack spacing={2}>
              <Card variant="outlined">
                <CardContent sx={{ pb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption">Normal Charging</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {selectedHub.occupancy?.normal || 0} / {selectedHub.totalCapacity?.normal || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      ((selectedHub.occupancy?.normal || 0) / (selectedHub.totalCapacity?.normal || 1)) * 100
                    }
                  />
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent sx={{ pb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption">Fast Charging</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {selectedHub.occupancy?.fast || 0} / {selectedHub.totalCapacity?.fast || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((selectedHub.occupancy?.fast || 0) / (selectedHub.totalCapacity?.fast || 1)) * 100}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ff9800',
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Stack>
          </>
        )}
      </Paper>

      {/* Right Panel - Map */}
      <Box sx={{ flex: 1, display: { xs: 'none', sm: 'none', md: 'block' }, minWidth: 0 }}>
        <MapView pois={mapPois} onSelectPoi={(poi) => setSelectedHubId(poi.id)} selectedVehicle={null} />
      </Box>
      </Box>
    </Box>
  );
};

export default HubManagerDashboard;
