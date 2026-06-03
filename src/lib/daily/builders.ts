/**
 * Daily Challenges — builders puros que consomem o adapter de conteúdo.
 *
 * Substituem `src/data/daily-challenges.ts`. Mantêm a mecânica
 * determinística por seed de data, mas a fonte do conteúdo agora vem
 * de `ArcanoContent[]` e `SymbolsContent` (adapter `@/lib/content`).
 */

import type { ArcanoContent } from "@/lib/content/types";
import type { SymbolsContent } from "@/lib/content/symbols-types";
import {
  DAILY_CONTEXTS,
  DAILY_INTERPRETATION_CONTEXTS,
  DAILY_POSITIONS,
  DAILY_TITLES,
} from "./pools";

// ─── Tipos exportados (compat com a UI antiga) ───

export interface DailyChallengeItem {
  id: string;
  type: "carta-do-dia" | "revisao-rapida" | "perguntas-do-dia" | "simbolo-do-dia" | "combinacao-do-dia" | "mini-interpretacao";
  title: string;
  subtitle: string;
  icon: string;
  xp: number;
  completed: boolean;
}

export interface CartaDoDia {
  arcanoId: number;
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  essence: string;
  reflection: string;
}

export interface PerguntasDoDia {
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SimboloDoDia {
  name: string;
  explanation: string;
  readings: string[];
  cards: string[];
}

export interface CombinacaoDoDia {
  card1: { name: string; numeral: string };
  card2: { name: string; numeral: string };
  prompt: string;
  insight: string;
}

export interface MiniInterpretacao {
  context: string;
  card: { name: string; numeral: string; keywords: string[] };
  position: string;
  guidedQuestions: string[];
  sampleReading: string;
}

// ─── Seed determinístico ───

function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededPick<T>(arr: readonly T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

export function getTodayStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ─── Helpers de conversão ArcanoContent ───

function arcanoNumber(a: ArcanoContent): number {
  return a.numero ?? 0;
}

function firstSentence(text?: string, fallback = ""): string {
  const t = (text ?? "").trim();
  if (!t) return fallback;
  return t.split(/[.!?]/)[0].trim();
}

// ─── Builders ───

export function buildCartaDoDia(arcanos: ArcanoContent[], date = getTodayStr()): CartaDoDia | null {
  if (arcanos.length === 0) return null;
  const seed = dateSeed(date);
  const a = seededPick(arcanos, seed, 0);
  return {
    arcanoId: arcanoNumber(a),
    name: a.nome,
    numeral: a.numeral ?? "",
    subtitle: a.subtitulo ?? "",
    keywords: a.editorial.palavrasChave ?? [],
    essence: a.editorial.essencia ?? "",
    reflection: `Como ${a.nome} se manifesta na sua vida hoje? Observe os padrões do dia com a lente deste arcano.`,
  };
}

export function buildPerguntasDoDia(arcanos: ArcanoContent[], date = getTodayStr()): PerguntasDoDia {
  const seed = dateSeed(date);
  const questions: PerguntasDoDia["questions"] = [];
  const arcanosWithQuiz = arcanos.filter((a) => a.quiz && a.quiz.perguntas.length > 0);

  for (let i = 0; i < 3 && arcanosWithQuiz.length > 0; i++) {
    const a = seededPick(arcanosWithQuiz, seed, i * 7 + 3);
    const q = seededPick(a.quiz!.perguntas, seed, i * 13);
    questions.push({
      id: `daily-${date}-q${i}`,
      question: q.enunciado,
      options: q.alternativas,
      correctIndex: q.correta,
      explanation: q.explicacao ?? "",
    });
  }
  return { questions };
}

export function buildSimboloDoDia(symbols: SymbolsContent | null, date = getTodayStr()): SimboloDoDia | null {
  if (!symbols || symbols.categorias.length === 0) return null;
  const seed = dateSeed(date);
  const all = symbols.categorias.flatMap((c) => c.simbolos);
  if (all.length === 0) return null;
  const s = seededPick(all, seed, 11);
  return {
    name: s.nome,
    explanation: s.explicacao,
    readings: s.leituras,
    cards: s.cartas,
  };
}

export function buildCombinacaoDoDia(arcanos: ArcanoContent[], date = getTodayStr()): CombinacaoDoDia | null {
  if (arcanos.length === 0) return null;
  const seed = dateSeed(date);
  const a1 = seededPick(arcanos, seed, 5);
  const a2 = seededPick(arcanos, seed, 17);
  const ctx = seededPick(DAILY_CONTEXTS, seed, 23);
  const kw1 = a1.editorial.palavrasChave?.[0]?.toLowerCase() ?? "transformação";
  const kw2 = a2.editorial.palavrasChave?.[0]?.toLowerCase() ?? "sabedoria";
  const tail = ctx === "num contexto afetivo"
    ? "uma dinâmica relacional complexa"
    : ctx === "numa decisão profissional"
      ? "uma encruzilhada de ação e reflexão"
      : "um convite ao autoconhecimento profundo";
  return {
    card1: { name: a1.nome, numeral: a1.numeral ?? "" },
    card2: { name: a2.nome, numeral: a2.numeral ?? "" },
    prompt: `Imagine que ${a1.nome} e ${a2.nome} aparecem lado a lado ${ctx}. O que essa combinação conta?`,
    insight: `${a1.nome} traz a energia de ${kw1}, enquanto ${a2.nome} adiciona ${kw2}. Juntas, sugerem ${tail}.`,
  };
}

export function buildMiniInterpretacao(arcanos: ArcanoContent[], date = getTodayStr()): MiniInterpretacao | null {
  if (arcanos.length === 0) return null;
  const seed = dateSeed(date);
  const a = seededPick(arcanos, seed, 31);
  const keywords = a.editorial.palavrasChave ?? [];
  const pos = seededPick(DAILY_POSITIONS, seed, 41);
  const ctx = seededPick(DAILY_INTERPRETATION_CONTEXTS, seed, 51);
  const essenceStart = firstSentence(a.editorial.essencia, "uma energia de transformação se apresenta").toLowerCase();

  return {
    context: ctx,
    card: { name: a.nome, numeral: a.numeral ?? "", keywords },
    position: pos,
    guidedQuestions: [
      `O que ${a.nome} na posição de ${pos} sugere sobre a situação?`,
      `Quais palavras-chave se conectam ao contexto da pergunta?`,
      `Qual seria a mensagem principal para o consulente?`,
    ],
    sampleReading: `${a.nome} na posição de ${pos} sugere que ${essenceStart}. No contexto apresentado, isso aponta para ${
      keywords.slice(0, 2).join(" e ").toLowerCase() || "reflexão e transformação"
    } como temas centrais da resposta.`,
  };
}

export function buildDailyChallenges(date = getTodayStr()): DailyChallengeItem[] {
  return (Object.keys(DAILY_TITLES) as (keyof typeof DAILY_TITLES)[]).map((type) => {
    const t = DAILY_TITLES[type];
    return {
      id: `${date}-${type}`,
      type,
      title: t.title,
      subtitle: t.subtitle,
      icon: t.icon,
      xp: t.xp,
      completed: false,
    };
  });
}

export { DAILY_TOTAL_XP } from "./pools";
