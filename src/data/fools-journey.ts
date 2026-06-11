/**
 * @deprecated [Fase 6.6 — Faxina final]
 * Arquivo legado mantido apenas como SEED / BACKUP / ROLLBACK.
 * NÃO importar no runtime (páginas, componentes, hooks).
 * Runtime principal: @/lib/content (DB) + @/content/** + @/config/** + @/registry/**.
 * Importação fora de src/lib/content/**, src/data/** ou src/components/admin/** é bloqueada por ESLint.
 */
/**
 * @deprecated (Fase 5D) Não importe deste arquivo diretamente.
 *
 * A Jornada do Louco agora vem do CMS (`cms_journey_phases`,
 * `cms_journey_arcanos`, `cms_journey_meta`) através do adapter:
 *
 *   import { useJourneyContent } from "@/hooks/use-content";
 *   import { CORES_FASE, JOURNEY_MOTION } from "@/data/fools-journey-visual";
 *
 * Este arquivo permanece apenas como SEED / FALLBACK consumido por
 * `src/lib/content/repo-legacy-journey.ts`. Nenhuma tela ou componente
 * deve mais ler `JOURNEY_INTRO`, `JOURNEY_PHASES`, `JOURNEY_ARCANOS` ou
 * `JOURNEY_CLOSING` daqui.
 *
 * A JORNADA DO LOUCO — Narrativa Completa dos 22 Arcanos Maiores
 * Baseada na tradição Rider-Waite-Smith.
 */

export interface JourneyPhase {
  id: string;
  title: string;
  subtitle: string;
  symbol: string;
  description: string;
  arcanoIds: number[];
  theme: "gold" | "wine" | "plum" | "moonlight";
}

export interface JourneyArcanoSummary {
  id: number;
  numeral: string;
  name: string;
  journeyRole: string; // one-line role in the journey
  narrativeText: string; // 2-3 sentences connecting to the journey
}

/** Introduction text for the Fool's Journey */
export const JOURNEY_INTRO = {
  title: "A Jornada do Louco ao Mundo",
  subtitle: "A travessia iniciática dos 22 Arcanos Maiores",
  epigraph: "O Louco não é o início nem o fim — é a coragem de caminhar.",
  body: [
    "Os 22 Arcanos Maiores do Tarô não são cartas soltas. São capítulos de uma única grande história — a história da consciência humana em busca de si mesma.",
    "Essa história começa com O Louco (0), o viajante inocente que dá um salto de fé no desconhecido, e termina com O Mundo (XXI), a integração plena de tudo o que foi vivido, aprendido e transformado.",
    "Entre o salto e a completude, há mestres, provas, espelhos, abismos e renascimentos. Cada arcano é um estágio dessa jornada — e cada estágio vive dentro de você.",
    "Estudar os Arcanos Maiores nessa sequência não é apenas aprender significados: é percorrer um mapa da alma.",
  ],
};

/** The 4 phases of the journey */
export const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: "mundo-material",
    title: "O Mundo Material",
    subtitle: "Formação da identidade e encontro com os mestres",
    symbol: "◈",
    description:
      "O Louco desperta para o mundo. Encontra seus primeiros mestres — o poder da vontade (O Mago), a sabedoria interior (A Sacerdotisa), a abundância criativa (A Imperatriz), a estrutura necessária (O Imperador), a tradição e o sagrado (O Hierofante), e as primeiras escolhas do coração (Os Enamorados). É a fase de formação: quem sou eu? O que posso? Em quem confio?",
    arcanoIds: [0, 1, 2, 3, 4, 5, 6],
    theme: "gold",
  },
  {
    id: "mundo-interior",
    title: "O Mundo Interior",
    subtitle: "Confronto com as forças internas e o destino",
    symbol: "☽",
    description:
      "Agora o viajante olha para dentro. Precisa encontrar sua força interior (O Carro), fazer justiça consigo mesmo (A Justiça), buscar respostas na solidão (O Eremita), aceitar os ciclos da vida (A Roda da Fortuna) e descobrir que a verdadeira força é gentileza (A Força). É o estágio do autoconhecimento profundo — o mundo como espelho.",
    arcanoIds: [7, 8, 9, 10, 11],
    theme: "wine",
  },
  {
    id: "travessia-sombria",
    title: "A Travessia Sombria",
    subtitle: "Morte, destruição e renascimento",
    symbol: "✝",
    description:
      "A jornada exige sacrifício. O Enforcado convida a soltar o controle. A Morte transforma o que precisa acabar. A Temperança ensina equilíbrio após a perda. O Diabo revela as cadeias que criamos. A Torre destrói o que era falso. Essa é a noite escura da alma — o momento em que tudo desmorona para que algo verdadeiro possa nascer.",
    arcanoIds: [12, 13, 14, 15, 16],
    theme: "plum",
  },
  {
    id: "iluminacao",
    title: "A Iluminação",
    subtitle: "Renovação, clareza e integração",
    symbol: "☀",
    description:
      "Após a travessia, a luz retorna. A Estrela traz esperança e cura. A Lua ilumina o inconsciente com suas verdades ocultas. O Sol revela a alegria essencial de existir. O Julgamento convoca ao despertar final — ouvir o chamado da alma. E O Mundo celebra a completude: o Louco chegou ao fim do ciclo, pronto para recomeçar com sabedoria.",
    arcanoIds: [17, 18, 19, 20, 21],
    theme: "moonlight",
  },
];

