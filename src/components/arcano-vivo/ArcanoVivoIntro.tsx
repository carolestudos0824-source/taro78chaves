import { useState, useEffect, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getArcanoVivoConfig, type ArcanoVivoConfig } from "@/config/arcano-vivo";
import { ArcanoVivoAnimatedCard } from "@/components/arcano-vivo/ArcanoVivoAnimatedCard";
import { motion, AnimatePresence } from "framer-motion";

interface ArcanoVivoIntroProps {
  arcanoId: number;
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  cardImage: string;
  archetype: string;
  voiceIntro: string;
  voiceFullText: string;
  onEnterLesson: () => void;
}

type Phase = "darkness" | "reveal" | "awaken" | "shimmer" | "breathe" | "emerge" | "symbols" | "voice" | "ready";

/**
 * ARCANO VIVO v2 — Intro Cinematográfica com Animações Vivas
 * 
 * Fases:
 * 1. darkness   — tela escura, silêncio
 * 2. reveal     — carta emerge das sombras
 * 3. awaken     — saturação aumenta, brilho cresce
 * 4. shimmer    — varredura de luz sobre a carta
 * 5. breathe    — aura começa a pulsar, partículas surgem, carta "respira"
 * 6. emerge     — arcano "sai" da carta (perspective + translateZ)
 * 7. symbols    — spotlights iluminam símbolos-chave sequencialmente
 * 8. voice      — arcano fala em primeira pessoa
 * 9. ready      — CTA para iniciar lição
 */
