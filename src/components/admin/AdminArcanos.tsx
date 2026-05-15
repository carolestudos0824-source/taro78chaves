import { useEffect, useMemo, useState } from "react";
import { AdminSectionHeading, KPICard, AdminBadge } from "./AdminComponents";
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Circle,
  CircleDashed,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { EDITORIAL_REGISTRY } from "@/content/arcanos-maiores";
import { logAdminAction } from "@/lib/admin-audit";

type ArcanoStatus = Database["public"]["Enums"]["module_status"];
type ArcanoTier = Database["public"]["Enums"]["module_tier"];
type ArcanoType = Database["public"]["Enums"]["arcano_type"];
type ArcanoNaipe = Database["public"]["Enums"]["arcano_naipe"];
type ArcanoRow = Database["public"]["Tables"]["cms_arcanos"]["Row"];

const STATUS_LABEL: Record<ArcanoStatus, string> = {
  empty: "Vazio",
  partial: "Parcial",
  draft: "Rascunho",
  published: "Publicado",
};

const StatusIcon = ({ status }: { status: ArcanoStatus }) => {
  switch (status) {
    case "published": return <CheckCircle2 className="w-3 h-3" />;
    case "draft": return <CircleDashed className="w-3 h-3" />;
    case "partial": return <AlertCircle className="w-3 h-3" />;
    default: return <Circle className="w-3 h-3" />;
  }
};

const EDITORIAL_FIELDS: Array<{ key: keyof ArcanoRow; label: string; long?: boolean; essential?: boolean }> = [
  { key: "essencia", label: "Essência", long: true, essential: true },
  { key: "simbolos_centrais", label: "Símbolos centrais", long: true, essential: true },
  { key: "luz", label: "Luz", long: true, essential: true },
  { key: "sombra", label: "Sombra", long: true, essential: true },
  { key: "amor", label: "Amor", long: true, essential: true },
  { key: "trabalho", label: "Trabalho", long: true, essential: true },
  { key: "espiritualidade", label: "Espiritualidade", long: true, essential: true },
  { key: "voz_do_arcano", label: "Voz do arcano", long: true, essential: true },
  { key: "aprofundamento", label: "Aprofundamento", long: true },
  { key: "arquetipos", label: "Arquétipos" },
  { key: "numerologia", label: "Numerologia" },
  { key: "astrologia", label: "Astrologia" },
  { key: "elemento", label: "Elemento" },
  { key: "cabala", label: "Cabala" },
  { key: "jornada", label: "Jornada" },
  { key: "pratica", label: "Prática" },
  { key: "citacao", label: "Citação" },
];

const ESSENTIAL_FIELDS = EDITORIAL_FIELDS.filter((f) => f.essential);

function countEssentialFilled(a: ArcanoRow): number {
  return ESSENTIAL_FIELDS.filter((f) => typeof a[f.key] === "string" && (a[f.key] as string).trim().length > 0).length;
}

function meetsPublishBar(a: ArcanoRow): boolean { return countEssentialFilled(a) === ESSENTIAL_FIELDS.length; }

function meetsValidationBar(a: ArcanoRow): boolean {
  const revOk = typeof a.revisao_rapida === "string" && a.revisao_rapida.trim().length > 0;
  const kwOk = Array.isArray(a.keywords) && a.keywords.length > 0;
  return meetsPublishBar(a) && revOk && kwOk;
}

function queueRank(a: ArcanoRow): number {
  if (a.validated) return 999;
  const prio = priorityOf(a);
  if (prio === "almost") return 0;
  if (prio === "critical" && a.tier === "free") return 1;
  if (prio === "critical" && a.tier === "premium" && a.type === "maior") return 2;
  if (prio === "critical") return 3;
  return 4;
}

const NAIPES: ArcanoNaipe[] = ["copas", "ouros", "espadas", "paus"];
const NAIPE_LABEL: Record<ArcanoNaipe, string> = {
  copas: "Copas",
  ouros: "Ouros",
  espadas: "Espadas",
  paus: "Paus",
};

