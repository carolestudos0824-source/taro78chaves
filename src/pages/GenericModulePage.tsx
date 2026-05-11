import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, ChevronRight } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { useResolvedModule } from "@/hooks/use-resolved-module";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
// import mysticBg from "@/assets/mystic-bg.jpg";

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, hsl(${accent} / 0.04), hsl(36 33% 97% / 0.18), hsl(36 33% 97% / 0.28))`
        }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-28 pt-6">
        {/* ── Header with blur backdrop ── */}
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-in"
          style={{
            background: `linear-gradient(135deg, hsl(${accent} / 0.06), hsl(36 33% 97% / 0.75), hsl(${accent} / 0.03))`,
            border: `1px solid hsl(${accent} / 0.12)`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: `0 8px 32px hsl(${accent} / 0.06)`,
          }}
        >
          {/* Back + Streak row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(backRoute)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95"
              style={{
                background: "hsl(36 33% 97% / 0.7)",
                border: `1px solid hsl(${accent} / 0.15)`,
              }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "hsl(230 20% 25%)" }} />
            </button>
            <StreakCounter streak={progress.streak} />
          </div>

          {/* Category label */}
          {categoryLabel && (
            <div
              className="inline-block mb-2.5 animate-fade-in"
              style={{ animationDelay: "80ms", animationFillMode: "both" }}
            >
              <span
                className="text-[10px] font-heading uppercase tracking-[0.18em] px-3 py-1 rounded-full"
                style={{
                  color: `hsl(${accent})`,
                  background: `hsl(${accent} / 0.08)`,
                  border: `1px solid hsl(${accent} / 0.15)`,
                }}
              >
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Title block */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: "120ms", animationFillMode: "both" }}
          >
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xl">{moduleIcon}</span>
              <h1
                className="font-heading text-lg tracking-wide"
                style={{ color: "hsl(230 25% 15%)" }}
              >
                {moduleTitle}
              </h1>
            </div>
            <p
              className="font-accent text-xs italic"
              style={{ color: "hsl(230 20% 15% / 0.5)" }}
            >
              {moduleSubtitle}
            </p>
          </div>

          {/* Editorial intro */}
          {editorialIntro && (
            <p
              className="mt-3 font-accent text-[12.5px] leading-relaxed italic animate-fade-in"
              style={{
                color: "hsl(230 20% 15% / 0.55)",
                animationDelay: "200ms",
                animationFillMode: "both",
              }}
            >
              {editorialIntro}
            </p>
          )}
        </div>

        {/* XP Bar */}
        <div className="animate-fade-in" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>

        {/* Progress */}
        <div
          className="mb-6 mt-4 animate-fade-in"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          <div
            className="flex justify-between text-[10px] font-heading tracking-wider mb-1.5"
            style={{ color: "hsl(230 20% 15% / 0.5)" }}
          >
            <span>{completedCount}/{lessons.length} lições</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(36 25% 82% / 0.4)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, hsl(${accent}), hsl(${accentLight}))`,
              }}
            />
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-2.5">
          {lessons.sort((a, b) => a.order - b.order).map((lesson, idx) => {
            const completed = isCompleted(lesson.id);
            const unlocked = isUnlocked(lesson.order);
            return (
              <button
                key={lesson.id}
                onClick={() => unlocked && navigate(`${lessonRoutePrefix}/${lesson.order}`)}
                disabled={!unlocked}
                className="w-full text-left group transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${350 + idx * 60}ms`, animationFillMode: "both" }}
              >
                <div
                  className="rounded-xl p-4 flex items-center gap-3.5 transition-all"
                  style={{
                    background: completed
                      ? `hsl(${accent} / 0.08)`
                      : unlocked
                        ? "hsl(38 28% 93% / 0.80)"
                        : "hsl(38 28% 93% / 0.40)",
                    border: `1px solid ${completed
                      ? `hsl(${accent} / 0.25)`
                      : unlocked
                        ? `hsl(${accent} / 0.15)`
                        : "hsl(36 25% 82% / 0.25)"
                    }`,
                    opacity: unlocked ? 1 : 0.5,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: completed ? `hsl(${accent} / 0.12)` : `hsl(${accent} / 0.05)`,
                      border: `1px solid ${completed ? `hsl(${accent} / 0.3)` : `hsl(${accent} / 0.12)`}`,
                    }}
                  >
                    {completed ? (
                      <Check className="w-4 h-4" style={{ color: `hsl(${accent})` }} />
                    ) : !unlocked ? (
                      <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 60%)" }} />
                    ) : (
                      <span className="text-sm">{lesson.icon}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-heading text-sm tracking-wide"
                      style={{ color: "hsl(230 20% 12% / 0.80)" }}
                    >
                      {lesson.title}
                    </h3>
                    <p
                      className="font-accent text-[11px] italic truncate"
                      style={{ color: "hsl(230 20% 15% / 0.45)" }}
                    >
                      {lesson.subtitle}
                    </p>
                  </div>
                  {unlocked && (
                    <ChevronRight
                      className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform"
                      style={{ color: `hsl(${accent} / 0.35)` }}
                    />
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
