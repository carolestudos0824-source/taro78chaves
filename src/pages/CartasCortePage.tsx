import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { useCourtCardsContent } from "@/hooks/use-content";
import { NAIPES, type Naipe } from "@/registry/naipes";
import { useResolvedArcanoMenorPilot } from "@/hooks/use-resolved-arcanos-menores-pilot";

/**
 * Telemetria invisível da Fase 3 — dispara o hook do adaptador para validar
 * que o piloto das cortes (Pajem de Ouros, Cavaleiro de Copas, Rainha de
 * Espadas, Rei de Paus) resolve via DB. Não altera UI nem comportamento.
 */
const PilotCortePilots = () => {
  // Fase 3B — todas as 16 cortes (4 cortes × 4 naipes)
  const naipes = ["copas", "paus", "espadas", "ouros"] as const;
  const cortes = ["pajem", "cavaleiro", "rainha", "rei"] as const;
  return (
    <>
      {naipes.flatMap((n) =>
        cortes.map((c) => <CorteProbe key={`${n}-${c}`} naipe={n} corte={c} />),
      )}
    </>
  );
};

const CorteProbe = ({
  naipe,
  corte,
}: {
  naipe: Naipe;
  corte: "pajem" | "cavaleiro" | "rainha" | "rei";
}) => {
  useResolvedArcanoMenorPilot(naipe, corte);
  return null;
};

