import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArcanoFull as getArcanoById, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES } from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
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
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type LessonPhase = "intro" | "lesson" | "symbols" | "deepdive" | "exercise" | "quiz" | "complete";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, earnBadge } = useProgress();
  const { loading: premiumLoading } = usePremium();
  const { isStaff, loading: roleLoading } = useRole();
  const { canAccessArcano, hasFullAccess } = useAccess();
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [lastQuizScore, setLastQuizScore] = useState(0);
  const [lastQuizTotal, setLastQuizTotal] = useState(0);

  const arcanoId = parseInt(id || "0", 10);
  const arcano = getArcanoById(isNaN(arcanoId) ? 0 : arcanoId);
  const hasAccess = canAccessArcano(arcanoId);

  const nextArcano = arcanoId < 21 ? ARCANOS_MAIORES[arcanoId + 1] : null;

  if (!arcano) return null;
  if (premiumLoading || roleLoading) return null;

  const phases: LessonPhase[] = ["intro", "lesson"];
  if (arcano.symbolsMap?.length) phases.push("symbols");
  phases.push("deepdive", "exercise", "quiz");

  const handleStartLesson = () => {
    if (!isStaff) {
      addXP(10);
      setXpEarned(10);
      earnBadge("first-step");
    }
    setPhase("lesson");
    window.scrollTo(0, 0);
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (!isStaff) {
      const quizXp = score * 10;
      addXP(quizXp);
      setXpEarned(e => e + quizXp);
      completeQuiz(`quiz-arcano-${arcano.id}`, score, total);
      completeLesson(`arcano-${arcano.id}`);
      if (arcano.id === 0) earnBadge("fool-complete");
    }
    setLastQuizScore(score);
    setLastQuizTotal(total);
    setPhase("complete");
    window.scrollTo(0, 0);
  };

  if (!hasAccess) {
    const isPerformanceLocked = arcanoId === 1 && !hasFullAccess;
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-heading text-2xl text-gold-dark">
          {arcano.numeral}
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-midnight">{arcano.name}</h1>
          <p className="font-accent italic text-muted-foreground">{arcano.subtitle}</p>
        </div>
        <PremiumGate 
          featureName={arcano.name}
          message={isPerformanceLocked 
            ? "Desbloqueie O Mago acertando 80% ou mais no quiz do Louco."
            : "Conteúdo exclusivo para assinantes da Jornada Completa."
          }
        />
        {isPerformanceLocked && (
          <button onClick={() => navigate("/lesson/0")} className="btn-gold">
            Refazer Quiz do Louco
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-gold/10 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 opacity-50 hover:opacity-100"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1 min-w-0">
          <p className="t-section-title text-[9px] mb-0.5">{arcano.numeral} • {arcanoId + 1}/22</p>
          <h2 className="font-heading text-sm text-midnight truncate">{arcano.name}</h2>
        </div>
        <PhaseIndicator phases={phases} currentIndex={phases.indexOf(phase)} />
      </header>

      <main className="container max-w-lg mx-auto px-4 py-8">
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

        {phase === "lesson" && (
          <LessonContent
            sections={arcano.lessonSections}
            essence={arcano.layers.main.essence}
            light={arcano.layers.main.light}
            shadow={arcano.layers.main.shadow}
            onComplete={() => setPhase(arcano.symbolsMap?.length ? "symbols" : "quiz")}
            onGoDeepDive={() => setPhase("deepdive")}
            onGoExercise={() => setPhase("exercise")}
            onSkipToQuiz={() => setPhase("quiz")}
          />
        )}

        {phase === "symbols" && (
          <SymbolMap
            cardImage={arcano.cardImage}
            cardName={arcano.name}
            symbols={arcano.symbolsMap!}
            onComplete={() => setPhase("deepdive")}
          />
        )}

        {phase === "deepdive" && (
          <div className="space-y-8">
            <DeepDiveSection {...arcano.layers.deepDive} />
            <Button onClick={() => setPhase("exercise")} className="btn-premium w-full py-7">Continuar para Exercício</Button>
          </div>
        )}

        {phase === "exercise" && (
          <div className="space-y-8">
            <ExerciseSection
              {...arcano.layers.exercise}
              onComplete={() => setExerciseCompleted(true)}
              completed={exerciseCompleted}
            />
            <Button onClick={() => setPhase("quiz")} className="btn-premium w-full py-7">Iniciar Quiz Final</Button>
          </div>
        )}

        {phase === "quiz" && (
          <QuizSection
            questions={arcano.quiz}
            onComplete={handleQuizComplete}
          />
        )}

        {phase === "complete" && (
          <CompletionScreen
            arcanoName={arcano.name}
            arcanoId={arcanoId}
            xpEarned={xpEarned}
            quizScore={lastQuizScore}
            quizTotal={lastQuizTotal}
            nextArcano={nextArcano}
            isLastArcano={arcanoId === 21}
            onNextArcano={() => {
              if (nextArcano) {
                navigate(`/lesson/${arcanoId + 1}`);
                window.location.reload();
              }
            }}
            onBackToMap={() => navigate("/module/arcanos-maiores")}
            onPrevArcano={() => {}}
          />
        )}
      </main>
    </div>
  );
};

export default LessonPage;
