/**
 * Seed formal dos 22 Arcanos Maiores (resumo de catálogo).
 *
 * Fonte de verdade do runtime principal enquanto `cms_arcanos` não está
 * 100% publicado com `order_index` consolidado. Substitui a dependência
 * indireta de `@/data/tarot-data` dentro de `@/lib/content/catalog.ts`.
 */

import type { ArcanoSummary } from "./runtime-types";

export const ARCANOS_MAIORES_SEED: readonly ArcanoSummary[] = [
  { id: 0,  name: "O Louco",            numeral: "0",    subtitle: "O Início da Travessia",     slug: "o-louco",            order: 0,  category: "arcanos-maiores", unlocked: false },
  { id: 1,  name: "O Mago",             numeral: "I",    subtitle: "O Poder da Vontade",        slug: "o-mago",             order: 1,  category: "arcanos-maiores", unlocked: false },
  { id: 2,  name: "A Sacerdotisa",      numeral: "II",   subtitle: "O Véu do Mistério",         slug: "a-sacerdotisa",      order: 2,  category: "arcanos-maiores", unlocked: false },
  { id: 3,  name: "A Imperatriz",       numeral: "III",  subtitle: "A Abundância Criativa",     slug: "a-imperatriz",       order: 3,  category: "arcanos-maiores", unlocked: false },
  { id: 4,  name: "O Imperador",        numeral: "IV",   subtitle: "A Estrutura e a Ordem",     slug: "o-imperador",        order: 4,  category: "arcanos-maiores", unlocked: false },
  { id: 5,  name: "O Hierofante",       numeral: "V",    subtitle: "A Tradição Sagrada",        slug: "o-hierofante",       order: 5,  category: "arcanos-maiores", unlocked: false },
  { id: 6,  name: "Os Enamorados",      numeral: "VI",   subtitle: "A Escolha do Coração",      slug: "os-enamorados",      order: 6,  category: "arcanos-maiores", unlocked: false },
  { id: 7,  name: "O Carro",            numeral: "VII",  subtitle: "A Vontade em Movimento",    slug: "o-carro",            order: 7,  category: "arcanos-maiores", unlocked: false },
  { id: 8,  name: "A Força",            numeral: "VIII", subtitle: "O Poder Interior",          slug: "a-forca",            order: 8,  category: "arcanos-maiores", unlocked: false },
  { id: 9,  name: "O Eremita",          numeral: "IX",   subtitle: "A Luz Interior",            slug: "o-eremita",          order: 9,  category: "arcanos-maiores", unlocked: false },
  { id: 10, name: "A Roda da Fortuna",  numeral: "X",    subtitle: "Os Ciclos do Destino",      slug: "a-roda-da-fortuna",  order: 10, category: "arcanos-maiores", unlocked: false },
  { id: 11, name: "A Justiça",          numeral: "XI",   subtitle: "O Equilíbrio Kármico",      slug: "a-justica",          order: 11, category: "arcanos-maiores", unlocked: false },
  { id: 12, name: "O Enforcado",        numeral: "XII",  subtitle: "A Rendição Sagrada",        slug: "o-enforcado",        order: 12, category: "arcanos-maiores", unlocked: false },
  { id: 13, name: "A Morte",            numeral: "XIII", subtitle: "A Grande Transformação",    slug: "a-morte",            order: 13, category: "arcanos-maiores", unlocked: false },
  { id: 14, name: "A Temperança",       numeral: "XIV",  subtitle: "A Alquimia Interior",       slug: "a-temperanca",       order: 14, category: "arcanos-maiores", unlocked: false },
  { id: 15, name: "O Diabo",            numeral: "XV",   subtitle: "As Correntes da Ilusão",    slug: "o-diabo",            order: 15, category: "arcanos-maiores", unlocked: false },
  { id: 16, name: "A Torre",            numeral: "XVI",  subtitle: "A Revelação Súbita",        slug: "a-torre",            order: 16, category: "arcanos-maiores", unlocked: false },
  { id: 17, name: "A Estrela",          numeral: "XVII", subtitle: "A Esperança Renovada",      slug: "a-estrela",          order: 17, category: "arcanos-maiores", unlocked: false },
  { id: 18, name: "A Lua",              numeral: "XVIII",subtitle: "O Caminho da Intuição",     slug: "a-lua",              order: 18, category: "arcanos-maiores", unlocked: false },
  { id: 19, name: "O Sol",              numeral: "XIX",  subtitle: "A Alegria Radiante",        slug: "o-sol",              order: 19, category: "arcanos-maiores", unlocked: false },
  { id: 20, name: "O Julgamento",       numeral: "XX",   subtitle: "O Despertar Final",         slug: "o-julgamento",       order: 20, category: "arcanos-maiores", unlocked: false },
  { id: 21, name: "O Mundo",            numeral: "XXI",  subtitle: "A Completude Sagrada",      slug: "o-mundo",            order: 21, category: "arcanos-maiores", unlocked: false },
];
