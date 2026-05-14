import React from "react";

interface PhaseIndicatorProps {
  phases: string[];
  currentIndex: number;
}

/**
 * Minimal dot/bar indicator for lesson progress phases
 */
export function PhaseIndicator({ phases, currentIndex }: PhaseIndicatorProps) {
  return (
    <div className="flex gap-1.5">
      {phases.map((_, i) => (
        <motion.div
          key={i}
          className="h-1.5 w-5 rounded-full"
          initial={false}
          animate={{
            backgroundColor: i <= currentIndex ? "hsl(36, 45%, 58%)" : "rgba(220, 207, 194, 0.6)",
          }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  );
}
