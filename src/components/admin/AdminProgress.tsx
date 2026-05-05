import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, BookOpen, Star, Target, Users, TrendingUp, Clock, Eye, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ARCANO_NAMES: Record<string, string> = {
  "0": "O Louco", "1": "O Mago", "2": "A Sacerdotisa", "3": "A Imperatriz",
  "4": "O Imperador", "5": "O Hierofante", "6": "Os Enamorados", "7": "O Carro",
  "8": "A Justiça", "9": "O Eremita", "10": "A Roda da Fortuna", "11": "A Força",
  "12": "O Enforcado", "13": "A Morte", "14": "A Temperança", "15": "O Diabo",
  "16": "A Torre", "17": "A Estrela", "18": "A Lua", "19": "O Sol",
  "20": "O Julgamento", "21": "O Mundo",
};

interface NameMaps {
  lessonTitles: Record<string, string>;
  lessonModule: Record<string, string>;
  moduleNames: Record<string, string>;
  arcanoNames: Record<string, string>;
}

const buildFormatter = (maps: NameMaps) => (id: string): string => {
  // Lesson registered in CMS
  if (maps.lessonTitles[id]) {
    const mod = maps.lessonModule[id];
    return mod ? `${maps.lessonTitles[id]} · ${mod}` : maps.lessonTitles[id];
  }
  // Arcano by id pattern
  const arc = id.match(/arcano-(\d+)/);
  if (arc) {
    return maps.arcanoNames[arc[1]] || ARCANO_NAMES[arc[1]] || `Arcano ${arc[1]}`;
  }
  // Module slug directly
  if (maps.moduleNames[id]) return maps.moduleNames[id];
  return id;
};

/**
 * AdminProgress — READ-ONLY analytics view.
 *
 * This component MUST NOT perform any mutations (insert/update/delete/rpc).
 * It only aggregates user_progress + profiles for visualization.
 *
 * If you ever add an admin action here (e.g., reset progress, recalculate XP),
 * you MUST log it via logAdminAction() from @/lib/admin-audit. Silent admin
 * mutations are forbidden by project policy.
 */
