import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight, RotateCcw } from "lucide-react";
import { useReview } from "@/hooks/use-review";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES } from "@/lib/content";

export const SmartReviewCard = () => {
  const navigate = useNavigate();
  const { wrongAnswers } = useReview();

  if (wrongAnswers.length === 0) return null;

  // Count errors per arcanoId
  const errorCounts = wrongAnswers.reduce((acc, curr) => {
    acc[curr.arcanoId] = (acc[curr.arcanoId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Get top 3 most difficult arcanos
  const difficultArcanos = Object.entries(errorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => {
      const arcanoId = parseInt(id);
      return ARCANOS_MAIORES.find(a => a.id === arcanoId);
    })
    .filter(Boolean);

  return (
    <div className="mb-6 animate-fade-up">
      <div className="rounded-2xl overflow-hidden border border-gold/20 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="p-4 border-b border-gold/10 bg-gold/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-plum" />
            <h3 className="font-heading text-sm font-bold tracking-wide text-plum">Revisão Inteligente</h3>
          </div>
          <span className="text-[10px] font-heading uppercase tracking-widest text-plum/40 font-bold">Sugerido</span>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-[11px] text-plum/70 font-body leading-relaxed">
            Você teve dificuldades com estes arcanos recentemente. Que tal reforçar agora?
          </p>
          
          <div className="flex flex-wrap gap-2">
            {difficultArcanos.map((arcano) => (
              <button
                key={arcano!.id}
                onClick={() => navigate(`/lesson/${arcano!.id}`)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary/10 hover:border-primary/30 transition-all text-xs font-medium text-primary-dark"
              >
                <span className="text-[10px] opacity-60">{arcano!.numeral}</span>
                {arcano!.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => navigate("/revisao")}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-heading tracking-widest uppercase transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Revisar todos os erros
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
