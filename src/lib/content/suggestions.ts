import { MODULES_CATALOG as MODULES, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES } from "./catalog";

/** Module lesson prefix mapping for detecting last completed lesson per module */
export const MODULE_PREFIX_MAP: Record<string, { 
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
  "cartas-corte":        { prefix: "corte-", route: (o) => `/module/cartas-corte` }, 
  "combinacoes":         { prefix: "comb-", route: (o) => `/combinacoes/${o}` },
  "tiragens":            { prefix: "tir-",  route: (o) => `/tiragens/${o}` },
  "espiritualidade":     { prefix: "esp-",  route: (o) => `/espiritualidade/${o}` },
  "mesa-taro":           { prefix: "mesa-", route: (o) => `/mesa-taro/${o}` },
  "leitura-aplicada":    { prefix: "la-",   route: (o) => `/leitura-aplicada/${o}` },
  "pratica":             { prefix: "prat-", route: (o) => `/pratica/${o}` },
  "trabalhar-taro":      { prefix: "tt-",   route: (o) => `/trabalhar-taro/${o}` },
  "amor":                { prefix: "amor-", route: (o) => `/amor/${o}` },
};

export function findNextLessonSuggestion(completedLessonIds: string[], currentModuleId?: string): { label: string; subtitle: string; path: string } | null {
  const uniqueCompleted = new Set(completedLessonIds);

  // Check each module in order for in-progress work
  for (const mod of MODULES) {
    const mapping = MODULE_PREFIX_MAP[mod.id];
    if (!mapping) continue;

    if (mod.id === "arcanos-maiores") {
      const completedArcanos = Array.from(uniqueCompleted).filter(l => l.startsWith("arcano-"));
      if (completedArcanos.length > 0 && completedArcanos.length < 22) {
        // Find first gap or next after max
        const completedNums = completedArcanos.map(l => parseInt(l.replace("arcano-", ""))).filter(n => !isNaN(n));
        let nextId = -1;
        
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

  // Suggest first unstarted module
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

  if (uniqueCompleted.size > 0) {
    return {
      label: "Jornada Concluída",
      subtitle: "Parabéns! Você finalizou todos os módulos.",
      path: "/app",
    };
  }

  return {
    label: "Começar pelo Louco",
    subtitle: "Inicie sua jornada no tarô",
    path: "/lesson/0",
  };
}
