/**
 * Conteúdo editorial — Cartas da Corte de Copas
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";
import pajemImage from "@/assets/menor-copas-pajem.jpg";
import cavaleiroImage from "@/assets/menor-copas-cavaleiro.jpg";
import rainhaImage from "@/assets/menor-copas-rainha.jpg";
import reiImage from "@/assets/menor-copas-rei.jpg";

export const COPAS_CORTE: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // PAJEM DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-pajem",
    cardImage: pajemImage,
    subtitulo: "O Mensageiro do Coração",
    essencia: "O Pajem de Copas é o jovem mensageiro emocional — aquele que traz notícias do coração com olhos curiosos e mãos delicadas. Representa o início da maturidade afetiva: a primeira vez que se olha para dentro com seriedade e se descobre capaz de sentir com profundidade.",

    simbolosCentrais: "Um jovem elegante segura um cálice com um peixe emergindo — a mensagem que vem do inconsciente. O chapéu e a túnica florida indicam sensibilidade artística. O mar ao fundo representa a vastidão emocional que o Pajem começa a explorar. Sua postura contemplativa mostra que ele observa o sentimento antes de agir sobre ele.",

    arquetipo: "O Aprendiz do Coração — o jovem que começa a aprender a linguagem dos sentimentos com curiosidade genuína e sem cinismo.",

    luz: "Intuição nascente, mensagem emocional, proposta criativa, sensibilidade artística, nova amizade, fascínio romântico, curiosidade emocional. O Pajem de Copas na luz é o coração que descobre que pode sentir mais do que imaginava.",

    sombra: "Emocionalidade imatura, devaneio excessivo, sedução ingênua, mensagem não entregue, medo de expressar sentimentos, manipulação emocional inconsciente. Na sombra, o Pajem segura o cálice mas nunca o oferece.",

    licaoPratica: "Toda maestria emocional começa com um primeiro olhar honesto para dentro. O Pajem de Copas ensina que não é preciso ter experiência para ter profundidade — basta ter coragem de olhar o que o cálice revela.",

    interpretacaoAmor: "Declaração de interesse, bilhete de amor, crush que se revela, início de romance tímido mas sincero. O Pajem de Copas no amor é aquela mensagem que muda tudo — se for lida com o coração aberto.",

    interpretacaoTrabalho: "Oportunidade criativa inesperada, convite para projeto artístico, feedback emocional positivo, estudante ou estagiário sensível. No trabalho, é a ideia que nasce da intuição, não da planilha.",

    interpretacaoEspiritualidade: "Primeiro despertar intuitivo, sonhos significativos, sincronicidades como mensagens, início de estudo de tarô ou astrologia. O Pajem de Copas na espiritualidade é o universo sussurrando pela primeira vez.",

    vozDaCarta: "Eu trago uma mensagem — mas não está escrita em palavras. Está no peixe que salta do cálice, no sonho que você anotou de manhã, na intuição que você quase ignorou. Preste atenção. Nem toda verdade vem pela razão.",

    aprofundamento: `O Pajem de Copas ocupa um lugar especial na corte do tarô: é o mensageiro do elemento Água, o que traz notícias do mundo inconsciente para a consciência. Na tradição Rider-Waite-Smith, o peixe que emerge do cálice é o símbolo-chave — representa a mensagem que vem das profundezas.

Na psicologia junguiana, o Pajem de Copas representa o primeiro contato com a anima (para homens) ou com a profundidade emocional (para mulheres). É a descoberta de que existe um mundo interior tão vasto quanto o exterior.

Como carta da corte, o Pajem pode representar uma pessoa jovem, sensível e intuitiva na vida do consulente — ou um aspecto imaturo mas promissor da própria personalidade. Na Cabala, as cartas da corte de Copas estão associadas ao mundo de Briah (Criação), e o Pajem especificamente representa o elemento Terra dentro da Água — a materialização dos sentimentos, o momento em que uma emoção ganha forma e pode ser comunicada.

Na tradição medieval, os pajens eram os mensageiros da corte — e no tarô, o Pajem de Copas traz mensagens emocionais: cartas de amor, convites, revelações intuitivas, sonhos premonitórios.`,

    perguntasReflexao: [
      "Existe alguma intuição recente que você ignorou e que merecia atenção?",
      "Se o universo quisesse te enviar uma mensagem emocional hoje, como ela chegaria?",
      "O que aconteceria se você expressasse um sentimento que anda guardando?",
    ],

    quiz: [
      {
        id: "copas-pajem-q1",
        question: "O que o peixe emergindo do cálice simboliza?",
        options: ["Prosperidade", "Mensagem do inconsciente", "Alimento", "Sorte"],
        correctIndex: 1,
        explanation: "O peixe é a mensagem que vem das profundezas emocionais para a consciência.",
      },
      {
        id: "copas-pajem-q2",
        question: "Qual é o arquétipo do Pajem de Copas?",
        options: ["O Guerreiro", "O Aprendiz do Coração", "O Sábio", "O Amante"],
        correctIndex: 1,
        explanation: "É o Aprendiz do Coração — quem começa a aprender a linguagem dos sentimentos.",
      },
      {
        id: "copas-pajem-q3",
        question: "Na Cabala, o Pajem de Copas representa qual combinação?",
        options: ["Fogo na Água", "Terra na Água", "Ar na Água", "Água na Água"],
        correctIndex: 1,
        explanation: "O Pajem representa Terra dentro de Água — a materialização dos sentimentos.",
      },
      {
        id: "copas-pajem-q4",
        question: "Na sombra, o Pajem de Copas pode indicar:",
        options: ["Violência", "Emocionalidade imatura e sentimentos não expressos", "Ganância", "Preguiça"],
        correctIndex: 1,
        explanation: "Na sombra, o Pajem segura o cálice mas não consegue entregar a mensagem.",
      },
      {
        id: "copas-pajem-q5",
        question: "No amor, o Pajem de Copas tipicamente indica:",
        options: ["Separação", "Declaração ou início de romance tímido", "Casamento", "Traição"],
        correctIndex: 1,
        explanation: "O Pajem traz mensagens de interesse romântico — tímidas mas sinceras.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Mensagem",
      luz: "Intuição nascente e curiosidade emocional",
      sombra: "Emocionalidade imatura e sentimentos reprimidos",
      licaoCentral: "Toda maestria emocional começa com um primeiro olhar honesto",
      aplicacaoPratica: "Anote um sonho ou intuição recente e reflita sobre sua mensagem",
      fraseFixacao: "O peixe salta do cálice — a mensagem já está aí, basta olhar",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CAVALEIRO DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-cavaleiro",
    cardImage: cavaleiroImage,
    subtitulo: "O Cavaleiro do Romance",
    essencia: "O Cavaleiro de Copas é o idealista em movimento — o coração que cavalga em direção ao amor sem medo de parecer excessivo. Representa a ação movida pelo sentimento: a proposta, a declaração, a criação artística que nasce da paixão.",

    simbolosCentrais: "Um cavaleiro em armadura decorada cavalga um cavalo branco em passo lento, segurando um cálice à sua frente como uma oferenda. As asas em seu elmo e botas evocam Hermes/Mercúrio — o mensageiro divino. O rio ao fundo flui calmamente, diferente dos cavaleiros de outros naipes que galopam em urgência. O passo lento é deliberado: o amor não tem pressa.",

    arquetipo: "O Trovador — o amante que transforma sentimento em ação, o artista que faz do coração sua espada.",

    luz: "Proposta romântica, ação movida pelo coração, criatividade em movimento, charme, cavalaria emocional, coragem de amar abertamente. O Cavaleiro de Copas na luz é o amor que chega montado em cavalo branco — literalmente.",

    sombra: "Idealismo cego, promessas vazias, sedução sem compromisso, ciúmes, melodrama, amor performático, Don Juan emocional. Na sombra, o Cavaleiro cavalga de amor em amor sem jamais parar.",

    licaoPratica: "Amar é um verbo. O Cavaleiro de Copas ensina que o sentimento sem ação é apenas devaneio — mas a ação sem sentimento é manipulação. O caminho é o meio: mover-se pelo coração, com os olhos abertos.",

    interpretacaoAmor: "Chegada de um parceiro romântico, proposta de casamento, gesto grandioso de amor, reconciliação apaixonada. O Cavaleiro de Copas no amor é a resposta para quem perguntou: alguém virá? Sim, e com um cálice na mão.",

    interpretacaoTrabalho: "Proposta criativa, convite profissional motivado por afinidade, trabalho que exige paixão e sensibilidade. No trabalho, é o projeto que só dá certo se for feito com amor.",

    interpretacaoEspiritualidade: "Devoção ativa, busca espiritual movida por amor (não por medo), peregrinação do coração, arte como caminho sagrado. O Cavaleiro de Copas na espiritualidade é o devoto que ama o divino como se ama uma pessoa.",

    vozDaCarta: "Eu não cavalgo rápido — cavalgo com propósito. Cada passo do meu cavalo é uma escolha de me aproximar de você. Este cálice que carrego não é para mim — é minha oferenda. Aceite ou não, eu já fiz minha parte: eu vim.",

    aprofundamento: `O Cavaleiro de Copas é frequentemente chamado de "o cavaleiro do romance" e na tradição divinatória, costuma representar a chegada de um amante ou uma proposta emocional. Mas seu significado é mais amplo: é qualquer ação movida pelo coração.

As asas no elmo e nos sapatos são uma referência direta a Hermes — o mensageiro dos deuses. O Cavaleiro não apenas sente: ele leva o sentimento de um lugar a outro, transforma emoção em ação, desejo em declaração.

O cavalo branco em passo lento é significativo. Enquanto o Cavaleiro de Espadas galopa em fúria e o de Paus em urgência, o de Copas caminha com graça. O amor verdadeiro não tem pressa — ele chega quando está pronto.

Na Cabala, o Cavaleiro de Copas representa o elemento Fogo dentro da Água — a paixão que aquece o sentimento, a ação que move a emoção. É o equilíbrio entre sentir e fazer, entre o coração passivo e o coração que se oferece.

Na tradição cortês medieval, o cavaleiro trovador era aquele que dedicava sua vida ao amor — não ao amor consumado, mas ao amor como ideal. O Cavaleiro de Copas carrega essa herança: é o amor como arte, como missão, como modo de vida.`,

    perguntasReflexao: [
      "Existe um sentimento que você precisa transformar em ação concreta?",
      "Você tende mais a sentir sem agir ou agir sem sentir?",
      "Se o amor fosse uma missão, qual seria a sua neste momento?",
    ],

    quiz: [
      {
        id: "copas-cavaleiro-q1",
        question: "O que as asas no elmo do Cavaleiro evocam?",
        options: ["Anjos", "Hermes/Mercúrio, o mensageiro divino", "Pássaros", "Velocidade"],
        correctIndex: 1,
        explanation: "As asas referem Hermes — o Cavaleiro é um mensageiro do coração.",
      },
      {
        id: "copas-cavaleiro-q2",
        question: "Por que o cavalo anda em passo lento?",
        options: ["Está cansado", "O amor verdadeiro não tem pressa", "Está ferido", "O cavaleiro tem medo"],
        correctIndex: 1,
        explanation: "O passo lento é deliberado — diferente de outros cavaleiros, o amor chega quando está pronto.",
      },
      {
        id: "copas-cavaleiro-q3",
        question: "Na Cabala, o Cavaleiro de Copas representa:",
        options: ["Água na Água", "Fogo na Água", "Ar na Água", "Terra na Água"],
        correctIndex: 1,
        explanation: "É Fogo dentro de Água — a paixão que move o sentimento à ação.",
      },
      {
        id: "copas-cavaleiro-q4",
        question: "Qual é o arquétipo do Cavaleiro de Copas?",
        options: ["O Guerreiro", "O Trovador", "O Rei", "O Eremita"],
        correctIndex: 1,
        explanation: "O Trovador transforma sentimento em ação — faz do coração sua espada.",
      },
      {
        id: "copas-cavaleiro-q5",
        question: "Na sombra, o Cavaleiro de Copas pode representar:",
        options: ["Violência", "Sedução sem compromisso e idealismo cego", "Solidão", "Pobreza"],
        correctIndex: 1,
        explanation: "Na sombra, cavalga de amor em amor sem compromisso — o Don Juan emocional.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Romance",
      luz: "Ação movida pelo coração, proposta amorosa",
      sombra: "Idealismo cego e promessas vazias",
      licaoCentral: "Sentimento sem ação é devaneio; ação sem sentimento é manipulação",
      aplicacaoPratica: "Transforme um sentimento guardado em gesto concreto hoje",
      fraseFixacao: "O cavaleiro não cavalga rápido — cavalga com propósito",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // RAINHA DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-rainha",
    cardImage: rainhaImage,
    subtitulo: "A Rainha das Profundezas",
    essencia: "A Rainha de Copas é a mestra das emoções — aquela que sente tudo sem se afogar em nada. Representa a inteligência emocional em sua forma mais elevada: a capacidade de acolher, compreender e transformar qualquer sentimento em sabedoria.",

    simbolosCentrais: "Uma rainha sentada num trono na beira do mar, segurando um cálice ornamentado e fechado — seus sentimentos são profundos mas protegidos. O trono é decorado com sereias e conchas, símbolos do inconsciente marítimo. Seus pés tocam a água — está conectada às emoções sem ser submergida. O cálice fechado, diferente de todos os outros no tarô, indica que ela não revela tudo o que sente.",

    arquetipo: "A Mãe d'Água — a sabedoria feminina que compreende o oceano emocional porque habita suas profundezas sem medo.",

    luz: "Inteligência emocional, empatia profunda, intuição certeira, acolhimento incondicional, cura emocional, criatividade nutrida pelo sentimento. A Rainha de Copas na luz é a mulher que você procura quando o mundo desmorona — porque ela sabe segurar sem prender.",

    sombra: "Codependência, absorção emocional dos outros, manipulação através da empatia, mártir emocional, intuição distorcida pelo medo, fronteiras emocionais inexistentes. Na sombra, a Rainha se afoga no mar que deveria governar.",

    licaoPratica: "Sentir pelos outros não significa carregar a dor deles. A Rainha de Copas ensina que a verdadeira empatia inclui limites — e que cuidar de si não é egoísmo, é a base de todo cuidado genuíno.",

    interpretacaoAmor: "Amor maduro e profundo, parceira emocionalmente inteligente, relação baseada em compreensão mútua, mulher que ama com sabedoria. A Rainha de Copas no amor é o ideal realizado: amor sem drama, profundidade sem afogamento.",

    interpretacaoTrabalho: "Liderança empática, ambiente de trabalho emocionalmente saudável, profissional da área de cuidado, terapeuta, conselheira. No trabalho, é a líder que as pessoas seguem não por medo, mas por confiança.",

    interpretacaoEspiritualidade: "Mediunidade desenvolvida, conexão com o divino feminino, sabedoria do inconsciente, cura pelas águas, trabalho com sonhos lúcidos. A Rainha de Copas na espiritualidade é a sacerdotisa das emoções.",

    vozDaCarta: "Eu sinto tudo — mas escolho o que me define. Meu cálice está fechado não por medo, mas por sabedoria. Nem toda emoção precisa ser exibida para ser honrada. Venha até a beira do mar comigo. Vou te ensinar a nadar nas suas próprias profundezas.",

    aprofundamento: `A Rainha de Copas é considerada a carta mais intuitiva e emocionalmente sofisticada de todo o tarô. Na tradição Rider-Waite-Smith, é a única figura que segura um cálice completamente fechado — seus sentimentos são protegidos, não por repressão, mas por maestria.

As sereias no trono conectam a Rainha ao arquétipo da Mãe d'Água — presente em tradições de todo o mundo, de Yemanjá a Melusina. É a sabedoria que vem das profundezas, a intuição que fala através dos sonhos e da empatia.

Na Cabala, a Rainha de Copas representa o elemento Água dentro da Água — a quintessência do mundo emocional. É Briah em estado puro: criação, gestação, nutrição. Na astrologia, é frequentemente associada ao signo de Câncer ou Peixes — os signos mais empáticos e intuitivos.

Historicamente, as Rainhas do tarô representam a energia receptiva e nutriente de cada naipe. A Rainha de Copas é a receptividade emocional em seu ápice — ela não apenas recebe sentimentos, ela os compreende, metaboliza e transforma.

O perigo da Rainha de Copas é a absorção: sentir tanto que se perde no sentimento alheio. Por isso seu cálice é fechado — ela aprendeu que a verdadeira empatia requer fronteiras. Amar todos sem se perder em ninguém.`,

    perguntasReflexao: [
      "Você consegue sentir empatia pelos outros sem absorver a dor deles?",
      "Existe diferença entre cuidar e se sacrificar na sua forma de amar?",
      "Como você protege sua energia emocional sem se fechar para o mundo?",
    ],

    quiz: [
      {
        id: "copas-rainha-q1",
        question: "O que o cálice fechado da Rainha simboliza?",
        options: ["Segredo", "Sentimentos protegidos por sabedoria, não por medo", "Raiva contida", "Vazio emocional"],
        correctIndex: 1,
        explanation: "O cálice fechado indica maestria emocional — proteção consciente, não repressão.",
      },
      {
        id: "copas-rainha-q2",
        question: "Qual é o arquétipo da Rainha de Copas?",
        options: ["A Guerreira", "A Mãe d'Água", "A Virgem", "A Feiticeira"],
        correctIndex: 1,
        explanation: "A Mãe d'Água habita as profundezas emocionais sem medo — sabedoria feminina ancestral.",
      },
      {
        id: "copas-rainha-q3",
        question: "Na Cabala, a Rainha de Copas representa:",
        options: ["Fogo na Água", "Água na Água", "Terra na Água", "Ar na Água"],
        correctIndex: 1,
        explanation: "É Água dentro de Água — a quintessência do mundo emocional.",
      },
      {
        id: "copas-rainha-q4",
        question: "Na sombra, a Rainha de Copas pode indicar:",
        options: ["Frieza emocional", "Codependência e absorção emocional", "Violência", "Avareza"],
        correctIndex: 1,
        explanation: "Na sombra, a Rainha se afoga no mar emocional — absorvendo a dor dos outros.",
      },
      {
        id: "copas-rainha-q5",
        question: "O que as sereias no trono representam?",
        options: ["Perigo", "Conexão com o inconsciente marítimo e o divino feminino", "Luxúria", "Vaidade"],
        correctIndex: 1,
        explanation: "As sereias conectam a Rainha ao arquétipo da sabedoria das profundezas.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Empatia",
      luz: "Inteligência emocional e acolhimento profundo",
      sombra: "Codependência e perda de si no sentimento alheio",
      licaoCentral: "Verdadeira empatia inclui limites",
      aplicacaoPratica: "Identifique uma emoção alheia que você carrega e devolva-a com amor",
      fraseFixacao: "O cálice fechado não esconde — protege o que é sagrado",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // REI DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-rei",
    subtitulo: "O Soberano das Águas",
    essencia: "O Rei de Copas é o mestre das emoções que governa sem ser governado por elas. Representa a maturidade emocional masculina em sua forma mais elevada: sentir profundamente e agir com sabedoria, liderar com compaixão e decidir com o coração equilibrado.",

    simbolosCentrais: "Um rei sentado num trono que flutua sobre águas agitadas, segurando um cálice na mão direita e um cetro curto na esquerda. O amuleto de peixe em seu pescoço conecta-o ao inconsciente. As águas são turbulentas, mas ele está estável — domina o mar sem negá-lo. Um navio ao fundo navega com segurança, e um golfinho salta à direita — a inteligência emocional em ação.",

    arquetipo: "O Rei-Terapeuta — o líder que governa pelo coração, não pela força. O homem que aprendeu que vulnerabilidade é poder.",

    luz: "Liderança compassiva, maturidade emocional, conselheiro sábio, equilíbrio entre razão e sentimento, diplomacia, generosidade de espírito. O Rei de Copas na luz é o pai, o terapeuta, o líder que todos merecem.",

    sombra: "Repressão emocional mascarada de controle, manipulação sutil, alcoolismo ou vícios emocionais, frieza travestida de equilíbrio, abuso de poder emocional. Na sombra, o Rei controla o mar mas esqueceu como nadar.",

    licaoPratica: "Governar as emoções não é suprimi-las — é dar-lhes direção. O Rei de Copas ensina que a verdadeira autoridade emocional nasce de quem já se afogou e aprendeu a nadar, não de quem nunca entrou na água.",

    interpretacaoAmor: "Parceiro emocionalmente maduro, amor estável e profundo, homem que sabe cuidar, relacionamento governado pela sabedoria do coração. O Rei de Copas no amor é a segurança que permite vulnerabilidade.",

    interpretacaoTrabalho: "Líder empático, mediador de conflitos, profissional da saúde mental, gestor que inspira confiança. No trabalho, é o chefe que você respeita porque ele te respeita — e te compreende.",

    interpretacaoEspiritualidade: "Mestre espiritual compassivo, sabedoria emocional como caminho de iluminação, equilíbrio entre devoção e discernimento. O Rei de Copas na espiritualidade é o mestre que ensina pelo exemplo do coração.",

    vozDaCarta: "Eu navego as tempestades que você teme — não porque não as sinto, mas porque aprendi que o mar não se acalma lutando contra ele. Sente-se ao meu lado. Deixe a água agitar-se. Você não precisa controlar a onda — precisa aprender a surfá-la.",

    aprofundamento: `O Rei de Copas é a figura mais emocionalmente madura do tarô. Na tradição Rider-Waite-Smith, é o único Rei cujo trono flutua sobre água — ele não domina o mar à distância como os outros Reis dominam seus elementos. Ele está dentro dele.

O contraste entre as águas agitadas e a postura serena do Rei é o ensinamento central: maturidade emocional não é ausência de tempestade, é estabilidade dentro dela. O cetro curto na mão esquerda (receptiva) indica que seu poder não é impositivo — é natural.

Na Cabala, o Rei de Copas representa o elemento Ar dentro da Água — o pensamento que organiza as emoções, a mente que dá estrutura ao coração sem sufocá-lo. É a inteligência emocional em seu ápice.

Na astrologia, é frequentemente associado a Escorpião ou Peixes — signos que conhecem as profundezas emocionais e aprenderam a navegá-las. O amuleto de peixe em seu pescoço confirma essa conexão com as profundezas.

Na tradição alquímica, o Rei de Copas representa o estágio da Citrinitas — o amarelecimento, a aurora da consciência que surge após a purificação. É o momento em que as emoções, antes brutas, se tornam ouro relacional — não pela supressão, mas pela compreensão.

O golfinho que salta ao lado do trono é um símbolo poderoso: na tradição grega, golfinhos eram sagrados a Apolo e representavam a inteligência que navega as águas com alegria. O Rei de Copas não apenas sobrevive ao mar — ele dança com ele.`,

    perguntasReflexao: [
      "Você governa suas emoções ou elas governam você?",
      "Qual é a diferença entre controlar um sentimento e dar-lhe direção?",
      "Existe alguma área da sua vida onde você confunde frieza com maturidade emocional?",
    ],

    quiz: [
      {
        id: "copas-rei-q1",
        question: "O que significa o trono flutuando sobre águas agitadas?",
        options: ["Perigo iminente", "Maturidade é estabilidade dentro da tempestade", "Naufrágio", "Magia"],
        correctIndex: 1,
        explanation: "O Rei está estável dentro do caos — maturidade emocional não é ausência de tempestade.",
      },
      {
        id: "copas-rei-q2",
        question: "Qual é o arquétipo do Rei de Copas?",
        options: ["O Conquistador", "O Rei-Terapeuta", "O Eremita", "O Mago"],
        correctIndex: 1,
        explanation: "O Rei-Terapeuta lidera pelo coração — vulnerabilidade como poder.",
      },
      {
        id: "copas-rei-q3",
        question: "Na Cabala, o Rei de Copas representa:",
        options: ["Fogo na Água", "Ar na Água", "Água na Água", "Terra na Água"],
        correctIndex: 1,
        explanation: "É Ar dentro de Água — a mente que organiza as emoções sem sufocá-las.",
      },
      {
        id: "copas-rei-q4",
        question: "O que o golfinho ao lado do trono simboliza?",
        options: ["Riqueza", "Inteligência que navega as águas com alegria", "Perigo", "Poder militar"],
        correctIndex: 1,
        explanation: "Golfinhos representam inteligência e alegria — o Rei não sobrevive ao mar, dança com ele.",
      },
      {
        id: "copas-rei-q5",
        question: "Na sombra, o Rei de Copas pode indicar:",
        options: ["Pobreza", "Repressão emocional mascarada de controle", "Covardia física", "Ignorância"],
        correctIndex: 1,
        explanation: "Na sombra, o controle emocional se torna repressão — ele esqueceu como nadar.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Maestria",
      luz: "Liderança compassiva e maturidade emocional",
      sombra: "Repressão emocional mascarada de equilíbrio",
      licaoCentral: "Governar emoções é dar-lhes direção, não suprimi-las",
      aplicacaoPratica: "Na próxima tempestade emocional, observe antes de reagir",
      fraseFixacao: "O Rei não acalma o mar — ele aprende a navegar",
    },
  },
];
