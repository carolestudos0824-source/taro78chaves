/**
 * Tipos canônicos da camada de conteúdo.
 *
 * Estes shapes são contrato oficial entre o adapter e a UI.
 * Repositórios (db/legacy) devem normalizar para estes tipos via mappers.
 *
 * Regra de ouro: a UI nunca deve depender da forma do banco nem dos `.ts` legados.
 * Sempre depende destes tipos.
 */

// ─── Primitivos compartilhados ─────────────────────────────────────

export type ContentSource = "db" | "legacy";

export type ContentTier = "free" | "premium";

/** Tradução PT do enum DB module_status */
export type ContentStatus = "vazio" | "parcial" | "rascunho" | "publicado";

export type ContentNaipe = "copas" | "paus" | "espadas" | "ouros";

export type ContentArcanoTipo = "maior" | "menor";

// ─── Quiz ──────────────────────────────────────────────────────────

export interface QuizQuestionContent {
  id: string;
  ordem: number;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao?: string;
}

export type QuizDificuldade = "basico" | "intermediario" | "avancado";

export interface QuizContent {
  id: string;
  titulo: string;
  subtitulo?: string;
  status: ContentStatus;
  tier: ContentTier;
  xp: number;
  dificuldade?: QuizDificuldade;
  perguntas: QuizQuestionContent[];
  vinculo: {
    tipo: "modulo" | "licao" | "arcano";
    id: string;
    slug?: string;
  };
  metadata: {
    source: ContentSource;
    sourceId?: string;
    usedFallback?: boolean;
  };
}

// ─── Arcano ────────────────────────────────────────────────────────

export interface ArcanoContent {
  id: string;
  tipo: ContentArcanoTipo;
  numero: number | null;
  numeral: string | null;
  naipe: ContentNaipe | null;
  nome: string;
  slug: string;
  subtitulo: string | null;
  tier: ContentTier;
  status: ContentStatus;
  validado: boolean;

  editorial: {
    essencia?: string;
    simbolosCentrais?: string;
    arquetipo?: string;
    luz?: string;
    sombra?: string;
    jornada?: string;
    amor?: string;
    trabalho?: string;
    espiritualidade?: string;
    vozDoArcano?: string;
    aprofundamento?: string;
    cabala?: string;
    revisaoRapida?: string;
    palavrasChave?: string[];
  };

  visual: {
    imageKey: string | null;
    imageUrl: string | null;
    resolvedAssetUrl: string | null;
  };

  quiz: QuizContent | null;

  metadata: {
    source: ContentSource;
    sourceId?: string;
  };
  symbolsMap?: import("./runtime-types").ArcanoSymbolMapItem[];
}

// ─── Lição ─────────────────────────────────────────────────────────

export interface LessonContent {
  id: string;
  slug: string;
  titulo: string;
  subtitulo?: string;
  moduloId: string;
  moduloSlug: string;
  moduloNome: string;
  ordem: number;
  tier: ContentTier;
  status: ContentStatus;

  editorial: {
    intro?: string;
    conteudoPrincipal?: string;
    aprofundamento?: string;
    exemploPratico?: string;
    exercicio?: string;
    revisaoRapida?: string;
    citacao?: string;
    pratica?: string;
  };

  quiz: QuizContent | null;

  metadata: {
    source: ContentSource;
    sourceId?: string;
    usedFallback?: boolean;
  };
}

// ─── Módulo ────────────────────────────────────────────────────────

/** Resumo leve de uma lição para listagens em telas de módulo. */
export interface LessonSummary {
  id: string;
  slug: string;
  titulo: string;
  subtitulo?: string;
  ordem: number;
  tier: ContentTier;
  status: ContentStatus;
  quizDisponivel: boolean;
  arcanoSlug?: string;
}

export interface ModuleContent {
  id: string;
  slug: string;
  nome: string;
  categoryLabel?: string;
  descricaoCurta?: string;
  descricaoEditorial?: string;
  editorialIntro?: string;
  ordem: number;
  tier: ContentTier;
  status: ContentStatus;
  themeColor?: string;

  licoes: LessonSummary[];

  metadata: {
    source: ContentSource;
    sourceId?: string;
    usedFallback?: boolean;
  };
}

// ─── Wrapper de retorno dos hooks ──────────────────────────────────

/**
 * `T` aqui já é o tipo do payload. Não envolvemos em `T | null` para evitar
 * dupla nulidade (`(X | null) | null`) quando os callers passam `Foo | null`.
 * Ainda assim, `data` pode ser `null` em runtime — o tipo de cada hook
 * declara explicitamente `UseContentResult<Foo | null>`.
 */
export interface UseContentResult<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  /** Origem efetiva do dado retornado. `null` enquanto carrega. */
  sourceUsed: ContentSource | null;
  /** True quando a leitura caiu no legado (telemetria). */
  usedFallback: boolean;
  /** TanStack Query refetch (opcional, exposto para admin). */
  refetch?: () => Promise<unknown>;
  /** True quando há refetch silencioso em andamento. */
  isFetching?: boolean;
}
