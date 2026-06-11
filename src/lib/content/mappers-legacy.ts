/**
 * Mappers — legado (`src/data/*.ts`) → tipo canônico.
 *
 * Único ponto que importa diretamente os arquivos legados (à parte do fallback repo).
 * Achata estruturas (voice/deepDive/interpretation) em texto via `parser.flattenStructuredText`.
 */

import type {
  ArcanoContent,
  LessonContent,
  ModuleContent,
  QuizContent,
} from "./types";
import { flattenStructuredText, parseStringArray } from "./parser";
import {
  resolveMaiorVisual,
  resolveMenorVisualById,
} from "./visual-registry";

// ─── Arcano Maior (legado) ─────────────────────────────────────────

export interface LegacyArcanoMaior {
  number: number;
  name: string;
  subtitle: string;
  numeral: string;
  slug: string;
  cardImage: string;
  keywords: string[];
  essence: string;
  symbols: { name: string; meaning: string; explanation?: string; pedagogicSense?: string; relation?: string }[];
  archetype: string;
  light: string;
  shadow: string;
  initiationLesson: string;
  love: unknown;
  work: unknown;
  spirituality: unknown;
  voice: unknown;
  deepDive: unknown;
  reflectionQuestions: unknown;
  quiz: unknown;
}

export function mapLegacyArcanoMaiorToUI(a: LegacyArcanoMaior): ArcanoContent {
  const visual = resolveMaiorVisual(a.number);
  const isFreeLouco = a.number === 0;

  return {
    id: `legacy-maior-${a.number}`,
    tipo: "maior",
    numero: a.number,
    numeral: a.numeral,
    naipe: null,
    nome: a.name,
    slug: a.slug,
    subtitulo: a.subtitle,
    tier: isFreeLouco ? "free" : "premium",
    status: "publicado",
    validado: true,
    editorial: {
      essencia: a.essence,
      simbolosCentrais: flattenStructuredText(a.symbols),
      arquetipo: a.archetype,
      luz: a.light,
      sombra: a.shadow,
      jornada: a.initiationLesson,
      amor: flattenStructuredText(a.love),
      trabalho: flattenStructuredText(a.work),
      espiritualidade: flattenStructuredText(a.spirituality),
      vozDoArcano: flattenStructuredText(a.voice),
      aprofundamento: flattenStructuredText(a.deepDive),
      cabala: undefined,
      revisaoRapida: undefined,
      palavrasChave: parseStringArray(a.keywords),
    },
    visual: {
      imageKey: a.slug,
      imageUrl: a.cardImage,
      resolvedAssetUrl: a.cardImage,
    },
    quiz: null,
    metadata: { source: "legacy", sourceId: String(a.number) },
    symbolsMap: a.symbols?.map((s, i) => ({
      id: `${a.slug}-symbol-${i}`,
      name: s.name,
      description: s.meaning + (s.explanation ? ` ${s.explanation}` : ""),
      reflectionQuestion: s.pedagogicSense || "O que este símbolo desperta em você?",
      position: { 
        x: 20 + (i * 12) % 60, 
        y: 25 + (i * 15) % 50 
      }
    }))
  };
}

// ─── Arcano Menor (legado) ─────────────────────────────────────────

export interface LegacyArcanoMenor {
  id: string;
  posicao: number | string;
  nome: string;
  naipe: "copas" | "paus" | "espadas" | "ouros";
  subtitulo: string;
  essencia: string;
  simbolosCentrais: string;
  arquetipo: string;
  luz: string;
  sombra: string;
  licaoPratica: string;
  interpretacaoAmor: string;
  interpretacaoTrabalho: string;
  interpretacaoEspiritualidade: string;
  vozDaCarta: string;
  aprofundamento: string;
  perguntasReflexao: string[];
  quiz: unknown;
  revisaoRapida: { palavraChave: string; luz: string; sombra: string; licaoCentral: string; aplicacaoPratica: string; fraseFixacao: string };
  cardImage: string;
}

