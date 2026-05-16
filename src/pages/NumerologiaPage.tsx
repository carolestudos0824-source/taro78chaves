import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNumerologyContent } from "@/hooks/use-content";
import { NAIPES } from "@/registry/naipes";

const NumerologiaPage = () => {
  const navigate = useNavigate();
  const [openCard, setOpenCard] = useState<number | null>(null);
  const { data: numerology, isLoading } = useNumerologyContent();
  const NUMEROLOGIA = numerology?.items ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Marfim Suave refined */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 20%, rgba(243, 230, 224, 0.45) 0%, transparent 70%)",
          }}
        />
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
              Numerologia dos Menores
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6 py-10">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 animate-fade-up">
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-2xl transition-all duration-700" style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            border: `2.5px solid #C8A66A`,
            boxShadow: `0 20px 50px rgba(91, 31, 61, 0.2), 0 0 30px rgba(200, 166, 106, 0.1)`,
          }}>
            ⟐
          </div>
          
          <div className="space-y-3">
            <h2 className="font-heading text-3xl md:text-4xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
              A Linguagem dos Números
            </h2>
            <p className="font-accent text-[17px] md:text-[19px] italic leading-relaxed font-black max-w-xl mx-auto" style={{ color: "#5B1F3D" }}>
              "No tarô, cada número carrega uma energia própria que se manifesta de forma diferente em cada naipe. Compreender os números é ter a chave para ler qualquer carta menor."
            </p>
          </div>
        </div>

        {/* Journey line */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px" style={{
            background: "linear-gradient(to bottom, transparent, hsl(36 45% 58% / 0.30), hsl(340 42% 28% / 0.20), transparent)",
          }} />

          <div className="space-y-4">
            {NUMEROLOGIA.map((num, idx) => {
              const isOpen = openCard === num.numero;
              return (
                <div
                  key={num.numero}
                  className="relative pl-14"
                  style={{ animation: `fade-up 0.4s ease-out ${idx * 0.05}s both` }}
                >
                  {/* Number marker */}
                  <div className="absolute left-2 top-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading z-10" style={{
                    background: isOpen ? "hsl(340 42% 28%)" : "hsl(36 33% 95%)",
                    border: isOpen ? "2px solid hsl(340 42% 35%)" : "2px solid hsl(36 45% 58% / 0.30)",
                    color: isOpen ? "hsl(36 33% 97%)" : "hsl(340 42% 28%)",
                    boxShadow: isOpen ? "0 0 20px hsl(340 42% 28% / 0.25)" : "none",
                    transition: "all 0.3s ease",
                  }}>
                    {num.numero}
                  </div>

                  <div className="rounded-xl overflow-hidden transition-all duration-300" style={{
                    background: isOpen ? "hsl(38 30% 95% / 0.95)" : "hsl(38 30% 95% / 0.70)",
                    border: `1px solid ${isOpen ? "hsl(36 45% 58% / 0.30)" : "hsl(36 25% 82% / 0.40)"}`,
                    boxShadow: isOpen ? "0 4px 25px hsl(36 45% 58% / 0.12)" : "none",
                  }}>
                    {/* Header */}
                    <button
                      onClick={() => setOpenCard(isOpen ? null : num.numero)}
                      className="w-full px-5 py-4 flex items-center gap-3 text-left"
                    >
                      <span className="text-lg shrink-0" style={{ color: "hsl(36 45% 45%)" }}>{num.simbolo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>
                            {num.nome}
                          </h3>
                          <span className="text-xs font-accent italic" style={{ color: "hsl(230 20% 25% / 0.45)" }}>
                            — {num.subtitulo}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "hsl(340 42% 28% / 0.65)" }}>
                          {num.principio}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-300" style={{
                        color: "hsl(230 10% 50%)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }} />
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="px-5 pb-5 space-y-5" style={{ animation: "fade-up 0.3s ease-out" }}>
                        <div className="h-px" style={{
                          background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.25), transparent)",
                        }} />

                        {/* Main description */}
                        {num.descricao.split("\n\n").map((p, i) => (
                          <p key={i} className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{p}</p>
                        ))}

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-1.5">
                          {num.palavrasChave.map((kw) => (
                            <span key={kw} className="text-xs px-2.5 py-1 rounded-full font-heading tracking-wider" style={{
                              background: "hsl(36 45% 58% / 0.08)",
                              border: "1px solid hsl(36 45% 58% / 0.18)",
                              color: "hsl(36 45% 40%)",
                            }}>
                              {kw}
                            </span>
                          ))}
                        </div>

                        {/* Deep dive */}
                        <div className="rounded-lg p-4" style={{
                          background: "hsl(340 42% 28% / 0.03)",
                          border: "1px solid hsl(340 42% 28% / 0.10)",
                        }}>
                          <h4 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(340 42% 26%)" }}>
                            ✦ Aprofundamento
                          </h4>
                          {num.aprofundamento.split("\n\n").map((p, i) => (
                            <p key={i} className="text-xs leading-relaxed mb-2 last:mb-0" style={{ color: "hsl(230 20% 25% / 0.80)" }}>{p}</p>
                          ))}
                        </div>

                        {/* Per-suit manifestation */}
                        <div>
                          <h4 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(230 20% 25% / 0.60)" }}>
                            Como o {num.nome} se manifesta em cada naipe
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(["copas", "paus", "espadas", "ouros"] as const).map((naipe) => {
                              const info = NAIPES[naipe];
                              return (
                                <div key={naipe} className="rounded-lg p-3" style={{
                                  background: info.color.surface,
                                  border: `1px solid ${info.color.border}`,
                                }}>
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="text-sm">{info.icon}</span>
                                    <span className="font-heading text-xs tracking-wide" style={{ color: info.color.primary }}>
                                      {info.name.replace("Naipe de ", "")}
                                    </span>
                                  </div>
                                  <p className="text-xs leading-relaxed" style={{ color: "hsl(230 20% 20%)" }}>
                                    {num.manifestacao[naipe]}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reflection */}
                        <div className="rounded-lg p-4" style={{
                          background: "hsl(36 45% 58% / 0.05)",
                          border: "1px solid hsl(36 45% 58% / 0.15)",
                        }}>
                          <p className="font-accent text-xs italic leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.60)" }}>
                            💭 {num.reflexao}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-10" style={{ animation: "fade-up 0.5s ease-out 0.6s both" }}>
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

export default NumerologiaPage;
