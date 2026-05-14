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
    title: "Iniciante",
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
    title: "Intermediário",
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
    title: "Avançado",
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
    title: "Profissional",
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
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  const { setHeader, resetHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "Mapa da Formação",
      subtitle: "Sua jornada rumo à maestria",
      backRoute: "/app"
    });
    return () => resetHeader();
  }, []);

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
  const currentLevel = currentLevelIdx >= 0 ? TRAIL_LEVELS[currentLevelIdx] : null;

  return (
    <div className="relative">
      {/* Background - kept subtle as main container handles overall bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 0%, hsl(42 70% 80% / 0.15) 0%, transparent 60%)",
      }} />

      <div className="relative max-w-2xl mx-auto px-6 pt-10 pb-8">
        <div className="flex justify-end items-start mb-8">
          <div className="flex -space-x-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <img src={imgLouco} alt="" className="w-12 h-18 object-cover rounded-md border border-[#C8A66A]/30 -rotate-12 shadow-lg" />
            <img src={imgMago} alt="" className="w-12 h-18 object-cover rounded-md border border-[#C8A66A]/30 rotate-12 shadow-lg" />
          </div>
        </div>

        <div className="text-center relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#C8A66A]/20">
            <TarotIcon name="formacao" className="w-12 h-12 animate-pulse-slow" />
          </div>
          <div className="text-[11px] tracking-[0.4em] uppercase font-heading font-black mb-2 text-[#5B1F3D]">
            Mapa Curricular
          </div>
          <h1
            className="font-heading text-3xl md:text-4xl tracking-tight font-black"
            style={{
              background: "linear-gradient(135deg, #5B1F3D, #C8A66A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Trilhas de Formação
          </h1>
          <p className="font-body text-[15px] font-bold italic mt-2 text-[#5B1F3D]/70">
            A arquitetura completa da sua maestria no Tarô
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-6">

        {/* Overall progress */}
        <div className="rounded-2xl p-6 shadow-xl border-2" style={{
          background: "linear-gradient(145deg, #FAF5EF, #F3E6E0)",
          borderColor: "#C8A66A4D",
        }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A66A]" />
              <h2 className="font-heading text-xs font-black tracking-[0.2em] uppercase text-[#5B1F3D]">
                Progresso Geral
              </h2>
            </div>
            <span className="font-heading text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-[#5B1F3D] text-[#FAF5EF]">
              {currentLevel ? `Nível ${currentLevel.level} • ${currentLevel.title}` : "Completo ✦"}
            </span>
          </div>
          <div className="flex gap-2">
            {TRAIL_LEVELS.map(level => {
              const prog = getLevelProgress(level);
              const complete = isLevelComplete(level);
              const unlocked = isLevelUnlocked(level);
              return (
                <div key={level.id} className="flex-1 space-y-2">
                  <div className="h-3 rounded-full overflow-hidden p-[1px]" style={{
                    background: unlocked ? "#DCCFC260" : "#DCCFC230",
                    border: `1px solid ${unlocked ? "#C8A66A50" : "#DCCFC240"}`,
                  }}>
                    <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(200,166,106,0.3)]" style={{
                      width: `${Math.max(prog, complete ? 100 : 0)}%`,
                      background: complete
                        ? `linear-gradient(90deg, ${level.accentColor}, #C8A66A)`
                        : `linear-gradient(90deg, #5B1F3D, #C8A66A)`,
                    }} />
                  </div>
                  <div className="text-[10px] font-heading font-black text-center uppercase tracking-tighter" style={{
                    color: unlocked ? "#5B1F3D" : "#5B1F3D60",
                  }}>
                    {level.title}
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
              <div className="flex items-center justify-center mb-3">
                <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
              </div>

              {/* Level header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg transition-transform duration-500 hover:rotate-3"
                  style={{
                    background: unlocked
                      ? `linear-gradient(135deg, ${level.accentColor}20, #FAF5EF)`
                      : "#DCCFC230",
                    border: `2px solid ${unlocked ? level.accentColor : "#DCCFC260"}`,
                    opacity: unlocked ? 1 : 0.6,
                  }}
                >
                  {unlocked ? level.icon : <Lock className="w-6 h-6 text-[#5B1F3D40]" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-heading font-black" style={{
                      color: unlocked ? "#5B1F3D" : "#5B1F3D40",
                    }}>
                      Portal {level.level}
                    </span>
                    {complete && (
                      <span className="text-[10px] tracking-[0.1em] uppercase font-heading font-black px-2 py-0.5 rounded-md border border-[#C8A66A]" style={{
                        background: "#FAF5EF",
                        color: "#5B1F3D",
                      }}>
                        Concluído
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] tracking-[0.1em] uppercase font-heading font-black px-2 py-0.5 rounded-md border border-[#5B1F3D]" style={{
                        background: "#FAF5EF",
                        color: "#5B1F3D",
                      }}>
                        Em progresso
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-xl font-black tracking-tight" style={{
                    color: unlocked ? "#5B1F3D" : "#5B1F3D60",
                  }}>
                    {level.title}
                  </h2>
                  <p className="font-body text-sm font-bold italic" style={{
                    color: unlocked ? "#5B1F3D" : "#5B1F3D40",
                  }}>
                    {level.subtitle}
                  </p>
                </div>
                {isCurrent && (
                  <div className="flex flex-col items-center shrink-0">
                    <span className="font-heading text-xl font-black text-[#5B1F3D]">
                      {prog}%
                    </span>
                    <span className="text-[8px] font-heading font-black uppercase tracking-widest text-[#5B1F3D]">Chaves</span>
                  </div>
                )}
              </div>

              {/* Module cards */}
              <div className="space-y-4 ml-7 border-l pl-6" style={{
                borderColor: unlocked ? `${level.accentColor}20` : "#DCCFC230",
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
                      className="w-full text-left group transition-all duration-500 relative"
                    >
                      {modCurrent && (
                        <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#5B1F3D] border-2 border-[#FAF5EF] z-10 animate-pulse" />
                      )}
                      <div className="rounded-2xl p-5 flex items-center gap-5 transition-all duration-500 group-hover:translate-x-1" style={modCurrent ? {
                        background: "linear-gradient(145deg, #FFF, #FAF5EF)",
                        border: `2px solid ${modId === nextGlobalModuleId ? level.accentColor : '#DCCFC2'}`,
                        boxShadow: modId === nextGlobalModuleId ? `0 8px 30px ${level.accentColor}15` : 'none',
                      } : modComplete ? {
                        background: "#FAF5EF90",
                        border: "1px solid #DCCFC240",
                      } : {
                        background: "#DCCFC210",
                        border: "1px solid #DCCFC220",
                        opacity: 0.8,
                      }}>
                        {/* Status icon */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110" style={modComplete ? {
                          background: "#FAF5EF",
                          border: `1px solid ${level.accentColor}30`,
                        } : modCurrent ? {
                          background: modId === nextGlobalModuleId ? "#5B1F3D" : "#FAF5EF",
                          border: `1.5px solid ${modId === nextGlobalModuleId ? level.accentColor : '#DCCFC2'}`,
                        } : {
                          background: "#DCCFC220",
                          border: "1px solid #DCCFC240",
                        }}>
                          {modComplete ? (
                            <Check className="w-6 h-6" style={{ color: level.accentColor }} />
                          ) : modCurrent ? (
                            <div className="relative">
                              <Key className={`w-6 h-6 ${modId === nextGlobalModuleId ? 'text-[#C8A66A]' : 'text-[#5B1F3D50]'}`} />
                              {modId === nextGlobalModuleId && <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-[#C8A66A] animate-pulse" />}
                            </div>
                          ) : (
                            <Lock className="w-5 h-5 text-[#5B1F3D20]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading text-[15px] font-black tracking-tight truncate" style={{
                              color: modCurrent ? "#5B1F3D" : modComplete ? "#5B1F3D95" : "#5B1F3D40",
                            }}>
                              {mod.name}
                            </h3>
                            {modId === nextGlobalModuleId && (
                              <span className="text-[8px] font-heading font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#C8A66A] text-white">Próximo</span>
                            )}
                          </div>
                          <p className="font-body text-xs font-bold italic truncate" style={{
                            color: modCurrent ? "#5B1F3D90" : modComplete ? "#5B1F3D70" : "#5B1F3D35",
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
