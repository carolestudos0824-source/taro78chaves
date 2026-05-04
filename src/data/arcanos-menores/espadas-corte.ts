/**
 * Conteúdo editorial — Cartas da Corte de Espadas
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";
import pajemImage from "@/assets/menor-espadas-pajem.jpg";
import cavaleiroImage from "@/assets/menor-espadas-cavaleiro.jpg";
import rainhaImage from "@/assets/menor-espadas-rainha.jpg";
import reiImage from "@/assets/menor-espadas-rei.jpg";

export const ESPADAS_CORTE: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // PAJEM DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-pajem",
    cardImage: pajemImage,
    subtitulo: "O Vigilante das Ideias",
    essencia: "O Pajem de Espadas é o jovem pensador — alerta, curioso, afiado. Representa a mente em estado de prontidão: ansiosa para aprender, questionar e descobrir a verdade. É o estudante que levanta a mão com a pergunta mais incômoda da sala.",

    simbolosCentrais: "Um jovem de pé num terreno acidentado segura uma espada com ambas as mãos, em postura de guarda. O vento agita suas roupas e cabelos — o Ar está em movimento. As nuvens turbulentas indicam pensamento ativo. Os pássaros ao fundo representam ideias em voo. O terreno irregular mostra que o caminho intelectual nunca é plano.",

    arquetipo: "O Questionador — o jovem que desafia o status quo com perguntas afiadas e curiosidade incansável.",

    luz: "Curiosidade intelectual, vigilância mental, mensagem importante, nova ideia, estudante promissor, comunicação direta. O Pajem de Espadas na luz é a pergunta que ninguém ousava fazer — e que muda tudo.",

    sombra: "Espionagem, fofoca, uso de informação para manipular, cinismo precoce, agressividade verbal, mente afiada sem coração. Na sombra, o Pajem usa a espada da verdade como arma, não como ferramenta.",

    licaoPratica: "A curiosidade é a forma mais gentil da espada. O Pajem de Espadas ensina que perguntar é mais poderoso que afirmar — e que a verdadeira inteligência inclui humildade para não saber.",

    interpretacaoAmor: "Notícia sobre o relacionamento, verdade que precisa ser ouvida, parceiro que questiona muito, comunicação afiada no casal. O Pajem de Espadas no amor traz a mensagem que você precisa ouvir — quer goste ou não.",

    interpretacaoTrabalho: "Pesquisa, investigação, estagiário brilhante, informação estratégica, análise detalhada. No trabalho, é a mente jovem que enxerga o que os experientes perderam.",

    interpretacaoEspiritualidade: "Questionamento de dogmas, busca intelectual pelo sagrado, discernimento espiritual, dúvida saudável. O Pajem de Espadas na espiritualidade é o aluno que pergunta 'por quê?' até o mestre sorrir.",

    vozDaCarta: "Eu não aceito respostas prontas. Cada verdade que me dão, eu testo com minha espada. Se for genuína, sobrevive ao corte. Se for falsa, cai. Não me considere arrogante — me considere curioso. A diferença é a intenção.",

    aprofundamento: `O Pajem de Espadas é a expressão mais jovem e inquieta do elemento Ar. Na tradição Rider-Waite-Smith, sua postura de guarda mostra alguém que trata o pensamento como arte marcial — sempre pronto, sempre alerta.

Na Cabala, o Pajem de Espadas representa Terra no Ar — a materialização do pensamento. É o momento em que uma ideia abstrata ganha forma concreta: a pergunta formulada, o ensaio escrito, a hipótese testada.

O vento que agita tudo ao redor é o Ar em movimento — pensamentos que não param, ideias que circulam, informação que flui. O Pajem não controla o vento — ele aprende a navegar nele. Na corte do tarô, os Pajens são mensageiros, e o Pajem de Espadas traz mensagens mentais: notícias, informações, verdades inconvenientes.`,

    perguntasReflexao: [
      "Você está usando sua inteligência para buscar verdade ou para provar que está certo?",
      "Existe uma pergunta incômoda que você precisa fazer — a si mesmo ou a alguém?",
      "Como você recebe informações desconfortáveis — com abertura ou com defesa?",
    ],

    quiz: [
      {
        id: "espadas-pajem-q1",
        question: "O que o vento agitando as roupas do Pajem representa?",
        options: ["Tempestade", "O Ar/pensamento em constante movimento", "Frio", "Perigo"],
        correctIndex: 1,
        explanation: "O vento é o Ar — pensamentos ativos, ideias circulando, mente em movimento.",
      },
      {
        id: "espadas-pajem-q2",
        question: "Na Cabala, o Pajem de Espadas representa:",
        options: ["Fogo no Ar", "Terra no Ar", "Água no Ar", "Ar no Ar"],
        correctIndex: 1,
        explanation: "É Terra no Ar — a materialização do pensamento em forma concreta.",
      },
      {
        id: "espadas-pajem-q3",
        question: "Qual é o arquétipo do Pajem de Espadas?",
        options: ["O Guerreiro", "O Questionador", "O Sábio", "O Rei"],
        correctIndex: 1,
        explanation: "O Questionador desafia o status quo com perguntas afiadas e curiosidade.",
      },
      {
        id: "espadas-pajem-q4",
        question: "Na sombra, o Pajem de Espadas pode indicar:",
        options: ["Sabedoria", "Fofoca e uso de informação para manipular", "Amor", "Paz"],
        correctIndex: 1,
        explanation: "Na sombra, a inteligência vira arma — fofoca, espionagem, cinismo.",
      },
      {
        id: "espadas-pajem-q5",
        question: "A lição central do Pajem de Espadas é:",
        options: ["Nunca perguntar", "Perguntar é mais poderoso que afirmar", "Aceitar tudo", "Sempre criticar"],
        correctIndex: 1,
        explanation: "A curiosidade é a forma mais gentil da espada — perguntar com humildade.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Curiosidade",
      luz: "Mente alerta e perguntas que mudam tudo",
      sombra: "Fofoca e inteligência usada como arma",
      licaoCentral: "Perguntar é mais poderoso que afirmar",
      aplicacaoPratica: "Faça uma pergunta incômoda que você anda evitando",
      fraseFixacao: "A espada do questionador corta ilusões — não pessoas",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CAVALEIRO DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-cavaleiro",
    cardImage: cavaleiroImage,
    subtitulo: "O Cavaleiro da Tempestade",
    essencia: "O Cavaleiro de Espadas é a mente em modo de ataque — rápido, decidido, imparável. Representa a ação intelectual em sua forma mais intensa: a decisão tomada e executada sem hesitação. Pode ser brilhante ou destrutivo, dependendo de para onde aponta a espada.",

    simbolosCentrais: "Um cavaleiro galopa a toda velocidade empunhando uma espada alta, cortando o vento. As nuvens rasgadas indicam velocidade extrema. Pássaros e árvores curvadas pelo vento reforçam a energia do Ar em fúria. O cavalo branco está em galope total — não há freio, não há pausa. As borboletas e pássaros na sela e armadura evocam a mente alada.",

    arquetipo: "O Guerreiro Intelectual — aquele que ataca com ideias, palavras e decisões mais rápidas que qualquer espada física.",

    luz: "Decisão rápida, coragem intelectual, ação direta, comunicação assertiva, defesa da verdade, velocidade mental. O Cavaleiro de Espadas na luz é o cirurgião: corta com precisão para salvar.",

    sombra: "Imprudência mental, agressão verbal, decisões precipitadas, crueldade intelectual, incapacidade de parar e ouvir. Na sombra, o Cavaleiro é um míssil sem sistema de freio.",

    licaoPratica: "A velocidade do pensamento é uma arma — e como toda arma, precisa de mira. O Cavaleiro de Espadas ensina que agir rápido é diferente de agir certo, e que a decisão mais corajosa às vezes é desacelerar.",

    interpretacaoAmor: "Declaração direta, confronto necessário, parceiro que age antes de pensar, relação que se move rápido demais. O Cavaleiro de Espadas no amor corta os rodeios — mas pode cortar também os sentimentos.",

    interpretacaoTrabalho: "Decisão rápida no trabalho, deadline apertado, comunicação assertiva, projeto que exige ação imediata. No trabalho, é o momento de parar de deliberar e agir.",

    interpretacaoEspiritualidade: "Corte de ilusões espirituais, decisão radical sobre o caminho, desapego intelectual acelerado. O Cavaleiro de Espadas na espiritualidade é o koan que corta todas as respostas prontas.",

    vozDaCarta: "Eu não tenho tempo para dúvidas. A espada está alta, o cavalo galopa e o vento está comigo. Sei que posso errar — mas prefiro errar em movimento a acertar parado. Se você quer gentileza, procure Copas. Se quer verdade rápida, eu sou seu cavaleiro.",

    aprofundamento: `O Cavaleiro de Espadas é o mais veloz e agressivo de toda a corte do tarô. Na tradição Rider-Waite-Smith, tudo na imagem grita velocidade: nuvens rasgadas, árvores curvadas, cavalo em galope máximo.

Na Cabala, o Cavaleiro de Espadas representa Fogo no Ar — a ação que inflama o pensamento. É a decisão que se torna ação antes mesmo de terminar de ser formulada. Na astrologia, está associado a Gêmeos e Aquário — signos de velocidade mental e ideias revolucionárias.

Historicamente, o cavaleiro com espada erguida é o símbolo da carga de cavalaria — o momento de máximo comprometimento. Uma vez lançada, não pode ser interrompida. O Cavaleiro de Espadas carrega essa energia: total, irreversível, inevitável.

O perigo é real: velocidade sem direção é catástrofe. A mesma energia que torna o Cavaleiro brilhante pode torná-lo destrutivo. A sabedoria está em saber quando galopar e quando parar — e o Cavaleiro raramente sabe parar.`,

    perguntasReflexao: [
      "Você tende a agir rápido demais nas decisões importantes — e se arrepende depois?",
      "Como você equilibra assertividade com sensibilidade na comunicação?",
      "Existe uma situação onde seria mais sábio desacelerar em vez de atacar?",
    ],

    quiz: [
      {
        id: "espadas-cavaleiro-q1",
        question: "O que as nuvens rasgadas na imagem indicam?",
        options: ["Tempestade", "Velocidade extrema do pensamento em ação", "Fim do mundo", "Chuva"],
        correctIndex: 1,
        explanation: "Nuvens rasgadas = velocidade máxima — o Cavaleiro corta o próprio ar ao passar.",
      },
      {
        id: "espadas-cavaleiro-q2",
        question: "Na Cabala, o Cavaleiro de Espadas representa:",
        options: ["Terra no Ar", "Fogo no Ar", "Água no Ar", "Ar no Ar"],
        correctIndex: 1,
        explanation: "É Fogo no Ar — ação inflamando o pensamento, decisão imediata.",
      },
      {
        id: "espadas-cavaleiro-q3",
        question: "Qual é o arquétipo do Cavaleiro de Espadas?",
        options: ["O Diplomata", "O Guerreiro Intelectual", "O Monge", "O Amante"],
        correctIndex: 1,
        explanation: "O Guerreiro Intelectual ataca com ideias e decisões mais rápidas que espadas.",
      },
      {
        id: "espadas-cavaleiro-q4",
        question: "Na sombra, o Cavaleiro de Espadas pode ser comparado a:",
        options: ["Um rio calmo", "Um míssil sem sistema de freio", "Um lago", "Uma montanha"],
        correctIndex: 1,
        explanation: "Na sombra, a velocidade sem direção se torna destrutiva — impossível de parar.",
      },
      {
        id: "espadas-cavaleiro-q5",
        question: "A lição central do Cavaleiro de Espadas é:",
        options: ["Sempre atacar", "Agir rápido é diferente de agir certo", "Nunca pensar", "Ser violento"],
        correctIndex: 1,
        explanation: "Velocidade mental é poder, mas precisa de direção — a decisão mais corajosa pode ser desacelerar.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Velocidade",
      luz: "Decisão rápida e coragem intelectual",
      sombra: "Imprudência e agressão verbal",
      licaoCentral: "Agir rápido é diferente de agir certo",
      aplicacaoPratica: "Antes da próxima decisão impulsiva, conte até dez e confirme a mira",
      fraseFixacao: "A espada está alta e o cavalo galopa — mas para onde?",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // RAINHA DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-rainha",
    cardImage: rainhaImage,
    subtitulo: "A Rainha da Lucidez",
...
  {
    id: "espadas-rei",
    cardImage: reiImage,
    subtitulo: "O Soberano da Razão",
    essencia: "O Rei de Espadas é a autoridade intelectual suprema — a mente que governa com lógica, clareza e imparcialidade. Representa o pensamento em sua forma mais madura: aquele que decide não pelo coração, não pelo impulso, mas pela verdade objetiva e pela justiça.",

    simbolosCentrais: "Um rei sentado num trono alto segura uma espada ligeiramente inclinada para a direita — indicando que seu julgamento, embora justo, não é rigidamente inflexível. O trono é decorado com borboletas e um anjo, símbolo de visão superior. As nuvens ao fundo são claras — a mente está limpa. Dois pássaros voam no céu — pensamentos livres e elevados.",

    arquetipo: "O Juiz Supremo — aquele cujo veredicto é temido e respeitado porque é sempre fundamentado em verdade.",

    luz: "Autoridade intelectual, julgamento justo, liderança racional, clareza absoluta, comunicação magistral, ética inabalável. O Rei de Espadas na luz é o juiz que todos respeitam — porque sua sentença é justa.",

    sombra: "Tirania intelectual, frieza calculada, manipulação pela lógica, autoritarismo, incapacidade de considerar emoções, veredictos sem misericórdia. Na sombra, o Rei governa pela razão mas esqueceu que governa pessoas.",

    licaoPratica: "A razão sem coração é tirania elegante. O Rei de Espadas ensina que a maior inteligência não é ter todas as respostas — é saber que a lógica sozinha é insuficiente para governar a vida.",

    interpretacaoAmor: "Parceiro racional e estruturado, relação baseada em respeito intelectual, homem que ama com a mente antes do coração. O Rei de Espadas no amor é estável e confiável — mas pode parecer frio.",

    interpretacaoTrabalho: "Juiz, advogado, CEO analítico, consultor estratégico, líder que toma decisões impopulares mas corretas. No trabalho, é a autoridade que ninguém questiona — porque tem razão.",

    interpretacaoEspiritualidade: "Mestre do discernimento, filósofo, intelectual espiritual, sabedoria que integra mente e espírito. O Rei de Espadas na espiritualidade é o mestre que ensina pelo raciocínio, não pelo dogma.",

    vozDaCarta: "Eu não julgo por emoção. Não julgo por conveniência. Julgo porque a verdade exige um trono — e alguém precisa sentar nele. Minha espada está ligeiramente inclinada porque sei que até a justiça precisa de flexibilidade. Mas a verdade? A verdade é vertical.",

    aprofundamento: `O Rei de Espadas é a expressão mais madura e integrada do elemento Ar. Na tradição Rider-Waite-Smith, é frequentemente considerado a carta mais intelectualmente poderosa do tarô — a mente que domina sem ser dominada.

A espada ligeiramente inclinada é um detalhe crucial: diferente do Ás (vertical/absoluto) ou do Cavaleiro (alto/agressivo), a inclinação do Rei indica que sua justiça é fundamentada mas flexível. Ele sabe que a verdade tem nuances.

Na Cabala, o Rei de Espadas representa Ar no Ar — a quintessência do pensamento. É a mente que pensa sobre o pensamento, a consciência que observa a si mesma. Na astrologia, está associado a Libra e Aquário — justiça e visão humanitária.

Na tradição dos arcanos da corte, o Rei é quem integrou todos os estágios: a curiosidade do Pajem, a velocidade do Cavaleiro, o discernimento da Rainha. O Rei não apenas pensa — ele governa pelo pensamento. Sua sabedoria está em saber que a lógica pura, sem temperança humana, é tirania. Por isso sua espada está inclinada: a verdade é absoluta, mas a aplicação da verdade requer sabedoria.`,

    perguntasReflexao: [
      "Suas decisões mais importantes são guiadas pela razão, pela emoção, ou pelo equilíbrio entre ambos?",
      "Existe alguma área da sua vida onde a lógica pura está prejudicando seus relacionamentos?",
      "Como você equilibra autoridade intelectual com empatia humana?",
    ],

    quiz: [
      {
        id: "espadas-rei-q1",
        question: "O que a espada ligeiramente inclinada do Rei indica?",
        options: ["Fraqueza", "Justiça fundamentada mas flexível", "Erro", "Desequilíbrio"],
        correctIndex: 1,
        explanation: "A inclinação mostra que a verdade tem nuances — justiça com sabedoria.",
      },
      {
        id: "espadas-rei-q2",
        question: "Na Cabala, o Rei de Espadas representa:",
        options: ["Fogo no Ar", "Ar no Ar", "Água no Ar", "Terra no Ar"],
        correctIndex: 1,
        explanation: "É Ar no Ar — a quintessência do pensamento, mente que pensa sobre pensamento.",
      },
      {
        id: "espadas-rei-q3",
        question: "Qual é o arquétipo do Rei de Espadas?",
        options: ["O Guerreiro", "O Juiz Supremo", "O Amante", "O Louco"],
        correctIndex: 1,
        explanation: "O Juiz Supremo — veredicto temido e respeitado porque é fundamentado.",
      },
      {
        id: "espadas-rei-q4",
        question: "Na sombra, o Rei de Espadas pode indicar:",
        options: ["Estupidez", "Tirania intelectual e frieza calculada", "Preguiça", "Fantasia"],
        correctIndex: 1,
        explanation: "Na sombra, governa pela razão mas esquece que governa pessoas — tirania elegante.",
      },
      {
        id: "espadas-rei-q5",
        question: "A lição central do Rei de Espadas é:",
        options: ["A lógica resolve tudo", "A razão sem coração é tirania — a lógica sozinha é insuficiente", "Nunca usar a razão", "Ignorar a verdade"],
        correctIndex: 1,
        explanation: "A maior inteligência sabe que a lógica sozinha é insuficiente para governar a vida.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Autoridade",
      luz: "Julgamento justo e liderança racional",
      sombra: "Tirania intelectual e frieza calculada",
      licaoCentral: "A razão sem coração é tirania elegante",
      aplicacaoPratica: "Na próxima decisão importante, inclua tanto a lógica quanto a empatia",
      fraseFixacao: "A espada está inclinada — porque até a verdade precisa de sabedoria",
    },
  },
];
