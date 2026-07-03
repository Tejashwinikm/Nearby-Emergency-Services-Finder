import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { SERVICE_TYPES } from '../utils/overpass';

// Leaflet's default marker icons reference image files that don't resolve
// correctly under bundlers like Vite. Build simple colored circle icons
// instead, so we don't depend on external image assets at all.
function dotIcon(color) {
  return L.divIcon({
    className: '',
    html: `<span style="
      display:block;width:16px;height:16px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,0.35);
    "></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const userIcon = L.divIcon({
  className: '',
  html: `<span style="
    display:block;width:18px;height:18px;border-radius:50%;
    background:#2563eb;border:3px solid white;
    box-shadow:0 0 0 4px rgba(37,99,235,0.25);
  "></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function EmergencyMap({ userLocation, results, radiusMeters }) {
  if (!userLocation) return null;

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={radiusMeters}
        pathOptions={{ color: '#2563eb', fillOpacity: 0.04, weight: 1 }}
      />

      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {results.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={dotIcon(SERVICE_TYPES[place.category].color)}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            {SERVICE_TYPES[place.category].label}
            {place.address ? <br /> : null}
            {place.address}
            {place.phone ? (
              <>
                <br />
                {place.phone}
              </>
            ) : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
