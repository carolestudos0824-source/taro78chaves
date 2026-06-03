import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Key, UserPlus, LogIn, MessageCircle, Sparkles, Zap, Layers, Menu, X, Eye, 
  Award, Smartphone, Share, MoreVertical, HelpCircle, ChevronRight, 
  BookOpen, Star, Target, Check
} from "lucide-react";
import { businessInfo } from "@/config/business";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trackEvent, appendUTMsToUrl } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgMago from "@/assets/arcano-1-mago.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgImperatriz from "@/assets/arcano-3-imperatriz.jpg";
import imgImperador from "@/assets/arcano-4-imperador.jpg";
import imgHierofante from "@/assets/arcano-5-hierofante.jpg";
import imgEnamorados from "@/assets/arcano-6-enamorados.jpg";
import imgMundo from "@/assets/arcano-21-mundo.jpg";
import { ArcanaPresenceHero } from "@/components/ArcanaPresenceHero";
import brandIcon from "@/assets/brand-icon.png";
import brandLogo from "@/assets/brand-logo.png";
import { PWAInstructions } from "@/components/landing/PWAInstructions";

import { checkoutUrl } from "@/config/checkout";
import { Helmet } from "react-helmet-async";
import { isWebCheckoutAllowed } from "@/lib/platform";

