import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { TarotIcon } from "./TarotIcon";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";



interface NavItem {
  path: string;
  label: string;
  icon: string;
  microcopy: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/app", label: "Início", icon: "jornada", microcopy: "Seu Dashboard" },
  { path: "/jornada", label: "Jornada", icon: "louco", microcopy: "Jornada do Louco ao Mundo" },
  { path: "/desafios", label: "Ritual", icon: "ritual", microcopy: "Faça sua prática de hoje." },
  { path: "/mapa", label: "Mapa", icon: "formacao", microcopy: "Mapa da trilha" },
  { path: "/perfil", label: "Perfil", icon: "perfil", microcopy: "Suas chaves" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  const fundamentosComplete = progress.completedModules.includes("fundamentos");

  // Determine current active journey path
  const currentJourneyPath = useMemo(() => {
    if (bypassLocks) return "/jornada";
    if (!fundamentosComplete) return "/module/fundamentos";
    
    return "/jornada";
  }, [fundamentosComplete, bypassLocks]);


  useEffect(() => {
    // Scroll to top on navigation to ensure clear view of new page
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);


  if (location.pathname === "/") return null;
  if (location.pathname === "/venda") return null;
  if (location.pathname === "/auth") return null;
  if (location.pathname.startsWith("/admin")) return null;
  if (location.pathname === "/privacidade") return null;
  if (location.pathname === "/termos") return null;
  if (location.pathname === "/suporte") return null;
  if (location.pathname === "/excluir-conta") return null;


  return (
    <nav
      id="main-bottom-nav"
      data-testid="main-bottom-nav"
      className="fixed bottom-0 inset-x-0 z-[100] border-t bg-[#FAF5EF] backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe w-full touch-none"
      style={{
        borderColor: "#DCCFC2",
      }}
    >
      <div className="mx-auto flex items-center justify-between py-2 px-0 w-full max-w-full">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path || (item.label === "Jornada" && (location.pathname === "/jornada" || location.pathname === "/jornada-do-louco"));
          const isJourneyTab = item.label === "Jornada";
          const path = isJourneyTab ? currentJourneyPath : item.path;
          const isLocked = !bypassLocks && isJourneyTab && !fundamentosComplete && item.path !== "/module/fundamentos";
          
          return (
            <button
              key={item.path}
              id={`nav-item-${item.label.toLowerCase()}`}
              data-testid={`nav-item-${item.label.toLowerCase()}`}
              onClick={() => navigate(path)}


              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-all duration-300 relative group py-1 select-none ${isLocked ? "opacity-30" : ""}`}
              title={isLocked ? "Complete os Fundamentos primeiro" : item.microcopy}
            >
              <div className="relative flex items-center justify-center">
                <TarotIcon 
                  name={isLocked ? "bloqueado" : item.icon}
                  className={`w-5 h-5 min-[390px]:w-6 min-[390px]:h-6 transition-all duration-300 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  color={isActive ? "#5B1F3D" : "#5B1F3D"}
                />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_hsl(var(--gold))]" />
                )}
              </div>
              <span className={`text-[10px] min-[390px]:text-[11px] font-heading tracking-tight uppercase transition-all duration-300 w-full text-center px-0.5 leading-tight ${
                isActive ? "font-black text-[#5B1F3D]" : "font-black text-[#5B1F3D]/80"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;