import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const HubsConfigSection = ({ hubs, onChange }) => {
  const [editingId, setEditingId] = useState(null);

  const addHub = () => {
    const newHub = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Hub ${hubs.length + 1}`,
      latitude: 52.52,
      longitude: 13.40,
      normalStations: 5,
      fastStations: 2,
      plugsPerStation: 2,
    };
    const updatedHubs = [...hubs, newHub];
    onChange(updatedHubs);
  };

  const deleteHub = (id) => {
    onChange(hubs.filter((h) => h.id !== id));
  };

  const updateHub = (id, field, value) => {
    onChange(
      hubs.map((h) =>
        h.id === id
          ? {
              ...h,
              [field]: isNaN(value) ? value : Number(value),
            }
          : h
      )
    );
  };

  const toggleEditing = (id) => {
    setEditingId(editingId === id ? null : id);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Charging Hubs Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Define charging hub locations and capacities
        </Typography>
      </Box>

      {/* Hub List */}
      <Stack spacing={2}>
        {hubs.map((hub) => (
          <Card key={hub.id} variant="outlined">
            <CardContent>
              {editingId === hub.id ? (
                <Grid container spacing={2}>
                  {/* Name */}
                  <Grid item xs={12}>
                    <TextField
                      label="Hub Name"
                      value={hub.name}
                      onChange={(e) => updateHub(hub.id, 'name', e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>

                  {/* Latitude & Longitude */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Latitude"
                      type="number"
                      value={hub.latitude}
                      onChange={(e) => updateHub(hub.id, 'latitude', e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ step: 0.0001 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Longitude"
                      type="number"
                      value={hub.longitude}
                      onChange={(e) => updateHub(hub.id, 'longitude', e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ step: 0.0001 }}
                    />
                  </Grid>

                  {/* Station Counts */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Normal Charging Stations"
                      type="number"
                      value={hub.normalStations}
                      onChange={(e) => updateHub(hub.id, 'normalStations', e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Fast Charging Stations"
                      type="number"
                      value={hub.fastStations}
                      onChange={(e) => updateHub(hub.id, 'fastStations', e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  {/* Plugs Per Station */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Plugs per Station"
                      type="number"
                      value={hub.plugsPerStation}
                      onChange={(e) => updateHub(hub.id, 'plugsPerStation', e.target.value)}
                      fullWidth
                      size="small"
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {hub.name}
                  </Typography>
                  <Divider />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body2">
                          {hub.latitude.toFixed(4)}, {hub.longitude.toFixed(4)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Capacity
                        </Typography>
                        <Typography variant="body2">
                          {hub.normalStations} normal + {hub.fastStations} fast
                          {hub.plugsPerStation > 1 ? ` (${hub.plugsPerStation} plugs/station)` : ''}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Stack>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => toggleEditing(hub.id)}>
                {editingId === hub.id ? 'Done' : 'Edit'}
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => deleteHub(hub.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>

      {/* Add Hub Button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addHub}
        fullWidth
        sx={{ py: 1.5 }}
      >
        Add Charging Hub
      </Button>

      {/* Helper Text */}
      <Paper sx={{ p: 2, bgcolor: '#e3f2fd', border: '1px solid #bbdefb' }}>
        <Typography variant="caption">
          <strong>Tip:</strong> Each hub can have multiple charging stations with different
          charging speeds (normal vs. fast). Plugs per station allows for multiple simultaneous
          charges at a single station (e.g., common in shared parking lots).
        </Typography>
      </Paper>
    </Stack>
  );
};

export default HubsConfigSection;
