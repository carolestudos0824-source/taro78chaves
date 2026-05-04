import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Check, ChevronDown, 
  Flame, Star, Target, MessageSquare, 
  Smartphone, BookOpen, Layers, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Assets
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
    <div className="min-h-screen bg-[#fff8e6] text-[#1f120d] font-body selection:bg-[#5a1028] selection:text-white">
      
      {/* ═══════════════ SEÇÃO 1 — HERO ═══════════════ */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#f6d35b] blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-[#4f7fc5] blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f6d35b]/20 border border-[#f6d35b]/30">
                <span className="text-[10px] md:text-xs font-heading tracking-[0.2em] uppercase font-bold text-[#1f120d]">
                  ✦ GRÁTIS PARA COMEÇAR
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-[#1f120d]">
                Aprenda tarô<br />
                <span className="text-[#4f7fc5] italic font-medium">de forma progressiva</span><br />
                e viva.
              </h1>

              <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
                <p className="text-lg md:text-xl text-[#1f120d]/80 leading-relaxed font-medium">
                  Uma lição por dia. 78 cartas. <br className="hidden md:block" />
                  XP, streaks e quizzes que fixam de verdade.
                </p>
                
                <p className="text-base text-[#1f120d]/70 italic">
                  Você deixa de decorar significados soltos e começa a entender o tarô carta por carta.
                </p>

                <p className="text-sm md:text-base font-bold text-[#5a1028]">
                  Comece pelo Louco grátis. Vá bem na lição e desbloqueie O Mago.
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-[10px] md:text-xs font-heading tracking-widest text-[#1f120d]/60 uppercase font-bold">
                  <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Sequência diária</span>
                  <span className="hidden md:inline text-[#1f120d]/20">|</span>
                  <span className="flex items-center gap-2"><Star className="w-4 h-4 text-[#f6d35b]" /> XP</span>
                  <span className="hidden md:inline text-[#1f120d]/20">|</span>
                  <span className="flex items-center gap-2"><Target className="w-4 h-4 text-red-500" /> Quizzes</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
                <Button 
                  onClick={handleStart}
                  className="w-full sm:w-auto px-10 py-7 text-xs md:text-sm font-heading tracking-[0.2em] uppercase rounded-full bg-[#5a1028] hover:bg-[#7a1a38] text-white shadow-xl shadow-[#5a1028]/20 transition-all hover:scale-105 active:scale-95"
                >
                  COMEÇAR PELO LOUCO — GRÁTIS →
                </Button>
                <p className="text-xs font-medium text-[#1f120d]/50">
                  Primeiro arcano gratuito <br /> Sem cartão de crédito para começar
                </p>
              </div>
            </div>

            {/* Right Content - Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative group">
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-white/40 blur-2xl rounded-[3rem] -z-10" />
                
                {/* Main Card */}
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/50 max-w-[320px] md:max-w-[380px] transform transition-transform group-hover:rotate-1">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-6 shadow-lg border border-[#fff8e6]">
                    <img src={imgLouco} alt="O Louco" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-heading tracking-[0.3em] text-[#4f7fc5] uppercase font-bold">LIÇÃO 1 · ARCANOS MAIORES</p>
                      <h3 className="font-display text-3xl text-[#1f120d]">O Louco</h3>
                      <p className="text-sm italic text-[#1f120d]/60">O início de toda jornada</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-heading tracking-widest uppercase text-[#1f120d]/40">
                        <span>Progresso</span>
                        <span>45%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#fff8e6] rounded-full overflow-hidden">
                        <div className="h-full bg-[#f6d35b] rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-[#f6d35b]/10 border border-[#f6d35b]/20 text-[10px] font-heading tracking-wider text-[#1f120d]/70 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" /> 3 dias
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-[#4f7fc5]/10 border border-[#4f7fc5]/20 text-[10px] font-heading tracking-wider text-[#1f120d]/70 flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#4f7fc5]" /> +10 XP
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-[#5a1028]/5 border border-[#5a1028]/10 text-[10px] font-heading tracking-wider text-[#1f120d]/70">
                        Foco
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating ornaments */}
                <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#f6d35b] animate-bounce">
                  <Star className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SEÇÃO 2 — TRILHA DO CONHECIMENTO ═══════════════ */}
      <section className="py-24 bg-white/50 border-y border-[#1f120d]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl text-[#1f120d]">Explore a Trilha do Conhecimento</h2>
            <p className="text-[#1f120d]/60 max-w-lg mx-auto">Uma jornada sequencial que destrava os mistérios do tarô passo a passo.</p>
          </div>

          <div className="relative py-12">
            {/* Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#f6d35b]/30 -translate-y-1/2" />
            
            <div className="flex overflow-x-auto gap-8 pb-8 px-4 scrollbar-hide snap-x">
              {[
                { id: 0, img: imgLouco, name: "O Louco" },
                { id: 1, img: imgMago, name: "O Mago" },
                { id: 2, img: imgSacerdotisa, name: "A Sacerdotisa" },
                { id: 3, img: imgImperatriz, name: "A Imperatriz" },
                { id: 4, name: "?" },
                { id: 5, name: "?" },
                { id: 6, name: "?" },
                { id: 7, name: "?" },
              ].map((card, i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-4 snap-center relative">
                  {/* Dot on line */}
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-[#fff8e6] z-10 ${card.img ? 'bg-[#f6d35b]' : 'bg-[#1f120d]/10'}`} style={{ top: 'calc(50% - 32px)' }} />
                  
                  <div className={`w-32 h-48 md:w-40 md:h-60 rounded-xl overflow-hidden shadow-xl border-4 border-white transform transition-transform hover:-translate-y-2 ${!card.img ? 'bg-[#fff8e6] border-dashed border-[#1f120d]/10 flex items-center justify-center opacity-50' : ''}`}>
                    {card.img ? (
                      <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-display text-[#1f120d]/20">?</span>
                    )}
                  </div>
                  <p className={`text-[10px] font-heading tracking-widest uppercase font-bold ${card.img ? 'text-[#1f120d]' : 'text-[#1f120d]/30'}`}>
                    {card.img ? card.name : `Arcano ${i}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SEÇÃO 3 — BENEFÍCIOS ═══════════════ */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🃏",
              title: "UMA CARTA POR VEZ",
              text: "Cada arcano tem lição própria: essência, símbolos, luz, sombra e quiz."
            },
            {
              icon: "📈",
              title: "PROGRESSO REAL E VIVO",
              text: "XP, streak diário e desbloqueio sequencial. Você sente que está evoluindo."
            },
            {
              icon: "🎯",
              title: "QUIZ QUE REALMENTE FIXA",
              text: "Não é decoreba. É compreensão testada com feedback imediato."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-[#1f120d]/5 shadow-sm space-y-6 transition-all hover:shadow-xl hover:shadow-[#1f120d]/5 hover:-translate-y-1">
              <div className="text-4xl">{item.icon}</div>
              <div className="space-y-3">
                <h3 className="font-heading text-sm tracking-[0.2em] font-bold text-[#1f120d]">{item.title}</h3>
                <p className="text-[#1f120d]/60 leading-relaxed text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SEÇÃO 4 — PREÇO ═══════════════ */}
      <section className="py-24 px-6 bg-[#1f120d] text-white overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5a1028] blur-[150px] opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl">Acesso Completo</h2>
            <p className="text-white/60 max-w-lg mx-auto">Escolha o plano que melhor se adapta ao seu ritmo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white/10 border border-white/20 p-10 rounded-[2.5rem] flex flex-col justify-between space-y-8 backdrop-blur-sm shadow-xl transition-all hover:bg-white/[0.15]">
              <div className="space-y-4">
                <h3 className="font-heading tracking-[0.2em] text-sm text-white/80 uppercase font-bold">MENSAL</h3>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-display text-white">R$29,90</span>
                    <span className="text-sm text-white/60">/mês</span>
                  </div>
                  <p className="text-xs text-white/40">Ideal para quem quer testar no seu próprio tempo</p>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe("monthly")}
                variant="outline" 
                className="w-full py-7 text-sm font-heading tracking-[0.2em] uppercase rounded-full border-white/30 hover:bg-white text-white hover:text-[#1f120d] transition-all font-bold"
              >
                Assinar mensal
              </Button>
            </div>

            {/* Annual Plan */}
            <div className="bg-white p-10 rounded-[2.5rem] flex flex-col justify-between space-y-8 relative shadow-2xl shadow-[#5a1028]/40 border-2 border-[#f6d35b] transition-all hover:scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-[#f6d35b] text-[#1f120d] rounded-full text-[10px] md:text-xs font-heading font-bold tracking-[0.2em] uppercase whitespace-nowrap shadow-lg">
                ✦ MELHOR VALOR
              </div>
              
              <div className="space-y-4">
                <h3 className="font-heading tracking-[0.2em] text-sm text-[#1f120d]/40 uppercase font-bold">ANUAL</h3>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-display text-[#1f120d]">R$197</span>
                    <span className="text-sm text-[#1f120d]/40">/ano</span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[#4f7fc5]">= R$16,42/mês · Economia de 45%</p>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSubscribe("annual")}
                className="w-full py-7 text-sm font-heading tracking-[0.2em] uppercase rounded-full bg-[#5a1028] hover:bg-[#7a1a38] text-white shadow-lg shadow-[#5a1028]/20 transition-all font-bold"
              >
                ASSINAR ANUAL →
              </Button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-medium text-white/40">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#f6d35b]" /> Cancele quando quiser</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#f6d35b]" /> Acesso imediato</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#f6d35b]" /> Primeiro arcano gratuito</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ SEÇÃO 5 — FAQ ═══════════════ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="font-display text-4xl text-center mb-16 text-[#1f120d]">Perguntas Frequentes</h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          {[
            {
              q: "Para quem é esse app?",
              a: "Para quem quer aprender tarô com método, prática e progressão — sem depender de significados soltos."
            },
            {
              q: "Preciso saber algo sobre tarô para começar?",
              a: "Não. A jornada começa do zero, pelo Louco, e conduz você uma carta por vez."
            },
            {
              q: "Funciona no celular?",
              a: "Sim. O Tarô 78 Chaves funciona no celular, tablet e computador pelo navegador."
            },
            {
              q: "Como cancelo?",
              a: "Você pode cancelar pelo seu perfil dentro do app, quando quiser."
            }
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-[#1f120d]/5 bg-white rounded-2xl px-6 py-2 overflow-hidden shadow-sm">
              <AccordionTrigger className="font-heading text-sm text-left hover:no-underline tracking-wide font-bold text-[#1f120d]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#1f120d]/60 leading-relaxed pt-2">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ═══════════════ SEÇÃO 6 — CELULAR ═══════════════ */}
      <section className="py-24 px-6 bg-[#f6d35b]/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1f120d]/5">
              <span className="text-[10px] font-heading tracking-[0.2em] uppercase font-bold text-[#1f120d]">
                📱 FEITO PARA ESTUDAR NO CELULAR
              </span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl text-[#1f120d]">Estude onde estiver.</h2>
            <p className="text-lg text-[#1f120d]/60 leading-relaxed max-w-lg">
              O Tarô 78 Chaves foi pensado para aulas curtas, leitura confortável e progresso diário direto pelo navegador.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Aulas curtas", icon: BookOpen },
                { label: "Visual mobile", icon: Smartphone },
                { label: "Progresso salvo", icon: Layers }
              ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#1f120d]/5 shadow-sm space-y-3">
                  <card.icon className="w-5 h-5 text-[#4f7fc5]" />
                  <p className="text-xs font-heading font-bold tracking-widest uppercase">{card.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            {/* Visual simulation of phone */}
            <div className="relative w-[280px] h-[580px] bg-[#1f120d] rounded-[3.5rem] border-[10px] border-[#2a1a14] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#2a1a14] rounded-b-3xl z-10 flex items-center justify-center">
                <div className="w-10 h-1 bg-white/10 rounded-full" />
              </div>
              
              <div className="w-full h-full bg-[#fff8e6] flex flex-col">
                {/* Header App Area */}
                <div className="p-6 pt-12 flex justify-between items-center">
                  <div className="h-4 w-24 bg-[#1f120d]/5 rounded-full" />
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-orange-500/20" />
                    <div className="w-3 h-3 rounded-full bg-[#f6d35b]/20" />
                  </div>
                </div>

                {/* Content App Area */}
                <div className="px-6 flex-1 space-y-6">
                  <div className="aspect-[3/4] w-full bg-white rounded-2xl shadow-lg border border-white overflow-hidden transform rotate-[-1deg]">
                    <img src={imgLouco} alt="Louco Mobile" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-24 bg-[#4f7fc5]/10 rounded-full" />
                      <div className="h-5 w-16 bg-[#f6d35b]/10 rounded-full" />
                    </div>
                    <div className="h-8 w-4/5 bg-[#1f120d]/10 rounded-full" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full bg-[#1f120d]/5 rounded-full" />
                      <div className="h-3 w-5/6 bg-[#1f120d]/5 rounded-full" />
                    </div>
                  </div>

                  {/* Progress Sim */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-[#1f120d]/30 uppercase">
                      <span>Lição</span>
                      <span>85%</span>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#1f120d]/5">
                      <div className="h-full bg-[#f6d35b] w-[85%]" />
                    </div>
                  </div>
                </div>

                {/* Footer App Area */}
                <div className="p-6 bg-white border-t border-[#1f120d]/5 flex gap-2">
                  <div className="h-10 flex-1 bg-[#5a1028] rounded-xl flex items-center justify-center">
                    <div className="w-12 h-1 bg-white/20 rounded-full" />
                  </div>
                  <div className="h-10 w-12 bg-[#1f120d]/5 rounded-xl flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#f6d35b]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SEÇÃO 7 — CTA FINAL ═══════════════ */}
      <section className="py-32 px-6 text-center space-y-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f6d35b]/10 blur-[120px] rounded-full -z-10" />
        
        <h2 className="font-display text-4xl md:text-6xl text-[#1f120d] leading-tight">
          Sua jornada começa hoje.<br />
          Uma carta por vez.
        </h2>
        
        <div className="flex flex-col items-center gap-6">
          <Button 
            onClick={handleStart}
            className="px-12 py-8 text-sm md:text-base font-heading tracking-[0.2em] uppercase rounded-full bg-[#5a1028] hover:bg-[#7a1a38] text-white shadow-2xl shadow-[#5a1028]/20 transform transition-transform hover:scale-105 active:scale-95"
          >
            COMEÇAR PELO LOUCO — É GRÁTIS →
          </Button>
          <div className="flex items-center gap-3 text-[#1f120d]/40 text-sm">
            <span className="w-8 h-px bg-current" />
            <Zap className="w-4 h-4 text-[#f6d35b] fill-current" />
            <span className="w-8 h-px bg-current" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[#1f120d]/5 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 text-center">
          <div className="space-y-4">
            <h3 className="font-heading text-xl tracking-[0.4em] font-bold text-[#5a1028]">TARÔ 78 CHAVES</h3>
            <p className="text-xs font-heading tracking-[0.2em] text-[#1f120d]/40 uppercase font-bold">A jornada viva pelos 78 arcanos</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-heading tracking-[0.2em] uppercase font-bold text-[#1f120d]/60">
            <a href="/privacidade" className="hover:text-[#4f7fc5] transition-colors">Privacidade</a>
            <a href="/termos" className="hover:text-[#4f7fc5] transition-colors">Termos</a>
            <a href="/suporte" className="hover:text-[#4f7fc5] transition-colors">Suporte</a>
          </nav>

          <p className="text-[10px] text-[#1f120d]/30 font-medium">
            © {new Date().getFullYear()} Tarô 78 Chaves. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;