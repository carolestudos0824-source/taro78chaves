import React, { useMemo } from "react";
import { getArcanoVivoConfig } from "@/config/arcano-vivo";

interface ArcanoVivoAnimatedCardProps {
  arcanoId: number;
  name: string;
  cardImage: string;
  phase: string;
  activeSpotlight: number;
  showSymbols: boolean;
}

export function ArcanoVivoAnimatedCard({
  arcanoId,
  name,
  cardImage,
  phase,
  activeSpotlight,
  showSymbols,
}: ArcanoVivoAnimatedCardProps) {
  const config = useMemo(() => getArcanoVivoConfig(arcanoId), [arcanoId]);

  const isRevealed = phase !== "darkness";
  const isAwakened = !["darkness", "reveal"].includes(phase);
  const isShimmering = phase === "shimmer";
  const isBreathing = !["darkness", "reveal", "awaken", "shimmer"].includes(phase);
  const isEmerged = !["darkness", "reveal", "awaken", "shimmer", "breathe"].includes(phase);

  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      {/* Outer aura (breathing) */}
      <div
        className="absolute -inset-12 rounded-[3rem] pointer-events-none arcano-vivo-aura transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse, hsl(${config.glowColor} / ${isBreathing ? 0.2 : 0}) 0%, transparent 75%)`,
          animation: isBreathing ? `arcano-breathe ${config.breatheSpeed}s ease-in-out infinite` : undefined,
        }}
      />

      {/* The card itself */}
      <div
        className="arcano-vivo-card relative w-64 h-[24rem] sm:w-80 sm:h-[30rem] rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000"
        style={{
          border: `2.5px solid hsl(${config.glowColor} / 0.5)`,
          transformStyle: "preserve-3d",
          animation: isRevealed
            ? isEmerged
              ? `arcano-float-gentle ${config.breatheSpeed * 1.2}s ease-in-out infinite`
              : isBreathing
              ? `arcano-living-breathe ${config.breatheSpeed}s ease-in-out infinite, arcano-border-glow ${config.breatheSpeed}s ease-in-out infinite`
              : "arcano-card-awaken 2s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            : "scale(0.9) opacity(0)",
          opacity: isRevealed ? 1 : 0,
          boxShadow: isEmerged
            ? `0 25px 80px hsl(${config.glowColor} / 0.3), 0 0 120px hsl(${config.ambientColor} / 0.15)`
            : `0 20px 60px hsl(${config.glowColor} / 0.2)`,
        }}
      >
        {/* Card image */}
        <img
          src={cardImage}
          alt={name}
          className="w-full h-full object-cover transition-all duration-[2.5s]"
          style={{
            filter: isAwakened
              ? isEmerged
                ? "brightness(1.1) saturate(1.15) contrast(1.05)"
                : "brightness(1) saturate(1)"
              : "brightness(0.3) saturate(0.2) contrast(0.8)",
          }}
        />

        {/* Shimmer sweep */}
        {isShimmering && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 25%, hsl(${config.glowColor} / 0.4) 50%, transparent 75%)`,
              animation: "arcano-shimmer-sweep 1.5s ease-in-out forwards",
            }}
          />
        )}

        {/* Symbol spotlights */}
        {config.symbolSpotlights?.map((spot, i) => {
          const isActive = showSymbols && i <= activeSpotlight;
          return (
            <div
              key={`spot-${i}`}
              className="absolute pointer-events-none rounded-full transition-opacity duration-1000"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.size * 1.2}px`,
                height: `${spot.size * 1.2}px`,
                opacity: isActive ? 0.6 : 0,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, hsl(${spot.color} / 0.6) 0%, transparent 70%)`,
                animation: isActive ? `arcano-symbol-pulse ${spot.duration}s ease-in-out infinite` : undefined,
              }}
            />
          );
        })}

        {/* Breath overlay */}
        {isBreathing && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at 50% 50%, hsl(${config.glowColor} / 0.1) 0%, transparent 80%)`,
              animation: `arcano-aura-pulse ${config.breatheSpeed}s ease-in-out infinite`,
            }}
          />
        )}
      </div>

      {/* Halo decoration */}
      {isBreathing && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full pointer-events-none opacity-20 blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, hsl(${config.glowColor}) 0%, transparent 70%)`,
            animationDuration: `${config.breatheSpeed * 2}s`,
          }}
        />
      )}
    </div>
  );
}
