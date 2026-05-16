import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { type Naipe, NAIPES } from "@/registry/naipes";
import { useSuitIntroContent } from "@/hooks/use-content";

const NAIPE_ROUTE_MAP: Record<string, Naipe> = {
  copas: "copas",
  paus: "paus",
  espadas: "espadas",
  ouros: "ouros",
};

const NaipeIntroPage = () => {
  const { naipe: naipeParam } = useParams();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const naipe = NAIPE_ROUTE_MAP[naipeParam || ""];
  const { data: ped, isLoading } = useSuitIntroContent(naipe ?? null);

  if (!naipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <p className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>Naipe não encontrado</p>
      </div>
    );
  }

  const info = NAIPES[naipe];

  if (isLoading || !ped) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <p className="font-accent italic text-sm" style={{ color: "hsl(230 20% 25% / 0.55)" }}>Carregando…</p>
      </div>
    );
  }

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "#5B1F3D" }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const sections = [
    { id: "elemental", icon: info.elementSymbol, title: `${ped.elemento ?? info.element} — O Elemento de ${info.name.replace("Naipe de ", "")}`, content: ped.atmosfera ?? "" },
    { id: "psicologico", icon: "Eye", title: "A Psicologia do Naipe", content: ped.potencial ?? "" },
    { id: "pratico", icon: "ritual", title: `${info.name.replace("Naipe de ", "")} na Vida Real`, content: ped.funcaoNaLeitura ?? "" },
    { id: "simbolico", icon: "Sparkles", title: "Aprofundamento Simbólico", content: ped.linguagemEditorial ?? "" },
  ].filter((s) => s.content && s.content.length > 0);

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Marfim Suave refined from /app */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
        {/* Subtle atmosphere layers */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 20%, rgba(243, 230, 224, 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(250, 245, 239, 0.8) 0%, transparent 30%, transparent 70%, rgba(239, 226, 210, 0.5) 100%)",
          }}
        />
      </div>

      {/* Header — Premium Header style from /app */}
      <header className="relative z-10" style={{
        borderBottom: "1.5px solid #C8A66A40",
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
      }}>
        <div className="container max-w-3xl py-4 px-6 flex items-center gap-4">
          <button 
            onClick={() => navigate(`/module/${naipe}`)} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30] shadow-sm transition-all hover:scale-110 duration-200" 
            style={{ color: "#5B1F3D" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <TarotIcon name={naipe} className="w-6 h-6" />
            <span className="font-heading text-base font-black tracking-tight" style={{ color: "#5B1F3D" }}>
              Introdução · {info.name}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6 py-10">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 animate-fade-up">
          <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-2xl transition-all duration-700 hover:rotate-12" style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            border: `2.5px solid #C8A66A`,
            boxShadow: `0 20px 50px rgba(91, 31, 61, 0.3), 0 0 30px rgba(200, 166, 106, 0.2)`,
          }}>
            <TarotIcon name={naipe} className="w-12 h-12 text-[#FAF5EF]" />
          </div>
          
          <div className="space-y-3">
            <h1 className="font-heading text-4xl md:text-5xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
              {ped.nome ?? info.name}
            </h1>
            <p className="font-accent text-lg md:text-xl italic font-black leading-snug" style={{ color: "#8B6A30" }}>
              {ped.subtitulo ?? info.subtitle}
            </p>
          </div>

          {ped.fraseAbertura && (
            <div className="relative py-6 px-10 max-w-xl mx-auto">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C8A66A] to-transparent rounded-full" />
              <p className="font-accent text-[20px] md:text-[22px] italic leading-relaxed font-black pl-6" style={{ color: "#5B1F3D" }}>
                "{ped.fraseAbertura}"
              </p>
            </div>
          )}
        </div>

        {/* Keywords Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {(ped.palavrasAncora.length > 0 ? ped.palavrasAncora : info.keywords).map((kw) => (
            <span key={kw} className="text-[11px] font-heading tracking-[0.2em] uppercase px-5 py-2 rounded-full border-2 font-black" style={{
              background: "white",
              border: `2px solid ${info.color.border}`,
              color: info.color.primary,
            }}>
              {kw}
            </span>
          ))}
        </div>

        {/* Essential Definition Card */}
        {ped.essencia && (
          <div className="rounded-[2.5rem] p-10 mb-12 animate-fade-up" style={{
            background: "rgba(255, 255, 255, 0.98)",
            border: "2.5px solid #C8A66A",
            boxShadow: "0 25px 60px rgba(91, 31, 61, 0.08)",
            animationDelay: "0.2s",
          }}>
            <div className="flex items-center justify-center gap-4 mb-8 opacity-90">
              <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #C8A66A)" }} />
              <span className="text-[12px] font-black" style={{ color: "#C8A66A", letterSpacing: "0.4em" }}>✶ A ESSÊNCIA ✶</span>
              <span className="h-px w-10" style={{ background: "linear-gradient(90deg, #C8A66A, transparent)" }} />
            </div>
            <div className="space-y-6 max-w-2xl mx-auto">
              {ped.essencia.split("\n\n").map((p, i) => (
                <p key={i} className="text-[18px] md:text-[20px] leading-relaxed font-black text-center" style={{ color: "#3D1429" }}>
                  {renderContent(p)}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Deep Dive Accordion */}
        <div className="space-y-4 mb-10">
          {sections.map((section, idx) => {
            const isOpen = openSection === section.id;
            return (
              <div
                key={section.id}
                className="rounded-[2rem] overflow-hidden transition-all duration-500 animate-fade-up"
                style={{
                  background: isOpen ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                  border: `2.5px solid ${isOpen ? info.color.primary : "rgba(200, 166, 106, 0.3)"}`,
                  boxShadow: isOpen ? `0 20px 50px rgba(91, 31, 61, 0.1)` : "0 8px 30px rgba(91, 31, 61, 0.04)",
                  animationDelay: `${(idx + 3) * 0.08}s`,
                  animationFillMode: "both",
                }}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full px-8 py-6 flex items-center gap-5 text-left transition-all duration-300 group"
                >
                  <span className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500 group-hover:scale-110" style={{
                    background: "#FAF5EF",
                    border: `2px solid ${info.color.primary}40`,
                    color: info.color.primary,
                  }}>
                    <TarotIcon name={section.id === 'elemental' ? naipe : section.icon} className="w-6 h-6" />
                  </span>
                  <span className="font-heading text-lg font-black tracking-tight flex-1" style={{ color: "#5B1F3D" }}>
                    {section.title}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border-2 transition-all duration-500 ${isOpen ? "rotate-180" : ""}`} style={{
                    borderColor: `${info.color.primary}40`,
                    color: info.color.primary
                  }}>
                    <ChevronDown className="w-6 h-6 shrink-0" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-8 pb-8 animate-fade-in">
                    <div className="h-px mb-6 w-full bg-gradient-to-r from-transparent via-[#C8A66A40] to-transparent" />
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {section.content.split("\n\n").map((p, i) => (
                        <p key={i} className="text-[16px] leading-relaxed font-black" style={{ color: "#3D1429" }}>
                          {renderContent(p)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Practical Applications Card */}
        {ped.aplicacoesLeitura.length > 0 && (
          <div className="rounded-[2.5rem] p-8 mb-10 animate-fade-up" style={{
            background: "rgba(200, 166, 106, 0.06)",
            border: "2.5px solid rgba(200, 166, 106, 0.2)",
            animationDelay: "0.5s",
            animationFillMode: "both",
          }}>
            <h3 className="font-heading text-[11px] tracking-[0.35em] uppercase mb-6 font-black flex items-center gap-3" style={{ color: info.color.primary }}>
              <span className="w-2 h-2 rounded-full" style={{ background: info.color.primary }} />
              Aplicações na Leitura
            </h3>
            <ul className="space-y-4">
              {ped.aplicacoesLeitura.map((app, i) => (
                <li key={i} className="flex items-start gap-4 text-[15px] leading-relaxed font-black" style={{ color: "#3D1429" }}>
                  <span style={{ color: info.color.primary }} className="mt-1.5 shrink-0 text-xs">◆</span>
                  {app}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Final Reflection Card */}
        {ped.reflexao && (
          <div className="rounded-[2.5rem] p-8 mb-12 animate-fade-up" style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            border: "2.5px solid #C8A66A",
            boxShadow: "0 20px 50px rgba(91, 31, 61, 0.2)",
            animationDelay: "0.6s",
            animationFillMode: "both",
          }}>
            <h3 className="font-heading text-[10px] tracking-[0.3em] uppercase mb-4 font-black flex items-center gap-2" style={{ color: "#C8A66A" }}>
              💭 Momento de Reflexão
            </h3>
            <p className="font-accent text-[18px] md:text-[20px] italic leading-relaxed font-black text-center" style={{ color: "#FAF5EF" }}>
              "{ped.reflexao}"
            </p>
          </div>
        )}

        {/* Final CTA Action */}
        <div className="flex flex-col items-center gap-6 pt-6 animate-fade-up" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
          <button
            onClick={() => navigate(`/module/${naipe}`)}
            className="group relative px-12 py-4 rounded-full font-heading text-sm tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95"
            style={{
              background: "#C8A66A",
              color: "#5B1F3D",
              boxShadow: "0 10px 30px rgba(200, 166, 106, 0.4)",
            }}
          >
            <span className="relative z-10 flex items-center gap-3 font-black">
              EXPLORAR AS CARTAS
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
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

export default NaipeIntroPage;
