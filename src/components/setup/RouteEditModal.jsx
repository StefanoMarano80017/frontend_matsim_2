import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

const RouteEditModal = ({ open, vehicle, onClose, onSave }) => {
  const [editedVehicle, setEditedVehicle] = useState(vehicle);

  const handlePositionChange = (field, index, value) => {
    const updatedVehicle = { ...editedVehicle };
    const floatValue = parseFloat(value) || 0;

    if (field === 'startPosition') {
      updatedVehicle.startPosition[index] = floatValue;
    } else if (field === 'endPosition') {
      updatedVehicle.endPosition[index] = floatValue;
    }

    setEditedVehicle(updatedVehicle);
  };

  const handleSave = () => {
    // Validate positions
    if (
      !editedVehicle.startPosition ||
      !editedVehicle.endPosition ||
      editedVehicle.startPosition.length < 2 ||
      editedVehicle.endPosition.length < 2
    ) {
      alert('Invalid positions');
      return;
    }

    onSave(editedVehicle);
    onClose();
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Route - {vehicle.id}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Adjust the start and end coordinates to modify the vehicle's route.
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Start Position */}
          <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Start Position
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <TextField
                label="Latitude"
                type="number"
                size="small"
                value={editedVehicle.startPosition?.[0] || ''}
                onChange={(e) => handlePositionChange('startPosition', 0, e.target.value)}
                inputProps={{ step: 0.001 }}
              />
              <TextField
                label="Longitude"
                type="number"
                size="small"
                value={editedVehicle.startPosition?.[1] || ''}
                onChange={(e) => handlePositionChange('startPosition', 1, e.target.value)}
                inputProps={{ step: 0.001 }}
              />
            </Box>
          </Paper>

          {/* End Position */}
          <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              End Position
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <TextField
                label="Latitude"
                type="number"
                size="small"
                value={editedVehicle.endPosition?.[0] || ''}
                onChange={(e) => handlePositionChange('endPosition', 0, e.target.value)}
                inputProps={{ step: 0.001 }}
              />
              <TextField
                label="Longitude"
                type="number"
                size="small"
                value={editedVehicle.endPosition?.[1] || ''}
                onChange={(e) => handlePositionChange('endPosition', 1, e.target.value)}
                inputProps={{ step: 0.001 }}
              />
            </Box>
          </Paper>

          {/* SoC Edit */}
          <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Initial State of Charge
            </Typography>
            <TextField
              label="SoC (%)"
              type="number"
              size="small"
              value={editedVehicle.initialSoC || ''}
              onChange={(e) =>
                setEditedVehicle({
                  ...editedVehicle,
                  initialSoC: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                })
              }
              inputProps={{ min: 0, max: 100, step: 1 }}
              fullWidth
            />
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RouteEditModal;
