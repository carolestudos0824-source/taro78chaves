import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Flame, BookOpen, RefreshCw, Sun, Target, TrendingUp, Check } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { MODULES_CATALOG as MODULES, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, getArcanoFull as getArcanoById, isModuleUnlocked } from "@/lib/content";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const StudyRoutinePage = () => {
  const navigate = useNavigate();
  const { progress, isArcanoCompleted, isArcanoUnlocked, getCurrentArcanoId, completedCount, journeyProgress } = useProgress();

  // ─── Current lesson ───
  const currentArcanoId = getCurrentArcanoId();
  const currentArcano = getArcanoById(currentArcanoId);
  const currentModule = MODULES.find(m => {
    if (progress.completedModules.includes(m.id)) return false;
    return isModuleUnlocked(m.id, progress.completedModules);
  });

  // ─── Daily challenges status ───
  const todayStr = new Date().toISOString().slice(0, 10);
  const dailySaved = localStorage.getItem("daily-challenges");
  let dailyCompleted = 0;
  let dailyTotal = 6;
  if (dailySaved) {
    try {
      const parsed = JSON.parse(dailySaved);
      if (parsed.date === todayStr) {
        dailyCompleted = parsed.items.filter((c: any) => c.completed).length;
        dailyTotal = parsed.items.length;
      }
    } catch {}
  }
  const dailyDone = dailyCompleted === dailyTotal && dailyCompleted > 0;

  // ─── Pending review (lessons completed but quiz not done) ───
  const pendingReviews = progress.completedLessons
    .filter(l => l.startsWith("arcano-"))
    .filter(l => {
      const id = parseInt(l.replace("arcano-", ""));
      return !progress.completedQuizzes.includes(`quiz-arcano-${id}`);
    })
    .slice(0, 3);

  // ─── Weekly activity (simple: count days with activity this week) ───
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const isToday = dateStr === todayStr;
    // Check if there was activity (simplified: check localStorage for daily challenges)
    let active = false;
    if (dateStr === todayStr && dailyCompleted > 0) active = true;
    if (dateStr < todayStr) {
      // Approximate: check if date matches lastActive
      active = progress.lastActive.startsWith(dateStr);
    }
    return { day: WEEKDAYS[i], date: d.getDate(), isToday, active };
  });

  const activeDaysThisWeek = weekDays.filter(d => d.active).length;

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-foreground pb-bottom-nav">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#FAF5EF] border-b border-[#C8A66A]/10">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, #C8A66A1A 0%, transparent 70%)",
        }} />
        
        <div className="relative max-w-lg mx-auto px-6 pt-10 pb-8">
          <button
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 hover:opacity-70 transition-all mb-8 group text-[#5B1F3D]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase">Voltar</span>
          </button>

          <div className="text-center">
            <div className="text-[10px] tracking-[0.4em] uppercase font-heading font-black mb-3" style={{ color: "#C8A66A" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="font-heading text-4xl font-black tracking-tight mb-2" style={{ color: "#5B1F3D" }}>
              Seu Ritual
            </h1>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-body text-[13px] font-bold uppercase tracking-widest opacity-60" style={{ color: "#5B1F3D" }}>
                O caminho de hoje na jornada
              </p>
              <div className="h-0.5 w-12 bg-[#C8A66A]/30 my-2 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-5">

        {/* ═══════════════ WEEKLY OVERVIEW ═══════════════ */}
        <div className="rounded-xl p-5" style={{
          background: "hsl(38 28% 93% / 0.75)",
          border: "1px solid hsl(36 45% 50% / 0.18)",
        }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: "hsl(340 42% 28%)" }} />
              <span className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                Semana
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" style={{ color: "hsl(340 42% 28%)" }} />
              <span className="font-heading text-xs" style={{ color: "hsl(340 42% 28%)" }}>
                {progress.streak} {progress.streak === 1 ? "dia" : "dias"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center">
                <div className="text-[9px] font-body mb-1" style={{
                  color: d.isToday ? "hsl(340 42% 28%)" : "hsl(230 15% 30% / 0.35)",
                }}>
                  {d.day}
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto transition-all" style={d.active ? {
                  background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 2px 8px hsl(340 42% 28% / 0.20)",
                } : d.isToday ? {
                  background: "hsl(36 45% 58% / 0.12)",
                  border: "1.5px solid hsl(36 45% 58% / 0.30)",
                  color: "hsl(340 42% 22%)",
                } : {
                  background: "hsl(36 18% 90% / 0.50)",
                  color: "hsl(230 15% 30% / 0.30)",
                }}>
                  {d.active ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="font-heading text-xs">{d.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] font-body text-center mt-3" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
            {activeDaysThisWeek} de 7 dias ativos esta semana
          </div>
        </div>

        {/* ═══════════════ TODAY'S ACTIONS ═══════════════ */}
        <div>
          <div className="flex items-center justify-center mb-3">
            <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
          </div>
          <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
            O que fazer hoje
          </h2>

          <div className="space-y-2.5">

            {/* 1. Daily Ritual */}
            <RoutineCard
              icon={<Sun className="w-4 h-4" />}
              iconColor="hsl(36 45% 50%)"
              title="Ritual Diário"
              subtitle={dailyDone ? "Completo ✦" : `${dailyCompleted}/${dailyTotal} desafios`}
              completed={dailyDone}
              accent="hsl(36 45% 58%)"
              onClick={() => navigate("/desafios")}
            />

            {/* 2. Current lesson */}
            {currentArcano && completedCount < 22 && (
              <RoutineCard
                icon={<BookOpen className="w-4 h-4" />}
                iconColor="hsl(340 42% 28%)"
                title={`Continuar: ${currentArcano.name}`}
                subtitle={currentArcano.subtitle}
                completed={false}
                accent="hsl(340 42% 30%)"
                onClick={() => navigate(`/lesson/${currentArcanoId}`)}
              />
            )}

            {/* 3. Current module (non-arcanos) */}
            {currentModule && currentModule.id !== "arcanos-maiores" && (
              <RoutineCard
                icon={<span className="text-sm">{currentModule.icon}</span>}
                iconColor="hsl(340 42% 28%)"
                title={`Módulo: ${currentModule.name}`}
                subtitle={currentModule.subtitle}
                completed={false}
                accent="hsl(340 42% 30%)"
                onClick={() => navigate(currentModule.route)}
              />
            )}

            {/* 4. Pending review */}
            {pendingReviews.length > 0 && (
              <RoutineCard
                icon={<RefreshCw className="w-4 h-4" />}
                iconColor="hsl(280 35% 45%)"
                title="Revisão Pendente"
                subtitle={`${pendingReviews.length} arcano${pendingReviews.length > 1 ? "s" : ""} sem quiz concluído`}
                completed={false}
                accent="hsl(280 35% 45%)"
                onClick={() => navigate("/revisao")}
              />
            )}

            {/* 5. Next module preview */}
            {currentModule && (() => {
              const nextMod = MODULES.find(m => m.order === currentModule.order + 1);
              if (!nextMod || progress.completedModules.includes(nextMod.id)) return null;
              return (
                <RoutineCard
                  icon={<Target className="w-4 h-4" />}
                  iconColor="hsl(230 15% 30% / 0.40)"
                  title={`Próximo: ${nextMod.name}`}
                  subtitle={nextMod.subtitle}
                  completed={false}
                  accent="hsl(230 15% 30%)"
                  locked
                />
              );
            })()}
          </div>
        </div>

        {/* ═══════════════ JOURNEY PROGRESS ═══════════════ */}
        <div>
          <div className="flex items-center justify-center mb-3">
            <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
          </div>
          <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
            Visão Geral
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Arcanos" value={`${completedCount}/22`} sub={`${journeyProgress}%`} />
            <StatCard label="Módulos" value={`${progress.completedModules.length}/${MODULES.length}`} sub={`${Math.round((progress.completedModules.length / MODULES.length) * 100)}%`} />
            <StatCard label="Sequência" value={`${progress.streak}`} sub="dias" />
            <StatCard label="XP Total" value={`${progress.xp}`} sub={`Nível ${progress.level}`} />
          </div>
        </div>

        {/* Motivational */}
        <div className="text-center pt-4">
          <div className="text-lg mb-2" style={{ color: "hsl(36 45% 58% / 0.40)" }}>⟡</div>
          <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.35)" }}>
            "A constância transforma a estudante em mestra."
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ───

interface RoutineCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  subtitle: string;
  completed: boolean;
  accent: string;
  locked?: boolean;
  onClick?: () => void;
}

