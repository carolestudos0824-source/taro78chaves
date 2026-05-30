/**
 * Serviço formal de acesso e progressão.
 *
 * Centraliza:
 *   - Quais arcanos estão disponíveis inicialmente para todos (`INITIAL_ACCESS_ARCANO_IDS`)
 *   - Regras de desbloqueio de módulos (`isModuleUnlocked`)
 *   - Helpers correlatos
 *
 * Esta é a ÚNICA fonte autorizada para essas decisões. Telas e componentes
 * não devem mais ler `INITIAL_ACCESS_ARCANO_IDS` ou `isModuleUnlocked` de
 * `@/data/tarot-data`.
 */

import { MODULES_CATALOG, getModuleFromCatalog } from "./catalog";

/**
 * IDs de arcanos disponíveis inicialmente para demonstração da metodologia.
 *
 * Fonte formal: hoje é uma constante governada aqui.
 */
export const INITIAL_ACCESS_ARCANO_IDS: readonly number[] = [0];

export function isArcanoFree(arcanoId: number, quizScores: Record<string, number> = {}): boolean {
  if (arcanoId === 0) return true;
  if (arcanoId === 1) {
    const score = quizScores["quiz-arcano-0"] || 0;
    return score >= 0.8;
  }
  return false;
}

/**
 * Decide se um módulo está desbloqueado dado o conjunto de módulos já
 * concluídos pelo usuário. Regra atual: módulo sem pré-requisito é livre;
 * módulo com pré-requisito exige que o pré-requisito esteja em
 * `completedModules`.
 */
export function isModuleUnlocked(
  moduleId: string,
  completedModules: string[],
): boolean {
  const mod = getModuleFromCatalog(moduleId);
  if (!mod) return false;
  if (!mod.prerequisiteModuleId) return true;
  return completedModules.includes(mod.prerequisiteModuleId);
}

/** Próximo módulo desbloqueado e ainda não concluído (em ordem do catálogo). */
export function getNextUnlockedModuleId(
  completedModules: string[],
): string | null {
  for (const m of MODULES_CATALOG) {
    if (completedModules.includes(m.id)) continue;
    if (isModuleUnlocked(m.id, completedModules)) return m.id;
  }
  return null;
}
