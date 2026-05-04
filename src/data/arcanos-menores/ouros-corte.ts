/**
 * Conteúdo editorial — Cartas da Corte de Ouros
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";
import pajemImage from "@/assets/menor-ouros-pajem.jpg";
import cavaleiroImage from "@/assets/menor-ouros-cavaleiro.jpg";
import rainhaImage from "@/assets/menor-ouros-rainha.jpg";
import reiImage from "@/assets/menor-ouros-rei.jpg";

export const OUROS_CORTE: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // PAJEM DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-pajem",
    cardImage: pajemImage,
    subtitulo: "O Estudante da Matéria",
    essencia: "O Pajem de Ouros é o aprendiz do mundo material — aquele que começa a aprender sobre dinheiro, corpo, trabalho e manifestação. Representa a curiosidade prática, o primeiro emprego, o primeiro investimento, a primeira vez que se entende que a vida concreta também é um caminho de aprendizado.",

    simbolosCentrais: "Um jovem de pé num campo verde contempla uma moeda dourada que segura delicadamente com ambas as mãos, como se fosse algo precioso e novo. As montanhas ao fundo representam os objetivos de longo prazo. O campo verde é a fertilidade do momento. Sua roupa terrosa indica conexão com a terra. A delicadeza com que segura a moeda mostra respeito pela oportunidade.",

    arquetipo: "O Aprendiz Prático — o jovem que descobre que o mundo material tem lições tão profundas quanto o espiritual.",

    luz: "Novo começo prático, estudante dedicado, oportunidade de aprendizado, mensagem sobre dinheiro ou saúde, curiosidade material saudável. O Pajem de Ouros na luz é o primeiro passo concreto numa nova direção.",

    sombra: "Preguiça, desperdício de oportunidade, materialismo ingênuo, falta de disciplina, promessas não cumpridas. Na sombra, o Pajem admira a moeda mas nunca a planta.",

    licaoPratica: "Todo mestre já foi aprendiz. O Pajem de Ouros ensina que respeitar o começo — o primeiro emprego, o primeiro real guardado, o primeiro passo — é o fundamento de toda riqueza futura. Grandes fortunas começam com uma única moeda tratada com respeito.",

    interpretacaoAmor: "Início de relacionamento com potencial concreto, parceiro jovem e dedicado, amor que ainda está aprendendo. O Pajem de Ouros no amor é o início que tem substância — não apenas paixão.",

    interpretacaoTrabalho: "Novo emprego, estágio promissor, bolsa de estudos, oportunidade de treinamento, primeira promoção. No trabalho, é a chance de aprender fazendo.",

    interpretacaoEspiritualidade: "Espiritualidade prática, aprender a meditar, primeiro contato com disciplinas corporais, gratidão pelas coisas simples. O Pajem de Ouros na espiritualidade é o estudante que descobre o sagrado no cotidiano.",

    vozDaCarta: "Esta moeda é a primeira que ganhei com minhas próprias mãos. Não é muito — mas é minha. E eu a seguro com cuidado porque sei que o que faço com ela agora determina tudo o que vem depois. Cada mestre começou onde eu estou. Cada jardim começou com uma semente.",

    aprofundamento: `O Pajem de Ouros é a expressão mais jovem e curiosa do elemento Terra. Na tradição Rider-Waite-Smith, sua contemplação da moeda é quase reverencial — ele não gasta, não esconde, apenas observa com fascínio.

Na Cabala, o Pajem de Ouros representa Terra na Terra — a manifestação mais pura e densa do elemento. É a matéria em seu estado mais fundamental: simples, concreta, real. Na corte do tarô, os Pajens são mensageiros, e o Pajem de Ouros traz mensagens práticas: notícias sobre dinheiro, saúde, oportunidades concretas.

O campo verde ao redor é a promessa: a terra é fértil, as condições são favoráveis. O que falta é ação — plantar a semente. O Pajem ainda está na fase de contemplação, mas a energia está se preparando para a ação.

Na tradição pedagógica do tarô, o Pajem de Ouros é o "estudante do material" — aquele que aprende que o dinheiro não é sujo, que o corpo não é inferior, que o trabalho manual é sagrado. É o início da reconciliação entre espírito e matéria.`,

    perguntasReflexao: [
      "Existe uma oportunidade prática diante de você que merece mais respeito e atenção?",
      "Como você trata os começos — com entusiasmo ou com descaso?",
      "O que você aprenderia se tratasse cada real como a primeira moeda do seu futuro?",
    ],

    quiz: [
      {
        id: "ouros-pajem-q1",
        question: "O que a delicadeza com que o Pajem segura a moeda indica?",
        options: ["Medo", "Respeito pela oportunidade e pelo começo", "Avareza", "Fraqueza"],
        correctIndex: 1,
        explanation: "O Pajem trata a primeira moeda com reverência — respeitar o começo é fundamento.",
      },
      {
        id: "ouros-pajem-q2",
        question: "Na Cabala, o Pajem de Ouros representa:",
        options: ["Fogo na Terra", "Terra na Terra", "Água na Terra", "Ar na Terra"],
        correctIndex: 1,
        explanation: "É Terra na Terra — a manifestação mais pura e densa do elemento material.",
      },
      {
        id: "ouros-pajem-q3",
        question: "Qual é o arquétipo do Pajem de Ouros?",
        options: ["O Mestre", "O Aprendiz Prático", "O Guerreiro", "O Rei"],
        correctIndex: 1,
        explanation: "O Aprendiz Prático descobre que o mundo material tem lições profundas.",
      },
      {
        id: "ouros-pajem-q4",
        question: "Na sombra, o Pajem de Ouros pode indicar:",
        options: ["Sabedoria", "Preguiça e desperdício de oportunidade", "Amor", "Poder"],
        correctIndex: 1,
        explanation: "Na sombra, admira a moeda mas nunca a planta — oportunidade desperdiçada.",
      },
      {
        id: "ouros-pajem-q5",
        question: "A lição central do Pajem de Ouros é:",
        options: ["Ignorar começos", "Respeitar o começo é o fundamento de toda riqueza futura", "Gastar tudo", "Nunca trabalhar"],
        correctIndex: 1,
        explanation: "Grandes fortunas começam com uma única moeda tratada com respeito.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Começo",
      luz: "Oportunidade prática e curiosidade material saudável",
      sombra: "Preguiça e oportunidade desperdiçada",
      licaoCentral: "Respeitar o começo é o fundamento de toda riqueza futura",
      aplicacaoPratica: "Trate a próxima oportunidade prática com a reverência de uma primeira moeda",
      fraseFixacao: "A primeira moeda nas mãos — o futuro inteiro por plantar",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CAVALEIRO DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-cavaleiro",
    cardImage: cavaleiroImage,
    subtitulo: "O Cavaleiro da Constância",
    essencia: "O Cavaleiro de Ouros é o mais paciente e persistente de todos os cavaleiros. Representa a ação lenta mas imparável — o progresso que vem da constância, não da velocidade. É o oposto do Cavaleiro de Espadas: não galopa, marcha. Não corta, constrói.",

    simbolosCentrais: "Um cavaleiro montado num cavalo pesado e escuro avança lentamente por um campo arado. Segura uma moeda com cuidado — sem pressa. O cavalo é pesado e forte, não rápido. O campo arado indica que o trabalho já começou. As folhas de carvalho no elmo e na sela representam força e resistência. Tudo na imagem comunica: devagar e sempre.",

    arquetipo: "O Construtor Paciente — aquele que avança um passo por vez, sabendo que a constância vence a velocidade.",

    luz: "Persistência, confiabilidade, trabalho duro, progresso constante, responsabilidade, paciência produtiva. O Cavaleiro de Ouros na luz é a tartaruga que vence a lebre — sempre.",

    sombra: "Lentidão excessiva, teimosia, resistência a mudanças, monotonia, rigidez, materialismo obstinado. Na sombra, o Cavaleiro é tão lento que o mundo muda ao redor enquanto ele marcha no mesmo lugar.",

    licaoPratica: "A constância é a forma mais subestimada de coragem. O Cavaleiro de Ouros ensina que progresso não é velocidade — é direção mantida. O mundo admira os rápidos, mas são os constantes que constroem o que dura.",

    interpretacaoAmor: "Parceiro confiável e leal, relação que cresce devagar mas solidamente, amor que se prova nos fatos diários. O Cavaleiro de Ouros no amor é o parceiro que não faz declarações dramáticas — faz o jantar toda noite.",

    interpretacaoTrabalho: "Profissional confiável, progresso lento mas sólido na carreira, investimento de longo prazo, promoção por mérito. No trabalho, é a recompensa da consistência.",

    interpretacaoEspiritualidade: "Prática espiritual disciplinada e constante, caminhada lenta rumo à sabedoria, paciência como virtude sagrada. O Cavaleiro de Ouros na espiritualidade é o peregrino que caminha mil milhas — um passo por vez.",

    vozDaCarta: "Eles riem da minha velocidade. Dizem que sou lento. Mas olhe para trás: as pegadas do meu cavalo formam uma estrada. E olhe ao redor: os cavaleiros rápidos já caíram, já mudaram de rota, já desistiram. Eu? Eu continuo. Um passo. Depois outro. Depois outro. Isso é tudo — e é tudo que é preciso.",

    aprofundamento: `O Cavaleiro de Ouros é frequentemente subestimado na tradição do tarô — mas é potencialmente o mais poderoso dos quatro cavaleiros. Na tradição Rider-Waite-Smith, tudo na imagem comunica peso, estabilidade e determinação inabalável.

Na Cabala, o Cavaleiro de Ouros representa Fogo na Terra — a ação que inflama a matéria. Mas diferente do Fogo explosivo do Cavaleiro de Paus, aqui o fogo é contido — como a brasa que aquece por horas, não a chama que explode e apaga.

O cavalo pesado e escuro é uma escolha deliberada: não é um corcel de guerra, é um cavalo de trabalho. Foi criado para carregar peso, não para correr. E o campo arado mostra que o trabalho já está em andamento — o Cavaleiro não planeja, executa.

As folhas de carvalho no elmo e na sela são o símbolo da resistência: o carvalho é a árvore que leva décadas para crescer, mas dura séculos. O Cavaleiro de Ouros é assim — lento para começar, impossível de parar.`,

    perguntasReflexao: [
      "Você valoriza mais a velocidade ou a constância — e qual tem trazido mais resultados?",
      "Existe um projeto que exige mais paciência do que brilhantismo — e você está disposto a marchar?",
      "Como você lida com a monotonia do progresso diário — com resignação ou com orgulho?",
    ],

    quiz: [
      {
        id: "ouros-cavaleiro-q1",
        question: "O que o cavalo pesado e lento do Cavaleiro simboliza?",
        options: ["Preguiça", "Força e constância — progresso que vem da persistência", "Pobreza", "Medo"],
        correctIndex: 1,
        explanation: "O cavalo de trabalho é forte, não rápido — feito para carregar peso e persistir.",
      },
      {
        id: "ouros-cavaleiro-q2",
        question: "Na Cabala, o Cavaleiro de Ouros representa:",
        options: ["Terra na Terra", "Fogo na Terra", "Água na Terra", "Ar na Terra"],
        correctIndex: 1,
        explanation: "É Fogo na Terra — ação contida que aquece por horas, como brasa constante.",
      },
      {
        id: "ouros-cavaleiro-q3",
        question: "Qual é o arquétipo do Cavaleiro de Ouros?",
        options: ["O Veloz", "O Construtor Paciente", "O Guerreiro", "O Mago"],
        correctIndex: 1,
        explanation: "O Construtor Paciente avança um passo por vez — constância vence velocidade.",
      },
      {
        id: "ouros-cavaleiro-q4",
        question: "As folhas de carvalho no elmo simbolizam:",
        options: ["Natureza", "Força e resistência — o que demora a crescer dura séculos", "Beleza", "Sorte"],
        correctIndex: 1,
        explanation: "O carvalho leva décadas para crescer mas dura séculos — como o Cavaleiro.",
      },
      {
        id: "ouros-cavaleiro-q5",
        question: "A lição central do Cavaleiro de Ouros é:",
        options: ["Ser rápido", "Constância é a forma mais subestimada de coragem", "Nunca mudar", "Ser teimoso"],
        correctIndex: 1,
        explanation: "Progresso não é velocidade — é direção mantida. Os constantes constroem o que dura.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Constância",
      luz: "Persistência inabalável e progresso sólido",
      sombra: "Lentidão excessiva e resistência a mudanças",
      licaoCentral: "Constância é a forma mais subestimada de coragem",
      aplicacaoPratica: "Comprometa-se com uma ação pequena diária rumo a um objetivo de longo prazo",
      fraseFixacao: "Devagar e sempre — as pegadas do cavalo formam estrada",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // RAINHA DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-rainha",
    subtitulo: "A Rainha da Abundância Viva",
    essencia: "A Rainha de Ouros é a mestra da abundância prática — a mulher que nutre, sustenta e faz florescer tudo ao seu redor. Representa a generosidade materializada: não em palavras, mas em comida na mesa, lar acolhedor, jardim florido e colo disponível.",

    simbolosCentrais: "Uma rainha sentada num trono decorado com frutas, querubins e símbolos de fertilidade contempla uma moeda no colo. Um coelho aparece no canto inferior — símbolo de fertilidade e abundância natural. O jardim ao redor é exuberante. O trono está ao ar livre, integrado à natureza. Tudo na imagem respira fartura, nutrição e calor.",

    arquetipo: "A Grande Mãe Terra — aquela que faz tudo crescer ao seu redor através do cuidado prático e da presença nutritiva.",

    luz: "Abundância prática, nutrição, generosidade materializada, lar acolhedor, mãe nutridora, prosperidade compartilhada, conexão com o corpo e a terra. A Rainha de Ouros na luz é a cozinha quente e a mesa farta.",

    sombra: "Sufocação por excesso de cuidado, identidade baseada em nutrir outros, negligência de si mesma, materialismo como substituto de amor. Na sombra, a Rainha dá tanto que se esvazia.",

    licaoPratica: "Nutrir os outros é sagrado — mas nutrir a si mesma é o primeiro ato de abundância. A Rainha de Ouros ensina que a generosidade sustentável começa pelo autocuidado, e que um jardim só floresce quando a jardineira também é regada.",

    interpretacaoAmor: "Parceira nutridora e presente, amor que se expressa em cuidado prático, relação de conforto e segurança. A Rainha de Ouros no amor é o abraço que cheira a lar.",

    interpretacaoTrabalho: "Administradora excelente, empreendedora que faz o negócio prosperar, gestora de recursos, líder que cuida da equipe. No trabalho, é a profissional que faz tudo florescer ao redor.",

    interpretacaoEspiritualidade: "Espiritualidade encarnada, sagrado no cotidiano, corpo como templo, natureza como altar. A Rainha de Ouros na espiritualidade é a mulher que reza cozinhando — porque a cozinha é seu templo.",

    vozDaCarta: "Meu trono não é de pedra — é de terra. Minha coroa não é de ouro — é de flores. E meu poder não está no que eu comando, mas no que eu faço crescer. O coelho aos meus pés sabe: onde eu estou, a vida floresce. Não por magia. Por cuidado.",

    aprofundamento: `A Rainha de Ouros é frequentemente considerada a carta mais acolhedora e nutritiva do tarô. Na tradição Rider-Waite-Smith, cada detalhe reforça a mensagem de abundância natural e cuidado prático.

Na Cabala, a Rainha de Ouros representa Água na Terra — a emoção que fertiliza a matéria. É a mãe que transforma ingredientes em refeição, casa em lar, terra em jardim. Sua magia é prática: não precisa de varinhas, precisa de mãos.

O coelho é um símbolo universal de fertilidade — sua presença indica que a abundância da Rainha é natural, não forçada. Ela não cria abundância por esforço heroico — cria porque está em harmonia com os ciclos da natureza.

O trono ao ar livre, integrado ao jardim, é significativo: esta rainha não governa de dentro de um castelo. Governa do jardim — onde a vida acontece. Na tradição da Grande Mãe, ela é Deméter, Gaia, Pachamama — a terra que alimenta sem pedir nada em troca.`,

    perguntasReflexao: [
      "Você nutre os outros tanto que esquece de nutrir a si mesma?",
      "Como você expressa cuidado de forma prática — e recebe cuidado da mesma forma?",
      "O que o seu 'jardim interior' precisa agora — água, sol, poda ou descanso?",
    ],

    quiz: [
      {
        id: "ouros-rainha-q1",
        question: "O que o coelho no canto inferior da carta simboliza?",
        options: ["Medo", "Fertilidade e abundância natural", "Velocidade", "Magia"],
        correctIndex: 1,
        explanation: "O coelho é símbolo universal de fertilidade — abundância natural e não forçada.",
      },
      {
        id: "ouros-rainha-q2",
        question: "Na Cabala, a Rainha de Ouros representa:",
        options: ["Fogo na Terra", "Água na Terra", "Ar na Terra", "Terra na Terra"],
        correctIndex: 1,
        explanation: "É Água na Terra — a emoção que fertiliza a matéria, o cuidado que faz crescer.",
      },
      {
        id: "ouros-rainha-q3",
        question: "Qual é o arquétipo da Rainha de Ouros?",
        options: ["A Guerreira", "A Grande Mãe Terra", "A Juíza", "A Sedutora"],
        correctIndex: 1,
        explanation: "A Grande Mãe Terra faz tudo florescer pelo cuidado prático e presença nutritiva.",
      },
      {
        id: "ouros-rainha-q4",
        question: "Na sombra, a Rainha de Ouros pode indicar:",
        options: ["Crueldade", "Sufocação por excesso de cuidado e negligência de si mesma", "Pobreza", "Indiferença"],
        correctIndex: 1,
        explanation: "Na sombra, dá tanto que se esvazia — cuidar dos outros sem cuidar de si.",
      },
      {
        id: "ouros-rainha-q5",
        question: "A lição central da Rainha de Ouros é:",
        options: ["Nunca cuidar de si", "A generosidade sustentável começa pelo autocuidado", "Ser egoísta", "Ignorar outros"],
        correctIndex: 1,
        explanation: "O jardim só floresce quando a jardineira também é regada.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Nutrição",
      luz: "Abundância prática e generosidade materializada",
      sombra: "Sufocação por excesso de cuidado e auto-negligência",
      licaoCentral: "A generosidade sustentável começa pelo autocuidado",
      aplicacaoPratica: "Cuide de si mesma hoje com a mesma dedicação que cuida dos outros",
      fraseFixacao: "Onde eu estou, a vida floresce — porque cuidado é minha forma de amor",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // REI DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-rei",
    subtitulo: "O Soberano da Prosperidade",
    essencia: "O Rei de Ouros é a autoridade máxima do mundo material — o mestre da prosperidade, do planejamento e da construção concreta. Representa a inteligência prática em sua forma mais madura: aquele que sabe criar, manter e multiplicar riqueza com responsabilidade.",

    simbolosCentrais: "Um rei sentado num trono maciço decorado com cabeças de touro segura uma moeda numa mão e um cetro na outra. Sua armadura é coberta por um manto de vinhas e uvas. O castelo e os jardins ao fundo representam o império construído. Os touros no trono simbolizam Touro — signo de terra, estabilidade e abundância. As uvas no manto são a riqueza que ele veste — não ostenta, incorpora.",

    arquetipo: "O Rei Midas Sábio — aquele que aprendeu que o verdadeiro ouro não está nas moedas, mas no que elas constroem.",

    luz: "Prosperidade consolidada, liderança prática, sabedoria financeira, generosidade de quem tem abundância, segurança e estabilidade. O Rei de Ouros na luz é o empresário que constrói, emprega e distribui.",

    sombra: "Ganância, tirania financeira, redução da vida ao material, obsessão com controle, corrupção pelo poder econômico. Na sombra, o Rei Midas esqueceu que o ouro não se come e não se abraça.",

    licaoPratica: "A riqueza sem propósito é peso. O Rei de Ouros ensina que a prosperidade mais elevada não é a que se acumula, mas a que se usa para construir algo maior que si mesmo — empregos, comunidade, legado.",

    interpretacaoAmor: "Parceiro estável e provedor, relação de segurança material e emocional, homem que demonstra amor através de ações concretas. O Rei de Ouros no amor é o parceiro que constrói o futuro — tijolo a tijolo.",

    interpretacaoTrabalho: "CEO, empreendedor de sucesso, investidor sábio, mentor de negócios, líder que transforma visão em realidade. No trabalho, é a autoridade que todos respeitam — porque construiu do zero.",

    interpretacaoEspiritualidade: "Mestre da espiritualidade prática, alquimista que transforma chumbo em ouro interior, integração plena de matéria e espírito. O Rei de Ouros na espiritualidade é a prova de que abundância e evolução espiritual podem coexistir.",

    vozDaCarta: "Eu não herdei este castelo — construí. Cada pedra, cada jardim, cada emprego que criei é fruto de decisões tomadas com a cabeça e executadas com as mãos. A moeda na minha mão não é minha — é de quem precisa dela. E o cetro? O cetro me lembra que o poder é responsabilidade, não privilégio.",

    aprofundamento: `O Rei de Ouros é a expressão mais madura e integrada do elemento Terra. Na tradição Rider-Waite-Smith, é frequentemente considerado o mais bem-sucedido materialmente de todos os reis — mas também o mais generoso.

As cabeças de touro no trono conectam o Rei ao signo de Touro — regido por Vênus, associado à beleza, ao prazer e à abundância estável. Na Cabala, o Rei de Ouros representa Ar na Terra — o pensamento que organiza a matéria. Não é força bruta — é inteligência aplicada ao mundo concreto.

O manto de vinhas e uvas é significativo: a riqueza do Rei não é guardada em cofres — é vestida, vivida, compartilhada. As uvas representam abundância que fermenta e se transforma — assim como a riqueza do Rei gera mais riqueza.

Na tradição alquímica, o Rei de Ouros é a Rubedo completa — o ouro filosófico manifestado no mundo. Não é mais teoria ou potencial — é realidade. A Grande Obra está completa. O chumbo virou ouro. E o ouro se tornou jardim, castelo, comunidade.`,

    perguntasReflexao: [
      "Sua relação com dinheiro e poder é de serviço ou de dominação?",
      "O que você construiria se tivesse recursos ilimitados — e o que isso revela sobre seus valores?",
      "Como você equilibra ambição material e generosidade na sua vida?",
    ],

    quiz: [
      {
        id: "ouros-rei-q1",
        question: "O que as cabeças de touro no trono simbolizam?",
        options: ["Violência", "Touro — estabilidade, abundância e conexão com a terra", "Força bruta", "Medo"],
        correctIndex: 1,
        explanation: "O touro é signo de Terra — estabilidade, prazer e abundância duradoura.",
      },
      {
        id: "ouros-rei-q2",
        question: "Na Cabala, o Rei de Ouros representa:",
        options: ["Fogo na Terra", "Ar na Terra", "Água na Terra", "Terra na Terra"],
        correctIndex: 1,
        explanation: "É Ar na Terra — o pensamento que organiza a matéria, inteligência prática.",
      },
      {
        id: "ouros-rei-q3",
        question: "Qual é o arquétipo do Rei de Ouros?",
        options: ["O Avarento", "O Rei Midas Sábio", "O Guerreiro", "O Louco"],
        correctIndex: 1,
        explanation: "O Rei Midas Sábio aprendeu que o verdadeiro ouro está no que ele constrói.",
      },
      {
        id: "ouros-rei-q4",
        question: "Na sombra, o Rei de Ouros pode indicar:",
        options: ["Pobreza", "Ganância e redução da vida ao material", "Amor", "Sabedoria"],
        correctIndex: 1,
        explanation: "Na sombra, esqueceu que o ouro não se come — poder sem propósito.",
      },
      {
        id: "ouros-rei-q5",
        question: "A lição central do Rei de Ouros é:",
        options: ["Acumular para si", "A prosperidade mais elevada é a que se usa para construir algo maior", "Gastar tudo", "Ignorar dinheiro"],
        correctIndex: 1,
        explanation: "Riqueza sem propósito é peso — a verdadeira prosperidade constrói legado.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Prosperidade",
      luz: "Sabedoria financeira e liderança que constrói legado",
      sombra: "Ganância e tirania financeira",
      licaoCentral: "A riqueza sem propósito é peso — a prosperidade constrói algo maior",
      aplicacaoPratica: "Use um recurso que você tem para ajudar alguém a construir algo",
      fraseFixacao: "O castelo foi construído pedra a pedra — e a porta está aberta para quem precisa",
    },
  },
];
