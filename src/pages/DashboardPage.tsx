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
  Star,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { TarotIcon } from "@/components/TarotIcon";
import { cn } from "@/lib/utils";
import { MODULES_CATALOG as MODULES, ARCANOS_MAIORES_CATALOG, getArcanoFull } from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useRitual } from "@/hooks/use-ritual";
import { useAccess } from "@/hooks/use-access";
import { useRole } from "@/hooks/use-role";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo } from "react";
import { useHeader } from "@/contexts/header-context";
import { FUNDAMENTOS_LESSONS } from "@/content/lessons/fundamentos";
import { resolveMaiorVisual, resolveMenorVisualById } from "@/lib/content/visual-registry";
import { getDailyArcanaSet, getJourneyArcanaSet } from "@/lib/content/arcana-utils";
import imgLouco from "@/assets/arcano-0-louco.jpg";

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
  const { progress, fundamentosLessonsCompleted } = useProgress();
  const { todayProgress: ritualProgress } = useRitual();
  const { isPremium, isAdmin } = useAccess();
  const { isStaff, isAuditor } = useRole();
  const { setHeader, resetHeader } = useHeader();

  const userName = user?.user_metadata?.display_name || progress.studentName || "Aluna";

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
    // Priority: Fundamentos
    for (let i = 0; i < FUNDAMENTOS_LESSONS.length; i++) {
      const lesson = FUNDAMENTOS_LESSONS[i];
      const studyCompleted = progress.completedLessons.includes(lesson.id);
      const quizCompleted = progress.completedQuizzes.includes(`quiz-${lesson.id}`);
      
      if (!studyCompleted || !quizCompleted) {
        return {
          type: "fundamentos" as const,
          id: lesson.id,
          name: lesson.title,
          numeral: (i + 1).toString(),
          label: "Lição",
          image: imgLouco,
          moduleName: "Fundamentos do Tarô",
          moduleSlug: "fundamentos",
          lessonId: lesson.id,
          lessonName: lesson.title,
          route: `/fundamentos/${lesson.order}`
        };
      }
    }

    // Arcano 0 (The Fool) - Accessible for FREE after Lesson 1
    const lesson1Completed = progress.completedLessons.includes(FUNDAMENTOS_LESSONS[0]?.id) && 
                             progress.completedQuizzes.includes(`quiz-${FUNDAMENTOS_LESSONS[0]?.id}`);

    if (lesson1Completed && !progress.completedLessons.includes("arcano-0")) {
      return {
        type: "arcano" as const,
        id: 0,
        name: "O Louco",
        numeral: "0",
        label: "Arcano",
        image: resolveMaiorVisual(0).resolvedAssetUrl || imgLouco,
        moduleName: "Experiência Gratuita",
        moduleSlug: "jornada-do-louco",
        lessonId: "arcano-0",
        lessonName: "O Louco",
        route: "/lesson/0",
        isFreeLouco: true
      };
    }

    // Standard progression for subscribers
    if (isPremium || isAdmin || isAuditor) {
      for (let i = 1; i <= 21; i++) {
        if (!progress.completedLessons.includes(`arcano-${i}`)) {
          const summary = ARCANOS_MAIORES_CATALOG[i];
          return {
            type: "arcano" as const,
            id: i,
            name: summary?.name || "",
            numeral: summary?.numeral || "",
            label: "Arcano",
            image: resolveMaiorVisual(i).resolvedAssetUrl || imgLouco,
            moduleName: "Arcanos Maiores",
            moduleSlug: "arcanos-maiores",
            lessonId: `arcano-${i}`,
            lessonName: summary?.name || "",
            route: `/lesson/${i}`
          };
        }
      }
    }

    return null;
  }, [progress.completedLessons, progress.completedQuizzes, isPremium, isAdmin, isAuditor]);

  const all78Arcana = useMemo(() => {
    const list = [];
    for (let i = 0; i <= 21; i++) {
      const visual = resolveMaiorVisual(i);
      list.push({ id: `arcano-${i}`, name: ARCANOS_MAIORES_CATALOG[i]?.name || "", image: visual.resolvedAssetUrl });
    }
    const naipes = ["copas", "paus", "espadas", "ouros"];
    for (const naipe of naipes) {
      const visual = resolveMenorVisualById(`${naipe}-1`);
      list.push({ id: `${naipe}-1`, name: `Ás de ${naipe}`, image: visual.resolvedAssetUrl });
    }
    return list;
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF5EF] relative overflow-x-hidden pb-32">
      <main className="container max-w-4xl px-4 pt-12 space-y-16 animate-in fade-in duration-1000">
        
        {/* 1. Welcome & Institutional */}
        <section className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gold/30" />
            <span className="text-[11px] font-heading font-black tracking-[0.6em] text-gold uppercase">Sabedoria Ancestral</span>
            <div className="h-px w-10 bg-gold/30" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-plum tracking-tight flex flex-col items-center">
            <span className="text-xl md:text-2xl font-light italic text-plum/50 mb-1">Escola Digital de Tarô</span>
            <span className="relative inline-block">Fundamentos do Tarô</span>
          </h1>
        </section>

        {/* 2. Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
          {[
            { label: "Integrado", value: `${globalProgressPct}%`, icon: KeyRound, color: "text-[#9B7C2C]" },
            { label: "Chaves", value: totalCompletedArcanos, icon: KeyRound, color: "text-[#45162D]" },
            { label: "Vistas", value: progress.completedLessons.length, icon: BookOpen, color: "text-[#9B7C2C]" },
            { label: "Dias", value: progress.streak, icon: Flame, color: "text-[#D97706]" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gold/15 shadow-sm flex flex-col items-center justify-center space-y-1">
              <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
              <span className="text-xl font-heading font-bold text-plum">{stat.value}</span>
              <span className="text-[12px] font-heading font-black tracking-widest text-plum/60 uppercase">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* 3. Próximo passo / Main CTA */}
        <section className="relative mx-2 rounded-[2.5rem] overflow-hidden border border-gold/20 bg-white shadow-2xl group">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[300px] p-10 bg-[#45162D] flex items-center justify-center shrink-0">
               {currentStep && (
                 <ArchPortal>
                    <div className="w-48 aspect-[2/3.5] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                      <img src={currentStep.image} alt={currentStep.name} className="w-full h-full object-cover" />
                    </div>
                 </ArchPortal>
               )}
            </div>
            <div className="flex-1 p-10 md:p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gold" />
                  <span className="text-[12px] font-heading font-black tracking-widest text-gold uppercase">Próximo Passo</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-plum leading-tight">
                  {fundamentosLessonsCompleted === 0 
                    ? "Fundamentos do Tarô — Lição 1: O que é o Tarô" 
                    : (currentStep as any)?.isFreeLouco 
                      ? "Arcano 0 — O Louco" 
                      : `${currentStep?.label} ${currentStep?.numeral} — ${currentStep?.name}`}
                </h3>
                <p className="text-[17px] font-body text-plum/90 font-medium leading-relaxed">
                  {fundamentosLessonsCompleted === 0 
                    ? "Dê o primeiro passo e avance na sua base." 
                    : (currentStep as any)?.isFreeLouco 
                      ? "Experimente gratuitamente sua primeira chave." 
                      : "Continue sua jornada e receba suas próximas chaves."}
                </p>
              </div>
              <button 
                onClick={() => navigate(currentStep?.route || "/fundamentos/0")}
                className="w-full py-6 bg-[#45162D] text-white rounded-2xl font-heading text-[14px] font-black tracking-widest uppercase hover:bg-plum hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {fundamentosLessonsCompleted === 0 
                  ? "Começar primeira lição" 
                  : (currentStep as any)?.isFreeLouco 
                    ? "Experimentar o Louco" 
                    : "Continuar Jornada"}
                <ArrowRight className="w-5 h-5 text-gold" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Como sua jornada começa */}
        <section className="mx-2 p-10 rounded-[2.5rem] bg-gold/5 border border-gold/20 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <Sparkles className="w-16 h-16 text-gold" />
          </div>
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-heading font-bold text-plum">Como sua jornada começa</h3>
            <p className="text-[16px] font-body text-plum/80 leading-relaxed font-medium max-w-2xl">
              Você começa pelos Fundamentos do Tarô. Depois da primeira lição, vai experimentar o Arcano 0 — O Louco. Para continuar a formação completa pelos 78 arcanos, desbloqueie a Escola Digital.
            </p>
          </div>
        </section>

        {/* 5. Explore os 78 Arcanos (Vitrine) */}
        <section className="px-2 space-y-6">
          <div className="space-y-1 px-2">
            <h3 className="font-heading text-[14px] font-black tracking-[0.4em] text-plum/70 uppercase">Explore os 78 Arcanos</h3>
            <p className="text-[15px] font-body text-plum/60 font-bold">Prévia da jornada que você vai desbloquear.</p>
          </div>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-6 px-2 scrollbar-hide">
              {all78Arcana.map(card => (
                <button 
                  key={card.id}
                  onClick={() => toast.info("Você vai desbloquear os arcanos depois de construir sua base nos Fundamentos.", { action: { label: "Começar primeira lição", onClick: () => navigate("/fundamentos/0") } })}
                  className="min-w-[100px] aspect-[2/3.5] rounded-xl overflow-hidden border border-gold/20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all shadow-lg bg-ivory"
                >
                  <img src={card.image || ""} className="w-full h-full object-cover" alt={card.name} />
                </button>
              ))}
            </div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FAF5EF] to-transparent pointer-events-none" />
          </div>
        </section>

        {/* 6. Você vai desbloquear (Utilities) */}
        <section className="px-2 space-y-8">
          <div className="space-y-1 px-2 text-center md:text-left">
            <h3 className="font-heading text-[14px] font-black tracking-[0.4em] text-plum/70 uppercase">Você vai desbloquear</h3>
            <p className="text-[15px] font-body text-plum/60 font-bold">Essas áreas se abrem conforme você avança na jornada.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Biblioteca", icon: BookOpen },
              { label: "Ritual Diário", icon: Calendar },
              { label: "Méritos", icon: Trophy }
            ].map(item => (
              <button 
                key={item.label}
                onClick={() => toast.info("Você vai desbloquear essa área conforme avança na jornada.", { action: { label: "Começar primeira lição", onClick: () => navigate("/fundamentos/0") } })}
                className="bg-white border border-gold/20 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 opacity-60 hover:bg-white hover:border-gold/40 transition-all shadow-sm group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="w-8 h-8 text-plum/30" />
                </div>
                <span className="text-[14px] font-heading font-black tracking-widest text-plum uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 7. Escola Digital Completa */}
        <section className="mx-2 p-10 md:p-14 rounded-[3rem] bg-[#45162D] text-white space-y-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <Crown className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-gold" />
              <span className="text-[12px] font-heading font-black tracking-widest text-gold/80 uppercase">Formação Completa</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">Escola Digital Completa</h3>
            <p className="text-[17px] font-body text-white/70 leading-relaxed font-medium">
              Continue sua formação pelos 78 arcanos com lições, práticas, quizzes e progresso guiado.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate("/premium")}
              className="px-10 py-5 bg-gold text-plum rounded-2xl font-heading text-[13px] font-black tracking-widest uppercase hover:bg-white hover:scale-[1.02] transition-all shadow-xl shadow-black/20"
            >
              Assinar e desbloquear a Escola Digital
            </button>
            {isAdmin && (
               <button 
                 onClick={() => navigate("/admin")}
                 className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-heading text-[11px] font-black tracking-widest uppercase hover:bg-white/20 transition-all flex items-center justify-center gap-2"
               >
                 <ShieldCheck className="w-4 h-4" /> Acesso Administrativo
               </button>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardPage;