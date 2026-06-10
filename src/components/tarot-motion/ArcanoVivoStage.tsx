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
  introText?: string;
  presenceText?: string;
}

export const ArcanoVivoStage: React.FC<ArcanoVivoStageProps> = ({
  arcanoId,
  cardName,
  cardImage,
  arcanoSlug,
  onContinue,
  introText,
  presenceText
}) => {
  const [phase, setPhase] = useState<'dormant' | 'awakening' | 'presence' | 'insight'>('dormant');
  const theme = getArcanoTheme(arcanoId);
  const shouldReduceMotion = useReducedMotionSafe();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setPhase('awakening'), 400));
    timers.push(setTimeout(() => setPhase('presence'), 1200));
    timers.push(setTimeout(() => setPhase('insight'), 2200));

    return () => timers.forEach(clearTimeout);
  }, []);

  const showParticles = (phase === 'presence' || phase === 'insight') && !shouldReduceMotion;

  return (
    <div className="relative min-h-[50vh] md:min-h-[80vh] flex flex-col items-center justify-center py-4 md:py-16 px-6 sm:px-12">
      {/* Background Atmosphere - Enhanced ritualistic altar feel */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Ivory Base */}
        <div className="absolute inset-0 bg-[#FAF5EF]" />
        
        {/* Central Glow - More intense on desktop */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square transition-all duration-[3000ms] blur-[140px] opacity-60"
          style={{
            background: phase === 'dormant' 
              ? 'transparent' 
              : `radial-gradient(circle, hsl(${theme.palette.primary} / 0.2) 0%, transparent 70%)`
          }}
        />
        
        {/* Subtle texture or border to define the "altar" area */}
        <div className="absolute inset-6 md:inset-12 border border-[#C8A66A]/10 rounded-[4rem] opacity-30" />
        
        {/* Decorative corner elements (ritualistic) */}
        <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-[#C8A66A]/20 rounded-tl-3xl hidden md:block" />
        <div className="absolute top-10 right-10 w-24 h-24 border-t border-r border-[#C8A66A]/20 rounded-tr-3xl hidden md:block" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border-b border-l border-[#C8A66A]/20 rounded-bl-3xl hidden md:block" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-[#C8A66A]/20 rounded-br-3xl hidden md:block" />
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
                  duration: 6 + Math.random() * 6, 
                  repeat: Infinity, 
                  delay: i * 0.5,
                  ease: "linear"
                }}
                className="absolute text-base"
                style={{ 
                  color: `hsl(${theme.palette.primary} / 0.35)`,
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
        transition={{ delay: 0.5, duration: 1.2 }}
        className="text-center mb-6 md:mb-12 z-20 relative"
      >
        <span className="text-[11px] font-heading font-bold tracking-[0.5em] uppercase text-[#C8A66A] block mb-3 opacity-90">
          {arcanoId === 0 ? "O Início da Jornada" : `Arcano ${arcanoId}`}
        </span>
        <h2 className="text-4xl md:text-7xl font-heading text-[#5B1F3D] font-black tracking-tighter drop-shadow-sm">
          {cardName}
        </h2>
        <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C8A66A]/40 to-transparent mx-auto mt-4 md:mt-6" />
      </motion.div>

      {/* The Animated Card - Dominant Presence */}
      <div className="relative z-10 mb-6 md:mb-12 transition-transform duration-1000">
        <TarotAnimatedCard
          cardImage={cardImage}
          cardName={cardName}
          arcanoId={arcanoId}
          arcanoSlug={arcanoSlug}
          state={phase === 'dormant' ? 'available' : 'active'}
          variant="portal"
          className="scale-[1.2] sm:scale-[1.5] md:scale-[1.7] lg:scale-[1.8] drop-shadow-[0_35px_60px_rgba(91,31,61,0.3)] min-h-[210px] min-w-[140px]"
        />
        
        {/* Ritualistic Floor Reflection */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'presence' || phase === 'insight' ? 0.4 : 0 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#C8A66A] blur-3xl rounded-full"
        />
      </div>

      {/* Microcopy & CTA */}
      <div className="max-w-xs md:max-w-xl w-full text-center z-20 min-h-[140px] flex flex-col items-center justify-start pb-16">
        <AnimatePresence mode="wait">
          {phase === 'insight' || phase === 'presence' ? (
            <motion.div
              key="insight-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center"
            >
              <p className="font-accent italic text-xl md:text-3xl text-[#5B1F3D] mb-6 md:mb-10 leading-relaxed font-bold tracking-tight">
                "{phase === 'insight' ? (presenceText || theme.microcopy.presence) : (introText || theme.microcopy.intro)}"
              </p>
              
              {phase === 'insight' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1, type: "spring", stiffness: 80 }}
                  className="space-y-6"
                >
                  <Button
                    onClick={onContinue}
                    className="bg-[#5B1F3D] hover:bg-[#4A1932] text-white rounded-full px-10 py-6 md:px-12 md:py-8 text-sm md:text-base font-heading font-black tracking-[0.2em] uppercase border-2 border-[#C8A66A]/50 shadow-2xl group transition-all duration-300 hover:scale-110 active:scale-95 ring-4 ring-[#5B1F3D]/10"
                  >
                    Começar Lição
                    <ChevronRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  
                  <p className="text-[11px] font-heading font-bold text-[#C8A66A] tracking-[0.3em] uppercase opacity-80 animate-pulse">
                    Toque para despertar o conhecimento
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dormant-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-[14px] font-heading font-bold tracking-[0.4em] uppercase text-[#5B1F3D] animate-pulse"
            >
              O portal está despertando...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
