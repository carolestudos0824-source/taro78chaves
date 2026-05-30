import { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { COMBINACOES_LESSONS, getCombinacoesLessonByOrder } from "@/content/lessons/combinacoes";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedLesson } from "@/hooks/use-resolved-lesson";

type Phase = "lesson" | "exercise" | "deepdive" | "quiz" | "complete";

const CombinacoesLessonPage = () => {
  const { order } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, completeModule, progress } = useProgress();
  const { bypassLocks, loading: accessLoading } = useAccess();
  const [phase, setPhase] = useState<Phase>("lesson");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  
  // Fallback defensivo para rota literal /combinacoes/:order ou IDs inválidos
  const isLiteralRoute = order === ":order";
  const lessonOrder = parseInt(order || "0", 10);
  const isValidOrder = !isNaN(lessonOrder);
  const lesson = getCombinacoesLessonByOrder(isValidOrder ? lessonOrder : -1);
  const nextLesson = getCombinacoesLessonByOrder(isValidOrder ? lessonOrder + 1 : -1);

  // Redirecionamento defensivo se a rota for literal
  useEffect(() => {
    if (isLiteralRoute) {
      navigate("/module/combinacoes", { replace: true });
    }
  }, [isLiteralRoute, navigate]);

  // Fase 4B — telemetria invisível: lição via adaptador (DB-first com fallback).
  useResolvedLesson("combinacoes", lesson?.id ?? null);

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
            <span className="text-2xl">🎴</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-xl" style={{ color: "#5B1F3D" }}>Lição não encontrada</h2>
            <p className="font-body text-sm text-[#5B1F3D]/60 italic leading-relaxed">
              "As cartas se combinam apenas para quem sabe ler o silêncio entre elas."
            </p>
          </div>
          <button 
            onClick={() => navigate("/module/combinacoes")} 
            className="w-full py-3.5 px-6 rounded-full font-heading text-[12px] tracking-[0.2em] uppercase transition-all shadow-md hover:scale-105 active:scale-95"
            style={{ background: "#C8A66A", color: "#5B1F3D" }}
          >
            Voltar ao módulo
          </button>
        </div>
      </div>
    );
  }

  // Guarda de acesso consistente com /module/combinacoes:
  // admin/premium passam direto; usuário comum precisa ter completado a lição anterior.
  if (!accessLoading && !bypassLocks) {
    if (lessonOrder > 0) {
      const prev = COMBINACOES_LESSONS.find((l) => l.order === lessonOrder - 1);
      const prevCompleted = prev ? progress.completedLessons.includes(prev.id) : false;
      if (!prevCompleted) {
        return <Navigate to="/module/combinacoes" replace />;
      }
    }
  }

  const phaseSteps: Phase[] = ["lesson", "exercise", ...(lesson.deepDive ? ["deepdive" as Phase] : []), "quiz"];
  const currentIdx = phaseSteps.indexOf(phase);

  const handleStartQuiz = () => {
    completeLesson(lesson.id);
    addXP(15);
    setPhase("quiz");
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === lesson.quiz[quizIndex].correctIndex) {
      setScore((s) => s + 1);
      addXP(5);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < lesson.quiz.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeQuiz(`quiz-${lesson.id}`);
      addXP(10);
      if (!nextLesson) completeModule("combinacoes");
      setPhase("complete");
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/combinacoes/${nextLesson.order}`);
      setPhase("lesson");
      setQuizIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      window.scrollTo(0, 0);
    }
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "hsl(340 42% 22%)" }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.88), hsl(36 33% 97% / 0.82), hsl(36 33% 97% / 0.92))" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md" style={{ background: "hsl(36 33% 97% / 0.85)", borderBottom: "1px solid hsl(36 45% 58% / 0.15)" }}>
        <div className="container max-w-3xl py-3 px-4 flex items-center gap-4">
          <button onClick={() => navigate("/module/combinacoes")} className="transition-colors hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{lesson.icon}</span>
            <span className="font-heading text-sm truncate" style={{ color: "hsl(230 25% 15%)" }}>{lesson.title}</span>
          </div>
          <span className="text-[10px] font-body tracking-wider" style={{ color: "hsl(230 10% 50%)" }}>
            {lessonOrder + 1}/{COMBINACOES_LESSONS.length}
          </span>
          <div className="flex gap-1.5">
            {phaseSteps.map((p, i) => (
              <div key={p} className="h-1.5 w-5 rounded-full transition-all duration-500" style={{ background: i <= currentIdx ? "hsl(36 45% 58%)" : "hsl(36 25% 82% / 0.6)" }} />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-4 py-8">
        {/* LESSON */}
        {phase === "lesson" && (
          <div className="space-y-8" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="text-center space-y-2">
              <span className="text-3xl">{lesson.icon}</span>
              <h2 className="font-heading text-2xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 35% 28%), hsl(36 45% 44%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {lesson.title}
              </h2>
              <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 25% / 0.60)" }}>{lesson.subtitle}</p>
            </div>

            {/* Content */}
            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
              {lesson.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed mb-4 last:mb-0" style={{ color: "hsl(230 20% 25%)" }}>
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
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "hsl(230 20% 20%)" }}>
                    <span style={{ color: "hsl(36 42% 44%)" }} className="mt-0.5 shrink-0">◆</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples */}
            {lesson.examples && lesson.examples.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-center" style={{ color: "hsl(340 42% 26%)" }}>
                  🎴 Exemplos Visuais
                </h3>
                {lesson.examples.map((ex, i) => (
                  <div key={i} className="rounded-xl p-5" style={{
                    background: "linear-gradient(145deg, hsl(340 42% 28% / 0.04), hsl(36 45% 58% / 0.04))",
                    border: "1px solid hsl(340 42% 28% / 0.15)",
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full" style={{
                        background: "hsl(36 45% 58% / 0.10)",
                        border: "1px solid hsl(36 45% 58% / 0.20)",
                        color: "hsl(36 40% 38%)",
                      }}>
                        {ex.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {ex.cards.map((card, ci) => (
                        <span key={ci} className="text-xs font-heading tracking-wide px-3 py-1.5 rounded-lg" style={{
                          background: "hsl(38 30% 95%)",
                          border: "1px solid hsl(36 45% 58% / 0.25)",
                          color: "hsl(230 25% 15%)",
                        }}>
                          {card}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs mb-1" style={{ color: "hsl(230 20% 25% / 0.55)" }}>{ex.description}</p>
                    <p className="text-sm leading-relaxed font-accent italic" style={{ color: "hsl(230 20% 25% / 0.80)" }}>
                      {ex.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reflection */}
            {lesson.reflection && (
              <div className="rounded-xl p-5" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.15)" }}>
                <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(340 42% 26%)" }}>
                  ✍️ Reflexão
                </h3>
                <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.70)" }}>
                  {lesson.reflection}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => { completeLesson(lesson.id); addXP(15); setPhase("exercise"); }}
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
            </div>
          </div>
        )}

        {/* EXERCISE */}
        {phase === "exercise" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>✍️ Exercício Prático</span>
              <button onClick={handleStartQuiz} className="text-xs font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>
                Pular para Quiz →
              </button>
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.18)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{
                  background: "hsl(340 42% 28% / 0.08)",
                  border: "1px solid hsl(340 42% 28% / 0.20)",
                  color: "hsl(340 42% 26%)",
                }}>
                  🎴
                </span>
                <span className="text-xs font-heading tracking-wider uppercase" style={{ color: "hsl(340 42% 26%)" }}>
                  {lesson.exercise.type === "writing" ? "Escrita" : lesson.exercise.type === "observation" ? "Observação" : lesson.exercise.type === "practice" ? "Prática" : "Reflexão"}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>
                {lesson.exercise.instruction}
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <button onClick={handleStartQuiz} className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{
                background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                color: "hsl(36 33% 97%)",
                boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
              }}>
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
              <button onClick={handleStartQuiz} className="text-xs font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>Ir ao Quiz →</button>
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
              {lesson.deepDive.split("\n\n").map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-4 last:mb-0" style={{ color: "hsl(230 20% 25%)" }}>
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
                Pergunta {quizIndex + 1} de {lesson.quiz.length}
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.06)" }}>
              <p className="font-heading text-sm tracking-wide mb-5" style={{ color: "hsl(230 25% 15%)" }}>
                {lesson.quiz[quizIndex].question}
              </p>
              <div className="space-y-2.5">
                {lesson.quiz[quizIndex].options.map((opt, i) => {
                  const isCorrect = i === lesson.quiz[quizIndex].correctIndex;
                  const isSelected = selectedAnswer === i;
                  let optStyle: React.CSSProperties = {
                    background: "hsl(36 33% 97% / 0.8)",
                    border: "1px solid hsl(36 25% 82% / 0.5)",
                    color: "hsl(230 20% 20%)",
                  };
                  if (showExplanation && isCorrect) {
                    optStyle = { background: "hsl(130 40% 50% / 0.08)", border: "1.5px solid hsl(130 40% 40% / 0.4)", color: "hsl(130 40% 25%)" };
                  } else if (showExplanation && isSelected && !isCorrect) {
                    optStyle = { background: "hsl(0 50% 50% / 0.06)", border: "1.5px solid hsl(0 50% 45% / 0.35)", color: "hsl(0 40% 30%)" };
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200" style={optStyle}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showExplanation && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: "hsl(36 45% 58% / 0.06)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.80)" }}>
                    {lesson.quiz[quizIndex].explanation}
                  </p>
                  <button onClick={handleNextQuestion} className="mt-3 px-6 py-2 rounded-full font-heading text-xs tracking-wider transition-all duration-300 hover:scale-105" style={{
                    background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)",
                  }}>
                    {quizIndex < lesson.quiz.length - 1 ? "Próxima →" : "Concluir Quiz ✦"}
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
              Você acertou <strong>{score}/{lesson.quiz.length}</strong> perguntas.
            </p>
            <div className="flex flex-col items-center gap-4 pt-4">
              {nextLesson && (
                <button onClick={handleNextLesson} className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-3" style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}>
                  <span className="flex flex-col items-start">
                    <span className="text-[9px] tracking-[0.3em] uppercase opacity-75">Próxima Lição</span>
                    <span className="flex items-center gap-2">
                      {nextLesson.title}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </span>
                </button>
              )}
              <button onClick={() => navigate("/module/combinacoes")} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2" style={{
                background: "transparent", border: "1.5px solid hsl(36 45% 58% / 0.35)", color: "hsl(36 40% 42%)",
              }}>
                <MapPin className="w-4 h-4" />
                Voltar ao Módulo
              </button>
              {!nextLesson && (
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid hsl(36 45% 58% / 0.15)" }}>
                  <div className="text-2xl mb-3">🎉</div>
                  <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
                    Módulo Combinações Completo!
                  </h3>
                  <p className="font-accent text-sm italic max-w-sm mx-auto mb-4" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                    Você dominou a arte de ler cartas em conjunto. Agora está preparada para aprender as tiragens clássicas.
                  </p>
                  <button onClick={() => navigate("/app")} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{
                    background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                    color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(340 42% 28% / 0.15)",
                  }}>
                    Voltar aos Módulos →
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

export default CombinacoesLessonPage;
