import { Sparkles, KeyRound, Compass } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const xpInLevel = xp % 100;

  return (
    <div 
      className="flex items-center gap-4"
      title={`XP do nível: ${xpInLevel} de 100`}
      aria-label={`XP do nível: ${xpInLevel} de 100`}
    >
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105" style={{
          border: "2px solid #C8A66A4D",
          background: "linear-gradient(135deg, #FAF5EF, #F3E6E0)",
          boxShadow: "0 4px 15px rgba(91, 31, 61, 0.08)"
        }}>
          <KeyRound className="w-6 h-6" style={{ color: "#C8A66A" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] tracking-[0.2em] uppercase leading-none font-heading font-black" style={{
            color: "#5B1F3D"
          }}>Nível</span>
          <span className="text-xl font-heading tracking-tighter leading-tight font-black" style={{
            color: "#5B1F3D"
          }}>{level}</span>
        </div>
      </div>
      <div className="flex-1 relative space-y-1.5">
        <div className="flex justify-between items-end px-1">
          <span className="text-[11px] font-heading font-black tracking-widest text-[#5B1F3D]/80 uppercase">XP do Nível</span>
          <span className="text-[11px] font-heading font-black text-[#5B1F3D]">{xpInLevel}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden p-[1.5px]" style={{
          background: "#DCCFC240",
          border: "1px solid #DCCFC2",
        }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden shadow-[0_0_10px_rgba(200,166,106,0.5)]"
            style={{
              width: `${Math.max(xpInLevel, 5)}%`,
              background: "linear-gradient(90deg, #5B1F3D, #C8A66A)",
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
      <div className="flex flex-col items-end tabular-nums shrink-0">
        <div className="flex items-baseline gap-0.5">
          <span className="text-base font-black text-[#5B1F3D]">{xpInLevel}</span>
          <span className="text-[10px] font-black text-[#5B1F3D]/30">/100</span>
        </div>
        <span className="text-[10px] font-heading font-black tracking-[0.2em] text-[#5B1F3D] uppercase leading-none">XP</span>
      </div>
    </div>
  );
}