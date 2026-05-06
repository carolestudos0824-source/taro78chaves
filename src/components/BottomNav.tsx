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
      className="fixed bottom-0 inset-x-0 z-40 border-t bg-ivory/80 backdrop-blur-md"
      style={{
        borderColor: "hsl(var(--brand-gold) / 0.2)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all"
              style={{
                color: isActive ? "hsl(var(--brand-plum))" : "hsl(var(--brand-plum) / 0.45)",
              }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.5} />
              <span className="text-[9px] font-heading tracking-wider">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: "hsl(var(--brand-plum))" }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
