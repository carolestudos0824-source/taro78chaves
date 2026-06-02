export interface FundamentosLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  /** Main content — required */
  content: string;
  /** Key takeaways */
  keyPoints: string[];
  /** Optional deep dive */
  deepDive?: string;
  /** Reflection prompt */
  reflection?: string;
  /** Simple exercise */
  exercise: {
    instruction: string;
    type: "reflection" | "practice" | "observation" | "writing";
  };
  /** Quiz questions */
  quiz: FundamentosQuizQuestion[];
}

export interface FundamentosQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const FUNDAMENTOS_LESSONS: FundamentosLesson[] = [
  {
    id: "fund-1",
    order: 0,
    title: "O que é o Tarô",
    subtitle: "Muito além da adivinhação",
    icon: "🌙",
    content: `O tarô é um sistema simbólico com mais de 500 anos de história. Ele nasceu como jogo de cartas na Europa renascentista e, ao longo dos séculos, foi adotado por tradições místicas, psicológicas e espirituais como ferramenta de autoconhecimento.

Diferente do que a cultura popular ensina, o tarô não "prevê o futuro" de forma determinística. Ele revela padrões, tendências e possibilidades. Cada carta é um espelho que reflete aspectos da experiência humana — emoções, desafios, transformações e ciclos.

Estudar tarô é aprender uma linguagem. Uma linguagem feita de imagens, cores, números e símbolos que, quando compreendidos, oferecem clareza sobre o momento presente e orientação para decisões mais conscientes.

Nesta plataforma, você vai aprender tarô como um sistema de sabedoria — com método, profundidade e beleza.`,
    keyPoints: [
      "O tarô é um sistema simbólico, não uma bola de cristal",
      "Tem mais de 500 anos de história e tradição",
      "Revela padrões e possibilidades, não destinos fixos",
      "É uma linguagem de imagens, cores e símbolos",
    ],
    deepDive: `O tarô tem raízes no norte da Itália do século XV, onde era conhecido como "tarocchi" — um jogo de cartas para a nobreza. Os primeiros baralhos conhecidos incluem o Visconti-Sforza (c. 1440), ricamente ilustrado com folha de ouro.

Foi no século XVIII que o tarô começou a ser associado ao ocultismo, quando Antoine Court de Gébelin publicou suas teorias sobre a origem egípcia das cartas. Embora essa teoria tenha sido refutada, ela abriu caminho para o uso esotérico do tarô.

No século XX, o baralho Rider-Waite-Smith (1909), criado por Arthur Edward Waite e ilustrado por Pamela Colman Smith, revolucionou o tarô ao adicionar cenas narrativas completas a todas as 78 cartas — tornando-o acessível para estudo e leitura intuitiva.`,
    reflection: "Antes de começar seus estudos, reflita: o que te trouxe ao tarô? Que perguntas você carrega? Anote suas motivações — elas serão seu norte ao longo da jornada.",
    exercise: { instruction: "Escreva em seu caderno: 'Eu cheguei ao tarô porque...' Complete a frase com sinceridade. Guarde essa resposta — você vai revisitá-la ao final do módulo.", type: "writing" },
    quiz: [
      {
        id: "fund-1-q1",
        question: "O tarô é primariamente uma ferramenta de:",
        options: ["Adivinhação do futuro", "Autoconhecimento e reflexão", "Jogos de azar", "Comunicação com espíritos"],
        correctIndex: 1,
        explanation: "O tarô é um sistema simbólico de autoconhecimento que revela padrões e possibilidades, não um instrumento de adivinhação determinística.",
      },
      {
        id: "fund-1-q2",
        question: "Em que século o tarô surgiu como jogo de cartas?",
        options: ["Século X", "Século XV", "Século XVIII", "Século XX"],
        correctIndex: 1,
        explanation: "O tarô nasceu no norte da Itália no século XV como um jogo de cartas para a nobreza, chamado 'tarocchi'.",
      },
      {
        id: "fund-1-q3",
        question: "O que o tarô revela em uma leitura?",
        options: ["O futuro exato", "Padrões, tendências e possibilidades", "Apenas o passado", "Números da sorte"],
        correctIndex: 1,
        explanation: "O tarô revela padrões e possibilidades, funcionando como um espelho que reflete aspectos da experiência humana.",
      },
    ],
  },
  {
    id: "fund-2",
    order: 1,
    title: "Como o Baralho é Organizado",
    subtitle: "78 cartas, um universo completo",
    icon: "🃏",
    content: `O baralho de tarô é composto por 78 cartas, divididas em dois grandes grupos:

**Arcanos Maiores** — 22 cartas numeradas de 0 a 21. São os grandes temas da existência: arquétipos universais que representam forças, ciclos e transformações profundas. Do Louco (0) ao Mundo (XXI), eles contam a história da evolução da consciência humana.

**Arcanos Menores** — 56 cartas divididas em quatro naipes: Copas, Paus, Espadas e Ouros. Cada naipe tem 14 cartas: do Ás ao 10, mais quatro cartas da corte (Pajem, Cavaleiro, Rainha e Rei). Os Arcanos Menores tratam das situações cotidianas e das nuances da vida diária.

Juntos, os 78 arcanos formam um mapa completo da experiência humana — do cósmico ao mundano, do espiritual ao prático.

Nesta plataforma, começamos pelos Arcanos Maiores porque eles são a espinha dorsal do tarô. Dominá-los é dominar os fundamentos de toda leitura.`,
    keyPoints: [
      "78 cartas no total: 22 Maiores + 56 Menores",
      "Arcanos Maiores = grandes temas e arquétipos universais",
      "Arcanos Menores = 4 naipes com 14 cartas cada",
      "Os quatro naipes: Copas, Paus, Espadas e Ouros",
    ],
    deepDive: `Os quatro naipes dos Arcanos Menores correspondem aos quatro elementos clássicos:

• **Copas** → Água → Emoções, relacionamentos, intuição
• **Paus** → Fogo → Ação, criatividade, paixão, vontade
• **Espadas** → Ar → Mente, pensamento, conflito, verdade
• **Ouros** → Terra → Matéria, corpo, dinheiro, manifestação

As cartas da corte (Pajem, Cavaleiro, Rainha, Rei) representam diferentes níveis de maturidade e expressão de cada elemento. O Pajem é o aprendiz, o Cavaleiro é a ação, a Rainha é a maestria receptiva e o Rei é a maestria ativa.

Os números de 1 a 10 seguem um arco narrativo dentro de cada naipe: do potencial (Ás) ao cumprimento (10), passando por desenvolvimento, conflito e resolução.`,
    reflection: "Pegue um baralho de tarô (ou procure imagens online) e separe os Arcanos Maiores dos Menores. Observe as diferenças visuais. O que os Maiores parecem transmitir de diferente?",
    exercise: { instruction: "Procure uma imagem do baralho completo de tarô online. Conte quantos Arcanos Maiores e quantos Menores existem. Identifique os 4 naipes e anote qual elemento corresponde a cada um.", type: "observation" },
    quiz: [
      {
        id: "fund-2-q1",
        question: "Quantas cartas compõem o baralho de tarô?",
        options: ["52", "72", "78", "88"],
        correctIndex: 2,
        explanation: "O baralho de tarô tem 78 cartas: 22 Arcanos Maiores e 56 Arcanos Menores.",
      },
      {
        id: "fund-2-q2",
        question: "Quantos Arcanos Maiores existem?",
        options: ["12", "22", "26", "56"],
        correctIndex: 1,
        explanation: "São 22 Arcanos Maiores, numerados de 0 (O Louco) a 21 (O Mundo).",
      },
      {
        id: "fund-2-q3",
        question: "Quais são os quatro naipes dos Arcanos Menores?",
        options: [
          "Copas, Paus, Espadas e Ouros",
          "Corações, Diamantes, Paus e Espadas",
          "Fogo, Água, Terra e Ar",
          "Sol, Lua, Estrela e Mundo",
        ],
        correctIndex: 0,
        explanation: "Os quatro naipes são Copas (Água), Paus (Fogo), Espadas (Ar) e Ouros (Terra).",
      },
      {
        id: "fund-2-q4",
        question: "Cada naipe dos Arcanos Menores possui quantas cartas?",
        options: ["10", "12", "14", "16"],
        correctIndex: 2,
        explanation: "Cada naipe tem 14 cartas: do Ás ao 10, mais Pajem, Cavaleiro, Rainha e Rei.",
      },
    ],
  },
  {
    id: "fund-3",
    order: 2,
    title: "Arcanos Maiores e Menores",
    subtitle: "O cósmico e o cotidiano",
    icon: "⚖️",
    content: `A diferença entre Arcanos Maiores e Menores não é de importância — é de escala.

**Arcanos Maiores** representam forças arquetípicas, temas existenciais e grandes movimentos da alma. Quando aparecem em uma leitura, sinalizam que algo significativo está em jogo — uma lição de vida, uma transformação profunda, um chamado do destino.

**Arcanos Menores** representam as experiências cotidianas, as emoções do dia a dia, as decisões práticas e os desafios que enfrentamos na vida comum. Eles dão textura e detalhe à leitura.

Uma analogia útil: os Arcanos Maiores são como os capítulos de um livro — grandes viradas na história. Os Arcanos Menores são os parágrafos — os detalhes que dão vida à narrativa.

Em uma leitura com muitos Arcanos Maiores, forças poderosas estão em movimento. Em uma leitura com mais Menores, o foco está no cotidiano e nas escolhas práticas.

Ambos são essenciais. Uma leitura completa usa os dois em harmonia.`,
    keyPoints: [
      "Não é questão de importância, mas de escala",
      "Maiores = forças arquetípicas e grandes transformações",
      "Menores = experiências cotidianas e decisões práticas",
      "Uma leitura completa integra ambos",
    ],
    reflection: "Em sua vida agora, o que parece ser um 'tema maior' (transformação profunda) e o que parece ser 'tema menor' (desafio do dia a dia)? Como eles se conectam?",
    exercise: { instruction: "Pense em 3 situações da sua vida atual. Classifique cada uma como 'Arcano Maior' (grande tema existencial) ou 'Arcano Menor' (desafio do cotidiano). Anote por quê.", type: "reflection" },
    quiz: [
      {
        id: "fund-3-q1",
        question: "Os Arcanos Maiores representam:",
        options: ["Eventos do dia a dia", "Forças arquetípicas e temas existenciais", "Apenas o futuro", "Apenas o passado"],
        correctIndex: 1,
        explanation: "Os Arcanos Maiores representam forças arquetípicas, temas existenciais e grandes movimentos da alma.",
      },
      {
        id: "fund-3-q2",
        question: "Uma leitura com muitos Arcanos Maiores indica:",
        options: ["Nada especial", "Forças poderosas em movimento", "Problemas financeiros", "Que a leitura está errada"],
        correctIndex: 1,
        explanation: "Muitos Arcanos Maiores indicam que forças significativas estão em jogo — transformações profundas e lições de vida.",
      },
      {
        id: "fund-3-q3",
        question: "A melhor analogia para Maiores vs. Menores é:",
        options: [
          "Importantes vs. não importantes",
          "Capítulos vs. parágrafos de um livro",
          "Passado vs. futuro",
          "Positivos vs. negativos",
        ],
        correctIndex: 1,
        explanation: "Os Maiores são como capítulos (grandes viradas) e os Menores como parágrafos (detalhes que dão vida à narrativa).",
      },
    ],
  },
  {
    id: "fund-4",
    order: 3,
    title: "Símbolos, Imagem e Leitura",
    subtitle: "A linguagem das imagens",
    icon: "🔮",
    content: `Todo elemento visual em uma carta de tarô carrega significado. Cores, números, animais, plantas, objetos, posturas corporais, direção do olhar — nada é acidental.

A simbologia é a linguagem que o tarô usa para comunicar. Aprender a ler símbolos é como aprender um novo idioma: no início parece misterioso, mas com prática se torna natural.

**Cores** comunicam energia: o vermelho fala de paixão e ação; o azul, de intuição e profundidade; o amarelo, de consciência e intelecto; o branco, de pureza e potencial.

**Números** contam uma história: o 1 é começo, o 3 é criação, o 7 é busca interior, o 10 é completude.

**Elementos naturais** — montanhas, rios, flores, animais — revelam forças internas e externas atuando na situação.

A chave é: não decore símbolos isolados. Aprenda a ler a carta como uma cena completa, onde todos os elementos conversam entre si.`,
    keyPoints: [
      "Nada é acidental numa carta de tarô",
      "Cores, números, animais e objetos carregam significado",
      "Simbologia é uma linguagem — aprende-se com prática",
      "Leia a carta como uma cena, não como símbolos isolados",
    ],
    deepDive: `Alguns dos símbolos mais recorrentes no tarô Rider-Waite-Smith:

• **Rosa** — paixão, desejo, beleza, amor; a cor indica a variação (branca = pureza, vermelha = paixão)
• **Lírio** — pureza, inocência, espiritualidade
• **Montanha** — desafio, obstáculo, elevação espiritual
• **Água** — emoções, inconsciente, fluxo da vida
• **Coroa** — autoridade, poder, realização
• **Chave** — conhecimento, segredo, abertura de caminhos
• **Lua** — intuição, mistério, ciclos, o feminino
• **Sol** — consciência, vitalidade, verdade, clareza
• **Serpente** — transformação, sabedoria, tentação

Cada símbolo muda de significado conforme o contexto da carta. A mesma água pode ser calma ou tempestuosa, indicando emoções serenas ou turbulentas.`,
    reflection: "Escolha uma carta de tarô e observe-a por 3 minutos em silêncio. Anote todos os símbolos que identificar. Depois, tente imaginar o que cada um comunica. Não busque respostas 'certas' — confie nas suas impressões.",
    exercise: { instruction: "Escolha qualquer carta de tarô. Liste pelo menos 5 símbolos visuais que você observa (cores, objetos, animais, posturas). Para cada um, escreva uma palavra que ele evoca em você.", type: "observation" },
    quiz: [
      {
        id: "fund-4-q1",
        question: "No tarô, os elementos visuais das cartas são:",
        options: ["Puramente decorativos", "Intencionais e carregados de significado", "Aleatórios", "Apenas artísticos"],
        correctIndex: 1,
        explanation: "Nada é acidental numa carta de tarô. Cores, números, objetos e elementos naturais carregam significado simbólico.",
      },
      {
        id: "fund-4-q2",
        question: "Qual é a melhor forma de ler os símbolos de uma carta?",
        options: [
          "Decorar cada símbolo isolado",
          "Ler a carta como uma cena completa",
          "Ignorar os detalhes e focar no nome",
          "Consultar tabelas para cada elemento",
        ],
        correctIndex: 1,
        explanation: "A chave é ler a carta como uma cena completa, onde todos os elementos conversam entre si.",
      },
      {
        id: "fund-4-q3",
        question: "A cor azul no tarô geralmente representa:",
        options: ["Paixão e ação", "Intuição e profundidade", "Riqueza material", "Perigo"],
        correctIndex: 1,
        explanation: "O azul no tarô comunica intuição, profundidade emocional e conexão com o inconsciente.",
      },
    ],
  },
  {
    id: "fund-5",
    order: 4,
    title: "Palavra-chave, Contexto e Interpretação",
    subtitle: "Da superfície à profundidade",
    icon: "📖",
    content: `Um dos maiores erros no estudo do tarô é depender exclusivamente de palavras-chave. "A Imperatriz = abundância." "A Torre = destruição." Essas simplificações podem ser um ponto de partida, mas nunca devem ser o destino.

Cada carta é um universo em si. A Imperatriz não é apenas abundância — ela é fertilidade, nutrição, criatividade, sensualidade, conexão com a natureza, maternidade e o princípio feminino criador. Qual dessas camadas se aplica depende do contexto da leitura.

Para ir além da palavra-chave:

1. **Observe a imagem** — O que está acontecendo na cena? Quem está ali? O que estão fazendo?
2. **Note as emoções** — O que você sente ao olhar para a carta? Paz? Tensão? Curiosidade?
3. **Considere o contexto** — Qual é a pergunta? Quais cartas estão ao redor?
4. **Conecte com a vida** — Como essa energia se manifesta na situação real?

Ler tarô é interpretar, não traduzir. É como poesia — o significado nasce da relação entre as palavras, não da definição de cada uma.`,
    keyPoints: [
      "Palavras-chave são ponto de partida, não destino",
      "Cada carta tem múltiplas camadas de significado",
      "O contexto da leitura determina qual camada se aplica",
      "Ler tarô é interpretar, não traduzir",
    ],
    reflection: "Pegue a carta 'A Estrela' (ou procure uma imagem). Sem consultar nenhum livro, escreva três frases sobre o que ela comunica para você. Depois compare com um livro de referência e note as similaridades.",
    exercise: { instruction: "Escolha uma carta e escreva 3 significados possíveis em 3 contextos diferentes: amor, trabalho e espiritualidade. Note como a mesma carta muda de sentido conforme a pergunta.", type: "practice" },
    quiz: [
      {
        id: "fund-5-q1",
        question: "Depender apenas de palavras-chave no tarô é:",
        options: ["A melhor abordagem", "Um bom método avançado", "Uma simplificação que limita a leitura", "Impossível de evitar"],
        correctIndex: 2,
        explanation: "Palavras-chave são um ponto de partida, mas limitar-se a elas empobrece a leitura e ignora as múltiplas camadas de cada carta.",
      },
      {
        id: "fund-5-q2",
        question: "Para ir além da palavra-chave, o primeiro passo é:",
        options: ["Memorizar mais palavras-chave", "Observar a imagem da carta", "Consultar a internet", "Perguntar a outra pessoa"],
        correctIndex: 1,
        explanation: "Observar a imagem — o que acontece na cena, quem está ali, o que estão fazendo — é o primeiro passo para uma leitura mais profunda.",
      },
      {
        id: "fund-5-q3",
        question: "Ler tarô se parece mais com:",
        options: ["Traduzir um texto técnico", "Interpretar poesia", "Resolver uma equação", "Seguir uma receita"],
        correctIndex: 1,
        explanation: "Ler tarô é interpretar, como poesia — o significado nasce da relação entre os elementos, não da definição isolada de cada um.",
      },
    ],
  },
  {
    id: "fund-6",
    order: 5,
    title: "Como Estudar com Profundidade",
    subtitle: "Compreensão vence memorização",
    icon: "🧠",
    content: `Muitas pessoas desistem do tarô porque acham que precisam decorar 78 significados. A boa notícia: você não precisa.

O estudo do tarô é um processo de compreensão, não de memorização. Quando você entende a lógica por trás dos símbolos, os números e os elementos, os significados surgem naturalmente.

**Estratégias que funcionam:**

• **Estude uma carta por vez** — Mergulhe em cada arcano antes de passar ao próximo. Qualidade importa mais que quantidade.
• **Conte a história** — Cada carta tem uma narrativa visual. Conte essa história em voz alta ou por escrito. Histórias são mais fáceis de lembrar que definições.
• **Faça conexões pessoais** — Quando estudar A Imperatriz, pense: "Em que momentos da minha vida eu vivi essa energia?" Conexões pessoais fixam mais que fichas de estudo.
• **Pratique leitura cedo** — Não espere "saber tudo" para praticar. Faça tiragens simples desde o início.
• **Revise com espaçamento** — Volte a uma carta dias depois. A revisão espaçada é cientificamente comprovada como o método mais eficaz de retenção.

A plataforma foi projetada para esse método: lições curtas, camadas opcionais, exercícios práticos e revisão inteligente.`,
    keyPoints: [
      "Não é preciso decorar 78 significados",
      "Compreensão e conexão pessoal vencem memorização",
      "Conte histórias, não decore definições",
      "Pratique leitura desde cedo, não espere saber tudo",
    ],
    reflection: "Escolha um arcano que você já conheça superficialmente. Em vez de ler sobre ele, tente recontar sua 'história visual' de memória. O que lembra? O que esqueceu? Essa lacuna é sua próxima investigação.",
    exercise: { instruction: "Escolha um arcano e conte sua história visual em voz alta ou por escrito, como se estivesse explicando para uma amiga. Não consulte nada — use apenas o que lembra. Depois compare.", type: "practice" },
    quiz: [
      {
        id: "fund-6-q1",
        question: "A melhor forma de estudar tarô é:",
        options: [
          "Decorar todas as 78 cartas antes de praticar",
          "Compreender a lógica dos símbolos e fazer conexões pessoais",
          "Ler apenas livros teóricos",
          "Assistir vídeos sem praticar",
        ],
        correctIndex: 1,
        explanation: "O estudo eficaz do tarô é baseado em compreensão e conexão pessoal, não em memorização mecânica.",
      },
      {
        id: "fund-6-q2",
        question: "Quando você deve começar a praticar leituras?",
        options: ["Só depois de estudar todas as cartas", "Desde o início dos estudos", "Após dois anos de estudo", "Nunca — apenas estude teoria"],
        correctIndex: 1,
        explanation: "Praticar desde cedo fortalece o aprendizado. Não espere 'saber tudo' — faça tiragens simples desde o início.",
      },
      {
        id: "fund-6-q3",
        question: "A revisão espaçada é eficaz porque:",
        options: [
          "É mais rápida que outros métodos",
          "Fortalece a retenção ao revisitar conteúdo em intervalos crescentes",
          "Evita o estudo aprofundado",
          "Funciona apenas para idiomas",
        ],
        correctIndex: 1,
        explanation: "A revisão espaçada é cientificamente comprovada como o método mais eficaz de retenção a longo prazo.",
      },
    ],
  },
  {
    id: "fund-7",
    order: 6,
    title: "Intuição e Método",
    subtitle: "Os dois pilares da leitura",
    icon: "✨",
    content: `No tarô, intuição e estrutura não são opostos — são complementares. Uma leitura poderosa nasce da combinação dos dois.

**Estrutura** é o que você aprende: os significados tradicionais, a simbologia, os números, os elementos, as posições na tiragem. É o vocabulário do tarô. Sem estrutura, você não tem base para interpretar.

**Intuição** é o que você sente: as impressões que surgem ao olhar para as cartas, as conexões inesperadas, o "estalo" que acontece quando uma carta fala diretamente sobre a situação. Sem intuição, a leitura fica mecânica e sem alma.

O erro mais comum de iniciantes é achar que precisa escolher um ou outro. "Sou mais intuitiva" ou "Preciso de regras claras." Na verdade, os melhores leitores transitam entre os dois com fluidez.

**Como desenvolver ambos:**
• Estude a simbologia (estrutura) e pratique meditação com as cartas (intuição)
• Faça leituras onde primeiro anota suas impressões intuitivas, depois consulta os significados tradicionais
• Com o tempo, os dois se fundem — você sabe o significado e sente a mensagem ao mesmo tempo`,
    keyPoints: [
      "Intuição e estrutura são complementares, não opostos",
      "Estrutura = vocabulário e regras do tarô",
      "Intuição = impressões, sensações e conexões",
      "Os melhores leitores integram ambos naturalmente",
    ],
    reflection: "Tire uma carta aleatoriamente. Antes de pensar no significado 'oficial', anote em uma frase o que você sente. Depois consulte o significado. O que sua intuição captou que combina com a tradição?",
    exercise: { instruction: "Tire uma carta sem olhar. Antes de virar, respire fundo. Ao virar, anote a PRIMEIRA impressão — uma palavra ou frase. Depois consulte o significado tradicional. Compare as duas respostas.", type: "practice" },
    quiz: [
      {
        id: "fund-7-q1",
        question: "A relação entre intuição e estrutura no tarô é:",
        options: [
          "São opostos — escolha um",
          "São complementares e devem ser integrados",
          "Estrutura é mais importante",
          "Intuição é mais importante",
        ],
        correctIndex: 1,
        explanation: "Intuição e estrutura são complementares. Uma leitura poderosa nasce da combinação dos dois pilares.",
      },
      {
        id: "fund-7-q2",
        question: "O que acontece com uma leitura que tem apenas estrutura, sem intuição?",
        options: ["Fica perfeita", "Fica mecânica e sem alma", "É mais confiável", "Funciona melhor para iniciantes"],
        correctIndex: 1,
        explanation: "Sem intuição, a leitura fica mecânica — tecnicamente correta, mas sem a profundidade e a conexão que tornam o tarô transformador.",
      },
      {
        id: "fund-7-q3",
        question: "Uma boa forma de desenvolver intuição é:",
        options: [
          "Ignorar os significados tradicionais",
          "Meditar com as cartas e anotar impressões antes de consultar significados",
          "Ler apenas livros",
          "Evitar praticar até se sentir pronta",
        ],
        correctIndex: 1,
        explanation: "Anotar suas impressões intuitivas antes de consultar significados treina a percepção e fortalece a confiança na sua intuição.",
      },
    ],
  },
  {
    id: "fund-8",
    order: 7,
    title: "Ética da Leitura",
    subtitle: "Responsabilidade com as palavras",
    icon: "⚜️",
    content: `Ler tarô para alguém é um ato de responsabilidade. As palavras ditas durante uma leitura podem afetar profundamente a pessoa que as recebe. Por isso, ética não é opcional — é fundamental.

**Princípios éticos da leitora de tarô:**

1. **Não diagnostique** — O tarô não substitui médicos, psicólogos ou profissionais de saúde. Nunca faça diagnósticos de saúde, mentais ou emocionais.

2. **Não manipule** — Use a leitura para empoderar, não para criar dependência. A consulente deve sair mais forte, não mais perdida.

3. **Respeite o livre-arbítrio** — O tarô mostra possibilidades, não destinos inevitáveis. Sempre reforce que a pessoa tem poder de escolha.

4. **Mantenha sigilo** — O que é dito em uma leitura é confidencial. Nunca compartilhe informações de consulentes.

5. **Cuide de si** — Antes de ler para outros, esteja em um estado emocional equilibrado. Estabeleça limites saudáveis.

6. **Não leia sobre terceiros ausentes** — Ler sobre a vida de alguém que não está presente e não consentiu é invasivo.

A postura ética não é uma limitação — é o que diferencia uma leitora séria de uma pessoa que apenas "joga cartas."`,
    keyPoints: [
      "Ler tarô é um ato de responsabilidade",
      "Nunca diagnosticar, manipular ou criar dependência",
      "Respeitar livre-arbítrio e confidencialidade",
      "A ética diferencia leitoras sérias",
    ],
    reflection: "Imagine que uma pessoa lhe pergunta se vai morrer em breve. Como você responderia com ética? Reflita sobre os limites do tarô e onde começa a responsabilidade profissional de outras áreas.",
    exercise: { instruction: "Escreva 3 perguntas que você NÃO responderia com tarô e explique por quê. Depois escreva 3 perguntas que o tarô pode ajudar a responder de forma ética.", type: "writing" },
    quiz: [
      {
        id: "fund-8-q1",
        question: "Qual é a postura correta diante de uma pergunta sobre saúde?",
        options: [
          "Interpretar a carta como diagnóstico",
          "Orientar a buscar um profissional de saúde",
          "Fazer uma tiragem especial para saúde",
          "Dar conselhos médicos baseados nas cartas",
        ],
        correctIndex: 1,
        explanation: "O tarô não substitui profissionais de saúde. A postura ética é orientar a pessoa a buscar ajuda profissional.",
      },
      {
        id: "fund-8-q2",
        question: "O objetivo de uma leitura ética é:",
        options: [
          "Criar dependência do consulente",
          "Impressionar com previsões específicas",
          "Empoderar a pessoa para fazer suas próprias escolhas",
          "Mostrar que a leitora sabe mais que o consulente",
        ],
        correctIndex: 2,
        explanation: "Uma leitura ética empodera — a consulente deve sair mais forte e com mais clareza, não mais dependente ou perdida.",
      },
      {
        id: "fund-8-q3",
        question: "Ler sobre a vida de terceiros ausentes é:",
        options: ["Aceitável se pedirem", "Invasivo e antiético", "A prática mais comum", "Necessário para leituras completas"],
        correctIndex: 1,
        explanation: "Ler sobre alguém que não está presente e não consentiu é uma invasão de privacidade e viola princípios éticos.",
      },
    ],
  },
  {
    id: "fund-9",
    order: 8,
    title: "A Jornada do Louco",
    subtitle: "O caminho de evolução dos 22 Arcanos",
    icon: "◎",
    content: `Os 22 Arcanos Maiores não são cartas aleatórias — eles contam uma história. Essa história é chamada de "A Jornada do Louco".

O Louco (0) é o protagonista. Ele parte sem mapa, sem garantias, carregando apenas sua trouxinha de experiências inconscientes. E ao longo do caminho, encontra cada um dos 21 arcanos restantes — cada um representando um mestre, uma lição, um desafio ou uma transformação.

**O percurso se divide em grandes fases:**

1. **Mundo Material (I-VII)** — O Louco aprende sobre poder, sabedoria, amor, autoridade e vontade. É a fase da estruturação no mundo exterior.

2. **Mundo Interior (VIII-XIV)** — O Louco se volta para dentro. Encontra sua força interior, aceita a solidão, aprende a se render e descobre a alquimia da integração.

3. **Travessia Sombria (XV-XVIII)** — O Louco enfrenta suas sombras mais profundas: ilusões, destruição, esperança frágil e os medos do inconsciente.

4. **Iluminação (XIX-XXI)** — O Louco renasce. Encontra clareza, propósito e completude. No Mundo (XXI), a jornada se fecha — e recomeça.

Compreender a Jornada do Louco é ter um mapa completo do tarô.`,
    keyPoints: [
      "Os 22 Arcanos contam uma história de evolução",
      "O Louco é o protagonista — todos somos o Louco",
      "A jornada tem 4 fases: material, interior, sombria, iluminação",
      "Cada arcano é um mestre ou lição no caminho",
    ],
    deepDive: `A Jornada do Louco foi sistematizada por Eden Gray em "A Complete Guide to the Tarot" (1970) e popularizada por muitos autores desde então. Ela reflete a estrutura do "monomito" de Joseph Campbell — a Jornada do Herói.

Tanto no tarô quanto na jornada heroica, o protagonista:
1. Parte de um mundo comum (O Louco salta)
2. Encontra mentores e desafios (Mago, Sacerdotisa, etc.)
3. Enfrenta uma crise e morte simbólica (A Morte, A Torre)
4. Renasce transformado (O Sol, O Julgamento, O Mundo)

Carl Jung via nos arcanos do tarô representações dos arquétipos do inconsciente coletivo. A jornada do Louco seria, nessa leitura, o processo de individuação — a integração de todas as partes do ser em direção à totalidade.`,
    reflection: "Em que fase da Jornada do Louco você sente que está agora? Mundo material? Mundo interior? Travessia sombria? Iluminação? Não há resposta errada — apenas consciência.",
    exercise: { instruction: "Desenhe uma linha reta no papel e marque 4 pontos: Material, Interior, Sombra, Iluminação. Coloque um 'X' onde você sente que está agora na sua vida. Escreva uma frase sobre por quê.", type: "reflection" },
    quiz: [
      {
        id: "fund-9-q1",
        question: "A Jornada do Louco é:",
        options: [
          "Uma tiragem especial",
          "A narrativa de evolução contada pelos 22 Arcanos Maiores",
          "Um baralho específico",
          "Uma invenção moderna sem base tradicional",
        ],
        correctIndex: 1,
        explanation: "A Jornada do Louco é a narrativa de evolução e transformação contada sequencialmente pelos 22 Arcanos Maiores.",
      },
      {
        id: "fund-9-q2",
        question: "Na fase 'Travessia Sombria', o Louco encontra:",
        options: [
          "Amor e prosperidade",
          "Poder e autoridade",
          "Ilusões, destruição e medos profundos",
          "Completude e paz",
        ],
        correctIndex: 2,
        explanation: "A Travessia Sombria (XV-XVIII) é a fase onde o Louco enfrenta suas sombras: ilusões (Diabo), destruição (Torre), esperança (Estrela) e medos (Lua).",
      },
      {
        id: "fund-9-q3",
        question: "Quem é o protagonista da Jornada do Louco?",
        options: ["O Mago", "A Sacerdotisa", "O Louco — e todos nós", "O Mundo"],
        correctIndex: 2,
        explanation: "O Louco é o protagonista — e todos nós somos o Louco, percorrendo nossa própria jornada de evolução.",
      },
    ],
  },
  {
    id: "fund-10",
    order: 9,
    title: "Como Usar a Plataforma",
    subtitle: "Seu método de estudo",
    icon: "🌟",
    content: `O método de ensino desta plataforma foi construído para unir clareza, profundidade e experiência.

Em vez de apresentar o tarô como uma coleção de significados soltos, o conteúdo é organizado como uma trilha progressiva de aprendizagem, onde cada etapa prepara a próxima.

A base simbólica principal é o tarô Rider-Waite-Smith. A partir dele, cada carta é estudada em diferentes camadas: essência, símbolos visuais, arquétipo, luz, sombra, aplicação prática e leitura aprofundada. Isso permite que você não apenas memorize, mas compreenda.

**Cada lição é dividida em cinco níveis de experiência:**

1. **Conteúdo principal** — Curto e obrigatório. A essência da carta.

2. **Aprofundamento** — Opcional, para quem quer ir mais fundo.

3. **Materiais extras** — Curiosidades, mitologia, conexões culturais.

4. **Exercício prático** — Reflexão pessoal guiada conectando a carta à sua vida.

5. **Quiz de fixação** — Validação do que foi aprendido, com conquista de Chaves como recompensa.

A lógica pedagógica combina progressão gamificada com aprofundamento real. O estudo permanece leve e estimulante, sem perder densidade simbólica. Você pode avançar com fluidez, mas também pode mergulhar mais fundo quando desejar.

O objetivo é desenvolver leitura viva, repertório simbólico e autonomia interpretativa. Sua jornada começa aqui.`,
    keyPoints: [
      "Lições em camadas: conteúdo principal + aprofundamento opcional",
      "Cada arcano tem voz, exercício e quiz",
      "Revisão inteligente com repetição espaçada",
      "Base Rider-Waite-Smith para coerência total",
    ],
    reflection: "Agora que você conhece os fundamentos e o método, defina uma intenção para seus estudos. Escreva em uma frase: 'Eu estudo tarô porque...' Essa frase será sua bússola.",
    exercise: { instruction: "Releia a frase que você escreveu na Lição 1 ('Eu cheguei ao tarô porque...'). Agora reescreva: 'Eu estudo tarô para...' Compare as duas. O que mudou?", type: "writing" },
    quiz: [
      {
        id: "fund-10-q1",
        question: "O método pedagógico da plataforma usa:",
        options: [
          "Apenas vídeos longos",
          "Lições em camadas com conteúdo obrigatório e opcional",
          "Apenas flashcards",
          "Decoração de palavras-chave",
        ],
        correctIndex: 1,
        explanation: "A plataforma usa lições em camadas: conteúdo principal obrigatório e aprofundamento opcional, respeitando seu ritmo.",
      },
      {
        id: "fund-10-q2",
        question: "A 'voz do arcano' serve para:",
        options: [
          "Entretenimento apenas",
          "Criar conexão emocional e mnemônica com a carta",
          "Substituir o estudo teórico",
          "Imitar outros apps",
        ],
        correctIndex: 1,
        explanation: "A voz do arcano cria uma conexão emocional e mnemônica poderosa, ajudando a internalizar o significado de cada carta.",
      },
      {
        id: "fund-10-q3",
        question: "Qual baralho é a base simbólica da plataforma?",
        options: ["Tarot de Marselha", "Thoth Tarot", "Rider-Waite-Smith", "Tarot Egípcio"],
        correctIndex: 2,
        explanation: "O Rider-Waite-Smith (1909) é a base simbólica principal, garantindo coerência visual e interpretativa em todo o conteúdo.",
      },
    ],
  },
];

export function getFundamentosLesson(id: string): FundamentosLesson | undefined {
  return FUNDAMENTOS_LESSONS.find((l) => l.id === id);
}

export function getFundamentosLessonByOrder(order: number): FundamentosLesson | undefined {
  return FUNDAMENTOS_LESSONS.find((l) => l.order === order);
}
