import { SERVICE_TYPES } from '../utils/overpass';

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function ServiceList({ results, activeFilter, onSelect }) {
  const filtered =
    activeFilter === 'all'
      ? results
      : results.filter((r) => r.category === activeFilter);

  if (filtered.length === 0) {
    return (
      <p className="empty-state">
        No results in range yet. Try widening the search radius.
      </p>
    );
  }

  return (
    <ul className="service-list">
      {filtered.map((place) => (
        <li
          key={place.id}
          className="service-card"
          onClick={() => onSelect?.(place)}
        >
          <span
            className="category-dot"
            style={{ background: SERVICE_TYPES[place.category].color }}
          />
          <div className="service-info">
            <div className="service-name">{place.name}</div>
            <div className="service-meta">
              {SERVICE_TYPES[place.category].label}
              {place.address ? ` · ${place.address}` : ''}
            </div>
            {place.openingHours ? (
              <div className="service-hours">{place.openingHours}</div>
            ) : null}
          </div>
          <div className="service-distance">
            {formatDistance(place.distance)}
          </div>
          <a
            className="directions-link"
            href={`https://www.openstreetmap.org/directions?to=${place.lat}%2C${place.lng}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Directions
          </a>
        </li>
      ))}
    </ul>
  );
}
