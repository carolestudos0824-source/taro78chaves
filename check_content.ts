
import { FULL_DECK } from './src/registry/deck-registry';
import { PAUS_1_5 } from './src/content/arcanos-menores/paus-1-5';
import { PAUS_6_10 } from './src/content/arcanos-menores/paus-6-10';
import { PAUS_CORTE } from './src/content/arcanos-menores/paus-corte';
import { OUROS_1_5 } from './src/content/arcanos-menores/ouros-1-5';
import { OUROS_6_10 } from './src/content/arcanos-menores/ouros-6-10';
import { OUROS_CORTE } from './src/content/arcanos-menores/ouros-corte';
import { COPAS_1_5 } from './src/content/arcanos-menores/copas-1-5';
import { COPAS_6_10 } from './src/content/arcanos-menores/copas-6-10';
import { COPAS_CORTE } from './src/content/arcanos-menores/copas-corte';
import { ESPADAS_1_5 } from './src/content/arcanos-menores/espadas-1-5';
import { ESPADAS_6_10 } from './src/content/arcanos-menores/espadas-6-10';
import { ESPADAS_CORTE } from './src/content/arcanos-menores/espadas-corte';

// Major Arcana files are separate, let's just check the ones we have imports for or check existence
const minorContent = [
  ...PAUS_1_5, ...PAUS_6_10, ...PAUS_CORTE,
  ...OUROS_1_5, ...OUROS_6_10, ...OUROS_CORTE,
  ...COPAS_1_5, ...COPAS_6_10, ...COPAS_CORTE,
  ...ESPADAS_1_5, ...ESPADAS_6_10, ...ESPADAS_CORTE
];

const minorIds = FULL_DECK.filter(c => c.category !== 'maior').map(c => c.id);
const missingMinor = minorIds.filter(id => !minorContent.find(c => c.id === id));

console.log(`Minor Arcana Total: ${minorIds.length}`);
console.log(`Minor Content Found: ${minorContent.length}`);
console.log(`Missing Minor Content: ${missingMinor.length}`);
if (missingMinor.length > 0) {
  console.log('Missing Minor IDs:', missingMinor.join(', '));
}

// Check Major Arcana
// For Major, we'll check if files exist in src/content/arcanos-maiores/
const majorIds = FULL_DECK.filter(c => c.category === 'maior').map(c => c.id);
// We'll trust the directory listing from earlier for now, but let's check one by one if we were doing a full script.
// Since we have the list, let's just assume they are there and have the right names based on the earlier ls.
