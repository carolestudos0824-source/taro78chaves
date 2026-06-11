/**
/**
 * ════════════════════════════════════════════════════════════════
 * MANIFESTO OFICIAL DOS 22 ARCANOS MAIORES — DECK PRINCIPAL
 * ════════════════════════════════════════════════════════════════
 */
/**
 * ════════════════════════════════════════════════════════════════
 * MANIFESTO OFICIAL DOS 22 ARCANOS MAIORES — DECK PRINCIPAL
 * ════════════════════════════════════════════════════════════════
 *
 * Esta é a fonte da verdade IMUTÁVEL para o deck principal.
 * Define a correspondência fixa entre:
 *   número ↔ numeral ↔ nome ↔ slug ↔ asset visual
 *
 * Qualquer divergência entre este manifesto e os arquivos editoriais
 * em src/data/arcanos/ é tratada como QUEBRA do deck oficial e
 * deve falhar o build (ver src/data/arcanos-deck.test.ts).
 *
 * ⚠️  NÃO ALTERE este arquivo sem revisão editorial formal.
 *     Trocar uma única linha pode invalidar admin, jornada e lições.
 */

export interface ArcanoMaiorCanonical {
  readonly number: number;
  readonly numeral: string;
  readonly name: string;
  readonly slug: string;
  /** Caminho do asset oficial (importável via @/assets/...) */
  readonly assetFile: string;
}

export const ARCANOS_MAIORES_OFICIAIS: readonly ArcanoMaiorCanonical[] = [
  { number: 0,  numeral: "0",     name: "O Louco",            slug: "o-louco",            assetFile: "arcano-0-louco.jpg" },
  { number: 1,  numeral: "I",     name: "O Mago",             slug: "o-mago",             assetFile: "arcano-1-mago.jpg" },
  { number: 2,  numeral: "II",    name: "A Sacerdotisa",      slug: "a-sacerdotisa",      assetFile: "arcano-2-sacerdotisa.jpg" },
  { number: 3,  numeral: "III",   name: "A Imperatriz",       slug: "a-imperatriz",       assetFile: "arcano-3-imperatriz.jpg" },
  { number: 4,  numeral: "IV",    name: "O Imperador",        slug: "o-imperador",        assetFile: "arcano-4-imperador.jpg" },
  { number: 5,  numeral: "V",     name: "O Hierofante",       slug: "o-hierofante",       assetFile: "arcano-5-hierofante.jpg" },
  { number: 6,  numeral: "VI",    name: "Os Enamorados",      slug: "os-enamorados",      assetFile: "arcano-6-enamorados.jpg" },
  { number: 7,  numeral: "VII",   name: "O Carro",            slug: "o-carro",            assetFile: "arcano-7-carro.jpg" },
  { number: 8,  numeral: "VIII",  name: "A Justiça",          slug: "a-justica",          assetFile: "arcano-8-justica.jpg" },
  { number: 9,  numeral: "IX",    name: "O Eremita",          slug: "o-eremita",          assetFile: "arcano-9-eremita.jpg" },
  { number: 10, numeral: "X",     name: "A Roda da Fortuna",  slug: "a-roda-da-fortuna",  assetFile: "arcano-10-roda-fortuna.jpg" },
  { number: 11, numeral: "XI",    name: "A Força",            slug: "a-forca",            assetFile: "arcano-11-forca.jpg" },
  { number: 12, numeral: "XII",   name: "O Enforcado",        slug: "o-enforcado",        assetFile: "arcano-12-enforcado.jpg" },
  { number: 13, numeral: "XIII",  name: "A Morte",            slug: "a-morte",            assetFile: "arcano-13-morte.jpg" },
  { number: 14, numeral: "XIV",   name: "A Temperança",       slug: "a-temperanca",       assetFile: "arcano-14-temperanca.jpg" },
  { number: 15, numeral: "XV",    name: "O Diabo",            slug: "o-diabo",            assetFile: "arcano-15-diabo.jpg" },
  { number: 16, numeral: "XVI",   name: "A Torre",            slug: "a-torre",            assetFile: "arcano-16-torre.jpg" },
  { number: 17, numeral: "XVII",  name: "A Estrela",          slug: "a-estrela",          assetFile: "arcano-17-estrela.jpg" },
  { number: 18, numeral: "XVIII", name: "A Lua",              slug: "a-lua",              assetFile: "arcano-18-lua.jpg" },
  { number: 19, numeral: "XIX",   name: "O Sol",              slug: "o-sol",              assetFile: "arcano-19-sol.jpg" },
  { number: 20, numeral: "XX",    name: "O Julgamento",       slug: "o-julgamento",       assetFile: "arcano-20-julgamento.jpg" },
  { number: 21, numeral: "XXI",   name: "O Mundo",            slug: "o-mundo",            assetFile: "arcano-21-mundo.jpg" },
] as const;

/** Total esperado de Arcanos Maiores no deck oficial. */
export const TOTAL_ARCANOS_MAIORES = 22;

/** Lookup O(1) por número. */
export const ARCANOS_BY_NUMBER: ReadonlyMap<number, ArcanoMaiorCanonical> = new Map(
  ARCANOS_MAIORES_OFICIAIS.map((a) => [a.number, a])
);

/** Lookup O(1) por slug. */
export const ARCANOS_BY_SLUG: ReadonlyMap<string, ArcanoMaiorCanonical> = new Map(
  ARCANOS_MAIORES_OFICIAIS.map((a) => [a.slug, a])
);

export interface DeckValidationIssue {
  number: number;
  field: string;
  expected: string;
  actual: string;
}

/**
 * Valida um arcano editorial contra o manifesto oficial.
 * Retorna lista vazia se 100% conforme.
 */
export function validateAgainstManifest(arcano: {
  number: number;
  name: string;
  numeral: string;
  slug: string;
}): DeckValidationIssue[] {
  const oficial = ARCANOS_BY_NUMBER.get(arcano.number);
  const issues: DeckValidationIssue[] = [];
  if (!oficial) {
    issues.push({ number: arcano.number, field: "number", expected: "0..21", actual: String(arcano.number) });
    return issues;
  }
  if (arcano.name !== oficial.name) issues.push({ number: arcano.number, field: "name", expected: oficial.name, actual: arcano.name });
  if (arcano.numeral !== oficial.numeral) issues.push({ number: arcano.number, field: "numeral", expected: oficial.numeral, actual: arcano.numeral });
  if (arcano.slug !== oficial.slug) issues.push({ number: arcano.number, field: "slug", expected: oficial.slug, actual: arcano.slug });
  return issues;
}