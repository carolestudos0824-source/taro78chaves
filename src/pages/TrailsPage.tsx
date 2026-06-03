import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles, ChevronRight, Compass } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useHeader } from "@/contexts/header-context";
import { useEffect } from "react";
import { MODULES_CATALOG as MODULES, isModuleUnlocked, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES } from "@/lib/content";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgMago from "@/assets/arcano-1-mago.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgMundo from "@/assets/arcano-21-mundo.jpg";

interface TrailLevel {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  accentBorder: string;
  modules: string[];
  prerequisites: string[];
  landmarkCardId?: number;
}

const TRAIL_LEVELS: TrailLevel[] = [
  {
    id: "iniciante",
    level: 1,
    title: "Portal 1 — Iniciante",
    subtitle: "Desperte sua conexão com o Tarô",
    icon: "formacao",
    accentColor: "#5B1F3D",
    accentBorder: "#C8A66A4D",
    modules: ["fundamentos", "leitura-simbolica", "arcanos-maiores"],
    prerequisites: [],
    landmarkCardId: 0, // O Louco
  },
  {
    id: "intermediario",
    level: 2,
    title: "Portal 2 — Intermediário",
    subtitle: "Domine todas as cartas e técnicas",
    icon: "rainha",
    accentColor: "#5B1F3D",
    accentBorder: "#C8A66A4D",
    modules: ["arquitetura-menores", "copas", "paus", "espadas", "ouros", "cartas-corte"],
    prerequisites: ["iniciante"],
    landmarkCardId: 1, // O Mago
  },
  {
    id: "avancado",
    level: 3,
    title: "Portal 3 — Avançado",
    subtitle: "Domine combinações, tiragens e espiritualidade",
    icon: "Stars",
    accentColor: "#5B1F3D",
    accentBorder: "#C8A66A4D",
    modules: ["combinacoes", "tiragens", "amor", "espiritualidade", "mesa-taro"],
    prerequisites: ["intermediario"],
    landmarkCardId: 2, // A Sacerdotisa
  },
  {
    id: "profissional",
    level: 4,
    title: "Portal 4 — Profissional",
    subtitle: "Torne-se uma leitora formada",
    icon: "rei",
    accentColor: "#5B1F3D",
    accentBorder: "#C8A66A4D",
    modules: ["leitura-aplicada", "pratica", "trabalhar-taro"],
    prerequisites: ["avancado"],
    landmarkCardId: 21, // O Mundo
  },
];

const TrailsPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  const { setHeader, resetHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "Mapa da Jornada",
      subtitle: "Sua travessia pelos 78 arcanos.",
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

  const allModulesOrdered = TRAIL_LEVELS.flatMap(l => l.modules);
  const nextGlobalModuleId = allModulesOrdered.find(mId => !progress.completedModules.includes(mId));

  const currentLevelIdx = TRAIL_LEVELS.findIndex(l => isLevelUnlocked(l) && !isLevelComplete(l));
  const currentLevel = currentLevelIdx >= 0 ? TRAIL_LEVELS[currentLevelIdx] : (progress.completedModules.length === allModulesOrdered.length ? null : TRAIL_LEVELS[0]);

  const getLandmarkImage = (cardId: number) => {
    switch (cardId) {
      case 0: return imgLouco;
      case 1: return imgMago;
      case 2: return imgSacerdotisa;
      case 21: return imgMundo;
      default: return imgLouco;
    }
  };

  return (
    <div className="relative w-full max-w-full flex flex-col items-center overflow-x-hidden box-border bg-[#FAF5EF] min-h-screen" id="trails-page-root">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[30%] bg-[radial-gradient(circle,rgba(243,230,224,0.6)_0%,transparent_70%)] blur-3xl opacity-50" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[30%] bg-[radial-gradient(circle,rgba(200,166,106,0.1)_0%,transparent_70%)] blur-3xl opacity-30" />
      </div>

      <div className="relative w-full max-w-2xl px-4 sm:px-6 pt-12 sm:pt-20 pb-4 box-border flex flex-col items-center">
        <div className="text-center relative z-10 w-full mb-8">
          <div className="text-[10px] sm:text-[12px] tracking-[0.4em] uppercase font-heading font-black mb-2 text-[#C8A66A]">
            Trilha de Formação
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl tracking-tight font-black text-[#5B1F3D]">
            Mapa da Jornada
          </h1>
          <p className="font-body text-sm sm:text-base font-bold italic mt-2 text-[#5B1F3D]/60">
            Dos fundamentos à leitura profissional.
          </p>
        </div>

        {/* Overall progress Card */}
        <div className="rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(91,31,61,0.08)] border-2 w-full box-border relative overflow-hidden bg-white/80 backdrop-blur-sm border-[#C8A66A33] mb-12 group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(91,31,61,0.12)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(200,166,106,0.1)_0%,transparent_70%)] -mr-16 -mt-16" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C8A66A]" />
              <h2 className="font-heading text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-[#5B1F3D]">
                Progresso Geral
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-[10px] sm:text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full bg-[#5B1F3D] text-[#FAF5EF] shadow-lg border border-[#C8A66A40]">
                {currentLevel ? currentLevel.title.split(' — ')[1] : (progress.completedModules.length === allModulesOrdered.length ? "Formada ✦" : "Início")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {TRAIL_LEVELS.map(level => {
              const prog = getLevelProgress(level);
              const complete = isLevelComplete(level);
              const unlocked = isLevelUnlocked(level);
              return (
                <div key={level.id} className="space-y-3">
                  <div className="h-2 sm:h-2.5 w-full rounded-full bg-[#DCCFC240] p-[1px] relative">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{
                      width: `${Math.max(prog, complete ? 100 : 0)}%`,
                      background: complete 
                        ? "linear-gradient(90deg, #C8A66A, #DCCFC2)" 
                        : "linear-gradient(90deg, #5B1F3D, #C8A66A)",
                      boxShadow: unlocked ? "0 0 10px rgba(200, 166, 106, 0.2)" : "none"
                    }} />
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-heading font-black text-center uppercase tracking-wider truncate w-full" style={{
                    color: unlocked ? "#5B1F3D" : "#5B1F3D40",
                  }}>
                    {level.title.split(" — ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Journey Path */}
        <div className="relative w-full space-y-16 pb-24">
          {/* Vertical path line */}
          <div className="absolute left-[23px] min-[360px]:left-[27px] sm:left-[35px] top-0 bottom-0 w-[2px] z-0">
            <div className="w-full h-full" style={{
              background: "repeating-linear-gradient(to bottom, #C8A66A40 0px, #C8A66A40 8px, transparent 8px, transparent 16px)"
            }} />
          </div>

          {TRAIL_LEVELS.map((level, levelIdx) => {
            const unlocked = isLevelUnlocked(level);
            const complete = isLevelComplete(level);
            const isCurrent = unlocked && !complete;
            const prog = getLevelProgress(level);

            return (
              <div key={level.id} className="relative z-10">
                {/* Portal Landmark Card - Editorial Visual Placement */}
                {level.landmarkCardId !== undefined && (
                  <div className={`absolute top-0 ${levelIdx % 2 === 0 ? '-right-4 sm:-right-8' : '-right-2 sm:-right-4'} pointer-events-none opacity-20 sm:opacity-30 group-hover:opacity-40 transition-opacity duration-700 hidden sm:block`}>
                    <div className="relative transform rotate-[8deg] scale-[0.6] sm:scale-[0.8]">
                       <div className="absolute inset-0 bg-[#C8A66A]/10 blur-xl rounded-lg" />
                       <img 
                         src={getLandmarkImage(level.landmarkCardId)} 
                         alt="" 
                         className="w-32 h-48 object-cover rounded-xl border-2 border-[#C8A66A]/30 shadow-2xl" 
                       />
                    </div>
                  </div>
                )}

                {/* Level Header (Portal) */}
                <div className="flex items-center gap-4 sm:gap-6 mb-10">
                  <div className={`relative w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl overflow-hidden ${unlocked ? 'bg-white' : 'bg-[#DCCFC230]'}`}
                    style={{
                      border: `2px solid ${unlocked ? '#C8A66A' : '#DCCFC260'}`,
                      transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {isCurrent && (
                      <div className="absolute inset-0 bg-[#5B1F3D]/5 animate-pulse" />
                    )}
                    {unlocked ? (
                      <div className="flex flex-col items-center justify-center">
                        <TarotIcon name={level.icon} className="w-6 h-6 sm:w-8 sm:h-8 text-[#5B1F3D]" />
                      </div>
                    ) : (
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B1F3D20]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase font-heading font-black ${unlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D40]'}`}>
                        PORTAL {level.level}
                      </span>
                      {complete && <div className="w-1.5 h-1.5 rounded-full bg-[#C8A66A]" />}
                    </div>
                    <h3 className={`font-heading text-lg sm:text-2xl font-black leading-tight ${unlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D50]'}`}>
                      {level.title.split(' — ')[1] || level.title}
                    </h3>
                    <p className={`font-body text-xs sm:text-sm italic font-bold mt-1 ${unlocked ? 'text-[#5B1F3D]/70' : 'text-[#5B1F3D30]'}`}>
                      {level.subtitle}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="hidden min-[480px]:flex flex-col items-end">
                      <span className="font-heading text-2xl font-black text-[#5B1F3D]">{prog}%</span>
                      <span className="text-[8px] font-heading font-black uppercase tracking-widest text-[#C8A66A]">Progresso</span>
                    </div>
                  )}
                </div>

                {/* Module List with Path line connection */}
                <div className="ml-[23px] min-[360px]:ml-[27px] sm:ml-[35px] border-l-2 border-transparent space-y-4">
                  {level.modules.map(modId => {
                    const mod = MODULES.find(m => m.id === modId);
                    if (!mod) return null;
                    const modUnlocked = bypassLocks || isModuleUnlocked(mod.id, progress.completedModules);
                    const modComplete = progress.completedModules.includes(mod.id);
                    const modCurrent = modUnlocked && !modComplete;
                    const isNext = modId === nextGlobalModuleId;

                    return (
                      <button
                        key={mod.id}
                        onClick={() => modUnlocked && navigate(mod.route)}
                        disabled={!modUnlocked}
                        className="group relative flex items-center w-full text-left transition-all duration-300 active:scale-[0.98] outline-none"
                      >
                        {/* Dot on path */}
                        <div className={`absolute -left-[10px] min-[360px]:-left-[10px] sm:-left-[10px] w-5 h-5 rounded-full border-4 border-[#FAF5EF] z-20 transition-all duration-500 ${
                          modComplete ? 'bg-[#C8A66A]' : modCurrent ? 'bg-[#5B1F3D] scale-125' : 'bg-[#DCCFC2]'
                        }`}>
                          {modCurrent && <div className="absolute inset-0 rounded-full bg-[#5B1F3D] animate-ping opacity-40" />}
                        </div>

                        {/* Module Card */}
                        <div className={`ml-8 w-full p-4 sm:p-5 rounded-2xl border-2 transition-all duration-500 flex items-center gap-4 sm:gap-6 ${
                          modCurrent ? 'bg-white border-[#C8A66A] shadow-[0_15px_40px_rgba(91,31,61,0.06)] translate-x-1' : 
                          modComplete ? 'bg-white/40 border-[#DCCFC260] opacity-80' : 
                          'bg-[#DCCFC215] border-[#DCCFC230] opacity-60'
                        }`}>
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                            modComplete ? 'bg-[#FAF5EF] text-[#C8A66A]' : 
                            modCurrent ? 'bg-[#5B1F3D] text-[#FAF5EF]' : 
                            'bg-[#DCCFC240] text-[#5B1F3D20]'
                          }`}>
                             {modComplete ? <Check className="w-5 h-5" strokeWidth={3} /> : modCurrent ? <Compass className="w-6 h-6 animate-pulse" /> : <Lock className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[8px] sm:text-[9px] font-heading font-black tracking-[0.2em] uppercase ${modUnlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D40]'}`}>
                                Módulo
                              </span>
                              {isNext && (
                                <span className="bg-[#5B1F3D] text-white text-[7px] sm:text-[8px] px-2 py-0.5 rounded-full font-heading font-black tracking-widest uppercase">Próxima Chave</span>
                              )}
                            </div>
                            <h4 className={`font-heading text-sm sm:text-lg font-black tracking-tight leading-tight truncate ${modUnlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D50]'}`}>
                              {mod.title}
                            </h4>
                          </div>

                          {modUnlocked && <ChevronRight className={`w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1 ${modCurrent ? 'text-[#C8A66A]' : 'text-[#DCCFC2]'}`} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrailsPage;

