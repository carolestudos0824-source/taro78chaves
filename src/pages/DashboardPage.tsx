import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Target, 
  Trophy, 
  ShieldCheck, 
  Play, 
  Clock, 
  KeyRound,
  Layout,
  Crown,
  BookOpen,
  MapPin,
  Calendar,
  Zap,
  ArrowRight,
  Star
} from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { 
  MODULES_CATALOG as MODULES, 
  ARCANOS_MAIORES_CATALOG,
  getArcanoFull
} from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useRitual } from "@/hooks/use-ritual";
import { useAccess } from "@/hooks/use-access";
import { useRole } from "@/hooks/use-role";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo } from "react";
import { useHeader } from "@/contexts/header-context";
import { resolveMaiorVisual, resolveMenorVisualById } from "@/lib/content/visual-registry";
import { getDailyArcanaSet, getJourneyArcanaSet } from "@/lib/content/arcana-utils";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgMago from "@/assets/arcano-1-mago.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgImperatriz from "@/assets/arcano-3-imperatriz.jpg";
import imgImperador from "@/assets/arcano-4-imperador.jpg";
const imgDezOuros = resolveMenorVisualById("ouros-10").resolvedAssetUrl;

// Decorative components for the premium feel
const ArchPortal = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-x-0 -top-8 flex justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
      <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 100C10 50.2944 50.2944 10 100 10C149.706 10 190 50.2944 190 100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="10" r="3" fill="currentColor" />
      </svg>
    </div>
    {children}
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const { todayProgress: ritualProgress, streak: ritualStreak } = useRitual();
  const { isPremium, subscriptionStatus, isAdmin } = useAccess();
  const { isStaff, isAuditor, role } = useRole();
  const { setHeader, resetHeader } = useHeader();

  const userName = user?.user_metadata?.display_name || progress.studentName || (isAdmin ? "Administrador" : isAuditor ? "Auditor" : "Aluna");

  useEffect(() => {
    setHeader({
      title: "Tarô 78 Chaves",
      subtitle: isAdmin ? "Acesso Administrativo" : isAuditor ? "Modo Auditoria" : `Bem-vinda, ${userName}`,
    });
    return () => resetHeader();
  }, [userName, isAdmin, isAuditor, setHeader, resetHeader]);

  const totalArcanosCount = 78;
  const completedMaiores = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
  const completedMenores = progress.completedLessons.filter(l => 
    l.startsWith("copas-") || l.startsWith("paus-") || l.startsWith("espadas-") || l.startsWith("ouros-")
  ).length;
  const totalCompletedArcanos = completedMaiores + completedMenores;
  const globalProgressPct = Math.round((totalCompletedArcanos / totalArcanosCount) * 100);

  const currentStep = useMemo(() => {
    for (let i = 0; i <= 21; i++) {
      if (!progress.completedLessons.includes(`arcano-${i}`)) {
        const summary = ARCANOS_MAIORES_CATALOG[i];
        if (!summary) continue;
        return {
          type: "arcano" as const,
          id: i,
          name: summary.name,
          numeral: summary.numeral,
          image: resolveMaiorVisual(i).resolvedAssetUrl || imgLouco,
          moduleName: "Arcanos Maiores",
          moduleSlug: "arcanos-maiores",
          lessonId: `arcano-${i}`,
          lessonName: summary.name,
          route: `/lesson/${i}`
        };
      }
    }
    const naipes = ["copas", "paus", "espadas", "ouros"] as const;
    const posicoes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "pajem", "cavaleiro", "rainha", "rei"] as const;
    for (const naipe of naipes) {
      for (const posicao of posicoes) {
        const id = `${naipe}-${posicao}`;
        if (!progress.completedLessons.includes(id)) {
          const visual = resolveMenorVisualById(id);
          const name = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          return {
            type: "menor" as const,
            id: id,
            name: name,
            numeral: posicao.toString().toUpperCase(),
            image: visual.resolvedAssetUrl || imgLouco,
            moduleName: `Naipe de ${naipe.charAt(0).toUpperCase() + naipe.slice(1)}`,
            moduleSlug: naipe,
            lessonId: id,
            lessonName: name,
            route: `/arcano-menor/${id}`
          };
        }
      }
    }
    return null;
  }, [progress.completedLessons]);

  const journeyTriad = useMemo(() => {
    if (!currentStep) return getJourneyArcanaSet(0);
    return getJourneyArcanaSet(currentStep.id);
  }, [currentStep]);

  const all78Arcana = useMemo(() => {
    const list = [];
    for (let i = 0; i <= 21; i++) {
      const visual = resolveMaiorVisual(i);
      list.push({ id: `arcano-${i}`, name: ARCANOS_MAIORES_CATALOG[i]?.name || "", image: visual.resolvedAssetUrl });
    }
    const naipes = ["copas", "paus", "espadas", "ouros"];
    const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "pajem", "cavaleiro", "rainha", "rei"];
    for (const naipe of naipes) {
      for (const rank of ranks) {
        const id = `${naipe}-${rank}`;
        const visual = resolveMenorVisualById(id);
        list.push({ id, name: id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "), image: visual.resolvedAssetUrl });
      }
    }
    return list;
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF5EF] relative overflow-x-hidden">
      <main className="container max-w-4xl px-4 pt-12 pb-[calc(180px+env(safe-area-inset-bottom))] space-y-12 animate-in fade-in duration-1000 relative">

        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-rose-200/20 blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-48 h-48 bg-gold/10 blur-[80px] pointer-events-none" />

        {/* Institutional Welcome Section */}
        <section className="text-center space-y-6 py-8 relative">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-10 bg-gold/30" />
              <span className="text-[10px] font-heading font-black tracking-[0.6em] text-gold uppercase">Sabedoria Ancestral</span>
              <div className="h-px w-10 bg-gold/30" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-plum tracking-tight flex flex-col items-center">
              <span className="text-xl md:text-2xl font-light italic text-plum/50 mb-1">Escola Digital de Tarô</span>
              <span className="relative inline-block">
                Jornada dos 78 Arcanos
                <div className="absolute -right-10 -top-4 opacity-40">
                  <Star className="w-6 h-6 text-gold fill-gold/20" />
                </div>
              </span>
            </h1>
            <p className="text-sm font-body italic text-plum/40 max-w-sm mx-auto leading-relaxed">
              Seu portal de estudo guiado através dos 78 arquétipos do Rider-Waite-Smith.
            </p>

            {/* Canonical Journey spread visual */}
            <div className="flex justify-center items-end -space-x-8 pt-4 pb-2 perspective-1000 relative z-10">
              {journeyTriad.map((card, idx) => (
                <div 
                  key={card.id} 
                  className={`aspect-[2/3.5] rounded-md overflow-hidden border border-gold/30 shadow-lg transition-transform hover:scale-110 hover:z-20 bg-ivory origin-bottom ${
                    idx === 0 ? 'w-16 -rotate-12' : 
                    idx === 1 ? 'w-20 border-2 border-gold/40 shadow-2xl z-10' : 
                    'w-16 rotate-12'
                  }`}
                >
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal School Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2 relative z-20">
          {[
            { label: "Domínio", value: `${globalProgressPct}%`, icon: Target, color: "text-[#9B7C2C]" },
            { label: totalCompletedArcanos === 1 ? "etapa feita" : "etapas feitas", value: totalCompletedArcanos, icon: KeyRound, color: "text-[#45162D]" },
            { label: progress.completedLessons.length === 1 ? "lição feita" : "lições feitas", value: progress.completedLessons.length, icon: BookOpen, color: "text-[#9B7C2C]" },
            { label: progress.streak === 1 ? "dia" : "dias", value: `${progress.streak}`, icon: Flame, color: "text-[#D97706]" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gold/15 shadow-sm flex flex-col items-center justify-center space-y-1 group hover:border-gold/30 transition-all">
              <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-xl font-heading font-bold text-plum leading-none">{stat.value}</span>
              <span className="text-[9px] font-heading font-black tracking-widest text-plum/30 uppercase">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Explore the 78 Arcanos - Cards Strip */}
        <section className="space-y-4 px-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <h3 className="font-heading text-[10px] font-black tracking-[0.3em] text-plum/50 uppercase">Explore os 78 Arcanos</h3>
            </div>
            <button 
              onClick={() => navigate("/trilhas")}
              className="text-[9px] font-heading font-black tracking-widest text-gold uppercase hover:text-plum transition-all flex items-center gap-1.5"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="relative group/strip">
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2 snap-x snap-mandatory cursor-grab active:cursor-grabbing">
              {all78Arcana.map((card, i) => (
                <div 
                  key={card.id} 
                  className="min-w-[85px] md:min-w-[100px] aspect-[2/3.5] rounded-xl overflow-hidden border border-gold/20 shadow-lg snap-center opacity-85 hover:opacity-100 hover:scale-105 hover:border-gold/50 transition-all duration-500 bg-ivory relative group/card"
                >
                  <img src={card.image || ""} alt={card.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[8px] font-heading font-black text-white uppercase tracking-tighter leading-none">{card.name}</span>
                  </div>
                </div>
              ))}
              {/* Intentional partial visible card space at the end */}
              <div className="min-w-[20px] shrink-0" />
            </div>
            {/* Horizontal fade indicators */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#FAF5EF] to-transparent pointer-events-none opacity-0 group-hover/strip:opacity-100 transition-opacity" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#FAF5EF] to-transparent pointer-events-none opacity-100" />
          </div>
        </section>

        {/* Auditor/Admin Banner - Simplified and Integrated */}
        {isAdmin && (
          <div className="mx-2 rounded-2xl p-4 bg-plum/5 border border-plum/10 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
            <div className="flex items-center gap-3 relative z-10">
              <ShieldCheck className="w-4 h-4 text-plum/40" />
              <div className="space-y-0.5">
                <p className="text-[9px] font-heading font-black tracking-widest uppercase text-plum/40">
                  Painel Administrativo
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/admin")}
              className="w-full sm:w-auto px-4 py-1.5 bg-plum/10 text-plum rounded-lg font-heading text-[9px] font-black tracking-widest uppercase hover:bg-plum hover:text-white transition-all relative z-10"
            >
              Acessar
            </button>
          </div>
        )}

        {isAuditor && !isAdmin && (
          <div className="mx-2 rounded-2xl p-4 bg-gold/5 border border-gold/10 flex items-center gap-3 opacity-60">
            <ShieldCheck className="w-4 h-4 text-gold/40" />
            <p className="text-[9px] font-heading font-black tracking-widest uppercase text-gold/40">
              Modo Auditoria
            </p>
          </div>
        )}

        {/* 1. Main Block: Journey Progress - Premium Duolingo Style */}
        <section className="relative mx-2 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-gold/20 bg-white shadow-2xl shadow-plum/5 group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-100/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-plum/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.02] bg-mystic-bg-procedural pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row min-h-[380px]">
            <div className="w-full md:w-[280px] p-8 md:p-12 bg-[#45162D] flex items-center justify-center relative overflow-hidden shrink-0">
               <div className="absolute inset-0 opacity-10 bg-mystic-bg-procedural scale-150 rotate-6" />
               <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#45162D] to-transparent z-10" />
               
               {currentStep && (
                 <ArchPortal className="relative z-20">
                    <div className="absolute -inset-4 bg-gold/10 blur-xl rounded-full opacity-50" />
                    <div className="w-44 aspect-[2/3.5] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:scale-[1.03] group-hover:rotate-1 relative">
                      <img 
                        src={currentStep.image} 
                        alt={currentStep.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                   </div>
                 </ArchPortal>
               )}
            </div>

            <div className="flex-1 p-8 md:p-14 flex flex-col justify-center space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-px bg-gold/40" />
                   <span className="text-[10px] font-heading font-black tracking-[0.4em] text-gold uppercase">Caminho do Iniciado</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-plum tracking-tight leading-tight">Sua Jornada</h2>
              </div>

              {currentStep && (
                <div className="space-y-6">
                  <div className="space-y-1.5 p-4 rounded-2xl bg-gold/5 border border-gold/10">
                    <p className="text-[10px] font-heading font-black tracking-widest text-gold uppercase flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> {currentStep.moduleName}
                    </p>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-plum leading-tight">
                      Arcano {currentStep.numeral} — {currentStep.name}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="relative h-2 rounded-full bg-ivory border border-gold/10 overflow-hidden shadow-inner">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-plum via-plum/80 to-gold transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(globalProgressPct, 5)}%` }}
                      />
                      <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-20" style={{ backgroundSize: '200% 100%' }} />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-heading font-black text-plum/30 uppercase tracking-[0.2em]">
                        {totalCompletedArcanos} de 78 Chaves
                      </span>
                      <span className="text-[10px] font-heading font-black text-gold uppercase tracking-[0.2em] flex items-center gap-1">
                        {globalProgressPct}% Integrado <Zap className="w-2 h-2 fill-current" />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <button
                  id="journey-cta-home-main"
                  data-testid="journey-cta-home-main"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const journeyCtaTarget = totalCompletedArcanos === 0 
                      ? "/mapa?focus=arcano-0" 
                      : `/mapa?focus=${currentStep?.lessonId || "arcano-0"}`;
                    navigate(journeyCtaTarget);
                  }}
                  className="w-full py-5 rounded-[1.25rem] font-heading text-[11px] tracking-[0.4em] uppercase font-black flex items-center justify-center gap-4 border shadow-2xl transition-all hover:translate-y-[-4px] active:translate-y-0 group/btn bg-plum text-white border-gold/30 hover:bg-[#45162D] relative z-[100]"
                >
                  <span>
                    {totalCompletedArcanos === 0 ? "Iniciar pelo Louco" : "Continuar jornada"}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform text-gold" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ritual of the Day - Separate Block */}
        {!ritualProgress.completed && (
          <section className="px-2">
            <div 
              onClick={() => navigate("/desafios")}
              className="relative overflow-hidden rounded-[2rem] bg-white border border-gold/20 p-8 shadow-xl cursor-pointer group hover:border-gold/40 transition-all"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                <Sparkles className="w-24 h-24 text-gold" />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-[10px] font-heading font-black tracking-[0.4em] text-gold uppercase">Conexão Diária</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-plum tracking-tight">Ritual de hoje</h3>
                  <p className="text-xs font-body italic text-plum/50">Mantenha sua chama acesa através da prática ritualística.</p>
                </div>
                <button className="px-8 py-4 bg-gold/10 text-plum border border-gold/30 rounded-xl font-heading text-[10px] font-black tracking-[0.3em] uppercase group-hover:bg-gold group-hover:text-plum transition-all flex items-center gap-2">
                  Praticar agora <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 2. Trails Grid - The School Map */}
        <section className="space-y-8 px-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <h3 className="font-heading text-[11px] font-black tracking-[0.5em] text-gold uppercase">Mapa de Estudo</h3>
            </div>
            <button onClick={() => navigate("/trilhas")} className="text-[10px] font-heading font-black tracking-widest text-plum/40 hover:text-plum transition-colors flex items-center gap-2 group">
              Explorar <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 border-b border-gold/10">
            <div 
              onClick={() => navigate("/module/arcanos-maiores")}
              className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-8 border border-gold/15 shadow-sm hover:shadow-xl hover:border-gold/40 transition-all cursor-pointer group flex items-start gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all">
                <KeyRound className="w-24 h-24 text-plum" />
              </div>
              <div className="w-20 aspect-[2/3.5] rounded-xl overflow-hidden border border-gold/20 shrink-0 group-hover:scale-[1.03] transition-all duration-500 shadow-xl">
                 <img src={imgMago} alt="Arcanos Maiores" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 flex-1 relative z-10 pt-1">
                <h4 className="font-heading text-xl font-bold text-plum tracking-tight">Arcanos Maiores</h4>
                <p className="text-[12px] font-body italic text-plum/50 leading-relaxed">A jornada espiritual através dos 22 arquétipos mestres.</p>
                <div className="pt-2 space-y-2">
                   <div className="flex justify-between items-center px-0.5">
                      <span className="text-[9px] font-heading font-black text-gold uppercase tracking-widest">{completedMaiores} de 22</span>
                      <span className="text-[9px] font-heading font-black text-plum/20 uppercase tracking-widest">{Math.round((completedMaiores/22)*100)}%</span>
                   </div>
                   <div className="h-1.5 bg-[#FAF5EF] rounded-full overflow-hidden border border-gold/5">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(completedMaiores/22)*100}%` }} />
                   </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate("/trilhas")}
              className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-8 border border-gold/15 shadow-sm hover:shadow-xl hover:border-gold/40 transition-all cursor-pointer group flex items-start gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all">
                <Layout className="w-24 h-24 text-plum" />
              </div>
              <div className="w-20 aspect-[2/3.5] rounded-xl overflow-hidden border border-gold/30 shrink-0 group-hover:scale-[1.03] transition-all duration-500 shadow-xl relative bg-ivory">
                 <img src={imgDezOuros} alt="Arcanos Menores" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
              <div className="space-y-3 flex-1 relative z-10 pt-1">
                <h4 className="font-heading text-xl font-bold text-plum tracking-tight">Arcanos Menores</h4>
                <p className="text-[12px] font-body italic text-plum/50 leading-relaxed">A aplicação prática dos 4 naipes e 56 situações cotidianas.</p>
                <div className="pt-2 space-y-2">
                   <div className="flex justify-between items-center px-0.5">
                      <span className="text-[9px] font-heading font-black text-plum/40 uppercase tracking-widest">{completedMenores} de 56</span>
                      <span className="text-[9px] font-heading font-black text-plum/20 uppercase tracking-widest">{Math.round((completedMenores/56)*100)}%</span>
                   </div>
                   <div className="h-1.5 bg-[#FAF5EF] rounded-full overflow-hidden border border-gold/5">
                      <div className="h-full bg-plum/40 rounded-full" style={{ width: `${(completedMenores/56)*100}%` }} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Utilities Block */}
        <section className="space-y-6 px-2 relative z-10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-2 rounded-full bg-gold/60" />
            <h3 className="font-heading text-[12px] font-black tracking-[0.5em] text-plum uppercase">Utilidades</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-12 border-b border-gold/10">
            {[
              { label: "Biblioteca", icon: BookOpen, route: "/biblioteca" },
              { label: "Rotina", icon: Clock, route: "/rotina", subtitle: "Organize seu hábito diário de estudo e ritual." },
              { label: "Méritos", icon: Trophy, route: "/certificados" }
            ].map((link, i) => (
              <button 
                key={i}
                onClick={() => navigate(link.route)}
                className="bg-white/95 backdrop-blur-md border border-gold/20 rounded-[2rem] p-6 flex flex-col items-center gap-4 hover:bg-white hover:border-gold/50 hover:shadow-2xl transition-all active:scale-95 group shadow-sm min-h-[140px] justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-gold/10 shadow-inner">
                  <link.icon className={`w-7 h-7 text-plum`} />
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-heading font-black tracking-[0.2em] text-plum uppercase block">{link.label}</span>
                  {link.subtitle && (
                    <span className="text-[8px] font-body font-black text-plum/40 uppercase mt-1 block leading-tight">{link.subtitle}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Sabedoria Ancestral (Now the last block) */}
        <section className="pb-[calc(140px+env(safe-area-inset-bottom))] px-2 relative z-10">
            <div className="bg-plum/95 rounded-[2.5rem] p-8 border border-gold/30 shadow-2xl text-white space-y-6 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                <Crown className="w-32 h-32 md:w-48 md:h-48" />
              </div>
              <div className="absolute inset-0 opacity-[0.03] bg-mystic-bg-procedural pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
                          <Sparkles className="w-6 h-6 text-gold" />
                        </div>
                        <span className="text-[11px] font-heading font-black tracking-[0.5em] text-[#FFD700] drop-shadow-sm uppercase">Formação Completa</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-white drop-shadow-md">Sabedoria Ancestral</h3>
                    <p className="text-sm font-body italic text-white max-w-sm leading-relaxed">
                      Desbloqueie todos os 78 portais, acesse meditações guiadas, quizzes de domínio e conquiste seu Certificado de Formação.
                    </p>
                </div>
                {!isPremium && !isStaff ? (
                  <button 
                    onClick={() => navigate("/premium")}
                    className="w-full lg:w-auto px-8 py-5 bg-gold text-plum rounded-2xl font-heading text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl hover:bg-white hover:scale-[1.02] transition-all active:scale-95 group/btn"
                  >
                    Fazer Inscrição 
                  </button>
                ) : (
                    <div className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-gold font-heading text-[10px] font-black tracking-[0.4em] uppercase flex items-center gap-2">
                        <Star className="w-4 h-4 fill-current" /> Assinatura Ativa
                    </div>
                )}
              </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
