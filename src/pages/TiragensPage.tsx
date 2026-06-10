import { useNavigate } from "react-router-dom";
import { Check, Lock, ChevronRight } from "lucide-react";
import { TIRAGENS_LESSONS } from "@/content/lessons/tiragens";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedModule } from "@/hooks/use-resolved-module";
import { useHeader } from "@/contexts/header-context";
import { useEffect } from "react";

const TiragensPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  const { setHeader, resetHeader } = useHeader();
  
  // Fase 4B — telemetria invisível: módulo via adaptador (DB-first com fallback).
  useResolvedModule("tiragens");

  useEffect(() => {
    setHeader({
      title: "Tiragens",
      subtitle: "Módulo Avançado • Organizando a Leitura",
      backRoute: "/app"
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const isLessonCompleted = (lessonId: string) =>
    progress.completedLessons.includes(lessonId);

  const isLessonUnlocked = (order: number) => {
    if (bypassLocks) return true;
    if (order === 0) return true;
    const prev = TIRAGENS_LESSONS.find((l) => l.order === order - 1);
    return prev ? isLessonCompleted(prev.id) : false;
  };

  const completedCount = TIRAGENS_LESSONS.filter((l) =>
    isLessonCompleted(l.id)
  ).length;

  const progressPct = Math.round((completedCount / TIRAGENS_LESSONS.length) * 100);

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

      {/* Main Content */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        
        {/* Progress summary for this module */}
        <div className="mb-10 bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border-2 border-[#C8A66A]/30 shadow-xl">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[13px] font-heading tracking-widest uppercase font-black text-[#5B1F3D]">
                Progresso no Módulo
              </span>
              <span className="text-[15px] font-heading font-black px-3 py-1 rounded-full bg-[#C8A66A]/10 border border-[#C8A66A]/20" style={{ color: "#8B6A30" }}>
                {progressPct}%
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden p-[2px]" style={{ background: "#E8DED3", border: "1px solid rgba(209, 196, 181, 0.4)" }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{ 
                width: `${Math.max(progressPct, 4)}%`, 
                background: `linear-gradient(90deg, #5B1F3D, #C8A66A)` 
              }}>
                 <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[-25deg] animate-pulse" style={{ left: '10%' }} />
              </div>
            </div>
            <p className="mt-4 text-center text-[13px] font-heading font-black tracking-tight text-[#5B1F3D]/60 uppercase">
               {completedCount} de {TIRAGENS_LESSONS.length} lições dominadas
            </p>
        </div>

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
            "Você já sabe ler cartas isoladas e em combinação. Agora é hora de aprender a
            <strong style={{ color: "#5B1F3D" }}> organizar a leitura</strong> —
            com estrutura, intenção e método. Tiragens são a ferramenta prática da leitora."
          </p>
        </div>

        {/* Lesson trail section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A66A40]" />
          <span className="text-[12px] font-heading tracking-[0.2em] uppercase text-[#5B1F3D]">
            Conteúdo do Módulo
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A40]" />
        </div>

        {/* Lesson trail */}
        <div className="space-y-4">
          {TIRAGENS_LESSONS.map((lesson, i) => {
            const completed = isLessonCompleted(lesson.id);
            const unlocked = isLessonUnlocked(lesson.order);
            const isCurrent = unlocked && !completed;

            return (
              <button
                key={lesson.id}
                onClick={() => unlocked && navigate(`/tiragens/${lesson.order}`)}
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
                          className="text-[12px] font-heading tracking-[0.2em] font-bold"
                          style={{
                            color: unlocked ? "#5B1F3D" : "#5B1F3D40",
                          }}
                        >
                          LIÇÃO {lesson.order + 1}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] bg-[#C8A66A20] text-[#5B1F3D] px-2 py-0.5 rounded-full font-heading tracking-widest uppercase animate-pulse">
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
                        className="font-body text-[15px] leading-relaxed"
                        style={{
                          color: unlocked ? "#5B1F3D" : "#5B1F3D20",
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
        {completedCount === TIRAGENS_LESSONS.length && (
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
                Tiragens Completas!
              </h3>
              <p
                className="font-accent text-base italic max-w-sm mx-auto mb-8 text-[#FAF5EFBB]"
              >
                "Agora você domina as ferramentas práticas de leitura. Está pronta para os módulos de prática guiada."
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

        <div className="text-center pt-10 pb-16">
           <button 
             onClick={() => navigate("/app")}
             className="text-[12px] font-heading font-black tracking-[0.3em] uppercase text-[#5B1F3D]/60 hover:text-[#C8A66A] transition-colors"
           >
             ← Voltar à Jornada
           </button>
        </div>
      </main>
    </div>
  );
};

export default TiragensPage;