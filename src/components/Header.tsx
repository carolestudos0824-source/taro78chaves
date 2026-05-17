import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import { TarotIcon } from "./TarotIcon";
import { StreakCounter } from "@/components/StreakCounter";
import { XPBar } from "@/components/XPBar";
import { useState } from "react";
import GlobalMenu from "@/components/GlobalMenu";
import { useHeader } from "@/contexts/header-context";

interface HeaderProps {
  streak: number;
  xp: number;
  level: number;
}

/**
 * Header unificado e estável.
 * REMOVIDO: hysteresis, compact mode, transições de scroll e transformações.
 * MOTIVO: Corrigir tremor (jitter) visual na rota /lesson/0.
 */
export const Header = ({ streak, xp, level }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useHeader();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isLessonMode = location.pathname.startsWith("/lesson/");

  if (location.pathname === "/" || location.pathname.startsWith("/admin") || state.hideHeader) return null;

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-[#FDFBF7] border-b-2 border-[#C8A66A]/20 shadow-sm"
      style={{ 
        height: 'auto',
        minHeight: '70px',
        overflow: 'visible'
      }}
    >
      <div className="container max-w-3xl px-4 sm:px-6 py-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center justify-center p-1.5 bg-white rounded-xl shadow-sm border border-[#C8A66A]/30 active:scale-95 w-10 h-10"
                style={{ transform: 'none' }}
              >
                <Menu className="w-5 h-5 text-[#5B1F3D]" />
              </button>
              
              {state.backRoute && (
                <button 
                  onClick={() => navigate(state.backRoute!)}
                  className="flex items-center justify-center p-1.5 bg-[#FAF5EF] rounded-xl border border-[#C8A66A]/20 text-[#5B1F3D] active:scale-95 w-10 h-10"
                  style={{ transform: 'none' }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h1 className="font-heading text-[#5B1F3D] font-black tracking-tight leading-tight text-[13px] min-[360px]:text-sm sm:text-base truncate w-full">
                {state.title}
              </h1>
              {state.subtitle && (
                <span className="font-heading text-[8px] min-[360px]:text-[9px] tracking-[0.15em] min-[360px]:tracking-[0.2em] uppercase text-[#5B1F3D]/60 font-black leading-none truncate w-full">
                  {state.subtitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!state.hideStreak && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-[#C8A66A]/20 shadow-sm">
                <span className="text-[#C8A66A] text-sm">🔥</span>
                <span className="font-heading text-[13px] font-black text-[#5B1F3D]">{streak}</span>
              </div>
            )}
            <button 
              onClick={() => navigate("/perfil")} 
              className="rounded-xl flex items-center justify-center bg-white border border-[#C8A66A]/30 shadow-sm active:scale-95 w-10 h-10"
              style={{ transform: 'none' }}
              title="Meu Perfil"
            >
              <TarotIcon name="perfil" className="w-5 h-5 text-[#C8A66A]" />
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
          <div className="mt-3 flex justify-center w-full overflow-hidden">
            {state.rightElement}
          </div>
        )}
      </div>
    </header>
  );
};