export function mapLegacyArcanoMenorToUI(c: LegacyArcanoMenor): ArcanoContent {
  const visual = resolveMenorVisualById(c.id);
  const numero = typeof c.posicao === "number"
    ? c.posicao
    : ({ pajem: 11, cavaleiro: 12, rainha: 13, rei: 14 } as Record<string, number>)[c.posicao] ?? null;

  const hasContent = c.essencia && c.essencia.length > 0;

  return {
    id: `legacy-menor-${c.id}`,
    tipo: "menor",
    numero,
    numeral: null,
    naipe: c.naipe,
    nome: c.nome,
    slug: visual.imageKey ?? c.id,
    subtitulo: c.subtitulo || null,
    tier: "premium",
    status: hasContent ? "publicado" : "vazio",
    validado: !!hasContent,
    editorial: {
      essencia: c.essencia || undefined,
      simbolosCentrais: c.simbolosCentrais || undefined,
      arquetipo: c.arquetipo || undefined,
      luz: c.luz || undefined,
      sombra: c.sombra || undefined,
      jornada: c.licaoPratica || undefined,
      amor: c.interpretacaoAmor || undefined,
      trabalho: c.interpretacaoTrabalho || undefined,
      espiritualidade: c.interpretacaoEspiritualidade || undefined,
      vozDoArcano: c.vozDaCarta || undefined,
      aprofundamento: c.aprofundamento || undefined,
      cabala: undefined,
      revisaoRapida: c.revisaoRapida?.fraseFixacao || undefined,
      palavrasChave: c.revisaoRapida?.palavraChave
        ? [c.revisaoRapida.palavraChave]
        : undefined,
    },
    visual: {
      imageKey: visual.imageKey,
      imageUrl: visual.imageUrl ?? c.cardImage,
      resolvedAssetUrl: visual.resolvedAssetUrl ?? c.cardImage,
    },
    quiz: null,
    metadata: { source: "legacy", sourceId: c.id },
  };
}

// ─── Quiz embutido em lição/arcano legado ──────────────────────────

export interface LegacyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export function mapLegacyQuizToUI(
  questions: LegacyQuizQuestion[],
  vinculo: QuizContent["vinculo"],
  contextId: string,
  titulo = "Quiz",
  xp = 10,
): QuizContent {
  return {
    id: `legacy-quiz-${contextId}`,
    titulo,
    status: "publicado",
    tier: "premium",
    xp,
    perguntas: questions.map((q, idx) => ({
      id: q.id,
      ordem: idx,
      enunciado: q.question,
      alternativas: q.options,
      correta: q.correctIndex,
      explicacao: q.explanation,
    })),
    vinculo,
    metadata: { source: "legacy", sourceId: contextId, usedFallback: true },
  };
}

// ─── Lição (legado) ────────────────────────────────────────────────

export interface LegacyLesson {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  content?: string;
  deepDive?: string;
  reflection?: string;
  exercise?: { instruction: string; type: string } | string;
  quiz?: LegacyQuizQuestion[];
}

export function mapLegacyLessonToUI(
  l: LegacyLesson,
  moduleSlug: string,
  moduleName: string,
): LessonContent {
  const exercicio = typeof l.exercise === "string"
    ? l.exercise
    : l.exercise?.instruction;

  return {
    id: `legacy-lesson-${l.id}`,
    slug: l.id,
    titulo: l.title,
    subtitulo: l.subtitle,
    moduloId: `legacy-module-${moduleSlug}`,
    moduloSlug: moduleSlug,
    moduloNome: moduleName,
    ordem: l.order ?? 0,
    tier: "premium",
    status: "publicado",
    editorial: {
      intro: l.subtitle,
      conteudoPrincipal: l.content,
      aprofundamento: l.deepDive,
      exemploPratico: undefined,
      exercicio,
      revisaoRapida: l.reflection,
      citacao: undefined,
      pratica: undefined,
    },
    quiz: l.quiz && l.quiz.length > 0
      ? mapLegacyQuizToUI(l.quiz, { tipo: "licao", id: l.id, slug: l.id }, l.id, `Quiz: ${l.title}`)
      : null,
    metadata: { source: "legacy", sourceId: l.id, usedFallback: true },
    symbolsMap: [] // Lessons don't have symbolsMap yet
  };
}

// ─── Módulo (legado, scaffold mínimo) ──────────────────────────────

export function mapLegacyModuleToUI(
  slug: string,
  name: string,
  lessons: LegacyLesson[],
): ModuleContent {
  return {
    id: `legacy-module-${slug}`,
    slug,
    nome: name,
    categoryLabel: undefined,
    descricaoCurta: undefined,
    descricaoEditorial: undefined,
    editorialIntro: undefined,
    ordem: 0,
    tier: "premium",
    status: "publicado",
    themeColor: undefined,
    licoes: [...lessons]
      .sort((a, b) => a.order - b.order)
      .map((l) => ({
        id: `legacy-lesson-${l.id}`,
        slug: l.id,
        titulo: l.title,
        subtitulo: l.subtitle,
        ordem: l.order ?? 0,
        tier: "premium" as const,
        status: "publicado" as const,
        quizDisponivel: !!(l.quiz && l.quiz.length > 0),
        arcanoSlug: undefined,
      })),
    metadata: { source: "legacy", sourceId: slug, usedFallback: true },
  };
}
