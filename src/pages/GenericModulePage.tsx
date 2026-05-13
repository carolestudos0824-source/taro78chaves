import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, ChevronRight } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedModule } from "@/hooks/use-resolved-module";
import { XPBar } from "@/components/XPBar";
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
  // Fase 4B — telemetria invisível via adaptador (DB-first com fallback).
  useResolvedModule(moduleSlug ?? null);

  const isCompleted = (id: string) => progress.completedLessons.includes(id);
  const isUnlocked = (order: number) => {
    if (bypassLocks) return true;
    if (order === 0) return true;
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
            <button
              onClick={() => navigate(backRoute)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-[#FAF5EF] border border-[#C8A66A30] shadow-sm"
              style={{ color: "#5B1F3D" }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
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
                  color: "#C8A66A",
                  background: "rgba(91, 31, 61, 0.05)",
                  border: "1.5px solid rgba(200, 166, 106, 0.3)",
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
              style={{ color: "#5B1F3D99" }}
            >
              {moduleSubtitle}
            </p>
          </div>

          {/* Editorial intro */}
          {editorialIntro && (
            <div className="mt-8 pt-8 border-t border-[#C8A66A20]">
              <div className="flex items-center justify-center gap-4 mb-4 opacity-90">
                <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #C8A66A)" }} />
                <span className="text-[12px] font-black" style={{ color: "#C8A66A", letterSpacing: "0.4em" }}>✶ ◈ ✶</span>
                <span className="h-px w-10" style={{ background: "linear-gradient(90deg, #C8A66A, transparent)" }} />
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

        {/* XP Bar */}
        <div className="animate-fade-in px-2" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>

        {/* Progress */}
        <div
          className="mb-8 mt-6 animate-fade-in px-2 bg-white/40 p-3 rounded-xl border border-[#C8A66A20]"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          <div
            className="flex justify-between text-[11px] font-heading tracking-wider mb-2 px-1"
            style={{ color: "#5B1F3DAA" }}
          >
            <span>{completedCount}/{lessons.length} lições concluídas</span>
            <span style={{ color: "#5B1F3D" }}>{pct}%</span>
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
                className="w-full text-left group transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${350 + idx * 60}ms`, animationFillMode: "both" }}
              >
                <div
                  className="rounded-2xl p-4 flex items-center gap-4 transition-all relative overflow-hidden group-hover:translate-x-1"
                  style={
                    isCurrent
                      ? {
                          background: "#FFFFFF",
                          border: "1.5px solid #C8A66A",
                          boxShadow: "0 10px 25px rgba(200, 166, 106, 0.12)",
                        }
                      : completed
                        ? {
                            background: "rgba(250, 245, 239, 0.8)",
                            border: "1px solid #C8A66A30",
                          }
                        : {
                            background: "rgba(220, 207, 194, 0.3)",
                            border: "1px solid #D1C4B540",
                            opacity: 0.6,
                          }
                  }
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                    style={
                      isCurrent
                        ? {
                            background: "linear-gradient(135deg, #5B1F3D, #8B3D5A)",
                            color: "#FAF5EF",
                            boxShadow: "0 4px 12px rgba(91, 31, 61, 0.2)",
                          }
                        : completed
                          ? {
                              background: "#F3E6E0",
                              border: "1px solid #C8A66A",
                              color: "#C8A66A",
                            }
                          : {
                              background: "#DCCFC240",
                              border: "1px solid #DCCFC2",
                              color: "#5B1F3D40",
                            }
                    }
                  >
                    {completed ? (
                      <Check className="w-5 h-5" />
                    ) : !unlocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <span className="text-lg">{lesson.icon}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-heading font-bold" style={{ color: unlocked ? "#5B1F3D" : "#5B1F3D40" }}>
                        LIÇÃO {lesson.order + 1}
                      </span>
                      {isCurrent && (
                        <span className="text-[7px] bg-[#C8A66A20] text-[#5B1F3D] px-2 py-0.5 rounded-full font-heading uppercase animate-pulse">
                          Próxima
                        </span>
                      )}
                    </div>
                    <h3
                      className="font-heading text-sm md:text-base tracking-wide"
                      style={{ color: unlocked ? "#5B1F3D" : "#5B1F3D40" }}
                    >
                      {lesson.title}
                    </h3>
                    <p
                      className="font-body text-[12px] leading-relaxed truncate"
                      style={{ color: unlocked ? "#5B1F3D" : "#5B1F3D40", fontWeight: 700 }}
                    >
                      {lesson.subtitle}
                    </p>
                  </div>
                  {unlocked && (
                    <ChevronRight
                      className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform"
                      style={{ color: "#C8A66A" }}
                    />
                  )}
                  
                  {completed && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A66A20]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GenericModulePage;
