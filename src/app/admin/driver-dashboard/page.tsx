"use client";

import { useState, useEffect, useCallback } from "react";
import { getStoredSession } from "@/lib/auth";
import { driverAssignments } from "@/data/mockAdmin";
import type { DriverAssignment } from "@/types/admin";
import { Bus, MapPin, Clock, LogIn, LogOut, FileText, Calendar, History } from "lucide-react";

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

function formatTimeWithSeconds(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
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
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      {/* Date selector */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar size={18} />
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--p2p-primary-blue)] focus:border-transparent"
        />
      </section>

      {/* Assignments for the day */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Bus size={20} className="text-[var(--p2p-primary-blue)]" />
          My assignments for the day
        </h2>
        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-500">
            No assignments scheduled for this date.
          </div>
        ) : (
          <ul className="space-y-3">
            {assignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} />
            ))}
          </ul>
        )}
      </section>

      {/* Clock in / Clock out */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100">
            <Clock size={20} className="text-emerald-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Time clock</h3>
            <p className="text-sm text-gray-500">Clock in when you start, clock out when you finish</p>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {clockState.clockedInAt && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-2">
              <p className="text-sm text-gray-600">
                Clocked in at{" "}
                <strong className="font-mono text-gray-900">
                  {formatTimeWithSeconds(clockState.clockedInAt)}
                </strong>
              </p>
              {isClockedIn ? (
                <>
                  <p className="text-sm text-gray-600">
                    Current time{" "}
                    <strong className="font-mono text-gray-900 tabular-nums">
                      {formatTimeWithSeconds(liveNow.toISOString())}
                    </strong>
                  </p>
                  <p className="text-emerald-600 font-semibold tabular-nums">
                    Elapsed: {formatDuration(clockState.clockedInAt, liveNow.toISOString())}
                  </p>
                </>
              ) : null}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClockIn}
              disabled={!!clockState.clockedInAt}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
            >
              <LogIn size={20} />
              Clock in
            </button>
            <button
              type="button"
              onClick={handleClockOut}
              disabled={!clockState.clockedInAt}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors"
            >
              <LogOut size={20} />
              Clock out
            </button>
          </div>
        </div>
      </section>

      {/* Clock history for the day */}
      {history.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100">
              <History size={20} className="text-slate-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Today&apos;s sessions</h3>
              <p className="text-sm text-gray-500">Logged clock-in / clock-out with drive time and route completion</p>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {history.map((entry) => (
              <li key={entry.id} className="p-4 hover:bg-gray-50/50">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="font-mono text-gray-700 tabular-nums">
                    {formatTimeWithSeconds(entry.clockedInAt)} → {formatTimeWithSeconds(entry.clockedOutAt)}
                  </span>
                  <span className="font-semibold text-[var(--p2p-primary-blue)]">
                    {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m driven
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Route completed: <strong>{entry.routePercent}%</strong>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Notes for the date */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100">
            <FileText size={20} className="text-blue-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Notes for this date</h3>
            <p className="text-sm text-gray-500">Add any notes, issues, or comments for the day</p>
          </div>
        </div>
        <div className="p-4">
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
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: DriverAssignment }) {
  return (
    <li className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-4">
      <div className="p-2 rounded-lg bg-[var(--p2p-light-blue)] shrink-0">
        <Bus size={22} className="text-[var(--p2p-primary-blue)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{assignment.vehicleLabel}</p>
        <p className="text-[var(--p2p-primary-blue)] font-medium flex items-center gap-1.5 mt-0.5">
          <MapPin size={16} />
          {assignment.routeName}
        </p>
        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
          <Clock size={14} />
          {assignment.shiftStart} – {assignment.shiftEnd}
        </p>
      </div>
    </li>
  );
}
