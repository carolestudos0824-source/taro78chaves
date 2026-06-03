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
  }, [setHeader, resetHeader]);

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
    <div className="relative w-full min-h-screen bg-[#FAF5EF] pb-40 font-body text-[#5B1F3D] overflow-x-hidden">
      {/* Background Ornaments - Refined for depth */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[5%] right-[-5%] w-[40%] h-[30%] bg-[#C8A66A]/10 blur-[100px] rounded-full" />
        <div className="absolute top-[40%] left-[-10%] w-[40%] h-[30%] bg-[#F3E6E0]/40 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[20%] bg-[#5B1F3D]/5 blur-[80px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 pt-16 sm:pt-24 flex flex-col items-center">
        {/* Header Section - Enhanced Spacing & Ritualistic feel */}
        <div className="text-center mb-16 relative w-full px-4">
          <div className="inline-flex items-center gap-3 mb-4 opacity-80">
            <div className="h-px w-10 bg-[#C8A66A]/60" />
            <Sparkles className="w-3 h-3 text-[#C8A66A]" />
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.5em] font-heading font-black text-[#C8A66A]">Trilha de Formação</p>
            <Sparkles className="w-3 h-3 text-[#C8A66A]" />
            <div className="h-px w-10 bg-[#C8A66A]/60" />
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-black text-[#5B1F3D] mb-5 tracking-tight leading-[1.1]">
            Mapa da Jornada
          </h1>
          <p className="font-body text-base sm:text-xl italic font-bold text-[#5B1F3D]/70 max-w-md mx-auto leading-relaxed border-t border-[#C8A66A20] pt-4">
            Dos fundamentos à leitura profissional.
          </p>
        </div>

        {/* Sua Travessia Card - Higher Contrast & Premium look */}
        <div className="w-full bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[3rem] border border-[#C8A66A4D] shadow-[0_30px_70px_rgba(91,31,61,0.08)] mb-24 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_40px_80px_rgba(91,31,61,0.12)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A66A]/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
          
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FAF5EF] rounded-full border border-[#C8A66A33]">
                <Key className="w-4 h-4 text-[#C8A66A]" />
              </div>
              <h2 className="font-heading text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-[#5B1F3D]">Sua Travessia</h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-[#5B1F3D] text-[#FAF5EF] text-[11px] font-black tracking-widest uppercase px-6 py-2.5 rounded-full shadow-lg border border-[#C8A66A66]">
                {currentLevel ? currentLevel.title.split(' — ')[1] : "Início"}
              </span>
              <span className="text-[9px] font-heading font-black text-[#C8A66A] mt-2.5 uppercase tracking-widest">Portal Atual</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {TRAIL_LEVELS.map(level => {
              const prog = getLevelProgress(level);
              const complete = isLevelComplete(level);
              const isCurrent = currentLevel?.id === level.id;
              const unlocked = isLevelUnlocked(level);
              
              return (
                <div key={level.id} className="space-y-4">
                  <div className={`h-3 rounded-full overflow-hidden p-[1.5px] shadow-inner transition-colors duration-500 ${unlocked ? 'bg-[#DCCFC240]' : 'bg-[#DCCFC215]'}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
                        complete ? 'bg-gradient-to-r from-[#C8A66A] to-[#DCCFC2] shadow-[0_0_10px_rgba(200,166,106,0.3)]' : 
                        isCurrent ? 'bg-[#5B1F3D] shadow-[0_0_15px_rgba(91,31,61,0.4)]' : 'bg-transparent'
                      }`} 
                      style={{ width: complete ? '100%' : (isCurrent ? `${Math.max(prog, 50)}%` : '0%') }} 
                    />
                  </div>
                  <p className={`text-[9px] sm:text-[10px] font-heading font-black uppercase text-center tracking-[0.2em] transition-colors duration-500 ${
                    isCurrent ? 'text-[#5B1F3D] scale-110' : unlocked ? 'text-[#5B1F3D]/70' : 'text-[#5B1F3D]/45'
                  }`}>
                    {level.title.split(' — ')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journey Path - Guiding the eye */}
        <div className="w-full relative space-y-36">
          {/* Enhanced Guiding Line */}
          <div className="absolute left-[31px] sm:left-[39px] top-12 bottom-48 w-[3px] z-0">
            <div className="w-full h-full bg-gradient-to-b from-[#C8A66A]/80 via-[#DCCFC2]/60 to-transparent shadow-[0_0_10px_rgba(200,166,106,0.1)]" />
          </div>

          {TRAIL_LEVELS.map((level, i) => {
            const unlocked = isLevelUnlocked(level);
            const complete = isLevelComplete(level);
            const isCurrent = currentLevel?.id === level.id;
            const landmark = level.landmarkCardId !== undefined ? getLandmark(level.landmarkCardId) : null;

            return (
              <div key={level.id} className={`relative z-10 group transition-all duration-700 ${!unlocked ? 'opacity-100' : 'opacity-100'}`}>
                {/* Portal Header - Ritualistic focus */}
                <div className="flex items-center gap-7 sm:gap-12 mb-16 relative">
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-[3px] transition-all duration-700 shadow-[0_15px_40px_rgba(0,0,0,0.05)] ${
                    unlocked 
                      ? (isCurrent ? 'bg-white border-[#5B1F3D] scale-110 shadow-[0_20px_50px_rgba(91,31,61,0.15)] ring-8 ring-[#5B1F3D]/5' : 'bg-white border-[#C8A66A]') 
                      : 'bg-[#FAF5EF] border-[#DCCFC2]'
                  }`}>
                    {unlocked ? (
                      <TarotIcon name={level.icon} className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-500 ${isCurrent ? 'text-[#5B1F3D]' : 'text-[#C8A66A]'}`} />
                    ) : (
                      <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#5B1F3D]/45" />
                    )}
                    {isCurrent && (
                      <div className="absolute -inset-4 rounded-full border border-[#5B1F3D]/20 animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] sm:text-[12px] font-heading font-black tracking-[0.5em] uppercase transition-colors duration-500 ${
                        unlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D]/75'
                      }`}>
                        {level.title.split(' — ')[0]}
                      </span>
                      {complete && (
                        <div className="bg-[#C8A66A] p-1 rounded-full">
                          <Check className="w-3 h-3 text-white stroke-[4px]" />
                        </div>
                      )}
                      {!unlocked && (
                         <span className="text-[8px] font-heading font-black text-[#5B1F3D]/60 tracking-widest uppercase bg-[#DCCFC2]/40 px-2 py-0.5 rounded">Futuro</span>
                      )}
                    </div>
                    <h3 className={`font-heading text-2xl sm:text-5xl font-black tracking-tight leading-tight transition-all duration-500 ${
                      unlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D]/85'
                    }`}>
                      {level.title.split(' — ')[1] || level.title}
                    </h3>
                    <p className={`font-body text-xs sm:text-lg italic font-bold mt-3 leading-relaxed transition-all duration-500 ${
                      unlocked ? 'text-[#5B1F3D]/80' : 'text-[#5B1F3D]/65'
                    }`}>
                      {unlocked ? level.subtitle : "Sua próxima etapa de sabedoria."}
                    </p>
                  </div>
                </div>

                {/* Modules Grid - Enhanced Contrast & Premium Cards */}
                <div className="ml-[31px] sm:ml-[39px] pl-10 sm:pl-20 space-y-8 relative">
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
                        className={`group/mod relative w-full flex items-center text-left transition-all duration-500 rounded-[2.5rem] p-6 sm:p-8 border-2 ${
                          unlocked && isNext 
                            ? 'bg-white border-[#5B1F3D] shadow-[0_25px_60px_rgba(91,31,61,0.1)] hover:translate-x-2' : 
                          unlocked 
                            ? 'bg-white/70 border-[#C8A66A26] hover:border-[#C8A66A80] hover:translate-x-2 hover:bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)]' : 
                          'bg-white/40 border-[#DCCFC299] cursor-not-allowed'
                        }`}
                      >
                        {/* More Evident Node Connector */}
                        <div className={`absolute -left-[54px] sm:-left-[74px] w-5 h-5 rounded-full border-[3px] border-[#FAF5EF] z-20 transition-all duration-500 shadow-sm ${
                          modComplete ? 'bg-[#C8A66A] scale-100 shadow-[0_0_10px_rgba(200,166,106,0.5)]' : 
                          isNext ? 'bg-[#5B1F3D] scale-[1.6] shadow-[0_0_15px_rgba(91,31,61,0.5)]' : 
                          unlocked ? 'bg-[#DCCFC2] scale-100' : 'bg-[#DCCFC2]/80 scale-90'
                        }`} />

                        <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-[0_10px_25px_rgba(0,0,0,0.05)] transition-all duration-700 group-hover/mod:rotate-6 group-hover/mod:scale-105 ${
                          modComplete ? 'bg-[#FAF5EF] text-[#C8A66A] border-2 border-[#C8A66A1A]' : 
                          unlocked && isNext ? 'bg-[#5B1F3D] text-[#FAF5EF]' : 
                          'bg-[#DCCFC2]/30 text-[#5B1F3D]/40 border border-[#DCCFC2]/50'
                        }`}>
                           {modComplete ? <Check className="w-7 h-7 stroke-[4px]" /> : unlocked && isNext ? <Key className="w-8 h-8 animate-pulse" /> : <Lock className="w-6 h-6" />}
                        </div>

                        <div className="flex-1 ml-6 sm:ml-8 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] sm:text-[11px] font-heading font-black tracking-[0.3em] uppercase transition-colors duration-500 ${
                              unlocked ? 'text-[#C8A66A]' : 'text-[#5B1F3D]/50'
                            }`}>
                              Módulo
                            </span>
                            {isNext && (
                              <span className="bg-[#5B1F3D] text-[#FAF5EF] text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md border border-[#C8A66A33]">
                                <Sparkles className="w-2.5 h-2.5" /> Próxima Chave
                              </span>
                            )}
                          </div>
                          <h4 className={`font-heading text-xl sm:text-3xl font-black tracking-tight leading-tight transition-all duration-500 ${
                            unlocked ? 'text-[#5B1F3D]' : 'text-[#5B1F3D]/60'
                          }`}>
                            {mod.name}
                          </h4>
                        </div>

                        <div className="ml-4 flex items-center justify-center">
                          {unlocked && isNext ? (
                            <div className="bg-[#5B1F3D] text-white p-3.5 rounded-full shadow-[0_10px_30px_rgba(91,31,61,0.3)] group-hover/mod:scale-110 transition-all border border-[#C8A66A33]">
                              <Play className="w-6 h-6 fill-current ml-1" />
                            </div>
                          ) : unlocked ? (
                            <div className="p-2 rounded-full bg-[#FAF5EF] border border-[#C8A66A26] transition-all group-hover/mod:border-[#C8A66A80]">
                              <ChevronRight className="w-6 h-6 text-[#C8A66A]" />
                            </div>
                          ) : (
                            <Lock className="w-5 h-5 text-[#5B1F3D]/20" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Landmark Card Decor - Integrated & High Contrast */}
                {landmark && (
                  <div className={`absolute -right-8 sm:-right-16 top-16 w-32 sm:w-48 transition-all duration-1000 hidden lg:block group-hover:scale-110 group-hover:-translate-x-2 ${
                    unlocked ? 'opacity-40 group-hover:opacity-100 grayscale-0' : 'opacity-15 grayscale'
                  }`}>
                    <div className="relative transform rotate-[12deg] transition-transform duration-700">
                      <div className="absolute -inset-1 bg-gradient-to-tr from-[#C8A66A]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src={landmark.img} alt={landmark.name} className="w-full rounded-2xl border-[3px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.15)]" />
                      <div className="absolute inset-x-0 bottom-6 px-4">
                        <div className="bg-white/95 backdrop-blur-md py-2.5 rounded-xl border border-[#C8A66A]/30 shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                          <p className="font-heading text-[10px] font-black text-[#5B1F3D] text-center uppercase tracking-[0.25em]">
                            {landmark.name}
                          </p>
                        </div>
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
