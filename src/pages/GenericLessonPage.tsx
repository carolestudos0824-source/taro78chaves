import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Brain, Lightbulb, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useRole } from "@/hooks/use-role";
import { useResolvedLesson } from "@/hooks/use-resolved-lesson";
import { StreakCounter } from "@/components/StreakCounter";

interface GenericLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  reflection?: string;
  exercise: { instruction: string; type: string };
  quiz: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
}

type Phase = "lesson" | "deepdive" | "exercise" | "quiz" | "complete";
const PHASE_LABELS: Record<Phase, string> = {
  lesson: "Lição",
  deepdive: "Aprofundamento",
  exercise: "Exercício",
  quiz: "Quiz",
  complete: "Conclusão",
};
const PHASE_ORDER: Phase[] = ["lesson", "deepdive", "exercise", "quiz", "complete"];

interface Props {
  lessons: GenericLesson[];
  getLessonByOrder: (order: number) => GenericLesson | undefined;
  moduleRoute: string;
  moduleName: string;
  /** Module ID for auto-completing */
  moduleId?: string;
  /** Optional theme accent HSL e.g. "280 30% 45%" */
  themeAccent?: string;
  /** Optional category label */
  categoryLabel?: string;
  /** Fase 4B — slug do módulo no CMS para telemetria via adaptador. */
  moduleSlug?: string;
}

