/**
 * FREEZE OFICIAL — Tabela imutável das 56 cartas menores.
 *
 * Esta é a fonte canônica final, congelada como padrão da plataforma.
 * Nenhuma tela (admin, lição, quiz, módulo, mobile) pode usar nome,
 * slug, naipe, posição ou imagem diferentes daqui.
 *
 * Mudar qualquer linha aqui é uma decisão de produto — não de código —
 * e quebra os testes do deck propositalmente.
 *
 * Versão do freeze: 1.0.0 (2026-04-17)
 */

import type { Naipe, CartaPosicao } from "./index";

export interface FrozenCard {
  readonly id: string;        // canônico: "{naipe}-{posicao}"
  readonly nome: string;       // exibição em PT-BR
  readonly slug: string;       // URL-safe
  readonly naipe: Naipe;
  readonly posicao: CartaPosicao;
  readonly cardImage: string;  // caminho oficial RWS
}

const card = (
  naipe: Naipe,
  posicao: CartaPosicao,
  nome: string,
  slug: string,
): FrozenCard => Object.freeze({
  id: `${naipe}-${posicao}`,
  nome,
  slug,
  naipe,
  posicao,
  cardImage: typeof posicao === "string" 
    ? `/src/assets/menor-${naipe}-${posicao}.jpg` 
    : `/assets/arcanos-menores/${naipe}-${posicao}.jpg`,
});

/** 56 cartas oficiais, ordem canônica: Copas → Paus → Espadas → Ouros, Ás → Rei. */
export const FROZEN_DECK: readonly FrozenCard[] = Object.freeze([
  // ── COPAS ──────────────────────────────────────────────
  card("copas", 1, "Ás de Copas", "as-de-copas"),
  card("copas", 2, "Dois de Copas", "dois-de-copas"),
  card("copas", 3, "Três de Copas", "tres-de-copas"),
  card("copas", 4, "Quatro de Copas", "quatro-de-copas"),
  card("copas", 5, "Cinco de Copas", "cinco-de-copas"),
  card("copas", 6, "Seis de Copas", "seis-de-copas"),
  card("copas", 7, "Sete de Copas", "sete-de-copas"),
  card("copas", 8, "Oito de Copas", "oito-de-copas"),
  card("copas", 9, "Nove de Copas", "nove-de-copas"),
  card("copas", 10, "Dez de Copas", "dez-de-copas"),
  card("copas", "pajem", "Pajem de Copas", "pajem-de-copas"),
  card("copas", "cavaleiro", "Cavaleiro de Copas", "cavaleiro-de-copas"),
  card("copas", "rainha", "Rainha de Copas", "rainha-de-copas"),
  card("copas", "rei", "Rei de Copas", "rei-de-copas"),
  // ── PAUS ───────────────────────────────────────────────
  card("paus", 1, "Ás de Paus", "as-de-paus"),
  card("paus", 2, "Dois de Paus", "dois-de-paus"),
  card("paus", 3, "Três de Paus", "tres-de-paus"),
  card("paus", 4, "Quatro de Paus", "quatro-de-paus"),
  card("paus", 5, "Cinco de Paus", "cinco-de-paus"),
  card("paus", 6, "Seis de Paus", "seis-de-paus"),
  card("paus", 7, "Sete de Paus", "sete-de-paus"),
  card("paus", 8, "Oito de Paus", "oito-de-paus"),
  card("paus", 9, "Nove de Paus", "nove-de-paus"),
  card("paus", 10, "Dez de Paus", "dez-de-paus"),
  card("paus", "pajem", "Pajem de Paus", "pajem-de-paus"),
  card("paus", "cavaleiro", "Cavaleiro de Paus", "cavaleiro-de-paus"),
  card("paus", "rainha", "Rainha de Paus", "rainha-de-paus"),
  card("paus", "rei", "Rei de Paus", "rei-de-paus"),
  // ── ESPADAS ────────────────────────────────────────────
  card("espadas", 1, "Ás de Espadas", "as-de-espadas"),
  card("espadas", 2, "Dois de Espadas", "dois-de-espadas"),
  card("espadas", 3, "Três de Espadas", "tres-de-espadas"),
  card("espadas", 4, "Quatro de Espadas", "quatro-de-espadas"),
  card("espadas", 5, "Cinco de Espadas", "cinco-de-espadas"),
  card("espadas", 6, "Seis de Espadas", "seis-de-espadas"),
  card("espadas", 7, "Sete de Espadas", "sete-de-espadas"),
  card("espadas", 8, "Oito de Espadas", "oito-de-espadas"),
  card("espadas", 9, "Nove de Espadas", "nove-de-espadas"),
  card("espadas", 10, "Dez de Espadas", "dez-de-espadas"),
  card("espadas", "pajem", "Pajem de Espadas", "pajem-de-espadas"),
  card("espadas", "cavaleiro", "Cavaleiro de Espadas", "cavaleiro-de-espadas"),
  card("espadas", "rainha", "Rainha de Espadas", "rainha-de-espadas"),
  card("espadas", "rei", "Rei de Espadas", "rei-de-espadas"),
  // ── OUROS ──────────────────────────────────────────────
  card("ouros", 1, "Ás de Ouros", "as-de-ouros"),
  card("ouros", 2, "Dois de Ouros", "dois-de-ouros"),
  card("ouros", 3, "Três de Ouros", "tres-de-ouros"),
  card("ouros", 4, "Quatro de Ouros", "quatro-de-ouros"),
  card("ouros", 5, "Cinco de Ouros", "cinco-de-ouros"),
  card("ouros", 6, "Seis de Ouros", "seis-de-ouros"),
  card("ouros", 7, "Sete de Ouros", "sete-de-ouros"),
  card("ouros", 8, "Oito de Ouros", "oito-de-ouros"),
  card("ouros", 9, "Nove de Ouros", "nove-de-ouros"),
  card("ouros", 10, "Dez de Ouros", "dez-de-ouros"),
  card("ouros", "pajem", "Pajem de Ouros", "pajem-de-ouros"),
  card("ouros", "cavaleiro", "Cavaleiro de Ouros", "cavaleiro-de-ouros"),
  card("ouros", "rainha", "Rainha de Ouros", "rainha-de-ouros"),
  card("ouros", "rei", "Rei de Ouros", "rei-de-ouros"),
]);

export const FROZEN_BY_ID: ReadonlyMap<string, FrozenCard> = new Map(
  FROZEN_DECK.map(c => [c.id, c]),
);

/** Versão semântica do freeze. Bump ao mudar nomes/slugs/imagens. */
export const FROZEN_DECK_VERSION = "1.0.0" as const;

/** Selo de homologação — true sinaliza acervo congelado para produção. */
export const DECK_MENORES_OFICIAL = true as const;
