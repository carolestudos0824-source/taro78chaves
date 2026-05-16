import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Sparkles } from "lucide-react";
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

        {/* Journey Trail */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C8A66A40] via-[#C8A66A80] to-[#C8A66A40] rounded-full" />

          <div className="space-y-8 relative">
            {NUMEROLOGIA.map((num, idx) => {
              const isOpen = openCard === num.numero;
              return (
                <div
                  key={num.numero}
                  className="relative pl-24 group animate-fade-up"
                  style={{ animationDelay: `${idx * 0.08}s`, animationFillMode: "both" }}
                >
                  {/* Floating Number Circle */}
                  <div className="absolute left-2 top-0 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-heading z-10 transition-all duration-500 shadow-xl border-2" style={{
                    background: isOpen ? "linear-gradient(135deg, #5B1F3D, #3D1429)" : "#FAF5EF",
                    borderColor: isOpen ? "#C8A66A" : "#C8A66A40",
                    color: isOpen ? "#FAF5EF" : "#5B1F3D",
                    boxShadow: isOpen ? "0 10px 30px rgba(91, 31, 61, 0.2)" : "0 5px 15px rgba(0,0,0,0.05)",
                    transform: isOpen ? "scale(1.1) rotate(5deg)" : "none",
                  }}>
                    {num.numero}
                  </div>

                  <div 
                    className="rounded-[2rem] overflow-hidden transition-all duration-500" 
                    style={{
                      background: isOpen ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                      border: `2.5px solid ${isOpen ? "#C8A66A" : "rgba(200, 166, 106, 0.3)"}`,
                      boxShadow: isOpen ? "0 20px 50px rgba(91, 31, 61, 0.1)" : "0 8px 30px rgba(91, 31, 61, 0.04)",
                      transform: isOpen ? "translateY(-4px)" : "none",
                    }}
                  >
                    {/* Item Header */}
                    <button
                      onClick={() => setOpenCard(isOpen ? null : num.numero)}
                      className="w-full px-8 py-6 flex items-center gap-5 text-left group"
                    >
                      <span className="text-3xl shrink-0 group-hover:rotate-12 transition-transform duration-500">{num.simbolo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <h3 className="font-heading text-xl md:text-2xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
                            {num.nome}
                          </h3>
                          <p className="font-accent text-[15px] italic font-black" style={{ color: "#8B6A30" }}>
                            {num.subtitulo}
                          </p>
                        </div>
                        <p className="text-[12px] mt-1 font-heading tracking-[0.2em] uppercase font-black" style={{ color: "#C8A66A" }}>
                          {num.principio}
                        </p>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border-2 transition-all duration-500 ${isOpen ? "rotate-180" : ""}`} style={{
                        borderColor: "#C8A66A40",
                        color: "#5B1F3D"
                      }}>
                        <ChevronDown className="w-6 h-6 shrink-0" />
                      </div>
                    </button>

                    {/* Item Expanded Content */}
                    {isOpen && (
                      <div className="px-8 pb-10 space-y-8 animate-fade-in">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A66A40] to-transparent" />

                        {/* Main Description */}
                        <div className="space-y-5">
                          {num.descricao.split("\n\n").map((p, i) => (
                            <p key={i} className="text-[17px] leading-relaxed font-black" style={{ color: "#3D1429" }}>{p}</p>
                          ))}
                        </div>

                        {/* Keywords Tags */}
                        <div className="flex flex-wrap gap-2">
                          {num.palavrasChave.map((kw) => (
                            <span key={kw} className="text-[11px] px-5 py-2 rounded-full font-heading font-black tracking-[0.2em] uppercase border-2" style={{
                              background: "rgba(200, 166, 106, 0.08)",
                              borderColor: "rgba(200, 166, 106, 0.3)",
                              color: "#8B6A30",
                            }}>
                              {kw}
                            </span>
                          ))}
                        </div>

                        {/* Pedagogical Deep Dive */}
                        <div className="rounded-3xl p-7" style={{
                          background: "rgba(91, 31, 61, 0.03)",
                          border: "2px solid rgba(91, 31, 61, 0.1)",
                        }}>
                          <h4 className="font-heading text-[10px] tracking-[0.3em] uppercase mb-4 font-black flex items-center gap-2" style={{ color: "#5B1F3D" }}>
                            <Sparkles className="w-3.5 h-3.5 text-[#C8A66A]" /> Aprofundamento Simbólico
                          </h4>
                          <div className="space-y-3">
                            {num.aprofundamento.split("\n\n").map((p, i) => (
                              <p key={i} className="text-[14px] leading-relaxed font-black" style={{ color: "#3D1429CC" }}>{p}</p>
                            ))}
                          </div>
                        </div>

                        {/* Manifestations Grid */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A66A40]" />
                            <h4 className="font-heading text-[11px] tracking-[0.35em] uppercase font-black" style={{ color: "#5B1F3D" }}>
                              O {num.numero} nos 4 Naipes
                            </h4>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A40]" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(["copas", "paus", "espadas", "ouros"] as const).map((naipe) => {
                              const info = NAIPES[naipe];
                              return (
                                <div key={naipe} className="rounded-3xl p-6 transition-all duration-500 hover:shadow-lg" style={{
                                  background: "white",
                                  border: `2px solid ${info.color.border}`,
                                }}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-[#FAF5EF] border border-[#C8A66A20]">
                                      {info.icon}
                                    </div>
                                    <span className="font-heading text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: info.color.primary }}>
                                      {info.name.replace("Naipe de ", "")}
                                    </span>
                                  </div>
                                  <p className="text-[14px] leading-relaxed font-black" style={{ color: "#3D1429" }}>
                                    {num.manifestacao[naipe]}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reflection Card */}
                        <div className="rounded-3xl p-7 flex flex-col justify-center text-center italic relative overflow-hidden" style={{
                          background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                          border: "2px solid #C8A66A",
                          boxShadow: "0 15px 40px rgba(91, 31, 61, 0.2)"
                        }}>
                          <div className="absolute top-2 right-4 text-2xl opacity-10">💭</div>
                          <p className="font-accent text-[17px] leading-relaxed font-black" style={{ color: "#FAF5EF" }}>
                            "{num.reflexao}"
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
        <div className="text-center mt-16 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <button
            onClick={() => navigate("/app")}
            className="text-[11px] font-heading tracking-[0.3em] uppercase transition-all hover:text-[#5B1F3D] hover:scale-105 font-black"
            style={{ color: "#C8A66A" }}
          >
            ← Voltar ao Portal
          </button>
        </div>
      </main>
    </div>
  );
};

export default NumerologiaPage;
