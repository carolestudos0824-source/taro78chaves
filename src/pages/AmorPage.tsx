import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, ChevronRight, Heart } from "lucide-react";
import { AMOR_LESSONS } from "@/content/lessons/amor";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedModule } from "@/hooks/use-resolved-module";

const AmorPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  // Fase 4B — telemetria invisível: módulo via adaptador (DB-first com fallback).
  useResolvedModule("amor");

  const isLessonCompleted = (lessonId: string) =>
    progress.completedLessons.includes(lessonId);

  const isLessonUnlocked = (order: number) => {
    if (bypassLocks) return true;
    if (order === 0) return true;
    const prev = AMOR_LESSONS.find((l) => l.order === order - 1);
    return prev ? isLessonCompleted(prev.id) : false;
  };

  const completedCount = AMOR_LESSONS.filter((l) =>
    isLessonCompleted(l.id)
  ).length;

  const progressPct = Math.round((completedCount / AMOR_LESSONS.length) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(340 42% 28% / 0.06) 0%, hsl(36 33% 97% / 0.05) 30%, hsl(36 33% 97% / 0.08) 70%, hsl(340 42% 28% / 0.12) 100%)"
        }} />
      </div>

      <header className="relative z-10" style={{
        borderBottom: "1px solid hsl(340 42% 28% / 0.25)",
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94) 0%, hsl(38 28% 93% / 0.92) 100%)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 6px 36px hsl(340 42% 28% / 0.08), 0 1px 0 hsl(340 42% 28% / 0.12) inset",
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate("/app")} className="transition-colors hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] tracking-[0.35em] uppercase font-body mb-1 flex items-center gap-1.5" style={{ color: "hsl(340 42% 28%)" }}>
                <Heart className="w-3 h-3" style={{ color: "hsl(340 42% 35%)" }} />
                Módulo Premium
              </span>
              <h1 className="font-heading text-xl md:text-2xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(340 35% 35%), hsl(36 45% 44%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Amor e Relacionamentos
              </h1>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 45%)" }}>
                {completedCount}/{AMOR_LESSONS.length} lições
              </span>
              <span className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(340 42% 30%)" }}>
                {progressPct}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(340 18% 88%)", border: "1px solid hsl(340 22% 78% / 0.50)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, hsl(340 42% 26%), hsl(340 35% 42%))",
              }} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl py-8 px-6">
        <div className="rounded-xl p-5 mb-8" style={{
          background: "linear-gradient(145deg, hsl(340 42% 28% / 0.04), hsl(36 45% 58% / 0.03))",
          border: "1px solid hsl(340 42% 28% / 0.15)",
        }}>
          <p className="font-accent text-sm italic leading-relaxed text-center" style={{ color: "hsl(230 20% 25% / 0.70)" }}>
            Amor é o tema mais pedido — e o mais distorcido. Este módulo ensina a ler
            dinâmicas afetivas com <strong style={{ color: "hsl(340 42% 22%)" }}>profundidade, honestidade e responsabilidade</strong>.
            Sem romantizar, sem distorcer, sem falsas promessas.
          </p>
        </div>

        <div className="space-y-3">
          {AMOR_LESSONS.map((lesson, i) => {
            const completed = isLessonCompleted(lesson.id);
            const unlocked = isLessonUnlocked(lesson.order);
            const isCurrent = unlocked && !completed;

            return (
              <button
                key={lesson.id}
                onClick={() => unlocked && navigate(`/amor/${lesson.order}`)}
                disabled={!unlocked}
                className="w-full text-left group transition-all duration-500"
                style={{ animation: `fade-up 0.5s ease-out both`, animationDelay: `${i * 60}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl transition-all duration-400" style={isCurrent ? {
                  background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(340 20% 95% / 0.90))",
                  backdropFilter: "blur(18px)",
                  border: "1.5px solid hsl(340 42% 28% / 0.35)",
                  boxShadow: "0 6px 28px hsl(340 42% 28% / 0.10), 0 0 40px hsl(340 42% 28% / 0.04)",
                } : completed ? {
                  background: "hsl(38 28% 94% / 0.80)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid hsl(340 35% 45% / 0.25)",
                  boxShadow: "0 3px 14px hsl(340 42% 28% / 0.05)",
                } : {
                  background: "hsl(36 18% 90% / 0.45)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid hsl(36 22% 80% / 0.45)",
                }}>
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-500" style={isCurrent ? {
                      border: "2px solid hsl(340 42% 26% / 0.45)",
                      background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(340 42% 28% / 0.10))",
                      boxShadow: "0 0 20px hsl(340 42% 28% / 0.12)",
                    } : completed ? {
                      border: "2px solid hsl(340 35% 45% / 0.35)",
                      background: "hsl(38 28% 94% / 0.90)",
                    } : {
                      border: "1.5px solid hsl(36 22% 75% / 0.50)",
                      background: "hsl(36 18% 90% / 0.55)",
                    }}>
                      {completed ? (
                        <Check className="w-5 h-5" style={{ color: "hsl(340 35% 38%)" }} />
                      ) : unlocked ? (
                        <span className="text-lg">{lesson.icon}</span>
                      ) : (
                        <Lock className="w-4 h-4" style={{ color: "hsl(230 10% 45% / 0.30)" }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-heading tracking-[0.2em]" style={{
                          color: isCurrent ? "hsl(340 42% 22%)" : completed ? "hsl(340 35% 40%)" : "hsl(230 10% 45% / 0.30)",
                        }}>
                          {lesson.order + 1}/{AMOR_LESSONS.length}
                        </span>
                        <h3 className="font-heading text-sm tracking-wide truncate" style={isCurrent ? {
                          background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(340 35% 30%))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        } : completed ? { color: "hsl(230 20% 12% / 0.75)" } : { color: "hsl(230 10% 45% / 0.30)" }}>
                          {lesson.title}
                        </h3>
                      </div>
                      <p className="font-accent text-xs italic truncate" style={{
                        color: isCurrent ? "hsl(230 20% 15% / 0.55)" : completed ? "hsl(230 20% 15% / 0.45)" : "hsl(230 10% 45% / 0.18)",
                      }}>
                        {lesson.subtitle}
                      </p>
                    </div>

                    {unlocked && (
                      <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" style={{
                        color: isCurrent ? "hsl(340 42% 28% / 0.50)" : "hsl(340 35% 45% / 0.40)",
                      }} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {completedCount === AMOR_LESSONS.length && (
          <div className="mt-8 rounded-xl p-6 text-center" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.06), hsl(36 45% 58% / 0.04))",
            border: "1px solid hsl(340 42% 28% / 0.20)",
            animation: "fade-up 0.6s ease-out",
          }}>
            <div className="text-2xl mb-3">♡</div>
            <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
              Amor e Relacionamentos Completo!
            </h3>
            <p className="font-accent text-sm italic max-w-sm mx-auto mb-4" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
              Agora você sabe ler o coração com profundidade, honestidade e responsabilidade.
            </p>
            <button
              onClick={() => navigate("/app")}
              className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 35% 40%))",
                color: "hsl(36 33% 97%)",
                boxShadow: "0 4px 20px hsl(340 42% 28% / 0.2)",
              }}
            >
              Voltar aos Módulos →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AmorPage;
