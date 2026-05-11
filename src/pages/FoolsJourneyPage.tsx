import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useResolvedArcanosMaiores } from "@/hooks/use-resolved-arcanos-maiores";
import { useJourneyContent } from "@/hooks/use-content";
import { CORES_FASE, JOURNEY_MOTION } from "@/config/journey-visual";
import { EDITORIAL_REGISTRY } from "@/content/arcanos-maiores";

const FoolsJourneyPage = () => {
  const navigate = useNavigate();
  const { progress, isArcanoUnlocked, isArcanoCompleted } = useProgress();

  // Fase 2C: lista agregada dos 22 Arcanos Maiores também passa pelo adaptador
  const resolvedMaiores = useResolvedArcanosMaiores();
  void resolvedMaiores;

  // Fase 5D: estrutura editorial da Jornada vem do CMS via adapter.
  const { data: journey, isLoading } = useJourneyContent();

  const isStudied = (arcanoId: number) => isArcanoUnlocked(arcanoId);
  const isComplete = (arcanoId: number) => isArcanoCompleted(arcanoId);

  if (isLoading || !journey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-accent italic text-sm" style={{ color: "hsl(36 42% 45% / 0.60)" }}>
          Preparando a travessia…
        </div>
      </div>
    );
  }

  const { meta, fases, arcanos } = journey;

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        {/* Camada de suavização para reduzir faixas horizontais preservando profundidade */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 50% 30%, transparent 0%, hsl(36 33% 97% / 0.08) 100%)",
          mixOverlay: "overlay"
        } as any} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, #FAF5EF 0%, #F5EBDE 35%, #EFE2D2 65%, #E9D9C5 100%)",
          opacity: 0.95
        }} />
      </div>

      {/* Header */}
      <header className="relative z-20" style={{
        borderBottom: "1px solid rgba(200,166,106,0.18)",
        background: "linear-gradient(180deg, rgba(250,245,239,0.96) 0%, rgba(245,235,222,0.94) 100%)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 4px 24px rgba(61,20,41,0.05)"
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(200,166,106,0.08)",
                border: "1px solid rgba(200,166,106,0.18)",
              }}
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "#5B1F3D" }} />
            </button>
            <div>
              <span className="text-[11px] tracking-[0.35em] uppercase font-heading font-semibold block mb-0.5" style={{ color: "#8B6A30" }}>
                ✦ Visão Geral ✦
              </span>
              <h1 className="font-heading text-xl tracking-wide" style={{
                background: "linear-gradient(135deg, #3D1429 0%, #5B1F3D 50%, #8B6A30 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {meta.introTitulo}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Epigraph */}
        <div className="text-center mb-10" style={{ animation: "fade-up 0.5s ease-out" }}>
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C8A66A]/40" />
              <span className="text-[#C8A66A] text-lg">✶◈✶</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C8A66A]/40" />
            </div>
          </div>
          <p className="font-accent text-lg italic leading-relaxed px-4" style={{ color: "#3D1429", fontWeight: 500 }}>
            "{meta.introEpigrafe}"
          </p>
          <p className="font-heading text-[10px] tracking-[0.3em] uppercase mt-4 font-semibold" style={{ color: "#8B6A30" }}>
            {meta.introSubtitulo}
          </p>
        </div>

        {/* Introduction paragraphs */}
        <section className="mb-12" style={{ animation: "fade-up 0.6s ease-out" }}>
          <div className="rounded-2xl p-7 space-y-4 shadow-sm" style={{
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200,166,106,0.15)",
          }}>
            {meta.introCorpo.map((para, i) => (
              <p key={i} className="font-body text-sm leading-[1.85]" style={{ color: "#4A1830", opacity: 0.85 }}>
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Journey Phases */}
        {fases.map((phase, phaseIndex) => {
          const colors = CORES_FASE[phase.theme];
          const phaseArcanos = arcanos.filter((a) => a.faseSlug === phase.slug);

          return (
            <section
              key={phase.id}
              className="mb-14"
              style={{ animation: `fade-up 0.5s ease-out both`, animationDelay: `${phaseIndex * 100}ms` }}
            >
              {/* Phase header */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent" style={{ backgroundColor: `${colors.main}20` }} />
                  <span className="text-[#C8A66A] text-sm">✦</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent" style={{ backgroundColor: `${colors.main}20` }} />
                </div>
              </div>

              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-sm"
                  style={{
                    background: "rgba(255,255,255,0.4)",
                    border: `1.5px solid ${colors.border}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-2xl" style={{ color: colors.main }}>{phase.simbolo}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] font-heading font-bold tracking-[0.3em] uppercase" style={{ color: colors.main }}>
                    Fase {phaseIndex + 1}
                  </span>
                </div>
                <h2 className="font-heading text-xl tracking-wide mb-2" style={{ color: "#3D1429" }}>
                  {phase.titulo}
                </h2>
                <p className="font-accent text-sm italic" style={{ color: "#8B6A30", opacity: 0.8 }}>
                  {phase.subtitulo}
                </p>
              </div>

              {/* Phase description */}
              <div className="rounded-2xl p-6 mb-8 shadow-sm" style={{
                background: "rgba(255,255,255,0.25)",
                border: `1px solid ${colors.border}`,
                backdropFilter: "blur(10px)",
              }}>
                <p className="font-body text-sm leading-[1.85]" style={{ color: "#4A1830", opacity: 0.8 }}>
                  {phase.descricao}
                </p>
              </div>

              {/* Arcano cards within this phase */}
              <div className="space-y-4">
                {phaseArcanos.map((arcano, idx) => {
                  const studied = isStudied(arcano.arcanoNumero);
                  // Alternar lado da imagem na trilha
                  const isEven = idx % 2 === 0;
                  
                  return (
                    <button
                      key={arcano.id}
                      onClick={() => studied ? navigate(`/lesson/${arcano.arcanoNumero}`) : undefined}
                      disabled={!studied}
                      className="w-full text-left group transition-all duration-300 active:scale-[0.98]"
                      style={{ opacity: studied ? 1 : 0.6 }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                        style={{
                          background: studied ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)",
                          border: studied ? `1px solid ${colors.border}` : "1px solid rgba(200,166,106,0.1)",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        <div className={`p-4 flex gap-4 ${!isEven ? 'flex-row-reverse' : ''}`}>
                          {/* Arcano Visual / Card Image */}
                          <div 
                            className="w-20 h-32 rounded-lg shrink-0 overflow-hidden relative shadow-sm border border-black/5 group-hover:scale-105 transition-transform duration-500"
                            style={{ 
                              background: "rgba(61,20,41,0.03)",
                              filter: studied ? 'none' : 'grayscale(1) sepia(0.2) opacity(0.5)'
                            }}
                          >
                            <img 
                              src={`/assets/cards/${EDITORIAL_REGISTRY[arcano.arcanoNumero]?.slug || 'the-fool'}.jpg`}
                              alt={arcano.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback em caso de erro na imagem
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200';
                              }}
                            />
                            {!studied && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className={`flex-1 min-w-0 flex flex-col justify-center ${!isEven ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-1 ${!isEven ? 'justify-end' : 'justify-start'}`}>
                              <span 
                                className="font-heading text-[10px] tracking-widest font-bold"
                                style={{ color: studied ? colors.main : "#8B6A3060" }}
                              >
                                {arcano.numeral}
                              </span>
                              <div className="w-1 h-1 rounded-full bg-[#C8A66A]/40" />
                              <h3
                                className="font-heading text-sm tracking-wide font-semibold"
                                style={{ color: studied ? "#3D1429" : "#3D142940" }}
                              >
                                {arcano.nome}
                              </h3>
                              {studied && isEven && (
                                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:translate-x-0.5 transition-transform" style={{ color: colors.main }} />
                              )}
                            </div>
                            <p
                              className="font-accent text-[12px] italic mb-2 font-medium"
                              style={{ color: studied ? "#8B6A30" : "#8B6A3040" }}
                            >
                              {arcano.papel}
                            </p>
                            {studied && (
                              <p
                                className="font-body text-[11px] leading-relaxed line-clamp-2"
                                style={{ color: "#4A1830", opacity: 0.7 }}
                              >
                                {arcano.textoNarrativo}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Closing */}
        <section className="mb-12 mt-8" style={{ animation: "fade-up 0.6s ease-out" }}>
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8A66A]/40" />
              <span className="text-[#C8A66A] text-lg">✶◈✶</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8A66A]/40" />
            </div>
          </div>
          <div className="text-center px-4">
            <Sparkles className="w-6 h-6 mx-auto mb-4" style={{ color: "#C8A66A" }} />
            <h2 className="font-heading text-xl tracking-wide mb-4" style={{
              background: "linear-gradient(135deg, #3D1429 0%, #5B1F3D 50%, #8B6A30 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {meta.encerramentoTitulo}
            </h2>
            <p className="font-body text-sm leading-[1.85] max-w-lg mx-auto mb-6" style={{ color: "#4A1830", opacity: 0.8 }}>
              {meta.encerramentoCorpo}
            </p>
            <p className="font-accent text-lg italic font-medium" style={{ color: "#8B6A30" }}>
              {meta.encerramentoConvite}
            </p>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 pb-10">
          <button
            onClick={() => navigate("/module/arcanos-maiores")}
            className="px-8 py-3 rounded-full font-heading text-[11px] tracking-[0.2em] uppercase flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
              color: "hsl(36 33% 97%)",
              boxShadow: "0 6px 24px hsl(340 42% 28% / 0.15)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Iniciar a Jornada
          </button>
          <button
            onClick={() => navigate("/app")}
            className="text-[10px] font-accent italic transition-all"
            style={{ color: "hsl(230 20% 15% / 0.35)" }}
          >
            Voltar aos Módulos
          </button>
        </div>
      </main>
    </div>
  );
};

export default FoolsJourneyPage;
