import {
  LayoutDashboard, Users, Crown, Gift, BookOpen, Sparkles, HelpCircle,
  BarChart3, HeadphonesIcon, Settings, ScrollText, Shield, Smartphone,
  ShoppingBag, FileText, Search
} from "lucide-react";
import { canAccessSection, type AppRole } from "@/hooks/use-role";

export type AdminSection =
  | "overview"
  | "users"
  
  | "certificates"
  | "subscriptions"
  | "gifts"
  | "modules"
  | "arcanos"
  | "quizzes"
  | "progress"
  | "progress_audit"
  | "roles"
  | "audit"
  | "support"
  | "settings"
  | "playstore";

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  role: AppRole;
}

const sections: { id: AdminSection; label: string; icon: React.ReactNode; group: string }[] = [
  { id: "overview", label: "Visão Geral", icon: <LayoutDashboard className="w-5 h-5" />, group: "Principal" },
  { id: "users", label: "Usuários", icon: <Users className="w-5 h-5" />, group: "Principal" },
  
  { id: "certificates", label: "Certificados", icon: <FileText className="w-5 h-5" />, group: "Curso" },
  { id: "subscriptions", label: "Vendas Legadas Stripe", icon: <Crown className="w-5 h-5" />, group: "Comercial" },
  { id: "gifts", label: "Presentes & Chaves", icon: <Gift className="w-5 h-5" />, group: "Comercial" },
  { id: "modules", label: "Módulos", icon: <BookOpen className="w-5 h-5" />, group: "Curso" },
  { id: "arcanos", label: "Arcanos", icon: <Sparkles className="w-5 h-5" />, group: "Curso" },
  { id: "quizzes", label: "Quizzes", icon: <HelpCircle className="w-5 h-5" />, group: "Curso" },
  { id: "progress", label: "Engajamento Geral", icon: <BarChart3 className="w-5 h-5" />, group: "Curso" },
  { id: "progress_audit", label: "Auditoria de Travessia", icon: <Search className="w-5 h-5" />, group: "Curso" },
  { id: "roles", label: "Funções", icon: <Shield className="w-5 h-5" />, group: "Operação" },
  { id: "audit", label: "Auditoria", icon: <ScrollText className="w-5 h-5" />, group: "Operação" },
  { id: "support", label: "Suporte", icon: <HeadphonesIcon className="w-5 h-5" />, group: "Operação" },
  { id: "settings", label: "Configurações", icon: <Settings className="w-5 h-5" />, group: "Operação" },
  { id: "playstore", label: "Play Store", icon: <Smartphone className="w-5 h-5" />, group: "Operação" },
];

const AdminSidebar = ({ active, onChange, role }: AdminSidebarProps) => {
  const visible = sections.filter((s) => canAccessSection(role, s.id));
  const groups = [...new Set(visible.map(s => s.group))];

  return (
    <aside className="w-72 shrink-0 border-r border-[#C8A66A]/20 bg-white/60 min-h-[calc(100vh-57px)] overflow-y-auto hidden md:block backdrop-blur-md">
      <nav className="p-6 space-y-10">
        <div className="px-4 pb-6 border-b border-[#C8A66A]/20">
          <p className="text-[10px] font-heading tracking-[0.3em] uppercase text-[#C8A66A] font-black mb-1">Operando como</p>
          <p className={`text-base font-heading font-black tracking-tight ${role === "admin" ? "text-[#5B1F3D]" : "text-[#8B6A30]"}`}>
            {role === "admin" ? "Administrador" : role === "auditor" ? "Auditor" : role === "moderator" ? "Moderador" : "Usuário"}
          </p>
        </div>
        
        {groups.map(group => (
          <div key={group} className="space-y-4">
            <p className="text-[11px] font-heading tracking-[0.4em] uppercase text-[#5B1F3D]/50 px-4 font-black">
              {group}
            </p>
            <div className="space-y-1.5">
              {visible.filter(s => s.group === group).map(s => (
                <button
                  key={s.id}
                  onClick={() => onChange(s.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] transition-all duration-300 group ${
                    active === s.id
                      ? "bg-[#5B1F3D] text-white font-black shadow-xl shadow-[#5B1F3D]/20 border border-[#C8A66A]/40"
                      : "text-[#5B1F3D]/80 hover:text-[#5B1F3D] hover:bg-white/80 font-bold"
                  }`}
                >
                  <div className={`transition-transform duration-300 ${active === s.id ? "scale-110" : "group-hover:scale-110 opacity-70 group-hover:opacity-100"}`}>
                    {s.icon}
                  </div>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

/** Mobile bottom tabs for admin on small screens */
export const AdminMobileNav = ({ active, onChange, role }: AdminSidebarProps) => {
  const visible = sections.filter((s) => canAccessSection(role, s.id));
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[120] bg-white/95 backdrop-blur-xl border-t-2 border-[#C8A66A]/30 px-2 py-2 flex items-center gap-1 overflow-x-auto shadow-[0_-8px_30px_rgba(0,0,0,0.12)] scrollbar-hide">
      {visible.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[9px] transition-all shrink-0 font-heading font-black tracking-widest uppercase min-w-[70px] ${
            active === s.id ? "text-[#5B1F3D] font-black" : "text-[#5B1F3D]/50"
          }`}
        >
          <div className={`p-2 rounded-lg transition-all ${active === s.id ? "bg-[#5B1F3D] text-white shadow-md scale-110" : "bg-[#5B1F3D]/5 opacity-70 group-hover:opacity-100"}`}>
            {s.icon}
          </div>
          <span className="truncate w-full text-center">{s.label.split(" ")[0]}</span>
        </button>
      ))}
    </nav>
  );
};

export default AdminSidebar;
