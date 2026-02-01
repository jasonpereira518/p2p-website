"use client";

import { X } from "lucide-react";
import type { Vehicle, Stop } from "@/types/transit";

interface BusDetailSheetProps {
  vehicle: Vehicle;
  stops: Stop[];
  walkToClosestStopMin: number;
  walkToNextStopMin?: number;
  onClose: () => void;
}

export default function BusDetailSheet({
  vehicle,
  stops,
  walkToClosestStopMin,
  walkToNextStopMin,
  onClose,
}: BusDetailSheetProps) {
  const nextStop = stops.find((s) => s.id === vehicle.nextStopId);
  const nextStops = vehicle.upcomingStops.slice(0, 6).map((us) => ({
    stop: stops.find((s) => s.id === us.stopId),
    etaMin: us.etaMin,
  }));

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up"
      role="dialog"
      aria-label="Bus details"
    >
      <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
        <h2 className="text-lg font-semibold text-gray-900">
          {vehicle.routeName} • Bus {vehicle.id}
        </h2>
        <button
          onClick={onClose}
          className="p-2 -m-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p2p-primary-blue)]"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
        {/* Next stop */}
        <div className="p-4 rounded-xl bg-[var(--p2p-light-blue)]">
          <p className="text-sm text-gray-600">Next stop</p>
          <p className="font-semibold text-gray-900">
            {nextStop?.name ?? "—"}
          </p>
          <p className="text-sm text-[var(--p2p-primary-blue)] font-medium">
            Arrives in {vehicle.nextStopEtaMin} min
          </p>
        </div>

        {/* Next stops list */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Next stops
          </h3>
          <ul className="space-y-2">
            {nextStops.map(({ stop, etaMin }) => (
              <li
                key={stop?.id ?? etaMin}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-900">{stop?.name ?? "—"}</span>
                <span className="text-sm text-gray-600">{etaMin} min</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Your walk */}
        <div className="p-4 rounded-xl bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Your walk
          </h3>
          <p className="text-gray-800">
            Walk to closest stop: {walkToClosestStopMin} min
          </p>
          {walkToNextStopMin !== undefined && (
            <p className="text-gray-800 mt-1">
              Walk to bus&apos;s next stop: {walkToNextStopMin} min
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
