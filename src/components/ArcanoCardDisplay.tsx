import { useState, useEffect } from "react";
import { getDeckEntry, getCanonicalNumeral } from "@/registry/deck-registry";

interface ArcanoCardDisplayProps {
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  cardImage: string;
  /** Número do arcano (0-21) — usado para travar imagem/numeral pelo registry oficial */
  number?: number;
}

export function ArcanoCardDisplay({ name, numeral, subtitle, keywords, cardImage, number }: ArcanoCardDisplayProps) {
  // DECK OFICIAL: se temos o número, registry é a fonte de verdade — impede imagem/numeral trocados.
  const deckEntry = number !== undefined ? getDeckEntry(number) : undefined;
  const finalImage = deckEntry?.cardImage ?? cardImage;
  const finalNumeral = deckEntry?.numeral ?? (number !== undefined ? getCanonicalNumeral(number) : numeral);
  const isPlaceholder = deckEntry?.assetStatus === "placeholder";
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Card frame */}
      <div
        className={`relative transition-all duration-1000 ${
          revealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Outer glow (static) */}
        <div
          className="absolute -inset-3 rounded-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, hsl(36 45% 58% / 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Card */}
        <div
          className="relative w-44 h-64 md:w-52 md:h-72 rounded-2xl overflow-hidden"
          style={{
            border: "2px solid hsl(36 45% 58% / 0.35)",
            boxShadow:
              "0 12px 40px hsl(36 45% 58% / 0.12), 0 0 60px hsl(42 70% 80% / 0.06), inset 0 1px 0 hsl(36 45% 58% / 0.2)",
          }}
        >
          <img
            src={finalImage}
            alt={`${finalNumeral} — ${name} (Rider-Waite-Smith)`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Bottom gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, hsl(230 25% 8% / 0.78) 0%, hsl(230 25% 8% / 0.25) 35%, transparent 65%)",
            }}
          />

          {/* Top numeral overlay — fonte CANÔNICA, nunca confiamos no que está gravado na imagem */}
          <div className="absolute top-2 left-0 right-0 text-center pointer-events-none">
            <span
              className="inline-block px-2 py-0.5 font-heading text-[10px] tracking-[0.35em] rounded-sm"
              style={{
                color: "hsl(42 70% 80%)",
                background: "hsl(230 25% 8% / 0.55)",
                border: "1px solid hsl(36 45% 58% / 0.25)",
              }}
            >
              {finalNumeral}
            </span>
          </div>

          {/* Placeholder: nome estilizado no centro */}
          {isPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
              <p
                className="font-heading text-center text-lg md:text-xl tracking-[0.18em] uppercase"
                style={{ color: "hsl(42 70% 80% / 0.85)", textShadow: "0 2px 12px hsl(230 25% 8% / 0.8)" }}
              >
                {name}
              </p>
            </div>
          )}

          {/* Card label — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
            <p
              className="font-heading text-xs tracking-[0.25em] mb-0.5"
              style={{ color: "hsl(42 70% 80%)" }}
            >
              {finalNumeral}
            </p>
            <h2
              className="font-heading text-base tracking-wide"
              style={{ color: "hsl(36 33% 95%)" }}
            >
              {name}
            </h2>
          </div>
        </div>

        {/* Decorative corner dots */}
        {[
          "top-0 left-0 -translate-x-1 -translate-y-1",
          "top-0 right-0 translate-x-1 -translate-y-1",
          "bottom-0 left-0 -translate-x-1 translate-y-1",
          "bottom-0 right-0 translate-x-1 translate-y-1",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
            style={{
              background: "hsl(36 45% 58% / 0.4)",
              animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Subtitle */}
      <p
        className="mt-4 text-xs font-heading tracking-[0.2em] uppercase"
        style={{ color: "hsl(36 40% 42%)" }}
      >
        {subtitle}
      </p>

      {/* Keywords */}
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "hsl(36 45% 58% / 0.08)",
              border: "1px solid hsl(36 45% 58% / 0.18)",
              color: "hsl(36 40% 35%)",
            }}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
