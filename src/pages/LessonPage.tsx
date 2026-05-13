import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArcanoFull as getArcanoById, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES } from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { usePremium } from "@/hooks/use-premium";
import { useRole } from "@/hooks/use-role";
import { useAccess } from "@/hooks/use-access";
import { ArcanoVivoStage } from "@/components/tarot-motion/ArcanoVivoStage";
import { ArcanoUnlockMoment } from "@/components/tarot-motion/ArcanoUnlockMoment";
import { XPRewardMotion } from "@/components/tarot-motion/XPRewardMotion";
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
  const [showXpReward, setShowXpReward] = useState(false);
  const [showUnlockMoment, setShowUnlockMoment] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState(0);
  const [lastQuizTotal, setLastQuizTotal] = useState(0);

  // Fallback defensivo para rota literal /lesson/:id ou IDs inválidos
  const isLiteralRoute = id === ":id";
  const arcanoId = parseInt(id || "0", 10);
  const isValidId = !isNaN(arcanoId) && arcanoId >= 0 && arcanoId <= 21;

  // Redirecionamento defensivo se a rota for literal
  useEffect(() => {
    if (isLiteralRoute) {
      navigate("/module/arcanos-maiores", { replace: true });
    }
  }, [isLiteralRoute, navigate]);

  const arcano = getArcanoById(isValidId ? arcanoId : 0);
  const hasAccess = isValidId ? canAccessArcano(arcanoId) : false;

  const nextArcano = isValidId && arcanoId < 21 ? ARCANOS_MAIORES[arcanoId + 1] : null;

  if (isLiteralRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
        <div className="text-center space-y-6 animate-pulse">
          <div className="w-12 h-12 border-4 border-[#C8A66A]/20 border-t-[#5B1F3D] animate-spin rounded-full mx-auto shadow-[0_0_15px_rgba(91,31,61,0.1)]" />
          <p className="text-[11px] text-[#5B1F3D] font-heading tracking-[0.3em] uppercase font-black">Lendo Arcanos...</p>
        </div>
      </div>
    );
  }

  if (!arcano || !isValidId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
        <div className="text-center space-y-8 max-w-xs px-6 animate-fade-in">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-[#C8A66A] shadow-xl ring-8 ring-[#C8A66A]/10">
            <span className="text-3xl">🃏</span>
          </div>
          <div className="space-y-3">
            <h2 className="font-heading text-2xl text-[#5B1F3D] font-black tracking-tight">Arcano não encontrado</h2>
            <p className="font-accent text-sm text-[#5B1F3D]/70 italic leading-relaxed font-bold">
              "Nem toda porta deve ser aberta antes do tempo."
            </p>
          </div>
          <button 
            onClick={() => navigate("/module/arcanos-maiores")} 
            className="w-full py-5 px-6 rounded-2xl font-heading text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105 active:scale-95 bg-[#5B1F3D] text-white border-2 border-[#C8A66A] font-black"
          >
            Voltar à Jornada
          </button>
        </div>
      </div>
    );
  }

  const phases: LessonPhase[] = ["intro", "lesson"];
  if (arcano.symbolsMap?.length) phases.push("symbols");
  phases.push("deepdive", "exercise", "quiz");

  const handleStartLesson = () => {
    if (!isStaff) {
      addXP(10);
      setXpEarned(10);
      setShowXpReward(true);
      setTimeout(() => setShowXpReward(false), 2000);
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
      if (arcano.id === 0) {
        earnBadge("fool-complete");
        setShowUnlockMoment(true);
      }
    }
    setLastQuizScore(score);
    setLastQuizTotal(total);
    setPhase("complete");
    window.scrollTo(0, 0);
  };

  if (!hasAccess) {
    const isPerformanceLocked = arcanoId === 1 && !hasFullAccess;
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
        {/* Background — Marfim Suave replicando /app */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
              opacity: 0.98,
            }}
          />
        </div>

        <div className="relative z-10 max-w-sm w-full text-center space-y-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-[#C8A66A] flex items-center justify-center font-heading text-3xl text-[#5B1F3D] font-black shadow-xl ring-8 ring-[#C8A66A]/10">
            {arcano.numeral}
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl text-[#5B1F3D] font-black tracking-tight">{arcano.name}</h1>
            <p className="font-accent italic text-[#5B1F3DCC] font-bold text-lg leading-relaxed">{arcano.subtitle}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl border-2 border-[#C8A66A]/30 p-8 rounded-[2rem] shadow-xl">
            <PremiumGate 
              featureName={arcano.name}
              message={isPerformanceLocked 
                ? "Desbloqueie O Mago acertando 80% ou mais no quiz do Louco."
                : "Conteúdo exclusivo para assinantes da Jornada Completa."
              }
            />
          </div>
          {isPerformanceLocked && (
            <button 
              onClick={() => navigate("/lesson/0")} 
              className="w-full bg-[#5B1F3D] text-white py-6 rounded-2xl font-heading font-black text-xs tracking-[0.2em] uppercase border-2 border-[#C8A66A] shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Refazer Quiz do Louco
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#C8A66A]/20 px-6 py-4 flex items-center gap-5 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FDFBF7] border border-[#C8A66A]/20 text-[#5B1F3D] hover:bg-[#5B1F3D] hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-[#8B6A30] mb-0.5 leading-none">
            Arcano {arcano.numeral} • Lição {arcanoId + 1}
          </p>
          <h2 className="font-heading text-lg text-[#5B1F3D] font-black truncate leading-tight tracking-tight">
            {arcano.name}
          </h2>
        </div>
        <PhaseIndicator phases={phases} currentIndex={phases.indexOf(phase)} />
      </header>

      <main className="container max-w-lg mx-auto px-4 py-8">
        {phase === "intro" && (
          <ArcanoVivoStage
            arcanoId={arcanoId}
            cardName={arcano.name}
            cardImage={arcano.cardImage}
            arcanoSlug={arcano.id === 0 ? "o-louco" : arcano.id === 1 ? "o-mago" : arcano.id === 15 ? "o-diabo" : "generic"}
            onContinue={handleStartLesson}
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
            nextArcano={nextArcano ? { id: nextArcano.id, name: nextArcano.name, numeral: nextArcano.numeral, subtitle: nextArcano.subtitle } : undefined}
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

      {showXpReward && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]">
          <XPRewardMotion xp={10} arcanoId={arcanoId} />
        </div>
      )}

      {showUnlockMoment && nextArcano && (
        <ArcanoUnlockMoment
          arcanoId={nextArcano.id}
          cardName={nextArcano.name}
          cardImage={getArcanoById(nextArcano.id)?.cardImage || ""}
          arcanoSlug={nextArcano.id === 1 ? "o-mago" : "generic"}
          onContinue={() => {
            setShowUnlockMoment(false);
            setPhase("complete");
          }}
        />
      )}
    </div>
  );
};

export default LessonPage;
