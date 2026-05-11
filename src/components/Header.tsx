import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import brandIcon from "@/assets/brand-icon.png";
import { useState, useEffect, useRef } from "react";

interface HeaderProps {
  streak: number;
  xp: number;
  level: number;
}

export const Header = ({ streak, xp, level }: HeaderProps) => {
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(false);
  const isCompactRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    const threshold = 80;
    const hysteresis = 40;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = Math.max(0, window.scrollY);
          
          if (!isCompactRef.current && currentScroll > threshold) {
            isCompactRef.current = true;
            setIsCompact(true);
          } else if (isCompactRef.current && currentScroll < (threshold - hysteresis)) {
            isCompactRef.current = false;
            setIsCompact(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b-2 border-[#C8A66A]/20 shadow-lg transition-shadow duration-300"
    >
      <div className="container max-w-lg px-6 py-4 md:py-6 relative">
        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${isCompact ? "mb-1" : "mb-4 md:mb-6"}`}>
          <div className="flex items-center gap-3 md:gap-6">
            <div className={`flex items-center justify-center shrink-0 p-1.5 bg-white rounded-2xl shadow-xl border border-[#C8A66A]/30 transition-all duration-500 ease-in-out transform ${
              isCompact ? "w-11 h-11 scale-90" : "w-14 h-14 md:w-20 md:h-20 scale-100"
            }`}>
              <img 
                src={brandIcon} 
                alt="Tarô 78 Chaves" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className={`font-heading text-[#5B1F3D] font-black tracking-tight leading-none transition-all duration-500 ease-in-out ${
                isCompact ? "text-lg" : "text-xl md:text-3xl mb-1.5 md:mb-3"
              }`}>
                Tarô 78 Chaves
              </h1>
              <div className={`flex flex-col transition-all duration-500 ease-in-out ${
                isCompact ? "h-0 opacity-0 pointer-events-none" : "h-auto opacity-100"
              }`}>
                <span className="font-heading text-[10px] md:text-[13px] tracking-[0.4em] uppercase text-[#5B1F3D] font-black leading-none">
                  A Jornada Viva
                </span>
                <span className="hidden md:block text-[11px] font-body text-[#5B1F3D]/85 mt-2 leading-none font-bold italic">
                  Abra os portais dos 78 arcanos.
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <StreakCounter streak={streak} />
            <button 
              onClick={() => navigate("/perfil")} 
              className={`rounded-2xl flex items-center justify-center bg-white border border-[#C8A66A]/30 shadow-sm transition-all hover:border-[#C8A66A]/60 active:scale-95 group ${
                isCompact ? "w-9 h-9" : "w-10 h-10 md:w-12 md:h-12"
              }`}
              title="Meu Perfil"
            >
              <KeyRound className={`${isCompact ? "w-4 h-4" : "w-4 h-4 md:w-6 md:h-6"} text-[#C8A66A] group-hover:rotate-12 transition-transform`} />
            </button>
          </div>
        </div>
        <div className={`transition-all duration-500 ease-in-out origin-left transform ${isCompact ? "scale-[0.85] opacity-0 h-0 pointer-events-none" : "scale-100 opacity-100 h-auto"}`}>
          <XPBar xp={xp} level={level} />
        </div>
      </div>
    </header>
  );
};
