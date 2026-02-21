"use client";

import { Users, Clock } from "lucide-react";
import type { DriverSession } from "@/types/admin";

function formatDuration(loginAt: string, loggedOutAt?: string): string {
  const start = new Date(loginAt).getTime();
  const end = loggedOutAt ? new Date(loggedOutAt).getTime() : Date.now();
  const min = Math.floor((end - start) / 60000);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

interface WhosDrivingCardProps {
  sessions: DriverSession[];
}

export default function WhosDrivingCard({ sessions }: WhosDrivingCardProps) {
  const active = sessions.filter((s) => !s.loggedOutAt);
  const recent = sessions.filter((s) => s.loggedOutAt).slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-blue-100">
          <Users size={20} className="text-blue-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Who&apos;s driving</h3>
          <p className="text-sm text-gray-500">Driver login sessions by bus</p>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {active.length === 0 && recent.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No driver sessions
          </div>
        ) : (
          <>
            {active.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50"
              >
                <div>
                  <p className="font-medium text-gray-900">{s.driverName}</p>
                  <p className="text-sm text-gray-500">
                    {s.vehicleLabel} · {s.routeName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                    Active
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    {formatDuration(s.loginAt)}
                  </span>
                </div>
              </div>
            ))}
            {recent.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 opacity-75"
              >
                <div>
                  <p className="font-medium text-gray-700">{s.driverName}</p>
                  <p className="text-sm text-gray-500">
                    {s.vehicleLabel} · {s.routeName}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDuration(s.loginAt, s.loggedOutAt)} (ended)
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
