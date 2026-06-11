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
    return null;
  }, [progress.completedLessons, progress.completedQuizzes]);

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
    return list;
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF5EF] relative overflow-x-hidden pb-32">
      <main className="container max-w-4xl px-4 pt-12 space-y-12 animate-in fade-in duration-1000">
        
        {/* 1. Fundamentos Block */}
        <section className="relative mx-2 rounded-[2.5rem] overflow-hidden border border-gold/20 bg-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row">
            <div className="w-full md:w-[280px] p-8 bg-[#45162D] flex items-center justify-center shrink-0">
               {currentStep && (
                 <ArchPortal>
                    <div className="w-44 aspect-[2/3.5] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-2xl">
                      <img src={currentStep.image} alt={currentStep.name} className="w-full h-full object-cover" />
                    </div>
                 </ArchPortal>
               )}
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <p className="text-[14px] font-heading font-black tracking-widest text-gold uppercase">Próximo Passo</p>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-plum leading-tight">Fundamentos do Tarô — Lição 1: O que é o Tarô</h3>
                <p className="text-[16px] font-body text-plum/80">Dê o primeiro passo e avance na sua base.</p>
              </div>
              <button 
                onClick={() => navigate("/fundamentos/0")}
                className="w-full py-5 bg-[#5B1F3D] text-white rounded-2xl font-heading text-[14px] font-black tracking-widest uppercase hover:bg-plum transition-all flex items-center justify-center gap-2"
              >
                Começar primeira lição <ArrowRight className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. How your journey begins */}
        <section className="mx-2 p-8 rounded-[2rem] bg-gold/5 border border-gold/20 space-y-4">
          <h3 className="text-xl font-heading font-bold text-plum">Como sua jornada começa</h3>
          <p className="text-[15px] font-body text-plum/80 leading-relaxed">
            Você começa pelos Fundamentos do Tarô. Depois da primeira lição, vai experimentar o Arcano 0 — O Louco. Para continuar a formação completa pelos 78 arcanos, desbloqueie a Escola Digital.
          </p>
        </section>

        {/* 3. Ritual de Hoje (Blocked) */}
        <section className="px-2">
           <div className="rounded-[2rem] bg-white border border-gold/20 p-8 shadow-lg">
             <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-gold" />
                 <h3 className="text-xl font-heading font-bold text-plum">Ritual de hoje</h3>
               </div>
               <p className="text-[15px] font-body text-plum/80">Complete sua primeira lição para liberar sua prática ritual diária.</p>
               <button 
                 onClick={() => navigate("/fundamentos/0")}
                 className="w-full py-4 bg-gold/10 text-plum border border-gold/30 rounded-xl font-heading font-black tracking-widest uppercase hover:bg-gold transition-all"
               >
                 Começar primeira lição
               </button>
             </div>
           </div>
        </section>

        {/* 4. Vitrine Visual */}
        <section className="px-2 space-y-4">
          <h3 className="font-heading text-[14px] font-black tracking-[0.3em] text-plum/80 uppercase">Explore os 78 Arcanos</h3>
          <p className="text-[14px] text-plum/60 font-body">Prévia da jornada que você vai desbloquear.</p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {all78Arcana.map(card => (
              <button 
                key={card.id}
                onClick={() => toast.info("Você vai desbloquear os arcanos depois de construir sua base nos Fundamentos.", { action: { label: "Começar", onClick: () => navigate("/fundamentos/0") } })}
                className="min-w-[85px] aspect-[2/3.5] rounded-xl overflow-hidden border border-gold/20 grayscale hover:grayscale-0 transition-all"
              >
                <img src={card.image || ""} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* 5. You will unlock */}
        <section className="px-2 space-y-4">
          <h3 className="font-heading text-[14px] font-black tracking-[0.3em] text-plum/80 uppercase">Você vai desbloquear</h3>
          <p className="text-[14px] text-plum/60 font-body">Essas áreas se abrem conforme você avança na jornada.</p>
          <div className="grid grid-cols-3 gap-4">
            {["Biblioteca", "Ritual Diário", "Méritos"].map(label => (
              <button 
                key={label}
                onClick={() => toast.info("Você vai desbloquear essa área conforme avança na jornada.", { action: { label: "Começar", onClick: () => navigate("/fundamentos/0") } })}
                className="bg-white border border-gold/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 opacity-70"
              >
                <Lock className="w-6 h-6 text-plum/40" />
                <span className="text-[12px] font-heading font-bold text-plum">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 6. Escola Digital */}
        <section className="mx-2 p-8 rounded-[2rem] bg-plum text-white space-y-4">
          <h3 className="text-xl font-heading font-bold">Escola Digital Completa</h3>
          <p className="text-[15px] font-body text-white/80">Continue sua formação pelos 78 arcanos com lições, práticas, quizzes e progresso guiado.</p>
          <button 
            onClick={() => navigate("/premium")}
            className="w-full py-5 bg-gold text-plum rounded-2xl font-heading font-black tracking-widest uppercase hover:bg-white transition-all"
          >
            Assinar e desbloquear a Escola Digital
          </button>
        </section>

      </main>
    </div>
  );
};

export default DashboardPage;