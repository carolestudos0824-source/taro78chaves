import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Check, Stars, ChevronRight } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import PremiumGate from "@/components/PremiumGate";
import { JourneyMap } from "@/components/JourneyMap";
import { useProgress } from "@/hooks/use-progress";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, getArcanoFull as getArcanoById } from "@/lib/content";
import { useHeader } from "@/contexts/header-context";

const Index = () => {
  const { progress, loading: progressLoading, updateStreak, getCurrentArcanoId, completedCount, journeyProgress } = useProgress();
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "Arcanos Maiores",
      subtitle: "Módulo 03 • A Jornada do Louco",
      backRoute: "/app"
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  useEffect(() => {
    if (!progressLoading) {
      updateStreak();
    }
  }, [progressLoading, updateStreak]);

  // Note: progressLoading is handled via ProtectedRoute and Suspense
  // if (progressLoading && !progress.xp) {
  //   return null;
  // }

  const currentArcanoId = getCurrentArcanoId();
  const currentArcano = ARCANOS_MAIORES.find(a => a.id === currentArcanoId);
  const allComplete = completedCount >= 22;

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Marfim Suave #FAF5EF base refined */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
        {/* Subtle atmosphere layers to remove banding */}
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

      <main className="relative z-10 container max-w-3xl px-6 pb-12">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="pt-20 pb-12 text-center relative">
          <div className="flex items-center justify-center gap-4 mb-8 opacity-90">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C8A66A]/60" />
            <span className="text-[14px] tracking-[0.5em] uppercase font-bold" style={{ color: "#C8A66A" }}>✶ ◈ ✶</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C8A66A]/60" />
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl tracking-tight mb-6" style={{ color: "#5B1F3D" }}>
            ARCANOS MAIORES
          </h1>
          
          <p className="font-body text-xl md:text-2xl leading-relaxed max-w-xl mx-auto mb-6" style={{ color: "#5B1F3D", fontWeight: 700 }}>
            "A jornada pelos 22 grandes arquétipos"
          </p>
          
          <p className="text-[16px] font-body max-w-lg mx-auto leading-relaxed px-6" style={{ color: "#5B1F3DCC", fontWeight: 500 }}>
            Do Louco ao Mundo, cada Arcano revela uma etapa da travessia interior.
          </p>
        </section>

        {/* ═══════════════ MODULE PROGRESS ═══════════════ */}
        <section className="mb-16">
          <div className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-10" style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
            backdropFilter: "blur(24px)",
            border: "1.5px solid rgba(200, 166, 106, 0.25)",
            boxShadow: "0 20px 50px rgba(91, 31, 61, 0.05)"
          }}>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#C8A66A30]" style={{
                  background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                }}>
                  <Stars className="w-6 h-6 text-[#C8A66A]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-body font-bold text-[#C8A66A]">Progresso do Módulo</span>
                  <span className="text-xl font-heading font-bold text-[#5B1F3D]">{completedCount}/22 Arcanos</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-heading font-bold text-[#5B1F3D]">{journeyProgress}%</span>
              </div>
            </div>

            <div className="relative z-10">
              <div className="h-3 rounded-full overflow-hidden p-[2px]" style={{
                background: "#E8DED3",
                border: "1px solid rgba(209, 196, 181, 0.4)",
              }}>
                <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{
                  width: `${Math.max(journeyProgress, 2)}%`,
                  background: "linear-gradient(90deg, #5B1F3D, #C8A66A)",
                }}>
                  <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/jornada-do-louco")}
                className="px-8 py-3 rounded-xl bg-[#FAF5EF] text-[#5B1F3D] font-body text-[15px] font-bold border border-[#C8A66A30] hover:bg-[#5B1F3D] hover:text-white transition-all flex items-center gap-2"
              >
                Conhecer a Jornada do Louco <ChevronRight className="w-3 h-3" />
              </button>
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
              <div className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-12 transition-all duration-500 group-hover:shadow-[0_40px_80px_rgba(91,31,61,0.12)]" style={{
                background: "white",
                border: "2px solid #C8A66A",
                boxShadow: "0 30px 70px rgba(91, 31, 61, 0.1), 0 0 50px rgba(200, 166, 106, 0.15)",
              }}>
                {/* Background glow */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#C8A66A15] rounded-full blur-3xl group-hover:bg-[#C8A66A25] transition-colors" />

                <div className="relative z-10 flex items-center gap-8">
                  {/* Arcano symbol */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shrink-0 transition-all duration-700 group-hover:rotate-12 group-hover:scale-105" style={{
                    border: "2.5px solid #C8A66A",
                    background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                    boxShadow: "0 15px 35px rgba(91, 31, 61, 0.4)"
                  }}>
                    <span className="font-heading text-2xl md:text-3xl text-[#FAF5EF]">
                      {currentArcano.numeral}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="text-[13px] font-body font-bold mb-2" style={{ color: "#5B1F3D" }}>
                      Próxima etapa
                    </div>
                    <h3 className="font-heading text-3xl md:text-4xl tracking-tight mb-2 font-bold" style={{ color: "#5B1F3D" }}>
                      {currentArcano.name}
                    </h3>
                    <p className="font-body text-lg md:text-xl font-bold" style={{ color: "#5B1F3DCC" }}>
                      {currentArcano.subtitle}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500" style={{
                      background: "linear-gradient(135deg, #C8A66A, #B08D50)",
                      boxShadow: "0 10px 25px rgba(200, 166, 106, 0.4)"
                    }}>
                      <Sparkles className="w-6 h-6 text-[#5B1F3D]" />
                    </div>
                    <span className="text-[13px] font-body font-bold" style={{ color: "#5B1F3D" }}>
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
              <span className="text-[15px] font-body font-bold text-plum">
              Sua Aprendizagem
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A50]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "Stars", label: "Essência e arquétipos" },
              { icon: "Sparkles", label: "Símbolos e significados" },
              { icon: "sol", label: "Luz e sombra" },
              { icon: "enamorados", label: "Amor, trabalho e espírito" },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] p-7 text-center transition-all hover:bg-white border border-[#C8A66A25] group shadow-sm hover:shadow-xl" style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
              }}>
                <span className="block mb-4 transition-transform group-hover:scale-110 duration-500">
                  <TarotIcon name={item.icon} className="w-8 h-8 mx-auto" color="#C8A66A" />
                </span>
                <span className="text-[15px] font-body font-bold leading-snug block" style={{ color: "#5B1F3D" }}>
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
            <span className="text-[15px] font-body font-bold text-plum">
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