const GenericLessonPage = ({ lessons, getLessonByOrder, moduleRoute, moduleName, moduleId, themeAccent, categoryLabel, moduleSlug }: Props) => {
  const { order } = useParams();
  const navigate = useNavigate();
  const { progress, addXP, completeLesson, completeQuiz, completeModule } = useProgress();
  const { isStaff, loading: roleLoading } = useRole();
  const [phase, setPhase] = useState<Phase>("lesson");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState(0);
  
  // Fallback defensivo para rota literal /:order
  const isLiteralRoute = order === ":order";
  const lessonOrder = parseInt(order || "0", 10);
  const lesson = getLessonByOrder(lessonOrder);
  const nextLesson = getLessonByOrder(lessonOrder + 1);

  // Redirecionamento defensivo se a rota for literal
  useEffect(() => {
    if (isLiteralRoute) {
      navigate(moduleRoute, { replace: true });
    }
  }, [isLiteralRoute, navigate, moduleRoute]);

  // Fase 4B — telemetria invisível via adaptador (DB-first com fallback).
  useResolvedLesson(moduleSlug ?? null, lesson?.id ?? null);
  const totalLessons = lessons.length;

  const accent = themeAccent || "36 42% 44%";

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-heading tracking-wider">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isLiteralRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-[#C8A66A]/20 border-t-[#5B1F3D] animate-spin rounded-full mx-auto" />
          <p className="text-[12px] text-[#5B1F3D] font-heading tracking-widest uppercase font-bold">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="text-center space-y-6 max-w-xs px-6">
          <div className="w-16 h-16 bg-[#F3E6E0] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#C8A66A30]">
            <span className="text-2xl">🗝️</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-xl" style={{ color: "#5B1F3D" }}>Lição não encontrada</h2>
            <p className="font-body text-sm text-[#5B1F3D]/60 italic leading-relaxed">
              "O caminho se revela apenas para quem sabe onde pisa."
            </p>
          </div>
          <button 
            onClick={() => navigate(moduleRoute)} 
            className="w-full py-3.5 px-6 rounded-full font-heading text-[12px] tracking-[0.2em] uppercase transition-all shadow-md hover:scale-105 active:scale-95"
            style={{ background: "#C8A66A", color: "#5B1F3D" }}
          >
            Voltar ao módulo
          </button>
        </div>
      </div>
    );
  }

  const currentPhaseIdx = PHASE_ORDER.indexOf(phase);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
    if (idx === lesson.quiz[quizIdx].correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (quizIdx < lesson.quiz.length - 1) {
      setQuizIdx(i => i + 1);
      setSelected(null);
      setShowExp(false);
    } else {
      if (!isStaff) {
        completeQuiz(lesson.id);
        completeLesson(lesson.id);
        addXP(25 + score * 10);
        // Auto-complete module if this was the last lesson
        if (!nextLesson && moduleId) {
          completeModule(moduleId);
        }
      }
      goTo("complete");
    }
  };

  const goTo = (p: Phase) => {
    setPhase(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextLesson = () => {
    if (!nextLesson) return;
    navigate(`${moduleRoute.replace("/module/", "/")}/${nextLesson.order}`);
    setPhase("lesson");
    setQuizIdx(0);
    setSelected(null);
    setShowExp(false);
    setScore(0);
    window.scrollTo({ top: 0 });
  };

  // ── Render helpers ──

  const PhaseNav = () => (
    <div className="flex items-center gap-1 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
      {PHASE_ORDER.slice(0, -1).map((p, i) => {
        const isActive = i === currentPhaseIdx;
        const isPast = i < currentPhaseIdx;
        return (
          <div key={p} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: isPast ? `hsl(${accent})` : isActive ? `hsl(${accent} / 0.7)` : "hsl(230 10% 75% / 0.4)",
                transform: isActive ? "scale(1.3)" : "scale(1)",
                boxShadow: isActive ? `0 0 8px hsl(${accent} / 0.3)` : "none",
              }}
            />
            {i < PHASE_ORDER.length - 2 && (
              <div className="w-3 h-px" style={{ background: isPast ? `hsl(${accent} / 0.4)` : "hsl(230 10% 75% / 0.25)" }} />
            )}
          </div>
        );
      })}
    </div>
  );

  const SectionBlock = ({ children, icon, label, delay = "0ms", accentOverride }: {
    children: React.ReactNode;
    icon?: React.ReactNode;
    label?: string;
    delay?: string;
    accentOverride?: string;
  }) => {
    const a = accentOverride || accent;
    return (
      <div
        className="rounded-xl overflow-hidden animate-fade-in"
        style={{
          background: "hsl(38 28% 93% / 0.85)",
          border: `1px solid hsl(${a} / 0.12)`,
          backdropFilter: "blur(8px)",
          boxShadow: `0 4px 24px hsl(${a} / 0.04)`,
          animationDelay: delay,
          animationFillMode: "both",
        }}
      >
        {label && (
          <div className="px-5 pt-4 pb-0 flex items-center gap-2">
            {icon}
            <span className="text-[10px] font-heading tracking-[0.2em] uppercase" style={{ color: `hsl(${a})` }}>{label}</span>
          </div>
        )}
        <div className="p-5">
          {children}
        </div>
      </div>
    );
  };

  const ContinueButton = ({ onClick, label = "Continuar →" }: { onClick: () => void; label?: string }) => (
    <div className="flex justify-center pt-2 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
      <button
        onClick={onClick}
        className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all hover:scale-105 active:scale-95"
        style={{
          background: `linear-gradient(135deg, hsl(${accent}), hsl(${accent} / 0.8))`,
          color: "hsl(36 33% 97%)",
          boxShadow: `0 4px 20px hsl(${accent} / 0.2)`,
        }}
      >
        {label}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, hsl(${accent} / 0.03), hsl(36 33% 97% / 0.18), hsl(36 33% 97% / 0.26))`
        }} />
      </div>

      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: "hsl(36 33% 97% / 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid hsl(${accent} / 0.10)`,
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(moduleRoute)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
            style={{ background: "hsl(36 33% 97% / 0.7)", border: `1px solid hsl(${accent} / 0.12)` }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "hsl(230 20% 25%)" }} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-heading tracking-[0.25em] uppercase truncate" style={{ color: `hsl(${accent} / 0.7)` }}>
              {categoryLabel || moduleName}
            </p>
            <p className="font-heading text-sm truncate" style={{ color: "hsl(230 25% 15%)" }}>
              {lesson.title}
            </p>
          </div>
          <PhaseNav />
        </div>
        {/* Lesson progress bar */}
        <div className="h-0.5" style={{ background: `hsl(${accent} / 0.08)` }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${((lessonOrder + 1) / totalLessons) * 100}%`,
              background: `linear-gradient(90deg, hsl(${accent}), hsl(${accent} / 0.6))`,
            }}
          />
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-28 pt-5">
        {/* ── Editorial opening ── */}
        {phase === "lesson" && (
          <>
            {/* Intro card */}
            <div
              className="rounded-2xl p-5 mb-5 animate-fade-in"
              style={{
                background: `linear-gradient(135deg, hsl(${accent} / 0.05), hsl(36 33% 97% / 0.70), hsl(${accent} / 0.03))`,
                border: `1px solid hsl(${accent} / 0.12)`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 6px 24px hsl(${accent} / 0.05)`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <StreakCounter streak={progress.streak} />
                <span className="text-[10px] font-heading tracking-wider ml-auto" style={{ color: "hsl(230 20% 15% / 0.4)" }}>
                  Lição {lessonOrder + 1} de {totalLessons}
                </span>
              </div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-xl">{lesson.icon}</span>
                <h1 className="font-heading text-lg tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>
                  {lesson.title}
                </h1>
              </div>
              <p className="font-accent text-xs italic leading-relaxed" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                {lesson.subtitle}
              </p>
            </div>

            {/* Main content */}
            <div className="space-y-4">
              <SectionBlock
                icon={<BookOpen className="w-3.5 h-3.5" style={{ color: `hsl(${accent})` }} />}
                label="Conteúdo Principal"
                delay="100ms"
              >
                {lesson.content.split("\n\n").map((p, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed mb-3 last:mb-0"
                    style={{ color: "hsl(230 20% 25%)" }}
                    dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong style="color: hsl(230 25% 15%)">$1</strong>') }}
                  />
                ))}
              </SectionBlock>

              {/* Key Points */}
              {lesson.keyPoints.length > 0 && (
                <SectionBlock
                  icon={<Lightbulb className="w-3.5 h-3.5" style={{ color: `hsl(${accent})` }} />}
                  label="Pontos-chave"
                  delay="200ms"
                >
                  <ul className="space-y-2">
                    {lesson.keyPoints.map((kp, i) => (
                      <li key={i} className="text-xs leading-relaxed flex gap-2.5 items-start" style={{ color: "hsl(230 20% 25%)" }}>
                        <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: `hsl(${accent})` }} />
                        {kp}
                      </li>
                    ))}
                  </ul>
                </SectionBlock>
              )}

              {/* Deep Dive preview */}
              {lesson.deepDive && (
                <SectionBlock
                  icon={<Brain className="w-3.5 h-3.5" style={{ color: "hsl(270 30% 40%)" }} />}
                  label="Aprofundamento"
                  delay="300ms"
                  accentOverride="270 30% 40%"
                >
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "hsl(230 20% 25% / 0.7)" }}>
                    {lesson.deepDive.slice(0, 200)}…
                  </p>
                  <button
                    onClick={() => goTo("deepdive")}
                    className="text-[11px] font-heading tracking-wider"
                    style={{ color: "hsl(270 30% 40%)" }}
                  >
                    Ler mais →
                  </button>
                </SectionBlock>
              )}

              <ContinueButton onClick={() => goTo("exercise")} />
            </div>
          </>
        )}

        {/* ── Deep Dive ── */}
        {phase === "deepdive" && lesson.deepDive && (
          <div className="space-y-4">
            <SectionBlock
              icon={<Brain className="w-3.5 h-3.5" style={{ color: "hsl(270 30% 40%)" }} />}
              label="Aprofundamento"
              accentOverride="270 30% 40%"
            >
              {lesson.deepDive.split("\n\n").map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed mb-3 last:mb-0"
                  style={{ color: "hsl(230 20% 25%)" }}
                  dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
              ))}
            </SectionBlock>
            <ContinueButton onClick={() => goTo("exercise")} label="Ir ao Exercício →" />
          </div>
        )}

        {/* ── Exercise ── */}
        {phase === "exercise" && (
          <div className="space-y-4">
            <SectionBlock
              icon={<CheckCircle2 className="w-3.5 h-3.5" style={{ color: "hsl(340 42% 28%)" }} />}
              label="Exercício"
              accentOverride="340 42% 28%"
            >
              <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>
                {lesson.exercise.instruction}
              </p>
            </SectionBlock>

            {lesson.reflection && (
              <SectionBlock
                icon={<span className="text-sm">💭</span>}
                label="Reflexão"
                delay="120ms"
                accentOverride="270 30% 35%"
              >
                <p className="text-xs leading-relaxed italic" style={{ color: "hsl(230 20% 25% / 0.8)" }}>
                  {lesson.reflection}
                </p>
              </SectionBlock>
            )}

            <ContinueButton onClick={() => { goTo("quiz"); setQuizIdx(0); setSelected(null); setShowExp(false); setScore(0); }} label="Ir ao Quiz →" />
          </div>
        )}

        {/* ── Quiz ── */}
        {phase === "quiz" && lesson.quiz[quizIdx] && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-heading tracking-wider animate-fade-in" style={{ color: "hsl(230 20% 15% / 0.5)" }}>
              <span>Pergunta {quizIdx + 1}/{lesson.quiz.length}</span>
              <span>{score} acerto{score !== 1 ? "s" : ""}</span>
            </div>

            <SectionBlock>
              <p className="text-sm font-heading leading-relaxed mb-4" style={{ color: "hsl(230 25% 15%)" }}>
                {lesson.quiz[quizIdx].question}
              </p>
              <div className="space-y-2">
                {lesson.quiz[quizIdx].options.map((opt, i) => {
                  const isCorrect = i === lesson.quiz[quizIdx].correctIndex;
                  const isSelected = i === selected;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selected !== null}
                      className="w-full text-left rounded-lg p-3.5 text-xs transition-all duration-200"
                      style={{
                        background: selected !== null
                          ? (isCorrect ? "hsl(140 40% 45% / 0.10)" : isSelected ? "hsl(0 60% 50% / 0.10)" : "hsl(38 28% 93% / 0.5)")
                          : "hsl(38 28% 93% / 0.5)",
                        border: `1px solid ${selected !== null
                          ? (isCorrect ? "hsl(140 40% 45% / 0.30)" : isSelected ? "hsl(0 60% 50% / 0.30)" : "hsl(36 25% 82% / 0.3)")
                          : "hsl(36 25% 82% / 0.3)"}`,
                        color: "hsl(230 20% 25%)",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showExp && (
                <div className="mt-3 p-3.5 rounded-lg text-xs leading-relaxed animate-fade-in" style={{
                  background: `hsl(${accent} / 0.05)`,
                  border: `1px solid hsl(${accent} / 0.12)`,
                  color: "hsl(230 20% 25%)",
                }}>
                  {lesson.quiz[quizIdx].explanation}
                </div>
              )}
            </SectionBlock>

            {selected !== null && (
              <ContinueButton
                onClick={handleNext}
                label={quizIdx < lesson.quiz.length - 1 ? "Próxima →" : "Ver Resultado"}
              />
            )}
          </div>
        )}

        {/* ── Complete ── */}
        {phase === "complete" && (() => {
          const percentage = Math.round((score / lesson.quiz.length) * 100);
          const isExcellent = percentage >= 80;
          const xpEarned = 25 + score * 10;
          const isLastLesson = !nextLesson;

          return (
            <div className="text-center py-10 space-y-6" style={{ animation: "fade-up 0.6s ease-out" }}>
              {/* Achievement icon */}
              <div className="relative">
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(${accent} / 0.15), hsl(${accent} / 0.08))`,
                    border: `2px solid hsl(${accent} / 0.30)`,
                    boxShadow: `0 0 40px hsl(${accent} / 0.12)`,
                    animation: "glow-breathe 3s ease-in-out infinite",
                  }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: `hsl(${accent})` }} />
                </div>
                {isExcellent && (
                  <div
                    className="absolute w-7 h-7 rounded-full flex items-center justify-center text-xs animate-fade-in"
                    style={{
                      background: `linear-gradient(135deg, hsl(42 80% 55%), hsl(36 60% 50%))`,
                      border: "2px solid hsl(36 33% 97%)",
                      boxShadow: `0 2px 8px hsl(${accent} / 0.3)`,
                      top: "-4px",
                      left: "calc(50% + 24px)",
                    }}
                  >⭐</div>
                )}
              </div>

              <div>
                <h2 className="font-heading text-xl mb-1" style={{
                  background: `linear-gradient(135deg, hsl(340 42% 20%), hsl(${accent}))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Lição Concluída!</h2>
                <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>
                  <strong>{lesson.title}</strong>
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <span className="block font-heading text-xl" style={{ color: `hsl(${accent})` }}>{percentage}%</span>
                  <span className="text-[9px] font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(230 10% 50%)" }}>Quiz</span>
                </div>
                <div className="w-px h-10" style={{ background: `hsl(${accent} / 0.2)` }} />
                <div className="text-center">
                  <span className="block font-heading text-xl" style={{ color: `hsl(${accent})` }}>+{xpEarned}</span>
                  <span className="text-[9px] font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(230 10% 50%)" }}>XP</span>
                </div>
              </div>

              {/* Progress saved */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-heading tracking-wider"
                style={{
                  background: "hsl(120 40% 50% / 0.08)",
                  border: "1px solid hsl(120 40% 50% / 0.2)",
                  color: "hsl(120 40% 35%)",
                }}
              >✓ Progresso salvo</div>

              {/* Next lesson teaser */}
              {nextLesson && (
                <div
                  className="rounded-xl p-5 text-left mx-auto max-w-sm animate-fade-in"
                  style={{
                    background: `linear-gradient(135deg, hsl(${accent} / 0.04), hsl(340 42% 28% / 0.03))`,
                    border: `1px solid hsl(${accent} / 0.12)`,
                    animationDelay: "300ms",
                    animationFillMode: "both",
                  }}
                >
                  <p className="text-[9px] font-heading tracking-[0.3em] uppercase mb-2" style={{ color: `hsl(${accent} / 0.6)` }}>
                    Próxima lição
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: `hsl(${accent} / 0.08)`,
                        border: `1px solid hsl(${accent} / 0.2)`,
                      }}
                    >
                      <span className="text-sm">{nextLesson.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm" style={{ color: "hsl(230 25% 15%)" }}>{nextLesson.title}</p>
                      <p className="font-accent text-[11px] italic truncate" style={{ color: "hsl(230 20% 15% / 0.45)" }}>{nextLesson.subtitle}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Module complete celebration */}
              {isLastLesson && (
                <div className="pt-4" style={{ borderTop: `1px solid hsl(${accent} / 0.15)` }}>
                  <div className="text-2xl mb-3">🎉</div>
                  <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
                    Módulo Concluído!
                  </h3>
                  <p className="font-accent text-sm italic max-w-sm mx-auto" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                    Você completou todas as lições de {moduleName}. Parabéns pela dedicação!
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col items-center gap-3 pt-2">
                {nextLesson && (
                  <button
                    onClick={goToNextLesson}
                    className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, hsl(${accent}), hsl(${accent} / 0.8))`,
                      color: "hsl(36 33% 97%)",
                      boxShadow: `0 4px 20px hsl(${accent} / 0.2)`,
                    }}
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => navigate(moduleRoute)}
                  className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all hover:scale-105 flex items-center gap-2"
                  style={{
                    background: "transparent",
                    border: `1.5px solid hsl(${accent} / 0.35)`,
                    color: `hsl(${accent})`,
                  }}
                >
                  Voltar ao módulo
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default GenericLessonPage;
