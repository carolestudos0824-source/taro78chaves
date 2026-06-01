import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, ChevronRight } from "lucide-react";
import { COMBINACOES_LESSONS } from "@/content/lessons/combinacoes";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedModule } from "@/hooks/use-resolved-module";
import { PontosBar } from "@/components/PontosBar";

const CombinacoesPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks, loading: accessLoading } = useAccess();
  // Fase 4B — telemetria invisível: módulo via adaptador (DB-first com fallback).
  useResolvedModule("combinacoes");

  const isLessonCompleted = (lessonId: string) =>
    progress.completedLessons.includes(lessonId);

  // Regra unificada: enquanto o acesso carrega, NÃO travamos lições com cadeado
  // (evita flash de bloqueio para admin/premium). Após carregar, regra normal.
  const isLessonUnlocked = (order: number) => {
    if (accessLoading) return true;
    if (bypassLocks) return true;
    if (order === 0) return true;
    const prev = COMBINACOES_LESSONS.find((l) => l.order === order - 1);
    return prev ? isLessonCompleted(prev.id) : false;
  };

  const completedCount = COMBINACOES_LESSONS.filter((l) =>
    isLessonCompleted(l.id)
  ).length;

  const progressPct = Math.round((completedCount / COMBINACOES_LESSONS.length) * 100);

  const openLesson = (order: number, unlocked: boolean) => {
    if (!unlocked) return;
    navigate(`/combinacoes/${order}`);
  };

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
      <header
        className="relative z-10"
        style={{
          borderBottom: "1.5px solid #C8A66A40",
          background: "rgba(250, 245, 239, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)",
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
                style={{ color: "#C8A66A" }}
              >
                <span style={{ color: "#C8A66A" }}>∞</span>
                Módulo Avançado
              </span>
              <h1
                className="font-heading text-2xl md:text-3xl tracking-wide"
                style={{ color: "#5B1F3D" }}
              >
                Combinações
              </h1>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-[#C8A66A20]">
            <div className="flex items-center justify-between px-1">
              <span
                className="text-[11px] font-heading tracking-wider"
                style={{ color: "#5B1F3DAA" }}
              >
                {completedCount}/{COMBINACOES_LESSONS.length} lições concluídas
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
          className="rounded-2xl p-6 mb-10 text-center relative overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #FAF5EF, #F3E6E0)",
            border: "1px solid #C8A66A30",
            boxShadow: "0 10px 30px rgba(91, 31, 61, 0.03)",
          }}
        >
          <div className="absolute top-2 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-2xl">✨</span>
          </div>
          
          <p
            className="font-accent text-[15px] italic leading-relaxed max-w-xl mx-auto"
            style={{ color: "#5B1F3D" }}
          >
            "Até agora você aprendeu cada carta como uma entidade individual. Agora é hora
            de aprender a ouvir o <strong style={{ color: "#5B1F3D" }}>diálogo entre elas</strong>.
            Combinações é a arte de criar narrativa a partir da interação — onde a leitura
            de verdade começa."
          </p>
        </div>

        {/* Lesson trail section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A66A40]" />
          <span className="text-[10px] font-heading tracking-[0.2em] uppercase text-[#C8A66A]">
            Conteúdo do Módulo
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A40]" />
        </div>

        {/* Lesson trail */}
        <div className="space-y-4">
          {COMBINACOES_LESSONS.map((lesson, i) => {
            const completed = isLessonCompleted(lesson.id);
            const unlocked = isLessonUnlocked(lesson.order);
            const isCurrent = unlocked && !completed;

            return (
              <button
                key={lesson.id}
                onClick={() => openLesson(lesson.order, unlocked)}
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
                        className="font-body text-xs leading-relaxed"
                        style={{
                          color: unlocked ? "#5B1F3DBB" : "#5B1F3D20",
                        }}
                      >
                        {lesson.subtitle}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0">
                      {unlocked && (
                        <ChevronRight
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                          style={{ color: "#C8A66A" }}
                        />
                      )}
                    </div>
                  </div>
                  
                  {completed && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A66A30]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Module completion message */}
        {completedCount === COMBINACOES_LESSONS.length && (
          <div
            className="mt-12 rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
              border: "2.5px solid #C8A66A",
              boxShadow: "0 20px 50px rgba(91, 31, 61, 0.2)",
              animation: "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="relative z-10">
              <div className="text-3xl mb-4 text-[#C8A66A]">✦</div>
              <h3
                className="font-heading text-2xl tracking-wide mb-3 text-[#FAF5EF]"
              >
                Combinações Completas!
              </h3>
              <p
                className="font-accent text-base italic max-w-sm mx-auto mb-8 text-[#FAF5EFBB]"
              >
                "Agora você sabe ler o diálogo entre as cartas. O próximo passo é dominar as tiragens clássicas."
              </p>
              <button
                onClick={() => navigate("/app")}
                className="group relative px-10 py-4 rounded-full font-heading text-sm tracking-[0.2em] transition-all duration-500 hover:scale-105"
                style={{
                  background: "#C8A66A",
                  color: "#5B1F3D",
                  boxShadow: "0 10px 30px rgba(200, 166, 106, 0.4)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  VOLTAR AOS MÓDULOS
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CombinacoesPage;
