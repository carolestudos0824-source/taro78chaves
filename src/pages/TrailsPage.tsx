import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles, ChevronRight, Compass, Key, Play } from "lucide-react";
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
        <div className="text-center relative z-10 w-full mb-10">
          <div className="text-[10px] sm:text-[12px] tracking-[0.4em] uppercase font-heading font-black mb-2 text-[#C8A66A]">
            Trilha de Formação
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight font-black text-[#5B1F3D]">
            Mapa da Jornada
          </h1>
          <p className="font-body text-sm sm:text-base font-bold italic mt-2 text-[#5B1F3D]/60">
            Dos fundamentos à leitura profissional.
          </p>
        </div>

        {/* Overall progress Card */}
        <div className="rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(91,31,61,0.08)] border-2 w-full box-border relative overflow-hidden bg-white/80 backdrop-blur-sm border-[#C8A66A33] mb-16 group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(91,31,61,0.12)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(200,166,106,0.1)_0%,transparent_70%)] -mr-16 -mt-16" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C8A66A]" />
              <h2 className="font-heading text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-[#5B1F3D]">
                Sua Travessia
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-heading text-[10px] sm:text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full bg-[#5B1F3D] text-[#FAF5EF] shadow-lg border border-[#C8A66A40]">
                {currentLevel ? currentLevel.title.split(' — ')[1] : (progress.completedModules.length === allModulesOrdered.length ? "Formada ✦" : "Início")}
              </span>
              <span className="text-[8px] font-heading font-black text-[#C8A66A] mt-2 uppercase tracking-widest">Portal Atual</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {TRAIL_LEVELS.map(level => {
              const prog = getLevelProgress(level);
              const complete = isLevelComplete(level);
              const unlocked = isLevelUnlocked(level);
              const isCurrent = currentLevel?.id === level.id;
              
              return (
                <div key={level.id} className="space-y-3">
                  <div className={`h-2.5 sm:h-3 w-full rounded-full p-[1px] relative ${unlocked ? 'bg-[#DCCFC240]' : 'bg-[#DCCFC220]'}`}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{
                      width: `${Math.max(prog, complete ? 100 : 0)}%`,
                      background: complete 
                        ? "linear-gradient(90deg, #C8A66A, #DCCFC2)" 
                        : isCurrent ? "linear-gradient(90deg, #5B1F3D, #8B3D5A)" : "linear-gradient(90deg, #DCCFC2, #C8A66A40)",
                      boxShadow: isCurrent ? "0 0 10px rgba(91, 31, 61, 0.2)" : "none"
                    }} />
                  </div>
                  <div className={`text-[9px] sm:text-[10px] font-heading font-black text-center uppercase tracking-wider truncate w-full ${isCurrent ? 'text-[#5B1F3D]' : unlocked ? 'text-[#5B1F3D]/60' : 'text-[#5B1F3D]/20'}`}>
                    {level.title.split(" — ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Journey Path */}
        <div className="relative w-full space-y-24 pb-32">
          {/* Vertical path line - More evident */}
          <div className="absolute left-[23px] min-[360px]:left-[27px] sm:left-[35px] top-0 bottom-0 w-[3px] z-0">
            <div className="w-full h-full" style={{
              background: "repeating-linear-gradient(to bottom, #C8A66A60 0px, #C8A66A60 12px, transparent 12px, transparent 24px)"
            }} />
          </div>

          {TRAIL_LEVELS.map((level, levelIdx) => {
            const unlocked = isLevelUnlocked(level);
            const complete = isLevelComplete(level);
            const isCurrent = unlocked && !complete;
            const prog = getLevelProgress(level);

            return (
              <div key={level.id} className="relative z-10">
                {/* Portal Landmark Card - editorial connector */}
                {level.landmarkCardId !== undefined && (
                  <div className={`absolute top-0 right-0 pointer-events-none transition-all duration-1000 ${unlocked ? 'opacity-30 translate-y-0' : 'opacity-10 translate-y-4'} group-hover:opacity-40 hidden sm:block`}>
                    <div className="relative transform rotate-[8deg] scale-[0.7] md:scale-[0.8] origin-top-right">
                       <div className="absolute inset-0 bg-[#C8A66A]/15 blur-2xl rounded-lg" />
                       <img 
                         src={getLandmarkImage(level.landmarkCardId)} 
                         alt="" 
                         className={`w-36 h-54 object-cover rounded-2xl border-2 shadow-2xl transition-all duration-700 ${unlocked ? 'border-[#C8A66A]/40' : 'border-[#DCCFC2]/30 grayscale'}`} 
                       />
                       <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-[#C8A66A]/20 text-center">
                          <p className="font-heading text-[8px] font-black uppercase tracking-widest text-[#5B1F3D]">Marco do Portal {level.level}</p>
                       </div>
                    </div>
                  </div>
                )}

                {/* Level Header (Portal) */}
                <div className="flex items-center gap-5 sm:gap-8 mb-12 group/header">
                  <div className={`relative w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl overflow-hidden ${unlocked ? 'bg-white' : 'bg-[#DCCFC220]'}`}
                    style={{
                      border: `3px solid ${unlocked ? (isCurrent ? '#5B1F3D' : '#C8A66A') : '#DCCFC260'}`,
                      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {isCurrent && (
                      <div className="absolute inset-0 bg-[#5B1F3D]/5 animate-pulse" />
                    )}
                    {unlocked ? (
                      <div className="flex flex-col items-center justify-center">
                        <TarotIcon name={level.icon} className={`w-7 h-7 sm:w-9 sm:h-9 ${isCurrent ? 'text-[#5B1F3D]' : 'text-[#C8A66A]'}`} />
                      </div>
                    ) : (
                      <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#5B1F3D20]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] sm:text-xs tracking-[0.4em] uppercase font-heading font-black ${unlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D30]'}`}>
                        PORTAL {level.level}
                      </span>
                      {complete && <Check className="w-3 h-3 text-[#C8A66A]" strokeWidth={4} />}
                      {!unlocked && <span className="text-[8px] font-heading font-black text-[#5B1F3D20] tracking-widest uppercase">Bloqueado</span>}
                    </div>
                    <h3 className={`font-heading text-xl sm:text-3xl font-black tracking-tight leading-tight ${unlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D30]'}`}>
                      {level.title.split(' — ')[1] || level.title}
                    </h3>
                    <p className={`font-body text-xs sm:text-base italic font-bold mt-1.5 ${unlocked ? 'text-[#5B1F3D]/70' : 'text-[#5B1F3D15]'}`}>
                      {unlocked ? level.subtitle : "Desbloqueie ao concluir o portal anterior."}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="hidden min-[520px]:flex flex-col items-end shrink-0">
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading text-3xl font-black text-[#5B1F3D]">{prog}%</span>
                        <span className="text-[10px] font-heading font-black text-[#C8A66A] uppercase tracking-widest">Chaves</span>
                      </div>
                      <span className="text-[8px] font-heading font-black uppercase tracking-[0.2em] text-[#C8A66A] opacity-60">Etapa Atual</span>
                    </div>
                  )}
                </div>

                {/* Module List with Path line connection */}
                <div className={`ml-[23px] min-[360px]:ml-[27px] sm:ml-[35px] border-l-2 border-transparent space-y-6 ${!unlocked ? 'opacity-40 grayscale' : ''}`}>
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
                        className={`group relative flex items-center w-full text-left transition-all duration-500 outline-none ${modUnlocked ? 'hover:translate-x-1' : 'cursor-not-allowed'}`}
                      >
                        {/* Point on path */}
                        <div className={`absolute -left-[11px] min-[360px]:-left-[11px] sm:-left-[11px] w-5.5 h-5.5 rounded-full border-4 border-[#FAF5EF] z-20 transition-all duration-700 ${
                          modComplete ? 'bg-[#C8A66A] scale-90' : modCurrent ? 'bg-[#5B1F3D] scale-125 shadow-[0_0_15px_rgba(91,31,61,0.3)]' : 'bg-[#DCCFC2]'
                        }`}>
                          {modCurrent && <div className="absolute inset-0 rounded-full bg-[#5B1F3D] animate-ping opacity-30" />}
                        </div>

                        {/* Module Card */}
                        <div className={`ml-10 w-full p-5 sm:p-7 rounded-[2rem] border-2 transition-all duration-700 flex items-center gap-5 sm:gap-8 overflow-hidden relative ${
                          modCurrent ? 'bg-white border-[#5B1F3D] shadow-[0_25px_50px_rgba(91,31,61,0.08)] ring-4 ring-[#5B1F3D]/5' : 
                          modComplete ? 'bg-white/60 border-[#C8A66A30]' : 
                          'bg-[#DCCFC210] border-[#DCCFC230]'
                        }`}>
                          {/* Card Content */}
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-500 group-hover:rotate-3 ${
                            modComplete ? 'bg-[#FAF5EF] text-[#C8A66A] border border-[#C8A66A20]' : 
                            modCurrent ? 'bg-[#5B1F3D] text-[#FAF5EF]' : 
                            'bg-[#DCCFC240] text-[#5B1F3D20]'
                          }`}>
                             {modComplete ? <Check className="w-6 h-6" strokeWidth={4} /> : modCurrent ? <Key className="w-7 h-7 animate-pulse" /> : <Lock className="w-5 h-5" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[9px] sm:text-xs font-heading font-black tracking-[0.25em] uppercase ${modUnlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D20]'}`}>
                                Módulo
                              </span>
                              {isNext && (
                                <span className="bg-[#5B1F3D] text-[#FAF5EF] text-[8px] sm:text-[9px] px-3 py-1 rounded-full font-heading font-black tracking-widest uppercase flex items-center gap-1 shadow-sm">
                                  <Sparkles className="w-2 h-2" /> Próxima Chave
                                </span>
                              )}
                            </div>
                            <h4 className={`font-heading text-lg sm:text-2xl font-black tracking-tight leading-tight truncate ${modUnlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D20]'}`}>
                              {mod.name}
                            </h4>
                          </div>

                          <div className="shrink-0 flex items-center justify-center">
                            {modCurrent ? (
                              <div className="bg-[#5B1F3D] text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </div>
                            ) : modUnlocked ? (
                              <ChevronRight className="w-6 h-6 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
                            ) : null}
                          </div>
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


