import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, Users, Clock, AlertTriangle, 
  ExternalLink, Search, Filter, RefreshCw
} from "lucide-react";
import { 
  AdminSectionHeading, KPICard, AdminBadge, AdminTable, 
  AdminTableHeader, AdminTableHead, AdminTableRow, AdminTableCell 
} from "./AdminComponents";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HotmartEvent {
  id: string;
  transaction_id: string;
  buyer_email: string;
  buyer_name: string;
  status: string;
  event_type: string;
  created_at: string;
}

interface HotmartEntitlement {
  id: string;
  user_id: string | null;
  buyer_email: string;
  transaction_id: string;
  access_status: string;
  premium_until: string | null;
  updated_at: string;
}

const AdminHotmart = () => {
  const [events, setEvents] = useState<HotmartEvent[]>([]);
  const [entitlements, setEntitlements] = useState<HotmartEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const [evts, ents] = await Promise.all([
      supabase.from("hotmart_events").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("hotmart_entitlements").select("*").order("updated_at", { ascending: false })
    ]);
    setEvents(evts.data || []);
    setEntitlements(ents.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = {
    approved: entitlements.filter(e => e.access_status === "active").length,
    activeAccess: entitlements.filter(e => e.access_status === "active").length,
    pending: entitlements.filter(e => !e.user_id && e.access_status === "active").length,
    refunded: events.filter(e => e.status === "refunded").length,
    errors: events.filter(e => e.status === "error" || e.event_type === "error").length,
  };

  const filteredEntitlements = entitlements.filter(e => {
    const matchesSearch = e.buyer_email.toLowerCase().includes(search.toLowerCase()) || 
                         e.transaction_id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "pending_user" && !e.user_id) ||
                         (statusFilter === "active" && e.access_status === "active");
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string, userId?: string | null) => {
    if (status === "active") {
      if (!userId) return <AdminBadge variant="warning">Aguardando cadastro</AdminBadge>;
      return <AdminBadge variant="success">Ativo</AdminBadge>;
    }
    if (status === "refunded") return <AdminBadge variant="destructive">Reembolsado</AdminBadge>;
    if (status === "chargeback") return <AdminBadge variant="destructive">Chargeback</AdminBadge>;
    if (status === "cancelled") return <AdminBadge variant="default">Cancelado</AdminBadge>;
    return <AdminBadge variant="outline">{status}</AdminBadge>;
  };

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando dados Hotmart...</div>;

  return (
    <div className="space-y-12">
      <AdminSectionHeading 
        title="Operação Hotmart" 
        subtitle="Gestão operacional de acessos via Hotmart. Vendas e pagamentos reais devem ser conferidos no painel da Hotmart." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard icon={<ShoppingBag />} label="Compras Aprovadas" value={stats.approved} description="Total de transações ativas" />
        <KPICard icon={<Users />} label="Acessos Ativos" value={stats.activeAccess} accent="text-primary" description="Alunas com acesso liberado" />
        <KPICard icon={<Clock />} label="Aguardando Cadastro" value={stats.pending} accent="text-amber-600" description="Pagou mas não criou conta" />
        <KPICard icon={<AlertTriangle />} label="Alertas/Erros" value={stats.errors} accent="text-red-600" description="Eventos com falha técnica" />
      </div>

      <div className="bg-white/60 p-6 rounded-[2.5rem] border-2 border-[#C8A66A]/20 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B1F3D]/50" />
            <Input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Buscar por e-mail ou transação..." 
              className="pl-12 h-14 text-base font-body font-bold bg-white border-[#C8A66A]/30 rounded-2xl shadow-inner" 
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-56 h-14 text-xs font-heading font-black tracking-widest uppercase border-2 border-[#C8A66A]/30 bg-white rounded-2xl shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Apenas Ativos</SelectItem>
              <SelectItem value="pending_user">Pendente Cadastro</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={load} variant="outline" className="h-14 px-6 border-2 border-[#C8A66A]/30 rounded-2xl">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="font-heading text-lg text-[#5B1F3D] font-black">Direitos de Acesso (Entitlements)</h3>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHead>Compradora</AdminTableHead>
            <AdminTableHead className="text-center">Transação</AdminTableHead>
            <AdminTableHead className="text-center">Status</AdminTableHead>
            <AdminTableHead className="text-center">Vínculo User</AdminTableHead>
            <AdminTableHead className="text-center">Premium Até</AdminTableHead>
            <AdminTableHead className="text-right">Atualizado</AdminTableHead>
          </AdminTableHeader>
          <tbody>
            {filteredEntitlements.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum registro encontrado.</AdminTableCell>
              </AdminTableRow>
            ) : (
              filteredEntitlements.map(e => (
                <AdminTableRow key={e.id}>
                  <AdminTableCell>
                    <p className="text-[#5B1F3D] font-black leading-tight">{e.buyer_email}</p>
                  </AdminTableCell>
                  <AdminTableCell className="text-center font-mono text-xs">{e.transaction_id}</AdminTableCell>
                  <AdminTableCell className="text-center">
                    {getStatusBadge(e.access_status, e.user_id)}
                  </AdminTableCell>
                  <AdminTableCell className="text-center">
                    {e.user_id ? (
                      <span className="text-xs font-body font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Vinculado</span>
                    ) : (
                      <span className="text-xs font-body font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Pendente</span>
                    )}
                  </AdminTableCell>
                  <AdminTableCell className="text-center text-sm font-body font-bold">
                    {e.premium_until ? new Date(e.premium_until).toLocaleDateString("pt-BR") : "Vitalício"}
                  </AdminTableCell>
                  <AdminTableCell className="text-right text-xs text-muted-foreground">
                    {new Date(e.updated_at).toLocaleString("pt-BR")}
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </tbody>
        </AdminTable>
      </section>

      <p className="text-xs font-body font-bold text-[#5B1F3D]/60 bg-[#FAF5EF] p-5 rounded-2xl border border-[#C8A66A]/20 shadow-sm leading-relaxed text-center">
        As vendas e pagamentos são gerenciados pela Hotmart. Este painel mostra apenas o status de acesso dentro da plataforma. Para receita, saldo, saque, reembolso financeiro e parcelamento, consulte a Hotmart.
      </p>
    </div>
  );
};

export default AdminHotmart;