"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type AdminSectionId = "dashboard" | "fleet" | "counts" | "drivers" | "complaints";

const ActiveSectionContext = createContext<{
  activeSection: AdminSectionId;
  setActiveSection: (id: AdminSectionId) => void;
} | null>(null);

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<AdminSectionId>("dashboard");
  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  const ctx = useContext(ActiveSectionContext);
  if (!ctx) return { activeSection: "dashboard" as AdminSectionId, setActiveSection: () => {} };
  return ctx;
}
