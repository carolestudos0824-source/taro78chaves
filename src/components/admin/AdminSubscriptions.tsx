import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Crown, Gift, TrendingUp, TrendingDown, DollarSign, Repeat,
  CalendarDays, Filter, RefreshCw, AlertCircle, Sparkles, Plug,
} from "lucide-react";
import { PLAN_PRICES, monthlyValue, isRealRevenueEnabled } from "@/lib/billing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSectionHeading, KPICard as AdminKPICard } from "./AdminComponents";

/* ═══════════ TYPES ═══════════ */

type SubStatus =
  | "monthly_active"
  | "annual_active"
  | "gift_active"
  | "admin_grant"
  | "expired"
  | "cancelled_with_access"
  | "cancelled_expired"
  | "free";

interface ProfileRow {
  user_id: string;
  display_name: string | null;
  is_premium: boolean;
  premium_until: string | null;
  premium_source: string | null;
  created_at: string;
  updated_at: string;
}

interface GiftRedemption {
  user_id: string;
  redeemed_at: string;
  gift_code_id: string;
}

function resolveStatus(p: ProfileRow, now: Date): SubStatus {
  const until = p.premium_until ? new Date(p.premium_until) : null;
  if (!p.is_premium && !until) return "free";
  if (!p.is_premium && until && until > now) return "cancelled_with_access";
  if (!p.is_premium && until && until <= now) return "cancelled_expired";
  if (p.is_premium && until && until <= now) return "expired";
  if (p.is_premium && p.premium_source === "gift") return "gift_active";
  if (p.is_premium && p.premium_source === "admin") return "admin_grant";
  if (p.is_premium && p.premium_source === "store_annual") return "annual_active";
  if (p.is_premium) return "monthly_active";
  return "free";
}

const STATUS_LABELS: Record<SubStatus, string> = {
  monthly_active: "Mensal ativo",
  annual_active: "Anual ativo",
  gift_active: "Presenteado",
  admin_grant: "Concedido (admin)",
  expired: "Expirado",
  cancelled_with_access: "Cancelado (com acesso)",
  cancelled_expired: "Cancelado",
  free: "Gratuito",
};

const STATUS_COLORS: Record<SubStatus, string> = {
  monthly_active: "bg-[#5B1F3D] text-white border-[#C8A66A]",
  annual_active: "bg-[#5B1F3D] text-white border-[#C8A66A]",
  gift_active: "bg-[#8B6A30] text-white border-[#C8A66A]/40",
  admin_grant: "bg-[#8B6A30]/10 text-[#8B6A30] border-[#8B6A30]/20",
  expired: "bg-red-500/10 text-red-600 border-red-200",
  cancelled_with_access: "bg-amber-500/10 text-amber-600 border-amber-200",
  cancelled_expired: "bg-red-500 text-white border-red-600",
  free: "bg-[#FAF5EF] text-[#5B1F3D]/40 border-[#C8A66A]/20",
};

const SOURCE_LABELS: Record<string, string> = {
  store_monthly: "Loja (mensal)",
  store_annual: "Loja (anual)",
  gift: "Presente",
  admin: "Admin",
};

// Prices come from src/lib/billing.ts (single source of truth, ready for Stripe).
const MONTHLY_PRICE = PLAN_PRICES.monthly.priceBRL;
const ANNUAL_PRICE = PLAN_PRICES.annual.priceBRL;

/* ═══════════ FILTERS ═══════════ */

type PeriodFilter = "all" | "30d" | "90d" | "12m";
type PlanFilter = "all" | "monthly" | "annual" | "gift" | "admin" | "free";
type StatusFilter = "all" | "active" | "expired" | "cancelled" | "gift";
type OriginFilter = "all" | "store_monthly" | "store_annual" | "gift" | "admin";

/* ═══════════ COMPONENT ═══════════ */

