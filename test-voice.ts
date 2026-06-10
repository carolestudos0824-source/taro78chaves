import { getArcanoFull } from './src/lib/content/catalog';
import { EDITORIAL_REGISTRY } from './src/content/arcanos-maiores';

for (let i = 0; i <= 21; i++) {
  const arcano = getArcanoFull(i);
  const editorial = EDITORIAL_REGISTRY[i];
  if (!arcano) {
    console.log(`Arcano ${i} not found in catalog`);
    continue;
  }
  if (!editorial) {
     console.log(`Arcano ${i} not found in editorial registry`);
     continue;
  }
  console.log(`Arcano ${i}: ${arcano.name} - Voice: ${arcano.voiceText.substring(0, 30)}...`);
  if (i > 0 && arcano.voiceText.includes("Eu sou o Louco")) {
    console.log(`!!! BUG: Arcano ${i} has Louco voice !!!`);
  }
}
