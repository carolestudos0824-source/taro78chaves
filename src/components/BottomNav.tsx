import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, User, MessageCircle, Crown } from "lucide-react";

const NAV_ITEMS = [
  { path: "/app", label: "Módulos", icon: BookOpen },
  { path: "/feedback", label: "Feedback", icon: MessageCircle },
  { path: "/premium", label: "Premium", icon: Crown },
  { path: "/perfil", label: "Perfil", icon: User },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on landing and inside Admin (which has its own navigation)
  if (location.pathname === "/") return null;
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t bg-white/95 backdrop-blur-xl"
      style={{
        borderColor: "#C8A66A33",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around py-3 px-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-300 relative group"
            >
              <Icon 
                className={`w-5 h-5 transition-all duration-300 ${isActive ? "scale-110" : "opacity-60 group-hover:opacity-100"}`} 
                strokeWidth={isActive ? 2.5 : 2} 
                style={{
                  color: isActive ? "#5B1F3D" : "#5B1F3D",
                }}
              />
              <span className={`text-[11px] font-heading tracking-[0.15em] uppercase transition-all duration-300 ${
                isActive ? "font-black text-[#5B1F3D]" : "font-bold text-[#5B1F3D]"
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#C8A66A] shadow-[0_0_8px_#C8A66A]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;