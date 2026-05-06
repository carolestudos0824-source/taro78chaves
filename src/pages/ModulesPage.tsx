import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Lock, 
  Check, 
  ChevronRight, 
  Sparkles, 
  User, 
  Flame, 
  Key, 
  KeyRound, 
  Eye, 
  BookOpen, 
  Star, 
  Moon, 
  Sun, 
  Droplets, 
  Gem, 
  Swords, 
  Crown, 
  Layers, 
  Compass,
  LockKeyhole
} from "lucide-react";
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
import brandIcon from "@/assets/brand-icon.png";
import brandLogo from "@/assets/brand-logo.png";

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
  const { bypassLocks: originalBypassLocks } = useAccess();
  // Force bypassLocks to true ONLY for visual consistency in the preview if needed, 
  // but the user wants to see "blocked" states too. 
  // Let's use the real bypassLocks to see the actual logic.
  const bypassLocks = originalBypassLocks; 


  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-10 h-10 border-2 border-gold/20 border-t-gold animate-spin rounded-full mx-auto" />
          <p className="text-[10px] text-gold-dark/40 font-heading tracking-widest uppercase">Sincronizando Jornada</p>
        </div>
      </div>
    );
  }

  // Temporary bypass for audit
  // if (!progress.onboardingCompleted) {
  //   return <OnboardingPage onComplete={completeOnboarding} />;
  // }

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
    <div className="min-h-screen pb-bottom-nav bg-ivory/30">
      {/* ─── Persistent Header ─── */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-gold/20 shadow-sm">
        <div className="container max-w-lg py-5 px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center shrink-0 p-0.5 bg-white rounded-xl shadow-inner border border-gold/10">
                <img 
                  src={brandIcon} 
                  alt="Tarô 78 Chaves" 
                  className="w-full h-full object-contain filter drop-shadow-sm" 
                />
              </div>
              <div className="flex flex-col">
                <h1 className="font-heading text-xl text-plum font-bold tracking-tight leading-none mb-1.5">
                  Tarô 78 Chaves
                </h1>
                <div className="flex flex-col">
                  <span className="font-heading text-[10px] tracking-[0.15em] uppercase text-gold-dark font-bold leading-none">
                    Sua Jornada
                  </span>
                  <span className="text-[9px] font-body text-plum/50 mt-1 leading-none italic">
                    Comece pelo Louco e avance pelos 78 arcanos.
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <StreakCounter streak={progress.streak} />
              <button 
                onClick={() => navigate("/perfil")} 
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-white border border-gold/20 shadow-sm transition-all hover:border-gold/40 active:scale-95 group"
                title="Meu Perfil"
              >
                <Key className="w-5 h-5 text-gold-dark group-hover:rotate-12 transition-transform" />
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
            <div className="bg-plum/5 border border-plum/10 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold/50" />
              <p className="text-[12px] font-medium text-plum/90 italic leading-relaxed relative z-10">
                ✦ Comece pelo Louco grátis. Vá bem e desbloqueie O Mago. <br/>
                <span className="text-gold-dark font-bold not-italic">Continue a jornada completa no Premium.</span>
              </p>
            </div>
          )}
          
          {/* ─── Hero Visuals ─── */}
          <div className="flex justify-center -space-x-4 py-4 opacity-80 scale-90">
            <img src={imgLouco} alt="" className="w-20 rounded-xl shadow-2xl -rotate-12 border-2 border-white/50" />
            <img src={imgSacerdotisa} alt="" className="w-20 rounded-xl shadow-2xl z-10 border-2 border-white" />
            <img src={imgEstrela} alt="" className="w-20 rounded-xl shadow-2xl rotate-12 border-2 border-white/50" />
          </div>
          
          <ContinuityCard lastLessonId={null} lastLessonName={null} completedLessons={progress.completedLessons.length} completedQuizzes={progress.completedQuizzes.length} hasUnfinishedReview={false} completedLessonIds={progress.completedLessons} currentModuleId="arcanos-maiores" />
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
                  <h2 className="t-section-title font-bold text-plum/80">{CATEGORY_LABELS[cat]}</h2>
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
                            ? "bg-white border-gold shadow-xl shadow-gold/10 scale-[1.02] ring-1 ring-gold/20" 
                            : unlocked 
                            ? "bg-white/80 border-gold/30 hover:bg-white hover:border-gold/50 active:scale-[0.98] shadow-sm" 
                            : "bg-greige/40 border-gold/10 opacity-80 cursor-not-allowed grayscale-[0.3]"
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                        )}
                        
                        <div className="flex items-center gap-5 relative z-10">
                          {/* Icon Circle */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all shadow-sm ${
                            isCurrent ? "bg-gold/15 border-gold text-gold-dark scale-110" : unlocked ? "bg-white border-gold/20 text-plum" : "bg-white/40 border-gold/10 text-plum/30"
                          }`}>
                            {isCompleted ? <Check className="w-5 h-5 text-success" /> : unlocked ? <span className="text-base">{mod.icon}</span> : <Lock className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="t-kicker opacity-50">{mod.symbol}</span>
                              <h3 className={`font-heading text-[15px] tracking-tight ${isCurrent ? "text-plum font-bold" : unlocked ? "text-plum/90 font-bold" : "text-plum/40 font-semibold"}`}>
                                {mod.name}
                              </h3>
                              {mod.id === "arcanos-maiores" && (
                                <span className="text-[9px] font-heading tracking-widest uppercase px-2 py-0.5 rounded-lg bg-gold/20 text-gold-dark border border-gold/30 ml-auto shrink-0 font-bold shadow-sm">
                                  Lição Grátis
                                </span>
                              )}
                              {!unlocked && !isCompleted && mod.id !== "arcanos-maiores" && (
                                <span className="text-[9px] font-heading tracking-widest uppercase px-2 py-0.5 rounded-lg bg-plum/10 text-plum border border-plum/20 ml-auto shrink-0 font-bold">
                                  Premium
                                </span>
                              )}
                              {isCompleted && (
                                <span className="text-[9px] font-heading tracking-widest uppercase px-2 py-0.5 rounded-lg bg-success/20 text-success border border-success/30 ml-auto shrink-0 font-bold shadow-sm">
                                  Concluído
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] font-body line-clamp-1 leading-relaxed ${unlocked ? "text-plum/75 font-medium" : "text-plum/30 font-medium"}`}>
                              {mod.id === "arcanos-maiores" && progress.completedLessons.length === 0 
                                ? "Inicie sua jornada no portal sagrado." 
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
