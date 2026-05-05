import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Flame, Star, Trophy, Book, ChevronRight, Sparkles, Crown, LogOut, Type, MessageSquare, Shield } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-admin";
import { useProgress } from "@/hooks/use-progress";
import { usePremium } from "@/hooks/use-premium";
import { useAuth } from "@/hooks/use-auth";
import { useFontSize } from "@/contexts/font-size-context";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, getArcanoFull as getArcanoById } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LEVEL_TITLES: Record<number, string> = {
  1: "Neófito", 2: "Aprendiz", 3: "Estudante", 4: "Buscador", 5: "Iniciado", 6: "Adepto", 7: "Guardião", 8: "Mestre", 9: "Oráculo", 10: "Iluminado",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useIsAdmin();
  const { progress, completedCount, journeyProgress } = useProgress();
  const { isPremium, premiumUntil, premiumSource, stripeCustomerId } = usePremium();
  const { signOut } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);

  // Regra segura: só é Stripe Recurring se tiver o ID do cliente e o source for store_monthly ou store_annual (recorrentes)
  const isStripeRecurring = isPremium && !!stripeCustomerId && ["store_monthly", "store_annual"].includes(premiumSource || "");
  const isOneTimeAnnual = premiumSource === "store_annual_one_time";

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Acesso premium ativado com sucesso!");
    }
  }, [searchParams]);

  const handleOpenPortal = async () => {
    if (!stripeCustomerId) {
      toast.error("Seu acesso não é gerenciado via Stripe. Fale com o suporte.");
      return;
    }

    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-customer-portal", { body: {} });
      if (error || !data?.url) {
        toast.error("Erro ao acessar o portal de pagamentos.");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Erro ao abrir portal.");
    } finally {
      setPortalLoading(false);
    }
  };


  const earnedBadges = progress.badges.filter(b => b.earned);
  const untilFormatted = premiumUntil ? new Date(premiumUntil).toLocaleDateString("pt-BR") : null;

  return (
    <div className="min-h-screen pb-bottom-nav">
      {/* ─── Hero Header ─── */}
      <header className="relative pt-12 pb-24 px-6 overflow-hidden bg-white/30">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gold/40 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-lg mx-auto relative z-10 flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white border-2 border-gold/40 shadow-2xl relative z-10 overflow-hidden">
              <span className="font-heading text-4xl text-gold-dark">{LEVEL_TITLES[progress.level]?.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-white text-[10px] font-heading border-2 border-white shadow-lg">
              {progress.level}
            </div>
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-heading text-3xl text-midnight tracking-tight">
              {LEVEL_TITLES[progress.level] || "Iluminado"}
            </h1>
            <p className="font-accent italic text-muted-foreground">Nível {progress.level} • {progress.xp} XP acumulados</p>
          </div>

          {/* XP Tracker */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] font-heading tracking-widest uppercase opacity-40 px-1">
              <span>Progresso</span>
              <span>{progress.xp % 100}%</span>
            </div>
            <div className="h-1.5 w-full bg-gold/10 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full" style={{ width: `${progress.xp % 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 -mt-12 relative z-20 space-y-6">
        {/* ─── Stats Card ─── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Sequência", val: progress.streak, icon: Flame, color: "text-orange-500" },
            { label: "Arcanos", val: completedCount, icon: Star, color: "text-gold-dark" },
            { label: "Badges", val: earnedBadges.length, icon: Trophy, color: "text-accent" },
          ].map(s => (
            <div key={s.label} className="bg-white/80 backdrop-blur-xl border border-gold/20 p-4 rounded-2xl text-center shadow-sm">
              <s.icon className={`w-4 h-4 mx-auto mb-2 opacity-60 ${s.color}`} />
              <div className="font-heading text-lg text-midnight">{s.val}</div>
              <div className="text-[9px] font-heading tracking-widest uppercase opacity-40">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Subscription Section ─── */}
        <div className="bg-white/90 backdrop-blur-2xl border-2 border-gold/20 p-6 rounded-3xl space-y-6 shadow-xl shadow-gold/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-gold-dark">
                  {isAdmin ? "Acesso administrativo" : "Seu Acesso"}
                </p>
                {isPremium && <Crown className="w-3 h-3 text-gold" />}
              </div>
              <h3 className="font-heading text-lg text-midnight">
                {isAdmin ? "Admin Total" : (
                  isOneTimeAnnual ? "Acesso Anual" : 
                  (isPremium ? (premiumSource === "store_monthly" ? "Assinatura Mensal" : "Jornada Completa") : "Plano Gratuito")
                )}
              </h3>
              {isPremium && untilFormatted && (
                <div className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {isStripeRecurring ? `Renovação automática: ${untilFormatted}` : (isOneTimeAnnual ? `Ativo até ${untilFormatted}` : "Acesso vitalício ou cortesia")}
                  </p>
                  {isOneTimeAnnual && (
                    <p className="text-[9px] text-gold-dark/60 font-medium">Pagamento único • Sem renovação</p>
                  )}
                </div>
              )}
            </div>

            {isAdmin ? (
              <span className="text-[10px] font-heading tracking-widest uppercase text-accent font-bold">Admin</span>
            ) : isPremium ? (
              isStripeRecurring ? (
                <Button 
                  onClick={handleOpenPortal} 
                  disabled={portalLoading} 
                  variant="outline" 
                  className="btn-outline-gold px-6"
                >
                  Gerenciar
                </Button>
              ) : isOneTimeAnnual ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-heading tracking-widest uppercase text-gold-dark/70">Ativo</span>
                  <span className="text-[8px] text-muted-foreground opacity-50 italic">12 meses de acesso</span>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-heading tracking-widest uppercase text-gold-dark/70">Cortesia</span>
                  <span className="text-[8px] text-muted-foreground opacity-50">Acesso liberado</span>
                </div>
              )
            ) : (
              <Button onClick={() => navigate("/premium")} className="btn-premium px-8">Upgrade</Button>
            )}

          </div>
        </div>

        {/* ─── Quick Actions ─── */}
        <div className="space-y-3 pt-2">
          <button onClick={() => navigate("/minha-jornada")} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/50 border border-gold/10 group active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <Book className="w-5 h-5 text-gold-dark opacity-60" />
              <div className="text-left">
                <p className="font-heading text-sm text-midnight">Caderno da Jornada</p>
                <p className="text-[10px] text-muted-foreground italic">Suas reflexões pessoais</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-20 group-hover:translate-x-1 transition-transform" />
          </button>

          {isAdmin && (
            <button onClick={() => navigate("/admin")} className="w-full flex items-center justify-between p-5 rounded-2xl bg-accent/5 border border-accent/20 group">
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-accent opacity-60" />
                <p className="font-heading text-sm text-midnight">Painel Administrativo</p>
              </div>
              <ChevronRight className="w-4 h-4 opacity-20" />
            </button>
          )}
        </div>

        {/* ─── Danger Zone ─── */}
        <div className="pt-10 flex flex-col items-center space-y-6">
          <button onClick={signOut} className="flex items-center gap-2 text-[11px] font-heading tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
            <LogOut className="w-3.5 h-3.5" />
            Sair da Conta
          </button>
          
          <nav className="flex items-center gap-6 text-[10px] font-heading tracking-widest uppercase opacity-20">
            <a href="/suporte">Suporte</a>
            <span>•</span>
            <a href="/termos">Termos</a>
            <span>•</span>
            <a href="/excluir-conta">Excluir</a>
          </nav>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
