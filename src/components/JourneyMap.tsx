import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles, Crown } from "lucide-react";
import { TarotIcon } from "./TarotIcon";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, getArcanoFull } from "@/lib/content";
import type { UserProgress } from "@/lib/content";
import { useAccess } from "@/hooks/use-access";
import { TarotAnimatedCard } from "./tarot-motion/TarotAnimatedCard";

interface JourneyMapProps {
  progress: UserProgress;
}

export function JourneyMap({ progress }: JourneyMapProps) {
  const navigate = useNavigate();
  const { bypassLocks, canAccessArcano } = useAccess();

  return (
    <div className="relative max-w-2xl mx-auto pb-32">
      {/* Decorative top */}
      <div className="flex flex-col items-center mb-6 opacity-50">
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, transparent, #C8A66A80)" }} />
        <TarotIcon name="Sparkles" className="w-4 h-4" color="#C8A66A" />
      </div>

      {/* Central path line */}
      <div className="absolute left-1/2 top-16 bottom-16 -translate-x-px w-px">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(to bottom, 
            rgba(200, 166, 106, 0.4) 0px, 
            rgba(200, 166, 106, 0.4) 4px, 
            transparent 4px, 
            transparent 14px)`,
        }} />
      </div>

      <div className="relative space-y-0">
        {ARCANOS_MAIORES.map((arcano, index) => {
          const isCompleted = progress.completedLessons.includes(`arcano-${arcano.id}`) && progress.completedQuizzes.includes(`quiz-arcano-${arcano.id}`);
          const isFree = canAccessArcano(arcano.id);
          const isPremium = !isFree && !bypassLocks;
          
          const fundamentosComplete = progress.completedModules.includes("fundamentos") || bypassLocks;
          
          const isUnlocked = bypassLocks || (fundamentosComplete && (isFree || (
            progress.completedLessons.includes(`arcano-${arcano.id - 1}`) &&
            progress.completedQuizzes.includes(`quiz-arcano-${arcano.id - 1}`)
          )));
          const isCurrent = isUnlocked && !isCompleted;
          const side = index % 2 === 0 ? "left" : "right";

          return (
            <div
              key={arcano.id}
              className={`relative flex items-center py-3 ${side === "left" ? "flex-row" : "flex-row-reverse"}`}
            >
              {/* Card */}
              <div className={`flex-1 ${side === "left" ? "pr-10 md:pr-14" : "pl-10 md:pl-14"}`}>
                <div className={`w-full flex flex-col ${side === "left" ? "items-end" : "items-start"}`}>
                  <div className="relative group/card">
                    {/* Halo effect */}
                    <div className="absolute inset-0 bg-[#C8A66A] opacity-0 group-hover/card:opacity-10 blur-2xl rounded-xl transition-opacity duration-500" />
                    
                    <TarotAnimatedCard
                      cardImage={getArcanoFull(arcano.id)?.cardImage || ""}
                      cardName={arcano.name}
                      arcanoId={arcano.id}
                      arcanoSlug={arcano.slug}
                      state={isCompleted ? 'completed' : isCurrent ? 'available' : 'locked'}
                      isPremium={isPremium}
                      onClick={() => (isUnlocked || isPremium) && navigate(`/lesson/${arcano.id}`)}
                      className="w-[145px] relative z-10"
                    />
                  </div>

                  {/* Pedagogical Label */}
                  <div className={`mt-4 flex flex-col ${side === "left" ? "items-end text-right" : "items-start text-left"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-heading tracking-widest text-[#5B1F3D60] font-bold">
                        {index + 1}/22
                      </span>
                      <span className="text-[10px] md:text-[11px] font-heading tracking-[0.3em] text-[#C8A66A] font-black uppercase">
                        {arcano.numeral}
                      </span>
                    </div>
                    <h4 className="font-heading text-sm md:text-base text-[#5B1F3D] font-black tracking-tight leading-tight">
                      {arcano.name}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                {isCurrent && (
                  <div
                    className="absolute inset-0 -m-3 rounded-full animate-pulse"
                    style={{
                      border: "1px solid rgba(91, 31, 61, 0.15)",
                    }}
                  />
                )}
                <div
                  className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500"
                  style={isCurrent ? {
                    border: "2px solid #5B1F3D",
                    background: "white",
                    boxShadow: "0 10px 25px rgba(91, 31, 61, 0.1), 0 0 40px rgba(200, 166, 106, 0.1)",
                  } : isCompleted ? {
                    border: "2px solid rgba(200, 166, 106, 0.5)",
                    background: "#FAF5EF"
                  } : {
                    border: "1.5px solid rgba(209, 196, 181, 0.4)",
                    background: "rgba(220, 207, 194, 0.3)"
                  }}
                >
                  <span 
                    className="font-heading text-sm md:text-base font-black transition-colors duration-500" 
                    style={{ 
                      color: isUnlocked || isCompleted ? "#5B1F3D" : "#5B1F3D40",
                      lineHeight: 1 
                    }}
                  >
                    {arcano.numeral}
                  </span>
                  
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C8A66A] flex items-center justify-center border border-white shadow-sm">
                      <TarotIcon name="concluido" className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                    </div>
                  )}
                  
                  {!isUnlocked && !isFree && !isCompleted && !bypassLocks && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center border border-[#DCCFC2] shadow-sm">
                      {isPremium ? (
                        <TarotIcon name="rei" className="w-2.5 h-2.5" color="#C8A66A" />
                      ) : (
                        <TarotIcon name="bloqueado" className="w-2.5 h-2.5" color="#5B1F3D40" />
                      )}
                    </div>
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
                  background: isCurrent ? "rgba(91, 31, 61, 0.2)" : isCompleted ? "rgba(200, 166, 106, 0.3)" : "rgba(209, 196, 181, 0.2)"
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
        <TarotIcon name="Sparkles" className="w-4 h-4" color="#C8A66A" />
        <div className="w-px h-10" style={{ background: "linear-gradient(to top, transparent, #C8A66A80)" }} />
      </div>
    </div>
  );
}