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
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.90), hsl(36 33% 97% / 0.85), hsl(36 33% 97% / 0.95))",
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md" style={{
        background: "hsl(36 33% 97% / 0.85)",
        borderBottom: "1px solid hsl(36 45% 58% / 0.15)",
      }}>
        <div className="container max-w-3xl py-3 px-4 flex items-center gap-4">
          <button onClick={() => navigate("/app")} className="transition-colors hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-heading text-sm" style={{ color: "hsl(230 25% 15%)" }}>
            Numerologia dos Arcanos Menores
          </span>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-4 py-8">
        {/* Hero */}
        <div className="text-center space-y-4 mb-10" style={{ animation: "fade-up 0.6s ease-out" }}>
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl" style={{
            background: "hsl(36 45% 58% / 0.10)",
            border: "2px solid hsl(36 45% 58% / 0.25)",
            boxShadow: "0 0 40px hsl(36 45% 58% / 0.15)",
            color: "hsl(36 45% 45%)",
          }}>
            ⟐
          </div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-wide" style={{
            background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 45% 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            A Linguagem dos Números
          </h1>
          <p className="font-accent text-sm italic max-w-lg mx-auto leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.55)" }}>
            No tarô, cada número carrega uma energia própria que se manifesta de forma diferente em cada naipe. Compreender os números é ter a chave para ler qualquer carta menor.
          </p>
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
