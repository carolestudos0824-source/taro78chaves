/**
 * Registry central dos Arcanos Maiores no formato editorial.
 * 
 * Todos os 22 Arcanos Maiores estão completos.
 * Use validateArcano() para verificar integridade.
 */
/**
 * Registry central dos Arcanos Maiores no formato editorial.
 * 
 * Todos os 22 Arcanos Maiores estão completos.
 * Use validateArcano() para verificar integridade.
 */

import type { ArcanoMaiorEditorial } from "../arcano-editorial";
import { validateArcano, createEmptyArcano, editorialToLegacy } from "../arcano-editorial";
import type { ArcanoData } from "@/lib/content/runtime-types";

import { O_LOUCO } from "./0-o-louco";
import { O_MAGO } from "./1-o-mago";
import { A_SACERDOTISA } from "./2-a-sacerdotisa";
import { A_IMPERATRIZ } from "./3-a-imperatriz";
import { O_IMPERADOR } from "./4-o-imperador";
import { O_HIEROFANTE } from "./5-o-hierofante";
import { OS_ENAMORADOS } from "./6-os-enamorados";
import { O_CARRO } from "./7-o-carro";
import { A_JUSTICA } from "./8-a-justica";
import { O_EREMITA } from "./9-o-eremita";
import { A_RODA_DA_FORTUNA } from "./10-a-roda-da-fortuna";
import { A_FORCA } from "./11-a-forca";
import { O_ENFORCADO } from "./12-o-enforcado";
import { A_MORTE } from "./13-a-morte";
import { A_TEMPERANCA } from "./14-a-temperanca";
import { O_DIABO } from "./15-o-diabo";
import { A_TORRE } from "./16-a-torre";
import { A_ESTRELA } from "./17-a-estrela";
import { A_LUA } from "./18-a-lua";
import { O_SOL } from "./19-o-sol";
import { O_JULGAMENTO } from "./20-o-julgamento";
import { O_MUNDO } from "./21-o-mundo";

// ─── Registry Editorial — 22/22 completos ───

export const EDITORIAL_REGISTRY: Record<number, ArcanoMaiorEditorial> = {
  0: O_LOUCO,
  1: O_MAGO,
  2: A_SACERDOTISA,
  3: A_IMPERATRIZ,
  4: O_IMPERADOR,
  5: O_HIEROFANTE,
  6: OS_ENAMORADOS,
  7: O_CARRO,
  8: A_JUSTICA,
  9: O_EREMITA,
  10: A_RODA_DA_FORTUNA,
  11: A_FORCA,
  12: O_ENFORCADO,
  13: A_MORTE,
  14: A_TEMPERANCA,
  15: O_DIABO,
  16: A_TORRE,
  17: A_ESTRELA,
  18: A_LUA,
  19: O_SOL,
  20: O_JULGAMENTO,
  21: O_MUNDO,
};

// ─── API ───

/** Busca arcano editorial por número */
export function getEditorialArcano(number: number): ArcanoMaiorEditorial | undefined {
  return EDITORIAL_REGISTRY[number];
}

/** Busca arcano editorial por slug */
export function getEditorialArcanoBySlug(slug: string): ArcanoMaiorEditorial | undefined {
  return Object.values(EDITORIAL_REGISTRY).find(a => a.slug === slug);
}

/** Verifica se um arcano está completo (todos os campos preenchidos) */
export function isArcanoComplete(number: number): boolean {
  const arcano = EDITORIAL_REGISTRY[number];
  if (!arcano) return false;
  return validateArcano(arcano).length === 0;
}

/** Lista todos os arcanos com status de completude */
export function getEditorialStatus(): { number: number; name: string; complete: boolean; errors: string[] }[] {
  return Array.from({ length: 22 }, (_, i) => {
    const arcano = EDITORIAL_REGISTRY[i];
    if (!arcano) return { number: i, name: `Arcano ${i}`, complete: false, errors: ["Não encontrado"] };
    const errors = validateArcano(arcano);
    return { number: i, name: arcano.name, complete: errors.length === 0, errors };
  });
}

/** Converte arcano editorial para formato legado (compatível com ArcanoData) */
export function getArcanoAsLegacy(number: number, unlocked = false): ArcanoData | undefined {
  const arcano = EDITORIAL_REGISTRY[number];
  if (!arcano) return undefined;
  return editorialToLegacy(arcano, unlocked);
}

/** Todos os arcanos completos no formato editorial */
export function getCompleteArcanos(): ArcanoMaiorEditorial[] {
  return Object.values(EDITORIAL_REGISTRY).filter(a => validateArcano(a).length === 0);
}

// Re-exports
export {
  O_LOUCO, O_MAGO, A_SACERDOTISA, A_IMPERATRIZ, O_IMPERADOR, O_HIEROFANTE,
  OS_ENAMORADOS, O_CARRO, A_JUSTICA, O_EREMITA, A_RODA_DA_FORTUNA, A_FORCA,
  O_ENFORCADO, A_MORTE, A_TEMPERANCA, O_DIABO, A_TORRE, A_ESTRELA,
  A_LUA, O_SOL, O_JULGAMENTO, O_MUNDO,
};
export { validateArcano, createEmptyArcano, editorialToLegacy } from "../arcano-editorial";
export type { ArcanoMaiorEditorial } from "../arcano-editorial";