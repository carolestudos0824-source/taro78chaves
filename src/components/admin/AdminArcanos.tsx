import { useEffect, useMemo, useState } from "react";
import { AdminSectionHeading, KPICard, AdminBadge } from "./AdminComponents";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Circle,
  CircleDashed,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  BookOpen,
  ArrowLeft
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

const STATUS_LABEL: Record<ArcanoStatus, string> = { empty: "Vazio", partial: "Parcial", draft: "Rascunho", published: "Publicado" };

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

function checkInconsistency(a: ArcanoRow): string | null {
  if (a.type !== "maior") return null;
  const fromCode = EDITORIAL_REGISTRY[a.number];
  if (!fromCode) return null;
  if (fromCode.name && a.name && fromCode.name.trim() !== a.name.trim()) return `Divergência: nome no código é "${fromCode.name}"`;
  return null;
}

const NAIPES: ArcanoNaipe[] = ["copas", "ouros", "espadas", "paus"];
const NAIPE_LABEL: Record<ArcanoNaipe, string> = {
  copas: "Copas",
  ouros: "Ouros",
  espadas: "Espadas",
  paus: "Paus",
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
          <TabsList className="h-12 bg-transparent flex flex-wrap justify-start">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white p-6 rounded-[2rem] border-2 border-[#C8A66A]/20 hover:border-[#C8A66A]/50 transition-all flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
                <span className="font-heading font-black text-3xl text-[#C8A66A]">{a.numeral || a.number}</span>
                <AdminBadge variant={a.validated ? "success" : "warning"}>{a.validated ? "Validado" : "Pendente"}</AdminBadge>
            </div>
            <div>
              <h3 className="font-heading text-xl font-black text-[#5B1F3D] leading-tight">{a.name}</h3>
              <p className="text-xs font-body font-bold text-[#5B1F3D]/40 mt-1">{a.subtitle || "Sem subtítulo"}</p>
            </div>
            <div className="flex gap-2 flex-wrap mt-auto">
                <AdminBadge variant="secondary">{a.type === "maior" ? "Maior" : `${NAIPE_LABEL[a.naipe as ArcanoNaipe] || ""} (${a.number > 10 ? 'Corte' : 'Numerado'})`}</AdminBadge>
                <AdminBadge variant={a.status === "published" ? "primary" : "outline"}>{STATUS_LABEL[a.status] || a.status}</AdminBadge>
            </div>
            <Button variant="outline" className="w-full h-11 text-xs font-heading font-black tracking-widest uppercase border-2 border-[#C8A66A]/30 rounded-xl hover:bg-[#5B1F3D] hover:text-white transition-all" onClick={() => setDrill(a)}>
              <FileText className="w-4 h-4 mr-2" /> Auditar
            </Button>
          </div>
        ))}
      </div>
      <CreateArcanoDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={() => { setCreateOpen(false); load(); }} />
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
        fields.forEach((f) => { (payload as any)[f] = draft[f]; });
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
        <div className="space-y-10">
            <div className="flex items-center gap-6">
                <Button 
                    variant="ghost" 
                    onClick={onBack}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-[#FAF5EF] border-2 border-[#C8A66A]/30 text-[#5B1F3D] hover:scale-110 transition-all"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                  <h1 className="font-heading text-3xl text-[#5B1F3D] font-black tracking-tight uppercase">{arcano.name}</h1>
                  <p className="text-[11px] font-heading tracking-[0.2em] uppercase text-[#C8A66A] font-bold">Editor Editorial</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Section title="Identidade" onSave={() => saveSection(["name", "subtitle", "numeral", "image_url", "keywords", "tags"])}>
                    <div className="grid grid-cols-2 gap-6">
                        <Field label="Nome"><Input value={draft.name} onChange={(e) => update("name", e.target.value)} className="h-12" /></Field>
                        <Field label="Subtítulo"><Input value={draft.subtitle ?? ""} onChange={(e) => update("subtitle", e.target.value)} className="h-12" /></Field>
                        <Field label="Numeral Romano"><Input value={draft.numeral ?? ""} onChange={(e) => update("numeral", e.target.value)} className="h-12" /></Field>
                        <Field label="Imagem URL"><Input value={draft.image_url ?? ""} onChange={(e) => update("image_url", e.target.value)} className="h-12" /></Field>
                    </div>
                </Section>
                
                <Section title="Conteúdo Editorial" onSave={() => saveSection(EDITORIAL_FIELDS.map((f) => f.key))} disabled={saving}>
                    <div className="grid gap-6">
                        {EDITORIAL_FIELDS.map((f) => (
                            <Field key={String(f.key)} label={`${f.essential ? "★ " : ""}${f.label}`} full>
                                {f.long ? (
                                    <Textarea rows={4} value={(draft[f.key] as string) ?? ""} onChange={(e) => update(f.key, e.target.value as any)} className="bg-white" />
                                ) : (
                                    <Input value={(draft[f.key] as string) ?? ""} onChange={(e) => update(f.key, e.target.value as any)} className="h-12" />
                                )}
                            </Field>
                        ))}
                    </div>
                </Section>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#C8A66A]/20 shadow-xl">
                  <h3 className="font-heading text-sm font-black text-[#5B1F3D] tracking-[0.2em] uppercase mb-6 border-b border-[#C8A66A]/10 pb-4">Ações do Editor</h3>
                  <div className="grid gap-4">
                    <Button variant="outline" className="w-full justify-start h-12 gap-3" onClick={() => saveSection(["status"])}>
                      <Save className="w-4 h-4 text-[#C8A66A]" /> Salvar Rascunho
                    </Button>
                    <Button variant="default" className="w-full justify-start h-12 gap-3 bg-[#5B1F3D] hover:bg-[#5B1F3D]/90" onClick={() => saveSection(["validated"])}>
                      <ShieldCheck className="w-4 h-4" /> Marcar como Validado
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
};

