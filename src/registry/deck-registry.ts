/**
 * DECK OFICIAL — Rider-Waite-Smith
 * =================================
 * Single source of truth para TODAS as 78 cartas:
 *  · 22 Arcanos Maiores
 *  · 40 Arcanos Menores numerados (1-10 × 4 naipes)
 *  · 16 Cartas da Corte (Pajem, Cavaleiro, Rainha, Rei × 4 naipes)
 *
 * Nenhuma tela pode hardcodar numeral, nome ou imagem de carta.
 * Tudo passa por aqui — impede inconsistências entre admin, jornada e lições.
 *
 * Regra: numerais romanos são SEMPRE renderizados via CSS overlay,
 * NUNCA confiamos no que está gravado dentro da imagem.
 */

import placeholderImage from "@/assets/arcano-placeholder.jpg";

// ─── Menores oficiais (scans RWS, domínio público) ───
import menorCopas1 from "@/assets/menor-copas-1.jpg";
import menorCopas2 from "@/assets/menor-copas-2.jpg";
import menorCopas3 from "@/assets/menor-copas-3.jpg";
import menorCopas4 from "@/assets/menor-copas-4.jpg";
import menorCopas5 from "@/assets/menor-copas-5.jpg";
import menorCopas6 from "@/assets/menor-copas-6.jpg";
import menorCopas7 from "@/assets/menor-copas-7.jpg";
import menorCopas8 from "@/assets/menor-copas-8.jpg";
import menorCopas9 from "@/assets/menor-copas-9.jpg";
import menorCopas10 from "@/assets/menor-copas-10.jpg";
import menorPaus1 from "@/assets/menor-paus-1.jpg";
import menorPaus2 from "@/assets/menor-paus-2.jpg";
import menorPaus3 from "@/assets/menor-paus-3.jpg";
import menorPaus4 from "@/assets/menor-paus-4.jpg";
import menorPaus5 from "@/assets/menor-paus-5.jpg";
import menorPaus6 from "@/assets/menor-paus-6.jpg";
import menorPaus7 from "@/assets/menor-paus-7.jpg";
import menorPaus8 from "@/assets/menor-paus-8.jpg";
import menorPaus9 from "@/assets/menor-paus-9.jpg";
import menorPaus10 from "@/assets/menor-paus-10.jpg";
import menorOuros1 from "@/assets/menor-ouros-1.jpg";
import menorOuros2 from "@/assets/menor-ouros-2.jpg";
import menorOuros3 from "@/assets/menor-ouros-3.jpg";
import menorOuros4 from "@/assets/menor-ouros-4.jpg";
import menorOuros5 from "@/assets/menor-ouros-5.jpg";
import menorOuros6 from "@/assets/menor-ouros-6.jpg";
import menorOuros7 from "@/assets/menor-ouros-7.jpg";
import menorOuros8 from "@/assets/menor-ouros-8.jpg";
import menorOuros9 from "@/assets/menor-ouros-9.jpg";
import menorOuros10 from "@/assets/menor-ouros-10.jpg";
import menorEspadas1 from "@/assets/menor-espadas-1.jpg";
import menorEspadas2 from "@/assets/menor-espadas-2.jpg";
import menorEspadas3 from "@/assets/menor-espadas-3.jpg";
import menorEspadas4 from "@/assets/menor-espadas-4.jpg";
import menorEspadas5 from "@/assets/menor-espadas-5.jpg";
import menorEspadas6 from "@/assets/menor-espadas-6.jpg";
import menorEspadas7 from "@/assets/menor-espadas-7.jpg";
import menorEspadas8 from "@/assets/menor-espadas-8.jpg";
import menorEspadas9 from "@/assets/menor-espadas-9.jpg";
import menorEspadas10 from "@/assets/menor-espadas-10.jpg";

// ─── Cortes oficiais (scans RWS, domínio público) ───
import corteCopasPajem from "@/assets/menor-copas-pajem.jpg";
import corteCopasCavaleiro from "@/assets/menor-copas-cavaleiro.jpg";
import corteCopasRainha from "@/assets/menor-copas-rainha.jpg";
import corteCopasRei from "@/assets/menor-copas-rei.jpg";
import cortePausPajem from "@/assets/menor-paus-pajem.jpg";
import cortePausCavaleiro from "@/assets/menor-paus-cavaleiro.jpg";
import cortePausRainha from "@/assets/menor-paus-rainha.jpg";
import cortePausRei from "@/assets/menor-paus-rei.jpg";
import corteOurosPajem from "@/assets/menor-ouros-pajem.jpg";
import corteOurosCavaleiro from "@/assets/menor-ouros-cavaleiro.jpg";
import corteOurosRainha from "@/assets/menor-ouros-rainha.jpg";
import corteOurosRei from "@/assets/menor-ouros-rei.jpg";
import corteEspadasPajem from "@/assets/menor-espadas-pajem.jpg";
import corteEspadasCavaleiro from "@/assets/menor-espadas-cavaleiro.jpg";
import corteEspadasRainha from "@/assets/menor-espadas-rainha.jpg";
import corteEspadasRei from "@/assets/menor-espadas-rei.jpg";

import loucoImage from "@/assets/arcano-0-louco.jpg";
import magoImage from "@/assets/arcano-1-mago.jpg";
import sacerdotisaImage from "@/assets/arcano-2-sacerdotisa.jpg";
import imperatrizImage from "@/assets/arcano-3-imperatriz.jpg";
import imperadorImage from "@/assets/arcano-4-imperador.jpg";
import hierofanteImage from "@/assets/arcano-5-hierofante.jpg";
import enamoradosImage from "@/assets/arcano-6-enamorados.jpg";
import carroImage from "@/assets/arcano-7-carro.jpg";
import justicaImage from "@/assets/arcano-8-justica.jpg";
import eremitaImage from "@/assets/arcano-9-eremita.jpg";
import rodaFortunaImage from "@/assets/arcano-10-roda-fortuna.jpg";
import forcaImage from "@/assets/arcano-11-forca.jpg";
import enforcadoImage from "@/assets/arcano-12-enforcado.jpg";
import morteImage from "@/assets/arcano-13-morte.jpg";
import temperancaImage from "@/assets/arcano-14-temperanca.jpg";
import diaboImage from "@/assets/arcano-15-diabo.jpg";
import torreImage from "@/assets/arcano-16-torre.jpg";
import estrelaImage from "@/assets/arcano-17-estrela.jpg";
import luaImage from "@/assets/arcano-18-lua.jpg";
import solImage from "@/assets/arcano-19-sol.jpg";
import julgamentoImage from "@/assets/arcano-20-julgamento.jpg";
import mundoImage from "@/assets/arcano-21-mundo.jpg";

