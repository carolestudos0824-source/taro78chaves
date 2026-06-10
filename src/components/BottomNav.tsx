import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TarotIcon } from "./TarotIcon";

interface NavItem {
  path: string;
  label: string;
  icon: string;
  microcopy: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/app", label: "Início", icon: "jornada", microcopy: "Seu Dashboard" },
  { path: "/jornada-do-louco", label: "Jornada", icon: "louco", microcopy: "A Jornada do Louco" },
  { path: "/desafios", label: "Ritual", icon: "ritual", microcopy: "Faça sua prática de hoje." },
  { path: "/mapa", label: "Mapa", icon: "formacao", microcopy: "Mapa da trilha" },
  { path: "/perfil", label: "Perfil", icon: "perfil", microcopy: "Suas chaves" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on navigation to ensure clear view of new page
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (location.pathname === "/") return null;
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <nav
      id="main-bottom-nav"
      data-testid="main-bottom-nav"
      className="fixed bottom-0 inset-x-0 z-[100] border-t bg-[#FAF5EF] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe w-full overflow-hidden touch-none"
      style={{
        borderColor: "#DCCFC2",
      }}
    >
      <div className="mx-auto flex items-center justify-between py-1.5 px-0 w-full max-w-full">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              id={`nav-item-${item.label.toLowerCase()}`}
              data-testid={`nav-item-${item.label.toLowerCase()}`}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-all duration-300 relative group py-1 select-none"
              title={item.microcopy}
            >
              <div className="relative flex items-center justify-center">
                <TarotIcon 
                  name={item.icon}
                  className={`w-6 h-6 transition-all duration-300 ${isActive ? "scale-110" : "opacity-80 grayscale-[0.5]"}`} 
                  strokeWidth={2} 
                  color={isActive ? "#5B1F3D" : "#DCCFC2"}
                />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#C8A66A] shadow-[0_0_8px_#C8A66A]" />
                )}
              </div>
              <span className={`text-[11px] font-body tracking-tight transition-all duration-300 truncate w-full text-center px-0.5 ${
                isActive ? "font-bold text-[#5B1F3D]" : "font-medium text-[#5B1F3D] opacity-60"
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