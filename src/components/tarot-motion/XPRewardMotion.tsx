import React from "react";
import { motion } from "framer-motion";
import { xpGain } from "./motion-presets";
import { getArcanoTheme } from "./arcano-motion-themes";

interface XPRewardMotionProps {
  xp: number;
  arcanoId?: number;
}

export const XPRewardMotion: React.FC<XPRewardMotionProps> = ({
  xp,
  arcanoId = 0
}) => {
  const theme = getArcanoTheme(arcanoId);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        variants={xpGain}
        initial="initial"
        animate="animate"
        className="absolute z-50 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-[#C8A66A]/30"
      >
        <span className="text-[#C8A66A] font-heading font-black text-sm">+{xp}</span>
        <span className="text-[#5B1F3D] font-heading font-bold text-[10px] tracking-widest uppercase">PONTOS</span>
      </motion.div>
      
      {/* Small floating sparkles around the reward */}
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0],
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60 - 40
          }}
          transition={{ 
            duration: 1.2, 
            delay: 0.2 + i * 0.1,
            ease: "easeOut"
          }}
          className="absolute text-[10px] pointer-events-none"
          style={{ color: `hsl(${theme.palette.primary})` }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
};
