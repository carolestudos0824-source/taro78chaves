import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 shadow-sm" style={isActive ? {
      border: "2.5px solid #5B1F3D33",
      background: "linear-gradient(135deg, #FAF5EF, #F3E6E0)",
      boxShadow: "0 2px 8px #5B1F3D0D"
    } : {
      border: "1.5px solid #C8A66A33",
      background: "#FAF5EF",
      opacity: 0.6
    }}>
      <Flame
        className={`w-5 h-5 transition-colors ${isActive ? "animate-pulse" : ""}`}
        style={{ color: isActive ? "#5B1F3D" : "#5B1F3D4D" }}
      />
      <span className="text-base font-heading tabular-nums font-black" style={{
        color: isActive ? "#5B1F3D" : "#5B1F3D80"
      }}>
        {streak}
      </span>
    </div>
  );
}