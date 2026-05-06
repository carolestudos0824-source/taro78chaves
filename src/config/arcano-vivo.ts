/**
 * ARCANO VIVO — Configurações visuais, atmosféricas e de animação por arcano
 * 
 * Cada arcano tem uma "personalidade de animação" única:
 * - cores da aura
 * - partículas simbólicas
 * - ritmo da respiração
 * - intensidade do despertar
 * - spotlights de símbolos (posições na carta)
 * - estilo de emergência
 * - atmosfera geral
 */

export interface SymbolSpotlight {
  /** Position as percentage from top-left of card */
  x: number;
  y: number;
  /** Size of the spotlight glow in pixels */
  size: number;
  /** HSL color for this symbol's glow */
  color: string;
  /** Delay before this spotlight appears (ms) */
  delay: number;
  /** Label for pedagogical tooltip */
  label: string;
  /** Duration of the spotlight animation in seconds */
  duration: number;
}

export interface ArcanoVivoConfig {
  /** HSL color for the primary glow (without hsl() wrapper) */
  glowColor: string;
  /** Secondary ambient color */
  ambientColor: string;
  /** Breathing animation speed in seconds */
  breatheSpeed: number;
  /** Particle symbols that float around the card */
  particles: string[];
  /** Card awakening delay in ms */
  awakenDelay: number;
  /** Shimmer sweep delay after awaken */
  shimmerDelay: number;
  /** Voice emergence style */
  voiceStyle: "dramatic" | "gentle" | "mystical";
  /** Background atmosphere gradient stops */
  atmosphere: string[];
  /** Orbit symbols (larger, slower symbols that circle the card) */
  orbitSymbols?: string[];
  /** Intensity: how "alive" the card feels */
  intensity: "subtle" | "moderate" | "intense";
  /** Symbol spotlights — positioned glows over key symbols */
  symbolSpotlights?: SymbolSpotlight[];
  /** Emergence style — how the figure "steps out" */
  emergenceStyle: "dramatic" | "gentle" | "mystical" | "none";
  /** Emergence delay in ms */
  emergenceDelay: number;
  /** Energy flow direction */
  energyFlow: "upward" | "downward" | "radial" | "spiral";
  /** Eye/gaze position on the card (percentage) */
  gazePosition?: { x: number; y: number };
  /** Fabric/flow overlay regions */
  fabricRegions?: { x: number; y: number; width: number; height: number; angle: number }[];
}

const DEFAULT_CONFIG: ArcanoVivoConfig = {
  glowColor: "36 45% 58%",
  ambientColor: "42 70% 80%",
  breatheSpeed: 4,
  particles: ["✦", "·", "✧"],
  awakenDelay: 800,
  shimmerDelay: 2200,
  voiceStyle: "dramatic",
  atmosphere: [
    "hsl(36 45% 58% / 0.06)",
    "transparent",
  ],
  intensity: "moderate",
  emergenceStyle: "none",
  emergenceDelay: 3500,
  energyFlow: "radial",
};

