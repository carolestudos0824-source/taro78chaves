import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ACTION_LABELS, type AdminAction } from "@/lib/admin-audit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollText, Loader2, Eye } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { AdminSectionHeading } from "./AdminComponents";

interface AuditRow {
  id: string;
  admin_id: string;
  admin_email: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  target_label: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const PERIODS = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
  { value: "all", label: "Todo o período" },
];

const AdminAuditLog = () => {
  const { isAdmin } = useRole();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [adminFilter, setAdminFilter] = useState<string>("");
  const [period, setPeriod] = useState<string>("30");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let q = supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (period !== "all") {
        const since = new Date();
        since.setDate(since.getDate() - Number(period));
        q = q.gte("created_at", since.toISOString());
      }

      const { data, error } = await q;
      if (!error && data) setRows(data as AuditRow[]);
      setLoading(false);
    };
    load();
  }, [period]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (actionFilter !== "all" && r.action !== actionFilter) return false;
      if (adminFilter && !(r.admin_email ?? "").toLowerCase().includes(adminFilter.toLowerCase())) return false;
      return true;
    });
  }, [rows, actionFilter, adminFilter]);

  const admins = useMemo(
    () => Array.from(new Set(rows.map(r => r.admin_email).filter(Boolean))) as string[],
    [rows]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-primary" />
          Auditoria Administrativa
        </h2>
        <p className="text-sm text-muted-foreground">Rastro completo e imutável de todas as ações administrativas.</p>
      </div>

      {!isAdmin && (
        <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
          <Eye className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            <strong className="text-foreground">Modo leitura:</strong> moderadores podem visualizar a auditoria, mas apenas administradores geram novos registros.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger><SelectValue placeholder="Tipo de ação" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            {Object.entries(ACTION_LABELS).map(([k, label]) => (
              <SelectItem key={k} value={k}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Filtrar por e-mail do admin"
          value={adminFilter}
          onChange={e => setAdminFilter(e.target.value)}
          list="admin-emails"
        />
        <datalist id="admin-emails">
          {admins.map(a => <option key={a} value={a} />)}
        </datalist>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {PERIODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando registros…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Nenhum registro encontrado para os filtros atuais.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 text-xs text-muted-foreground">
                  <th className="text-left p-3 font-medium">Data</th>
                  <th className="text-left p-3 font-medium">Admin</th>
                  <th className="text-left p-3 font-medium">Ação</th>
                  <th className="text-left p-3 font-medium">Alvo</th>
                  <th className="text-left p-3 font-medium">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-border/10 last:border-0 hover:bg-muted/20">
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-3 text-foreground">{r.admin_email ?? r.admin_id.slice(0, 8)}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
                        {ACTION_LABELS[r.action as AdminAction] ?? r.action}
                      </span>
                    </td>
                    <td className="p-3 text-foreground">
                      <span className="text-muted-foreground text-xs">{r.target_type}</span>
                      {r.target_label && <div>{r.target_label}</div>}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">
                      {Object.keys(r.details ?? {}).length > 0 ? JSON.stringify(r.details) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Mostrando até 500 registros mais recentes. Os logs são imutáveis e não podem ser editados nem apagados.
      </p>
    </div>
  );
};

export default AdminAuditLog;
