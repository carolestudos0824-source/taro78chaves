import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ShieldCheck, User as UserIcon, Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { logAdminAction } from "@/lib/admin-audit";

interface RoleRow {
  id: string;
  user_id: string;
  role: "admin" | "moderator";
  email: string | null;
  display_name: string | null;
  is_principal: boolean;
}

interface SearchResult {
  id: string;
  email: string;
  created_at: string;
}

const AdminRoles = () => {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-manage", { body: { action: "list" } });
    if (!error && data) {
      setRows(data.admins ?? []);
      setCurrentUserId(data.current_user_id ?? null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const admins = useMemo(() => rows.filter(r => r.role === "admin"), [rows]);
  const mods = useMemo(() => rows.filter(r => r.role === "moderator"), [rows]);

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    const { data, error } = await supabase.functions.invoke("admin-manage", {
      body: { action: "search", email: searchEmail },
    });
    setSearching(false);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else setResults(data?.users ?? []);
  };

  const promote = async (userId: string, email: string | null, role: "admin" | "moderator") => {
    setBusy(userId + role);
    const { data, error } = await supabase.functions.invoke("admin-manage", {
      body: { action: "promote", target_user_id: userId, role },
    });
    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Erro", description: error?.message || data?.error, variant: "destructive" });
      return;
    }
    toast({ title: role === "admin" ? "Promovido a admin" : "Promovido a moderador" });
    await logAdminAction({
      action: "role.promote",
      targetType: "user",
      targetId: userId,
      targetLabel: email,
      details: { role },
    });
    setResults([]);
    setSearchEmail("");
    load();
  };

  const demote = async (row: RoleRow) => {
    if (!confirm(`Remover ${row.role === "admin" ? "permissão de admin" : "permissão de moderador"} de ${row.email ?? row.display_name}?`)) return;
    setBusy(row.user_id + row.role);
    const { data, error } = await supabase.functions.invoke("admin-manage", {
      body: { action: "demote", target_user_id: row.user_id, role: row.role },
    });
    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Erro", description: error?.message || data?.error, variant: "destructive" });
      return;
    }
    toast({ title: "Permissão removida" });
    await logAdminAction({
      action: "role.demote",
      targetType: "user",
      targetId: row.user_id,
      targetLabel: row.email,
      details: { role: row.role },
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Funções administrativas</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie quem é administrador, moderador ou usuário comum.
        </p>
      </div>

      {/* Permission matrix */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4">
        <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">
          O que cada papel pode fazer
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <RoleCard
            icon={<ShieldCheck className="w-4 h-4" />}
            color="bg-amber-500/10 text-amber-600"
            title="Administrador"
            perms={[
              "Acesso total ao painel",
              "Conceder e remover premium",
              "Promover e rebaixar papéis",
              "Editar módulos, arcanos e quizzes",
              "Criar códigos de presente",
              "Visualizar auditoria",
            ]}
          />
          <RoleCard
            icon={<Shield className="w-4 h-4" />}
            color="bg-secondary/10/10 text-secondary"
            title="Moderador"
            perms={[
              "Visualizar usuários e progresso",
              "Visualizar suporte e feedback",
              "Visualizar auditoria",
              "Não pode conceder premium",
              "Não pode editar conteúdo",
              "Não pode promover papéis",
            ]}
          />
          <RoleCard
            icon={<UserIcon className="w-4 h-4" />}
            color="bg-muted text-muted-foreground"
            title="Usuário"
            perms={["Acesso ao curso conforme assinatura", "Sem acesso ao painel administrativo"]}
          />
        </div>
      </div>

      {/* Search & promote */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
        <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground/60">
          Promover usuário
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Buscar por e-mail…"
              className="pl-8 h-9 text-sm"
            />
          </div>
          <Button size="sm" onClick={handleSearch} disabled={searching}>
            {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Buscar"}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-1.5 pt-2">
            {results.map(r => (
              <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-card/40">
                <span className="text-sm text-foreground">{r.email}</span>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => promote(r.id, r.email, "moderator")} disabled={busy === r.id + "moderator"}>
                    <Shield className="w-3 h-3 mr-1" /> Tornar moderador
                  </Button>
                  <Button size="sm" className="h-7 text-xs" onClick={() => promote(r.id, r.email, "admin")} disabled={busy === r.id + "admin"}>
                    <ShieldCheck className="w-3 h-3 mr-1" /> Tornar admin
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lists */}
      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Carregando…
        </div>
      ) : (
        <>
          <RoleList
            title="Administradores"
            icon={<ShieldCheck className="w-4 h-4 text-amber-600" />}
            rows={admins}
            currentUserId={currentUserId}
            busy={busy}
            onDemote={demote}
            emptyText="Nenhum administrador além de você."
          />
          <RoleList
            title="Moderadores"
            icon={<Shield className="w-4 h-4 text-secondary" />}
            rows={mods}
            currentUserId={currentUserId}
            busy={busy}
            onDemote={demote}
            emptyText="Nenhum moderador cadastrado."
          />
        </>
      )}
    </div>
  );
};

const RoleCard = ({ icon, color, title, perms }: { icon: React.ReactNode; color: string; title: string; perms: string[] }) => (
  <div className="rounded-lg border border-border/40 bg-card/40 p-3">
    <div className="flex items-center gap-2 mb-2">
      <span className={`w-7 h-7 rounded-full flex items-center justify-center ${color}`}>{icon}</span>
      <span className="font-heading text-sm text-foreground">{title}</span>
    </div>
    <ul className="space-y-1 text-xs text-muted-foreground">
      {perms.map(p => <li key={p} className="leading-snug">• {p}</li>)}
    </ul>
  </div>
);

const RoleList = ({ title, icon, rows, currentUserId, busy, onDemote, emptyText }: {
  title: string;
  icon: React.ReactNode;
  rows: RoleRow[];
  currentUserId: string | null;
  busy: string | null;
  onDemote: (row: RoleRow) => void;
  emptyText: string;
}) => (
  <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
      {icon}
      <span className="font-heading text-sm text-foreground">{title}</span>
      <span className="ml-auto text-xs text-muted-foreground">{rows.length}</span>
    </div>
    {rows.length === 0 ? (
      <p className="p-6 text-center text-xs text-muted-foreground">{emptyText}</p>
    ) : (
      <div className="divide-y divide-border/20">
        {rows.map(r => (
          <div key={r.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm text-foreground">{r.display_name ?? r.email ?? r.user_id.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">{r.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {r.user_id === currentUserId && r.role === "admin" && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">você</span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => onDemote(r)}
                disabled={busy === r.user_id + r.role || (r.user_id === currentUserId && r.role === "admin")}
              >
                <X className="w-3 h-3 mr-1" /> Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AdminRoles;
