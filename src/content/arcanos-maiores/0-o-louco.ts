import type { ArcanoMaiorEditorial } from "./_editorial";
import cardImage from "@/assets/arcano-0-louco.jpg";

export const O_LOUCO: ArcanoMaiorEditorial = {
  number: 0,
  name: "O Louco",
  numeral: "0",
  subtitle: "O Início da Jornada",
  slug: "o-louco",
  cardImage,
  keywords: ["Liberdade", "Coragem", "Travessia", "Impulso", "Desapego"],

  essence:
    "O Louco é o impulso puro da alma. Ele não se prende a regras ou memórias do passado. No Tarô, ele representa a coragem de ser quem você é, sem o peso do julgamento. É o primeiro passo de uma jornada que transformará sua visão de mundo.",

  symbols: [
    { name: "Penhasco", meaning: "Risco, travessia, passo sem garantia." },
    { name: "Trouxa", meaning: "Karma e experiências que carregamos sem consciência." },
    { name: "Cachorro", meaning: "Instinto protetor que acompanha o salto." },
    { name: "Sol", meaning: "Confiança cósmica e apoio do universo." },
    { name: "Montanhas", meaning: "Desafios superados ou alturas da sabedoria." },
    { name: "Gesto corporal", meaning: "Entrega total e disponibilidade para o novo." },
  ],

  archetype:
    "O Buscador, o Viajante, o Inocente Sábio — aquele que caminha sem mapa, guiado pela fé no desconhecido.",

  light:
    "Na luz, o Louco traz espontaneidade, fé, coragem e disponibilidade para viver uma nova experiência.",

  shadow:
    "Na sombra, o Louco pode virar fuga, imprudência, ingenuidade ou falta de compromisso.",

  initiationLesson:
    "A lição do Louco é aprender que a jornada importa mais do que o destino. Ele nos convida a abandonar o controle e permitir que a vida nos surpreenda. Você despertou a primeira chave: O Louco. Agora a jornada continua com O Mago, o arcano da vontade, da direção e do primeiro ato consciente.",

  love: {
    light: "Inícios emocionantes, paixão espontânea e vínculos que renascem sem roteiros antigos.",
    shadow: "Idealização excessiva, medo de compromisso real ou saltar de paixão em paixão sem aprofundar.",
  },

  work: {
    light: "Novos projetos, mudança de carreira, ideias fora da caixa e a coragem de seguir um chamado.",
    shadow: "Planos sem estrutura, riscos mal calculados ou falta de compromisso com o processo.",
  },

  spirituality: {
    light: "O buscador eterno, aberto a novas formas de conexão com o sagrado sem dogmas fixos.",
    shadow: "Dispersão espiritual, saltar de tradição em tradição como fuga da realidade material.",
  },

  voice: {
    intro: "Eu sou o Louco. O impulso antes da certeza.",
    fullText: "Você tenta decorar significados, mas trava quando precisa interpretar uma carta real? O Tarô não começa pela memória. Começa pelo olhar simbólico. Eu sou o Louco. Ensinarei você a enxergar além das palavras decoradas.",
  },

  deepDive: {
    text: "O Louco é o Arcano número 0. Ele não está no início nem no fim; está em toda parte e em lugar nenhum.",
    symbolism: "A trouxa representa o karma. O precipício não é queda: é fé.",
    cabala: "Corresponde à letra Aleph (א), o sopro primordial e a respiração da criação.",
    history: "Historicamente, o Louco era o bobo da corte que podia dizer verdades incômodas.",
  },

  reflectionQuestions: [
    { id: "louco-r1", question: "Se eu não tivesse medo, o que eu faria agora?" },
    { id: "louco-r2", question: "Que primeiro passo estou adiando por excesso de controle?" },
  ],

  quiz: [
    {
      id: "fool-pilot-1",
      type: "multiple-choice",
      question: "Quando a energia do Louco ajuda mais?",
      options: [
        "Quando é preciso planejar cada detalhe rigidamente.",
        "Quando é preciso começar mesmo sem ter todas as garantias.",
        "Quando se deve evitar qualquer tipo de risco.",
        "Quando o objetivo final já está concluído."
      ],
      correctIndex: 1,
      explanation: "Correto. O Louco é a coragem do início, mesmo diante do incerto.",
      incorrectExplanation: "Não é isso. O Louco não fala de controle rígido. Ele fala de abertura, movimento e coragem diante do desconhecido.",
    },
    {
      id: "fool-pilot-2",
      type: "multiple-choice",
      question: "Selecione a opção que melhor representa a LUZ do Louco:",
      options: [
        "Falta de compromisso com as pessoas.",
        "Espontaneidade, fé e coragem para o novo.",
        "Imprudência e riscos desnecessários.",
        "Fuga de responsabilidades reais."
      ],
      correctIndex: 1,
      explanation: "Perfeito. A luz do Louco é a disponibilidade plena para a vida.",
    },
    {
      id: "fool-pilot-3",
      type: "multiple-choice",
      question: "Uma pessoa começa vários cursos e não termina nenhum, fugindo sempre que fica difícil. Isso é:",
      options: [
        "O Louco na luz (liberdade).",
        "O Louco na sombra (fuga e falta de foco).",
        "O Mago em ação.",
        "O Eremita em busca."
      ],
      correctIndex: 1,
      explanation: "Exato. Na sombra, a energia do Louco se perde na falta de compromisso e na fuga.",
    },
    {
      id: "fool-pilot-4",
      type: "multiple-choice",
      question: "Qual o significado canônico do PENHASCO no Rider-Waite-Smith?",
      options: [
        "Um perigo mortal que deve ser evitado.",
        "O limiar entre o conhecido e o desconhecido; o risco.",
        "Um lugar seguro para descansar.",
        "O fim de toda a jornada."
      ],
      correctIndex: 1,
      explanation: "Exato. Penhasco = risco, travessia, passo sem garantia.",
    },
    {
      id: "fool-pilot-5",
      type: "multiple-choice",
      question: "Cliente pergunta: 'Ele vai me procurar?' Sai O Louco. Qual leitura é mais madura?",
      options: [
        "Sim, ele está completamente apaixonado.",
        "Existe impulso, mas falta constância. Pode haver contato inesperado, mas sem garantia de compromisso.",
        "Não existe sentimento nenhum.",
        "A relação está encerrada definitivamente."
      ],
      correctIndex: 1,
      explanation: "Correto. O Louco pode indicar movimento e contato inesperado, mas não garante estabilidade, compromisso ou continuidade.",
    }
  ],

  quickReview: [
    { keyword: "Essência", meaning: "Impulso e começo" },
    { keyword: "Luz", meaning: "Fé e coragem" },
    { keyword: "Sombra", meaning: "Fuga e imprudência" },
  ],

  symbolsMap: [
    {
      id: "penhasco",
      name: "O Penhasco",
      description: "Risco, travessia, passo sem garantia.",
      reflectionQuestion: "Qual salto de fé você precisa dar?",
      position: { x: 75, y: 85 }
    },
    {
      id: "trouxa",
      name: "A Trouxa",
      description: "Experiências e o que carregamos sem consciência.",
      reflectionQuestion: "O que você ainda carrega que não te serve?",
      position: { x: 35, y: 40 }
    },
    {
      id: "cachorro",
      name: "O Cachorro",
      description: "Instinto protetor que acompanha o salto.",
      reflectionQuestion: "Seus instintos estão te alertando ou te guiando?",
      position: { x: 65, y: 70 }
    },
    {
      id: "sol",
      name: "O Sol",
      description: "Confiança cósmica e apoio do universo.",
      reflectionQuestion: "Você confia que o universo te sustenta?",
      position: { x: 15, y: 15 }
    },
    {
      id: "montanhas",
      name: "As Montanhas",
      description: "Desafios superados ou sabedoria distante.",
      reflectionQuestion: "Quais alturas você deseja alcançar?",
      position: { x: 80, y: 35 }
    },
    {
      id: "gesto",
      name: "O Gesto Corporal",
      description: "Entrega total e disponibilidade para o novo.",
      reflectionQuestion: "Você está realmente aberta para o que vem?",
      position: { x: 45, y: 25 }
    }
  ],
};