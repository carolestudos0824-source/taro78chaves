import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Flame, Star, Trophy, Book, ChevronRight, KeyRound, LogOut, Type, MessageSquare, Shield, UserRound, Sparkles } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-admin";
import { useProgress } from "@/hooks/use-progress";
import { usePremium } from "@/hooks/use-premium";
import { useAuth } from "@/hooks/use-auth";
import { useFontSize } from "@/contexts/font-size-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const LEVEL_TITLES: Record<number, string> = {
  1: "Neófito", 2: "Aprendiz", 3: "Estudante", 4: "Buscador", 5: "Iniciado", 6: "Adepto", 7: "Guardião", 8: "Mestre", 9: "Oráculo", 10: "Iluminado",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useIsAdmin();
  const { progress, completedCount } = useProgress();
  const { fontSize, setFontSize } = useFontSize();
  const { isPremium, premiumUntil, premiumSource, stripeCustomerId } = usePremium();
  const { signOut } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);

  const isStripeRecurring = isPremium && !!stripeCustomerId && ["store_monthly", "store_annual"].includes(premiumSource || "");
  const isOneTimeAnnual = premiumSource === "store_annual_one_time";

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
            <p className="font-accent italic font-bold text-[#5B1F3D]/60 text-sm">
              Nível {progress.level} • {progress.xp} XP conquistados
            </p>
          </div>

          <div className="w-full space-y-3 px-4">
            <div className="flex justify-between text-[11px] font-heading font-black tracking-widest uppercase text-[#C8A66A]">
              <span>Progresso na Travessia</span>
              <span>{progress.xp % 100}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#DCCFC2]/40 rounded-full overflow-hidden border border-[#DCCFC2]/20">
              <div className="h-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] rounded-full shadow-[0_0_8px_rgba(200,166,106,0.5)]" style={{ width: `${progress.xp % 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 -mt-12 relative z-20 space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Ritual", val: progress.streak, icon: Flame, color: "#5B1F3D" },
            { label: "Portais", val: completedCount, icon: KeyRound, color: "#C8A66A" },
            { label: "Insignias", val: progress.badges.filter(b => b.earned).length, icon: Sparkles, color: "#5B1F3D" },
          ].map(s => (
            <div key={s.label} className="bg-white border-2 border-[#DCCFC2]/30 p-5 rounded-[1.5rem] text-center shadow-lg transform transition-transform hover:scale-[1.02]">
              <div className="w-8 h-8 mx-auto mb-2 bg-[#FAF5EF] rounded-lg flex items-center justify-center">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="font-heading text-xl font-black text-[#5B1F3D]">{s.val}</div>
              <div className="text-[9px] font-heading font-black tracking-widest uppercase text-[#C8A66A]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border-4 border-[#C8A66A]/30 p-6 rounded-[2rem] space-y-6 shadow-xl ring-8 ring-[#C8A66A]/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]">
                  {isAdmin ? "O Oráculo" : "Seu Acesso"}
                </p>
                {isPremium && <KeyRound className="w-3.5 h-3.5 text-[#C8A66A]" />}
              </div>
              <h3 className="font-heading text-xl font-black text-[#5B1F3D]">
                {isAdmin ? "Acesso Total" : (
                  isOneTimeAnnual ? "Jornada Anual" : 
                  (isPremium ? (premiumSource === "store_monthly" ? "Assinatura Mensal" : "Jornada Completa") : "Plano do Louco")
                )}
              </h3>
              {isPremium && untilFormatted && (
                <p className="text-[10px] font-body font-bold italic text-[#5B1F3D]/60 uppercase tracking-widest">
                  {isStripeRecurring ? `Renovação: ${untilFormatted}` : `Ativo até: ${untilFormatted}`}
                </p>
              )}
            </div>

            {isAdmin ? (
              <span className="text-[10px] font-heading font-black tracking-widest uppercase text-white bg-[#5B1F3D] px-3 py-1.5 rounded-lg border border-[#C8A66A]">Admin</span>
            ) : isPremium ? (
              isStripeRecurring && (
                <button 
                  onClick={handleOpenPortal} 
                  disabled={portalLoading} 
                  className="font-heading text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl border-2 border-[#DCCFC2] text-[#5B1F3D] hover:bg-[#FAF5EF]"
                >
                  Gerenciar
                </button>
              )
            ) : (
              <button onClick={() => navigate("/premium")} className="bg-[#5B1F3D] text-white px-6 py-2.5 rounded-xl font-heading font-black text-[10px] tracking-widest uppercase border border-[#C8A66A]">Upgrade</button>
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
              <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/50">Ajuste o tamanho dos portais de texto</p>
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
                    : "text-[#5B1F3D]/40 hover:text-[#5B1F3D]/60"
                }`}
              >
                <span className="block text-sm mb-0.5">{size.icon}</span>
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => navigate("/minha-jornada")} className="w-full flex items-center justify-between p-6 rounded-2xl bg-white border-2 border-[#DCCFC2]/40 group active:scale-[0.98] transition-all shadow-md">
            <div className="flex items-center gap-4">
              <Book className="w-6 h-6 text-[#C8A66A]" />
              <div className="text-left">
                <p className="font-heading text-base font-black text-[#5B1F3D]">Caderno da Jornada</p>
                <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/50 leading-none">Suas reflexões rituais</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
          </button>

          {isAdmin && (
            <button onClick={() => navigate("/admin")} className="w-full flex items-center justify-between p-6 rounded-2xl bg-[#5B1F3D] border-2 border-[#C8A66A] text-white group shadow-xl">
              <div className="flex items-center gap-4">
                <Shield className="w-6 h-6 text-[#C8A66A]" />
                <p className="font-heading text-base font-black tracking-tight">Painel Administrativo</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C8A66A]" />
            </button>
          )}
        </div>

        <div className="pt-12 flex flex-col items-center space-y-8">
          <button onClick={signOut} className="flex items-center gap-2 text-[11px] font-heading font-black tracking-[0.3em] uppercase text-[#5B1F3D]/40 hover:text-[#5B1F3D] transition-colors">
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
          
          <nav className="flex items-center gap-8 text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]/40">
            <a href="/suporte" className="hover:text-[#C8A66A] transition-colors">Suporte</a>
            <span>•</span>
            <a href="/termos" className="hover:text-[#C8A66A] transition-colors">Termos</a>
            <span>•</span>
            <a href="/excluir-conta" className="hover:text-[#C8A66A] transition-colors">Excluir</a>
          </nav>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;