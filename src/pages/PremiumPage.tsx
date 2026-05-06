import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, KeyRound, SquareStack, Compass,
  Sparkles, WandSparkles, CircleCheck, Eye, Stars, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/use-premium";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const PREMIUM_BENEFITS = [
  { icon: SquareStack, title: "78 arcanos guiados", desc: "Abra todas as portas do deck completo." },
  { icon: Compass, title: "Jornada progressiva", desc: "A trilha mística para o domínio real." },
  { icon: Sparkles, title: "Quizzes e XP", desc: "Teste seu olhar e conquiste energia." },
  { icon: WandSparkles, title: "Práticas guiadas", desc: "Rituais de leitura para o cotidiano." },
  { icon: CircleCheck, title: "Progresso salvo", desc: "Suas chaves sempre com você." },
  { icon: Stars, title: "Arcanos Vivos", desc: "A essência profunda de cada símbolo." },
];

const PremiumPage = () => {
  const navigate = useNavigate();
  const { isPremium, stripeCustomerId } = usePremium();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.info("Entre na sua conta para abrir estes portais.");
      navigate("/auth?redirect=/premium");
      return;
    }

    if (isPremium) {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("stripe-customer-portal");
        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        } else {
          toast.info("Você já possui todas as chaves ativas.");
          navigate("/perfil");
        }
      } catch (e: any) {
        console.error("Erro ao abrir portal:", e);
        toast.error(`Não foi possível abrir o portal.`);
        navigate("/perfil");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    trackEvent(`checkout_${plan}_started`);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-create-checkout", {
        body: { plan },
      });
      
      if (error) {
        const msg = error.message || "";
        if (msg.includes("401")) {
          toast.info("Sua sessão expirou. Entre novamente.");
          navigate("/auth");
          return;
        }
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Portal indisponível no momento.");
      }
    } catch (e: any) {
      console.error("Erro no checkout:", e);
      toast.error(`Não foi possível abrir o portal. Tente novamente em instantes.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#FAF5EF]">
      <header className="px-6 pt-12 pb-24 relative overflow-hidden bg-white/40 border-b border-[#C8A66A]/20 shadow-sm">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#C8A66A]/40 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-lg mx-auto relative z-10 space-y-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#5B1F3D] hover:opacity-70 transition-all font-heading font-black text-xs uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B1F3D] border-2 border-[#C8A66A]">
              <KeyRound className="w-3.5 h-3.5 text-[#C8A66A]" />
              <span className="text-[10px] font-heading tracking-[0.2em] uppercase text-[#FAF5EF] font-black">Jornada Completa</span>
            </div>
            <h1 className="font-heading text-4xl text-[#5B1F3D] leading-tight font-black">
              Receba todas as chaves da sua jornada.
            </h1>
            <p className="text-[#5B1F3D]/80 font-body text-base font-bold italic leading-relaxed">
              Abra as 78 portas do Tarô e continue sua travessia com método, prática e progresso salvo.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 -mt-12 relative z-20 space-y-12">
        <div className="space-y-4">
          <h2 className="text-center font-heading text-xs tracking-[0.3em] uppercase font-black text-[#C8A66A]">
            O que você desbloqueia:
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {PREMIUM_BENEFITS.map((b) => (
              <div key={b.title} className="bg-white border-2 border-[#DCCFC2]/40 p-5 rounded-2xl flex items-center gap-5 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-[#FAF5EF] border border-[#C8A66A]/30 flex items-center justify-center shrink-0">
                  <b.icon className="w-6 h-6 text-[#5B1F3D]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading text-base font-black text-[#5B1F3D]">{b.title}</h3>
                  <p className="text-xs text-[#5B1F3D]/70 font-body font-bold italic">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-xl font-black text-[#5B1F3D]">Planos de Acesso</h2>
            <p className="text-xs font-accent italic text-[#5B1F3D]/60 font-bold">Cada prática abre mais uma porta.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleSubscribe("monthly")} 
              disabled={loading} 
              className="w-full text-left bg-white border-2 border-[#DCCFC2] p-6 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm hover:border-[#C8A66A]"
            >
              <div className="space-y-1">
                <p className="text-[11px] font-heading tracking-[0.2em] uppercase font-black text-[#C8A66A]">Plano Mensal</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-2xl text-[#5B1F3D] font-black">R$ 29,90</span>
                  <span className="text-xs font-bold text-[#5B1F3D]/40">/mês</span>
                </div>
                <p className="text-[10px] font-body font-bold text-[#5B1F3D]/60">Liberdade para cancelar quando quiser.</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#DCCFC2] flex items-center justify-center group-hover:bg-[#FAF5EF] group-hover:border-[#C8A66A] transition-colors">
                <ChevronRight className="w-5 h-5 text-[#C8A66A]" />
              </div>
            </button>

            <div className="w-full text-left bg-white border-4 border-[#C8A66A] p-8 rounded-[2.5rem] flex flex-col space-y-6 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all ring-8 ring-[#C8A66A]/5">
              <div className="absolute top-0 right-0 bg-[#C8A66A] px-6 py-2.5 rounded-bl-3xl text-[10px] font-heading font-black tracking-widest text-[#FAF5EF] uppercase shadow-md">
                Melhor Valor
              </div>
              
              <div className="space-y-2">
                <p className="text-[11px] font-heading tracking-[0.2em] uppercase text-[#5B1F3D] font-black">Acesso Anual</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-5xl text-[#5B1F3D] font-black tracking-tighter">R$ 197</span>
                  <span className="text-xs font-heading font-black text-[#5B1F3D]/40">/único</span>
                </div>
                <p className="text-sm font-black text-[#C8A66A] italic leading-relaxed">
                  12 meses de acesso • Sem renovação automática
                </p>
              </div>

              <Button 
                onClick={() => handleSubscribe("yearly")} 
                disabled={loading} 
                className="w-full py-8 text-sm bg-[#5B1F3D] hover:bg-[#5B1F3D]/90 text-white rounded-2xl font-heading font-black tracking-[0.2em] shadow-xl border-2 border-[#C8A66A]"
              >
                COMEÇAR JORNADA COMPLETA
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6 py-8">
          <h2 className="text-center font-heading text-lg font-black text-[#5B1F3D]">Dúvidas da Travessia</h2>
          <div className="space-y-4">
            {[
              { q: "Por onde eu começo?", a: "Você começa pelo Louco, o primeiro portal da jornada. Depois, segue carta por carta com método, prática e progresso." },
              { q: "O que está incluso?", a: "Acesso à jornada completa pelos 78 arcanos, quizzes, práticas rituais, módulos premium e progresso salvo." },
              { q: "Preciso saber Tarô antes?", a: "Não. O app foi criado para guiar você desde a base, uma carta por vez, abrindo as chaves do seu olhar." }
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