const CartasCortePage = () => {
  const navigate = useNavigate();
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [openNaipe, setOpenNaipe] = useState<string | null>(null);
  const { data: courtData } = useCourtCardsContent();
  const CARTAS_CORTE = courtData?.items ?? [];

  const progressColors = [
    { bg: "hsl(36 45% 58% / 0.10)", border: "hsl(36 45% 58% / 0.30)", accent: "hsl(36 45% 45%)" },
    { bg: "hsl(15 60% 50% / 0.08)", border: "hsl(15 60% 50% / 0.25)", accent: "hsl(15 60% 45%)" },
    { bg: "hsl(340 42% 28% / 0.08)", border: "hsl(340 42% 28% / 0.20)", accent: "hsl(340 42% 28%)" },
    { bg: "hsl(270 35% 40% / 0.08)", border: "hsl(270 35% 40% / 0.20)", accent: "hsl(270 35% 40%)" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
          opacity: 0.98,
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 50% 20%, rgba(243, 230, 224, 0.45) 0%, transparent 70%)",
        }} />
      </div>

      {/* Header — Premium Style */}
      <header className="relative z-10" style={{
        borderBottom: "1.5px solid #C8A66A40",
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
      }}>
        <div className="container max-w-3xl py-6 px-6 flex items-center gap-6">
          <button 
            onClick={() => navigate("/app")} 
            className="transition-all hover:scale-110 duration-200 w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30] shadow-sm" 
            style={{ color: "#5B1F3D" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase font-heading mb-1.5 flex items-center gap-2 font-black" style={{ color: "#C8A66A" }}>
              <Sparkles className="w-3.5 h-3.5" /> Módulo Formação
            </span>
            <h1 className="font-heading text-xl md:text-2xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
              As Cartas da Corte
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6 py-10">
        <PilotCortePilots />
        
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 animate-fade-up">
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-2xl transition-all duration-700" style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            border: `2.5px solid #C8A66A`,
            boxShadow: `0 20px 50px rgba(91, 31, 61, 0.2), 0 0 30px rgba(200, 166, 106, 0.1)`,
          }}>
            👑
          </div>
          
          <div className="space-y-3">
            <h2 className="font-heading text-3xl md:text-4xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
              A Hierarquia da Alma
            </h2>
            <p className="font-accent text-[17px] md:text-[19px] italic leading-relaxed font-black max-w-xl mx-auto" style={{ color: "#5B1F3D" }}>
              "Pajem, Cavaleiro, Rainha e Rei — quatro estágios de maturidade que se repetem em cada naipe. Compreendê-los é entender como a energia evolui de aprendiz a mestre."
            </p>
          </div>

          {/* Progression Visual */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {CARTAS_CORTE.map((carta, i) => (
              <div key={carta.id} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 shadow-md border-2" style={{
                    background: "#FAF5EF",
                    borderColor: progressColors[i].accent,
                    color: progressColors[i].accent,
                  }}>
                    {carta.simbolo}
                  </div>
                  <span className="text-[10px] font-heading tracking-[0.2em] uppercase font-black" style={{ color: progressColors[i].accent }}>
                    {carta.nome}
                  </span>
                </div>
                {i < CARTAS_CORTE.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[#C8A66A40]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {CARTAS_CORTE.map((carta, idx) => {
            const isOpen = openCard === carta.id;
            const colors = progressColors[idx];

            return (
              <div
                key={carta.id}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? "hsl(38 30% 95% / 0.95)" : "hsl(38 30% 95% / 0.70)",
                  border: `1px solid ${isOpen ? colors.border : "hsl(36 25% 82% / 0.40)"}`,
                  boxShadow: isOpen ? `0 4px 25px ${colors.border}` : "none",
                  animation: `fade-up 0.4s ease-out ${idx * 0.08}s both`,
                }}
              >
                {/* Header */}
                <button
                  onClick={() => setOpenCard(isOpen ? null : carta.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0" style={{
                    background: colors.bg,
                    border: `1.5px solid ${colors.border}`,
                  }}>
                    {carta.simbolo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>
                      {carta.nome}
                    </h3>
                    <p className="text-xs font-accent italic" style={{ color: "hsl(230 20% 25% / 0.50)" }}>
                      {carta.subtitulo} — {carta.principio}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-300" style={{
                    color: "hsl(230 10% 50%)",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }} />
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-5 pb-6 space-y-5" style={{ animation: "fade-up 0.3s ease-out" }}>
                    <div className="h-px" style={{
                      background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
                    }} />

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1.5">
                      {carta.palavrasChave.map((kw) => (
                        <span key={kw} className="text-xs px-2.5 py-1 rounded-full font-heading tracking-wider" style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          color: colors.accent,
                        }}>
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Main text */}
                    {carta.textoPrincipal.split("\n\n").map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{p}</p>
                    ))}

                    {/* Symbolic explanation */}
                    <div className="rounded-lg p-4" style={{
                      background: "hsl(340 42% 28% / 0.03)",
                      border: "1px solid hsl(340 42% 28% / 0.10)",
                    }}>
                      <h4 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(340 42% 26%)" }}>
                        ✦ Explicação Simbólica
                      </h4>
                      {carta.explicacaoSimbolica.split("\n\n").map((p, i) => (
                        <p key={i} className="text-xs leading-relaxed mb-2 last:mb-0" style={{ color: "hsl(230 20% 25% / 0.80)" }}>{p}</p>
                      ))}
                    </div>

                    {/* Psychological reading */}
                    <div className="rounded-lg p-4" style={{
                      background: "hsl(270 35% 40% / 0.03)",
                      border: "1px solid hsl(270 35% 40% / 0.10)",
                    }}>
                      <h4 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(270 35% 35%)" }}>
                        🧠 Leitura Psicológica
                      </h4>
                      {carta.leituraPsicologica.split("\n\n").map((p, i) => (
                        <p key={i} className="text-xs leading-relaxed mb-2 last:mb-0" style={{ color: "hsl(230 20% 25% / 0.80)" }}>{p}</p>
                      ))}
                    </div>

                    {/* Practical reading */}
                    <div className="rounded-lg p-4" style={{
                      background: "hsl(36 45% 58% / 0.05)",
                      border: "1px solid hsl(36 45% 58% / 0.15)",
                    }}>
                      <h4 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(36 45% 40%)" }}>
                        🎯 Leitura Prática
                      </h4>
                      {carta.leituraPratica.split("\n\n").map((p, i) => (
                        <p key={i} className="text-xs leading-relaxed mb-2 last:mb-0" style={{ color: "hsl(230 20% 25% / 0.80)" }}>{p}</p>
                      ))}
                    </div>

                    {/* Per-suit manifestation */}
                    <div>
                      <h4 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(230 20% 25% / 0.60)" }}>
                        {carta.nome} em cada naipe
                      </h4>
                      <div className="space-y-2">
                        {(["copas", "paus", "espadas", "ouros"] as const).map((naipe) => {
                          const info = NAIPES[naipe];
                          const manifest = carta.manifestacao[naipe];
                          const naipeKey = `${carta.id}-${naipe}`;
                          const isNaipeOpen = openNaipe === naipeKey;

                          return (
                            <div key={naipe} className="rounded-lg overflow-hidden" style={{
                              background: info.color.surface,
                              border: `1px solid ${info.color.border}`,
                            }}>
                              <button
                                onClick={() => setOpenNaipe(isNaipeOpen ? null : naipeKey)}
                                className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left"
                              >
                                <span className="text-sm">{info.icon}</span>
                                <span className="font-heading text-xs tracking-wide flex-1" style={{ color: info.color.primary }}>
                                  {manifest.titulo}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 shrink-0 transition-transform duration-200" style={{
                                  color: "hsl(230 10% 55%)",
                                  transform: isNaipeOpen ? "rotate(180deg)" : "rotate(0deg)",
                                }} />
                              </button>
                              {isNaipeOpen && (
                                <div className="px-3.5 pb-3" style={{ animation: "fade-up 0.2s ease-out" }}>
                                  <p className="text-xs leading-relaxed" style={{ color: "hsl(230 20% 20%)" }}>
                                    {manifest.texto}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interpretation examples */}
                    <div className="rounded-lg p-4" style={{
                      background: "hsl(160 30% 45% / 0.04)",
                      border: "1px solid hsl(160 30% 45% / 0.12)",
                    }}>
                      <h4 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(160 30% 35%)" }}>
                        💡 Exemplos de Interpretação
                      </h4>
                      <ul className="space-y-2">
                        {carta.exemplosInterpretacao.map((ex, i) => (
                          <li key={i} className="text-xs leading-relaxed" style={{ color: "hsl(230 20% 20%)" }}>
                            <span style={{ color: "hsl(160 30% 35%)" }}>◆ </span>{ex}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Reflection */}
                    <div className="rounded-lg p-4" style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                    }}>
                      <p className="font-accent text-xs italic leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.65)" }}>
                        💭 {carta.reflexao}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-10" style={{ animation: "fade-up 0.5s ease-out 0.5s both" }}>
          <button
            onClick={() => navigate("/app")}
            className="text-xs font-heading tracking-wider transition-colors"
            style={{ color: "hsl(230 10% 45%)" }}
          >
            ← Voltar aos módulos
          </button>
        </div>
      </main>
    </div>
  );
};

export default CartasCortePage;
