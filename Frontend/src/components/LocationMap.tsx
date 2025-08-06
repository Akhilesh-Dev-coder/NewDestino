import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: import("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: import("leaflet/dist/images/marker-icon.png"),
  shadowUrl: import("leaflet/dist/images/marker-shadow.png"),
});

interface LocationMapProps {
  coords: [number, number];
  label: string;
}

const LocationMap = ({ coords, label }: LocationMapProps) => {
  return (
    <div className="h-64 rounded overflow-hidden shadow">
      <MapContainer
        center={coords}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        {...({} as any)}
      >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors' 
            {...({} as any)}
        />
        <Marker position={coords}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;
