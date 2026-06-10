/**
 * Tipos canônicos de runtime (Fase 6.0).
 *
 * Estes tipos NÃO são conteúdo — são contratos de dado usados pela UI,
 * pelo adapter e pelos hooks. Foram extraídos de `src/data/tarot-data.ts`
 * para que componentes e hooks parem de importar do legado.
 *
 * Conteúdo editorial (texto de arcanos, módulos, etc.) continua vindo
 * do CMS via `@/lib/content`.
 */

/**
 * Estrutura de uma seção pedagógica de lição (Arcano Vivo / Lessons).
 * Tipo técnico — o conteúdo das seções vem do CMS (`cms_arcanos`).
 */
export interface LessonSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  accent?: "gold" | "wine" | "plum";
}

// ─── Lesson / Library ──────────────────────────────────────────────

export interface ExtraMaterial {
  id: string;
  title: string;
  type: "text" | "audio" | "pdf" | "video" | "link";
  description: string;
  /** for text type */
  content?: string;
  /** for audio/pdf/video/link */
  url?: string;
  /** for audio/video */
  duration?: string;
}

export interface LessonLayer {
  /** Short, gamified main content — required to advance */
  main: {
    essence: string;
    light: string;
    shadow: string;
    practicalApplication: string;
  };
  /** Optional deeper content — NOT required to advance */
  deepDive: {
    text: string;
    symbolism?: string;
    history?: string;
    cabala?: string;
  };
  /** Extra materials — library items per card */
  extras: ExtraMaterial[];
  /** Reflective exercise */
  exercise: {
    instruction: string;
    type: "reflection" | "journaling" | "meditation" | "practice";
    duration?: string;
  };
}

// ─── Quiz ──────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correctIndex: number;
  explanation: string;
  incorrectExplanation?: string;
}

// ─── Symbols Map ───────────────────────────────────────────────────

export interface ArcanoSymbolMapItem {
  id: string;
  name: string;
  description: string;
  reflectionQuestion: string;
  position: { x: number; y: number }; // Percentage 0-100
}

// ─── Arcano (forma plana usada por componentes visuais) ────────────

export interface ArcanoData {
  id: number;
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  archetype: string;
  firstPersonIntro: string;
  voiceText: string;
  lessonSections: LessonSection[];
  cardImage: string;
  layers: LessonLayer;
  quiz: QuizQuestion[];
  unlocked: boolean;
  quickReview?: { keyword: string; meaning: string }[];
  reflectionQuestions?: { id: string; question: string }[];
  initiationLesson?: string;
  symbolsMap?: ArcanoSymbolMapItem[];
  // Novos campos para suporte a Dimensões da Vida
  love?: { light: string; shadow: string; [key: string]: string };
  work?: { light: string; shadow: string; [key: string]: string };
  spirituality?: { light: string; shadow: string; [key: string]: string };
}

// ─── Badges & Progress ─────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  completedQuizzes: string[];
  completedExercises: string[];
  completedModules: string[];
  badges: Badge[];
  currentModule: string;
  onboardingCompleted: boolean;
  studentName: string;
  certificatesEarned: Record<string, string>;
  quizScores: Record<string, number>;
}

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString(),
  completedLessons: [],
  completedQuizzes: [],
  completedExercises: [],
  completedModules: [],
  badges: [
    { id: "first-step",       name: "Primeiro Passo",   description: "Começou a Jornada do Louco",    icon: "✦",  earned: false },
    { id: "fool-complete",    name: "O Louco Revelado", description: "Completou a lição do Louco",    icon: "🃏", earned: false },
    { id: "quiz-master",      name: "Mestre do Quiz",   description: "Acertou 100% em um quiz",       icon: "⭐", earned: false },
    { id: "deep-diver",       name: "Mergulho Profundo",description: "Explorou todo o aprofundamento",icon: "🔮", earned: false },
    { id: "streak-3",         name: "Chama Constante",  description: "3 dias consecutivos de estudo", icon: "🔥", earned: false },
    { id: "streak-7",         name: "Devoto do Tarô",   description: "7 dias consecutivos de estudo", icon: "💫", earned: false },
    { id: "library-explorer", name: "Exploradora",      description: "Acessou 3 materiais extras",    icon: "📚", earned: false },
  ],
  currentModule: "fundamentos",
  onboardingCompleted: false,
  studentName: "",
  certificatesEarned: {},
  quizScores: {},
};

// ─── Catálogo (módulos & arcanos summary) ──────────────────────────

export type ModuleCategory =
  | "foundation"
  | "major-arcana"
  | "minor-arcana"
  | "advanced"
  | "practice"
  | "professional";

export interface LearningModule {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  symbol: string;
  order: number;
  category: ModuleCategory;
  totalLessons: number;
  prerequisiteModuleId?: string;
  route: string;
}

export interface ArcanoSummary {
  id: number;
  name: string;
  numeral: string;
  subtitle: string;
  slug: string;
  order: number;
  category: "arcanos-maiores";
  unlocked: boolean;
}

