/**
 * Motion themes for Arcanos.
 * Defines visual styles, palettes, and animations for each archetype.
 */

export interface ArcanoTheme {
  id: number;
  slug: string;
  palette: {
    primary: string; // HSL value like "42 70% 65%"
    secondary: string;
    accent: string;
    background: string;
  };
  aura: {
    intensity: number; // 0 to 1
    color: string;
  };
  particles: {
    symbols: string[];
    style: "ascendant" | "descendant" | "radial" | "float";
  };
  mood: "mystical" | "dramatic" | "gentle" | "intense";
  microcopy: {
    intro: string;
    presence: string;
    unlock: string;
  };
}

const DEFAULT_THEME: ArcanoTheme = {
  id: -1,
  slug: "generic",
  palette: {
    primary: "42 30% 65%",
    secondary: "333 20% 40%",
    accent: "42 60% 70%",
    background: "36 33% 97%",
  },
  aura: {
    intensity: 0.5,
    color: "42 30% 65%",
  },
  particles: {
    symbols: ["✦", "·", "✧"],
    style: "float",
  },
  mood: "mystical",
  microcopy: {
    intro: "O portal do conhecimento se abre.",
    presence: "A sabedoria do arcano se revela.",
    unlock: "Um novo conhecimento foi desbloqueado.",
  },
};

