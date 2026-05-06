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
  LockKeyhole,
  GitBranch,
  Layout,
  PanelsTopLeft,
  Target,
  Briefcase
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

const MODULE_ICON_MAP: Record<string, any> = {
  "fundamentos": BookOpen,
  "leitura-simbolica": Eye,
  "arcanos-maiores": Star,
  "arquitetura-menores": Layers,
  "copas": Droplets,
  "paus": Flame,
  "espadas": Swords,
  "ouros": Gem,
  "cartas-corte": Crown,
  "combinacoes": GitBranch,
  "tiragens": PanelsTopLeft,
  "espiritualidade": Moon,
  "mesa-taro": Layout,
  "leitura-aplicada": Target,
  "pratica": Sparkles,
  "trabalhar-taro": Briefcase,
};

const ModulesPage = () => {
  const navigate = useNavigate();
  const { progress, loading: progressLoading, completeOnboarding } = useProgress();
  const { bypassLocks: originalBypassLocks } = useAccess();
  const bypassLocks = originalBypassLocks; 

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-[#C8A66A]/20 border-t-[#5B1F3D] animate-spin rounded-full mx-auto" />
          <p className="text-[12px] text-[#5B1F3D] font-heading tracking-widest uppercase font-bold">Sincronizando Jornada</p>
        </div>
      </div>
    );
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
    <div className="min-h-screen pb-bottom-nav bg-[#FAF5EF]">
      {/* ─── Persistent Header ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#C8A66A]/30 shadow-md">
        <div className="container max-w-lg py-4 px-6 md:py-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shrink-0 p-1 bg-white rounded-2xl shadow-md border border-[#C8A66A]/30">
                <img 
                  src={brandIcon} 
                  alt="Tarô 78 Chaves" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <h1 className="font-heading text-xl md:text-2xl text-[#5B1F3D] font-extrabold tracking-tight leading-none mb-1">
                  Tarô 78 Chaves
                </h1>
                <div className="flex flex-col">
                  <span className="font-heading text-[10px] md:text-[12px] tracking-[0.2em] uppercase text-[#C8A66A] font-black leading-none">
                    Sua Jornada
                  </span>
                  <span className="hidden xs:block text-[10px] md:text-[11px] font-body text-[#5B1F3D]/70 mt-1 md:mt-2 leading-none font-semibold italic">
                    Abra os portais dos 78 arcanos.
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <StreakCounter streak={progress.streak} />
              <button 
                onClick={() => navigate("/perfil")} 
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center bg-white border border-[#C8A66A]/30 shadow-sm transition-all hover:border-[#C8A66A]/60 active:scale-95 group"
                title="Meu Perfil"
              >
                <KeyRound className="w-4 h-4 md:w-5 md:h-5 text-[#C8A66A] group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      <main className="container max-w-lg px-6 pt-8 pb-20 md:pt-12 md:pb-24 space-y-10 md:space-y-12">
        <ProgressCelebration xp={progress.xp} level={progress.level} streak={progress.streak} completedLessons={progress.completedLessons.length} />
        
        <div className="space-y-6">
          <BetaWelcomeBanner />
          <SmartReviewCard />
          
          {progress.completedLessons.length === 0 && (
            <div className="bg-[#5B1F3D]/5 border border-[#5B1F3D]/10 rounded-2xl p-5 text-center space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C8A66A]" />
              <p className="text-[13px] font-medium text-[#5B1F3D] italic leading-relaxed relative z-10">
                ✦ Comece pelo Louco grátis. Vá bem e desbloqueie O Mago. <br/>
                <span className="text-[#C8A66A] font-bold not-italic">Continue a jornada completa no Premium.</span>
              </p>
            </div>
          )}
          
          {/* ─── Hero Visuals ─── */}
          <div className="flex justify-center -space-x-4 py-6 opacity-90 scale-100">
            <img src={imgLouco} alt="" className="w-24 rounded-2xl shadow-xl -rotate-12 border-2 border-white/50" />
            <img src={imgSacerdotisa} alt="" className="w-24 rounded-2xl shadow-xl z-10 border-2 border-white" />
            <img src={imgEstrela} alt="" className="w-24 rounded-2xl shadow-xl rotate-12 border-2 border-white/50" />
          </div>
          
          <ContinuityCard lastLessonId={null} lastLessonName={null} completedLessons={progress.completedLessons.length} completedQuizzes={progress.completedQuizzes.length} hasUnfinishedReview={false} completedLessonIds={progress.completedLessons} currentModuleId="arcanos-maiores" />

          {/* ─── Premium Conversion Card ─── */}
          <div 
            onClick={() => navigate("/premium")}
            className="cursor-pointer bg-[#5B1F3D] border border-[#C8A66A]/40 rounded-3xl p-7 shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02] active:scale-[0.98] ring-1 ring-[#C8A66A]/20"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C8A66A]/20 rounded-full blur-3xl group-hover:bg-[#C8A66A]/30 transition-colors" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FAF5EF]/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#C8A66A] flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 transition-transform duration-500 border border-[#FAF5EF]/30">
                <KeyRound className="w-9 h-9 text-[#5B1F3D]" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-bold text-[#FAF5EF] leading-tight mb-1.5">
                  Desbloqueie a Jornada Completa
                </h3>
                <p className="text-[13px] text-[#FAF5EF]/90 font-body font-medium leading-snug">
                  Acesse os 78 arcanos, práticas guiadas, quizzes e o método exclusivo.
                </p>
              </div>
              <ChevronRight className="w-7 h-7 text-[#C8A66A] group-hover:translate-x-1.5 transition-all" />
            </div>
            
            <div className="mt-6 flex items-center justify-center py-3.5 bg-gradient-to-r from-[#C8A66A] to-[#DCCFC2] rounded-xl font-heading text-[13px] font-black text-[#5B1F3D] tracking-[0.2em] uppercase shadow-lg group-hover:brightness-110 transition-all border border-white/20">
              Desbloquear Premium Agora
            </div>
          </div>
        </div>

        {/* ─── Modules Grid ─── */}
        <div className="space-y-12">
          {categoryOrder.map(cat => {
            const mods = grouped[cat];
            if (!mods || mods.length === 0) return null;

            return (
              <section key={cat} className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#C8A66A]/20" />
                  <h2 className="font-heading text-[12px] tracking-[0.2em] uppercase font-bold text-[#5B1F3D]/80">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <span className="h-px flex-1 bg-[#C8A66A]/20" />
                </div>

                <div className="space-y-4">
                  {mods.map((mod) => {
                    const unlocked = bypassLocks || isModuleUnlocked(mod.id, progress.completedModules);
                    const isCompleted = progress.completedModules.includes(mod.id);
                    const prog = getModuleProgress(mod);
                    const isCurrent = unlocked && !isCompleted;
                    const IconComponent = MODULE_ICON_MAP[mod.id] || Sparkles;

                    return (
                      <button
                        key={mod.id}
                        onClick={() => unlocked && navigate(mod.route)}
                        disabled={!unlocked}
                        className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-500 relative group overflow-hidden ${
                          isCurrent 
                            ? "bg-white border-[#C8A66A] shadow-2xl shadow-[#C8A66A]/20 scale-[1.02] ring-1 ring-[#C8A66A]/30" 
                            : unlocked 
                            ? "bg-white/90 border-[#DCCFC2]/40 hover:bg-white hover:border-[#C8A66A]/50 active:scale-[0.98] shadow-md" 
                            : "bg-[#F3E6E0]/60 border-[#DCCFC2]/40 opacity-100 cursor-not-allowed grayscale-[0.3]"
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C8A66A]" />
                        )}
                        
                        <div className="flex items-center gap-6 relative z-10">
                          {/* Icon Circle */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 shadow-sm ${
                            isCurrent 
                              ? "bg-[#C8A66A]/15 border-[#C8A66A] text-[#5B1F3D] scale-110 rotate-3 shadow-lg" 
                              : unlocked 
                              ? "bg-[#FAF5EF] border-[#DCCFC2] text-[#5B1F3D]" 
                              : "bg-[#FAF5EF]/80 border-[#C8A66A]/30 text-[#5B1F3D]/60"
                          }`}>
                            {isCompleted ? (
                              <Check className="w-6 h-6 text-[#5B1F3D]" strokeWidth={3} />
                            ) : unlocked ? (
                              <IconComponent className="w-7 h-7" />
                            ) : (
                              <div className="relative">
                                <IconComponent className="w-7 h-7 opacity-30" />
                                <LockKeyhole className="w-4 h-4 absolute -bottom-1 -right-1 text-[#C8A66A] drop-shadow-sm" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="text-[10px] font-bold tracking-widest text-[#C8A66A]">{mod.symbol}</span>
                              <h3 className={`font-heading text-lg tracking-tight leading-tight ${
                                isCurrent 
                                  ? "text-[#5B1F3D] font-black" 
                                  : unlocked 
                                  ? "text-[#5B1F3D] font-bold" 
                                  : "text-[#5B1F3D]/85 font-bold"
                              }`}>
                                {mod.name}
                              </h3>
                              
                              <div className="ml-auto flex items-center gap-1.5">
                                {mod.id === "arcanos-maiores" && (
                                  <span className="text-[9px] font-heading tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#C8A66A]/20 text-[#5B1F3D] border border-[#C8A66A]/30 font-bold shadow-sm">
                                    Grátis
                                  </span>
                                )}
                                {!unlocked && !isCompleted && mod.id !== "arcanos-maiores" && (
                                  <span className="text-[9px] font-heading tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#5B1F3D]/10 text-[#5B1F3D] border border-[#5B1F3D]/20 font-black flex items-center gap-1">
                                    <KeyRound className="w-2.5 h-2.5 text-[#C8A66A]" />
                                    Premium
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-[9px] font-heading tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#5B1F3D]/5 text-[#5B1F3D] border border-[#5B1F3D]/10 font-bold shadow-sm">
                                    Concluído
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className={`text-[12px] font-body line-clamp-1 leading-relaxed ${
                              unlocked ? "text-[#5B1F3D]/80 font-medium" : "text-[#5B1F3D]/60 font-medium italic"
                            }`}>
                              {mod.id === "arcanos-maiores" && progress.completedLessons.length === 0 
                                ? "Inicie sua jornada no portal sagrado." 
                                : mod.subtitle}
                            </p>
                            
                            {isCurrent && prog > 0 && (
                              <div className="mt-4 h-1.5 rounded-full bg-[#C8A66A]/10 overflow-hidden border border-[#C8A66A]/5">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] transition-all duration-1000 shadow-[0_0_8px_rgba(200,166,106,0.3)]" 
                                  style={{ width: `${prog}%` }} 
                                />
                              </div>
                            )}
                          </div>

                          {unlocked && (
                            <ChevronRight className={`w-5 h-5 transition-all duration-300 group-hover:translate-x-1.5 ${
                              isCurrent ? "text-[#C8A66A]" : "text-[#5B1F3D]/20"
                            }`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="pt-16 pb-8 flex justify-center">
          <img src={ornamentDivider} alt="" className="w-28 opacity-30" />
        </div>
      </main>
    </div>
  );
};

export default ModulesPage;