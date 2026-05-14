export interface TiragemLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  whenToUse?: string[];
  infoBlocks?: { title: string; content: string }[];
  deepDive?: string;
  reflection?: string;
  layoutDiagram?: TiragemLayout;
  examples?: TiragemExample[];
  exercise: {
    instruction: string;
    type: "reflection" | "practice" | "observation" | "writing";
  };
  quiz: TiragemQuizQuestion[];
}

export interface TiragemLayout {
  name: string;
  positions: { label: string; description: string; x: number; y: number }[];
}

export interface TiragemExample {
  spread: string;
  question: string;
  cards: { position: string; card: string }[];
  interpretation: string;
}

export interface TiragemQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const TIRAGENS_LESSONS: TiragemLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 1 — O que é uma tiragem
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-1",
    order: 0,
    title: "O que é uma Tiragem",
    subtitle: "A estrutura por trás de toda leitura",
    icon: "🎴",
    content: `Tiragem é a **estrutura organizada** onde as cartas são dispostas para responder a uma pergunta. Sem tiragem, você tem cartas soltas — com tiragem, você tem uma leitura.

Pense na tiragem como um **mapa**: cada posição é um território com função definida. A carta que cai ali não fala "em geral" — ela fala **sobre aquele aspecto específico** da situação.

Uma tiragem faz três coisas fundamentais:

**1. Organiza a informação.** Em vez de interpretar cartas aleatoriamente, cada uma tem um papel claro: "esta fala do passado", "esta fala do obstáculo", "esta fala do conselho".

**2. Cria narrativa.** As posições definem a ordem da história — começo, meio e fim. A tiragem é o roteiro; as cartas são as personagens.

**3. Ancora o contexto.** A mesma carta muda de significado conforme a posição. O 10 de Espadas na posição "passado" é diferente do 10 de Espadas na posição "conselho". A posição é o filtro.

**Não existe tiragem "melhor".** Existe a tiragem certa para a pergunta certa. Uma dúvida simples pede uma tiragem simples. Uma questão complexa pede uma tiragem com mais posições. Escolher a tiragem certa é a primeira decisão da leitora.

Neste módulo, você vai aprender as tiragens mais poderosas e práticas — do básico ao avançado — e quando usar cada uma.`,
    keyPoints: [
      "Tiragem é a estrutura organizada que transforma cartas em leitura",
      "Cada posição tem função definida — a carta fala sobre aquele aspecto",
      "A mesma carta muda de significado conforme a posição",
      "Escolher a tiragem certa é a primeira decisão da leitora",
    ],
    deepDive: `As tiragens como conhecemos hoje são relativamente recentes na história do tarô. Nos séculos XV e XVI, as cartas eram usadas para jogos — não para leitura. As primeiras "tiragens" documentadas aparecem no século XVIII com Etteilla (Jean-Baptiste Alliette), que criou layouts sistemáticos para adivinhação.

A Cruz Celta, a tiragem mais famosa do mundo, foi popularizada por Arthur Edward Waite no início do século XX (em seu livro "The Pictorial Key to the Tarot", 1910). Desde então, centenas de tiragens foram criadas — mas as melhores seguem princípios simples:

1. **Clareza posicional** — cada posição tem função inequívoca
2. **Fluxo narrativo** — as posições contam uma história em sequência lógica
3. **Proporcionalidade** — o número de posições é adequado à complexidade da pergunta
4. **Complementaridade** — nenhuma posição é redundante

Leitoras experientes frequentemente criam suas próprias tiragens para situações específicas. Isso é perfeitamente válido — desde que cada posição tenha função clara e o conjunto faça sentido narrativo.`,
    exercise: {
      instruction: "Antes de aprender tiragens específicas, faça este exercício: escreva 5 perguntas diferentes sobre sua vida (uma simples, uma emocional, uma prática, uma complexa, uma sobre outra pessoa). Para cada uma, anote: quantas posições você acha que seriam necessárias? Que aspectos precisariam ser explorados? Isso vai desenvolver sua intuição para escolher tiragens.",
      type: "reflection",
    },
    quiz: [
      {
        id: "tir-1-q1",
        question: "Qual é a função principal de uma tiragem?",
        options: ["Decorar a mesa", "Organizar as cartas em uma estrutura com posições definidas que criam narrativa", "Impressionar o consulente", "Definir quantas cartas usar"],
        correctIndex: 1,
        explanation: "A tiragem organiza informação, cria narrativa e ancora o contexto — transforma cartas em leitura.",
      },
      {
        id: "tir-1-q2",
        question: "Por que a posição de uma carta na tiragem importa?",
        options: ["Não importa", "Por estética", "Porque a mesma carta muda de significado conforme a posição", "Porque define a cor da carta"],
        correctIndex: 2,
        explanation: "A posição é o filtro — o 10 de Espadas no 'passado' é diferente do 10 de Espadas no 'conselho'.",
      },
      {
        id: "tir-1-q3",
        question: "A primeira decisão da leitora ao iniciar uma leitura é:",
        options: ["Escolher a carta mais bonita", "Escolher a tiragem adequada à pergunta", "Embaralhar por muito tempo", "Acender uma vela"],
        correctIndex: 1,
        explanation: "Escolher a tiragem certa para a pergunta certa é o primeiro passo de uma leitura eficaz.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 2 — Como formular a pergunta
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-2",
    order: 1,
    title: "A Arte da Pergunta",
    subtitle: "Como formular perguntas que geram leituras claras",
    icon: "❓",
    content: `A qualidade da leitura começa **antes** de virar qualquer carta. Começa na pergunta. Uma boa pergunta gera uma boa leitura. Uma pergunta vaga gera uma leitura confusa.

**As 5 Regras da Boa Pergunta:**

**1. Seja específica.** "O que vai acontecer?" é vago demais. "Como posso melhorar minha situação financeira nos próximos 3 meses?" é preciso.

**2. Foque no que você pode influenciar.** "Ele vai voltar?" tira o poder da consulente. "O que posso fazer para lidar com essa separação?" devolve o poder.

**3. Evite perguntas de sim/não.** O tarô não é moeda — é espelho. Perguntas como "Vou conseguir o emprego?" limitam a leitura. "Que energias cercam esse processo seletivo?" abre possibilidades.

**4. Defina o horizonte temporal.** "O que preciso saber sobre minha carreira?" é eterno. "O que preciso saber sobre minha carreira nos próximos 6 meses?" é prático.

**5. Inclua "eu" ou "meu/minha".** A leitura é sobre a consulente, não sobre o universo. "Qual meu papel nessa dinâmica?" é melhor que "O que está acontecendo nessa dinâmica?"

**Fórmulas de pergunta poderosas:**
- "O que preciso saber sobre ___ neste momento?"
- "Como posso lidar melhor com ___?"
- "Que energia está influenciando ___?"
- "O que está bloqueando meu progresso em ___?"
- "Que conselho as cartas têm para mim sobre ___?"`,
    keyPoints: [
      "A qualidade da leitura começa na pergunta",
      "Seja específica, focada, com horizonte temporal",
      "Evite sim/não — use perguntas abertas",
      "Inclua 'eu/meu' — a leitura é sobre a consulente",
      "Use fórmulas: 'O que preciso saber sobre... neste momento?'",
    ],
    reflection: "Pense nas últimas perguntas que você fez ao tarô. Elas seguiam essas 5 regras? Reescreva 3 perguntas antigas usando as fórmulas sugeridas e observe como ficam mais poderosas.",
    exercise: {
      instruction: "Escreva 10 perguntas sobre diferentes áreas da sua vida usando as 5 regras e as fórmulas sugeridas. Para cada uma, identifique: qual tiragem seria mais adequada? (Você ainda não aprendeu todas — use sua intuição.) Ao final do módulo, volte aqui e reavalie suas escolhas.",
      type: "writing",
    },
    quiz: [
      {
        id: "tir-2-q1",
        question: "'Ele vai voltar para mim?' é uma boa pergunta porque:",
        options: ["É clara e objetiva", "Não — é uma pergunta de sim/não que tira o poder da consulente", "É específica", "Tem horizonte temporal"],
        correctIndex: 1,
        explanation: "Perguntas de sim/não limitam a leitura e tiram o poder da consulente. Melhor: 'Como posso lidar com essa separação?'",
      },
      {
        id: "tir-2-q2",
        question: "Uma boa pergunta para o tarô deve:",
        options: ["Ser vaga para dar liberdade", "Ser específica, focada no que a consulente pode influenciar, com horizonte temporal", "Ser sobre outra pessoa", "Ter resposta de sim ou não"],
        correctIndex: 1,
        explanation: "Especificidade, foco no que se pode influenciar e horizonte temporal geram leituras claras e úteis.",
      },
      {
        id: "tir-2-q3",
        question: "A fórmula 'O que preciso saber sobre ___ neste momento?' é poderosa porque:",
        options: ["É longa", "É aberta, focada na consulente e tem horizonte temporal implícito", "É mística", "Tem muitas palavras"],
        correctIndex: 1,
        explanation: "Combina abertura, foco pessoal e horizonte temporal — os 3 ingredientes de uma boa pergunta.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 3 — Tiragem de 1 carta
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-3",
    order: 2,
    title: "Tiragem de 1 Carta",
    subtitle: "A resposta direta — simples e poderosa",
    icon: "1️⃣",
    content: `A tiragem de 1 carta é a mais simples e, paradoxalmente, uma das mais difíceis de ler bem. Toda a leitura depende da sua capacidade de conectar uma única imagem à pergunta.

### Técnica da Imersão
1. Vire a carta e olhe por 30 segundos sem pensar.
2. Que emoção a imagem provoca em você?
3. Que detalhe visual chama mais atenção?
4. Conecte: como isso responde à pergunta?

### A Carta do Dia
Este é o exercício mais importante para quem estuda tarô. Toda manhã, pergunte: "Que energia acompanha meu dia hoje?" À noite, revise como essa energia se manifestou.

### A Armadilha
Não tire uma segunda carta porque "não entendeu" a primeira. A dificuldade é a mensagem — sente-se com ela.`,
    whenToUse: [
      "Perguntas simples e diretas",
      "Conselho rápido para o momento",
      "Exercício de 'Carta do Dia'",
      "Confirmação de uma intuição",
    ],
    infoBlocks: [
      {
        title: "O Essencial",
        content: "Sem passado ou futuro, o foco é a mensagem central e imediata do arcano."
      },
      {
        title: "Fluência Prática",
        content: "A melhor forma de memorizar significados é conectando uma carta a um evento real do seu dia."
      }
    ],
    keyPoints: [
      "Mensagem direta e sem distrações",
      "Ideal para treinamento diário e conselhos rápidos",
      "Exige foco total na conexão simbólica única",
      "Nunca tire uma 'carta de apoio' por insegurança",
    ],
    layoutDiagram: {
      name: "Tiragem de 1 Carta",
      positions: [
        { label: "Carta Única", description: "A mensagem central — o essencial", x: 50, y: 50 },
      ],
    },
    examples: [
      {
        spread: "Carta do Dia",
        question: "Que energia acompanha meu dia hoje?",
        cards: [{ position: "Carta Única", card: "A Temperança" }],
        interpretation: "Hoje pede equilíbrio e paciência. Não force, não apresse — o dia flui melhor quando você mistura diferentes demandas com calma e moderação. É um dia de harmonizar, não de revolucionar.",
      },
      {
        spread: "Conselho Rápido",
        question: "O que preciso saber sobre essa reunião de trabalho?",
        cards: [{ position: "Carta Única", card: "7 de Espadas" }],
        interpretation: "Atenção: nem tudo será dito abertamente. Alguém pode ter uma agenda oculta. Vá preparada, ouça mais do que fala, e confie na sua percepção — não nas palavras.",
      },
    ],
    exercise: {
      instruction: "Durante 7 dias consecutivos, tire 1 carta por dia pela manhã perguntando: 'Que energia acompanha meu dia hoje?' Anote a carta e sua interpretação. À noite, volte e escreva: como essa energia se manifestou? O que acertou? O que surpreendeu? Ao final de 7 dias, releia tudo e observe padrões.",
      type: "practice",
    },
    quiz: [
      {
        id: "tir-3-q1",
        question: "A tiragem de 1 carta é ideal para:",
        options: ["Questões complexas de vida", "Perguntas simples, carta do dia, conselho rápido", "Substituir terapia", "Prever o futuro exato"],
        correctIndex: 1,
        explanation: "Uma carta = uma mensagem direta. Perfeita para perguntas simples e prática diária.",
      },
      {
        id: "tir-3-q2",
        question: "Se você não entende a carta que tirou, deve:",
        options: ["Tirar outra carta", "Embaralhar de novo", "Ficar com a carta e refletir — a dificuldade é a mensagem", "Consultar a internet"],
        correctIndex: 2,
        explanation: "Nunca tire segunda carta por não entender. Sente-se com a primeira — a resistência é informação.",
      },
      {
        id: "tir-3-q3",
        question: "O exercício de 'Carta do Dia' constrói fluência porque:",
        options: ["É rápido", "Cria prática diária de conexão entre carta, pergunta e experiência vivida", "É fácil", "Todo mundo faz"],
        correctIndex: 1,
        explanation: "A prática diária conecta teoria, intuição e experiência — o caminho mais rápido para fluência.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 4 — Tiragem de 3 cartas
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-4",
    order: 3,
    title: "Tiragem de 3 Cartas",
    subtitle: "A tiragem mais versátil do tarô",
    icon: "3️⃣",
    content: `A tiragem de 3 cartas é a mais versátil que existe. Com apenas 3 posições, ela pode responder a quase qualquer pergunta — e é a base de todas as tiragens mais complexas.
    
### A Regra de Ouro
Antes de virar qualquer carta, **defina o formato**. Não vire as cartas e depois decida o que cada posição significa — isso é improvisação, não leitura.

### Leitura Cruzada
Além de ler cada posição isoladamente, leia os pares (1-2, 2-3, 1-3) e a tríade completa. A riqueza está nas conexões.`,
    whenToUse: [
      "Perguntas de complexidade média",
      "Entender a trajetória de uma situação",
      "Tomar decisões entre dois caminhos",
      "Análise holística (mente, corpo, espírito)",
    ],
    infoBlocks: [
      {
        title: "1. Passado / Presente / Futuro",
        content: "A narrativa temporal clássica. Revela de onde a situação veio, onde está agora e para onde tende a ir."
      },
      {
        title: "2. Situação / Obstáculo / Conselho",
        content: "Focado em resolução. Identifica o cenário real, o que está travando e a ação prática recomendada."
      },
      {
        title: "3. Mente / Corpo / Espírito",
        content: "Análise do ser. O que se pensa, o que se sente no físico e o que a alma está processando."
      },
      {
        title: "4. Opção A / O Que Considerar / Opção B",
        content: "Apoio à decisão. Compara dois caminhos e traz um elemento neutro para pesar a escolha."
      }
    ],
    keyPoints: [
      "Defina o formato ANTES de virar as cartas",
      "Leia posições individuais + pares + tríade completa",
      "Base para todas as tiragens complexas do tarô",
      "Versatilidade total para qualquer tema",
    ],
    layoutDiagram: {
      name: "Tiragem de 3 Cartas (Linear)",
      positions: [
        { label: "Posição 1", description: "Passado / Situação / Mente / Opção A", x: 20, y: 50 },
        { label: "Posição 2", description: "Presente / Obstáculo / Corpo / O que considerar", x: 50, y: 50 },
        { label: "Posição 3", description: "Futuro / Conselho / Espírito / Opção B", x: 80, y: 50 },
      ],
    },
    examples: [
      {
        spread: "Situação / Obstáculo / Conselho",
        question: "O que preciso saber sobre minha busca por um novo emprego?",
        cards: [
          { position: "Situação", card: "8 de Ouros" },
          { position: "Obstáculo", card: "4 de Copas" },
          { position: "Conselho", card: "Ás de Paus" },
        ],
        interpretation: "Você está fazendo o trabalho necessário (8 de Ouros — dedicação e prática), mas o obstáculo é a apatia emocional (4 de Copas — não enxergar oportunidades por desânimo). O conselho é buscar uma nova inspiração (Ás de Paus — um impulso criativo, uma abordagem completamente nova). Talvez o emprego certo esteja em uma área que você ainda não considerou.",
      },
    ],
    exercise: {
      instruction: "Escolha uma situação real da sua vida. Faça 4 leituras de 3 cartas — uma com cada formato (Passado/Presente/Futuro, Situação/Obstáculo/Conselho, Mente/Corpo/Espírito, Opção A/Considerar/Opção B). Compare: qual formato trouxe a leitura mais reveladora? Isso te ajuda a escolher formatos no futuro.",
      type: "practice",
    },
    quiz: [
      {
        id: "tir-4-q1",
        question: "A regra de ouro das 3 cartas é:",
        options: ["Virar as cartas rapidamente", "Definir o formato ANTES de virar as cartas", "Usar apenas Arcanos Maiores", "Escolher cartas bonitas"],
        correctIndex: 1,
        explanation: "Definir posições antes garante leitura estruturada — improvisar depois gera confusão.",
      },
      {
        id: "tir-4-q2",
        question: "O formato 'Situação / Obstáculo / Conselho' é ideal para:",
        options: ["Autoconhecimento", "Quando a pessoa precisa de orientação prática", "Prever o futuro", "Questões de saúde"],
        correctIndex: 1,
        explanation: "Esse formato identifica o problema, o bloqueio e oferece direção — prático e orientador.",
      },
      {
        id: "tir-4-q3",
        question: "Além de ler cada posição isolada, numa tiragem de 3 cartas você deve:",
        options: ["Nada mais", "Ler os pares (1-2, 2-3, 1-3) e a tríade completa", "Tirar mais cartas", "Ignorar a carta do meio"],
        correctIndex: 1,
        explanation: "A riqueza está nas conexões — pares e tríade completa revelam a narrativa integrada.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 5 — Passado, Presente e Futuro
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-5",
    order: 4,
    title: "Passado, Presente e Futuro",
    subtitle: "A tiragem temporal — o arco da história",
    icon: "⏳",
    content: `A tiragem temporal é a mais intuitiva. "De onde vim, onde estou, para onde vou" é a pergunta fundamental da jornada humana.

### O Futuro não é Destino
No tarô, o futuro é uma **tendência**. É o resultado provável se nada mudar. Você sempre tem o poder de alterar a direção.

### O Arco Narrativo
A leitura poderosa conecta as 3 posições numa história: "Porque [passado] aconteceu, o cenário atual é [presente], e a tendência é [futuro]."`,
    whenToUse: [
      "Entender a trajetória de um problema",
      "Identificar raízes de comportamentos",
      "Visualizar para onde uma situação caminha",
      "Relacionamentos e carreira",
    ],
    infoBlocks: [
      {
        title: "Passado: A Causa",
        content: "O que gerou a situação atual. O padrão ou evento que nos trouxe até aqui."
      },
      {
        title: "Presente: O Poder",
        content: "A energia dominante agora. É o único momento onde a mudança é possível."
      },
      {
        title: "Futuro: A Tendência",
        content: "Para onde a energia está fluindo. O desdobramento lógico do momento."
      }
    ],
    keyPoints: [
      "Futuro = tendência, não destino fixo",
      "Passado revela a causa; Presente revela o ponto de ação",
      "Crie uma história fluida entre os três tempos",
      "Evite para perguntas puramente existenciais",
    ],
    layoutDiagram: {
      name: "Passado / Presente / Futuro",
      positions: [
        { label: "Passado", description: "O que causou a situação — o padrão a reconhecer", x: 20, y: 50 },
        { label: "Presente", description: "A energia dominante agora — o ponto de poder", x: 50, y: 50 },
        { label: "Futuro", description: "A tendência — para onde a energia flui", x: 80, y: 50 },
      ],
    },
    examples: [
      {
        spread: "Passado / Presente / Futuro",
        question: "O que preciso saber sobre meu relacionamento atual?",
        cards: [
          { position: "Passado", card: "6 de Copas" },
          { position: "Presente", card: "2 de Espadas" },
          { position: "Futuro", card: "A Estrela" },
        ],
        interpretation: "O relacionamento nasceu de uma conexão nostálgica, talvez um amor antigo ou um padrão afetivo da infância (6 de Copas). Agora há uma decisão sendo evitada — algo precisa ser enfrentado, mas há medo de ver claramente (2 de Espadas). Se a consulente tiver coragem de abrir os olhos, a tendência é de cura e renovação (A Estrela) — mas é preciso sair da negação primeiro.",
      },
    ],
    exercise: {
      instruction: "Escolha 3 áreas diferentes (amor, trabalho, saúde/bem-estar). Para cada uma, faça uma tiragem Passado/Presente/Futuro. Pratique o arco narrativo: escreva cada leitura como uma história de 3 parágrafos — um para cada tempo. O passado explica o presente; o presente aponta para o futuro.",
      type: "practice",
    },
    quiz: [
      {
        id: "tir-5-q1",
        question: "A posição 'Futuro' no tarô indica:",
        options: ["O destino fixo e inevitável", "A tendência — o provável SE nada mudar", "Exatamente o que vai acontecer", "Algo que não pode ser evitado"],
        correctIndex: 1,
        explanation: "O futuro no tarô é tendência, não destino. A consulente sempre pode mudar a direção.",
      },
      {
        id: "tir-5-q2",
        question: "A posição 'Presente' é chamada de 'ponto de poder' porque:",
        options: ["É a carta mais forte", "É onde a mudança é possível — o único tempo que a consulente pode influenciar", "É a do meio", "Sempre traz boas notícias"],
        correctIndex: 1,
        explanation: "O presente é o único momento em que a consulente pode agir e mudar a trajetória.",
      },
      {
        id: "tir-5-q3",
        question: "Quando NÃO usar a tiragem temporal?",
        options: ["Nunca — sempre funciona", "Para perguntas sem dimensão temporal, como 'Quem eu sou?'", "Para questões de amor", "Quando chove"],
        correctIndex: 1,
        explanation: "Perguntas existenciais sem dimensão de tempo pedem outros formatos como Mente/Corpo/Espírito.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 6 — Situação, Obstáculo e Conselho
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-6",
    order: 5,
    title: "Situação, Obstáculo e Conselho",
    subtitle: "A tiragem de orientação prática",
    icon: "🧭",
    content: `Esta é a tiragem mais **prática** do tarô. Enquanto outras contam histórias, esta tiragem **resolve problemas**. É o formato ideal para quem busca uma direção imediata.

### O Valor do Obstáculo
A posição do obstáculo é frequentemente a mais desconfortável e valiosa. Ele pode ser externo (uma pessoa) ou interno (um medo). O bloqueio que você não vê é o que mais te prende.

### Conselho como Ação
Leia sempre o conselho como uma **ação concreta**. Mesmo cartas passivas indicam um movimento: "pare", "espere", "reflita".`,
    whenToUse: [
      "Quando você tem um problema claro",
      "Situações de bloqueio ou estagnação",
      "Quando a pergunta é: 'O que eu faço?'",
      "Busca por conselhos objetivos",
    ],
    infoBlocks: [
      {
        title: "1. Situação",
        content: "O cenário tal como ele é, sem os filtros da nossa percepção ou desejo."
      },
      {
        title: "2. Obstáculo",
        content: "O que trava o fluxo. Pode ser um desafio real ou uma autossabotagem."
      },
      {
        title: "3. Conselho",
        content: "A bússola. A melhor postura ou ação para lidar com o cenário apresentado."
      }
    ],
    keyPoints: [
      "Foco total em resolução e direção prática",
      "O Obstáculo revela o que você está ignorando",
      "O Conselho deve ser traduzido em ação esta semana",
      "Cartas positivas no obstáculo indicam excesso ou cegueira",
    ],
    layoutDiagram: {
      name: "Situação / Obstáculo / Conselho",
      positions: [
        { label: "Situação", description: "O que está realmente acontecendo", x: 20, y: 50 },
        { label: "Obstáculo", description: "O que bloqueia o caminho", x: 50, y: 50 },
        { label: "Conselho", description: "A ação recomendada", x: 80, y: 50 },
      ],
    },
    examples: [
      {
        spread: "Situação / Obstáculo / Conselho",
        question: "O que está bloqueando meu crescimento profissional?",
        cards: [
          { position: "Situação", card: "7 de Ouros" },
          { position: "Obstáculo", card: "A Lua" },
          { position: "Conselho", card: "Rei de Espadas" },
        ],
        interpretation: "Você está num momento de espera e investimento a longo prazo (7 de Ouros — os frutos ainda não vieram). O obstáculo é a confusão e os medos inconscientes (A Lua — ilusões sobre si mesma ou sobre o mercado). O conselho é adotar clareza mental e liderança intelectual (Rei de Espadas — cortar as ilusões com lógica, tomar decisões racionais, e comunicar com autoridade).",
      },
    ],
    exercise: {
      instruction: "Escolha um obstáculo real que você está enfrentando. Faça a tiragem Situação/Obstáculo/Conselho. Foque especialmente na posição 2 (Obstáculo): é externo ou interno? É algo que você já sabia ou uma surpresa? Transforme a posição 3 (Conselho) em uma ação concreta que você pode executar esta semana.",
      type: "practice",
    },
    quiz: [
      {
        id: "tir-6-q1",
        question: "Uma carta positiva (como O Sol) na posição de Obstáculo pode significar:",
        options: ["Não há obstáculo", "A leitura está errada", "Excesso de otimismo ou satisfação prematura impedindo progresso", "Sempre boa notícia"],
        correctIndex: 2,
        explanation: "Cartas 'positivas' no obstáculo indicam que algo aparentemente bom está na verdade bloqueando.",
      },
      {
        id: "tir-6-q2",
        question: "A posição 'Conselho' deve ser lida como:",
        options: ["Previsão do futuro", "Ação concreta recomendada", "O que vai acontecer", "Decoração"],
        correctIndex: 1,
        explanation: "Conselho = ação. Mesmo cartas passivas recomendam uma ação: descansar, esperar, refletir.",
      },
      {
        id: "tir-6-q3",
        question: "Esta tiragem é ideal quando a consulente:",
        options: ["Quer saber o futuro", "Tem um problema e precisa de direção prática", "Quer autoconhecimento profundo", "Não sabe o que perguntar"],
        correctIndex: 1,
        explanation: "Situação/Obstáculo/Conselho é a tiragem mais prática — resolve problemas e dá direção.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 7 — Leitura em Cruz
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-7",
    order: 6,
    title: "Leitura em Cruz",
    subtitle: "A tiragem de 5 posições — panorama completo",
    icon: "✝️",
    content: `A Cruz oferece um panorama completo sem a complexidade da Cruz Celta. É o formato intermediário perfeito — mais profundo que 3 cartas, mais acessível que 10.

### Leitura em Dois Eixos
A grande força desta tiragem é permitir a leitura de duas histórias simultâneas no mesmo layout.`,
    whenToUse: [
      "Análise profunda de uma situação",
      "Mapear influências conscientes e ocultas",
      "Visão de longo prazo com raízes no passado",
      "Transições de vida importantes",
    ],
    infoBlocks: [
      {
        title: "Eixo Horizontal (Temporal)",
        content: "Esquerda (Causa) ➔ Centro (Tema) ➔ Direita (Tendência). Conta a história no tempo."
      },
      {
        title: "Eixo Vertical (Psicológico)",
        content: "Acima (Consciente) ➔ Centro (Tema) ➔ Abaixo (Inconsciente). Revela o que se esconde."
      }
    ],
    keyPoints: [
      "Equilíbrio entre profundidade e simplicidade",
      "O Eixo vertical revela a motivação oculta (inconsciente)",
      "O Centro ancora toda a interpretação",
      "Ideal para quando a situação parece confusa ou nebulosa",
    ],
    layoutDiagram: {
      name: "Leitura em Cruz",
      positions: [
        { label: "Esquerda", description: "O passado — a causa, a raiz", x: 20, y: 50 },
        { label: "Centro", description: "O tema — a essência da questão", x: 50, y: 50 },
        { label: "Direita", description: "O futuro — a tendência", x: 80, y: 50 },
        { label: "Acima", description: "O consciente — o que se sabe", x: 50, y: 20 },
        { label: "Abaixo", description: "O inconsciente — o que se esconde", x: 50, y: 80 },
      ],
    },
    examples: [
      {
        spread: "Leitura em Cruz",
        question: "O que preciso entender sobre minha dificuldade com dinheiro?",
        cards: [
          { position: "Centro (Tema)", card: "5 de Ouros" },
          { position: "Esquerda (Causa)", card: "10 de Espadas" },
          { position: "Direita (Tendência)", card: "Ás de Ouros" },
          { position: "Acima (Consciente)", card: "4 de Ouros" },
          { position: "Abaixo (Inconsciente)", card: "A Imperatriz" },
        ],
        interpretation: "O tema é escassez e insegurança material (5 de Ouros). A causa foi um colapso — talvez uma perda financeira traumática ou um fim doloroso (10 de Espadas). A tendência é positiva — um novo começo material está surgindo (Ás de Ouros). Conscientemente, a consulente se agarra ao pouco que tem por medo (4 de Ouros — controle excessivo). Mas inconscientemente, há uma energia de abundância e criatividade reprimida (A Imperatriz) — ela tem capacidade de gerar riqueza, mas o medo do trauma passado impede que essa capacidade floresça.",
      },
    ],
    exercise: {
      instruction: "Faça uma Leitura em Cruz para uma questão importante. Depois de interpretar cada posição, leia os dois eixos separadamente: (1) o eixo horizontal conta que história temporal? (2) o eixo vertical conta que história psicológica? As duas histórias conversam? Se contradizem? A resposta está no diálogo entre os eixos.",
      type: "practice",
    },
    quiz: [
      {
        id: "tir-7-q1",
        question: "Na Leitura em Cruz, o eixo vertical (acima-centro-abaixo) representa:",
        options: ["O tempo", "A narrativa psicológica — consciente e inconsciente", "As finanças", "A saúde"],
        correctIndex: 1,
        explanation: "O eixo vertical revela o que a consulente sabe (acima) e o que está oculto (abaixo) — a dimensão psicológica.",
      },
      {
        id: "tir-7-q2",
        question: "A posição 'Abaixo' (Inconsciente) é frequentemente a mais reveladora porque:",
        options: ["É a última carta", "Mostra o que a consulente não vê ou não admite", "É a maior", "Está embaixo"],
        correctIndex: 1,
        explanation: "O que está oculto é frequentemente o que mais precisa de atenção — por isso surpreende e revela.",
      },
      {
        id: "tir-7-q3",
        question: "A Leitura em Cruz é ideal quando:",
        options: ["A pergunta é muito simples", "Você quer um panorama completo sem a complexidade da Cruz Celta", "Não sabe ler", "Quer impressionar"],
        correctIndex: 1,
        explanation: "5 posições oferecem profundidade sem complexidade excessiva — o equilíbrio perfeito.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 8 — Leitura para Decisões
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-8",
    order: 7,
    title: "Leitura para Decisões",
    subtitle: "Quando há dois caminhos — e é preciso escolher",
    icon: "⚖️",
    content: `Uma das perguntas mais comuns é: "Devo fazer A ou B?". Este layout compara dois caminhos de forma estruturada, trazendo lucidez para a escolha.

### O Tarô não Decide
O tarô mostra a **experiência** de cada caminho. A decisão final é sempre sua. Apresente os cenários sem julgar — o poder está na sua mão.`,
    whenToUse: [
      "Dúvida entre duas opções claras",
      "Troca de emprego ou residência",
      "Decisões de investimento",
      "Caminhos afetivos divergentes",
    ],
    infoBlocks: [
      {
        title: "Caminho A",
        content: "Analisa a energia da primeira opção e qual o resultado provável se você segui-la."
      },
      {
        title: "Caminho B",
        content: "Analisa a energia da segunda opção e o desdobramento natural desta escolha."
      },
      {
        title: "Você Agora",
        content: "O filtro central: seu estado emocional e mental diante da decisão."
      }
    ],
    keyPoints: [
      "Foca na comparação de energias e resultados",
      "Não busca o 'certo', mas o mais coerente para você",
      "A carta central revela se você está decidindo pelo medo ou lucidez",
      "Compare os pares (Energia + Resultado) de cada lado",
    ],
    layoutDiagram: {
      name: "Leitura para Decisões",
      positions: [
        { label: "Caminho A", description: "A energia da primeira opção", x: 20, y: 30 },
        { label: "Resultado A", description: "Onde o Caminho A provavelmente leva", x: 20, y: 70 },
        { label: "Você Agora", description: "Seu estado interno ao enfrentar a decisão", x: 50, y: 50 },
        { label: "Caminho B", description: "A energia da segunda opção", x: 80, y: 30 },
        { label: "Resultado B", description: "Onde o Caminho B provavelmente leva", x: 80, y: 70 },
      ],
    },
    examples: [
      {
        spread: "Leitura para Decisões",
        question: "Devo aceitar essa proposta de emprego ou ficar onde estou?",
        cards: [
          { position: "Você Agora", card: "2 de Espadas" },
          { position: "Caminho A (Aceitar)", card: "Cavaleiro de Paus" },
          { position: "Resultado A", card: "3 de Ouros" },
          { position: "Caminho B (Ficar)", card: "4 de Copas" },
          { position: "Resultado B", card: "9 de Ouros" },
        ],
        interpretation: "Você está em paralisia decisória (2 de Espadas — vendas nos olhos). Aceitar o novo emprego traz energia de ação e aventura (Cavaleiro de Paus) e leva a aprendizado e trabalho em equipe (3 de Ouros). Ficar traz apatia e tédio (4 de Copas — olhar para as oportunidades sem vê-las) mas leva a conforto material (9 de Ouros — segurança solitária). A questão é: você quer crescimento com risco ou conforto com estagnação?",
      },
    ],
    exercise: {
      instruction: "Pense em uma decisão real que você precisa tomar (pode ser pequena). Faça a Leitura para Decisões com 5 cartas. Após interpretar, escreva: que caminho tem energia mais sustentável? Que caminho gera mais medo — e esse medo é sinal de perigo real ou de crescimento? O que a carta 'Você Agora' revela sobre seu estado emocional ao decidir?",
      type: "practice",
    },
    quiz: [
      {
        id: "tir-8-q1",
        question: "Na Leitura para Decisões, o tarô:",
        options: ["Decide pela consulente", "Mostra a energia de cada caminho — a decisão é da consulente", "Sempre recomenda o Caminho A", "Mostra apenas o melhor caminho"],
        correctIndex: 1,
        explanation: "O tarô apresenta cenários, não decide. O poder está nas mãos de quem pergunta.",
      },
      {
        id: "tir-8-q2",
        question: "A carta 'Você Agora' na posição central serve para:",
        options: ["Decoração", "Mostrar o estado interno da consulente ao enfrentar a decisão", "Escolher um caminho", "Nada"],
        correctIndex: 1,
        explanation: "O estado emocional de quem decide influencia como percebe cada caminho — essa carta revela o filtro.",
      },
      {
        id: "tir-8-q3",
        question: "Ao comparar caminhos, deve-se buscar:",
        options: ["O resultado imediato melhor", "Sustentabilidade a longo prazo, não apenas resultado imediato", "O caminho mais fácil", "O caminho com mais Arcanos Maiores"],
        correctIndex: 1,
        explanation: "O melhor caminho nem sempre é o mais fácil — é o mais sustentável e coerente a longo prazo.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 9 — Leitura de Tendência
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-9",
    order: 8,
    title: "Leitura de Tendência",
    subtitle: "Mapeando energias da semana ou do mês",
    icon: "📅",
    content: `A Leitura de Tendência não responde a uma pergunta específica — ela **mapeia as energias** de um período. É como uma previsão meteorológica: não diz exatamente o que vai acontecer, mas indica o "clima" que se aproxima.

**Formato Semanal (7 cartas):**
Uma carta para cada dia da semana. Cada carta indica a energia dominante daquele dia — não um evento, mas um tom, uma atmosfera.

**Formato Mensal (4 cartas):**
Uma carta para cada semana do mês. Visão mais ampla das fases e transições.

**Formato Trimestral (3 cartas):**
Uma carta para cada mês. Ideal para planejamento e visão de longo prazo.

**Como ler tendências:**
1. **Não busque eventos** — busque energias. "Dia de paciência" em vez de "vai acontecer algo bom"
2. **Observe padrões** — muitas cartas do mesmo naipe? Mesmo número? Isso indica tema dominante
3. **Note a transição** — a energia muda de leve para pesada? De ação para reflexão? O fluxo conta uma história
4. **Identifique o pico** — qual carta é a mais intensa? Esse é o momento que pede mais atenção

**Prática semanal:**
No domingo, tire 7 cartas para a semana. A cada dia, releia a carta daquele dia à noite. No domingo seguinte, revise: as energias bateram? Esse ciclo semanal é o melhor treino prático que existe.`,
    keyPoints: [
      "Tendência = mapa de energias, não previsão de eventos",
      "Formatos: Semanal (7 cartas), Mensal (4), Trimestral (3)",
      "Observe padrões, transições e picos de intensidade",
      "O ciclo semanal é o melhor treino prático",
    ],
    layoutDiagram: {
      name: "Leitura Semanal de Tendência",
      positions: [
        { label: "Segunda", description: "Energia dominante do dia", x: 15, y: 40 },
        { label: "Terça", description: "Energia dominante do dia", x: 38, y: 40 },
        { label: "Quarta", description: "Energia dominante do dia", x: 61, y: 40 },
        { label: "Quinta", description: "Energia dominante do dia", x: 84, y: 40 },
        { label: "Sexta", description: "Energia dominante do dia", x: 25, y: 70 },
        { label: "Sábado", description: "Energia dominante do dia", x: 50, y: 70 },
        { label: "Domingo", description: "Energia dominante do dia", x: 75, y: 70 },
      ],
    },
    examples: [
      {
        spread: "Leitura Semanal",
        question: "Como será minha energia nesta semana?",
        cards: [
          { position: "Segunda", card: "2 de Copas" },
          { position: "Terça", card: "A Torre" },
          { position: "Quarta", card: "3 de Ouros" },
          { position: "Quinta", card: "A Temperança" },
          { position: "Sexta", card: "9 de Copas" },
          { position: "Sábado", card: "O Louco" },
          { position: "Domingo", card: "A Estrela" },
        ],
        interpretation: "A semana começa com boa conexão afetiva (2 de Copas), mas a terça-feira traz uma ruptura necessária ou imprevisto (A Torre). O meio da semana pede foco no trabalho e colaboração (3 de Ouros) com muita paciência e moderação (A Temperança). O final de semana promete muita satisfação pessoal (9 de Copas), um novo começo livre e espontâneo (O Louco) e termina com renovada esperança e calma (A Estrela).",
      }
    ],
    exercise: {
      instruction: "Faça uma Leitura Semanal de 7 cartas para esta semana. Anote cada carta e, sem pensar demais, escreva uma palavra-chave para cada dia (ex: 'paciência', 'ação', 'surpresa'). A cada noite, volte e anote o que aconteceu. No final da semana, compare suas previsões com a realidade. Isso treina calibragem — a habilidade de ler energias com precisão crescente.",
      type: "practice",
    },
    quiz: [
      {
        id: "tir-9-q1",
        question: "A Leitura de Tendência mostra:",
        options: ["Eventos exatos", "Energias e atmosferas de um período", "O destino", "Números da loteria"],
        correctIndex: 1,
        explanation: "Tendência = clima energético, não previsão de eventos específicos.",
      },
      {
        id: "tir-9-q2",
        question: "Na leitura semanal, se muitas cartas são do mesmo naipe, isso indica:",
        options: ["Erro", "Um tema dominante naquela semana", "Que o baralho está mal embaralhado", "Nada"],
        correctIndex: 1,
        explanation: "Padrões de naipe indicam tema: muitas Copas = semana emocional, muitas Espadas = semana mental.",
      },
      {
        id: "tir-9-q3",
        question: "O ciclo semanal (tirar domingo, revisar diariamente) é valioso porque:",
        options: ["É rápido", "Treina calibragem — a habilidade de ler energias com precisão crescente", "É fácil", "Todo mundo faz"],
        correctIndex: 1,
        explanation: "Comparar leitura com experiência real calibra sua interpretação semana após semana.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 10 — Leitura para Autoconhecimento
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-10",
    order: 9,
    title: "Leitura para Autoconhecimento",
    subtitle: "O tarô como espelho — a tiragem mais pessoal",
    icon: "🪞",
    content: `Todas as tiragens anteriores podem ser usadas para perguntas externas. Esta tiragem é exclusivamente **interna** — um espelho para olhar para dentro de si.

**A Tiragem do Espelho (6 posições):**

**1. Como me vejo** — A imagem que tenho de mim mesma. Pode ser precisa ou distorcida.

**2. Como os outros me veem** — A imagem que projeto para o mundo. Nem sempre coincide com a posição 1.

**3. O que me fortalece** — Meu recurso interno mais poderoso neste momento. Minha maior força.

**4. O que me enfraquece** — Meu ponto cego, minha vulnerabilidade. O que mina minha energia.

**5. O que preciso liberar** — O que está na hora de soltar: uma crença, um padrão, uma relação, um medo.

**6. O que preciso abraçar** — O que está esperando para ser acolhido: um talento, uma verdade, uma direção.

**Como ler:**
Esta tiragem NÃO é sobre o mundo externo — é sobre a paisagem interna. Leia com suavidade, sem julgamento. As cartas não estão criticando — estão espelhando.

**O par 1-2 (como me vejo / como os outros me veem)** revela a dissonância entre autoimagem e imagem projetada. Quanto maior a diferença, mais trabalho interno é necessário.

**O par 5-6 (liberar / abraçar)** é o conselho central: o que soltar e o que acolher. Juntas, essas cartas indicam a transformação que está pedindo para acontecer.

**Quando usar:** Momentos de transição, aniversários, virada de ano, crises de identidade, ou simplesmente quando sentir necessidade de "se ver" com mais clareza.`,
    keyPoints: [
      "6 posições: Como me vejo / Como os outros me veem / Fortalece / Enfraquece / Liberar / Abraçar",
      "Tiragem exclusivamente interna — espelho, não previsão",
      "O par 1-2 revela dissonância entre autoimagem e imagem projetada",
      "O par 5-6 é o conselho central: o que soltar e o que acolher",
    ],
    layoutDiagram: {
      name: "A Tiragem do Espelho",
      positions: [
        { label: "Como me vejo", description: "Autoimagem — precisa ou distorcida", x: 30, y: 30 },
        { label: "Como os outros me veem", description: "A imagem que projeto para o mundo", x: 70, y: 30 },
        { label: "O que me fortalece", description: "Recurso interno mais poderoso agora", x: 30, y: 55 },
        { label: "O que me enfraquece", description: "Ponto cego, vulnerabilidade", x: 70, y: 55 },
        { label: "O que preciso liberar", description: "Crença, padrão ou medo para soltar", x: 30, y: 80 },
        { label: "O que preciso abraçar", description: "Talento, verdade ou direção para acolher", x: 70, y: 80 },
      ],
    },
    examples: [
      {
        spread: "A Tiragem do Espelho",
        question: "O que preciso ver sobre mim mesma neste momento?",
        cards: [
          { position: "Como me vejo", card: "7 de Ouros" },
          { position: "Como os outros me veem", card: "A Imperatriz" },
          { position: "O que me fortalece", card: "Ás de Espadas" },
          { position: "O que me enfraquece", card: "5 de Copas" },
          { position: "O que preciso liberar", card: "O Diabo" },
          { position: "O que preciso abraçar", card: "A Estrela" },
        ],
        interpretation: "Você se vê como alguém que ainda está investindo e esperando resultados (7 de Ouros), mas os outros te veem como uma força criativa e abundante (A Imperatriz) — há uma dissonância entre sua autopercepção modesta e o impacto real que você causa. Sua maior força é a clareza mental (Ás de Espadas), mas o luto por algo perdido está minando sua energia (5 de Copas). É hora de liberar padrões de dependência ou obsessão (O Diabo) e abraçar a esperança e a confiança no futuro (A Estrela).",
      },
    ],
    reflection: "Ao terminar este módulo, olhe para trás: qual tiragem mais te chamou atenção? Qual você sente que vai usar mais na prática? E qual te dá mais medo — porque é exatamente essa que provavelmente trará as revelações mais importantes.",
    exercise: {
      instruction: "Faça a Tiragem do Espelho completa para si mesma. Tire as 6 cartas e interprete sem pressa. Compare as posições 1 e 2: sua autoimagem coincide com como os outros te veem? Foque no par 5-6: o que precisa ser liberado e o que precisa ser abraçado? Escreva uma carta para si mesma com base nessa leitura — como se estivesse aconselhando uma amiga querida.",
      type: "writing",
    },
    quiz: [
      {
        id: "tir-10-q1",
        question: "A Tiragem do Espelho é exclusivamente:",
        options: ["Sobre o futuro", "Sobre outras pessoas", "Interna — um espelho para olhar para dentro de si", "Sobre trabalho"],
        correctIndex: 2,
        explanation: "É a tiragem mais pessoal — não prevê, espelha. É sobre a paisagem interna.",
      },
      {
        id: "tir-10-q2",
        question: "O par posições 1-2 (como me vejo / como os outros me veem) revela:",
        options: ["Nada", "A dissonância entre autoimagem e imagem projetada", "O futuro", "O passado"],
        correctIndex: 1,
        explanation: "Quanto maior a diferença entre essas posições, mais trabalho de autoconhecimento é necessário.",
      },
      {
        id: "tir-10-q3",
        question: "O par 5-6 (liberar / abraçar) indica:",
        options: ["O problema e a solução", "O que soltar e o que acolher — a transformação que pede para acontecer", "Passado e futuro", "Nada importante"],
        correctIndex: 1,
        explanation: "Liberar + abraçar = a direção da transformação pessoal neste momento.",
      },
      {
        id: "tir-10-q4",
        question: "Essa tiragem é ideal para:",
        options: ["Perguntas sobre terceiros", "Momentos de transição, virada de ano, crises de identidade", "Questões financeiras", "Prever eventos"],
        correctIndex: 1,
        explanation: "Momentos de mudança pedem espelho — e a Tiragem do Espelho oferece exatamente isso.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 11 — Tiragem para Amor e Relacionamentos
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tir-11",
    order: 10,
    title: "Tiragem para Amor e Relacionamentos",
    subtitle: "Uma leitura ética sobre vínculo, desejo e caminho possível",
    icon: "❤️",
    content: `Tiragens sobre amor são as mais procuradas — e também as mais delicadas. Quando o coração está em jogo, é fácil escorregar para a leitura que **promete** em vez da leitura que **revela**. Esta lição ensina o caminho ético: olhar o vínculo com clareza adulta, sem manipular o futuro nem invadir a vontade do outro.

**A premissa fundamental:** o tarô não tem o poder — nem o direito — de forçar uma pessoa a voltar, ficar, amar ou desejar. O que ele faz é **mostrar a paisagem do vínculo**: o que está vivo, o que bloqueia, o que pede atenção. A decisão sempre é das pessoas envolvidas.

**Quando usar esta tiragem:**
- Você quer entender a dinâmica de um relacionamento (atual, passado ou em construção)
- Há uma pergunta honesta sobre o seu papel no vínculo
- Você precisa de clareza para decidir como agir
- Você quer ver bloqueios e potenciais que talvez esteja ignorando

**Quando NÃO usar:**
- Para "saber se ele/ela vai voltar" (isso retira o poder de quem consulta e invade a vontade do outro)
- Para vigiar uma pessoa ("o que ela está fazendo agora?")
- Para insistir em alguém que já foi claro sobre não querer
- Como muleta emocional repetida (toda semana, todo dia)
- Quando você só quer ouvir o que deseja ouvir

**Pergunta boa:**
"O que preciso ver sobre o vínculo entre mim e [pessoa] neste momento — e o que posso fazer com clareza?"

**Pergunta ruim:**
"Ele/ela vai voltar para mim?" — fechada, dependente do outro, e tira o seu poder de escolha.

**A Tiragem dos 5 Vínculos:**

**Posição 1 — Você no vínculo.** Como você está chegando nesse relacionamento agora: emoções, expectativas, padrões. É o seu espelho dentro da relação.

**Posição 2 — A outra pessoa ou energia relacional.** A energia que a outra pessoa traz, ou — quando o vínculo ainda não tem rosto — a energia geral que cerca o tema relacional na sua vida. Não é mente-leitura: é o clima que se manifesta entre vocês.

**Posição 3 — O que aproxima.** O que existe de vivo, magnético ou genuíno entre os dois. Pode ser afeto, projeto comum, química, valores compartilhados, história.

**Posição 4 — O que bloqueia.** O obstáculo real. Pode ser timing, ferida pessoal, padrão repetido, comunicação travada, terceiros, fase de vida — algo que impede o vínculo de fluir como poderia.

**Posição 5 — Conselho do tarô.** O passo possível e ético para você. Não promessa, não previsão fechada — direção. O que cabe à sua parte fazer agora.

**Como ler com ética:**
- Leia primeiro a posição 1. Antes de falar do outro, olhe para si.
- O par 3-4 (aproxima + bloqueia) é o coração da leitura: mostra a tensão real do vínculo.
- A posição 5 sempre se dirige a quem consulta. Nunca diga "você precisa fazer ele mudar".
- Se cair uma carta dura (Torre, Diabo, 3 de Espadas, 5 de Copas), nomeie com cuidado: a carta descreve a paisagem, não condena o relacionamento.
- Termine devolvendo a escolha à consulente. O tarô abre o mapa; o caminho é dela.`,
    keyPoints: [
      "O tarô revela a paisagem do vínculo — não força ninguém a amar, ficar ou voltar",
      "Pergunta boa foca em você e no vínculo, não em prever a vontade do outro",
      "5 posições: Você / A outra pessoa ou energia / O que aproxima / O que bloqueia / Conselho",
      "O par 3-4 (aproxima + bloqueia) é o coração da leitura",
      "O conselho sempre se dirige a quem consulta — nunca a terceiros",
      "Não usar como vigilância, insistência ou muleta emocional",
    ],
    deepDive: `Leituras de amor pedem uma postura adulta da leitora. Três armadilhas são comuns:

**1. A leitura-promessa.** "As cartas dizem que ele volta em 3 meses." Isso não é leitura — é projeção do desejo da consulente, vestido de tarô. Nenhuma carta promete o futuro de outra pessoa.

**2. O olhar que tenta controlar.** Evite perguntas que tentam controlar ou decifrar a outra pessoa. Em leituras afetivas, o melhor caminho é observar o vínculo, a sua postura e o que pode trazer mais clareza emocional.

**3. A leitura-dependência.** Consultar todo dia sobre a mesma pessoa. O tarô vira muleta para não sentir a ausência. Aí ele deixa de ser ferramenta e vira fuga.

**O caminho ético:** o tarô serve para **clarear**, não para controlar. Uma boa leitura de amor termina com a consulente mais lúcida sobre si mesma e mais livre — não mais grudada na pessoa. Se a leitura aumenta a obsessão, algo está errado: na pergunta, na postura ou na frequência.

Quando a outra pessoa já foi clara sobre não querer o vínculo, o tarô não vai "desfazer" essa escolha. Pode, sim, mostrar à consulente o que existe **dela** ali — luto, ferida, padrão — e por onde recomeçar a vida própria.`,
    layoutDiagram: {
      name: "Tiragem dos 5 Vínculos",
      positions: [
        { label: "Você no vínculo", description: "Como você está chegando — emoções, expectativas, padrões", x: 20, y: 50 },
        { label: "A outra pessoa", description: "A energia que ela traz, ou o clima geral relacional", x: 80, y: 50 },
        { label: "O que aproxima", description: "O que está vivo, magnético, genuíno entre os dois", x: 50, y: 30 },
        { label: "O que bloqueia", description: "O obstáculo real — timing, ferida, padrão, comunicação", x: 50, y: 70 },
        { label: "Conselho", description: "O passo possível e ético para quem consulta", x: 50, y: 15 },
      ],
    },
    examples: [
      {
        spread: "Tiragem dos 5 Vínculos",
        question: "O que preciso ver sobre o vínculo entre mim e essa pessoa neste momento — e o que posso fazer com clareza?",
        cards: [
          { position: "Você no vínculo", card: "2 de Copas" },
          { position: "A outra pessoa ou energia relacional", card: "Cavaleiro de Espadas" },
          { position: "O que aproxima", card: "Os Enamorados" },
          { position: "O que bloqueia", card: "4 de Paus invertido" },
          { position: "Conselho do tarô", card: "A Sacerdotisa" },
        ],
        interpretation: "Você chega no vínculo com o coração aberto e disposição genuína de troca (2 de Copas). A outra pessoa está em movimento mental rápido, racional, talvez evasiva ou ainda processando ideias (Cavaleiro de Espadas) — não é frieza, é ritmo diferente do seu. O que aproxima é forte: há uma escolha consciente de afinidade e valores entre vocês (Os Enamorados). O que bloqueia é a falta de uma base estável compartilhada — talvez timing, talvez compromisso ainda não definido (4 de Paus invertido). O conselho não é avançar nem cobrar: é silenciar e observar (A Sacerdotisa). Não force a definição agora. Dê espaço para que a verdade do vínculo apareça por si — e use esse tempo para ouvir sua própria intuição sobre o que **você** quer, não só sobre o que ele/ela vai decidir.",
      },
    ],
    reflection: "Pense em uma leitura de amor que você fez (para si ou para outra pessoa) que terminou em mais ansiedade do que clareza. O que aconteceu? A pergunta era sobre o vínculo, ou sobre forçar uma resposta? Como essa leitura teria sido diferente se a pergunta fosse: 'O que preciso ver sobre esse vínculo — e o que cabe a mim?'",
    exercise: {
      instruction: "Escolha um relacionamento real da sua vida (romântico, atual ou recente) e faça a Tiragem dos 5 Vínculos para si mesma. Antes de virar as cartas, escreva sua pergunta seguindo a fórmula ética da lição. Depois interprete cada posição, lendo o par 3-4 com atenção especial. Termine respondendo por escrito: 'O que esta leitura me devolve sobre MIM — não sobre a outra pessoa?' Guarde essa anotação e releia daqui a 30 dias.",
      type: "writing",
    },
    quiz: [
      {
        id: "tir-11-q1",
        question: "Qual é a postura ética central de uma leitura sobre amor?",
        options: [
          "Prever se a pessoa volta",
          "Descobrir o que a outra pessoa está sentindo agora",
          "Revelar a paisagem do vínculo e devolver à consulente o poder de escolha",
          "Garantir que o relacionamento dê certo",
        ],
        correctIndex: 2,
        explanation: "O tarô abre o mapa — quem caminha é a consulente. Nunca força a vontade de terceiros nem promete desfechos.",
      },
      {
        id: "tir-11-q2",
        question: "Qual é uma pergunta ética para esta tiragem?",
        options: [
          "Ele/ela vai voltar para mim?",
          "O que preciso ver sobre o vínculo entre mim e essa pessoa — e o que posso fazer com clareza?",
          "Com quem ela está agora?",
          "Quando vamos casar?",
        ],
        correctIndex: 1,
        explanation: "A pergunta boa é aberta, foca no vínculo e na ação possível de quem consulta — não em prever a vontade do outro.",
      },
      {
        id: "tir-11-q3",
        question: "O par de posições 3 (o que aproxima) e 4 (o que bloqueia) revela:",
        options: [
          "O passado e o futuro do casal",
          "A tensão real do vínculo — o que está vivo e o que precisa de atenção",
          "Quem está certo na briga",
          "A data do próximo encontro",
        ],
        correctIndex: 1,
        explanation: "Esse par é o coração da leitura: mostra simultaneamente a força e o obstáculo do vínculo.",
      },
      {
        id: "tir-11-q4",
        question: "Quando NÃO se deve usar esta tiragem?",
        options: [
          "Para entender a dinâmica de um relacionamento atual",
          "Como vigilância, insistência sobre quem já se afastou, ou muleta emocional repetida",
          "Para ver bloqueios que você está ignorando",
          "Para clarear o seu papel no vínculo",
        ],
        correctIndex: 1,
        explanation: "O tarô serve para clarear, não para controlar. Vigiar, insistir ou consultar compulsivamente desvirtua a ferramenta.",
      },
      {
        id: "tir-11-q5",
        question: "A posição 5 (Conselho do tarô) sempre se dirige a:",
        options: [
          "À outra pessoa do vínculo",
          "Aos familiares envolvidos",
          "A quem está consultando — nunca a terceiros",
          "Ao terapeuta da consulente",
        ],
        correctIndex: 2,
        explanation: "O conselho é para quem consulta. O tarô não dá ordens a quem nem está na leitura.",
      },
    ],
  },
];

export function getTiragensLessonByOrder(order: number): TiragemLesson | undefined {
  return TIRAGENS_LESSONS.find((l) => l.order === order);
}
