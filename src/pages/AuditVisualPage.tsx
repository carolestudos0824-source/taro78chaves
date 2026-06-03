import React, { useState } from "react";
import { 
  O_LOUCO, 
  editorialToLegacy 
} from "@/content/arcanos-maiores";

const AuditVisualPage = () => {
  const [phaseIdx, setPhaseIdx] = useState(2); // Start at Luz e Sombra
  const arcano = editorialToLegacy(O_LOUCO, true);
  const phases = ["intro", "simbolos", "luz-sombra", "voz", "aprofundamento", "aplicacoes", "reflexao", "quiz", "complete"];
  const phase = phases[phaseIdx];

  const next = () => setPhaseIdx(p => (p + 1) % phases.length);

  return (
    <div style={{ background: "#FAF5EF", minHeight: "100vh", padding: "20px", color: "#5B1F3D", fontFamily: "serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "2px solid #C8A66A" }}>
        <button onClick={() => setPhaseIdx(p => Math.max(0, p - 1))}>Back</button>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "16px" }}>{phase.toUpperCase()}</h1>
          <p style={{ margin: 0, fontSize: "10px" }}>Phase {phaseIdx + 1}/9</p>
        </div>
        <button onClick={next}>Next</button>
      </div>

      <div style={{ maxWidth: "350px", margin: "0 auto" }}>
        {/* SMALL HEADER PREVIEW */}
        {phase !== "voz" && phase !== "intro" && phase !== "complete" && (
          <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "white", padding: "10px", borderRadius: "15px", border: "1px solid #C8A66A33", marginBottom: "20px" }}>
            <img src={arcano.cardImage} style={{ width: "50px", borderRadius: "8px" }} alt="card" />
            <div>
              <p style={{ margin: 0, fontSize: "10px", fontWeight: "bold", color: "#C8A66A" }}>ARCANO 0</p>
              <h2 style={{ margin: 0, fontSize: "18px" }}>O Louco</h2>
            </div>
          </div>
        )}

        {/* AURA HEADER PREVIEW (VOZ) */}
        {phase === "voz" && (
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <img src={arcano.cardImage} style={{ width: "100px", borderRadius: "10px", boxShadow: "0 0 20px #C8A66A66", marginBottom: "10px" }} alt="card" />
            <p style={{ margin: 0, fontSize: "10px", fontWeight: "bold", color: "#C8A66A" }}>ARCANO 0</p>
            <h2 style={{ margin: 0, fontSize: "22px" }}>O Louco</h2>
          </div>
        )}

        {/* CONTENT PREVIEW */}
        <div style={{ background: "white", padding: "25px", borderRadius: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          {phase === "luz-sombra" && (
            <div>
              <h3 style={{ color: "#8B6A30", fontSize: "12px", letterSpacing: "2px" }}>LUZ</h3>
              <p style={{ fontSize: "16px", lineHeight: "1.6" }}>{arcano.layers.main.light}</p>
              <h3 style={{ color: "#5B1F3D99", fontSize: "12px", letterSpacing: "2px", marginTop: "20px" }}>SOMBRA</h3>
              <p style={{ fontSize: "16px", lineHeight: "1.6" }}>{arcano.layers.main.shadow}</p>
            </div>
          )}
          {phase === "voz" && (
            <blockquote style={{ fontStyle: "italic", fontSize: "20px", borderLeft: "4px solid #C8A66A", paddingLeft: "15px" }}>
              "{arcano.voiceText}"
            </blockquote>
          )}
          {phase === "aprofundamento" && (
            <div>
              <h3 style={{ color: "#5B1F3D", fontSize: "14px" }}>Aprofundamento</h3>
              <p style={{ fontSize: "15px" }}>{arcano.layers.deepDive.text.substring(0, 200)}...</p>
            </div>
          )}
          {phase === "aplicacoes" && (
            <div>
              <h3 style={{ color: "#5B1F3D", fontSize: "14px" }}>Aplicações</h3>
              <p><strong>Amor:</strong> {arcano.lessonSections.find(s => s.id === 'amor')?.content}</p>
            </div>
          )}
          {phase === "reflexao" && (
            <div>
              <h3 style={{ color: "#5B1F3D", fontSize: "14px" }}>Exercício</h3>
              <p style={{ fontStyle: "italic" }}>{arcano.initiationLesson}</p>
              <button style={{ width: "100%", padding: "15px", background: "#5B1F3D", color: "white", border: "none", borderRadius: "10px", marginTop: "20px" }}>CONCLUIR</button>
            </div>
          )}
          {phase === "quiz" && (
            <div>
              <h3 style={{ color: "#5B1F3D", fontSize: "14px" }}>Quiz</h3>
              <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px", marginBottom: "10px" }}>
                {arcano.quiz[0].question}
              </div>
            </div>
          )}
          {phase === "complete" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "gold", borderRadius: "50%", margin: "0 auto 20px" }}></div>
              <h2>Concluído!</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditVisualPage;
