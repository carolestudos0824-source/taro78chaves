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
    "O Louco é o impulso antes da certeza. Ele representa começo, liberdade, risco e abertura para o desconhecido.",

  symbols: [
    { name: "Penhasco", meaning: "Risco, travessia, passo sem garantia." },
    { name: "Trouxa", meaning: "Experiências e o que carregamos." },
    { name: "Cachorro", meaning: "Instinto protetor." },
    { name: "Sol", meaning: "Confiança cósmica." },
    { name: "Montanhas", meaning: "Alturas da sabedoria." },
    { name: "Gesto corporal", meaning: "Entrega total." },
  ],

  archetype:
    "O Buscador, o Inocente Sábio — aquele que caminha guiado pela fé no desconhecido.",

  light:
    "Na luz, O Louco traz espontaneidade, fé, coragem e disponibilidade para viver uma nova experiência.",

  shadow:
    "Na sombra, O Louco pode virar fuga, imprudência, ingenuidade ou falta de compromisso.",

  initiationLesson:
    "A lição do Louco é aprender que a jornada importa mais do que o destino. Ele nos convida a abandonar o controle.",

  love: {
    light: "Inícios emocionantes e paixão espontânea.",
    shadow: "Medo de compromisso real ou fuga emocional.",
  },

  work: {
    light: "Novos projetos e a coragem de seguir um chamado.",
    shadow: "Planos sem estrutura ou riscos mal calculados.",
  },

  spirituality: {
    light: "O buscador eterno, aberto ao sagrado sem dogmas fixos.",
    shadow: "Dispersão espiritual como fuga da realidade.",
  },

  voice: {
    intro: "Eu sou o Louco. O impulso antes da certeza.",
    fullText: "O que eu pediria de você neste momento? Apenas um passo de fé.",
  },

  deepDive: {
    text: "O Louco é o Arcano 0, o vazio fértil onde tudo começa.",
    symbolism: "A trouxa é o passado que não nos pesa mais.",
    cabala: "Letra Aleph (א), o sopro da vida.",
    history: "Historicamente, o bobo que diz a verdade.",
  },

  reflectionQuestions: [
    { id: "louco-r1", question: "Se eu não tivesse medo, o que eu faria agora?" },
    { id: "louco-r2", question: "Onde eu preciso de mais espontaneidade e menos controle?" },
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
      question: "Situação: Alguém abandona um projeto no meio por puro tédio, sem concluir nada. Isso é:",
      options: [
        "O Louco na luz (liberdade).",
        "O Louco na sombra (imprudência e falta de compromisso).",
        "O Louco no equilíbrio.",
        "O Mago em ação."
      ],
      correctIndex: 1,
      explanation: "Correto. Na sombra, a liberdade do Louco torna-se irresponsabilidade.",
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
      description: "Experiências e o que carregamos.",
      reflectionQuestion: "O que você ainda carrega?",
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