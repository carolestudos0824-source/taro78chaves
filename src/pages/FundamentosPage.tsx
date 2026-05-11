import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, ChevronRight, BookOpen } from "lucide-react";
import { FUNDAMENTOS_LESSONS } from "@/content/lessons/fundamentos";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedModule } from "@/hooks/use-resolved-module";
import { XPBar } from "@/components/XPBar";

const FundamentosPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  // Fase 4A — telemetria invisível: módulo Fundamentos via adaptador (DB-first).
  useResolvedModule("fundamentos");

  const isLessonCompleted = (lessonId: string) =>
    progress.completedLessons.includes(lessonId);

  const isLessonUnlocked = (order: number) => {
    if (bypassLocks) return true;
    if (order === 0) return true;
    const prev = FUNDAMENTOS_LESSONS.find((l) => l.order === order - 1);
    return prev ? isLessonCompleted(prev.id) : false;
  };

  const completedCount = FUNDAMENTOS_LESSONS.filter((l) =>
    isLessonCompleted(l.id)
  ).length;

  const progressPct = Math.round((completedCount / FUNDAMENTOS_LESSONS.length) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — continuous, soft, premium */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.95,
          }}
        />
        {/* Subtle radial halo to remove horizontal banding */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(243, 230, 224, 0.55) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Header */}
      <header
        className="relative z-10"
        style={{
          borderBottom: "1px solid rgba(200, 166, 106, 0.18)",
          background: "linear-gradient(180deg, rgba(250, 245, 239, 0.92) 0%, rgba(250, 245, 239, 0.55) 100%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 1px 0 rgba(91, 31, 61, 0.03)",
        }}
      >
        <div className="container max-w-3xl py-6 px-6">
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={() => navigate("/app")}
              className="transition-all hover:scale-110 duration-200 w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30]"
              style={{ color: "#5B1F3D" }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col flex-1">
              <span
                className="text-[10px] tracking-[0.4em] uppercase font-heading mb-1.5 flex items-center gap-2"
                style={{ color: "#5B1F3D" }}
              >
                <span style={{ color: "#C8A66A" }}>◈</span>
                Módulo Introdutório
              </span>
              <h1
                className="font-heading text-2xl md:text-3xl tracking-wide"
                style={{ color: "#5B1F3D" }}
              >
                Fundamentos do Tarô
              </h1>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-[#C8A66A20]">
            <div className="flex items-center justify-between px-1">
              <span
                className="text-[11px] font-heading tracking-wider"
                style={{ color: "#5B1F3DCC" }}
              >
                {completedCount}/{FUNDAMENTOS_LESSONS.length} lições concluídas
              </span>
              <span
                className="text-[11px] font-heading tracking-wider"
                style={{ color: "#C8A66A" }}
              >
                {progressPct}%
              </span>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{
                background: "#E8DED3",
                border: "1px solid #D1C4B5",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #5B1F3D, #C8A66A)",
                }}
              >
                <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Intro text */}
        <div
          className="rounded-2xl p-7 mb-10 text-center relative overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #FAF5EF 0%, #F3E6E0 100%)",
            border: "1px solid rgba(200, 166, 106, 0.28)",
            boxShadow: "0 10px 30px rgba(91, 31, 61, 0.04)",
          }}
        >
          {/* Decorative icons */}
          <div className="absolute top-2 right-4 opacity-15 group-hover:opacity-25 transition-opacity">
            <span className="text-2xl">✨</span>
          </div>
          <div className="absolute bottom-2 left-4 opacity-15 group-hover:opacity-25 transition-opacity">
            <span className="text-xl">🗝️</span>
          </div>

          {/* Tarot ornament — chave & estrela */}
          <div className="flex items-center justify-center gap-3 mb-4 opacity-90">
            <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #C8A66A80)" }} />
            <span className="text-[13px]" style={{ color: "#C8A66A", letterSpacing: "0.3em" }}>✶ ◈ ✶</span>
            <span className="h-px w-10" style={{ background: "linear-gradient(90deg, #C8A66A80, transparent)" }} />
          </div>

          <p
            className="font-accent text-[16px] md:text-[17px] italic leading-relaxed max-w-xl mx-auto"
            style={{ color: "#3D1429", fontWeight: 500 }}
          >
            "Este módulo é a sua base. Aqui você vai entender o que é o tarô,
            como ele funciona e como estudá-lo com profundidade e clareza —
            antes de mergulhar nos 22 Arcanos Maiores."
          </p>
        </div>

        {/* Lesson trail section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8A66A30] to-[#C8A66A70]" />
          <span
            className="text-[11px] font-heading tracking-[0.32em] uppercase"
            style={{ color: "#8B6A30", fontWeight: 600 }}
          >
            Trilha de Aprendizado
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C8A66A30] to-[#C8A66A70]" />
        </div>

        {/* Lesson trail */}
        <div className="space-y-4">
          {FUNDAMENTOS_LESSONS.map((lesson, i) => {
            const completed = isLessonCompleted(lesson.id);
            const unlocked = isLessonUnlocked(lesson.order);
            const isCurrent = unlocked && !completed;

            return (
              <button
                key={lesson.id}
                onClick={() =>
                  unlocked && navigate(`/fundamentos/${lesson.order}`)
                }
                disabled={!unlocked}
                className="w-full text-left group transition-all duration-300"
                style={{
                  animation: `fade-up 0.5s ease-out both`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl transition-all duration-300 transform group-hover:translate-x-1"
                  style={
                    isCurrent
                      ? {
                          background: "#FFFFFF",
                          border: "1.5px solid #C8A66A",
                          boxShadow: "0 12px 30px rgba(200, 166, 106, 0.15), 0 0 20px rgba(91, 31, 61, 0.05)",
                        }
                      : completed
                      ? {
                          background: "rgba(250, 245, 239, 0.8)",
                          border: "1px solid #C8A66A40",
                          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.02)",
                        }
                      : {
                          background: "rgba(220, 207, 194, 0.3)",
                          border: "1px solid #D1C4B560",
                          opacity: 0.7,
                        }
                  }
                >
                  <div className="p-5 flex items-center gap-5">
                    {/* Icon container */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                      style={
                        isCurrent
                          ? {
                              background: "linear-gradient(135deg, #5B1F3D, #8B3D5A)",
                              color: "#FAF5EF",
                              boxShadow: "0 5px 15px rgba(91, 31, 61, 0.2)",
                            }
                          : completed
                          ? {
                              background: "#F3E6E0",
                              border: "1px solid #C8A66A",
                              color: "#C8A66A",
                            }
                          : {
                              background: "#DCCFC240",
                              border: "1px solid #DCCFC2",
                              color: "#5B1F3D40",
                            }
                      }
                    >
                      {completed ? (
                        <Check className="w-5 h-5" />
                      ) : unlocked ? (
                        <span className="text-xl">{lesson.icon}</span>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[9px] font-heading tracking-[0.2em] font-bold"
                          style={{
                            color: unlocked ? "#C8A66A" : "#5B1F3D40",
                          }}
                        >
                          LIÇÃO {lesson.order + 1}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] bg-[#C8A66A20] text-[#C8A66A] px-2 py-0.5 rounded-full font-heading tracking-widest uppercase animate-pulse">
                            Atual
                          </span>
                        )}
                      </div>
                      <h3
                        className="font-heading text-base md:text-lg tracking-wide mb-0.5"
                        style={{
                          color: unlocked ? "#5B1F3D" : "#5B1F3D40",
                        }}
                      >
                        {lesson.title}
                      </h3>
                      <p
                        className="font-body text-[12.5px] leading-relaxed"
                        style={{
                          color: unlocked ? "#4A1830" : "#5B1F3D30",
                          fontWeight: isCurrent ? 600 : 500,
                        }}
                      >
                        {lesson.subtitle}
                      </p>
                    </div>

                    {/* Arrow / Status */}
                    <div className="shrink-0">
                      {unlocked ? (
                        <ChevronRight
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                          style={{ color: "#C8A66A" }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full border border-[#D1C4B540] flex items-center justify-center">
                           <Lock className="w-3.5 h-3.5 opacity-20" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Subtle decorative bar for completed lessons */}
                  {completed && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A66A30]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Module completion message */}
        {completedCount === FUNDAMENTOS_LESSONS.length ? (
          <div
            className="mt-12 rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
              border: "2.5px solid #C8A66A",
              boxShadow: "0 20px 50px rgba(91, 31, 61, 0.2)",
              animation: "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Background ornaments */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C8A66A10] rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#C8A66A10] rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-center gap-3 mb-4">
                <span className="text-xl text-[#C8A66A]">✦</span>
                <span className="text-2xl text-[#C8A66A]">🗝️</span>
                <span className="text-xl text-[#C8A66A]">✦</span>
              </div>
              
              <h3
                className="font-heading text-2xl tracking-wide mb-3 text-[#FAF5EF]"
              >
                Fundamentos Completos!
              </h3>
              
              <p
                className="font-accent text-base italic max-w-sm mx-auto mb-8 text-[#FAF5EFCC]"
              >
                "Sua base está sólida. Você está preparada para iniciar a Jornada Real através dos 22 Arcanos Maiores."
              </p>
              
              <button
                onClick={() => navigate("/module/arcanos-maiores")}
                className="group relative px-10 py-4 rounded-full font-heading text-sm tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95"
                style={{
                  background: "#C8A66A",
                  color: "#5B1F3D",
                  boxShadow: "0 10px 30px rgba(200, 166, 106, 0.4)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  COMEÇAR ARCANOS MAIORES
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-[#C8A66A40]" />
                <span className="text-[9px] font-heading tracking-[0.3em] uppercase text-[#C8A66A80]">
                  Base da Jornada
                </span>
                <div className="h-px w-8 bg-[#C8A66A40]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center pb-8 opacity-40">
            <span className="text-2xl text-[#C8A66A]">🗝️</span>
          </div>
        )}
      </main>
    </div>

  );
};

export default FundamentosPage;
