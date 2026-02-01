"use client";

import type { Vehicle, Stop } from "@/types/transit";
import BusRow from "./BusRow";
import ClosestStopCard from "./ClosestStopCard";

interface BusListProps {
  closestStop: Stop | null;
  walkToClosestMin: number;
  nextBusAtClosest?: { vehicle: Vehicle; etaMin: number };
  vehicles: Vehicle[];
  stops: Stop[];
  onBusClick: (vehicle: Vehicle) => void;
}

export default function BusList({
  closestStop,
  walkToClosestMin,
  nextBusAtClosest,
  vehicles,
  stops,
  onBusClick,
}: BusListProps) {
  return (
    <div className="space-y-4">
      {closestStop && (
        <ClosestStopCard
          stop={closestStop}
          walkMin={walkToClosestMin}
          nextBus={nextBusAtClosest}
        />
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Active buses
        </h3>
        <ul className="space-y-3" role="list">
          {vehicles.map((vehicle) => {
            const nextStop = stops.find((s) => s.id === vehicle.nextStopId);
            return (
              <li key={vehicle.id}>
                <BusRow
                  vehicle={vehicle}
                  nextStop={nextStop}
                  onClick={() => onBusClick(vehicle)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
