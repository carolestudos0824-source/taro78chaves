import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Check, ChevronRight, Sparkles, User, Flame } from "lucide-react";
import { 
  MODULES_CATALOG as MODULES, 
  isModuleUnlocked, 
  type LearningModule, 
  type ModuleCategory 
} from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import OnboardingPage from "./OnboardingPage";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import BetaWelcomeBanner from "@/components/BetaWelcomeBanner";
import FeedbackNudge from "@/components/FeedbackNudge";
import RetentionBanner from "@/components/RetentionBanner";
import ContinuityCard from "@/components/ContinuityCard";
import ProgressCelebration from "@/components/ProgressCelebration";
import { SmartReviewCard } from "@/components/SmartReviewCard";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgEstrela from "@/assets/arcano-17-estrela.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  "foundation": "Fundação",
  "major-arcana": "Arcanos Maiores",
  "minor-arcana": "Arcanos Menores",
  "advanced": "Avançado",
  "practice": "Prática",
  "professional": "Profissional",
};

const ModulesPage = () => {
  const navigate = useNavigate();
  const { progress, loading: progressLoading, completeOnboarding } = useProgress();
  const { bypassLocks } = useAccess();

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gold-dark border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  if (!progress.onboardingCompleted) {
    return <OnboardingPage onComplete={completeOnboarding} />;
  }

  const grouped = MODULES.reduce<Record<ModuleCategory, LearningModule[]>>((acc, mod) => {
    if (!acc[mod.category]) acc[mod.category] = [];
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<ModuleCategory, LearningModule[]>);

  const categoryOrder: ModuleCategory[] = ["foundation", "major-arcana", "minor-arcana", "advanced", "practice", "professional"];

  const getModuleProgress = (mod: LearningModule): number => {
    if (mod.id === "arcanos-maiores") {
      const completed = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
      return Math.round((completed / 22) * 100);
    }
    const completed = progress.completedLessons.filter(l => l.startsWith(`${mod.id}-`)).length;
    return mod.totalLessons ? Math.round((completed / mod.totalLessons) * 100) : 0;
  };

  return (
    <div className="min-h-screen pb-bottom-nav">
      {/* ─── Persistent Header ─── */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-gold/10">
        <div className="container max-w-lg py-4 px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <p className="t-section-title mb-1">A Jornada do Louco</p>
              <h1 className="font-heading text-xl md:text-2xl text-midnight tracking-tight">Sua Jornada</h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button onClick={() => navigate("/perfil")} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 border border-gold/20 shadow-sm transition-transform active:scale-90">
                <User className="w-5 h-5 text-gold-dark" />
              </button>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      <main className="container max-w-lg px-6 py-8 space-y-10">
        <ProgressCelebration xp={progress.xp} level={progress.level} streak={progress.streak} completedLessons={progress.completedLessons.length} />
        
        <div className="space-y-6">
          <BetaWelcomeBanner />
          <SmartReviewCard />
          
          {progress.completedLessons.length === 0 && (
            <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4 text-center space-y-2">
              <p className="text-[11px] font-medium text-gold-dark/80 italic">
                ✦ Comece pelo Louco grátis. Vá bem e desbloqueie O Mago. Continue a jornada completa no Premium.
              </p>
            </div>
          )}
          
          {/* ─── Hero Visuals ─── */}
          <div className="flex justify-center -space-x-4 py-4 opacity-80 scale-90">
            <img src={imgLouco} alt="" className="w-20 rounded-xl shadow-2xl -rotate-12 border-2 border-white/50" />
            <img src={imgSacerdotisa} alt="" className="w-20 rounded-xl shadow-2xl z-10 border-2 border-white" />
            <img src={imgEstrela} alt="" className="w-20 rounded-xl shadow-2xl rotate-12 border-2 border-white/50" />
          </div>
          
          <ContinuityCard lastLessonId={null} lastLessonName={null} completedLessons={progress.completedLessons.length} completedQuizzes={progress.completedQuizzes.length} hasUnfinishedReview={false} completedLessonIds={progress.completedLessons} />
        </div>

        {/* ─── Modules Grid ─── */}
        <div className="space-y-12">
          {categoryOrder.map(cat => {
            const mods = grouped[cat];
            if (!mods || mods.length === 0) return null;

            return (
              <section key={cat} className="space-y-5">
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-gold/10" />
                  <h2 className="t-section-title">{CATEGORY_LABELS[cat]}</h2>
                  <span className="h-px flex-1 bg-gold/10" />
                </div>

                <div className="space-y-3">
                  {mods.map((mod) => {
                    const unlocked = bypassLocks || isModuleUnlocked(mod.id, progress.completedModules);
                    const isCompleted = progress.completedModules.includes(mod.id);
                    const prog = getModuleProgress(mod);
                    const isCurrent = unlocked && !isCompleted;

                    return (
                      <button
                        key={mod.id}
                        onClick={() => unlocked && navigate(mod.route)}
                        disabled={!unlocked}
                        className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                          isCurrent 
                            ? "bg-white border-gold/40 shadow-xl shadow-gold/5 scale-[1.02]" 
                            : unlocked 
                            ? "bg-white/50 border-gold/20 hover:bg-white active:scale-[0.98]" 
                            : "bg-black/5 border-transparent opacity-60 grayscale cursor-not-allowed"
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                        )}
                        
                        <div className="flex items-center gap-5 relative z-10">
                          {/* Icon Circle */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                            isCurrent ? "bg-gold/10 border-gold/40 text-gold-dark" : "bg-white/50 border-gold/10 text-muted-foreground"
                          }`}>
                            {isCompleted ? <Check className="w-5 h-5 text-success" /> : unlocked ? <span className="text-base">{mod.icon}</span> : <Lock className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="t-kicker opacity-50">{mod.symbol}</span>
                              <h3 className={`font-heading text-sm tracking-tight ${isCurrent ? "text-midnight" : "text-midnight/60"}`}>
                                {mod.name}
                              </h3>
                              {mod.id === "arcanos-maiores" && (
                                <span className="text-[8px] font-heading tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/10 ml-auto shrink-0">
                                  Contém Lição Grátis
                                </span>
                              )}
                              {!unlocked && !isCompleted && mod.id !== "arcanos-maiores" && (
                                <span className="text-[8px] font-heading tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/10 ml-auto shrink-0">
                                  Premium
                                </span>
                              )}
                              {isCompleted && (
                                <span className="text-[8px] font-heading tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/10 ml-auto shrink-0">
                                  Concluído
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-body text-muted-foreground line-clamp-1">
                              {mod.id === "arcanos-maiores" && progress.completedLessons.length === 0 
                                ? "Comece pelo Louco gratuitamente e inicie sua jornada." 
                                : mod.subtitle}
                            </p>
                            
                            {isCurrent && prog > 0 && (
                              <div className="mt-3 h-1 rounded-full bg-gold/10 overflow-hidden">
                                <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${prog}%` }} />
                              </div>
                            )}
                          </div>

                          {unlocked && <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isCurrent ? "text-gold" : "text-muted-foreground/30"}`} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="pt-8 flex justify-center">
          <img src={ornamentDivider} alt="" className="w-24 opacity-20" />
        </div>
      </main>
    </div>
  );
};

export default ModulesPage;
