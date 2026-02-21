"use client";

import { useState, useEffect, useCallback } from "react";
import { getStoredSession } from "@/lib/auth";
import { driverAssignments } from "@/data/mockAdmin";
import type { DriverAssignment } from "@/types/admin";
import { Clock, LogIn, LogOut, FileText, History } from "lucide-react";

const CLOCK_STORAGE_PREFIX = "p2p_driver_clock_";
const NOTES_STORAGE_PREFIX = "p2p_driver_notes_";
const HISTORY_STORAGE_PREFIX = "p2p_driver_clock_history_";

function getClockKey(driverId: string, date: string) {
  return `${CLOCK_STORAGE_PREFIX}${driverId}_${date}`;
}

function getNotesKey(driverId: string, date: string) {
  return `${NOTES_STORAGE_PREFIX}${driverId}_${date}`;
}

function getHistoryKey(driverId: string, date: string) {
  return `${HISTORY_STORAGE_PREFIX}${driverId}_${date}`;
}

interface ClockState {
  clockedInAt: string | null; // ISO
  clockedOutAt: string | null; // ISO
}

export interface ClockHistoryEntry {
  id: string;
  clockedInAt: string;
  clockedOutAt: string;
  durationMinutes: number;
  routePercent: number;
}

function loadClockState(driverId: string, date: string): ClockState {
  if (typeof window === "undefined")
    return { clockedInAt: null, clockedOutAt: null };
  try {
    const raw = localStorage.getItem(getClockKey(driverId, date));
    if (!raw) return { clockedInAt: null, clockedOutAt: null };
    const data = JSON.parse(raw) as ClockState;
    return {
      clockedInAt: data.clockedInAt ?? null,
      clockedOutAt: data.clockedOutAt ?? null,
    };
  } catch {
    return { clockedInAt: null, clockedOutAt: null };
  }
}

function saveClockState(driverId: string, date: string, state: ClockState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getClockKey(driverId, date), JSON.stringify(state));
}

function loadHistory(driverId: string, date: string): ClockHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getHistoryKey(driverId, date));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveHistory(driverId: string, date: string, entries: ClockHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getHistoryKey(driverId, date), JSON.stringify(entries));
}

function loadNotes(driverId: string, date: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(getNotesKey(driverId, date)) ?? "";
}

function saveNotes(driverId: string, date: string, notes: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getNotesKey(driverId, date), notes);
}

