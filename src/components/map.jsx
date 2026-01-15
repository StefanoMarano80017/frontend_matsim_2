import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { createCustomIcon } from './PoiIcon';
import 'leaflet/dist/leaflet.css';
import { POI_TYPES } from './poiRegistry';

const MapView = ({ pois }) => {
  return (
    <MapContainer center={[52.52, 13.40]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
      
      {pois.map((poi) => {
        const config = POI_TYPES[poi.type] || POI_TYPES.infrastructure;
        
        return (
          <Marker 
            key={poi.id} 
            position={poi.pos} 
            icon={createCustomIcon(poi.type)} 
          >
            <Popup>
              {config.renderPopup(poi)}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;