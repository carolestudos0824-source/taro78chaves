import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Lock, Check, Star, Sparkles, Crown, Compass, Key } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useHeader } from "@/contexts/header-context";
import { useEffect } from "react";
import { MODULES_CATALOG as MODULES, isModuleUnlocked } from "@/lib/content";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgMago from "@/assets/arcano-1-mago.jpg";

interface TrailLevel {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  accentBorder: string;
  modules: string[]; // module IDs
  /** IDs of levels that must be complete to unlock */
  prerequisites: string[];
}

const TRAIL_LEVELS: TrailLevel[] = [
  {
    id: "iniciante",
    level: 1,
    title: "Portal 1 — Iniciante",
    subtitle: "Desperte sua conexão com o Tarô",
    icon: "formacao",
    accentColor: "hsl(36 45% 58%)",
    accentBorder: "hsl(36 45% 58% / 0.30)",
    modules: ["fundamentos", "leitura-simbolica", "arcanos-maiores"],
    prerequisites: [],
  },
  {
    id: "intermediario",
    level: 2,
    title: "Portal 2 — Intermediário",
    subtitle: "Domine todas as cartas e técnicas",
    icon: "rainha",
    accentColor: "hsl(340 42% 30%)",
    accentBorder: "hsl(340 42% 30% / 0.30)",
    modules: ["arquitetura-menores", "copas", "paus", "espadas", "ouros", "cartas-corte"],
    prerequisites: ["iniciante"],
  },
  {
    id: "avancado",
    level: 3,
    title: "Portal 3 — Avançado",
    subtitle: "Domine combinações, tiragens e espiritualidade",
    icon: "Stars",
    accentColor: "hsl(280 35% 45%)",
    accentBorder: "hsl(280 35% 45% / 0.30)",
    modules: ["combinacoes", "tiragens", "espiritualidade", "mesa-taro"],
    prerequisites: ["intermediario"],
  },
  {
    id: "profissional",
    level: 4,
    title: "Portal 4 — Profissional",
    subtitle: "Torne-se uma leitora formada",
    icon: "rei",
    accentColor: "hsl(36 50% 42%)",
    accentBorder: "hsl(36 50% 42% / 0.30)",
    modules: ["leitura-aplicada", "pratica", "trabalhar-taro"],
    prerequisites: ["avancado"],
  },
];

