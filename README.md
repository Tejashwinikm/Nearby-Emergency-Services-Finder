# Nearby Emergency Services Finder

Finds the closest hospitals, pharmacies, and police stations using your
browser's location and free OpenStreetMap data (via the Overpass API).

## Stack
- **React + Vite**
- **react-leaflet** / **Leaflet** for the map (OSM tiles, no API key)
- **Overpass API** for the actual place data (no API key)
- **Browser Geolocation API** for the user's coordinates

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. Geolocation requires HTTPS in production
(localhost is exempt during development).

## How it works
1. `useGeolocation` (src/hooks) wraps `navigator.geolocation.getCurrentPosition`.
2. Once coordinates are known, `fetchNearbyServices` (src/utils/overpass.js)
   sends an Overpass QL query for `amenity=hospital|pharmacy|police` within
   a radius, tries a couple of public Overpass mirrors in case one is
   rate-limited, and returns results sorted by straight-line distance.
3. `EmergencyMap` renders markers on a Leaflet map; `ServiceList` renders the
   same results as a sortable, filterable list with a "Directions" link to
   OpenStreetMap routing.

## Things worth doing next
- **Cache/proxy Overpass calls** through a small backend if you expect real
  traffic — public Overpass instances rate-limit aggressively.
- **Swap in Geoapify Places API** if you want higher reliability/quotas than
  the public Overpass mirrors (needs a free API key).
- **Add real routing distance** (not just straight-line) via OSRM or
  Geoapify Routing.
- **"Open now" filtering** using the `opening_hours` tag (needs a parser
  library like `opening_hours.js` since the OSM format is a small DSL).
- **Offline fallback** — cache the last successful result set in
  localStorage so the app still shows something with no connection.

## Notes on reliability
This is a crisis-adjacent tool, so a few deliberate choices:
- Falls back across two Overpass endpoints before failing.
- Geolocation errors are surfaced with specific, actionable messages
  (permission denied vs. timeout vs. unsupported).
- The list is usable even if the map fails to load.
