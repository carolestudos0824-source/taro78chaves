import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles, ChevronRight, Key, Play } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useHeader } from "@/contexts/header-context";
import { useEffect } from "react";
import { MODULES_CATALOG as MODULES } from "@/lib/content";
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
    modules: ["fundamentos", "leitura-simbolica", "arcanos-maiores"],
    prerequisites: [],
    landmarkCardId: 0,
  },
  {
    id: "intermediario",
    level: 2,
    title: "Portal 2 — Intermediário",
    subtitle: "Domine todas as cartas e técnicas",
    icon: "rainha",
    modules: ["arquitetura-menores", "copas", "paus", "espadas", "ouros", "cartas-corte"],
    prerequisites: ["iniciante"],
    landmarkCardId: 1,
  },
  {
    id: "avancado",
    level: 3,
    title: "Portal 3 — Avançado",
    subtitle: "Domine combinações e espiritualidade",
    icon: "Stars",
    modules: ["combinacoes", "tiragens", "amor", "espiritualidade", "mesa-taro"],
    prerequisites: ["intermediario"],
    landmarkCardId: 2,
  },
  {
    id: "profissional",
    level: 4,
    title: "Portal 4 — Profissional",
    subtitle: "Torne-se uma leitora formada",
    icon: "rei",
    modules: ["leitura-aplicada", "pratica", "trabalhar-taro"],
    prerequisites: ["avancado"],
    landmarkCardId: 21,
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

  const isLevelComplete = (level: TrailLevel) => 
    level.modules.every(m => progress.completedModules.includes(m));

  const isLevelUnlocked = (level: TrailLevel) => {
    if (bypassLocks) return true;
    return level.prerequisites.every(preId => {
      const pre = TRAIL_LEVELS.find(t => t.id === preId);
      return pre ? isLevelComplete(pre) : false;
    });
  };

  const getLevelProgress = (level: TrailLevel) => {
    const completed = level.modules.filter(m => progress.completedModules.includes(m)).length;
    return Math.round((completed / level.modules.length) * 100);
  };

  const allModulesOrdered = TRAIL_LEVELS.flatMap(l => l.modules);
  const nextGlobalModuleId = allModulesOrdered.find(mId => !progress.completedModules.includes(mId));
  const currentLevelIdx = TRAIL_LEVELS.findIndex(l => isLevelUnlocked(l) && !isLevelComplete(l));
  const currentLevel = currentLevelIdx >= 0 ? TRAIL_LEVELS[currentLevelIdx] : TRAIL_LEVELS[0];

  const getLandmark = (cardId: number) => {
    switch (cardId) {
      case 0: return { img: imgLouco, name: "O Louco" };
      case 1: return { img: imgMago, name: "O Mago" };
      case 2: return { img: imgSacerdotisa, name: "A Sacerdotisa" };
      case 21: return { img: imgMundo, name: "O Mundo" };
      default: return { img: imgLouco, name: "O Louco" };
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FAF5EF] pb-32 font-body text-[#5B1F3D] overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[5%] right-[-5%] w-[30%] h-[20%] bg-[#C8A66A]/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[20%] bg-[#5B1F3D]/5 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 pt-16 sm:pt-24 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-16 relative w-full">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#C8A66A]" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#C8A66A]">Trilha de Formação</p>
            <div className="h-px w-8 bg-[#C8A66A]" />
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-black text-[#5B1F3D] mb-4 tracking-tight">Mapa da Jornada</h1>
          <p className="font-body text-base sm:text-lg italic font-bold text-[#5B1F3D]/60 max-w-md mx-auto leading-relaxed">
            Dos fundamentos à leitura profissional.
          </p>
        </div>

        {/* Sua Travessia Card */}
        <div className="w-full bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-[#C8A66A33] shadow-[0_20px_60px_rgba(91,31,61,0.06)] mb-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A66A]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C8A66A]" />
              <h2 className="font-heading text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-[#5B1F3D]">Sua Travessia</h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-[#5B1F3D] text-[#FAF5EF] text-[10px] font-black tracking-widest uppercase px-5 py-2 rounded-full shadow-md border border-[#C8A66A33]">
                {currentLevel ? currentLevel.title.split(' — ')[1] : "Início"}
              </span>
              <span className="text-[8px] font-heading font-black text-[#C8A66A] mt-2 uppercase tracking-widest opacity-60">Portal Atual</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {TRAIL_LEVELS.map(level => {
              const prog = getLevelProgress(level);
              const complete = isLevelComplete(level);
              const isCurrent = currentLevel?.id === level.id;
              return (
                <div key={level.id} className="space-y-3">
                  <div className="h-2.5 bg-[#DCCFC2]/20 rounded-full overflow-hidden p-[1px]">
                    <div className={`h-full rounded-full transition-all duration-1000 ${complete ? 'bg-gradient-to-r from-[#C8A66A] to-[#DCCFC2]' : isCurrent ? 'bg-[#5B1F3D]' : 'bg-transparent'}`} 
                      style={{ width: complete ? '100%' : (isCurrent ? `${prog || 50}%` : '0%') }} 
                    />
                  </div>
                  <p className={`text-[8px] sm:text-[9px] font-heading font-black uppercase text-center tracking-widest ${isCurrent ? 'text-[#5B1F3D]' : 'text-[#5B1F3D]/40'}`}>
                    {level.title.split(' — ')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journey Path */}
        <div className="w-full relative space-y-32">
          {/* Central Path Line */}
          <div className="absolute left-[31px] sm:left-[39px] top-10 bottom-40 w-[2px] z-0">
            <div className="w-full h-full bg-gradient-to-b from-[#C8A66A]/60 via-[#DCCFC2]/40 to-transparent" />
          </div>

          {TRAIL_LEVELS.map((level, i) => {
            const unlocked = isLevelUnlocked(level);
            const complete = isLevelComplete(level);
            const isCurrent = currentLevel?.id === level.id;
            const landmark = level.landmarkCardId !== undefined ? getLandmark(level.landmarkCardId) : null;

            return (
              <div key={level.id} className="relative z-10 group">
                {/* Portal Header */}
                <div className="flex items-center gap-6 sm:gap-10 mb-12">
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 transition-all duration-700 shadow-xl ${
                    unlocked ? (isCurrent ? 'bg-white border-[#5B1F3D] scale-110' : 'bg-white border-[#C8A66A]') : 'bg-[#DCCFC2]/20 border-[#DCCFC2]/40'
                  }`}>
                    {unlocked ? (
                      <TarotIcon name={level.icon} className={`w-8 h-8 sm:w-10 sm:h-10 ${isCurrent ? 'text-[#5B1F3D]' : 'text-[#C8A66A]'}`} />
                    ) : (
                      <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#5B1F3D]/20" />
                    )}
                    {isCurrent && <div className="absolute inset-0 rounded-full border-2 border-[#5B1F3D] animate-ping opacity-20" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-[10px] sm:text-xs font-heading font-black tracking-[0.4em] uppercase ${unlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D]/40'}`}>
                        {level.title.split(' — ')[0]}
                      </span>
                      {complete && <Check className="w-3.5 h-3.5 text-[#C8A66A] stroke-[4px]" />}
                    </div>
                    <h3 className={`font-heading text-2xl sm:text-4xl font-black tracking-tight leading-tight ${unlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D]/30'}`}>
                      {level.title.split(' — ')[1] || level.title}
                    </h3>
                    <p className={`font-body text-xs sm:text-base italic font-bold mt-2 leading-relaxed ${unlocked ? 'text-[#5B1F3D]/70' : 'text-[#5B1F3D]/20'}`}>
                      {unlocked ? level.subtitle : "Conclua os portais anteriores para revelar."}
                    </p>
                  </div>
                </div>

                {/* Modules Grid/List */}
                <div className="ml-[31px] sm:ml-[39px] pl-10 sm:pl-16 space-y-6 relative">
                  {level.modules.map(modId => {
                    const mod = MODULES.find(m => m.id === modId);
                    if (!mod) return null;
                    const modComplete = progress.completedModules.includes(modId);
                    const isNext = modId === nextGlobalModuleId;

                    return (
                      <button
                        key={mod.id}
                        disabled={!unlocked}
                        onClick={() => navigate(mod.route)}
                        className={`group/mod relative w-full flex items-center text-left transition-all duration-500 rounded-[2rem] p-5 sm:p-7 border-2 ${
                          unlocked && isNext ? 'bg-white border-[#5B1F3D] shadow-xl hover:translate-x-1' : 
                          unlocked ? 'bg-white/60 border-[#C8A66A]/20 hover:border-[#C8A66A]/60 hover:translate-x-1' : 
                          'bg-white/10 border-[#DCCFC2]/20 cursor-not-allowed grayscale-[40%] opacity-80'
                        }`}
                      >
                        {/* Node Connector */}
                        <div className={`absolute -left-[54px] sm:-left-[74px] w-4 h-4 rounded-full border-2 border-[#FAF5EF] z-20 transition-all duration-500 ${
                          modComplete ? 'bg-[#C8A66A] scale-100' : isNext ? 'bg-[#5B1F3D] scale-150' : 'bg-[#DCCFC2]/60 scale-90'
                        }`} />

                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all duration-500 group-hover/mod:rotate-3 ${
                          modComplete ? 'bg-[#FAF5EF] text-[#C8A66A]' : 
                          unlocked && isNext ? 'bg-[#5B1F3D] text-white' : 
                          'bg-[#DCCFC2]/40 text-[#5B1F3D]/40'
                        }`}>
                           {modComplete ? <Check className="w-6 h-6 stroke-[3px]" /> : unlocked && isNext ? <Key className="w-7 h-7 animate-pulse" /> : <Lock className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 ml-6 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[9px] sm:text-[10px] font-heading font-black tracking-widest uppercase ${unlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D]/30'}`}>
                              Módulo
                            </span>
                            {isNext && (
                              <span className="bg-[#5B1F3D] text-[#FAF5EF] text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter sm:tracking-widest flex items-center gap-1 shadow-sm">
                                <Sparkles className="w-2 h-2" /> Próxima Chave
                              </span>
                            )}
                          </div>
                          <h4 className={`font-heading text-lg sm:text-2xl font-black tracking-tight truncate ${unlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D]/20'}`}>
                            {mod.name}
                          </h4>
                        </div>

                        <div className="ml-4 flex items-center justify-center">
                          {unlocked && isNext ? (
                            <div className="bg-[#5B1F3D] text-white p-2.5 rounded-full shadow-lg group-hover/mod:scale-110 transition-all">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          ) : unlocked ? (
                            <ChevronRight className="w-6 h-6 text-[#C8A66A]/40 group-hover/mod:text-[#C8A66A] transition-colors" />
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Landmark Card Decor */}
                {landmark && (
                  <div className={`absolute -right-6 sm:-right-10 top-12 w-28 sm:w-36 transition-all duration-1000 hidden md:block group-hover:scale-110 ${unlocked ? 'opacity-30 group-hover:opacity-60 grayscale-0' : 'opacity-10 grayscale'}`}>
                    <div className="relative transform rotate-[10deg] shadow-2xl">
                      <img src={landmark.img} alt={landmark.name} className="w-full rounded-2xl border-2 border-white/60 shadow-2xl" />
                      <div className="absolute inset-x-0 bottom-4 text-center">
                        <p className="bg-white/95 backdrop-blur-sm mx-3 py-1.5 rounded-lg border border-[#C8A66A]/20 font-heading text-[10px] font-black text-[#5B1F3D] shadow-xl uppercase tracking-widest">
                          {landmark.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrailsPage;
