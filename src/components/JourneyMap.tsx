import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles, Crown } from "lucide-react";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, FREE_ARCANO_IDS, getArcanoFull } from "@/lib/content";
import type { UserProgress } from "@/lib/content";
import { useAccess } from "@/hooks/use-access";
import { TarotAnimatedCard } from "./tarot-motion/TarotAnimatedCard";
import { motion, AnimatePresence } from "framer-motion";

interface JourneyMapProps {
  progress: UserProgress;
}

const ARCANO_SYMBOLS: Record<number, string> = {
  0: "✦", 1: "✧", 2: "◈", 3: "❋", 4: "◆", 5: "✦", 6: "♡", 7: "⚡",
  8: "∞", 9: "☆", 10: "◎", 11: "⚖", 12: "△", 13: "✝", 14: "✧",
  15: "⛧", 16: "⌂", 17: "★", 18: "✦", 19: "☀", 20: "♱", 21: "◯",
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
                <div className={`w-full flex ${side === "left" ? "justify-end" : "justify-start"}`}>
                  <TarotAnimatedCard
                    cardImage={getArcanoFull(arcano.id)?.cardImage || ""}
                    cardName={arcano.name}
                    arcanoId={arcano.id}
                    arcanoSlug={arcano.slug}
                    state={isCompleted ? 'completed' : isCurrent ? 'available' : 'locked'}
                    isPremium={isPremium}
                    onClick={() => (isUnlocked || isPremium) && navigate(`/lesson/${arcano.id}`)}
                    className="w-[140px]"
                  />
                </div>
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
