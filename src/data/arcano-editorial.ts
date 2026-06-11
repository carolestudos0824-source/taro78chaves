/**
/**
 * MODELO EDITORIAL OFICIAL — ARCANOS MAIORES
 * 
 * Estrutura fixa para os 22 Arcanos Maiores.
 * Cada arcano deve preencher TODOS os campos obrigatórios.
 */
/**
 * MODELO EDITORIAL OFICIAL — ARCANOS MAIORES
 * 
 * Estrutura fixa para os 22 Arcanos Maiores.
 * Cada arcano deve preencher TODOS os campos obrigatórios.
 * 
 * Campos mapeiam para:
 * - Página do Arcano Vivo (UI)
 * - Banco de dados (futura migração)
 * - Painel admin (edição)
 * - Sistema de revisão (flashcards)
 * - Sistema de quiz
 * - Expansão futura (minor arcana, combinações)
 */

import { getDeckEntry, getCanonicalNumeral } from "./deck-registry";

// ─── Tipos auxiliares ───

export interface ArcanoSymbol {
  name: string;
  meaning: string;
  explanation?: string;
  pedagogicSense?: string;
  relation?: string;
}

export interface ArcanoInterpretation {
  light: string;
  shadow: string;
}

export interface ArcanoDeepDive {
  text: string;
  symbolism: string;
  cabala: string;
  history: string;
}

export interface ArcanoReflectionQuestion {
  id: string;
  question: string;
}

export interface ArcanoQuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ArcanoQuickReview {
  keyword: string;
  meaning: string;
}

// ─── Tipo Editorial Principal ───

export interface ArcanoMaiorEditorial {
  /** 1. Número do arcano (0–21) */
  number: number;

  /** 2. Nome */
  name: string;

  /** 3. Subtítulo poético */
  subtitle: string;

  /** Numeral romano */
  numeral: string;

  /** Slug para URL */
  slug: string;

  /** Imagem da carta */
  cardImage: string;

  /** Palavras-chave */
  keywords: string[];

  /** 4. Essência — parágrafo principal descrevendo a alma do arcano */
  essence: string;

  /** 5. Símbolos centrais — lista de símbolos e seus significados */
  symbols: ArcanoSymbol[];

  /** 6. Arquétipo — descrição arquetípica do arcano */
  archetype: string;

  /** 7. Luz — o aspecto luminoso / positivo */
  light: string;

  /** 8. Sombra — o aspecto sombrio / desafiador */
  shadow: string;

  /** 9. Lição iniciática — a sabedoria central que o arcano transmite */
  initiationLesson: string;

  /** 10. Interpretação no amor */
  love: ArcanoInterpretation;

  /** 11. Interpretação no trabalho */
  work: ArcanoInterpretation;

  /** 12. Interpretação na espiritualidade */
  spirituality: ArcanoInterpretation;

  /** 13. Voz do arcano em primeira pessoa */
  voice: {
    intro: string;
    fullText: string;
  };

  /** 14. Aprofundamento — conteúdo opcional expandido */
  deepDive: ArcanoDeepDive;

  /** 15. Perguntas de reflexão — para exercícios e journaling */
  reflectionQuestions: ArcanoReflectionQuestion[];

  /** 16. Quiz — perguntas de avaliação */
  quiz: ArcanoQuizQuestion[];

  /** 17. Revisão rápida — pares keyword/meaning para flashcards */
  quickReview: ArcanoQuickReview[];
}

// ─── Validação ───

/** Campos obrigatórios que devem ter conteúdo não-vazio */
const REQUIRED_TEXT_FIELDS: (keyof ArcanoMaiorEditorial)[] = [
  "name", "subtitle", "numeral", "slug", "essence",
  "archetype", "light", "shadow", "initiationLesson",
];

export function validateArcano(arcano: ArcanoMaiorEditorial): string[] {
  const errors: string[] = [];

  for (const field of REQUIRED_TEXT_FIELDS) {
    if (!arcano[field] || (typeof arcano[field] === "string" && (arcano[field] as string).trim() === "")) {
      errors.push(`Campo obrigatório vazio: ${field}`);
    }
  }

  if (arcano.symbols.length === 0) errors.push("Deve ter ao menos 1 símbolo");
  if (arcano.keywords.length < 3) errors.push("Deve ter ao menos 3 palavras-chave");
  if (arcano.reflectionQuestions.length < 2) errors.push("Deve ter ao menos 2 perguntas de reflexão");
  if (arcano.quiz.length < 5) errors.push("Deve ter ao menos 5 perguntas de quiz");
  if (arcano.quickReview.length < 3) errors.push("Deve ter ao menos 3 itens de revisão rápida");
  if (!arcano.voice.intro || !arcano.voice.fullText) errors.push("Voz do arcano incompleta");
  if (!arcano.love.light || !arcano.love.shadow) errors.push("Interpretação no amor incompleta");
  if (!arcano.work.light || !arcano.work.shadow) errors.push("Interpretação no trabalho incompleta");
  if (!arcano.spirituality.light || !arcano.spirituality.shadow) errors.push("Interpretação na espiritualidade incompleta");
  if (!arcano.deepDive.text || !arcano.deepDive.symbolism || !arcano.deepDive.cabala || !arcano.deepDive.history) {
    errors.push("Aprofundamento incompleto — todos os 4 campos são obrigatórios");
  }

  return errors;
}

