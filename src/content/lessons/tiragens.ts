export interface TiragemLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
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
  positions: { label: string; description: string }[];
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
    content: `A tiragem de 1 carta é a mais simples e, paradoxalmente, uma das mais difíceis de ler bem. Com apenas uma carta, não há contexto adicional — toda a leitura depende da sua capacidade de conectar essa única carta à pergunta.

**Quando usar:**
- Pergunta simples e direta
- "Carta do dia" — energia geral para o dia
- Conselho rápido
- Confirmação de intuição
- Treinamento diário (essencial para iniciantes)

**Como ler:**
A carta fala diretamente sobre a pergunta. Sem passado, sem futuro — é o **agora**, o **essencial**, a **mensagem central**.

**Técnica da Imersão:**
1. Vire a carta e olhe por 30 segundos sem pensar
2. Que emoção a imagem provoca em você?
3. Que detalhe visual chama mais atenção?
4. Conecte: como isso responde à pergunta?

**Carta do Dia — o exercício mais importante:**
Toda manhã, tire 1 carta perguntando: "Que energia acompanha meu dia hoje?" À noite, revise: a energia da carta se manifestou? Como? Este exercício diário constrói fluência no tarô mais rápido que qualquer estudo teórico.

**A armadilha:** Não tire uma segunda carta porque "não entendeu" a primeira. A dificuldade é a mensagem — sente-se com ela.`,
    keyPoints: [
      "Simples mas poderosa — toda a leitura depende de uma única conexão",
      "Ideal para perguntas diretas, carta do dia, conselho rápido",
      "Técnica da Imersão: 30 segundos de observação, emoção, detalhe, conexão",
      "Carta do Dia é o exercício mais importante para iniciantes",
      "Nunca tire segunda carta porque 'não entendeu' a primeira",
    ],
    layoutDiagram: {
      name: "Tiragem de 1 Carta",
      positions: [
        { label: "Carta Única", description: "A mensagem central — o essencial" },
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

**Os 4 formatos clássicos:**

**Formato 1 — Passado / Presente / Futuro**
A narrativa temporal. De onde vim, onde estou, para onde vou.
Ideal para: entender a trajetória de uma situação.

**Formato 2 — Situação / Obstáculo / Conselho**
A narrativa de problema. O que está acontecendo, o que atrapalha, o que fazer.
Ideal para: quando a pessoa precisa de orientação prática.

**Formato 3 — Mente / Corpo / Espírito**
A narrativa holística. O que pensa, o que sente no corpo, o que a alma pede.
Ideal para: autoconhecimento e questões de saúde/bem-estar.

**Formato 4 — Opção A / O Que Considerar / Opção B**
A narrativa de decisão. Dois caminhos e o que pesar entre eles.
Ideal para: quando há uma escolha a fazer.

**A regra de ouro das 3 cartas:** Antes de virar, **defina o formato**. Não vire as cartas e depois decida o que cada posição significa — isso é improvisação, não leitura.

**Leitura cruzada:** Além de ler cada posição isoladamente, leia os pares (1-2, 2-3, 1-3) e a tríade completa. A riqueza está nas conexões.`,
    keyPoints: [
      "4 formatos: Passado/Presente/Futuro, Situação/Obstáculo/Conselho, Mente/Corpo/Espírito, Opção A/Considerar/Opção B",
      "Defina o formato ANTES de virar as cartas",
      "Leia posições + pares + tríade completa",
      "Base de todas as tiragens mais complexas",
    ],
    layoutDiagram: {
      name: "Tiragem de 3 Cartas",
      positions: [
        { label: "Posição 1", description: "Passado / Situação / Mente / Opção A" },
        { label: "Posição 2", description: "Presente / Obstáculo / Corpo / O que considerar" },
        { label: "Posição 3", description: "Futuro / Conselho / Espírito / Opção B" },
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
    content: `A tiragem temporal é a mais intuitiva que existe — e por isso merece atenção especial. "De onde vim, onde estou, para onde vou" é a pergunta fundamental da experiência humana.

**Cuidado com a posição "Futuro":**
O futuro no tarô **não é destino fixo**. É tendência. É "se tudo continuar assim, é para lá que vai". A consulente sempre tem poder de mudar a direção — e uma boa leitora deixa isso claro.

**Como ler cada posição:**

**Passado (Carta 1):**
- O que causou a situação atual
- A energia que a consulente está trazendo
- O padrão que precisa ser reconhecido
- Pergunte: "O que aconteceu que levou até aqui?"

**Presente (Carta 2):**
- A energia dominante AGORA
- A situação tal como ela é — sem filtro
- O ponto de poder — onde a mudança é possível
- Pergunte: "O que está realmente acontecendo?"

**Futuro (Carta 3):**
- A tendência — para onde a energia está fluindo
- O resultado provável SE nada mudar
- O conselho implícito — o que considerar
- Pergunte: "Para onde isso está levando?"

**O arco narrativo:** A leitura mais poderosa é aquela que conecta as 3 posições numa história coerente: "Porque [passado], a situação atual é [presente], e a tendência é [futuro]." Se a narrativa não flui, reavalie.

**Quando NÃO usar:** Evite para perguntas que não têm dimensão temporal ("Quem eu sou?" não tem passado/presente/futuro — use Mente/Corpo/Espírito).`,
    keyPoints: [
      "Futuro = tendência, não destino fixo",
      "Passado = causa; Presente = ponto de poder; Futuro = direção",
      "Conecte as 3 posições num arco narrativo coerente",
      "Não use para perguntas sem dimensão temporal",
    ],
    layoutDiagram: {
      name: "Passado / Presente / Futuro",
      positions: [
        { label: "Passado", description: "O que causou a situação — o padrão a reconhecer" },
        { label: "Presente", description: "A energia dominante agora — o ponto de poder" },
        { label: "Futuro", description: "A tendência — para onde a energia flui" },
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
    content: `Esta é a tiragem mais **prática** e **orientadora** do tarô. Enquanto a temporal conta uma história, esta tiragem **resolve um problema**. É a que mais se aproxima de uma sessão de coaching com cartas.

**Posição 1 — Situação:**
O que está realmente acontecendo. Não o que a consulente acha que está acontecendo — o que as cartas mostram. Frequentemente, essa posição já traz uma revelação: "Ah, então é ISSO que está acontecendo..."

**Posição 2 — Obstáculo:**
O que está bloqueando o caminho. Pode ser externo (uma pessoa, uma circunstância) ou interno (um medo, uma crença, um padrão). Esta posição é a mais desconfortável — e a mais valiosa. O obstáculo que você não vê é o que mais te prende.

**Atenção:** Uma carta "positiva" no obstáculo (como O Sol ou 9 de Copas) não é contradição. Pode significar: excesso de otimismo cegando para problemas reais, ou satisfação prematura impedindo progresso.

**Posição 3 — Conselho:**
O que as cartas recomendam. Esta posição deve ser lida como AÇÃO — não como previsão. "O que posso FAZER?" Mesmo cartas passivas (como 4 de Espadas = descanso) são ações: "descanse", "pare", "reflita antes de agir".

**Quando usar:**
- A consulente tem um problema e quer direção
- Situações de bloqueio ou estagnação
- Quando a pergunta é: "O que faço?"`,
    keyPoints: [
      "Situação = o que realmente está acontecendo (pode surpreender)",
      "Obstáculo = o bloqueio — externo ou interno — a posição mais valiosa",
      "Conselho = ação recomendada, não previsão",
      "Carta positiva no obstáculo = pode indicar excesso ou cegueira",
    ],
    layoutDiagram: {
      name: "Situação / Obstáculo / Conselho",
      positions: [
        { label: "Situação", description: "O que está realmente acontecendo" },
        { label: "Obstáculo", description: "O que bloqueia o caminho" },
        { label: "Conselho", description: "A ação recomendada" },
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
    content: `A Leitura em Cruz é uma tiragem de 5 posições que oferece um **panorama completo** de uma situação sem a complexidade da Cruz Celta. É a tiragem intermediária perfeita — mais profunda que 3 cartas, mais acessível que 10.

**As 5 posições:**

**Centro — O Tema:**
A essência da questão. A carta que define sobre o quê estamos realmente falando. Às vezes surpreende: a consulente acha que a pergunta é sobre trabalho, mas o centro mostra um problema emocional.

**Esquerda — O Passado / A Causa:**
O que trouxe a situação até aqui. A raiz, a origem, o padrão antigo.

**Direita — O Futuro / A Tendência:**
Para onde a energia está fluindo. O desdobramento provável.

**Acima — O Consciente / O que se sabe:**
O que a consulente já percebe, reconhece, entende. O que está "na superfície".

**Abaixo — O Inconsciente / O que se esconde:**
O que a consulente não vê, não admite, ou não quer enxergar. Frequentemente a carta mais reveladora de toda a tiragem.

**Leitura em dois eixos:**
- **Eixo horizontal** (esquerda-centro-direita) = a narrativa temporal
- **Eixo vertical** (acima-centro-abaixo) = a narrativa psicológica

A Cruz permite ler duas histórias simultâneas: o que está acontecendo no tempo E o que está acontecendo na psique.`,
    keyPoints: [
      "5 posições: Centro (tema), Esquerda (causa), Direita (tendência), Acima (consciente), Abaixo (inconsciente)",
      "Dois eixos: horizontal = tempo, vertical = psique",
      "Mais profunda que 3 cartas, mais acessível que 10",
      "A carta 'Abaixo' (inconsciente) é frequentemente a mais reveladora",
    ],
    layoutDiagram: {
      name: "Leitura em Cruz",
      positions: [
        { label: "Centro", description: "O tema — a essência da questão" },
        { label: "Esquerda", description: "O passado — a causa, a raiz" },
        { label: "Direita", description: "O futuro — a tendência" },
        { label: "Acima", description: "O consciente — o que se sabe" },
        { label: "Abaixo", description: "O inconsciente — o que se esconde" },
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
    content: `Uma das perguntas mais comuns no tarô é: "Devo fazer A ou B?" A Leitura para Decisões foi criada especificamente para isso — comparar dois caminhos de forma estruturada.

**Formato de 5 posições:**

**Carta 1 — Você Agora:**
A energia atual da consulente — seu estado interno ao enfrentar essa decisão.

**Carta 2 — Caminho A:**
A energia do primeiro caminho. O que essa opção traz? Que experiência oferece?

**Carta 3 — Resultado A:**
Onde o Caminho A provavelmente leva. O desfecho provável se escolher essa opção.

**Carta 4 — Caminho B:**
A energia do segundo caminho. O que essa opção traz?

**Carta 5 — Resultado B:**
Onde o Caminho B provavelmente leva.

**IMPORTANTE — O tarô não decide por você.**
Ele mostra a energia de cada caminho. A decisão final é sempre da consulente. Uma boa leitora apresenta os dois cenários sem julgar e sem recomendar — o poder está nas mãos de quem pergunta.

**Dica avançada:** Compare as cartas 2-3 (Caminho A e Resultado A) como um par, e as cartas 4-5 (Caminho B e Resultado B) como outro par. Qual par conta uma história mais coerente? Qual tem energia mais sustentável a longo prazo?`,
    keyPoints: [
      "5 posições: Você Agora + Caminho A/Resultado A + Caminho B/Resultado B",
      "O tarô mostra cenários — não decide por você",
      "Compare os pares de cada caminho como narrativas separadas",
      "Busque sustentabilidade a longo prazo, não apenas resultado imediato",
    ],
    layoutDiagram: {
      name: "Leitura para Decisões",
      positions: [
        { label: "Você Agora", description: "Seu estado interno ao enfrentar a decisão" },
        { label: "Caminho A", description: "A energia da primeira opção" },
        { label: "Resultado A", description: "Onde o Caminho A provavelmente leva" },
        { label: "Caminho B", description: "A energia da segunda opção" },
        { label: "Resultado B", description: "Onde o Caminho B provavelmente leva" },
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
        { label: "Segunda", description: "Energia dominante do dia" },
        { label: "Terça", description: "Energia dominante do dia" },
        { label: "Quarta", description: "Energia dominante do dia" },
        { label: "Quinta", description: "Energia dominante do dia" },
        { label: "Sexta", description: "Energia dominante do dia" },
        { label: "Sábado", description: "Energia dominante do dia" },
        { label: "Domingo", description: "Energia dominante do dia" },
      ],
    },
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
        { label: "Como me vejo", description: "Autoimagem — precisa ou distorcida" },
        { label: "Como os outros me veem", description: "A imagem que projeto para o mundo" },
        { label: "O que me fortalece", description: "Recurso interno mais poderoso agora" },
        { label: "O que me enfraquece", description: "Ponto cego, vulnerabilidade" },
        { label: "O que preciso liberar", description: "Crença, padrão ou medo para soltar" },
        { label: "O que preciso abraçar", description: "Talento, verdade ou direção para acolher" },
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

**2. A leitura-vigilância.** Tirar cartas para saber "o que ela está sentindo agora", "com quem ele está", "se está pensando em mim". Isso invade a privacidade de quem nem está na sala. Ético é olhar o vínculo, não espionar a pessoa.

**3. A leitura-dependência.** Consultar todo dia sobre a mesma pessoa. O tarô vira muleta para não sentir a ausência. Aí ele deixa de ser ferramenta e vira fuga.

**O caminho ético:** o tarô serve para **clarear**, não para controlar. Uma boa leitura de amor termina com a consulente mais lúcida sobre si mesma e mais livre — não mais grudada na pessoa. Se a leitura aumenta a obsessão, algo está errado: na pergunta, na postura ou na frequência.

Quando a outra pessoa já foi clara sobre não querer o vínculo, o tarô não vai "desfazer" essa escolha. Pode, sim, mostrar à consulente o que existe **dela** ali — luto, ferida, padrão — e por onde recomeçar a vida própria.`,
    layoutDiagram: {
      name: "Tiragem dos 5 Vínculos",
      positions: [
        { label: "Você no vínculo", description: "Como você está chegando — emoções, expectativas, padrões" },
        { label: "A outra pessoa ou energia relacional", description: "A energia que ela traz, ou o clima geral do tema relacional" },
        { label: "O que aproxima", description: "O que está vivo, magnético, genuíno entre os dois" },
        { label: "O que bloqueia", description: "O obstáculo real — timing, ferida, padrão, comunicação" },
        { label: "Conselho do tarô", description: "O passo possível e ético para quem consulta" },
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
