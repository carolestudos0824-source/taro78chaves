import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArcanoFull as getArcanoById, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, FREE_ARCANO_IDS } from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useTrackEvent } from "@/hooks/use-track-event";
import { usePremium } from "@/hooks/use-premium";
import { useRole } from "@/hooks/use-role";
import { useAccess } from "@/hooks/use-access";
import { ArcanoVivoIntro } from "@/components/arcano-vivo/ArcanoVivoIntro";
import { LessonContent } from "@/components/arcano-vivo/LessonContent";
import { SymbolMap } from "@/components/arcano-vivo/SymbolMap";
import { CompletionScreen } from "@/components/arcano-vivo/CompletionScreen";
import { PhaseIndicator } from "@/components/arcano-vivo/PhaseIndicator";

import { DeepDiveSection } from "@/components/DeepDiveSection";
import { ExerciseSection } from "@/components/ExerciseSection";
import { QuizSection } from "@/components/QuizSection";
import PremiumGate from "@/components/PremiumGate";
import { ArrowLeft, MapPin } from "lucide-react";
import { useResolvedQuiz } from "@/hooks/use-resolved-quiz";
import { useResolvedArcano } from "@/hooks/use-resolved-arcano";
import { useAuth } from "@/hooks/use-auth";
import { persistQuizResponse } from "@/lib/quiz-persistence";
import mysticBg from "@/assets/mystic-bg.jpg";



type LessonPhase = "intro" | "lesson" | "deepdive" | "exercise" | "quiz" | "complete";