// ─── Template Vazio ───

export function createEmptyArcano(number: number, name: string, numeral: string, subtitle: string, slug: string): ArcanoMaiorEditorial {
  return {
    number,
    name,
    numeral,
    subtitle,
    slug,
    cardImage: `/assets/${slug}-card.jpg`,
    keywords: [],
    essence: "",
    symbols: [],
    archetype: "",
    light: "",
    shadow: "",
    initiationLesson: "",
    love: { light: "", shadow: "" },
    work: { light: "", shadow: "" },
    spirituality: { light: "", shadow: "" },
    voice: { intro: "", fullText: "" },
    deepDive: { text: "", symbolism: "", cabala: "", history: "" },
    reflectionQuestions: [],
    quiz: [],
    quickReview: [],
  };
}

// ─── Conversão para o formato legado (ArcanoData) ───

import type { ArcanoData, LessonSection, QuizQuestion } from "@/lib/content/runtime-types";

export function editorialToLegacy(editorial: ArcanoMaiorEditorial, unlocked = false): ArcanoData {
  const lessonSections: LessonSection[] = [
    { id: "essencia", title: "Essência", icon: "✦", content: editorial.essence },
    {
      id: "simbolos",
      title: "Símbolos Centrais",
      icon: "◎",
      content: editorial.symbols.map(s => {
        let text = `**${s.name}**: ${s.meaning}`;
        if (s.explanation) text += `\n*Explicação:* ${s.explanation}`;
        if (s.pedagogicSense) text += `\n*Sentido Pedagógico:* ${s.pedagogicSense}`;
        if (s.relation) text += `\n*Relação:* ${s.relation}`;
        return text;
      }).join("\n\n"),
    },
    { id: "luz", title: "Luz", icon: "☀", accent: "gold", content: editorial.light },
    { id: "sombra", title: "Sombra", icon: "☾", accent: "plum", content: editorial.shadow },
    { id: "licao", title: "Lição Iniciática", icon: "⟡", content: editorial.initiationLesson },
    {
      id: "amor",
      title: `${editorial.name} no Amor`,
      icon: "♡",
      accent: "wine",
      content: `Na luz: ${editorial.love.light} Na sombra: ${editorial.love.shadow}`,
    },
    {
      id: "trabalho",
      title: `${editorial.name} no Trabalho`,
      icon: "◈",
      content: `Na luz: ${editorial.work.light} Na sombra: ${editorial.work.shadow}`,
    },
    {
      id: "espiritualidade",
      title: `${editorial.name} na Espiritualidade`,
      icon: "❋",
      content: `Na luz: ${editorial.spirituality.light} Na sombra: ${editorial.spirituality.shadow}`,
    },
  ];

  // DECK OFICIAL: numeral, nome e cardImage vêm do registry (single source of truth).
  // Impede que um arquivo de arcano com numeral/imagem errados contamine a UI.
  const deckEntry = getDeckEntry(editorial.number);
  const officialNumeral = deckEntry?.numeral ?? getCanonicalNumeral(editorial.number);
  const officialImage = deckEntry?.cardImage ?? editorial.cardImage;
  const officialName = deckEntry?.name ?? editorial.name;

  return {
    id: editorial.number,
    name: officialName,
    numeral: officialNumeral,
    subtitle: editorial.subtitle,
    keywords: editorial.keywords,
    archetype: editorial.archetype,
    firstPersonIntro: editorial.voice.intro,
    voiceText: editorial.voice.fullText,
    cardImage: officialImage,
    lessonSections,
    layers: {
      main: {
        essence: editorial.essence,
        light: editorial.light,
        shadow: editorial.shadow,
        practicalApplication: editorial.initiationLesson,
      },
      deepDive: editorial.deepDive,
      extras: [],
      exercise: {
        instruction: editorial.reflectionQuestions.map((q, i) => `${i + 1}. ${q.question}`).join("\n\n"),
        type: "reflection",
        duration: "10 min",
      },
    },
    quiz: editorial.quiz as QuizQuestion[],
    unlocked,
    quickReview: editorial.quickReview,
    reflectionQuestions: editorial.reflectionQuestions,
    initiationLesson: editorial.initiationLesson,
    symbolsMap: editorial.symbols.map((s, i) => ({
      id: `${editorial.slug}-symbol-${i}`,
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