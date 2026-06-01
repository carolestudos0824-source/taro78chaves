
import { DECK_REGISTRY } from "./src/registry/deck-registry";
import { ARCANOS_MENORES } from "./src/content/arcanos-menores/index";
import fs from "fs";
import path from "path";

const report = {
  maiores: { total: 22, aprovados: 0, reprovados: 0, pendencias: [] },
  copas: { total: 14, aprovados: 0, reprovados: 0, pendencias: [] },
  paus: { total: 14, aprovados: 0, reprovados: 0, pendencias: [] },
  ouros: { total: 14, aprovados: 0, reprovados: 0, pendencias: [] },
  espadas: { total: 14, aprovados: 0, reprovados: 0, pendencias: [] },
};

function checkFile(assetPath) {
  // Asset path is like "/src/assets/..." or "@assets/..." or a direct import result
  // In our sandbox, we can check src/assets/
  const filename = assetPath.split('/').pop();
  const fullPath = path.join(process.cwd(), "src", "assets", filename);
  return fs.existsSync(fullPath);
}

// Major Arcana check
DECK_REGISTRY.forEach(card => {
  let issues = [];
  if (card.assetStatus !== "official") issues.push("Asset status is not official");
  if (!card.cardImage) issues.push("Image missing");
  // Pedagogical content check (basic)
  if (!card.name || !card.subtitle) issues.push("Basic pedagogical metadata missing");
  
  if (issues.length === 0) {
    report.maiores.aprovados++;
  } else {
    report.maiores.reprovados++;
    report.maiores.pendencias.push({ name: card.name, issues });
  }
});

// Minor Arcana check
ARCANOS_MENORES.forEach(card => {
  let issues = [];
  const suit = card.naipe;
  
  if (!card.cardImage) issues.push("Image missing");
  if (!card.essencia) issues.push("Essência content missing");
  if (!card.aprofundamento || card.aprofundamento.length < 300) issues.push("Aprofundamento too short or missing");
  if (!card.quiz || card.quiz.length < 3) issues.push("Quiz incomplete");
  if (!card.revisaoRapida || !card.revisaoRapida.palavraChave) issues.push("Revisão rápida missing");

  if (issues.length === 0) {
    report[suit].aprovados++;
  } else {
    report[suit].reprovados++;
    report[suit].pendencias.push({ name: card.nome, issues });
  }
});

console.log(JSON.stringify(report, null, 2));
