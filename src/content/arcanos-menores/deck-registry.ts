/**
 * REGISTRY OFICIAL — Acervo dos 56 Arcanos Menores.
 *
 * Fonte canônica única para id, nome, naipe, posição, slug, imagem,
 * status visual (imagem disponível) e status editorial (conteúdo pronto).
 *
 * Derivado automaticamente de ARCANOS_MENORES — não duplica conteúdo.
 * Use este registry no admin, jornada, lições e quizzes para garantir
 * que toda a plataforma fala sobre as mesmas 56 cartas.
 */

import {
  ARCANOS_MENORES,
  type ArcanoMenorEditorial,
  type Naipe,
  type CartaPosicao,
  isCourtCard,
} from "./index";
import { FROZEN_DECK, FROZEN_BY_ID, FROZEN_DECK_VERSION, DECK_MENORES_OFICIAL } from "./deck-frozen";

export { FROZEN_DECK, FROZEN_DECK_VERSION, DECK_MENORES_OFICIAL };

export type StatusValidacao = "validado" | "pendente" | "ausente";

export interface DeckEntry {
  /** ID canônico: "{naipe}-{posicao}" — ex.: "copas-1", "espadas-rainha" */
  id: string;
  /** Nome canônico em português — ex.: "Ás de Copas" */
  nome: string;
  /** Slug URL-safe — ex.: "as-de-copas", "rainha-de-espadas" */
  slug: string;
  /** Naipe oficial */
  naipe: Naipe;
  /** Posição: 1-10 (numérica) ou "pajem"|"cavaleiro"|"rainha"|"rei" */
  posicao: CartaPosicao;
  /** Tipo derivado para filtros */
  tipo: "numerada" | "corte";
  /** Caminho oficial da imagem RWS */
  cardImage: string;
  /** Status visual: imagem está pronta? */
  statusVisual: StatusValidacao;
  /** Status editorial: conteúdo está pronto e auditado? */
  statusEditorial: StatusValidacao;
}

// ─── Slug helpers ─────────────────────────────────────────────────

const NUMERAL_SLUG: Record<number, string> = {
  1: "as", 2: "dois", 3: "tres", 4: "quatro", 5: "cinco",
  6: "seis", 7: "sete", 8: "oito", 9: "nove", 10: "dez",
};

function getCardSlug(posicao: CartaPosicao, naipe: Naipe): string {
  const pos = typeof posicao === "number" ? NUMERAL_SLUG[posicao] : posicao;
  return `${pos}-de-${naipe}`;
}

// ─── Validação editorial (mesma régua das outras auditorias) ──────

const REQ_FIELDS = [
  "subtitulo", "essencia", "simbolosCentrais", "arquetipo",
  "luz", "sombra", "licaoPratica",
  "interpretacaoAmor", "interpretacaoTrabalho", "interpretacaoEspiritualidade",
  "vozDaCarta", "aprofundamento",
] as const;

function isEditorialReady(c: ArcanoMenorEditorial): boolean {
  const allFields = REQ_FIELDS.every(k => c[k] && c[k].length > 0);
  const aprofOk = (c.aprofundamento?.length ?? 0) >= 300;
  const quizOk = (c.quiz?.length ?? 0) >= 3;
  const rrOk = !!c.revisaoRapida?.palavraChave;
  return allFields && aprofOk && quizOk && rrOk;
}

// ─── Status visual ────────────────────────────────────────────────
// Cartas com imagem oficial confirmada. Atualize ao adicionar arte.
// Por padrão, marcamos todas como "pendente" — promova para "validado"
// quando o asset estiver realmente disponível em /assets/arcanos-menores/.
const VISUAL_VALIDATED: ReadonlySet<string> = new Set<string>([
  // Numerados (já fechados)
  "copas-1", "copas-2", "copas-3", "copas-4", "copas-5", "copas-6", "copas-7", "copas-8", "copas-9", "copas-10",
  "paus-1", "paus-2", "paus-3", "paus-4", "paus-5", "paus-6", "paus-7", "paus-8", "paus-9", "paus-10",
  "espadas-1", "espadas-2", "espadas-3", "espadas-4", "espadas-5", "espadas-6", "espadas-7", "espadas-8", "espadas-9", "espadas-10",
  "ouros-1", "ouros-2", "ouros-3", "ouros-4", "ouros-5", "ouros-6", "ouros-7", "ouros-8", "ouros-9", "ouros-10",
  // Cortes fechadas
  "copas-pajem", "copas-cavaleiro", "copas-rainha", "copas-rei",
  "paus-pajem", "paus-cavaleiro", "paus-rainha", "paus-rei",
]);

