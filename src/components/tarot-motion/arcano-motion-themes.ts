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
    intro: "Um novo portal se abre.",
    presence: "A sabedoria do arcano se revela.",
    unlock: "Um novo conhecimento foi desbloqueado.",
  },
};

export const ARCANO_THEMES: Record<number, ArcanoTheme> = {
  0: {
    id: 0,
    slug: "o-louco",
    palette: {
      primary: "42 70% 65%",
      secondary: "200 60% 75%",
      accent: "36 100% 50%",
      background: "36 33% 97%",
    },
    aura: {
      intensity: 0.8,
      color: "42 70% 65%",
    },
    particles: {
      symbols: ["✦", "☀", "·", "✧", "🌿"],
      style: "ascendant",
    },
    mood: "dramatic",
    microcopy: {
      intro: "O primeiro portal se abre.",
      presence: "O impulso antes da certeza.",
      unlock: "O Louco convida ao salto de fé.",
    },
  },
  1: {
    id: 1,
    slug: "o-mago",
    palette: {
      primary: "36 50% 55%",
      secondary: "340 42% 30%",
      accent: "42 80% 70%",
      background: "36 33% 97%",
    },
    aura: {
      intensity: 0.9,
      color: "36 50% 55%",
    },
    particles: {
      symbols: ["∞", "◈", "✦", "⚡", "🌹"],
      style: "float",
    },
    mood: "intense",
    microcopy: {
      intro: "A vontade encontra forma.",
      presence: "O caminho agora aprende a criar.",
      unlock: "O Mago foi desbloqueado.",
    },
  },
  6: {
    id: 6,
    slug: "os-enamorados",
    palette: {
      primary: "333 40% 50%",
      secondary: "42 50% 70%",
      accent: "333 60% 40%",
      background: "36 33% 97%",
    },
    aura: {
      intensity: 0.8,
      color: "333 40% 50%",
    },
    particles: {
      symbols: ["❤", "✦", "✨", "🕊"],
      style: "ascendant",
    },
    mood: "gentle",
    microcopy: {
      intro: "O encontro revela o caminho.",
      presence: "O coração escolhe sua direção.",
      unlock: "A união sagrada foi revelada.",
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
    aura: {
      intensity: 0.7,
      color: "333 50% 24%",
    },
    particles: {
      symbols: ["⛓", "🔥", "·", "⬫"],
      style: "descendant",
    },
    mood: "mystical",
    microcopy: {
      intro: "A sombra revela onde a chave foi esquecida.",
      presence: "Nem toda prisão tem grades.",
      unlock: "A consciência ilumina o desejo.",
    },
  },
};

export function getArcanoTheme(id: number): ArcanoTheme {
  // Garantimos que o fallback nunca seja O Louco (ID 0) para outros IDs
  return ARCANO_THEMES[id] || { ...DEFAULT_THEME, id };
}
