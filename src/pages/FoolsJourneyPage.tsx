import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useResolvedArcanosMaiores } from "@/hooks/use-resolved-arcanos-maiores";
import { useJourneyContent } from "@/hooks/use-content";
import { CORES_FASE, JOURNEY_MOTION } from "@/config/journey-visual";
import mysticBg from "@/assets/mystic-bg.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";

const FoolsJourneyPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  // Fase 2C: lista agregada dos 22 Arcanos Maiores também passa pelo adaptador
  // (telemetria sourceUsed='db'/usedFallback=false).
  const resolvedMaiores = useResolvedArcanosMaiores();
  void resolvedMaiores;

  // Fase 5D: estrutura editorial da Jornada vem do CMS via adapter.
  const { data: journey, isLoading } = useJourneyContent();

  const isStudied = (arcanoId: number) =>
    progress.completedLessons.includes(`arcano-${arcanoId}`);

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
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.12) 0%, hsl(36 33% 97% / 0.06) 30%, hsl(36 33% 97% / 0.10) 70%, hsl(36 33% 97% / 0.25) 100%)"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: "1px solid hsl(36 45% 50% / 0.30)",
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94) 0%, hsl(38 28% 93% / 0.92) 100%)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 6px 36px hsl(36 45% 50% / 0.08)"
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: "hsl(36 45% 58% / 0.08)",
                border: "1px solid hsl(36 45% 58% / 0.18)",
              }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "hsl(340 42% 26%)" }} />
            </button>
            <div>
              <span className="text-[9px] tracking-[0.35em] uppercase font-body block mb-0.5" style={{ color: "hsl(340 42% 28%)" }}>
                ✦ Visão Geral ✦
              </span>
              <h1 className="font-heading text-xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 35% 28%), hsl(36 45% 44%))",
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
        <div className="text-center mb-8" style={{ animation: "fade-up 0.5s ease-out" }}>
          <div className="flex justify-center mb-4">
            <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
          </div>
          <p className="font-accent text-base italic leading-relaxed" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
            "{meta.introEpigrafe}"
          </p>
          <p className="font-heading text-xs tracking-[0.3em] uppercase mt-3" style={{ color: "hsl(36 42% 45% / 0.60)" }}>
            {meta.introSubtitulo}
          </p>
        </div>

        {/* Introduction paragraphs */}
        <section className="mb-10" style={{ animation: "fade-up 0.6s ease-out" }}>
          <div className="rounded-xl p-6 space-y-4" style={{
            background: "hsl(38 28% 93% / 0.85)",
            backdropFilter: "blur(14px)",
            border: "1px solid hsl(36 45% 50% / 0.18)",
          }}>
            {meta.introCorpo.map((para, i) => (
              <p key={i} className="font-body text-sm leading-[1.85]" style={{ color: "hsl(230 20% 15% / 0.68)" }}>
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
              className="mb-10"
              style={{ animation: `fade-up 0.5s ease-out both`, animationDelay: `${phaseIndex * 100}ms` }}
            >
              {/* Phase header */}
              <div className="flex items-center justify-center mb-3">
                <img src={ornamentDivider} alt="" className="w-20 h-auto opacity-30" loading="lazy" width={800} height={512} />
              </div>

              <div className="text-center mb-5">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                  style={{
                    background: colors.soft,
                    border: `1.5px solid ${colors.border}`,
                    boxShadow: `0 4px 20px ${colors.soft}`,
                  }}
                >
                  <span className="text-xl" style={{ color: colors.main }}>{phase.simbolo}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-[9px] font-heading tracking-[0.35em] uppercase" style={{ color: colors.main }}>
                    Fase {phaseIndex + 1}
                  </span>
                </div>
                <h2 className="font-heading text-lg tracking-wide mb-1" style={{ color: "hsl(230 20% 12% / 0.85)" }}>
                  {phase.titulo}
                </h2>
                <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
                  {phase.subtitulo}
                </p>
              </div>

              {/* Phase description */}
              <div className="rounded-xl p-5 mb-4" style={{
                background: colors.soft,
                border: `1px solid ${colors.border}`,
                backdropFilter: "blur(12px)",
              }}>
                <p className="font-body text-sm leading-[1.85]" style={{ color: "hsl(230 20% 15% / 0.65)" }}>
                  {phase.descricao}
                </p>
              </div>

              {/* Arcano cards within this phase */}
              <div className="space-y-2.5">
                {phaseArcanos.map((arcano) => {
                  const studied = isStudied(arcano.arcanoNumero);
                  return (
                    <button
                      key={arcano.id}
                      onClick={() => studied ? navigate(`/lesson/${arcano.arcanoNumero}`) : undefined}
                      disabled={!studied}
                      className="w-full text-left group transition-all duration-300"
                    >
                      <div
                        className="rounded-xl overflow-hidden transition-all duration-300"
                        style={{
                          background: studied
                            ? "hsl(38 28% 93% / 0.88)"
                            : "hsl(36 18% 90% / 0.45)",
                          border: studied
                            ? `1px solid ${colors.border}`
                            : "1px solid hsl(36 22% 80% / 0.35)",
                          backdropFilter: "blur(12px)",
                          opacity: studied ? 1 : 0.65,
                        }}
                      >
                        <div className="p-4 flex gap-3.5">
                          {/* Numeral badge */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              border: studied ? `1.5px solid ${colors.border}` : "1px solid hsl(36 22% 75% / 0.40)",
                              background: studied ? "hsl(38 28% 94% / 0.90)" : "hsl(36 18% 90% / 0.50)",
                            }}
                          >
                            <span
                              className="font-heading text-[10px] tracking-wider"
                              style={{ color: studied ? colors.main : "hsl(230 10% 50% / 0.40)" }}
                            >
                              {arcano.numeral}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3
                                className="font-heading text-sm tracking-wide"
                                style={{ color: studied ? "hsl(230 20% 12% / 0.85)" : "hsl(230 10% 50% / 0.40)" }}
                              >
                                {arcano.nome}
                              </h3>
                              {studied && (
                                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:translate-x-0.5 transition-transform" style={{ color: colors.main }} />
                              )}
                            </div>
                            <p
                              className="font-accent text-[11px] italic mb-1.5"
                              style={{ color: studied ? colors.main : "hsl(230 10% 50% / 0.30)" }}
                            >
                              {arcano.papel}
                            </p>
                            {studied && (
                              <p
                                className="font-body text-[11px] leading-relaxed"
                                style={{ color: "hsl(230 20% 15% / 0.55)" }}
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
        <section className="mb-8" style={{ animation: "fade-up 0.6s ease-out" }}>
          <div className="flex items-center justify-center mb-4">
            <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-45" loading="lazy" width={800} height={512} />
          </div>
          <div className="text-center">
            <Sparkles className="w-5 h-5 mx-auto mb-3" style={{ color: "hsl(36 42% 45% / 0.60)" }} />
            <h2 className="font-heading text-lg tracking-wide mb-3" style={{
              background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 35% 28%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {meta.encerramentoTitulo}
            </h2>
            <p className="font-body text-sm leading-[1.85] max-w-lg mx-auto mb-4" style={{ color: "hsl(230 20% 15% / 0.60)" }}>
              {meta.encerramentoCorpo}
            </p>
            <p className="font-accent text-base italic" style={{ color: "hsl(36 42% 42% / 0.75)" }}>
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
