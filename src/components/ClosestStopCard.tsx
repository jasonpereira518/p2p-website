"use client";

import type { Stop, Vehicle } from "@/types/transit";

interface ClosestStopCardProps {
  stop: Stop;
  walkMin: number;
  nextBus?: {
    vehicle: Vehicle;
    etaMin: number;
  };
}

export default function ClosestStopCard({
  stop,
  walkMin,
  nextBus,
}: ClosestStopCardProps) {
  return (
    <div className="rounded-xl border-2 border-[var(--p2p-primary-blue)] bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-600">Closest stop</p>
      <h3 className="font-semibold text-gray-900 text-lg mt-1">{stop.name}</h3>
      <p className="text-sm text-gray-700 mt-2">
        Walk: {walkMin} min
      </p>
      {nextBus ? (
        <div className="mt-3 p-3 rounded-lg bg-[var(--p2p-light-blue)]">
          <p className="text-sm font-medium text-[var(--p2p-primary-blue)]">
            Next bus arriving
          </p>
          <p className="text-gray-900 font-semibold">{nextBus.vehicle.routeName}</p>
          <p className="text-sm text-gray-700">Arrives in {nextBus.etaMin} min</p>
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-lg bg-gray-100">
          <p className="text-sm text-gray-600">No upcoming buses at this stop</p>
        </div>
      )}
    </div>
  );
}
