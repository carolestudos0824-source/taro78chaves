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
  BookOpen
} from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { 
  MODULES_CATALOG as MODULES, 
  ARCANOS_MAIORES_CATALOG,
  getArcanoFull
} from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useRole } from "@/hooks/use-role";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo } from "react";
import { useHeader } from "@/contexts/header-context";
import { resolveMaiorVisual, resolveMenorVisualById } from "@/lib/content/visual-registry";
import imgLouco from "@/assets/arcano-0-louco.jpg";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
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
  }, [userName, isAdmin, isAuditor]);

  const totalArcanosCount = 78;
  const completedMaiores = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
  const completedMenores = progress.completedLessons.filter(l => 
    l.startsWith("copas-") || l.startsWith("paus-") || l.startsWith("espadas-") || l.startsWith("ouros-")
  ).length;
  const totalCompletedArcanos = completedMaiores + completedMenores;
  const globalProgressPct = Math.round((totalCompletedArcanos / totalArcanosCount) * 100);

  // ─── Arcano e Lição Atuais ───
  const currentStep = useMemo(() => {
    // Check Majors
    for (let i = 0; i <= 21; i++) {
      if (!progress.completedLessons.includes(`arcano-${i}`)) {
        const summary = ARCANOS_MAIORES_CATALOG[i];
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
    
    // Check Minors
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

  const lastLessonId = progress.completedLessons[progress.completedLessons.length - 1];
  const lastLessonName = lastLessonId ? lastLessonId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Nenhuma ainda";

  return (
    <div className="min-h-screen bg-[#FAF5EF]">
      <main className="container max-w-4xl px-4 pt-6 pb-24 space-y-10 animate-in fade-in duration-700">
        {/* Welcome Section - Premium School Identity */}
        <section className="text-center space-y-4 py-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <span className="text-[11px] font-heading font-black tracking-[0.4em] text-gold uppercase opacity-80">Escola Digital</span>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-plum tracking-tighter">Portal dos Arcanos</h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mt-4" />
          </div>
        </section>

        {/* Global Progress Snapshot - Horizontal School Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
          {[
            { label: "Domínio", value: `${globalProgressPct}%`, icon: Target, color: "text-gold" },
            { label: "Chaves", value: totalCompletedArcanos, icon: KeyRound, color: "text-plum" },
            { label: "Lições", value: progress.completedLessons.length, icon: BookOpen, color: "text-gold" },
            { label: "Sequência", value: `${progress.streak}d`, icon: Flame, color: "text-orange-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gold/10 shadow-sm flex flex-col items-center justify-center space-y-1">
              <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
              <span className="text-xl font-heading font-black text-plum leading-none">{stat.value}</span>
              <span className="text-[9px] font-heading font-black tracking-widest text-plum/40 uppercase">{stat.label}</span>
            </div>
          ))}
        </div>

        
        {/* Auditor/Admin Banner - Improved Visual & Utility */}
        {isStaff && (
          <div className="rounded-2xl p-4 bg-[#5B1F3D] border-2 border-[#C8A66A] flex flex-col sm:flex-row items-center justify-between gap-4 mb-2 shadow-lg animate-in slide-in-from-top duration-500">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#C8A66A]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-heading font-black tracking-widest uppercase text-[#C8A66A]">
                  {isAdmin ? "Acesso Técnico Completo" : "Modo Auditoria"}
                </p>
                <p className="text-[12px] font-body font-bold italic text-white/90 leading-snug">
                  {isAdmin 
                    ? "Ambiente administrativo. Visualização irrestrita de todos os arcanos e módulos." 
                    : "Ambiente de auditoria. Acesso liberado para validação técnica do conteúdo premium."}
                </p>
              </div>
            </div>
            {isAdmin && (
              <button 
                onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-4 py-2 bg-[#C8A66A] text-[#5B1F3D] rounded-xl font-heading text-[10px] font-black tracking-widest uppercase shadow-md hover:bg-white transition-all whitespace-nowrap"
              >
                Painel Admin
              </button>
            )}
          </div>
        )}

        {/* 1. Bloco Principal: Minha Jornada - Elegant RWS Focus */}
        <section className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-2 border-gold/30 bg-white shadow-2xl shadow-plum/5 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors group-hover:bg-gold/10" />
          
          <div className="relative z-10 flex flex-col md:flex-row min-h-[320px]">
            {/* Card Left: The Current Major Arcana Visual */}
            <div className="w-full md:w-[240px] p-8 bg-plum flex items-center justify-center relative overflow-hidden shrink-0">
               <div className="absolute inset-0 opacity-10 bg-mystic-bg-procedural scale-150 rotate-12" />
               <div className="absolute inset-0 bg-gradient-to-t from-plum via-transparent to-transparent opacity-60 z-10" />
               
               {currentStep && (
                 <div className="relative z-20 w-40 aspect-[2/3.5] rounded-xl overflow-hidden border-2 border-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={currentStep.image} 
                      alt={currentStep.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                 </div>
               )}
            </div>

            {/* Card Right: Context & Journey Progress */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-heading font-black tracking-[0.4em] text-gold uppercase opacity-80">Continuidade</span>
                <h2 className="text-3xl font-heading font-black text-plum tracking-tight leading-none">Minha Jornada</h2>
              </div>

              {currentStep && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[12px] font-heading font-black tracking-widest text-gold/80 uppercase">
                      {currentStep.moduleName}
                    </p>
                    <h3 className="text-xl font-heading font-black text-plum leading-tight">
                      Arcano {currentStep.numeral} — {currentStep.name}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="relative h-2.5 rounded-full bg-gold/10 border border-gold/5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-plum to-gold transition-all duration-[1500ms] ease-in-out"
                        style={{ width: `${Math.max(globalProgressPct, 5)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-heading font-black text-plum/40 uppercase tracking-widest">
                        {totalCompletedArcanos} de 78 Arcanos
                      </span>
                      <span className="text-[10px] font-heading font-black text-gold uppercase tracking-widest">
                        {globalProgressPct}% Dominado
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => currentStep && navigate(currentStep.route)}
                className="w-full py-5 bg-plum text-white rounded-2xl font-heading text-[11px] tracking-[0.3em] uppercase font-black flex items-center justify-center gap-3 border-2 border-gold/40 shadow-xl hover:bg-[#4A1932] transition-all hover:translate-y-[-2px] active:translate-y-0"
              >
                {totalCompletedArcanos === 0 ? "Abrir o Primeiro Portal" : "Atravessar Próximo Portal"} 
                <ChevronRight className="w-5 h-5 text-gold animate-pulse" />
              </button>
            </div>
          </div>
        </section>


        {/* 2. Grid de Acesso às Trilhas - The School Map */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-heading text-[11px] font-black tracking-[0.4em] text-gold uppercase opacity-80">Mapa da Escola</h3>
            <button onClick={() => navigate("/trilhas")} className="text-[10px] font-heading font-black tracking-widest text-plum/60 hover:text-plum transition-colors flex items-center gap-2">
              Ver Trilhas <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trail Card: Arcanos Maiores */}
            <div 
              onClick={() => navigate("/module/arcanos-maiores")}
              className="bg-white rounded-[2rem] p-6 border-2 border-gold/15 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all cursor-pointer group flex gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-plum/5 flex items-center justify-center shrink-0 group-hover:bg-plum transition-colors">
                 <KeyRound className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-black text-plum tracking-tight">Arcanos Maiores</h4>
                <p className="text-[11px] font-body font-bold italic text-plum/60 leading-tight">O caminho iniciático dos 22 arquétipos fundamentais.</p>
                <div className="pt-2 flex items-center gap-1.5">
                   <span className="text-[10px] font-heading font-black text-gold uppercase tracking-widest">{completedMaiores}/22</span>
                   <div className="w-20 h-1 bg-gold/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(completedMaiores/22)*100}%` }} />
                   </div>
                </div>
              </div>
            </div>

            {/* Trail Card: Arcanos Menores */}
            <div 
              onClick={() => navigate("/trilhas")}
              className="bg-white rounded-[2rem] p-6 border-2 border-gold/15 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all cursor-pointer group flex gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold/5 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                 <Layout className="w-8 h-8 text-plum group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-black text-plum tracking-tight">Arcanos Menores</h4>
                <p className="text-[11px] font-body font-bold italic text-plum/60 leading-tight">A estrutura técnica e cotidiana dos 56 naipes.</p>
                <div className="pt-2 flex items-center gap-1.5">
                   <span className="text-[10px] font-heading font-black text-plum/40 uppercase tracking-widest">{completedMenores}/56</span>
                   <div className="w-20 h-1 bg-plum/5 rounded-full overflow-hidden">
                      <div className="h-full bg-plum/40 rounded-full" style={{ width: `${(completedMenores/56)*100}%` }} />
                   </div>
                </div>
              </div>
            </div>

            {/* Utility Card: Próximo Passo Premium */}
            <div className="bg-plum rounded-[2rem] p-8 border-2 border-gold/30 shadow-lg text-white space-y-4 overflow-hidden relative group md:col-span-2">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                <Crown className="w-32 h-32" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-gold" />
                      </div>
                      <span className="text-[11px] font-heading font-black tracking-[0.3em] text-gold uppercase">Sabedoria Oculta</span>
                   </div>
                   <h3 className="text-2xl font-heading font-black tracking-tight">Acesso Integral à Escola</h3>
                   <p className="text-sm font-body font-bold italic opacity-70 max-w-md">
                     Domine os 78 arcanos com práticas diárias, quizzes de domínio e certificados de formação.
                   </p>
                </div>
                {!isPremium && !isStaff && (
                  <button 
                    onClick={() => navigate("/premium")}
                    className="w-full md:w-auto px-10 py-5 bg-gold text-plum rounded-2xl font-heading text-[11px] font-black tracking-widest uppercase shadow-2xl hover:bg-white transition-all active:scale-95"
                  >
                    Fazer Upgrade
                  </button>
                )}
                {(isPremium || isStaff) && (
                   <div className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-gold font-heading text-[10px] font-black tracking-widest uppercase">
                      Assinatura Ativa ✦
                   </div>
                )}
              </div>
            </div>
          </div>
        </section>


        {/* Links Rápidos Pedagógicos */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => navigate("/trilhas")}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#C8A66A]/20 rounded-2xl hover:bg-[#FAF5EF] transition-all group"
          >
            <Layout className="w-4 h-4 text-[#C8A66A] group-hover:scale-110 transition-transform" />
            <span className="text-[9px] min-[360px]:text-[11px] font-heading font-black text-[#5B1F3D] uppercase tracking-widest text-center">Mapa da Jornada</span>
          </button>
          <button 
            onClick={() => navigate("/biblioteca")}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#C8A66A]/20 rounded-2xl hover:bg-[#FAF5EF] transition-all group"
          >
            <BookOpen className="w-4 h-4 text-[#C8A66A] group-hover:scale-110 transition-transform" />
            <span className="text-[9px] min-[360px]:text-[11px] font-heading font-black text-[#5B1F3D] uppercase tracking-widest text-center">Biblioteca</span>
          </button>
          <button 
            onClick={() => navigate("/rotina")}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#C8A66A]/20 rounded-2xl hover:bg-[#FAF5EF] transition-all group"
          >
            <Clock className="w-4 h-4 text-[#C8A66A] group-hover:scale-110 transition-transform" />
            <span className="text-[9px] min-[360px]:text-[11px] font-heading font-black text-[#5B1F3D] uppercase tracking-widest text-center">Como Estudar</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;