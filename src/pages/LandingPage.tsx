import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Check, Flame, Star, Target, 
  Smartphone, BookOpen, Layers, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgMago from "@/assets/arcano-1-mago.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgImperatriz from "@/assets/arcano-3-imperatriz.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleStart = () => {
    if (user) navigate("/app");
    else navigate("/auth");
  };

  const handleSubscribe = (plan: "monthly" | "annual") => {
    if (user) navigate("/premium");
    else navigate(`/auth?redirect=/premium&plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-parchment text-midnight selection:bg-secondary selection:text-white">
      
      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold/30 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-gold/20 shadow-sm">
                <span className="text-[10px] font-heading tracking-[0.2em] uppercase font-bold text-gold-dark">
                  ✦ Grátis para começar · Base Rider-Waite-Smith
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-midnight">
                Aprenda tarô de forma<br />
                <span className="text-secondary italic font-medium">progressiva e viva.</span>
              </h1>

              <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
                <p className="text-lg md:text-xl text-midnight/80 leading-relaxed font-body">
                  Uma lição por dia. 78 cartas. XP, sequência diária e quizzes que fixam de verdade.
                </p>
                
                <p className="text-sm md:text-base font-heading tracking-wide text-secondary/80">
                  Comece pelo Louco grátis. Vá bem e desbloqueie O Mago.
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-4 pt-4">
                <Button onClick={handleStart} className="btn-premium px-12 py-8 text-sm shadow-2xl">
                  COMEÇAR PELO LOUCO — GRÁTIS →
                </Button>
                <p className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground uppercase">
                  Sem cartão de crédito para começar.
                </p>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative group perspective-1000">
                <div className="absolute -inset-8 bg-gold/10 blur-3xl rounded-full -z-10 group-hover:bg-gold/20 transition-all duration-1000" />
                
                {/* Main Card Mockup */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-gold/10 max-w-[340px] transform-gpu group-hover:rotate-y-12 transition-transform duration-700">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-6 shadow-xl border-4 border-white">
                    <img src={imgLouco} alt="O Louco" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <p className="t-section-title text-accent">Lição 1 • Arcanos Maiores</p>
                      <h3 className="font-heading text-3xl text-midnight">O Louco</h3>
                      <p className="font-accent italic text-muted-foreground">O início de toda jornada</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-heading tracking-widest uppercase opacity-40">
                        <span>Progresso</span>
                        <span>45%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Journey Map Section ─── */}
      <section className="py-24 bg-white/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl text-midnight">Explore a Trilha do Conhecimento</h2>
            <p className="text-muted-foreground max-w-lg mx-auto font-body">Uma jornada sequencial que destrava os mistérios do tarô.</p>
          </div>

          <div className="flex overflow-x-auto gap-8 pb-12 px-4 scrollbar-hide snap-x items-end min-h-[320px]">
            {[
              { id: 0, img: imgLouco, name: "O Louco", badge: "Grátis" },
              { id: 1, img: imgMago, name: "O Mago", badge: "Desbloqueável" },
              { id: 2, img: imgSacerdotisa, name: "A Sacerdotisa", badge: "Premium" },
              { id: 3, img: imgImperatriz, name: "A Imperatriz", badge: "Premium" },
            ].map((card, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-5 snap-center">
                <div className="relative group">
                  <div className="w-36 h-56 md:w-44 md:h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white transition-all duration-500 group-hover:-translate-y-4">
                    <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-heading tracking-widest uppercase shadow-lg ${
                      card.badge === 'Grátis' ? "bg-success text-white" : card.badge === 'Desbloqueável' ? "bg-accent text-white" : "bg-secondary text-white"
                    }`}>
                      {card.badge}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] font-heading tracking-widest uppercase text-midnight/60">{card.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-body text-muted-foreground max-w-2xl mx-auto">
              Comece pelo Louco. <span className="text-accent font-bold">Desbloqueie O Mago com seu desempenho.</span> Continue a jornada completa no plano premium.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section className="py-32 px-6 bg-midnight text-parchment relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-secondary/20 blur-[150px] rounded-full" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <p className="t-section-title text-gold/60">Acesso Completo</p>
            <h2 className="font-heading text-4xl md:text-5xl">Escolha seu caminho</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Monthly */}
            <div className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 flex flex-col text-left space-y-8">
              <div className="space-y-2">
                <h3 className="t-section-title text-white/40 font-bold">Plano Mensal</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-heading text-white">R$29,90</span>
                  <span className="text-sm opacity-40">/mês</span>
                </div>
              </div>
              <p className="text-sm opacity-60 flex-1">Ideal para quem quer testar no seu próprio tempo, com liberdade para cancelar.</p>
              <Button onClick={() => handleSubscribe("monthly")} className="btn-outline-gold w-full py-7 border-white/20 text-white hover:bg-white/10">
                ASSINAR MENSAL
              </Button>
            </div>

            {/* Annual */}
            <div className="p-10 rounded-[3rem] bg-white text-midnight shadow-2xl scale-105 border-4 border-gold relative flex flex-col text-left space-y-8">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold px-6 py-2 rounded-full text-[10px] font-heading font-black tracking-widest text-parchment shadow-xl">
                ✦ MELHOR VALOR
              </div>
              <div className="space-y-2">
                <h3 className="t-section-title text-gold-dark font-bold">Plano Anual</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-heading text-midnight">R$197</span>
                  <span className="text-sm opacity-40">/ano</span>
                </div>
                <p className="text-xs font-bold text-accent">= R$16,42/mês • Economia de 45%</p>
              </div>
              <p className="text-sm text-midnight/60 flex-1">Acesso vitalício ao conhecimento transformado em hábito diário.</p>
              <Button onClick={() => handleSubscribe("annual")} className="btn-premium w-full py-8 text-sm shadow-xl">
                ASSINAR ANUAL →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-20 px-6 text-center space-y-12">
        <div className="space-y-4">
          <h3 className="font-heading text-2xl tracking-[0.3em] text-secondary">Tarô 78 Chaves</h3>
          <p className="t-section-title">A jornada viva pelos arcanos</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-8 text-[11px] font-heading tracking-widest uppercase opacity-40">
          <a href="/privacidade" className="hover:opacity-100">Privacidade</a>
          <a href="/termos" className="hover:opacity-100">Termos</a>
          <a href="/suporte" className="hover:opacity-100">Suporte</a>
          <a href="/excluir-conta" className="hover:opacity-100">Excluir conta</a>
        </nav>

        <p className="text-[10px] opacity-20">© {new Date().getFullYear()} Tarô 78 Chaves. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
