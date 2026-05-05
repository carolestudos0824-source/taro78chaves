import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { MODULES_CATALOG as MODULES, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, type LearningModule } from "@/lib/content";

/** Module lesson prefix mapping for detecting last completed lesson per module */
const MODULE_PREFIX_MAP: Record<string, { prefix: string; route: (order: number) => string; getLessonName?: (id: string) => string }> = {
  "fundamentos":         { prefix: "fund-", route: (o) => `/fundamentos/${o}` },
  "leitura-simbolica":   { prefix: "ls-",   route: (o) => `/leitura-simbolica/${o}` },
  "arcanos-maiores":     { prefix: "arcano-", route: (o) => `/lesson/${o}` },
  "arquitetura-menores": { prefix: "am-",   route: (o) => `/arquitetura-menores/${o}` },
  "copas":               { prefix: "copas-", route: (o) => `/naipe/copas/${o}` },
  "paus":                { prefix: "paus-",  route: (o) => `/naipe/paus/${o}` },
  "espadas":             { prefix: "espadas-", route: (o) => `/naipe/espadas/${o}` },
  "ouros":               { prefix: "ouros-", route: (o) => `/naipe/ouros/${o}` },
  "cartas-corte":        { prefix: "corte-", route: (o) => `/cartas-corte/${o}` },
  "combinacoes":         { prefix: "comb-", route: (o) => `/combinacoes/${o}` },
  "tiragens":            { prefix: "tir-",  route: (o) => `/tiragens/${o}` },
  "espiritualidade":     { prefix: "esp-",  route: (o) => `/espiritualidade/${o}` },
  "mesa-taro":           { prefix: "mesa-", route: (o) => `/mesa-taro/${o}` },
  "leitura-aplicada":    { prefix: "la-",   route: (o) => `/leitura-aplicada/${o}` },
  "pratica":             { prefix: "prat-", route: (o) => `/pratica/${o}` },
  "trabalhar-taro":      { prefix: "tt-",   route: (o) => `/trabalhar-taro/${o}` },
  "amor":                { prefix: "amor-", route: (o) => `/amor/${o}` },
};

interface ContinuityCardProps {
  lastLessonId: string | null;
  lastLessonName: string | null;
  completedLessons: number;
  completedQuizzes: number;
  hasUnfinishedReview: boolean;
  /** Full completed lessons array for smart suggestions */
  completedLessonIds?: string[];
  currentModuleId?: string;
}

function findNextLessonSuggestion(completedLessonIds: string[], currentModuleId?: string): { label: string; subtitle: string; path: string } | null {
  const uniqueCompleted = new Set(completedLessonIds);

  // Check each module in order for in-progress work
  for (const mod of MODULES) {
    const mapping = MODULE_PREFIX_MAP[mod.id];
    if (!mapping) continue;

    if (mod.id === "arcanos-maiores") {
      const completedArcanos = Array.from(uniqueCompleted).filter(l => l.startsWith("arcano-"));
      if (completedArcanos.length > 0 && completedArcanos.length < 22) {
        // Encontrar a primeira lacuna ou o próximo após o maior
        const completedNums = completedArcanos.map(l => parseInt(l.replace("arcano-", ""))).filter(n => !isNaN(n));
        let nextId = -1;
        
        // Procurar garras (gaps) primeiro
        for (let i = 0; i <= 21; i++) {
          if (!completedNums.includes(i)) {
            nextId = i;
            break;
          }
        }

        if (nextId !== -1) {
          const next = ARCANOS_MAIORES.find(a => a.id === nextId);
          if (next) {
            return {
              label: `Continuar: ${next.name}`,
              subtitle: nextId === 0 ? "Comece sua jornada" : "Próximo arcano na jornada",
              path: `/lesson/${nextId}`,
            };
          }
        }
      }
      continue;
    }

    const completedInModule = Array.from(uniqueCompleted).filter(l => l.startsWith(mapping.prefix));
    
    if (completedInModule.length > 0 && completedInModule.length < mod.totalLessons) {
      // Encontrar a primeira lição não concluída neste módulo
      const completedOrders = completedInModule.map(l => {
        const num = parseInt(l.replace(mapping.prefix, ""));
        return isNaN(num) ? -1 : num;
      }).filter(n => n !== -1);

      let nextOrder = -1;
      for (let i = 0; i < mod.totalLessons; i++) {
        if (!completedOrders.includes(i)) {
          nextOrder = i;
          break;
        }
      }

      if (nextOrder !== -1 && nextOrder < mod.totalLessons) {
        return {
          label: `Continuar: ${mod.name}`,
          subtitle: `Lição ${nextOrder + 1} de ${mod.totalLessons}`,
          path: mapping.route(nextOrder),
        };
      }
    }
  }

  // Se nenhum módulo está em andamento, sugerir o primeiro módulo não iniciado
  for (const mod of MODULES) {
    const mapping = MODULE_PREFIX_MAP[mod.id];
    if (!mapping) continue;

    const completedInModule = Array.from(uniqueCompleted).filter(l => l.startsWith(mapping.prefix));
    if (completedInModule.length === 0) {
      if (mod.id === "arcanos-maiores") {
        return {
          label: "Começar Arcanos Maiores",
          subtitle: "A Jornada do Louco",
          path: "/lesson/0",
        };
      }
      return {
        label: `Iniciar: ${mod.name}`,
        subtitle: mod.subtitle,
        path: mapping.route(0),
      };
    }
  }

  // Se tudo estiver completo
  if (uniqueCompleted.size > 0) {
    return {
      label: "Jornada Concluída",
      subtitle: "Parabéns! Você finalizou todos os módulos.",
      path: "/perfil",
    };
  }

  // Fallback para novos usuários
  return {
    label: "Começar pelo Louco — Grátis",
    subtitle: "Inicie sua jornada no tarô",
    path: "/lesson/0",
  };
}

