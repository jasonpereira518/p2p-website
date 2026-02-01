# P2P Live

A responsive, mobile-first web app for UNC Chapel Hill late-night transportation (P2P). Shows real-time bus positions, closest stop with walk time, and next bus arrivals.

## Tech Stack

- **Next.js 14** (App Router) + **React** + **TypeScript** + **Tailwind CSS**
- **Leaflet** + **OpenStreetMap** for the map (no API keys required)
- **lucide-react** for icons

## Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Features

- **List view**: Closest stop card with walk time, next bus arriving, and active buses list
- **Map view**: Stops and buses on an interactive map; select a stop to see walk time
- **Bus detail sheet**: Shared panel from both List and Map with route info, next stops, and walk times
- **Geolocation**: Uses browser location (with UNC fallback if denied)
- **Color palette**: P2P branding (blue #418FC5, red #C33934, light blue #B4D4E9, light red #ECBCBA)

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BottomNav.tsx
│   ├── BusDetailSheet.tsx
│   ├── BusList.tsx
│   ├── BusRow.tsx
│   ├── ClosestStopCard.tsx
│   └── MapView.tsx
├── data/
│   └── mockTransit.ts     # Mock stops, routes, vehicles
├── types/
│   └── transit.ts
└── utils/
    └── geo.ts             # haversine, nearestStop, walkTimeMinutes
```

## Switching to Real Data

Mock data lives in `src/data/mockTransit.ts`. To integrate real-time data:

1. Replace imports from `mockTransit` with API/GTFS-RT fetches
2. Ensure your data matches the types in `src/types/transit.ts`:
   - `Stop`: `{ id, name, lat, lon }`
   - `Vehicle`: `{ id, routeId, routeName, lat, lon, heading, nextStopId, nextStopEtaMin, upcomingStops }`
3. Add polling or WebSocket updates for live vehicle positions

## Color Palette (CSS Variables)

| Variable | Value   | Use                    |
|----------|---------|------------------------|
| `--p2p-primary-blue` | #418FC5 | Primary, active states |
| `--p2p-primary-red`  | #C33934 | Alerts, highlights    |
| `--p2p-light-blue`   | #B4D4E9 | Chips, subtle bg      |
| `--p2p-light-red`    | #ECBCBA | Alert backgrounds     |
