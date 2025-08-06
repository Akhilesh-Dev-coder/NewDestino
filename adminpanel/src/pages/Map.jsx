// MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const ChangeView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, 13);
  return null;
};

const Map = ({ coords, locationName }) => {
  return (
    <MapContainer center={coords} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords}>
        <Popup>{locationName || 'Selected Location'}</Popup>
      </Marker>
      <ChangeView coords={coords} />
    </MapContainer>
  );
};

export default Map;
