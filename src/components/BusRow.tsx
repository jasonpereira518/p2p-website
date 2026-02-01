"use client";

import { ChevronRight } from "lucide-react";
import type { Vehicle, Stop } from "@/types/transit";

interface BusRowProps {
  vehicle: Vehicle;
  nextStop: Stop | undefined;
  onClick: () => void;
}

export default function BusRow({ vehicle, nextStop, onClick }: BusRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p2p-primary-blue)] focus-visible:ring-offset-2"
    >
      <div>
        <p className="font-semibold text-gray-900">{vehicle.routeName}</p>
        <p className="text-sm text-gray-600">{nextStop?.name ?? "—"}</p>
        <p className="text-sm text-[var(--p2p-primary-blue)] font-medium mt-1">
          Next stop in {vehicle.nextStopEtaMin} min
        </p>
      </div>
      <ChevronRight size={24} className="text-gray-400 flex-shrink-0" />
    </button>
  );
}
