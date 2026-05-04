/**
 * Conteúdo editorial — Cartas da Corte de Paus
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";
import pajemImage from "@/assets/menor-paus-pajem.jpg";
import cavaleiroImage from "@/assets/menor-paus-cavaleiro.jpg";
import rainhaImage from "@/assets/menor-paus-rainha.jpg";
import reiImage from "@/assets/menor-paus-rei.jpg";

export const PAUS_CORTE: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // PAJEM DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-pajem",
    cardImage: pajemImage,
    subtitulo: "O Mensageiro da Chama",
    essencia: "O Pajem de Paus é o jovem explorador entusiasmado — cheio de ideias, cheio de fogo, cheio de vontade. Representa o início da jornada criativa: a primeira faísca que quer virar incêndio. É a energia pura do 'e se?' dito com olhos brilhantes.",

    simbolosCentrais: "Um jovem de pé num deserto segura um bastão brotando e olha para cima com admiração. O chapéu com uma pena vermelha indica espírito aventureiro. O deserto ao fundo representa potencial não explorado — terra que espera ser transformada pela ação. As salamandras em sua túnica são o símbolo elementar do Fogo.",

    arquetipo: "O Aprendiz do Fogo — o jovem que descobre que tem o poder de criar e quer colocar essa descoberta em prática imediatamente.",

    luz: "Entusiasmo contagiante, ideias frescas, boa notícia, início de aventura, energia jovem, curiosidade criativa, mensageiro de oportunidades. O Pajem de Paus na luz é a centelha que precede o incêndio criativo.",

    sombra: "Impulsividade, ideias sem execução, promessas vazias, superficialidade criativa, entusiasmo que evapora rápido. Na sombra, o Pajem fala de mil projetos mas não termina nenhum.",

    licaoPratica: "O entusiasmo sem disciplina é fogos de artifício — bonito mas efêmero. O Pajem de Paus ensina que a primeira faísca precisa de lenha para virar fogueira. Comece com paixão, mas sustente com compromisso.",

    interpretacaoAmor: "Notícia de interesse romântico, aventura amorosa, paixonite intensa mas potencialmente passageira. O Pajem de Paus no amor é a mensagem que faz o coração acelerar — mas falta saber se tem substância.",

    interpretacaoTrabalho: "Nova oportunidade, convite criativo, estagiário promissor, ideia inovadora, energia renovada. No trabalho, é o projeto que começa com muita empolgação.",

    interpretacaoEspiritualidade: "Chamado para nova prática, entusiasmo espiritual, descoberta de vocação, primeiro contato com o sagrado pessoal. O Pajem de Paus na espiritualidade é quando o fogo interior é descoberto pela primeira vez.",

    vozDaCarta: "Eu tenho mil ideias e nenhum plano — e sabe de uma coisa? Tudo bem. Porque a primeira coisa que o fogo precisa é existir. O resto vem depois. Olhe para o meu bastão: ele já está brotando. Isso quer dizer que o que eu sinto é real.",

    aprofundamento: `O Pajem de Paus é a expressão mais jovem e entusiástica do elemento Fogo. Na tradição Rider-Waite-Smith, sua postura de admiração diante do próprio bastão mostra alguém que acaba de descobrir seu poder criativo — e está maravilhado.

As salamandras na túnica são o emblema elementar do Fogo na tradição alquímica. Na mitologia, salamandras podiam viver no fogo sem se queimar — representam a capacidade de lidar com a energia criativa sem ser consumido por ela.

Na Cabala, o Pajem de Paus representa Terra no Fogo — a materialização da energia criativa. É o momento em que a inspiração ganha forma concreta, mesmo que imperfeita. Na corte do tarô, o Pajem é o estudante — aquele que aprende fazendo, errando, recomeçando.

O deserto ao fundo é significativo: não é um lugar de morte, mas de potencial. O deserto é onde as coisas podem nascer do zero — sem bagagem, sem preconceito, sem limitação. O Pajem está num ponto de partida absoluto.`,

    perguntasReflexao: [
      "Qual ideia nova está pedindo sua atenção — e o que te impede de explorar?",
      "Você tende a se empolgar com projetos mas desistir antes de concluir?",
      "O que diferencia entusiasmo genuíno de empolgação passageira na sua experiência?",
    ],

    quiz: [
      {
        id: "paus-pajem-q1",
        question: "O que as salamandras na túnica do Pajem representam?",
        options: ["Perigo", "O elemento Fogo e a capacidade de lidar com energia criativa", "Animais de estimação", "Decoração"],
        correctIndex: 1,
        explanation: "Salamandras são o emblema alquímico do Fogo — vivem na chama sem se queimar.",
      },
      {
        id: "paus-pajem-q2",
        question: "Qual é o arquétipo do Pajem de Paus?",
        options: ["O Sábio", "O Aprendiz do Fogo", "O Rei", "O Eremita"],
        correctIndex: 1,
        explanation: "O Aprendiz do Fogo descobre seu poder criativo e quer experimentá-lo.",
      },
      {
        id: "paus-pajem-q3",
        question: "Na Cabala, o Pajem de Paus representa:",
        options: ["Água no Fogo", "Terra no Fogo", "Ar no Fogo", "Fogo no Fogo"],
        correctIndex: 1,
        explanation: "É Terra no Fogo — a materialização da energia criativa.",
      },
      {
        id: "paus-pajem-q4",
        question: "Na sombra, o Pajem de Paus indica:",
        options: ["Sabedoria", "Impulsividade e ideias sem execução", "Riqueza", "Paz"],
        correctIndex: 1,
        explanation: "Na sombra, fala de mil projetos mas não termina nenhum.",
      },
      {
        id: "paus-pajem-q5",
        question: "O deserto ao fundo simboliza:",
        options: ["Morte", "Potencial não explorado e ponto de partida", "Solidão", "Punição"],
        correctIndex: 1,
        explanation: "O deserto é onde coisas nascem do zero — potencial absoluto.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Entusiasmo",
      luz: "Centelha criativa e energia jovem contagiante",
      sombra: "Impulsividade e projetos abandonados",
      licaoCentral: "Paixão precisa de disciplina para virar fogueira",
      aplicacaoPratica: "Escolha uma ideia que te empolga e defina o primeiro passo concreto",
      fraseFixacao: "O bastão já brota — agora é hora de plantar, não só admirar",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CAVALEIRO DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-cavaleiro",
    cardImage: cavaleiroImage,
    subtitulo: "O Cavaleiro da Aventura",
    essencia: "O Cavaleiro de Paus é pura ação — o aventureiro que galopa sem mapa, movido pela paixão e pela fé de que o caminho se faz caminhando. Representa a energia masculina do Fogo em movimento: destemida, impulsiva, magnética e impossível de ignorar.",

    simbolosCentrais: "Um cavaleiro em armadura dourada cavalga um cavalo empinado a toda velocidade, segurando um bastão brotando. Três pirâmides ao fundo evocam aventura e terras distantes. As salamandras em sua túnica estão com as caudas abertas — diferente de outros trajes, indicando ação incompleta em andamento. O cavalo empinado mostra energia no auge.",

    arquetipo: "O Aventureiro — aquele que vive para a próxima jornada, que não sabe ficar parado, que transforma desejo em galope.",

    luz: "Aventura, ação ousada, viagem, mudança rápida, carisma, paixão em movimento, coragem sem cálculo. O Cavaleiro de Paus na luz é a vida acontecendo na velocidade do desejo.",

    sombra: "Irresponsabilidade, fuga pela ação, compromisso superficial, arrogância, impaciência destrutiva, energia dispersa. Na sombra, o Cavaleiro galopa tão rápido que não vê os estragos que deixa atrás.",

    licaoPratica: "A ação é a linguagem do Fogo — mas ação sem consciência é apenas agitação. O Cavaleiro de Paus ensina que velocidade não é a mesma coisa que progresso. Galope — mas saiba para onde.",

    interpretacaoAmor: "Paixão arrebatadora, amante aventureiro, romance que chega com intensidade, pessoa que te tira da zona de conforto. O Cavaleiro de Paus no amor é fogo: ilumina, aquece — mas pode queimar se não souber se controlar.",

    interpretacaoTrabalho: "Mudança de emprego, viagem de negócios, projeto que exige audácia, empreendedor nato, ação decisiva. No trabalho, é o momento de parar de planejar e começar a fazer.",

    interpretacaoEspiritualidade: "Peregrinação, busca espiritual ativa, energia kundalínica em movimento, entusiasmo religioso. O Cavaleiro de Paus na espiritualidade é o devoto que busca Deus no caminho, não na clausura.",

    vozDaCarta: "Eu não pergunto 'e se der errado?'. Eu pergunto 'e se der certo?'. Meu cavalo está empinado porque sabe que estou pronto. O bastão na minha mão é meu mapa: ele aponta para frente. Sempre para frente.",

    aprofundamento: `O Cavaleiro de Paus é considerado o mais veloz e impulsivo de todos os cavaleiros do tarô. Na tradição Rider-Waite-Smith, é o único cavaleiro cujo cavalo está completamente empinado — indicando energia no auge, impossível de conter.

As pirâmides ao fundo são deliberadas: evocam terras exóticas, aventura, o desconhecido que atrai. O Cavaleiro não busca segurança — busca experiência. Na astrologia, é frequentemente associado a Sagitário — o signo da aventura, da filosofia e da flecha apontada para o horizonte.

Na Cabala, o Cavaleiro de Paus representa Fogo no Fogo — a quintessência da energia ativa. É a ação pura, sem filtro, sem cálculo, sem medo. É também o aspecto mais perigoso: fogo sobre fogo pode consumir tudo.

As salamandras com caudas abertas são um detalhe importante: nas outras cartas da corte de Paus, as caudas se fecham (completude). Aqui estão abertas — a jornada está em andamento, nada está concluído. O Cavaleiro é puro processo, nunca resultado. Sua sabedoria está no caminho, nunca na chegada.`,

    perguntasReflexao: [
      "Você está se movendo por paixão genuína ou por inquietude?",
      "O que aconteceria se você desacelerasse um pouco — perderia algo ou ganharia clareza?",
      "Seu impulso de ação está te levando para frente ou apenas te afastando de algo?",
    ],

    quiz: [
      {
        id: "paus-cavaleiro-q1",
        question: "Por que o cavalo do Cavaleiro de Paus está empinado?",
        options: ["Está assustado", "Energia no auge, impossível de conter", "Está parando", "É decorativo"],
        correctIndex: 1,
        explanation: "O cavalo empinado mostra energia máxima — ação no ponto de explosão.",
      },
      {
        id: "paus-cavaleiro-q2",
        question: "Na Cabala, o Cavaleiro de Paus representa:",
        options: ["Terra no Fogo", "Fogo no Fogo", "Água no Fogo", "Ar no Fogo"],
        correctIndex: 1,
        explanation: "É Fogo no Fogo — a quintessência da energia ativa, ação pura.",
      },
      {
        id: "paus-cavaleiro-q3",
        question: "O que as salamandras com caudas abertas indicam?",
        options: ["Morte", "A jornada está em andamento, nada concluído", "Perfeição", "Medo"],
        correctIndex: 1,
        explanation: "Caudas abertas = processo em andamento. O Cavaleiro é caminho, não destino.",
      },
      {
        id: "paus-cavaleiro-q4",
        question: "Qual é o arquétipo do Cavaleiro de Paus?",
        options: ["O Sábio", "O Aventureiro", "O Eremita", "O Juiz"],
        correctIndex: 1,
        explanation: "O Aventureiro vive para a próxima jornada — transforma desejo em galope.",
      },
      {
        id: "paus-cavaleiro-q5",
        question: "Na sombra, o Cavaleiro de Paus pode indicar:",
        options: ["Sabedoria", "Irresponsabilidade e fuga pela ação", "Paz interior", "Riqueza"],
        correctIndex: 1,
        explanation: "Na sombra, galopa tão rápido que não vê os estragos que deixa.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Aventura",
      luz: "Ação ousada e paixão em movimento",
      sombra: "Irresponsabilidade e energia dispersa",
      licaoCentral: "Velocidade não é progresso — galope, mas saiba para onde",
      aplicacaoPratica: "Antes de agir por impulso, respire e confirme a direção",
      fraseFixacao: "O cavalo empina porque sabe que estou pronto — mas para onde?",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // RAINHA DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-rainha",
    cardImage: rainhaImage,
    subtitulo: "A Rainha do Fogo Vivo",
    essencia: "A Rainha de Paus é a força feminina do Fogo — magnética, confiante, criativa e absolutamente dona de si. Representa a mulher que lidera pelo carisma e pela paixão: inspira sem forçar, atrai sem manipular, cria sem pedir permissão.",

    simbolosCentrais: "Uma rainha sentada num trono decorado com leões e girassóis, segurando um bastão florido na mão direita e um girassol na esquerda. O gato negro aos seus pés representa independência e intuição. Os leões no trono simbolizam coragem e nobreza. Os girassóis representam vitalidade, otimismo e fé. O deserto ao fundo mostra que ela floresce onde outros murcham.",

    arquetipo: "A Matriarca Solar — a mulher que irradia calor, luz e vitalidade a todos ao redor. O sol feminino.",

    luz: "Carisma, criatividade, liderança natural, magnetismo, independência, otimismo contagiante, energia vital, mulher empreendedora. A Rainha de Paus na luz é o sol que aquece sem queimar.",

    sombra: "Dominação, ciúmes, temperamento explosivo, orgulho ferido, controle disfarçado de cuidado, ego artístico excessivo. Na sombra, a Rainha incendeia tudo que não a obedece.",

    licaoPratica: "O verdadeiro poder não precisa se impor — ele irradia. A Rainha de Paus ensina que confiança não é controle, e que a presença mais poderosa é aquela que inspira liberdade nos outros.",

    interpretacaoAmor: "Parceira apaixonada e independente, mulher que lidera a relação com sabedoria, amor vibrante e criativo. A Rainha de Paus no amor é a parceira que te faz querer ser melhor — sem te cobrar.",

    interpretacaoTrabalho: "Líder criativa, empreendedora, mulher no comando, projeto movido por paixão, ambiente de trabalho inspirador. No trabalho, é a chefe que todos admiram porque lidera pelo exemplo.",

    interpretacaoEspiritualidade: "Conexão com o fogo sagrado feminino, sacerdotisa do Fogo, criatividade como prática espiritual, kundalini estável. A Rainha de Paus na espiritualidade é a guardiã da chama interior.",

    vozDaCarta: "Eu não brilho para impressionar — eu brilho porque é minha natureza. O girassol na minha mão não precisa de aplausos para se abrir. Ele se abre porque o sol existe. Eu sou esse sol. E meu convite é: brilhe você também.",

    aprofundamento: `A Rainha de Paus é frequentemente considerada a carta mais carismática do tarô. Na tradição Rider-Waite-Smith, é a única Rainha que segura tanto o símbolo do naipe (bastão) quanto um símbolo pessoal (girassol) — mostrando que ela integra poder e beleza.

O gato negro aos seus pés é significativo: na tradição esotérica, o gato é símbolo de independência, intuição e mistério. A Rainha não precisa de ninguém para se validar — como o gato, ela é completa em si mesma.

Na Cabala, a Rainha de Paus representa Água no Fogo — o sentimento que nutre a ação, a intuição que guia a criatividade. É o equilíbrio entre paixão e sabedoria emocional. Na astrologia, é associada aos signos de Áries e Leão — a energia cardinal e a fixa do Fogo.

Os leões e girassóis no trono são símbolos solares — Leo, o signo do sol, do teatro, da criação. A Rainha é a expressão feminina dessa energia solar: não compete com o Rei — ela brilha com luz própria, de forma complementar e soberana.`,

    perguntasReflexao: [
      "Você se permite brilhar plenamente — ou se contém por medo de ofuscar?",
      "Como você equilibra independência e conexão nos seus relacionamentos?",
      "Existe uma área da sua vida onde você precisa liderar com mais confiança?",
    ],

    quiz: [
      {
        id: "paus-rainha-q1",
        question: "O que o gato negro aos pés da Rainha simboliza?",
        options: ["Azar", "Independência e intuição", "Maldade", "Companhia"],
        correctIndex: 1,
        explanation: "O gato representa independência e completude — a Rainha é soberana de si mesma.",
      },
      {
        id: "paus-rainha-q2",
        question: "Qual é o arquétipo da Rainha de Paus?",
        options: ["A Mártir", "A Matriarca Solar", "A Eremita", "A Vítima"],
        correctIndex: 1,
        explanation: "A Matriarca Solar irradia calor, luz e vitalidade — o sol feminino.",
      },
      {
        id: "paus-rainha-q3",
        question: "Na Cabala, a Rainha de Paus representa:",
        options: ["Fogo no Fogo", "Água no Fogo", "Terra no Fogo", "Ar no Fogo"],
        correctIndex: 1,
        explanation: "É Água no Fogo — sentimento que nutre a ação, intuição que guia a criatividade.",
      },
      {
        id: "paus-rainha-q4",
        question: "O girassol na mão da Rainha simboliza:",
        options: ["Fragilidade", "Vitalidade, otimismo e fé", "Tristeza", "Riqueza"],
        correctIndex: 1,
        explanation: "Girassóis representam vitalidade e orientação ao sol — otimismo natural.",
      },
      {
        id: "paus-rainha-q5",
        question: "Na sombra, a Rainha de Paus pode indicar:",
        options: ["Timidez", "Temperamento explosivo e controle disfarçado de cuidado", "Paz excessiva", "Pobreza"],
        correctIndex: 1,
        explanation: "Na sombra, a Rainha incendeia tudo que não a obedece — domínio pelo fogo.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Carisma",
      luz: "Liderança magnética e criatividade radiante",
      sombra: "Dominação e temperamento explosivo",
      licaoCentral: "O verdadeiro poder irradia — não se impõe",
      aplicacaoPratica: "Permita-se liderar com confiança em uma área que pede sua luz",
      fraseFixacao: "O girassol não pede aplausos para se abrir — ele se abre porque o sol existe",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // REI DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-rei",
    cardImage: reiImage,
    subtitulo: "O Soberano do Fogo",
    essencia: "O Rei de Paus é o mestre da vontade — aquele que transformou o fogo selvagem em liderança estratégica. Representa a maturidade criativa: a visão que se tornou império, o impulso que se tornou propósito, o desejo que se tornou legado.",

    simbolosCentrais: "Um rei sentado num trono decorado com salamandras e leões, segurando um bastão florido. Uma salamandra viva no chão, a seus pés, olha para longe — indicando visão de longo prazo. O manto verde sobre a armadura dourada indica crescimento sobre poder. As salamandras no trono têm caudas fechadas — ação completa, ciclos finalizados.",

    arquetipo: "O Empreendedor Visionário — o líder que constrói impérios não pela força, mas pela visão, carisma e capacidade de inspirar outros a agir.",

    luz: "Liderança visionária, empreendedorismo maduro, carisma com propósito, energia dirigida, generosidade de espírito, coragem estratégica. O Rei de Paus na luz é Steve Jobs, Martin Luther King, qualquer líder que transformou paixão em movimento.",

    sombra: "Tirania, autoritarismo, impulsividade arrogante, líder que não escuta, ego que confunde visão pessoal com verdade universal. Na sombra, o Rei queima tudo que não se alinha à sua vontade.",

    licaoPratica: "O verdadeiro líder não é quem grita mais alto — é quem inspira outros a encontrar sua própria voz. O Rei de Paus ensina que o poder do Fogo amadurecido não destrói: ele ilumina, aquece e transforma.",

    interpretacaoAmor: "Parceiro apaixonado e protetor, homem de ação que ama intensamente, relação baseada em admiração mútua. O Rei de Paus no amor é o parceiro que te desafia a crescer — e cresce junto.",

    interpretacaoTrabalho: "CEO, fundador, líder natural, visão de negócio, empreendimento que muda o mercado. No trabalho, é o líder que todos querem seguir — porque ele sabe para onde vai.",

    interpretacaoEspiritualidade: "Mestre espiritual carismático, líder de comunidade, guru do fogo interior, propósito como caminho sagrado. O Rei de Paus na espiritualidade é o mestre que ensina pelo fogo do exemplo.",

    vozDaCarta: "Eu já fui o Pajem que admirava o bastão. Eu já fui o Cavaleiro que galopava sem mapa. Agora sou o Rei — e meu trono não é de ouro, é de experiência. Cada salamandra fechada é um ciclo completo. Eu não lidero por poder. Eu lidero porque sei o caminho — porque já o percorri.",

    aprofundamento: `O Rei de Paus é a expressão mais madura e integrada do elemento Fogo. Na tradição Rider-Waite-Smith, é o único Rei que olha diretamente para frente com determinação calma — não para os lados (dúvida) nem para baixo (introspecção).

As salamandras com caudas fechadas são um detalhe crucial: nas cartas do Cavaleiro, as caudas estão abertas (processo em andamento). No Rei, estão fechadas — ciclos completos, ações finalizadas, maestria conquistada. O Rei não é fogo selvagem: é fogo controlado, direcionado, com propósito.

Na Cabala, o Rei de Paus representa Ar no Fogo — a mente que organiza a energia criativa, a estratégia que direciona a paixão. Não é repressão do fogo — é refinamento. Na astrologia, está associado a Sagitário e Leão, signos de visão expandida e liderança natural.

A salamandra viva no chão é uma adição sutil: enquanto as do trono são decorativas (maestria passada), a do chão está viva e olha para frente — indicando que o Rei nunca para de criar. A maturidade não é o fim da ação — é o começo da ação consciente.

Na alquimia, o Rei de Paus é a Rubedo — o avermelhamento, a fase final da Grande Obra onde o material bruto se torna ouro. Não por magia, mas por processo: o fogo que purificou, testou e transformou.`,

    perguntasReflexao: [
      "Que tipo de líder você é — inspira pelo exemplo ou pelo controle?",
      "Sua paixão tem direção ou é energia dispersa?",
      "O que você está construindo que será maior que você mesmo?",
    ],

    quiz: [
      {
        id: "paus-rei-q1",
        question: "O que as salamandras com caudas fechadas indicam?",
        options: ["Medo", "Ciclos completos e maestria conquistada", "Morte", "Fraqueza"],
        correctIndex: 1,
        explanation: "Caudas fechadas = ação completa. O Rei dominou seu fogo por experiência.",
      },
      {
        id: "paus-rei-q2",
        question: "Na Cabala, o Rei de Paus representa:",
        options: ["Fogo no Fogo", "Ar no Fogo", "Água no Fogo", "Terra no Fogo"],
        correctIndex: 1,
        explanation: "É Ar no Fogo — mente que organiza a energia criativa com estratégia.",
      },
      {
        id: "paus-rei-q3",
        question: "Qual é o arquétipo do Rei de Paus?",
        options: ["O Eremita", "O Empreendedor Visionário", "O Monge", "O Juiz"],
        correctIndex: 1,
        explanation: "O Empreendedor Visionário transforma paixão em movimento — liderança com visão.",
      },
      {
        id: "paus-rei-q4",
        question: "Na alquimia, o Rei de Paus representa:",
        options: ["Nigredo", "Rubedo", "Albedo", "Citrinitas"],
        correctIndex: 1,
        explanation: "Rubedo é a fase final da Grande Obra — o material bruto se torna ouro pelo fogo.",
      },
      {
        id: "paus-rei-q5",
        question: "Na sombra, o Rei de Paus pode indicar:",
        options: ["Timidez", "Tirania e ego que confunde visão pessoal com verdade", "Pobreza", "Preguiça"],
        correctIndex: 1,
        explanation: "Na sombra, o Rei queima tudo que não se alinha à sua vontade — tirania do fogo.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Liderança",
      luz: "Visão empreendedora e carisma com propósito",
      sombra: "Tirania e impulsividade arrogante",
      licaoCentral: "O verdadeiro líder inspira outros a encontrar sua própria voz",
      aplicacaoPratica: "Pergunte-se: estou liderando pelo exemplo ou pelo controle?",
      fraseFixacao: "As salamandras fecharam suas caudas — o fogo amadureceu em propósito",
    },
  },
];
