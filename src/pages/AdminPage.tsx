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
import AdminSettings from "@/components/admin/AdminSettings";
import AdminAuditLog from "@/components/admin/AdminAuditLog";
import AdminRoles from "@/components/admin/AdminRoles";
import AdminPlayStore from "@/components/admin/AdminPlayStore";
import { useRole, canAccessSection } from "@/hooks/use-role";

const sectionComponents: Record<AdminSection, React.ComponentType> = {
  overview: AdminOverview,
  users: AdminUsers,
  subscriptions: AdminSubscriptions,
  gifts: AdminGiftCodes,
  modules: AdminModules,
  arcanos: AdminArcanos,
  quizzes: AdminQuizzes,
  progress: AdminProgress,
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
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Carregando…</div>;
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => navigate("/app")} className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg text-foreground tracking-wider">Painel Administrativo</h1>
          <span className={`ml-auto text-[10px] font-heading tracking-[0.2em] uppercase px-2 py-1 rounded-full ${
            role === "admin" ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
          }`}>
            {role === "admin" ? "Admin" : "Moderador"}
          </span>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar active={activeSection} onChange={setActiveSection} role={role} />
        <main className="flex-1 p-4 sm:p-8 max-w-5xl pb-24 md:pb-8">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <ShieldAlert className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Esta área é restrita a administradores.</p>
            </div>
          )}
        </main>
      </div>

      <AdminMobileNav active={activeSection} onChange={setActiveSection} role={role} />
    </div>
  );
};

export default AdminPage;
