import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotAnimatedCard } from "./TarotAnimatedCard";
import { getArcanoTheme } from "./arcano-motion-themes";
import { portalReveal, auraAwaken } from "./motion-presets";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArcanoVivoStageProps {
  arcanoId: number;
  cardName: string;
  cardImage: string;
  arcanoSlug: string;
  onContinue: () => void;
}

export const ArcanoVivoStage: React.FC<ArcanoVivoStageProps> = ({
  arcanoId,
  cardName,
  cardImage,
  arcanoSlug,
  onContinue
}) => {
  const [phase, setPhase] = useState<'dormant' | 'awakening' | 'presence' | 'insight'>('dormant');
  const theme = getArcanoTheme(arcanoId);
  const shouldReduceMotion = useReducedMotionSafe();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setPhase('awakening'), 800));
    timers.push(setTimeout(() => setPhase('presence'), 2500));
    timers.push(setTimeout(() => setPhase('insight'), 4500));

    return () => timers.forEach(clearTimeout);
  }, []);

  const showParticles = (phase === 'presence' || phase === 'insight') && !shouldReduceMotion;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-12 px-6">
      {/* Background Atmosphere - Enhanced ritualistic altar feel */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Ivory Base */}
        <div className="absolute inset-0 bg-[#FDFBF7]" />
        
        {/* Central Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square transition-all duration-[3000ms] blur-[120px]"
          style={{
            background: phase === 'dormant' 
              ? 'transparent' 
              : `radial-gradient(circle, hsl(${theme.palette.primary} / 0.15) 0%, transparent 60%)`
          }}
        />
        
        {/* Subtle texture or border to define the "altar" area */}
        <div className="absolute inset-4 border border-[#C8A66A]/5 rounded-[3rem]" />
      </div>

      {/* Particles */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {theme.particles.symbols.map((sym, i) => (
              <motion.span
                key={`p-${i}`}
                initial={{ 
                  opacity: 0, 
                  x: Math.random() * 100 - 50 + "%", 
                  y: theme.particles.style === 'ascendant' ? "120%" : "-20%" 
                }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  y: theme.particles.style === 'ascendant' ? "-20%" : "120%",
                  x: (Math.random() * 20 - 10) + "%"
                }}
                transition={{ 
                  duration: 5 + Math.random() * 5, 
                  repeat: Infinity, 
                  delay: i * 0.5,
                  ease: "linear"
                }}
                className="absolute text-sm"
                style={{ 
                  color: `hsl(${theme.palette.primary} / 0.3)`,
                  left: `${10 + Math.random() * 80}%`
                }}
              >
                {sym}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center mb-12 z-20"
      >
        <span className="text-[11px] font-heading font-bold tracking-[0.5em] uppercase text-[#C8A66A] block mb-3 opacity-80">
          {arcanoId === 0 ? "O Início da Jornada" : `Arcano ${arcanoId}`}
        </span>
        <h2 className="text-4xl md:text-5xl font-heading text-[#5B1F3D] font-black tracking-tighter">
          {cardName}
        </h2>
      </motion.div>

      {/* The Animated Card - Bigger & More Presence */}
      <div className="relative z-10 mb-12 transition-transform duration-1000">
        <TarotAnimatedCard
          cardImage={cardImage}
          cardName={cardName}
          arcanoId={arcanoId}
          arcanoSlug={arcanoSlug}
          state={phase === 'dormant' ? 'available' : 'active'}
          variant="portal"
          className="scale-[1.2] sm:scale-[1.4] md:scale-[1.5] drop-shadow-[0_25px_50px_rgba(91,31,61,0.25)]"
        />
        
        {/* Ritualistic Floor Reflection */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'presence' || phase === 'insight' ? 0.3 : 0 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#C8A66A] blur-2xl rounded-full"
        />
      </div>

      {/* Microcopy & CTA */}
      <div className="max-w-xs md:max-w-md w-full text-center z-20 min-h-[160px] flex flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {phase === 'insight' || phase === 'presence' ? (
            <motion.div
              key="insight-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <p className="font-accent italic text-xl md:text-2xl text-[#5B1F3D] mb-8 leading-relaxed max-w-[280px] md:max-w-xs">
                "{phase === 'insight' ? theme.microcopy.presence : theme.microcopy.intro}"
              </p>
              
              {phase === 'insight' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                >
                  <Button
                    onClick={onContinue}
                    className="bg-[#5B1F3D] hover:bg-[#4A1932] text-white rounded-full px-10 py-7 text-sm font-heading font-black tracking-widest uppercase border-2 border-[#C8A66A]/40 shadow-xl group transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Começar Lição
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <p className="mt-4 text-[10px] font-heading font-bold text-[#C8A66A] tracking-[0.2em] uppercase opacity-70">
                    Toque para despertar o conhecimento
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dormant-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-[12px] font-heading font-bold tracking-[0.3em] uppercase text-[#5B1F3D]"
            >
              O portal está despertando...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
  );
};
