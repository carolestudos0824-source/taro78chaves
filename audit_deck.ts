import { ARCANOS_MAIORES } from "./src/content/arcanos-maiores/index";
import { ARCANOS_MENORES } from "./src/content/arcanos-menores/index";

const allCards = [...ARCANOS_MAIORES, ...ARCANOS_MENORES];

console.log(`Total cards found: ${allCards.length}`);

const missingContent = allCards.filter(c => !c.essencia || c.essencia.length < 10);
const missingImage = allCards.filter(c => !c.cardImage);

if (missingContent.length > 0) {
  console.log("Cards missing content:");
  missingContent.forEach(c => console.log(`- ${c.id}: ${c.nome}`));
} else {
  console.log("All cards have content.");
}

if (missingImage.length > 0) {
  console.log("Cards missing images:");
  missingImage.forEach(c => console.log(`- ${c.id}: ${c.nome}`));
} else {
  console.log("All cards have images.");
}

if (allCards.length !== 78) {
  console.log(`WARNING: Expected 78 cards, found ${allCards.length}`);
}
