import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkoutUrl } from "@/config/checkout";
import { ArrowLeft, ChevronRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/use-premium";
import { useRole } from "@/hooks/use-role";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { isWebCheckoutAllowed, STRIPE_BLOCKED_ANDROID_MSG } from "@/lib/platform";
import { cn } from "@/lib/utils";

const PREMIUM_BENEFITS = [
  { icon: "jornada", title: "78 arcanos guiados", desc: "Abra todas as portas do deck completo." },
  { icon: "formacao", title: "Jornada progressiva", desc: "A trilha mística para o domínio real." },
  { icon: "quiz", title: "Quizzes", desc: "Teste seu olhar e integre a sabedoria." },
  { icon: "mago", title: "Práticas guiadas", desc: "Rituais de leitura para o cotidiano." },
  { icon: "concluido", title: "Progresso salvo", desc: "Suas chaves sempre com você." },
  { icon: "Stars", title: "Arcanos Vivos", desc: "A essência profunda de cada símbolo." },
];

const PremiumPage = () => {
  const navigate = useNavigate();
  const { isPremium, subscriptionStatus, premiumUntil } = usePremium();
  const { isStaff } = useRole();
  const [loading, setLoading] = useState(false);
  const webCheckoutAllowed = isWebCheckoutAllowed();

  const handleSubscribe = async () => {
    if (checkoutUrl) {
      trackEvent("checkout_monthly_started");
      window.location.href = checkoutUrl;
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.info("Entre na sua conta para abrir estes portais.");
      navigate("/auth?redirect=/premium");
      return;
    }

    if (isPremium) {
      toast.info("Você já possui todas as chaves ativas.");
      navigate("/perfil");
      return;
    }

    toast.error("Serviço de pagamento indisponível no momento. Tente novamente mais tarde.");
  };

  return (
    <div className="min-h-screen pb-bottom-nav relative overflow-hidden">
      {/* Background — Sincronizado com /app */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #FDF8F3 45%, #F2E7D9 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"
        />
      </div>

      <header className="px-6 pt-12 pb-24 relative z-10 overflow-hidden bg-white/40 border-b-2 border-[#C8A66A30] shadow-sm backdrop-blur-md">
        <div className="max-w-lg mx-auto relative z-10 space-y-8">
          <button onClick={() => navigate(-1)} className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white border-2 border-[#C8A66A20] shadow-sm hover:border-[#C8A66A] transition-all" style={{ color: "#5B1F3D" }}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#5B1F3D] border-2 border-[#C8A66A] shadow-lg">
              <TarotIcon name="premium" className="w-4 h-4 text-[#C8A66A]" />
              <span className="text-[11px] font-heading tracking-[0.3em] uppercase text-[#FAF5EF] font-black">Jornada Completa</span>
            </div>
            <h1 className="font-heading text-2xl min-[400px]:text-3xl md:text-5xl text-[#5B1F3D] leading-[1.1] font-black tracking-tight drop-shadow-sm break-words">
              Aprenda Tarô como uma jornada sagrada.
            </h1>
            <p className="text-[#5B1F3D] font-body text-[15px] md:text-[16px] font-bold italic leading-relaxed opacity-90">
              Estude os 78 arcanos com uma trilha progressiva, fiel ao simbolismo original e pensada para criar domínio real e prático.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 min-[400px]:px-6 -mt-12 relative z-20 space-y-12 pb-32">
        <div className="space-y-4">
          <h2 className="text-center font-heading text-[11px] tracking-[0.4em] uppercase font-black text-[#C8A66A] mb-8">
            ✦ O QUE VOCÊ DESBLOQUEIA ✦
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {PREMIUM_BENEFITS.map((b) => (
              <div key={b.title} className="bg-white border-2 border-[#C8A66A20] p-5 min-[400px]:p-6 rounded-[2rem] flex items-center gap-4 min-[400px]:gap-6 shadow-xl hover:border-[#C8A66A40] transition-all">
                <div className="w-16 h-16 rounded-[1.2rem] bg-[#FAF5EF] border-2 border-[#C8A66A30] flex items-center justify-center shrink-0 shadow-inner">
                  <TarotIcon name={b.icon} className="w-8 h-8 text-[#5B1F3D]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-base min-[400px]:text-lg font-black text-[#5B1F3D] tracking-tight break-words">{b.title}</h3>
                  <p className="text-[13px] text-[#5B1F3D80] font-body font-bold italic leading-snug">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isStaff && (
          <div className="bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/20 p-6 rounded-[2rem] flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#C8A66A]/20 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#C8A66A]" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]">Modo Auditoria Ativo</p>
              <p className="text-[11px] font-body font-bold leading-relaxed italic text-[#5B1F3D]/70">
                Você está visualizando esta página como Admin/Staff. Alunas sem acesso ativo veem a oferta abaixo.
              </p>
            </div>
          </div>
        )}

        {isPremium && !isStaff ? (
          <div className="space-y-8">
            <div className="bg-white border-4 border-emerald-500/30 p-8 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 shadow-2xl relative overflow-hidden ring-8 ring-emerald-500/5">
              <div className="absolute top-0 right-0 bg-emerald-500 px-6 py-2.5 rounded-bl-3xl text-[10px] font-heading font-black tracking-widest text-white uppercase shadow-md">
                Acesso Ativo
              </div>
              
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-emerald-100 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-black text-[#5B1F3D]">Sua jornada completa está liberada</h2>
                <p className="text-sm font-body font-bold text-[#5B1F3D]/60 italic">
                  Todos os portais da Escola Digital estão abertos para sua travessia.
                </p>
                {premiumUntil && (
                  <p className="text-[10px] font-heading font-black tracking-widest uppercase text-[#C8A66A] pt-2">
                    Acesso válido até {new Date(premiumUntil).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              <Button 
                onClick={() => navigate("/app")} 
                className="w-full py-7 text-sm bg-[#5B1F3D] hover:bg-[#3D1429] text-white rounded-2xl font-heading font-black tracking-[0.2em] shadow-xl border-2 border-[#C8A66A] h-auto"
              >
                CONTINUAR MINHA JORNADA
              </Button>
            </div>
          </div>
        ) : webCheckoutAllowed ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-heading text-xl font-black text-[#5B1F3D]">Escola Digital</h2>
              <p className="text-xs font-accent italic text-[#5B1F3D]/60 font-bold">Cada prática abre mais uma porta.</p>
            </div>

            <div className="space-y-4">
              <div className="w-full text-left bg-white border-4 border-[#C8A66A] p-6 min-[400px]:p-8 rounded-[2.5rem] flex flex-col space-y-6 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all ring-8 ring-[#C8A66A]/5">
                <div className="absolute top-0 right-0 bg-[#C8A66A] px-6 py-2.5 rounded-bl-3xl text-[10px] font-heading font-black tracking-widest text-[#FAF5EF] uppercase shadow-md">
                  Assinatura Mensal
                </div>
                
                <div className="space-y-2">
                  <p className="text-[11px] font-heading tracking-[0.2em] uppercase text-[#5B1F3D] font-black">Escola Digital</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-4xl min-[400px]:text-5xl text-[#5B1F3D] font-black tracking-tighter">R$ 37</span>
                    <span className="text-xs font-heading font-black text-[#5B1F3D]/40">/mês</span>
                  </div>
                  <p className="text-sm font-black text-[#5B1F3D] italic leading-relaxed">
                    Acesso completo enquanto a assinatura estiver ativa • Cancele quando quiser
                  </p>
                </div>

                <Button 
                  onClick={() => handleSubscribe()} 
                  disabled={loading} 
                  className="w-full h-auto min-h-[4rem] py-5 px-4 text-[11px] min-[400px]:text-sm bg-[#5B1F3D] hover:bg-[#5B1F3D]/90 text-white rounded-2xl font-heading font-black tracking-[0.1em] min-[400px]:tracking-[0.15em] shadow-xl border-2 border-[#C8A66A] whitespace-normal leading-tight text-center"
                >
                  COMEÇAR MINHA JORNADA
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#DCCFC2] p-6 rounded-3xl text-center space-y-2">
            <h2 className="font-heading text-base font-black text-[#5B1F3D]">Escola Digital</h2>
            <p className="text-xs font-body font-bold text-[#5B1F3D]/70 leading-relaxed">
              {STRIPE_BLOCKED_ANDROID_MSG}
            </p>
          </div>
        )}

        <div className="space-y-6 py-8">
          <h2 className="text-center font-heading text-lg font-black text-[#5B1F3D]">Dúvidas da Travessia</h2>
          <div className="space-y-4">
            {[
              { q: "Por onde eu começo?", a: "Você começa pelo Louco, o primeiro portal da jornada. Depois, segue carta por carta com método, prática e progresso." },
              { q: "O que está incluso?", a: "Acesso à jornada completa pelos 78 arcanos, quizzes, práticas rituais, módulos premium e progresso salvo." },
              { q: "Preciso saber Tarô antes?", a: "Não. A Escola Digital foi criada para guiar você desde a base, uma carta por vez, abrindo as chaves do seu olhar." }
            ].map((item, i) => (
              <div key={i} className="bg-white/50 border border-[#DCCFC2]/60 p-5 rounded-2xl">
                <h4 className="font-heading text-sm font-black text-[#5B1F3D] mb-1.5">{item.q}</h4>
                <p className="text-xs text-[#5B1F3D]/80 font-body font-bold italic leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PremiumPage;