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

const STATUS_TONE: Record<ArcanoStatus, string> = {
  empty: "bg-muted",
  partial: "bg-amber-100 text-amber-800",
  draft: "bg-secondary/10",
  published: "bg-primary/10",
};

const STATUS_ICON = {
  published: <CheckCircle2 className="w-3 h-3" />,
  draft: <CircleDashed className="w-3 h-3" />,
  partial: <AlertCircle className="w-3 h-3" />,
  empty: <Circle className="w-3 h-3" />,
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

function priorityOf(a: ArcanoRow): Priority {
  if (a.validated) return "validated";
  const filled = EDITORIAL_FIELDS.filter((f) => typeof a[f.key] === "string" && (a[f.key] as string).trim().length > 0).length;
  const total = EDITORIAL_FIELDS.length;
  if (a.status === "published" && filled / total < 0.3) return "critical";
  if (total - filled <= 3) return "almost";
  return "incomplete";
}

export type Priority = "validated" | "almost" | "incomplete" | "critical";

const PRIORITY_LABEL: Record<Priority, string> = { validated: "Validado", almost: "Quase pronto", incomplete: "Incompleto", critical: "Crítico" };
const PRIORITY_TONE: Record<Priority, string> = { validated: "success", almost: "secondary", incomplete: "warning", critical: "destructive" };

function checkInconsistency(a: ArcanoRow): string | null {
  if (a.type !== "maior") return null;
  const fromCode = EDITORIAL_REGISTRY[a.number];
  if (!fromCode) return null;
  if (fromCode.name && a.name && fromCode.name.trim() !== a.name.trim()) return `Divergência: nome no código é "${fromCode.name}"`;
  return null;
}

const AdminArcanos = () => {
  const [arcanos, setArcanos] = useState<ArcanoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<"all" | "maior" | "copas" | "ouros" | "espadas" | "paus" | "corte">("all");
  const [drill, setDrill] = useState<ArcanoRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cms_arcanos").select("*").order("type").order("number");
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    setArcanos(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return arcanos.filter((a) => {
      if (group === "maior" && a.type !== "maior") return false;
      if (group === "corte" && (a.type !== "menor" || a.number <= 10)) return false;
      if (group === "copas" && (a.type !== "menor" || a.naipe !== "copas" || a.number > 10)) return false;
      if (group === "ouros" && (a.type !== "menor" || a.naipe !== "ouros" || a.number > 10)) return false;
      if (group === "espadas" && (a.type !== "menor" || a.naipe !== "espadas" || a.number > 10)) return false;
      if (group === "paus" && (a.type !== "menor" || a.naipe !== "paus" || a.number > 10)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) || (a.subtitle ?? "").toLowerCase().includes(q);
      }
      return true;
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
      <AdminSectionHeading title="78 Arcanos" subtitle="CMS editorial estratégico." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Total" value={stats.total} icon={<BookOpen />} />
        <KPICard label="Validados" value={stats.validated} icon={<ShieldCheck />} accent="text-emerald-600" />
        <KPICard label="Publicados" value={stats.published} icon={<Eye />} accent="text-primary" />
        <KPICard label="Críticos" value={stats.critical} icon={<AlertTriangle />} accent="text-red-600" />
      </div>
      <div className="flex items-center gap-4 flex-wrap bg-white p-4 rounded-3xl border border-[#C8A66A]/20 shadow-sm">
        <Tabs value={group} onValueChange={(v) => setGroup(v as any)} className="flex-1">
          <TabsList className="h-12 bg-transparent">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="maior">Maiores</TabsTrigger>
            <TabsTrigger value="corte">Corte</TabsTrigger>
            <TabsTrigger value="copas">Copas</TabsTrigger>
            <TabsTrigger value="ouros">Ouros</TabsTrigger>
            <TabsTrigger value="espadas">Espadas</TabsTrigger>
            <TabsTrigger value="paus">Paus</TabsTrigger>
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
          <div key={a.id} className="bg-white p-5 rounded-2xl border border-[#C8A66A]/20 hover:border-[#C8A66A]/50 transition-all flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="font-heading font-black text-2xl text-[#C8A66A]">{a.numeral || a.number}</span>
                <AdminBadge variant={a.validated ? "success" : "warning"}>{a.validated ? "Validado" : "Pendente"}</AdminBadge>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#5B1F3D]">{a.name}</h3>
            <div className="flex gap-2 flex-wrap">
                <AdminBadge variant="secondary">{a.type === "maior" ? "Maior" : `${a.naipe} (${a.number > 10 ? 'Corte' : 'Numerado'})`}</AdminBadge>
                <AdminBadge variant={a.status === "published" ? "primary" : "outline"}>{a.status}</AdminBadge>
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={() => setDrill(a)}>
              <FileText className="w-4 h-4 mr-2" /> Auditar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArcanoEditor = ({ arcano, onBack }: { arcano: ArcanoRow; onBack: () => void }) => {
    const [draft, setDraft] = useState<ArcanoRow>(arcano);
    const [saving, setSaving] = useState(false);

    const update = <K extends keyof ArcanoRow>(key: K, value: ArcanoRow[K]) => {
        setDraft((d) => ({ ...d, [key]: value }));
    };

    const saveSection = async (fields: Array<keyof ArcanoRow>) => {
        setSaving(true);
        const payload: Partial<ArcanoRow> = {};
        fields.forEach((f) => { (payload as Record<string, unknown>)[f as string] = draft[f] as unknown; });
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

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
            <h1 className="font-heading text-2xl text-[#5B1F3D] font-black">{arcano.name}</h1>
            <Section title="Identidade" onSave={() => saveSection(["name", "subtitle", "numeral", "image_url", "keywords", "tags"])}>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Nome"><Input value={draft.name} onChange={(e) => update("name", e.target.value)} /></Field>
                    <Field label="Subtítulo"><Input value={draft.subtitle ?? ""} onChange={(e) => update("subtitle", e.target.value)} /></Field>
                </div>
            </Section>
            <Section title="Conteúdo editorial" onSave={() => saveSection(EDITORIAL_FIELDS.map((f) => f.key))} disabled={saving}>
                <div className="grid gap-3">
                    {EDITORIAL_FIELDS.map((f) => (
                        <Field key={String(f.key)} label={`${f.essential ? "★ " : ""}${f.label}`} full>
                            {f.long ? (
                                <Textarea rows={3} value={(draft[f.key] as string) ?? ""} onChange={(e) => update(f.key, e.target.value as ArcanoRow[typeof f.key])} />
                            ) : (
                                <Input value={(draft[f.key] as string) ?? ""} onChange={(e) => update(f.key, e.target.value as ArcanoRow[typeof f.key])} />
                            )}
                        </Field>
                    ))}
                </div>
            </Section>
        </div>
    );
};

const Section = ({ title, children, onSave, disabled }: { title: string; children: React.ReactNode; onSave: () => void; disabled?: boolean }) => (
    <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm tracking-wider text-foreground">{title}</h3>
            <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={onSave} disabled={disabled}><Save className="w-3.5 h-3.5" /> Salvar</Button>
        </div>
        {children}
    </div>
);

const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
    <div className={full ? "col-span-2" : ""}>
        <label className="text-[11px] text-muted-foreground mb-1 block uppercase tracking-wider">{label}</label>
        {children}
    </div>
);

const CreateArcanoDialog = ({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: (row: ArcanoRow) => void }) => {
    const [type, setType] = useState<ArcanoType>("maior");
    const [name, setName] = useState("");
    const handleCreate = async () => {
        const { data, error } = await supabase.from("cms_arcanos").insert({ type, name: name.trim() }).select().single();
        if (error) return;
        onCreated(data as ArcanoRow);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader><DialogTitle>Novo Arcano</DialogTitle></DialogHeader>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
                <DialogFooter><Button onClick={handleCreate}>Criar</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdminArcanos;
