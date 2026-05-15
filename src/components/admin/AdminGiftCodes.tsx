import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Gift, Plus, Copy, Check, Search, Calendar, Users, Crown, History, Ban, RotateCcw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/admin-audit";
import { AdminSectionHeading } from "./AdminComponents";

interface GiftCode {
  id: string;
  code: string;
  duration_days: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  created_by: string | null;
}

interface Redemption {
  id: string;
  gift_code_id: string;
  user_id: string;
  redeemed_at: string;
}

const generateCode = (prefix = "ARCANO") => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = `${prefix}-`;
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

type StatusFilter = "all" | "active" | "exhausted" | "expired" | "disabled";
type PlanPreset = "monthly" | "annual" | "promo" | "custom";

const PLAN_PRESETS: Record<PlanPreset, { label: string; days: number; prefix: string }> = {
  monthly: { label: "Mensal (30 dias)", days: 30, prefix: "MENSAL" },
  annual: { label: "Anual (365 dias)", days: 365, prefix: "ANUAL" },
  promo: { label: "Promocional (7 dias)", days: 7, prefix: "PROMO" },
  custom: { label: "Personalizado", days: 30, prefix: "ARCANO" },
};

const AdminGiftCodes = () => {
  const { user } = useAuth();
  const [codes, setCodes] = useState<GiftCode[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [historyCode, setHistoryCode] = useState<GiftCode | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);

  // form
  const [plan, setPlan] = useState<PlanPreset>("monthly");
  const [duration, setDuration] = useState(30);
  const [maxUses, setMaxUses] = useState(1);
  const [batchCount, setBatchCount] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");

  const fetchAll = useCallback(async () => {
    const [{ data: c }, { data: r }] = await Promise.all([
      supabase.from("gift_codes").select("*").order("created_at", { ascending: false }),
      supabase.from("gift_redemptions").select("*").order("redeemed_at", { ascending: false }),
    ]);
    setCodes(c || []);
    setRedemptions(r || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Sync preset
  useEffect(() => {
    if (plan !== "custom") setDuration(PLAN_PRESETS[plan].days);
  }, [plan]);

  const now = useMemo(() => new Date(), []);

  const getStatus = (gc: GiftCode) => {
    if (!gc.is_active) return { label: "Desativado", cls: "bg-muted text-muted-foreground", key: "disabled" as const };
    if (gc.expires_at && new Date(gc.expires_at) < now) return { label: "Expirado", cls: "bg-red-500/10 text-red-500", key: "expired" as const };
    if (gc.current_uses >= gc.max_uses) return { label: "Esgotado", cls: "bg-amber-500/10 text-amber-600", key: "exhausted" as const };
    return { label: "Ativo", cls: "bg-primary/10/10 text-primary", key: "active" as const };
  };

  const enriched = useMemo(() => codes.map(c => ({ ...c, status: getStatus(c) })), [codes, now]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.code.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter(c => c.status.key === statusFilter);
    return list;
  }, [enriched, search, statusFilter]);

  const stats = useMemo(() => ({
    total: codes.length,
    active: enriched.filter(c => c.status.key === "active").length,
    redeemed: redemptions.length,
    exhausted: enriched.filter(c => c.status.key === "exhausted").length,
  }), [codes, enriched, redemptions]);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    const prefix = PLAN_PRESETS[plan].prefix;
    const rows = Array.from({ length: Math.max(1, batchCount) }, () => ({
      code: generateCode(prefix),
      duration_days: duration,
      max_uses: maxUses,
      created_by: user.id,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    }));
    const { data: created, error } = await supabase.from("gift_codes").insert(rows).select();
    if (error) toast.error("Erro ao criar: " + error.message);
    else {
      toast.success(`${rows.length} código${rows.length > 1 ? "s" : ""} criado${rows.length > 1 ? "s" : ""}!`);
      // Audit each created code
      await Promise.all((created ?? []).map(c => logAdminAction({
        action: "gift_code.create",
        targetType: "gift_code",
        targetId: c.id,
        targetLabel: c.code,
        details: { duration_days: c.duration_days, max_uses: c.max_uses, plan },
      })));
      fetchAll();
    }
    setCreating(false);
  };

  const toggleActive = async (gc: GiftCode) => {
    const { error } = await supabase.from("gift_codes").update({ is_active: !gc.is_active }).eq("id", gc.id);
    if (error) toast.error(error.message);
    else {
      toast.success(gc.is_active ? "Código desativado" : "Código reativado");
      // Only audit deactivation (per requirement)
      if (gc.is_active) {
        await logAdminAction({
          action: "gift_code.deactivate",
          targetType: "gift_code",
          targetId: gc.id,
          targetLabel: gc.code,
        });
      }
      fetchAll();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <AdminSectionHeading 
          title="Presentes & Códigos" 
          subtitle="Gestão estratégica de acesso premium — criação, distribuição e auditoria de chaves de acesso." 
        />
        <Button size="sm" variant="outline" className="mt-4 border-[#C8A66A]/40 text-[#5B1F3D] font-bold" onClick={() => setGrantOpen(true)}>
          <Crown className="w-4 h-4 mr-1.5" /> Conceder direto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <GiftStatCard icon={<Gift className="w-6 h-6" />} label="Total Criados" value={stats.total} />
        <GiftStatCard icon={<Check className="w-6 h-6" />} label="Ativos" value={stats.active} accent />
        <GiftStatCard icon={<Users className="w-6 h-6" />} label="Resgatados" value={stats.redeemed} />
        <GiftStatCard icon={<Ban className="w-6 h-6" />} label="Esgotados" value={stats.exhausted} />
      </div>

      {/* Create form */}
      <div className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-3">
        <h3 className="font-heading text-sm text-foreground">Criar novos códigos</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Plano</label>
            <Select value={plan} onValueChange={(v) => setPlan(v as PlanPreset)}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PLAN_PRESETS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Dias de acesso</label>
            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="h-9 text-sm" min={1} disabled={plan !== "custom"} />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Usos máximos</label>
            <Input type="number" value={maxUses} onChange={(e) => setMaxUses(Number(e.target.value))} className="h-9 text-sm" min={1} />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Validade do código</label>
            <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Quantidade</label>
            <Input type="number" value={batchCount} onChange={(e) => setBatchCount(Number(e.target.value))} className="h-9 text-sm" min={1} max={50} />
          </div>
        </div>
        <Button onClick={handleCreate} disabled={creating} size="sm">
          <Plus className="w-4 h-4" />
          {creating ? "Criando..." : `Gerar ${batchCount > 1 ? `${batchCount} códigos` : "código"}`}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar código..." className="pl-8 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="exhausted">Esgotados</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="disabled">Desativados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
          <Gift className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum código encontrado.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card/50 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-card/60">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Código</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Acesso</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Usos</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Validade</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Criado</th>
                <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-right p-3 text-xs text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((gc) => (
                <tr key={gc.id} className="border-b border-border/10 last:border-0 hover:bg-card/80 transition-colors">
                  <td className="p-3 font-mono text-xs text-foreground">{gc.code}</td>
                  <td className="p-3 text-center text-muted-foreground text-xs">{gc.duration_days} dias</td>
                  <td className="p-3 text-center text-muted-foreground text-xs">{gc.current_uses}/{gc.max_uses}</td>
                  <td className="p-3 text-center text-muted-foreground text-xs">
                    {gc.expires_at ? new Date(gc.expires_at).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="p-3 text-center text-muted-foreground text-xs">
                    {new Date(gc.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${gc.status.cls}`}>
                      {gc.status.label}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => copyCode(gc.code)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Copiar">
                        {copied === gc.code ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setHistoryCode(gc)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Histórico">
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleActive(gc)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title={gc.is_active ? "Desativar" : "Reativar"}>
                        {gc.is_active ? <Ban className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Redemption history */}
      <Dialog open={!!historyCode} onOpenChange={(o) => !o && setHistoryCode(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">Histórico do código</DialogTitle></DialogHeader>
          {historyCode && <RedemptionHistory code={historyCode} redemptions={redemptions.filter(r => r.gift_code_id === historyCode.id)} />}
        </DialogContent>
      </Dialog>

      {/* Manual grant */}
      <ManualGrantDialog open={grantOpen} onClose={() => setGrantOpen(false)} />
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) => (
  <div className={`rounded-xl border border-border/50 bg-card/50 p-3 ${accent ? "ring-1 ring-primary/20" : ""}`}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={accent ? "text-primary" : "text-muted-foreground"}>{icon}</span>
    </div>
    <p className="font-heading text-2xl text-foreground mt-1">{value}</p>
  </div>
);

const RedemptionHistory = ({ code, redemptions }: { code: GiftCode; redemptions: Redemption[] }) => {
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  useEffect(() => {
    const ids = redemptions.map(r => r.user_id);
    if (!ids.length) return;
    supabase.from("profiles").select("user_id, display_name").in("user_id", ids).then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((p: any) => { map[p.user_id] = p.display_name || p.user_id.slice(0, 8); });
      setProfiles(map);
    });
  }, [redemptions]);

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">
        <p>Código: <span className="font-mono text-foreground">{code.code}</span></p>
        <p>Acesso: {code.duration_days} dias · Usos: {code.current_uses}/{code.max_uses}</p>
      </div>
      {redemptions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">Nenhum resgate ainda.</p>
      ) : (
        <div className="rounded-lg border border-border/40 divide-y divide-border/30 max-h-72 overflow-y-auto">
          {redemptions.map(r => (
            <div key={r.id} className="p-3 flex items-center justify-between text-sm">
              <span className="text-foreground">{profiles[r.user_id] || r.user_id.slice(0, 8) + "..."}</span>
              <span className="text-xs text-muted-foreground">{new Date(r.redeemed_at).toLocaleString("pt-BR")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ManualGrantDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(30);
  const [results, setResults] = useState<{ id: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!email) return;
    setLoading(true);
    const { data } = await supabase.functions.invoke("admin-manage", { body: { action: "search", email } });
    setResults(data?.users || []);
    setLoading(false);
  };

  const grant = async (userId: string, source: "gift" | "admin") => {
    const { data, error } = await supabase.functions.invoke("admin-manage", {
      body: { action: "grant_premium", target_user_id: userId, days, source },
    });
    if (error || data?.error) toast.error(error?.message || data?.error);
    else { toast.success(`Premium concedido por ${days} dias`); onClose(); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-heading">Conceder premium direto</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Sem código — concede acesso premium diretamente a um usuário por e-mail.</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" className="pl-8 h-9 text-sm" onKeyDown={(e) => e.key === "Enter" && search()} />
            </div>
            <Button size="sm" onClick={search} disabled={loading}>{loading ? "..." : "Buscar"}</Button>
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">Duração (dias)</label>
            <Input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} min={1} className="h-9 text-sm w-32" />
          </div>
          {results.length > 0 && (
            <div className="border border-border/40 rounded-lg divide-y divide-border/30 max-h-48 overflow-y-auto">
              {results.map(u => (
                <div key={u.id} className="p-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground truncate">{u.email}</span>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => grant(u.id, "gift")}>
                      <Gift className="w-3 h-3" /> Presente
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={() => grant(u.id, "admin")}>
                      <Crown className="w-3 h-3" /> Admin
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminGiftCodes;
