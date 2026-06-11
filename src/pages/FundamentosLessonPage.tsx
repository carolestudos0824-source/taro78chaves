import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { PageBackControls } from "@/components/PageBackControls";

import { FUNDAMENTOS_LESSONS, getFundamentosLessonByOrder } from "@/content/lessons/fundamentos";
import { useProgress } from "@/hooks/use-progress";
import { useRole } from "@/hooks/use-role";
import { useResolvedQuiz } from "@/hooks/use-resolved-quiz";
import { useResolvedLesson } from "@/hooks/use-resolved-lesson";

/** Fase 4A — piloto restrito a 3 lições reais de Fundamentos. */
const FASE_4A_PILOT_LESSONS = new Set(["fund-1", "fund-2", "fund-3"]);

type Phase = "lesson" | "exercise" | "deepdive" | "quiz" | "complete";

const FundamentosLessonPage = () => {
  const { order } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, completeModule } = useProgress();
  const { isStaff, loading: roleLoading } = useRole();
  const [phase, setPhase] = useState<Phase>("lesson");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  // Fallback defensivo para rota literal /fundamentos/:order ou IDs inválidos
  const isLiteralRoute = order === ":order";
  const lessonOrder = parseInt(order || "0", 10);
  const isValidOrder = !isNaN(lessonOrder);
  const lesson = getFundamentosLessonByOrder(isValidOrder ? lessonOrder : -1);
  const nextLesson = getFundamentosLessonByOrder(isValidOrder ? lessonOrder + 1 : -1);

  // Redirecionamento defensivo se a rota for literal ou inválida
  useEffect(() => {
    if (isLiteralRoute) {
      navigate("/module/fundamentos", { replace: true });
    }
  }, [isLiteralRoute, navigate]);

  // Phase 1: quiz vem do content-adapter (DB → fallback legado).

  const resolvedQuiz = useResolvedQuiz({
    params: lesson
      ? { linkedTo: `lesson:${lesson.id}`, moduleSlug: "fundamentos", lessonSlug: lesson.id }
      : null,
    legacyQuiz: lesson?.quiz?.map((q) => ({
      id: q.id,
      question: q.question,
      type: "multiple-choice" as const,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })) ?? null,
  });

  // Fase 4A — telemetria invisível: lição via adaptador (DB-first), restrito
  // ao piloto fund-1/2/3. Demais lições não disparam query (slug = null).
  const isPilotLesson = lesson ? FASE_4A_PILOT_LESSONS.has(lesson.id) : false;
  useResolvedLesson(
    isPilotLesson ? "fundamentos" : null,
    isPilotLesson && lesson ? lesson.id : null,
  );

  if (import.meta.env.DEV && lesson && resolvedQuiz.sourceUsed) {
    // eslint-disable-next-line no-console
    console.info(
      `[content-adapter] quiz lesson=${lesson.id} source=${resolvedQuiz.sourceUsed} fallback=${resolvedQuiz.usedFallback}`,
    );
  }

  const quizQuestions = resolvedQuiz.questions ?? lesson?.quiz ?? [];

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
            onClick={() => navigate("/module/fundamentos")} 
            className="w-full py-3.5 px-6 rounded-full font-heading text-[12px] tracking-[0.2em] uppercase transition-all shadow-md hover:scale-105 active:scale-95"
            style={{ background: "#C8A66A", color: "#5B1F3D" }}
          >
            Voltar ao módulo
          </button>
        </div>
      </div>
    );
  }

  const phaseSteps: Phase[] = ["lesson", "exercise", ...(lesson.deepDive ? ["deepdive" as Phase] : []), "quiz"];
  const currentIdx = phaseSteps.indexOf(phase);

  const handleStartQuiz = () => {
    // PROGRESS REMOVAL: Lesson completion moved to the end of the quiz
    setPhase("quiz");
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quizQuestions[quizIndex].correctIndex) {
      setScore((s) => s + 1);
      addXP(5);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeQuiz(`quiz-${lesson.id}`);
      completeLesson(lesson.id);
      addXP(15 + 10); // lesson (15) + quiz completion (10)
      if (lesson.id === "fund-10") completeModule("fundamentos");
      setPhase("complete");
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/fundamentos/${nextLesson.order}`);
      setPhase("lesson");
      setQuizIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      window.scrollTo(0, 0);
    }
  };

  // Convert markdown-ish bold to JSX
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "#5B1F3D" }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)", opacity: 0.98 }} />
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0" style={{
        borderBottom: "1.5px solid #C8A66A40",
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
      }}>
        <div className="container max-w-3xl py-4 px-6 flex items-center gap-4">
          <PageBackControls variant="top" showLabel={false} className="w-10 h-10 flex items-center justify-center bg-[#FAF5EF] rounded-full border border-[#C8A66A30]" fallbackRoute="/module/fundamentos" />

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] tracking-[0.4em] uppercase font-heading mb-1 flex items-center gap-2 font-black" style={{ color: "#C8A66A" }}>
              <MapPin className="w-3 h-3" /> {lessonOrder + 1}/{FUNDAMENTOS_LESSONS.length}
            </span>
            <h2 className="font-heading text-base truncate font-black" style={{ color: "#5B1F3D" }}>
              {lesson.title}
            </h2>
          </div>
          <div className="flex gap-1">
            {phaseSteps.map((p, i) => (
              <div key={p} className="h-1.5 w-4 rounded-full transition-all duration-500" style={{ background: i <= currentIdx ? "#C8A66A" : "rgba(200, 166, 106, 0.2)" }} />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-4 py-8">
        {/* LESSON */}
        {phase === "lesson" && (
          <div className="space-y-8" style={{ animation: "fade-up 0.5s ease-out" }}>
            {/* Title */}
            <div className="text-center space-y-2">
              <span className="text-3xl">{lesson.icon}</span>
              <h2 className="font-heading text-3xl md:text-4xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
                {lesson.title}
              </h2>
              <p className="font-accent text-lg md:text-xl italic font-black" style={{ color: "#8B6A30" }}>
                {lesson.subtitle}
              </p>
            </div>

            {/* Content */}
            <div className="rounded-[2rem] p-8 md:p-10" style={{
              background: "rgba(255, 255, 255, 0.98)",
              border: "2.5px solid #C8A66A40",
              boxShadow: "0 20px 50px rgba(91, 31, 61, 0.05)"
            }}>
              {lesson.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-[17px] md:text-[18px] leading-relaxed mb-6 last:mb-0 font-black" style={{ color: "#3D1429" }}>
                  {renderContent(paragraph)}
                </p>
              ))}
            </div>

            {/* Key points */}
            <div className="rounded-xl p-5" style={{ background: "hsl(36 45% 58% / 0.06)", border: "1px solid hsl(36 45% 58% / 0.18)" }}>
              <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(36 40% 42%)" }}>
                ✦ Pontos-chave
              </h3>
              <ul className="space-y-2">
                {lesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-[15px] md:text-[16px] font-black leading-relaxed" style={{ color: "#3D1429" }}>
                    <span style={{ color: "#C8A66A" }} className="mt-1.5 shrink-0 w-2 h-2 rounded-full" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reflection */}
            {lesson.reflection && (
              <div className="rounded-xl p-5" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.15)" }}>
                <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(340 42% 26%)" }}>
                  ✍️ Reflexão
                </h3>
                <p className="font-accent text-[17px] md:text-[19px] italic leading-relaxed font-black" style={{ color: "#3D1429" }}>
                  {lesson.reflection}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => { setPhase("exercise"); }}
                className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Continuar
                </span>
              </button>
              {lesson.deepDive && (
                <button
                  onClick={() => setPhase("deepdive")}
                  className="text-xs font-heading tracking-wider transition-colors"
                  style={{ color: "hsl(230 10% 45%)" }}
                >
                  🔮 Aprofundar (opcional)
                </button>
              )}
              <PageBackControls variant="bottom" className="mt-8" fallbackRoute="/module/fundamentos" />
            </div>
          </div>

        )}

        {/* EXERCISE */}
        {phase === "exercise" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
                ✍️ Exercício
              </span>
            </div>

            <div className="rounded-xl p-6" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.18)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{
                  background: "hsl(340 42% 28% / 0.08)",
                  border: "1px solid hsl(340 42% 28% / 0.20)",
                  color: "hsl(340 42% 26%)",
                }}>
                  {lesson.exercise.type === "writing" ? "✏️" : lesson.exercise.type === "observation" ? "👁️" : lesson.exercise.type === "practice" ? "🎴" : "💭"}
                </span>
                <span className="text-xs font-heading tracking-wider uppercase" style={{ color: "hsl(340 42% 26%)" }}>
                  {lesson.exercise.type === "writing" ? "Escrita" : lesson.exercise.type === "observation" ? "Observação" : lesson.exercise.type === "practice" ? "Prática" : "Reflexão"}
                </span>
              </div>
              <p className="text-[17px] md:text-[18px] leading-relaxed font-black" style={{ color: "#3D1429" }}>
                {lesson.exercise.instruction}
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleStartQuiz}
                className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Ir ao Quiz
                </span>
              </button>
            </div>
          </div>
        )}

        {/* DEEP DIVE */}
        {phase === "deepdive" && lesson.deepDive && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>Aprofundamento</span>
              
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
              {lesson.deepDive.split("\n\n").map((p, i) => (
                <p key={i} className="text-[17px] md:text-[18px] leading-relaxed mb-6 last:mb-0 font-black" style={{ color: "#3D1429" }}>
                  {renderContent(p)}
                </p>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <button onClick={handleStartQuiz} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)" }}>
                Ir ao Quiz
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="text-center mb-6">
              <h2 className="font-heading text-xl tracking-wide mb-1" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 45% 44%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Quiz de Fixação
              </h2>
              <p className="text-xs" style={{ color: "hsl(230 10% 45%)" }}>
                Pergunta {quizIndex + 1} de {quizQuestions.length}
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.06)" }}>
              <p className="font-heading text-sm tracking-wide mb-5" style={{ color: "hsl(230 25% 15%)" }}>
                {quizQuestions[quizIndex].question}
              </p>
              <div className="space-y-2.5">
                {quizQuestions[quizIndex].options.map((opt, i) => {
                  const isCorrect = i === quizQuestions[quizIndex].correctIndex;
                  const isSelected = selectedAnswer === i;
                  let optStyle: React.CSSProperties = {
                    background: "hsl(36 33% 97% / 0.8)",
                    border: "1px solid hsl(36 25% 82% / 0.5)",
                    color: "hsl(230 20% 20%)",
                  };
                  if (showExplanation && isCorrect) {
                    optStyle = {
                      background: "hsl(130 40% 50% / 0.08)",
                      border: "1.5px solid hsl(130 40% 40% / 0.4)",
                      color: "hsl(130 40% 25%)",
                    };
                  } else if (showExplanation && isSelected && !isCorrect) {
                    optStyle = {
                      background: "hsl(0 50% 50% / 0.06)",
                      border: "1.5px solid hsl(0 50% 45% / 0.35)",
                      color: "hsl(0 40% 30%)",
                    };
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200"
                      style={optStyle}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: "hsl(36 45% 58% / 0.06)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.80)" }}>
                    {quizQuestions[quizIndex].explanation}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="mt-3 px-6 py-2 rounded-full font-heading text-xs tracking-wider transition-all duration-300 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                      color: "hsl(36 33% 97%)",
                    }}
                  >
                    {quizIndex < quizQuestions.length - 1 ? "Próxima →" : "Concluir Quiz ✦"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <div className="text-center py-12 space-y-8" style={{ animation: "fade-up 0.6s ease-out" }}>
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{
              background: "linear-gradient(135deg, hsl(36 45% 58% / 0.15), hsl(42 70% 80% / 0.1))",
              border: "2px solid hsl(36 45% 58% / 0.3)",
            }}>
              ✦
            </div>
            <h2 className="font-heading text-2xl" style={{
              background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 45% 44%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Lição Completa!
            </h2>
            <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>
              Você acertou <strong>{score}/{quizQuestions.length}</strong> perguntas.
            </p>

            <div className="flex flex-col items-center gap-4 pt-4">
              {nextLesson && (
                <button
                  onClick={handleNextLesson}
                  className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-3"
                  style={{
                    background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                    color: "hsl(36 33% 97%)",
                    boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                  }}
                >
                  <span className="flex flex-col items-start">
                    <span className="text-[9px] tracking-[0.3em] uppercase opacity-75">Próxima Lição</span>
                    <span className="flex items-center gap-2">
                      {nextLesson.title}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </span>
                </button>
              )}

              <button
                onClick={() => navigate("/module/fundamentos")}
                className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{ background: "transparent", border: "1.5px solid hsl(36 45% 58% / 0.35)", color: "hsl(36 40% 42%)" }}
              >
                <MapPin className="w-4 h-4" />
                Voltar ao Módulo
              </button>

              {!nextLesson && (
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid hsl(36 45% 58% / 0.15)" }}>
                  <div className="text-2xl mb-3">🎉</div>
                  <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
                    Módulo Fundamentos Completo!
                  </h3>
                  <p className="font-accent text-sm italic max-w-sm mx-auto mb-4" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                    Você construiu a base. Agora está preparada para a Jornada dos 22 Arcanos Maiores.
                  </p>
                  <button
                    onClick={() => navigate("/module/arcanos-maiores")}
                    className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                      color: "#FAF5EF",
                      boxShadow: "0 4px 20px rgba(91, 31, 61, 0.2)",
                    }}
                  >
                    Começar Arcanos Maiores →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FundamentosLessonPage;
