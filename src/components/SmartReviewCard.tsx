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
    <div className="mb-10 animate-fade-up">
      <div className="rounded-3xl overflow-hidden border-2 border-[#C8A66A]/20 bg-white/80 backdrop-blur-xl shadow-xl ring-8 ring-[#C8A66A]/5">
        <div className="p-5 border-b border-[#C8A66A]/10 bg-gradient-to-r from-[#C8A66A]/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FAF5EF] rounded-xl border border-[#C8A66A]/20">
              <Brain className="w-5 h-5 text-[#5B1F3D]" />
            </div>
            <h3 className="font-heading text-[15px] font-black tracking-tight text-[#5B1F3D]">Revisão Inteligente</h3>
          </div>
          <span className="text-[12px] font-heading uppercase tracking-[0.2em] text-[#5B1F3D] font-black leading-tight text-right">Reforço necessário</span>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-[15px] text-[#5B1F3D]/80 font-body leading-relaxed font-bold italic">
            Sua jornada encontrou névoa nestes arcanos. Que tal abrir estas portas novamente?
          </p>
          
          <div className="flex flex-wrap gap-2.5">
            {difficultArcanos.map((arcano) => (
              <button
                key={arcano!.id}
                onClick={() => navigate(`/lesson/${arcano!.id}`)}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#FAF5EF] border-2 border-[#DCCFC2]/40 hover:border-[#C8A66A]/50 transition-all text-[13px] font-bold text-[#5B1F3D] group"
              >
                <span className="text-[13px] font-black text-[#C8A66A] group-hover:scale-110 transition-transform">{arcano!.numeral}</span>
                {arcano!.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => navigate("/revisao")}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#5B1F3D] text-white text-[13px] font-heading tracking-[0.25em] uppercase transition-all hover:brightness-110 active:scale-[0.98] shadow-lg border-2 border-[#C8A66A]/30 leading-tight"
          >
            <RotateCcw className="w-4 h-4" />
            LIMPAR A NÉVOA (REVISAR)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
