import { useEffect, useMemo, useState } from "react";
import { AdminSectionHeading } from "./AdminComponents";
import {
  Plus,
  Edit,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  LockIcon,
  Unlock,
  ArrowLeft,
  Trash2,
  Layers,
  CheckCircle2,
  Circle,
  CircleDashed,
  AlertCircle,
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { logAdminAction } from "@/lib/admin-audit";
import type { Database } from "@/integrations/supabase/types";

type ModuleStatus = Database["public"]["Enums"]["module_status"];
type ModuleTier = Database["public"]["Enums"]["module_tier"];
type ModuleRow = Database["public"]["Tables"]["cms_modules"]["Row"];
type LessonRow = Database["public"]["Tables"]["cms_module_lessons"]["Row"];

interface ModuleWithStats extends ModuleRow {
  lessonsCount: number;
  avgProgress: number;
  completionRate: number;
}

const STATUS_LABEL: Record<ModuleStatus, string> = {
  empty: "Vazio",
  partial: "Parcial",
  draft: "Rascunho",
  published: "Publicado",
};

const STATUS_TONE: Record<ModuleStatus, string> = {
  empty: "border-muted-foreground/20 text-muted-foreground",
  partial: "border-amber-200 bg-amber-50 text-amber-700",
  draft: "border-secondary/20 bg-secondary/5 text-secondary",
  published: "border-[#C8A66A]/40 bg-[#5B1F3D] text-white",
};

const StatusIcon = ({ status }: { status: ModuleStatus }) => {
  switch (status) {
    case "published":
      return <CheckCircle2 className="w-3 h-3" />;
    case "draft":
      return <CircleDashed className="w-3 h-3" />;
    case "partial":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return <Circle className="w-3 h-3" />;
  }
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyDraft: Partial<ModuleRow> = {
  name: "",
  slug: "",
  category: "",
  short_description: "",
  editorial_description: "",
  icon: "📖",
  theme_color: "",
  order_index: 0,
  status: "draft",
  tier: "premium",
  route_prefix: "",
};

const computeStatus = (current: ModuleStatus, lessonsCount: number): ModuleStatus => {
  // Auto-classify only when not explicitly published/draft by editor
  if (current === "published") return "published";
  if (current === "draft") return "draft";
  if (lessonsCount === 0) return "empty";
  return "partial";
};

/**
 * Régua editorial do módulo (governança híbrida):
 * - validado:    publicado + ≥3 lições + descrição breve + descrição editorial (≥120 chars)
 * - quase_pronto: publicado + ≥3 lições, mas falta descrição breve OU editorial
 * - incompleto:  rascunho/parcial OU lições < 3
 * - critico:     vazio OU sem lição vinculada
 */
type EditorialRank = "validado" | "quase_pronto" | "incompleto" | "critico";

const computeRank = (m: { status: ModuleStatus; short_description: string | null; editorial_description: string | null; lessonsCount: number }): EditorialRank => {
  if (m.status === "empty" || m.lessonsCount === 0) return "critico";
  const hasShort = !!(m.short_description && m.short_description.trim().length >= 20);
  const hasEditorial = !!(m.editorial_description && m.editorial_description.trim().length >= 120);
  if (m.status === "published" && m.lessonsCount >= 3 && hasShort && hasEditorial) return "validado";
  if (m.status === "published" && m.lessonsCount >= 3) return "quase_pronto";
  return "incompleto";
};

const RANK_LABEL: Record<EditorialRank, string> = {
  validado: "Validado",
  quase_pronto: "Quase pronto",
  incompleto: "Incompleto",
  critico: "Crítico",
};

const RANK_TONE: Record<EditorialRank, string> = {
  validado: "bg-primary/10/10 text-primary dark:text-primary border-primary/30/20",
  quase_pronto: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  incompleto: "bg-secondary/10/10 text-secondary dark:text-secondary border-secondary/30/20",
  critico: "bg-destructive/10 text-destructive border-destructive/20",
};

const AdminModules = () => {
  const [modules, setModules] = useState<ModuleWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ModuleRow> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drillModule, setDrillModule] = useState<ModuleWithStats | null>(null);

  const loadModules = async () => {
    setLoading(true);
    const [{ data: mods, error }, { data: lessons }, { data: progress }] = await Promise.all([
      supabase.from("cms_modules").select("*").order("order_index", { ascending: true }),
      supabase.from("cms_module_lessons").select("module_id, lesson_id"),
      supabase.from("user_progress").select("completed_lessons, completed_modules"),
    ]);

    if (error) {
      toast({ title: "Erro ao carregar módulos", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const lessonsByModule = new Map<string, string[]>();
    (lessons ?? []).forEach((l) => {
      const arr = lessonsByModule.get(l.module_id) ?? [];
      arr.push(l.lesson_id);
      lessonsByModule.set(l.module_id, arr);
    });

    const totalUsers = progress?.length ?? 0;

    const enriched: ModuleWithStats[] = (mods ?? []).map((m) => {
      const lessonIds = lessonsByModule.get(m.id) ?? [];
      const lessonsCount = lessonIds.length;

      let progressSum = 0;
      let completedUsers = 0;
      (progress ?? []).forEach((p) => {
        const completed = p.completed_lessons ?? [];
        if (lessonsCount > 0) {
          const matches = completed.filter((cl) => lessonIds.includes(cl)).length;
          progressSum += matches / lessonsCount;
          if (matches === lessonsCount) completedUsers += 1;
        }
        if ((p.completed_modules ?? []).includes(m.slug)) completedUsers += 0; // already counted
      });

      const avgProgress = totalUsers > 0 ? Math.round((progressSum / totalUsers) * 100) : 0;
      const completionRate = totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;

      return {
        ...m,
        lessonsCount,
        avgProgress,
        completionRate,
      };
    });

    setModules(enriched);
    setLoading(false);
  };

  useEffect(() => {
    loadModules();
  }, []);

  const openCreate = () => {
    setEditing({ ...emptyDraft, order_index: modules.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (m: ModuleRow) => {
    setEditing({ ...m });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name?.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    const slug = editing.slug?.trim() || slugify(editing.name);

    const payload = {
      name: editing.name.trim(),
      slug,
      category: editing.category?.trim() || null,
      short_description: editing.short_description?.trim() || null,
      editorial_description: editing.editorial_description?.trim() || null,
      icon: editing.icon?.trim() || null,
      theme_color: editing.theme_color?.trim() || null,
      order_index: Number(editing.order_index ?? 0),
      status: (editing.status ?? "draft") as ModuleStatus,
      tier: (editing.tier ?? "premium") as ModuleTier,
      route_prefix: editing.route_prefix?.trim() || null,
    };

    const isUpdate = !!editing.id;
    const { data: saved, error } = isUpdate
      ? await supabase.from("cms_modules").update(payload).eq("id", editing.id!).select().maybeSingle()
      : await supabase.from("cms_modules").insert(payload).select().maybeSingle();

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: isUpdate ? "module.update" : "module.create",
      targetType: "module",
      targetId: saved?.id ?? editing.id ?? null,
      targetLabel: payload.name,
      details: { slug: payload.slug, tier: payload.tier, status: payload.status },
    });
    toast({ title: isUpdate ? "Módulo atualizado" : "Módulo criado" });
    setDialogOpen(false);
    setEditing(null);
    await loadModules();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este módulo? As lições vinculadas também serão apagadas.")) return;
    const target = modules.find((m) => m.id === id);
    const { error } = await supabase.from("cms_modules").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "module.delete",
      targetType: "module",
      targetId: id,
      targetLabel: target?.name ?? null,
    });
    toast({ title: "Módulo removido" });
    await loadModules();
  };

  const handleTogglePublish = async (m: ModuleWithStats) => {
    const next: ModuleStatus = m.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("cms_modules").update({ status: next }).eq("id", m.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: next === "published" ? "module.publish" : "module.unpublish",
      targetType: "module",
      targetId: m.id,
      targetLabel: m.name,
      details: { from: m.status, to: next },
    });
    await loadModules();
  };

  const handleToggleTier = async (m: ModuleWithStats) => {
    const next: ModuleTier = m.tier === "premium" ? "free" : "premium";
    const { error } = await supabase.from("cms_modules").update({ tier: next }).eq("id", m.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "module.tier_change",
      targetType: "module",
      targetId: m.id,
      targetLabel: m.name,
      details: { from: m.tier, to: next },
    });
    await loadModules();
  };

  const handleMove = async (m: ModuleWithStats, direction: -1 | 1) => {
    const sorted = [...modules].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex((x) => x.id === m.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    const [r1, r2] = await Promise.all([
      supabase.from("cms_modules").update({ order_index: b.order_index }).eq("id", a.id),
      supabase.from("cms_modules").update({ order_index: a.order_index }).eq("id", b.id),
    ]);
    const error = r1.error ?? r2.error;
    if (error) {
      toast({ title: "Erro ao reordenar", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "module.reorder",
      targetType: "module",
      targetId: m.id,
      targetLabel: m.name,
      details: { direction, swapped_with: b.id },
    });
    await loadModules();
  };

  const ranks = useMemo(() => {
    const by: Record<EditorialRank, number> = { validado: 0, quase_pronto: 0, incompleto: 0, critico: 0 };
    modules.forEach((m) => {
      by[computeRank(m)] += 1;
    });
    return by;
  }, [modules]);

  if (drillModule) {
    return <ModuleLessonsView module={drillModule} onBack={() => { setDrillModule(null); loadModules(); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <AdminSectionHeading 
          title="Módulos do Curso" 
          subtitle="Central editorial — crie, organize e publique todos os módulos da plataforma." 
        />
        <Button size="sm" className="gap-2 mt-4" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Novo Módulo
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {(["validado", "quase_pronto", "incompleto", "critico"] as EditorialRank[]).map((r) => (
          <div key={r} className={`p-6 rounded-[2rem] border-2 shadow-lg transition-all hover:scale-105 bg-white ${RANK_TONE[r]}`}>
            <div className="text-[10px] font-heading font-black tracking-widest uppercase opacity-70 mb-1">{RANK_LABEL[r]}</div>
            <div className="text-3xl font-heading font-black tracking-tighter">{ranks[r]}</div>
          </div>
        ))}
      </div>

      {/* Nota de governança híbrida */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-[11px] text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground">Governança híbrida:</span> a estrutura do módulo
        (descrição, ordem, tier, status, vínculo de lições) é editada aqui no painel.
        O <span className="font-medium text-foreground">corpo editorial das lições</span> (texto principal,
        deepDive, exercícios) é versionado em <code className="px-1 rounded bg-background/60">src/content/lessons/**</code>
        e atualizado por release. Isto não é pendência — é a arquitetura oficial.
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-8 text-center">Carregando módulos...</div>
      ) : modules.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border/50 rounded-xl">
          <Layers className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum módulo cadastrado.</p>
          <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={openCreate}>
            <Plus className="w-3.5 h-3.5" /> Criar primeiro módulo
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {modules
            .sort((a, b) => a.order_index - b.order_index)
            .map((mod, idx, arr) => {
              const effectiveStatus = computeStatus(mod.status, mod.lessonsCount);
              return (
                <div
                  key={mod.id}
                  className="group rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMove(mod, -1)}
                        disabled={idx === 0}
                        className="p-0.5 text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMove(mod, 1)}
                        disabled={idx === arr.length - 1}
                        className="p-0.5 text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <span
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{
                        backgroundColor: mod.theme_color
                          ? `hsl(${mod.theme_color} / 0.15)`
                          : "hsl(var(--primary) / 0.1)",
                      }}
                    >
                      {mod.icon ?? "📖"}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-foreground truncate">{mod.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${STATUS_TONE[effectiveStatus]}`}
                        >
                          <StatusIcon status={effectiveStatus} />
                          {STATUS_LABEL[effectiveStatus]}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            mod.tier === "premium"
                              ? "bg-primary/10 text-primary"
                              : "bg-primary/10/10 text-primary dark:text-primary"
                          }`}
                        >
                          {mod.tier === "premium" ? "Premium" : "Gratuito"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {mod.short_description || mod.category || mod.slug}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {mod.lessonsCount} lições
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3" /> {mod.avgProgress}% progresso médio
                        </span>
                        <span>· {mod.completionRate}% concluíram</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleToggleTier(mod)}
                        title={mod.tier === "premium" ? "Tornar gratuito" : "Tornar premium"}
                      >
                        {mod.tier === "premium" ? (
                          <LockIcon className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5 text-primary" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleTogglePublish(mod)}
                        title={mod.status === "published" ? "Despublicar" : "Publicar"}
                      >
                        {mod.status === "published" ? (
                          <Eye className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(mod)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1"
                        onClick={() => setDrillModule(mod)}
                      >
                        Lições
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive"
                        onClick={() => handleDelete(mod.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="h-1 bg-muted/30">
                    <div
                      className="h-full bg-primary/60 transition-all"
                      style={{ width: `${mod.avgProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editing?.id ? "Editar Módulo" : "Novo Módulo"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Nome</label>
                  <Input
                    value={editing.name ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        name: e.target.value,
                        slug: editing.id ? editing.slug : slugify(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Slug</label>
                  <Input
                    value={editing.slug ?? ""}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Categoria</label>
                  <Input
                    value={editing.category ?? ""}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    placeholder="Fundamentos, Método..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Descrição curta</label>
                <Input
                  value={editing.short_description ?? ""}
                  onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                  placeholder="Frase de apresentação"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Descrição editorial</label>
                <Textarea
                  rows={4}
                  value={editing.editorial_description ?? ""}
                  onChange={(e) => setEditing({ ...editing, editorial_description: e.target.value })}
                  placeholder="Texto que aparece na abertura do módulo"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ícone</label>
                  <Input
                    value={editing.icon ?? ""}
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Cor (HSL)</label>
                  <Input
                    value={editing.theme_color ?? ""}
                    onChange={(e) => setEditing({ ...editing, theme_color: e.target.value })}
                    placeholder="280 30% 45%"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ordem</label>
                  <Input
                    type="number"
                    value={editing.order_index ?? 0}
                    onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Prefixo de rota</label>
                <Input
                  value={editing.route_prefix ?? ""}
                  onChange={(e) => setEditing({ ...editing, route_prefix: e.target.value })}
                  placeholder="/fundamentos"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <Select
                    value={editing.status ?? "draft"}
                    onValueChange={(v) => setEditing({ ...editing, status: v as ModuleStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">Vazio</SelectItem>
                      <SelectItem value="partial">Parcial</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Acesso</label>
                  <Select
                    value={editing.tier ?? "premium"}
                    onValueChange={(v) => setEditing({ ...editing, tier: v as ModuleTier })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Gratuito</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ═══════════ DRILL DOWN: lições do módulo ═══════════ */

const ModuleLessonsView = ({
  module,
  onBack,
}: {
  module: ModuleWithStats;
  onBack: () => void;
}) => {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LessonRow> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_module_lessons")
      .select("*")
      .eq("module_id", module.id)
      .order("order_index", { ascending: true });
    if (error) {
      toast({ title: "Erro ao carregar lições", description: error.message, variant: "destructive" });
    }
    setLessons(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [module.id]);

  const openCreate = () => {
    setEditing({ module_id: module.id, lesson_id: "", title: "", order_index: lessons.length + 1 });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.lesson_id?.trim()) {
      toast({ title: "Preencha título e ID da lição", variant: "destructive" });
      return;
    }
    const payload = {
      module_id: module.id,
      lesson_id: editing.lesson_id.trim(),
      title: editing.title.trim(),
      order_index: Number(editing.order_index ?? 0),
    };
    const isUpdate = !!editing.id;
    const { error } = isUpdate
      ? await supabase.from("cms_module_lessons").update(payload).eq("id", editing.id!)
      : await supabase.from("cms_module_lessons").insert(payload);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: isUpdate ? "module_lesson.update" : "module_lesson.create",
      targetType: "module_lesson",
      targetId: editing.id ?? null,
      targetLabel: payload.title,
      details: { module_id: module.id, module_name: module.name, lesson_id: payload.lesson_id },
    });
    setOpen(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta lição do módulo?")) return;
    const target = lessons.find((l) => l.id === id);
    const { error } = await supabase.from("cms_module_lessons").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "module_lesson.delete",
      targetType: "module_lesson",
      targetId: id,
      targetLabel: target?.title ?? null,
      details: { module_id: module.id, module_name: module.name },
    });
    await load();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para módulos
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{module.icon ?? "📖"}</span>
          <div>
            <h2 className="font-heading text-lg text-foreground">{module.name}</h2>
            <p className="text-xs text-muted-foreground">
              {module.lessonsCount} lições · {module.avgProgress}% progresso médio
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Vincular lição
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-[11px] text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground">Governança híbrida:</span> aqui você gerencia
        a <span className="font-medium text-foreground">estrutura</span> da lição (vínculo, ID, título, ordem).
        O <span className="font-medium text-foreground">corpo editorial</span>
        (texto principal, deepDive, exercícios, quiz) vive em
        <code className="px-1 mx-1 rounded bg-background/60">src/content/lessons/{module.slug}.ts</code>
        e é atualizado por release. Isto é arquitetura oficial, não pendência.
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-6 text-center">Carregando...</div>
      ) : lessons.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border/50 rounded-xl">
          <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma lição vinculada ainda.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {lessons.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/50 group"
            >
              <span className="text-xs font-heading text-muted-foreground w-8">
                {String(l.order_index).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{l.title}</p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">{l.lesson_id}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setEditing(l);
                    setOpen(true);
                  }}
                >
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive"
                  onClick={() => handleDelete(l.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editing?.id ? "Editar Lição" : "Vincular Lição"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Título</label>
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">ID da lição (slug)</label>
                <Input
                  value={editing.lesson_id ?? ""}
                  onChange={(e) => setEditing({ ...editing, lesson_id: e.target.value })}
                  placeholder="ex: o-louco, fundamentos-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Ordem</label>
                <Input
                  type="number"
                  value={editing.order_index ?? 0}
                  onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModules;
