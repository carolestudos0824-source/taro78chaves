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
      className="rounded-[2rem] overflow-hidden transition-all duration-500"
      style={{
        background: isStudied
          ? "linear-gradient(135deg, #FFFFFF 0%, #FDFBF7 100%)"
          : "rgba(243, 230, 224, 0.45)",
        border: isStudied
          ? "2.5px solid #C8A66A"
          : "1.5px solid #DCCFC260",
        backdropFilter: "blur(12px)",
        boxShadow: isStudied ? "0 15px 40px rgba(91, 31, 61, 0.05)" : "none",
        opacity: isStudied ? 1 : 0.85,
        transform: expanded ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => isStudied && setExpanded(!expanded)}
        disabled={!isStudied}
        className="w-full p-6 flex items-center gap-4 text-left transition-all duration-300"
      >
        {/* Numeral badge */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 shadow-sm"
          style={{
            border: isStudied ? "2px solid #C8A66A40" : "1.5px solid #DCCFC2",
            background: isStudied ? "#FAF5EF" : "#F3E6E0",
          }}
        >
          <span
            className="font-heading text-sm font-black"
            style={{ color: isStudied ? "#5B1F3D" : "#5B1F3D40" }}
          >
            {review.numeral}
          </span>
        </div>

        {/* Name + keyword */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-heading text-lg tracking-tight font-black"
            style={{ color: isStudied ? "#5B1F3D" : "#5B1F3D40" }}
          >
            {review.name}
          </h3>
          <p
            className="text-[12px] font-accent italic font-black truncate"
            style={{ color: isStudied ? "#5B1F3D70" : "#5B1F3D20" }}
          >
            {review.keyword}
          </p>
        </div>

        {/* Expand icon */}
        {isStudied && (
          <div className={`w-10 h-10 rounded-full border-2 border-[#C8A66A20] flex items-center justify-center transition-all ${expanded ? 'bg-[#5B1F3D] border-[#5B1F3D]' : 'bg-white'}`}>
            <ChevronDown
              className="w-5 h-5 transition-transform duration-500"
              style={{
                color: expanded ? "#FAF5EF" : "#C8A66A",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        )}

        {!isStudied && (
          <span className="text-[10px] tracking-[0.2em] uppercase font-heading font-black shrink-0" style={{ color: "#5B1F3D40" }}>
            Bloqueado
          </span>
        )}
      </button>

      {/* Expanded content */}
      {expanded && isStudied && (
        <div className="px-6 pb-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-px bg-gradient-to-r from-transparent via-[#C8A66A]/30 to-transparent mb-6" />

          {/* Light */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] border border-[#C8A66A20] flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" style={{ color: "#C8A66A" }} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-heading tracking-[0.3em] uppercase block mb-1 font-black" style={{ color: "#C8A66A" }}>
                Luz
              </span>
              <p className="text-[14px] leading-relaxed font-body font-bold" style={{ color: "#5B1F3D" }}>
                {review.light}
              </p>
            </div>
          </div>

          {/* Shadow */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F3E6E0] border border-[#5B1F3D20] flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5" style={{ color: "#5B1F3D" }} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-heading tracking-[0.3em] uppercase block mb-1 font-black" style={{ color: "#5B1F3D" }}>
                Sombra
              </span>
              <p className="text-[14px] leading-relaxed font-body font-bold" style={{ color: "#5B1F3D" }}>
                {review.shadow}
              </p>
            </div>
          </div>

          {/* Lesson */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] border border-[#C8A66A20] flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" style={{ color: "#C8A66A" }} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-heading tracking-[0.3em] uppercase block mb-1 font-black" style={{ color: "#5B1F3D" }}>
                Lição Central
              </span>
              <p className="text-[14px] leading-relaxed font-body font-bold" style={{ color: "#5B1F3D" }}>
                {review.lesson}
              </p>
            </div>
          </div>

          {/* Practical Application */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F3E6E0] border border-[#5B1F3D20] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" style={{ color: "#5B1F3D" }} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-heading tracking-[0.3em] uppercase block mb-1 font-black" style={{ color: "#5B1F3D" }}>
                Aplicação Prática
              </span>
              <p className="text-[14px] leading-relaxed font-body font-bold" style={{ color: "#5B1F3D" }}>
                {review.practicalApplication}
              </p>
            </div>
          </div>

          {/* Fixation phrase */}
          <div
            className="rounded-3xl p-6 mt-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(200, 166, 106, 0.1), rgba(91, 31, 61, 0.05))",
              border: "1.5px solid #C8A66A40",
            }}
          >
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Quote className="w-12 h-12" style={{ color: "#C8A66A" }} />
            </div>
            <p className="text-[13px] font-accent italic font-black leading-relaxed relative z-10 text-center" style={{ color: "#5B1F3D" }}>
              "{review.fixationPhrase}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}