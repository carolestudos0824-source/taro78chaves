import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, BookOpen, Check } from "lucide-react";
import PremiumGate from "@/components/PremiumGate";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import { JourneyMap } from "@/components/JourneyMap";
import { useProgress } from "@/hooks/use-progress";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, getArcanoFull as getArcanoById } from "@/lib/content";
import mysticBg from "@/assets/mystic-bg.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";

const Index = () => {
  const { progress, loading: progressLoading, updateStreak, isArcanoCompleted, getCurrentArcanoId, completedCount, journeyProgress } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!progressLoading) {
      updateStreak();
    }
  }, [progressLoading]);

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-gold/20 border-t-gold animate-spin rounded-full mx-auto" />
          <p className="text-[10px] text-gold-dark/40 font-heading tracking-widest uppercase">Lendo Arcanos</p>
        </div>
      </div>
    );
  }

  const currentArcanoId = getCurrentArcanoId();
  const currentArcano = ARCANOS_MAIORES.find(a => a.id === currentArcanoId);
  const currentArcanoData = getArcanoById(currentArcanoId);
  const allComplete = completedCount >= 22;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.06) 0%, hsl(36 33% 97% / 0.04) 30%, hsl(36 33% 97% / 0.06) 70%, hsl(36 33% 97% / 0.18) 100%)"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: "1px solid hsl(36 45% 50% / 0.30)",
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94) 0%, hsl(38 28% 93% / 0.92) 100%)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 6px 36px hsl(36 45% 50% / 0.08)"
      }}>
        <div className="container max-w-3xl py-4 px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/app")} className="transition-all hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[9px] tracking-[0.4em] uppercase font-body flex items-center gap-1.5" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
                  <span style={{ color: "hsl(36 40% 42%)" }}>✦</span> Módulo Principal <span style={{ color: "hsl(36 40% 42%)" }}>✦</span>
                </span>
              </div>
            </div>
            <StreakCounter streak={progress.streak} />
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="pt-10 pb-8 text-center">
          <div className="mb-5">
            <span className="text-2xl leading-none" style={{ color: "hsl(36 40% 42%)" }}>✦</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-wide mb-3" style={{
            background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 30% 24%), hsl(36 42% 42%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            A Jornada do Louco
          </h1>
          <p className="font-accent text-base md:text-lg italic leading-relaxed max-w-lg mx-auto mb-2" style={{ color: "hsl(230 20% 20% / 0.60)" }}>
            Os 22 Arcanos Maiores como percurso iniciático da alma
          </p>
          <p className="text-xs font-body max-w-md mx-auto leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
            Do potencial puro do Louco à completude do Mundo — cada arcano é uma etapa de autoconhecimento, 
            com lições, símbolos, exercícios e quizzes para fixar seu aprendizado.
          </p>
        </section>

        {/* ═══════════════ PROGRESS DASHBOARD ═══════════════ */}
        <section className="mb-8">
          <div className="relative rounded-2xl overflow-hidden" style={{
            background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(36 33% 95% / 0.90))",
            backdropFilter: "blur(24px)",
            border: "1px solid hsl(36 45% 50% / 0.28)",
            boxShadow: "0 8px 40px hsl(36 45% 50% / 0.08), 0 1px 0 hsl(36 45% 58% / 0.15) inset"
          }}>
            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: "hsl(36 45% 45% / 0.35)" }} />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r" style={{ borderColor: "hsl(36 45% 45% / 0.35)" }} />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l" style={{ borderColor: "hsl(36 45% 45% / 0.35)" }} />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: "hsl(36 45% 45% / 0.35)" }} />

            <div className="p-6 md:p-8">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="font-heading text-2xl md:text-3xl tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                    {completedCount}
                  </div>
                  <div className="text-[9px] tracking-[0.25em] uppercase font-body mt-1" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
                    Concluídos
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-2xl md:text-3xl tracking-wide" style={{ color: "hsl(36 42% 40%)" }}>
                    22
                  </div>
                  <div className="text-[9px] tracking-[0.25em] uppercase font-body mt-1" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
                    Arcanos
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-2xl md:text-3xl tracking-wide" style={{ color: "hsl(340 42% 26%)" }}>
                    {journeyProgress}%
                  </div>
                  <div className="text-[9px] tracking-[0.25em] uppercase font-body mt-1" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
                    Progresso
                  </div>
                </div>
              </div>

              {/* Module progress bar */}
              <div className="relative">
                <div className="h-2.5 rounded-full overflow-hidden" style={{
                  background: "hsl(36 18% 84%)",
                  border: "1px solid hsl(36 22% 75% / 0.70)",
                  boxShadow: "inset 0 1px 3px hsl(230 25% 10% / 0.08)"
                }}>
                  <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{
                    width: `${Math.max(journeyProgress, 2)}%`,
                    background: "linear-gradient(90deg, hsl(340 42% 26%), hsl(36 42% 44%), hsl(42 55% 60%))",
                    boxShadow: "0 1px 4px hsl(36 45% 50% / 0.30)"
                  }}>
                    <div className="absolute inset-0 w-1/3 h-full" style={{
                      background: "linear-gradient(90deg, transparent, hsl(42 70% 78% / 0.70), transparent)",
                      animation: "progress-shine 2.5s ease-in-out infinite"
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CURRENT ARCANO CTA ═══════════════ */}
        {!allComplete && currentArcano && (
          <section className="mb-10">
            <button
              onClick={() => navigate(`/lesson/${currentArcanoId}`)}
              className="w-full group transition-all duration-500 hover:scale-[1.01]"
            >
              <div className="relative overflow-hidden rounded-2xl" style={{
                background: "linear-gradient(145deg, hsl(38 28% 93% / 0.96), hsl(36 33% 95% / 0.92))",
                backdropFilter: "blur(20px)",
                border: "1.5px solid hsl(340 42% 28% / 0.35)",
                boxShadow: "0 10px 40px hsl(340 42% 28% / 0.10), 0 0 60px hsl(42 70% 78% / 0.06), inset 0 1px 0 hsl(36 45% 55% / 0.18)",
                animation: "glow-breathe 5s ease-in-out infinite"
              }}>
                {/* Corner ornaments */}
                <div className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: "1.5px solid hsl(36 42% 45% / 0.40)", borderLeft: "1.5px solid hsl(36 42% 45% / 0.40)" }} />
                <div className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: "1.5px solid hsl(36 42% 45% / 0.40)", borderRight: "1.5px solid hsl(36 42% 45% / 0.40)" }} />
                <div className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: "1.5px solid hsl(36 42% 45% / 0.40)", borderLeft: "1.5px solid hsl(36 42% 45% / 0.40)" }} />
                <div className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: "1.5px solid hsl(36 42% 45% / 0.40)", borderRight: "1.5px solid hsl(36 42% 45% / 0.40)" }} />
                {/* Inner glow */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "radial-gradient(ellipse at 30% 20%, hsl(42 70% 78% / 0.10) 0%, transparent 60%)"
                }} />

                <div className="relative z-10 p-6 md:p-8 flex items-center gap-5">
                  {/* Arcano symbol */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shrink-0" style={{
                    border: "2px solid hsl(340 42% 26% / 0.45)",
                    background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 33% 96%), hsl(36 45% 55% / 0.12))",
                    boxShadow: "0 0 25px hsl(340 42% 28% / 0.12), 0 0 50px hsl(36 45% 55% / 0.06)"
                  }}>
                    <span className="font-heading text-lg md:text-xl" style={{ color: "hsl(340 42% 22%)" }}>
                      {currentArcano.numeral}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="text-[9px] tracking-[0.35em] uppercase font-body mb-1" style={{ color: "hsl(340 42% 28% / 0.60)" }}>
                      Próxima etapa da jornada
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl tracking-wide mb-1" style={{
                      background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 26%), hsl(36 42% 42%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}>
                      {currentArcano.name}
                    </h3>
                    <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                      {currentArcano.subtitle}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{
                      background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                      boxShadow: "0 4px 16px hsl(340 42% 28% / 0.20)"
                    }}>
                      <Sparkles className="w-4 h-4" style={{ color: "hsl(36 33% 97%)" }} />
                    </div>
                    <span className="text-[8px] tracking-[0.25em] uppercase font-heading" style={{
                      color: "hsl(340 42% 22%)",
                      animation: "pulse-gold 2.5s ease-in-out infinite"
                    }}>
                      {completedCount === 0 ? "Começar" : "Continuar"}
                    </span>
                  </div>
                </div>

                {/* Bottom shine */}
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                  background: "linear-gradient(90deg, transparent, hsl(340 42% 28% / 0.25), transparent)"
                }} />
              </div>
            </button>
          </section>
        )}

        {/* Premium upsell after completing O Louco */}
        {completedCount >= 1 && (
          <section className="mb-10">
            <PremiumGate variant="banner" className="mb-0" />
          </section>
        )}

        {/* All complete celebration */}
        {allComplete && (
          <section className="mb-10 text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
              background: "linear-gradient(135deg, hsl(36 45% 55% / 0.15), hsl(42 70% 80% / 0.10))",
              border: "2px solid hsl(36 45% 55% / 0.35)",
              boxShadow: "0 0 30px hsl(36 45% 55% / 0.15)"
            }}>
              <Check className="w-7 h-7" style={{ color: "hsl(36 42% 38%)" }} />
            </div>
            <h3 className="font-heading text-xl tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
              Jornada Completa
            </h3>
            <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
              Você percorreu todos os 22 Arcanos Maiores. A sabedoria agora é sua.
            </p>
          </section>
        )}

        {/* ═══════════════ WHAT YOU'LL LEARN ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-sm tracking-[0.25em] uppercase italic text-center mb-5" style={{
            color: "hsl(340 42% 24%)",
          }}>
            O que você vai aprender
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: "◈", label: "Essência e arquétipos" },
              { icon: "◎", label: "Símbolos e significados" },
              { icon: "☀", label: "Luz e sombra" },
              { icon: "♡", label: "Amor, trabalho e espírito" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-4 text-center" style={{
                background: "hsl(38 28% 93% / 0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid hsl(36 45% 50% / 0.18)"
              }}>
                <span className="text-lg block mb-2" style={{ color: "hsl(36 42% 40%)" }}>{item.icon}</span>
                <span className="text-[10px] font-body tracking-wider uppercase leading-tight block" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ JOURNEY MAP ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-accent text-sm tracking-[0.25em] uppercase italic text-center mb-6" style={{
            color: "hsl(340 42% 24%)",
          }}>
            Mapa da Jornada
          </h2>
          <JourneyMap progress={progress} />
        </section>

        {/* Bottom ornament */}
        <div className="flex items-center justify-center pb-10">
          <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-40" loading="lazy" width={800} height={512} />
        </div>
      </main>
    </div>
  );
};

export default Index;
