import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, Crown, Gift, TrendingUp, UserPlus, 
  DollarSign, XCircle, BarChart3, BookOpen, Target,
  ArrowUp, ArrowDown
} from "lucide-react";
import { KPICard } from "./AdminComponents";

const ANNUAL_PRICE = 297; 


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
    const monthly = premium.filter(p => p.premium_source === "store_monthly" || (!p.premium_source && p.is_premium && p.premium_source !== "gift" && p.premium_source !== "admin" && p.premium_source !== "store_annual" && p.premium_source !== "hotmart"));
    const annual = premium.filter(p => p.premium_source === "store_annual" || p.premium_source === "hotmart");

    const recentSignups = profiles.filter(p => new Date(p.created_at) >= weekAgo);
    const expired = profiles.filter(p => p.premium_until && new Date(p.premium_until) <= now && !p.is_premium);
    const recentExpired = expired.filter(p => new Date(p.premium_until!) >= monthAgo);

    const mrr = premium.length * (ANNUAL_PRICE / 12);
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
    <div className="space-y-12">
      <div className="relative mb-8">
        <h2 className="font-heading text-3xl md:text-4xl text-[#5B1F3D] font-black tracking-tight mb-2">Visão Geral</h2>
        <p className="text-base font-body font-bold text-[#5B1F3D]/60">Resumo operacional da plataforma em tempo real.</p>
      </div>

      {/* Revenue — Estimated */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">Receita estimada</h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/30" />
          <span className="text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 bg-[#C8A66A]/20 text-[#8B6A30] rounded-full font-black border border-[#C8A66A]/30">CÁLCULO INTERNO</span>
        </div>
        
        <p className="text-sm font-body font-bold text-[#5B1F3D]/80 leading-relaxed bg-white/60 p-5 rounded-[2rem] border border-[#C8A66A]/20 shadow-sm">
          Estimativa interna baseada em acessos premium ativos. <strong className="text-[#5B1F3D] font-black">O faturamento real deve ser conferido na Hotmart.</strong>
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={<DollarSign className="w-6 h-6" />} label="MRR estimado" value={`R$ ${stats.mrr.toFixed(2)}`} accent="text-[#8B6A30]" badge="est." description="Projeção de receita mensal" />
          <KPICard icon={<TrendingUp className="w-6 h-6" />} label="Conversão Premium" value={`${stats.conversionRate}%`} accent="text-[#5B1F3D]" description="Total usuários vs assinantes" />
          <KPICard icon={<XCircle className="w-6 h-6" />} label="Premiums expirados (30d)" value={stats.recentExpired} accent={stats.recentExpired > 0 ? "text-red-600" : "text-[#5B1F3D]"} description="Perda de acesso recente" />
          <KPICard icon={<UserPlus className="w-6 h-6" />} label="Novos cadastros (7d)" value={stats.recentSignups} accent="text-[#5B1F3D]" description="Crescimento semanal" />
        </div>
      </section>

      {/* Revenue — Real (Stripe) */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">Receita Stripe Legada</h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/30" />
          <span className={`text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full font-black border-2 ${
            stripeLoading ? "bg-white/50 text-[#5B1F3D]/40 border-[#C8A66A]/10" : 
            stripeError ? "bg-red-50 text-red-600 border-red-200" : 
            "bg-[#5B1F3D] text-white border-[#C8A66A] shadow-md animate-pulse"
          }`}>
            {stripeLoading ? "CARREGANDO…" : stripeError ? "ERRO" : "AO VIVO"}
          </span>
        </div>

        {stripeError ? (
          <div className="p-8 rounded-[2rem] border-2 border-dashed border-red-200 bg-red-50/50 text-sm font-body font-bold text-red-700 text-center shadow-inner">
            Não foi possível carregar dados do Stripe: {stripeError}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              icon={<Crown className="w-6 h-6" />}
              label="Assinaturas ativas (Stripe)"
              value={stripeLoading ? "…" : stripeMetrics?.activeSubscriptions ?? 0}
              accent="text-[#5B1F3D]"
              description="Contagem oficial do gateway"
            />
            <KPICard
              icon={<DollarSign className="w-6 h-6" />}
              label="MRR real"
              value={stripeLoading ? "…" : `R$ ${(stripeMetrics?.mrr ?? 0).toFixed(2)}`}
              accent="text-[#5B1F3D]"
              description="Mensalidade recorrente confirmada"
            />
            <KPICard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Receita (últ. 100 cobranças)"
              value={stripeLoading ? "…" : `R$ ${(stripeMetrics?.totalRevenue ?? 0).toFixed(2)}`}
              accent="text-[#5B1F3D]"
              description="Volume de vendas bruto"
            />
            <PlaceholderCard label="Churn real (em desenvolvimento)" />
          </div>
        )}
        <p className="text-xs font-body font-bold text-[#5B1F3D]/60 bg-white/60 p-5 rounded-[2rem] border border-[#C8A66A]/20 shadow-sm leading-relaxed">
          Dados históricos/legados do fluxo Stripe. As vendas atuais do Tarô 78 Chaves são processadas pela Hotmart.
        </p>
      </section>

      {/* User Breakdown */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">Assinantes & Usuários</h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={<Users className="w-6 h-6" />} label="Total de Usuários" value={stats.totalUsers} description="Base total cadastrada" />
          <KPICard icon={<Crown className="w-6 h-6" />} label="Assinantes Ativos" value={stats.premiumUsers} accent="text-[#5B1F3D]" description="Acesso premium vigente" />
          <KPICard icon={<Users className="w-6 h-6" />} label="Usuários Gratuitos" value={stats.freeUsers} description="Acesso limitado" />
          <KPICard icon={<Gift className="w-6 h-6" />} label="Presenteados" value={stats.giftedUsers} accent="text-[#8B6A30]" description="Códigos ou admin grant" />
        </div>
      </section>

      {/* Engagement */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">Engajamento</h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard icon={<Users className="w-6 h-6" />} label="Ativos (7d)" value={stats.activeWeek} accent="text-[#5B1F3D]" description="Retenção semanal" />
          <KPICard icon={<BookOpen className="w-6 h-6" />} label="Lições Concluídas" value={stats.totalLessons} description="Progresso total no curso" />
          <KPICard icon={<Target className="w-6 h-6" />} label="Quizzes Feitos" value={stats.totalQuizzes} description="Engajamento com desafios" />
          <KPICard icon={<BarChart3 className="w-6 h-6" />} label="Streaks Ativos" value={stats.activeStreaks} description="Frequência de estudo" />
        </div>
      </section>
    </div>
  );
};

const PlaceholderCard = ({ label }: { label: string }) => (
  <div className="p-6 rounded-[2rem] border-2 border-dashed border-[#C8A66A]/30 bg-[#FAF5EF]/30 flex flex-col justify-center">
    <div className="w-12 h-12 rounded-2xl bg-white/50 border border-[#C8A66A]/10 flex items-center justify-center text-[#5B1F3D]/20 mb-4">
      <DollarSign className="w-6 h-6" />
    </div>
    <p className="text-3xl font-heading font-black text-[#5B1F3D]/10 tracking-tighter">—</p>
    <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-[#5B1F3D]/30 font-black leading-tight">{label}</p>
  </div>
);

export default AdminOverview;
