import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300" style={isActive ? {
      border: "1px solid hsl(var(--brand-plum) / 0.3)",
      background: "hsl(var(--brand-plum) / 0.08)",
      boxShadow: "0 0 14px hsl(var(--brand-plum) / 0.05)"
    } : {
      border: "1px solid hsl(var(--brand-gold) / 0.2)",
      background: "hsl(var(--brand-ivory) / 0.5)"
    }}>
      <Flame
        className="w-4 h-4 transition-colors"
        style={{ color: isActive ? "hsl(340 42% 24%)" : "hsl(230 10% 45% / 0.38)" }}
      />
      <span className="text-sm font-heading tabular-nums" style={{
        color: isActive ? "hsl(230 20% 12% / 0.88)" : "hsl(230 10% 40% / 0.42)"
      }}>
        {streak}
      </span>
    </div>
  );
}
