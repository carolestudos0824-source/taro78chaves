import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, UserRound, MessageCircle, KeyRound } from "lucide-react";

const NAV_ITEMS = [
  { path: "/app", label: "Módulos", icon: BookOpen, microcopy: "Sua jornada" },
  { path: "/feedback", label: "Feedback", icon: MessageCircle, microcopy: "Envie uma mensagem" },
  { path: "/premium", label: "Premium", icon: KeyRound, microcopy: "Jornada completa" },
  { path: "/perfil", label: "Perfil", icon: UserRound, microcopy: "Suas chaves" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t bg-white/98 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe"
      style={{
        borderColor: "#C8A66A33",
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-300 relative group"
              title={item.microcopy}
            >
              <Icon 
                className={`w-6 h-6 transition-all duration-300 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"}`} 
                strokeWidth={isActive ? 2.5 : 2} 
                style={{
                  color: isActive ? "#5B1F3D" : "#5B1F3D",
                }}
              />
              <span className={`text-[10px] font-heading tracking-widest uppercase transition-all duration-300 ${
                isActive ? "font-black text-[#5B1F3D]" : "font-bold text-[#5B1F3D]/70"
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#C8A66A] shadow-[0_0_10px_#C8A66A]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;