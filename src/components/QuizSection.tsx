import { useState, useCallback, useMemo } from "react";
import type { QuizQuestion } from "@/lib/content";
import { Check, X, ArrowRight, Trophy, RotateCcw, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  /** Called once per answered question — fire-and-forget telemetry hook. */
  onAnswer?: (questionIndex: number, selectedIndex: number, isCorrect: boolean) => void;
}

export function QuizSection({ questions = [], onComplete, onAnswer }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakes, setMistakes] = useState<{ question: QuizQuestion; selected: number }[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const current = useMemo(() => questions[currentIndex], [questions, currentIndex]);
  const isTrueFalse = current?.type === "true-false";

  const handleSelect = useCallback((optionIndex: number) => {
    if (isAnswered || !current) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    const isCorrect = optionIndex === current.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setMistakes((m) => [...m, { question: current, selected: optionIndex }]);
    }
    onAnswer?.(currentIndex, optionIndex, isCorrect);
  }, [isAnswered, current, currentIndex, onAnswer]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete(score, questions.length);
    }
  }, [currentIndex, questions.length, score, onComplete]);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-[#FAF5EF] backdrop-blur-md rounded-2xl p-8 text-center space-y-4 border border-[#C8A66A]/20 shadow-sm">
        <div className="w-16 h-16 bg-[#C8A66A]/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <Sparkles className="w-8 h-8 text-[#C8A66A]" />
        </div>
        <h3 className="font-heading text-lg text-[#5B1F3D]">Quiz não disponível</h3>
        <p className="text-sm text-[#5B1F3D]/60 italic">"O conhecimento se manifesta através da prática, mas esta lição ainda está sendo preparada."</p>
        <button 
          onClick={() => onComplete(0, 0)}
          className="px-8 py-3 rounded-full bg-[#C8A66A] text-white font-heading text-sm tracking-wider"
        >
          Continuar Jornada
        </button>
      </div>
    );
  }

  const handleReview = () => {
    setReviewMode(true);
    setReviewIndex(0);
  };

  // Review mode
  if (reviewMode && mistakes.length > 0) {
    const item = mistakes[reviewIndex];
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading tracking-[0.2em] uppercase text-[#C8A66A]">
            Revisão — {reviewIndex + 1} de {mistakes.length}
          </span>
          <button
            onClick={() => setReviewMode(false)}
            className="text-xs font-heading font-black tracking-wider text-[#5B1F3D] hover:underline"
          >
            Fechar revisão
          </button>
        </div>

        <div className="rounded-2xl p-6 bg-[#FAF5EF] border-2 border-[#C8A66A]/20 shadow-xl">
          <p className="font-heading text-lg font-black mb-5 text-[#5B1F3D]">{item.question.question}</p>
          <div className="space-y-3">
            {item.question.options.map((option, i) => {
              const isCorrect = i === item.question.correctIndex;
              const isWrong = i === item.selected;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl flex items-center gap-3 transition-all border-2"
                  style={{
                    background: isCorrect ? "rgba(200, 166, 106, 0.1)" : isWrong ? "rgba(91, 31, 61, 0.05)" : "white",
                    borderColor: isCorrect ? "rgba(200, 166, 106, 0.4)" : isWrong ? "rgba(91, 31, 61, 0.2)" : "rgba(200, 166, 106, 0.1)",
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 border-2"
                    style={{
                      borderColor: isCorrect ? "#C8A66A" : isWrong ? "#5B1F3D" : "rgba(91, 31, 61, 0.2)",
                      color: isCorrect ? "#C8A66A" : isWrong ? "#5B1F3D" : "rgba(91, 31, 61, 0.5)",
                    }}
                  >
                    {isCorrect ? <Check className="w-4 h-4" /> : isWrong ? <X className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium text-[#5B1F3D]">{option}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 p-5 rounded-xl bg-white border border-[#C8A66A]/30 shadow-inner">
            <p className="text-sm font-accent italic leading-relaxed text-[#5B1F3D]/80">{item.question.explanation}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {reviewIndex < mistakes.length - 1 ? (
            <button
              onClick={() => setReviewIndex((i) => i + 1)}
              className="px-10 py-4 rounded-full font-heading text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all hover:scale-105 bg-[#5B1F3D] text-white shadow-xl"
            >
              Próximo erro <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setReviewMode(false)}
              className="px-10 py-4 rounded-full font-heading text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all hover:scale-105 bg-[#C8A66A] text-white shadow-xl"
            >
              Concluir revisão <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Finished
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = percentage === 100;
    return (
      <motion.div 
        className="text-center py-10 space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="relative inline-block">
          <motion.div
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-white border-4 border-[#C8A66A] shadow-2xl"
            initial={{ rotate: -20, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Trophy className="w-12 h-12 text-[#C8A66A]" />
          </motion.div>
          {isPerfect && (
            <motion.div 
              className="absolute -top-2 -right-2 bg-[#5B1F3D] p-2 rounded-full border-2 border-white shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Star className="w-4 h-4 text-[#C8A66A]" />
            </motion.div>
          )}
        </div>

        <div>
          <h3 className="font-heading text-3xl font-black mb-2 bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] bg-clip-text text-transparent">
            {isPerfect ? "Perfeição Pura!" : percentage >= 70 ? "Brilhante!" : "Jornada de Sabedoria"}
          </h3>
          <p className="text-[17px] font-accent font-bold text-[#5B1F3D]">
            Você integrou {score} de {questions.length} saberes ({percentage}%)
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-[11px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A]">
            Energia de Troca
          </div>
          <div className="text-2xl font-heading font-black text-[#5B1F3D]">
            +{score * 10} XP
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          {mistakes.length > 0 && (
            <button
              onClick={handleReview}
              className="w-full max-w-xs py-4 rounded-full font-heading text-[11px] font-black tracking-[0.2em] uppercase transition-all hover:scale-105 flex items-center justify-center gap-3 bg-white border-2 border-[#C8A66A]/40 text-[#5B1F3D] shadow-lg"
            >
              <RotateCcw className="w-4 h-4 text-[#C8A66A]" />
              Revisar {mistakes.length} {mistakes.length === 1 ? "Aprendizado" : "Aprendizados"}
            </button>
          )}
          
          <button
            onClick={() => onComplete(score, questions.length)}
            className="w-full max-w-xs py-5 rounded-2xl font-heading text-[12px] font-black tracking-[0.3em] uppercase transition-all hover:scale-105 bg-[#5B1F3D] text-white shadow-2xl border-2 border-[#C8A66A]"
          >
            Continuar Travessia
          </button>
        </div>
      </motion.div>
    );
  }

  // Active quiz
  return (
    <motion.div 
      className="bg-white/75 backdrop-blur-md rounded-2xl p-8 space-y-6 shadow-sm border border-gold/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {questions.map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 flex-1 rounded-full"
            initial={false}
            animate={{
              backgroundColor: i < currentIndex ? "hsl(36, 45%, 58%)" : i === currentIndex ? "rgba(200, 166, 106, 0.5)" : "rgba(220, 207, 194, 0.5)",
              scaleY: i === currentIndex ? 1.5 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs tracking-widest font-body uppercase opacity-60" style={{ color: "#3d1f2e" }}>
            {isTrueFalse ? "Verdadeiro ou Falso" : "Múltipla Escolha"}
          </span>
          <span className="text-xs tracking-widest font-body uppercase opacity-60" style={{ color: "#3d1f2e" }}>
            — {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <h4 className="font-display text-xl font-semibold leading-relaxed mb-6 flex items-start gap-2" style={{ color: "#3d1f2e" }}>
          <span className="text-gold mt-1 shrink-0" aria-hidden="true">✦</span>
          <span>{current.question}</span>
        </h4>

        <div className={`grid gap-3 ${isTrueFalse ? "grid-cols-2" : "grid-cols-1"}`}>
          {current.options.map((option, i) => {
            const isCorrectAnswer = isAnswered && i === current.correctIndex;
            const isWrongSelected = isAnswered && i === selectedOption && i !== current.correctIndex;

            let optionClass =
              "bg-white/70 backdrop-blur-sm border-gold/30 hover:bg-white/90 hover:border-gold/60 hover:shadow-sm";
            let textColorStyle: string = "#5B1F3D";
            let iconColor = "#C8A66A";

            if (isCorrectAnswer) {
              optionClass = "bg-[#FAF5EF] border-[#C8A66A] shadow-inner";
              textColorStyle = "#5B1F3D";
              iconColor = "#5B1F3D";
            } else if (isWrongSelected) {
              optionClass = "bg-[#5B1F3D]/5 border-[#5B1F3D]/30";
              textColorStyle = "#5B1F3D";
              iconColor = "#5B1F3D";
            } else if (isAnswered) {
              optionClass = "bg-white/40 backdrop-blur-sm border-[#C8A66A]/20 opacity-60";
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={`w-full text-left rounded-xl px-5 py-4 text-base font-body cursor-pointer transition-all duration-200 border flex items-center gap-3 ${optionClass} ${
                  !isAnswered ? "active:scale-[0.99]" : "cursor-default"
                } ${isTrueFalse ? "justify-center text-center" : ""}`}
                animate={isWrongSelected ? { x: [-5, 5, -5, 5, 0] } : isCorrectAnswer ? { scale: [1, 1.02, 1] } : {}}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border"
                  style={{ borderColor: iconColor, color: iconColor, borderWidth: "1.5px" }}
                  aria-hidden="true"
                >
                  {isCorrectAnswer ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isWrongSelected ? (
                    <X className="w-3.5 h-3.5" />
                  ) : isTrueFalse ? (
                    i === 0 ? "V" : "F"
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span
                  className="flex-1 break-words"
                  style={{ color: textColorStyle, whiteSpace: "normal" }}
                >
                  {String(option ?? "")}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              className="mt-5 p-4 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "#FAF5EF",
                border: "1px solid rgba(200, 166, 106, 0.4)",
                boxShadow: "0 4px 12px rgba(91, 31, 61, 0.05)",
                overflow: "hidden"
              }}
            >
              <p className="text-sm font-accent italic leading-relaxed" style={{ color: "#5B1F3D" }}>
                {current.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              className="mt-5 flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button
                onClick={handleNext}
                className="px-7 py-2.5 rounded-full font-heading text-sm tracking-wider flex items-center gap-2 transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 16px hsl(36 45% 58% / 0.2)",
                }}
              >
                {currentIndex < questions.length - 1 ? "Próxima" : "Ver Resultado"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
