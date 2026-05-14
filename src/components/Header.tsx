import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import { TarotIcon } from "./TarotIcon";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import { useState, useEffect, useRef } from "react";
import GlobalMenu from "@/components/GlobalMenu";
import { useHeader } from "@/contexts/header-context";

interface HeaderProps {
  streak: number;
  xp: number;
  level: number;
}

export const Header = ({ streak, xp, level }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useHeader();
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCompactRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    const threshold = 60;
    const hysteresis = 30;

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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (location.pathname === "/" || location.pathname.startsWith("/admin") || state.hideHeader) return null;

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-[#FDFBF7]/95 backdrop-blur-xl border-b-2 border-[#C8A66A]/20 shadow-lg transition-all duration-300"
    >
      <div className="container max-w-lg px-6 py-4 relative">
        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${isCompact ? "mb-0" : "mb-4"}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className={`flex items-center justify-center p-1.5 bg-white rounded-xl shadow-md border border-[#C8A66A]/30 transition-all active:scale-95 ${
                  isCompact ? "w-9 h-9" : "w-11 h-11"
                }`}
              >
                <Menu className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-[#5B1F3D]`} />
              </button>
              
              {state.backRoute && (
                <button 
                  onClick={() => navigate(state.backRoute!)}
                  className={`flex items-center justify-center p-1.5 bg-[#FAF5EF] rounded-xl border border-[#C8A66A]/20 text-[#5B1F3D] hover:bg-white transition-all active:scale-95 ${
                    isCompact ? "w-9 h-9" : "w-11 h-11"
                  }`}
                >
                  <ArrowLeft className={`${isCompact ? "w-4 h-4" : "w-5 h-5"}`} />
                </button>
              )}
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <h1 className={`font-heading text-[#5B1F3D] font-black tracking-tight leading-none transition-all duration-500 ${
                isCompact ? "text-base" : "text-lg mb-1"
              }`}>
                {state.title}
              </h1>
              {!isCompact && state.subtitle && (
                <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-[#5B1F3D]/60 font-black leading-none truncate">
                  {state.subtitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!state.hideStreak && <StreakCounter streak={streak} />}
            <button 
              onClick={() => navigate("/perfil")} 
              className={`rounded-xl flex items-center justify-center bg-white border border-[#C8A66A]/30 shadow-sm transition-all hover:border-[#C8A66A]/60 active:scale-95 group ${
                isCompact ? "w-9 h-9" : "w-11 h-11"
              }`}
              title="Meu Perfil"
            >
              <TarotIcon name="perfil" className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-[#C8A66A] group-hover:rotate-12 transition-transform`} />
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <GlobalMenu isOpen={isMenuOpen} onClose={() => {
            console.log("Closing GlobalMenu");
            setIsMenuOpen(false);
          }} />
        )}
        
        {!state.hideXP && (
          <div className={`transition-all duration-500 origin-top overflow-hidden ${isCompact ? "h-0 opacity-0" : "h-auto opacity-100"}`}>
            <XPBar xp={xp} level={level} />
          </div>
        )}

        {state.rightElement && (
          <div className="mt-2">
            {state.rightElement}
          </div>
        )}
      </div>
    </header>
  );
};
