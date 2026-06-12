import { useNavigate } from "react-router-dom";
import { Check, Lock, ChevronRight } from "lucide-react";
import { PageBackControls } from "@/components/PageBackControls";

import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedModule } from "@/hooks/use-resolved-module";
import { ChaveProgress } from "@/components/ChaveProgress";
import { StreakCounter } from "@/components/StreakCounter";

interface GenericLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
}

interface GenericModulePageProps {
  moduleTitle: string;
  moduleSubtitle: string;
  moduleIcon: string;
  lessons: GenericLesson[];
  lessonRoutePrefix: string;
  backRoute?: string;
  /** Category label e.g. "Fundamentos", "Arcanos Menores" */
  categoryLabel?: string;
  /** Editorial intro phrase */
  editorialIntro?: string;
  /** Optional theme accent HSL values e.g. "210 45% 50%" */
  themeAccent?: string;
  /** Fase 4B — slug do módulo no CMS para telemetria via adaptador (DB-first). */
  moduleSlug?: string;
}

const GenericModulePage = ({
  moduleTitle,
  moduleSubtitle,
  moduleIcon,
  lessons,
  lessonRoutePrefix,
  backRoute = "/app",
  categoryLabel,
  editorialIntro,
  themeAccent,
  moduleSlug,
}: GenericModulePageProps) => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  const { isPremium } = usePremium();
  const { isStaff } = useRole();
  // Fase 4B — telemetria invisível via adaptador (DB-first com fallback).
  useResolvedModule(moduleSlug ?? null);

  const isCompleted = (id: string) => progress.completedLessons.includes(id);
  const isUnlocked = (order: number) => {
    if (bypassLocks || isStaff) return true;
    
    // Bloqueio Premium para módulos específicos
    const isPremiumModule = moduleSlug === "arquitetura-menores" || 
                           moduleSlug === "leitura-simbolica" || 
                           moduleSlug === "combinacoes" ||
                           moduleSlug === "tiragens" ||
                           moduleSlug === "espiritualidade" ||
                           moduleSlug === "mesa-taro" ||
                           moduleSlug === "leitura-aplicada" ||
                           moduleSlug === "pratica" ||
                           moduleSlug === "trabalhar-taro";
                           
    if (isPremiumModule && !isPremium) return false;

    if (order === 0) {
      // Fundamentos e Arcanos Maiores (Jornada) podem começar order 0
      if (moduleSlug === "fundamentos" || moduleSlug === "arcanos-maiores") return true;
      
      // Para outros módulos, a primeira lição pode exigir progresso anterior ou ser bloqueada por padrão
      // No caso de arquitetura-menores, se não for premium, já retornou false acima.
      // Se for premium, liberamos a primeira lição.
      return isPremium;
    }
    const prev = lessons.find(l => l.order === order - 1);
    return prev ? isCompleted(prev.id) : false;
  };

  const completedCount = lessons.filter(l => isCompleted(l.id)).length;
  const pct = Math.round((completedCount / lessons.length) * 100);

  // Theme-aware colors — fall back to gold
  const accent = themeAccent || "36 42% 44%";
  const accentLight = themeAccent ? themeAccent.replace(/\d+%\)?\s*$/, (m) => {
    const val = parseInt(m);
    return `${Math.min(val + 14, 85)}%`;
  }) : "36 45% 58%";

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — continuous, soft, premium */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)`,
          opacity: 0.95
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(243, 230, 224, 0.55) 0%, transparent 55%)"
        }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-28 pt-10">
        {/* ── Header with premium style from /app ── */}
        <div
          className="rounded-[2.5rem] p-8 md:p-10 mb-10 animate-fade-in relative overflow-hidden transition-all duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
            backdropFilter: "blur(24px)",
            border: "2.5px solid #C8A66A",
            boxShadow: "0 30px 70px rgba(91, 31, 61, 0.08), 0 0 40px rgba(200, 166, 106, 0.1)"
          }}
        >
          {/* Back + Streak row */}
          <div className="flex items-center justify-between mb-8">
            <PageBackControls variant="top" showLabel={false} className="w-12 h-12 flex items-center justify-center bg-[#FAF5EF] rounded-full border border-[#C8A66A30]" fallbackRoute={backRoute} />

            <StreakCounter streak={progress.streak} />
          </div>

          {/* Category label */}
          {categoryLabel && (
            <div
              className="inline-block mb-4 animate-fade-in"
              style={{ animationDelay: "100ms", animationFillMode: "both" }}
            >
              <span
                className="text-[11px] font-heading uppercase tracking-[0.35em] px-5 py-2 rounded-full font-black"
                style={{
                  color: "hsl(var(--gold))",
                  background: "rgba(91, 31, 61, 0.08)",
                  border: "1.5px solid hsl(var(--gold) / 0.4)",

                }}
              >
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Title block */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl filter drop-shadow-sm">{moduleIcon}</span>
              <h1
                className="font-heading text-3xl md:text-4xl tracking-tight font-black"
                style={{ color: "#5B1F3D" }}
              >
                {moduleTitle}
              </h1>
            </div>
            <p
              className="font-accent text-lg md:text-xl italic font-black leading-snug"
              style={{ color: "hsl(var(--primary) / 0.85)" }}
            >
              {moduleSubtitle}
            </p>
          </div>

          {/* Editorial intro */}
          {editorialIntro && (
            <div className="mt-8 pt-8 border-t border-[#C8A66A20]">
              <div className="flex items-center justify-center gap-4 mb-4 opacity-90">
                <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold)))" }} />
                <span className="text-[12px] font-black" style={{ color: "hsl(var(--gold))", letterSpacing: "0.4em" }}>✶ ◈ ✶</span>
                <span className="h-px w-10" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />

              </div>
              <p
                className="font-accent text-[17px] md:text-[19px] leading-relaxed italic animate-fade-in text-center"
                style={{
                  color: "#3D1429",
                  fontWeight: 900,
                  animationDelay: "250ms",
                  animationFillMode: "both",
                }}
              >
                "{editorialIntro}"
              </p>
            </div>
          )}
        </div>

        {/* Pontos Bar */}
        <div className="animate-fade-in px-2" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
          <ChaveProgress />
        </div>

        {/* Progress */}
        <div
          className="mb-8 mt-6 animate-fade-in px-2 bg-white/40 p-3 rounded-xl border border-[#C8A66A20]"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          <div
            className="flex justify-between text-[11px] font-heading tracking-wider mb-2 px-1"
            style={{ color: "hsl(var(--primary) / 0.75)" }}
          >
            <span>{completedCount}/{lessons.length} lições concluídas</span>
            <span style={{ color: "hsl(var(--primary))" }}>{pct}%</span>

          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E8DED3", border: "1px solid #D1C4B5" }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, #5B1F3D, #C8A66A)`,
              }}
            >
               <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
            </div>
          </div>
        </div>

        {/* Lessons Trail Header */}
        <div className="flex items-center gap-3 mb-5 animate-fade-in" style={{ animationDelay: "320ms", animationFillMode: "both" }}>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8A66A30] to-[#C8A66A70]" />
          <span className="text-[11px] font-heading tracking-[0.32em] uppercase" style={{ color: "#5B1F3D", fontWeight: 700 }}>
            Trilha de Aprendizado
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C8A66A30] to-[#C8A66A70]" />
        </div>

        {/* Lessons */}
        <div className="space-y-3">
          {lessons.sort((a, b) => a.order - b.order).map((lesson, idx) => {
            const completed = isCompleted(lesson.id);
            const unlocked = isUnlocked(lesson.order);
            const isCurrent = unlocked && !completed;

            return (
              <button
                key={lesson.id}
                onClick={() => unlocked && navigate(`${lessonRoutePrefix}/${lesson.order}`)}
                disabled={!unlocked}
                className="w-full text-left group transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${400 + idx * 70}ms`, animationFillMode: "both" }}
              >
                <div
                  className="rounded-[2.5rem] p-6 flex items-center gap-6 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                  style={
                    isCurrent
                      ? {
                          background: "#FFFFFF",
                          border: "2.5px solid #C8A66A",
                          boxShadow: "0 20px 50px rgba(91, 31, 61, 0.1)",
                        }
                      : completed
                        ? {
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1.5px solid rgba(200, 166, 106, 0.3)",
                          }
                        : {
                            background: "rgba(220, 207, 194, 0.15)",
                            border: "1.5px solid rgba(220, 207, 194, 0.25)",
                            opacity: 0.8,
                          }
                  }
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-md group-hover:scale-110 group-hover:shadow-2xl"
                    style={
                      isCurrent
                        ? {
                            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                            color: "#FAF5EF",
                            boxShadow: "0 8px 20px rgba(91, 31, 61, 0.25)",
                            border: "2px solid #C8A66A40"
                          }
                        : completed
                          ? {
                              background: "#FAF5EF",
                              border: "2.5px solid #5B1F3D",
                              color: "#5B1F3D",
                            }
                          : {
                              background: "rgba(220, 207, 194, 0.2)",
                              border: "2px solid rgba(91, 31, 61, 0.15)",
                              color: "#5B1F3D30",
                            }
                    }
                  >
                    {completed ? (
                      <Check className="w-6 h-6" strokeWidth={4} />
                    ) : !unlocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <span className="text-2xl group-hover:rotate-12 transition-transform duration-500">{lesson.icon}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-heading font-black tracking-[0.25em]" style={{ color: unlocked ? "hsl(var(--gold))" : "hsl(var(--primary) / 0.35)" }}>
                        LIÇÃO {lesson.order + 1}
                      </span>
                      {isCurrent && (
                        <span className="text-[8px] bg-[#C8A66A20] text-[#5B1F3D] px-3 py-1 rounded-full font-heading font-black uppercase tracking-widest animate-pulse border border-[#C8A66A30]">
                          Portal Aberto
                        </span>
                      )}
                    </div>
                    <h3
                      className="font-heading text-lg md:text-xl tracking-tight font-black leading-tight"
                      style={{ color: unlocked ? "#5B1F3D" : "#5B1F3D40" }}
                    >
                      {lesson.title}
                    </h3>
                    <p
                      className="font-body text-[13px] leading-relaxed truncate font-black mt-1"
                      style={{ color: unlocked ? "hsl(var(--primary) / 0.85)" : "hsl(var(--primary) / 0.4)" }}
                    >
                      {lesson.subtitle}
                    </p>
                  </div>
                  {unlocked && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border-2 border-[#C8A66A]/20 transition-all duration-500 group-hover:bg-[#C8A66A]/10 group-hover:border-[#C8A66A] group-hover:translate-x-2">
                      <ChevronRight
                        className="w-6 h-6 shrink-0"
                        style={{ color: "hsl(var(--gold))" }}

                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <PageBackControls variant="bottom" className="w-full pb-8" fallbackRoute={backRoute} />
      </div>
    </div>

  );
};

export default GenericModulePage;
