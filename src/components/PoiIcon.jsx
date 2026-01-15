import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { POI_TYPES } from './poiRegistry';

export const createCustomIcon = (type) => {
  // Recupera la configurazione dal registro centrale
  const config = POI_TYPES[type] || POI_TYPES.hub; // Fallback su hub se il tipo è ignoto

  const iconMarkup = renderToStaticMarkup(
    <div className="marker-pin-wrapper" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '40px',
      height: '40px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      border: '2px solid #333',
      color: config.color,
      fontSize: '24px',
      boxShadow: '0px 3px 6px rgba(0,0,0,0.3)',
      position: 'relative' // Necessario per posizionare la punta
    }}>
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