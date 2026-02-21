"use client";

import { AlertCircle, MapPin, Wifi, Snowflake, ShieldOff, MessageSquare } from "lucide-react";
import type { Complaint } from "@/types/admin";

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; bg: string; text: string }
> = {
  tracker_stopped: {
    label: "Tracker stopped",
    icon: MapPin,
    bg: "bg-amber-100",
    text: "text-amber-800",
  },
  gps_out: {
    label: "GPS out",
    icon: Wifi,
    bg: "bg-red-100",
    text: "text-red-800",
  },
  bus_freeze: {
    label: "Bus freeze",
    icon: Snowflake,
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  no_backup: {
    label: "No backup",
    icon: ShieldOff,
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  other: {
    label: "Other",
    icon: MessageSquare,
    bg: "bg-gray-100",
    text: "text-gray-800",
  },
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-800",
  dismissed: "bg-gray-100 text-gray-600",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffM / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString();
}

interface ComplaintsListProps {
  complaints: Complaint[];
}

export default function ComplaintsList({ complaints }: ComplaintsListProps) {
  const sorted = [...complaints].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-red-100">
          <AlertCircle size={20} className="text-red-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Complaints &amp; issues</h3>
          <p className="text-sm text-gray-500">
            Tracker, GPS, backup, and driver feedback
          </p>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {sorted.length === 0 ? (
          <li className="p-6 text-center text-gray-500 text-sm">
            No complaints
          </li>
        ) : (
          sorted.map((c) => {
            const typeConfig = TYPE_CONFIG[c.type] ?? TYPE_CONFIG.other;
            const Icon = typeConfig.icon;
            return (
              <li key={c.id} className="p-4 hover:bg-gray-50/50">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}
                    >
                      <Icon size={14} />
                      {typeConfig.label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLE[c.status]}`}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                    {(c.vehicleLabel || c.driverName) && (
                      <span className="text-xs text-gray-500">
                        {[c.vehicleLabel, c.driverName].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(c.reportedAt)}</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{c.description}</p>
                {c.notes && (
                  <p className="mt-1.5 text-xs text-gray-500 border-l-2 border-gray-200 pl-2">
                    Note: {c.notes}
                  </p>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