export const ARCANO_THEMES: Record<number, ArcanoTheme> = {
  0: {
    id: 0,
    slug: "o-louco",
    palette: { primary: "42 70% 65%", secondary: "200 60% 75%", accent: "36 100% 50%", background: "36 33% 97%" },
    aura: { intensity: 0.8, color: "42 70% 65%" },
    particles: { symbols: ["✦", "☀", "·", "✧", "🌿"], style: "ascendant" },
    mood: "dramatic",
    microcopy: {
      intro: "O primeiro passo da jornada.",
      presence: "O impulso livre de amarras.",
      unlock: "O Louco convida ao salto de fé.",
    },
  },
  1: {
    id: 1,
    slug: "o-mago",
    palette: { primary: "36 50% 55%", secondary: "340 42% 30%", accent: "42 80% 70%", background: "36 33% 97%" },
    aura: { intensity: 0.9, color: "36 50% 55%" },
    particles: { symbols: ["∞", "◈", "✦", "⚡", "🌹"], style: "float" },
    mood: "intense",
    microcopy: {
      intro: "A vontade encontra forma.",
      presence: "O caminho agora aprende a criar.",
      unlock: "O Mago foi desbloqueado.",
    },
  },
  2: {
    id: 2,
    slug: "a-sacerdotisa",
    palette: { primary: "220 30% 60%", secondary: "260 20% 40%", accent: "200 40% 70%", background: "36 33% 97%" },
    aura: { intensity: 0.7, color: "220 30% 60%" },
    particles: { symbols: ["🌙", "✧", "·", "◎"], style: "float" },
    mood: "mystical",
    microcopy: {
      intro: "O silêncio guarda o portal.",
      presence: "A voz que nasce do silêncio.",
      unlock: "A Sacerdotisa revelou seus mistérios.",
    },
  },
  3: {
    id: 3,
    slug: "a-imperatriz",
    palette: { primary: "140 30% 50%", secondary: "340 40% 50%", accent: "42 70% 60%", background: "36 33% 97%" },
    aura: { intensity: 0.8, color: "140 30% 50%" },
    particles: { symbols: ["🌿", "❀", "✨", "🍎"], style: "ascendant" },
    mood: "gentle",
    microcopy: {
      intro: "A vida floresce no portal.",
      presence: "A abundância de ser quem você é.",
      unlock: "A Imperatriz abençoou sua jornada.",
    },
  },
  4: {
    id: 4,
    slug: "o-imperador",
    palette: { primary: "0 50% 40%", secondary: "42 30% 30%", accent: "0 60% 50%", background: "36 33% 97%" },
    aura: { intensity: 0.9, color: "0 50% 40%" },
    particles: { symbols: ["◈", "✦", "⚔", "🛡"], style: "float" },
    mood: "intense",
    microcopy: {
      intro: "A estrutura ergue o portal.",
      presence: "A ordem que protege a visão.",
      unlock: "O Imperador estabeleceu sua base.",
    },
  },
  5: {
    id: 5,
    slug: "o-hierofante",
    palette: { primary: "42 40% 50%", secondary: "0 40% 40%", accent: "42 60% 60%", background: "36 33% 97%" },
    aura: { intensity: 0.7, color: "42 40% 50%" },
    particles: { symbols: ["🗝", "✦", "⟡", "📜"], style: "float" },
    mood: "mystical",
    microcopy: {
      intro: "A tradição abre o portal.",
      presence: "O mestre que habita em você.",
      unlock: "O Hierofante transmitiu sua lição.",
    },
  },
  6: {
    id: 6,
    slug: "os-enamorados",
    palette: { primary: "333 40% 50%", secondary: "42 50% 70%", accent: "333 60% 40%", background: "36 33% 97%" },
    aura: { intensity: 0.8, color: "333 40% 50%" },
    particles: { symbols: ["❤", "✦", "✨", "🕊"], style: "ascendant" },
    mood: "gentle",
    microcopy: {
      intro: "O encontro revela o caminho.",
      presence: "O coração escolhe sua direção.",
      unlock: "A união sagrada foi revelada.",
    },
  },
  7: {
    id: 7,
    slug: "o-carro",
    palette: { primary: "200 40% 45%", secondary: "42 30% 60%", accent: "200 60% 40%", background: "36 33% 97%" },
    aura: { intensity: 0.9, color: "200 40% 45%" },
    particles: { symbols: ["⭐", "✦", "◈", "➹"], style: "float" },
    mood: "dramatic",
    microcopy: {
      intro: "A vontade move o portal.",
      presence: "A direção que vence o caos.",
      unlock: "O Carro acelerou sua jornada.",
    },
  },
  8: {
    id: 8,
    slug: "a-forca",
    palette: { primary: "36 60% 50%", secondary: "340 30% 40%", accent: "36 80% 60%", background: "36 33% 97%" },
    aura: { intensity: 0.8, color: "36 60% 50%" },
    particles: { symbols: ["🦁", "❀", "∞", "✦"], style: "float" },
    mood: "gentle",
    microcopy: {
      intro: "O poder suave abre o portal.",
      presence: "A coragem de ser gentil.",
      unlock: "A Força despertou seu poder.",
    },
  },
  9: {
    id: 9,
    slug: "o-eremita",
    palette: { primary: "240 10% 45%", secondary: "42 20% 60%", accent: "240 20% 30%", background: "36 33% 97%" },
    aura: { intensity: 0.6, color: "240 10% 45%" },
    particles: { symbols: ["🏮", "·", "✦", "⭐"], style: "float" },
    mood: "mystical",
    microcopy: {
      intro: "A luz interior revela o portal.",
      presence: "O silêncio que traz respostas.",
      unlock: "O Eremita iluminou sua busca.",
    },
  },
  10: {
    id: 10,
    slug: "a-roda-da-fortuna",
    palette: { primary: "42 60% 55%", secondary: "220 30% 40%", accent: "42 80% 70%", background: "36 33% 97%" },
    aura: { intensity: 0.8, color: "42 60% 55%" },
    particles: { symbols: ["🌀", "✦", "✧", "·"], style: "float" },
    mood: "dramatic",
    microcopy: {
      intro: "O ciclo gira o portal.",
      presence: "A impermanência é a mestra.",
      unlock: "A Roda girou a seu favor.",
    },
  },
  11: {
    id: 11,
    slug: "a-justica",
    palette: { primary: "0 40% 45%", secondary: "200 30% 50%", accent: "42 50% 60%", background: "36 33% 97%" },
    aura: { intensity: 0.8, color: "0 40% 45%" },
    particles: { symbols: ["⚖", "⚔", "✦", "·"], style: "float" },
    mood: "intense",
    microcopy: {
      intro: "A verdade equilibra o portal.",
      presence: "Toda ação tem seu retorno.",
      unlock: "A Justiça selou sua verdade.",
    },
  },
  12: {
    id: 12,
    slug: "o-enforcado",
    palette: { primary: "200 30% 60%", secondary: "42 30% 70%", accent: "220 40% 50%", background: "36 33% 97%" },
    aura: { intensity: 0.7, color: "200 30% 60%" },
    particles: { symbols: ["💧", "✧", "·", "✦"], style: "float" },
    mood: "mystical",
    microcopy: {
      intro: "A pausa suspende o portal.",
      presence: "Ver o mundo de outro ângulo.",
      unlock: "O Enforcado mudou sua visão.",
    },
  },
  13: {
    id: 13,
    slug: "a-morte",
    palette: { primary: "260 20% 25%", secondary: "0 40% 30%", accent: "260 30% 50%", background: "260 20% 5%" },
    aura: { intensity: 0.9, color: "260 20% 25%" },
    particles: { symbols: ["🥀", "💀", "✦", "·"], style: "descendant" },
    mood: "dramatic",
    microcopy: {
      intro: "O fim abre o portal.",
      presence: "Morte para o que não serve mais.",
      unlock: "A Morte liberou seu renascimento.",
    },
  },
  14: {
    id: 14,
    slug: "a-temperanca",
    palette: { primary: "200 40% 60%", secondary: "42 50% 65%", accent: "200 60% 70%", background: "36 33% 97%" },
    aura: { intensity: 0.8, color: "200 40% 60%" },
    particles: { symbols: ["💧", "✨", "✦", "🍷"], style: "float" },
    mood: "gentle",
    microcopy: {
      intro: "A alquimia cura o portal.",
      presence: "O equilíbrio que transforma.",
      unlock: "A Temperança harmonizou seu ser.",
    },
  },
  15: {
    id: 15,
    slug: "o-diabo",
    palette: {
      primary: "333 50% 24%",
      secondary: "0 60% 15%",
      accent: "0 70% 40%",
      background: "0 60% 5%",
    },
    aura: { intensity: 0.7, color: "333 50% 24%" },
    particles: { symbols: ["⛓", "🔥", "·", "⬫"], style: "descendant" },
    mood: "mystical",
    microcopy: {
      intro: "A sombra revela onde a chave foi esquecida.",
      presence: "Nem toda prisão tem grades.",
      unlock: "A consciência ilumina o desejo.",
    },
  },
  16: {
    id: 16,
    slug: "a-torre",
    palette: { primary: "0 60% 40%", secondary: "42 40% 30%", accent: "20 70% 50%", background: "0 50% 10%" },
    aura: { intensity: 1, color: "0 60% 40%" },
    particles: { symbols: ["⚡", "🔥", "✦", "◈"], style: "descendant" },
    mood: "dramatic",
    microcopy: {
      intro: "O raio derruba o portal.",
      presence: "O colapso da falsa segurança.",
      unlock: "A Torre libertou sua verdade.",
    },
  },
  17: {
    id: 17,
    slug: "a-estrela",
    palette: { primary: "200 60% 70%", secondary: "240 40% 50%", accent: "180 50% 60%", background: "240 40% 5%" },
    aura: { intensity: 0.8, color: "200 60% 70%" },
    particles: { symbols: ["⭐", "✨", "💧", "✦"], style: "float" },
    mood: "gentle",
    microcopy: {
      intro: "A esperança ilumina o portal.",
      presence: "Há luz depois da tempestade.",
      unlock: "A Estrela renovou seu propósito.",
    },
  },
  18: {
    id: 18,
    slug: "a-lua",
    palette: { primary: "240 30% 40%", secondary: "260 20% 30%", accent: "200 30% 60%", background: "240 40% 5%" },
    aura: { intensity: 0.7, color: "240 30% 40%" },
    particles: { symbols: ["🌙", "🐺", "🦀", "·"], style: "float" },
    mood: "mystical",
    microcopy: {
      intro: "O mistério sussurra no portal.",
      presence: "A intuição guia na escuridão.",
      unlock: "A Lua revelou seu inconsciente.",
    },
  },
  19: {
    id: 19,
    slug: "o-sol",
    palette: { primary: "42 90% 60%", secondary: "36 80% 50%", accent: "42 100% 50%", background: "36 33% 97%" },
    aura: { intensity: 1, color: "42 90% 60%" },
    particles: { symbols: ["☀", "🌻", "✨", "✦"], style: "ascendant" },
    mood: "intense",
    microcopy: {
      intro: "A clareza abre o portal.",
      presence: "A alegria de estar viva.",
      unlock: "O Sol brilhou em sua jornada.",
    },
  },
  20: {
    id: 20,
    slug: "o-julgamento",
    palette: { primary: "220 40% 60%", secondary: "0 50% 50%", accent: "42 60% 70%", background: "36 33% 97%" },
    aura: { intensity: 0.9, color: "220 40% 60%" },
    particles: { symbols: ["🎺", "🕊", "✦", "✨"], style: "ascendant" },
    mood: "dramatic",
    microcopy: {
      intro: "O chamado desperta o portal.",
      presence: "A alma se ergue para a verdade.",
      unlock: "O Julgamento ouviu seu despertar.",
    },
  },
  21: {
    id: 21,
    slug: "o-mundo",
    palette: { primary: "260 40% 50%", secondary: "140 30% 45%", accent: "42 60% 65%", background: "36 33% 97%" },
    aura: { intensity: 1, color: "260 40% 50%" },
    particles: { symbols: ["❀", "🕊", "✨", "♾"], style: "float" },
    mood: "mystical",
    microcopy: {
      intro: "A completude dança no portal.",
      presence: "Você é o centro de tudo.",
      unlock: "O Mundo celebrou sua vitória.",
    },
  },
};

export function getArcanoTheme(id: number): ArcanoTheme {
  // Garantimos que o fallback nunca seja O Louco (ID 0) para outros IDs
  return ARCANO_THEMES[id] || { ...DEFAULT_THEME, id };
}
