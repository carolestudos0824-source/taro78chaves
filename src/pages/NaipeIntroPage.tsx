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
    { id: "psicologico", icon: "🧠", title: "A Psicologia do Naipe", content: ped.potencial ?? "" },
    { id: "pratico", icon: "🎯", title: `${info.name.replace("Naipe de ", "")} na Vida Real`, content: ped.funcaoNaLeitura ?? "" },
    { id: "simbolico", icon: "◎", title: "Aprofundamento Simbólico", content: ped.linguagemEditorial ?? "" },
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

      <main className="relative z-10 container max-w-3xl px-4 py-8">
        {/* Hero — Redesigned for premium force */}
        <div className="text-center space-y-6 mb-12" style={{ animation: "fade-up 0.7s ease-out" }}>
          <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-2xl transition-all duration-700 hover:rotate-12" style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            border: `2.5px solid #C8A66A`,
            boxShadow: `0 20px 50px rgba(91, 31, 61, 0.3), 0 0 30px rgba(200, 166, 106, 0.2)`,
          }}>
            <TarotIcon name={naipe} className="w-12 h-12 text-[#FAF5EF]" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
            {ped.nome ?? info.name}
          </h1>
          <p className="font-accent text-lg md:text-xl italic font-black leading-snug" style={{ color: "#5B1F3D99" }}>
            {ped.subtitulo ?? info.subtitle}
          </p>
          {ped.fraseAbertura && (
            <div className="relative py-4 px-8 max-w-xl mx-auto">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C8A66A] to-transparent rounded-full" />
              <p className="font-accent text-[18px] md:text-[20px] italic leading-relaxed font-black pl-4" style={{ color: "#5B1F3D" }}>
                "{ped.fraseAbertura}"
              </p>
            </div>
          )}
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" style={{ animation: "fade-up 0.5s ease-out 0.1s both" }}>
          {(ped.palavrasAncora.length > 0 ? ped.palavrasAncora : info.keywords).map((kw) => (
            <span key={kw} className="text-xs font-heading tracking-wider px-3 py-1.5 rounded-full" style={{
              background: info.color.surface,
              border: `1px solid ${info.color.border}`,
              color: info.color.primary,
            }}>
              {kw}
            </span>
          ))}
        </div>

        {/* Main text — High readability */}
        {ped.essencia && (
          <div className="rounded-[2rem] p-8 md:p-10 mb-10 transition-all duration-500" style={{
            background: "rgba(255, 255, 255, 0.95)",
            border: "2px solid #C8A66A30",
            boxShadow: "0 20px 50px rgba(91, 31, 61, 0.05)",
            animation: "fade-up 0.6s ease-out 0.2s both",
          }}>
            {ped.essencia.split("\n\n").map((p, i) => (
              <p key={i} className="text-[16px] md:text-[17px] leading-relaxed mb-6 last:mb-0 font-black" style={{ color: "#3D1429" }}>
                {renderContent(p)}
              </p>
            ))}
          </div>
        )}

        {/* Expandable sections */}
        <div className="space-y-3 mb-8">
          {sections.map((section, idx) => {
            const isOpen = openSection === section.id;
            return (
              <div
                key={section.id}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? info.color.surface : "hsl(38 30% 95% / 0.7)",
                  border: `1px solid ${isOpen ? info.color.border : "hsl(36 25% 82% / 0.5)"}`,
                  boxShadow: isOpen ? `0 4px 20px ${info.color.border}` : "none",
                  animation: `fade-up 0.4s ease-out ${(idx + 3) * 0.05}s both`,
                }}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full px-5 py-4 flex items-center gap-3 text-left transition-colors duration-200"
                >
                  <span className="text-lg shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                    background: info.color.surface,
                    border: `1px solid ${info.color.border}`,
                    color: info.color.primary,
                  }}>
                    {section.icon}
                  </span>
                  <span className="font-heading text-sm tracking-wide flex-1" style={{ color: "hsl(230 25% 15%)" }}>
                    {section.title}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-300"
                    style={{
                      color: "hsl(230 10% 50%)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5" style={{ animation: "fade-up 0.3s ease-out" }}>
                    <div className="h-px mb-4" style={{
                      background: `linear-gradient(90deg, transparent, ${info.color.border}, transparent)`,
                    }} />
                    {section.content.split("\n\n").map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: "hsl(230 20% 25%)" }}>
                        {renderContent(p)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Applications in reading */}
        {ped.aplicacoesLeitura.length > 0 && (
          <div className="rounded-xl p-6 mb-8" style={{
            background: `${info.color.primary}08`,
            border: `1px solid ${info.color.border}`,
            animation: "fade-up 0.5s ease-out 0.4s both",
          }}>
            <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-4" style={{ color: info.color.primary }}>
              ✦ Aplicações em Leitura
            </h3>
            <ul className="space-y-2.5">
              {ped.aplicacoesLeitura.map((app, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "hsl(230 20% 20%)" }}>
                  <span style={{ color: info.color.primary }} className="mt-0.5 shrink-0">◆</span>
                  {app}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reflection */}
        {ped.reflexao && (
          <div className="rounded-xl p-5 mb-8" style={{
            background: "hsl(340 42% 28% / 0.04)",
            border: "1px solid hsl(340 42% 28% / 0.15)",
            animation: "fade-up 0.5s ease-out 0.5s both",
          }}>
            <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(340 42% 26%)" }}>
              💭 Reflexão
            </h3>
            <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.70)" }}>
              {ped.reflexao}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 pt-4" style={{ animation: "fade-up 0.5s ease-out 0.6s both" }}>
          <button
            onClick={() => navigate(`/module/${naipe}`)}
            className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, hsl(340 42% 28%), ${info.color.primary})`,
              color: "hsl(36 33% 97%)",
              boxShadow: `0 4px 20px ${info.color.border}`,
            }}
          >
            <span className="flex items-center gap-2">
              Explorar as Cartas
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
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

export default NaipeIntroPage;
