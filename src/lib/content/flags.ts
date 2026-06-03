/**
 * Feature flags da camada de conteúdo.
 *
 * Cada domínio decide independentemente como resolver:
 *   - 'fallback': lê apenas do `.ts` legado (modo de rollback de emergência)
 *   - 'auto':     tenta DB primeiro; se falhar/vazio → cai no legado + telemetria
 *   - 'db':       lê apenas do banco; falha = erro real (sem mascarar)
 *
 * ─── ROLLBACK GLOBAL (Fase 5B) ─────────────────────────────────────
 * Para reverter todo o app ao legado em emergência, troque os 4 domínios
 * abaixo para 'fallback'. O `repo-legacy.ts` permanece ativo justamente
 * para garantir esse caminho. Ver `src/data/DEPRECATED.md`.
 * ───────────────────────────────────────────────────────────────────
 */

export type ContentSourceMode = "fallback" | "auto" | "db";

export type ContentDomain =
  | "arcanos"
  | "quizzes"
  | "lessons"
  | "modules"
  | "journey"
  | "symbols"
  | "certificates"
  | "numerology"
  | "suits"
  | "court";

export const CONTENT_FLAGS: Record<ContentDomain, ContentSourceMode> = {
  // Fase 2/3 — arcanos (Maiores, Menores e Cortes) já carregam via DB com
  // fallback automático para o legado em caso de erro.
  arcanos: "auto",
  // Fase 1 — quizzes via DB com fallback.
  quizzes: "auto",
  // Fase 4A — piloto controlado: módulo Fundamentos + 3 lições reais.
  // Como o serviço usa DB-first com fallback automático para o legado,
  // promover para 'auto' é seguro — qualquer lição/módulo ainda não semeado
  // continua resolvendo via legado e emite warn de telemetria.
  lessons: "auto",
  modules: "auto",
  // Fase 5D — Jornada do Louco (4 fases + 22 papéis + meta) lê do DB
  // primeiro; em vazio/erro cai no legado de `src/data/fools-journey.ts`.
  journey: "auto",
  // Fase 6.1 — Biblioteca de Símbolos (12 categorias + 41 símbolos) lê do DB
  // primeiro; em vazio/erro cai no legado de `src/data/symbol-library.ts`.
  symbols: "auto",
  // Fase 6.4 — Certificados (10 itens editoriais) lêem do DB; em vazio/erro
  // caem no legado de `src/data/certificates.ts`.
  certificates: "auto",
  // Fase 6.5 — Numerologia (10 itens), Naipe Intro (4 naipes) e Cartas da
  // Corte pedagógicas (4 papéis) lêem do DB primeiro; em vazio/erro caem
  // nos legados de `src/data/arcanos-menores/{numerologia,naipes-pedagogico,cartas-corte}.ts`.
  numerology: "auto",
  suits: "auto",
  court: "auto",
};

export function getFlag(domain: ContentDomain): ContentSourceMode {
  return CONTENT_FLAGS[domain];
}
