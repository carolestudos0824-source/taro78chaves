import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Check, ChevronRight, Sparkles, Crown, User } from "lucide-react";
import { MODULES_CATALOG as MODULES, isModuleUnlocked, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, type LearningModule, type ModuleCategory } from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { useTrackEvent } from "@/hooks/use-track-event";
import { useAccess } from "@/hooks/use-access";
import OnboardingPage from "./OnboardingPage";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import BetaWelcomeBanner from "@/components/BetaWelcomeBanner";
import FeedbackNudge from "@/components/FeedbackNudge";
import RetentionBanner from "@/components/RetentionBanner";
import ContinuityCard from "@/components/ContinuityCard";
import ProgressCelebration from "@/components/ProgressCelebration";
import { SmartReviewCard } from "@/components/SmartReviewCard";
import mysticBg from "@/assets/mystic-bg.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgEstrela from "@/assets/arcano-17-estrela.jpg";

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  "foundation": "Fundação",
  "major-arcana": "Arcanos Maiores",
  "minor-arcana": "Arcanos Menores",
  "advanced": "Avançado",
  "practice": "Prática",
  "professional": "Profissional",
};

const ModulesPage = () => {
  const navigate = useNavigate();
  const { progress, loading: progressLoading, completeOnboarding } = useProgress();
  const { trackEvent } = useTrackEvent();
  const { bypassLocks } = useAccess();

  // Track return visits
  useEffect(() => {
    if (progress.onboardingCompleted) {
      const lastVisit = localStorage.getItem("last-visit-date");
      const today = new Date().toISOString().slice(0, 10);
      if (lastVisit && lastVisit !== today) {
        trackEvent("return_visit", { days_since: lastVisit });
      }
      localStorage.setItem("last-visit-date", today);
    }
  }, [progress.onboardingCompleted]);

  const handleOnboardingComplete = () => {
    completeOnboarding();
    trackEvent("onboarding_completed");
  };

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-heading tracking-wider">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!progress.onboardingCompleted) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  const grouped = MODULES.reduce<Record<ModuleCategory, LearningModule[]>>((acc, mod) => {
    if (!acc[mod.category]) acc[mod.category] = [];
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<ModuleCategory, LearningModule[]>);

  const categoryOrder: ModuleCategory[] = ["foundation", "major-arcana", "minor-arcana", "advanced", "practice", "professional"];

  const getModuleProgress = (mod: LearningModule): number => {
    if (mod.id === "arcanos-maiores") {
      const completed = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
      return Math.round((completed / 22) * 100);
    }
    if (mod.id === "fundamentos") {
      const completed = progress.completedLessons.filter(l => l.startsWith("fund-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (["copas", "paus", "espadas", "ouros"].includes(mod.id)) {
      const completed = progress.completedLessons.filter(l => l.startsWith(`${mod.id}-`)).length;
      return Math.round((completed / 14) * 100);
    }
    if (mod.id === "cartas-corte") {
      const completed = progress.completedLessons.filter(l => l.startsWith("corte-")).length;
      return Math.round((completed / mod.totalLessons) * 100);
    }
    if (mod.id === "combinacoes") {
      const completed = progress.completedLessons.filter(l => l.startsWith("comb-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (mod.id === "tiragens") {
      const completed = progress.completedLessons.filter(l => l.startsWith("tir-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (mod.id === "amor") {
      const completed = progress.completedLessons.filter(l => l.startsWith("amor-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (mod.id === "pratica") {
      const completed = progress.completedLessons.filter(l => l.startsWith("prat-")).length;
      return Math.round((completed / 10) * 100);
    }
    if (mod.id === "leitura-simbolica") {
      const completed = progress.completedLessons.filter(l => l.startsWith("ls-")).length;
      return Math.round((completed / mod.totalLessons) * 100);
    }
    if (mod.id === "arquitetura-menores") {
      const completed = progress.completedLessons.filter(l => l.startsWith("am-")).length;
      return Math.round((completed / mod.totalLessons) * 100);
    }
    if (mod.id === "espiritualidade") {
      const completed = progress.completedLessons.filter(l => l.startsWith("esp-")).length;
      return Math.round((completed / mod.totalLessons) * 100);
    }
    if (mod.id === "mesa-taro") {
      const completed = progress.completedLessons.filter(l => l.startsWith("mesa-")).length;
      return Math.round((completed / mod.totalLessons) * 100);
    }
    if (mod.id === "leitura-aplicada") {
      const completed = progress.completedLessons.filter(l => l.startsWith("la-")).length;
      return Math.round((completed / mod.totalLessons) * 100);
    }
    if (mod.id === "trabalhar-taro") {
      const completed = progress.completedLessons.filter(l => l.startsWith("tt-")).length;
      return Math.round((completed / mod.totalLessons) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.10) 0%, hsl(36 33% 97% / 0.05) 30%, hsl(36 33% 97% / 0.08) 70%, hsl(36 33% 97% / 0.22) 100%)"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/50 backdrop-blur-sm" style={{
        borderBottom: "1px solid hsl(36 45% 50% / 0.20)",
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.35em] uppercase font-body mb-1.5 flex items-center gap-1.5" style={{ color: "hsl(340 42% 28%)", opacity: 0.4 }}>
                <span style={{ color: "hsl(36 40% 42%)" }}>✦</span>
                A Jornada do Louco
                <span style={{ color: "hsl(36 40% 42%)" }}>✦</span>
              </span>
              <h1 className="font-display font-normal text-3xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 22%), hsl(36 35% 28%), hsl(36 45% 44%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 1px 2px hsl(36 45% 50% / 0.20))"
              }}>
                Sua Jornada
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <StreakCounter streak={progress.streak} />
              <button onClick={() => navigate("/perfil")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105" style={{
                background: "hsl(36 45% 58% / 0.10)",
                border: "1px solid hsl(36 45% 58% / 0.20)",
              }}>
                <User className="w-4 h-4" style={{ color: "hsl(340 42% 26%)" }} />
              </button>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>
      </header>

      {/* Modules grid */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Progress celebration toast */}
        <ProgressCelebration
          xp={progress.xp}
          level={progress.level}
          streak={progress.streak}
          completedLessons={progress.completedLessons.length}
        />

        {/* Beta welcome banner */}
        <BetaWelcomeBanner />

        {/* Smart Review — Focus on conversion and retention */}
        <SmartReviewCard />

        {/* Decorative tarot cards */}
        <div className="flex justify-center gap-3 py-4">
          <img src={imgLouco} alt="" className="w-16 rounded-lg shadow-md opacity-90 object-cover -rotate-6" loading="lazy" />
          <img src={imgSacerdotisa} alt="" className="w-16 rounded-lg shadow-md opacity-90 object-cover rotate-0" loading="lazy" />
          <img src={imgEstrela} alt="" className="w-16 rounded-lg shadow-md opacity-90 object-cover rotate-6" loading="lazy" />
        </div>

        {/* Retention banner - motivational messages */}
        <RetentionBanner
          streak={progress.streak}
          completedLessons={progress.completedLessons.length}
          xp={progress.xp}
          level={progress.level}
          lastActive={progress.lastActive}
        />

        {/* Continuity suggestions */}
        <ContinuityCard
          lastLessonId={null}
          lastLessonName={null}
          completedLessons={progress.completedLessons.length}
          completedQuizzes={progress.completedQuizzes.length}
          hasUnfinishedReview={progress.completedLessons.length > progress.completedQuizzes.length}
          completedLessonIds={progress.completedLessons}
        />

        {/* Feedback nudge (after 3+ lessons) */}
        <FeedbackNudge lessonsCompleted={progress.completedLessons.length} />

        {categoryOrder.map(cat => {
          const mods = grouped[cat];
          if (!mods || mods.length === 0) return null;

          return (
            <section key={cat} className="mb-10">
              <div className="flex items-center justify-center mb-3">
                <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50" loading="lazy" width={800} height={512} />
              </div>
              <h2 className="t-section-title text-center mb-5" style={{
                color: "hsl(340 42% 24%)",
                opacity: 0.4,
                textShadow: "0 1px 2px hsl(340 42% 28% / 0.12)"
              }}>
                {CATEGORY_LABELS[cat]}
              </h2>

              <div className="space-y-3">
                {mods.map((mod, i) => {
                  const unlocked = bypassLocks || isModuleUnlocked(mod.id, progress.completedModules);
                  const isCompleted = progress.completedModules.includes(mod.id);
                  const prog = getModuleProgress(mod);
                  const isCurrent = unlocked && !isCompleted;

                  return (
                    <button
                      key={mod.id}
                      onClick={() => unlocked && navigate(mod.route)}
                      disabled={!unlocked}
                      className="w-full text-left group transition-all duration-500"
                      style={{ animation: "fade-up 0.5s ease-out both", animationDelay: `${i * 80}ms` }}
                    >
                      <div className="relative overflow-hidden rounded-xl transition-all duration-400" style={isCurrent ? {
                        background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(36 33% 95% / 0.90))",
                        backdropFilter: "blur(18px)",
                        border: "1.5px solid hsl(340 42% 28% / 0.35)",
                        boxShadow: "0 6px 28px hsl(340 42% 28% / 0.10), 0 0 40px hsl(42 70% 78% / 0.06)",
                      } : isCompleted ? {
                        background: "hsl(38 28% 94% / 0.80)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid hsl(36 42% 52% / 0.30)",
                        boxShadow: "0 3px 14px hsl(36 45% 55% / 0.06)"
                      } : {
                        background: "hsl(36 18% 90% / 0.45)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid hsl(36 22% 80% / 0.45)"
                      }}>
                        <div className="p-5 flex items-center gap-4">
                          {/* Icon circle */}
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500" style={isCurrent ? {
                            border: "2px solid hsl(340 42% 26% / 0.45)",
                            background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 45% 55% / 0.12))",
                            boxShadow: "0 0 20px hsl(340 42% 28% / 0.12)"
                          } : isCompleted ? {
                            border: "2px solid hsl(36 42% 45% / 0.40)",
                            background: "hsl(38 28% 94% / 0.90)"
                          } : {
                            border: "1.5px solid hsl(36 22% 75% / 0.50)",
                            background: "hsl(36 18% 90% / 0.55)"
                          }}>
                            {isCompleted ? (
                              <Check className="w-5 h-5" style={{ color: "hsl(36 42% 38%)" }} />
                            ) : unlocked ? (
                              (() => {
                                const suitGlyph: Record<string, string> = {
                                  copas: "♥",
                                  paus: "♣",
                                  espadas: "♠",
                                  ouros: "♦",
                                };
                                const glyph = suitGlyph[mod.id];
                                if (glyph) {
                                  return (
                                    <span className="font-display text-lg leading-none" style={{ color: "hsl(340 42% 22%)" }}>
                                      {glyph}
                                    </span>
                                  );
                                }
                                return <span className="text-lg">{mod.icon}</span>;
                              })()
                            ) : (
                              <Lock className="w-4 h-4" style={{ color: "hsl(230 10% 45% / 0.30)" }} />
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                              <span className="t-kicker" style={{
                                color: isCurrent ? "hsl(340 42% 22%)" : isCompleted ? "hsl(36 42% 40%)" : "hsl(230 10% 45% / 0.30)"
                              }}>
                                {mod.symbol}
                              </span>
                              <h3 className="t-card-title truncate" style={isCurrent ? {
                                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 26%))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                              } : isCompleted ? {
                                color: "hsl(230 20% 12% / 0.75)"
                              } : {
                                color: "hsl(230 10% 45% / 0.30)"
                              }}>
                                {mod.name}
                              </h3>
                            </div>
                            <p className="t-card-subtitle truncate" style={{
                              color: isCurrent ? "hsl(230 20% 15% / 0.55)" : isCompleted ? "hsl(230 20% 15% / 0.45)" : "hsl(230 10% 45% / 0.18)"
                            }}>
                              {mod.subtitle}
                            </p>
                            {/* Progress bar for modules with content */}
                            {isCurrent && prog > 0 && (
                              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(36 18% 84%)", border: "1px solid hsl(36 22% 75% / 0.50)" }}>
                                <div className="h-full rounded-full" style={{
                                  width: `${prog}%`,
                                  background: "linear-gradient(90deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                                }} />
                              </div>
                            )}
                          </div>

                          {/* Arrow */}
                          {unlocked && (
                            <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" style={{
                              color: isCurrent ? "hsl(340 42% 28% / 0.50)" : "hsl(36 42% 45% / 0.40)"
                            }} />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* ═══════════════ STUDY TOOLS ═══════════════ */}
        <section className="mb-8">
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-50" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="t-section-title text-center mb-5" style={{
            color: "hsl(340 42% 24%)",
            opacity: 0.4,
            textShadow: "0 1px 2px hsl(340 42% 28% / 0.12)"
          }}>
            Ferramentas de Estudo
          </h2>
          <div className="space-y-2.5">
            {[
              { icon: "◎", label: "A Jornada do Louco", desc: "O mapa iniciático — do Louco ao Mundo", route: "/jornada-do-louco" },
              { icon: "🔄", label: "Revisão", desc: "Flashcards e revisão espaçada", route: "/revisao" },
              { icon: "🔥", label: "Desafio Diário", desc: "Pratique todos os dias com desafios únicos", route: "/desafios" },
              { icon: "📚", label: "Biblioteca de Símbolos", desc: "Consulte cores, animais e objetos do tarô", route: "/biblioteca" },
              { icon: "📋", label: "Rotina de Estudo", desc: "Seu plano de estudo personalizado", route: "/rotina" },
              { icon: "🏆", label: "Certificados", desc: "Conquistas e diplomas de conclusão", route: "/certificados" },
            ].map((tool, i) => (
              <button
                key={tool.route}
                onClick={() => navigate(tool.route)}
                className="w-full text-left group transition-all duration-300"
              >
                <div className="rounded-xl p-4 flex items-center gap-3.5 transition-all duration-300" style={{
                  background: "linear-gradient(145deg, hsl(38 28% 93% / 0.80), hsl(36 33% 95% / 0.75))",
                  backdropFilter: "blur(12px)",
                  border: "1px solid hsl(36 42% 52% / 0.20)",
                }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
                    background: "hsl(36 45% 58% / 0.08)",
                    border: "1px solid hsl(36 45% 58% / 0.18)",
                  }}>
                    <span className="text-sm">{tool.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="t-card-title" style={{ color: "hsl(230 20% 12% / 0.80)" }}>
                      {tool.label}
                    </h3>
                    <p className="t-card-subtitle truncate" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                      {tool.desc}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.35)" }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Premium CTA - only after some progress */}
        {progress.completedLessons.length >= 2 && (
          <section className="mb-8">
            <button
              onClick={() => navigate("/premium")}
              className="w-full group rounded-2xl border border-white/40 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{
                  background: "linear-gradient(135deg, hsl(36 45% 58% / 0.18), hsl(340 42% 30% / 0.18))",
                  border: "1px solid hsl(36 45% 58% / 0.25)",
                }}>
                  <Crown className="w-5 h-5" style={{ color: "hsl(36 45% 50%)" }} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="t-card-title" style={{ color: "hsl(340 42% 24%)" }}>
                    Jornada Completa
                  </h3>
                  <p className="t-card-subtitle" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                    Acesse todos os aprofundamentos, trilhas e certificados
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
              </div>
            </button>
          </section>
        )}

        {/* Bottom ornament */}
        <div className="flex items-center justify-center pt-4 pb-24">
          <img src={ornamentDivider} alt="" className="w-28 h-auto opacity-40" loading="lazy" width={800} height={512} />
        </div>
      </main>
    </div>
  );
};

export default ModulesPage;
