import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { POI_TYPES } from './poiRegistry';

export const createCustomIcon = (type, state = null) => {
  // Get base configuration
  const config = POI_TYPES[type] || POI_TYPES.hub;

  // Determine color based on type and state
  let color = config.color;
  let bgColor = '#ffffff';
  let borderColor = '#333';

  if (type === 'vehicle' && state) {
    // Vehicle colors based on state
    switch (state) {
      case 'charging':
        color = '#4caf50'; // Green
        bgColor = '#e8f5e9';
        borderColor = '#4caf50';
        break;
      case 'moving':
        color = '#2196f3'; // Blue
        bgColor = '#e3f2fd';
        borderColor = '#2196f3';
        break;
      case 'idle':
        color = '#ff9800'; // Orange
        bgColor = '#fff3e0';
        borderColor = '#ff9800';
        break;
      default:
        color = config.color;
    }
  } else if (type === 'hub') {
    // Hub always green for charging
    color = '#4caf50';
    bgColor = '#e8f5e9';
    borderColor = '#4caf50';
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