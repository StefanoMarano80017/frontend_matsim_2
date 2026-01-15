import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress, Chip, Stack } from '@mui/material';

const RouteDetailsCard = ({ route }) => {
  if (!route) return null;

  const avgSpeed = (route.distance / route.duration).toFixed(1);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
          Journey Details
        </Typography>

        <Stack spacing={2}>
          {/* Distance */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Distance
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {route.distance.toFixed(1)} km
              </Typography>
            </Box>
          </Box>

          {/* Duration */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Estimated Duration
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {route.duration.toFixed(1)} h
              </Typography>
            </Box>
          </Box>

          {/* Average Speed */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Average Speed
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {avgSpeed} km/h
              </Typography>
            </Box>
          </Box>

          {/* Charging Stops */}
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Charging Stops: {route.chargingStops.length}
            </Typography>
            <Stack spacing={1}>
              {route.chargingStops.map((stop, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    borderLeft: '3px solid #ff9800',
                  }}
                >
                  <Typography variant="caption" fontWeight="bold" display="block">
                    Stop {idx + 1}: {stop.hubName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Charging: {stop.chargingTime} min | Cost: €{stop.cost.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Cost */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: '#e8f5e9',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              Total Cost
            </Typography>
            <Chip label={`€${route.totalCost.toFixed(2)}`} color="success" size="small" />
          </Box>

          {/* Arrival SoC */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Estimated Arrival SoC
              </Typography>
              <Typography variant="caption" fontWeight="bold" color={route.estimatedArrivalSoC < 20 ? 'error' : 'success'}>
                {route.estimatedArrivalSoC}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={route.estimatedArrivalSoC}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: route.estimatedArrivalSoC < 20 ? '#f44336' : '#4caf50',
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RouteDetailsCard;
