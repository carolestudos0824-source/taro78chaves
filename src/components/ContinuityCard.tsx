import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { MODULES_CATALOG as MODULES, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, type LearningModule } from "@/lib/content";

/** Module lesson prefix mapping for detecting last completed lesson per module */
const MODULE_PREFIX_MAP: Record<string, { 
  prefix: string; 
  route: (order: number, modId?: string) => string; 
  getLessonName?: (id: string) => string 
}> = {
  "fundamentos":         { prefix: "fund-", route: (o) => `/fundamentos/${o}` },
  "leitura-simbolica":   { prefix: "ls-",   route: (o) => `/leitura-simbolica/${o}` },
  "arcanos-maiores":     { prefix: "arcano-", route: (o) => `/lesson/${o}` },
  "arquitetura-menores": { prefix: "am-",   route: (o) => `/arquitetura-menores/${o}` },
  "copas":               { prefix: "copas-", route: (o) => `/arcano-menor/copas-${o < 10 ? o + 1 : ['pajem', 'cavaleiro', 'rainha', 'rei'][o - 10]}` },
  "paus":                { prefix: "paus-",  route: (o) => `/arcano-menor/paus-${o < 10 ? o + 1 : ['pajem', 'cavaleiro', 'rainha', 'rei'][o - 10]}` },
  "espadas":             { prefix: "espadas-", route: (o) => `/arcano-menor/espadas-${o < 10 ? o + 1 : ['pajem', 'cavaleiro', 'rainha', 'rei'][o - 10]}` },
  "ouros":               { prefix: "ouros-", route: (o) => `/arcano-menor/ouros-${o < 10 ? o + 1 : ['pajem', 'cavaleiro', 'rainha', 'rei'][o - 10]}` },
  "cartas-corte":        { prefix: "corte-", route: (o) => `/module/cartas-corte` }, // Redirect to module for now as it's a grid
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
          path: mapping.route(nextOrder, mod.id),
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
        path: mapping.route(0, mod.id),
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
  } else {
    // If no progress, prioritize O Louco
    actions.push({
      label: "Abrir: O Louco",
      subtitle: "Sua primeira chave na jornada",
      path: "/lesson/0",
      icon: ArrowRight,
      priority: 1,
    });
  }

  if (lastLessonId && lastLessonName && !actions.find(a => a.priority === 1)) {
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
    subtitle: "Sua prática mística de hoje",
    path: "/desafios",
    icon: Sparkles,
    priority: 4,
  });

  const topActions = actions.sort((a, b) => a.priority - b.priority).slice(0, 2);
  if (topActions.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4">
        <span className="h-px flex-1 bg-[#C8A66A]/20" />
        <h2 className="font-heading text-[11px] tracking-[0.3em] uppercase font-black text-[#5B1F3D]">
          Sua Travessia
        </h2>
        <span className="h-px flex-1 bg-[#C8A66A]/20" />
      </div>
      <div className="grid gap-3">
        {topActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="w-full group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="rounded-2xl p-5 flex items-center gap-5 bg-white border-2 border-[#DCCFC2]/40 shadow-lg hover:border-[#C8A66A]/40">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#FAF5EF] border border-[#C8A66A]/20 shadow-inner group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6 text-[#5B1F3D]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-heading text-base font-black tracking-tight text-[#5B1F3D]">
                    {action.label}
                  </h4>
                  <p className="text-[12px] font-body font-bold italic text-[#5B1F3D]/70 leading-tight">
                    {action.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1.5 transition-transform text-[#C8A66A]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContinuityCard;
