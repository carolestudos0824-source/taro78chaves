import { EDITORIAL_REGISTRY } from "./src/content/arcanos-maiores";
import { ARCANOS_MENORES } from "./src/content/arcanos-menores";

const maiores = Object.entries(EDITORIAL_REGISTRY).map(([id, a]) => ({
  id, name: a.name, type: 'maior', 
  hasAmor: !!(a.love.light), hasTrabalho: !!(a.work.light), hasEspiritualidade: !!(a.spirituality.light),
  hasDeepDive: !!(a.deepDive.text), hasQuiz: a.quiz.length >= 5
}));

const menores = ARCANOS_MENORES.map(a => ({
  id: a.id, name: a.nome, type: 'menor',
  hasAmor: !!(a.interpretacaoAmor), hasTrabalho: !!(a.interpretacaoTrabalho), hasEspiritualidade: !!(a.interpretacaoEspiritualidade),
  hasDeepDive: !!(a.aprofundamento), hasQuiz: a.quiz.length > 0
}));

console.log(JSON.stringify([...maiores, ...menores], null, 2));