export function ArcanoVivoIntro({
  arcanoId, name, numeral, subtitle, keywords, cardImage,
  archetype, voiceIntro, voiceFullText, onEnterLesson,
}: ArcanoVivoIntroProps) {
  const config = useMemo(() => getArcanoVivoConfig(arcanoId), [arcanoId]);
  const [phase, setPhase] = useState<Phase>("darkness");
  const [voiceMode, setVoiceMode] = useState<"intro" | "full">("intro");
  const [charIndex, setCharIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);
  const [activeSpotlight, setActiveSpotlight] = useState(-1);
  const [showSpotlightLabel, setShowSpotlightLabel] = useState(false);

  const activeText = voiceMode === "full" ? voiceFullText : voiceIntro;
  const typingDone = charIndex >= activeText.length;

  // Phase progression
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setPhase("reveal"), 400));
    timers.push(setTimeout(() => setPhase("awaken"), config.awakenDelay + 400));
    timers.push(setTimeout(() => setPhase("shimmer"), config.shimmerDelay + 400));
    timers.push(setTimeout(() => {
      setPhase("breathe");
      setParticlesVisible(true);
    }, config.shimmerDelay + 1200));
    
    // Emergence phase
    if (config.emergenceStyle !== "none") {
      timers.push(setTimeout(() => setPhase("emerge"), config.emergenceDelay));
      
      // Symbols phase — sequential spotlights
      if (config.symbolSpotlights && config.symbolSpotlights.length > 0) {
        const symbolStart = config.emergenceDelay + 1500;
        timers.push(setTimeout(() => setPhase("symbols"), symbolStart));
        
        config.symbolSpotlights.forEach((spot, i) => {
          timers.push(setTimeout(() => {
            setActiveSpotlight(i);
            setShowSpotlightLabel(true);
            // Tempo mínimo de leitura por símbolo: 4.2s (antes 2s — não dava tempo de ler)
            timers.push(setTimeout(() => setShowSpotlightLabel(false), 4200));
          }, symbolStart + spot.delay));
        });

        // Voice phase after all symbols — espera a última legenda terminar de ser lida
        const lastDelay = config.symbolSpotlights[config.symbolSpotlights.length - 1].delay;
        timers.push(setTimeout(() => {
          setPhase("voice");
          setActiveSpotlight(-1);
        }, symbolStart + lastDelay + 4800));
      } else {
        timers.push(setTimeout(() => setPhase("voice"), config.emergenceDelay + 2500));
      }
    } else {
      timers.push(setTimeout(() => setPhase("voice"), config.shimmerDelay + 2200));
    }

    return () => timers.forEach(clearTimeout);
  }, [config]);

  // Typewriter
  useEffect(() => {
    if (phase !== "voice" && phase !== "ready") return;
    if (charIndex >= activeText.length) {
      if (phase === "voice") setPhase("ready");
      return;
    }
    // Velocidade de digitação confortável: ~25 cps base, +30% para textos longos
    const baseSpeed = config.voiceStyle === "mystical" ? 42 : config.voiceStyle === "gentle" ? 38 : 34;
    const t = setTimeout(() => setCharIndex(i => i + 1), baseSpeed);
    return () => clearTimeout(t);
  }, [phase, charIndex, activeText, config.voiceStyle]);

  useEffect(() => {
    setCharIndex(0);
    if (phase === "ready") setPhase("voice");
  }, [voiceMode]);

  const handleListen = () => {
    if (isListening) {
      window.speechSynthesis?.cancel();
      setIsListening(false);
      return;
    }
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(activeText);
      u.lang = "pt-BR";
      u.rate = config.voiceStyle === "mystical" ? 0.75 : 0.85;
      u.pitch = config.voiceStyle === "mystical" ? 0.8 : 0.9;
      u.onend = () => setIsListening(false);
      window.speechSynthesis.speak(u);
      setIsListening(true);
    }
  };

  const skipAll = () => {
    setPhase("voice");
    setParticlesVisible(true);
    setActiveSpotlight(-1);
    setCharIndex(0);
  };

  const skipTyping = () => setCharIndex(activeText.length);

  const isRevealed = phase !== "darkness";
  const isAwakened = !["darkness", "reveal"].includes(phase);
  const isShimmering = phase === "shimmer";
  const isBreathing = !["darkness", "reveal", "awaken", "shimmer"].includes(phase);
  const isEmerged = !["darkness", "reveal", "awaken", "shimmer", "breathe"].includes(phase);
  const showSymbols = phase === "symbols";
  const showVoice = ["voice", "ready"].includes(phase);

  return (
    <div
      className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ "--arcano-glow": config.glowColor } as React.CSSProperties}
    >
      {/* Skip button — always visible during animation phases */}
      {!showVoice && phase !== "darkness" && phase !== "ready" && (
        <button
          onClick={skipAll}
          className="absolute top-4 right-4 z-20 text-[10px] font-heading tracking-wider px-3 py-1.5 rounded-full transition-opacity"
          style={{
            color: "hsl(230 10% 55%)",
            background: "hsl(36 33% 97% / 0.5)",
            border: "1px solid hsl(36 25% 82% / 0.3)",
          }}
        >
          Pular animação →
        </button>
      )}

      {/* Atmosphere gradient layers */}
      {config.atmosphere.map((stop, i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none transition-opacity duration-[2s]"
          style={{
            background: `radial-gradient(ellipse at ${i === 0 ? "50% 30%" : i === 1 ? "30% 70%" : "70% 50%"}, ${stop} 0%, transparent 65%)`,
            opacity: isBreathing ? 1 : 0,
          }}
        />
      ))}

      {/* Energy flow overlay */}
      {isBreathing && (
        <div
          className="absolute inset-0 pointer-events-none arcano-vivo-energy"
          style={{
            background: config.energyFlow === "upward"
              ? `linear-gradient(to top, hsl(${config.glowColor} / 0.06) 0%, transparent 40%, hsl(${config.ambientColor} / 0.03) 80%, transparent 100%)`
              : config.energyFlow === "downward"
              ? `linear-gradient(to bottom, hsl(${config.glowColor} / 0.06) 0%, transparent 40%, hsl(${config.ambientColor} / 0.03) 80%, transparent 100%)`
              : `radial-gradient(ellipse at 50% 50%, hsl(${config.glowColor} / 0.06) 0%, transparent 50%)`,
            animation: `arcano-energy-flow ${config.breatheSpeed * 3}s ease-in-out infinite`,
            backgroundSize: "200% 200%",
          }}
        />
      )}

      {/* Floating particles */}
      {particlesVisible && (
        <ParticleField particles={config.particles} intensity={config.intensity} glowColor={config.glowColor} />
      )}

      {/* Orbiting symbols */}
      {isBreathing && config.orbitSymbols && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {config.orbitSymbols.map((sym, i) => (
            <span
              key={i}
              className="absolute arcano-vivo-symbol"
              style={{
                "--orbit-radius": `${130 + i * 30}px`,
                animation: `arcano-symbol-orbit ${18 + i * 8}s linear infinite`,
                animationDelay: `${i * 3}s`,
                color: `hsl(${config.glowColor} / 0.25)`,
                fontSize: "14px",
              } as React.CSSProperties}
            >
              {sym}
            </span>
          ))}
        </div>
      )}

      {/* Aura emanation rings */}
      {isEmerged && (
        <>
          {[0, 1, 2].map((i) => (
            <div
              key={`emanation-${i}`}
              className="absolute arcano-vivo-emanation rounded-full pointer-events-none"
              style={{
                width: "240px",
                height: "340px",
                left: "50%",
                top: "calc(50% - 60px)",
                transform: "translate(-50%, -50%)",
                border: `1px solid hsl(${config.glowColor} / 0.15)`,
                animation: `arcano-aura-emanate ${3 + i * 0.8}s ease-out infinite`,
                animationDelay: `${i * 1}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Card identity ABOVE the card — numeral + nome fora da arte para protagonismo total */}
      <div
        className="text-center mb-5 sm:mb-6 transition-all duration-1000"
        style={{ opacity: isAwakened ? 1 : 0, transform: isAwakened ? "translateY(0)" : "translateY(-8px)" }}
      >
        <p
          className="font-heading text-[11px] sm:text-xs tracking-[0.45em] mb-2"
          style={{ color: `hsl(${config.glowColor})` }}
        >
          {numeral}
        </p>
        <h1
          className="font-heading text-2xl sm:text-3xl tracking-wide"
          style={{ color: "hsl(36 38% 22%)" }}
        >
          {name}
        </h1>
      </div>

      <div className="w-full max-w-[280px] sm:max-w-xs">
        <ArcanoVivoAnimatedCard
          arcanoId={arcanoId}
          name={name}
          cardImage={cardImage}
          phase={phase}
          activeSpotlight={activeSpotlight}
          showSymbols={showSymbols}
        />
      </div>



      {/* Spotlight label — FORA da carta, em área dedicada abaixo. Reserva altura fixa para evitar saltos de layout. */}
      <div className="mt-5 min-h-[60px] flex items-center justify-center w-full max-w-sm px-2">
        {showSymbols && activeSpotlight >= 0 && showSpotlightLabel && config.symbolSpotlights?.[activeSpotlight] && (
          <div
            className="px-4 py-2.5 rounded-xl text-[12px] sm:text-[13px] font-heading tracking-wide text-center"
            style={{
              background: `hsl(${config.symbolSpotlights[activeSpotlight].color} / 0.08)`,
              color: `hsl(${config.symbolSpotlights[activeSpotlight].color})`,
              border: `1px solid hsl(${config.symbolSpotlights[activeSpotlight].color} / 0.30)`,
              animation: "arcano-voice-emerge 0.4s ease-out",
              lineHeight: "1.5",
            }}
          >
            {config.symbolSpotlights[activeSpotlight].label}
          </div>
        )}
      </div>

      {/* Subtitle & keywords — abaixo da carta, hierarquia clara */}
      <div
        className="mt-6 sm:mt-8 text-center transition-all duration-700 max-w-md px-2"
        style={{ opacity: isAwakened ? 1 : 0, transform: isAwakened ? "translateY(0)" : "translateY(8px)" }}
      >
        <p className="text-[10px] sm:text-[11px] font-heading tracking-[0.4em] uppercase mb-3 sm:mb-4" style={{ color: "hsl(36 38% 36% / 0.85)" }}>
          {subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium tracking-wide"
              style={{
                background: `hsl(${config.glowColor} / 0.10)`,
                border: `1px solid hsl(${config.glowColor} / 0.22)`,
                color: "hsl(36 38% 30%)",
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Archetype — bloco editorial com respiro generoso */}
      <p
        className="mt-5 sm:mt-6 text-center text-[15px] sm:text-base font-accent italic leading-[1.7] max-w-sm px-4 transition-all duration-700"
        style={{ color: "hsl(230 22% 22% / 0.82)", opacity: isBreathing ? 1 : 0 }}
      >
        {archetype}
      </p>

      {/* Voice section */}
      <AnimatePresence>
        {showVoice && (
          <motion.div 
            className="mt-8 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(${config.glowColor} / 0.3), transparent)` }} />
              <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: `hsl(${config.glowColor} / 0.7)` }}>
                A voz do arcano
              </span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(${config.glowColor} / 0.3), transparent)` }} />
            </div>

            {/* Quote card */}
            <div
              className="relative rounded-2xl p-5 sm:p-6"
              style={{
                background: "linear-gradient(135deg, hsl(36 33% 97% / 0.9), hsl(38 30% 94% / 0.95))",
                border: `1px solid hsl(${config.glowColor} / 0.25)`,
                boxShadow: `0 8px 32px hsl(${config.glowColor} / 0.08), inset 0 1px 0 hsl(${config.glowColor} / 0.12)`,
              }}
            >
              <span className="absolute top-2 left-3 text-xl font-accent select-none" style={{ color: `hsl(${config.glowColor} / 0.2)` }}>"</span>
              <span className="absolute bottom-2 right-3 text-xl font-accent select-none" style={{ color: `hsl(${config.glowColor} / 0.2)` }}>"</span>

              <p
                className="font-accent text-base sm:text-lg leading-relaxed italic whitespace-pre-line min-h-[60px]"
                style={{ color: "hsl(230 28% 14%)" }}
              >
                {activeText.substring(0, charIndex)}
                {!typingDone && (
                  <motion.span
                    className="inline-block w-0.5 h-5 ml-0.5 align-middle"
                    style={{ background: `hsl(${config.glowColor})` }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </p>

              {/* Controls */}
              <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: `1px solid hsl(${config.glowColor} / 0.12)` }}>
                <span className="text-[10px] font-heading tracking-[0.2em] uppercase" style={{ color: `hsl(${config.glowColor} / 0.7)` }}>
                  — {name}
                </span>
                <div className="flex items-center gap-2">
                  {!typingDone && (
                    <button onClick={skipTyping} className="text-[10px] font-heading tracking-wider px-2 py-1 rounded-full" style={{ color: "hsl(230 10% 50%)" }}>
                      Revelar
                    </button>
                  )}
                  {typingDone && voiceMode === "intro" && (
                    <button
                      onClick={() => setVoiceMode("full")}
                      className="text-[10px] font-heading tracking-wider px-2 py-1 rounded-full"
                      style={{ color: `hsl(${config.glowColor})` }}
                    >
                      Ler mais
                    </button>
                  )}
                  <button
                    onClick={handleListen}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: `hsl(${config.glowColor} / ${isListening ? 0.15 : 0.08})`,
                      border: `1px solid hsl(${config.glowColor} / ${isListening ? 0.4 : 0.2})`,
                    }}
                    title={isListening ? "Parar" : "Ouvir o Arcano"}
                  >
                    {isListening ? (
                      <VolumeX className="w-3.5 h-3.5" style={{ color: `hsl(${config.glowColor})` }} />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" style={{ color: `hsl(${config.glowColor})` }} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <AnimatePresence>
        {phase === "ready" && typingDone && (
          <motion.div 
            className="mt-8 flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={onEnterLesson}
              className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, hsl(36 40% 42%), hsl(${config.glowColor}))`,
                color: "hsl(36 33% 97%)",
                boxShadow: `0 4px 24px hsl(${config.glowColor} / 0.25), 0 0 40px hsl(${config.ambientColor} / 0.08)`,
              }}
            >
              ✦ Começar a Lição
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Particle Field Component ───

function ParticleField({ particles, intensity, glowColor }: { particles: string[]; intensity: ArcanoVivoConfig["intensity"]; glowColor: string }) {
  const count = intensity === "intense" ? 14 : intensity === "moderate" ? 9 : 5;

  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const symbol = particles[i % particles.length];
      const x = 5 + Math.random() * 90;
      const y = 5 + Math.random() * 90;
      const driftX = (Math.random() - 0.5) * 50;
      const duration = 4 + Math.random() * 8;
      const delay = Math.random() * 6;
      const size = 7 + Math.random() * 8;
      const useFloat = Math.random() > 0.4;

      return { symbol, x, y, driftX, duration, delay, size, useFloat };
    });
  }, [particles, count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute arcano-vivo-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: `hsl(${glowColor} / 0.35)`,
            "--drift-x": `${p.driftX}px`,
            animation: `${p.useFloat ? "particle-float" : "particle-drift"} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
