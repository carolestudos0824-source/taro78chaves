import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonPhaseHeaderProps {
  cardImage: string;
  cardName: string;
  numeral: string;
  subtitle?: string;
  variant?: "small" | "aura";
  onBack?: () => void;
  showBack?: boolean;
}

export const LessonPhaseHeader: React.FC<LessonPhaseHeaderProps> = ({
  cardImage,
  cardName,
  numeral,
  subtitle,
  variant = "small",
  onBack,
  showBack = false
}) => {
  if (variant === "aura") {
    return (
      <div className="relative w-full flex flex-col items-center mb-10">
        <div className="absolute inset-0 -top-20 pointer-events-none overflow-hidden h-64">
           <div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square blur-[100px] opacity-20"
             style={{ background: 'radial-gradient(circle, #C8A66A 0%, transparent 70%)' }}
           />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-24 aspect-[2/3] rounded-lg overflow-hidden border-2 border-[#C8A66A]/40 shadow-2xl mb-4"
        >
          <img src={cardImage} alt={cardName} className="w-full h-full object-cover" />
        </motion.div>
        <div className="text-center space-y-1">
          <span className="text-[10px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A]">Arcano {numeral}</span>
          <h3 className="text-2xl font-heading font-black text-[#5B1F3D]">{cardName}</h3>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 mb-8 bg-white/40 backdrop-blur-sm p-3 rounded-2xl border border-[#C8A66A]/20 shadow-sm relative"
    >
      {showBack && onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#C8A66A]/20 shadow-sm text-[#5B1F3D] hover:bg-[#FAF5EF]"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
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
    </motion.div>
  );
};
