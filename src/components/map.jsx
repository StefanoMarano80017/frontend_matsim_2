import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import { createCustomIcon } from './PoiIcon';
import 'leaflet/dist/leaflet.css';
import { POI_TYPES } from './poiRegistry';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';

const MapView = ({ pois, onSelectPoi, selectedVehicle }) => {
  // Memoize POI processing to avoid unnecessary re-renders
  const processedPois = useMemo(() => {
    return pois.filter(poi => poi && poi.pos && poi.pos.length === 2);
  }, [pois]);

  // Ensure POI has proper type
  const getPoiType = (poi) => {
    if (poi.type === 'vehicle') return 'vehicle';
    if (poi.type === 'hub') return 'hub';
    return poi.type || 'hub';
  };

  return (
    <MapContainer 
      center={[52.52, 13.40]} 
      zoom={13} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {processedPois.map((poi) => {
        const poiType = getPoiType(poi);
        const config = POI_TYPES[poiType] || POI_TYPES.hub;

        // Render vehicles with state-dependent styling
        if (poiType === 'vehicle') {
          const isSelected = selectedVehicle?.id === poi.id;

          return (
            <React.Fragment key={poi.id}>
              {/* Main vehicle marker */}
              <Marker
                position={poi.pos}
                icon={createCustomIcon('vehicle', poi.state)}
                eventHandlers={{
                  click: () => onSelectPoi(poi),
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {poi.model}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      ID: {poi.name || poi.id}
                    </Typography>
                    
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        State:
                      </Typography>
                      <Chip
                        label={poi.state?.toUpperCase() || 'UNKNOWN'}
                        size="small"
                        color={
                          poi.state === 'charging'
                            ? 'success'
                            : poi.state === 'moving'
                              ? 'primary'
                              : 'default'
                        }
                        variant="outlined"
                        sx={{ ml: 1, height: 24 }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Battery: {poi.soc}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={poi.soc}
                      sx={{ height: 6, borderRadius: 3, mt: 1 }}
                    />

                    {poi.speed !== undefined && poi.state === 'moving' && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Speed: {Math.round(poi.speed)} km/h
                      </Typography>
                    )}

                    {poi.chargingHubId && poi.state === 'charging' && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Hub: {poi.chargingHubId}
                      </Typography>
                    )}
                  </Box>
                </Popup>
                
                {/* Tooltip on hover */}
                <Tooltip direction="top" offset={[0, -40]} permanent={false} sticky>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {poi.name || poi.id}
                  </Typography>
                </Tooltip>
              </Marker>

              {/* Selection indicator circle around vehicle */}
              {isSelected && (
                <CircleMarker
                  center={poi.pos}
                  radius={25}
                  fill={false}
                  color="#2196f3"
                  weight={2}
                  dashArray="5, 5"
                />
              )}
            </React.Fragment>
          );
        }

        // Render hubs and other fixed infrastructure
        return (
          <Marker
            key={poi.id}
            position={poi.pos}
            icon={createCustomIcon(poiType)}
            eventHandlers={{
              click: () => onSelectPoi(poi),
            }}
          >
            <Popup>
              {poiType === 'hub' ? (
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {poi.name}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Normal Stations
                    </Typography>
                    <Typography variant="body2">
                      {poi.occupancy?.normal || 0} / {poi.totalCapacity?.normal || 0}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((poi.occupancy?.normal || 0) / (poi.totalCapacity?.normal || 1)) * 100
                      }
                      sx={{ height: 6, borderRadius: 3, mt: 1 }}
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Fast Charging Stations
                    </Typography>
                    <Typography variant="body2">
                      {poi.occupancy?.fast || 0} / {poi.totalCapacity?.fast || 0}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={((poi.occupancy?.fast || 0) / (poi.totalCapacity?.fast || 1)) * 100}
                      sx={{ height: 6, borderRadius: 3, mt: 1 }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ minWidth: 150 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {poi.name || poi.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Type: {POI_TYPES[poiType]?.label || poiType}
                  </Typography>
                  {poi.alt && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Altitude: {poi.alt}m
                    </Typography>
                  )}
                </Box>
              )}
            </Popup>

            {/* Tooltip on hover */}
            <Tooltip direction="top" offset={[0, -40]} permanent={false} sticky>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {poi.name || poi.id}
              </Typography>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;