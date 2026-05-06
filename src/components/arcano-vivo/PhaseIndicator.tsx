import { motion } from "framer-motion";

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
        <div
          key={i}
          className="h-1.5 w-5 rounded-full transition-all duration-500"
          style={{
            background: i <= currentIndex ? "hsl(36 45% 58%)" : "hsl(36 25% 82% / 0.6)",
          }}
        />
      ))}
    </div>
  );
}
