/**
 * Daily Challenges — config técnica local.
 *
 * Strings curtas de mecânica de UI (rótulos, contextos, posições) que
 * NÃO são conteúdo editorial duplicado. Permanecem locais por desenho:
 * são parâmetros do sistema de desafios, não material de curadoria.
 */

export const DAILY_CONTEXTS = [
  "num contexto afetivo",
  "numa decisão profissional",
  "numa reflexão espiritual",
  "sobre o momento presente",
  "como conselho do dia",
] as const;

export const DAILY_POSITIONS = [
  "Passado",
  "Presente",
  "Futuro",
  "Conselho",
  "Obstáculo",
  "Resultado",
] as const;

export const DAILY_INTERPRETATION_CONTEXTS = [
  "Uma pessoa pergunta sobre uma mudança de carreira.",
  "Alguém busca clareza sobre um relacionamento difícil.",
  "Uma estudante quer orientação sobre seu próximo passo na vida.",
  "Uma pessoa sente-se estagnada e quer entender o que bloqueia seu progresso.",
  "Alguém está iniciando um projeto e quer saber as energias ao redor.",
] as const;

export const DAILY_TITLES = {
  "carta-do-dia": { title: "Carta do Dia", subtitle: "Receba e contemple o arcano de hoje", icon: "legal", xp: 10 },
  "revisao-rapida": { title: "Revisão Rápida", subtitle: "Relembre um conceito essencial", icon: "Sparkles", xp: 15 },
  "perguntas-do-dia": { title: "3 Perguntas do Dia", subtitle: "Teste seu conhecimento em 3 questões", icon: "quiz", xp: 20 },
  "simbolo-do-dia": { title: "Símbolo do Dia", subtitle: "Descubra um símbolo e seu significado", icon: "formacao", xp: 10 },
  "combinacao-do-dia": { title: "Combinação do Dia", subtitle: "Interprete duas cartas juntas", icon: "Layers", xp: 15 },
  "mini-interpretacao": { title: "Mini Interpretação", subtitle: "Pratique uma leitura guiada", icon: "jornada", xp: 25 },
} as const;

export const DAILY_TOTAL_XP = 95;
