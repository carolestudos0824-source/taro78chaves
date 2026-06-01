import { useEffect, useMemo, useState } from "react";
import { AdminSectionHeading } from "./AdminComponents";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  HelpCircle,
  CheckCircle2,
  CircleDashed,
  Save,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { logAdminAction } from "@/lib/admin-audit";

type QuizRow = Database["public"]["Tables"]["cms_quizzes"]["Row"];
type QuestionRow = Database["public"]["Tables"]["cms_quiz_questions"]["Row"];
type QuizStatus = Database["public"]["Enums"]["module_status"];
type Difficulty = Database["public"]["Enums"]["quiz_difficulty"];
type ModuleRow = Database["public"]["Tables"]["cms_modules"]["Row"];

type QuizQueue = "validado" | "quase" | "incompleto" | "critico";

interface QuizWithStats extends QuizRow {
  questionsCount: number;
  validQuestionsCount: number;
  accuracyRate: number;
  completionCount: number;
  queue: QuizQueue;
  blockers: string[];
}

const QUEUE_LABEL: Record<QuizQueue, string> = {
  validado: "Validado",
  quase: "Quase pronto",
  incompleto: "Incompleto",
  critico: "Crítico",
};

const QUEUE_TONE: Record<QuizQueue, string> = {
  validado: "bg-primary/10/10 text-primary dark:text-primary",
  quase: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  incompleto: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  critico: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

function classifyQuiz(q: QuizRow, validCount: number, missingExplanations = 0): { queue: QuizQueue; blockers: string[] } {
  const blockers: string[] = [];
  if (!q.linked_to) blockers.push("sem vínculo");
  if (q.xp_reward <= 0) blockers.push("Pontos inválidos");
  if (validCount === 0) blockers.push("sem perguntas válidas");
  else if (validCount < 3) blockers.push(`apenas ${validCount} pergunta(s) válida(s)`);
  if (validCount >= 3 && missingExplanations > 0) blockers.push(`${missingExplanations} sem explicação`);

  let queue: QuizQueue;
  if (validCount === 0 || !q.linked_to || q.xp_reward <= 0) queue = "critico";
  else if (validCount >= 3 && missingExplanations === 0) queue = "validado";
  else if (validCount >= 3) queue = "quase";
  else queue = "incompleto";
  return { queue, blockers };
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

const DIFFICULTY_TONE: Record<Difficulty, string> = {
  easy: "bg-primary/10/10 text-primary dark:text-primary",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const STATUS_LABEL: Record<QuizStatus, string> = {
  empty: "Vazio",
  partial: "Parcial",
  draft: "Rascunho",
  published: "Publicado",
};

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState<QuizWithStats[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [drill, setDrill] = useState<QuizWithStats | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");
  const [filterModule, setFilterModule] = useState<string>("all");
  const [filterQueue, setFilterQueue] = useState<"all" | QuizQueue>("all");

  const load = async () => {
    setLoading(true);
    const [qRes, mRes, questionsRes, responsesRes] = await Promise.all([
      supabase.from("cms_quizzes").select("*").order("created_at", { ascending: false }),
      supabase.from("cms_modules").select("*").order("order_index", { ascending: true }),
      supabase.from("cms_quiz_questions").select("quiz_id, options, correct_index, explanation"),
      supabase.from("quiz_responses").select("quiz_id, is_correct, user_id"),
    ]);

    if (qRes.error) {
      toast({ title: "Erro", description: qRes.error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const countByQuiz = new Map<string, number>();
    const validByQuiz = new Map<string, number>();
    const missingExplByQuiz = new Map<string, number>();
    (questionsRes.data ?? []).forEach((qq) => {
      countByQuiz.set(qq.quiz_id, (countByQuiz.get(qq.quiz_id) ?? 0) + 1);
      const opts = Array.isArray(qq.options) ? qq.options : [];
      const ci = qq.correct_index ?? -1;
      const isValid = opts.length >= 2 && ci >= 0 && ci < opts.length;
      if (isValid) {
        validByQuiz.set(qq.quiz_id, (validByQuiz.get(qq.quiz_id) ?? 0) + 1);
        if (!qq.explanation || qq.explanation.trim() === "") {
          missingExplByQuiz.set(qq.quiz_id, (missingExplByQuiz.get(qq.quiz_id) ?? 0) + 1);
        }
      }
    });

    const externalIdMap = new Map<string, string>();
    (qRes.data ?? []).forEach((q) => {
      if (q.external_id) externalIdMap.set(q.external_id, q.id);
      externalIdMap.set(q.id, q.id);
    });

    const statsByQuiz = new Map<string, { correct: number; total: number; users: Set<string> }>();
    (responsesRes.data ?? []).forEach((r) => {
      const internalId = externalIdMap.get(r.quiz_id);
      if (!internalId) return;
      const s = statsByQuiz.get(internalId) ?? { correct: 0, total: 0, users: new Set() };
      s.total += 1;
      if (r.is_correct) s.correct += 1;
      s.users.add(r.user_id);
      statsByQuiz.set(internalId, s);
    });

    const enriched: QuizWithStats[] = (qRes.data ?? []).map((q) => {
      const s = statsByQuiz.get(q.id);
      const validCount = validByQuiz.get(q.id) ?? 0;
      const missingExpl = missingExplByQuiz.get(q.id) ?? 0;
      const { queue, blockers } = classifyQuiz(q, validCount, missingExpl);
      return {
        ...q,
        questionsCount: countByQuiz.get(q.id) ?? 0,
        validQuestionsCount: validCount,
        accuracyRate: s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
        completionCount: s?.users.size ?? 0,
        queue,
        blockers,
      };
    });

    setQuizzes(enriched);
    setModules(mRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      if (filterStatus !== "all" && q.status !== filterStatus) return false;
      if (filterModule !== "all" && q.module_id !== filterModule) return false;
      if (filterQueue !== "all" && q.queue !== filterQueue) return false;
      return true;
    });
  }, [quizzes, filterStatus, filterModule, filterQueue]);

  const togglePublish = async (q: QuizWithStats) => {
    const next: QuizStatus = q.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("cms_quizzes").update({ status: next }).eq("id", q.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: next === "published" ? "quiz.publish" : "quiz.unpublish",
      targetType: "quiz",
      targetId: q.id,
      targetLabel: q.title,
      details: { from: q.status, to: next },
    });
    await load();
  };

  const handleDelete = async (q: QuizWithStats) => {
    if (!confirm(`Remover quiz "${q.title}"?`)) return;
    const { error } = await supabase.from("cms_quizzes").delete().eq("id", q.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "quiz.delete",
      targetType: "quiz",
      targetId: q.id,
      targetLabel: q.title,
    });
    toast({ title: "Quiz removido" });
    await load();
  };

  if (drill) {
    return (
      <QuizEditor
        quiz={drill}
        modules={modules}
        onBack={() => {
          setDrill(null);
          load();
        }}
      />
    );
  }

  const avgAccuracy = (() => {
    const withScore = quizzes.filter((q) => q.accuracyRate);
    if (!withScore.length) return 0;
    return Math.round(withScore.reduce((s, q) => s + q.accuracyRate, 0) / withScore.length);
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <AdminSectionHeading 
          title="Quizzes & Desafios" 
          subtitle="Editor pedagógico — criação e monitoramento de questões e desempenho real." 
        />
        <Button size="sm" className="gap-2 mt-4" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Novo Quiz
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <QuizStatCard label="Total" value={quizzes.length} />
        <QuizStatCard label="Publicados" value={quizzes.filter((q) => q.status === "published").length} tone="primary" />
        <QuizStatCard label="Validados" value={quizzes.filter((q) => q.queue === "validado").length} tone="emerald" />
        <QuizStatCard label="Acerto Médio" value={avgAccuracy} suffix="%" tone="amber" />
      </div>

      {/* Régua editorial — fila de fechamento */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-3 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground">Fila editorial</h3>
          <span className="text-[10px] text-muted-foreground">régua: ≥5 perguntas válidas + vínculo + Pontos &gt; 0</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {(["validado", "quase", "incompleto", "critico"] as QuizQueue[]).map((q) => {
            const count = quizzes.filter((x) => x.queue === q).length;
            const active = filterQueue === q;
            return (
              <button
                key={q}
                onClick={() => setFilterQueue(active ? "all" : q)}
                className={`rounded-lg px-2 py-1.5 text-left transition-all ${QUEUE_TONE[q]} ${active ? "ring-2 ring-current" : "opacity-90 hover:opacity-100"}`}
              >
                <div className="font-semibold">{count}</div>
                <div className="text-[10px] opacity-80">{QUEUE_LABEL[q].toLowerCase()}</div>
              </button>
            );
          })}
        </div>
        {(() => {
          const subMin = quizzes.filter((q) => q.status === "published" && q.queue !== "validado" && q.queue !== "quase").length;
          if (subMin === 0) {
            return (
              <div className="text-[11px] text-primary dark:text-primary bg-primary/10/5 rounded-md px-2 py-1.5">
                ✓ Régua mínima aplicada — nenhum quiz publicado abaixo do limite editorial.
              </div>
            );
          }
          return (
            <div className="text-[11px] text-rose-700 dark:text-rose-400 bg-rose-500/5 rounded-md px-2 py-1.5">
              ⚠ {subMin} quiz(zes) publicados abaixo da régua mínima — devem voltar para rascunho.
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterModule} onValueChange={setFilterModule}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos módulos</SelectItem>
            {modules.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-8 text-center">Carregando quizzes...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border/50 rounded-xl">
          <HelpCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum quiz cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => {
            const mod = modules.find((m) => m.id === q.module_id);
            return (
              <div
                key={q.id}
                className="rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors group overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3">
                  <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-foreground truncate">{q.title}</h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          q.status === "published"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {q.status === "published" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <CircleDashed className="w-3 h-3" />
                        )}
                        {STATUS_LABEL[q.status]}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${DIFFICULTY_TONE[q.difficulty]}`}
                      >
                        {DIFFICULTY_LABEL[q.difficulty]}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${QUEUE_TONE[q.queue]}`}>
                        {QUEUE_LABEL[q.queue]}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {mod?.name ?? "Sem módulo"} · {q.linked_to ?? "sem vínculo"}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> {q.validQuestionsCount}/{q.questionsCount} válidas
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {q.xp_reward} XP
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Target className="w-3 h-3" /> {q.accuracyRate}% acerto
                      </span>
                      <span>· {q.completionCount} conclusões</span>
                    </div>
                    {q.blockers.length > 0 && (
                      <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 truncate">
                        ⚠ {q.blockers.join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => togglePublish(q)}
                      title={q.status === "published" ? "Despublicar" : "Publicar"}
                    >
                      {q.status === "published" ? (
                        <Eye className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDrill(q)}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive"
                      onClick={() => handleDelete(q)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="h-1 bg-muted/30">
                  <div className="h-full bg-primary/60" style={{ width: `${q.accuracyRate}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateQuizDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        modules={modules}
        onCreated={(row) => {
          setCreateOpen(false);
          load();
          setDrill({
            ...row,
            questionsCount: 0,
            validQuestionsCount: 0,
            accuracyRate: 0,
            completionCount: 0,
            ...classifyQuiz(row, 0),
          });
        }}
      />
    </div>
  );
};

/* ═══════════ Stat Card ═══════════ */

const StatCard = ({
  label,
  value,
  suffix,
  tone = "default",
}: {
  label: string;
  value: number;
  suffix?: string;
  tone?: "default" | "primary" | "emerald" | "amber";
}) => {
  const toneClass = {
    default: "border-border/50 text-foreground",
    primary: "border-primary/20 text-primary bg-primary/5",
    emerald: "border-primary/30/20 text-primary dark:text-primary bg-primary/10/5",
    amber: "border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5",
  }[tone];
  return (
    <div className={`p-3 rounded-xl border ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-2xl font-heading mt-1">
        {Number.isFinite(value) ? value : 0}
        {suffix}
      </div>
    </div>
  );
};

/* ═══════════ Quiz Editor (drill-down) ═══════════ */

const QuizEditor = ({
  quiz,
  modules,
  onBack,
}: {
  quiz: QuizWithStats;
  modules: ModuleRow[];
  onBack: () => void;
}) => {
  const [draft, setDraft] = useState<QuizRow>(quiz);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuestionRow> | null>(null);
  const [questionOpen, setQuestionOpen] = useState(false);

  const loadQuestions = async () => {
    setLoadingQ(true);
    const { data, error } = await supabase
      .from("cms_quiz_questions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("order_index", { ascending: true });
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    setQuestions(data ?? []);
    setLoadingQ(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [quiz.id]);

  const update = <K extends keyof QuizRow>(key: K, value: QuizRow[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const saveMeta = async () => {
    const { error } = await supabase
      .from("cms_quizzes")
      .update({
        title: draft.title,
        module_id: draft.module_id,
        linked_to: draft.linked_to,
        xp_reward: draft.xp_reward,
        difficulty: draft.difficulty,
        result_text: draft.result_text,
        review_link: draft.review_link,
        status: draft.status,
        external_id: draft.external_id,
      })
      .eq("id", draft.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "quiz.update",
      targetType: "quiz",
      targetId: draft.id,
      targetLabel: draft.title,
      details: { difficulty: draft.difficulty, xp_reward: draft.xp_reward, status: draft.status },
    });
    toast({ title: "Quiz salvo" });
  };

  const openCreateQuestion = () => {
    setEditingQuestion({
      quiz_id: quiz.id,
      prompt: "",
      options: ["", "", "", ""],
      correct_index: 0,
      explanation: "",
      order_index: questions.length + 1,
    });
    setQuestionOpen(true);
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;
    if (!editingQuestion.prompt?.trim()) {
      toast({ title: "Enunciado obrigatório", variant: "destructive" });
      return;
    }
    const opts = (editingQuestion.options as string[] | undefined) ?? [];
    const cleanOpts = opts.map((o) => o.trim()).filter(Boolean);
    if (cleanOpts.length < 2) {
      toast({ title: "Adicione pelo menos 2 alternativas", variant: "destructive" });
      return;
    }
    const correct = Math.min(editingQuestion.correct_index ?? 0, cleanOpts.length - 1);

    const payload = {
      quiz_id: quiz.id,
      prompt: editingQuestion.prompt.trim(),
      options: cleanOpts,
      correct_index: correct,
      explanation: editingQuestion.explanation?.trim() || null,
      order_index: Number(editingQuestion.order_index ?? 0),
    };

    const isUpdate = !!editingQuestion.id;
    const { error } = isUpdate
      ? await supabase.from("cms_quiz_questions").update(payload).eq("id", editingQuestion.id!)
      : await supabase.from("cms_quiz_questions").insert(payload);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: isUpdate ? "quiz_question.update" : "quiz_question.create",
      targetType: "quiz_question",
      targetId: editingQuestion.id ?? null,
      targetLabel: payload.prompt.slice(0, 60),
      details: { quiz_id: quiz.id, quiz_title: draft.title, correct_index: correct, options_count: cleanOpts.length },
    });
    toast({ title: isUpdate ? "Pergunta atualizada" : "Pergunta criada" });
    setQuestionOpen(false);
    setEditingQuestion(null);
    await loadQuestions();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Remover esta pergunta?")) return;
    const target = questions.find((q) => q.id === id);
    const { error } = await supabase.from("cms_quiz_questions").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "quiz_question.delete",
      targetType: "quiz_question",
      targetId: id,
      targetLabel: target?.prompt.slice(0, 60) ?? null,
      details: { quiz_id: quiz.id, quiz_title: draft.title },
    });
    await loadQuestions();
  };

  const handleMove = async (q: QuestionRow, dir: -1 | 1) => {
    const idx = questions.findIndex((x) => x.id === q.id);
    const swap = idx + dir;
    if (swap < 0 || swap >= questions.length) return;
    const a = questions[idx];
    const b = questions[swap];
    const [r1, r2] = await Promise.all([
      supabase.from("cms_quiz_questions").update({ order_index: b.order_index }).eq("id", a.id),
      supabase.from("cms_quiz_questions").update({ order_index: a.order_index }).eq("id", b.id),
    ]);
    if (r1.error || r2.error) {
      toast({ title: "Erro ao reordenar", variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "quiz_question.reorder",
      targetType: "quiz_question",
      targetId: a.id,
      targetLabel: a.prompt.slice(0, 60),
      details: { quiz_id: quiz.id, direction: dir },
    });
    await loadQuestions();
  };

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para quizzes
      </button>

      {/* Metadata */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm tracking-wider text-foreground">Configuração</h3>
          <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={saveMeta}>
            <Save className="w-3.5 h-3.5" /> Salvar
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Título" full>
            <Input value={draft.title} onChange={(e) => update("title", e.target.value)} />
          </Field>
          <Field label="Módulo vinculado">
            <Select
              value={draft.module_id ?? "none"}
              onValueChange={(v) => update("module_id", v === "none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Lição ou arcano vinculado">
            <Input
              value={draft.linked_to ?? ""}
              onChange={(e) => update("linked_to", e.target.value)}
              placeholder="Ex: o-louco, fundamentos-1"
            />
          </Field>
          <Field label="Status">
            <Select value={draft.status} onValueChange={(v) => update("status", v as QuizStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Dificuldade">
            <Select value={draft.difficulty} onValueChange={(v) => update("difficulty", v as Difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="XP por acerto">
            <Input
              type="number"
              value={draft.xp_reward}
              onChange={(e) => update("xp_reward", Number(e.target.value))}
            />
          </Field>
          <Field label="ID externo (slug do quiz)">
            <Input
              value={draft.external_id ?? ""}
              onChange={(e) => update("external_id", e.target.value)}
              placeholder="usado em respostas legadas"
            />
          </Field>
          <Field label="Resultado vinculado" full>
            <Textarea
              rows={2}
              value={draft.result_text ?? ""}
              onChange={(e) => update("result_text", e.target.value)}
              placeholder="Texto exibido ao concluir o quiz"
            />
          </Field>
          <Field label="Revisão vinculada" full>
            <Input
              value={draft.review_link ?? ""}
              onChange={(e) => update("review_link", e.target.value)}
              placeholder="ID/slug da revisão associada"
            />
          </Field>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Perguntas" value={questions.length} />
        <StatCard label="Taxa de acerto" value={quiz.accuracyRate} suffix="%" tone="emerald" />
        <StatCard label="Conclusões" value={quiz.completionCount} tone="primary" />
      </div>

      {/* Questions */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm tracking-wider text-foreground">Perguntas</h3>
          <Button size="sm" className="gap-1.5 h-8" onClick={openCreateQuestion}>
            <Plus className="w-3.5 h-3.5" /> Nova pergunta
          </Button>
        </div>

        {loadingQ ? (
          <div className="text-xs text-muted-foreground py-4 text-center">Carregando...</div>
        ) : questions.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-border/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Nenhuma pergunta ainda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q, idx) => {
              const opts = (q.options as unknown as string[]) ?? [];
              return (
                <div key={q.id} className="rounded-lg border border-border/50 bg-card/50 p-3 group">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMove(q, -1)}
                        disabled={idx === 0}
                        className="p-0.5 text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMove(q, 1)}
                        disabled={idx === questions.length - 1}
                        className="p-0.5 text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] font-heading text-muted-foreground w-6 mt-1">
                      {String(q.order_index).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{q.prompt}</p>
                      <ul className="mt-2 space-y-1">
                        {opts.map((opt, i) => (
                          <li
                            key={i}
                            className={`text-xs flex items-center gap-2 ${
                              i === q.correct_index
                                ? "text-primary dark:text-primary font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {i === q.correct_index ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <span className="w-3 h-3 inline-block" />
                            )}
                            {opt}
                          </li>
                        ))}
                      </ul>
                      {q.explanation && (
                        <p className="text-[11px] text-muted-foreground italic mt-2">{q.explanation}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setEditingQuestion(q);
                          setQuestionOpen(true);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive"
                        onClick={() => handleDeleteQuestion(q.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Question dialog */}
      <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingQuestion?.id ? "Editar Pergunta" : "Nova Pergunta"}
            </DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-3 mt-2">
              <Field label="Enunciado" full>
                <Textarea
                  rows={3}
                  value={editingQuestion.prompt ?? ""}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, prompt: e.target.value })}
                />
              </Field>
              <div>
                <label className="text-[11px] text-muted-foreground mb-2 block uppercase tracking-wider">
                  Alternativas (selecione a correta)
                </label>
                <div className="space-y-2">
                  {((editingQuestion.options as string[] | undefined) ?? []).map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingQuestion({ ...editingQuestion, correct_index: i })}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                          editingQuestion.correct_index === i
                            ? "bg-primary/10/20 border-primary/30 text-primary dark:text-primary"
                            : "border-border text-transparent hover:border-primary/50"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const next = [...((editingQuestion.options as string[] | undefined) ?? [])];
                          next[i] = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: next });
                        }}
                        placeholder={`Alternativa ${i + 1}`}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const next = [...((editingQuestion.options as string[] | undefined) ?? [])];
                          next.splice(i, 1);
                          const newCorrect =
                            (editingQuestion.correct_index ?? 0) >= next.length
                              ? Math.max(0, next.length - 1)
                              : editingQuestion.correct_index ?? 0;
                          setEditingQuestion({ ...editingQuestion, options: next, correct_index: newCorrect });
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8 w-full"
                    onClick={() =>
                      setEditingQuestion({
                        ...editingQuestion,
                        options: [...((editingQuestion.options as string[] | undefined) ?? []), ""],
                      })
                    }
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar alternativa
                  </Button>
                </div>
              </div>
              <Field label="Explicação da resposta" full>
                <Textarea
                  rows={2}
                  value={editingQuestion.explanation ?? ""}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  placeholder="Por que essa é a resposta correta"
                />
              </Field>
              <Field label="Ordem">
                <Input
                  type="number"
                  value={editingQuestion.order_index ?? 0}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, order_index: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
          )}
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setQuestionOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuestion}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={full ? "col-span-2" : ""}>
    <label className="text-[11px] text-muted-foreground mb-1 block uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

/* ═══════════ Create dialog ═══════════ */

const CreateQuizDialog = ({
  open,
  onOpenChange,
  modules,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  modules: ModuleRow[];
  onCreated: (row: QuizRow) => void;
}) => {
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState<string>("none");
  const [linkedTo, setLinkedTo] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("cms_quizzes")
      .insert({
        title: title.trim(),
        module_id: moduleId === "none" ? null : moduleId,
        linked_to: linkedTo.trim() || null,
        difficulty,
      })
      .select()
      .single();
    if (error) {
      toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "quiz.create",
      targetType: "quiz",
      targetId: data?.id ?? null,
      targetLabel: title.trim(),
      details: { module_id: moduleId === "none" ? null : moduleId, difficulty },
    });
    toast({ title: "Quiz criado" });
    setTitle("");
    setLinkedTo("");
    setModuleId("none");
    setDifficulty("medium");
    onCreated(data as QuizRow);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Novo Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Field label="Título" full>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Módulo" full>
            <Select value={moduleId} onValueChange={setModuleId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Lição ou arcano vinculado" full>
            <Input value={linkedTo} onChange={(e) => setLinkedTo(e.target.value)} placeholder="slug" />
          </Field>
          <Field label="Dificuldade" full>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar e abrir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const QuizStatCard = ({
  label,
  value,
  suffix = "",
  tone = "default",
}: {
  label: string;
  value: number;
  suffix?: string;
  tone?: "default" | "primary" | "emerald" | "amber";
}) => {
  const tones = {
    default: "border-[#C8A66A]/20 text-[#5B1F3D]",
    primary: "border-[#5B1F3D]/30 bg-[#5B1F3D]/5 text-[#5B1F3D]",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <div className={`p-6 rounded-[2rem] border-2 shadow-lg text-center transition-all hover:scale-105 bg-white ${tones[tone]}`}>
      <p className="text-[10px] font-heading font-black tracking-[0.2em] uppercase opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-heading font-black tracking-tighter">
        {value}
        {suffix && <span className="text-lg ml-0.5 opacity-60">{suffix}</span>}
      </p>
    </div>
  );
};

export default AdminQuizzes;