const TrailsPage = () => {
  const navigate = useNavigate();
  const { progress, loading: progressLoading } = useProgress();
  const { bypassLocks, loading: accessLoading } = useAccess();
  const { setHeader, resetHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "Trilhas de Formação",
      subtitle: "Mapa da Maestria",
      backRoute: "/app"
    });
    return () => resetHeader();
  }, []);

  if (progressLoading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-10 h-10 border-4 border-[#C8A66A]/20 border-t-[#5B1F3D] animate-spin rounded-full mx-auto" />
          <p className="text-[11px] text-[#5B1F3D] font-heading tracking-[0.2em] uppercase font-black">Sincronizando Jornada</p>
        </div>
      </div>
    );
  }


  const isLevelComplete = (level: TrailLevel): boolean => {
    return level.modules.every(m => progress.completedModules.includes(m));
  };

  const isLevelUnlocked = (level: TrailLevel): boolean => {
    if (bypassLocks) return true;
    if (level.prerequisites.length === 0) return true;
    return level.prerequisites.every(preId => {
      const pre = TRAIL_LEVELS.find(t => t.id === preId);
      return pre ? isLevelComplete(pre) : false;
    });
  };

  const getLevelProgress = (level: TrailLevel): number => {
    const completed = level.modules.filter(m => progress.completedModules.includes(m)).length;
    return Math.round((completed / level.modules.length) * 100);
  };

  // Find the single absolute next module in the entire journey
  const allModulesOrdered = TRAIL_LEVELS.flatMap(l => l.modules);
  const nextGlobalModuleId = allModulesOrdered.find(mId => !progress.completedModules.includes(mId));

  // Determine current level
  const currentLevelIdx = TRAIL_LEVELS.findIndex(l => isLevelUnlocked(l) && !isLevelComplete(l));
  const currentLevel = currentLevelIdx >= 0 ? TRAIL_LEVELS[currentLevelIdx] : (progress.completedModules.length === allModulesOrdered.length ? null : TRAIL_LEVELS[0]);

  return (
    <div className="relative w-full max-w-full overflow-x-hidden flex flex-col items-center" id="trails-page-root" style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      {/* Background - kept subtle as main container handles overall bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 0%, hsl(42 70% 80% / 0.15) 0%, transparent 60%)",
      }} />

      <div className="relative w-full max-w-2xl px-4 sm:px-6 pt-6 pb-8 box-border overflow-x-hidden">
        <div className="flex justify-end items-start mb-6">
          <div className="flex -space-x-3 opacity-40">
            <img src={imgLouco} alt="" className="w-8 h-12 sm:w-12 sm:h-18 object-cover rounded-md border border-[#C8A66A]/30 -rotate-12 shadow-lg" />
            <img src={imgMago} alt="" className="w-8 h-12 sm:w-12 sm:h-18 object-cover rounded-md border border-[#C8A66A]/30 rotate-12 shadow-lg" />
          </div>
        </div>

        <div className="text-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#C8A66A]/20">
            <TarotIcon name="formacao" className="w-10 h-10" />
          </div>
          <div className="text-[10px] sm:text-[12px] tracking-[0.3em] sm:tracking-[0.45em] uppercase font-heading font-black mb-2 text-[#5B1F3D]">
            Mapa Curricular
          </div>
          <h1
            className="font-heading text-xl min-[360px]:text-2xl md:text-4xl tracking-tight font-black"
            style={{
              background: "linear-gradient(135deg, #5B1F3D, #C8A66A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Trilhas de Formação
          </h1>
          <p className="font-body text-[12px] min-[360px]:text-[14px] font-bold italic mt-1.5 text-[#5B1F3D]/70 px-4">
            A arquitetura completa da sua maestria no Tarô
          </p>
        </div>
      </div>

      <div className="relative w-full max-w-2xl px-4 sm:px-6 pb-24 space-y-6 box-border overflow-x-hidden">

        {/* Overall progress */}
        <div className="rounded-2xl p-4 sm:p-6 shadow-xl border-2 w-full max-w-full box-border relative overflow-hidden" style={{
          background: "linear-gradient(145deg, #FAF5EF, #F3E6E0)",
          borderColor: "#C8A66A4D",
        }}>
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 min-[360px]:w-4 min-[360px]:h-4 text-[#C8A66A] shrink-0" />
              <h2 className="font-heading text-[9px] min-[360px]:text-[10px] sm:text-sm font-black tracking-[0.2em] uppercase text-[#5B1F3D]">
                Progresso Geral
              </h2>
            </div>
            <span className="font-heading text-[8px] min-[360px]:text-[10px] sm:text-[12px] font-black tracking-widest uppercase px-2 sm:px-4 py-1.5 rounded-full bg-[#5B1F3D] text-[#FAF5EF] shadow-md border border-[#C8A66A40] truncate max-w-[180px] min-[360px]:max-w-none">
              {currentLevel ? `Em fase de ${currentLevel.title.split(' — ')[1] || currentLevel.title}` : (progress.completedModules.length === allModulesOrdered.length ? "Formação Completa ✦" : "Iniciando Jornada")}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 w-full max-w-full">
            {TRAIL_LEVELS.map(level => {
              const prog = getLevelProgress(level);
              const complete = isLevelComplete(level);
              const unlocked = isLevelUnlocked(level);
              return (
                <div key={level.id} className="space-y-2 flex flex-col items-center sm:items-stretch min-w-0">
                  <div className="h-2 sm:h-3 w-full rounded-full overflow-hidden p-[1px]" style={{
                    background: unlocked ? "#E8DED3" : "#DCCFC260",
                    border: `1px solid ${unlocked ? "#C8A66A80" : "#DCCFC2"}`,
                  }}>
                    <div className="h-full rounded-full shadow-[0_0_4px_rgba(200,166,106,0.2)]" style={{
                      width: `${Math.max(prog, complete ? 100 : 0)}%`,
                      background: complete
                        ? `linear-gradient(90deg, ${level.accentColor}, #C8A66A)`
                        : `linear-gradient(90deg, #5B1F3D, #C8A66A)`,
                    }} />
                  </div>
                  <div className="text-[7.5px] min-[360px]:text-[8px] sm:text-[11px] font-heading font-black text-center uppercase tracking-tighter sm:tracking-tight mt-1 truncate w-full" style={{
                    color: unlocked ? "#5B1F3D" : "#5B1F3D60",
                  }}>
                    {level.title.split(" — ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trail levels */}
        {TRAIL_LEVELS.map((level, levelIdx) => {
          const unlocked = isLevelUnlocked(level);
          const complete = isLevelComplete(level);
          const isCurrent = unlocked && !complete;
          const prog = getLevelProgress(level);

          return (
            <div key={level.id}>
              {/* Divider */}
              <div className="flex items-center justify-center mb-3 w-full overflow-hidden">
                <div className="ornament-divider-procedural max-w-full"><div className="ornament-divider-procedural-diamond" /></div>
              </div>

              {/* Level header */}
              <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center gap-3 min-[360px]:gap-4 mb-6">
                <div className="flex items-center gap-3 min-[360px]:gap-4 w-full min-[480px]:w-auto">
                  <div
                    className="w-10 h-10 min-[360px]:w-12 min-[360px]:h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-lg"
                    style={{
                      background: unlocked
                        ? `linear-gradient(135deg, ${level.accentColor}20, #FAF5EF)`
                        : "#DCCFC230",
                      border: `2px solid ${unlocked ? level.accentColor : "#DCCFC260"}`,
                      opacity: unlocked ? 1 : 0.6,
                    }}
                  >
                    {unlocked ? <TarotIcon name={level.icon} className="w-5 h-5 min-[360px]:w-6 min-[360px]:h-6 sm:w-7 sm:h-7" /> : <TarotIcon name="bloqueado" className="w-4 h-4 min-[360px]:w-5 min-[360px]:h-5 sm:w-6 sm:h-6 text-[#5B1F3D40]" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[9px] min-[360px]:text-[9.5px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.35em] uppercase font-heading font-black truncate" style={{
                        color: unlocked ? "#5B1F3D" : "#5B1F3D70",
                      }}>
                        Portal {level.level}
                      </span>
                      {complete && (
                        <span className="text-[8px] min-[360px]:text-[9px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.15em] uppercase font-heading font-black px-1.5 min-[360px]:px-2 sm:px-3 py-1 rounded-lg border-2 border-[#C8A66A]" style={{
                          background: "#FAF5EF",
                          color: "#5B1F3D",
                        }}>
                          Concluído
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[8px] min-[360px]:text-[9px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.15em] uppercase font-heading font-black px-1.5 min-[360px]:px-2 sm:px-3 py-1 rounded-lg border-2 border-[#5B1F3D]" style={{
                          background: "#FAF5EF",
                          color: "#5B1F3D",
                        }}>
                          Em progresso
                        </span>
                      )}
                    </div>
                    <h2 className="font-heading text-[13px] min-[360px]:text-[16px] sm:text-xl font-black tracking-tight truncate" style={{
                      color: unlocked ? "#5B1F3D" : "#5B1F3D60",
                    }}>
                      {level.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full min-[480px]:w-auto min-[480px]:flex-col min-[480px]:items-center shrink-0">
                  <p className="font-body text-[13px] sm:text-[15px] font-black italic min-[480px]:hidden" style={{
                    color: unlocked ? "#5B1F3D95" : "#5B1F3D60",
                  }}>
                    {level.subtitle}
                  </p>
                  {isCurrent && (
                    <div className="flex flex-col items-center">
                      <span className="font-heading text-lg sm:text-2xl font-black text-[#5B1F3D]">
                        {prog}%
                      </span>
                      <span className="text-[8px] font-heading font-black uppercase tracking-widest text-[#5B1F3D]">Chaves</span>
                    </div>
                  )}
                </div>
                <p className="font-body text-[14px] sm:text-[15px] font-black italic mt-1 hidden min-[480px]:block" style={{
                  color: unlocked ? "#5B1F3D95" : "#5B1F3D60",
                }}>
                  {level.subtitle}
                </p>
              </div>

              {/* Module cards */}
              <div className="space-y-4 ml-4 min-[360px]:ml-5 sm:ml-7 border-l-2 pl-3 min-[360px]:pl-4 sm:pl-6" style={{
                borderColor: unlocked ? `${level.accentColor}30` : "#DCCFC230",
              }}>
                {level.modules.map(modId => {
                  const mod = MODULES.find(m => m.id === modId);
                  if (!mod) return null;
                  const modUnlocked = bypassLocks || isModuleUnlocked(mod.id, progress.completedModules);
                  const modComplete = progress.completedModules.includes(mod.id);
                  const modCurrent = modUnlocked && !modComplete;

                  return (
                    <button
                      key={mod.id}
                      onClick={() => modUnlocked && navigate(mod.route)}
                      disabled={!modUnlocked}
                      className="w-full text-left group relative max-w-full"
                    >
                      {modCurrent && (
                        <div className="absolute -left-[20px] min-[360px]:-left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full bg-[#5B1F3D] border-2 border-[#FAF5EF] z-10" />
                      )}
                      <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-2 sm:gap-5 max-w-full overflow-hidden" style={modCurrent ? {
                        background: "linear-gradient(145deg, #FFF, #FAF5EF)",
                        border: `2px solid ${modId === nextGlobalModuleId ? level.accentColor : '#DCCFC2'}`,
                        boxShadow: modId === nextGlobalModuleId ? `0 8px 30px ${level.accentColor}15` : 'none',
                      } : modComplete ? {
                        background: "#FAF5EF90",
                        border: "1px solid #DCCFC240",
                      } : {
                        background: "rgba(220, 207, 194, 0.15)",
                        border: "1.5px solid rgba(220, 207, 194, 0.4)",
                        opacity: 0.95,
                      }}>
                        {/* Status icon */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={modComplete ? {
                          background: "#FAF5EF",
                          border: `1px solid ${level.accentColor}30`,
                        } : modCurrent ? {
                          background: modId === nextGlobalModuleId ? "#5B1F3D" : "#FAF5EF",
                          border: `1.5px solid ${modId === nextGlobalModuleId ? level.accentColor : '#DCCFC2'}`,
                        } : {
                          background: "rgba(220, 207, 194, 0.25)",
                          border: "1.5px solid rgba(220, 207, 194, 0.5)",
                        }}>
                           {modComplete ? (
                            <TarotIcon name="concluido" className="w-5 h-5 sm:w-6 sm:h-6" color={level.accentColor} />
                          ) : modCurrent ? (
                            <div className="relative">
                              <TarotIcon name="premium" className={`w-5 h-5 sm:w-6 sm:h-6 ${modId === nextGlobalModuleId ? 'text-[#C8A66A]' : 'text-[#5B1F3D50]'}`} />
                              {modId === nextGlobalModuleId && <TarotIcon name="Sparkles" className="w-2.5 h-2.5 sm:w-3 sm:h-3 absolute -top-1 -right-1 text-[#C8A66A]" />}
                            </div>
                          ) : (
                            <TarotIcon name="bloqueado" className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B1F3D20]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-heading text-[12px] min-[360px]:text-[14px] sm:text-[15px] font-black tracking-tight truncate" style={{
                              color: modCurrent ? "#5B1F3D" : modComplete ? "#5B1F3D" : "#5B1F3D70",
                            }}>
                              {mod.name}
                            </h3>
                            {modId === nextGlobalModuleId && (
                              <span className="text-[8px] sm:text-[9px] font-heading font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] px-2 sm:px-3 py-1 rounded-lg bg-[#C8A66A] text-white shadow-sm border border-[#5B1F3D10] shrink-0">Próximo</span>
                            )}
                          </div>
                          <p className="font-body text-[13px] font-black italic mt-1" style={{
                            color: modCurrent ? "#5B1F3DBB" : modComplete ? "#5B1F3D90" : "#5B1F3D60",
                          }}>
                            {mod.subtitle}
                          </p>
                        </div>

                        {modUnlocked && (
                          <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" style={{
                            color: modCurrent ? "#C8A66A" : "#DCCFC2",
                          }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Bottom ornament */}
        <div className="flex items-center justify-center pt-6">
          <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
        </div>
      </div>
    </div>
  );
};

export default TrailsPage;