// ─── Tipos canônicos ─────────────────────────────────────────────
export type CardCategory = "maior" | "menor" | "corte";
export type Suit = "copas" | "paus" | "espadas" | "ouros";
export type CourtRank = "pajem" | "cavaleiro" | "rainha" | "rei";

/** Entrada base de qualquer carta no deck oficial */
export interface DeckCardEntry {
  /** ID único e estável (ex.: "maior-1", "copas-7", "espadas-rainha") */
  id: string;
  category: CardCategory;
  /** Nome oficial em português */
  name: string;
  /** Slug URL-safe */
  slug: string;
  /** Subtítulo poético */
  subtitle: string;
  /** Asset oficial — placeholder enquanto não houver arte fiel ao RWS */
  cardImage: string;
  /** Símbolos centrais canônicos (RWS) */
  canonicalSymbols: string[];
  /** Status do asset visual */
  assetStatus: "official" | "placeholder";

  // Maiores
  /** Número arábico (0–21) — apenas Maiores */
  number?: number;
  /** Numeral romano canônico — apenas Maiores */
  numeral?: string;

  // Menores e Cortes
  naipe?: Suit;
  /** Posição 1-10 — apenas Menores numerados */
  position?: number;
  /** Rank — apenas Cortes */
  court?: CourtRank;
}

/**
 * @deprecated Use DeckCardEntry. Mantido para retrocompatibilidade dos Maiores.
 */
export interface DeckEntry {
  number: number;
  numeral: string;
  name: string;
  slug: string;
  subtitle: string;
  cardImage: string;
  canonicalSymbols: string[];
  assetStatus: "official" | "placeholder";
}

export const DECK_REGISTRY: readonly DeckEntry[] = [
  {
    number: 0, numeral: "0", name: "O Louco", slug: "o-louco",
    subtitle: "O Início da Jornada",
    cardImage: loucoImage, assetStatus: "official",
    canonicalSymbols: ["penhasco", "trouxa", "cão", "flor branca", "céu aberto", "sol"],
  },
  {
    number: 1, numeral: "I", name: "O Mago", slug: "o-mago",
    subtitle: "O Poder da Vontade",
    cardImage: magoImage, assetStatus: "official",
    canonicalSymbols: ["bastão elevado", "mão para baixo", "mesa com 4 elementos", "lemniscata", "jardim de rosas e lírios"],
  },
  {
    number: 2, numeral: "II", name: "A Sacerdotisa", slug: "a-sacerdotisa",
    subtitle: "O Véu do Mistério",
    cardImage: sacerdotisaImage, assetStatus: "official",
    canonicalSymbols: ["colunas Boaz e Jachin", "véu com romãs", "lua crescente aos pés", "rolo Tora", "cruz no peito"],
  },
  {
    number: 3, numeral: "III", name: "A Imperatriz", slug: "a-imperatriz",
    subtitle: "A Abundância Criativa",
    cardImage: imperatrizImage, assetStatus: "official",
    canonicalSymbols: ["coroa de 12 estrelas", "campo de trigo", "cetro", "escudo de Vênus", "rio fluindo"],
  },
  {
    number: 4, numeral: "IV", name: "O Imperador", slug: "o-imperador",
    subtitle: "A Estrutura e a Ordem",
    cardImage: imperadorImage, assetStatus: "official",
    canonicalSymbols: ["trono de pedra com cabeças de carneiro", "cetro ankh", "armadura", "montanhas áridas", "barba branca"],
  },
  {
    number: 5, numeral: "V", name: "O Hierofante", slug: "o-hierofante",
    subtitle: "A Tradição Sagrada",
    cardImage: hierofanteImage, assetStatus: "official",
    canonicalSymbols: ["tríplice coroa", "cetro papal", "dois discípulos", "duas chaves cruzadas", "colunas"],
  },
  {
    number: 6, numeral: "VI", name: "Os Enamorados", slug: "os-enamorados",
    subtitle: "A Escolha do Coração",
    cardImage: enamoradosImage, assetStatus: "official",
    canonicalSymbols: ["arcanjo Rafael", "homem e mulher nus", "árvore da vida com chamas", "árvore do conhecimento com serpente", "sol radiante"],
  },
  {
    number: 7, numeral: "VII", name: "O Carro", slug: "o-carro",
    subtitle: "A Vitória da Vontade",
    cardImage: carroImage, assetStatus: "official",
    canonicalSymbols: ["duas esfinges (preta e branca)", "dossel estrelado", "armadura com luas nos ombros", "cidade ao fundo", "lemniscata"],
  },
  {
    number: 8, numeral: "VIII", name: "A Força", slug: "a-forca",
    subtitle: "A Coragem Suave",
    cardImage: forcaImage, assetStatus: "official",
    canonicalSymbols: ["mulher acariciando leão", "lemniscata sobre a cabeça", "guirlanda de flores", "vestido branco", "montanha ao fundo"],
  },
  {
    number: 9, numeral: "IX", name: "O Eremita", slug: "o-eremita",
    subtitle: "A Luz Interior",
    cardImage: eremitaImage, assetStatus: "official",
    canonicalSymbols: ["lanterna com estrela de seis pontas", "cajado", "manto cinza", "montanha gelada", "cabeça baixa"],
  },
  {
    number: 10, numeral: "X", name: "A Roda da Fortuna", slug: "a-roda-da-fortuna",
    subtitle: "Os Ciclos do Destino",
    cardImage: rodaFortunaImage, assetStatus: "official",
    canonicalSymbols: ["roda com letras TARO/YHVH", "esfinge no topo", "serpente descendo", "Anúbis subindo", "quatro criaturas aladas nos cantos"],
  },
  {
    number: 11, numeral: "XI", name: "A Justiça", slug: "a-justica",
    subtitle: "O Equilíbrio Kármico",
    cardImage: justicaImage, assetStatus: "official",
    canonicalSymbols: ["espada erguida", "balança", "coroa com pedra azul", "manto vermelho", "véu entre colunas"],
  },
  {
    number: 12, numeral: "XII", name: "O Enforcado", slug: "o-enforcado",
    subtitle: "A Rendição Iluminada",
    cardImage: enforcadoImage, assetStatus: "official",
    canonicalSymbols: ["homem suspenso de cabeça para baixo", "halo dourado", "cruz em T (Tau)", "perna dobrada formando 4", "expressão serena"],
  },
  {
    number: 13, numeral: "XIII", name: "A Morte", slug: "a-morte",
    subtitle: "A Grande Transformação",
    cardImage: morteImage, assetStatus: "official",
    canonicalSymbols: ["esqueleto em armadura preta", "estandarte com rosa branca de cinco pétalas", "cavalo branco", "sol nascendo entre torres", "rio"],
  },
  {
    number: 14, numeral: "XIV", name: "A Temperança", slug: "a-temperanca",
    subtitle: "A Alquimia Interior",
    cardImage: temperancaImage, assetStatus: "official",
    canonicalSymbols: ["arcanjo com asas", "dois cálices com líquido fluindo", "um pé na água outro na terra", "triângulo no peito", "íris no caminho"],
  },
  {
    number: 15, numeral: "XV", name: "O Diabo", slug: "o-diabo",
    subtitle: "A Sombra das Amarras",
    cardImage: diaboImage, assetStatus: "official",
    canonicalSymbols: ["Baphomet com chifres e asas", "pentagrama invertido na testa", "casal acorrentado", "tocha invertida", "pedestal preto"],
  },
  {
    number: 16, numeral: "XVI", name: "A Torre", slug: "a-torre",
    subtitle: "A Revelação Súbita",
    cardImage: torreImage, assetStatus: "official",
    canonicalSymbols: ["torre atingida por raio", "coroa caindo", "duas figuras despencando", "22 chamas iod", "céu noturno"],
  },
  {
    number: 17, numeral: "XVII", name: "A Estrela", slug: "a-estrela",
    subtitle: "A Esperança Renovada",
    cardImage: estrelaImage, assetStatus: "official",
    canonicalSymbols: ["mulher nua ajoelhada", "estrela de oito pontas central", "sete estrelas menores", "dois cântaros (água na terra e no rio)", "íbis na árvore"],
  },
  {
    number: 18, numeral: "XVIII", name: "A Lua", slug: "a-lua",
    subtitle: "O Caminho da Intuição",
    cardImage: luaImage, assetStatus: "official",
    canonicalSymbols: ["lua com rosto de perfil", "15 gotas iod caindo", "cão e lobo uivando", "lagostim saindo da água", "duas torres ao fundo"],
  },
  {
    number: 19, numeral: "XIX", name: "O Sol", slug: "o-sol",
    subtitle: "A Alegria Radiante",
    cardImage: solImage, assetStatus: "official",
    canonicalSymbols: ["sol antropomorfizado central", "criança nua sobre cavalo branco", "girassóis", "estandarte vermelho", "muro de pedra"],
  },
  {
    number: 20, numeral: "XX", name: "O Julgamento", slug: "o-julgamento",
    subtitle: "O Despertar Final",
    cardImage: julgamentoImage, assetStatus: "official",
    canonicalSymbols: ["arcanjo Gabriel com trombeta", "estandarte com cruz vermelha", "figuras se erguendo de caixões", "montanhas geladas", "águas"],
  },
  {
    number: 21, numeral: "XXI", name: "O Mundo", slug: "o-mundo",
    subtitle: "A Completude Sagrada",
    cardImage: mundoImage, assetStatus: "official",
    canonicalSymbols: ["dançarina nua envolta em estola", "guirlanda oval (mandorla)", "duas varinhas", "quatro criaturas vivas nos cantos (Tetramorfo)", "céu aberto"],
  },
];

