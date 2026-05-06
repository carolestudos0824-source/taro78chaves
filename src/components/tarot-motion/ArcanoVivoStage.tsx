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
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden py-12 px-6">
      {/* Background Atmosphere */}
      <div 
        className="absolute inset-0 transition-all duration-[3000ms] pointer-events-none"
        style={{
          background: phase === 'dormant' 
            ? 'hsl(36 33% 97% / 0)' 
            : `radial-gradient(circle at center, hsl(${theme.palette.primary} / 0.15) 0%, transparent 70%)`
        }}
      />

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
                  opacity: [0, 0.5, 0],
                  y: theme.particles.style === 'ascendant' ? "-20%" : "120%",
                  x: (Math.random() * 20 - 10) + "%"
                }}
                transition={{ 
                  duration: 4 + Math.random() * 4, 
                  repeat: Infinity, 
                  delay: i * 0.5,
                  ease: "linear"
                }}
                className="absolute text-sm"
                style={{ 
                  color: `hsl(${theme.palette.primary} / 0.4)`,
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
        transition={{ delay: 0.5 }}
        className="text-center mb-8 z-20"
      >
        <span className="text-[10px] font-heading tracking-[0.4em] uppercase text-[#C8A66A] block mb-2">
          {arcanoId === 0 ? "O Início" : `Arcano ${arcanoId}`}
        </span>
        <h2 className="text-3xl font-heading text-[#5B1F3D]">
          {cardName}
        </h2>
      </motion.div>

      {/* The Animated Card */}
      <div className="relative z-10 mb-10">
        <TarotAnimatedCard
          cardImage={cardImage}
          cardName={cardName}
          arcanoId={arcanoId}
          arcanoSlug={arcanoSlug}
          state={phase === 'dormant' ? 'available' : 'active'}
          variant="portal"
          className="scale-110 sm:scale-125"
        />
      </div>

      {/* Microcopy & CTA */}
      <div className="max-w-xs w-full text-center z-20 min-h-[120px] flex flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {phase === 'insight' || phase === 'presence' ? (
            <motion.div
              key="insight-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <p className="font-accent italic text-lg text-[#5B1F3D]/80 mb-2">
                "{phase === 'insight' ? theme.microcopy.presence : theme.microcopy.intro}"
              </p>
              
              {phase === 'insight' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={onContinue}
                    className="bg-[#C8A66A] hover:bg-[#B69559] text-white rounded-full px-8 py-6 group"
                  >
                    Começar Lição
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dormant-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-[11px] font-heading tracking-widest uppercase text-[#5B1F3D]/50"
            >
              O portal está despertando...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
