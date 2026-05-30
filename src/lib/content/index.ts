/**
 * Fachada pública da camada de conteúdo.
 *
 * REGRA DE OURO PARA AS TELAS:
 * sempre importe daqui — nunca de `src/data/arcanos*` ou `src/data/*_LESSONS`
 * diretamente. Isso garante que a Fase 8 (cleanup) seja segura.
 */

export {
  getArcanoContent,
  getJourneyContent,
  getSymbolsContent,
  getCertificatesContent,
  getNumerologyContent,
  getSuitsContent,
  getSuitContent,
  getCourtCardsContent,
  listArcanosContent,
  getQuizContent,
  getLessonContent,
  getModuleContent,
  type GetArcanoParams,
  type GetQuizParams,
  type GetLessonParams,
} from "./service";

export type {
  JourneyContent,
  JourneyArcanoContent,
  JourneyMetaContent,
  JourneyPhaseContent,
} from "./journey-types";

export type {
  SymbolsContent,
  SymbolCategoryContent,
  SymbolItemContent,
} from "./symbols-types";

export type {
  CertificateContent,
  CertificatesContent,
  CertificateStatus,
} from "./certificates-types";

export type {
  NumerologyContent,
  NumerologyItemContent,
  NumerologyManifestation,
} from "./numerology-types";

export type {
  SuitContent,
  SuitsContent,
} from "./suits-types";

export type {
  CourtCardContent,
  CourtCardsContent,
  CourtSuitManifestation,
} from "./court-types";

// Fase 6.0 — tipos canônicos de runtime (extraídos de tarot-data.ts).
export type {
  ArcanoData,
  Badge,
  ExtraMaterial,
  LessonLayer,
  LessonSection,
  QuizQuestion,
  UserProgress,
} from "./runtime-types";
export { DEFAULT_PROGRESS } from "./runtime-types";

export type {
  ArcanoContent,
  QuizContent,
  QuizQuestionContent,
  QuizDificuldade,
  LessonContent,
  ModuleContent,
  UseContentResult,
  ContentSource,
  ContentTier,
  ContentStatus,
  ContentNaipe,
  ContentArcanoTipo,
} from "./types";

export { CONTENT_FLAGS, getFlag, type ContentDomain, type ContentSourceMode } from "./flags";

// ─── Catálogo formal e serviço de acesso (Fase 5C) ─────────────────
export {
  MODULES_CATALOG,
  ARCANOS_MAIORES_CATALOG,
  getModuleFromCatalog,
  getArcanoSummaryFromCatalog,
  getArcanoFull,
  type LearningModule,
  type ArcanoSummary,
  type ModuleCategory,
} from "./catalog";

export {
  FREE_ARCANO_IDS,
  hasInitialAccess,
  isModuleUnlocked,
  getNextUnlockedModuleId,
} from "./access";
