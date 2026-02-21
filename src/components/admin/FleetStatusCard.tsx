"use client";

import { Bus, MapPin, AlertTriangle } from "lucide-react";
import type { FleetVehicleStatus } from "@/types/admin";

const ROUTE_VARIANT_LABELS: Record<string, string> = {
  express: "Express",
  basketball: "Basketball",
  football: "Football",
  "baity-hill": "Baity Hill",
  other: "Other",
};

interface FleetStatusCardProps {
  status: FleetVehicleStatus;
}

export default function FleetStatusCard({ status }: FleetStatusCardProps) {
  const capacityPct = status.capacityMax
    ? Math.round((status.capacityCurrent / status.capacityMax) * 100)
    : 0;
  const isNearCapacity = capacityPct >= 85;
  const isAtCapacity = capacityPct >= 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[var(--p2p-light-blue)]">
              <Bus size={20} className="text-[var(--p2p-primary-blue)]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Bus {status.vehicleId.replace("v", "")}
              </p>
              <p className="text-sm text-gray-500">
                {status.routeName} · {ROUTE_VARIANT_LABELS[status.routeVariant] ?? status.routeVariant}
              </p>
            </div>
          </div>
          {!status.onRoute && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-medium">
              <MapPin size={14} />
              Off route
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Capacity</span>
            <span
              className={
                isAtCapacity
                  ? "text-red-600 font-semibold"
                  : isNearCapacity
                    ? "text-amber-600 font-medium"
                    : "text-gray-700"
              }
            >
              {status.capacityCurrent} / {status.capacityMax}
            </span>
          </div>
          <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isAtCapacity
                  ? "bg-red-500"
                  : isNearCapacity
                    ? "bg-amber-500"
                    : "bg-[var(--p2p-primary-blue)]"
              }`}
              style={{ width: `${Math.min(capacityPct, 100)}%` }}
            />
          </div>
          {isNearCapacity && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-700">
              <AlertTriangle size={12} />
              {isAtCapacity ? "At capacity" : "Near capacity"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
