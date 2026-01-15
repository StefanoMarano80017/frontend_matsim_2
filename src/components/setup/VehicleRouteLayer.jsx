import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EvStationIcon from '@mui/icons-material/EvStation';
import FlagIcon from '@mui/icons-material/Flag';

/**
 * Component to visualize a vehicle's planned route on a map
 */
const VehicleRouteLayer = ({ vehicle, chargingHubs }) => {
  if (!vehicle) {
    return (
      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography color="text.secondary">No vehicle selected</Typography>
      </Paper>
    );
  }

  // Create custom icons
  const createIcon = (icon, color) => {
    const iconMarkup = renderToStaticMarkup(
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '40px',
          height: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          border: `2px solid ${color}`,
          color: color,
          fontSize: '24px',
          boxShadow: '0px 3px 6px rgba(0,0,0,0.3)',
        }}
      >
        {icon}
      </div>
    );

    return L.divIcon({
      html: iconMarkup,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  const startIcon = createIcon(<FlagIcon />, '#4caf50');
  const endIcon = createIcon(<FlagIcon />, '#f44336');
  const hubIcon = createIcon(<EvStationIcon />, '#2196f3');

  // Get charging hub details if applicable
  const chargingHub = vehicle.chargingHubId
    ? chargingHubs.find((h) => h.id === vehicle.chargingHubId)
    : null;

  // Prepare route coordinates
  const routeCoordinates = vehicle.plannedRoute || [
    vehicle.startPosition,
    vehicle.endPosition,
  ];

  // Calculate map bounds to fit route
  const allCoordinates = [vehicle.startPosition, vehicle.endPosition];
  if (chargingHub) {
    allCoordinates.push(chargingHub.pos);
  }

  const bounds = allCoordinates.map((coord) => [coord[0], coord[1]]);
  const centerLat =
    (Math.min(...bounds.map((b) => b[0])) + Math.max(...bounds.map((b) => b[0]))) / 2;
  const centerLng =
    (Math.min(...bounds.map((b) => b[1])) + Math.max(...bounds.map((b) => b[1]))) / 2;

  return (
    <Box>
      {/* Route Details */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: '#f9f9f9',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Route Information
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Start Position
            </Typography>
            <Typography variant="body2">
              {vehicle.startPosition[0].toFixed(4)}, {vehicle.startPosition[1].toFixed(4)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              End Position
            </Typography>
            <Typography variant="body2">
              {vehicle.endPosition[0].toFixed(4)}, {vehicle.endPosition[1].toFixed(4)}
            </Typography>
          </Box>

          {chargingHub && (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Charging Hub
                </Typography>
                <Typography variant="body2">{chargingHub.name}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Hub Position
                </Typography>
                <Typography variant="body2">
                  {chargingHub.pos[0].toFixed(4)}, {chargingHub.pos[1].toFixed(4)}
                </Typography>
              </Box>
            </>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary">
              Distance
            </Typography>
            <Typography variant="body2">
              {calculateDistance(vehicle.startPosition, vehicle.endPosition).toFixed(2)} km
            </Typography>
          </Box>

          {chargingHub && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Charging Stop
              </Typography>
              <Chip
                label={`${chargingHub.normalStations} normal + ${chargingHub.fastStations} fast`}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Map */}
      <Paper
        sx={{
          height: 400,
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}
      >
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

          {/* Route polyline */}
          {routeCoordinates.length >= 2 && (
            <Polyline
              positions={routeCoordinates.map((coord) => [coord[0], coord[1]])}
              color="#2196f3"
              weight={3}
              opacity={0.7}
              dashArray="5, 5"
            />
          )}

          {/* Start marker */}
          <Marker position={[vehicle.startPosition[0], vehicle.startPosition[1]]} icon={startIcon}>
            <Popup>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Start Point
                </Typography>
                <Typography variant="caption">
                  {vehicle.startPosition[0].toFixed(4)}, {vehicle.startPosition[1].toFixed(4)}
                </Typography>
              </Box>
            </Popup>
          </Marker>

          {/* End marker */}
          <Marker position={[vehicle.endPosition[0], vehicle.endPosition[1]]} icon={endIcon}>
            <Popup>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  End Point
                </Typography>
                <Typography variant="caption">
                  {vehicle.endPosition[0].toFixed(4)}, {vehicle.endPosition[1].toFixed(4)}
                </Typography>
              </Box>
            </Popup>
          </Marker>

          {/* Charging hub marker */}
          {chargingHub && (
            <Marker position={[chargingHub.pos[0], chargingHub.pos[1]]} icon={hubIcon}>
              <Popup>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {chargingHub.name}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Normal: {chargingHub.normalStations} | Fast: {chargingHub.fastStations}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          )}

          {/* Highlight hub coverage as a circle */}
          {chargingHub && (
            <CircleMarker
              center={[chargingHub.pos[0], chargingHub.pos[1]]}
              radius={5}
              fill={true}
              fillColor="#2196f3"
              fillOpacity={0.2}
              weight={2}
              color="#2196f3"
            />
          )}
        </MapContainer>
      </Paper>
    </Box>
  );
};

/**
 * Simple distance calculator using Haversine formula
 */
function calculateDistance(pos1, pos2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((pos2[0] - pos1[0]) * Math.PI) / 180;
  const dLng = ((pos2[1] - pos1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1[0] * Math.PI) / 180) *
      Math.cos((pos2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default VehicleRouteLayer;
