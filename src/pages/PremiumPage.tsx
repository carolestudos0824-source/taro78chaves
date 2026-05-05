import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Crown, BookOpen, Eye, Layers,
  Target, Star, Heart, Sparkles, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/use-premium";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PREMIUM_BENEFITS = [
  { icon: BookOpen, title: "Os 78 Arcanos", desc: "Domine o deck completo (Maiores e Menores) carta por carta." },
  { icon: Sparkles, title: "Método Arcano Vivo", desc: "Acesso total à análise simbólica, essência, luz e sombra." },
  { icon: Target, title: "Prática Profissional", desc: "Exercícios de leitura real, quizzes e ferramentas de revisão." },
  { icon: Heart, title: "Módulos de Aplicação", desc: "Leituras para Amor, Trabalho, Espiritualidade e Saúde." },
];

const PremiumPage = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("stripe-create-checkout", {
        body: { plan },
      });
      if (data?.url) window.location.href = data.url;
    } catch (e) {
      toast.error("Erro ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
          <Crown className="w-10 h-10 text-gold-dark" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-midnight">Sua Jornada é Ilimitada</h1>
          <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Você tem acesso total a todos os arcanos e ferramentas da plataforma.
          </p>
        </div>
        <Button onClick={() => navigate("/app")} className="btn-premium px-10 py-7">Continuar Estudando</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="px-6 pt-12 pb-24 relative overflow-hidden bg-white/20">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gold/40 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-lg mx-auto relative z-10 space-y-6">
          <button onClick={() => navigate(-1)} className="p-2 opacity-50 hover:opacity-100 -ml-2 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/5 border border-secondary/10">
              <Crown className="w-3 h-3 text-secondary" />
              <span className="text-[10px] font-heading tracking-widest uppercase text-secondary">Acesso Premium</span>
            </div>
            <h1 className="font-heading text-4xl text-midnight leading-tight">Desperte o Oráculo em você.</h1>
            <p className="text-muted-foreground font-body leading-relaxed">
              Vá além do Louco e domine a linguagem mística do Tarô com profundidade real.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 -mt-12 relative z-20 space-y-12">
        {/* Benefits Grid */}
        <div className="grid gap-4">
          {PREMIUM_BENEFITS.map((b) => (
            <div key={b.title} className="bg-white/80 backdrop-blur-xl border border-gold/10 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-gold-dark" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-sm text-midnight">{b.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="t-section-title">Planos de Acesso</h2>
            <p className="text-xs font-accent italic text-muted-foreground">Cancele quando quiser. Pagamento seguro via Stripe.</p>
          </div>

          <div className="space-y-4">
            {/* Monthly */}
            <button onClick={() => handleSubscribe("monthly")} disabled={loading} className="w-full text-left bg-white/50 border border-gold/20 p-6 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-heading tracking-widest uppercase opacity-40">Plano Mensal</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-2xl text-midnight">R$ 29,90</span>
                  <span className="text-xs opacity-40">/mês</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <ChevronRight className="w-4 h-4 opacity-30" />
              </div>
            </button>

            {/* Yearly */}
            <div className="w-full text-left bg-white border-2 border-gold p-8 rounded-[2rem] flex flex-col space-y-6 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all">
              <div className="absolute top-0 right-0 bg-gold px-6 py-2 rounded-bl-3xl text-[9px] font-heading font-black tracking-widest text-parchment uppercase shadow-sm">
                Melhor Valor
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-heading tracking-widest uppercase text-gold-dark">Plano Anual</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl text-midnight tracking-tight">R$ 197</span>
                  <span className="text-sm opacity-40">/ano</span>
                </div>
                <p className="text-xs font-bold text-accent">R$ 16,42/mês • 45% de economia</p>
              </div>

              <Button 
                onClick={() => handleSubscribe("yearly")} 
                disabled={loading} 
                className="btn-premium w-full py-8 text-sm"
              >
                DESPERTAR O ORÁCULO →
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PremiumPage;
