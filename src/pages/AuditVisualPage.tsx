import React, { useState } from "react";
import { 
  O_LOUCO, 
  editorialToLegacy 
} from "@/content/arcanos-maiores";

const AuditVisualPage = () => {
  const [phaseIdx, setPhaseIdx] = useState(2); 
  const arcano = editorialToLegacy(O_LOUCO, true);
  const phases = ["intro", "simbolos", "luz-sombra", "voz", "aprofundamento", "aplicacoes", "reflexao", "quiz", "complete"];
  const phase = phases[phaseIdx];

  return (
    <div style={{ background: "#FAF5EF", color: "#5B1F3D", padding: "10px", fontSize: "14px" }}>
      <div style={{ padding: "10px", borderBottom: "1px solid gold", marginBottom: "20px" }}>
        <b>AUDIT: {phase.toUpperCase()}</b>
        <button onClick={() => setPhaseIdx((phaseIdx + 1) % 9)} style={{ float: "right" }}>NEXT</button>
      </div>

      {/* HEADER PREVIEW */}
      <div style={{ background: "white", padding: "10px", border: "1px solid #ccc", marginBottom: "10px", display: "flex", alignItems: "center" }}>
        <img src={arcano.cardImage} style={{ width: "40px", marginRight: "10px" }} />
        <div>
          <div style={{ fontSize: "10px", color: "gold" }}>ARCANO 0</div>
          <div style={{ fontWeight: "bold" }}>O LOUCO</div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ background: "white", padding: "15px" }}>
        {phase === "luz-sombra" && <div>
           <div style={{ color: "orange" }}>LUZ</div>
           <p>{arcano.layers.main.light}</p>
           <div style={{ color: "purple" }}>SOMBRA</div>
           <p>{arcano.layers.main.shadow}</p>
        </div>}
        {phase === "voz" && <div style={{ fontStyle: "italic", fontSize: "18px" }}>"{arcano.voiceText}"</div>}
        {phase === "aprofundamento" && <div>{arcano.layers.deepDive.text}</div>}
        {phase === "aplicacoes" && <div>{arcano.lessonSections.find(s => s.id === 'amor')?.content}</div>}
        {phase === "reflexao" && <div>{arcano.initiationLesson}</div>}
        {phase === "quiz" && <div>{arcano.quiz[0].question}</div>}
      </div>
    </div>
  );
};

export default AuditVisualPage;
