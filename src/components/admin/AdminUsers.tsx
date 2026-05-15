import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Crown, Gift, RotateCcw, Shield, ArrowUpDown, X, Mail, Calendar, Activity, Award, Flame, BookOpen, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { logAdminAction, type AdminAction } from "@/lib/admin-audit";
import { useRole } from "@/hooks/use-role";
import { AdminSectionHeading } from "./AdminComponents";

interface ProfileRow {
  user_id: string;
  display_name: string | null;
  is_premium: boolean;
  premium_until: string | null;
  premium_source: string | null;
  created_at: string;
  updated_at: string;
}

interface ProgressRow {
  user_id: string;
  completed_lessons: string[];
  completed_modules: string[];
  completed_quizzes: string[];
  last_active: string;
  streak: number;
  xp: number;
  level: number;
}

interface AuthLite {
  id: string;
  email: string | null;
  last_sign_in_at: string | null;
}

type StatusFilter = "all" | "premium" | "free" | "gift" | "expired" | "admin";
type SortField = "created_at" | "last_active" | "xp" | "lessons";

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [emails, setEmails] = useState<Record<string, AuthLite>>({});
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: prof }, { data: prog }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, is_premium, premium_until, premium_source, created_at, updated_at").order("created_at", { ascending: false }),
      supabase.from("user_progress").select("user_id, completed_lessons, completed_modules, completed_quizzes, last_active, streak, xp, level"),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);
    setProfiles(prof || []);
    setProgress(prog || []);
    setAdminIds(new Set((roles || []).map((r: any) => r.user_id)));

    // Fetch emails via edge function
    const { data: emailData } = await supabase.functions.invoke("admin-manage", {
      body: { action: "list_users", perPage: 200 },
    });
    if (emailData?.users) {
      const map: Record<string, AuthLite> = {};
      emailData.users.forEach((u: AuthLite) => { map[u.id] = u; });
      setEmails(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const now = useMemo(() => new Date(), [profiles]);

  const progressMap = useMemo(() => {
    const map: Record<string, ProgressRow> = {};
    progress.forEach(p => { map[p.user_id] = p; });
    return map;
  }, [progress]);

  const getStatus = (u: ProfileRow) => {
    if (adminIds.has(u.user_id)) return { label: "Admin", cls: "bg-amber-500/10 text-amber-600", key: "admin" as const };
    if (!u.is_premium) return { label: "Gratuito", cls: "bg-muted text-muted-foreground", key: "free" as const };
    const until = u.premium_until ? new Date(u.premium_until) : null;
    if (until && until <= now) return { label: "Expirado", cls: "bg-destructive/10 text-destructive", key: "expired" as const };
    if (u.premium_source === "gift" || u.premium_source === "admin") return { label: "Presenteado", cls: "bg-secondary/10/10 text-secondary", key: "gift" as const };
    return { label: "Assinante", cls: "bg-primary/10 text-primary", key: "premium" as const };
  };

  const enriched = useMemo(() => {
    return profiles.map(u => ({
      ...u,
      status: getStatus(u),
      email: emails[u.user_id]?.email || null,
      progress: progressMap[u.user_id],
    }));
  }, [profiles, progressMap, emails, adminIds, now]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.display_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        u.user_id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter(u => u.status.key === statusFilter);
    }
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "last_active":
          return new Date(b.progress?.last_active || 0).getTime() - new Date(a.progress?.last_active || 0).getTime();
        case "xp":
          return (b.progress?.xp || 0) - (a.progress?.xp || 0);
        case "lessons":
          return (b.progress?.completed_lessons?.length || 0) - (a.progress?.completed_lessons?.length || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return list;
  }, [enriched, search, statusFilter, sortBy]);

  const stats = useMemo(() => ({
    total: profiles.length,
    premium: profiles.filter(u => u.is_premium && (!u.premium_until || new Date(u.premium_until) > now)).length,
    expired: profiles.filter(u => u.is_premium && u.premium_until && new Date(u.premium_until) <= now).length,
    admins: adminIds.size,
  }), [profiles, adminIds, now]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando usuários...</div>;

  return (
    <div className="space-y-10">
      <AdminSectionHeading 
        title="Usuários" 
        subtitle="Gestão completa de pessoas, acesso e progresso na jornada Tarô 78 Chaves." 
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={<Users className="w-6 h-6" />} label="Total" value={stats.total} />
        <StatCard icon={<Crown className="w-6 h-6" />} label="Premium ativos" value={stats.premium} accent />
        <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Expirados" value={stats.expired} />
        <StatCard icon={<Shield className="w-6 h-6" />} label="Admins" value={stats.admins} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white/60 p-6 rounded-[2.5rem] border-2 border-[#C8A66A]/20 backdrop-blur-md shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B1F3D]/50" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Buscar por nome, e-mail ou ID..." 
            className="pl-12 h-12 text-base font-body font-bold bg-white border-[#C8A66A]/30 rounded-2xl focus-visible:ring-[#5B1F3D] shadow-inner" 
          />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-44 h-12 text-xs font-heading font-black tracking-widest uppercase border-2 border-[#C8A66A]/30 bg-white rounded-2xl shadow-sm"><SelectValue /></SelectTrigger>
          <SelectContent className="font-heading text-[11px] font-black tracking-widest uppercase">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="free">Gratuitos</SelectItem>
            <SelectItem value="premium">Assinantes</SelectItem>
            <SelectItem value="gift">Presenteados</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={v => setSortBy(v as SortField)}>
          <SelectTrigger className="w-56 h-12 text-xs font-heading font-black tracking-widest uppercase border-2 border-[#C8A66A]/30 bg-white rounded-2xl shadow-sm">
            <ArrowUpDown className="w-4 h-4 mr-2 text-[#C8A66A]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="font-heading text-[11px] font-black tracking-widest uppercase">
            <SelectItem value="created_at">Cadastro Recente</SelectItem>
            <SelectItem value="last_active">Última Atividade</SelectItem>
            <SelectItem value="xp">Maior XP</SelectItem>
            <SelectItem value="lessons">Mais Lições</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
          <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="rounded-[3rem] border-2 border-[#C8A66A]/20 bg-white overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b-2 border-[#C8A66A]/20 bg-[#FAF5EF]/60">
                  <th className="text-left p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Usuário</th>
                  <th className="text-center p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Status</th>
                  <th className="text-center p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Plano Até</th>
                  <th className="text-center p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Cadastro</th>
                  <th className="text-center p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Atividade</th>
                  <th className="text-center p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Lições</th>
                  <th className="text-center p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">XP</th>
                  <th className="text-center p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Streak</th>
                  <th className="text-right p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(u => (
                  <tr key={u.user_id} className="border-b border-[#C8A66A]/10 last:border-0 hover:bg-[#FAF5EF]/30 transition-colors">
                    <td className="p-4">
                      <p className="text-[#5B1F3D] font-black leading-tight text-[15px]">{u.display_name || "Sem nome"}</p>
                      <p className="text-[11px] font-body font-bold text-[#5B1F3D]/50 mt-1">{u.email || `${u.user_id.slice(0, 8)}...`}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-heading font-black tracking-widest px-3 py-1 rounded-full border shadow-sm ${u.status.cls}`}>
                        {u.status.label.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center text-[#5B1F3D] font-body font-bold text-xs">
                      {u.premium_until ? new Date(u.premium_until).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="p-4 text-center text-[#5B1F3D]/70 font-body font-bold text-xs">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="p-4 text-center text-[#5B1F3D]/70 font-body font-bold text-xs">
                      {u.progress?.last_active ? new Date(u.progress.last_active).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="p-4 text-center text-[#5B1F3D] font-heading font-black text-xs">{u.progress?.completed_lessons?.length || 0}</td>
                    <td className="p-4 text-center text-[#5B1F3D] font-heading font-black text-xs">{u.progress?.xp || 0}</td>
                    <td className="p-4 text-center">
                      {u.progress?.streak ? (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-[#5B1F3D] text-white font-heading font-black shadow-sm tracking-widest">🔥 {u.progress.streak}</span>
                      ) : <span className="text-xs text-[#5B1F3D]/20 font-black">—</span>}
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-9 px-4 text-[10px] font-heading font-black tracking-widest uppercase border border-[#C8A66A]/30 rounded-xl hover:bg-[#5B1F3D] hover:text-white transition-all" 
                        onClick={() => setSelected(u.user_id)}
                      >
                        Abrir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 100 && (
            <div className="p-4 text-center text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]/40 border-t border-[#C8A66A]/20 bg-[#FAF5EF]/30">
              Mostrando 100 de {filtered.length} usuários
            </div>
          )}
        </div>
      )}

      <UserDetailDialog
        userId={selected}
        onClose={() => setSelected(null)}
        onChanged={load}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) => (
  <div className={`rounded-2xl border-2 p-5 shadow-lg transition-all hover:scale-105 bg-white ${accent ? "border-[#C8A66A] ring-4 ring-[#C8A66A]/10" : "border-[#C8A66A]/20"}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]/40">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-[#5B1F3D] text-white" : "bg-[#FAF5EF] text-[#C8A66A] border border-[#C8A66A]/10"}`}>
        {icon}
      </div>
    </div>
    <p className="font-heading text-3xl font-black text-[#5B1F3D] tracking-tighter">{value}</p>
  </div>
);

// ============== USER DETAIL DIALOG ==============

interface UserDetail {
  auth: { email: string | null; created_at: string | null; last_sign_in_at: string | null } | null;
  profile: ProfileRow | null;
  progress: ProgressRow | null;
  roles: string[];
  redemptions: { redeemed_at: string; gift_code_id: string }[] | null;
  warnings?: { source: string; message: string }[];
  diagnostics?: { action?: string; target_user_id?: string | null; error_stage?: string; http_status?: number; warnings_count?: number };
}

interface AdminManageResponse<T> {
  ok?: boolean;
  error?: string;
  diagnostics?: { action?: string; target_user_id?: string | null; error_stage?: string; http_status?: number; warnings_count?: number };
  success?: boolean;
  users?: AuthLite[];
  admins?: unknown[];
  current_user_id?: string;
  role?: string;
  premium_until?: string;
  action_link?: string;
  email?: string;
}

const getAdminManageErrorMessage = (error?: { message?: string | null } | null, payload?: AdminManageResponse<UserDetail> | null) => {
  if (payload?.ok === false) {
    const stage = payload.diagnostics?.error_stage ? ` (${payload.diagnostics.error_stage})` : "";
    return `${payload.error || "Falha ao carregar perfil administrativo."}${stage}`;
  }
  if (payload?.error) return payload.error;
  if (error?.message) return error.message;
  return "Falha ao carregar perfil administrativo.";
};

const UserDetailDialog = ({ userId, onClose, onChanged }: { userId: string | null; onClose: () => void; onChanged: () => void }) => {
  const { isAdmin } = useRole();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [days, setDays] = useState("30");

  useEffect(() => {
    if (!userId) { setData(null); setLoadError(null); return; }
    setLoading(true);
    setLoadError(null);
    supabase.functions
      .invoke("admin-manage", { body: { action: "user_detail", target_user_id: userId } })
      .then(({ data, error }) => {
        const payload = (data ?? null) as (UserDetail & AdminManageResponse<UserDetail>) | null;
        if (error || payload?.ok === false || payload?.error) {
          const msg = getAdminManageErrorMessage(error, payload);
          setLoadError(msg);
          toast({ title: "Erro ao abrir perfil", description: msg, variant: "destructive" });
        } else {
          setData(payload);
        }
        setLoading(false);
      });
  }, [userId]);

  const run = async (action: string, body: Record<string, unknown> = {}, successMsg = "Atualizado") => {
    if (!userId) return;
    setBusy(action);
    const { data: res, error } = await supabase.functions.invoke("admin-manage", {
      body: { action, target_user_id: userId, ...body },
    });
    setBusy(null);
    const payload = (res ?? null) as AdminManageResponse<UserDetail> | null;
    if (error || payload?.ok === false || payload?.error) {
      toast({ title: "Erro", description: getAdminManageErrorMessage(error, payload), variant: "destructive" });
      return;
    }
    toast({ title: successMsg });

    // Audit log: map edge action → audit action
    const auditMap: Record<string, AdminAction> = {
      grant_premium: "premium.grant",
      revoke_premium: "premium.revoke",
      promote: "role.promote",
      demote: "role.demote",
    };
    const auditAction = auditMap[action];
    if (auditAction) {
      await logAdminAction({
        action: auditAction,
        targetType: "user",
        targetId: userId,
        targetLabel: data?.profile?.display_name ?? data?.auth?.email ?? null,
        details: body,
      });
    }

    // Refresh detail and outer list
    const { data: refreshed } = await supabase.functions.invoke("admin-manage", {
      body: { action: "user_detail", target_user_id: userId },
    });
    const refreshedPayload = (refreshed ?? null) as (UserDetail & AdminManageResponse<UserDetail>) | null;
    if (refreshedPayload?.ok !== false) setData(refreshedPayload);
    onChanged();
  };

  return (
    <Dialog open={!!userId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Perfil administrativo</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>
        ) : loadError ? (
          <div className="p-6 space-y-3 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
            <p className="text-sm text-foreground font-medium">Não foi possível abrir o perfil</p>
            <p className="text-xs text-muted-foreground break-words">{loadError}</p>
            <Button size="sm" variant="outline" onClick={onClose}>Fechar</Button>
          </div>
        ) : !data ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Sem dados.</div>
        ) : (
          <div className="space-y-5">
            {Array.isArray(data.warnings) && data.warnings.length > 0 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-[11px] text-destructive space-y-1">
                <p className="font-medium">Perfil parcial — alguns dados não puderam ser carregados:</p>
                <ul className="list-disc list-inside">
                  {data.warnings.map((w, i) => (
                    <li key={i}><span className="font-mono">{w.source}</span>: {w.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Header */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4">
              <p className="font-heading text-lg text-foreground">{data.profile?.display_name || "Sem nome"}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{data.auth?.email || "—"}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />Criado {data.auth?.created_at ? new Date(data.auth.created_at).toLocaleDateString("pt-BR") : "—"}</span>
                <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" />Último login {data.auth?.last_sign_in_at ? new Date(data.auth.last_sign_in_at).toLocaleDateString("pt-BR") : "—"}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.roles.includes("admin") && <span className="text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">ADMIN</span>}
                {data.profile?.is_premium ? (
                  <span className="text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    PREMIUM · {data.profile.premium_source || "—"}
                  </span>
                ) : (
                  <span className="text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full bg-muted text-muted-foreground">GRATUITO</span>
                )}
                {data.profile?.premium_until && (
                  <span className="text-[10px] text-muted-foreground">até {new Date(data.profile.premium_until).toLocaleDateString("pt-BR")}</span>
                )}
              </div>
            </div>

            {/* Progress stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <ProgressStat icon={<Award className="w-3.5 h-3.5" />} label="XP" value={data.progress?.xp ?? 0} />
              <ProgressStat icon={<Flame className="w-3.5 h-3.5" />} label="Streak" value={data.progress?.streak ?? 0} />
              <ProgressStat icon={<BookOpen className="w-3.5 h-3.5" />} label="Lições" value={data.progress?.completed_lessons?.length ?? 0} />
              <ProgressStat icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Quizzes" value={data.progress?.completed_quizzes?.length ?? 0} />
            </div>

            <div className="text-xs text-muted-foreground">
              Módulos concluídos: <span className="text-foreground font-medium">{data.progress?.completed_modules?.length ?? 0}</span> · Nível: <span className="text-foreground font-medium">{data.progress?.level ?? 1}</span> · Resgates de presente: <span className="text-foreground font-medium">{data.redemptions?.length ?? 0}</span>
            </div>

            {/* Premium + Roles — admin only */}
            {isAdmin ? (
              <>
                <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
                  <p className="text-xs font-heading tracking-wider text-muted-foreground uppercase">Acesso premium</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-20 h-9 text-sm" min={1} />
                    <span className="text-xs text-muted-foreground">dias</span>
                    <Button size="sm" onClick={() => run("grant_premium", { days: Number(days), source: "admin" }, "Premium concedido")} disabled={busy === "grant_premium"}>
                      <Crown className="w-3.5 h-3.5" /> Conceder premium
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => run("grant_premium", { days: Number(days), source: "gift" }, "Presente concedido")} disabled={busy === "grant_premium"}>
                      <Gift className="w-3.5 h-3.5" /> Presentear
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => run("revoke_premium", {}, "Premium removido")} disabled={busy === "revoke_premium" || !data.profile?.is_premium}>
                      Remover premium
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
                  <p className="text-xs font-heading tracking-wider text-muted-foreground uppercase">Funções e progresso</p>
                  <div className="flex flex-wrap gap-2">
                    {data.roles.includes("admin") ? (
                      <Button size="sm" variant="outline" onClick={() => run("demote", {}, "Admin removido")} disabled={busy === "demote"}>
                        <Shield className="w-3.5 h-3.5" /> Remover admin
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => run("promote", {}, "Promovido a admin")} disabled={busy === "promote"}>
                        <Shield className="w-3.5 h-3.5" /> Tornar admin
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => {
                      if (confirm("Tem certeza? Isso zera XP, streak, lições e módulos concluídos.")) run("reset_progress", {}, "Progresso resetado");
                    }} disabled={busy === "reset_progress"}>
                      <RotateCcw className="w-3.5 h-3.5" /> Resetar progresso
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-xs text-muted-foreground">
                Visualização em modo leitura. Apenas administradores podem alterar premium, papéis ou resetar progresso.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProgressStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="rounded-lg border border-border/40 bg-card/40 p-2.5">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
      {icon}{label}
    </div>
    <p className="font-heading text-lg text-foreground">{value}</p>
  </div>
);

export default AdminUsers;
