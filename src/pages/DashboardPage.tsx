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

  const userName = user?.user_metadata?.display_name || progress.studentName || "Aluna";

  useEffect(() => {
    setHeader({
      title: "Tarô 78 Chaves",
      subtitle: `Bem-vinda, ${userName}`,
    });
    return () => resetHeader();
  }, [userName]);

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
      <main className="container max-w-3xl px-4 pt-6 pb-24 space-y-6 animate-in fade-in duration-500">
        
        {/* Auditor/Admin Banner */}
        {isStaff && (
          <div className="rounded-2xl p-4 bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 flex items-start gap-4 mb-2">
            <ShieldCheck className="w-5 h-5 text-[#C8A66A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-heading font-black tracking-widest uppercase text-[#C8A66A]">
                {isAdmin ? "Acesso Administrativo" : "Modo Auditoria"}
              </p>
              <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/70 leading-relaxed">
                {isAdmin 
                  ? "Você tem acesso total. Seu progresso administrativo não é salvo para não poluir os dados da plataforma." 
                  : "Modo Auditoria ativo. Você pode testar todo o conteúdo premium, mas seu progresso não será persistido."}
              </p>
            </div>
          </div>
        )}

        {/* 1. Bloco Principal: Minha Jornada */}
        <section className="relative rounded-[2.5rem] overflow-hidden p-6 md:p-10 border-2 border-[#C8A66A] bg-white shadow-xl shadow-[#5B1F3D]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A66A]/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-heading font-black tracking-[0.3em] text-[#C8A66A] uppercase">Onde você está</span>
              <h2 className="text-2xl font-heading font-black text-[#5B1F3D]">Minha Jornada</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-heading font-black text-[#5B1F3D]">{globalProgressPct}%</span>
              <p className="text-[10px] font-heading font-black text-[#C8A66A] uppercase tracking-widest mt-1">Concluído</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            {currentStep && (
              <div className="flex items-center gap-4 flex-1">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-[#C8A66A]/20 rounded-xl blur-sm" />
                  <img 
                    src={currentStep.image} 
                    alt={currentStep.name}
                    className="relative w-14 h-20 object-cover rounded-lg border-2 border-[#C8A66A] bg-white shadow-md"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-[10px] font-heading font-black tracking-widest text-[#C8A66A] uppercase truncate">
                    {currentStep.moduleName}
                  </p>
                  <h3 className="text-lg font-heading font-black text-[#5B1F3D] leading-tight truncate">
                    {currentStep.name}
                  </h3>
                  <div className="flex items-center gap-2 opacity-60">
                    <Clock className="w-3 h-3 text-[#5B1F3D]" />
                    <span className="text-[10px] font-body font-bold italic text-[#5B1F3D]">Última lição: {lastLessonName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="relative h-4 rounded-full bg-[#E8DED3] border border-[#DCCFC2] p-[2.5px] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(globalProgressPct, 5)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-heading font-black text-[#5B1F3D]/40 uppercase tracking-widest px-1">
              <span>{totalCompletedArcanos} Chaves</span>
              <span>78 Chaves da Jornada</span>
            </div>
          </div>

          <button
            onClick={() => currentStep && navigate(currentStep.route)}
            className="w-full mt-8 py-4 bg-[#5B1F3D] text-white rounded-2xl font-heading text-[11px] tracking-[0.3em] uppercase font-black flex items-center justify-center gap-2 border-2 border-[#C8A66A]/30 shadow-lg hover:bg-[#3D1429] transition-all"
          >
            Continuar de onde parei <ChevronRight className="w-4 h-4 text-[#C8A66A]" />
          </button>
        </section>

        {/* 2. Grid de Cards Menores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card: Progresso */}
          <div className="bg-white rounded-[2rem] p-6 border-2 border-[#C8A66A]/10 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] border border-[#C8A66A]/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#C8A66A]" />
              </div>
              <h3 className="font-heading text-sm font-black text-[#5B1F3D] uppercase tracking-widest">Progresso</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xl font-heading font-black text-[#5B1F3D]">{totalCompletedArcanos}</p>
                <p className="text-[9px] font-heading font-black text-[#C8A66A] uppercase tracking-widest">Arcanos</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-heading font-black text-[#5B1F3D]">{progress.completedLessons.length}</p>
                <p className="text-[9px] font-heading font-black text-[#C8A66A] uppercase tracking-widest">Lições</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-heading font-black text-[#5B1F3D]">{progress.completedQuizzes.length}</p>
                <p className="text-[9px] font-heading font-black text-[#C8A66A] uppercase tracking-widest">Quizzes</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-heading font-black text-[#5B1F3D]">{totalCompletedArcanos}</p>
                <p className="text-[9px] font-heading font-black text-[#C8A66A] uppercase tracking-widest">Chaves conquistadas</p>
              </div>
            </div>
          </div>

          {/* Card: Próximo Passo */}
          <div className="bg-[#5B1F3D] rounded-[2rem] p-6 border-2 border-[#C8A66A] shadow-lg text-white space-y-4 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-[#C8A66A]" />
              </div>
              <h3 className="font-heading text-sm font-black text-[#C8A66A] uppercase tracking-widest">Próximo Passo</h3>
            </div>
            {currentStep ? (
              <div className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-heading font-black text-white/50 uppercase tracking-widest">{currentStep.name}</p>
                  <p className="text-lg font-heading font-black leading-tight">{currentStep.lessonName}</p>
                </div>
                <button 
                  onClick={() => navigate(currentStep.route)}
                  className="w-full py-3 bg-[#C8A66A] text-[#5B1F3D] rounded-xl font-heading text-[10px] font-black tracking-widest uppercase shadow-md hover:bg-white transition-all"
                >
                  Começar agora
                </button>
              </div>
            ) : (
              <p className="text-sm font-body font-bold italic opacity-60">Jornada concluída!</p>
            )}
          </div>

          {/* Card: Conquistas */}
          <div className="bg-white rounded-[2rem] p-6 border-2 border-[#C8A66A]/10 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] border border-[#C8A66A]/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#C8A66A]" />
              </div>
              <h3 className="font-heading text-sm font-black text-[#5B1F3D] uppercase tracking-widest">Conquistas</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-heading font-black text-[#5B1F3D]">Nível {progress.level}</p>
                <p className="text-[9px] font-heading font-black text-[#C8A66A] uppercase tracking-widest">
                  Continue avançando para alcançar o nível {progress.level + 1}
                </p>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${progress.badges[i-1]?.earned ? "bg-[#5B1F3D]" : "bg-[#FAF5EF] opacity-30"}`}>
                    <Sparkles className={`w-3 h-3 ${progress.badges[i-1]?.earned ? "text-[#C8A66A]" : "text-[#5B1F3D]/30"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Plano */}
          <div className="bg-[#FAF5EF] rounded-[2rem] p-6 border-2 border-[#C8A66A]/20 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#C8A66A]/10 flex items-center justify-center">
                  <Crown className={`w-5 h-5 ${isPremium ? "text-[#C8A66A]" : "text-[#5B1F3D]/30"}`} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading text-[10px] font-black text-[#C8A66A] uppercase tracking-widest">Plano Atual</h3>
                  <p className="text-sm font-heading font-black text-[#5B1F3D]">
                    {isPremium ? "Premium" : "Gratuito"}
                  </p>
                </div>
              </div>
              {!isPremium && !isStaff && (
                <button 
                  onClick={() => navigate("/premium")}
                  className="text-[9px] font-heading font-black text-[#C8A66A] uppercase border-b border-[#C8A66A]/30 hover:text-[#5B1F3D] transition-colors"
                >
                  Fazer Upgrade
                </button>
              )}
            </div>
            <p className="text-[10px] font-body font-bold italic text-[#5B1F3D]/50 leading-relaxed">
              {isPremium 
                ? "Acesso completo a todas as 78 chaves e módulos profissionais." 
                : "Acesso inicial ao Louco e Fundamentos. Desbloqueie a jornada completa."}
            </p>
          </div>
        </div>

        {/* Links Rápidos Pedagógicos */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate("/trilhas")}
            className="flex items-center justify-center gap-3 p-4 bg-white border border-[#C8A66A]/20 rounded-2xl hover:bg-[#FAF5EF] transition-all group"
          >
            <Layout className="w-4 h-4 text-[#C8A66A] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-heading font-black text-[#5B1F3D] uppercase tracking-widest">Mapa da Jornada</span>
          </button>
          <button 
            onClick={() => navigate("/biblioteca")}
            className="flex items-center justify-center gap-3 p-4 bg-white border border-[#C8A66A]/20 rounded-2xl hover:bg-[#FAF5EF] transition-all group"
          >
            <BookOpen className="w-4 h-4 text-[#C8A66A] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-heading font-black text-[#5B1F3D] uppercase tracking-widest">Biblioteca</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;