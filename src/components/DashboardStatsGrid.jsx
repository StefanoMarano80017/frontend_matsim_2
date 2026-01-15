import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';

const DashboardStatsGrid = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Vehicles',
      value: stats.totalVehicles || 0,
      icon: '🚗',
    },
    {
      label: 'Moving',
      value: stats.vehiclesMoving || 0,
      color: '#2196f3',
    },
    {
      label: 'Charging',
      value: stats.vehiclesCharging || 0,
      color: '#4caf50',
    },
    {
      label: 'Idle',
      value: stats.vehiclesIdle || 0,
      color: '#ff9800',
    },
    {
      label: 'Avg SoC',
      value: `${stats.averageSoC || 0}%`,
      color: '#9c27b0',
    },
    {
      label: 'Saturated Hubs',
      value: stats.saturatedHubs || 0,
      color: stats.saturatedHubs > 0 ? '#f44336' : '#4caf50',
    },
  ];

  return (
    <Grid container spacing={2}>
      {statCards.map((stat, idx) => (
        <Grid item xs={6} sm={4} md={2} key={idx}>
          <Card variant="outlined">
            <CardContent sx={{ pb: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: stat.color }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStatsGrid;
