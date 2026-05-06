import { Sparkles } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105" style={{
          border: "2px solid #5B1F3D33",
          background: "linear-gradient(135deg, #FAF5EF, #F3E6E0)",
          boxShadow: "0 4px 12px #5B1F3D0D"
        }}>
          <Sparkles className="w-5 h-5" style={{ color: "#5B1F3D", fill: "#5B1F3D1A" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] tracking-widest uppercase leading-none font-heading font-black" style={{
            color: "#5B1F3D80"
          }}>Nível</span>
          <span className="text-xl font-heading tracking-tight leading-tight font-black" style={{
            color: "#5B1F3D"
          }}>{level}</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="h-4 rounded-full overflow-hidden p-[2px]" style={{
          background: "#FAF5EF",
          border: "1.5px solid #C8A66A4D",
          boxShadow: "inset 0 2px 4px #5B1F3D0D"
        }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${Math.max(xpInLevel, 5)}%`,
              background: "linear-gradient(90deg, #5B1F3D, #C8A66A)",
              boxShadow: "0 0 10px #C8A66A4D"
            }}
          >
            <div
              className="absolute inset-0 w-1/3 h-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "progress-shine 3s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end tabular-nums">
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-black text-[#5B1F3D]">{xpInLevel}</span>
          <span className="text-[10px] font-bold text-[#5B1F3D]/40">/100</span>
        </div>
        <span className="text-[9px] font-heading font-black tracking-widest text-[#C8A66A] uppercase leading-none">XP</span>
      </div>
    </div>
  );
}