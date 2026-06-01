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
  
  // Fallback defensivo para rota literal /:order ou IDs inválidos
  const isLiteralRoute = order === ":order";
  const lessonOrder = parseInt(order || "0", 10);
  const isValidOrder = !isNaN(lessonOrder);
  const lesson = getLessonByOrder(isValidOrder ? lessonOrder : -1);
  const nextLesson = getLessonByOrder(isValidOrder ? lessonOrder + 1 : -1);

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

  if (isLiteralRoute || !isValidOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
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
      completeQuiz(lesson.id);
      completeLesson(lesson.id);
      addXP(25 + score * 10);
      // Auto-complete module if this was the last lesson
      if (!nextLesson && moduleId) {
        completeModule(moduleId);
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
    <div className="flex items-center gap-1">
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
        className="rounded-[2rem] overflow-hidden animate-fade-in mb-6 transition-all duration-500 hover:shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          border: `2px solid #C8A66A40`,
          backdropFilter: "blur(12px)",
          boxShadow: `0 15px 35px rgba(91, 31, 61, 0.04)`,
          animationDelay: delay,
          animationFillMode: "both",
        }}
      >
        {label && (
          <div className="px-8 pt-6 pb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5B1F3D10] border border-[#5B1F3D20]">
              {icon}
            </div>
            <span className="text-[11px] font-heading tracking-[0.3em] uppercase font-black" style={{ color: "#C8A66A" }}>{label}</span>
          </div>
        )}
        <div className="px-8 py-6">
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
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Marfim Suave refined from /app */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
        {/* Subtle atmosphere layers */}
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

      {/* ── Sticky Header — Premium Header style from /app ── */}
      <header
        className="sticky top-0 z-20"
        style={{
          borderBottom: "1.5px solid #C8A66A40",
          background: "rgba(250, 245, 239, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(moduleRoute)}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110 active:scale-95 bg-[#FAF5EF] border border-[#C8A66A30] shadow-sm"
            style={{ color: "#5B1F3D" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-heading tracking-[0.3em] uppercase truncate font-black" style={{ color: "#C8A66A" }}>
              {categoryLabel || moduleName}
            </p>
            <h2 className="font-heading text-base truncate font-black" style={{ color: "#5B1F3D" }}>
              {lesson.title}
            </h2>
          </div>
          <PhaseNav />
        </div>
        {/* Lesson progress bar */}
        <div className="h-1" style={{ background: "#E8DED3" }}>
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${((lessonOrder + 1) / totalLessons) * 100}%`,
              background: "linear-gradient(90deg, #5B1F3D, #C8A66A)",
              boxShadow: "0 0 10px rgba(91, 31, 61, 0.2)"
            }}
          />
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-28 pt-5">
        {/* ── Editorial opening ── */}
        {phase === "lesson" && (
          <>
            {/* Intro card — Premium style */}
            <div
              className="rounded-[2rem] p-8 mb-8 animate-fade-in relative overflow-hidden transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
                backdropFilter: "blur(24px)",
                border: "2.5px solid #C8A66A",
                boxShadow: "0 20px 50px rgba(91, 31, 61, 0.08)"
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <StreakCounter streak={progress.streak} />
                <span className="text-[11px] font-heading tracking-[0.2em] ml-auto uppercase font-black" style={{ color: "#C8A66A" }}>
                  Lição {lessonOrder + 1} de {totalLessons}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#5B1F3D] border border-[#C8A66A40] shadow-lg">
                   <span className="text-2xl filter drop-shadow-sm">{lesson.icon}</span>
                </div>
                <h1 className="font-heading text-2xl md:text-3xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
                  {lesson.title}
                </h1>
              </div>
              <p className="font-accent text-[15px] italic leading-relaxed font-black" style={{ color: "#5B1F3D99" }}>
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
                    className="text-[17px] md:text-[18px] leading-relaxed mb-6 last:mb-0 font-black"
                    style={{ color: "#3D1429" }}
                    dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #5B1F3D">$1</strong>') }}
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
                      <li key={i} className="text-[15px] md:text-[16px] leading-relaxed flex gap-4 items-start font-black" style={{ color: "#3D1429" }}>
                        <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: "#C8A66A" }} />
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
                  className="text-[16px] md:text-[17px] leading-relaxed mb-4 last:mb-0 font-black"
                  style={{ color: "#3D1429" }}
                  dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #5B1F3D">$1</strong>') }}
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
              <p className="text-[17px] md:text-[18px] leading-relaxed font-black" style={{ color: "#3D1429" }}>
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
                <p className="text-[16px] italic leading-relaxed font-black" style={{ color: "#5B1F3D" }}>
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
