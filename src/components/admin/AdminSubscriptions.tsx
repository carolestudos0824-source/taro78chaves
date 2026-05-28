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
import { AdminSectionHeading, KPICard as AdminKPICard, AdminBadge, AdminTable, AdminTableHeader, AdminTableHead, AdminTableRow, AdminTableCell } from "./AdminComponents";

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
        title="Vendas Legadas Stripe" 
        subtitle="Esta aba é apenas histórica e não representa as vendas atuais do Tarô 78 Chaves." 
      />

      <div className="p-6 rounded-[2rem] border-2 border-[#C8A66A]/30 bg-white/80 shadow-sm flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-[#8B6A30] shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-base font-heading font-black text-[#5B1F3D]">Fluxo legado Stripe</p>
          <p className="text-sm font-body font-bold text-[#5B1F3D]/60 leading-relaxed">
            Esta aba é apenas histórica e não representa as vendas atuais do Tarô 78 Chaves. As vendas reais, reembolsos, saldo, saque e parcelamento devem ser acompanhados na Hotmart.
          </p>
        </div>
      </div>


      {/* ═══════════ RECEITA ESTIMADA ═══════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">
            Receita (estimativa legada)
          </h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/30" />
          <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-[#C8A66A]/20 text-[#8B6A30] border-2 border-[#C8A66A]/40 shadow-sm">
            DADOS HISTÓRICOS
          </span>
        </div>
        
        <p className="text-sm font-body font-bold text-[#5B1F3D]/80 leading-relaxed bg-white/60 p-5 rounded-[2.5rem] border border-[#C8A66A]/20 shadow-sm">
          Projeção baseada em assinantes ativos × preço de catálogo. <strong className="text-[#5B1F3D] font-black">Não representa faturamento Hotmart.</strong>
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={<DollarSign className="w-6 h-6" />} label="MRR estimado (legado)" value={`R$ ${stats.mrrEstimated.toFixed(2)}`} accent="text-[#8B6A30]" description="Baseado em dados históricos" />
          <KPICard icon={<Repeat className="w-6 h-6" />} label="ARR estimada (legada)" value={`R$ ${stats.arrEstimated.toFixed(0)}`} accent="text-[#8B6A30]" description="Projeção histórica" />
          <KPICard icon={<Crown className="w-6 h-6" />} label="Assinaturas pagantes" value={stats.totalPaying} accent="text-[#5B1F3D]" description="Assinaturas do modelo antigo" />
          <KPICard icon={<TrendingUp className="w-6 h-6" />} label="Conversão Premium" value={`${stats.conversionRate}%`} accent="text-[#5B1F3D]" description="Taxa de conversão legada" />
        </div>
      </section>

      {/* ═══════════ RECEITA REAL ═══════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-[11px] tracking-[0.3em] uppercase text-[#5B1F3D]/40 font-black">
            Faturamento Real (Histórico)
          </h3>
          <div className="h-px flex-1 bg-[#C8A66A]/20" />
          <span className={`text-[9px] font-heading font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full inline-flex items-center gap-2 border ${
            realRevenueEnabled ? "bg-[#5B1F3D] text-white border-[#C8A66A] shadow-sm" : "bg-white/50 text-[#5B1F3D]/40 border-[#C8A66A]/10"
          }`}>
            <Plug className="w-3 h-3" />
            {realRevenueEnabled ? "Histórico Stripe" : "Legado Stripe"}
          </span>
        </div>
        {!realRevenueEnabled ? (
          <div className="rounded-[2.5rem] border-2 border-dashed border-[#C8A66A]/30 bg-white/40 p-8 text-center shadow-inner">
            <Plug className="w-10 h-10 text-[#C8A66A]/20 mx-auto mb-4" />
            <p className="text-base font-heading font-black text-[#5B1F3D] mb-2">Relatório de faturamento legado</p>
            <p className="text-sm font-body font-bold italic text-[#5B1F3D]/50 max-w-md mx-auto leading-relaxed">
              Esta área contém apenas dados do modelo comercial anterior. A gestão financeira atual (vendas, reembolsos, saldo) é realizada exclusivamente via Hotmart.
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
          <h3 className="font-heading text-[11px] tracking-[0.3em] uppercase text-[#5B1F3D]/40 font-black">Crescimento (histórico últimos 30 dias)</h3>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <MiniStat label="Mensal" value={stats.monthlyActive} variant="primary" />
          <MiniStat label="Anual" value={stats.annualActive} variant="primary" />
          <MiniStat label="Presente" value={stats.giftActive} variant="secondary" />
          <MiniStat label="Admin" value={stats.adminGrant} variant="warning" />
          <MiniStat label="Canc. c/ acesso" value={stats.cancelledAccess} variant="warning" />
          <MiniStat label="Expirado" value={stats.expired} variant="destructive" />
          <MiniStat label="Cancelado" value={stats.cancelledExpired} variant="destructive" />
          <MiniStat label="Gratuito" value={stats.free} variant="default" />
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
          <AdminTable>
            <AdminTableHeader>
              <AdminTableHead>Usuário</AdminTableHead>
              <AdminTableHead className="text-center">Plano</AdminTableHead>
              <AdminTableHead className="text-center">Origem</AdminTableHead>
              <AdminTableHead className="text-center">Válido até</AdminTableHead>
              <AdminTableHead className="text-center">Status</AdminTableHead>
              <AdminTableHead className="text-center">Cadastro</AdminTableHead>
            </AdminTableHeader>
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
                  const resolveVariant = (s: SubStatus): "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "outline" => {
                    if (s === "monthly_active" || s === "annual_active") return "primary";
                    if (s === "gift_active" || s === "admin_grant") return "secondary";
                    if (s === "expired" || s === "cancelled_expired") return "destructive";
                    if (s === "cancelled_with_access") return "warning";
                    return "default";
                  };
                  return (
                    <AdminTableRow key={sub.user_id}>
                      <AdminTableCell className="text-[#5B1F3D] font-black text-lg">{sub.display_name || "Sem nome"}</AdminTableCell>
                      <AdminTableCell className="text-center text-[#5B1F3D] font-body font-bold text-sm">
                        {sub.status === "free" ? "—"
                          : sub.premium_source === "store_annual" ? "Anual"
                          : sub.premium_source === "store_monthly" ? "Mensal"
                          : sub.premium_source === "admin" ? "Admin"
                          : "Presente"}
                      </AdminTableCell>
                      <AdminTableCell className="text-center text-[#5B1F3D]/60 font-body font-bold text-sm">
                        {SOURCE_LABELS[sub.premium_source || ""] || "—"}
                      </AdminTableCell>
                      <AdminTableCell className="text-center text-[#5B1F3D]/60 font-body font-bold text-sm">
                        {until ? until.toLocaleDateString("pt-BR") : "—"}
                      </AdminTableCell>
                      <AdminTableCell className="text-center">
                        <AdminBadge variant={resolveVariant(sub.status)}>
                          {STATUS_LABELS[sub.status]}
                        </AdminBadge>
                      </AdminTableCell>
                      <AdminTableCell className="text-center text-[#5B1F3D]/60 font-body font-bold text-sm">
                        {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                      </AdminTableCell>
                    </AdminTableRow>
                  );
                })}
            </tbody>
          </AdminTable>
        )}
        {filtered.length > 200 && (
          <div className="p-4 text-center text-xs text-[#5B1F3D]/40 font-heading font-black tracking-widest uppercase border-2 border-t-0 border-[#C8A66A]/20 bg-white rounded-b-[3rem] -mt-10 mb-10">
            Mostrando 200 de {filtered.length}
          </div>
        )}
      </section>

      {/* ═══════════ INTEGRATION STATUS ═══════════ */}
      <section className="rounded-[2.5rem] border-2 border-[#C8A66A]/20 bg-[#FAF5EF]/60 p-8 shadow-inner">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#8B6A30] shrink-0" />
          <div className="space-y-2">
            <p className="text-[#5B1F3D] font-black text-lg">Integração de pagamentos: <span className="text-[#8B6A30] uppercase tracking-widest text-sm">pendente</span></p>
            <p className="text-sm font-body font-bold text-[#5B1F3D]/60 leading-relaxed">O gateway de pagamento (Stripe/Paddle) ainda não foi conectado. Por enquanto, a receita exibida é estimada com base nos perfis premium ativos com origem da loja. Assinaturas presenteadas e concedidas pelo admin não geram receita. Para ativar cobrança real, conecte um provedor de pagamentos.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ═══════════ SUB-COMPONENTS ═══════════ */

const KPICard = AdminKPICard;

const MiniStat = ({ label, value, variant = "default" }: { label: string; value: number; variant?: any }) => (
  <div className="p-4 rounded-2xl border-2 border-[#C8A66A]/20 bg-white text-center shadow-md transition-all hover:scale-105">
    <AdminBadge variant={variant}>{value}</AdminBadge>
    <p className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/50 mt-2">{label}</p>
  </div>
);

export default AdminSubscriptions;
