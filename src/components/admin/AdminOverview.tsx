import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, Crown, Gift, TrendingUp, UserPlus, 
  DollarSign, XCircle, BarChart3, BookOpen, Target,
  ArrowUp, ArrowDown
} from "lucide-react";

const MONTHLY_PRICE = 29.9;
const ANNUAL_PRICE = 197;

type StripeMetrics = {
  activeSubscriptions: number;
  mrr: number;
  totalRevenue: number;
  currency?: string;
  sampledCharges?: number;
};

const AdminOverview = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeMetrics, setStripeMetrics] = useState<StripeMetrics | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: prof }, { data: prog }] = await Promise.all([
        supabase.from("profiles").select("user_id, is_premium, premium_until, premium_source, created_at"),
        supabase.from("user_progress").select("completed_lessons, completed_quizzes, last_active, streak"),
      ]);
      setProfiles(prof || []);
      setProgress(prog || []);
      setLoading(false);
    };
    load();

    const loadStripe = async () => {
      setStripeLoading(true);
      const { data, error } = await supabase.functions.invoke<StripeMetrics>("stripe-admin-metrics");
      if (error) {
        setStripeError(error.message);
      } else if (data && "activeSubscriptions" in data) {
        setStripeMetrics(data);
        setStripeError(null);
      } else if (data && (data as any).error) {
        setStripeError((data as any).error);
      }
      setStripeLoading(false);
    };
    loadStripe();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    const premium = profiles.filter(p => p.is_premium && (!p.premium_until || new Date(p.premium_until) > now));
    const gifted = premium.filter(p => p.premium_source === "gift" || p.premium_source === "admin");
    const monthly = premium.filter(p => p.premium_source === "store_monthly" || (!p.premium_source && p.is_premium && p.premium_source !== "gift" && p.premium_source !== "admin" && p.premium_source !== "store_annual"));
    const annual = premium.filter(p => p.premium_source === "store_annual");
    const recentSignups = profiles.filter(p => new Date(p.created_at) >= weekAgo);
    const expired = profiles.filter(p => p.premium_until && new Date(p.premium_until) <= now && !p.is_premium);
    const recentExpired = expired.filter(p => new Date(p.premium_until!) >= monthAgo);

    const mrr = (monthly.length * MONTHLY_PRICE) + (annual.length * (ANNUAL_PRICE / 12));
    const conversionRate = profiles.length > 0 ? Math.round((premium.length / profiles.length) * 100) : 0;

    // Engagement
    const activeWeek = progress.filter(p => new Date(p.last_active) >= weekAgo).length;
    const totalLessons = progress.reduce((s, p) => s + (p.completed_lessons?.length || 0), 0);
    const totalQuizzes = progress.reduce((s, p) => s + (p.completed_quizzes?.length || 0), 0);
    const activeStreaks = progress.filter(p => p.streak > 0).length;

    return {
      totalUsers: profiles.length,
      premiumUsers: premium.length,
      freeUsers: profiles.length - premium.length,
      giftedUsers: gifted.length,
      recentSignups: recentSignups.length,
      conversionRate,
      mrr,
      recentExpired: recentExpired.length,
      activeWeek,
      totalLessons,
      totalQuizzes,
      activeStreaks,
    };
  }, [profiles, progress]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg text-foreground">Visão Geral</h2>
        <p className="text-sm text-muted-foreground">Resumo operacional da plataforma em tempo real.</p>
      </div>

      {/* Revenue — Estimated */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground/60">Receita estimada</h3>
          <span className="text-[10px] uppercase tracking-wider text-amber-600/80">cálculo interno</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
          Projeção baseada em assinantes ativos × preço de tabela. <strong className="text-foreground/80">Não reflete faturamento real</strong> — não considera reembolsos, cancelamentos no meio do ciclo, descontos ou impostos.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPICard icon={<DollarSign className="w-4 h-4" />} label="MRR estimado" value={`R$ ${stats.mrr.toFixed(2)}`} accent="text-amber-600" badge="est." />
          <KPICard icon={<TrendingUp className="w-4 h-4" />} label="Conversão Premium" value={`${stats.conversionRate}%`} accent="text-secondary" />
          <KPICard icon={<XCircle className="w-4 h-4" />} label="Premiums expirados (30d)" value={stats.recentExpired} accent={stats.recentExpired > 0 ? "text-red-400" : "text-muted-foreground"} />
          <KPICard icon={<UserPlus className="w-4 h-4" />} label="Novos cadastros (7d)" value={stats.recentSignups} accent="text-primary" />
        </div>
      </div>

      {/* Revenue — Real (Stripe) */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground/60">Receita real (Stripe)</h3>
          <span className="text-[10px] uppercase tracking-wider text-primary/80">
            {stripeLoading ? "carregando…" : stripeError ? "erro" : "ao vivo"}
          </span>
        </div>
        {stripeError ? (
          <div className="p-4 rounded-xl border border-dashed border-red-300/50 bg-red-50/40 text-[11px] text-red-700">
            Não foi possível carregar dados do Stripe: {stripeError}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KPICard
              icon={<Crown className="w-4 h-4" />}
              label="Assinaturas ativas (Stripe)"
              value={stripeLoading ? "…" : stripeMetrics?.activeSubscriptions ?? 0}
              accent="text-primary"
            />
            <KPICard
              icon={<DollarSign className="w-4 h-4" />}
              label="MRR real"
              value={stripeLoading ? "…" : `R$ ${(stripeMetrics?.mrr ?? 0).toFixed(2)}`}
              accent="text-primary"
            />
            <KPICard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Receita (últ. 100 cobranças)"
              value={stripeLoading ? "…" : `R$ ${(stripeMetrics?.totalRevenue ?? 0).toFixed(2)}`}
              accent="text-primary"
            />
            <PlaceholderCard label="Churn real (em desenvolvimento)" />
          </div>
        )}
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          Dados consultados diretamente da API do Stripe. Receita considera as últimas 100 cobranças bem-sucedidas, líquido de reembolsos.
        </p>
      </div>

      {/* User Breakdown */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground/60 mb-3">Assinantes & Usuários</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPICard icon={<Users className="w-4 h-4" />} label="Total de Usuários" value={stats.totalUsers} />
          <KPICard icon={<Crown className="w-4 h-4" />} label="Assinantes Ativos" value={stats.premiumUsers} accent="text-primary" />
          <KPICard icon={<Users className="w-4 h-4" />} label="Usuários Gratuitos" value={stats.freeUsers} />
          <KPICard icon={<Gift className="w-4 h-4" />} label="Presenteados" value={stats.giftedUsers} accent="text-secondary" />
        </div>
      </div>

      {/* Engagement */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground/60 mb-3">Engajamento</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPICard icon={<Users className="w-4 h-4" />} label="Ativos (7d)" value={stats.activeWeek} accent="text-primary" />
          <KPICard icon={<BookOpen className="w-4 h-4" />} label="Lições Concluídas" value={stats.totalLessons} />
          <KPICard icon={<Target className="w-4 h-4" />} label="Quizzes Feitos" value={stats.totalQuizzes} />
          <KPICard icon={<BarChart3 className="w-4 h-4" />} label="Streaks Ativos" value={stats.activeStreaks} />
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ icon, label, value, accent = "text-foreground", badge }: { icon: React.ReactNode; label: string; value: string | number; accent?: string; badge?: string }) => (
  <div className="p-4 rounded-xl border border-border/50 bg-card/50 relative">
    {badge && (
      <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600">{badge}</span>
    )}
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">{icon}</div>
    <p className={`text-xl font-heading ${accent}`}>{value}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const PlaceholderCard = ({ label }: { label: string }) => (
  <div className="p-4 rounded-xl border border-dashed border-border/40 bg-card/20">
    <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground/50 mb-2">
      <DollarSign className="w-4 h-4" />
    </div>
    <p className="text-xl font-heading text-muted-foreground/40">—</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

export default AdminOverview;
