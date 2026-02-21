"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { stops, vehicles } from "@/data/mockTransit";
import {
  nearestStop,
  walkTimeMinutes,
  haversineDistance,
} from "@/utils/geo";
import type { Vehicle, Stop, UserLocation } from "@/types/transit";
import BottomNav from "@/components/BottomNav";
import BusList from "@/components/BusList";
import BusDetailSheet from "@/components/BusDetailSheet";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-xl bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Loading map…</span>
    </div>
  ),
});

const FALLBACK_LOCATION: UserLocation = {
  lat: 35.9085,
  lon: -79.0495,
};

function getNextBusAtClosestStop(
  closestStop: Stop,
  vehicles: Vehicle[]
): { vehicle: Vehicle; etaMin: number } | undefined {
  let best: { vehicle: Vehicle; etaMin: number } | undefined;

  for (const v of vehicles) {
    const upcoming = v.upcomingStops.find((u) => u.stopId === closestStop.id);
    if (upcoming) {
      if (!best || upcoming.etaMin < best.etaMin) {
        best = { vehicle: v, etaMin: upcoming.etaMin };
      }
    }
  }
  return best;
}

export default function Home() {
  const [view, setView] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedBus, setSelectedBus] = useState<Vehicle | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const requestLocation = useCallback(() => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          setLocationLoading(false);
        },
        () => {
          setUserLocation(FALLBACK_LOCATION);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setUserLocation(FALLBACK_LOCATION);
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const loc = userLocation ?? FALLBACK_LOCATION;
  const closest = nearestStop(loc, stops);
  const walkToClosestMin = closest
    ? walkTimeMinutes(closest.distanceM)
    : 0;
  const closestStop = closest?.stop ?? null;
  const nextBusAtClosest = closestStop
    ? getNextBusAtClosestStop(closestStop, vehicles)
    : undefined;

  const walkToBusNextStopMin =
    selectedBus && closestStop
      ? (() => {
          const nextStop = stops.find((s) => s.id === selectedBus.nextStopId);
          if (!nextStop) return undefined;
          const dist = haversineDistance(
            loc.lat,
            loc.lon,
            nextStop.lat,
            nextStop.lon
          );
          return walkTimeMinutes(dist);
        })()
      : undefined;

  return (
    <main className="flex flex-col min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 pt-safe-pt">
        <h1 className="text-xl font-bold text-[var(--p2p-primary-blue)]">
          P2P Live
        </h1>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--p2p-light-blue)] text-[var(--p2p-primary-blue)]">
            Live (Mock)
          </span>
          <a
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Admin login"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {locationLoading ? (
          <div className="p-4 space-y-4 animate-pulse">
            <div className="h-32 rounded-xl bg-gray-200" />
            <div className="h-12 rounded-lg bg-gray-200" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
        ) : view === "list" ? (
          <div className="p-4">
            <BusList
              closestStop={closestStop}
              walkToClosestMin={walkToClosestMin}
              nextBusAtClosest={nextBusAtClosest}
              vehicles={vehicles}
              stops={stops}
              onBusClick={setSelectedBus}
            />
          </div>
        ) : (
          <div className="p-4 pb-0">
            <div className="h-[calc(100vh-12rem)] min-h-[400px]">
              <MapView
                stops={stops}
                vehicles={vehicles}
                userLocation={loc}
                selectedStopId={selectedStopId}
                closestStop={closestStop}
                walkToClosestMin={walkToClosestMin}
                onStopSelect={setSelectedStopId}
                onBusClick={setSelectedBus}
              />
            </div>
          </div>
        )}
      </div>

      <BottomNav activeView={view} onViewChange={setView} />

      {/* Bus Detail Sheet */}
      {selectedBus && (
        <>
          <button
            onClick={() => setSelectedBus(null)}
            className="fixed inset-0 z-[90] bg-black/40"
            aria-label="Close bus details"
          />
          <BusDetailSheet
            vehicle={selectedBus}
            stops={stops}
            walkToClosestStopMin={walkToClosestMin}
            walkToNextStopMin={walkToBusNextStopMin}
            onClose={() => setSelectedBus(null)}
          />
        </>
      )}
    </main>
  );
}
