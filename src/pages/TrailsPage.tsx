import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Lock, Check, Star, Sparkles, Crown } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { MODULES_CATALOG as MODULES, isModuleUnlocked } from "@/lib/content";
// import ornamentDivider from "@/assets/ornament-divider.png";

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
    icon: "🌱",
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
    icon: "⚜️",
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
    icon: "🔮",
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
    icon: "👑",
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

  // Determine current level
  const currentLevelIdx = TRAIL_LEVELS.findIndex(l => isLevelUnlocked(l) && !isLevelComplete(l));
  const currentLevel = currentLevelIdx >= 0 ? TRAIL_LEVELS[currentLevelIdx] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(42 70% 80% / 0.15) 0%, transparent 60%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 80% 100%, hsl(340 42% 30% / 0.06) 0%, transparent 50%)",
        }} />

        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-6">
          <button
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Módulos</span>
          </button>

          <div className="text-center">
            <div className="text-[10px] tracking-[0.4em] uppercase font-body mb-2" style={{ color: "hsl(36 45% 58% / 0.60)" }}>
              Arcano Vivo
            </div>
            <h1
              className="font-heading text-2xl tracking-wide"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Trilhas de Formação
            </h1>
            <p className="font-accent text-sm italic mt-1" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              Sua jornada do início à maestria
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-6">

        {/* Overall progress */}
        <div className="rounded-xl p-5" style={{
          background: "hsl(38 28% 93% / 0.75)",
          border: "1px solid hsl(36 45% 50% / 0.18)",
        }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
              Progresso Geral
            </h2>
            <span className="font-heading text-sm" style={{ color: "hsl(36 42% 40%)" }}>
              {currentLevel ? `Nível ${currentLevel.level} — ${currentLevel.title}` : "Completo ✦"}
            </span>
          </div>
          <div className="flex gap-1">
            {TRAIL_LEVELS.map(level => {
              const prog = getLevelProgress(level);
              const complete = isLevelComplete(level);
              const unlocked = isLevelUnlocked(level);
              return (
                <div key={level.id} className="flex-1">
                  <div className="h-2.5 rounded-full overflow-hidden" style={{
                    background: unlocked ? "hsl(36 18% 84%)" : "hsl(36 12% 90%)",
                    border: `1px solid ${unlocked ? "hsl(36 22% 75% / 0.50)" : "hsl(36 15% 85% / 0.30)"}`,
                  }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{
                      width: `${Math.max(prog, complete ? 100 : 0)}%`,
                      background: complete
                        ? `linear-gradient(90deg, ${level.accentColor}, hsl(36 42% 44%))`
                        : `linear-gradient(90deg, hsl(340 42% 26%), hsl(36 42% 44%))`,
                    }} />
                  </div>
                  <div className="text-[9px] font-body text-center mt-1" style={{
                    color: unlocked ? "hsl(230 15% 30% / 0.45)" : "hsl(230 15% 30% / 0.25)",
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
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: unlocked
                      ? `${level.accentColor}15`
                      : "hsl(36 15% 88% / 0.50)",
                    border: `1.5px solid ${unlocked ? level.accentBorder : "hsl(36 18% 80% / 0.25)"}`,
                    opacity: unlocked ? 1 : 0.5,
                  }}
                >
                  {unlocked ? level.icon : <Lock className="w-5 h-5" style={{ color: "hsl(230 15% 30% / 0.25)" }} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] tracking-[0.3em] uppercase font-body" style={{
                      color: unlocked ? level.accentColor : "hsl(230 15% 30% / 0.30)",
                    }}>
                      Nível {level.level}
                    </span>
                    {complete && (
                      <span className="text-[9px] tracking-[0.2em] uppercase font-body px-2 py-0.5 rounded-full" style={{
                        background: `${level.accentColor}15`,
                        color: level.accentColor,
                      }}>
                        Concluído
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[9px] tracking-[0.2em] uppercase font-body px-2 py-0.5 rounded-full" style={{
                        background: "hsl(340 42% 30% / 0.10)",
                        color: "hsl(340 42% 28%)",
                      }}>
                        Em progresso
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-lg tracking-wide" style={{
                    color: unlocked ? "hsl(340 42% 22%)" : "hsl(230 15% 30% / 0.35)",
                  }}>
                    {level.title}
                  </h2>
                  <p className="font-accent text-xs italic" style={{
                    color: unlocked ? "hsl(230 20% 15% / 0.50)" : "hsl(230 15% 30% / 0.25)",
                  }}>
                    {level.subtitle}
                  </p>
                </div>
                {isCurrent && (
                  <span className="font-heading text-sm shrink-0" style={{ color: level.accentColor }}>
                    {prog}%
                  </span>
                )}
              </div>

              {/* Module cards */}
              <div className="space-y-2.5 ml-6 border-l-2 pl-5" style={{
                borderColor: unlocked ? `${level.accentColor}25` : "hsl(36 18% 85% / 0.30)",
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
                      className="w-full text-left group transition-all duration-300"
                    >
                      <div className="rounded-xl p-4 flex items-center gap-3.5 transition-all duration-300" style={modCurrent ? {
                        background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(36 33% 95% / 0.90))",
                        border: `1.5px solid ${level.accentBorder}`,
                        boxShadow: `0 4px 20px ${level.accentColor}10`,
                      } : modComplete ? {
                        background: "hsl(38 28% 94% / 0.80)",
                        border: "1px solid hsl(36 42% 52% / 0.25)",
                      } : {
                        background: "hsl(36 18% 90% / 0.40)",
                        border: "1px solid hsl(36 22% 80% / 0.30)",
                      }}>
                        {/* Status icon */}
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={modComplete ? {
                          background: `${level.accentColor}12`,
                          border: `1.5px solid ${level.accentColor}30`,
                        } : modCurrent ? {
                          background: "hsl(38 28% 93%)",
                          border: `1.5px solid ${level.accentBorder}`,
                        } : {
                          background: "hsl(36 18% 90% / 0.55)",
                          border: "1px solid hsl(36 22% 75% / 0.35)",
                        }}>
                          {modComplete ? (
                            <Check className="w-4 h-4" style={{ color: level.accentColor }} />
                          ) : modCurrent ? (
                            <span className="text-sm">{mod.icon}</span>
                          ) : (
                            <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 45% / 0.25)" }} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-sm tracking-wide truncate" style={{
                            color: modCurrent ? "hsl(340 42% 22%)" : modComplete ? "hsl(230 20% 12% / 0.75)" : "hsl(230 10% 45% / 0.30)",
                          }}>
                            {mod.name}
                          </h3>
                          <p className="font-accent text-[11px] italic truncate" style={{
                            color: modCurrent ? "hsl(230 20% 15% / 0.50)" : modComplete ? "hsl(230 20% 15% / 0.40)" : "hsl(230 10% 45% / 0.18)",
                          }}>
                            {mod.subtitle}
                          </p>
                        </div>

                        {modUnlocked && (
                          <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{
                            color: modCurrent ? level.accentColor : "hsl(36 42% 45% / 0.35)",
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
