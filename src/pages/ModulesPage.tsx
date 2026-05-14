import { useNavigate, Link } from "react-router-dom";
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
  Stars,
  MapPin
} from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { 
  MODULES_CATALOG as MODULES, 
  isModuleUnlocked, 
  type LearningModule, 
  type ModuleCategory 
} from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useHeader } from "@/contexts/header-context";
import { useEffect, useState } from "react";
import ContinuityCard from "@/components/ContinuityCard";
import ProgressCelebration from "@/components/ProgressCelebration";
import { SmartReviewCard } from "@/components/SmartReviewCard";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgEstrela from "@/assets/arcano-17-estrela.jpg";

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  "foundation": "Trilha 1 · Fundamentos",
  "major-arcana": "Trilha 2 · Arcanos Maiores",
  "minor-arcana": "Trilha 3 · Arcanos Menores",
  "advanced": "Trilha 4 · Métodos e Combinações",
  "practice": "Trilha 5 · Prática Guiada",
  "professional": "Trilha 6 · Formação Profissional",
};

const MODULE_ICON_MAP: Record<string, string> = {
  "fundamentos": "Compass",
  "leitura-simbolica": "Eye",
  "arcanos-maiores": "Stars",
  "arquitetura-menores": "Layers",
  "copas": "copas",
  "paus": "paus",
  "espadas": "espadas",
  "ouros": "ouros",
  "cartas-corte": "Crown",
  "combinacoes": "GitBranch",
  "tiragens": "Layout",
  "espiritualidade": "Moon",
  "mesa-taro": "SquareStack",
  "leitura-aplicada": "Target",
  "pratica": "Sparkles",
  "trabalhar-taro": "Briefcase",
};