// ─── Build do Registry ────────────────────────────────────────────

function buildEntry(c: ArcanoMenorEditorial): DeckEntry {
  return {
    id: c.id,
    nome: c.nome,
    slug: getCardSlug(c.posicao, c.naipe),
    naipe: c.naipe,
    posicao: c.posicao,
    tipo: isCourtCard(c.posicao) ? "corte" : "numerada",
    cardImage: c.cardImage,
    statusVisual: VISUAL_VALIDATED.has(c.id) ? "validado" : "pendente",
    statusEditorial: isEditorialReady(c) ? "validado" : "pendente",
  };
}

// ─── Lazy registry (evita TDZ no ciclo ./index ↔ ./deck-registry) ─
// ARCANOS_MENORES vem de ./index, que re-exporta deste arquivo.
// Inicialização preguiçosa garante que ARCANOS_MENORES já esteja pronto
// no momento do primeiro acesso, sem quebrar consumidores existentes.

let _registry: readonly DeckEntry[] | null = null;
let _byId: ReadonlyMap<string, DeckEntry> | null = null;
let _bySlug: ReadonlyMap<string, DeckEntry> | null = null;

function buildAll(): readonly DeckEntry[] {
  if (_registry) return _registry;
  _registry = ARCANOS_MENORES.map(buildEntry);
  _byId = new Map(_registry.map(e => [e.id, e]));
  _bySlug = new Map(_registry.map(e => [e.slug, e]));
  return _registry;
}

/** Acervo oficial — 56 entradas, ordem canônica Copas→Paus→Espadas→Ouros, Ás→Rei */
export const DECK_MENORES_REGISTRY: readonly DeckEntry[] = new Proxy([] as DeckEntry[], {
  get(_t, prop, recv) { return Reflect.get(buildAll() as DeckEntry[], prop, recv); },
  has(_t, prop) { return Reflect.has(buildAll() as DeckEntry[], prop); },
  ownKeys() { return Reflect.ownKeys(buildAll() as DeckEntry[]); },
  getOwnPropertyDescriptor(_t, prop) { return Reflect.getOwnPropertyDescriptor(buildAll() as DeckEntry[], prop); },
}) as readonly DeckEntry[];

/** Mapa O(1) por id */
export const DECK_BY_ID: ReadonlyMap<string, DeckEntry> = new Proxy(new Map<string, DeckEntry>(), {
  get(_t, prop, recv) { buildAll(); return Reflect.get(_byId!, prop, recv).bind?.(_byId) ?? Reflect.get(_byId!, prop, recv); },
}) as ReadonlyMap<string, DeckEntry>;

/** Mapa O(1) por slug */
export const DECK_BY_SLUG: ReadonlyMap<string, DeckEntry> = new Proxy(new Map<string, DeckEntry>(), {
  get(_t, prop, recv) { buildAll(); return Reflect.get(_bySlug!, prop, recv).bind?.(_bySlug) ?? Reflect.get(_bySlug!, prop, recv); },
}) as ReadonlyMap<string, DeckEntry>;

// ─── API pública ──────────────────────────────────────────────────

export function getDeckEntry(id: string): DeckEntry | undefined {
  return DECK_BY_ID.get(id);
}

export function getDeckEntryBySlug(slug: string): DeckEntry | undefined {
  return DECK_BY_SLUG.get(slug);
}

export function getDeckByNaipe(naipe: Naipe): DeckEntry[] {
  return DECK_MENORES_REGISTRY.filter(e => e.naipe === naipe);
}

export function getDeckByTipo(tipo: "numerada" | "corte"): DeckEntry[] {
  return DECK_MENORES_REGISTRY.filter(e => e.tipo === tipo);
}

/** Stats agregadas para painel admin */
export function getDeckStats() {
  const total = DECK_MENORES_REGISTRY.length;
  const editorialOk = DECK_MENORES_REGISTRY.filter(e => e.statusEditorial === "validado").length;
  const visualOk = DECK_MENORES_REGISTRY.filter(e => e.statusVisual === "validado").length;
  return {
    total,
    numeradas: getDeckByTipo("numerada").length,
    corte: getDeckByTipo("corte").length,
    editorial: { validado: editorialOk, pendente: total - editorialOk },
    visual: { validado: visualOk, pendente: total - visualOk },
  };
}