const AdminProgress = () => {
  const [progress, setProgress] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"all" | "7d" | "30d">("all");
  const [maps, setMaps] = useState<NameMaps>({ lessonTitles: {}, lessonModule: {}, moduleNames: {}, arcanoNames: {} });

  useEffect(() => {
    const load = async () => {
      const [{ data: prog }, { data: prof }, { data: mods }, { data: lessons }, { data: arcs }] = await Promise.all([
        supabase.from("user_progress").select("completed_lessons, completed_quizzes, completed_exercises, completed_modules, last_active, streak, xp, level"),
        supabase.from("profiles").select("user_id, is_premium, created_at"),
        supabase.from("cms_modules").select("id, slug, name"),
        supabase.from("cms_module_lessons").select("lesson_id, title, module_id"),
        supabase.from("cms_arcanos").select("number, name"),
      ]);
      const moduleNameById: Record<string, string> = {};
      const moduleNames: Record<string, string> = {};
      (mods || []).forEach((m: any) => { moduleNameById[m.id] = m.name; moduleNames[m.slug] = m.name; });
      const lessonTitles: Record<string, string> = {};
      const lessonModule: Record<string, string> = {};
      (lessons || []).forEach((l: any) => {
        lessonTitles[l.lesson_id] = l.title;
        if (moduleNameById[l.module_id]) lessonModule[l.lesson_id] = moduleNameById[l.module_id];
      });
      const arcanoNames: Record<string, string> = {};
      (arcs || []).forEach((a: any) => { arcanoNames[String(a.number)] = a.name; });
      setMaps({ lessonTitles, lessonModule, moduleNames, arcanoNames });
      setProgress(prog || []);
      setProfiles(prof || []);
      setLoading(false);
    };
    load();
  }, []);

  const formatLessonName = useMemo(() => buildFormatter(maps), [maps]);

  const stats = useMemo(() => {
    const now = new Date();
    const cutoff = period === "7d"
      ? new Date(now.getTime() - 7 * 86400000)
      : period === "30d"
      ? new Date(now.getTime() - 30 * 86400000)
      : null;

    const activeUsers = cutoff
      ? progress.filter(p => new Date(p.last_active) >= cutoff)
      : progress;

    const allLessons = activeUsers.flatMap(p => p.completed_lessons || []);
    const allQuizzes = activeUsers.flatMap(p => p.completed_quizzes || []);
    const allExercises = activeUsers.flatMap(p => p.completed_exercises || []);
    const allModules = activeUsers.flatMap(p => p.completed_modules || []);

    // Lesson frequency
    const lessonCounts: Record<string, number> = {};
    allLessons.forEach((l: string) => { lessonCounts[l] = (lessonCounts[l] || 0) + 1; });
    const topLessons = Object.entries(lessonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([id, count]) => ({ id, count, name: formatLessonName(id) }));

    // Module frequency
    const moduleCounts: Record<string, number> = {};
    allModules.forEach((m: string) => { moduleCounts[m] = (moduleCounts[m] || 0) + 1; });
    const topModules = Object.entries(moduleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => ({ id, count }));

    // Arcano-specific completion
    const arcanoCompletion = [0, 1, 2].map(num => {
      const key = `arcano-${num}`;
      return {
        name: ARCANO_NAMES[String(num)] || `Arcano ${num}`,
        completions: lessonCounts[key] || 0,
        rate: activeUsers.length > 0 ? Math.round(((lessonCounts[key] || 0) / activeUsers.length) * 100) : 0,
      };
    });

    // Active streaks
    const activeStreaks = activeUsers.filter(p => p.streak > 0).length;
    const avgStreak = activeUsers.length > 0
      ? Math.round(activeUsers.reduce((sum, p) => sum + (p.streak || 0), 0) / activeUsers.length * 10) / 10
      : 0;

    // Retention: users active in last 7d vs total
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const recentlyActive = progress.filter(p => new Date(p.last_active) >= weekAgo).length;
    const retentionRate = profiles.length > 0 ? Math.round((recentlyActive / profiles.length) * 100) : 0;

    // Abandonment: registered but never completed a lesson
    const neverStarted = progress.filter(p => !p.completed_lessons?.length).length;
    const abandonRate = progress.length > 0 ? Math.round((neverStarted / progress.length) * 100) : 0;

    return {
      totalLessons: allLessons.length,
      totalQuizzes: allQuizzes.length,
      totalExercises: allExercises.length,
      totalModules: allModules.length,
      activeUsers: activeUsers.length,
      topLessons,
      topModules,
      arcanoCompletion,
      activeStreaks,
      avgStreak,
      retentionRate,
      recentlyActive,
      abandonRate,
      neverStarted,
    };
  }, [progress, profiles, period, formatLessonName]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando dados de uso...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg text-foreground">Progresso & Uso</h2>
          <p className="text-sm text-muted-foreground">Como os estudantes estão usando a plataforma.</p>
        </div>
        <Select value={period} onValueChange={v => setPeriod(v as any)}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo período</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPI icon={<BookOpen className="w-4 h-4" />} label="Lições Concluídas" value={stats.totalLessons} />
        <KPI icon={<Star className="w-4 h-4" />} label="Quizzes Concluídos" value={stats.totalQuizzes} />
        <KPI icon={<Target className="w-4 h-4" />} label="Exercícios Feitos" value={stats.totalExercises} />
        <KPI icon={<Users className="w-4 h-4" />} label="Estudantes Ativos" value={stats.activeUsers} />
      </div>

      {/* Retention & Engagement */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniStat label="Retenção (7d)" value={`${stats.retentionRate}%`} detail={`${stats.recentlyActive} ativos`} trend={stats.retentionRate >= 50 ? "up" : "down"} />
        <MiniStat label="Abandono" value={`${stats.abandonRate}%`} detail={`${stats.neverStarted} nunca começaram`} trend={stats.abandonRate <= 30 ? "up" : "down"} />
        <MiniStat label="Streaks Ativos" value={String(stats.activeStreaks)} detail={`média: ${stats.avgStreak}d`} trend="neutral" />
        <MiniStat label="Módulos Completos" value={String(stats.totalModules)} detail="total geral" trend="neutral" />
      </div>

      {/* Arcano-specific completion */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground/60 mb-3">Conclusão por Arcano (Prioridade)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.arcanoCompletion.map(ac => (
            <div key={ac.name} className="p-4 rounded-xl border border-border/50 bg-card/50">
              <h4 className="text-sm font-heading text-foreground mb-1">{ac.name}</h4>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-heading text-primary">{ac.completions}</span>
                <span className="text-xs text-muted-foreground mb-1">conclusões ({ac.rate}%)</span>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${Math.min(ac.rate, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top lessons */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground/60 mb-3">Conteúdos Mais Estudados</h3>
        {stats.topLessons.length ? (
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">#</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Conteúdo</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Conclusões</th>
                </tr>
              </thead>
              <tbody>
                {stats.topLessons.map((l, i) => (
                  <tr key={l.id} className="border-b border-border/10 last:border-0">
                    <td className="p-3">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">{i + 1}</span>
                    </td>
                    <td className="p-3 text-foreground">{l.name}</td>
                    <td className="p-3 text-center text-muted-foreground">{l.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Ainda sem dados de progresso.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════ SUB-COMPONENTS ═══════════ */

const KPI = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="p-4 rounded-xl border border-border/50 bg-card/50 text-center">
    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">{icon}</div>
    <p className="text-xl font-heading text-foreground">{value}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const MiniStat = ({ label, value, detail, trend }: { label: string; value: string; detail: string; trend: "up" | "down" | "neutral" }) => (
  <div className="p-3 rounded-xl border border-border/50 bg-card/50">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {trend === "up" && <ArrowUp className="w-3 h-3 text-primary" />}
      {trend === "down" && <ArrowDown className="w-3 h-3 text-red-400" />}
    </div>
    <p className="text-lg font-heading text-foreground">{value}</p>
    <p className="text-[10px] text-muted-foreground">{detail}</p>
  </div>
);

export default AdminProgress;
