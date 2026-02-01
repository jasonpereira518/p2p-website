"use client";

import { List, Map } from "lucide-react";

type View = "list" | "map";

interface BottomNavProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export default function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white pb-safe-pb"
      aria-label="Main navigation"
    >
      <button
        onClick={() => onViewChange("list")}
        className={`flex-1 flex items-center justify-center gap-2 py-4 min-h-[56px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p2p-primary-blue)] focus-visible:ring-offset-2 ${
          activeView === "list"
            ? "bg-[var(--p2p-light-blue)] text-[var(--p2p-primary-blue)] font-semibold"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        aria-pressed={activeView === "list"}
      >
        <List size={24} strokeWidth={2} aria-hidden />
        <span>List</span>
      </button>
      <button
        onClick={() => onViewChange("map")}
        className={`flex-1 flex items-center justify-center gap-2 py-4 min-h-[56px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p2p-primary-blue)] focus-visible:ring-offset-2 ${
          activeView === "map"
            ? "bg-[var(--p2p-light-blue)] text-[var(--p2p-primary-blue)] font-semibold"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        aria-pressed={activeView === "map"}
      >
        <Map size={24} strokeWidth={2} aria-hidden />
        <span>Map</span>
      </button>
    </nav>
  );
}