function effectiveStatus(a: ArcanoRow): ArcanoStatus {
  if (a.status === "published" || a.status === "draft") return a.status;
  const filled = EDITORIAL_FIELDS.filter((f) => typeof a[f.key] === "string" && (a[f.key] as string).trim().length > 0).length;
  if (filled === 0) return "empty";
  if (filled < EDITORIAL_FIELDS.length) return "partial";
  return "draft";
}

function priorityOf(a: ArcanoRow): Priority {
  if (a.validated) return "validated";
  const filled = EDITORIAL_FIELDS.filter((f) => typeof a[f.key] === "string" && (a[f.key] as string).trim().length > 0).length;
  const total = EDITORIAL_FIELDS.length;
  if (a.status === "published" && filled / total < 0.3) return "critical";
  if (total - filled <= 3) return "almost";
  return "incomplete";
}

export type Priority = "validated" | "almost" | "incomplete" | "critical";

const PRIORITY_LABEL: Record<Priority, string> = {
  validated: "Validado",
  almost: "Quase pronto",
  incomplete: "Incompleto",
  critical: "Crítico",
};

const AdminArcanos = () => {
  const [arcanos, setArcanos] = useState<ArcanoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<"all" | "maior" | "copas" | "ouros" | "espadas" | "paus" | "corte">("all");
  const [drill, setDrill] = useState<ArcanoRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_arcanos")
      .select("*")
      .order("type", { ascending: true })
      .order("naipe", { ascending: true, nullsFirst: true })
      .order("number", { ascending: true });
    if (error) toast({ title: "Erro ao carregar arcanos", description: error.message, variant: "destructive" });
    setArcanos(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return arcanos.filter((a) => {
      if (group === "maior" && a.type !== "maior") return false;
      if (group === "copas" && (a.type !== "menor" || a.naipe !== "copas")) return false;
      if (group === "ouros" && (a.type !== "menor" || a.naipe !== "ouros")) return false;
      if (group === "espadas" && (a.type !== "menor" || a.naipe !== "espadas")) return false;
      if (group === "paus" && (a.type !== "menor" || a.naipe !== "paus")) return false;
      if (group === "corte" && a.type !== "corte") return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) || (a.subtitle ?? "").toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
        const ra = queueRank(a);
        const rb = queueRank(b);
        if (ra !== rb) return ra - rb;
        return (EDITORIAL_FIELDS.filter((f) => typeof b[f.key] === "string" && (b[f.key] as string).trim().length > 0).length) - (EDITORIAL_FIELDS.filter((f) => typeof a[f.key] === "string" && (a[f.key] as string).trim().length > 0).length);
    });
  }, [arcanos, group, search]);

  const stats = useMemo(() => {
    const total = arcanos.length;
    const validated = arcanos.filter((a) => a.validated).length;
    const published = arcanos.filter((a) => a.status === "published").length;
    const critical = arcanos.filter((a) => priorityOf(a) === "critical").length;
    return { total, validated, published, critical };
  }, [arcanos]);

  if (drill) return <ArcanoEditor arcano={drill} onBack={() => { setDrill(null); load(); }} />;

  return (
    <div className="space-y-8">
      <AdminSectionHeading title="78 Arcanos" subtitle="Auditoria central e gestão do conteúdo canônico." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Total" value={stats.total} icon={<BookOpen />} />
        <KPICard label="Validados" value={stats.validated} icon={<ShieldCheck />} accent="text-emerald-600" />
        <KPICard label="Publicados" value={stats.published} icon={<Eye />} accent="text-primary" />
        <KPICard label="Críticos" value={stats.critical} icon={<AlertTriangle />} accent="text-red-600" />
      </div>

      <div className="flex items-center gap-4 flex-wrap bg-white p-4 rounded-3xl border border-[#C8A66A]/20 shadow-sm">
        <Tabs value={group} onValueChange={(v) => setGroup(v as any)} className="flex-1">
          <TabsList className="h-12 bg-transparent flex flex-wrap justify-start">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="maior">Maiores</TabsTrigger>
            <TabsTrigger value="copas">Copas</TabsTrigger>
            <TabsTrigger value="ouros">Ouros</TabsTrigger>
            <TabsTrigger value="espadas">Espadas</TabsTrigger>
            <TabsTrigger value="paus">Paus</TabsTrigger>
            <TabsTrigger value="corte">Cortes</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Novo</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white p-5 rounded-2xl border border-[#C8A66A]/20 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="font-heading font-black text-2xl text-[#C8A66A]">{a.numeral || a.number}</span>
                <AdminBadge variant={a.validated ? "success" : "warning"}>{a.validated ? "Validado" : "Pendente"}</AdminBadge>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#5B1F3D]">{a.name}</h3>
            <div className="flex gap-2 flex-wrap">
                <AdminBadge variant="secondary">{a.type === "maior" ? "Maior" : a.naipe}</AdminBadge>
                <AdminBadge variant={a.status === "published" ? "primary" : "outline"}>{a.status}</AdminBadge>
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={() => setDrill(a)}>
              <FileText className="w-4 h-4 mr-2" /> Auditar
            </Button>
          </div>
        ))}
      </div>
      <CreateArcanoDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={(row) => { setCreateOpen(false); setDrill(row); load(); }} />
    </div>
  );
};

