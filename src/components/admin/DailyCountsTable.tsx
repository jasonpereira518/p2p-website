"use client";

import { useState } from "react";
import { BarChart3, ChevronDown } from "lucide-react";
import type { DailyBusCount } from "@/types/admin";

interface DailyCountsTableProps {
  counts: DailyBusCount[];
}

export default function DailyCountsTable({ counts }: DailyCountsTableProps) {
  const dates = Array.from(
    new Set(counts.map((c) => c.date).sort().reverse())
  ).slice(0, 7);
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? "");

  const filtered = counts.filter((c) => c.date === selectedDate);
  const displayDate = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select date";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100">
            <BarChart3 size={20} className="text-emerald-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Counts per bus per day</h3>
            <p className="text-sm text-gray-500">Boardings, alightings, and trip counts</p>
          </div>
        </div>
        <div className="relative">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--p2p-primary-blue)] focus:border-transparent"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {new Date(d + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Bus
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Route
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Boardings
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Alightings
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Trips
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No data for this date
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={`${row.vehicleId}-${row.date}`}
                  className="border-b border-gray-100 hover:bg-gray-50/50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {row.vehicleLabel}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{row.routeName}</td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {row.boardings}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {row.alightings}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[var(--p2p-primary-blue)]">
                    {row.totalTrips}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
        {displayDate}
      </div>
    </div>
  );
}
