import React from "react";
import { motion } from "framer-motion";
import { TarotAnimatedCard } from "./TarotAnimatedCard";
import { getArcanoTheme } from "./arcano-motion-themes";
import { unlockGlow } from "./motion-presets";
import { Button } from "@/components/ui/button";
import { Sparkles, Key } from "lucide-react";

interface ArcanoUnlockMomentProps {
  arcanoId: number;
  cardName: string;
  cardImage: string;
  arcanoSlug: string;
  onContinue: () => void;
}

export const ArcanoUnlockMoment: React.FC<ArcanoUnlockMomentProps> = ({
  arcanoId,
  cardName,
  cardImage,
  arcanoSlug,
  onContinue
}) => {
  const theme = getArcanoTheme(arcanoId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <div className="max-w-sm w-full bg-white rounded-[2rem] p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Background glow */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, hsl(${theme.palette.primary}) 0%, transparent 70%)`
          }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="mb-4 bg-[#C8A66A]/10 p-4 rounded-full">
            <Sparkles className="w-8 h-8 text-[#C8A66A]" />
          </div>

          <h2 className="text-2xl font-heading text-[#5B1F3D] mb-2">
            Primeira Chave Despertada
          </h2>
          
          <p className="font-accent italic text-[#5B1F3D]/60 mb-8">
            Você despertou a primeira chave: O Louco. Agora a jornada continua com O Mago, o arcano da vontade.
          </p>

          <div className="mb-8 relative">
            <TarotAnimatedCard
              cardImage={cardImage}
              cardName={cardName}
              arcanoId={arcanoId}
              arcanoSlug={arcanoSlug}
              state="available"
              className="scale-110"
            />
            
            <motion.div
              variants={unlockGlow}
              animate="animate"
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-xl border border-[#C8A66A]/30 flex items-center gap-2"
            >
              <Key className="w-4 h-4 text-[#C8A66A]" />
              <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">
                Desbloqueado
              </span>
            </motion.div>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-[#5B1F3D] hover:bg-[#4A1932] text-white rounded-full py-6 font-heading tracking-widest"
          >
            CONTINUAR JORNADA
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
