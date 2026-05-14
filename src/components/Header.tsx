import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import { TarotIcon } from "./TarotIcon";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import { useState, useEffect } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Determinamos se é modo lição para forçar um estado estático e estável
  const isLessonMode = location.pathname.startsWith("/lesson/");

  if (location.pathname === "/" || location.pathname.startsWith("/admin") || state.hideHeader) return null;

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-[#FDFBF7] border-b-2 border-[#C8A66A]/20 shadow-sm"
    >
      <div className="container max-w-lg px-6 py-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center justify-center p-1.5 bg-white rounded-xl shadow-sm border border-[#C8A66A]/30 transition-all active:scale-95 w-10 h-10"
              >
                <Menu className="w-5 h-5 text-[#5B1F3D]" />
              </button>
              
              {state.backRoute && (
                <button 
                  onClick={() => navigate(state.backRoute!)}
                  className="flex items-center justify-center p-1.5 bg-[#FAF5EF] rounded-xl border border-[#C8A66A]/20 text-[#5B1F3D] hover:bg-white transition-all active:scale-95 w-10 h-10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <h1 className="font-heading text-[#5B1F3D] font-black tracking-tight leading-tight text-base truncate">
                {state.title}
              </h1>
              {state.subtitle && (
                <span className="font-heading text-[9px] tracking-[0.2em] uppercase text-[#5B1F3D]/60 font-black leading-none truncate">
                  {state.subtitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!state.hideStreak && <StreakCounter streak={streak} />}
            <button 
              onClick={() => navigate("/perfil")} 
              className="rounded-xl flex items-center justify-center bg-white border border-[#C8A66A]/30 shadow-sm transition-all hover:border-[#C8A66A]/60 active:scale-95 group w-10 h-10"
              title="Meu Perfil"
            >
              <TarotIcon name="perfil" className="w-5 h-5 text-[#C8A66A] group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
        
        {isMenuOpen && <GlobalMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
        
        {!state.hideXP && !isLessonMode && (
          <div className="mt-2">
            <XPBar xp={xp} level={level} />
          </div>
        )}

        {state.rightElement && (
          <div className="mt-3 flex justify-center">
            {state.rightElement}
          </div>
        )}
      </div>
    </header>
  );
};
