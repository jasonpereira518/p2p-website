"use client";

import {
  fleetStatus,
  dailyBusCounts,
  driverSessions,
  complaints,
  adminUsers,
} from "@/data/mockAdmin";
import FleetStatusCard from "@/components/admin/FleetStatusCard";
import DailyCountsTable from "@/components/admin/DailyCountsTable";
import WhosDrivingCard from "@/components/admin/WhosDrivingCard";
import ComplaintsList from "@/components/admin/ComplaintsList";
import TeamCard from "@/components/admin/TeamCard";
import SectionSpy from "@/components/admin/SectionSpy";
import { Bus, AlertCircle, Users, BarChart3 } from "lucide-react";

const activeDrivers = driverSessions.filter((s) => !s.loggedOutAt).length;
const newComplaints = complaints.filter((c) => c.status === "new").length;
const offRoute = fleetStatus.filter((f) => !f.onRoute).length;
const todayCounts = dailyBusCounts.filter(
  (c) => c.date === new Date().toISOString().slice(0, 10)
);
const totalBoardingsToday =
  todayCounts.length > 0
    ? todayCounts.reduce((sum, c) => sum + c.boardings, 0)
    : 0;

export default function AdminDashboardPage() {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      <SectionSpy />
      {/* Summary cards */}
      <section id="dashboard" className="scroll-mt-24 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[var(--p2p-light-blue)]">
            <Bus size={24} className="text-[var(--p2p-primary-blue)]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{fleetStatus.length}</p>
            <p className="text-sm text-gray-500">Active buses</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100">
            <Users size={24} className="text-emerald-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{activeDrivers}</p>
            <p className="text-sm text-gray-500">Drivers logged in</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100">
            <BarChart3 size={24} className="text-amber-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalBoardingsToday}</p>
            <p className="text-sm text-gray-500">Boardings today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-100">
            <AlertCircle size={24} className="text-red-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{newComplaints}</p>
            <p className="text-sm text-gray-500">New complaints</p>
            {offRoute > 0 && (
              <p className="text-xs text-amber-600 mt-0.5">{offRoute} bus(es) off route</p>
            )}
          </div>
        </div>
      </section>

      {/* Fleet status: capacity & on/off route bars */}
      <section id="fleet" className="scroll-mt-24">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Fleet status</h2>
        <p className="text-sm text-gray-500 mb-4">
          Capacity and route status per bus. Bars show capacity; &quot;Off route&quot; indicates special runs (e.g. basketball, football).
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleetStatus.map((s) => (
            <FleetStatusCard key={s.vehicleId} status={s} />
          ))}
        </div>
      </section>

      {/* Counts per bus per day */}
      <section id="counts" className="scroll-mt-24">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Counts per bus per day</h2>
        <p className="text-sm text-gray-500 mb-4">
          Daily boardings, alightings, and trip counts by vehicle.
        </p>
        <DailyCountsTable counts={dailyBusCounts} />
      </section>

      {/* Who's driving */}
      <section id="drivers" className="scroll-mt-24">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Who&apos;s driving</h2>
        <p className="text-sm text-gray-500 mb-4">
          Current and recent driver sessions. Drivers log in when they start a run.
        </p>
        <div className="grid lg:grid-cols-2 gap-6">
          <WhosDrivingCard sessions={driverSessions} />
          <TeamCard users={adminUsers} />
        </div>
      </section>

      {/* Complaints */}
      <section id="complaints" className="scroll-mt-24">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Complaints &amp; issues</h2>
        <p className="text-sm text-gray-500 mb-4">
          Tracker outages, GPS issues, bus freezes, and feedback (e.g. no backup when GPS fails).
        </p>
        <ComplaintsList complaints={complaints} />
      </section>

      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-200">
        P2P Admin · Demo data · UNC Late-Night Transportation
      </footer>
    </div>
  );
}