/* ═══════════ Editor (drill-down) ═══════════ */

const ArcanoEditor = ({ arcano, onBack }: { arcano: ArcanoRow; onBack: () => void }) => {
  const [draft, setDraft] = useState<ArcanoRow>(arcano);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof ArcanoRow>(key: K, value: ArcanoRow[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const saveSection = async (fields: Array<keyof ArcanoRow>) => {
    setSaving(true);
    const payload: Partial<ArcanoRow> = {};
    fields.forEach((f) => {
      (payload as Record<string, unknown>)[f as string] = draft[f] as unknown;
    });
    const { error } = await supabase.from("cms_arcanos").update(payload).eq("id", draft.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "arcano.update",
      targetType: "arcano",
      targetId: draft.id,
      targetLabel: draft.name,
      details: { fields: fields as string[] },
    });
    toast({ title: "Seção salva" });
  };

  const togglePublish = async () => {
    const next: ArcanoStatus = draft.status === "published" ? "draft" : "published";
    // Régua endurecida: bloquear publicação se não atender à barra mínima (8 essenciais)
    if (next === "published" && !meetsPublishBar(draft)) {
      const filledEss = countEssentialFilled(draft);
      toast({
        title: "Publicação bloqueada",
        description: `Faltam ${ESSENTIAL_FIELDS.length - filledEss} de ${ESSENTIAL_FIELDS.length} campos essenciais. Complete-os antes de publicar.`,
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.from("cms_arcanos").update({ status: next }).eq("id", draft.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    update("status", next);
    await logAdminAction({
      action: next === "published" ? "arcano.publish" : "arcano.unpublish",
      targetType: "arcano",
      targetId: draft.id,
      targetLabel: draft.name,
      details: { from: draft.status, to: next, essential_filled: countEssentialFilled(draft) },
    });
    toast({ title: next === "published" ? "Publicado" : "Despublicado" });
  };

  const toggleTier = async () => {
    const next: ArcanoTier = draft.tier === "premium" ? "free" : "premium";
    const { error } = await supabase.from("cms_arcanos").update({ tier: next }).eq("id", draft.id);
    if (error) return;
    update("tier", next);
    await logAdminAction({
      action: "arcano.tier_change",
      targetType: "arcano",
      targetId: draft.id,
      targetLabel: draft.name,
      details: { from: draft.tier, to: next },
    });
  };

  const toggleValidated = async () => {
    const next = !draft.validated;
    if (next && !meetsValidationBar(draft)) {
      toast({
        title: "Validação bloqueada",
        description: "Para validar é preciso ter os 8 essenciais + revisão rápida + palavras-chave preenchidos.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.from("cms_arcanos").update({ validated: next }).eq("id", draft.id);
    if (error) return;
    update("validated", next);
    await logAdminAction({
      action: "arcano.validate",
      targetType: "arcano",
      targetId: draft.id,
      targetLabel: draft.name,
      details: { validated: next },
    });
    toast({ title: next ? "Marcado como validado" : "Validação removida" });
  };

  const handleDelete = async () => {
    if (!confirm(`Remover "${draft.name}"?`)) return;
    const { error } = await supabase.from("cms_arcanos").delete().eq("id", draft.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "arcano.delete",
      targetType: "arcano",
      targetId: draft.id,
      targetLabel: draft.name,
      details: { type: draft.type, number: draft.number },
    });
    toast({ title: "Arcano removido" });
    onBack();
  };

  const inc = checkInconsistency(draft);
  const eff = effectiveStatus(draft);

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para arcanos
      </button>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-heading text-sm text-primary shrink-0">
            {draft.numeral || draft.number}
          </span>
          <div>
            <h2 className="font-heading text-xl text-foreground">{draft.name}</h2>
            <p className="text-xs text-muted-foreground">
              {draft.type === "maior" ? "Arcano Maior" : `Arcano Menor · ${draft.naipe ? NAIPE_LABEL[draft.naipe] : ""}`}
              {" · "}
              {completionPercent(draft)}% completo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border font-medium ${STATUS_TONE[eff]}`}
          >
            <StatusIcon status={eff} />
            {STATUS_LABEL[eff]}
          </span>
          <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={toggleValidated}>
            {draft.validated ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Validado
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" /> Pendente
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={toggleTier}>
            {draft.tier === "premium" ? (
              <>
                <Lock className="w-3.5 h-3.5 text-primary" /> Premium
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-primary" /> Gratuito
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={togglePublish}>
            {draft.status === "published" ? (
              <>
                <Eye className="w-3.5 h-3.5 text-primary" /> Publicado
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Rascunho
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {inc && (
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-300">
            <strong>Inconsistência detectada</strong> entre admin e código da jornada/lição. {inc}
          </div>
        </div>
      )}

      {/* SECTION: Identidade */}
      <Section title="Identidade" onSave={() => saveSection(["name", "subtitle", "numeral", "image_url", "keywords", "tags"])}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome">
            <Input value={draft.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Subtítulo">
            <Input value={draft.subtitle ?? ""} onChange={(e) => update("subtitle", e.target.value)} />
          </Field>
          <Field label="Número">
            <Input
              type="number"
              value={draft.number}
              onChange={(e) => update("number", Number(e.target.value))}
            />
          </Field>
          <Field label="Numeral romano">
            <Input value={draft.numeral ?? ""} onChange={(e) => update("numeral", e.target.value)} />
          </Field>
          <Field label="Imagem oficial (URL)" full>
            <Input value={draft.image_url ?? ""} onChange={(e) => update("image_url", e.target.value)} />
          </Field>
          <Field label="Palavras-chave (separadas por vírgula)" full>
            <Input
              value={(draft.keywords ?? []).join(", ")}
              onChange={(e) =>
                update(
                  "keywords",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
          <Field label="Tags (separadas por vírgula)" full>
            <Input
              value={(draft.tags ?? []).join(", ")}
              onChange={(e) =>
                update(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
        </div>
      </Section>

      {/* SECTION: Conteúdo editorial (17 campos = 8 essenciais + 9 complementares) */}
      <Section
        title={`Conteúdo editorial (${EDITORIAL_FIELDS.length} campos · ${ESSENTIAL_FIELDS.length} essenciais marcados ★)`}
        onSave={() => saveSection(EDITORIAL_FIELDS.map((f) => f.key))}
        disabled={saving}
      >
        <div className="grid gap-3">
          {EDITORIAL_FIELDS.map((f) => (
            <Field key={String(f.key)} label={`${f.essential ? "★ " : ""}${f.label}${f.essential ? " (essencial)" : ""}`} full>
              {f.long ? (
                <Textarea
                  rows={3}
                  value={(draft[f.key] as string) ?? ""}
                  onChange={(e) => update(f.key, e.target.value as ArcanoRow[typeof f.key])}
                />
              ) : (
                <Input
                  value={(draft[f.key] as string) ?? ""}
                  onChange={(e) => update(f.key, e.target.value as ArcanoRow[typeof f.key])}
                />
              )}
            </Field>
          ))}
        </div>
      </Section>

      {/* SECTION: Quiz + revisão */}
      <Section title="Quiz e revisão" onSave={() => saveSection(["quiz_id", "revisao_rapida"])}>
        <div className="grid gap-3">
          <Field label="ID do quiz vinculado" full>
            <Input value={draft.quiz_id ?? ""} onChange={(e) => update("quiz_id", e.target.value)} />
          </Field>
          <Field label="Revisão rápida" full>
            <Textarea
              rows={3}
              value={draft.revisao_rapida ?? ""}
              onChange={(e) => update("revisao_rapida", e.target.value)}
            />
          </Field>
        </div>
      </Section>
    </div>
  );
};

const Section = ({
  title,
  children,
  onSave,
  disabled,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  disabled?: boolean;
}) => (
  <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="font-heading text-sm tracking-wider text-foreground">{title}</h3>
      <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={onSave} disabled={disabled}>
        <Save className="w-3.5 h-3.5" /> Salvar seção
      </Button>
    </div>
    {children}
  </div>
);

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

const CreateArcanoDialog = ({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (row: ArcanoRow) => void;
}) => {
  const [type, setType] = useState<ArcanoType>("maior");
  const [naipe, setNaipe] = useState<ArcanoNaipe>("copas");
  const [number, setNumber] = useState<number>(0);
  const [numeral, setNumeral] = useState("");
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("cms_arcanos")
      .insert({
        type,
        naipe: type === "menor" ? naipe : null,
        number,
        numeral: numeral.trim() || null,
        name: name.trim(),
      })
      .select()
      .single();
    if (error) {
      toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction({
      action: "arcano.create",
      targetType: "arcano",
      targetId: data?.id ?? null,
      targetLabel: name.trim(),
      details: { type, number, naipe: type === "menor" ? naipe : null },
    });
    toast({ title: "Arcano criado" });
    onCreated(data as ArcanoRow);
    setName("");
    setNumeral("");
    setNumber(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Novo Arcano</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Field label="Tipo" full>
            <Select value={type} onValueChange={(v) => setType(v as ArcanoType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maior">Arcano Maior</SelectItem>
                <SelectItem value="menor">Arcano Menor</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {type === "menor" && (
            <Field label="Naipe" full>
              <Select value={naipe} onValueChange={(v) => setNaipe(v as ArcanoNaipe)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NAIPES.map((n) => (
                    <SelectItem key={n} value={n}>
                      {NAIPE_LABEL[n]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Número">
              <Input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} />
            </Field>
            <Field label="Numeral">
              <Input value={numeral} onChange={(e) => setNumeral(e.target.value)} placeholder="Ex: III" />
            </Field>
          </div>
          <Field label="Nome" full>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ArcanoStatCard = ({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "primary" | "emerald" | "amber" | "destructive" | "blue";
}) => {
  const tones = {
    default: "border-[#C8A66A]/20 text-[#5B1F3D]",
    primary: "border-[#5B1F3D]/30 bg-[#5B1F3D]/5 text-[#5B1F3D]",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    destructive: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <div className={`p-4 rounded-2xl border-2 shadow-sm text-center transition-all hover:scale-105 bg-white ${tones[tone]}`}>
      <p className="text-[9px] font-heading font-black tracking-widest uppercase opacity-70 mb-1 truncate">{label}</p>
      <p className="text-2xl font-heading font-black tracking-tighter">{value}</p>
    </div>
  );
};

export default AdminArcanos;
