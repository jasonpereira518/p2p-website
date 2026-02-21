"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Home } from "lucide-react";
import { getStoredSession, clearSession } from "@/lib/auth";

export default function DriverDashboardLayout({
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
    if (s.role !== "driver") {
      router.replace("/admin/dashboard");
      return;
    }
    setSession(s);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.replace("/admin");
  };

  if (!mounted || !session || session.role !== "driver") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
              Driver Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {session.name}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Driver
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
