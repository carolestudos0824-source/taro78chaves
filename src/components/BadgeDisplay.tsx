import type { Badge } from "@/lib/content";

const BADGE_SYMBOLS: Record<string, string> = {
  "first-step": "✦",
  "fool-complete": "☽",
  "quiz-master": "★",
  "deep-diver": "◈",
  "streak-3": "☀",
  "streak-7": "✧",
  "library-explorer": "❋",
};

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-5 md:gap-7">
      {badges.map((badge) => {
        const symbol = BADGE_SYMBOLS[badge.id] || badge.icon;
        return (
          <div
            key={badge.id}
            className={`group flex flex-col items-center gap-2.5 w-[76px] transition-all duration-500 ${
              badge.earned ? "opacity-100" : "opacity-45"
            }`}
            title={badge.description}
          >
            {/* Badge circle */}
            <div className={`relative w-[64px] h-[64px] rounded-full transition-all duration-500 ${
              badge.earned ? "group-hover:scale-110" : ""
            }`} style={badge.earned ? {
              boxShadow: "0 0 22px hsl(36 45% 50% / 0.28), 0 5px 18px hsl(340 42% 28% / 0.14), 0 0 45px hsl(42 70% 78% / 0.10)"
            } : undefined}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full" style={badge.earned ? {
                border: "2px solid hsl(36 42% 48% / 0.60)",
                boxShadow: "inset 0 0 8px hsl(36 45% 55% / 0.12)"
              } : {
                border: "1.5px solid hsl(230 10% 50% / 0.22)"
              }} />
              {/* Inner ring */}
              <div className="absolute inset-[3px] rounded-full" style={badge.earned ? {
                border: "1px solid hsl(340 42% 28% / 0.30)"
              } : {
                border: "1px solid transparent"
              }} />
              {/* Core */}
              <div className="absolute inset-[6px] rounded-full flex items-center justify-center transition-all duration-300" style={badge.earned ? {
                background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 33% 96%), hsl(36 45% 55% / 0.18))",
                boxShadow: "inset 0 2px 5px hsl(36 45% 55% / 0.20), inset 0 -1px 3px hsl(340 42% 28% / 0.12)"
              } : {
                background: "hsl(36 18% 88% / 0.55)"
              }}>
                <span className="text-xl leading-none" style={badge.earned ? {
                  color: "hsl(340 42% 22%)",
                  filter: "drop-shadow(0 1px 2px hsl(36 45% 50% / 0.25))"
                } : {
                  color: "hsl(230 10% 45% / 0.30)"
                }}>
                  {symbol}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-body text-center leading-tight tracking-wider uppercase transition-colors duration-300" style={badge.earned ? {
              color: "hsl(230 20% 12% / 0.72)"
            } : {
              color: "hsl(230 10% 40% / 0.32)"
            }}>
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
