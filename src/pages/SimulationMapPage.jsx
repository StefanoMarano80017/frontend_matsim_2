import React, { useState, useEffect } from "react";
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Typography 
} from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MapView from "../components/map";
import EnhancedFloatingMenu from "../components/EnhancedFloatingMenu";

// Configurazione centralizzata degli stati dei veicoli
const STATE_CONFIG = {
  moving: {
    label: 'Moving',
    color: '#2196f3',
    statsKey: 'vehiclesMoving',
  },
  charging: {
    label: 'Charging',
    color: '#4caf50',
    statsKey: 'vehiclesCharging',
  },
  parked: {
    label: 'Parked',
    color: '#9c27b0',
    statsKey: 'vehiclesParked',
  },
  idle: {
    label: 'Idle',
    color: '#ff9800',
    statsKey: 'vehiclesIdle',
  },
  stopped: {
    label: 'Stopped',
    color: '#f44336',
    statsKey: 'vehiclesStopped',
  },
  unknown: {
    label: 'Unknown',
    color: '#757575',
    statsKey: null,
  },
};

import { useSimulation } from "../contexts/SimulationContext.jsx";
import "./SimulationMapPage.css";

const getRandomPos = () => {
  // Berlino: lat 52.48 - 52.54, lng 13.36 - 13.45
  const lat = 52.48 + Math.random() * (52.54 - 52.48);
  const lng = 13.36 + Math.random() * (13.45 - 13.36);
  return [lat, lng];
};

const SimulationMapPage = () => {
  const {
    vehicles,
    hubs,
    simulationStats,
    wsConnected,
    isSimulationRunning,
    startSimulation,
    stopSimulation,
  } = useSimulation();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [filters, setFilters] = useState({
    showCharging: true,
    showIdle: true,
    showMoving: true,
  });

  // Avvia la simulazione e connessione WS al mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await startSimulation();
      } catch (e) {
        console.error("[SimulationMapPage] Errore inizializzazione simulazione:", e);
        if (mounted) setShowErrorModal(true);
      }
    };

    init();

    return () => {
      mounted = false;
      stopSimulation();
    };
  }, [startSimulation, stopSimulation]);

  // Mostra il modal se non ci sono dati o WS non connessa
  useEffect(() => {
    if (!wsConnected && vehicles.length === 0) {
      const timeout = setTimeout(() => setShowErrorModal(true), 15000);
      return () => clearTimeout(timeout);
    } else {
      setShowErrorModal(false);
    }
  }, [wsConnected, vehicles.length]);

  const handleCloseModal = () => setShowErrorModal(false);
  const handleRetryConnection = async () => {
    setShowErrorModal(false);
    await startSimulation();
  };

  // Filtra veicoli (plain objects dal Context)
  const filteredVehicles = vehicles.filter(v => {
    if (v.state === "charging" && !filters.showCharging) return false;
    if (v.state === "idle" && !filters.showIdle) return false;
    if (v.state === "moving" && !filters.showMoving) return false;
    return true;
  });

  // Fallback posizione (es: centro mappa o coordinate note)
  const DEFAULT_POS = { lat: 52.5162, lng: 13.4117 }; // Berlino centro

  // POI per la mappa: aggiungi property type, fallback posizione e conversione a array [lat, lng]
  const toLatLngArray = (pos) => {
    if (Array.isArray(pos) && pos.length === 2) return pos;
    if (pos && typeof pos.lat === 'number' && typeof pos.lng === 'number') return [pos.lat, pos.lng];
    return [DEFAULT_POS.lat, DEFAULT_POS.lng];
  };

  // Crea nuovi oggetti per evitare mutazioni sui plain objects del Context
  const allPois = [
    ...filteredVehicles.map(v => ({
      ...v,
      type: "vehicle",
      pos: toLatLngArray(v.pos || getRandomPos()),
    })),
    ...hubs.map(h => ({
      ...h,
      type: "hub",
      pos: toLatLngArray(h.pos || getRandomPos()),
    })),
  ];

  const handleMarkerClick = (poi) => {
    if (poi.type === "vehicle") setSelectedVehicle(poi);
  };

  return (
    <Box sx={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden" }}>
      <EnhancedFloatingMenu
        vehicles={filteredVehicles}
        hubs={hubs}
        stats={simulationStats}
        onSelectVehicle={setSelectedVehicle}
        filters={filters}
        onFiltersChange={setFilters}
        isConnected={wsConnected}
        isSimulationRunning={isSimulationRunning}
        stateConfig={STATE_CONFIG}
      />

      <MapView
        pois={allPois}
        onSelectPoi={handleMarkerClick}
        selectedVehicle={selectedVehicle}
        stateConfig={STATE_CONFIG}
      />

      {/* Modal di errore */}
      <Dialog
        open={showErrorModal}
        onClose={handleCloseModal}
        PaperProps={{ sx: { borderRadius: "12px", p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ErrorOutlineIcon color="error" fontSize="large" />
          <Typography variant="h6" fontWeight="bold">Servizio Offline</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Impossibile stabilire una connessione con il server della simulazione.
            Il servizio potrebbe essere temporaneamente non disponibile o il backend è spento.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">Chiudi</Button>
          <Button 
            onClick={handleRetryConnection} 
            variant="contained" 
            color="primary"
          >
            Riprova Connessione
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimulationMapPage;
