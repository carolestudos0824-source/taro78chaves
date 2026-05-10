
import { FULL_DECK } from './src/registry/deck-registry';

const placeholders = FULL_DECK.filter(c => c.assetStatus === 'placeholder');
console.log(`Total: ${FULL_DECK.length}`);
console.log(`Official: ${FULL_DECK.length - placeholders.length}`);
console.log(`Placeholders: ${placeholders.length}`);
if (placeholders.length > 0) {
  console.log('Placeholder IDs:', placeholders.map(c => c.id).join(', '));
}
