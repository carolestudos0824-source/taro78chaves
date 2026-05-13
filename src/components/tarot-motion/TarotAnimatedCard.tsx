import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole, Key, CheckCircle2 } from "lucide-react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { cardBreathe, auraAwaken, portalReveal, unlockGlow } from "./motion-presets";
import { getArcanoTheme } from "./arcano-motion-themes";
import { cn } from "@/lib/utils";

interface TarotAnimatedCardProps {
  cardImage: string;
  cardName: string;
  arcanoId: number;
  arcanoSlug: string;
  state: 'locked' | 'available' | 'active' | 'inProgress' | 'completed';
  variant?: 'lesson' | 'portal' | 'unlock' | 'review' | 'daily';
  isPremium?: boolean;
  showLockIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TarotAnimatedCard: React.FC<TarotAnimatedCardProps> = ({
  cardImage,
  cardName,
  arcanoId,
  arcanoSlug: _arcanoSlug,
  state,
  variant = 'portal',
  isPremium = false,
  showLockIcon = true,
  onClick,
  className
}) => {
  const shouldReduceMotion = useReducedMotionSafe();
  const theme = getArcanoTheme(arcanoId);

  const isLocked = state === 'locked';
  const isAvailable = state === 'available';
  const isActive = state === 'active';
  const isInProgress = state === 'inProgress';
  const isCompleted = state === 'completed';

  const showAura = isActive || isAvailable || isInProgress;
  const showBreathe = isActive && !shouldReduceMotion;
  
  return (
    <motion.div
      variants={portalReveal}
      initial="hidden"
      animate="visible"
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        "relative cursor-pointer group select-none",
        isLocked && "cursor-not-allowed",
        className
      )}
    >
      {/* Background Aura */}
      <AnimatePresence>
        {showAura && (
          <motion.div
            variants={auraAwaken}
            initial="off"
            animate={isActive ? "pulse" : "on"}
            exit="off"
            className="absolute -inset-8 rounded-[3rem] blur-2xl pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle, hsl(${theme.aura.color} / 0.3) 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Card Container */}
      <motion.div
        variants={showBreathe ? cardBreathe : {}}
        animate={showBreathe ? "animate" : ""}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 transition-all duration-500 z-10",
          isActive ? "shadow-2xl" : "shadow-lg",
          isLocked ? "border-[#C8A66A]/10" : "border-[#C8A66A]/30",
          isPremium && "border-[#C8A66A] shadow-[#C8A66A]/20"
        )}
        style={{
          aspectRatio: "2/3.5",
          width: variant === 'portal' ? "140px" : "100%",
          maxWidth: "280px"
        }}
      >
        {/* Card Image */}
        <motion.img
          src={cardImage}
          alt={cardName}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLocked && (variant === 'lesson' ? "opacity-90 grayscale-[0.1] brightness-95" : "opacity-80 grayscale-[0.3] brightness-[0.9]"),
            isInProgress && "brightness-90 saturate-[0.8]",
            isAvailable && "brightness-100",
            isActive && "brightness-110 saturate-110"
          )}
        />

        {/* State Overlays */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {/* Soft Veil Overlay (Ameixa) */}
            <div className={cn(
              "absolute inset-0 bg-[#5B1F3D]/10 mix-blend-multiply",
              variant === 'lesson' ? "opacity-20" : "opacity-60"
            )} />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b from-transparent via-[#5B1F3D]/5 to-[#5B1F3D]/20",
              variant === 'lesson' ? "opacity-30" : "opacity-100"
            )} />
            
            {showLockIcon && (
              <div className="relative z-10 w-8 h-8 rounded-full bg-[#FAF5EF]/90 border border-[#C8A66A]/40 flex items-center justify-center shadow-lg backdrop-blur-sm">
                <LockKeyhole className="w-4 h-4 text-[#C8A66A]" />
              </div>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="absolute top-2 right-2 z-20">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-green-500/90 text-white p-1 rounded-full shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
            </motion.div>
          </div>
        )}

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-2 left-2 z-20">
            <motion.div
              variants={unlockGlow}
              animate="animate"
              className="bg-[#C8A66A] text-white px-1.5 py-0.5 rounded text-[8px] font-heading tracking-tighter uppercase shadow-md"
            >
              Premium
            </motion.div>
          </div>
        )}

        {/* Available indicator */}
        {isAvailable && showLockIcon && (
          <div className="absolute bottom-2 right-2 z-20">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-[#C8A66A]/80 p-1.5 rounded-full backdrop-blur-sm"
            >
              <Key className="w-3 h-3 text-white" />
            </motion.div>
          </div>
        )}

        {/* Portal Overlay (Shadow/Gradient) */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none",
          variant === 'lesson' ? "opacity-30" : "opacity-60"
        )} />
        
        {/* Label - Hidden in lesson variant as it has external label */}
        {variant !== 'lesson' && (
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-center pointer-events-none bg-gradient-to-t from-[#5B1F3D]/80 to-transparent">
            <span className={cn(
              "text-[9px] sm:text-[10px] md:text-[11px] font-heading tracking-widest uppercase truncate block font-black",
              isLocked ? "text-[#FAF5EF]/90" : "text-white drop-shadow-md"
            )}>
              {cardName}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