/** Summary of each arcano's role in the journey */
export const JOURNEY_ARCANOS: JourneyArcanoSummary[] = [
  {
    id: 0, numeral: "0", name: "O Louco",
    journeyRole: "O início da travessia",
    narrativeText: "Tudo começa com um salto de fé. O Louco é o potencial puro antes de qualquer forma — a coragem de caminhar sem mapa. Ele carrega apenas a confiança de que o caminho se revela a quem ousa começar.",
  },
  {
    id: 1, numeral: "I", name: "O Mago",
    journeyRole: "A vontade e manifestação",
    narrativeText: "O Louco encontra seu primeiro poder: a capacidade de manifestar. O Mago ensina que os quatro elementos estão disponíveis — basta a vontade focada e a consciência desperta para transformar potencial em realidade.",
  },
  {
    id: 2, numeral: "II", name: "A Sacerdotisa",
    journeyRole: "O mistério interior",
    narrativeText: "Após a ação, o silêncio. A Sacerdotisa ensina que nem tudo se manifesta pela força — há um saber que mora no silêncio, na intuição, no que está oculto. O Louco aprende a escutar antes de agir.",
  },
  {
    id: 3, numeral: "III", name: "A Imperatriz",
    journeyRole: "A criação",
    narrativeText: "O viajante descobre a fertilidade do mundo. A Imperatriz é a mãe de todas as formas — criatividade, nutrição, beleza e abundância. Aqui, o Louco aprende que criar é um ato de amor.",
  },
  {
    id: 4, numeral: "IV", name: "O Imperador",
    journeyRole: "A estrutura",
    narrativeText: "Toda criação precisa de forma. O Imperador traz ordem, limites e responsabilidade. O Louco aprende que liberdade sem estrutura é caos — e que liderar começa por governar a si mesmo.",
  },
  {
    id: 5, numeral: "V", name: "O Hierofante",
    journeyRole: "A tradição",
    narrativeText: "O viajante encontra a tradição. O Hierofante é a ponte entre o divino e o humano — rituais, ensinamentos, valores compartilhados. O Louco aprende que pertencer a algo maior é parte do caminho.",
  },
  {
    id: 6, numeral: "VI", name: "Os Enamorados",
    journeyRole: "A escolha",
    narrativeText: "Agora o Louco precisa escolher. Os Enamorados representam o momento em que valores, desejos e caminhos se cruzam. Não é apenas sobre amor romântico — é sobre alinhar a vida com o que é verdadeiro.",
  },
  {
    id: 7, numeral: "VII", name: "O Carro",
    journeyRole: "A direção",
    narrativeText: "Com a escolha feita, o Louco precisa de força para avançar. O Carro é a vontade em movimento, a determinação de superar obstáculos. Mas a vitória exige disciplinar forças opostas dentro de si.",
  },
  {
    id: 8, numeral: "VIII", name: "A Justiça",
    journeyRole: "O equilíbrio",
    narrativeText: "Toda ação tem seu peso. A Justiça ensina que o universo responde com exatidão — e que ser justo consigo mesmo é tão importante quanto ser justo com os outros. O Louco aprende a responsabilidade kármica.",
  },
  {
    id: 9, numeral: "IX", name: "O Eremita",
    journeyRole: "A busca interna",
    narrativeText: "O viajante se recolhe. O Eremita é o momento em que o Louco precisa se afastar do mundo para encontrar sua própria luz. A lanterna ilumina apenas o próximo passo — e isso é suficiente.",
  },
  {
    id: 10, numeral: "X", name: "A Roda da Fortuna",
    journeyRole: "Os ciclos",
    narrativeText: "Nada permanece. A Roda ensina que subidas e descidas fazem parte do percurso. O Louco compreende que não controla o destino — mas pode escolher como responder a cada giro.",
  },
  {
    id: 11, numeral: "XI", name: "A Força",
    journeyRole: "O domínio interior",
    narrativeText: "Não é força bruta — é a força da alma. O Louco descobre que domar seus medos e instintos exige compaixão, não violência. A mulher que acaricia o leão ensina que o poder verdadeiro é suave.",
  },
  {
    id: 12, numeral: "XII", name: "O Enforcado",
    journeyRole: "A nova visão",
    narrativeText: "O Louco precisa parar. O Enforcado é a inversão voluntária — soltar o controle, ver o mundo de cabeça para baixo. Nessa entrega, surge uma sabedoria que a ação jamais alcançaria.",
  },
  {
    id: 13, numeral: "XIII", name: "A Morte",
    journeyRole: "A transformação",
    narrativeText: "Algo precisa morrer. A Morte não é destruição — é transformação profunda. O Louco aprende que segurar o que já passou impede o que precisa nascer. Soltar é o ato mais corajoso da jornada.",
  },
  {
    id: 14, numeral: "XIV", name: "A Temperança",
    journeyRole: "A integração",
    narrativeText: "Após a morte simbólica, vem a cura. A Temperança mistura opostos com paciência — fogo e água, consciente e inconsciente. O Louco aprende que integração exige tempo, presença e fé no processo.",
  },
  {
    id: 15, numeral: "XV", name: "O Diabo",
    journeyRole: "A sombra",
    narrativeText: "O viajante encontra suas sombras. O Diabo revela os apegos, vícios e ilusões que nos prendem — mas a verdade perturbadora é que as correntes estão frouxas. O Louco pode se libertar a qualquer momento.",
  },
  {
    id: 16, numeral: "XVI", name: "A Torre",
    journeyRole: "A ruptura",
    narrativeText: "O raio cai. A Torre destrói estruturas construídas sobre mentiras, ego ou medo. É violento, é assustador — mas é necessário. O Louco aprende que só sobre ruínas verdadeiras se constrói algo autêntico.",
  },
  {
    id: 17, numeral: "XVII", name: "A Estrela",
    journeyRole: "A cura",
    narrativeText: "Após a tempestade, a estrela brilha. A Estrela é a cura profunda, a fé restaurada, a vulnerabilidade como força. O Louco, nu e aberto, finalmente confia no fluxo da vida sem precisar de armaduras.",
  },
  {
    id: 18, numeral: "XVIII", name: "A Lua",
    journeyRole: "O inconsciente",
    narrativeText: "O caminho escurece. A Lua ilumina com luz difusa — revelando medos, ilusões e verdades que a razão esconde. O Louco precisa atravessar essa noite sem fugir, confiando na intuição como bússola.",
  },
  {
    id: 19, numeral: "XIX", name: "O Sol",
    journeyRole: "A clareza",
    narrativeText: "A luz retorna em plenitude. O Sol é a alegria inocente, a vitalidade restaurada, a clareza após a confusão. O Louco redescobre a criança interior — aquela que celebra a vida sem condições.",
  },
  {
    id: 20, numeral: "XX", name: "O Julgamento",
    journeyRole: "O chamado",
    narrativeText: "A trombeta soa. O Julgamento não é punição — é despertar. O Louco ouve o chamado de sua vocação mais profunda e decide responder. É o momento em que todas as experiências ganham sentido.",
  },
  {
    id: 21, numeral: "XXI", name: "O Mundo",
    journeyRole: "A integração",
    narrativeText: "O ciclo se completa. O Mundo é a dança da integração — o Louco que percorreu todos os estágios e agora celebra a totalidade de quem se tornou. Mas o fim é também um novo início: a espiral continua.",
  },
];

/** Closing text for the journey overview */
export const JOURNEY_CLOSING = {
  title: "O Ciclo Continua",
  body: "A Jornada do Louco não é linear — é uma espiral. Cada vez que você a percorre, descobre camadas mais profundas. Os mesmos arcanos falam coisas diferentes em momentos diferentes da vida. O Louco que chega ao Mundo não é o mesmo que saltou do precipício — e, ainda assim, carrega a mesma centelha de coragem que o fez começar.",
  invitation: "Agora é a sua vez de caminhar.",
};