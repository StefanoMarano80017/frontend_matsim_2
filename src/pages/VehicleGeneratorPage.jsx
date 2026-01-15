import React, { useState, useRef } from 'react'
import { Form, theme } from 'antd'
import MapComponent from '../components/MapComponent'
import SettingsPanel from '../components/SettingsPanel'
import { CarOutlined } from '@ant-design/icons'

// Questa importazione è necessaria per accedere all'istanza L.Draw
import L from 'leaflet'

// --- DATI E VARIABILI GLOBALI ---
const MASTER_POOL = [
  {
    id: 1,
    name: 'Tesla Model 3',
    range: 500, // Usato per l'ordinamento
    batteryCapacity: 75, // Usato per l'ordinamento
    type: 'Sedan',
  },
  {
    id: 2,
    name: 'Renault Zoe',
    range: 300,
    batteryCapacity: 52,
    type: 'Compact',
  },
  {
    id: 3,
    name: 'Fiat 500e',
    range: 250,
    batteryCapacity: 42,
    type: 'Compact',
  },
  // Aggiungi più dati per testare
]

const INITIAL_BBOXES = [
  {
    id: 101,
    name: 'Centro Storico',
    type: 'square',
    color: '#1890ff',
    bounds: [
      [40.85, 14.25],
      [40.86, 14.28],
    ],
  },
]

export let CURRENT_BBOX_ID = 103
export const INITIAL_CENTER = [52.518651813848905, 13.40238344255873]

const VehicleGeneratorPage = () => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()

  // Riferimento per accedere all'istanza Leaflet Draw Control
  const drawControlRef = useRef(null)

  // --- STATI PRINCIPALI ---
  const [currentView, setCurrentView] = useState('settings')
  const [vehicleCount, setVehicleCount] = useState(100)
  const [distType, setDistType] = useState('linear')
  const [generationMethod, setGenerationMethod] = useState('random')
  const [randomRadius, setRandomRadius] = useState(5)
  const [bboxes, setBboxes] = useState(INITIAL_BBOXES)

  // 🟢 STATO DEI VEICOLI SELEZIONATI (inizializza con tutti gli ID)
  const [selectedIds, setSelectedIds] = useState(MASTER_POOL.map((v) => v.id))

  // --- LOGICA DI RESET E CALLBACK ---
  const handleGenerationMethodChange = (value) => {
    if (value !== generationMethod) {
      if (value === 'bbox') {
        setBboxes([])
        CURRENT_BBOX_ID = 103
      } else if (value === 'random') {
        setRandomRadius(5)
      }
    }
    setGenerationMethod(value)
  }

  const deleteBBox = (id) => {
    if (id === null) {
      setBboxes([])
    } else {
      setBboxes((prev) => prev.filter((box) => box.id !== id))
    }
  }

  const addBBox = (newBBox) => {
    setBboxes((prev) => [...prev, newBBox])
  }

  const startRectangleDraw = () => {
    if (generationMethod !== 'bbox') {
      alert("Passa prima alla modalità 'Bounding Box' per disegnare.")
      return
    }
    // Logica di avvio del disegno... (omessa per brevità, era già corretta)
    const drawControl = drawControlRef.current
    if (drawControl && drawControl.leafletElement) {
      const rectangleHandler = drawControl.leafletElement.handlers.find(
        (handler) => handler.type === 'rectangle'
      )
      if (rectangleHandler && rectangleHandler.handler) {
        rectangleHandler.handler.enable()
      } else {
        console.error(
          "Handler per 'rectangle' non trovato. Verifica le drawOptions."
        )
      }
    }
  }

  // 🟢 HANDLER 1: Gestione della selezione singola (risolve l'errore)
  const handleSelectionChange = (id, checked) => {
    setSelectedIds((prev) => {
      if (checked) {
        // Aggiungi l'ID se selezionato
        return [...prev, id]
      } else {
        // Rimuovi l'ID se deselezionato
        return prev.filter((vehicleId) => vehicleId !== id)
      }
    })
  }

  // 🟢 HANDLER 2: Seleziona/Deseleziona tutti
  const handleToggleAll = () => {
    const allSelected = selectedIds.length === MASTER_POOL.length
    if (allSelected) {
      setSelectedIds([]) // Deseleziona tutto
    } else {
      setSelectedIds(MASTER_POOL.map((v) => v.id)) // Seleziona tutto
    }
  }

  // --- STILI LAYOUT (omessi per brevità, sono invariati) ---
  const customScrollbarStyle = `
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: ${token.colorTextTertiary}; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: ${token.colorTextSecondary}; }
    `

  const panelStyle = {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 420,
    height: 'calc(100vh - 40px)',
    backgroundColor: token.colorBgContainer,
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: `1px solid ${token.colorBorderSecondary}`,
  }

  const poiList = [
    {
      id: 1,
      name: "Hub Ricarica Centrale",
      address: "Via bho 123, Napoli",
      coords: [40.85687601045936, 14.28275103980682], 
      stations: [
        { id: 1, name: "Colonnina 1", soc: 80, available: true },
        { id: 2, name: "Colonnina 2", soc: 40, available: false },
        { id: 3, name: "Colonnina 3", soc: 60, available: true },
        { id: 4, name: "Colonnina 4", soc: 20, available: false },
      ],
    },
    {
      id: 2,
      name: "Hub Ricarica 2",
      address: "Via BHO 45, napoli",
      coords: [40.82447358829163, 14.193259468008508],
      stations: [
        { id: 1, name: "Colonnina A", soc: 90, available: true },
        { id: 2, name: "Colonnina B", soc: 10, available: false },
      ],
    },
    {
      id: 2,
      name: "Hub Ricarica 3",
      address: "Via BHO 45, napoli",
      coords: [40.85094333274677, 14.227506763765279],
      stations: [
        { id: 1, name: "Colonnina A", soc: 90, available: true },
        { id: 2, name: "Colonnina B", soc: 10, available: false },
      ],
    },
  ];





  return (
    <>
      <style>{customScrollbarStyle}</style>

      <div
        style={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        {/* Componente Mappa */}
        <MapComponent
          generationMethod={generationMethod}
          randomRadius={randomRadius}
          bboxes={bboxes}
          setBboxes={addBBox}
          drawControlRef={drawControlRef}
          poiList={poiList}
        />

        {/* Componente Pannello Impostazioni */}
        <div style={panelStyle}>
          <SettingsPanel
            token={token}
            form={form}
            currentView={currentView}
            setCurrentView={setCurrentView}
            generationMethod={generationMethod}
            handleGenerationMethodChange={handleGenerationMethodChange}
            randomRadius={randomRadius}
            setRandomRadius={setRandomRadius}
            bboxes={bboxes}
            deleteBBox={deleteBBox}
            vehicleCount={vehicleCount}
            setVehicleCount={setVehicleCount}
            distType={distType}
            setDistType={setDistType}
            masterPool={MASTER_POOL}
            selectedIds={selectedIds}
            startRectangleDraw={startRectangleDraw}
            handleSelectionChange={handleSelectionChange}
            handleToggleAll={handleToggleAll}
          />
        </div>
      </div>
    </>
  )
}

export default VehicleGeneratorPage
