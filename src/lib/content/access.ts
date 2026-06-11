/**
 * Serviço formal de acesso e progressão.
 *
 * Centraliza:
 *   - Quais arcanos estão disponíveis inicialmente para todos (FREE_ARCANO_IDS)
 *   - Regras de desbloqueio de módulos (isModuleUnlocked)
 *   - Helpers correlatos
 *
 * Esta é a ÚNICA fonte autorizada para essas decisões.
 */

import { MODULES_CATALOG, getModuleFromCatalog } from "./catalog";

/**
 * IDs de arcanos disponíveis inicialmente para demonstração da metodologia.
 * Mantemos o nome FREE_ARCANO_IDS internamente por compatibilidade, 
 * mas a lógica comercial é de "acesso inicial".
 */
export const FREE_ARCANO_IDS: readonly number[] = [0];

export function hasInitialAccess(arcanoId: number, quizScores: Record<string, number> = {}, completedModules: string[] = []): boolean {
  // O Louco (ID 0) is only accessible after completing Fundamentos
  if (arcanoId === 0) {
    return completedModules.includes("fundamentos");
  }
  
  // O Mago (ID 1) requires subscription
  return false;
}

/**
 * Decide se um módulo está desbloqueado dado o conjunto de módulos já
 * concluídos pelo usuário. Regra atual: módulo sem pré-requisito é livre;
 * módulo com pré-requisito exige que o pré-requisito esteja em
 * completedModules.
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
