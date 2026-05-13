import { useState } from "react";
import { ChevronDown, Sun, Moon, Lightbulb, Compass, Quote } from "lucide-react";
import type { QuickReviewSummary } from "@/lib/review/builders";

interface QuickReviewCardProps {
  review: QuickReviewSummary;
  isStudied: boolean;
}

export function QuickReviewCard({ review, isStudied }: QuickReviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: isStudied
          ? "linear-gradient(135deg, #FFFFFF 0%, #FDFBF7 100%)"
          : "rgba(243, 230, 224, 0.35)",
        border: isStudied
          ? "2px solid #C8A66A"
          : "1.5px solid #DCCFC260",
        backdropFilter: "blur(12px)",
        boxShadow: isStudied ? "0 10px 30px rgba(91, 31, 61, 0.05)" : "none",
        opacity: isStudied ? 1 : 0.85,
      }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => isStudied && setExpanded(!expanded)}
        disabled={!isStudied}
        className="w-full p-4 flex items-center gap-3 text-left transition-all duration-200"
      >
        {/* Numeral badge */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            border: isStudied ? "1.5px solid hsl(36 42% 45% / 0.35)" : "1px solid hsl(36 22% 75% / 0.40)",
            background: isStudied ? "hsl(38 28% 94% / 0.90)" : "hsl(36 18% 90% / 0.50)",
          }}
        >
          <span
            className="font-heading text-xs"
            style={{ color: isStudied ? "hsl(36 42% 40%)" : "hsl(230 10% 50% / 0.40)" }}
          >
            {review.numeral}
          </span>
        </div>

        {/* Name + keyword */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-heading text-sm tracking-wide"
            style={{ color: isStudied ? "hsl(230 20% 12% / 0.85)" : "hsl(230 10% 50% / 0.40)" }}
          >
            {review.name}
          </h3>
          <p
            className="text-[10px] font-accent italic truncate"
            style={{ color: isStudied ? "hsl(230 20% 15% / 0.50)" : "hsl(230 10% 50% / 0.25)" }}
          >
            {review.keyword}
          </p>
        </div>

        {/* Expand icon */}
        {isStudied && (
          <ChevronDown
            className="w-4 h-4 shrink-0 transition-transform duration-300"
            style={{
              color: "hsl(230 10% 50%)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}

        {!isStudied && (
          <span className="text-[9px] tracking-[0.2em] uppercase font-body shrink-0" style={{ color: "hsl(230 10% 50% / 0.30)" }}>
            Bloqueado
          </span>
        )}
      </button>

      {/* Expanded content */}
      {expanded && isStudied && (
        <div className="px-4 pb-5 space-y-3" style={{ animation: "fade-up 0.3s ease-out" }}>
          <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 50% / 0.20), transparent)" }} />

          {/* Light */}
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Sun className="w-4 h-4" style={{ color: "hsl(36 42% 45%)" }} />
            </div>
            <div>
              <span className="text-[9px] font-heading tracking-[0.25em] uppercase block mb-0.5" style={{ color: "hsl(36 42% 40%)" }}>
                Luz
              </span>
              <p className="text-[12px] leading-relaxed font-body" style={{ color: "hsl(230 20% 20% / 0.80)" }}>
                {review.light}
              </p>
            </div>
          </div>

          {/* Shadow */}
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Moon className="w-4 h-4" style={{ color: "hsl(325 35% 28%)" }} />
            </div>
            <div>
              <span className="text-[9px] font-heading tracking-[0.25em] uppercase block mb-0.5" style={{ color: "hsl(325 35% 28%)" }}>
                Sombra
              </span>
              <p className="text-[12px] leading-relaxed font-body" style={{ color: "hsl(230 20% 20% / 0.80)" }}>
                {review.shadow}
              </p>
            </div>
          </div>

          {/* Lesson */}
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" style={{ color: "hsl(340 42% 28%)" }} />
            </div>
            <div>
              <span className="text-[9px] font-heading tracking-[0.25em] uppercase block mb-0.5" style={{ color: "hsl(340 42% 28%)" }}>
                Lição Central
              </span>
              <p className="text-[12px] leading-relaxed font-body" style={{ color: "hsl(230 20% 20% / 0.80)" }}>
                {review.lesson}
              </p>
            </div>
          </div>

          {/* Practical Application */}
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Compass className="w-4 h-4" style={{ color: "hsl(230 25% 35%)" }} />
            </div>
            <div>
              <span className="text-[9px] font-heading tracking-[0.25em] uppercase block mb-0.5" style={{ color: "hsl(230 25% 35%)" }}>
                Aplicação Prática
              </span>
              <p className="text-[12px] leading-relaxed font-body" style={{ color: "hsl(230 20% 20% / 0.80)" }}>
                {review.practicalApplication}
              </p>
            </div>
          </div>

          {/* Fixation phrase */}
          <div
            className="rounded-lg p-3 mt-2"
            style={{
              background: "linear-gradient(135deg, hsl(36 42% 44% / 0.06), hsl(340 42% 28% / 0.04))",
              border: "1px solid hsl(36 45% 50% / 0.15)",
            }}
          >
            <div className="flex items-start gap-2">
              <Quote className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "hsl(36 42% 45% / 0.60)" }} />
              <p className="text-[11px] font-accent italic leading-relaxed" style={{ color: "hsl(230 20% 18% / 0.75)" }}>
                {review.fixationPhrase}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
