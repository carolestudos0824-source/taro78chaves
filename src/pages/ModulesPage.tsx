import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Key, 
  KeyRound, 
  Eye, 
  Moon, 
  Droplets, 
  Gem, 
  Swords, 
  Crown, 
  Layers, 
  Compass,
  LockKeyhole,
  GitBranch,
  Layout,
  Target,
  Briefcase,
  SquareStack,
  Stars
} from "lucide-react";
import { 
  MODULES_CATALOG as MODULES, 
  isModuleUnlocked, 
  type LearningModule, 
  type ModuleCategory 
} from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { Header } from "@/components/Header";
import BetaWelcomeBanner from "@/components/BetaWelcomeBanner";
import ContinuityCard from "@/components/ContinuityCard";
import ProgressCelebration from "@/components/ProgressCelebration";
import { SmartReviewCard } from "@/components/SmartReviewCard";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgEstrela from "@/assets/arcano-17-estrela.jpg";

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  "foundation": "O Portal de Entrada",
  "major-arcana": "A Jornada da Alma",
  "minor-arcana": "A Estrutura do Tarô",
  "advanced": "Leituras Profundas",
  "practice": "O Ritual Vivo",
  "professional": "O Ofício e Autoridade",
};

const MODULE_ICON_MAP: Record<string, any> = {
  "fundamentos": Compass,
  "leitura-simbolica": Eye,
  "arcanos-maiores": Stars,
  "arquitetura-menores": Layers,
  "copas": Droplets,
  "paus": Flame,
  "espadas": Swords,
  "ouros": Gem,
  "cartas-corte": Crown,
  "combinacoes": GitBranch,
  "tiragens": Layout,
  "espiritualidade": Moon,
  "mesa-taro": SquareStack,
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
    <div className="min-h-screen bg-[#FAF5EF]">
      <Header streak={progress.streak} xp={progress.xp} level={progress.level} />

      <main className="container max-w-lg px-6 pt-10 pb-24 md:pt-16 md:pb-32 space-y-12 md:space-y-20">
        <ProgressCelebration xp={progress.xp} level={progress.level} streak={progress.streak} completedLessons={progress.completedLessons.length} />
        
        <div className="space-y-8 md:space-y-12">
          <BetaWelcomeBanner />
          <SmartReviewCard />
          
          {progress.completedLessons.length === 0 && (
            <div className="bg-[#F3E6E0] border-2 border-[#C8A66A]/30 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden group shadow-md ring-4 ring-[#C8A66A]/5">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#C8A66A]" />
              <p className="text-[15px] font-black text-[#5B1F3D] italic leading-relaxed relative z-10">
                ✦ Comece pelo Louco grátis. Vá bem e desbloqueie O Mago. <br/>
                <span className="text-[#C8A66A] font-black not-italic block mt-1 uppercase tracking-widest text-xs">Continue sua Jornada Viva.</span>
              </p>
            </div>
          )}
          
          {/* ─── Hero Visuals ─── */}
          <div className="flex justify-center -space-x-4 py-4 md:py-6 opacity-90 scale-100">
            <img src={imgLouco} alt="" className="w-24 rounded-2xl shadow-xl -rotate-12 border-2 border-white/50" />
            <img src={imgSacerdotisa} alt="" className="w-24 rounded-2xl shadow-xl z-10 border-2 border-white" />
            <img src={imgEstrela} alt="" className="w-24 rounded-2xl shadow-xl rotate-12 border-2 border-white/50" />
          </div>
          
          <div className="space-y-6">
            <ContinuityCard 
              lastLessonId={null} 
              lastLessonName={null} 
              completedLessons={progress.completedLessons.length} 
              completedQuizzes={progress.completedQuizzes.length} 
              hasUnfinishedReview={false} 
              completedLessonIds={progress.completedLessonIds || progress.completedLessons} 
              currentModuleId="arcanos-maiores" 
            />
          </div>

          {/* ─── Premium Conversion Card ─── */}
          <div 
            onClick={() => navigate("/premium")}
            className="cursor-pointer bg-[#5B1F3D] border-2 border-[#C8A66A]/50 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.03] active:scale-[0.98] ring-4 ring-[#C8A66A]/10"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C8A66A]/20 rounded-full blur-3xl group-hover:bg-[#C8A66A]/30 transition-colors" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FAF5EF]/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#C8A66A] flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 transition-transform duration-500 border-2 border-[#FAF5EF]/30">
                <Key className="w-9 h-9 text-[#5B1F3D]" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl md:text-2xl font-black text-white leading-tight mb-2">
                  Receba as 78 Chaves
                </h3>
                <p className="text-[14px] text-white/95 font-body font-bold leading-relaxed italic">
                  Abra as portas mais profundas e continue a Jornada do Louco.
                </p>
              </div>
              <ChevronRight className="w-8 h-8 text-[#C8A66A] group-hover:translate-x-2 transition-all" />
            </div>
            
            <div className="mt-6 flex items-center justify-center py-4 bg-gradient-to-r from-[#C8A66A] to-[#DCCFC2] rounded-2xl font-heading text-[14px] font-black text-[#5B1F3D] tracking-[0.3em] uppercase shadow-xl group-hover:brightness-110 transition-all border-2 border-white/30">
              Desbloquear Jornada Completa
            </div>
          </div>
        </div>

        {/* ─── Modules Grid ─── */}
        <div className="space-y-12 md:space-y-20">
          {categoryOrder.map(cat => {
            const mods = grouped[cat];
            if (!mods || mods.length === 0) return null;

            return (
              <section key={cat} className="space-y-6 md:space-y-10">
                <div className="flex items-center gap-6">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A66A]/30" />
                  <h2 className="font-heading text-[11px] md:text-[14px] tracking-[0.4em] uppercase font-black text-[#5B1F3D]/80">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A]/30" />
                </div>

                <div className="grid gap-6 md:gap-8">
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
                        className={`w-full text-left p-7 md:p-9 rounded-[2.5rem] border-2 transition-all duration-500 relative group overflow-hidden ${
                          isCurrent 
                            ? "bg-white border-[#C8A66A] shadow-2xl shadow-[#C8A66A]/30 scale-[1.02] ring-1 ring-[#C8A66A]/40" 
                            : unlocked 
                            ? "bg-white border-[#DCCFC2]/60 hover:border-[#C8A66A]/50 active:scale-[0.98] shadow-lg hover:shadow-xl" 
                            : "bg-[#F3E6E0]/50 border-[#DCCFC2]/40 opacity-90 cursor-not-allowed grayscale-[0.3]"
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C8A66A]" />
                        )}
                        
                        <div className="flex items-center gap-7 md:gap-10 relative z-10">
                          {/* Icon Circle */}
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 shadow-md ${
                            isCurrent 
                              ? "bg-gradient-to-br from-[#C8A66A]/20 to-[#C8A66A]/5 border-[#C8A66A] text-[#5B1F3D] scale-110 rotate-3 shadow-xl" 
                              : unlocked 
                              ? "bg-[#FAF5EF] border-[#DCCFC2]/40 text-[#5B1F3D]" 
                              : "bg-[#F3E6E0] border-[#DCCFC2]/20 text-[#5B1F3D]/30"
                          }`}>
                            {isCompleted ? (
                              <Check className="w-8 h-8 md:w-10 md:h-10 text-[#5B1F3D]" strokeWidth={3.5} />
                            ) : unlocked ? (
                              <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
                            ) : (
                              <div className="relative">
                                <IconComponent className="w-8 h-8 md:w-10 md:h-10 opacity-20" />
                                <LockKeyhole className="w-6 h-6 absolute -bottom-1 -right-1 text-[#5B1F3D] drop-shadow-md" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 py-2">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="text-[12px] md:text-[14px] font-black tracking-[0.3em] text-[#C8A66A] opacity-80">{mod.symbol}</span>
                              <h3 className={`font-heading text-xl md:text-2xl tracking-tight leading-tight transition-all ${
                                isCurrent 
                                  ? "text-[#5B1F3D] font-black" 
                                  : unlocked 
                                  ? "text-[#5B1F3D] font-bold" 
                                  : "text-[#5B1F3D]/60 font-bold"
                              }`}>
                                {mod.name}
                              </h3>
                              
                              <div className="ml-auto flex items-center gap-2">
                                {mod.id === "arcanos-maiores" && (
                                  <span className="text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase px-4 py-2 rounded-xl bg-[#FAF5EF] text-[#C8A66A] border border-[#C8A66A]/40 font-black shadow-sm">
                                    Grátis
                                  </span>
                                )}
                                {!unlocked && !isCompleted && mod.id !== "arcanos-maiores" && (
                                  <span className="text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase px-4 py-2 rounded-xl bg-[#5B1F3D] text-white border border-[#C8A66A] font-black flex items-center gap-2 shadow-lg">
                                    <KeyRound className="w-3.5 h-3.5 text-[#C8A66A]" />
                                    Premium
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase px-4 py-2 rounded-xl bg-[#DCCFC2]/30 text-[#5B1F3D]/60 border border-[#DCCFC2]/50 font-black shadow-sm">
                                    Concluído
                                  </span>
                                )}
                              </div>
                            </div>
                            
                             <p className={`text-[14px] md:text-[16px] font-body line-clamp-1 leading-relaxed ${
                              unlocked ? "text-[#5B1F3D]/70 font-semibold" : "text-[#5B1F3D]/50 font-bold italic"
                            }`}>
                              {mod.id === "arcanos-maiores" && progress.completedLessons.length === 0 
                                ? "Abra o primeiro portal do Louco." 
                                : mod.id === "fundamentos" ? "As chaves iniciais do seu templo." : mod.subtitle}
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

        <div className="pt-16 pb-8 flex justify-center opacity-30">
          ✦ ✦ ✦
        </div>
      </main>
    </div>
  );
};

export default ModulesPage;