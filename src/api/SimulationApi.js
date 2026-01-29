/**
 * Utility per caricare dati completi di simulazione prima della WS
 * Endpoint:
 *  - /api/fleet -> veicoli
 *  - /api/hub -> hubs
 */

import { Vehicle, createVehicleFromAPI } from "../models/Vehicle";
import { Hub, createHubFromAPI } from "../models/Hub";

export async function fetchSimulationData() {
  try {
    const fleetResp = await fetch("http://localhost:8080/api/fleet");
    if (!fleetResp.ok) throw new Error(`Fleet fetch failed: ${fleetResp.status}`);
    const fleetJson = await fleetResp.json();

    const hubsResp = await fetch("http://localhost:8080/api/hub");
    if (!hubsResp.ok) throw new Error(`Hub fetch failed: ${hubsResp.status}`);
    const hubsJson = await hubsResp.json();

    // Usa i factory per creare istanze dei modelli
    const vehicles = (fleetJson?.data?.vehicles || []).map(createVehicleFromAPI);
    const hubs = (hubsJson?.data?.hubs || []).map(createHubFromAPI);

    console.log("[SimulationApi] Veicoli creati:", vehicles);
    console.log("[SimulationApi] Hubs creati:", hubs);

    return { vehicles, hubs };
  } catch (e) {
    console.error("[SimulationApi] Error fetching data:", e);
    return { vehicles: [], hubs: [] };
  }
}
