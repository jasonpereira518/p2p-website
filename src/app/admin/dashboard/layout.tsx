"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Bus, Users, AlertCircle, BarChart3, Home } from "lucide-react";
import { getStoredSession, clearSession } from "@/lib/auth";
import { ActiveSectionProvider, useActiveSection } from "@/contexts/ActiveSectionContext";
import type { AdminSectionId } from "@/contexts/ActiveSectionContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState(getStoredSession());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getStoredSession();
    if (!s) {
      router.replace("/admin");
      return;
    }
    if (s.role === "driver") {
      router.replace("/admin/driver-dashboard");
      return;
    }
    setSession(s);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.replace("/admin");
  };

  if (!mounted || !session || session.role === "driver") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading…</div>
      </div>
    );
  }

  return (
    <ActiveSectionProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader
          session={session}
          onLogout={handleLogout}
        />
        <main className="flex-1">{children}</main>
      </div>
    </ActiveSectionProvider>
  );
}

function DashboardHeader({
  session,
  onLogout,
}: {
  session: NonNullable<ReturnType<typeof getStoredSession>>;
  onLogout: () => void;
}) {
  const { activeSection } = useActiveSection();

  const navItems: { href: string; label: string; icon: typeof LayoutDashboard; sectionId: AdminSectionId }[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, sectionId: "dashboard" },
    { href: "#fleet", label: "Fleet", icon: Bus, sectionId: "fleet" },
    { href: "#counts", label: "Counts", icon: BarChart3, sectionId: "counts" },
    { href: "#drivers", label: "Who's Driving", icon: Users, sectionId: "drivers" },
    { href: "#complaints", label: "Complaints", icon: AlertCircle, sectionId: "complaints" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Back to P2P Live"
            >
              <Home size={20} />
              <span className="hidden sm:inline text-sm">P2P Live</span>
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-bold text-[var(--p2p-primary-blue)]">
              P2P Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {session.name}
            </span>
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                session.role === "admin"
                  ? "bg-amber-100 text-amber-800"
                  : session.role === "manager"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {session.role}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
        <nav className="flex gap-1 px-4 lg:px-6 overflow-x-auto scrollbar-hide border-t border-gray-100">
          {navItems.map(({ href, label, icon: Icon, sectionId }) => {
            const isActive = activeSection === sectionId;
            return (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-[var(--p2p-primary-blue)] text-[var(--p2p-primary-blue)]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                }`}
              >
                <Icon size={18} />
                {label}
              </a>
            );
          })}
        </nav>
    </header>
  );
}