/** Arcano-specific configurations */
const ARCANO_CONFIGS: Record<number, Partial<ArcanoVivoConfig>> = {
  // ─── O LOUCO (0) ───
  // O viajante no precipício. Energia aérea, expansiva, dourada.
  // Foco: trouxa, cachorro, precipício, rosa branca, sol
  0: {
    glowColor: "42 70% 65%",
    ambientColor: "200 60% 75%",
    breatheSpeed: 3.5,
    particles: ["✦", "☀", "·", "✧", "〰", "↗", "🌿"],
    awakenDelay: 600,
    shimmerDelay: 1800,
    voiceStyle: "dramatic",
    atmosphere: [
      "hsl(42 70% 80% / 0.08)",
      "hsl(200 60% 75% / 0.04)",
      "transparent",
    ],
    orbitSymbols: ["☀", "✦"],
    intensity: "intense",
    emergenceStyle: "dramatic",
    emergenceDelay: 3200,
    energyFlow: "upward",
    gazePosition: { x: 55, y: 30 },
    symbolSpotlights: [
      { x: 50, y: 12, size: 40, color: "42 70% 65%", delay: 0, label: "Sol dourado — confiança cósmica", duration: 5 },
      { x: 35, y: 35, size: 28, color: "42 60% 55%", delay: 600, label: "Trouxa — karma inconsciente", duration: 6 },
      { x: 58, y: 55, size: 22, color: "0 0% 95%", delay: 1200, label: "Rosa branca — pureza e inocência", duration: 5.5 },
      { x: 30, y: 72, size: 26, color: "30 40% 50%", delay: 1800, label: "Cachorro — instinto protetor", duration: 6 },
      { x: 50, y: 90, size: 50, color: "36 30% 45%", delay: 2400, label: "Precipício — fé no desconhecido", duration: 7 },
    ],
    fabricRegions: [
      { x: 25, y: 30, width: 50, height: 40, angle: -5 }, // túnica
    ],
  },

  // ─── O MAGO (1) ───
  // Poder focalizado, magnético. Bastão elevado, mão apontando, mesa dos 4 elementos.
  1: {
    glowColor: "36 50% 55%",
    ambientColor: "340 42% 30%",
    breatheSpeed: 4.5,
    particles: ["∞", "◈", "✦", "⚡", "·", "🌹"],
    awakenDelay: 900,
    shimmerDelay: 2400,
    voiceStyle: "dramatic",
    atmosphere: [
      "hsl(36 45% 58% / 0.08)",
      "hsl(340 42% 30% / 0.04)",
      "transparent",
    ],
    orbitSymbols: ["∞", "◈"],
    intensity: "intense",
    emergenceStyle: "dramatic",
    emergenceDelay: 3400,
    energyFlow: "upward",
    gazePosition: { x: 48, y: 28 },
    symbolSpotlights: [
      { x: 48, y: 15, size: 30, color: "42 80% 70%", delay: 0, label: "∞ Lemniscata — poder infinito, ciclo eterno", duration: 6 },
      { x: 48, y: 30, size: 24, color: "36 50% 60%", delay: 500, label: "Bastão elevado — canal entre céu e terra", duration: 5 },
      { x: 30, y: 45, size: 20, color: "36 50% 55%", delay: 1000, label: "Mão apontando — 'como acima, abaixo'", duration: 5.5 },
      { x: 48, y: 68, size: 40, color: "36 40% 50%", delay: 1500, label: "Mesa dos 4 elementos — domínio das forças", duration: 6 },
      { x: 48, y: 85, size: 35, color: "120 40% 45%", delay: 2000, label: "Jardim de rosas — criação em flor", duration: 5 },
    ],
    fabricRegions: [
      { x: 20, y: 35, width: 60, height: 30, angle: 0 }, // manto vermelho
    ],
  },

  // ─── A SACERDOTISA (2) ───
  // Energia lunar, silenciosa, magnética. Colunas, véu, livro, lua.
  2: {
    glowColor: "220 40% 65%",
    ambientColor: "260 30% 60%",
    breatheSpeed: 6,
    particles: ["☽", "·", "✧", "⊹", "◦", "∘"],
    awakenDelay: 1200,
    shimmerDelay: 3000,
    voiceStyle: "mystical",
    atmosphere: [
      "hsl(220 40% 65% / 0.06)",
      "hsl(260 30% 60% / 0.03)",
      "transparent",
    ],
    orbitSymbols: ["☽", "✧"],
    intensity: "subtle",
    emergenceStyle: "mystical",
    emergenceDelay: 4000,
    energyFlow: "downward",
    gazePosition: { x: 48, y: 32 },
    symbolSpotlights: [
      { x: 48, y: 8, size: 28, color: "220 50% 75%", delay: 0, label: "Lua crescente — intuição, ciclos, mistério", duration: 7 },
      { x: 18, y: 45, size: 22, color: "0 0% 20%", delay: 800, label: "Coluna B (Boaz) — força, o feminino", duration: 6 },
      { x: 78, y: 45, size: 22, color: "0 0% 90%", delay: 800, label: "Coluna J (Jachin) — estabelecer, o masculino", duration: 6 },
      { x: 48, y: 40, size: 30, color: "260 30% 50%", delay: 1600, label: "Véu — o que está oculto entre os opostos", duration: 7 },
      { x: 48, y: 60, size: 24, color: "220 35% 55%", delay: 2200, label: "Rolo da Torá (TORA) — sabedoria escondida", duration: 6 },
      { x: 48, y: 82, size: 28, color: "220 40% 65%", delay: 2800, label: "Lua aos pés — domínio sobre o inconsciente", duration: 7 },
    ],
    fabricRegions: [
      { x: 20, y: 35, width: 60, height: 35, angle: 0 }, // véu entre colunas
      { x: 15, y: 40, width: 70, height: 45, angle: 0 }, // manto azul
    ],
  },
  
  // ─── O DIABO (15) ───
  // Energia densa, magnética, sombras. Correntes, fogo, sombra.
  15: {
    glowColor: "333 50% 24%", // Plum profundo
    ambientColor: "0 60% 15%", // Vermelho sombrio
    breatheSpeed: 5,
    particles: ["⛓", "🔥", "·", "⬫"],
    awakenDelay: 1000,
    shimmerDelay: 2500,
    voiceStyle: "mystical",
    atmosphere: [
      "hsl(333 50% 15% / 0.12)",
      "hsl(0 60% 10% / 0.08)",
      "transparent",
    ],
    intensity: "moderate",
    energyFlow: "downward",
    gazePosition: { x: 48, y: 22 },
    symbolSpotlights: [
      { x: 48, y: 15, size: 45, color: "0 70% 40%", delay: 0, label: "Tocha invertida — fogo da paixão material", duration: 6 },
      { x: 48, y: 35, size: 50, color: "333 40% 20%", delay: 800, label: "O Diabo — o magnetismo das sombras", duration: 7 },
      { x: 48, y: 75, size: 40, color: "0 0% 20%", delay: 1600, label: "Correntes largas — o apego voluntário", duration: 6 },
    ],
  },

export function getArcanoVivoConfig(arcanoId: number): ArcanoVivoConfig {
  const specific = ARCANO_CONFIGS[arcanoId] || {};
  return { ...DEFAULT_CONFIG, ...specific };
}