const LandingPage = ({ isSalesPage = false }: { isSalesPage?: boolean }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check for audit parameter in URL
    const isAuditUrl = new URLSearchParams(window.location.search).get('audit') === 'true';
    if (isAuditUrl) {
      localStorage.setItem("taro_analytics_consent", "true");
    }
  }, []);
  
  const handleStart = (ctaType: string = "general", label: string = "Acessar o programa") => {

    trackEvent(`landing_cta_${ctaType}_start_click`, {
      cta_text: label,
      source: isSalesPage ? "sales_page" : "landing",
      page_path: window.location.pathname,
      page_location: window.location.href
    });

    if (checkoutUrl) {
      trackEvent("click_checkout", { source: isSalesPage ? "sales_page" : "landing" });
      window.location.href = appendUTMsToUrl(checkoutUrl);
      return;
    }

    const dest = user ? "/app" : "/auth";
    navigate(appendUTMsToUrl(dest));
  };

  const handleSubscribe = (plan: "monthly" | "annual") => {
    trackEvent(`landing_checkout_${plan}_click`, {
      plan,
      source: "landing",
      page_path: window.location.pathname
    });

    if (checkoutUrl) {
      trackEvent("click_checkout", { plan, source: "landing" });
      window.location.href = appendUTMsToUrl(checkoutUrl);
      return;
    }

    if (user) navigate(appendUTMsToUrl("/premium"));
    else navigate(appendUTMsToUrl(`/auth?redirect=/premium&plan=${plan}`));
  };

  return (
    <div className="min-h-screen bg-parchment text-midnight selection:bg-secondary selection:text-white relative w-full overflow-x-hidden max-w-[100vw]">
      {isSalesPage && (
        <Helmet>
          <title>Tarô 78 Chaves | Escola Digital de Tarô</title>
          <meta name="description" content="Aprenda Tarô com profundidade, simbologia e prática em uma escola digital guiada pelos 78 arcanos. Estude no seu ritmo e desenvolva sua leitura com consciência." />
          <link rel="canonical" href="https://www.taro78chaves.com.br/venda" />
        </Helmet>
      )}
      {!isSalesPage && (
        <Helmet>
          <title>Tarô 78 Chaves | A jornada viva pelos 78 arcanos</title>
          <meta name="description" content="Aprenda Tarô com uma jornada guiada pelos 78 arcanos, baseada no Rider-Waite-Smith, com lições, progresso salvo e experiências dos Arcanos Vivos." />
          <link rel="canonical" href="https://www.taro78chaves.com.br" />
        </Helmet>
      )}

      {/* ─── Top Brand Header ─── */}
      <header className="sticky top-0 z-50 px-6 py-4 md:py-4 bg-parchment/95 backdrop-blur-md border-b border-gold/10 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]" aria-label="Tarô 78 Chaves">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <img 
                src={brandIcon} 
                alt="Logo Tarô 78 Chaves" 
                className="w-full h-full object-contain filter drop-shadow-sm" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl tracking-tight text-plum font-bold leading-none">
                Tarô 78 Chaves
              </span>
              <span className="font-heading text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-plum font-bold mt-1">
                A jornada viva
              </span>
            </div>
          </Link>
          <button
            onClick={() => {
              trackEvent("landing_login_click", { source: "landing" });
              if (user) navigate("/app");
              else navigate("/auth?mode=login");
            }}
            className="inline-flex items-center font-heading text-xs tracking-[0.2em] uppercase text-plum hover:text-gold-dark transition-all hover:translate-x-1 font-bold"
          >
            Entrar →
          </button>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-2 pb-6 md:pt-4 md:pb-2 px-6 overflow-hidden flex flex-col items-center min-h-fit mt-0">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gold/15 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-plum/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--brand-gold)) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
            
            <div className="text-center lg:text-left space-y-3 md:space-y-4 order-1 lg:order-1">
              {/* Symbolic Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-1.5 rounded-full bg-plum/5 border border-gold/30 shadow-sm animate-fade-in mb-1 md:mb-1">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-dark" />
                <span className="text-[9px] md:text-[11px] font-heading tracking-[0.2em] md:tracking-[0.25em] uppercase font-bold text-plum">
                  A jornada viva dos 78 arcanos
                </span>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl leading-[1.05] md:leading-[1] tracking-tight text-plum normal-case font-black">
                  Domine o Tarô <br className="hidden md:block" /> em uma Escola Digital
                </h1>
                
                <div className="space-y-2 md:space-y-3">
                  <p className="font-heading text-xl md:text-2xl text-plum font-extrabold leading-tight">
                    Você quer aprender Tarô, mas ainda trava na hora de interpretar as cartas?
                  </p>
                  <p className="font-body text-lg md:text-xl text-plum/90 leading-relaxed font-medium">
                    No Tarô 78 Chaves, você percorre cada arcano com método, lições curtas e progressão real.
                  </p>
                  <p className="font-body text-base md:text-lg text-plum/80 leading-relaxed">
                    Aprenda Tarô do zero, carta por carta, em uma jornada guiada com lições curtas, exercícios, quizzes, progresso salvo e prática diária.
                  </p>
                </div>

                <p className="font-accent text-sm md:text-base text-gold-dark font-bold italic border-l-4 border-gold/40 pl-5 py-1.5 bg-gold/5 rounded-r-xl">
                  “No Tarô 78 Chaves, o aprendizado vira ritual e a imagem vira presença.”
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-6 pt-0 md:pt-1 font-heading text-[9px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase text-plum font-extrabold drop-shadow-sm">
                  <div className="flex items-center gap-1.5 group">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-plum/10 flex items-center justify-center group-hover:bg-plum/20 transition-colors border border-gold/20">
                      <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-gold-dark" />
                    </div>
                    <span>Quizzes de Conhecimento</span>
                  </div>
                  <div className="flex items-center gap-1.5 group">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-plum/10 flex items-center justify-center group-hover:bg-plum/20 transition-colors border border-gold/20">
                      <Layers className="w-2.5 h-2.5 md:w-3 md:h-3 text-gold-dark" />
                    </div>
                    <span>Progresso salvo</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-1 pt-0 w-full">
                <Button 
                  onClick={() => handleStart("hero", "COMEÇAR MINHA JORNADA")}
                  className="w-full sm:w-auto min-h-[64px] md:min-h-[72px] px-4 md:px-14 rounded-2xl bg-plum hover:bg-plum/90 text-ivory font-heading text-lg md:text-lg tracking-[0.1em] md:tracking-[0.25em] uppercase border-none shadow-[0_20px_50px_-15px_rgba(91,31,61,0.7)] transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 md:gap-4 group/btn whitespace-normal text-center leading-tight"
                >
                  <Key className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:rotate-12 transition-transform text-gold shrink-0" />
                  <span>COMEÇAR MINHA JORNADA</span>
                </Button>
                <div className="flex flex-col items-center lg:items-start gap-0.5 mt-1 md:mt-1">
                  {isWebCheckoutAllowed() && (
                    <>
                      <p className="text-[11px] md:text-base font-heading tracking-[0.1em] text-plum/80 font-bold uppercase">
                        ✦ Assinatura mensal por apenas R$27/mês.
                      </p>
                      <p className="text-[10px] md:text-xs font-body text-plum/50 italic">
                        Cancele quando quiser. Acesso imediato.
                      </p>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => {
                    trackEvent("landing_how_it_works_click", {
                      source: "landing",
                      page_path: window.location.pathname
                    });
                    const element = document.getElementById('como-funciona');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.hash = "#como-funciona";
                    }
                  }} 
                  className="group inline-flex items-center gap-2 text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase text-plum hover:text-gold-dark underline underline-offset-4 transition-all font-extrabold cursor-pointer p-2 mt-2 md:mt-0"
                >
                  Ver como funciona
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end order-2 lg:order-2 mt-4 md:mt-0">
              <ArcanaPresenceHero 
                mainCard={imgLouco}
                backCardLeft={imgMago}
                backCardRight={imgMundo}
                mainCardAlt="O Louco - Início da Jornada"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pain Section ─── */}
      <section className="pt-2 pb-8 md:pt-4 md:pb-10 px-6 bg-[#FAF5EF]">

        <div className="max-w-3xl mx-auto relative">
          <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 opacity-10 pointer-events-none">
            <Key className="w-20 h-20 md:w-32 md:h-32 text-gold-dark rotate-[-15deg]" />
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gold/10 p-6 md:p-10 rounded-[3rem] text-center space-y-6 shadow-sm relative z-10">
            <h2 className="font-heading text-3xl md:text-4xl text-midnight leading-tight">
              Você já tentou aprender tarô e ficou <span className="italic text-[#5B1F3D]">mais confusa?</span>
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="text-lg font-body text-midnight/70 leading-relaxed">
                Vídeos soltos, listas de palavras-chave e significados decorados até ajudam no começo. Mas na hora de fazer uma leitura real, os símbolos não conversam.
              </p>
              <div className="pt-4 border-t border-gold/10">
                <p className="text-xl font-heading text-[#5B1F3D] tracking-wide leading-snug">
                  O problema não é sua intuição.<br className="hidden md:block" />
                  <span className="font-bold">É a falta de uma plataforma estruturada.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Journey Map Section ─── */}
      <section id="como-funciona" className="py-20 md:py-24 bg-white/30 border-y border-gold/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gold/10 -translate-y-1/2 z-0" />
        
        <div className="max-w-7xl mx-auto px-0 md:px-6 relative z-10">
          <div className="text-center mb-16 px-6 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl text-midnight">Explore a Trilha do Conhecimento</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body">Aprenda Tarô como uma jornada — arcano por arcano, com lições curtas, quizzes e progresso real.</p>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 px-6 md:px-8 scrollbar-elegant snap-x snap-mandatory items-end min-h-[340px] justify-start">
              {[
                { id: 0, img: imgLouco, name: "O Louco", badge: "Início" },
                { id: 1, img: imgMago, name: "O Mago", badge: "Desbloqueável" },
                { id: 2, img: imgSacerdotisa, name: "A Sacerdotisa", badge: "Premium" },
                { id: 3, img: imgImperatriz, name: "A Imperatriz", badge: "Premium" },
                { id: 4, img: imgImperador, name: "O Imperador", badge: "Premium" },
                { id: 5, img: imgHierofante, name: "O Hierofante", badge: "Premium" },
                { id: 6, img: imgEnamorados, name: "Os Enamorados", badge: "Premium" },
              ].map((card, i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3 snap-start group">
                  <div className="relative">
                    <div className="w-32 h-52 md:w-40 md:h-60 rounded-2xl overflow-hidden shadow-xl border-4 border-white transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:border-gold/20">
                      <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[8px] font-heading tracking-widest uppercase shadow-lg z-20 ${ card.badge === "Início" ? "bg-plum text-white" : "bg-gold text-white" }`}>
                        {card.badge}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] md:text-xs font-heading tracking-[0.1em] uppercase text-plum font-bold block truncate w-full px-1">
                      {card.name.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex-shrink-0 w-20 flex items-center justify-center h-52 md:h-60 opacity-20">
                 <span className="font-heading text-4xl tracking-tighter">...</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-8">
            <p className="text-sm font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Inicie pelo Louco e percorra uma jornada interativa pelos 78 arcanos, com aulas objetivas, quizzes dinâmicos e seu progresso salvo em tempo real.
            </p>
            <Button 
              onClick={() => handleStart("journey", "COMEÇAR MINHA JORNADA")} 
              variant="outline"
              className="w-full sm:w-auto px-6 md:px-10 py-6 rounded-full border-gold/30 text-gold-dark hover:bg-gold/5 font-heading tracking-normal md:tracking-widest text-[11px] uppercase transition-all shadow-sm whitespace-normal text-center h-auto min-h-[56px]"
            >
              COMEÇAR MINHA JORNADA →
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Journey Unlock Section ─── */}
      <section className="py-24 px-6 bg-[#FAF5EF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl text-midnight italic">O que está incluído na Escola Digital Tarô 78 Chaves</h2>
            <p className="text-muted-foreground max-w-lg mx-auto font-body text-balance">Estude os 78 arcanos com uma trilha progressiva, fiel ao Rider-Waite-Smith e pensada para criar prática, continuidade e domínio simbólico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#5B1F3D]/5 rounded-2xl flex items-center justify-center">
                <Key className="w-6 h-6 text-[#5B1F3D]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">O Caminho do Aprendiz</h3>
              <p className="text-sm text-midnight/70 font-body">Aprenda a ler cada arcano de forma fluida, sem decorar tabelas de significados ou palavras-chave soltas.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#C8A66A]/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#C8A66A]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">Método Arcano Vivo</h3>
              <p className="text-sm text-midnight/70 font-body">Uma metodologia que conecta a simbologia clássica do Rider-Waite-Smith com aplicação prática no seu dia a dia.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#5B1F3D]/5 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#5B1F3D]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">Progresso salvo e jornada guiada</h3>
              <p className="text-sm text-midnight/70 font-body">Acompanhe sua evolução, conclua lições e avance pela jornada dos 78 arcanos no seu ritmo.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#C8A66A]/10 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#C8A66A]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">78 cartas, uma por uma</h3>
              <p className="text-sm text-midnight/70 font-body">Uma jornada guiada por Arcanos Maiores, Menores e Corte no seu ritmo, desbloqueando conhecimento conforme evolui.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#5B1F3D]/5 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#5B1F3D]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">Lições que ensinam a olhar</h3>
              <p className="text-sm text-midnight/70 font-body">Cada arcano traz essência, símbolos, luz e sombra aplicados ao amor, trabalho e vida prática com clareza.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-[#C8A66A]/10 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-[#C8A66A]" />
              </div>
              <h3 className="font-heading text-xl text-midnight">Ganhe Confiança Real</h3>
              <p className="text-sm text-midnight/70 font-body">Aprenda a lógica por trás de cada arcano para que a interpretação flua com mais naturalidade, clareza e autoridade.</p>
            </div>
          </div>

          <div className="text-center space-y-8">
            <p className="text-lg font-body text-midnight/80 italic">
              Garanta seu acesso e percorra os 78 arcanos agora.
            </p>
            <Button 
              onClick={() => handleStart("unlock", "COMEÇAR MINHA JORNADA")} 
              variant="outline"
              className="w-full sm:w-auto px-6 md:px-10 py-6 rounded-full border-gold/30 text-gold-dark hover:bg-gold/5 font-heading tracking-normal md:tracking-widest text-[11px] uppercase transition-all whitespace-normal text-center h-auto min-h-[56px]"
            >
              COMEÇAR MINHA JORNADA →
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Institutional Block ─── */}
      <section className="py-20 px-6 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl md:text-4xl text-plum">Quem está por trás do Tarô 78 Chaves</h2>
              <p className="text-lg font-body text-midnight/80 leading-relaxed">
                O Tarô 78 Chaves é uma escola digital da Lua de Kaya, criada para ensinar Tarô com profundidade, simbologia e aplicação prática.
              </p>
              <p className="text-lg font-body text-midnight/80 leading-relaxed">
                A jornada foi estruturada para conduzir a aluna arcano por arcano, com lições guiadas, quizzes, progresso salvo e uma metodologia pensada para transformar estudo em prática real.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-plum/5 border-2 border-gold/20 flex items-center justify-center p-8">
                <img src={brandLogo} alt="Lua de Kaya - Tarô 78 Chaves" className="w-full h-full object-contain opacity-80" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      {isWebCheckoutAllowed() && (
        <section className="py-20 md:py-32 px-4 md:px-6 bg-[#5B1F3D] text-parchment relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/5 blur-[150px] rounded-full" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl md:text-5xl text-[#FAF5EF]">Assine a Escola Digital Tarô 78 Chaves</h2>
            <p className="text-[#D8CFC2] font-body text-lg max-w-2xl mx-auto">Percorra a jornada completa pelos 78 arcanos e desenvolva sua leitura com profundidade e consciência.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Monthly Subscription Plan */}
            <div className="p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] bg-white text-midnight shadow-2xl border-2 md:border-4 border-gold relative flex flex-col text-left space-y-6 md:space-y-8 animate-fade-in w-full mx-auto">
              <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-gold px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-heading font-black tracking-[0.1em] md:tracking-[0.2em] text-white shadow-[0_10px_30px_-5px_rgba(200,166,106,0.5)] whitespace-nowrap border border-white/20">
                ✦ OFERTA EXCLUSIVA
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <h3 className="font-heading text-xl md:text-3xl text-plum font-black uppercase tracking-tight md:tracking-widest leading-tight">
                  Assinatura Mensal • Escola Digital
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm md:xl text-plum font-heading uppercase tracking-widest font-black">Por apenas</span>
                      <span className="text-5xl sm:text-7xl md:text-9xl font-heading text-midnight leading-none tracking-tighter">R$27</span>
                      <span className="text-sm md:text-2xl text-midnight/40 font-heading font-bold uppercase tracking-widest">/mês</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-3">
                    <p className="text-lg md:text-xl font-bold text-plum tracking-tight flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-plum/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-gold-dark" />
                      </div>
                      Acesso completo enquanto a assinatura estiver ativa
                    </p>
                    <p className="text-lg md:text-xl font-bold text-plum tracking-tight flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-plum/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-gold-dark" />
                      </div>
                      Cancele quando quiser pelo seu perfil
                    </p>
                    <p className="text-base md:text-lg font-bold text-gold-dark italic ml-9 bg-gold/5 px-4 py-1 rounded-lg inline-block">
                      Pagamento seguro via Stripe
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-gold/10">
                <p className="text-sm md:text-base text-midnight/80 font-body leading-relaxed">
                  Acesse a jornada completa pelos 78 arcanos, com aulas organizadas, quizzes, progresso salvo e área de membros para estudar no seu ritmo.
                </p>

                <div className="space-y-4">
                  {[
                    "Aprenda a interpretar as cartas com mais segurança, sem depender apenas de listas de palavras-chave",
                    "Quizzes, exercícios e progresso salvo",
                    "Estude no seu ritmo, pelo celular, tablet ou computador",
                    "Acesse online e salve a Escola Digital na tela inicial do celular, como um aplicativo",
                    "Acesse a jornada completa pelos 78 arcanos: Maiores, Menores e Corte",
                    "Tenha uma área de estudos individual com progresso salvo",
                    "Receba certificado digital de conclusão ao finalizar a jornada"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3.5 h-3.5 text-gold-dark" />
                      </div>
                      <span className="text-base md:text-lg text-midnight/80 font-bold leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 space-y-8">
                <div className="bg-plum/[0.03] border-2 border-gold/20 p-5 md:p-8 rounded-2xl md:rounded-[2rem] space-y-3 md:space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 md:gap-3 text-plum">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-gold-dark" />
                    </div>
                    <span className="font-heading text-base md:text-xl font-black uppercase tracking-tight md:tracking-widest">Garantia de 7 dias</span>
                  </div>
                  <p className="text-base font-body text-midnight/80 leading-relaxed font-medium">
                    Você pode acessar a Escola Digital Tarô 78 Chaves com tranquilidade. Se dentro de 7 dias corridos após a primeira cobrança você entender que o programa não é para você, poderá solicitar o reembolso integral.
                  </p>
                  <p className="text-sm font-black text-plum uppercase tracking-[0.2em] border-t border-gold/10 pt-4">✦ Sem risco para começar.</p>
                </div>

                <Button 
                  onClick={() => handleSubscribe("monthly")} 
                  className="w-full h-auto min-h-[64px] md:h-20 py-4 bg-plum hover:bg-plum/90 text-ivory rounded-full text-sm md:text-xl shadow-[0_15px_35px_-10px_rgba(91,31,61,0.5)] hover:scale-[1.02] transition-all font-heading tracking-tight md:tracking-widest font-black uppercase flex items-center justify-center gap-2 md:gap-3 px-4 whitespace-normal text-center"
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-gold animate-pulse shrink-0" />
                  <span>COMEÇAR MINHA JORNADA</span>
                </Button>
                
                <div className="space-y-2 text-center">
                  <p className="text-[10px] md:text-xs text-midnight/40 font-body uppercase tracking-[0.2em] font-bold">
                    Pagamento processado via Stripe. Acesso liberado automaticamente após a confirmação da compra.
                  </p>
                  <p className="text-[10px] md:text-xs text-midnight/40 font-body uppercase tracking-[0.2em] font-bold">
                    Certificado digital emitido pelo Tarô 78 Chaves com código de validação.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gold/10 text-center">
                <p className="text-[11px] md:text-xs text-plum font-bold font-body leading-relaxed max-w-[280px] mx-auto italic">
                  “O acesso à jornada completa é liberado imediatamente após a confirmação do pagamento.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      <PWAInstructions />

      {/* ─── FAQ Section ─── */}
      <section className="py-24 md:py-32 px-6 bg-white/20">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <HelpCircle className="w-12 h-12 text-gold mx-auto mb-4" />
             <h2 className="font-heading text-4xl md:text-5xl text-midnight">Dúvidas Frequentes</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-access" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Como meu acesso é liberado?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                O acesso é liberado imediatamente após a confirmação da assinatura. Você receberá os detalhes em seu e-mail cadastrado e poderá cancelar a qualquer momento.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-1" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Por onde eu começo?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                Você começa pela Chave 1: O Louco. A Escola Digital guia sua jornada passo a passo, com lições curtas, quizzes e progresso salvo para quem possui o programa completo.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">O que são as 78 Chaves?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                As 78 Chaves representam os 78 arcanos do tarô. Cada arcano estudado e concluído se torna uma chave conquistada na sua jornada.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Preciso saber tarô antes?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                Não. O Tarô 78 Chaves foi criado para conduzir iniciantes desde a base, com uma jornada progressiva e organizada.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">A Escola Digital usa qual baralho?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                O estudo é baseado no Rider-Waite-Smith, referência clássica para o aprendizado simbólico do tarô.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">O que está incluso?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                Lições guiadas, quizzes, progresso por Chaves, trilhas de estudo, Arcanos Maiores, Arcanos Menores, práticas e conteúdos progressivos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Tarô é profissão regulamentada?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                No Brasil, a leitura de oráculos pode ser reconhecida como ocupação, mas não exige diploma obrigatório nem conselho profissional. A diferença está no método, na ética e na qualidade do atendimento.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Tem certificado?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                Sim. Ao concluir a jornada obrigatória da Escola Digital Tarô 78 Chaves, você poderá emitir seu certificado digital de conclusão dentro da plataforma. O certificado é emitido pelo Tarô 78 Chaves e se refere à conclusão de curso livre/formação livre.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">O app salva meu progresso?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                Sim. Seu progresso fica salvo para você continuar a jornada dos 78 arcanos no seu ritmo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Posso cancelar?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                Se houver assinatura ativa, o gerenciamento e cancelamento podem ser feitos diretamente em seu perfil na plataforma.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Tenho suporte?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                Sim. Para dúvidas de acesso, pagamento, conta ou suporte pedagógico, acesse nossa <Link to="/suporte" className="underline font-bold text-[#5B1F3D]">Central de Suporte</Link> ou entre em contato pelo e-mail {businessInfo.supportEmail}.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-11" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Como eu acesso a Escola Digital?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                A Escola Digital Tarô 78 Chaves é online. Você acessa pelo navegador (Chrome, Safari ou direto no app se instalado) e pode salvar o ícone na tela inicial do seu celular para abrir como um aplicativo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12" className="border-gold/30 bg-white/40 rounded-2xl overflow-hidden px-2">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-black text-plum py-6 md:text-xl">Como salvo na tela inicial do celular?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 p-4 pt-0 leading-relaxed md:text-base">
                <p className="mb-2"><strong>No Android:</strong> abra pelo Chrome, toque nos três pontinhos e escolha “Adicionar à tela inicial” ou “Instalar app”.</p>
                <p><strong>No iPhone:</strong> abra pelo Safari, toque no botão de compartilhar e escolha “Adicionar à Tela de Início”.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 md:py-12 px-6 text-center space-y-10 bg-plum text-ivory border-t-4 border-gold/30 relative overflow-hidden">
        {/* Subtle background ornament */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--brand-gold)) 1px, transparent 0)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="space-y-6 flex flex-col items-center relative z-10">
          <div className="flex items-center gap-3.5 group">
            <div className="w-14 h-14 flex items-center justify-center p-1 bg-ivory/10 rounded-xl backdrop-blur-sm border border-gold/20 group-hover:scale-110 transition-transform duration-500">
              <img 
                src={brandIcon} 
                alt="Logo Tarô 78 Chaves" 
                className="w-full h-full object-contain filter drop-shadow-lg" 
              />
            </div>
            <div className="text-left">
              <span className="font-heading text-2xl tracking-tight text-gold font-bold block leading-none drop-shadow-sm">
                Tarô 78 Chaves
              </span>
              <span className="font-heading text-[11px] tracking-[0.3em] uppercase text-gold font-bold mt-1.5 block opacity-80">
                A jornada viva
              </span>
            </div>
          </div>
          <p className="font-heading text-xl md:text-2xl text-ivory italic max-w-md drop-shadow-sm opacity-90">
            "No Tarô 78 Chaves, o Tarô deixa de ser imagem e se torna presença."
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[13px] md:text-[14px] font-heading tracking-[0.25em] uppercase relative z-10 px-4">
          <Link to="/privacidade" onClick={() => trackEvent("landing_legal_link_click", { link_name: "privacidade", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Privacidade</Link>
          <Link to="/termos" onClick={() => trackEvent("landing_legal_link_click", { link_name: "termos", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Termos</Link>
          <Link to="/suporte" onClick={() => trackEvent("landing_legal_link_click", { link_name: "suporte", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Suporte</Link>
          <Link to="/excluir-conta" onClick={() => trackEvent("landing_legal_link_click", { link_name: "excluir_conta", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Excluir conta</Link>
        </nav>

        <div className="pt-8 border-t border-gold/10 max-w-sm mx-auto relative z-10">
          <p className="text-[11px] text-ivory/70 font-body tracking-wider font-medium space-y-1">
            <span className="block">© 2026 Tarô 78 Chaves</span>
            <span className="block">Uma escola digital da Lua de Kaya</span>
            <span className="block font-bold">CNPJ 44.472.530/0001-08</span>
            <span className="block">Todos os direitos reservados.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
