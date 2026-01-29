import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { POI_TYPES } from './poiRegistry';

export const createCustomIcon = (type, state = null, stateConfig) => {
  // Config di base dal tipo di POI
  const config = POI_TYPES[type] || POI_TYPES.hub;

  // Colore predefinito
  let color = config.color || '#333';
  let bgColor = '#fff';
  let borderColor = '#333';

  // Se è un veicolo, usa STATE_CONFIG
  if (type === 'vehicle' && state) {
    const stateKey = state.toLowerCase();
    const stateCfg = stateConfig[stateKey] || stateConfig.unknown;

    color = stateCfg.color;
    // Sfondo leggermente più chiaro rispetto al colore principale
    borderColor = color;
  }

  // Hub: usa config POI o fallback
  if (type === 'hub') {
    color = config.color || '#4caf50';
    borderColor = color;
  }

  const iconMarkup = renderToStaticMarkup(
    <div
      className="marker-pin-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40px',
        height: '40px',
        backgroundColor: bgColor,
        borderRadius: '50%',
        border: `3px solid ${borderColor}`,
        color: color,
        fontSize: '24px',
        boxShadow: '0px 3px 8px rgba(0,0,0,0.4)',
        position: 'relative',
        fontWeight: 'bold',
      }}
    >
      {config.icon}
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-poi-container',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};
