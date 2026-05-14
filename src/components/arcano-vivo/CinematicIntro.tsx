import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface CinematicIntroProps {
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

/**
 * Phase 1: Cinematic Intro
 * - Full-screen card reveal with breathing glow
 * - Voice of the arcanum in first person (typewriter + TTS)
 * - "Ouvir" and "Ler" toggle
 * - Elegant CTA to start lesson
 */
export function CinematicIntro({
  name, numeral, subtitle, keywords, cardImage, archetype,
  voiceIntro, voiceFullText, onEnterLesson,
}: CinematicIntroProps) {
  const [revealed, setRevealed] = useState(false);
  const [voicePhase, setVoicePhase] = useState<"idle" | "intro" | "full">("idle");
  const [isListening, setIsListening] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const activeText = voicePhase === "full" ? voiceFullText : voiceIntro;

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    const t2 = setTimeout(() => setVoicePhase("intro"), 1200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Typewriter
  useEffect(() => {
    if (voicePhase === "idle") return;
    setCharIndex(0);
  }, [voicePhase]);

  useEffect(() => {
    if (voicePhase === "idle") return;
    if (charIndex >= activeText.length) return;
    const t = setTimeout(() => setCharIndex(i => i + 1), 22);
    return () => clearTimeout(t);
  }, [charIndex, activeText, voicePhase]);

  const displayed = activeText.substring(0, charIndex);
  const typingDone = charIndex >= activeText.length;

  const handleListen = () => {
    if (isListening) {
      window.speechSynthesis?.cancel();
      setIsListening(false);
      return;
    }
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(activeText);
      utterance.lang = "pt-BR";
      utterance.rate = 0.85;
      utterance.pitch = 0.9;
      utterance.onend = () => setIsListening(false);
      window.speechSynthesis.speak(utterance);
      setIsListening(true);
    }
  };

  const skipTyping = () => setCharIndex(activeText.length);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, hsl(36 45% 58% / 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Card reveal */}
      <div className={`relative transition-all duration-[1.5s] ease-out ${
        revealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
      }`}>
        {/* Outer glow (static) */}
        <div
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, hsl(36 45% 58% / 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Card */}
        <div
          className="relative w-48 h-72 sm:w-56 sm:h-80 rounded-2xl overflow-hidden"
          style={{
            border: "2px solid hsl(36 45% 58% / 0.40)",
            boxShadow: "0 16px 48px hsl(36 45% 58% / 0.15), 0 0 80px hsl(42 70% 80% / 0.08), inset 0 1px 0 hsl(36 45% 58% / 0.25)",
          }}
        >
          <img src={cardImage} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, hsl(230 25% 6% / 0.75) 0%, hsl(230 25% 8% / 0.2) 35%, transparent 65%)",
          }} />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <p className="font-heading text-[10px] tracking-[0.35em] mb-1" style={{ color: "hsl(42 70% 80%)" }}>{numeral}</p>
            <h1 className="font-heading text-lg tracking-wide" style={{ color: "hsl(36 33% 95%)" }}>{name}</h1>
          </div>
        </div>

        {/* Corner ornaments */}
        {[
          "top-0 left-0 -translate-x-1.5 -translate-y-1.5",
          "top-0 right-0 translate-x-1.5 -translate-y-1.5",
          "bottom-0 left-0 -translate-x-1.5 translate-y-1.5",
          "bottom-0 right-0 translate-x-1.5 translate-y-1.5",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
            style={{
              background: "hsl(36 45% 58% / 0.5)",
            }}
          />
        ))}
      </div>

      {/* Subtitle & keywords */}
      <div className={`mt-6 text-center transition-all duration-700 delay-500 ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <p className="text-[10px] font-heading tracking-[0.3em] uppercase mb-3" style={{ color: "hsl(36 40% 42%)" }}>{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {keywords.map((kw) => (
            <span key={kw} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                background: "hsl(36 45% 58% / 0.08)",
                border: "1px solid hsl(36 45% 58% / 0.18)",
                color: "hsl(36 40% 35%)",
              }}
            >{kw}</span>
          ))}
        </div>
      </div>

      {/* Archetype */}
      <p className={`mt-4 text-center text-xs font-accent italic leading-relaxed max-w-xs transition-all duration-700 delay-700 ${
        revealed ? "opacity-100" : "opacity-0"
      }`} style={{ color: "hsl(230 20% 25% / 0.60)" }}>
        {archetype}
      </p>

      {/* Voice section */}
      {voicePhase !== "idle" && (
        <div className="mt-8 w-full max-w-md" style={{ animation: "fade-up 0.8s ease-out" }}>
          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.3), transparent)" }} />
            <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(36 40% 42% / 0.7)" }}>A voz do arcano</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.3), transparent)" }} />
          </div>

          {/* Quote card */}
          <div className="relative rounded-2xl p-5 sm:p-6" style={{
            background: "linear-gradient(135deg, hsl(36 33% 97% / 0.9), hsl(38 30% 94% / 0.95))",
            border: "1px solid hsl(36 45% 58% / 0.25)",
            boxShadow: "0 8px 32px hsl(36 45% 58% / 0.08), inset 0 1px 0 hsl(36 45% 58% / 0.12)",
          }}>
            <span className="absolute top-2 left-3 text-xl text-primary/20 font-accent select-none">"</span>
            <span className="absolute bottom-2 right-3 text-xl text-primary/20 font-accent select-none">"</span>

            <p className="font-accent text-sm sm:text-base leading-relaxed italic whitespace-pre-line min-h-[60px]"
              style={{ color: "hsl(230 25% 18%)" }}
            >
              {displayed}
              {!typingDone && (
                <span className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                  style={{ background: "hsl(36 45% 58%)", animation: "pulse-gold 1s ease-in-out infinite" }}
                />
              )}
            </p>

            {/* Controls */}
            <div className="mt-4 pt-3 flex items-center justify-between"
              style={{ borderTop: "1px solid hsl(36 45% 58% / 0.12)" }}
            >
              <span className="text-[10px] font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
                — {name}
              </span>
              <div className="flex items-center gap-2">
                {!typingDone && (
                  <button onClick={skipTyping} className="text-[10px] font-heading tracking-wider px-2 py-1 rounded-full transition-colors"
                    style={{ color: "hsl(230 10% 50%)" }}>
                    Revelar
                  </button>
                )}
                {typingDone && voicePhase === "intro" && (
                  <button onClick={() => { setVoicePhase("full"); setShowFullText(true); }}
                    className="text-[10px] font-heading tracking-wider px-2 py-1 rounded-full transition-colors"
                    style={{ color: "hsl(36 40% 42%)" }}>
                    Ler mais
                  </button>
                )}
                <button onClick={handleListen}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isListening ? "hsl(36 45% 58% / 0.15)" : "hsl(36 45% 58% / 0.08)",
                    border: `1px solid hsl(36 45% 58% / ${isListening ? "0.4" : "0.2"})`,
                  }}
                  title={isListening ? "Parar" : "Ouvir o Arcano"}
                >
                  {isListening ? (
                    <VolumeX className="w-3.5 h-3.5" style={{ color: "hsl(36 45% 58%)" }} />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" style={{ color: "hsl(36 45% 58%)" }} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      {typingDone && (
        <div className="mt-8 flex flex-col items-center gap-3" style={{ animation: "fade-up 0.5s ease-out" }}>
          <button
            onClick={onEnterLesson}
            className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
              color: "hsl(36 33% 97%)",
              boxShadow: "0 4px 24px hsl(36 45% 58% / 0.25), 0 0 40px hsl(42 70% 80% / 0.08)",
            }}
          >
            ✦ Começar a Lição
          </button>
        </div>
      )}
    </div>
  );
}