// ─── Validação canônica do numeral romano ───
const CANONICAL_NUMERALS = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];

/** Numeral romano oficial para um número de arcano (0-21) */
export function getCanonicalNumeral(n: number): string {
  return CANONICAL_NUMERALS[n] ?? String(n);
}

/** Busca registro oficial por número */
export function getDeckEntry(number: number): DeckEntry | undefined {
  return DECK_REGISTRY.find((e) => e.number === number);
}

/** Busca registro oficial por slug */
export function getDeckEntryBySlug(slug: string): DeckEntry | undefined {
  return DECK_REGISTRY.find((e) => e.slug === slug);
}

/** Validação automática do deck inteiro */
export interface DeckValidationRow {
  number: number;
  name: string;
  numeral: string;
  imageValidated: boolean;
  symbolsValidated: boolean;
  cardLessonMatch: boolean;
  status: "aprovado" | "corrigir";
  notes: string[];
}

export function validateDeck(): DeckValidationRow[] {
  return DECK_REGISTRY.map((entry) => {
    const notes: string[] = [];
    const numeralOk = entry.numeral === getCanonicalNumeral(entry.number);
    if (!numeralOk) notes.push(`Numeral romano divergente (esperado ${getCanonicalNumeral(entry.number)})`);

    const imageValidated = entry.assetStatus === "official";
    if (!imageValidated) notes.push("Imagem placeholder — arte RWS oficial pendente");

    const symbolsValidated = entry.canonicalSymbols.length >= 4;
    if (!symbolsValidated) notes.push("Símbolos canônicos incompletos");

    const cardLessonMatch = numeralOk && entry.name.length > 0 && entry.slug.length > 0;

    const status: "aprovado" | "corrigir" =
      numeralOk && symbolsValidated && cardLessonMatch && imageValidated ? "aprovado" : "corrigir";

    return {
      number: entry.number,
      name: entry.name,
      numeral: entry.numeral,
      imageValidated,
      symbolsValidated,
      cardLessonMatch,
      status,
      notes,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// ARCANOS MENORES (40) + CARTAS DA CORTE (16)
// ═══════════════════════════════════════════════════════════════════

const SUIT_META: Record<Suit, { name: string; element: string; symbols: string[] }> = {
  copas:    { name: "Copas",    element: "Água",  symbols: ["cálice", "água", "peixes", "lótus"] },
  paus:     { name: "Paus",     element: "Fogo",  symbols: ["bastão florescido", "salamandra", "deserto", "folhas brotando"] },
  espadas:  { name: "Espadas",  element: "Ar",    symbols: ["lâmina", "nuvens", "vento", "pássaros"] },
  ouros:    { name: "Ouros",    element: "Terra", symbols: ["pentáculo", "moeda dourada", "jardim", "uvas"] },
};

const COURT_META: Record<CourtRank, { name: string; archetype: string }> = {
  pajem:      { name: "Pajem",      archetype: "mensageiro / aprendiz" },
  cavaleiro:  { name: "Cavaleiro",  archetype: "ação / movimento" },
  rainha:     { name: "Rainha",     archetype: "maturidade interior" },
  rei:        { name: "Rei",        archetype: "domínio externo" },
};

const SUITS: Suit[] = ["copas", "paus", "espadas", "ouros"];
const COURTS: CourtRank[] = ["pajem", "cavaleiro", "rainha", "rei"];

const numberName = (n: number) =>
  n === 1 ? "Ás" : ["Dois","Três","Quatro","Cinco","Seis","Sete","Oito","Nove","Dez"][n - 2];

/**
 * Overrides oficiais dos Menores — scans Rider-Waite-Smith (Wikimedia Commons, domínio público).
 *
 * Cada entrada substitui o placeholder padrão e fornece símbolos canônicos da cena RWS
 * (não pip decorativo). Entradas ausentes permanecem como placeholder até oficialização.
 */
const MENORES_OFFICIAL_OVERRIDES: Partial<Record<string, {
  cardImage: string;
  canonicalSymbols: string[];
  subtitle: string;
}>> = {
  "copas-1": {
    cardImage: menorCopas1,
    subtitle: "O Cálice Transbordante",
    canonicalSymbols: [
      "mão divina emergindo da nuvem",
      "cálice dourado com a letra W (Water)",
      "pomba descendo com hóstia em cruz",
      "cinco jatos de água",
      "lago coberto de lótus",
    ],
  },
  "copas-2": {
    cardImage: menorCopas2,
    subtitle: "A União dos Opostos",
    canonicalSymbols: [
      "casal trocando cálices",
      "caduceu de Hermes entre eles",
      "cabeça de leão alada coroando o caduceu",
      "guirlanda de louros na mulher",
      "casa ao fundo na colina",
    ],
  },
  "copas-3": {
    cardImage: menorCopas3,
    subtitle: "A Celebração da Comunhão",
    canonicalSymbols: [
      "três mulheres dançando em círculo",
      "três cálices erguidos em brinde",
      "guirlandas de flores e frutas",
      "abóboras e uvas aos pés (abundância)",
      "céu aberto sem nuvens",
    ],
  },
  "copas-4": {
    cardImage: menorCopas4,
    subtitle: "A Apatia e o Cálice Oferecido",
    canonicalSymbols: [
      "jovem sentado sob a árvore com braços cruzados",
      "três cálices alinhados no chão à sua frente",
      "quarto cálice oferecido por mão emergindo da nuvem",
      "olhar contemplativo e desinteressado",
      "colina verde isolando a cena",
    ],
  },
  "copas-5": {
    cardImage: menorCopas5,
    subtitle: "O Luto e o que Permanece",
    canonicalSymbols: [
      "figura encapuzada de manto negro",
      "três cálices derramados aos pés",
      "dois cálices ainda em pé atrás dela",
      "rio escuro a separar a margem",
      "ponte ao fundo levando ao castelo",
    ],
  },
  "copas-6": {
    cardImage: menorCopas6,
    subtitle: "A Memória e a Inocência",
    canonicalSymbols: [
      "criança maior entregando cálice com flor branca",
      "criança menor recebendo a oferta",
      "seis cálices floridos com flores brancas de cinco pétalas",
      "vila medieval ao fundo",
      "sentinela em xadrez se afastando",
    ],
  },
  "copas-7": {
    cardImage: menorCopas7,
    subtitle: "As Visões e a Ilusão",
    canonicalSymbols: [
      "figura em silhueta diante de sete cálices nas nuvens",
      "cálice com cabeça humana (desejo)",
      "cálice com figura velada luminosa (espiritualidade)",
      "cálice com serpente (sabedoria/tentação)",
      "cálice com castelo (ambição), joias (riqueza), louros (vitória) e dragão (medo)",
    ],
  },
  "copas-8": {
    cardImage: menorCopas8,
    subtitle: "A Partida Silenciosa",
    canonicalSymbols: [
      "figura encapuzada de manto vermelho se afastando",
      "bastão na mão apoiando a caminhada",
      "oito cálices empilhados deixados para trás (cinco embaixo, três em cima)",
      "lua eclipsando o sol no céu",
      "rio e montanhas indicando a travessia",
    ],
  },
  "copas-9": {
    cardImage: menorCopas9,
    subtitle: "A Satisfação Plena",
    canonicalSymbols: [
      "homem sentado em banco baixo, braços cruzados",
      "chapéu vermelho com pluma",
      "nove cálices alinhados em arco sobre mesa coberta de tecido azul",
      "expressão satisfeita e segura",
      "fundo amarelo dourado uniforme (plenitude material)",
    ],
  },
  "copas-10": {
    cardImage: menorCopas10,
    subtitle: "O Arco-Íris da Família",
    canonicalSymbols: [
      "casal de braços abertos celebrando o céu",
      "duas crianças dançando de mãos dadas",
      "arco-íris formado por dez cálices no alto",
      "casa entre as árvores ao fundo",
      "rio sereno cortando o vale verde",
    ],
  },
  "paus-1": {
    cardImage: menorPaus1,
    subtitle: "A Centelha Criadora",
    canonicalSymbols: [
      "mão divina emergindo da nuvem segurando o bastão",
      "bastão verde florescendo com folhas vivas",
      "oito folhas caindo em forma de yod (chama hebraica)",
      "castelo no alto da colina ao fundo",
      "vale verde fértil sob o bastão",
    ],
  },
  "paus-2": {
    cardImage: menorPaus2,
    subtitle: "O Mundo na Palma da Mão",
    canonicalSymbols: [
      "homem nobre vestido em manto vermelho no parapeito",
      "globo terrestre seguro na mão direita",
      "bastão à esquerda fixo no chão, segundo bastão preso à muralha",
      "rosas e lírios cruzados em emblema (paixão e pureza)",
      "vista do alto sobre o mar e a costa",
    ],
  },
  "paus-3": {
    cardImage: menorPaus3,
    subtitle: "A Espera no Horizonte",
    canonicalSymbols: [
      "figura de costas no alto do penhasco",
      "três bastões fincados no chão à sua volta",
      "mão apoiada num dos bastões em postura de vigília",
      "navios partindo no mar amarelo dourado",
      "manto vermelho e verde sinalizando ação e crescimento",
    ],
  },
  "paus-4": {
    cardImage: menorPaus4,
    subtitle: "O Pórtico da Celebração",
    canonicalSymbols: [
      "quatro bastões fincados formando um pórtico",
      "guirlanda de flores e frutos pendurada entre os bastões",
      "duas figuras erguendo buquês em saudação",
      "castelo amuralhado dourado ao fundo",
      "céu amarelo aberto de festa e abundância",
    ],
  },
  "paus-5": {
    cardImage: menorPaus5,
    subtitle: "O Embate Aberto",
    canonicalSymbols: [
      "cinco jovens cruzando bastões em pleno ar",
      "vestes coloridas distintas (cada um por si)",
      "gestos de embate sem sangue, energia em conflito",
      "chão verde de terreno aberto",
      "céu claro sem inimigo real ao fundo",
    ],
  },
  "paus-6": {
    cardImage: menorPaus6,
    subtitle: "O Retorno do Vencedor",
    canonicalSymbols: [
      "cavaleiro montado em cavalo branco ornamentado",
      "coroa de louros sobre o bastão erguido",
      "guirlanda de louros sobre a cabeça do cavaleiro",
      "cinco bastões erguidos pelos seguidores ao redor",
      "manto vermelho como signo de vitória",
    ],
  },
  "paus-7": {
    cardImage: menorPaus7,
    subtitle: "O Último Bastião",
    canonicalSymbols: [
      "figura no topo da colina defendendo a posição com um bastão",
      "seis bastões avançando de baixo contra a figura",
      "sapatos diferentes (um marrom, um verde) — defesa improvisada",
      "expressão firme e determinada de resistência",
      "vantagem do terreno alto sobre os atacantes",
    ],
  },
  "paus-8": {
    cardImage: menorPaus8,
    subtitle: "As Flechas no Céu",
    canonicalSymbols: [
      "oito bastões em pleno voo paralelos pelo céu",
      "ausência de figura humana — energia pura em movimento",
      "rio sereno cortando a paisagem ao fundo",
      "campo verde abaixo dos bastões",
      "céu aberto e claro indicando trajeto livre",
    ],
  },
  "paus-9": {
    cardImage: menorPaus9,
    subtitle: "A Sentinela Ferida",
    canonicalSymbols: [
      "figura apoiada em um bastão com bandagem na cabeça",
      "oito bastões erguidos em fila atrás como cerca defensiva",
      "olhar atento e cansado vigiando o horizonte",
      "postura de quem já lutou e ainda espera por mais",
      "terreno claro de vigília sob luz neutra",
    ],
  },
  "paus-10": {
    cardImage: menorPaus10,
    subtitle: "O Peso da Conquista",
    canonicalSymbols: [
      "figura curvada carregando dez bastões nos braços",
      "carga concentrada à frente, bloqueando a visão",
      "casa e vila ao fundo, próximas mas ainda distantes",
      "campo arado mostrando a jornada já cumprida",
      "céu claro indicando que o peso é responsabilidade, não punição",
    ],
  },
  "ouros-1": {
    cardImage: menorOuros1,
    subtitle: "A Semente de Ouro",
    canonicalSymbols: [
      "mão divina emergindo da nuvem segurando o pentáculo",
      "grande moeda dourada com pentagrama inscrito",
      "jardim florido de lírios brancos abaixo",
      "arco de sebe formando portal verde",
      "montanhas distantes apontando o objetivo de longo prazo",
    ],
  },
  "ouros-2": {
    cardImage: menorOuros2,
    subtitle: "A Dança do Equilíbrio",
    canonicalSymbols: [
      "jovem dançando equilibrando dois pentáculos",
      "lemniscata (∞) verde unindo as duas moedas",
      "chapéu pontudo vermelho em movimento",
      "mar agitado ao fundo com dois navios em ondas altas",
      "postura em passo de dança — equilíbrio dinâmico, não estático",
    ],
  },
  "ouros-3": {
    cardImage: menorOuros3,
    subtitle: "A Obra das Mãos",
    canonicalSymbols: [
      "escultor sobre o banco trabalhando o arco da catedral",
      "monge e arquiteto consultando os planos abertos",
      "três pentáculos esculpidos em alto-relevo no arco",
      "interior de pedra de catedral em construção",
      "diálogo silencioso entre execução, projeto e ofício sagrado",
    ],
  },
  "ouros-4": {
    cardImage: menorOuros4,
    subtitle: "O Guardião do Tesouro",
    canonicalSymbols: [
      "figura coroada sentada agarrando um pentáculo contra o peito",
      "pentáculo equilibrado sobre a coroa selando a mente",
      "dois pentáculos sob os pés firmando a base",
      "postura rígida e fechada — controle do que se tem",
      "cidade ao fundo da qual a figura se isola",
    ],
  },
  "ouros-5": {
    cardImage: menorOuros5,
    subtitle: "A Travessia no Frio",
    canonicalSymbols: [
      "dois mendigos atravessando a neve sob a nevasca",
      "figura coxa apoiada em muleta",
      "companheira encapuzada caminhando ao lado",
      "vitral iluminado com cinco pentáculos no alto",
      "igreja ao fundo — refúgio próximo, mas ignorado",
    ],
  },
  "ouros-6": {
    cardImage: menorOuros6,
    subtitle: "A Balança da Caridade",
    canonicalSymbols: [
      "mercador em vestes ricas distribuindo moedas",
      "balança equilibrada erguida na mão esquerda",
      "dois mendigos ajoelhados recebendo a esmola",
      "seis pentáculos suspensos no ar entre eles",
      "trocas medidas — quem dá, quem recebe e por quê",
    ],
  },
  "ouros-7": {
    cardImage: menorOuros7,
    subtitle: "A Pausa do Cultivador",
    canonicalSymbols: [
      "jovem agricultor apoiado em sua enxada",
      "olhar contemplativo sobre o arbusto carregado",
      "sete pentáculos crescidos entre folhas e ramos",
      "um pentáculo isolado aos pés — semente futura",
      "pausa pensativa antes da colheita — vale a pena seguir?",
    ],
  },
  "ouros-8": {
    cardImage: menorOuros8,
    subtitle: "O Aprendiz Paciente",
    canonicalSymbols: [
      "artesão sentado em banco de madeira batendo a cinzel",
      "avental de trabalho e ferramentas em mãos",
      "seis pentáculos já cravados em pilastra vertical",
      "um sétimo recém-trabalhado, um oitavo aos pés",
      "cidade distante ao fundo — escolha do recolhimento",
    ],
  },
  "ouros-9": {
    cardImage: menorOuros9,
    subtitle: "O Jardim da Maturidade",
    canonicalSymbols: [
      "mulher elegante em vestido bordado em jardim próprio",
      "falcão encapuzado pousado sobre a luva — instinto domado",
      "videira carregada de uvas e nove pentáculos",
      "caracol no chão — paciência, ritmo lento da abundância",
      "mansão ao fundo — colheita de uma vida inteira de cuidado",
    ],
  },
  "ouros-10": {
    cardImage: menorOuros10,
    subtitle: "A Casa das Gerações",
    canonicalSymbols: [
      "patriarca idoso sentado sob o arco, acompanhado por dois cães",
      "casal jovem conversando ao lado, criança puxando a saia da mãe",
      "dez pentáculos dispostos no padrão da árvore da vida",
      "estandarte de torres e balança — brasão da linhagem",
      "muralha da cidade ao fundo — patrimônio que atravessa o tempo",
    ],
  },
  "espadas-1": {
    cardImage: menorEspadas1,
    subtitle: "A Espada da Verdade",
    canonicalSymbols: [
      "mão divina emergindo da nuvem segurando uma única espada ereta",
      "coroa dourada atravessada pela lâmina — vitória da clareza",
      "guirlanda de louro e ramo de palma pendurados na coroa",
      "seis gotas em forma de yods caindo ao redor — bênção do alto",
      "montanhas escarpadas ao fundo — o terreno árduo da verdade",
    ],
  },
  "espadas-2": {
    cardImage: menorEspadas2,
    subtitle: "O Pacto do Silêncio",
    canonicalSymbols: [
      "mulher vendada sentada de costas para o mar",
      "duas espadas cruzadas sustentadas em equilíbrio sobre o peito",
      "lua crescente no alto — intuição velada pela razão",
      "rochas pontiagudas emergindo da água escura ao fundo",
      "manto cinza — neutralidade imposta, trégua frágil",
    ],
  },
  "espadas-3": {
    cardImage: menorEspadas3,
    subtitle: "O Coração Atravessado",
    canonicalSymbols: [
      "coração vermelho atravessado por três espadas idênticas",
      "céu cinza carregado de nuvens densas",
      "chuva oblíqua caindo sobre toda a cena",
      "ausência total de figura humana — a dor é o protagonista",
      "composição central e simétrica — luto que não se evita",
    ],
  },
  "espadas-4": {
    cardImage: menorEspadas4,
    subtitle: "O Repouso do Cavaleiro",
    canonicalSymbols: [
      "cavaleiro deitado em efígie sobre tumba de pedra dentro de uma capela",
      "mãos unidas em prece — pausa, recolhimento, retiro",
      "três espadas suspensas na parede acima da figura",
      "uma espada gravada horizontalmente sob o corpo — o conflito guardado",
      "vitral colorido ao fundo com cena de bênção — silêncio sagrado",
    ],
  },
  "espadas-5": {
    cardImage: menorEspadas5,
    subtitle: "A Vitória Amarga",
    canonicalSymbols: [
      "homem em primeiro plano recolhendo três espadas com sorriso ambíguo",
      "duas figuras afastadas de costas — derrota, humilhação, retirada",
      "céu rasgado por nuvens irregulares e ventosas",
      "duas espadas caídas no chão — abandono, rendição",
      "água agitada ao fundo — emoções turvas após o conflito",
    ],
  },
  "espadas-6": {
    cardImage: menorEspadas6,
    subtitle: "A Travessia das Águas",
    canonicalSymbols: [
      "barqueiro conduzindo barca silenciosa sobre águas calmas",
      "mulher encapuzada e criança sentadas, voltadas para a outra margem",
      "seis espadas fincadas verticalmente na proa — peso transportado",
      "água lisa do lado direito, ondulada do lado esquerdo — partida do turbulento",
      "margem distante ao horizonte — destino ainda não revelado",
    ],
  },
  "espadas-7": {
    cardImage: menorEspadas7,
    subtitle: "O Furto Silencioso",
    canonicalSymbols: [
      "homem afastando-se furtivamente de um acampamento militar carregando cinco espadas",
      "duas espadas deixadas para trás fincadas no chão — o que não pôde levar",
      "tendas coloridas ao fundo com figuras distantes — vigilância adormecida",
      "olhar virado para trás com sorriso ambíguo — astúcia, esquiva, traição sutil",
      "céu amarelo plano — luz crua sem sombra para se esconder",
    ],
  },
  "espadas-8": {
    cardImage: menorEspadas8,
    subtitle: "A Prisão da Mente",
    canonicalSymbols: [
      "mulher amarrada e vendada em pé sobre solo lamacento",
      "oito espadas fincadas em volta formando uma cerca incompleta — prisão imaginada",
      "vestes vermelhas presas ao corpo — vitalidade contida",
      "castelo distante no alto da colina — saída visível mas inalcançável",
      "céu cinzento e terra encharcada — paralisia, autoengano, impotência aprendida",
    ],
  },
  "espadas-9": {
    cardImage: menorEspadas9,
    subtitle: "A Vigília da Angústia",
    canonicalSymbols: [
      "figura sentada na cama com as mãos cobrindo o rosto — despertar em sofrimento",
      "nove espadas suspensas horizontalmente na parede escura — pensamentos repetidos",
      "colcha colorida com símbolos de rosas e signos zodiacais — vida que continua sob a dor",
      "lateral da cama esculpida com cena de duelo — o conflito que precede o pesadelo",
      "fundo totalmente preto — noite sem horizonte, insônia da alma",
    ],
  },
  "espadas-10": {
    cardImage: menorEspadas10,
    subtitle: "O Fim da Lâmina",
    canonicalSymbols: [
      "homem caído de bruços com dez espadas cravadas nas costas — derrota final",
      "manto vermelho cobrindo as pernas — vitalidade que se esvai",
      "céu negro pesando sobre o horizonte — ponto mais baixo da travessia",
      "água parada ao fundo — emoção paralisada após o golpe",
      "raio de luz amarela rompendo no horizonte distante — o pior já passou, o sol volta",
    ],
  },
};

/** 40 Arcanos Menores numerados (1-10 × 4 naipes) */
export const MENORES_REGISTRY: readonly DeckCardEntry[] = SUITS.flatMap((suit) =>
  Array.from({ length: 10 }, (_, i) => {
    const pos = i + 1;
    const meta = SUIT_META[suit];
    const id = `${suit}-${pos}`;
    const override = MENORES_OFFICIAL_OVERRIDES[id];
    return {
      id,
      category: "menor" as const,
      name: `${numberName(pos)} de ${meta.name}`,
      slug: id,
      subtitle: override?.subtitle ?? `${meta.element} · posição ${pos}`,
      cardImage: override?.cardImage ?? placeholderImage,
      assetStatus: (override ? "official" : "placeholder") as "official" | "placeholder",
      canonicalSymbols: override?.canonicalSymbols ?? meta.symbols,
      naipe: suit,
      position: pos,
    };
  })
);

/**
 * Overrides oficiais para Cartas da Corte (scans RWS).
 * Substituem placeholder + symbols genéricos por arte e símbolos canônicos.
 * Entradas ausentes permanecem como placeholder até oficialização.
 */
const CORTES_OFFICIAL_OVERRIDES: Partial<Record<string, {
  cardImage: string;
  canonicalSymbols: string[];
  subtitle: string;
}>> = {
  "copas-pajem": {
    cardImage: corteCopasPajem,
    subtitle: "O Mensageiro do Sentimento",
    canonicalSymbols: [
      "jovem em túnica azul florida com lírios estampados — sensibilidade jovem",
      "boina azul macia com lenço esvoaçante caindo sobre o ombro — leveza intuitiva",
      "cálice dourado erguido na mão direita do qual emerge um peixe — mensagem do inconsciente",
      "olhar curioso e surpreso voltado para o peixe — abertura ao que vem do fundo",
      "mar agitado ao fundo — emoção viva, ainda não dominada",
    ],
  },
  "copas-cavaleiro": {
    cardImage: corteCopasCavaleiro,
    subtitle: "O Romântico em Marcha",
    canonicalSymbols: [
      "cavaleiro em armadura de prata avançando lentamente em cavalo branco",
      "elmo e botas alados — Mercúrio, mensageiro entre mundos",
      "túnica vermelha estampada com peixes — paixão a serviço da emoção",
      "cálice oferecido à frente em gesto cerimonial — proposta, convite, oferta",
      "rio sereno cortando o vale verde — caminho fluido de quem segue o coração",
    ],
  },
  "copas-rainha": {
    cardImage: corteCopasRainha,
    subtitle: "A Guardiã da Alma",
    canonicalSymbols: [
      "rainha sentada em trono ricamente esculpido com anjos e conchas",
      "trono à beira-mar com pés tocando a água — domínio total sobre a emoção",
      "cálice ornamentado e fechado, com torres em forma de cruz — vaso sagrado, mistério guardado",
      "olhar contemplativo voltado para o cálice — atenção plena ao que sente",
      "manto fluido confundindo-se com o mar e as pedras — empatia que se mistura ao mundo",
    ],
  },
  "copas-rei": {
    cardImage: corteCopasRei,
    subtitle: "O Soberano da Emoção",
    canonicalSymbols: [
      "rei sentado em trono de pedra flutuando sobre o mar agitado — estabilidade em meio à emoção",
      "manto azul e túnica vermelha — domínio sereno sobre paixão e sentimento",
      "cálice equilibrado na mão direita, cetro na esquerda — afeto e autoridade lado a lado",
      "colar com peixe pendurado no peito — vínculo consciente com o inconsciente",
      "navio à esquerda e peixe saltando à direita — comércio e instinto coexistindo sob seu governo",
    ],
  },
  "paus-pajem": {
    cardImage: cortePausPajem,
    subtitle: "A Centelha do Anúncio",
    canonicalSymbols: [
      "jovem em pé firme em terreno desértico — entusiasmo plantado em chão árido",
      "túnica amarela estampada com salamandras vermelhas — fogo vivo, transformação ainda em formação",
      "boina ornada com longa pluma vermelha — impulso criativo, ar quente subindo",
      "longo bastão verde brotando folhas seguro com as duas mãos — ideia jovem que ainda cresce",
      "olhar erguido para o topo do bastão — atenção voltada à promessa, não ao chão",
      "três pirâmides ao fundo — horizonte amplo, terra a ser conquistada",
    ],
  },
  "paus-cavaleiro": {
    cardImage: cortePausCavaleiro,
    subtitle: "O Ímpeto em Galope",
    canonicalSymbols: [
      "cavaleiro em armadura avançando em cavalo ruivo empinado — ação impulsiva, energia em disparo",
      "túnica amarela coberta de salamandras formando círculo — fogo total, paixão por inteiro",
      "elmo encimado por longas plumas vermelhas em chamas — pensamento incendiado",
      "bastão verde florido erguido firme na mão direita — desejo apontado adiante",
      "três pirâmides desérticas ao fundo — terreno hostil que não freia o ímpeto",
      "cavalo com crina selvagem em movimento — força instintiva mal contida",
    ],
  },
  "paus-rainha": {
    cardImage: cortePausRainha,
    subtitle: "O Calor que Comanda",
    canonicalSymbols: [
      "rainha sentada de frente em trono de pedra ornado com leões e girassóis — autoridade solar, presença magnética",
      "manto branco e vestido amarelo — luz interna que aquece sem queimar",
      "bastão florido erguido na mão direita — vontade criativa firme e fértil",
      "girassol seguro na mão esquerda — generosidade, calor que se oferece",
      "gato preto sentado aos pés do trono — instinto desperto, lado oculto consciente",
      "leões esculpidos no encosto e nos braços do trono — coragem governada com graça",
    ],
  },
  "paus-rei": {
    cardImage: cortePausRei,
    subtitle: "O Fogo que Reina",
    canonicalSymbols: [
      "rei sentado em trono ornado com leões e salamandras — autoridade ígnea consolidada",
      "manto verde e túnica vermelha bordada — vitalidade fértil sob domínio do fogo",
      "coroa em forma de chamas estilizadas — pensamento iluminado pelo desejo",
      "bastão verde florido segurado firme com a mão direita — vontade direcionada com método",
      "salamandra mordendo a própria cauda aos pés do trono — fogo eterno, ciclo da paixão dominada",
      "postura ligeiramente inclinada à frente — liderança ativa, pronta para agir",
    ],
  },
  "ouros-pajem": {
    cardImage: corteOurosPajem,
    subtitle: "O Estudante do Concreto",
    canonicalSymbols: [
      "jovem em pé em campo florido contemplando atentamente o pentáculo erguido nas duas mãos — atenção devotada ao que é tangível",
      "túnica verde e chapéu com tiara vermelha — terra fértil coroada por vitalidade jovem",
      "pentáculo dourado segurado à altura do rosto, olhar fixo nele — estudo paciente do valor",
      "campo verde com flores amarelas e árvores ao fundo — solo fértil ainda a ser cultivado",
      "postura firme e contemplativa, pés bem plantados — aprendiz do real, sem pressa",
    ],
  },
  "ouros-cavaleiro": {
    cardImage: corteOurosCavaleiro,
    subtitle: "O Guardião do Método",
    canonicalSymbols: [
      "cavaleiro estático sobre cavalo negro parado em campo arado — ação medida, deliberadamente sem pressa",
      "armadura completa coberta por túnica vermelha estampada — disciplina protegendo a vontade",
      "elmo encimado por folhagem verde, mesma folhagem na cabeça do cavalo — paciência verde-fértil",
      "pentáculo dourado seguro firme à frente em ambas as mãos — patrimônio ofertado com responsabilidade",
      "campo arado, montanhas e horizonte calmo ao fundo — terreno preparado, trabalho já feito",
    ],
  },
  "ouros-rainha": {
    cardImage: corteOurosRainha,
    subtitle: "A Mãe da Abundância",
    canonicalSymbols: [
      "rainha sentada em trono ornado com cabeças de cabra, anjos, frutas e querubins — fertilidade governando a natureza",
      "manto vermelho e vestido cinza-pedra cobrindo o colo — calor abrigado pela solidez",
      "pentáculo dourado pousado no colo, segurado com as duas mãos em gesto contemplativo — riqueza acolhida, não exibida",
      "guirlanda de rosas vermelhas emoldurando o trono — beleza enraizada no real",
      "coelho saltando aos pés do trono — fertilidade viva, ciclo da terra que se renova",
      "jardim florido e montanhas verdes ao fundo — domínio sereno sobre o concreto",
    ],
  },
  "ouros-rei": {
    cardImage: corteOurosRei,
    subtitle: "O Senhor do Patrimônio",
    canonicalSymbols: [
      "rei sentado em trono massivo ornado com cabeças de touro — autoridade terrena consolidada",
      "manto preto bordado com videiras, uvas e flores cobrindo armadura completa — riqueza enraizada protegida por método",
      "coroa de ouro encimada por louros e flores — poder coroado pela colheita",
      "pentáculo dourado pousado sobre o joelho direito, mão repousada sobre ele — patrimônio assegurado com mão firme",
      "cetro real florido segurado com a mão esquerda — vontade que governa o que cultivou",
      "castelo ao fundo erguido sobre vinhedos e jardins — império construído tijolo a tijolo",
    ],
  },
  "espadas-pajem": {
    cardImage: corteEspadasPajem,
    subtitle: "O Vigia da Verdade",
    canonicalSymbols: [
      "jovem em pé sobre terreno acidentado, corpo torcido em alerta — vigilância tensa, prontidão constante",
      "espada erguida com as duas mãos acima do ombro direito, lâmina apontada ao céu — pensamento em guarda",
      "túnica curta esvoaçando ao vento, botas vermelhas firmes no chão — mente ágil ainda buscando equilíbrio",
      "cabelos e nuvens correndo na mesma direção — pensamento veloz movido pelo ar",
      "bando de pássaros cruzando o céu agitado ao fundo — ideias dispersas, vento intelectual em movimento",
      "olhar voltado para trás por cima do ombro — desconfiança, escuta do que vem de fora",
    ],
  },
  "espadas-cavaleiro": {
    cardImage: corteEspadasCavaleiro,
    subtitle: "A Carga da Mente",
    canonicalSymbols: [
      "cavaleiro em armadura completa avançando em galope furioso sobre cavalo branco — pensamento lançado em ataque total",
      "espada erguida bem alto na mão direita, pronta para cair — convicção transformada em arma",
      "manto vermelho esvoaçando para trás na velocidade — paixão arrastada pela razão",
      "elmo encimado por plumas vermelhas em chamas — mente incendiada pela ideia fixa",
      "rédeas tensas, cavalo com olhos arregalados e crina ao vento — instinto forçado a obedecer ao ímpeto",
      "céu carregado de nuvens revoltas e árvores curvadas pelo vento — tempestade mental em curso",
    ],
  },
  "espadas-rainha": {
    cardImage: corteEspadasRainha,
    subtitle: "A Lucidez Solitária",
    canonicalSymbols: [
      "rainha sentada de perfil em trono de pedra ornado com querubins, nuvens e borboletas — clareza lapidada pela perda",
      "espada erguida na vertical com a mão direita, lâmina apontada ao céu — verdade que não se curva",
      "mão esquerda estendida à frente em gesto de chamado — convite ao diálogo, sem doçura",
      "manto azul-cinza fluindo como nuvem sobre o trono — pensamento que se confunde com o ar",
      "coroa de borboletas e nuvens ao redor da cabeça — alma que atravessou metamorfose",
      "pássaro solitário voando alto ao fundo — discernimento que olha de cima",
    ],
  },
  "espadas-rei": {
    cardImage: corteEspadasRei,
    subtitle: "O Juiz Sereno",
    canonicalSymbols: [
      "rei sentado de frente em trono de pedra ornado com borboletas, ninfas e luas crescentes — autoridade do pensamento amadurecido",
      "espada erguida na vertical levemente inclinada para a direita — palavra firme, decisão tomada",
      "manto azul sobre túnica violeta — clareza fria sobre profundidade interior",
      "coroa rígida e simples — razão coroada sem ornamento supérfluo",
      "olhar fixo à frente, postura ereta — juízo aplicado sem hesitação",
      "céu límpido com poucas nuvens e dois pássaros distantes — mente serena após a tempestade",
    ],
  },
};

/** 16 Cartas da Corte (4 ranks × 4 naipes) */
export const CORTES_REGISTRY: readonly DeckCardEntry[] = SUITS.flatMap((suit) =>
  COURTS.map((rank) => {
    const sm = SUIT_META[suit];
    const cm = COURT_META[rank];
    const id = `${suit}-${rank}`;
    const override = CORTES_OFFICIAL_OVERRIDES[id];
    return {
      id,
      category: "corte" as const,
      name: `${cm.name} de ${sm.name}`,
      slug: id,
      subtitle: override?.subtitle ?? `${cm.archetype} · ${sm.element}`,
      cardImage: override?.cardImage ?? placeholderImage,
      assetStatus: (override ? "official" : "placeholder") as "official" | "placeholder",
      canonicalSymbols: override?.canonicalSymbols ?? sm.symbols,
      naipe: suit,
      court: rank,
    };
  })
);

/** Maiores convertidos para o formato unificado DeckCardEntry */
export const MAIORES_REGISTRY: readonly DeckCardEntry[] = DECK_REGISTRY.map((e) => ({
  id: `maior-${e.number}`,
  category: "maior",
  name: e.name,
  slug: e.slug,
  subtitle: e.subtitle,
  cardImage: e.cardImage,
  assetStatus: e.assetStatus,
  canonicalSymbols: e.canonicalSymbols,
  number: e.number,
  numeral: e.numeral,
}));

/** Deck completo — 78 cartas oficiais */
export const FULL_DECK: readonly DeckCardEntry[] = [
  ...MAIORES_REGISTRY,
  ...MENORES_REGISTRY,
  ...CORTES_REGISTRY,
];

/** Busca qualquer carta por id estável (ex.: "maior-1", "copas-7", "espadas-rainha") */
export function getCard(id: string): DeckCardEntry | undefined {
  return FULL_DECK.find((c) => c.id === id);
}

/** Busca cartas por categoria */
export function getCardsByCategory(category: CardCategory): DeckCardEntry[] {
  return FULL_DECK.filter((c) => c.category === category);
}

/** Busca cartas por naipe (Menores + Cortes) */
export function getCardsBySuit(suit: Suit): DeckCardEntry[] {
  return FULL_DECK.filter((c) => c.naipe === suit);
}

/** Resumo de validação de todo o deck (78 cartas) */
export interface FullDeckSummary {
  total: number;
  approved: number;
  placeholders: number;
  byCategory: Record<CardCategory, { total: number; official: number; placeholder: number }>;
}

export function getFullDeckSummary(): FullDeckSummary {
  const summary: FullDeckSummary = {
    total: FULL_DECK.length,
    approved: 0,
    placeholders: 0,
    byCategory: {
      maior: { total: 0, official: 0, placeholder: 0 },
      menor: { total: 0, official: 0, placeholder: 0 },
      corte: { total: 0, official: 0, placeholder: 0 },
    },
  };
  for (const c of FULL_DECK) {
    const bucket = summary.byCategory[c.category];
    bucket.total++;
    if (c.assetStatus === "official") {
      bucket.official++;
      summary.approved++;
    } else {
      bucket.placeholder++;
      summary.placeholders++;
    }
  }
  return summary;
}

