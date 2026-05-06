import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import brandIcon from "@/assets/brand-icon.png";
import { useState, useEffect } from "react";

interface HeaderProps {
  streak: number;
  xp: number;
  level: number;
}

export const Header = ({ streak, xp, level }: HeaderProps) => {
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 bg-white/98 backdrop-blur-2xl border-b-2 border-[#C8A66A]/20 shadow-lg transition-all duration-300 ease-in-out ${
        isCompact ? "py-2" : "py-3 md:py-5"
      }`}
    >
      <div className="container max-w-lg px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${isCompact ? "mb-1" : "mb-3 md:mb-5"}`}>
          <div className="flex items-center gap-3 md:gap-5">
            <div className={`flex items-center justify-center shrink-0 p-1 bg-white rounded-xl shadow-md border border-[#C8A66A]/30 transition-all duration-300 ${
              isCompact ? "w-10 h-10" : "w-12 h-12 md:w-16 md:h-16"
            }`}>
              <img 
                src={brandIcon} 
                alt="Tarô 78 Chaves" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <h1 className={`font-heading text-[#5B1F3D] font-black tracking-tight leading-none transition-all duration-300 ${
                isCompact ? "text-lg" : "text-xl md:text-3xl mb-1.5 md:mb-2.5"
              }`}>
                Tarô 78 Chaves
              </h1>
              {!isCompact && (
                <div className="flex flex-col animate-fade-in">
                  <span className="font-heading text-[10px] md:text-[13px] tracking-[0.4em] uppercase text-[#C8A66A] font-black leading-none">
                    A Jornada Viva
                  </span>
                  <span className="text-[10px] md:text-[13px] font-body text-[#5B1F3D] mt-1.5 md:mt-2.5 leading-none font-bold italic">
                    Abra os portais dos 78 arcanos.
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <StreakCounter streak={streak} />
            <button 
              onClick={() => navigate("/perfil")} 
              className={`rounded-xl flex items-center justify-center bg-white border border-[#C8A66A]/30 shadow-sm transition-all hover:border-[#C8A66A]/60 active:scale-95 group ${
                isCompact ? "w-8 h-8" : "w-9 h-9 md:w-11 md:h-11"
              }`}
              title="Meu Perfil"
            >
              <KeyRound className={`${isCompact ? "w-3 h-3" : "w-3.5 h-3.5 md:w-5 md:h-5"} text-[#C8A66A] group-hover:rotate-12 transition-transform`} />
            </button>
          </div>
        </div>
        <div className={`transition-all duration-300 ${isCompact ? "scale-95 opacity-90 origin-left" : "scale-100 opacity-100"}`}>
          <XPBar xp={xp} level={level} />
        </div>
      </div>
    </header>
  );
};
