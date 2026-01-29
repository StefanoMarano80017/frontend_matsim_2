import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import { createCustomIcon } from './PoiIcon';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Chip, LinearProgress, Card, CardContent, Divider, Stack} from '@mui/material';

const MapView = ({ pois, onSelectPoi, selectedVehicle, stateConfig }) => {
  const processedPois = useMemo(() => {
    return pois.filter(poi => poi && poi.pos && poi.pos.length === 2);
  }, [pois]);

  const getPoiType = (poi) => {
    if (poi.type === 'vehicle') return 'vehicle';
    if (poi.type === 'hub') return 'hub';
    return poi.type || 'hub';
  };

  return (
    <MapContainer center={[52.52, 13.40]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {processedPois.map((poi) => {
        const poiType = getPoiType(poi);

        // Vehicle markers
        if (poiType === 'vehicle') {
          const isSelected = selectedVehicle?.id === poi.id;

          // Usa STATE_CONFIG per ottenere label e colore
          const stateKey = (poi.state).toLowerCase();
          const stateCfg = stateConfig[stateKey] || stateConfig.unknown;

          return (
            <React.Fragment key={poi.id}>
              <Marker
                position={poi.pos}
                icon={createCustomIcon('vehicle', stateKey, stateConfig)}
                eventHandlers={{ click: () => onSelectPoi(poi) }}
              >
                <Popup>
                <Card 
                  key={`popup-card-${poi.id}-${poi.soc}`}
                  sx={{ minWidth: 220, boxShadow: 'none', border: 'none', bgcolor: 'transparent' }}
                >
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    {/* Header con Titolo e Badge Stato */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mr: 1 }}>
                        {poi.id}
                      </Typography>
                      <Chip
                        label={stateCfg.label}
                        size="small"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.65rem', 
                          bgcolor: stateCfg.color, 
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary" display="block">
                      {poi.displayName}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {/* Dettagli Dinamici */}
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">SoC:</Typography>
                        <Typography variant="caption" fontWeight="bold">{poi.soc}%</Typography>
                      </Box>
                      
                      {/* Barra del SoC rapida */}
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(poi.soc*100 || 0, 100)}
                        sx={{ 
                          mt: 1, 
                          height: 4, 
                          borderRadius: 2,
                          bgcolor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: (poi.soc*100 || 0) < 20 ? 'error.main' : 'success.main'
                          }
                        }} 
                      />

                      {poi.speed !== undefined && stateKey === 'moving' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">Velocità:</Typography>
                          <Typography variant="caption" fontWeight="bold">{Math.round(poi.speed)} km/h</Typography>
                        </Box>
                      )}

                      {poi.chargingHubId && stateKey === 'charging' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">Hub:</Typography>
                          <Typography variant="caption" fontWeight="bold">{poi.chargingHubId}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Popup>

                <Tooltip direction="top" offset={[0, -40]} permanent={false} sticky>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {poi.name || poi.id}
                  </Typography>
                </Tooltip>
              </Marker>

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

        // Hub markers
        return (
          <Marker
            key={poi.id}
            position={poi.pos}
            icon={createCustomIcon(poiType)}
            eventHandlers={{ click: () => onSelectPoi(poi) }}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="subtitle2" fontWeight="bold">{poi.name || poi.id}</Typography>

                {poi.totalCapacity?.normal > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Normal</Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {poi.occupancy?.normal || 0} / {poi.totalCapacity?.normal}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((poi.occupancy?.normal || 0) / poi.totalCapacity.normal * 100, 100)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}

                {poi.totalCapacity?.fast > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Fast</Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {poi.occupancy?.fast || 0} / {poi.totalCapacity?.fast}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((poi.occupancy?.fast || 0) / poi.totalCapacity.fast * 100, 100)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </Box>
            </Popup>

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
