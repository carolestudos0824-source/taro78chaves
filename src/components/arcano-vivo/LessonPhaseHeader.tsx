import React from "react";

interface LessonPhaseHeaderProps {
  cardImage: string;
  cardName: string;
  numeral: string;
  subtitle?: string;
  variant?: "small" | "aura";
}

export const LessonPhaseHeader: React.FC<LessonPhaseHeaderProps> = ({
  cardImage,
  cardName,
  numeral,
  subtitle,
  variant = "small"
}) => {
  if (variant === "aura") {
    return (
      <div className="relative w-full flex flex-col items-center mb-10 opacity-100">
        <div className="relative z-10 w-24 aspect-[2/3] rounded-lg overflow-hidden border-2 border-[#C8A66A]/40 shadow-2xl mb-4">
          <img src={cardImage} alt={cardName} className="w-full h-full object-cover" />
        </div>
        <div className="text-center space-y-1">
          <span className="text-[10px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A]">Arcano {numeral}</span>
          <h3 className="text-2xl font-heading font-black text-[#5B1F3D]">{cardName}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-8 bg-white p-3 rounded-2xl border border-[#C8A66A]/20 shadow-sm opacity-100">
      <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden border-2 border-[#C8A66A]/30 shadow-lg shrink-0">
        <img src={cardImage} alt={cardName} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]">
          Arcano {numeral}
        </span>
        <h3 className="text-lg font-heading font-black text-[#5B1F3D] leading-tight">
          {cardName}
        </h3>
        {subtitle && (
          <span className="text-[11px] font-accent italic text-[#5B1F3D]/60 font-bold">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
