import { EDITORIAL_REGISTRY } from "./src/content/arcanos-maiores";
import { validateArcano } from "./src/content/arcanos-maiores/_editorial";

const results = Object.entries(EDITORIAL_REGISTRY).map(([id, arcano]) => {
  const errors = validateArcano(arcano);
  return {
    id,
    name: arcano.name,
    errors: errors,
    hasAmor: !!(arcano.love.light && arcano.love.shadow),
    hasTrabalho: !!(arcano.work.light && arcano.work.shadow),
    hasEspiritualidade: !!(arcano.spirituality.light && arcano.spirituality.shadow),
    hasDeepDive: !!(arcano.deepDive.text && arcano.deepDive.symbolism && arcano.deepDive.cabala && arcano.deepDive.history),
    hasQuiz: arcano.quiz.length >= 5,
    hasSymbols: arcano.symbols.length > 0,
    hasSymbolsMap: (arcano.symbolsMap?.length ?? 0) > 0
  };
});

console.log(JSON.stringify(results, null, 2));
