import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotAnimatedCard } from "./TarotAnimatedCard";
import { getArcanoTheme } from "./arcano-motion-themes";
import { portalReveal, auraAwaken } from "./motion-presets";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { ChevronRight, AlertTriangle } from "lucide-react";
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
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setPhase('awakening'), 400));
    timers.push(setTimeout(() => setPhase('presence'), 1200));
    timers.push(setTimeout(() => setPhase('insight'), 2200));

    return () => {
      mountedRef.current = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const showParticles = (phase === 'presence' || phase === 'insight') && !shouldReduceMotion;

  // 4. Criar uma única variável para o texto visível:
  const safeVisibleIntroText = useMemo(() => {
    // Tenta pegar o texto das props (fala em primeira pessoa / pedagógico)
    const editorialText = presenceText || introText || "";

    // Regra de segurança: Arcano Id != 0 não pode ter texto do Louco
    if (arcanoId !== 0 && (editorialText.toLowerCase().includes("eu sou o louco") || editorialText.toLowerCase().includes("o impulso antes da certeza"))) {
      console.error("[LOUCO LEAK BLOCKED]", {
        arcanoId,
        cardName,
        editorialText,
      });

      // Fallback específico para Enamorados se falhar
      if (arcanoId === 6) {
        return "Nós somos Os Enamorados. Somos a encruzilhada onde o coração precisa escolher.";
      }
      return "";
    }

    // Se estiver vazio e for arcano 6, garante o texto dos Enamorados
    if (arcanoId === 6 && !editorialText) {
      return "Nós somos Os Enamorados. Somos a encruzilhada onde o coração precisa escolher.";
    }

    return editorialText;
  }, [arcanoId, presenceText, introText, cardName]);

  const isLoucoLeakDetected = useMemo(() => {
    if (arcanoId === 0) return false;
    return safeVisibleIntroText.toLowerCase().includes("louco");
  }, [arcanoId, safeVisibleIntroText]);

  return (
    <div className="relative min-h-[50vh] md:min-h-[80vh] flex flex-col items-center justify-center py-4 md:py-16 px-6 sm:px-12">
      {/* DEBUG PANEL - Visible only in preview/dev for validation */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="fixed top-20 left-4 z-[9999] bg-black/90 text-white p-4 rounded-xl text-[10px] font-mono border border-red-500 max-w-[300px] shadow-2xl pointer-events-none opacity-90">
          <div className="text-red-500 font-bold mb-1 border-b border-red-500/30 pb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> DOM LEAK CHECK
          </div>
          <p><span className="text-gray-400">matchingText:</span> {document.body.innerText.includes("Eu sou o Louco") ? "LEAK DETECTED" : "NENHUM"}</p>
          <p><span className="text-gray-400">componentOwner:</span> ArcanoVivoStage</p>
          <p><span className="text-gray-400">sourceField:</span> {phase === 'insight' ? 'presenceText/microcopy.presence' : 'introText/microcopy.intro'}</p>
          <p><span className="text-gray-400">sourceFile:</span> ArcanoVivoStage.tsx</p>
          <p><span className="text-gray-400">renderedText:</span> {safeVisibleIntroText}</p>
          <p><span className="text-gray-400">isLoucoLeakDetected (logic):</span> {isLoucoLeakDetected ? "SIM" : "NÃO"}</p>
          <p><span className="text-gray-400">arcanoId:</span> {arcanoId}</p>
          <p><span className="text-gray-400">introText (prop):</span> {introText?.substring(0, 30)}</p>
          <p><span className="text-gray-400">presenceText (prop):</span> {presenceText?.substring(0, 30)}</p>
        </div>
      )}

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
              <p 
                className="font-accent italic text-xl md:text-3xl text-[#5B1F3D] mb-6 md:mb-10 leading-relaxed font-bold tracking-tight"
                data-rendered-text={safeVisibleIntroText}
                data-arcano-id={arcanoId}
              >
                "{safeVisibleIntroText}"
              </p>
              
              {arcanoId !== 0 && safeVisibleIntroText.toLowerCase().includes("louco") && (
                <div style={{ color: "red", fontWeight: "bold" }}>
                  ERRO: VAZAMENTO DO LOUCO NO ARCANO {arcanoId}
                </div>
              )}
              
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