import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Check, X, Zap, BookOpen, Sparkles, ChevronRight, RefreshCw } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useReview } from "@/hooks/use-review";
import { useArcanosList } from "@/hooks/use-content";
import {
  buildReviewBundle,
  generateDailyChallenge,
  getArcanoNameFromBundle,
  getArcanoNumeralFromBundle,
  getFlashcardsForArcano,
  type Flashcard,
} from "@/lib/review/builders";
import { QuickReviewCard } from "@/components/QuickReviewCard";
// import mysticBg from "@/assets/mystic-bg.jpg";
// import ornamentDivider from "@/assets/ornament-divider.png";

type ReviewMode = "home" | "flashcards" | "wrong-answers" | "daily-challenge";

const ReviewPage = () => {
  const navigate = useNavigate();
  const { progress, addXP } = useProgress();
  const review = useReview();
  const { data: arcanos } = useArcanosList({ tipo: "maior" });

  const bundle = useMemo(() => buildReviewBundle(arcanos ?? []), [arcanos]);
  const ALL_FLASHCARDS = bundle.allFlashcards;
  const ALL_REVIEW_QUIZZES = bundle.allReviewQuizzes;
  const ALL_QUICK_REVIEWS = bundle.allQuickReviews;
  const getArcanoName = (id: number) => getArcanoNameFromBundle(bundle, id);
  const getArcanoNumeral = (id: number) => getArcanoNumeralFromBundle(bundle, id);

  const [mode, setMode] = useState<ReviewMode>("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedArcano, setSelectedArcano] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const dailyChallenge = useMemo(
    () => generateDailyChallenge(bundle, today, progress.completedLessons),
    [bundle, today, progress.completedLessons],
  );
  const isDailyDone = review.completedDailyChallenges.includes(`daily-${today}`);
  const dueFlashcards = review.getDueFlashcards();

  // Studied arcanos
  const studiedArcanoIds = useMemo(() => {
    return progress.completedLessons
      .filter(l => l.startsWith("arcano-"))
      .map(l => parseInt(l.replace("arcano-", "")))
      .sort((a, b) => a - b);
  }, [progress.completedLessons]);

  // Current flashcard set
  const flashcardSet = useMemo((): Flashcard[] => {
    if (mode === "daily-challenge" && dailyChallenge?.type !== "quick-quiz") {
      return ALL_FLASHCARDS.filter(f => dailyChallenge?.items.includes(f.id));
    }
    if (selectedArcano !== null) {
      return getFlashcardsForArcano(bundle, selectedArcano);
    }
    if (dueFlashcards.length > 0) {
      return ALL_FLASHCARDS.filter(f => dueFlashcards.includes(f.id));
    }
    return ALL_FLASHCARDS.filter(f => studiedArcanoIds.includes(f.arcanoId));
  }, [mode, selectedArcano, dueFlashcards, studiedArcanoIds, dailyChallenge]);

  // Current quiz set (wrong answers)
  const wrongQuizSet = useMemo(() => {
    if (mode === "daily-challenge" && dailyChallenge?.type === "quick-quiz") {
      return ALL_REVIEW_QUIZZES.filter(q => dailyChallenge.items.includes(q.id));
    }
    return ALL_REVIEW_QUIZZES.filter(q =>
      review.wrongAnswers.some(w => w.questionId === q.id)
    );
  }, [mode, review.wrongAnswers, dailyChallenge]);

  const currentFlashcard = flashcardSet[currentIndex];
  const currentQuiz = wrongQuizSet[currentIndex];

  const handleFlashcardAnswer = (quality: "easy" | "good" | "hard") => {
    if (currentFlashcard) {
      review.completeFlashcard(currentFlashcard.id, quality);
    }
    nextCard();
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setQuizAnswer(answerIndex);
    setShowExplanation(true);
    if (currentQuiz && answerIndex === currentQuiz.correctIndex) {
      review.removeWrongAnswer(currentQuiz.id);
      addXP(5);
    }
  };

  const nextCard = () => {
    setFlipped(false);
    setQuizAnswer(null);
    setShowExplanation(false);
    const total = mode === "wrong-answers" || (mode === "daily-challenge" && dailyChallenge?.type === "quick-quiz")
      ? wrongQuizSet.length
      : flashcardSet.length;
    if (currentIndex + 1 >= total) {
      if (mode === "daily-challenge" && dailyChallenge) {
        review.completeDailyChallenge(dailyChallenge.id);
        addXP(dailyChallenge.xpReward);
      }
      setMode("home");
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const startMode = (m: ReviewMode, arcano?: number) => {
    setMode(m);
    setCurrentIndex(0);
    setFlipped(false);
    setQuizAnswer(null);
    setShowExplanation(false);
    setSelectedArcano(arcano ?? null);
  };

  // ── Render ──

  if (mode === "flashcards" && currentFlashcard) {
    return <FlashcardView
      card={currentFlashcard}
      arcanoName={getArcanoName(currentFlashcard.arcanoId)}
      index={currentIndex}
      total={flashcardSet.length}
      flipped={flipped}
      onFlip={() => setFlipped(true)}
      onAnswer={handleFlashcardAnswer}
      onBack={() => setMode("home")}
    />;
  }

  if ((mode === "wrong-answers" || (mode === "daily-challenge" && dailyChallenge?.type === "quick-quiz")) && currentQuiz) {
    return <QuizReviewView
      question={currentQuiz}
      index={currentIndex}
      total={wrongQuizSet.length}
      selectedAnswer={quizAnswer}
      showExplanation={showExplanation}
      onAnswer={handleQuizAnswer}
      onNext={nextCard}
      onBack={() => setMode("home")}
    />;
  }

  if (mode === "daily-challenge" && dailyChallenge && currentFlashcard) {
    return <FlashcardView
      card={currentFlashcard}
      arcanoName={getArcanoName(currentFlashcard.arcanoId)}
      index={currentIndex}
      total={flashcardSet.length}
      flipped={flipped}
      onFlip={() => setFlipped(true)}
      onAnswer={handleFlashcardAnswer}
      onBack={() => setMode("home")}
      isDaily
    />;
  }

  // ── Home ──
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.06), hsl(36 33% 97% / 0.04), hsl(36 33% 97% / 0.18))"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: "1px solid hsl(36 45% 50% / 0.30)",
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94), hsl(38 28% 93% / 0.92))",
        backdropFilter: "blur(28px)",
      }}>
        <div className="container max-w-3xl py-4 px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/app")} className="transition-all hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[9px] tracking-[0.4em] uppercase font-body flex items-center gap-1.5" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
                <span style={{ color: "hsl(36 40% 42%)" }}>◎</span> Revisão <span style={{ color: "hsl(36 40% 42%)" }}>◎</span>
              </span>
              <h1 className="font-heading text-xl md:text-2xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Revisão Inteligente
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6 py-6 space-y-6">
        {/* Daily Challenge */}
        {dailyChallenge && (
          <section>
            <button
              onClick={() => !isDailyDone && startMode("daily-challenge")}
              disabled={isDailyDone}
              className="w-full text-left transition-all duration-500"
            >
              <div className="relative overflow-hidden rounded-xl p-5" style={{
                background: isDailyDone
                  ? "hsl(38 28% 93% / 0.60)"
                  : "linear-gradient(145deg, hsl(340 42% 26% / 0.08), hsl(36 42% 44% / 0.12))",
                backdropFilter: "blur(14px)",
                border: isDailyDone
                  ? "1px solid hsl(36 45% 50% / 0.15)"
                  : "1.5px solid hsl(340 42% 28% / 0.25)",
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                    background: isDailyDone
                      ? "hsl(140 40% 45% / 0.12)"
                      : "linear-gradient(135deg, hsl(340 42% 26% / 0.15), hsl(36 42% 44% / 0.20))",
                    border: isDailyDone
                      ? "1.5px solid hsl(140 40% 45% / 0.30)"
                      : "1.5px solid hsl(340 42% 28% / 0.25)",
                  }}>
                    {isDailyDone
                      ? <Check className="w-5 h-5" style={{ color: "hsl(140 40% 35%)" }} />
                      : <Zap className="w-5 h-5" style={{ color: "hsl(36 42% 40%)" }} />
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-sm tracking-wide" style={{ color: isDailyDone ? "hsl(230 20% 12% / 0.45)" : "hsl(230 20% 12% / 0.80)" }}>
                      {isDailyDone ? "Desafio concluído ✦" : dailyChallenge.title}
                    </h3>
                    <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                      {isDailyDone ? "Volte amanhã para um novo desafio" : dailyChallenge.subtitle}
                    </p>
                  </div>
                  {!isDailyDone && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(36 42% 45%)" }} />
                      <span className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(36 42% 45%)" }}>+{dailyChallenge.xpReward} XP</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </section>
        )}

        {/* Due flashcards */}
        {dueFlashcards.length > 0 && (
          <section>
            <button
              onClick={() => startMode("flashcards")}
              className="w-full text-left transition-all duration-500 hover:scale-[1.01]"
            >
              <div className="relative overflow-hidden rounded-xl p-5 flex items-center gap-4" style={{
                background: "linear-gradient(145deg, hsl(36 42% 44% / 0.08), hsl(38 28% 93% / 0.90))",
                backdropFilter: "blur(14px)",
                border: "1.5px solid hsl(36 45% 50% / 0.25)",
              }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "hsl(36 42% 44% / 0.12)",
                  border: "1.5px solid hsl(36 42% 45% / 0.30)",
                }}>
                  <RefreshCw className="w-4 h-4" style={{ color: "hsl(36 42% 40%)" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 20% 12% / 0.80)" }}>
                    {dueFlashcards.length} flashcard{dueFlashcards.length > 1 ? "s" : ""} para revisar
                  </h3>
                  <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                    Revisão por repetição espaçada
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
              </div>
            </button>
          </section>
        )}

        {/* Wrong answers */}
        {review.wrongAnswers.length > 0 && (
          <section>
            <button
              onClick={() => startMode("wrong-answers")}
              className="w-full text-left transition-all duration-500 hover:scale-[1.01]"
            >
              <div className="relative overflow-hidden rounded-xl p-5 flex items-center gap-4" style={{
                background: "linear-gradient(145deg, hsl(340 42% 28% / 0.06), hsl(38 28% 93% / 0.90))",
                backdropFilter: "blur(14px)",
                border: "1px solid hsl(340 42% 28% / 0.20)",
              }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "hsl(340 42% 28% / 0.10)",
                  border: "1.5px solid hsl(340 42% 28% / 0.25)",
                }}>
                  <RotateCcw className="w-4 h-4" style={{ color: "hsl(340 42% 28%)" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 20% 12% / 0.80)" }}>
                    {review.wrongAnswers.length} pergunta{review.wrongAnswers.length > 1 ? "s" : ""} para revisar
                  </h3>
                  <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                    Perguntas que você errou — tente novamente
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "hsl(340 42% 28% / 0.30)" }} />
              </div>
            </button>
          </section>
        )}

        {/* Smart Suggestions based on errors */}
        {review.wrongAnswers.length > 0 && studiedArcanoIds.length > 0 && (
          <section className="animate-fade-up">
            <h2 className="text-[9px] font-heading tracking-[0.35em] uppercase mb-3" style={{ color: "hsl(340 42% 28%)" }}>
              ✦ Sugestões de Reforço
            </h2>
            <div className="grid grid-cols-1 gap-3">
               {Array.from(new Set(review.wrongAnswers.map(w => w.arcanoId)))
                 .slice(0, 2)
                 .map(id => {
                   const arcano = arcanos?.find(a => a.numero === id);
                   if (!arcano) return null;
                   return (
                     <button
                       key={id}
                       onClick={() => navigate(`/lesson/${id}`)}
                       className="w-full text-left p-4 rounded-xl border border-primary/20 bg-white/50 backdrop-blur-sm flex items-center justify-between group"
                     >
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center bg-primary/5">
                           <BookOpen className="w-4 h-4 text-primary" />
                         </div>
                         <div>
                           <h4 className="text-sm font-heading text-primary-dark">Refazer lição: {arcano.nome}</h4>
                           <p className="text-[10px] text-muted-foreground italic">Focar nos conceitos que você errou</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-primary/40 group-hover:translate-x-1 transition-transform" />
                     </button>
                   );
                 })
               }
            </div>
          </section>
        )}


        {/* Flashcards by arcano */}
        {studiedArcanoIds.length > 0 && (
          <section>
            <h2 className="text-[9px] font-heading tracking-[0.35em] uppercase mb-3" style={{ color: "hsl(36 42% 40%)" }}>
              ✦ Flashcards por Arcano
            </h2>
            <div className="space-y-2.5">
              {studiedArcanoIds.map(id => {
                const cards = getFlashcardsForArcano(bundle, id);
                const reviewed = cards.filter(c => review.completedFlashcards.includes(c.id)).length;
                return (
                  <button
                    key={id}
                    onClick={() => startMode("flashcards", id)}
                    className="w-full text-left transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="rounded-xl p-4 flex items-center gap-3" style={{
                      background: "hsl(38 28% 93% / 0.75)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid hsl(36 45% 50% / 0.18)",
                    }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
                        border: "1.5px solid hsl(36 42% 45% / 0.30)",
                        background: "hsl(38 28% 94% / 0.90)"
                      }}>
                        <span className="font-heading text-xs" style={{ color: "hsl(36 42% 40%)" }}>
                          {getArcanoNumeral(id)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(230 20% 12% / 0.80)" }}>
                          {getArcanoName(id)}
                        </h3>
                        <p className="text-[10px] font-body" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                          {reviewed}/{cards.length} revisados
                        </p>
                      </div>
                      {/* Mini progress */}
                      <div className="w-16 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: "hsl(36 45% 50% / 0.12)" }}>
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${(reviewed / cards.length) * 100}%`,
                          background: "linear-gradient(90deg, hsl(36 42% 45%), hsl(340 42% 28%))",
                        }} />
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "hsl(36 42% 45% / 0.30)" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {studiedArcanoIds.length === 0 && (
          <div className="text-center py-16">
            <span className="text-2xl block mb-3" style={{ color: "hsl(36 42% 45% / 0.40)" }}>◎</span>
            <p className="font-accent italic text-sm mb-1" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              Nenhum arcano estudado ainda
            </p>
            <p className="text-[11px] font-body" style={{ color: "hsl(230 20% 15% / 0.35)" }}>
              Complete sua primeira lição para desbloquear a revisão
            </p>
          </div>
        )}

        {/* Quick Review — all 22 arcanos */}
        <section>
          <div className="flex items-center justify-center mb-3">
            <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
          </div>
          <h2 className="text-[9px] font-heading tracking-[0.35em] uppercase mb-1 text-center" style={{ color: "hsl(36 42% 40%)" }}>
            ✦ Revisão Rápida
          </h2>
          <p className="text-[10px] font-accent italic text-center mb-4" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
            Resumo padronizado dos 22 Arcanos Maiores
          </p>
          <div className="space-y-2.5">
            {ALL_QUICK_REVIEWS.map(review => (
              <QuickReviewCard
                key={review.arcanoId}
                review={review}
                isStudied={studiedArcanoIds.includes(review.arcanoId)}
              />
            ))}
          </div>
        </section>

        <div className="flex items-center justify-center pt-4 pb-10">
          <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
        </div>
      </main>
    </div>
  );
};

// ── Flashcard View ──

interface FlashcardViewProps {
  card: Flashcard;
  arcanoName: string;
  index: number;
  total: number;
  flipped: boolean;
  onFlip: () => void;
  onAnswer: (q: "easy" | "good" | "hard") => void;
  onBack: () => void;
  isDaily?: boolean;
}

const FlashcardView = ({ card, arcanoName, index, total, flipped, onFlip, onAnswer, onBack, isDaily }: FlashcardViewProps) => (
  <div className="min-h-screen flex flex-col" style={{
    background: "linear-gradient(180deg, hsl(36 33% 96%), hsl(38 28% 93%))",
  }}>
    {/* Header */}
    <div className="px-6 py-4 flex items-center justify-between" style={{
      borderBottom: "1px solid hsl(36 45% 50% / 0.15)",
    }}>
      <button onClick={onBack} style={{ color: "hsl(230 10% 40%)" }}>
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center">
        <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28% / 0.60)" }}>
          {isDaily ? "Desafio Diário" : "Flashcards"}
        </span>
        <p className="text-[10px] font-body" style={{ color: "hsl(230 20% 15% / 0.40)" }}>
          {index + 1} de {total}
        </p>
      </div>
      <div className="w-5" />
    </div>

    {/* Progress dots */}
    <div className="px-6 pt-3 flex justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1 rounded-full transition-all duration-300" style={{
          width: i === index ? 20 : 8,
          background: i < index
            ? "hsl(140 40% 45% / 0.50)"
            : i === index
            ? "linear-gradient(90deg, hsl(36 42% 45%), hsl(340 42% 28%))"
            : "hsl(36 45% 50% / 0.15)",
        }} />
      ))}
    </div>

    {/* Card */}
    <div className="flex-1 flex items-center justify-center px-6 py-8">
      <button
        onClick={() => !flipped && onFlip()}
        className="w-full max-w-md transition-all duration-500"
        style={{ perspective: "1000px" }}
      >
        <div className="relative w-full min-h-[280px] rounded-2xl overflow-hidden" style={{
          background: flipped
            ? "linear-gradient(145deg, hsl(38 28% 93% / 0.98), hsl(36 33% 95% / 0.95))"
            : "linear-gradient(145deg, hsl(340 42% 26% / 0.06), hsl(36 42% 44% / 0.08), hsl(38 28% 93% / 0.95))",
          backdropFilter: "blur(20px)",
          border: flipped
            ? "1.5px solid hsl(140 40% 45% / 0.20)"
            : "1.5px solid hsl(36 45% 50% / 0.25)",
          boxShadow: "0 8px 32px hsl(230 20% 12% / 0.06)",
        }}>
          <div className="p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
            {/* Category badge */}
            <span className="text-[9px] font-heading tracking-[0.3em] uppercase mb-4 px-3 py-1 rounded-full" style={{
              background: "hsl(36 45% 50% / 0.08)",
              border: "1px solid hsl(36 45% 50% / 0.15)",
              color: "hsl(36 42% 40%)",
            }}>
              {arcanoName} · {
                card.category === "symbol" ? "Símbolo" :
                card.category === "archetype" ? "Arquétipo" :
                card.category === "light-shadow" ? "Luz & Sombra" :
                card.category === "keyword" ? "Palavra-chave" : "Cabala"
              }
            </span>

            {!flipped ? (
              <>
                <p className="font-heading text-lg tracking-wide leading-relaxed mb-6" style={{ color: "hsl(230 20% 12% / 0.85)" }}>
                  {card.front}
                </p>
                <span className="text-[10px] font-accent italic" style={{ color: "hsl(230 20% 15% / 0.35)" }}>
                  Toque para revelar
                </span>
              </>
            ) : (
              <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 20% 12% / 0.70)" }}>
                {card.back}
              </p>
            )}
          </div>
        </div>
      </button>
    </div>

    {/* Answer buttons */}
    {flipped && (
      <div className="px-6 pb-8">
        <p className="text-center text-[10px] font-accent italic mb-4" style={{ color: "hsl(230 20% 15% / 0.40)" }}>
          Como foi lembrar?
        </p>
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => onAnswer("hard")}
            className="flex-1 py-3 rounded-xl font-heading text-[11px] tracking-wider uppercase transition-all"
            style={{
              background: "hsl(340 42% 28% / 0.08)",
              border: "1px solid hsl(340 42% 28% / 0.20)",
              color: "hsl(340 42% 28%)",
            }}
          >
            Difícil
          </button>
          <button
            onClick={() => onAnswer("good")}
            className="flex-1 py-3 rounded-xl font-heading text-[11px] tracking-wider uppercase transition-all"
            style={{
              background: "hsl(36 42% 44% / 0.10)",
              border: "1px solid hsl(36 42% 44% / 0.25)",
              color: "hsl(36 42% 38%)",
            }}
          >
            Bom
          </button>
          <button
            onClick={() => onAnswer("easy")}
            className="flex-1 py-3 rounded-xl font-heading text-[11px] tracking-wider uppercase transition-all"
            style={{
              background: "hsl(140 40% 45% / 0.08)",
              border: "1px solid hsl(140 40% 45% / 0.25)",
              color: "hsl(140 40% 35%)",
            }}
          >
            Fácil
          </button>
        </div>
      </div>
    )}
  </div>
);

// ── Quiz Review View ──

interface QuizReviewViewProps {
  question: { id: string; question: string; options: string[]; correctIndex: number; explanation: string };
  index: number;
  total: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onAnswer: (i: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuizReviewView = ({ question, index, total, selectedAnswer, showExplanation, onAnswer, onNext, onBack }: QuizReviewViewProps) => (
  <div className="min-h-screen flex flex-col" style={{
    background: "linear-gradient(180deg, hsl(36 33% 96%), hsl(38 28% 93%))",
  }}>
    <div className="px-6 py-4 flex items-center justify-between" style={{
      borderBottom: "1px solid hsl(36 45% 50% / 0.15)",
    }}>
      <button onClick={onBack} style={{ color: "hsl(230 10% 40%)" }}>
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center">
        <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28% / 0.60)" }}>
          Revisão de Erros
        </span>
        <p className="text-[10px] font-body" style={{ color: "hsl(230 20% 15% / 0.40)" }}>
          {index + 1} de {total}
        </p>
      </div>
      <div className="w-5" />
    </div>

    <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
      <p className="font-heading text-base tracking-wide leading-relaxed mb-8 text-center" style={{ color: "hsl(230 20% 12% / 0.85)" }}>
        {question.question}
      </p>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = selectedAnswer === i;
          let bg = "hsl(38 28% 93% / 0.80)";
          let border = "1px solid hsl(36 45% 50% / 0.18)";
          let textColor = "hsl(230 20% 12% / 0.70)";

          if (showExplanation) {
            if (isCorrect) {
              bg = "hsl(140 40% 45% / 0.10)";
              border = "1.5px solid hsl(140 40% 45% / 0.35)";
              textColor = "hsl(140 40% 25%)";
            } else if (isSelected && !isCorrect) {
              bg = "hsl(0 60% 50% / 0.08)";
              border = "1.5px solid hsl(0 60% 50% / 0.30)";
              textColor = "hsl(0 50% 35%)";
            }
          }

          return (
            <button
              key={i}
              onClick={() => !showExplanation && onAnswer(i)}
              disabled={showExplanation}
              className="w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3"
              style={{ background: bg, border, color: textColor }}
            >
              {showExplanation && isCorrect && <Check className="w-4 h-4 shrink-0" />}
              {showExplanation && isSelected && !isCorrect && <X className="w-4 h-4 shrink-0" />}
              <span className="font-body text-sm">{opt}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mb-6 rounded-xl p-4" style={{
          background: "hsl(36 42% 44% / 0.06)",
          border: "1px solid hsl(36 42% 44% / 0.15)",
        }}>
          <p className="text-[9px] font-heading tracking-[0.25em] uppercase mb-2" style={{ color: "hsl(36 42% 40%)" }}>
            Explicação
          </p>
          <p className="text-xs font-body leading-relaxed" style={{ color: "hsl(230 20% 12% / 0.65)" }}>
            {question.explanation}
          </p>
        </div>
      )}

      {showExplanation && (
        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-xl font-heading text-[11px] tracking-wider uppercase transition-all"
          style={{
            background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
            color: "hsl(36 33% 97%)",
            boxShadow: "0 4px 16px hsl(340 42% 28% / 0.15)",
          }}
        >
          {index + 1 < total ? "Próxima" : "Concluir Revisão"}
        </button>
      )}
    </div>
  </div>
);

export default ReviewPage;
