// Public Overpass instances (free, no API key). We fall back through a list
// because the main instance is community-run and sometimes rate-limits or
// times out under load.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

export const SERVICE_TYPES = {
  hospital: { label: 'Hospital', tag: 'amenity=hospital', color: '#c1392b' },
  pharmacy: { label: 'Pharmacy', tag: 'amenity=pharmacy', color: '#1c8a63' },
  police: { label: 'Police', tag: 'amenity=police', color: '#1f5fa8' },
};

/**
 * Builds an Overpass QL query for the given amenity tags within a radius
 * (meters) of a lat/lng point. Uses "around" for a true radius search.
 */
function buildQuery(lat, lng, radiusMeters, tags) {
  const clauses = tags
    .map(
      (tag) =>
        `node[${tag}](around:${radiusMeters},${lat},${lng});way[${tag}](around:${radiusMeters},${lat},${lng});`
    )
    .join('\n      ');

  return `
    [out:json][timeout:25];
    (
      ${clauses}
    );
    out center tags;
  `;
}

// Haversine distance in meters between two lat/lng points.
export function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function normalize(element, origin, category) {
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (lat == null || lng == null) return null;

  const tags = element.tags || {};
  const point = { lat, lng };

  return {
    id: `${element.type}/${element.id}`,
    category,
    name: tags.name || SERVICE_TYPES[category].label,
    lat,
    lng,
    address:
      [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
        .filter(Boolean)
        .join(' ') || null,
    phone: tags.phone || tags['contact:phone'] || null,
    openingHours: tags.opening_hours || null,
    distance: distanceMeters(origin, point),
  };
}

async function queryEndpoint(url, query) {
  const response = await fetch(url, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  if (!response.ok) {
    throw new Error(`Overpass request failed (${response.status})`);
  }
  return response.json();
}

/**
 * Fetches nearby services for one or more categories (keys of SERVICE_TYPES).
 * Tries each Overpass endpoint in turn until one succeeds.
 */
export async function fetchNearbyServices({
  lat,
  lng,
  radiusMeters = 5000,
  categories = Object.keys(SERVICE_TYPES),
}) {
  const tags = categories.map((c) => SERVICE_TYPES[c].tag);
  const query = buildQuery(lat, lng, radiusMeters, tags);
  const origin = { lat, lng };

  let lastError;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const data = await queryEndpoint(endpoint, query);
      const results = (data.elements || [])
        .map((el) => {
          const category = categories.find((c) =>
            Object.entries(el.tags || {}).some(
              ([k, v]) => `${k}=${v}` === SERVICE_TYPES[c].tag
            )
          );
          return category ? normalize(el, origin, category) : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);
      return results;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All Overpass endpoints failed.');
}
