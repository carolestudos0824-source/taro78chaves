import { ARCANOS_MAIORES_CATALOG } from "./index";
import { resolveMaiorVisual, resolveMenorVisualById } from "./visual-registry";

export interface ArcanaSummary {
  id: string | number;
  name: string;
  image: string;
}

/**
 * Returns a deterministic set of arcana for a given date and user
 */
export function getDailyArcanaSet(date: string, userId: string, count: number = 3): ArcanaSummary[] {
  const seed = date + userId;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; 
  }

  const allArcanaIds: string[] = [];
  // Add 22 Majors
  for (let i = 0; i <= 21; i++) allArcanaIds.push(`arcano-${i}`);
  
  // Add 56 Minors
  const naipes = ["copas", "paus", "espadas", "ouros"];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "pajem", "cavaleiro", "rainha", "rei"];
  for (const naipe of naipes) {
    for (const rank of ranks) {
      allArcanaIds.push(`${naipe}-${rank}`);
    }
  }

  const selected: ArcanaSummary[] = [];
  const tempIds = [...allArcanaIds];
  
  for (let i = 0; i < count; i++) {
    const index = Math.abs(hash + i) % tempIds.length;
    const id = tempIds[index];
    tempIds.splice(index, 1); // Avoid duplicates
    
    let name = "";
    let image = "";
    
    if (id.startsWith("arcano-")) {
      const num = parseInt(id.split("-")[1]);
      name = ARCANOS_MAIORES_CATALOG[num]?.name || "O Louco";
      image = resolveMaiorVisual(num).resolvedAssetUrl || "";
    } else {
      const visual = resolveMenorVisualById(id);
      name = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      image = visual.resolvedAssetUrl || "";
    }
    
    selected.push({ id, name, image });
  }
  
  return selected;
}

/**
 * Returns previous, current, and next arcana based on journey position
 */
export function getJourneyArcanaSet(currentArcanaId: string | number): ArcanaSummary[] {
  // Journey logic usually follows Majors 0-21 then Minors
  const allIds: string[] = [];
  for (let i = 0; i <= 21; i++) allIds.push(`arcano-${i}`);
  const naipes = ["copas", "paus", "espadas", "ouros"];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "pajem", "cavaleiro", "rainha", "rei"];
  for (const naipe of naipes) {
    for (const rank of ranks) {
      allIds.push(`${naipe}-${rank}`);
    }
  }

  const normalizedCurrent = typeof currentArcanaId === "number" ? `arcano-${currentArcanaId}` : currentArcanaId;
  const currentIndex = allIds.indexOf(normalizedCurrent);
  
  const getArcana = (index: number): ArcanaSummary => {
    // Loop around for previous/next if at boundaries
    const safeIndex = (index + allIds.length) % allIds.length;
    const id = allIds[safeIndex];
    let name = "";
    let image = "";
    
    if (id.startsWith("arcano-")) {
      const num = parseInt(id.split("-")[1]);
      name = ARCANOS_MAIORES_CATALOG[num]?.name || "";
      image = resolveMaiorVisual(num).resolvedAssetUrl || "";
    } else {
      const visual = resolveMenorVisualById(id);
      name = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      image = visual.resolvedAssetUrl || "";
    }
    return { id, name, image };
  };

  return [
    getArcana(currentIndex - 1),
    getArcana(currentIndex),
    getArcana(currentIndex + 1)
  ];
}
