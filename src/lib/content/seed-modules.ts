/**
 * Seed formal dos 17 módulos do produto.
 *
 * Fonte de verdade do runtime principal enquanto `cms_modules` não está
 * 100% publicado. Substitui a dependência indireta de `@/data/tarot-data`
 * dentro de `@/lib/content/catalog.ts`.
 *
 * Quando o CMS estiver completo, basta trocar a fonte interna do
 * `catalog.ts` — telas não mudam.
 */

import type { LearningModule } from "./runtime-types";

export const MODULES_SEED: readonly LearningModule[] = [
  // ─── Fundação ───
  { id: "fundamentos",         name: "Fundamentos do Tarô",           subtitle: "A Base de Tudo",             description: "O que é o tarô, estrutura do baralho, simbologia, intuição, ética e como estudar",  icon: "📖", symbol: "◈",  order: 0,  category: "foundation",    totalLessons: 10, route: "/module/fundamentos" },
  { id: "leitura-simbolica",   name: "Leitura Simbólica e Método",    subtitle: "O Olhar que Revela",         description: "Como observar uma carta: cor, gesto, direção, postura, cenário e interpretação",    icon: "👁", symbol: "◉",  order: 1,  category: "foundation",    totalLessons: 8,  route: "/module/leitura-simbolica", prerequisiteModuleId: "arcanos-maiores" },

  // ─── Arcanos Maiores ───
  { id: "arcanos-maiores",     name: "Arcanos Maiores",               subtitle: "A Jornada do Louco",         description: "Os 22 arquétipos universais da jornada da alma",                                    icon: "🃏", symbol: "✦",  order: 2,  category: "major-arcana",  totalLessons: 22, route: "/module/arcanos-maiores",    prerequisiteModuleId: "fundamentos" },

  // ─── Arcanos Menores ───
  { id: "arquitetura-menores", name: "Arquitetura dos Menores",       subtitle: "O Mapa dos 56",              description: "Os 4 naipes, a lógica dos números e como ler Menores com profundidade",             icon: "🗺", symbol: "▣",  order: 3,  category: "minor-arcana",  totalLessons: 6,  route: "/module/arquitetura-menores", prerequisiteModuleId: "arcanos-maiores" },
  { id: "copas",               name: "Naipe de Copas",                subtitle: "O Elemento Água",            description: "Emoções, relacionamentos, intuição e o mundo interior",                             icon: "💧", symbol: "☽",  order: 4,  category: "minor-arcana",  totalLessons: 14, route: "/module/copas",              prerequisiteModuleId: "arquitetura-menores" },
  { id: "paus",                name: "Naipe de Paus",                 subtitle: "O Elemento Fogo",            description: "Ação, criatividade, paixão e força vital",                                         icon: "🔥", symbol: "⚡", order: 5,  category: "minor-arcana",  totalLessons: 14, route: "/module/paus",               prerequisiteModuleId: "arquitetura-menores" },
  { id: "espadas",             name: "Naipe de Espadas",              subtitle: "O Elemento Ar",              description: "Mente, conflitos, verdade e comunicação",                                          icon: "⚔️", symbol: "△",  order: 6,  category: "minor-arcana",  totalLessons: 14, route: "/module/espadas",            prerequisiteModuleId: "arquitetura-menores" },
  { id: "ouros",               name: "Naipe de Ouros",                subtitle: "O Elemento Terra",           description: "Material, prosperidade, corpo e manifestação",                                     icon: "💎", symbol: "◆",  order: 7,  category: "minor-arcana",  totalLessons: 14, route: "/module/ouros",              prerequisiteModuleId: "arquitetura-menores" },
  { id: "cartas-corte",        name: "Cartas da Corte",               subtitle: "Pessoas e Posturas",         description: "Pajem, Cavaleiro, Rainha e Rei — como pessoa, postura e estágio energético",        icon: "👑", symbol: "♛",  order: 8,  category: "minor-arcana",  totalLessons: 8,  route: "/module/cartas-corte",       prerequisiteModuleId: "copas" },

  // ─── Avançado ───
  { id: "combinacoes",         name: "Combinações",                   subtitle: "A Arte da Síntese",          description: "Como uma carta altera a outra: pares, tríades, contexto e erros comuns",            icon: "🔗", symbol: "∞",  order: 9,  category: "advanced",      totalLessons: 10, route: "/module/combinacoes",        prerequisiteModuleId: "cartas-corte" },
  { id: "tiragens",            name: "Tiragens",                      subtitle: "Os Métodos de Leitura",      description: "1 carta, 3 cartas, cruz, decisão, autoconhecimento e tiragens temáticas",           icon: "🎴", symbol: "◎",  order: 10, category: "advanced",      totalLessons: 11, route: "/module/tiragens",           prerequisiteModuleId: "combinacoes" },
  { id: "espiritualidade",     name: "Tarô e Espiritualidade",        subtitle: "O Sagrado na Prática",       description: "Preparação, presença, intenção, limpeza do espaço e limites éticos",                icon: "🕯", symbol: "☸",  order: 11, category: "advanced",      totalLessons: 8,  route: "/module/espiritualidade",    prerequisiteModuleId: "tiragens" },
  { id: "mesa-taro",           name: "Como Montar uma Mesa",          subtitle: "O Espaço Sagrado",           description: "Estrutura da mesa, o que usar, o que evitar, mesa de estudo e de atendimento",      icon: "🕯", symbol: "⬡",  order: 12, category: "advanced",      totalLessons: 6,  route: "/module/mesa-taro",          prerequisiteModuleId: "espiritualidade" },
  { id: "amor",                name: "Amor e Relacionamentos",        subtitle: "O Coração do Tarô",          description: "Aprenda a ler dinâmicas afetivas com profundidade, honestidade e responsabilidade.", icon: "💞", symbol: "♡",  order: 13, category: "advanced",      totalLessons: 12, route: "/module/amor",               prerequisiteModuleId: "tiragens" },

  // ─── Prática ───
  { id: "leitura-aplicada",    name: "Leitura Aplicada por Tema",     subtitle: "O Tarô no Cotidiano",        description: "Amor, trabalho, espiritualidade, família, decisões e bloqueios",                    icon: "🎯", symbol: "◇",  order: 13, category: "practice",      totalLessons: 8,  route: "/module/leitura-aplicada",   prerequisiteModuleId: "tiragens" },
  { id: "pratica",             name: "Prática Guiada",                subtitle: "O Tarô Vivo",                description: "Estudos de caso, interpretação guiada e comparação entre leituras",                 icon: "✨", symbol: "★",  order: 14, category: "practice",      totalLessons: 10, route: "/module/pratica",            prerequisiteModuleId: "leitura-aplicada" },

  // ─── Profissional ───
  { id: "trabalhar-taro",      name: "Como Trabalhar com Tarô",       subtitle: "Do Estudo à Profissão",      description: "Atendimento, condução, postura, ética, comunicação e organização profissional",     icon: "💼", symbol: "⚜",  order: 15, category: "professional",  totalLessons: 8,  route: "/module/trabalhar-taro",     prerequisiteModuleId: "pratica" },
];
