import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { useSimulationWebSocket } from "./SimulationWebSocket";
import { fetchSimulationData } from "../api/SimulationApi";

/**
 * SimulationContext gestisce lo stato della simulazione.
 * 
 * ARCHITETTURA DATI:
 * - All'avvio: fetchSimulationData() crea istanze Vehicle/Hub tramite factory (createVehicleFromAPI, createHubFromAPI)
 * - Le istanze sono salvate in vehiclesRef/hubsRef come "fonte di verità" mutabile
 * - La WebSocket invia dati dinamici (soc, state, pos, ecc.)
 * - updateMonitoringData() aggiorna le istanze esistenti con vehicle.updateFromWebSocket()/hub.updateFromWebSocket()
 * - I componenti React ricevono snapshot immutabili tramite toJSON()
 */
const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  // === STATO SIMULAZIONE ===
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // === REGISTRY (fonte di verità - istanze mutabili) ===
  const vehiclesRef = useRef([]); // array di istanze Vehicle
  const hubsRef = useRef([]);     // array di istanze Hub
  const registryReadyRef = useRef(false); // La WS non deve aggiornare finché il registry non è pronto

  // === STATE REACT (snapshot plain objects per i componenti) ===
  const [vehicles, setVehicles] = useState([]);  // plain objects
  const [hubs, setHubs] = useState([]);          // plain objects
  const [simulationStats, setSimulationStats] = useState({
    totalVehicles: 0,
    vehicleCounts: {
      moving: 0,
      charging: 0,
      stopped: 0,
      parked: 0,
      idle: 0,
    },
    saturatedHubs: 0,
    averageSoC: 0,
  });

  /**
   * Callback per aggiornamento dati da WebSocket
   * Muta le istanze nel registry, poi pubblica nuovi snapshot
   */
  const updateMonitoringData = useCallback((wsVehicles, wsHubs) => {

    if (!registryReadyRef.current) {
      console.warn("[SimulationContext] WS ricevuto ma registry non pronto");
      return;
    }

    // Aggiorna le istanze Vehicle nel registry
    vehiclesRef.current.forEach(vehicle => {
      const wsV = wsVehicles.find(w => w.id === vehicle.id);
      if (wsV) {
        vehicle.updateFromWebSocket(wsV);
      }
    });

    // Aggiorna le istanze Hub nel registry
    hubsRef.current.forEach(hub => {
      const wsH = wsHubs.find(w => w.id === hub.id);
      if (wsH) {
        hub.updateFromWebSocket(wsH);
      }
    });

    // Pubblica nuovi snapshot (plain objects) per React
    const vehiclesSnapshot = vehiclesRef.current.map(v => v.toJSON());
    const hubsSnapshot = hubsRef.current.map(h => h.toJSON());

    setVehicles(vehiclesSnapshot);
    setHubs(hubsSnapshot);

    // Calcola e pubblica stats aggiornate
    const stats = computeSimulationStats(vehiclesSnapshot, hubsSnapshot);
    setSimulationStats(stats);

    console.log("[SimulationContext] WS update - snapshot pubblicati");
    console.log("Veicoli:", vehiclesSnapshot);
    console.log("Hubs:", hubsSnapshot);
  }, []);

  // WebSocket
  const { connect, disconnect, connected: wsConnected } = useSimulationWebSocket(updateMonitoringData);

  /**
   * Calcola le statistiche della simulazione dai plain objects
   */
  const computeSimulationStats = (vehiclesData, hubsData) => {
    const totalVehicles = vehiclesData.length;
    
    const vehiclesCharging = vehiclesData.filter(
      v => (v.state || '').toLowerCase() === 'charging'
    ).length;

    const vehiclesMoving = vehiclesData.filter(
      v => (v.state || '').toLowerCase() === 'moving'
    ).length;

    const vehiclesIdle = vehiclesData.filter(
      v => (v.state || '').toLowerCase() === 'idle'
    ).length;

    const vehiclesStopped = vehiclesData.filter(
      v => (v.state || '').toLowerCase() === 'stopped'
    ).length;

    const vehiclesParked = vehiclesData.filter(
      v => (v.state || '').toLowerCase() === 'parked'
    ).length;

    const saturatedHubs = hubsData.filter(h => h.isSaturated).length;
    const averageSoC = totalVehicles > 0
      ? vehiclesData.reduce((sum, v) => sum + v.soc, 0) / totalVehicles
      : 0;

    return {
      totalVehicles,
      vehicleCounts: {
        moving:   vehiclesMoving,
        parked:   vehiclesParked,
        charging: vehiclesCharging,
        idle:     vehiclesIdle,
        stopped:  vehiclesStopped,
      },
      saturatedHubs,
      averageSoC: Math.round(averageSoC),
    };
  };

  /**
   * Start simulazione: fetch API, crea istanze, pubblica snapshot
   */
  const startSimulation = useCallback(async () => {
    setIsSimulationRunning(true);
    try {
      // Fetch dati da API (ritorna istanze Vehicle/Hub)
      const { vehicles: vehicleInstances, hubs: hubInstances } = await fetchSimulationData();

      // Salva istanze nel registry (fonte di verità)
      vehiclesRef.current = vehicleInstances;
      hubsRef.current = hubInstances;
      registryReadyRef.current = true;


      // Pubblica snapshot plain objects per React
      const vehiclesSnapshot = vehicleInstances.map(v => v.toJSON());
      const hubsSnapshot = hubInstances.map(h => h.toJSON());

      setVehicles(vehiclesSnapshot);
      setHubs(hubsSnapshot);

      // Calcola stats iniziali
      const stats = computeSimulationStats(vehiclesSnapshot, hubsSnapshot);
      setSimulationStats(stats);

      console.log("[SimulationContext] Init completato - snapshot pubblicati");
      console.log("Veicoli:", vehiclesSnapshot);
      console.log("Hubs:", hubsSnapshot);

      // Collegamento WS
      connect();
    } catch (e) {
      console.error("[SimulationContext] Errore fetch dati iniziali:", e);
      setIsSimulationRunning(false);
    }
  }, [connect]);

  /**
   * Stop simulazione: chiudi WS, svuota registry e state
   */
  const stopSimulation = useCallback(() => {
    disconnect();
    setIsSimulationRunning(false);

    // Svuota registry
    vehiclesRef.current = [];
    hubsRef.current = [];
    registryReadyRef.current = false;

    // Svuota state React
    setVehicles([]);
    setHubs([]);
    setSimulationStats({
      totalVehicles: 0,
      vehicleCounts: {
        moving:   0,
        charging: 0,
        idle:     0,
        stopped:  0,
      },
      saturatedHubs: 0,
      averageSoC: 0,
    });
  }, [disconnect]);


  const isSetupComplete = useCallback(() => {
    return true;
  }, []);

  // === INTERFACCIA ESPOSTA AI COMPONENTI ===
  const value = {
    // Stato
    isSimulationRunning,
    wsConnected,
    simulationStats,
    isSetupComplete,

    // Dati (plain objects, mai istanze di classe)
    vehicles,
    hubs,

    // Azioni
    startSimulation,
    stopSimulation,
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used within SimulationProvider");
  return ctx;
};

export default SimulationContext;
