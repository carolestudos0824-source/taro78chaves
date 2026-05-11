import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, MapPin, Heart } from "lucide-react";
import { AMOR_LESSONS, getAmorLessonByOrder } from "@/content/lessons/amor";
import { useProgress } from "@/hooks/use-progress";
import { useRole } from "@/hooks/use-role";
import { useResolvedLesson } from "@/hooks/use-resolved-lesson";
// import mysticBg from "@/assets/mystic-bg.jpg";

type Phase = "lesson" | "exercise" | "deepdive" | "quiz" | "complete";

const AmorLessonPage = () => {
  const { order } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, completeModule } = useProgress();
  const { isStaff, loading: roleLoading } = useRole();
  const [phase, setPhase] = useState<Phase>("lesson");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const lessonOrder = parseInt(order || "0", 10);
  const lesson = getAmorLessonByOrder(lessonOrder);
  const nextLesson = getAmorLessonByOrder(lessonOrder + 1);

  // Fase 4B — telemetria invisível: lição via adaptador (DB-first com fallback).
  useResolvedLesson("amor", lesson?.id ?? null);

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

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="text-center space-y-4">
          <p className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>Lição não encontrada</p>
          <button onClick={() => navigate("/module/amor")} className="text-sm font-heading tracking-wider" style={{ color: "hsl(340 42% 35%)" }}>
            Voltar ao módulo
          </button>
        </div>
      </div>
    );
  }

  const phaseSteps: Phase[] = ["lesson", "exercise", ...(lesson.deepDive ? ["deepdive" as Phase] : []), "quiz"];
  const currentIdx = phaseSteps.indexOf(phase);

  const handleStartQuiz = () => {
    if (!isStaff) {
      completeLesson(lesson.id);
      addXP(15);
    }
    setPhase("quiz");
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === lesson.quiz[quizIndex].correctIndex) {
      setScore((s) => s + 1);
      if (!isStaff) addXP(5);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < lesson.quiz.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      if (!isStaff) {
        completeQuiz(`quiz-${lesson.id}`);
        addXP(10);
        if (!nextLesson) completeModule("amor");
      }
      setPhase("complete");
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/amor/${nextLesson.order}`);
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

      <header className="relative z-10 backdrop-blur-md" style={{ background: "hsl(36 33% 97% / 0.85)", borderBottom: "1px solid hsl(340 42% 28% / 0.12)" }}>
        <div className="container max-w-3xl py-3 px-4 flex items-center gap-4">
          <button onClick={() => navigate("/module/amor")} className="transition-colors hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{lesson.icon}</span>
            <span className="font-heading text-sm truncate" style={{ color: "hsl(230 25% 15%)" }}>{lesson.title}</span>
          </div>
          <span className="text-[10px] font-body tracking-wider" style={{ color: "hsl(230 10% 50%)" }}>
            {lessonOrder + 1}/{AMOR_LESSONS.length}
          </span>
          <div className="flex gap-1.5">
            {phaseSteps.map((p, i) => (
              <div key={p} className="h-1.5 w-5 rounded-full transition-all duration-500" style={{ background: i <= currentIdx ? "hsl(340 42% 35%)" : "hsl(340 25% 85% / 0.6)" }} />
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
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(340 35% 30%), hsl(36 45% 44%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {lesson.title}
              </h2>
              <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 25% / 0.60)" }}>{lesson.subtitle}</p>
            </div>

            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(340 42% 28% / 0.10)" }}>
              {lesson.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed mb-4 last:mb-0" style={{ color: "hsl(230 20% 25%)" }}>
                  {renderContent(paragraph)}
                </p>
              ))}
            </div>

            <div className="rounded-xl p-5" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.15)" }}>
              <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(340 42% 26%)" }}>
                ♡ Pontos-chave
              </h3>
              <ul className="space-y-2">
                {lesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "hsl(230 20% 20%)" }}>
                    <span style={{ color: "hsl(340 42% 35%)" }} className="mt-0.5 shrink-0">◆</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Case Study */}
            {lesson.caseStudy && (
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(340 42% 28% / 0.18)" }}>
                <div className="p-4" style={{ background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(36 45% 58% / 0.04))" }}>
                  <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "hsl(340 42% 26%)" }}>
                    📖 Estudo de Caso
                  </h3>
                  <p className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>{lesson.caseStudy.title}</p>
                </div>
                <div className="p-5 space-y-4" style={{ background: "hsl(38 30% 95% / 0.60)" }}>
                  <p className="text-sm italic" style={{ color: "hsl(230 20% 25% / 0.65)" }}>{lesson.caseStudy.context}</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.caseStudy.cards.map((c, ci) => (
                      <span key={ci} className="text-xs font-heading tracking-wide px-3 py-1.5 rounded-lg" style={{
                        background: "hsl(38 30% 95%)", border: "1px solid hsl(340 42% 28% / 0.20)", color: "hsl(230 25% 15%)",
                      }}>
                        <span className="opacity-50">{c.position}:</span> {c.card}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{lesson.caseStudy.analysis}</p>
                  <div className="p-3 rounded-lg" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.10)" }}>
                    <p className="text-xs font-heading tracking-wider uppercase mb-1" style={{ color: "hsl(340 42% 26%)" }}>Lição do caso</p>
                    <p className="text-sm italic" style={{ color: "hsl(230 20% 25% / 0.80)" }}>{lesson.caseStudy.lesson}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Love Combinations */}
            {lesson.loveCombs && lesson.loveCombs.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-center" style={{ color: "hsl(340 42% 26%)" }}>
                  💕 Combinações Amorosas
                </h3>
                {lesson.loveCombs.map((comb, i) => (
                  <div key={i} className="rounded-xl p-4" style={{
                    background: "linear-gradient(145deg, hsl(340 42% 28% / 0.03), hsl(36 45% 58% / 0.03))",
                    border: "1px solid hsl(340 42% 28% / 0.12)",
                  }}>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {comb.cards.map((card, ci) => (
                        <span key={ci} className="text-xs font-heading tracking-wide px-3 py-1.5 rounded-lg" style={{
                          background: "hsl(38 30% 95%)", border: "1px solid hsl(340 42% 28% / 0.18)", color: "hsl(230 25% 15%)",
                        }}>{card}</span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-1" style={{ color: "hsl(230 20% 25% / 0.80)" }}>{comb.meaning}</p>
                    {comb.warning && (
                      <p className="text-xs italic mt-2 px-3 py-2 rounded-lg" style={{
                        background: "hsl(36 45% 58% / 0.06)", border: "1px solid hsl(36 45% 58% / 0.15)", color: "hsl(230 20% 25% / 0.65)",
                      }}>⚠️ {comb.warning}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reflection */}
            {lesson.reflection && (
              <div className="rounded-xl p-5" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.15)" }}>
                <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(340 42% 26%)" }}>✍️ Reflexão</h3>
                <p className="font-accent text-sm italic leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.70)" }}>{lesson.reflection}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => { completeLesson(lesson.id); addXP(15); setPhase("exercise"); }}
                className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 35% 40%))",
                  color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(340 42% 28% / 0.2)",
                }}
              >
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" />Continuar</span>
              </button>
              {lesson.deepDive && (
                <button onClick={() => setPhase("deepdive")} className="text-xs font-heading tracking-wider transition-colors" style={{ color: "hsl(230 10% 45%)" }}>
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
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(340 42% 26%)" }}>✍️ Exercício Prático</span>
              <button onClick={handleStartQuiz} className="text-xs font-heading tracking-wider" style={{ color: "hsl(340 42% 35%)" }}>Pular para Quiz →</button>
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.18)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{
                  background: "hsl(340 42% 28% / 0.08)", border: "1px solid hsl(340 42% 28% / 0.20)", color: "hsl(340 42% 26%)",
                }}>💕</span>
                <span className="text-xs font-heading tracking-wider uppercase" style={{ color: "hsl(340 42% 26%)" }}>
                  {lesson.exercise.type === "writing" ? "Escrita" : lesson.exercise.type === "observation" ? "Observação" : lesson.exercise.type === "practice" ? "Prática" : "Reflexão"}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{lesson.exercise.instruction}</p>
            </div>
            <div className="flex justify-center pt-4">
              <button onClick={handleStartQuiz} className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 35% 40%))", color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(340 42% 28% / 0.2)",
              }}>
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" />Ir ao Quiz</span>
              </button>
            </div>
          </div>
        )}

        {/* DEEP DIVE */}
        {phase === "deepdive" && lesson.deepDive && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(340 42% 26%)" }}>Aprofundamento</span>
              <button onClick={handleStartQuiz} className="text-xs font-heading tracking-wider" style={{ color: "hsl(340 42% 35%)" }}>Ir ao Quiz →</button>
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(340 42% 28% / 0.10)" }}>
              {lesson.deepDive.split("\n\n").map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-4 last:mb-0" style={{ color: "hsl(230 20% 25%)" }}>{renderContent(p)}</p>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <button onClick={handleStartQuiz} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 35% 40%))", color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(340 42% 28% / 0.2)",
              }}>Ir ao Quiz</button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="text-center mb-6">
              <h2 className="font-heading text-xl tracking-wide mb-1" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(340 35% 38%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Quiz de Fixação</h2>
              <p className="text-xs" style={{ color: "hsl(230 10% 45%)" }}>Pergunta {quizIndex + 1} de {lesson.quiz.length}</p>
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(340 42% 28% / 0.10)", boxShadow: "0 4px 20px hsl(340 42% 28% / 0.04)" }}>
              <p className="font-heading text-sm tracking-wide mb-5" style={{ color: "hsl(230 25% 15%)" }}>{lesson.quiz[quizIndex].question}</p>
              <div className="space-y-2.5">
                {lesson.quiz[quizIndex].options.map((opt, i) => {
                  const isCorrect = i === lesson.quiz[quizIndex].correctIndex;
                  const isSelected = selectedAnswer === i;
                  let optStyle: React.CSSProperties = {
                    background: "hsl(36 33% 97% / 0.8)", border: "1px solid hsl(36 25% 82% / 0.5)", color: "hsl(230 20% 20%)",
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
                <div className="mt-4 p-4 rounded-lg" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.12)" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(230 20% 25% / 0.80)" }}>{lesson.quiz[quizIndex].explanation}</p>
                  <button onClick={handleNextQuestion} className="mt-3 px-6 py-2 rounded-full font-heading text-xs tracking-wider transition-all duration-300 hover:scale-105" style={{
                    background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 35% 40%))", color: "hsl(36 33% 97%)",
                  }}>
                    {quizIndex < lesson.quiz.length - 1 ? "Próxima →" : "Concluir Quiz ♡"}
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
              background: "linear-gradient(135deg, hsl(340 42% 28% / 0.12), hsl(340 35% 40% / 0.08))",
              border: "2px solid hsl(340 42% 28% / 0.25)",
            }}>♡</div>
            <h2 className="font-heading text-2xl" style={{
              background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(340 35% 38%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Lição Completa!</h2>
            <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>
              Você acertou <strong>{score}/{lesson.quiz.length}</strong> perguntas.
            </p>
            <div className="flex flex-col items-center gap-4 pt-4">
              {nextLesson && (
                <button onClick={handleNextLesson} className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-3" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 35% 40%))",
                  color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(340 42% 28% / 0.2)",
                }}>
                  <span className="flex flex-col items-start">
                    <span className="text-[9px] tracking-[0.3em] uppercase opacity-75">Próxima Lição</span>
                    <span className="flex items-center gap-2">{nextLesson.title}<ArrowRight className="w-4 h-4" /></span>
                  </span>
                </button>
              )}
              <button onClick={() => navigate("/module/amor")} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2" style={{
                background: "transparent", border: "1.5px solid hsl(340 42% 28% / 0.30)", color: "hsl(340 42% 30%)",
              }}>
                <MapPin className="w-4 h-4" />Voltar ao Módulo
              </button>
              {!nextLesson && (
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid hsl(340 42% 28% / 0.12)" }}>
                  <div className="text-2xl mb-3">🎉</div>
                  <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
                    Amor e Relacionamentos Completo!
                  </h3>
                  <p className="font-accent text-sm italic max-w-sm mx-auto mb-4" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                    Agora você sabe ler o coração com profundidade, honestidade e responsabilidade.
                  </p>
                  <button onClick={() => navigate("/app")} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{
                    background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 35% 40%))",
                    color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(340 42% 28% / 0.15)",
                  }}>Voltar aos Módulos →</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AmorLessonPage;
