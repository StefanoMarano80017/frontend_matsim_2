import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Paper, TextField, Button, Stack, Typography, Card, 
  CardContent, Chip, CircularProgress, Tooltip, IconButton, 
  Divider, InputAdornment 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapView from '../components/map';
import { useSimulation } from '../contexts/SimulationContext';
import { routeCalculationService } from '../services/routeCalculationService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { chargingHubs } = useSimulation();
  
  const [vehicleData, setVehicleData] = useState({ model: '', initialSoC: 50, targetSoC: 80 });
  const [loading, setLoading] = useState(false);
  const [calculatedRoutes, setCalculatedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Stato per gli indirizzi testuali
  const [addressPoints, setAddressPoints] = useState({
    origin: '',
    destination: ''
  });

  // Stato per le coordinate calcolate
  const [routeCoordinates, setRouteCoordinates] = useState({
    origin: null,
    destination: null
  });

  const handleVehicleChange = (field, value) => {
    setVehicleData((prev) => ({ ...prev, [field]: field === 'model' ? value : Number(value) }));
  };

  const handleAddressChange = (field, value) => {
    setAddressPoints(prev => ({ ...prev, [field]: value }));
  };

  // Servizio di geocoding mock - In produzione usare servizio vero (Nominatim, Google Maps, ecc)
  const geocodeAddress = (address) => {
    const mockGeodata = {
      'milano': { lat: 45.4642, lon: 9.1900 },
      'roma': { lat: 41.9028, lon: 12.4964 },
      'torino': { lat: 45.0705, lon: 7.6868 },
      'napoli': { lat: 40.8518, lon: 14.2681 },
      'venezia': { lat: 45.4408, lon: 12.3155 },
      'firenze': { lat: 43.7695, lon: 11.2558 },
      'bologna': { lat: 44.4949, lon: 11.3426 },
    };
    
    const normalized = address.toLowerCase().trim();
    return mockGeodata[normalized] || { lat: 45.4642 + Math.random() * 5, lon: 9.1900 + Math.random() * 5 };
  };

  const handleCalculateRoute = async () => {
    if (!addressPoints.origin || !addressPoints.destination) {
      alert('Please enter both origin and destination addresses');
      return;
    }

    setLoading(true);
    try {
      // Geocodifica gli indirizzi
      const originCoords = geocodeAddress(addressPoints.origin);
      const destCoords = geocodeAddress(addressPoints.destination);

      // Salva le coordinate
      setRouteCoordinates({
        origin: originCoords,
        destination: destCoords
      });

      // Calcola il percorso - passa le coordinate nel formato corretto [lat, lon]
      const routes = await routeCalculationService.calculateRoutes({
        origin: [originCoords.lat, originCoords.lon],
        destination: [destCoords.lat, destCoords.lon],
        vehicleData,
        chargingHubs,
      });

      console.log("Routes calculated:", routes);

      setCalculatedRoutes(routes);
      if (routes.length > 0) setSelectedRoute(routes[0]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to calculate routes');
    } finally {
      setLoading(false);
    }
  };

  // Calcolo dei punti da mostrare sulla mappa
  const mapPois = [
    // 1. Mostra sempre gli Hub di ricarica disponibili
    ...(chargingHubs || []),

    // 2. Se è stato calcolato un percorso, mostra le tappe di ricarica previste
    ...(selectedRoute?.chargingStops ? selectedRoute.chargingStops.map((stop, idx) => ({
      ...stop,
      type: 'hub',
      id: `stop-${idx}`,
      state: 'charging-stop',
      name: `Charging Stop ${idx + 1}`,
    })) : []),

    // 3. Se sono state calcolate le coordinate di partenza/destinazione, aggiungile
    ...(routeCoordinates.origin ? [{
      id: 'origin',
      name: `Start: ${addressPoints.origin}`,
      lat: routeCoordinates.origin.lat,
      lon: routeCoordinates.origin.lon,
      type: 'origin',
      state: 'origin'
    }] : []),
    
    ...(routeCoordinates.destination ? [{
      id: 'destination',
      name: `End: ${addressPoints.destination}`,
      lat: routeCoordinates.destination.lat,
      lon: routeCoordinates.destination.lon,
      type: 'destination',
      state: 'destination'
    }] : []),
  ];

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex' }}>
      {/* Sidebar Panel */}
      <Paper
        elevation={4}
        sx={{
          width: { xs: '100%', sm: 400 },
          height: '100vh',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
        }}
      >
        {/* Header con pulsante indietro */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">Route Planner</Typography>
        </Box>

        <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
          {/* Section: Addresses */}
          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary' }}>
            Journey Details
          </Typography>
          
          <Stack spacing={2} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Starting Point"
              placeholder="Enter address or city"
              value={addressPoints.origin}
              onChange={(e) => handleAddressChange('origin', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MyLocationIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Destination"
              placeholder="Enter destination"
              value={addressPoints.destination}
              onChange={(e) => handleAddressChange('destination', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: 'error.main', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Section: Vehicle */}
          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary' }}>
            Vehicle Settings
          </Typography>
          <Stack spacing={2} sx={{ mb: 4 }}>
            <TextField
              label="Vehicle Model"
              value={vehicleData.model}
              onChange={(e) => handleVehicleChange('model', e.target.value)}
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Current SoC %"
                type="number"
                value={vehicleData.initialSoC}
                onChange={(e) => handleVehicleChange('initialSoC', e.target.value)}
                size="small"
              />
              <TextField
                label="Target SoC %"
                type="number"
                value={vehicleData.targetSoC}
                onChange={(e) => handleVehicleChange('targetSoC', e.target.value)}
                size="small"
              />
            </Box>
          </Stack>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleCalculateRoute}
            disabled={loading || !addressPoints.origin || !addressPoints.destination}
            sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Find Best Route'}
          </Button>

          {/* Risultati dei percorsi (stessa logica di prima ma stilizzata meglio) */}
          {calculatedRoutes.length > 0 && (
             <Stack spacing={2} sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold">Available Options</Typography>
                {calculatedRoutes.map((route) => (
                  <Card 
                    key={route.id} 
                    variant="outlined"
                    onClick={() => setSelectedRoute(route)}
                    sx={{ 
                      cursor: 'pointer', 
                      borderColor: selectedRoute?.id === route.id ? 'primary.main' : 'divider',
                      bgcolor: selectedRoute?.id === route.id ? 'action.selected' : 'background.paper'
                    }}
                  >
                    <CardContent>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1" fontWeight="bold">{route.distance} km</Typography>
                          <Typography variant="body1" color="primary" fontWeight="bold">€{route.totalCost}</Typography>
                       </Box>
                       <Typography variant="caption" color="text.secondary">Est. Time: {route.duration}h • {route.chargingStops.length} stops</Typography>
                    </CardContent>
                  </Card>
                ))}
             </Stack>
          )}
        </Box>
      </Paper>

      {/* Map View - Occupa il resto dello schermo */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <MapView 
          pois={mapPois}
          selectedVehicle={selectedRoute}
          onSelectPoi={() => {}} 
        />
      </Box>
    </Box>
  );
};

export default UserDashboard;