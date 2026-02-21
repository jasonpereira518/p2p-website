"use client";

import { useEffect } from "react";
import type { AdminSectionId } from "@/contexts/ActiveSectionContext";
import { useActiveSection } from "@/contexts/ActiveSectionContext";

const SECTION_IDS: AdminSectionId[] = ["dashboard", "fleet", "counts", "drivers", "complaints"];
const HEADER_OFFSET = 140; // sticky header height + nav

export default function SectionSpy() {
  const { setActiveSection } = useActiveSection();

  useEffect(() => {
    const getElements = () =>
      SECTION_IDS.map((id) => ({ id: id as AdminSectionId, el: document.getElementById(id) }))
        .filter(({ el }) => el != null) as { id: AdminSectionId; el: HTMLElement }[];

    const onScroll = () => {
      const elements = getElements();
      if (elements.length === 0) return;
      // Section is "active" when its top is just above or at the fold (under the sticky header)
      let active: AdminSectionId = "dashboard";
      for (const { id, el } of elements) {
        const top = el.getBoundingClientRect().top;
        if (top <= HEADER_OFFSET + 80) active = id;
      }
      setActiveSection(active);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [setActiveSection]);

  return null;
}
