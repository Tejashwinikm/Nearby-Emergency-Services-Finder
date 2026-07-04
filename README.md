# Nearby Emergency Services Finder

A responsive React app that finds the nearest hospitals, pharmacies, and police stations in real time using your device's location, powered by the free OpenStreetMap Overpass API. The application features an interactive Leaflet map, distance-sorted results, and category/radius filtering — built to be genuinely useful in a crisis, with no login or API key required.

## 🌐 Live Demo
🔗 https://nearby-emergency-services-finder.vercel.app

## Features

* One-tap geolocation to find your current position
* Real-time nearby hospitals, pharmacies, and police stations
* Interactive map with color-coded markers (Leaflet + OpenStreetMap)
* Distance-sorted results list, nearest first
* Category filters — All / Hospital / Pharmacy / Police
* Adjustable search radius — 2 km / 5 km / 10 km
* One-tap "Directions" link to OpenStreetMap routing
* Graceful error handling for denied/unavailable location and API failures
* Responsive design for desktop and mobile devices

## 🛠️ Tech Stack

* React 18 + Vite
* Leaflet / react-leaflet
* OpenStreetMap Overpass API
* Browser Geolocation API

## 📁 Project Structure

```
emergency-finder/
│── index.html
│── package.json
│── vite.config.js
│── src/
│   │── main.jsx
│   │── App.jsx
│   │── index.css
│   │── hooks/
│   │   └── useGeolocation.js
│   │── utils/
│   │   └── overpass.js
│   └── components/
│       │── EmergencyMap.jsx
│       └── ServiceList.jsx
```

## 🚀 Getting Started

Clone the repository

```
git clone https://github.com/Tejashwinikm/Nearby-Emergency-Services-Finder.git
```

Navigate to the project

```
cd Nearby-Emergency-Services-Finder
```

Install dependencies

```
npm install
```

Run the project

```
npm run dev
```

Then open the local URL printed in the terminal (usually `http://localhost:5173`).