const ContinuityCard = ({ lastLessonId, lastLessonName, completedLessons, completedQuizzes, hasUnfinishedReview, completedLessonIds, currentModuleId }: ContinuityCardProps) => {
  const navigate = useNavigate();

  const actions: Array<{
    label: string;
    subtitle: string;
    path: string;
    icon: typeof ArrowRight;
    priority: number;
  }> = [];

  // Smart suggestion based on all completed lessons
  if (completedLessonIds && completedLessonIds.length > 0) {
    const suggestion = findNextLessonSuggestion(completedLessonIds, currentModuleId);
    if (suggestion) {
      actions.push({ ...suggestion, icon: ArrowRight, priority: 1 });
    }
  } else if (lastLessonId && lastLessonName) {
    actions.push({
      label: `Continuar: ${lastLessonName}`,
      subtitle: "Retome de onde parou",
      path: `/lesson/${lastLessonId}`,
      icon: ArrowRight,
      priority: 1,
    });
  }

  if (completedLessons >= 3 && hasUnfinishedReview) {
    actions.push({
      label: "Revisão rápida",
      subtitle: "Reforce o que já aprendeu",
      path: "/revisao",
      icon: RefreshCw,
      priority: 2,
    });
  }

  actions.push({
    label: "Ritual diário",
    subtitle: "Sua prática de hoje",
    path: "/desafios",
    icon: Sparkles,
    priority: 3,
  });

  const topActions = actions.sort((a, b) => a.priority - b.priority).slice(0, 2);
  if (topActions.length === 0) return null;

  return (
    <div className="mb-5">
      <p className="t-section-title text-center mb-3" style={{ color: "hsl(340 42% 28% / 0.50)" }}>
        Continue sua jornada
      </p>
      <div className="space-y-2">
        {topActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="w-full group transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="rounded-xl p-3.5 flex items-center gap-3" style={{
                background: "linear-gradient(145deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
                border: "1px solid hsl(340 42% 28% / 0.15)",
                boxShadow: "0 2px 10px hsl(340 42% 28% / 0.04)",
              }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "hsl(340 42% 28% / 0.06)",
                  border: "1px solid hsl(340 42% 28% / 0.15)",
                }}>
                  <Icon className="w-4 h-4" style={{ color: "hsl(340 42% 26%)" }} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="t-card-title truncate" style={{ color: "hsl(340 42% 22%)" }}>
                    {action.label}
                  </h4>
                  <p className="t-card-subtitle" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
                    {action.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(340 42% 28% / 0.30)" }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContinuityCard;
