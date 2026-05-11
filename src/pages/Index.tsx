import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, BookOpen, Check } from "lucide-react";
import PremiumGate from "@/components/PremiumGate";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import { JourneyMap } from "@/components/JourneyMap";
import { useProgress } from "@/hooks/use-progress";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, getArcanoFull as getArcanoById } from "@/lib/content";
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
          <p className="text-[10px] text-plum/60 font-heading tracking-widest uppercase">Lendo Arcanos</p>
        </div>
      </div>
    );
  }

  const currentArcanoId = getCurrentArcanoId();
  const currentArcano = ARCANOS_MAIORES.find(a => a.id === currentArcanoId);
  const currentArcanoData = getArcanoById(currentArcanoId);
  const allComplete = completedCount >= 22;

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #FAF5EF 0%, #DCCFC2 100%)",
            opacity: 0.8,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: "1.5px solid #C8A66A40",
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/app")} 
                className="transition-all hover:scale-110 duration-200 w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30]" 
                style={{ color: "#5B1F3D" }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase font-heading flex items-center gap-2" style={{ color: "#C8A66A" }}>
                  <span>✦</span> Módulo Principal <span>✦</span>
                </span>
              </div>
            </div>
            <StreakCounter streak={progress.streak} />
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6 pb-12">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="pt-12 pb-10 text-center relative">
          <div className="mb-6">
            <span className="text-3xl leading-none animate-pulse" style={{ color: "#C8A66A" }}>✦</span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl tracking-wide mb-4" style={{ color: "#5B1F3D" }}>
            A Jornada do Louco
          </h1>
          <p className="font-accent text-lg md:text-xl italic leading-relaxed max-w-lg mx-auto mb-3" style={{ color: "#5B1F3DBB" }}>
            "Os 22 Arcanos Maiores como percurso iniciático da alma"
          </p>
          <p className="text-sm font-body max-w-md mx-auto leading-relaxed" style={{ color: "#5B1F3D80" }}>
            Do potencial puro do Louco à completude do Mundo — cada arcano é uma etapa de autoconhecimento, 
            com lições, símbolos, exercícios e quizzes para fixar seu aprendizado.
          </p>
        </section>

        {/* ═══════════════ PROGRESS DASHBOARD ═══════════════ */}
        <section className="mb-10">
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-8" style={{
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid #C8A66A40",
            boxShadow: "0 15px 40px rgba(91, 31, 61, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
          }}>
            {/* Corner ornaments */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#C8A66A40" }} />
            <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "#C8A66A40" }} />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "#C8A66A40" }} />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#C8A66A40" }} />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl tracking-wide" style={{ color: "#5B1F3D" }}>
                  {completedCount}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-heading mt-2" style={{ color: "#5B1F3D" }}>
                  Concluídos
                </div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl tracking-wide" style={{ color: "#5B1F3D" }}>
                  22
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-heading mt-2" style={{ color: "#C8A66A" }}>
                  Arcanos
                </div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl tracking-wide" style={{ color: "#C8A66A" }}>
                  {journeyProgress}%
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-heading mt-2" style={{ color: "#5B1F3D80" }}>
                  Progresso
                </div>
              </div>
            </div>

            {/* Module progress bar */}
            <div className="relative z-10 px-2">
              <div className="h-3 rounded-full overflow-hidden" style={{
                background: "#E8DED3",
                border: "1px solid #D1C4B5",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
              }}>
                <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{
                  width: `${Math.max(journeyProgress, 2)}%`,
                  background: "linear-gradient(90deg, #5B1F3D, #C8A66A, #5B1F3D)",
                  boxShadow: "0 2px 8px rgba(91, 31, 61, 0.2)"
                }}>
                  <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CURRENT ARCANO CTA ═══════════════ */}
        {!allComplete && currentArcano && (
          <section className="mb-12">
            <button
              onClick={() => navigate(`/lesson/${currentArcanoId}`)}
              className="w-full group transition-all duration-500 hover:scale-[1.02] active:scale-95"
            >
              <div className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{
                background: "linear-gradient(145deg, #FFFFFF, #FAF5EF)",
                border: "2px solid #C8A66A",
                boxShadow: "0 20px 50px rgba(91, 31, 61, 0.1), 0 0 30px rgba(200, 166, 106, 0.1)",
              }}>
                {/* Background glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C8A66A10] rounded-full blur-3xl group-hover:bg-[#C8A66A20] transition-colors" />

                <div className="relative z-10 flex items-center gap-6">
                  {/* Arcano symbol */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-12" style={{
                    border: "2px solid #C8A66A",
                    background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                    boxShadow: "0 10px 25px rgba(91, 31, 61, 0.3)"
                  }}>
                    <span className="font-heading text-xl md:text-2xl text-[#FAF5EF]">
                      {currentArcano.numeral}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="text-[10px] tracking-[0.4em] uppercase font-heading mb-1.5" style={{ color: "#C8A66A" }}>
                      Próxima etapa
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl tracking-wide mb-1" style={{ color: "#5B1F3D" }}>
                      {currentArcano.name}
                    </h3>
                    <p className="font-accent text-base italic" style={{ color: "#5B1F3DBB" }}>
                      {currentArcano.subtitle}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all" style={{
                      background: "linear-gradient(135deg, #C8A66A, #B08D50)",
                      boxShadow: "0 8px 20px rgba(200, 166, 106, 0.3)"
                    }}>
                      <Sparkles className="w-5 h-5 text-[#5B1F3D]" />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase font-heading font-bold" style={{ color: "#5B1F3D" }}>
                      {completedCount === 0 ? "Começar" : "Continuar"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </section>
        )}

        {/* Premium upsell after completing O Louco */}
        {completedCount >= 1 && (
          <section className="mb-12">
            <PremiumGate variant="banner" className="mb-0" />
          </section>
        )}

        {/* celebration celebration */}
        {allComplete && (
          <section className="mb-12 text-center py-10 rounded-2xl" style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            border: "2px solid #C8A66A",
            boxShadow: "0 20px 50px rgba(91, 31, 61, 0.2)"
          }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-bounce" style={{
              background: "rgba(200, 166, 106, 0.15)",
              border: "2.5px solid #C8A66A",
            }}>
              <Check className="w-10 h-10" style={{ color: "#C8A66A" }} />
            </div>
            <h3 className="font-heading text-3xl tracking-wide mb-3 text-[#FAF5EF]">
              Jornada Completa
            </h3>
            <p className="font-accent text-lg italic text-[#FAF5EFBB] max-w-sm mx-auto">
              "Você percorreu todos os 22 Arcanos Maiores. A sabedoria agora é sua."
            </p>
          </section>
        )}

        {/* ═══════════════ WHAT YOU'LL LEARN ═══════════════ */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A66A40]" />
            <span className="text-[10px] font-heading tracking-[0.3em] uppercase text-[#C8A66A]">
              Sua Aprendizagem
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A40]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "◈", label: "Essência e arquétipos" },
              { icon: "◎", label: "Símbolos e significados" },
              { icon: "☀", label: "Luz e sombra" },
              { icon: "♡", label: "Amor, trabalho e espírito" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl p-5 text-center transition-all hover:bg-white/40 border border-transparent hover:border-[#C8A66A20]" style={{
                background: "rgba(250, 245, 239, 0.6)",
                backdropFilter: "blur(10px)",
              }}>
                <span className="text-2xl block mb-3" style={{ color: "#C8A66A" }}>{item.icon}</span>
                <span className="text-[11px] font-heading tracking-wider uppercase leading-tight block" style={{ color: "#5B1F3DCC" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ JOURNEY MAP ═══════════════ */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A66A40]" />
            <span className="text-[10px] font-heading tracking-[0.3em] uppercase text-[#C8A66A]">
              Mapa da Jornada
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A40]" />
          </div>
          <JourneyMap progress={progress} />
        </section>

        {/* Bottom ornament */}
        <div className="pb-16 text-center opacity-30">
          <span className="text-3xl text-[#C8A66A]">✦</span>
        </div>
      </main>
    </div>
  );
};

export default Index;