const ModulesPage = () => {
  const navigate = useNavigate();
  
  const { progress, loading: progressLoading } = useProgress();
  const { bypassLocks } = useAccess();
  const { setHeader, resetHeader } = useHeader();
  
  useEffect(() => {
    setHeader({
      title: "Tarô 78 Chaves",
      subtitle: "Formação 78 Arcanos",
    });
    return () => resetHeader();
  }, []);

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

  const totalArcanosCount = 78;
  const completedMaiores = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
  const completedMenores = progress.completedLessons.filter(l => 
    l.startsWith("copas-") || l.startsWith("paus-") || l.startsWith("espadas-") || l.startsWith("ouros-")
  ).length;
  const totalCompletedArcanos = completedMaiores + completedMenores;
  const globalProgressPct = Math.round((totalCompletedArcanos / totalArcanosCount) * 100);

  return (
    <div className="relative overflow-hidden">
      <main className="relative z-10 container max-w-lg px-6 pt-10 pb-24 md:pt-16 md:pb-32 space-y-12 md:space-y-16">
        {/* ─── Global Training Progress — Dashboard style ─── */}
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-10 transition-all duration-500" style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
          backdropFilter: "blur(24px)",
          border: "2.5px solid #C8A66A",
          boxShadow: "0 30px 70px rgba(91, 31, 61, 0.08), 0 0 40px rgba(200, 166, 106, 0.1)"
        }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#C8A66A30]" style={{
                background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                boxShadow: "0 10px 25px rgba(91, 31, 61, 0.25)"
              }}>
                <TarotIcon name="SquareStack" className="w-7 h-7 text-[#C8A66A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-heading font-black tracking-[0.3em] text-[#C8A66A] uppercase">Progresso Geral</span>
                <span className="text-lg font-heading font-black text-[#5B1F3D]">Formação Tarô 78 Chaves</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-heading font-black text-[#5B1F3D]">{progress.level}</span>
              <span className="text-[14px] font-black text-[#5B1F3D]/30 ml-1">Nível</span>
            </div>
          </div>
          
          <div className="h-4 rounded-full overflow-hidden p-[2.5px]" style={{ 
            background: "#E8DED3", 
            border: "1.5px solid rgba(209, 196, 181, 0.6)" 
          }}>
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${Math.max(globalProgressPct, 2)}%` }}
            >
              <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
            </div>
          </div>
          
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-[14px] font-body font-black text-[#5B1F3D]/70 italic text-center leading-relaxed">
              Você já domina {totalCompletedArcanos} das 78 chaves do tarô ({globalProgressPct}%).
            </p>
            
            <button
              onClick={() => navigate("/trilhas")}
              className="w-full py-4 rounded-2xl bg-[#5B1F3D] text-[#FAF5EF] font-heading text-[11px] tracking-[0.3em] uppercase font-black shadow-lg hover:bg-[#3D1429] transition-all flex items-center justify-center gap-2 border-2 border-[#C8A66A]/30"
            >
              Ver Mapa Completo da Formação <ChevronRight className="w-4 h-4 text-[#C8A66A]" />
            </button>
          </div>
        </div>

        <ProgressCelebration xp={progress.xp} level={progress.level} streak={progress.streak} completedLessons={progress.completedLessons.length} />
        
        <div className="space-y-8 md:space-y-12">
          {/* ─── Dashboard Actions ─── */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/desafios")}
              className="group relative overflow-hidden rounded-[2rem] p-6 text-center border-2 border-[#C8A66A]/30 bg-white transition-all hover:scale-[1.03] active:scale-95 shadow-lg"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Sparkles className="w-8 h-8 text-[#5B1F3D]" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FAF5EF] border border-[#C8A66A]/20 flex items-center justify-center group-hover:bg-[#5B1F3D] group-hover:text-white transition-all">
                  <TarotIcon name="ritual" className="w-6 h-6 text-[#C8A66A]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]">Diário</span>
                  <p className="font-heading text-sm font-black text-[#5B1F3D]">Ritual Diário</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/trilhas")}
              className="group relative overflow-hidden rounded-[2rem] p-6 text-center border-2 border-[#C8A66A]/30 bg-white transition-all hover:scale-[1.03] active:scale-95 shadow-lg"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <MapPin className="w-8 h-8 text-[#5B1F3D]" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FAF5EF] border border-[#C8A66A]/20 flex items-center justify-center group-hover:bg-[#5B1F3D] group-hover:text-white transition-all">
                  <TarotIcon name="formacao" className="w-6 h-6 text-[#C8A66A]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]">Formação</span>
                  <p className="font-heading text-sm font-black text-[#5B1F3D]">Mapa da Trilha</p>
                </div>
              </div>
            </button>
          </div>

          {/* ─── Study Trails Selector ─── */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-[#C8A66A]/30" />
              <h2 className="font-heading text-[11px] tracking-[0.4em] uppercase font-black text-[#5B1F3D]">
                Módulos de Estudo
              </h2>
              <span className="h-px flex-1 bg-[#C8A66A]/30" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "foundation", label: "Base", icon: "Compass", color: "linear-gradient(135deg, #F3E6E0, #FAF5EF)" },
                { id: "major-arcana", label: "Maiores", icon: "Stars", color: "linear-gradient(135deg, #FAF5EF, #F5EBDE)" },
                { id: "minor-arcana", label: "Menores", icon: "Layers", color: "linear-gradient(135deg, #E8DED3, #FAF5EF)" },
                { id: "advanced", label: "Métodos", icon: "Layout", color: "linear-gradient(135deg, #DCCFC2, #FAF5EF)" },
                { id: "practice", label: "Prática", icon: "Sparkles", color: "linear-gradient(135deg, #FAF5EF, #F3E6E0)" },
                { id: "professional", label: "Ofício", icon: "Briefcase", color: "linear-gradient(135deg, #F3E6E0, #E8DED3)" },
              ].map((trail) => (
                <button
                  key={trail.id}
                  onClick={() => {
                    const el = document.getElementById(`cat-${trail.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-[2rem] border-2 border-[#C8A66A]/20 bg-white/60 hover:bg-white transition-all shadow-md hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#C8A66A]/10 group-hover:scale-110 transition-all duration-500 group-hover:bg-[#5B1F3D] group-hover:shadow-[0_8px_20px_rgba(91,31,61,0.3)] shadow-inner`} style={{ background: trail.color }}>
                    <TarotIcon name={trail.icon} className="w-7 h-7 text-[#5B1F3D] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D] group-hover:text-[#C8A66A] transition-colors">
                    {trail.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <SmartReviewCard />
          
          {progress.completedLessons.length === 0 ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#5B1F3D] border-2 border-[#C8A66A] rounded-[2.5rem] p-8 text-center space-y-4 relative overflow-hidden group shadow-2xl ring-8 ring-[#C8A66A]/5">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C8A66A]/20 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-4">
                  <p className="text-[11px] font-heading tracking-[0.4em] uppercase font-black text-white/80">✦ Portal de Início ✦</p>
                  <h3 className="font-heading text-2xl md:text-3xl text-white font-black tracking-tight leading-tight">Começar Jornada: <br/>O Louco</h3>
                  <p className="text-[15px] font-body font-bold text-white/90 italic leading-relaxed">
                    O primeiro portal da sua travessia grátis. <br/>
                    <span className="text-white/70 not-italic block mt-1 uppercase tracking-widest text-[10px] font-bold">Vá bem e desbloqueie O Mago.</span>
                  </p>
                  <Link 
                    to="/lesson/0"
                    className="block w-full py-5 bg-[#C8A66A] hover:bg-[#C8A66A]/90 text-[#5B1F3D] rounded-2xl font-heading text-[12px] font-black tracking-[0.3em] uppercase transition-all shadow-xl hover:scale-[1.02] active:scale-[0.95]"
                  >
                    ABRIR PORTAL DO LOUCO
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ContinuityCard 
                lastLessonId={null} 
                lastLessonName={null} 
                completedLessons={progress.completedLessons.length} 
                completedQuizzes={progress.completedQuizzes.length} 
                hasUnfinishedReview={false} 
                completedLessonIds={progress.completedLessons} 
                currentModuleId="arcanos-maiores" 
              />
            </div>
          )}

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
                  A Jornada dos 78 Arcanos
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
              <section key={cat} id={`cat-${cat}`} className="space-y-6 md:space-y-10 scroll-mt-24">
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
                    const iconName = MODULE_ICON_MAP[mod.id] || "Sparkles";

                    return (
                      <button
                        key={mod.id}
                        onClick={() => unlocked && navigate(mod.route)}
                        disabled={!unlocked}
                        className={`w-full text-left p-8 md:p-10 rounded-[3rem] border-2 transition-all duration-500 relative group overflow-hidden ${
                          isCurrent 
                            ? "bg-white border-[#C8A66A] shadow-2xl shadow-[#C8A66A]/30 scale-[1.02] ring-2 ring-[#C8A66A]/40" 
                            : unlocked 
                            ? "bg-white border-[#DCCFC2]/60 hover:border-[#C8A66A]/50 active:scale-[0.98] shadow-xl hover:shadow-2xl" 
                            : "bg-[#F3E6E0]/50 border-[#DCCFC2]/40 opacity-90 cursor-not-allowed grayscale-[0.3]"
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#C8A66A] to-transparent" />
                        )}
                        
                        <div className="flex items-center gap-8 md:gap-12 relative z-10">
                          {/* Icon Circle */}
                          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.8rem] flex items-center justify-center shrink-0 border-2 transition-all duration-500 shadow-lg ${
                            isCurrent 
                              ? "bg-gradient-to-br from-[#5B1F3D] to-[#3D1429] border-[#C8A66A] text-[#FAF5EF] scale-110 rotate-3 shadow-2xl" 
                              : unlocked 
                              ? "bg-[#FAF5EF] border-[#C8A66A30] text-[#5B1F3D]" 
                              : "bg-[#F3E6E0] border-[#DCCFC2]/20 text-[#5B1F3D]/30"
                          }`}>
                            {isCompleted ? (
                              <Check className={`w-10 h-10 md:w-12 md:h-12 ${isCurrent ? "text-[#C8A66A]" : "text-[#5B1F3D]"}`} strokeWidth={4} />
                            ) : unlocked ? (
                              <TarotIcon name={iconName} className={`w-10 h-10 md:w-12 md:h-12 ${isCurrent ? "text-[#C8A66A]" : "text-[#5B1F3D]"}`} />
                            ) : (
                              <div className="relative">
                                <TarotIcon name={iconName} className="w-10 h-10 md:w-12 md:h-12 opacity-20" />
                                <TarotIcon name="bloqueado" className="w-8 h-8 absolute -bottom-2 -right-2 text-[#5B1F3D] drop-shadow-xl" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 py-2">
                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                              <span className={`text-[14px] md:text-[16px] font-black tracking-[0.4em] transition-colors ${isCurrent ? "text-[#C8A66A]" : "text-[#5B1F3D] opacity-40"}`}>{mod.symbol}</span>
                              <h3 className={`font-heading text-2xl md:text-3xl tracking-tight leading-tight transition-all ${
                                isCurrent 
                                  ? "text-[#5B1F3D] font-black" 
                                  : unlocked 
                                  ? "text-[#5B1F3D] font-black" 
                                  : "text-[#5B1F3D]/60 font-black"
                              }`}>
                                {mod.name}
                              </h3>
                              
                              <div className="ml-auto flex items-center gap-2">
                                {mod.id === "arcanos-maiores" && (
                                  <span className="text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase px-4 py-2 rounded-xl bg-gold/10 text-plum border border-gold/40 font-black shadow-sm">
                                    Início Grátis
                                  </span>
                                )}
                                {!unlocked && !isCompleted && mod.id !== "arcanos-maiores" && (
                                  <span className="text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase px-4 py-2 rounded-xl bg-[#5B1F3D] text-white border border-[#C8A66A] font-black flex items-center gap-2 shadow-lg">
                                    <KeyRound className="w-3.5 h-3.5 text-[#C8A66A]" />
                                    Premium
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-[10px] md:text-[11px] font-heading tracking-[0.2em] uppercase px-4 py-2 rounded-xl bg-[#DCCFC2]/30 text-[#5B1F3D]/80 border border-[#DCCFC2]/50 font-black shadow-sm">
                                    Concluído
                                  </span>
                                )}
                              </div>
                            </div>
                            
                             <p className={`text-[14px] md:text-[16px] font-body line-clamp-1 leading-relaxed ${
                              unlocked ? "text-[#5B1F3D]/85 font-bold" : "text-[#5B1F3D]/60 font-bold italic"
                            }`}>
                              {mod.id === "arcanos-maiores"
                                ? "O Mapa da Jornada do Louco." 
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

        <div className="pt-20 pb-48 md:pb-64 flex justify-center opacity-30">
          ✦ ✦ ✦
        </div>
      </main>
    </div>
  );
};

export default ModulesPage;