const AdminSubscriptions = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [gifts, setGifts] = useState<GiftRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [originFilter, setOriginFilter] = useState<OriginFilter>("all");
  const [realRevenueEnabled, setRealRevenueEnabled] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [{ data: prof }, { data: gif }, realEnabled] = await Promise.all([
        supabase.from("profiles").select("user_id, display_name, is_premium, premium_until, premium_source, created_at, updated_at"),
        supabase.from("gift_redemptions").select("user_id, redeemed_at, gift_code_id"),
        isRealRevenueEnabled(),
      ]);
      if (prof) setProfiles(prof);
      if (gif) setGifts(gif);
      setRealRevenueEnabled(realEnabled);
      setLoading(false);
    };
    load();
  }, []);

  const now = useMemo(() => new Date(), []);

  const enriched = useMemo(() => {
    return profiles.map(p => ({ ...p, status: resolveStatus(p, now) }));
  }, [profiles, now]);

  /* ─── Filters ─── */
  const filtered = useMemo(() => {
    let list = enriched;
    if (periodFilter !== "all") {
      const days = periodFilter === "30d" ? 30 : periodFilter === "90d" ? 90 : 365;
      const cutoff = new Date(now.getTime() - days * 86400000);
      list = list.filter(p => new Date(p.created_at) >= cutoff);
    }
    if (planFilter === "monthly") list = list.filter(p => p.premium_source === "store_monthly");
    else if (planFilter === "annual") list = list.filter(p => p.premium_source === "store_annual");
    else if (planFilter === "gift") list = list.filter(p => p.premium_source === "gift");
    else if (planFilter === "admin") list = list.filter(p => p.premium_source === "admin");
    else if (planFilter === "free") list = list.filter(p => p.status === "free");

    if (statusFilter === "active") list = list.filter(p => ["monthly_active", "annual_active", "gift_active", "admin_grant", "cancelled_with_access"].includes(p.status));
    else if (statusFilter === "expired") list = list.filter(p => ["expired", "cancelled_expired"].includes(p.status));
    else if (statusFilter === "cancelled") list = list.filter(p => ["cancelled_with_access", "cancelled_expired"].includes(p.status));
    else if (statusFilter === "gift") list = list.filter(p => ["gift_active", "admin_grant"].includes(p.status));

    if (originFilter !== "all") list = list.filter(p => p.premium_source === originFilter);

    return list;
  }, [enriched, periodFilter, planFilter, statusFilter, originFilter, now]);

  /* ─── Aggregated stats (full data) ─── */
  const stats = useMemo(() => {
    const monthlyActive = enriched.filter(p => p.status === "monthly_active").length;
    const annualActive = enriched.filter(p => p.status === "annual_active").length;
    const giftActive = enriched.filter(p => p.status === "gift_active").length;
    const adminGrant = enriched.filter(p => p.status === "admin_grant").length;
    const cancelledAccess = enriched.filter(p => p.status === "cancelled_with_access").length;
    const expired = enriched.filter(p => p.status === "expired").length;
    const cancelledExpired = enriched.filter(p => p.status === "cancelled_expired").length;
    const free = enriched.filter(p => p.status === "free").length;

    const activeTotal = monthlyActive + annualActive + giftActive + adminGrant + cancelledAccess;
    const totalPaying = monthlyActive + annualActive;
    // Estimated revenue — derived from current premium counts × catalog prices.
    // NOT real charged revenue. Real numbers will come from subscription_events
    // once Stripe webhook is wired (REAL_REVENUE_ENABLED flag in src/lib/billing.ts).
    const mrrEstimated = (monthlyActive * monthlyValue("monthly")) + (annualActive * monthlyValue("annual"));
    const arrEstimated = mrrEstimated * 12;
    const conversionRate = enriched.length > 0 ? Math.round(((totalPaying + giftActive) / enriched.length) * 100) : 0;

    // Growth (last 30 days)
    const cutoff30 = new Date(now.getTime() - 30 * 86400000);
    const newSignups30 = enriched.filter(p => new Date(p.created_at) >= cutoff30).length;
    const expiringSoon = enriched.filter(p => {
      if (!p.premium_until) return false;
      const u = new Date(p.premium_until);
      return u > now && u <= new Date(now.getTime() + 30 * 86400000);
    }).length;
    const recentlyExpired = enriched.filter(p => {
      if (!p.premium_until) return false;
      const u = new Date(p.premium_until);
      return u >= cutoff30 && u <= now;
    }).length;

    // Churn rate (recently expired / active 30d ago)
    const churnRate = activeTotal + recentlyExpired > 0
      ? Math.round((recentlyExpired / (activeTotal + recentlyExpired)) * 100)
      : 0;

    return {
      monthlyActive, annualActive, giftActive, adminGrant, cancelledAccess,
      expired, cancelledExpired, free,
      activeTotal, totalPaying, mrrEstimated, arrEstimated, conversionRate,
      newSignups30, expiringSoon, recentlyExpired, churnRate,
      total: enriched.length,
      giftRedemptions: gifts.length,
    };
  }, [enriched, gifts, now]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Carregando métricas comerciais...</div>;
  }

  return (
    <div className="space-y-12">
      <AdminSectionHeading 
        title="Receita & Assinaturas" 
        subtitle="Painel comercial completo — análise de receita estimada, real e ciclo de vida do cliente." 
      />

      {/* ═══════════ RECEITA ESTIMADA ═══════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">
            Receita estimada
          </h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/30" />
          <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-[#C8A66A]/20 text-[#8B6A30] border-2 border-[#C8A66A]/40 shadow-sm">
            CÁLCULO INTERNO
          </span>
        </div>
        
        <p className="text-sm font-body font-bold text-[#5B1F3D]/80 leading-relaxed bg-white/60 p-5 rounded-[2.5rem] border border-[#C8A66A]/20 shadow-sm">
          Projeção baseada em assinantes ativos × preço de catálogo. <strong className="text-[#5B1F3D] font-black">Não representa faturamento confirmado.</strong>
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={<DollarSign className="w-6 h-6" />} label="MRR estimado" value={`R$ ${stats.mrrEstimated.toFixed(2)}`} accent="text-[#8B6A30]" description="Baseado no plano mensal" />
          <KPICard icon={<Repeat className="w-6 h-6" />} label="ARR estimada" value={`R$ ${stats.arrEstimated.toFixed(0)}`} accent="text-[#8B6A30]" description="Projeção para 12 meses" />
          <KPICard icon={<Crown className="w-6 h-6" />} label="Assinaturas pagantes" value={stats.totalPaying} accent="text-[#5B1F3D]" description="Exclui presentes e admin" />
          <KPICard icon={<TrendingUp className="w-6 h-6" />} label="Conversão Premium" value={`${stats.conversionRate}%`} accent="text-[#5B1F3D]" description="Fatia de usuários pagantes" />
        </div>
      </section>

      {/* ═══════════ RECEITA REAL ═══════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-[11px] tracking-[0.3em] uppercase text-[#5B1F3D]/40 font-black">
            Receita real
          </h3>
          <div className="h-px flex-1 bg-[#C8A66A]/20" />
          <span className={`text-[9px] font-heading font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full inline-flex items-center gap-2 border ${
            realRevenueEnabled ? "bg-[#5B1F3D] text-white border-[#C8A66A] shadow-sm animate-pulse" : "bg-white/50 text-[#5B1F3D]/40 border-[#C8A66A]/10"
          }`}>
            <Plug className="w-3 h-3" />
            {realRevenueEnabled ? "Stripe conectado" : "Aguardando Stripe"}
          </span>
        </div>
        {!realRevenueEnabled ? (
          <div className="rounded-[2.5rem] border-2 border-dashed border-[#C8A66A]/30 bg-white/40 p-8 text-center shadow-inner">
            <Plug className="w-10 h-10 text-[#C8A66A]/20 mx-auto mb-4" />
            <p className="text-base font-heading font-black text-[#5B1F3D] mb-2">Faturamento confirmado não disponível</p>
            <p className="text-sm font-body font-bold italic text-[#5B1F3D]/50 max-w-md mx-auto leading-relaxed">
              A estrutura está pronta para receber os webhooks do Stripe. MRR real, churn e ciclo de vida de cobranças aparecerão aqui automaticamente após a ativação.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard icon={<DollarSign className="w-5 h-5" />} label="MRR real" value="R$ 0,00" accent="text-[#5B1F3D]" />
            <KPICard icon={<Repeat className="w-5 h-5" />} label="ARR real" value="R$ 0" accent="text-[#5B1F3D]" />
            <KPICard icon={<Crown className="w-5 h-5" />} label="Cobranças confirmadas" value={0} accent="text-[#5B1F3D]" />
            <KPICard icon={<TrendingDown className="w-5 h-5" />} label="Reembolsos" value={0} accent="text-red-600" />
          </div>
        )}
      </section>

      {/* ═══════════ Crescimento e churn ═══════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-[11px] tracking-[0.3em] uppercase text-[#5B1F3D]/40 font-black">Crescimento (últimos 30 dias)</h3>
          <div className="h-px flex-1 bg-[#C8A66A]/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<Sparkles className="w-5 h-5" />} label="Novos cadastros" value={stats.newSignups30} accent="text-[#5B1F3D]" />
          <KPICard icon={<TrendingDown className="w-5 h-5" />} label="Churn (taxa)" value={`${stats.churnRate}%`} accent="text-red-600" />
          <KPICard icon={<AlertCircle className="w-5 h-5" />} label="Expiram em 30d" value={stats.expiringSoon} accent="text-[#8B6A30]" />
          <KPICard icon={<Gift className="w-5 h-5" />} label="Resgates de presente" value={stats.giftRedemptions} accent="text-[#5B1F3D]" />
        </div>
      </section>

      {/* ═══════════ Estados de assinatura ═══════════ */}
      <section>
        <h3 className="font-heading text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">Estados de assinatura</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <MiniStat label="Mensal" value={stats.monthlyActive} color="bg-primary/10/10 text-primary" />
          <MiniStat label="Anual" value={stats.annualActive} color="bg-primary/10/10 text-primary" />
          <MiniStat label="Presente" value={stats.giftActive} color="bg-secondary/10/10 text-secondary" />
          <MiniStat label="Admin" value={stats.adminGrant} color="bg-amber-500/10 text-amber-600" />
          <MiniStat label="Canc. c/ acesso" value={stats.cancelledAccess} color="bg-amber-500/10 text-amber-600" />
          <MiniStat label="Expirado" value={stats.expired} color="bg-red-500/10 text-red-500" />
          <MiniStat label="Cancelado" value={stats.cancelledExpired} color="bg-red-500/10 text-red-400" />
          <MiniStat label="Gratuito" value={stats.free} color="bg-muted text-muted-foreground" />
        </div>
      </section>

      {/* ═══════════ FILTERS ═══════════ */}
      <section>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="w-3.5 h-3.5" /> Filtros:
          </div>
          <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><CalendarDays className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo período</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="12m">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as PlanFilter)}>
            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os planos</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
              <SelectItem value="gift">Presente</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="free">Gratuito</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
              <SelectItem value="gift">Presenteados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={originFilter} onValueChange={(v) => setOriginFilter(v as OriginFilter)}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Origem" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as origens</SelectItem>
              <SelectItem value="store_monthly">Loja (mensal)</SelectItem>
              <SelectItem value="store_annual">Loja (anual)</SelectItem>
              <SelectItem value="gift">Presente</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {(periodFilter !== "all" || planFilter !== "all" || statusFilter !== "all" || originFilter !== "all") && (
            <button
              onClick={() => { setPeriodFilter("all"); setPlanFilter("all"); setStatusFilter("all"); setOriginFilter("all"); }}
              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Limpar
            </button>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ═══════════ TABLE ═══════════ */}
        {filtered.length === 0 ? (
          <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
            <Crown className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum resultado para os filtros selecionados.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-card/60">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Usuário</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Plano</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Origem</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Válido até</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .sort((a, b) => {
                    const order: Record<SubStatus, number> = {
                      monthly_active: 0, annual_active: 0, gift_active: 1, admin_grant: 1,
                      cancelled_with_access: 2, expired: 3, cancelled_expired: 4, free: 5,
                    };
                    const diff = order[a.status] - order[b.status];
                    if (diff !== 0) return diff;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                  })
                  .slice(0, 200)
                  .map((sub) => {
                    const until = sub.premium_until ? new Date(sub.premium_until) : null;
                    return (
                      <tr key={sub.user_id} className="border-b border-border/10 last:border-0 hover:bg-card/80 transition-colors">
                        <td className="p-3 text-foreground font-medium">{sub.display_name || "Sem nome"}</td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {sub.status === "free" ? "—"
                            : sub.premium_source === "store_annual" ? "Anual"
                            : sub.premium_source === "store_monthly" ? "Mensal"
                            : sub.premium_source === "admin" ? "Admin"
                            : "Presente"}
                        </td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {SOURCE_LABELS[sub.premium_source || ""] || "—"}
                        </td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {until ? until.toLocaleDateString("pt-BR") : "—"}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status]}`}>
                            {STATUS_LABELS[sub.status]}
                          </span>
                        </td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {filtered.length > 200 && (
              <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/30">
                Mostrando 200 de {filtered.length}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══════════ INTEGRATION STATUS ═══════════ */}
      <section className="rounded-xl border border-border/50 bg-card/30 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p className="text-foreground font-medium mb-1">Integração de pagamentos: <span className="text-amber-600">pendente</span></p>
            <p>O gateway de pagamento (Stripe/Paddle) ainda não foi conectado. Por enquanto, a receita exibida é estimada com base nos perfis premium ativos com origem da loja. Assinaturas presenteadas e concedidas pelo admin não geram receita. Para ativar cobrança real, conecte um provedor de pagamentos.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ═══════════ SUB-COMPONENTS ═══════════ */

const KPICard = ({ icon, label, value, accent = "text-foreground" }: { icon: React.ReactNode; label: string; value: string | number; accent?: string }) => (
  <div className="p-4 rounded-xl border border-border/50 bg-card/50">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
    </div>
    <p className={`text-xl font-heading ${accent}`}>{value}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const MiniStat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="p-2.5 rounded-lg border border-border/30 bg-card/30 text-center">
    <span className={`text-[10px] font-heading tracking-wide px-1.5 py-0.5 rounded-full ${color}`}>{value}</span>
    <p className="text-[9px] text-muted-foreground mt-1">{label}</p>
  </div>
);

export default AdminSubscriptions;
