import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getArcanoVivoConfig } from "@/config/arcano-vivo";
import { LockKeyhole, Key } from "lucide-react";

interface ArcanoVivoAnimatedCardProps {
  arcanoId: number;
  name: string;
  cardImage: string;
  phase: string;
  activeSpotlight: number;
  showSymbols: boolean;
  status?: 'locked' | 'available' | 'inProgress' | 'completed';
}

export function ArcanoVivoAnimatedCard({
  arcanoId,
  name,
  cardImage,
  phase,
  activeSpotlight,
  showSymbols,
  status = 'available'
}: ArcanoVivoAnimatedCardProps) {
  const config = useMemo(() => getArcanoVivoConfig(arcanoId), [arcanoId]);
  const shouldReduceMotion = useReducedMotion();

  const isRevealed = phase !== "darkness";
  const isAwakened = !["darkness", "reveal"].includes(phase);
  const isShimmering = phase === "shimmer";
  const isBreathing = !["darkness", "reveal", "awaken", "shimmer"].includes(phase);
  const isEmerged = !["darkness", "reveal", "awaken", "shimmer", "breathe"].includes(phase);

  return (
    <motion.div 
      className="relative" 
      style={{ perspective: "1200px" }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={isRevealed ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Outer aura (static when revealed) */}
      <div
        className="absolute -inset-16 rounded-[4rem] pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle, hsl(${config.glowColor} / 0.25) 0%, transparent 75%)`,
          opacity: isBreathing ? 0.5 : 0,
        }}
      />

      {/* The card itself */}
      <div
        className="relative w-64 h-[24rem] sm:w-80 sm:h-[30rem] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          border: `2.5px solid hsl(${config.glowColor} / 0.5)`,
          transformStyle: "preserve-3d",
          boxShadow: isEmerged
            ? `0 25px 80px hsl(${config.glowColor} / 0.3), 0 0 120px hsl(${config.ambientColor} / 0.15)`
            : `0 20px 60px hsl(${config.glowColor} / 0.2)`,
        }}
      >
        {/* Card image */}
        <motion.img
          src={cardImage}
          alt={name}
          className="w-full h-full object-cover"
          initial={{ filter: "brightness(0.3) saturate(0.2) contrast(0.8)" }}
          animate={{
            filter: isAwakened
              ? isEmerged
                ? "brightness(1.1) saturate(1.15) contrast(1.05)"
                : "brightness(1) saturate(1)"
              : "brightness(0.3) saturate(0.2) contrast(0.8)",
          }}
          transition={{ duration: 2.5 }}
        />

        {/* Shimmer sweep */}
        {isShimmering && !shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 25%, hsl(${config.glowColor} / 0.4) 50%, transparent 75%)`,
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}

        {/* Symbol spotlights */}
        {config.symbolSpotlights?.map((spot, i) => {
          const isActive = showSymbols && i <= activeSpotlight;
          return (
            <motion.div
              key={`spot-${i}`}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.size * 1.5}px`,
                height: `${spot.size * 1.5}px`,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, hsl(${spot.color} / 0.7) 0%, transparent 70%)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isActive ? 0.8 : 0,
                scale: isActive ? 1 : 0 
              }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 0.4 }
              }}
            />
          );
        })}

        {/* Status Overlays */}
        {status === 'locked' && (
          <div className="absolute inset-0 bg-black/40 backdrop-grayscale flex items-center justify-center">
            <LockKeyhole className="w-16 h-16 text-white/50" />
          </div>
        )}
      </div>

      {/* Decorative Halo (static) */}
      {isBreathing && !shouldReduceMotion && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full pointer-events-none blur-3xl"
          style={{
            background: `radial-gradient(circle, hsl(${config.glowColor} / 0.15) 0%, transparent 70%)`,
            opacity: 0.2
          }}
        />
      )}
      
      {/* Key Glow (Subtle visual for "presence") */}
      {isEmerged && (
        <motion.div
          className="absolute bottom-4 right-4 z-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
            <Key className="w-6 h-6 text-[#C8A66A] drop-shadow-[0_0_8px_rgba(200,166,106,0.8)]" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