// ─── Guard de integridade (executável em testes) ──────────────────

export interface DeckIntegrityIssue {
  id: string;
  problema: string;
  detalhe?: unknown;
}

/** Valida toda a estrutura do deck. Retorna [] se tudo está perfeito. */
export function validateDeckIntegrity(): DeckIntegrityIssue[] {
  const issues: DeckIntegrityIssue[] = [];

  // 1. Cardinalidade
  if (DECK_MENORES_REGISTRY.length !== 56) {
    issues.push({ id: "_deck_", problema: "cardinalidade ≠ 56", detalhe: DECK_MENORES_REGISTRY.length });
  }
  if (getDeckByTipo("numerada").length !== 40) {
    issues.push({ id: "_deck_", problema: "numeradas ≠ 40" });
  }
  if (getDeckByTipo("corte").length !== 16) {
    issues.push({ id: "_deck_", problema: "cortes ≠ 16" });
  }

  // 2. IDs e slugs únicos
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const e of DECK_MENORES_REGISTRY) {
    if (ids.has(e.id)) issues.push({ id: e.id, problema: "id duplicado" });
    if (slugs.has(e.slug)) issues.push({ id: e.id, problema: "slug duplicado", detalhe: e.slug });
    ids.add(e.id);
    slugs.add(e.slug);
  }

  // 3. Coerência id ↔ naipe ↔ posição
  for (const e of DECK_MENORES_REGISTRY) {
    const expectedId = `${e.naipe}-${e.posicao}`;
    if (e.id !== expectedId) {
      issues.push({ id: e.id, problema: "id não bate com naipe+posição", detalhe: expectedId });
    }
    if (!e.cardImage.includes(e.id)) {
      issues.push({ id: e.id, problema: "imagem não referencia o id", detalhe: e.cardImage });
    }
  }

  // 4. Cobertura completa: 4 naipes × 14 posições
  const naipes: Naipe[] = ["copas", "paus", "espadas", "ouros"];
  const positions: CartaPosicao[] = [1,2,3,4,5,6,7,8,9,10,"pajem","cavaleiro","rainha","rei"];
  for (const n of naipes) for (const p of positions) {
    if (!ids.has(`${n}-${p}`)) issues.push({ id: `${n}-${p}`, problema: "carta faltante" });
  }

  // 5. FREEZE — registry deve bater 1:1 com a tabela imutável oficial
  if (DECK_MENORES_REGISTRY.length !== FROZEN_DECK.length) {
    issues.push({ id: "_freeze_", problema: "tamanho do registry ≠ freeze oficial" });
  }
  for (const f of FROZEN_DECK) {
    const e = DECK_BY_ID.get(f.id);
    if (!e) { issues.push({ id: f.id, problema: "ausente no registry (freeze quebrado)" }); continue; }
    if (e.nome !== f.nome) issues.push({ id: f.id, problema: "nome divergente do freeze", detalhe: { atual: e.nome, oficial: f.nome } });
    if (e.slug !== f.slug) issues.push({ id: f.id, problema: "slug divergente do freeze", detalhe: { atual: e.slug, oficial: f.slug } });
    if (e.naipe !== f.naipe) issues.push({ id: f.id, problema: "naipe divergente do freeze" });
    if (String(e.posicao) !== String(f.posicao)) issues.push({ id: f.id, problema: "posição divergente do freeze" });
    if (e.cardImage !== f.cardImage) issues.push({ id: f.id, problema: "imagem divergente do freeze", detalhe: { atual: e.cardImage, oficial: f.cardImage } });
  }
  for (const e of DECK_MENORES_REGISTRY) {
    if (!FROZEN_BY_ID.has(e.id)) {
      issues.push({ id: e.id, problema: "id existe no registry mas não no freeze oficial" });
    }
  }

  return issues;
}

/** Marcador público de homologação para o admin. */
export const DECK_OFICIAL_FLAG = {
  oficial: DECK_MENORES_OFICIAL,
  versao: FROZEN_DECK_VERSION,
  total: FROZEN_DECK.length,
} as const;
