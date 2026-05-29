import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { MODULES_CATALOG as MODULES, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, type LearningModule } from "@/lib/content";
import { findNextLessonSuggestion } from "@/lib/content/suggestions";

const ContinuityCard = ({ lastLessonId, lastLessonName, completedLessons, completedQuizzes, hasUnfinishedReview, completedLessonIds, currentModuleId }: ContinuityCardProps) => {
  const navigate = useNavigate();

  const actions: Array<{
    label: string;
    subtitle: string;
    path: string;
    icon: typeof ArrowRight;
    priority: number;
  }> = [];

  // Smart suggestion based on all completed lessons
  if (completedLessonIds && completedLessonIds.length > 0) {
    const suggestion = findNextLessonSuggestion(completedLessonIds, currentModuleId);
    if (suggestion) {
      actions.push({ ...suggestion, icon: ArrowRight, priority: 1 });
    }
  } else {
    // If no progress, prioritize O Louco
    actions.push({
      label: "Abrir: O Louco",
      subtitle: "Sua primeira chave na jornada",
      path: "/lesson/0",
      icon: ArrowRight,
      priority: 1,
    });
  }

  if (lastLessonId && lastLessonName && !actions.find(a => a.priority === 1)) {
    actions.push({
      label: `Continuar: ${lastLessonName}`,
      subtitle: "Retome de onde parou",
      path: `/lesson/${lastLessonId}`,
      icon: ArrowRight,
      priority: 1,
    });
  }

  if (completedLessons >= 3 && hasUnfinishedReview) {
    actions.push({
      label: "Revisão rápida",
      subtitle: "Reforce o que já aprendeu",
      path: "/revisao",
      icon: RefreshCw,
      priority: 2,
    });
  }

  actions.push({
    label: "Ritual diário",
    subtitle: "Sua prática mística de hoje",
    path: "/desafios",
    icon: Sparkles,
    priority: 4,
  });

  const topActions = actions.sort((a, b) => a.priority - b.priority).slice(0, 2);
  if (topActions.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4">
        <span className="h-px flex-1 bg-[#C8A66A]/20" />
        <h2 className="font-heading text-[11px] tracking-[0.3em] uppercase font-black text-[#5B1F3D]">
          Sua Travessia
        </h2>
        <span className="h-px flex-1 bg-[#C8A66A]/20" />
      </div>
      <div className="grid gap-3">
        {topActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className="w-full group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="rounded-2xl p-5 flex items-center gap-5 bg-white border-2 border-[#DCCFC2]/40 shadow-lg hover:border-[#C8A66A]/40">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#FAF5EF] border border-[#C8A66A]/20 shadow-inner group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6 text-[#5B1F3D]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-heading text-base font-black tracking-tight text-[#5B1F3D]">
                    {action.label}
                  </h4>
                  <p className="text-[12px] font-body font-bold italic text-[#5B1F3D]/70 leading-tight">
                    {action.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1.5 transition-transform text-[#C8A66A]" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ContinuityCard;
