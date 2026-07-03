import { useEffect, useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchNearbyServices, SERVICE_TYPES } from './utils/overpass';
import EmergencyMap from './components/EmergencyMap';
import ServiceList from './components/ServiceList';

const RADIUS_OPTIONS = [2000, 5000, 10000];

export default function App() {
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();
  const [results, setResults] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('idle'); // idle | loading | success | error
  const [fetchError, setFetchError] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;
    setFetchStatus('loading');
    setFetchError(null);

    fetchNearbyServices({ lat: coords.lat, lng: coords.lng, radiusMeters: radius })
      .then((data) => {
        if (cancelled) return;
        setResults(data);
        setFetchStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setFetchError(err.message || 'Could not load nearby services.');
        setFetchStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [coords, radius]);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Nearby Emergency Services</h1>
          <p className="subtitle">
            Hospitals, pharmacies, and police stations closest to you right now.
          </p>
        </div>
        <button className="locate-btn" onClick={locate} disabled={geoStatus === 'locating'}>
          {geoStatus === 'locating' ? 'Locating…' : 'Find near me'}
        </button>
      </header>

      {geoStatus === 'error' && (
        <div className="banner banner-error">{geoError}</div>
      )}
      {fetchStatus === 'error' && (
        <div className="banner banner-error">{fetchError}</div>
      )}

      {coords && (
        <div className="controls">
          <div className="filter-group">
            <button
              className={filter === 'all' ? 'chip active' : 'chip'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {Object.entries(SERVICE_TYPES).map(([key, { label, color }]) => (
              <button
                key={key}
                className={filter === key ? 'chip active' : 'chip'}
                style={filter === key ? { background: color, borderColor: color } : {}}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="radius-group">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                className={radius === r ? 'chip active' : 'chip'}
                onClick={() => setRadius(r)}
              >
                {r / 1000} km
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="content">
        <div className="map-pane">
          {coords ? (
            <EmergencyMap userLocation={coords} results={results} radiusMeters={radius} />
          ) : (
            <div className="map-placeholder">
              <p>
                Tap <strong>Find near me</strong> to see hospitals, pharmacies, and
                police stations around your current location.
              </p>
            </div>
          )}
        </div>

        <div className="list-pane">
          {fetchStatus === 'loading' && <p className="empty-state">Searching nearby…</p>}
          {coords && fetchStatus !== 'loading' && (
            <ServiceList results={results} activeFilter={filter} />
          )}
        </div>
      </main>
    </div>
  );
}
