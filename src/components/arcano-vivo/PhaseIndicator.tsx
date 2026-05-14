import React from "react";

interface PhaseIndicatorProps {
  phases: string[];
  currentIndex: number;
}

/**
 * Minimal dot/bar indicator for lesson progress phases
 * Static version to avoid any animation issues
 */
export function PhaseIndicator({ phases, currentIndex }: PhaseIndicatorProps) {
  return (
    <div className="flex gap-2 items-center h-4">
      {phases.map((_, i) => (
        <div
          key={i}
          className="h-1.5 w-6 rounded-full border border-black/5"
          style={{
            backgroundColor: i <= currentIndex ? "hsl(36, 45%, 58%)" : "rgba(220, 207, 194, 0.4)",
          }}
        />
      ))}
    </div>
  );
}
