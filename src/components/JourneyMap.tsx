import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles, Crown } from "lucide-react";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, FREE_ARCANO_IDS } from "@/lib/content";
import type { UserProgress } from "@/lib/content";
import { useAccess } from "@/hooks/use-access";

interface JourneyMapProps {
  progress: UserProgress;
}

const ARCANO_SYMBOLS: Record<number, string> = {
  0: "☽", 1: "✧", 2: "◈", 3: "❋", 4: "◆", 5: "✦", 6: "♡", 7: "⚡",
  8: "∞", 9: "☆", 10: "◎", 11: "⚖", 12: "△", 13: "✝", 14: "☾",
  15: "⛧", 16: "⌂", 17: "★", 18: "☽", 19: "☀", 20: "♱", 21: "◯",
};

export function JourneyMap({ progress }: JourneyMapProps) {
  const navigate = useNavigate();
  const { bypassLocks, canAccessArcano } = useAccess();

  return (
    <div className="relative max-w-2xl mx-auto pb-16">
      {/* Decorative top */}
      <div className="flex flex-col items-center mb-6 opacity-50">
        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, transparent, hsl(36 42% 45% / 0.55))" }} />
        <Sparkles className="w-4 h-4" style={{ color: "hsl(36 42% 45% / 0.60)" }} />
      </div>

      {/* Central path line */}
      <div className="absolute left-1/2 top-16 bottom-16 -translate-x-px w-px">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(to bottom, 
            hsl(36 42% 45% / 0.45) 0px, 
            hsl(36 42% 45% / 0.45) 4px, 
            transparent 4px, 
            transparent 12px)`,
        }} />
      </div>

      <div className="relative space-y-0">
        {ARCANOS_MAIORES.map((arcano, index) => {
          const isCompleted = progress.completedLessons.includes(`arcano-${arcano.id}`) && progress.completedQuizzes.includes(`quiz-arcano-${arcano.id}`);
          const isFree = canAccessArcano(arcano.id);
          const isPremium = !isFree && !bypassLocks;
          const isUnlocked = bypassLocks || isFree || (
            progress.completedLessons.includes(`arcano-${arcano.id - 1}`) &&
            progress.completedQuizzes.includes(`quiz-arcano-${arcano.id - 1}`)
          );
          const isCurrent = isUnlocked && !isCompleted;
          const side = index % 2 === 0 ? "left" : "right";
          const symbol = ARCANO_SYMBOLS[arcano.id] || "◇";

          return (
            <div
              key={arcano.id}
              className={`relative flex items-center py-3 ${side === "left" ? "flex-row" : "flex-row-reverse"}`}
              style={{
                animation: "fade-up 0.6s ease-out both",
                animationDelay: `${index * 70}ms`,
              }}
            >
              {/* Card */}
              <div className={`flex-1 ${side === "left" ? "pr-10 md:pr-14" : "pl-10 md:pl-14"}`}>
                <button
                  onClick={() => (isUnlocked || isPremium) && navigate(`/lesson/${arcano.id}`)}
                  disabled={!isUnlocked && !isPremium}
                  className={`w-full group relative transition-all duration-500 ${
                    side === "left" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
                      isCurrent
                        ? "hover:scale-[1.02] cursor-pointer"
                        : isCompleted
                        ? "cursor-pointer"
                        : isPremium
                        ? "hover:scale-[1.01] cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                    style={isCurrent ? {
                      background: "linear-gradient(145deg, hsl(38 28% 93% / 0.92), hsl(36 33% 95% / 0.88))",
                      backdropFilter: "blur(18px)",
                      border: "1.5px solid hsl(340 42% 28% / 0.40)",
                      boxShadow: "0 8px 35px hsl(340 42% 28% / 0.12), 0 0 50px hsl(42 70% 78% / 0.08), inset 0 1px 0 hsl(36 45% 55% / 0.20)",
                      animation: "glow-breathe 5s ease-in-out infinite"
                    } : isCompleted ? {
                      background: "hsl(38 28% 94% / 0.78)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid hsl(36 42% 52% / 0.30)",
                      boxShadow: "0 3px 14px hsl(36 45% 55% / 0.08)"
                    } : {
                      background: "hsl(36 18% 90% / 0.42)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid hsl(36 22% 80% / 0.45)"
                    }}
                  >
                    {/* Inner gradient for current */}
                    {isCurrent && (
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: "linear-gradient(135deg, hsl(36 45% 55% / 0.07), transparent 60%, hsl(340 42% 28% / 0.04))"
                      }} />
                    )}

                    <div className="relative z-10 p-5 md:p-6">
                      {/* Corner ornaments for current */}
                      {isCurrent && (
                        <>
                          <div className="absolute top-2.5 left-2.5 w-4 h-4" style={{ borderTop: "1.5px solid hsl(36 42% 45% / 0.42)", borderLeft: "1.5px solid hsl(36 42% 45% / 0.42)" }} />
                          <div className="absolute top-2.5 right-2.5 w-4 h-4" style={{ borderTop: "1.5px solid hsl(36 42% 45% / 0.42)", borderRight: "1.5px solid hsl(36 42% 45% / 0.42)" }} />
                          <div className="absolute bottom-2.5 left-2.5 w-4 h-4" style={{ borderBottom: "1.5px solid hsl(36 42% 45% / 0.42)", borderLeft: "1.5px solid hsl(36 42% 45% / 0.42)" }} />
                          <div className="absolute bottom-2.5 right-2.5 w-4 h-4" style={{ borderBottom: "1.5px solid hsl(36 42% 45% / 0.42)", borderRight: "1.5px solid hsl(36 42% 45% / 0.42)" }} />
                        </>
                      )}

                      {/* Numeral + symbol */}
                      <div className={`flex items-center gap-2 mb-2 ${side === "left" ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] font-heading tracking-[0.4em] uppercase" style={{
                          color: isCurrent ? "hsl(340 42% 22%)" : isCompleted ? "hsl(36 42% 40% / 0.85)" : "hsl(230 10% 45% / 0.30)"
                        }}>
                          {arcano.numeral}
                        </span>
                        <span className="text-sm" style={{
                          color: isCurrent ? "hsl(340 42% 28% / 0.60)" : isCompleted ? "hsl(36 42% 45% / 0.48)" : "hsl(230 10% 45% / 0.18)"
                        }}>
                          {symbol}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className={`font-heading tracking-wide leading-tight mb-1.5 transition-all duration-500 ${
                        isCurrent ? "text-lg md:text-xl" : isCompleted ? "text-base" : "text-sm"
                      }`} style={isCurrent ? {
                        background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 26%), hsl(36 42% 42%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      } : isCompleted ? {
                        color: "hsl(230 20% 12% / 0.75)"
                      } : {
                        color: "hsl(230 10% 45% / 0.30)"
                      }}>
                        {arcano.name}
                      </h3>

                      {/* Subtitle */}
                      <p className={`font-accent italic leading-relaxed ${
                        isCurrent ? "text-sm" : "text-xs"
                      }`} style={{
                        color: isCurrent ? "hsl(230 20% 15% / 0.60)" : isCompleted ? "hsl(230 20% 15% / 0.48)" : "hsl(230 10% 45% / 0.18)"
                      }}>
                        {arcano.subtitle}
                      </p>

                      {/* Status indicators */}
                      {isCompleted && (
                        <div className={`flex items-center gap-1.5 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 flex items-center gap-1">
                            <Check className="w-3 h-3 text-success" />
                            <span className="text-[8px] font-heading tracking-widest uppercase text-success">Concluído</span>
                          </div>
                        </div>
                      )}

                      {isCurrent && (
                        <div className={`flex items-center gap-2 mt-3.5 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <span className="text-[9px] tracking-[0.2em] font-heading text-gold-dark/60 uppercase">Em andamento</span>
                          <div className="w-6 h-px bg-gold/30" />
                        </div>
                      )}

                      {!isCompleted && !isCurrent && isUnlocked && isFree && (
                        <div className={`flex items-center gap-1.5 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-orange-500" />
                            <span className="text-[8px] font-heading tracking-widest uppercase text-orange-600">Grátis</span>
                          </div>
                        </div>
                      )}

                      {!isCompleted && !isCurrent && arcano.id === 1 && !isUnlocked && (
                        <div className={`flex items-center gap-1.5 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-accent" />
                            <span className="text-[8px] font-heading tracking-widest uppercase text-accent">Desbloqueável</span>
                          </div>
                        </div>
                      )}

                      {isPremium && !isCompleted && !isUnlocked && arcano.id > 1 && (
                        <div className={`flex items-center gap-1.5 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5 text-secondary" />
                            <span className="text-[8px] font-heading tracking-widest uppercase text-secondary">Premium</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                        background: "linear-gradient(90deg, transparent, hsl(340 42% 28% / 0.30), transparent)"
                      }} />
                    )}
                  </div>
                </button>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                {isCurrent && (
                  <div
                    className="absolute inset-0 -m-3 rounded-full"
                    style={{
                      border: "1px solid hsl(340 42% 28% / 0.28)",
                      animation: "glow-breathe 4s ease-in-out infinite"
                    }}
                  />
                )}
                <div
                  className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500"
                  style={isCurrent ? {
                    border: "2px solid hsl(340 42% 26% / 0.52)",
                    background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 33% 96%), hsl(36 45% 55% / 0.15))",
                    boxShadow: "0 0 25px hsl(340 42% 28% / 0.16), 0 0 50px hsl(36 45% 55% / 0.08)",
                    animation: "glow-breathe 4s ease-in-out infinite"
                  } : isCompleted ? {
                    border: "2px solid hsl(36 42% 45% / 0.42)",
                    background: "hsl(38 28% 94% / 0.90)"
                  } : {
                    border: "1.5px solid hsl(36 22% 75% / 0.50)",
                    background: "hsl(36 18% 90% / 0.55)"
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" style={{ color: "hsl(36 42% 38% / 0.88)" }} />
                  ) : isUnlocked ? (
                    <span className="text-base" style={{ color: "hsl(340 42% 22%)", lineHeight: 1 }}>{symbol}</span>
                  ) : isPremium ? (
                    <Crown className="w-3.5 h-3.5" style={{ color: "hsl(36 45% 50% / 0.45)" }} />
                  ) : (
                    <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 45% / 0.30)" }} />
                  )}
                </div>
              </div>

              {/* Connector line */}
              <div className={`absolute top-1/2 -translate-y-px h-px ${
                side === "left"
                  ? "right-1/2 left-auto mr-[24px] md:mr-[25px]"
                  : "left-1/2 ml-[24px] md:ml-[25px]"
              }`}
                style={{ width: "calc(50% - 60px)" }}
              >
                <div className="w-full h-px" style={{
                  background: isCurrent ? "hsl(340 42% 28% / 0.32)" : isCompleted ? "hsl(36 42% 45% / 0.30)" : "hsl(36 22% 80% / 0.38)"
                }} />
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </div>
          );
        })}
      </div>

      {/* Decorative bottom */}
      <div className="flex flex-col items-center mt-8 opacity-42">
        <Sparkles className="w-4 h-4" style={{ color: "hsl(36 42% 45% / 0.50)" }} />
        <div className="w-px h-6" style={{ background: "linear-gradient(to top, transparent, hsl(36 42% 45% / 0.42))" }} />
      </div>
    </div>
  );
}
