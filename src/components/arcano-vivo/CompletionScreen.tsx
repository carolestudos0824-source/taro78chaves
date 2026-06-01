import { ArrowLeft, ArrowRight, MapPin, Sparkles, Check, Key, ShieldCheck } from "lucide-react";
import { ReflectionSection } from "../ReflectionSection";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/hooks/use-progress";
import { useRole } from "@/hooks/use-role";


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
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { isStaff } = useRole();
  const percentage = Math.round((quizScore / quizTotal) * 100);
  const isExcellent = percentage >= 80;

  const totalArcanosCount = 78;
  const completedMaiores = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
  const completedMenores = progress.completedLessons.filter(l => 
    l.startsWith("copas-") || l.startsWith("paus-") || l.startsWith("espadas-") || l.startsWith("ouros-")
  ).length;
  const totalCompletedArcanos = completedMaiores + completedMenores;

  return (
    <div className="text-center py-10 space-y-7" style={{ animation: "fade-up 0.6s ease-out" }}>
      {/* Achievement icon */}
      <div className="relative">
        <div className="w-24 h-24 mx-auto rounded-full flex flex-col items-center justify-center transition-all duration-700 hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            border: "3px solid #C8A66A",
            boxShadow: "0 20px 50px rgba(91, 31, 61, 0.3), 0 0 30px rgba(200, 166, 106, 0.2)",
          }}
        >
          <Key className="w-10 h-10 text-[#C8A66A] animate-pulse" />
          <span className="text-[8px] font-heading font-black text-[#C8A66A] uppercase tracking-[0.2em] mt-1">Chave</span>
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
        <h2 className="font-heading text-3xl font-black mb-2" style={{
          background: "linear-gradient(135deg, #5B1F3D, #C8A66A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>Chave Conquistada</h2>
        
        {isStaff && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#5B1F3D]/10 border border-[#C8A66A]/30 text-[#5B1F3D] animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8A66A]" />
            <span className="text-[10px] font-heading font-black tracking-widest uppercase">Modo Auditoria</span>
          </div>
        )}

        <p className="text-[15px] font-medium" style={{ color: "#5B1F3D" }}>
          Você dominou o portal de <strong className="font-black text-[#C8A66A]">{arcanoName}</strong>.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#FAF5EF] border border-[#C8A66A]/30">
          <span className="text-[11px] font-heading font-black text-[#5B1F3D] uppercase tracking-wider">
            {totalCompletedArcanos} de 78 Chaves Dominadas
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <span className="block font-heading text-2xl font-black" style={{ color: "#C8A66A" }}>{percentage}%</span>
          <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase" style={{ color: "#5B1F3DCC" }}>Quiz</span>
        </div>
        <div className="w-px h-10" style={{ background: "rgba(200, 166, 106, 0.3)" }} />
        <div className="text-center">
          <span className="block font-heading text-2xl font-black" style={{ color: "#C8A66A" }}>+{percentage}%</span>
          <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase" style={{ color: "#5B1F3DCC" }}>Domínio</span>
        </div>
      </div>

      {/* Progress saved */}
      <div className="flex flex-col items-center gap-2">
        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[11px] font-heading font-black tracking-[0.2em] uppercase ${isStaff ? 'bg-[#5B1F3D]/10 border border-[#5B1F3D]/20 text-[#5B1F3D]' : 'bg-[#2D5A3D]/10 border border-[#2D5A3D]/20 text-[#2D5A3D]'}`}>
          <Check className="w-3.5 h-3.5" />
          {isStaff ? 'Teste de Fluxo Finalizado' : 'Sabedoria Integrada'}
        </div>
      </div>

      {/* Editorial transition to next arcano */}
      {nextArcano && (
        <div
          className="rounded-2xl p-6 text-left mx-auto max-w-sm animate-fade-in shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(200, 166, 106, 0.08), rgba(91, 31, 61, 0.05))",
            border: "2px solid rgba(200, 166, 106, 0.3)",
            animationDelay: "300ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-[10px] font-heading font-black tracking-[0.3em] uppercase mb-4" style={{ color: "#C8A66A" }}>
            Próximo na jornada
          </p>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-md"
              style={{
                background: "white",
                border: "2px solid rgba(200, 166, 106, 0.4)",
              }}
            >
              <span className="font-heading text-lg font-black" style={{ color: "#5B1F3D" }}>{nextArcano.numeral}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading text-xl font-black" style={{ color: "#5B1F3D" }}>{nextArcano.name}</p>
              {nextArcano.subtitle && (
                <p className="font-accent text-[13px] italic truncate font-bold" style={{ color: "rgba(91, 31, 61, 0.7)" }}>
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
      <div className="flex flex-col items-center gap-5 pt-4">
        {nextArcano && (
          <button onClick={onNextArcano}
            className="w-full max-w-sm py-6 rounded-2xl font-heading text-xs font-black tracking-[0.3em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-4 shadow-2xl border-2 border-[#C8A66A]"
            style={{
              background: "#5B1F3D",
              color: "white",
            }}
          >
            <span>Seguir Travessia</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <button onClick={() => navigate("/app")}
          className="w-full max-w-sm py-4 rounded-full font-heading text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 border-2 border-[#C8A66A]/40"
          style={{
            background: "white",
            color: "#5B1F3D",
          }}
        >
          <ArrowLeft className="w-4 h-4 text-[#C8A66A]" />
          Voltar para Home do App
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
