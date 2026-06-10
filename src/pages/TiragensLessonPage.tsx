import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { PageBackControls } from "@/components/PageBackControls";

import { TIRAGENS_LESSONS, getTiragensLessonByOrder } from "@/content/lessons/tiragens";
import { useProgress } from "@/hooks/use-progress";
import { useResolvedLesson } from "@/hooks/use-resolved-lesson";

type Phase = "lesson" | "exercise" | "deepdive" | "quiz" | "complete";

const TiragensLessonPage = () => {
  const { order } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, completeModule } = useProgress();
  const [phase, setPhase] = useState<Phase>("lesson");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  
  // Fallback defensivo para rota literal /tiragens/:order ou IDs inválidos
  const isLiteralRoute = order === ":order";
  const lessonOrder = parseInt(order || "0", 10);
  const isValidOrder = !isNaN(lessonOrder);
  const lesson = getTiragensLessonByOrder(isValidOrder ? lessonOrder : -1);
  const nextLesson = getTiragensLessonByOrder(isValidOrder ? lessonOrder + 1 : -1);

  // Redirecionamento defensivo se a rota for literal
  useEffect(() => {
    if (isLiteralRoute) {
      navigate("/module/tiragens", { replace: true });
    }
  }, [isLiteralRoute, navigate]);

  // Fase 4B — telemetria invisível: lição via adaptador (DB-first com fallback).
  useResolvedLesson("tiragens", lesson?.id ?? null);

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
            <span className="text-2xl">◎</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-xl" style={{ color: "#5B1F3D" }}>Lição não encontrada</h2>
            <p className="font-body text-sm text-[#5B1F3D]/60 italic leading-relaxed">
              "A estrutura se revela apenas para quem sabe contemplar o todo."
            </p>
          </div>
          <button 
            onClick={() => navigate("/module/tiragens")} 
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
      if (!nextLesson) completeModule("tiragens");
      setPhase("complete");
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/tiragens/${nextLesson.order}`);
      setPhase("lesson");
      setQuizIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      window.scrollTo(0, 0);
    }
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.trim() === "") return <div key={i} className="h-4" />;
      
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} className="font-heading text-xl font-bold mt-12 mb-6 tracking-tight" style={{ color: "#5B1F3D" }}>
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-4 mb-5 pl-2 items-start">
            <span className="text-[#C8A66A] mt-2.5 shrink-0 w-2.5 h-2.5 rounded-full" style={{ background: "#C8A66A" }} />
            <span className="text-[17px] md:text-[18px] leading-[1.7] font-medium text-[#2D2D2D]">
              {renderInlineBold(line.replace("- ", ""))}
            </span>
          </div>
        );
      }
      return (
        <p key={i} className="text-[17px] md:text-[18px] leading-[1.7] mb-8 last:mb-0 font-medium text-[#2D2D2D]">
          {renderInlineBold(line)}
        </p>
      );
    });
  };

  const renderInlineBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-[#5B1F3D]">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.88), hsl(36 33% 97% / 0.82), hsl(36 33% 97% / 0.92))" }} />
      </div>

      <header className="relative z-10 backdrop-blur-md" style={{ background: "hsl(36 33% 97% / 0.85)", borderBottom: "1px solid hsl(36 45% 58% / 0.15)" }}>
        <div className="container max-w-4xl py-4 px-6 flex items-center gap-6">
          <PageBackControls variant="top" showLabel={false} className="w-5 h-5" fallbackRoute="/module/tiragens" />

          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{lesson.icon}</span>
            <span className="font-heading text-base font-bold truncate" style={{ color: "hsl(230 25% 15%)" }}>{lesson.title}</span>
          </div>
          <span className="text-[10px] font-body tracking-wider" style={{ color: "hsl(230 10% 50%)" }}>
            {lessonOrder + 1}/{TIRAGENS_LESSONS.length}
          </span>
          <div className="flex gap-1.5">
            {phaseSteps.map((p, i) => (
              <div key={p} className="h-1.5 w-5 rounded-full transition-all duration-500" style={{ background: i <= currentIdx ? "hsl(36 45% 58%)" : "hsl(36 25% 82% / 0.6)" }} />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-4xl px-6 py-12 pb-40">
        {/* LESSON */}
        {phase === "lesson" && (
          <div className="space-y-12" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="text-center space-y-2">
              <span className="text-4xl">{lesson.icon}</span>
              <h2 className="font-heading text-4xl tracking-tight font-bold" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 35% 28%), hsl(36 45% 44%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {lesson.title}
              </h2>
              <p className="font-accent text-xl italic font-semibold text-[#5B1F3D] mt-2">{lesson.subtitle}</p>
            </div>

            <div className="rounded-[2rem] p-8 md:p-10" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              {renderContent(lesson.content)}
            </div>

            {/* When to Use */}
            {lesson.whenToUse && (
              <div className="rounded-[2rem] p-8" style={{ background: "rgba(200, 166, 106, 0.05)", border: "1px solid rgba(200, 166, 106, 0.2)" }}>
                <h3 className="font-heading text-sm tracking-[0.15em] uppercase mb-8 font-bold flex items-center gap-2" style={{ color: "#5B1F3D" }}>
                  <Sparkles className="w-5 h-5 text-[#C8A66A]" /> Quando Usar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.whenToUse.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border-2 border-[#C8A66A]/20 shadow-md">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C8A66A]" />
                      <span className="text-[15px] md:text-base font-semibold text-[#5B1F3D] leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Blocks (Mini Cards) */}
            {lesson.infoBlocks && (
              <div className="space-y-6">
                <h3 className="font-heading text-sm tracking-[0.15em] uppercase px-1 font-bold text-[#5B1F3D]">Formatos e Estruturas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lesson.infoBlocks.map((block, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border-2 border-[#C8A66A]/20 shadow-lg transition-all hover:shadow-xl group">
                      <h4 className="font-heading text-lg font-bold text-[#5B1F3D] mb-4 flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#C8A66A] rounded-full group-hover:h-8 transition-all duration-300" />
                        {block.title}
                      </h4>
                      <p className="text-[16px] font-body text-[#5B1F3D] leading-relaxed italic font-medium">
                        {block.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[2rem] p-8" style={{ background: "hsl(36 45% 58% / 0.06)", border: "1px solid hsl(36 45% 58% / 0.18)" }}>
              <h3 className="font-heading text-sm tracking-[0.15em] uppercase mb-6 font-bold" style={{ color: "hsl(36 40% 42%)" }}>
                ✦ Pontos-chave de Estudo
              </h3>
              <ul className="space-y-5">
                {lesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg font-medium text-[#2D2D2D]">
                    <span className="text-[#5B1F3D] mt-1.5 shrink-0 font-bold text-sm">◆</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Layout Diagram */}
            {lesson.layoutDiagram && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <MapPin className="w-5 h-5 text-[#C8A66A]" />
                   <span className="text-sm font-heading font-bold tracking-[0.15em] uppercase text-[#5B1F3D]">Mapa Visual da Tiragem</span>
                </div>
                
                <div className="rounded-[2rem] bg-white border-2 border-[#C8A66A]/20 shadow-xl overflow-hidden">
                  <div className="p-10 bg-[#FAF5EF]/50">
                    <h3 className="font-heading text-xl font-bold text-center mb-12 text-[#5B1F3D]">
                      {lesson.layoutDiagram.name}
                    </h3>
                    
                    {/* The Visual Grid/Map */}
                    <div className="relative aspect-[4/5] min-h-[480px] md:min-h-[550px] max-w-[440px] mx-auto bg-white/60 rounded-[2.5rem] border-2 border-[#C8A66A]/20 shadow-inner p-10 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {lesson.layoutDiagram.positions.map((pos, i) => (
                          <div 
                            key={i} 
                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 w-24 md:w-28 text-center"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                          >
                            {/* Card Placeholder Visual */}
                            <div className="w-16 h-22 md:w-20 md:h-28 mx-auto rounded-xl border-[2.5px] border-[#C8A66A] bg-white shadow-[0_15px_35px_-5px_rgba(91,31,61,0.25)] flex items-center justify-center relative group-hover:scale-110 transition-all duration-500 overflow-hidden ring-4 ring-[#C8A66A]/10">
                               <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,_#5B1F3D,_transparent)]" />
                               <div className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 border border-[#C8A66A]/20 rounded-lg pointer-events-none" />
                               <span className="font-heading text-3xl md:text-4xl font-bold text-[#5B1F3D] drop-shadow-md z-10">{i + 1}</span>
                            </div>
                            <div className="mt-4">
                               <span className="text-[12px] md:text-[14px] font-heading font-bold uppercase tracking-[0.02em] text-[#5B1F3D] leading-tight block w-full px-1">
                                 {pos.label}
                               </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white space-y-3">
                    <div className="flex flex-col items-center gap-2 mb-6 px-4">
                       <span className="text-sm font-heading font-bold tracking-[0.2em] uppercase text-[#5B1F3D]">Legenda das Posições</span>
                       <span className="text-[13px] font-body font-semibold uppercase tracking-[0.2em] text-[#5B1F3D]/80 text-center">Siga a ordem numérica para a leitura estruturada</span>
                       <div className="h-0.5 w-16 bg-[#C8A66A]/30 mt-2" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {lesson.layoutDiagram.positions.map((pos, i) => (
                        <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-[#FAF5EF]/40 border border-[#C8A66A]/15 transition-all hover:bg-[#FAF5EF]/70 shadow-sm">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-heading font-bold shadow-md" style={{
                            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                            border: "1.5px solid #C8A66A50",
                            color: "#FAF5EF",
                          }}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-heading text-lg font-bold text-[#5B1F3D] block mb-2">{pos.label}</span>
                            <p className="text-[16px] md:text-[17px] font-body font-medium italic text-[#5B1F3D] leading-[1.6]">{pos.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Examples */}
            {lesson.examples && lesson.examples.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading text-sm tracking-[0.15em] uppercase text-center font-bold" style={{ color: "hsl(340 42% 26%)" }}>
                  🎴 Estudo de Caso: Exemplo Prático
                </h3>
                {lesson.examples.map((ex, i) => (
                  <div key={i} className="rounded-[2rem] p-6 md:p-8 space-y-6" style={{
                    background: "white",
                    border: "2px solid #C8A66A30",
                    boxShadow: "0 20px 40px rgba(91,31,61,0.05)"
                  }}>
                    <div className="flex flex-col items-center gap-1 border-b border-[#C8A66A]/10 pb-4">
                      <p className="text-[13px] font-heading tracking-[0.2em] uppercase font-bold text-[#C8A66A] mb-1">
                        {ex.spread}
                      </p>
                      <p className="text-2xl font-accent italic font-semibold text-center text-[#5B1F3D] leading-tight px-4">
                        "{ex.question}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[13px] font-heading tracking-[0.15em] uppercase font-bold text-[#5B1F3D] mb-4">Cartas Sorteadas</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ex.cards.map((c, ci) => (
                          <div key={ci} className="bg-[#FAF5EF] border-2 border-[#C8A66A]/30 px-5 py-3.5 rounded-2xl flex items-center gap-4 shadow-md">
                            <span className="w-8 h-8 rounded-full bg-[#5B1F3D] flex items-center justify-center text-[13px] font-heading font-bold text-[#C8A66A] shrink-0 shadow-sm">{ci + 1}</span>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-heading font-bold uppercase tracking-[0.1em] text-[#5B1F3D] truncate mb-0.5">{c.position}</span>
                              <span className="text-[16px] md:text-[17px] font-semibold text-[#5B1F3D] truncate">{c.card}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 bg-[#FAF5EF]/30 p-5 rounded-2xl border border-[#C8A66A]/10">
                      <p className="text-[13px] font-heading tracking-[0.15em] uppercase font-bold text-[#5B1F3D] mb-4">Interpretação e Síntese</p>
                      <div className="text-[17px] md:text-[18px] leading-[1.7] text-[#2D2D2D] font-medium italic space-y-6">
                        {ex.interpretation.split("\n\n").map((para, pi) => (
                          <p key={pi}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reflection */}
            {lesson.reflection && (
              <div className="rounded-xl p-5" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.15)" }}>
                <h3 className="font-heading text-sm tracking-[0.15em] uppercase mb-4 font-bold" style={{ color: "#5B1F3D" }}>
                  ✍️ Reflexão Guiada
                </h3>
                <p className="font-accent text-[17px] md:text-[19px] italic leading-relaxed font-semibold text-[#5B1F3D]">
                  {lesson.reflection}
                </p>
              </div>
            )}

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
            <div className="rounded-[2rem] p-10" style={{ background: "hsl(340 42% 28% / 0.04)", border: "1px solid hsl(340 42% 28% / 0.18)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm" style={{
                  background: "hsl(340 42% 28% / 0.08)", border: "1px solid hsl(340 42% 28% / 0.20)", color: "hsl(340 42% 26%)",
                }}>🎴</span>
                <span className="text-sm font-heading font-bold tracking-wider uppercase" style={{ color: "hsl(340 42% 26%)" }}>
                  {lesson.exercise.type === "writing" ? "Exercício de Escrita" : lesson.exercise.type === "observation" ? "Exercício de Observação" : lesson.exercise.type === "practice" ? "Exercício de Prática" : "Exercício de Reflexão"}
                </span>
              </div>
              <p className="text-[17px] md:text-[18px] leading-relaxed font-medium" style={{ color: "hsl(230 20% 25%)" }}>
                {lesson.exercise.instruction}
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <button onClick={handleStartQuiz} className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{
                background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
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
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>Aprofundamento</span>
              <button onClick={handleStartQuiz} className="text-xs font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>Ir ao Quiz →</button>
            </div>
            <div className="rounded-[2rem] p-10 md:p-14 shadow-sm" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
              {lesson.deepDive.split("\n\n").map((p, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  {renderContent(p)}
                </div>
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
              }}>Quiz de Fixação</h2>
              <p className="text-xs" style={{ color: "hsl(230 10% 45%)" }}>Pergunta {quizIndex + 1} de {lesson.quiz.length}</p>
            </div>
            <div className="rounded-[2rem] p-8 md:p-12 shadow-lg" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)", boxShadow: "0 10px 40px hsl(36 45% 58% / 0.08)" }}>
              <p className="font-heading text-lg md:text-xl font-bold tracking-tight mb-8" style={{ color: "hsl(230 25% 15%)" }}>
                {lesson.quiz[quizIndex].question}
              </p>
              <div className="space-y-3.5">
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
                      className="w-full text-left px-6 py-4 rounded-xl text-base font-medium transition-all duration-200" style={optStyle}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showExplanation && (
                <div className="mt-8 p-6 rounded-2xl" style={{ background: "hsl(36 45% 58% / 0.06)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
                  <p className="text-[15px] leading-relaxed font-medium" style={{ color: "hsl(230 20% 25% / 0.90)" }}>
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
            }}>✦</div>
            <h2 className="font-heading text-2xl" style={{
              background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 45% 44%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Lição Completa!</h2>
            <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>
              Você acertou <strong>{score}/{lesson.quiz.length}</strong> perguntas.
            </p>
            <div className="flex flex-col items-center gap-4 pt-4">
              {nextLesson && (
                <button onClick={handleNextLesson} className="px-12 py-5 rounded-full font-heading text-base tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-4 shadow-xl" style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)", boxShadow: "0 10px 30px hsl(36 45% 58% / 0.3)",
                }}>
                  <span className="flex flex-col items-start">
                    <span className="text-[10px] tracking-[0.3em] uppercase opacity-80">Próxima Lição</span>
                    <span className="flex items-center gap-2">
                      {nextLesson.title}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </span>
                </button>
              )}
              <button onClick={() => navigate("/module/tiragens")} className="px-10 py-4 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-3" style={{
                background: "transparent", border: "1.5px solid hsl(36 45% 58% / 0.45)", color: "hsl(36 40% 42%)",
              }}>
                <MapPin className="w-4 h-4" />
                Voltar ao Módulo
              </button>
              {!nextLesson && (
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid hsl(36 45% 58% / 0.15)" }}>
                  <div className="text-2xl mb-3">🎉</div>
                  <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
                    Módulo Tiragens Completo!
                  </h3>
                  <p className="font-accent text-sm italic max-w-sm mx-auto mb-4" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                    Agora você domina as ferramentas práticas de leitura. Está pronta para a prática guiada.
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
        <PageBackControls variant="bottom" className="mt-8" fallbackRoute="/module/tiragens" />
      </main>

    </div>
  );
};

export default TiragensLessonPage;
