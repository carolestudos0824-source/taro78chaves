import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Check, Flame, Star, Target, 
  Smartphone, BookOpen, Layers, Zap,
  Menu, X, Play, Shield, Award, HelpCircle
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
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-center lg:text-left space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-gold/20 shadow-sm">
                <span className="text-[10px] font-heading tracking-[0.2em] uppercase font-bold text-gold-dark">
                  ✦ Grátis para começar · Base Rider-Waite-Smith
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-midnight">
                Aprenda tarô<br />
                <span className="italic font-medium text-[#4A1528]">de forma progressiva</span><br />
                e viva.
              </h1>

              <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
                <p className="text-base font-body text-[#2d1810] opacity-90 max-w-md mx-auto lg:mx-0">
                  Você para de decorar. Começa a compreender.<br/>
                  Uma carta por vez, com método e profundidade.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-body font-medium text-[#3d2810]">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#4A1528]" />
                    <span>Sequência diária</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#C9A96E]" />
                    <span>XP Acumulado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#4A1528]" />
                    <span>Quizzes</span>
                  </div>
                </div>
                
                <p className="text-sm font-body font-semibold text-[#4A1528]">
                  ✦ Primeiro arcano gratuito. Vá bem e desbloqueie O Mago.
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-4 pt-4">
                <Button onClick={handleStart} className="btn-premium px-12 py-8 text-sm shadow-2xl hover:scale-105 transition-transform">
                  COMEÇAR PELO LOUCO — GRÁTIS →
                </Button>
                <p className="text-[11px] font-heading tracking-[0.15em] text-[#4A1528] font-bold uppercase">
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
                      <p className="t-section-title text-[#4A1528]">Lição 1 • Arcanos Maiores</p>
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
                      card.badge === 'Grátis' ? "bg-green-600 text-white" : card.badge === 'Desbloqueável' ? "bg-[#C9A96E] text-white" : "bg-[#4A1528] text-white"
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
              Comece pelo Louco. <span className="text-[#C9A96E] font-bold">Desbloqueie O Mago com seu desempenho.</span> Continue a jornada completa no plano premium.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ─── */}
      <section className="py-24 px-6 bg-[#fcf9f2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 text-center p-8 rounded-3xl bg-white/50 border border-gold/10 shadow-sm">
              <div className="w-12 h-12 bg-[#4A1528]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-6 h-6 text-[#4A1528]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">Uma carta por vez</h3>
              <p className="text-sm text-midnight/70 font-body">Estudo focado e profundo, sem pressa, respeitando o ritmo da sua intuição.</p>
            </div>
            
            <div className="space-y-4 text-center p-8 rounded-3xl bg-white/50 border border-gold/10 shadow-sm">
              <div className="w-12 h-12 bg-[#C9A96E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-6 h-6 text-[#C9A96E]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">Símbolos e Quizzes</h3>
              <p className="text-sm text-midnight/70 font-body">Aprenda a enxergar cada detalhe da carta e fixe o conhecimento com exercícios interativos.</p>
            </div>

            <div className="space-y-4 text-center p-8 rounded-3xl bg-white/50 border border-gold/10 shadow-sm">
              <div className="w-12 h-12 bg-[#4A1528]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-6 h-6 text-[#4A1528]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">Progresso Vivo</h3>
              <p className="text-sm text-midnight/70 font-body">Acompanhe sua evolução com XP, sequência diária e conquistas que marcam sua jornada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mobile Section ─── */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative flex justify-center">
            {/* Simple Mobile Mockup */}
            <div className="relative w-full max-w-[280px] aspect-[9/19] bg-midnight rounded-[3rem] border-8 border-midnight shadow-[0_0_50px_rgba(0,0,0,0.1)] p-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-midnight rounded-b-2xl z-20" />
              <div className="w-full h-full bg-parchment rounded-[2rem] overflow-hidden relative flex flex-col p-4 space-y-4">
                 <div className="w-full h-48 bg-white rounded-xl shadow-sm overflow-hidden">
                    <img src={imgLouco} alt="O Louco" className="w-full h-full object-cover opacity-80" />
                 </div>
                 <div className="h-2 w-2/3 bg-gold/20 rounded-full" />
                 <div className="h-4 w-full bg-midnight/5 rounded-lg" />
                 <div className="h-4 w-5/6 bg-midnight/5 rounded-lg" />
                 <div className="mt-auto h-10 w-full bg-[#4A1528] rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A96E]/10 text-[#C9A96E]">
              <span className="text-[10px] font-heading tracking-widest uppercase font-bold">
                📱 FEITO PARA ESTUDAR NO CELULAR
              </span>
            </div>
            <h2 className="font-heading text-4xl text-midnight">Estude onde estiver.</h2>
            <p className="text-lg text-midnight/70 font-body leading-relaxed max-w-lg mx-auto lg:mx-0">
              O Tarô 78 Chaves foi pensado para aulas curtas, leitura confortável e progresso diário direto pelo seu navegador, em qualquer dispositivo.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section className="py-32 px-6 bg-midnight text-parchment relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#4A1528]/10 blur-[150px] rounded-full" />
        
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
              <p className="text-sm opacity-60 flex-1 font-body">Ideal para quem quer testar no seu próprio tempo, com liberdade para cancelar.</p>
              <Button onClick={() => handleSubscribe("monthly")} className="w-full py-7 rounded-full border border-white/20 text-white bg-transparent hover:bg-white/10 font-heading tracking-widest text-[11px] uppercase transition-all">
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
                <p className="text-xs font-bold text-[#4A1528]">= R$16,42/mês • Economia de 45%</p>
              </div>
              <p className="text-sm text-midnight/60 flex-1 font-body">Acesso vitalício ao conhecimento transformado em hábito diário.</p>
              <Button onClick={() => handleSubscribe("annual")} className="btn-premium w-full py-8 text-sm shadow-xl hover:scale-[1.02] transition-transform">
                ASSINAR ANUAL →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-24 px-6 bg-[#fcf9f2]">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <HelpCircle className="w-10 h-10 text-gold mx-auto mb-4" />
             <h2 className="font-heading text-3xl text-midnight">Dúvidas Frequentes</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-gold/20">
              <AccordionTrigger className="font-heading text-left hover:text-gold transition-colors">Por onde eu começo?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/70">
                Você começa pelo Louco gratuitamente. Se for bem na lição, desbloqueia O Mago e entende como a jornada funciona antes de assinar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-gold/20">
              <AccordionTrigger className="font-heading text-left hover:text-gold transition-colors">Preciso de um baralho físico?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/70">
                Não é obrigatório, mas recomendável. O app utiliza as imagens canônicas do Rider-Waite-Smith para você estudar cada detalhe visual.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-gold/20">
              <AccordionTrigger className="font-heading text-left hover:text-gold transition-colors">Como funciona o cancelamento?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/70">
                Você pode cancelar sua assinatura a qualquer momento através do seu perfil no app, sem letras miúdas ou burocracia.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-20 px-6 text-center space-y-12 border-t border-gold/10">
        <div className="space-y-4">
          <h3 className="font-heading text-2xl tracking-[0.3em] text-[#4A1528]">Tarô 78 Chaves</h3>
          <p className="t-section-title">A jornada viva pelos arcanos</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-8 text-[11px] font-heading tracking-widest uppercase opacity-40">
          <a href="/privacidade" className="hover:text-[#4A1528] hover:opacity-100 transition-colors">Privacidade</a>
          <a href="/termos" className="hover:text-[#4A1528] hover:opacity-100 transition-colors">Termos</a>
          <a href="/suporte" className="hover:text-[#4A1528] hover:opacity-100 transition-colors">Suporte</a>
          <a href="/excluir-conta" className="hover:text-[#4A1528] hover:opacity-100 transition-colors">Excluir conta</a>
        </nav>

        <p className="text-[10px] opacity-20 font-body">© {new Date().getFullYear()} Tarô 78 Chaves. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
