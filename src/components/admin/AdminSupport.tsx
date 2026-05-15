import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, MessageSquare, Filter, Calendar, User as UserIcon, CheckCircle2, Clock, Inbox, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { logAdminAction } from "@/lib/admin-audit";
import { AdminSectionHeading } from "./AdminComponents";

type Status = "aberto" | "em_andamento" | "resolvido";
type StatusFilter = "all" | Status;
type PeriodFilter = "all" | "7d" | "30d" | "90d";

interface Ticket {
  id: string;
  user_id: string;
  type: string;
  message: string;
  page: string | null;
  rating: number | null;
  status: Status;
  admin_notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

const STATUS_META: Record<Status, { label: string; cls: string; icon: React.ReactNode }> = {
  aberto: { label: "Aberto", cls: "bg-amber-500/10 text-amber-600", icon: <Inbox className="w-3 h-3" /> },
  em_andamento: { label: "Em andamento", cls: "bg-secondary/10/10 text-secondary", icon: <Clock className="w-3 h-3" /> },
  resolvido: { label: "Resolvido", cls: "bg-primary/10/10 text-primary", icon: <CheckCircle2 className="w-3 h-3" /> },
};

const AdminSupport = () => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [userFilter, setUserFilter] = useState("");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("beta_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const list = (data ?? []) as Ticket[];
    setTickets(list);

    const ids = [...new Set(list.map((t) => t.user_id))];
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", ids);
      setProfiles(Object.fromEntries((profs ?? []).map((p) => [p.user_id, p.display_name ?? ""])));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const periodMs = periodFilter === "7d" ? 7 * 86400e3 : periodFilter === "30d" ? 30 * 86400e3 : periodFilter === "90d" ? 90 * 86400e3 : 0;
    const q = search.trim().toLowerCase();
    const u = userFilter.trim().toLowerCase();
    return tickets.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (periodMs && now - new Date(t.created_at).getTime() > periodMs) return false;
      if (u) {
        const name = (profiles[t.user_id] ?? "").toLowerCase();
        if (!name.includes(u) && !t.user_id.toLowerCase().includes(u)) return false;
      }
      if (q && !t.message.toLowerCase().includes(q) && !(t.page ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tickets, statusFilter, periodFilter, userFilter, search, profiles]);

  const counts = useMemo(() => ({
    aberto: tickets.filter((t) => t.status === "aberto").length,
    em_andamento: tickets.filter((t) => t.status === "em_andamento").length,
    resolvido: tickets.filter((t) => t.status === "resolvido").length,
  }), [tickets]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-6 pb-8">
      <AdminSectionHeading 
        title="Suporte & Feedback" 
        subtitle="Triagem estratégica de tickets e orientações vindas diretamente dos usuários e testadores beta." 
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <SupportStatCard label="Abertos" value={counts.aberto} icon={<Inbox className="w-5 h-5" />} accent="amber" />
        <SupportStatCard label="Em andamento" value={counts.em_andamento} icon={<Clock className="w-5 h-5" />} accent="blue" />
        <SupportStatCard label="Resolvidos" value={counts.resolvido} icon={<CheckCircle2 className="w-5 h-5" />} accent="emerald" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar mensagem ou página…" className="pl-9 h-9" />
        </div>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={userFilter} onChange={(e) => setUserFilter(e.target.value)} placeholder="Usuário…" className="pl-8 h-9 w-[160px]" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-[160px] h-9"><Filter className="w-3.5 h-3.5 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
          <SelectTrigger className="w-[140px] h-9"><Calendar className="w-3.5 h-3.5 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo período</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-sm text-muted-foreground p-8 text-center">Carregando…</div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded-xl border border-border/50 bg-card/30 text-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum ticket encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => {
            const meta = STATUS_META[t.status];
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className="w-full text-left p-3 rounded-lg border border-border/40 bg-card/40 hover:bg-card/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${meta.cls}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <span className="text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">{t.type}</span>
                    {t.rating != null && <span className="text-[10px] text-muted-foreground">★ {t.rating}</span>}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{new Date(t.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{t.message}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{profiles[t.user_id] || t.user_id.slice(0, 8)}</span>
                  {t.page && <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" />{t.page}</span>}
                  {t.admin_notes && <span className="text-primary">• com nota interna</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <TicketDialog
        ticket={selected}
        userName={selected ? profiles[selected.user_id] : undefined}
        currentUserId={user?.id}
        onClose={() => setSelected(null)}
        onChanged={(updated) => {
          setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          setSelected(updated);
        }}
      />
    </div>
  );
};

const StatCard = ({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent: "amber" | "blue" | "emerald" }) => {
  const cls = accent === "amber" ? "text-amber-600" : accent === "blue" ? "text-secondary" : "text-primary";
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-3">
      <div className={`flex items-center gap-1.5 text-xs ${cls}`}>{icon}<span>{label}</span></div>
      <p className="text-2xl font-heading text-foreground mt-1">{value}</p>
    </div>
  );
};

const TicketDialog = ({
  ticket, userName, currentUserId, onClose, onChanged,
}: {
  ticket: Ticket | null;
  userName?: string;
  currentUserId?: string;
  onClose: () => void;
  onChanged: (t: Ticket) => void;
}) => {
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNotes(ticket?.admin_notes ?? "");
  }, [ticket]);

  if (!ticket) return null;
  const meta = STATUS_META[ticket.status];

  const update = async (patch: Partial<Pick<Ticket, "status" | "admin_notes">>, successMsg: string, action: string) => {
    setBusy(true);
    const updates: {
      status?: Status;
      admin_notes?: string | null;
      resolved_at?: string | null;
      resolved_by?: string | null;
    } = { ...patch };
    if (patch.status === "resolvido") {
      updates.resolved_at = new Date().toISOString();
      updates.resolved_by = currentUserId ?? null;
    } else if (patch.status) {
      updates.resolved_at = null;
      updates.resolved_by = null;
    }

    const { data, error } = await supabase
      .from("beta_feedback")
      .update(updates)
      .eq("id", ticket.id)
      .select()
      .maybeSingle();

    setBusy(false);
    if (error || !data) {
      toast({ title: "Erro", description: error?.message ?? "Falha ao atualizar", variant: "destructive" });
      return;
    }
    toast({ title: successMsg });
    onChanged(data as Ticket);

    await logAdminAction({
      action: action as never,
      targetType: "feedback",
      targetId: ticket.id,
      targetLabel: ticket.message.slice(0, 60),
      details: patch,
    }).catch(() => {});
  };

  return (
    <Dialog open={!!ticket} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            Ticket
            <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${meta.cls}`}>
              {meta.icon} {meta.label}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border/40 bg-card/40 p-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              <span className="font-heading tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase text-[10px]">{ticket.type}</span>
              {ticket.rating != null && <span>★ {ticket.rating}</span>}
              <span>•</span>
              <span>{new Date(ticket.created_at).toLocaleString("pt-BR")}</span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.message}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-2 border-t border-border/30">
              <span><UserIcon className="w-3 h-3 inline mr-1" />{userName || ticket.user_id}</span>
              {ticket.page && <span>Página: {ticket.page}</span>}
              {ticket.resolved_at && <span>Resolvido em {new Date(ticket.resolved_at).toLocaleDateString("pt-BR")}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-heading tracking-wider text-muted-foreground uppercase">Observação interna</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas visíveis apenas para a equipe…"
              rows={3}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={busy || notes === (ticket.admin_notes ?? "")}
              onClick={() => update({ admin_notes: notes || null }, "Observação salva", "feedback.note")}
            >
              Salvar observação
            </Button>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/30">
            <p className="text-xs font-heading tracking-wider text-muted-foreground uppercase">Mudar status</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={ticket.status === "aberto" ? "default" : "outline"} disabled={busy || ticket.status === "aberto"}
                onClick={() => update({ status: "aberto" }, "Reaberto", "feedback.reopen")}>
                <Inbox className="w-3.5 h-3.5" /> Reabrir
              </Button>
              <Button size="sm" variant={ticket.status === "em_andamento" ? "default" : "outline"} disabled={busy || ticket.status === "em_andamento"}
                onClick={() => update({ status: "em_andamento" }, "Em andamento", "feedback.in_progress")}>
                <Clock className="w-3.5 h-3.5" /> Em andamento
              </Button>
              <Button size="sm" variant={ticket.status === "resolvido" ? "default" : "outline"} disabled={busy || ticket.status === "resolvido"}
                onClick={() => update({ status: "resolvido" }, "Resolvido", "feedback.resolve")}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Marcar resolvido
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose} className="ml-auto">
                <X className="w-3.5 h-3.5" /> Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSupport;
