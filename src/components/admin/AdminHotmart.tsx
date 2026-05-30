import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, Users, Clock, AlertTriangle, 
  Search, RefreshCw, PlusCircle
} from "lucide-react";
import { 
  AdminSectionHeading, KPICard, AdminBadge, AdminTable, 
  AdminTableHeader, AdminTableHead, AdminTableRow, AdminTableCell 
} from "./AdminComponents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

/** @ts-ignore - Temporary fix for colSpan type issue */
const AdminTableCellFixed = AdminTableCell as any;

interface HotmartEvent {
  id: string;
  transaction_id: string;
  buyer_email: string;
  buyer_name: string;
  status?: string;
  processing_status?: string;
  event_type: string;
  created_at?: string;
}

interface HotmartEntitlement {
  id: string;
  user_id: string | null;
  buyer_email: string;
  buyer_name: string | null;
  transaction_id: string;
  status: string | null;
  access_status: string;

  premium_until: string | null;
  updated_at: string;
}

const AdminHotmart = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [entitlements, setEntitlements] = useState<HotmartEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [manualEmail, setManualEmail] = useState("");
  const [manualTransaction, setManualTransaction] = useState("");
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [releasing, setReleasing] = useState(false);

  const load = async () => {
    setLoading(true);
    const [evts, ents] = await Promise.all([
      supabase.from("hotmart_events").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("hotmart_entitlements").select("*").order("updated_at", { ascending: false })

    ]);
    setEvents(evts.data || []);
    setEntitlements(ents.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleManualRelease = async () => {
    if (!manualEmail || !manualTransaction) {
      toast.error("Preencha todos os campos");
      return;
    }

    setReleasing(true);
    try {
      const { data, error } = await supabase.rpc("manually_release_hotmart_access", {
        p_email: manualEmail,
        p_transaction_id: manualTransaction
      });

      if (error) throw error;

      if ((data as any).success) {
        toast.success((data as any).message);
        setIsManualDialogOpen(false);
        setManualEmail("");
        setManualTransaction("");
        load();
      } else {
        toast.error((data as any).message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Falha ao liberar acesso manual");
    } finally {
      setReleasing(false);
    }
  };

  const stats = {
    approved: entitlements.filter(e => e.status === "approved" || e.status === "complete").length,
    activeAccess: entitlements.filter(e => e.access_status === "active").length,
    pending: entitlements.filter(e => e.access_status === "pending_user" || (!e.user_id && e.access_status === "active")).length,
    refunded: entitlements.filter(e => e.status === "refunded" || e.status === "chargeback").length,
    errors: events.filter(e => e.processing_status === "error" || e.event_type === "error").length,
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
      return <AdminBadge variant="success">Ativo</AdminBadge>;
    }
    if (status === "pending_user") {
      return <AdminBadge variant="warning">Aguardando cadastro</AdminBadge>;
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
        subtitle="As vendas e pagamentos são gerenciados pela Hotmart. Este painel mostra apenas o status de acesso dentro da plataforma." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard icon={<ShoppingBag />} label="Compras Aprovadas" value={stats.approved} description="Transações confirmadas" />
        <KPICard icon={<Users />} label="Acessos Ativos Hotmart" value={stats.activeAccess} accent="text-emerald-600" description="Acesso liberado no app" />
        <KPICard icon={<Clock />} label="Aguardando Cadastro" value={stats.pending} accent="text-amber-600" description="Pendente criação de conta" />
        <KPICard icon={<AlertTriangle />} label="Reembolsos/Chargebacks" value={stats.refunded} accent="text-red-600" description="Vendas canceladas" />
        <KPICard icon={<RefreshCw />} label="Eventos com Erro" value={stats.errors} accent="text-red-600" description="Falhas de processamento" />
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

          <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-6 bg-[#5B1F3D] hover:bg-[#4A1931] text-white rounded-2xl flex gap-2 font-heading font-black tracking-widest uppercase">
                <PlusCircle className="w-5 h-5" />
                Liberar Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] border-2 border-[#C8A66A]/30 bg-[#FAF5EF]">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl text-[#5B1F3D] font-black uppercase tracking-tight">Liberar Acesso Manual</DialogTitle>
                <DialogDescription className="font-body font-bold text-[#5B1F3D]/70">
                  Use esta ferramenta apenas se o webhook da Hotmart falhar ou para casos excepcionais.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60 ml-2">E-mail da Compradora</label>
                  <Input 
                    value={manualEmail}
                    onChange={e => setManualEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="h-14 bg-white border-[#C8A66A]/30 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60 ml-2">ID da Transação Hotmart</label>
                  <Input 
                    value={manualTransaction}
                    onChange={e => setManualTransaction(e.target.value)}
                    placeholder="HP..."
                    className="h-14 bg-white border-[#C8A66A]/30 rounded-2xl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleManualRelease} 
                  disabled={releasing}
                  className="w-full h-14 bg-[#5B1F3D] hover:bg-[#4A1931] text-white rounded-2xl font-heading font-black tracking-widest uppercase"
                >
                  {releasing ? "Processando..." : "Confirmar Liberação"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="font-heading text-lg text-[#5B1F3D] font-black">Direitos de Acesso (Entitlements)</h3>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHead>Compradora</AdminTableHead>
            <AdminTableHead className="text-center">Transação</AdminTableHead>
            <AdminTableHead className="text-center">Status Venda</AdminTableHead>
            <AdminTableHead className="text-center">Status Acesso</AdminTableHead>
            <AdminTableHead className="text-center">Usuário</AdminTableHead>
            <AdminTableHead className="text-center">Expira em</AdminTableHead>
            <AdminTableHead className="text-right">Criado/Atualizado</AdminTableHead>

          </AdminTableHeader>
          <tbody>
            {filteredEntitlements.length === 0 ? (
              <AdminTableRow>
                <AdminTableCellFixed colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum registro encontrado.</AdminTableCellFixed>
              </AdminTableRow>
            ) : (
              filteredEntitlements.map(e => (
                <AdminTableRow key={e.id}>
                  <AdminTableCellFixed>
                    <p className="text-[#5B1F3D] font-black leading-tight">{e.buyer_name || "—"}</p>
                    <p className="text-[10px] font-body font-bold text-[#5B1F3D]/60">{e.buyer_email}</p>
                  </AdminTableCellFixed>
                  <AdminTableCellFixed className="text-center font-mono text-xs">{e.transaction_id}</AdminTableCellFixed>
                  <AdminTableCellFixed className="text-center">
                    <AdminBadge variant={
                      e.status === 'approved' ? 'success' : 
                      e.status === 'refunded' || e.status === 'chargeback' ? 'destructive' : 'outline'
                    }>
                      {e.status || '—'}
                    </AdminBadge>

                  </AdminTableCellFixed>
                  <AdminTableCellFixed className="text-center">
                    {getStatusBadge(e.access_status, e.user_id)}
                  </AdminTableCellFixed>
                  <AdminTableCellFixed className="text-center">
                    {e.user_id ? (
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">VINCULADO</span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-1 rounded">PENDENTE</span>
                    )}
                  </AdminTableCellFixed>
                  <AdminTableCellFixed className="text-center text-xs font-body font-bold">
                    {e.premium_until ? new Date(e.premium_until).toLocaleDateString("pt-BR") : "—"}
                  </AdminTableCellFixed>
                  <AdminTableCellFixed className="text-right">
                    <p className="text-[10px] text-muted-foreground">C: {new Date((e as any).created_at).toLocaleDateString("pt-BR")}</p>
                    <p className="text-[10px] text-muted-foreground">U: {new Date(e.updated_at).toLocaleDateString("pt-BR")}</p>
                  </AdminTableCellFixed>

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