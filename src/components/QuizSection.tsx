import { useState, useCallback, useMemo } from "react";
import type { QuizQuestion } from "@/lib/content";
import { Check, X, ArrowRight, Trophy, RotateCcw, Sparkles, Star, Book } from "lucide-react";
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
      className="bg-[#FAF5EF] backdrop-blur-xl rounded-[2rem] p-6 md:p-10 space-y-8 shadow-2xl border-2 border-[#C8A66A]/30 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 25 }}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C8A66A]/20 rounded-tl-[2rem] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C8A66A]/20 rounded-br-[2rem] pointer-events-none" />

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <div className="text-[10px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A]">
            Jornada de Aprendizado
          </div>
          <div className="text-[11px] font-heading font-black text-[#C8A66A]">
            {currentIndex + 1} de {questions.length}
          </div>
        </div>
        <div className="h-2.5 w-full bg-white/50 rounded-full overflow-hidden border border-[#C8A66A]/10 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] rounded-full"
            initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
            animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5B1F3D]/5 flex items-center justify-center border border-[#C8A66A]/20">
            <Sparkles className="w-5 h-5 text-[#C8A66A]" />
          </div>
          <span className="text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]">
            {isTrueFalse ? "Verdadeiro ou Falso" : "Múltipla Escolha"}
          </span>
        </div>

        <motion.h4 
          key={currentIndex}
          className="font-heading text-xl md:text-2xl font-black leading-tight text-[#5B1F3D]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {current.question}
        </motion.h4>

        <div className={`grid gap-4 ${isTrueFalse ? "grid-cols-2" : "grid-cols-1"}`}>
          {current.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrectAnswer = isAnswered && i === current.correctIndex;
            const isWrongSelected = isAnswered && isSelected && !isCorrectAnswer;
            
            return (
              <motion.button
                key={`${currentIndex}-${i}`}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className="group relative w-full text-left rounded-2xl p-5 transition-all duration-300 border-2 overflow-hidden shadow-sm"
                style={{
                  background: isCorrectAnswer 
                    ? "rgba(200, 166, 106, 0.15)" 
                    : isWrongSelected 
                      ? "rgba(91, 31, 61, 0.08)" 
                      : isSelected 
                        ? "#FAF5EF" 
                        : "white",
                  borderColor: isCorrectAnswer 
                    ? "#C8A66A" 
                    : isWrongSelected 
                      ? "#5B1F3D" 
                      : isSelected 
                        ? "#C8A66A" 
                        : "rgba(200, 166, 106, 0.15)",
                }}
                whileHover={!isAnswered ? { scale: 1.01, borderColor: "rgba(200, 166, 106, 0.4)" } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                animate={isWrongSelected ? { x: [-4, 4, -4, 4, 0] } : isCorrectAnswer ? { scale: [1, 1.02, 1] } : {}}
              >
                {/* Visual indicator for feedback */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors"
                    style={{
                      borderColor: isCorrectAnswer ? "#C8A66A" : isWrongSelected ? "#5B1F3D" : isSelected ? "#C8A66A" : "rgba(200, 166, 106, 0.4)",
                      background: isCorrectAnswer ? "#C8A66A" : isWrongSelected ? "#5B1F3D" : "transparent",
                      color: isCorrectAnswer || isWrongSelected ? "white" : isSelected ? "#C8A66A" : "#C8A66A",
                    }}
                  >
                    {isCorrectAnswer ? (
                      <Check className="w-5 h-5" />
                    ) : isWrongSelected ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-black">{String.fromCharCode(65 + i)}</span>
                    )}
                  </div>
                  <span 
                    className="text-[16px] font-medium leading-relaxed flex-1"
                    style={{ color: isAnswered && !isCorrectAnswer && !isWrongSelected ? "rgba(91, 31, 61, 0.4)" : "#5B1F3D" }}
                  >
                    {option}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6 pt-2"
            >
              {/* Box de Explicação */}
              <div className="rounded-2xl p-6 bg-white border-2 border-[#C8A66A]/20 shadow-xl relative">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Book className="w-10 h-10 text-[#5B1F3D]" />
                </div>
                <div className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A] mb-3">
                  Sabedoria Integrada
                </div>
                <p className="text-[15px] font-accent italic font-bold leading-relaxed text-[#5B1F3D]/90">
                  {current.explanation}
                </p>
              </div>

              {/* Botão Próxima */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-10 py-4 rounded-full font-heading text-[12px] font-black tracking-[0.3em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 bg-[#5B1F3D] text-white shadow-2xl border-2 border-[#C8A66A]"
                >
                  {currentIndex < questions.length - 1 ? "Próxima" : "Ver Resultados"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