const Section = ({ title, children, onSave, disabled }: { title: string; children: React.ReactNode; onSave: () => void; disabled?: boolean }) => (
    <div className="rounded-[2.5rem] border-2 border-[#C8A66A]/20 bg-white/40 p-8 space-y-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-[#C8A66A]/10 pb-4">
            <h3 className="font-heading text-sm font-black text-[#5B1F3D] tracking-[0.2em] uppercase">{title}</h3>
            <Button size="sm" variant="outline" className="gap-2 h-10 px-4 text-[10px] font-heading font-black tracking-widest uppercase border-[#C8A66A]/30" onClick={onSave} disabled={disabled}>
                <Save className="w-3.5 h-3.5" /> Salvar Seção
            </Button>
        </div>
        {children}
    </div>
);

const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
    <div className={full ? "col-span-2" : ""}>
        <label className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]/50 mb-2 block">{label}</label>
        {children}
    </div>
);

const CreateArcanoDialog = ({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: (row: ArcanoRow) => void }) => {
    const [type, setType] = useState<ArcanoType>("maior");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        const { data, error } = await supabase.from("cms_arcanos").insert({ type, name: name.trim(), number: 0, status: 'draft', tier: 'premium' }).select().single();
        setLoading(false);
        if (error) {
          toast({ title: "Erro", description: error.message, variant: "destructive" });
          return;
        }
        onCreated(data as ArcanoRow);
        setName("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[3rem] border-4 border-[#C8A66A]/20 p-10 bg-[#FAF5EF]">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl font-black text-[#5B1F3D] uppercase tracking-tight">Novo Arcano</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <Field label="Nome">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: O Mago" className="h-12" />
                  </Field>
                  <Field label="Tipo">
                    <Select value={type} onValueChange={(v) => setType(v as ArcanoType)}>
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maior">Arcano Maior</SelectItem>
                        <SelectItem value="menor">Arcano Menor</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <DialogFooter className="mt-8">
                  <Button onClick={handleCreate} disabled={loading} className="w-full h-12 bg-[#5B1F3D] hover:bg-[#5B1F3D]/90 text-white font-heading font-black tracking-widest uppercase rounded-xl">
                    {loading ? "Criando..." : "Criar Arcano"}
                  </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdminArcanos;
