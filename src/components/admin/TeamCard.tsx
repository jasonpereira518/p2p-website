"use client";

import { Users, Shield, UserCircle } from "lucide-react";
import type { AdminUser } from "@/types/admin";

interface TeamCardProps {
  users: AdminUser[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  manager: "Manager",
  driver: "Driver",
};

export default function TeamCard({ users }: TeamCardProps) {
  const byRole = (role: string) => users.filter((u) => u.role === role);
  const admins = byRole("admin");
  const managers = byRole("manager");
  const drivers = byRole("driver");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-violet-100">
          <Users size={22} className="text-violet-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Drivers &amp; managers</h3>
          <p className="text-sm text-gray-500">Team members with admin access</p>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {admins.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield size={14} /> Admins
            </p>
            <ul className="space-y-1.5">
              {admins.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-amber-50 border border-amber-100"
                >
                  <UserCircle size={20} className="text-amber-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs font-medium text-amber-700">Admin</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {managers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users size={14} /> Managers
            </p>
            <ul className="space-y-1.5">
              {managers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-100"
                >
                  <UserCircle size={20} className="text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs font-medium text-emerald-700">Manager</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {drivers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCircle size={14} /> Drivers
            </p>
            <ul className="space-y-1.5">
              {drivers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <UserCircle size={20} className="text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs font-medium text-blue-700">
                    {ROLE_LABELS[u.role]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