const RoutineCard = ({ icon, iconColor, title, subtitle, completed, accent, locked, onClick }: RoutineCardProps) => (
  <button
    onClick={locked ? undefined : onClick}
    disabled={locked}
    className="w-full text-left group transition-all duration-300"
  >
    <div className="rounded-xl p-4 flex items-center gap-3.5 transition-all duration-300" style={completed ? {
      background: "hsl(38 28% 94% / 0.70)",
      border: "1px solid hsl(36 42% 52% / 0.20)",
    } : locked ? {
      background: "hsl(36 18% 90% / 0.40)",
      border: "1px solid hsl(36 22% 80% / 0.25)",
      opacity: 0.5,
    } : {
      background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(36 33% 95% / 0.90))",
      border: `1.5px solid ${accent}30`,
      boxShadow: `0 2px 12px ${accent}08`,
    }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={completed ? {
        background: `${accent}10`,
        border: `1.5px solid ${accent}25`,
      } : {
        background: `${accent}08`,
        border: `1.5px solid ${accent}20`,
      }}>
        <div style={{ color: completed ? `${accent}80` : iconColor }}>
          {completed ? <Check className="w-4 h-4" style={{ color: "hsl(36 42% 40%)" }} /> : icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-sm tracking-wide truncate" style={{
          color: completed ? "hsl(230 20% 12% / 0.50)" : locked ? "hsl(230 10% 45% / 0.30)" : "hsl(340 42% 22%)",
          textDecoration: completed ? "line-through" : "none",
          textDecorationColor: "hsl(36 45% 58% / 0.30)",
        }}>
          {title}
        </h3>
        <p className="font-accent text-[11px] italic truncate" style={{
          color: completed ? "hsl(230 15% 30% / 0.30)" : locked ? "hsl(230 10% 45% / 0.18)" : "hsl(230 20% 15% / 0.50)",
        }}>
          {subtitle}
        </p>
      </div>
      {!locked && !completed && (
        <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: `${accent}50` }} />
      )}
    </div>
  </button>
);

const StatCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="rounded-xl p-4 text-center" style={{
    background: "hsl(38 28% 93% / 0.75)",
    border: "1px solid hsl(36 45% 50% / 0.18)",
  }}>
    <div className="font-heading text-xl tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
      {value}
    </div>
    <div className="text-[9px] tracking-[0.2em] uppercase font-body mt-0.5" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
      {label}
    </div>
    <div className="text-[10px] font-body mt-0.5" style={{ color: "hsl(36 42% 40% / 0.60)" }}>
      {sub}
    </div>
  </div>
);

export default StudyRoutinePage;
