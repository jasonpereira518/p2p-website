"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";
import type { Vehicle, Stop } from "@/types/transit";
import { haversineDistance, walkTimeMinutes } from "@/utils/geo";

// UNC Chapel Hill campus center (between Bell Tower and Student Union)
const CHAPEL_HILL_CENTER = { lat: 35.908, lon: -79.049 };

interface MapViewProps {
  stops: Stop[];
  vehicles: Vehicle[];
  userLocation: { lat: number; lon: number };
  selectedStopId: string | null;
  closestStop: Stop | null;
  walkToClosestMin: number;
  onStopSelect: (stopId: string | null) => void;
  onBusClick: (vehicle: Vehicle) => void;
}

function RecenterControl({
  userLocation,
}: {
  userLocation: { lat: number; lon: number };
}) {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView([userLocation.lat, userLocation.lon], 16)}
      className="absolute bottom-24 right-4 z-[1000] p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p2p-primary-blue)]"
      aria-label="Recenter on my location"
    >
      <Navigation size={24} className="text-[var(--p2p-primary-blue)]" />
    </button>
  );
}

export default function MapView({
  stops,
  vehicles,
  userLocation,
  selectedStopId,
  closestStop,
  walkToClosestMin,
  onStopSelect,
  onBusClick,
}: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const busIcon = L.divIcon({
    className: "bus-marker",
    html: `<div style="
      width: 24px; height: 24px;
      background: #418FC5;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const getStopIcon = (selected: boolean) =>
    L.divIcon({
      className: "stop-marker",
      html: `<div style="
        width: 16px; height: 16px;
        background: ${selected ? "#C33934" : "#6b7280"};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        cursor: pointer;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

  const selectedStop = selectedStopId
    ? stops.find((s) => s.id === selectedStopId)
    : null;
  const displayStop = selectedStop ?? closestStop;
  const walkMin =
    displayStop && userLocation
      ? selectedStop
        ? walkTimeMinutes(
            haversineDistance(
              userLocation.lat,
              userLocation.lon,
              selectedStop.lat,
              selectedStop.lon
            )
          )
        : walkToClosestMin
      : null;

  if (!mounted) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-gray-200 animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading map…</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <MapContainer
        center={[CHAPEL_HILL_CENTER.lat, CHAPEL_HILL_CENTER.lon]}
        zoom={14}
        className="h-full w-full rounded-xl z-0"
        style={{ minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lon]}
            icon={getStopIcon(stop.id === selectedStopId)}
            eventHandlers={{
              click: () =>
                onStopSelect(stop.id === selectedStopId ? null : stop.id),
            }}
          />
        ))}
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lon]}
            icon={busIcon}
            eventHandlers={{ click: () => onBusClick(vehicle) }}
          />
        ))}
        <RecenterControl userLocation={userLocation} />
      </MapContainer>

      {walkMin !== null && displayStop && (
        <div className="absolute top-4 left-4 right-4 z-[1000] p-3 rounded-xl bg-white shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin size={16} className="text-[var(--p2p-primary-blue)]" />
            Walk to {displayStop.name}: {walkMin} min
          </p>
        </div>
      )}

      <div className="absolute bottom-24 left-4 z-[1000] flex gap-2 text-xs bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow border border-gray-200">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-[var(--p2p-primary-blue)]"
            aria-hidden
          />
          Bus
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-500" aria-hidden />
          Stop
        </span>
      </div>
    </div>
  );
}
