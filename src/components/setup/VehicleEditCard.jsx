import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const VehicleEditCard = ({ vehicle, onSave, onCancel }) => {
  const [formData, setFormData] = useState(vehicle);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.startPosition ||
      formData.startPosition.length < 2 ||
      isNaN(formData.startPosition[0]) ||
      isNaN(formData.startPosition[1])
    ) {
      newErrors.startPosition = 'Invalid start position';
    }

    if (
      !formData.endPosition ||
      formData.endPosition.length < 2 ||
      isNaN(formData.endPosition[0]) ||
      isNaN(formData.endPosition[1])
    ) {
      newErrors.endPosition = 'Invalid end position';
    }

    if (formData.initialSoC < 0 || formData.initialSoC > 100) {
      newErrors.initialSoC = 'SoC must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePositionChange = (field, index, value) => {
    const floatValue = parseFloat(value) || 0;
    setFormData((prev) => {
      const updated = { ...prev };
      if (field === 'startPosition') {
        updated.startPosition = [...prev.startPosition];
        updated.startPosition[index] = floatValue;
      } else if (field === 'endPosition') {
        updated.endPosition = [...prev.endPosition];
        updated.endPosition[index] = floatValue;
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Card
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        mb: 2,
        border: '2px solid #2196f3',
        bgcolor: '#f0f7ff',
      }}
    >
      <CardHeader
        title={`Edit Route - ${vehicle.id}`}
        subtitle={vehicle.model}
        action={
          <IconButton size="small" onClick={onCancel} title="Cancel">
            <CloseIcon />
          </IconButton>
        }
      />

      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Adjust vehicle properties. Changes apply to setup only (not running simulation).
        </Alert>

        <Grid container spacing={2}>
          {/* Start Position */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Start Position
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  size="small"
                  value={formData.startPosition?.[0] || ''}
                  onChange={(e) => handlePositionChange('startPosition', 0, e.target.value)}
                  inputProps={{ step: 0.001 }}
                  error={!!errors.startPosition}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  size="small"
                  value={formData.startPosition?.[1] || ''}
                  onChange={(e) => handlePositionChange('startPosition', 1, e.target.value)}
                  inputProps={{ step: 0.001 }}
                  error={!!errors.startPosition}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* End Position */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              End Position
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  size="small"
                  value={formData.endPosition?.[0] || ''}
                  onChange={(e) => handlePositionChange('endPosition', 0, e.target.value)}
                  inputProps={{ step: 0.001 }}
                  error={!!errors.endPosition}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  size="small"
                  value={formData.endPosition?.[1] || ''}
                  onChange={(e) => handlePositionChange('endPosition', 1, e.target.value)}
                  inputProps={{ step: 0.001 }}
                  error={!!errors.endPosition}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* SoC */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Initial SoC (%)"
              type="number"
              size="small"
              value={formData.initialSoC || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  initialSoC: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                })
              }
              inputProps={{ min: 0, max: 100, step: 1 }}
              error={!!errors.initialSoC}
              helperText={errors.initialSoC}
            />
          </Grid>

          {/* Model (read-only display) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Vehicle Model"
              size="small"
              value={formData.model || ''}
              disabled
            />
          </Grid>
        </Grid>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </CardActions>
    </Card>
  );
};

export default VehicleEditCard;
