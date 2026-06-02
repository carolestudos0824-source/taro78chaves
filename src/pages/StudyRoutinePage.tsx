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
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Marfim Suave #FAF5EF base refined from /app */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
        {/* Subtle atmosphere layers */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 20%, rgba(243, 230, 224, 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(250, 245, 239, 0.8) 0%, transparent 30%, transparent 70%, rgba(239, 226, 210, 0.5) 100%)",
          }}
        />
      </div>

      {/* Header — Premium Style from /app */}
      <header className="relative z-10" style={{
        borderBottom: "1.5px solid #C8A66A40",
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
      }}>
        <div className="max-w-lg mx-auto py-6 px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/app")}
              className="transition-all hover:scale-110 duration-200 w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30]"
              style={{ color: "#5B1F3D" }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[11px] tracking-[0.45em] uppercase font-heading font-black" style={{ color: "#5B1F3D" }}>
              <span style={{ color: "#C8A66A" }}>✦</span> Seu Ritual Sagrado <span style={{ color: "#C8A66A" }}>✦</span>
            </span>
          </div>

          <div className="text-center pt-2 pb-2">
            <div className="text-[11px] tracking-[0.4em] uppercase font-heading font-black mb-4" style={{ color: "#C8A66A" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="font-heading text-5xl font-black tracking-tight mb-4" style={{ color: "#5B1F3D" }}>
              Seu Ritual
            </h1>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-body text-[14px] font-bold uppercase tracking-[0.2em]" style={{ color: "#5B1F3D99" }}>
                O caminho de hoje na jornada
              </p>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent my-4 opacity-40" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-32 space-y-10 mt-12">

        {/* ═══════════════ WEEKLY OVERVIEW ═══════════════ */}
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 transition-all duration-500" style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
          backdropFilter: "blur(24px)",
          border: "2.5px solid #C8A66A",
          boxShadow: "0 30px 70px rgba(91, 31, 61, 0.08), 0 0 40px rgba(200, 166, 106, 0.1)"
        }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#C8A66A30]" style={{
                background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                boxShadow: "0 10px 20px rgba(91, 31, 61, 0.2)"
              }}>
                <TrendingUp className="w-6 h-6 text-[#C8A66A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-heading font-black tracking-[0.25em] text-[#C8A66A] uppercase">
                  Consistência
                </span>
                <span className="text-lg font-heading font-black text-[#5B1F3D]">
                  Sua Semana
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#C8A66A20]" style={{
              background: "rgba(250, 245, 239, 0.8)",
            }}>
              <Flame className="w-4 h-4 text-[#5B1F3D]" />
              <span className="text-[12px] font-heading font-black text-[#5B1F3D]">
                {progress.streak} dias
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-6">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center">
                <div className={`text-[10px] font-heading font-black uppercase tracking-tighter mb-3 ${
                  d.isToday ? "text-[#5B1F3D]" : "text-[#5B1F3D]/40"
                }`}>
                  {d.day}
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 border-2 ${
                  d.active 
                    ? "text-white shadow-lg scale-110" 
                    : d.isToday 
                      ? "bg-white border-[#C8A66A] text-[#5B1F3D] shadow-md" 
                      : "bg-[#FAF5EF]/50 border-[#D1C4B5]/20 text-[#5B1F3D]/20"
                }`} style={{
                  background: d.active ? "linear-gradient(135deg, #5B1F3D, #3D1429)" : undefined,
                  borderColor: d.active ? "#C8A66A" : undefined,
                }}>
                  {d.active ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-[13px] font-heading font-black">{d.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#C8A66A20] text-center">
            <p className="text-[12px] font-body font-bold text-[#5B1F3D]/60 italic">
              {activeDaysThisWeek} de 7 portais ativos esta semana
            </p>
          </div>
        </div>

        {/* ═══════════════ TODAY'S ACTIONS ═══════════════ */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
            <h2 className="font-heading text-[11px] tracking-[0.3em] uppercase font-black text-[#5B1F3D]">
              Ações de Hoje
            </h2>
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
          </div>

          <div className="space-y-3">
            {/* 1. Daily Ritual */}
            <RoutineCard
              icon={<Sun className="w-5 h-5" />}
              iconColor="#C8A66A"
              title="Ritual Diário"
              subtitle={dailyDone ? "Portal Cumprido ✦" : `${dailyCompleted}/${dailyTotal} desafios disponíveis`}
              completed={dailyDone}
              accent="#C8A66A"
              onClick={() => navigate("/desafios")}
            />

            {/* 2. Current lesson */}
            {currentArcano && completedCount < 22 && (
              <RoutineCard
                icon={<BookOpen className="w-5 h-5" />}
                iconColor="#5B1F3D"
                title={`Continuar: ${currentArcano.name}`}
                subtitle="Sua próxima lição nos Arcanos Maiores"
                completed={false}
                accent="#5B1F3D"
                onClick={() => navigate(`/lesson/${currentArcanoId}`)}
              />
            )}

            {/* 3. Current module (non-arcanos) */}
            {currentModule && currentModule.id !== "arcanos-maiores" && (
              <RoutineCard
                icon={<span className="text-sm">{currentModule.icon}</span>}
                iconColor="#5B1F3D"
                title={`Módulo: ${currentModule.name}`}
                subtitle={currentModule.subtitle}
                completed={false}
                accent="#5B1F3D"
                onClick={() => navigate(currentModule.route)}
              />
            )}

            {/* 4. Pending review */}
            {pendingReviews.length > 0 && (
              <RoutineCard
                icon={<RefreshCw className="w-5 h-5" />}
                iconColor="#5B1F3D"
                title="Revisão de Arcanos"
                subtitle={`${pendingReviews.length} arcano${pendingReviews.length > 1 ? "s" : ""} aguardando quiz`}
                completed={false}
                accent="#5B1F3D"
                onClick={() => navigate("/revisao")}
              />
            )}
          </div>
        </div>

        {/* ═══════════════ JOURNEY PROGRESS ═══════════════ */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
            <h2 className="font-heading text-[11px] tracking-[0.3em] uppercase font-black text-[#5B1F3D]">
              Sua Maestria
            </h2>
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Arcanos" value={`${completedCount}/22`} sub={`${journeyProgress}% concluído`} />
            <StatCard label="Módulos" value={`${progress.completedModules.length}`} sub="Especialidades" />
            <StatCard label="Sequência" value={`${progress.streak}`} sub="Dias seguidos" />
            <StatCard label="Nível" value={`${progress.level}`} sub={`${progress.xp} Pontos acumulados`} />
          </div>
        </div>

        {/* Motivational */}
        <div className="text-center py-10">
          <div className="w-10 h-10 rounded-full bg-white border border-[#C8A66A]/20 flex items-center justify-center mx-auto mb-4">
             <span className="text-[#C8A66A]">✦</span>
          </div>
          <p className="font-body text-[13px] font-bold italic text-[#5B1F3D]/40 max-w-[200px] mx-auto leading-relaxed">
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
    className="w-full text-left group transition-all duration-500"
  >
    <div className={`rounded-[2rem] p-6 flex items-center gap-5 transition-all duration-500 border-2 ${
      completed 
        ? "bg-white/40 border-[#DCCFC2] opacity-60" 
        : locked 
          ? "bg-[#FAF5EF]/50 border-[#D1C4B5]/20 opacity-40 grayscale" 
          : "bg-white border-[#C8A66A]/30 hover:border-[#C8A66A] shadow-lg hover:shadow-2xl hover:-translate-y-1"
    }`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
        completed 
          ? "bg-[#DCCFC233] border-[#DCCFC2]" 
          : "bg-[#FAF5EF] border-[#C8A66A30] group-hover:bg-[#5B1F3D] group-hover:border-[#5B1F3D] group-hover:shadow-[0_8px_20px_rgba(91,31,61,0.3)]"
      }`}>
        <div className="transition-colors duration-500 group-hover:text-white" style={{ color: completed ? "#C8A66A" : iconColor }}>
          {completed ? <Check className="w-6 h-6" /> : icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-heading text-[17px] font-black tracking-tight ${
          completed ? "text-[#5B1F3D]/40 line-through" : "text-[#5B1F3D]"
        }`}>
          {title}
        </h3>
        <p className={`font-body text-[13px] font-black mt-1 leading-snug ${
          completed ? "text-[#5B1F3D]/30" : "text-[#5B1F3D]/70"
        }`}>
          {subtitle}
        </p>
      </div>
      {!locked && !completed && (
        <div className="shrink-0 w-8 h-8 rounded-full border border-[#C8A66A30] flex items-center justify-center group-hover:bg-[#C8A66A10] transition-colors">
          <ChevronRight className="w-5 h-5 text-[#C8A66A] group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      )}
    </div>
  </button>
);

const StatCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="bg-white border-2 border-[#C8A66A]/30 rounded-[2rem] p-6 text-center shadow-lg transition-all hover:shadow-xl hover:border-[#C8A66A] group">
    <div className="font-heading text-3xl font-black text-[#5B1F3D] group-hover:scale-110 transition-transform duration-500">
      {value}
    </div>
    <div className="text-[10px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A] mt-2">
      {label}
    </div>
    <div className="text-[11px] font-body font-black italic text-[#5B1F3D]/50 mt-1">
      {sub}
    </div>
  </div>
);

export default StudyRoutinePage;
