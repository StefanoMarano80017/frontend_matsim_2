import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const VehicleList = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onDeleteVehicle,
  onEditRoute,
}) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">No vehicles generated</Typography>
      </Paper>
    );
  }

  const getUserTypeColor = (userType) => {
    const colorMap = {
      commuter: '#2196f3',
      occasional: '#ff9800',
      others: '#757575',
    };
    return colorMap[userType] || '#757575';
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: 500,
      }}
    >
      <List dense>
        {vehicles.map((vehicle, idx) => (
          <ListItem
            key={vehicle.id}
            disablePadding
            sx={{
              borderLeft:
                selectedVehicleId === vehicle.id ? '4px solid #2196f3' : 'none',
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            <ListItemButton
              selected={selectedVehicleId === vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id)}
              sx={{
                pl: selectedVehicleId === vehicle.id ? 1.5 : 2,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon sx={{ fontSize: '18px' }} />
                    <span>{vehicle.id}</span>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.model}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`SoC: ${vehicle.initialSoC}%`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20 }}
                      />
                      <Chip
                        label={vehicle.userType}
                        size="small"
                        variant="filled"
                        sx={{
                          height: 20,
                          backgroundColor: getUserTypeColor(vehicle.userType),
                          color: 'white',
                          fontSize: '11px',
                        }}
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItemButton>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 0.5, pr: 1 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRoute(vehicle);
                }}
                title="Edit route"
              >
                <EditIcon sx={{ fontSize: '18px' }} />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteVehicle(vehicle.id);
                }}
                title="Delete vehicle"
              >
                <DeleteIcon sx={{ fontSize: '18px' }} />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default VehicleList;
