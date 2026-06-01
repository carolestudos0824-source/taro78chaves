import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import AdminSidebar, { AdminMobileNav, type AdminSection } from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminSubscriptions from "@/components/admin/AdminSubscriptions";
import AdminGiftCodes from "@/components/admin/AdminGiftCodes";
import AdminModules from "@/components/admin/AdminModules";
import AdminArcanos from "@/components/admin/AdminArcanos";
import AdminQuizzes from "@/components/admin/AdminQuizzes";
import AdminProgress from "@/components/admin/AdminProgress";
import AdminSupport from "@/components/admin/AdminSupport";
import AdminProgressAudit from "@/components/admin/AdminProgressAudit";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminAuditLog from "@/components/admin/AdminAuditLog";
import AdminRoles from "@/components/admin/AdminRoles";
import AdminPlayStore from "@/components/admin/AdminPlayStore";
import AdminHotmart from "@/components/admin/AdminHotmart";
import AdminCertificates from "@/components/admin/AdminCertificates";
import { useRole, canAccessSection } from "@/hooks/use-role";

const sectionComponents: Record<AdminSection, React.ComponentType> = {
  overview: AdminOverview,
  users: AdminUsers,
  hotmart: AdminHotmart,
  certificates: AdminCertificates,
  subscriptions: AdminSubscriptions,
  gifts: AdminGiftCodes,
  modules: AdminModules,
  arcanos: AdminArcanos,
  quizzes: AdminQuizzes,
  progress: AdminProgress,
  progress_audit: AdminProgressAudit,
  roles: AdminRoles,
  audit: AdminAuditLog,
  support: AdminSupport,
  settings: AdminSettings,
  playstore: AdminPlayStore,
};

const AdminPage = () => {
  const navigate = useNavigate();
  const { role, isAdmin, loading } = useRole();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const allowed = useMemo(() => canAccessSection(role, activeSection), [role, activeSection]);
  const ActiveComponent = allowed ? sectionComponents[activeSection] : null;

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-[60vh] text-muted-foreground text-sm">Carregando permissões…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <ShieldAlert className="w-10 h-10 text-muted-foreground" />
        <h1 className="font-heading text-lg">Acesso restrito</h1>
        <p className="text-sm text-muted-foreground max-w-sm">Esta área é exclusiva da equipe administrativa.</p>
        <button onClick={() => navigate("/app")} className="text-sm text-primary hover:underline mt-2">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF]">
      <header className="border-b border-[#C8A66A]/20 bg-white/80 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="px-4 sm:px-8 py-4 flex items-center gap-6">
          <button 
            onClick={() => navigate("/app")} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A]/30 text-[#5B1F3D] hover:scale-110 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-heading text-xl md:text-2xl text-[#5B1F3D] font-black tracking-tight">Painel Administrativo</h1>
            <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-[#C8A66A] font-bold">Gestão Tarô 78 Chaves</p>
          </div>
          <span className={`ml-auto text-[10px] font-heading tracking-[0.3em] uppercase px-4 py-1.5 rounded-full border-2 font-black shadow-sm ${
            role === "admin" 
              ? "bg-[#5B1F3D] text-white border-[#C8A66A]" 
              : "bg-white text-[#5B1F3D] border-[#C8A66A]/40"
          }`}>
            {role === "admin" ? "Admin" : role === "auditor" ? "Auditor" : "Moderador"}
          </span>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar active={activeSection} onChange={setActiveSection} role={role} />
        <main className="flex-1 p-6 sm:p-10 max-w-[1400px] mx-auto pb-24 md:pb-12">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <ShieldAlert className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Esta área é restrita a administradores.</p>
            </div>
          )}
          <footer className="mt-20 pt-8 border-t border-[#C8A66A]/10 flex flex-col items-center gap-2">
            <p className="text-[10px] font-heading tracking-[0.3em] uppercase text-[#C8A66A] font-black">Build Web First — Hotmart Ops Ready</p>
            <p className="text-[9px] text-[#5B1F3D]/30 font-body font-bold uppercase tracking-widest">Registrada para Teste Smoke Curto</p>
          </footer>
        </main>
      </div>

      <AdminMobileNav active={activeSection} onChange={setActiveSection} role={role} />
    </div>
  );
};

export default AdminPage;
