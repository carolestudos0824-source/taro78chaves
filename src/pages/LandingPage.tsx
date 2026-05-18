import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, Star, Target, 
  BookOpen, Layers, Zap,
  Menu, X, Eye, Key, Sparkles,
  Award, Smartphone, Share, MoreVertical, HelpCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
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

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInstallable, handleInstallClick } = useInstallPrompt();
  const [showInstallModal, setShowInstallModal] = useState(false);
  
  const handleStart = (ctaType: string = "general", label: string = "Começar pelo Louco — Grátis") => {
    trackEvent(`landing_cta_${ctaType}_start_click`, {
      cta_text: label,
      source: "landing",
      page_path: window.location.pathname,
      page_location: window.location.href
    });
    const dest = user ? "/app" : "/auth";
    navigate(appendUTMsToUrl(dest));
  };

  const onInstallClick = async () => {
    trackEvent("landing_pwa_install_click", {
      source: "landing",
      page_path: window.location.pathname
    });
    if (isInstallable) {
      const result = await handleInstallClick();
      if (!result) {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleSubscribe = (plan: "monthly" | "annual") => {
    trackEvent(`landing_checkout_${plan}_click`, {
      plan,
      source: "landing",
      page_path: window.location.pathname
    });
    if (user) navigate(appendUTMsToUrl("/premium"));
    else navigate(appendUTMsToUrl(`/auth?redirect=/premium&plan=${plan}`));
  };

  return (
    <div className="min-h-screen bg-parchment text-midnight selection:bg-secondary selection:text-white relative w-full overflow-x-hidden">

      {/* ─── Top Brand Header ─── */}
      <header className="sticky top-0 z-50 px-6 py-4 md:py-6 bg-parchment/95 backdrop-blur-md border-b border-gold/10 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]" aria-label="Tarô 78 Chaves">
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
          </a>
          <button
            onClick={() => {
              trackEvent("landing_login_click", { source: "landing" });
              handleStart("header", "Entrar");
            }}
            className="inline-flex items-center font-heading text-xs tracking-[0.2em] uppercase text-plum hover:text-gold-dark transition-all hover:translate-x-1 font-bold"
          >
            Entrar →
          </button>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-12 pb-12 md:pt-32 md:pb-24 px-6 overflow-hidden flex flex-col items-center min-h-fit mt-0">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gold/15 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-plum/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--brand-gold)) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            
            <div className="text-center lg:text-left space-y-4 md:space-y-5 order-1 lg:order-1">
              {/* Symbolic Badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-plum/5 border border-gold/30 shadow-sm animate-fade-in mb-4">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                <span className="text-[10px] md:text-[11px] font-heading tracking-[0.25em] uppercase font-bold text-plum">
                  A jornada viva dos 78 arcanos
                </span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl leading-[1.05] tracking-tight text-plum normal-case">
                  No app Tarô 78 Chaves, o tarô deixa de ser imagem e se torna <span className="italic">presença.</span>
                </h1>
                
                <p className="font-accent text-xl md:text-2xl lg:text-3xl text-plum/90 font-bold italic leading-relaxed">
                  Aprenda Tarô através de uma travessia real: lições vivas, quizzes e progresso guiado.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 pt-3 md:pt-4 font-heading text-[10px] md:text-xs tracking-[0.2em] uppercase text-plum font-extrabold drop-shadow-sm">
                  <div className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-full bg-plum/10 flex items-center justify-center group-hover:bg-plum/20 transition-colors border border-gold/20">
                      <Zap className="w-3 h-3 text-gold-dark" />
                    </div>
                    <span>Quizzes e Pontos de Jornada</span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-full bg-plum/10 flex items-center justify-center group-hover:bg-plum/20 transition-colors border border-gold/20">
                      <Layers className="w-3 h-3 text-gold-dark" />
                    </div>
                    <span>Progresso salvo</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-2 pt-1 md:pt-2">
                <Button 
                  onClick={() => handleStart("hero")}
                  className="w-full sm:w-auto min-h-[56px] md:min-h-[64px] px-8 md:px-10 rounded-2xl bg-plum hover:bg-plum/90 text-ivory font-heading text-sm md:text-base tracking-[0.25em] uppercase border-none shadow-[0_15px_40px_-10px_rgba(91,31,61,0.6)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group/btn"
                >
                  <Key className="w-5 h-5 group-hover/btn:rotate-12 transition-transform text-gold" />
                  COMEÇAR PELO LOUCO — GRÁTIS
                </Button>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <p className="text-sm md:text-base font-heading tracking-[0.1em] text-plum font-extrabold uppercase drop-shadow-sm">
                    ✦ Sem cartão de crédito para começar.
                  </p>
                  <p className="text-[11px] md:text-xs font-body text-plum/60 italic font-bold">
                    Leva menos de 1 minuto.
                  </p>
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
                  className="group inline-flex items-center gap-2 text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase text-plum hover:text-gold-dark underline underline-offset-4 transition-all font-extrabold cursor-pointer p-2"
                >
                  Ver como funciona
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end order-2 lg:order-2">
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
      <section className="py-16 md:py-20 px-6 bg-[#FAF5EF]">

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 opacity-10 pointer-events-none">
            <Key className="w-20 h-20 md:w-32 md:h-32 text-gold-dark rotate-[-15deg]" />
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-gold/10 p-10 md:p-14 rounded-[3rem] text-center space-y-6 shadow-sm relative z-10">
            <h2 className="font-heading text-3xl md:text-4xl text-midnight leading-tight">
              Você já tentou aprender tarô e ficou <span className="italic text-[#5B1F3D]">mais confusa?</span>
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="text-lg font-body text-midnight/70 leading-relaxed">
                Vídeos soltos, listas de palavras-chave e significados decorados até ajudam no começo. Mas na hora de fazer uma leitura real, tudo parece escapar.
              </p>
              <div className="pt-4 border-t border-gold/10">
                <p className="text-xl font-heading text-[#5B1F3D] tracking-wide">
                  O problema não é falta de intuição.<br className="hidden md:block" />
                  <span className="font-bold">É falta de método.</span>
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
            <p className="text-muted-foreground max-w-2xl mx-auto font-body">Aprenda Tarô como uma jornada — arcano por arcano, com lições curtas, quizzes, Pontos de Jornada e progresso real.</p>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 px-6 md:px-8 scrollbar-elegant snap-x items-end min-h-[340px] justify-start md:justify-center">
              {[
                { id: 0, img: imgLouco, name: "O Louco", badge: "Grátis" },
                { id: 1, img: imgMago, name: "O Mago", badge: "Desbloqueável" },
                { id: 2, img: imgSacerdotisa, name: "A Sacerdotisa", badge: "Premium" },
                { id: 3, img: imgImperatriz, name: "A Imperatriz", badge: "Premium" },
                { id: 4, img: imgImperador, name: "O Imperador", badge: "Premium" },
                { id: 5, img: imgHierofante, name: "O Hierofante", badge: "Premium" },
                { id: 6, img: imgEnamorados, name: "Os Enamorados", badge: "Premium" },
              ].map((card, i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3 snap-center group">
                  <div className="relative">
                    <div className="w-32 h-52 md:w-40 md:h-60 rounded-2xl overflow-hidden shadow-xl border-4 border-white transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:border-gold/20">
                      <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[8px] font-heading tracking-widest uppercase shadow-lg z-20 ${ card.badge === "Grátis" ? "bg-success text-white" : "bg-gold text-white" }`}>
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
              Comece pelo Louco grátis. Vá bem na lição e <span className="text-plum font-bold">desbloqueie O Mago</span>. Depois, continue sua jornada completa pelos 78 arcanos.
            </p>
            <Button 
              onClick={() => handleStart("journey")} 
              variant="outline"
              className="px-10 py-6 rounded-full border-gold/30 text-gold-dark hover:bg-gold/5 font-heading tracking-widest text-[11px] uppercase transition-all shadow-sm"
            >
              COMEÇAR PELO LOUCO — GRÁTIS →
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Journey Unlock Section ─── */}
      <section className="py-24 px-6 bg-[#FAF5EF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl text-midnight italic">O que você desbloqueia na Jornada Completa</h2>
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
              <h3 className="font-heading text-xl text-midnight">Prática e Progressão</h3>
              <p className="text-sm text-midnight/70 font-body">Você avança com quizzes, exercícios reais e trilhas salvas na sua jornada — da primeira carta à primeira leitura.</p>
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
              Depois de experimentar o método, continue sua jornada pelos 78 arcanos.
            </p>
            <Button 
              onClick={() => handleStart("unlock")} 
              variant="outline"
              className="px-10 py-6 rounded-full border-gold/30 text-gold-dark hover:bg-gold/5 font-heading tracking-widest text-[11px] uppercase transition-all"
            >
              COMEÇAR PELO LOUCO — GRÁTIS →
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section className="py-32 px-6 bg-[#5B1F3D] text-parchment relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/5 blur-[150px] rounded-full" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl md:text-5xl text-[#FAF5EF]">Desbloqueie a Jornada Completa</h2>
            <p className="text-[#D8CFC2] font-body text-lg">Escolha o plano ideal para continuar estudando no seu ritmo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Monthly */}
            <div className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 flex flex-col text-left space-y-8 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="space-y-2">
                <h3 className="t-section-title text-[#5B1F3D] font-bold uppercase tracking-widest">Plano Mensal</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-heading text-[#FAF5EF]">R$29,90</span>
                  <span className="text-sm text-[#D8CFC2]">/mês</span>
                </div>
              </div>
              <p className="text-sm text-[#D8CFC2] flex-1 font-body leading-relaxed">Ideal para quem quer testar no seu próprio tempo, com liberdade para cancelar a qualquer momento.</p>
              <Button 
                onClick={() => handleSubscribe("monthly")} 
                className="w-full py-7 rounded-full border border-gold/40 text-[#FAF5EF] bg-transparent hover:bg-gold/10 hover:border-gold font-heading tracking-[0.2em] text-[11px] uppercase transition-all shadow-lg"
              >
                ASSINAR MENSAL
              </Button>
            </div>

            {/* Annual */}
            <div className="p-10 rounded-[3rem] bg-white text-midnight shadow-2xl scale-105 border-4 border-gold relative flex flex-col text-left space-y-8">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold px-6 py-2 rounded-full text-[10px] font-heading font-black tracking-widest text-white shadow-xl">
                ✦ MELHOR VALOR
              </div>
              <div className="space-y-2">
                <h3 className="t-section-title text-plum font-black uppercase tracking-widest">Acesso Anual</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-heading text-midnight">R$197</span>
                  <span className="text-sm text-midnight/40">/pagamento único</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#5B1F3D] tracking-tight">
                    12 meses de acesso • Sem renovação automática
                  </p>
                  <p className="text-[12px] font-bold text-[#5B1F3D]">Economia de 45% em relação ao mensal.</p>
                </div>
              </div>
              <p className="text-sm text-midnight/80 flex-1 font-body leading-relaxed">Acesso total à jornada completa pelos 78 arcanos por um ano inteiro, com estudo guiado, quizzes e progresso salvo.</p>
              <Button onClick={() => handleSubscribe("annual")} className="btn-premium w-full py-8 text-sm shadow-xl hover:scale-[1.02] transition-transform">
                COMEÇAR A JORNADA COMPLETA →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mobile Section ─── */}
      <section className="py-16 md:py-20 px-6 bg-parchment border-y border-gold/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A66A]/10 text-[#C8A66A]">
              <span className="text-[10px] font-heading tracking-widest uppercase font-bold">
                📱 FEITO PARA ESTUDAR NO CELULAR
              </span>
            </div>
            <h2 className="font-heading text-4xl text-midnight">Leve sua jornada para a tela inicial.</h2>
            <p className="text-lg text-midnight/70 font-body leading-relaxed max-w-2xl mx-auto">
              Crie um atalho do Tarô 78 Chaves no celular e continue seus estudos com um toque.<br/>
              <span className="text-sm italic">Acesso rápido pelo navegador, em qualquer dispositivo.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* iPhone / Safari */}
            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#5B1F3D]/5 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#5B1F3D]" />
                </div>
                <h3 className="font-heading text-xl text-midnight">iPhone</h3>
              </div>
              <ol className="space-y-3 text-sm text-midnight/70 font-body list-decimal list-inside">
                <li>Abra o site no Safari</li>
                <li>Toque no botão de compartilhar</li>
                <li>Escolha "Adicionar à Tela de Início"</li>
                <li>Confirme em "Adicionar"</li>
              </ol>
            </div>

            {/* Android / Chrome */}
            <div className="p-8 rounded-3xl bg-white border border-gold/10 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#C8A66A]/10 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#C8A66A]" />
                </div>
                <h3 className="font-heading text-xl text-midnight">Android</h3>
              </div>
              <ol className="space-y-3 text-sm text-midnight/70 font-body list-decimal list-inside">
                <li>Abra o site no Chrome</li>
                <li>Toque nos três pontinhos</li>
                <li>Escolha "Adicionar à tela inicial"</li>
                <li>Confirme o atalho</li>
              </ol>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={onInstallClick}
                className="btn-premium px-10 py-7 text-xs shadow-xl hover:scale-105 transition-transform"
              >
                ADICIONAR À TELA INICIAL →
              </Button>
              <p className="text-[10px] font-heading tracking-widest uppercase opacity-40">
                Acesso rápido pelo navegador
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm font-heading tracking-widest uppercase opacity-60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold" />
                <span>Aulas curtas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold" />
                <span>Visual mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold" />
                <span>Progresso salvo</span>
              </div>
            </div>

            <Button onClick={() => handleStart("pricing")} variant="link" className="text-[#5B1F3D] font-heading tracking-widest text-xs uppercase hover:no-underline hover:opacity-70 transition-all">
              COMEÇAR PELO LOUCO — GRÁTIS →
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Install Instructions Modal ─── */}
      <Dialog open={showInstallModal} onOpenChange={setShowInstallModal}>
        <DialogContent className="max-w-sm rounded-[2rem] bg-parchment border-gold/20 p-8">
          <DialogHeader className="space-y-4">
            <DialogTitle className="font-heading text-2xl text-midnight text-center">Adicionar à tela inicial</DialogTitle>
            <DialogDescription className="font-body text-center text-midnight/70">
              Crie um atalho rápido no seu celular para acessar a jornada com um toque.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gold/10 pb-2">
                <Smartphone className="w-4 h-4 text-[#5B1F3D]" />
                <span className="font-heading text-sm uppercase tracking-widest font-bold">iPhone / Safari</span>
              </div>
              <ol className="space-y-3 text-sm text-midnight/80 font-body list-decimal list-inside px-1">
                <li>Abra o site no <span className="font-bold">Safari</span></li>
                <li>Toque no botão de compartilhar <Share className="w-3 h-3 inline mb-1" /></li>
                <li>Escolha <span className="font-bold">"Adicionar à Tela de Início"</span></li>
                <li>Confirme em <span className="font-bold">"Adicionar"</span></li>
              </ol>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gold/10 pb-2">
                <Smartphone className="w-4 h-4 text-[#C8A66A]" />
                <span className="font-heading text-sm uppercase tracking-widest font-bold">Android / Chrome</span>
              </div>
              <ol className="space-y-3 text-sm text-midnight/80 font-body list-decimal list-inside px-1">
                <li>Abra o site no <span className="font-bold">Chrome</span></li>
                <li>Toque nos três pontinhos <MoreVertical className="w-3 h-3 inline mb-1" /></li>
                <li>Escolha <span className="font-bold">"Adicionar à tela inicial"</span></li>
                <li>Confirme o atalho</li>
              </ol>
            </div>
          </div>

          <Button 
            onClick={() => setShowInstallModal(false)}
            className="w-full btn-premium py-6 rounded-full"
          >
            ENTENDI
          </Button>
        </DialogContent>
      </Dialog>

      {/* ─── FAQ Section ─── */}
      <section className="py-16 md:py-20 px-6 bg-white/20">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <HelpCircle className="w-10 h-10 text-gold mx-auto mb-4" />
             <h2 className="font-heading text-3xl text-midnight">Dúvidas Frequentes</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-gold/30">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-bold text-plum">Por onde eu começo?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 bg-white/30 p-4 rounded-xl">
                Você começa pelo Louco gratuitamente. Se for bem na lição, desbloqueia O Mago e entende como a jornada funciona antes de assinar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-gold/30">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-bold text-plum">O que está incluso no plano?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 bg-white/30 p-4 rounded-xl">
                O acesso completo libera a jornada pelos 78 arcanos, com lições progressivas, quizzes, Pontos de Jornada, progresso salvo e estudo carta por carta.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-gold/30">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-bold text-plum">Preciso saber tarô antes?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 bg-white/30 p-4 rounded-xl">
                Não. O app foi feito para começar do zero, com uma carta por vez e explicações claras.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-gold/30">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-bold text-plum">Vou aprender Arcanos Menores também?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 bg-white/30 p-4 rounded-xl">
                Sim. A jornada inclui Arcanos Maiores, Menores numerados e Cartas da Corte.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-gold/30">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-bold text-plum">Preciso de um baralho físico?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 bg-white/30 p-4 rounded-xl">
                Não para começar. O app mostra as cartas Rider-Waite-Smith dentro das lições. Ter um baralho pode complementar seu estudo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className="border-gold/30">
              <AccordionTrigger className="font-heading text-left hover:text-plum transition-colors font-bold text-plum">Como funciona o cancelamento?</AccordionTrigger>
              <AccordionContent className="font-body text-midnight/80 bg-white/30 p-4 rounded-xl">
                Se você assinou o Plano Mensal, pode gerenciar ou cancelar a qualquer momento pelo seu perfil. O Acesso Anual é um pagamento único sem renovação automática.
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
            "No app Tarô 78 Chaves, o tarô deixa de ser imagem e se torna presença."
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[13px] md:text-[14px] font-heading tracking-[0.25em] uppercase relative z-10 px-4">
          <a href="https://taro78chaves.lovable.app/privacidade" onClick={() => trackEvent("landing_legal_link_click", { link_name: "privacidade", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Privacidade</a>
          <a href="https://taro78chaves.lovable.app/termos" onClick={() => trackEvent("landing_legal_link_click", { link_name: "termos", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Termos</a>
          <a href="https://taro78chaves.lovable.app/suporte" onClick={() => trackEvent("landing_legal_link_click", { link_name: "suporte", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Suporte</a>
          <a href="https://taro78chaves.lovable.app/excluir-conta" onClick={() => trackEvent("landing_legal_link_click", { link_name: "excluir_conta", source: "landing" })} className="text-ivory hover:text-gold transition-colors font-black border-b border-gold/40 pb-1">Excluir conta</a>
        </nav>

        <div className="pt-8 border-t border-gold/10 max-w-xs mx-auto relative z-10">
          <p className="text-[11px] text-ivory/50 font-body tracking-wider font-medium">
            © {new Date().getFullYear()} Tarô 78 Chaves.<br />
            Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