const PHASE_STEPS: LessonPhase[] = ["intro", "lesson", "deepdive", "exercise", "quiz"];

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, earnBadge, isArcanoCompleted, progress } = useProgress();
  const { user } = useAuth();
  const { trackEvent } = useTrackEvent();
  const { isPremium, loading: premiumLoading } = usePremium();
  const { isAdmin, isStaff, loading: roleLoading } = useRole();
  const { hasFullAccess, canAccessArcano } = useAccess();
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [lastQuizScore, setLastQuizScore] = useState(0);
  const [lastQuizTotal, setLastQuizTotal] = useState(0);

  const arcanoId = parseInt(id || "0", 10);
  const arcano = getArcanoById(isNaN(arcanoId) ? 0 : arcanoId);
  const hasAccess = canAccessArcano(arcanoId);

  const prevArcano = arcanoId > 0 ? ARCANOS_MAIORES[arcanoId - 1] : null;
  const nextArcano = arcanoId < 21 ? ARCANOS_MAIORES[arcanoId + 1] : null;

  // Fase 2A: leitura do arcano também passa pelo adaptador.
  // A UI continua usando o objeto legado (`arcano`) para preservar 100% do
  // layout, animação e estrutura. O adaptador atua aqui como fonte canônica
  // hidratada do DB com fallback automático para o legado quando a row não
  // existir, expondo `sourceUsed` para telemetria.
  const resolvedArcano = useResolvedArcano(
    arcano ? { tipo: "maior", numero: arcanoId } : null,
  );

  // Fase 1: quiz vem do content-adapter (DB → fallback legado).
  // O `legacyQuiz` continua como rede de segurança caso o adapter retorne null.
  const resolvedQuiz = useResolvedQuiz({
    params: arcano
      ? { linkedTo: `arcano-maior-${arcanoId}`, arcanoNumero: arcanoId }
      : null,
    legacyQuiz: arcano?.quiz ?? null,
  });

  if (import.meta.env.DEV && arcano && resolvedQuiz.sourceUsed) {
    // eslint-disable-next-line no-console
    console.info(
      `[content-adapter] quiz arcano=${arcanoId} source=${resolvedQuiz.sourceUsed} fallback=${resolvedQuiz.usedFallback}`,
    );
  }

  // Marca para o linter — o probe é intencional, mantém referência para evitar tree-shake.
  void resolvedArcano;

  useEffect(() => {
    if (arcano) trackEvent(`lesson_started_${arcano.id}`, { name: arcano.name });
  }, [arcanoId]);

  useEffect(() => {
    if (!hasAccess && arcano) trackEvent("premium_gate_hit", { arcano_id: arcanoId, name: arcano.name });
  }, [hasAccess, arcanoId]);

  const resetForNewArcano = () => {
    setPhase("intro");
    setExerciseCompleted(false);
    setXpEarned(0);
    setLastQuizScore(0);
    setLastQuizTotal(0);
    window.scrollTo(0, 0);
  };

  if (!arcano) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="text-center space-y-4">
          <p className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>Arcano não encontrado</p>
          <button onClick={() => navigate("/module/arcanos-maiores")} className="text-sm font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>
            Voltar à Jornada
          </button>
        </div>
      </div>
    );
  }

  // Show loading while checking premium status
  if (premiumLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "hsl(36 45% 58%)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const currentIdx = PHASE_STEPS.indexOf(phase);

  const handleStartLesson = () => {
    if (!isStaff) {
      addXP(10);
      setXpEarned(e => e + 10);
      earnBadge("first-step");
    }
    setPhase("lesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLessonComplete = () => {
    if (!isStaff) {
      addXP(25);
      setXpEarned(e => e + 25);
      completeLesson(`arcano-${arcano.id}`);
    }
    trackEvent(`lesson_completed_${arcano.id}`, { name: arcano.name });
    setPhase("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExerciseComplete = () => {
    setExerciseCompleted(true);
    if (!isStaff) {
      addXP(10);
      setXpEarned(e => e + 10);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (!isStaff) {
      const quizXp = score * 10;
      addXP(quizXp);
      setXpEarned(e => e + quizXp);
      completeQuiz(`quiz-arcano-${arcano.id}`, score, total);
      completeLesson(`arcano-${arcano.id}`);
      if (arcano.id === 0) earnBadge("fool-complete");
      if (score === total) earnBadge("quiz-master");
    }
    setLastQuizScore(score);
    setLastQuizTotal(total);
    trackEvent(`quiz_completed_${arcano.id}`, { name: arcano.name, score, total });
    setPhase("complete");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPhase = (p: LessonPhase) => {
    setPhase(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Special case: Arcano 1 performance lock
  const isPerformanceLocked = arcanoId === 1 && !hasFullAccess && !canAccessArcano(1);

  // Premium gate — only shown to non-premium, non-admin, non-free users
  if (!hasAccess) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <img src={mysticBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.35), hsl(36 33% 97% / 0.30))",
          }} />
        </div>
        <header className="relative z-10 backdrop-blur-md" style={{
          background: "hsl(36 33% 97% / 0.85)",
          borderBottom: "1px solid hsl(36 45% 58% / 0.15)",
        }}>
          <div className="container max-w-lg py-3 px-4 flex items-center gap-4">
            <button onClick={() => navigate("/module/arcanos-maiores")} style={{ color: "hsl(230 10% 40%)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-[9px] tracking-[0.35em] uppercase font-heading" style={{ color: "hsl(340 42% 28% / 0.50)" }}>
                {arcano.numeral} · {isPerformanceLocked ? "Bloqueio por Desempenho" : "Conteúdo Premium"}
              </span>
            </div>
          </div>
        </header>
        <main className="relative z-10 container max-w-lg mx-auto px-6 pt-12 pb-20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
              background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 33% 96%), hsl(36 45% 55% / 0.12))",
              border: "2px solid hsl(36 45% 58% / 0.30)",
            }}>
              <span className="font-heading text-xl" style={{ color: "hsl(340 42% 22%)" }}>{arcano.numeral}</span>
            </div>
            <h1 className="font-heading text-2xl tracking-wide mb-2" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{arcano.name}</h1>
            <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.55)" }}>{arcano.subtitle}</p>
          </div>
          
          <PremiumGate 
            featureName={arcano.name}
            message={isPerformanceLocked 
              ? "Para desbloquear O Mago gratuitamente, você precisa de um desempenho excelente (80%+) no quiz do Louco. Refaça o quiz para avançar."
              : `Estude ${arcano.name} com profundidade — essência, símbolos, luz, sombra, voz do arcano, exercícios e quiz completo.`
            }
          >
            {isPerformanceLocked && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <button
                  onClick={() => navigate("/lesson/0")}
                  className="px-8 py-3 rounded-full font-heading text-xs tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                    color: "hsl(36 33% 97%)",
                    boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                  }}
                >
                  Refazer Quiz do Louco
                </button>
              </div>
            )}
          </PremiumGate>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background — fundo aquarelado vivo, overlay leve só p/ legibilidade */}
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.30), hsl(36 33% 97% / 0.22), hsl(36 33% 97% / 0.32))",
        }} />
      </div>

      {/* Header — compact mobile */}
      <header className="relative z-10 backdrop-blur-md safe-area-top" style={{
        background: "hsl(36 33% 97% / 0.85)",
        borderBottom: "1px solid hsl(36 45% 58% / 0.15)",
      }}>
        <div className="max-w-lg mx-auto py-3 px-4 flex items-center gap-3">
          <button onClick={() => navigate("/module/arcanos-maiores")} className="shrink-0" style={{ color: "hsl(230 10% 40%)" }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-heading text-xs tracking-[0.15em] shrink-0" style={{ color: "hsl(36 40% 42%)" }}>{arcano.numeral}</span>
            <span className="font-heading text-sm truncate" style={{ color: "hsl(230 25% 15%)" }}>{arcano.name}</span>
          </div>
          <div className="flex-1" />
          <span className="text-[9px] font-body tracking-wider shrink-0" style={{ color: "hsl(230 10% 50%)" }}>{arcanoId + 1}/22</span>
          <PhaseIndicator phases={PHASE_STEPS} currentIndex={currentIdx >= 0 ? currentIdx : PHASE_STEPS.length} />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* INTRO — Cinematic */}
        {phase === "intro" && (
          <ArcanoVivoIntro
            arcanoId={arcanoId}
            name={arcano.name}
            numeral={arcano.numeral}
            subtitle={arcano.subtitle}
            keywords={arcano.keywords}
            cardImage={arcano.cardImage}
            archetype={arcano.archetype}
            voiceIntro={arcano.firstPersonIntro}
            voiceFullText={arcano.voiceText}
            onEnterLesson={handleStartLesson}
          />
        )}

        {/* LESSON — Progressive content */}
        {phase === "lesson" && (
          <LessonContent
            sections={arcano.lessonSections}
            essence={arcano.layers.main.essence}
            light={arcano.layers.main.light}
            shadow={arcano.layers.main.shadow}
            onComplete={handleLessonComplete}
            onGoDeepDive={() => goToPhase("deepdive")}
            onGoExercise={() => goToPhase("exercise")}
            onSkipToQuiz={() => goToPhase("quiz")}
            quickReview={arcano.quickReview}
            reflectionQuestions={arcano.reflectionQuestions}
            initiationLesson={arcano.initiationLesson}
          />
        )}

        {/* DEEP DIVE */}
        {phase === "deepdive" && (
          <div className="space-y-6 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>Aprofundamento</span>
              <button onClick={() => goToPhase("quiz")} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>Ir ao Quiz →</button>
            </div>
            <DeepDiveSection {...arcano.layers.deepDive} />
            <div className="flex justify-center pt-4">
              <button onClick={() => goToPhase("quiz")}
                className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}
              >Ir ao Quiz</button>
            </div>
          </div>
        )}

        {/* EXERCISE */}
        {phase === "exercise" && (
          <div className="space-y-6 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>Exercício</span>
              <button onClick={() => goToPhase("quiz")} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>Ir ao Quiz →</button>
            </div>
            <ExerciseSection
              instruction={arcano.layers.exercise.instruction}
              type={arcano.layers.exercise.type}
              duration={arcano.layers.exercise.duration}
              onComplete={handleExerciseComplete}
              completed={exerciseCompleted}
            />
            <div className="flex justify-center pt-2">
              <button onClick={() => goToPhase("quiz")}
                className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}
              >Ir ao Quiz</button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl mb-1" style={{
                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 42% 42%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Quiz de Fixação</h2>
              <p className="text-xs" style={{ color: "hsl(230 10% 45%)" }}>Teste o que você aprendeu com {arcano.name}</p>
            </div>
            <div className="rounded-xl p-5" style={{
              background: "hsl(38 30% 95% / 0.85)",
              border: "1px solid hsl(36 45% 58% / 0.15)",
              boxShadow: "0 4px 20px hsl(36 45% 58% / 0.06)",
            }}>
              <QuizSection
                questions={resolvedQuiz.questions ?? arcano.quiz}
                onComplete={handleQuizComplete}
                onAnswer={(qIdx, optIdx, isCorrect) => {
                  if (!user) return;
                  persistQuizResponse({
                    userId: user.id,
                    quizId: `quiz-arcano-${arcano.id}`,
                    questionIndex: qIdx,
                    selectedAnswer: optIdx,
                    isCorrect,
                  });
                }}
              />
            </div>
            <div className="flex justify-center">
              <button onClick={() => navigate("/module/arcanos-maiores")} className="text-sm flex items-center gap-2" style={{ color: "hsl(230 10% 45%)" }}>
                <MapPin className="w-3.5 h-3.5" /> Voltar ao mapa
              </button>
            </div>
          </div>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <CompletionScreen
            arcanoName={arcano.name}
            xpEarned={xpEarned}
            quizScore={lastQuizScore}
            quizTotal={lastQuizTotal}
            nextArcano={nextArcano}
            prevArcano={prevArcano}
            isPrevCompleted={prevArcano ? isArcanoCompleted(prevArcano.id) : false}
            onNextArcano={() => { navigate(`/lesson/${nextArcano!.id}`); resetForNewArcano(); }}
            onPrevArcano={() => { navigate(`/lesson/${prevArcano!.id}`); resetForNewArcano(); }}
            onBackToMap={() => navigate("/module/arcanos-maiores")}
            isLastArcano={!nextArcano}
          />
        )}
      </main>
    </div>
  );
};

export default LessonPage;
