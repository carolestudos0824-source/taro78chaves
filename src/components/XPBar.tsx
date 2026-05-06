import { Sparkles } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
          border: "1.5px solid hsl(var(--brand-plum) / 0.3)",
          background: "linear-gradient(135deg, hsl(var(--brand-plum) / 0.08), hsl(var(--brand-gold) / 0.05))",
          boxShadow: "0 0 16px hsl(var(--brand-plum) / 0.05), inset 0 1px 3px hsl(var(--brand-gold) / 0.1)"
        }}>
          <Sparkles className="w-4.5 h-4.5" style={{ color: "hsl(var(--brand-plum))", fill: "hsl(var(--brand-plum) / 0.1)" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] tracking-wider uppercase leading-none font-body font-bold" style={{
            color: "hsl(var(--brand-plum) / 0.5)"
          }}>Nível</span>
          <span className="text-lg font-heading tracking-wide leading-tight font-bold" style={{
            color: "hsl(var(--brand-plum))"
          }}>{level}</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="h-3.5 rounded-full overflow-hidden" style={{
          background: "hsl(var(--brand-ivory))",
          border: "1px solid hsl(var(--brand-gold) / 0.3)",
          boxShadow: "inset 0 1px 3px hsl(var(--brand-plum) / 0.1)"
        }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${Math.max(xpInLevel, 3)}%`,
              background: "linear-gradient(90deg, hsl(340 42% 26%), hsl(36 42% 44%), hsl(42 55% 60%))",
              boxShadow: "0 1px 4px hsl(36 45% 50% / 0.35)"
            }}
          >
            <div
              className="absolute inset-0 w-1/3 h-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(42 70% 78% / 0.75), transparent)",
                animation: "progress-shine 2.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
      <span className="text-sm font-body tabular-nums shrink-0" style={{ color: "hsl(230 20% 12% / 0.78)" }}>
        {xpInLevel}<span style={{ color: "hsl(230 20% 12% / 0.40)" }}>/100</span>{" "}
        <span className="font-heading" style={{ color: "hsl(36 42% 40%)" }}>XP</span>
      </span>
    </div>
  );
}