/** 12-hour time with seconds (e.g. 9:42:15 AM) — never military/24h */
function formatTimeWithSeconds(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatHistoryDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** MM/DD/YYYY for driver dashboard date display */
function formatDateMMDDYYYY(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${m}/${d}/${y}`;
}

function formatDuration(fromIso: string, toIso?: string): string {
  const from = new Date(fromIso).getTime();
  const to = toIso ? new Date(toIso).getTime() : Date.now();
  const totalSec = Math.floor((to - from) / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

/** Expected shift minutes for the day from assignments (for route % calculation) */
function getExpectedShiftMinutes(driverId: string, date: string): number {
  const assignments = driverAssignments.filter(
    (a) => a.driverId === driverId && a.date === date
  );
  let total = 0;
  for (const a of assignments) {
    const [startH, startM] = a.shiftStart.split(":").map(Number);
    const [endH, endM] = a.shiftEnd.split(":").map(Number);
    total += (endH * 60 + endM) - (startH * 60 + startM);
  }
  return total || 360; // fallback 6h if no assignments
}

export default function DriverDashboardPage() {
  const session = getStoredSession();
  const driverId = session?.id ?? "";
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);

  const assignments = driverAssignments.filter(
    (a) => a.driverId === driverId && a.date === selectedDate
  );

  const [clockState, setClockState] = useState<ClockState>(() =>
    loadClockState(driverId, selectedDate)
  );
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState<ClockHistoryEntry[]>([]);
  const [liveNow, setLiveNow] = useState(() => new Date());

  useEffect(() => {
    setClockState(loadClockState(driverId, selectedDate));
    setNotes(loadNotes(driverId, selectedDate));
    setHistory(loadHistory(driverId, selectedDate));
  }, [driverId, selectedDate]);

  const isClockedIn = !!clockState.clockedInAt && !clockState.clockedOutAt;

  // Live-updating clock when clocked in (tick every second)
  useEffect(() => {
    if (!isClockedIn) return;
    const interval = setInterval(() => setLiveNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const handleClockIn = useCallback(() => {
    const now = new Date().toISOString();
    const next = { clockedInAt: now, clockedOutAt: null };
    setClockState(next);
    saveClockState(driverId, selectedDate, next);
    setLiveNow(new Date());
  }, [driverId, selectedDate]);

  const handleClockOut = useCallback(() => {
    const now = new Date().toISOString();
    if (!clockState.clockedInAt) return;
    const durationMs = new Date(now).getTime() - new Date(clockState.clockedInAt).getTime();
    const durationMinutes = Math.round(durationMs / 60000);
    const expectedMinutes = getExpectedShiftMinutes(driverId, selectedDate);
    const routePercent = expectedMinutes > 0
      ? Math.round((durationMinutes / expectedMinutes) * 100)
      : 0;

    const entry: ClockHistoryEntry = {
      id: `entry_${Date.now()}`,
      clockedInAt: clockState.clockedInAt,
      clockedOutAt: now,
      durationMinutes,
      routePercent,
    };
    const nextHistory = [entry, ...loadHistory(driverId, selectedDate)];
    setHistory(nextHistory);
    saveHistory(driverId, selectedDate, nextHistory);

    setClockState({ clockedInAt: null, clockedOutAt: null });
    saveClockState(driverId, selectedDate, { clockedInAt: null, clockedOutAt: null });
  }, [driverId, selectedDate, clockState.clockedInAt]);

  const handleNotesChange = useCallback(
    (value: string) => {
      setNotes(value);
      saveNotes(driverId, selectedDate, value);
    },
    [driverId, selectedDate]
  );

  return (
    <div className="p-5 lg:p-8 max-w-xl mx-auto space-y-8">
      {/* Date */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date</h2>
        </div>
        <div className="p-5 relative">
          <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base tabular-nums">
            {formatDateMMDDYYYY(selectedDate)}
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Select date"
          />
        </div>
      </section>

      {/* My assignments for the day */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">My assignments for the day</h2>
        </div>
        <div className="p-5">
          {assignments.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No assignments scheduled for this date.</p>
          ) : (
            <ul className="space-y-4">
              {assignments.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Time clock */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Time clock</h2>
          <p className="text-sm text-gray-500 mt-0.5">Clock in when you start, clock out when you finish</p>
        </div>
        <div className="p-5 space-y-4">
          {clockState.clockedInAt && (
            <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 space-y-1 text-sm">
              <p className="text-gray-600">
                Clocked in at <strong className="font-mono text-gray-900">{formatTimeWithSeconds(clockState.clockedInAt)}</strong>
              </p>
              {isClockedIn && (
                <p className="text-emerald-600 font-medium tabular-nums">
                  Elapsed: {formatDuration(clockState.clockedInAt, liveNow.toISOString())}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClockIn}
              disabled={!!clockState.clockedInAt}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
            >
              <LogIn size={20} />
              Clock in
            </button>
            <button
              type="button"
              onClick={handleClockOut}
              disabled={!clockState.clockedInAt}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors"
            >
              <LogOut size={20} />
              Clock out
            </button>
          </div>
        </div>
      </section>

      {/* Notes for this date */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Notes for this date</h2>
          <p className="text-sm text-gray-500 mt-0.5">Add any notes, issues, or comments for the day</p>
        </div>
        <div className="p-5">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="e.g. GPS went out for 10 min near Kenan. Reported to dispatch."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--p2p-primary-blue)] focus:border-transparent resize-y min-h-[100px]"
          />
          <p className="mt-2 text-xs text-gray-500">Saved automatically</p>
        </div>
      </section>

      {/* Clock history for the day (below notes) */}
      {history.length > 0 && (() => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const isToday = selectedDate === todayStr;
        const sectionTitle = isToday ? "Today's sessions" : `Sessions for ${formatHistoryDate(selectedDate)}`;
        return (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <History size={18} className="text-slate-600" />
              <h3 className="font-semibold text-gray-900">{sectionTitle}</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {history.map((entry) => (
                <li key={entry.id} className="p-4 hover:bg-gray-50/50 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-gray-700 tabular-nums">
                      {!isToday && (
                        <span className="text-gray-500 font-medium">{formatHistoryDate(selectedDate)} · </span>
                      )}
                      <span className="font-mono">
                        {formatTimeWithSeconds(entry.clockedInAt)} → {formatTimeWithSeconds(entry.clockedOutAt)}
                      </span>
                    </span>
                    <span className="font-semibold text-[var(--p2p-primary-blue)]">
                      {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m driven
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600">
                    Route completed: <strong>{entry.routePercent}%</strong>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: DriverAssignment }) {
  return (
    <li className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <p className="font-semibold text-gray-900 text-lg">{assignment.vehicleLabel}</p>
      <p className="text-[var(--p2p-primary-blue)] font-medium mt-1">{assignment.routeName}</p>
      <p className="text-sm text-gray-500 mt-2 tabular-nums">
        {assignment.shiftStart} – {assignment.shiftEnd}
      </p>
    </li>
  );
}
