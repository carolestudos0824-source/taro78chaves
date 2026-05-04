import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { ReflectionSection } from "../ReflectionSection";


interface CompletionScreenProps {
  arcanoName: string;
  xpEarned: number;
  quizScore: number;
  quizTotal: number;
  nextArcano?: { id: number; name: string; numeral: string; subtitle?: string } | null;
  prevArcano?: { id: number; name: string } | null;
  isPrevCompleted?: boolean;
  onNextArcano: () => void;
  onPrevArcano: () => void;
  onBackToMap: () => void;
  isLastArcano: boolean;
}

/**
 * Phase 5: Completion with progress saved confirmation + editorial continuity
 */
export function CompletionScreen({
  arcanoName, xpEarned, quizScore, quizTotal,
  nextArcano, prevArcano, isPrevCompleted,
  onNextArcano, onPrevArcano, onBackToMap, isLastArcano, arcanoId,
}: CompletionScreenProps & { arcanoId?: number }) {
  const percentage = Math.round((quizScore / quizTotal) * 100);
  const isExcellent = percentage >= 80;

  return (
    <div className="text-center py-10 space-y-7" style={{ animation: "fade-up 0.6s ease-out" }}>
      {/* Achievement icon */}
      <div className="relative">
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(36 45% 58% / 0.15), hsl(42 70% 80% / 0.1))",
            border: "2px solid hsl(36 45% 58% / 0.3)",
            animation: "glow-breathe 3s ease-in-out infinite",
            boxShadow: "0 0 40px hsl(36 45% 58% / 0.12)",
          }}
        >
          <Sparkles className="w-8 h-8" style={{ color: "hsl(36 45% 58%)" }} />
        </div>
        {isExcellent && (
          <div
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs animate-fade-in"
            style={{
              background: "linear-gradient(135deg, hsl(42 80% 55%), hsl(36 60% 50%))",
              border: "2px solid hsl(36 33% 97%)",
              boxShadow: "0 2px 8px hsl(36 45% 58% / 0.3)",
              left: "calc(50% + 24px)",
            }}
          >
            ⭐
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading text-2xl mb-1" style={{
          background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 42% 42%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>Lição Completa</h2>
        <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>
          Você completou a jornada com <strong>{arcanoName}</strong>.
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <span className="block font-heading text-xl" style={{ color: "hsl(36 45% 58%)" }}>{percentage}%</span>
          <span className="text-[9px] font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(230 10% 50%)" }}>Quiz</span>
        </div>
        <div className="w-px h-10" style={{ background: "hsl(36 45% 58% / 0.2)" }} />
        <div className="text-center">
          <span className="block font-heading text-xl" style={{ color: "hsl(36 45% 58%)" }}>+{xpEarned}</span>
          <span className="text-[9px] font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(230 10% 50%)" }}>XP</span>
        </div>
      </div>

      {/* Progress saved */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-heading tracking-wider"
        style={{
          background: "hsl(120 40% 50% / 0.08)",
          border: "1px solid hsl(120 40% 50% / 0.2)",
          color: "hsl(120 40% 35%)",
        }}
      >
        ✓ Progresso salvo
      </div>

      {/* Editorial transition to next arcano */}
      {nextArcano && (
        <div
          className="rounded-xl p-5 text-left mx-auto max-w-sm animate-fade-in"
          style={{
            background: "linear-gradient(135deg, hsl(36 42% 44% / 0.04), hsl(340 42% 28% / 0.03))",
            border: "1px solid hsl(36 42% 44% / 0.12)",
            animationDelay: "300ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-[9px] font-heading tracking-[0.3em] uppercase mb-2" style={{ color: "hsl(36 40% 42% / 0.6)" }}>
            Próximo na jornada
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "hsl(36 42% 44% / 0.08)",
                border: "1px solid hsl(36 42% 44% / 0.2)",
              }}
            >
              <span className="font-heading text-xs" style={{ color: "hsl(36 40% 42%)" }}>{nextArcano.numeral}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm" style={{ color: "hsl(230 25% 15%)" }}>{nextArcano.name}</p>
              {nextArcano.subtitle && (
                <p className="font-accent text-[11px] italic truncate" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                  {nextArcano.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reflection Section */}
      <ReflectionSection 
        arcanoId={arcanoId !== undefined ? `maior-${arcanoId}` : arcanoName.toLowerCase()} 
      />

      {/* Navigation */}
      <div className="flex flex-col items-center gap-4 pt-2">
        {nextArcano && (
          <button onClick={onNextArcano}
            className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
              color: "hsl(36 33% 97%)",
              boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2), 0 0 40px hsl(42 70% 80% / 0.08)",
            }}
          >
            <span>Continuar a Jornada</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button onClick={onBackToMap}
          className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2"
          style={{
            background: "transparent",
            border: "1.5px solid hsl(36 45% 58% / 0.35)",
            color: "hsl(36 40% 42%)",
          }}
        >
          <MapPin className="w-4 h-4" />
          Voltar à Jornada
        </button>

        {prevArcano && isPrevCompleted && (
          <button onClick={onPrevArcano}
            className="text-xs font-heading tracking-wider transition-colors flex items-center gap-2 mt-2"
            style={{ color: "hsl(230 10% 50%)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Revisar {prevArcano.name}
          </button>
        )}
      </div>

      {/* Journey complete */}
      {isLastArcano && (
        <div className="mt-6 pt-6" style={{ borderTop: "1px solid hsl(36 45% 58% / 0.15)" }}>
          <div className="text-2xl mb-3">🎉</div>
          <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
            Jornada dos Arcanos Maiores Completa!
          </h3>
          <p className="font-accent text-sm italic max-w-sm mx-auto" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
            Do vazio fértil do Louco à dança cósmica do Mundo — você percorreu todos os 22 arquétipos da alma.
          </p>
        </div>
      )}
    </div>
  );
}
