import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, LogOut, Type, MessageSquare, Link as LucideLink, Play, HelpCircle, ShieldCheck } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { useIsAdmin } from "@/hooks/use-admin";
import { useProgress } from "@/hooks/use-progress";
import { usePremium } from "@/hooks/use-premium";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { useFontSize } from "@/contexts/font-size-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { findNextLessonSuggestion } from "@/lib/content/suggestions";

import { isWebCheckoutAllowed } from "@/lib/platform";

const LEVEL_TITLES: Record<number, string> = {
  1: "Neófito", 2: "Aprendiz", 3: "Estudante", 4: "Buscador", 5: "Iniciado", 6: "Adepto", 7: "Guardião", 8: "Mestre", 9: "Oráculo", 10: "Iluminado",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useIsAdmin();
  const { isStaff } = useRole();
  const { progress, completedCount, journeyProgress } = useProgress();
  const { fontSize, setFontSize } = useFontSize();
  const { isPremium, premiumUntil, premiumSource, stripeCustomerId } = usePremium();
  const { signOut } = useAuth();
  const webCheckoutAllowed = isWebCheckoutAllowed();
  const [portalLoading, setPortalLoading] = useState(false);

  const isStripeRecurring = isPremium && !!stripeCustomerId && ["store_monthly", "store_annual"].includes(premiumSource || "");
  const isOneTimeAnnual = premiumSource === "store_annual_one_time";
  const isHotmart = premiumSource === "hotmart";
  
  const nextSuggestion = findNextLessonSuggestion(progress.completedLessons);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("As chaves da jornada completa foram ativadas!");
      trackEvent("checkout_success_return", {
        source: "stripe",
        is_premium: isPremium,
        plan: premiumSource?.includes("monthly") ? "monthly" : (premiumSource?.includes("annual") ? "yearly" : "unknown")
      });
    }
  }, [searchParams, premiumSource, isPremium]);

  const handleOpenPortal = async () => {
    if (!stripeCustomerId) {
      toast.error("Acesso não gerenciado via portal automático. Fale com o Oráculo.");
      return;
    }

    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-customer-portal", { body: {} });
      if (error || !data?.url) {
        toast.error("Erro ao acessar o portal de assinaturas.");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Erro ao abrir portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const untilFormatted = premiumUntil ? new Date(premiumUntil).toLocaleDateString("pt-BR") : null;

  return (
    <div className="min-h-screen bg-[#FAF5EF] pb-bottom-nav">
      <header className="relative pt-12 pb-24 px-6 overflow-hidden bg-white/40 border-b border-[#C8A66A]/20">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#C8A66A]/40 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-lg mx-auto relative z-10 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full flex items-center justify-center bg-white border-4 border-[#C8A66A] shadow-2xl relative z-10 overflow-hidden ring-8 ring-[#C8A66A]/10">
              <span className="font-heading text-5xl text-[#5B1F3D] font-black">{LEVEL_TITLES[progress.level]?.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center bg-[#5B1F3D] text-white text-[12px] font-heading font-black border-2 border-white shadow-lg z-20">
              {progress.level}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-heading text-3xl text-[#5B1F3D] font-black tracking-tight">
              {LEVEL_TITLES[progress.level] || "Iluminado"}
            </h1>
            <p className="font-accent italic font-bold text-[#5B1F3D]/80 text-sm">
              Nível {progress.level} • {progress.xp} XP conquistados
            </p>
            {isStaff && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B1F3D]/10 border border-[#C8A66A]/30 text-[#5B1F3D] animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A66A]" />
                <span className="text-[10px] font-heading font-black tracking-widest uppercase">Modo Auditoria</span>
              </div>
            )}
          </div>

          <div className="w-full space-y-3 px-4">
            <div className="flex justify-between text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">
              <span>{isStaff ? "Sincronização desativada (Auditoria)" : "Progresso na Travessia"}</span>
              <span>{journeyProgress}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#DCCFC2]/40 rounded-full overflow-hidden border border-[#DCCFC2]/20">
              <div className="h-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] rounded-full shadow-[0_0_8px_rgba(200,166,106,0.5)]" style={{ width: `${progress.xp % 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 -mt-12 relative z-20 space-y-8">
        <button 
          onClick={() => navigate(nextSuggestion?.path || "/app")} 
          className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-[#5B1F3D] border-2 border-[#C8A66A] text-white shadow-xl transform transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 border border-white/20">
              <Play className="w-6 h-6 text-[#C8A66A] fill-[#C8A66A]" />
            </div>
            <div className="text-left">
              <p className="font-heading text-lg font-black tracking-tight leading-none mb-1">Continuar minha jornada</p>
              <p className="text-[11px] font-body font-bold italic text-white/70 leading-none">
                {nextSuggestion?.label || "Retomar seus estudos"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Ritual", val: progress.streak, icon: "ritual", color: "#5B1F3D" },
            { label: "Portais", val: completedCount, icon: "premium", color: "#C8A66A" },
            { label: "Insignias", val: progress.badges.filter(b => b.earned).length, icon: "Sparkles", color: "#5B1F3D" },
          ].map(s => (
            <div key={s.label} className="bg-white border-2 border-[#DCCFC2]/30 p-5 rounded-[1.5rem] text-center shadow-lg transform transition-transform hover:scale-[1.02]">
              <div className="w-8 h-8 mx-auto mb-2 bg-[#FAF5EF] rounded-lg flex items-center justify-center">
                <TarotIcon name={s.icon} className="w-4 h-4" color={s.color} />
              </div>
              <div className="font-heading text-xl font-black text-[#5B1F3D]">{s.val}</div>
              <div className="text-[9px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border-4 border-[#C8A66A]/30 p-6 rounded-[2rem] space-y-6 shadow-xl ring-8 ring-[#C8A66A]/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]/80">
                  {isAdmin ? "O Oráculo" : "Seu Acesso"}
                </p>
                {isPremium && <TarotIcon name="premium" className="w-3.5 h-3.5 text-[#C8A66A]" />}
              </div>
              <h3 className="font-heading text-xl font-black text-[#5B1F3D]">
                {isAdmin ? "Acesso Total" : (
                  isHotmart ? "Acesso Premium" :
                  isOneTimeAnnual ? "Jornada Anual" : 
                  (isPremium ? (premiumSource === "store_monthly" ? "Assinatura Mensal" : "Jornada Completa") : "Plano do Louco")
                )}
              </h3>
              {isPremium && (
                <div className="space-y-1">
                  {untilFormatted && (
                    <p className="text-[10px] font-body font-bold italic text-[#5B1F3D]/80 uppercase tracking-widest">
                      {isStripeRecurring ? `Renovação: ${untilFormatted}` : `Acesso ativo até: ${untilFormatted}`}
                    </p>
                  )}
                  {isHotmart && (
                    <p className="text-[9px] font-heading font-black text-[#C8A66A] uppercase tracking-wider">
                      Acesso anual liberado pela Hotmart
                    </p>
                  )}
                </div>
              )}
            </div>

            {isAdmin ? (
              <span className="text-[10px] font-heading font-black tracking-widest uppercase text-white bg-[#5B1F3D] px-3 py-1.5 rounded-lg border border-[#C8A66A]">Admin</span>
            ) : isPremium ? (
              isStripeRecurring && webCheckoutAllowed && (
                <button 
                  onClick={handleOpenPortal} 
                  disabled={portalLoading} 
                  className="font-heading text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl border-2 border-[#DCCFC2] text-[#5B1F3D] hover:bg-[#FAF5EF]"
                >
                  Gerenciar
                </button>
              )
            ) : (
              webCheckoutAllowed && (
                <button onClick={() => navigate("/premium")} className="bg-[#5B1F3D] text-white px-6 py-2.5 rounded-xl font-heading font-black text-[10px] tracking-widest uppercase border border-[#C8A66A]">Upgrade</button>
              )
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-[#DCCFC2]/40 p-6 rounded-2xl space-y-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A]/20">
              <Type className="w-5 h-5 text-[#5B1F3D]" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading text-base font-black text-[#5B1F3D]">Conforto de leitura</h4>
              <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/70">Ajuste o tamanho dos portais de texto</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-3 p-1.5 bg-[#FAF5EF] rounded-2xl border-2 border-[#DCCFC2]/40">
            {[
              { id: "normal", label: "Compacto", icon: "A−" },
              { id: "large", label: "Padrão", icon: "A" },
              { id: "xl", label: "Ampliado", icon: "A+" }
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id as any)}
                className={`flex-1 py-3 px-1 rounded-xl text-[10px] font-heading font-black tracking-[0.15em] uppercase transition-all ${
                  fontSize === size.id 
                    ? "bg-[#5B1F3D] text-white shadow-md border-2 border-[#C8A66A]" 
                    : "text-[#5B1F3D]/60 hover:text-[#5B1F3D]/80"
                }`}
              >
                <span className="block text-sm mb-0.5">{size.icon}</span>
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#5B1F3D]/10 shrink-0">
            <HelpCircle className="w-5 h-5 text-[#5B1F3D]" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-heading text-base font-black text-[#5B1F3D]">Precisa de ajuda?</h4>
              <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/70">Envie uma dúvida, problema de acesso ou sugestão para o suporte.</p>
            </div>
            <button 
              onClick={() => navigate("/suporte")} 
              className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D] flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              Falar com suporte <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => navigate("/minha-jornada")} className="w-full flex items-center justify-between p-6 rounded-2xl bg-white border-2 border-[#DCCFC2]/40 group active:scale-[0.98] transition-all shadow-md">
            <div className="flex items-center gap-4">
              <TarotIcon name="jornada" className="w-6 h-6 text-[#C8A66A]" />
              <div className="text-left">
                <p className="font-heading text-base font-black text-[#5B1F3D]">Caderno da Jornada</p>
                <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/70 leading-none">Suas reflexões rituais</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
          </button>

          {isAdmin && (
            <button onClick={() => navigate("/admin")} className="w-full flex items-center justify-between p-6 rounded-2xl bg-[#5B1F3D] border-2 border-[#C8A66A] text-white group shadow-xl">
              <div className="flex items-center gap-4">
                <TarotIcon name="privacidade" className="w-6 h-6 text-[#C8A66A]" />
                <p className="font-heading text-base font-black tracking-tight">Painel Administrativo</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C8A66A]" />
            </button>
          )}
        </div>

        <div className="pt-16 flex flex-col items-center space-y-10">
          <button onClick={signOut} className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-[#5B1F3D20] text-[11px] font-heading font-black tracking-[0.4em] uppercase text-[#5B1F3D] hover:bg-[#5B1F3D] hover:text-white transition-all shadow-sm">
            <LogOut className="w-4 h-4" />
            ENCERRAR SESSÃO
          </button>
          
          <nav className="flex items-center gap-8 text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D60]">
            <Link to="/suporte" className="hover:text-[#C8A66A] transition-colors">Suporte</Link>
            <span className="text-[#C8A66A40]">✦</span>
            <Link to="/termos" className="hover:text-[#C8A66A] transition-colors">Termos</Link>
            <span className="text-[#C8A66A40]">✦</span>
            <Link to="/excluir-conta" className="hover:text-[#C8A66A] transition-colors">Excluir</Link>
          </nav>

          <p className="text-[9px] font-heading tracking-[0.4em] text-[#C8A66A80] uppercase">
            Tarô 78 Chaves · © 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
