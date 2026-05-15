import { useEffect, useMemo, useState } from "react";
import { AdminSectionHeading } from "./AdminComponents";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  empty: "bg-muted/40 text-muted-foreground border-border/50",
  partial: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  draft: "bg-secondary/10/10 text-secondary dark:text-secondary border-secondary/30/20",
  published: "bg-primary/10 text-primary border-primary/20",
};

const StatusIcon = ({ status }: { status: ArcanoStatus }) => {
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

// 17 editorial fields config — `essential: true` define campos obrigatórios para validação
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

/** Quantos dos 8 campos essenciais estão preenchidos */
function countEssentialFilled(a: ArcanoRow): number {
  return ESSENTIAL_FIELDS.filter((f) => {
    const v = a[f.key];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
}

/** Régua mínima para publicar: 100% dos essenciais */
function meetsPublishBar(a: ArcanoRow): boolean {
  return countEssentialFilled(a) === ESSENTIAL_FIELDS.length;
}

/** Régua mínima para validar: essenciais + revisão rápida + keywords */
function meetsValidationBar(a: ArcanoRow): boolean {
  const revOk = typeof a.revisao_rapida === "string" && a.revisao_rapida.trim().length > 0;
  const kwOk = Array.isArray(a.keywords) && a.keywords.length > 0;
  return meetsPublishBar(a) && revOk && kwOk;
}

/** Ordem de prioridade da fila de fechamento editorial */
function queueRank(a: ArcanoRow): number {
  if (a.validated) return 999;
  const prio = priorityOf(a);
  // 1) quase prontos primeiro
  if (prio === "almost") return 0;
  // 2) críticos gratuitos
  if (prio === "critical" && a.tier === "free") return 1;
  // 3) críticos premium maiores (mais centrais)
  if (prio === "critical" && a.tier === "premium" && a.type === "maior") return 2;
  // 4) críticos premium menores
  if (prio === "critical") return 3;
  // 5) incompletos
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
  const filled = countFilled(a);
  if (filled === 0) return "empty";
  if (filled < EDITORIAL_FIELDS.length) return "partial";
  return "draft";
}

function countFilled(a: ArcanoRow): number {
  return EDITORIAL_FIELDS.filter((f) => {
    const v = a[f.key];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
}

function missingFields(a: ArcanoRow): string[] {
  return EDITORIAL_FIELDS.filter((f) => {
    const v = a[f.key];
    return !(typeof v === "string" && v.trim().length > 0);
  }).map((f) => f.label);
}

function completionPercent(a: ArcanoRow): number {
  return Math.round((countFilled(a) / EDITORIAL_FIELDS.length) * 100);
}

/** Régua editorial de prioridade */
export type Priority = "validated" | "almost" | "incomplete" | "critical";

function priorityOf(a: ArcanoRow): Priority {
  if (a.validated) return "validated";
  const filled = countFilled(a);
  const total = EDITORIAL_FIELDS.length;
  // Crítico: publicado sem validação E com menos de 30% preenchido
  if (a.status === "published" && filled / total < 0.3) return "critical";
  // Quase pronto: faltam 3 campos ou menos
  if (total - filled <= 3) return "almost";
  // Incompleto: estrutura existe, mas faltam vários
  return "incomplete";
}

const PRIORITY_LABEL: Record<Priority, string> = {
  validated: "Validado",
  almost: "Quase pronto",
  incomplete: "Incompleto",
  critical: "Crítico",
};

const PRIORITY_TONE: Record<Priority, string> = {
  validated: "bg-primary/10/10 text-primary dark:text-primary border-primary/30/20",
  almost: "bg-secondary/10/10 text-secondary dark:text-secondary border-secondary/30/20",
  incomplete: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
};

function checkInconsistency(a: ArcanoRow): string | null {
  if (a.type !== "maior") return null;
  const fromCode = EDITORIAL_REGISTRY[a.number];
  if (!fromCode) return null;
  if (fromCode.name && a.name && fromCode.name.trim() !== a.name.trim()) {
    return `Divergência: nome no código é "${fromCode.name}"`;
  }
  return null;
}

const AdminArcanos = () => {
  const [arcanos, setArcanos] = useState<ArcanoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | ArcanoType>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [filterTier, setFilterTier] = useState<"all" | ArcanoTier>("all");
  const [filterValidated, setFilterValidated] = useState<"all" | "yes" | "no">("all");
  const [filterNaipe, setFilterNaipe] = useState<"all" | ArcanoNaipe>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority | "published_unvalidated">("all");
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
    if (error) {
      toast({ title: "Erro ao carregar arcanos", description: error.message, variant: "destructive" });
    }
    setArcanos(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const list = arcanos.filter((a) => {
      if (filterType !== "all" && a.type !== filterType) return false;
      if (filterNaipe !== "all" && a.naipe !== filterNaipe) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (filterTier !== "all" && a.tier !== filterTier) return false;
      if (filterValidated === "yes" && !a.validated) return false;
      if (filterValidated === "no" && a.validated) return false;
      if (filterPriority !== "all") {
        if (filterPriority === "published_unvalidated") {
          if (!(a.status === "published" && !a.validated)) return false;
        } else if (priorityOf(a) !== filterPriority) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !(a.subtitle ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
    // ordenação por fila editorial: quase prontos → críticos free → críticos premium maiores → críticos premium menores → incompletos → validados
    return list.sort((a, b) => {
      const ra = queueRank(a);
      const rb = queueRank(b);
      if (ra !== rb) return ra - rb;
      // dentro do mesmo grupo: mais completos primeiro
      return countFilled(b) - countFilled(a);
    });
  }, [arcanos, filterType, filterStatus, filterTier, filterValidated, filterNaipe, filterPriority, search]);

  const stats = useMemo(() => {
    const total = arcanos.length;
    const published = arcanos.filter((a) => a.status === "published").length;
    const validated = arcanos.filter((a) => a.validated).length;
    const inconsistent = arcanos.filter((a) => checkInconsistency(a)).length;
    const critical = arcanos.filter((a) => priorityOf(a) === "critical").length;
    const almost = arcanos.filter((a) => priorityOf(a) === "almost").length;
    const incomplete = arcanos.filter((a) => priorityOf(a) === "incomplete").length;
    const publishedUnvalidated = arcanos.filter((a) => a.status === "published" && !a.validated).length;
    const queue = arcanos.filter((a) => !a.validated).sort((a, b) => queueRank(a) - queueRank(b));
    return { total, published, validated, inconsistent, critical, almost, incomplete, publishedUnvalidated, queue };
  }, [arcanos]);

  if (drill) {
    return (
      <ArcanoEditor
        arcano={drill}
        onBack={() => {
          setDrill(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading text-lg text-foreground">Arcanos</h2>
          <p className="text-sm text-muted-foreground">
            CMS editorial — duas réguas: <strong className="text-foreground">essencial de publicação</strong> ({ESSENTIAL_FIELDS.length} campos · obrigatórios) e <strong className="text-foreground">editorial total</strong> ({EDITORIAL_FIELDS.length} campos · contador completo do admin).
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Novo Arcano
        </Button>
      </div>

      {stats.critical > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div className="text-xs text-destructive flex-1">
              <strong>Contenção editorial ativa.</strong> {stats.critical} arcano{stats.critical > 1 ? "s estão" : " está"} publicado{stats.critical > 1 ? "s" : ""} sem validação e com menos de 30% do conteúdo editorial preenchido no DB.
              <div className="mt-1 text-[11px] text-destructive/80">
                Regra objetiva: <strong>validação só é permitida com ≥6 dos 10 campos essenciais</strong> (essência, símbolos, luz, sombra, amor, trabalho, espiritualidade, voz, revisão rápida, palavras-chave). O DB bloqueia automaticamente validações abaixo desse limite. Conteúdo é servido por arquivos editoriais até a sincronização.
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap pl-6">
            <button
              onClick={() => setFilterPriority("critical")}
              className="text-[11px] px-2.5 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              Filtrar críticos
            </button>
            <button
              onClick={async () => {
                if (!confirm(`Rebaixar ${stats.critical} arcano(s) críticos para rascunho? A exibição no app será contida até atingirem a régua editorial.`)) return;
                const ids = arcanos.filter((a) => priorityOf(a) === "critical").map((a) => a.id);
                const { error } = await supabase.from("cms_arcanos").update({ status: "draft" }).in("id", ids);
                if (error) {
                  toast({ title: "Erro", description: error.message, variant: "destructive" });
                  return;
                }
                await logAdminAction({
                  action: "arcano.bulk_demote_critical",
                  targetType: "arcano",
                  targetId: null,
                  targetLabel: `${ids.length} críticos`,
                  details: { count: ids.length, ids },
                });
                toast({ title: `${ids.length} arcano(s) rebaixados para rascunho` });
                load();
              }}
              className="text-[11px] px-2.5 py-1 rounded-full border border-destructive/40 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              Rebaixar todos para rascunho
            </button>
          </div>
        </div>
      )}

      {stats.queue.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-heading text-sm tracking-wider text-foreground">Fila de fechamento editorial</h3>
              <p className="text-[11px] text-muted-foreground">
                {stats.queue.length} arcano{stats.queue.length > 1 ? "s" : ""} pendente{stats.queue.length > 1 ? "s" : ""} até {stats.total}/{stats.total} validados.
                Ordem: quase prontos → críticos gratuitos → críticos premium maiores → críticos premium menores → incompletos.
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterPriority("almost")}
                className="text-[11px] px-2 py-1 rounded-full border border-secondary/30/20 bg-secondary/10/10 text-secondary dark:text-secondary"
              >
                {stats.almost} quase prontos
              </button>
              <button
                onClick={() => setFilterPriority("incomplete")}
                className="text-[11px] px-2 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              >
                {stats.incomplete} incompletos
              </button>
              <button
                onClick={() => setFilterPriority("critical")}
                className="text-[11px] px-2 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive"
              >
                {stats.critical} críticos
              </button>
            </div>
          </div>
          <div className="grid gap-1">
            {stats.queue.slice(0, 5).map((a, idx) => {
              const filled = countFilled(a);
              const total = EDITORIAL_FIELDS.length;
              const missing = missingFields(a);
              const prio = priorityOf(a);
              return (
                <button
                  key={a.id}
                  onClick={() => setDrill(a)}
                  className="text-left flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <span className="text-[10px] font-mono text-muted-foreground w-5">#{idx + 1}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${PRIORITY_TONE[prio]}`}
                  >
                    {PRIORITY_LABEL[prio]}
                  </span>
                  <span className="text-xs font-medium text-foreground truncate flex-1">
                    {a.name} <span className="text-muted-foreground">· {a.type === "maior" ? "Maior" : `Menor (${a.naipe ?? ""})`} · {a.tier}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap" title={`Essencial ${countEssentialFilled(a)}/${ESSENTIAL_FIELDS.length} · Editorial ${filled}/${total}`}>
                    Ess {countEssentialFilled(a)}/{ESSENTIAL_FIELDS.length} · Ed {filled}/{total}
                  </span>
                </button>
              );
            })}
            {stats.queue.length > 5 && (
              <p className="text-[11px] text-muted-foreground text-center pt-1">
                +{stats.queue.length - 5} na fila — use o filtro abaixo para ver todos.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Publicados" value={stats.published} tone="primary" />
        <StatCard label="Validados" value={stats.validated} tone="emerald" />
        <StatCard label="Pub. s/ validação" value={stats.publishedUnvalidated} tone="amber" />
        <StatCard label="Críticos" value={stats.critical} tone="destructive" />
        <StatCard label="Quase prontos" value={stats.almost} tone="blue" />
      </div>

      <Tabs
        value={filterType === "all" ? "all" : filterType}
        onValueChange={(v) => setFilterType(v as "all" | ArcanoType)}
      >
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="maior">Maiores</TabsTrigger>
          <TabsTrigger value="menor">Menores</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="relative col-span-2 sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar arcano..."
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTier} onValueChange={(v) => setFilterTier(v as typeof filterTier)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos acessos</SelectItem>
            <SelectItem value="free">Gratuito</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterValidated} onValueChange={(v) => setFilterValidated(v as typeof filterValidated)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Validação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="yes">Validados</SelectItem>
            <SelectItem value="no">Pendentes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as typeof filterPriority)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas prioridades</SelectItem>
            <SelectItem value="critical">🔴 Críticos</SelectItem>
            <SelectItem value="incomplete">🟡 Incompletos</SelectItem>
            <SelectItem value="almost">🔵 Quase prontos</SelectItem>
            <SelectItem value="validated">🟢 Validados</SelectItem>
            <SelectItem value="published_unvalidated">⚠️ Publicados sem validação</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filterType === "menor" && (
        <Tabs value={filterNaipe} onValueChange={(v) => setFilterNaipe(v as typeof filterNaipe)}>
          <TabsList>
            <TabsTrigger value="all">Todos naipes</TabsTrigger>
            {NAIPES.map((n) => (
              <TabsTrigger key={n} value={n}>
                {NAIPE_LABEL[n]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground py-8 text-center">Carregando arcanos...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border/50 rounded-xl">
          <p className="text-sm text-muted-foreground">Nenhum arcano encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-1.5">
          {filtered.map((a) => {
            const eff = effectiveStatus(a);
            const inc = checkInconsistency(a);
            const filled = countFilled(a);
            const total = EDITORIAL_FIELDS.length;
            const missing = missingFields(a);
            const prio = priorityOf(a);
            const isPubUnvalidated = a.status === "published" && !a.validated;
            return (
              <button
                key={a.id}
                onClick={() => setDrill(a)}
                className={`text-left flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                  prio === "critical"
                    ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10"
                    : "border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/30"
                }`}
              >
                <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center font-heading text-xs text-primary shrink-0">
                  {a.numeral || a.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-foreground truncate">{a.name}</h3>
                    {a.naipe && (
                      <span className="text-[10px] text-muted-foreground">de {NAIPE_LABEL[a.naipe]}</span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${PRIORITY_TONE[prio]}`}
                    >
                      {PRIORITY_LABEL[prio]}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${STATUS_TONE[eff]}`}
                    >
                      <StatusIcon status={eff} />
                      {STATUS_LABEL[eff]}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        a.tier === "premium"
                          ? "bg-primary/10 text-primary"
                          : "bg-primary/10/10 text-primary dark:text-primary"
                      }`}
                    >
                      {a.tier === "premium" ? "Premium" : "Gratuito"}
                    </span>
                    {isPubUnvalidated && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="w-3 h-3" /> Publicado sem validação
                      </span>
                    )}
                    {inc && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-3 h-3" /> Inconsistência
                      </span>
                    )}
                  </div>
                  {a.subtitle && <p className="text-[11px] text-muted-foreground truncate">{a.subtitle}</p>}
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-foreground">
                      {filled}/{total} campos
                    </span>
                    {missing.length > 0 && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        · faltam: {missing.slice(0, 3).join(", ")}
                        {missing.length > 3 && ` +${missing.length - 3}`}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <CreateArcanoDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(row) => {
          setCreateOpen(false);
          setDrill(row);
          load();
        }}
      />
    </div>
  );
};

/* ═══════════ Stat Card ═══════════ */

const StatCard = ({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "primary" | "emerald" | "amber" | "destructive" | "blue";
}) => {
  const toneClass = {
    default: "border-border/50 text-foreground",
    primary: "border-primary/20 text-primary bg-primary/5",
    emerald: "border-primary/30/20 text-primary dark:text-primary bg-primary/10/5",
    amber: "border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5",
    destructive: "border-destructive/30 text-destructive bg-destructive/5",
    blue: "border-secondary/30/20 text-secondary dark:text-secondary bg-secondary/10/5",
  }[tone];
  return (
    <div className={`p-3 rounded-xl border ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-2xl font-heading mt-1">{value}</div>
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

export default AdminArcanos;
