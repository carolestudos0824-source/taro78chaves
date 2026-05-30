import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  User, 
  ShieldCheck, 
  Activity, 
  BookOpen, 
  HelpCircle, 
  Flame, 
  Star, 
  Award, 
  Calendar,
  KeyRound,
  Layout,
  Crown,
  AlertCircle,
  Clock,
  Mail,
  Zap,
  CheckCircle2,
  Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminSectionHeading, AdminBadge, KPICard } from "./AdminComponents";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UserMatch {
  id: string;
  email: string;
  created_at: string;
}

interface ProgressAuditData {
  auth: {
    email: string | null;
    created_at: string | null;
    last_sign_in_at: string | null;
  } | null;
  profile: {
    user_id: string;
    display_name: string | null;
    is_premium: boolean;
    premium_until: string | null;
    premium_source: string | null;
    created_at: string;
    updated_at: string;
  };
  progress: {
    user_id: string;
    completed_lessons: string[];
    completed_modules: string[];
    completed_quizzes: string[];
    completed_exercises: string[];
    last_active: string;
    streak: number;
    xp: number;
    level: number;
  };
  roles: string[];
}

const AdminProgressAudit = () => {
  const [emailSearch, setEmailSearch] = useState("");
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [selectedUser, setSelectedUser] = useState<ProgressAuditData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSearch.trim() || emailSearch.length < 3) {
      toast({ title: "Email muito curto", description: "Digite pelo menos 3 caracteres.", variant: "destructive" });
      return;
    }

    setSearching(true);
    setMatches([]);
    setSelectedUser(null);

    try {
      const { data, error } = await supabase.functions.invoke("admin-manage", {
        body: { action: "search", email: emailSearch }
      });

      if (error || !data.ok) {
        toast({ title: "Erro na busca", description: data?.error || error?.message || "Erro desconhecido", variant: "destructive" });
      } else {
        setMatches(data.users || []);
        if (data.users?.length === 0) {
          toast({ title: "Nenhum usuário encontrado", description: "Verifique o email digitado." });
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erro na busca", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  const loadUserDetail = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage", {
        body: { action: "user_detail", target_user_id: userId }
      });

      if (error || !data.ok) {
        toast({ title: "Erro ao carregar detalhes", description: data?.error || error?.message || "Erro desconhecido", variant: "destructive" });
      } else {
        setSelectedUser(data);
        setMatches([]); // Clear matches after selection
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao carregar detalhes", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (data: ProgressAuditData) => {
    const isStaff = data.roles.includes("admin") || data.roles.includes("moderator");
    const isPremium = data.profile.is_premium;
    
    if (data.roles.includes("admin")) return { label: "Admin", variant: "warning" as const, type: "staff" };
    if (data.roles.includes("moderator")) return { label: "Auditor/Moderador", variant: "secondary" as const, type: "staff" };
    if (isPremium) return { label: "Premium", variant: "success" as const, type: "user" };
    return { label: "Usuária Comum", variant: "default" as const, type: "user" };
  };

  const arcanoNames: Record<number, string> = {
    0: "O Louco", 1: "O Mago", 2: "A Sacerdotisa", 3: "A Imperatriz",
    4: "O Imperador", 5: "O Hierofante", 6: "Os Enamorados", 7: "O Carro",
    8: "A Justiça", 9: "O Eremita", 10: "A Roda da Fortuna", 11: "A Força",
    12: "O Enforcado", 13: "A Morte", 14: "A Temperança", 15: "O Diabo",
    16: "A Torre", 17: "A Estrela", 18: "A Lua", 19: "O Sol",
    20: "O Julgamento", 21: "O Mundo",
  };

  const getArcanoProgress = (lessons: string[]) => {
    const arcanoIds = lessons
      .filter(l => l.startsWith("arcano-"))
      .map(l => parseInt(l.replace("arcano-", "")))
      .sort((a, b) => a - b);
    
    const lastCompleted = arcanoIds.length > 0 ? arcanoIds[arcanoIds.length - 1] : -1;
    const current = lastCompleted + 1;
    const next = current <= 21 ? current : null;
    
    return {
      current: lastCompleted >= 0 ? arcanoNames[lastCompleted] : "Nenhum",
      unlocked: next !== null ? arcanoNames[next] : "Jornada Concluída",
      count: arcanoIds.length
    };
  };

  return (
    <div className="space-y-10 pb-20">
      <AdminSectionHeading 
        title="Auditoria de Progresso" 
        subtitle="Validação técnica do fluxo de aprendizado e persistência de dados no Supabase." 
      />

      {/* Search Area */}
      <div className="bg-white rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl max-w-2xl">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60 ml-2">
            Buscar aluna por e-mail
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A66A]" />
              <Input 
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                placeholder="exemplo@email.com"
                className="pl-12 h-14 rounded-2xl border-2 border-[#C8A66A]/20 focus:border-[#C8A66A] bg-[#FAF5EF]/30 font-body font-bold"
              />
            </div>
            <Button 
              type="submit" 
              disabled={searching}
              className="h-14 px-8 rounded-2xl bg-[#5B1F3D] hover:bg-[#3D1429] text-white font-heading font-black tracking-widest uppercase transition-all shadow-lg active:scale-95 shrink-0"
            >
              {searching ? "Buscando..." : <Search className="w-6 h-6" />}
            </Button>
          </div>
        </form>

        {matches.length > 0 && (
          <div className="mt-6 space-y-2 animate-fade-in">
            <p className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A] mb-3 ml-1">Resultados encontrados:</p>
            {matches.map(m => (
              <button
                key={m.id}
                onClick={() => loadUserDetail(m.id)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-[#C8A66A]/20 hover:border-[#C8A66A] hover:bg-[#FAF5EF]/50 transition-all text-left group"
              >
                <div className="flex flex-col">
                  <span className="font-heading font-black text-[#5B1F3D]">{m.email}</span>
                  <span className="text-[10px] text-[#5B1F3D]/40 tabular-nums">ID: {m.id}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-12 h-12 border-4 border-[#C8A66A]/20 border-t-[#5B1F3D] animate-spin rounded-full mb-4" />
          <p className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">Consultando Supabase...</p>
        </div>
      )}

      {selectedUser && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* User Status Bar */}
          <div className="bg-[#5B1F3D] rounded-[2rem] p-8 border-2 border-[#C8A66A] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-inner">
                  <User className="w-8 h-8 text-[#C8A66A]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-heading font-black tracking-tight">{selectedUser.auth?.email}</h3>
                  <div className="flex items-center gap-3">
                    <AdminBadge variant={getRoleInfo(selectedUser).variant}>{getRoleInfo(selectedUser).label}</AdminBadge>
                    <span className="text-[10px] opacity-40 tabular-nums font-mono">UID: {selectedUser.profile.user_id}</span>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "px-6 py-4 rounded-2xl border-2 flex items-center gap-4 transition-all",
                getRoleInfo(selectedUser).type === "staff" 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-200" 
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              )}>
                {getRoleInfo(selectedUser).type === "staff" ? (
                  <ShieldCheck className="w-6 h-6 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                )}
                <div>
                  <p className="text-[10px] font-heading font-black tracking-[0.2em] uppercase leading-none mb-1">Status de Persistência</p>
                  <p className="text-xs font-body font-bold">
                    {getRoleInfo(selectedUser).type === "staff" 
                      ? "Esta conta está em Modo Auditoria e não persiste progresso real."
                      : "Esta conta persiste progresso real no Supabase."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard 
              icon={<Zap className="w-6 h-6" />} 
              label="Experiência Total" 
              value={selectedUser.progress.xp} 
              description={`${selectedUser.progress.level} níveis conquistados`}
            />
            <KPICard 
              icon={<KeyRound className="w-6 h-6" />} 
              label="Chaves / Arcanos" 
              value={selectedUser.progress.completed_lessons.filter(l => l.startsWith("arcano-")).length} 
              description="Total de 78 chaves"
            />
            <KPICard 
              icon={<HelpCircle className="w-6 h-6" />} 
              label="Quizzes Vencidos" 
              value={selectedUser.progress.completed_quizzes.length} 
              description="Desafios de fixação"
            />
            <KPICard 
              icon={<Activity className="w-6 h-6" />} 
              label="Frequência (Streak)" 
              value={selectedUser.progress.streak} 
              description="Dias consecutivos"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Journey Status */}
            <div className="bg-white rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-[#C8A66A]/10 pb-4">
                <Layout className="w-5 h-5 text-[#5B1F3D]" />
                <h4 className="font-heading text-base font-black text-[#5B1F3D] uppercase tracking-tight">Status da Jornada</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#FAF5EF]">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Chave Atual</span>
                  <span className="text-sm font-heading font-black text-[#5B1F3D]">{getArcanoProgress(selectedUser.progress.completed_lessons).current}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#FAF5EF]">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Próximo Desbloqueio</span>
                  <span className="text-sm font-heading font-black text-[#C8A66A]">{getArcanoProgress(selectedUser.progress.completed_lessons).unlocked}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#FAF5EF]">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Portais Concluídos</span>
                  <span className="text-sm font-heading font-black text-[#5B1F3D]">{selectedUser.progress.completed_modules.length}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Última Atividade</span>
                  <div className="flex items-center gap-1.5 text-[#5B1F3D]/80">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{new Date(selectedUser.progress.last_active).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Details */}
            <div className="bg-white rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-[#C8A66A]/10 pb-4">
                <Crown className="w-5 h-5 text-[#C8A66A]" />
                <h4 className="font-heading text-base font-black text-[#5B1F3D] uppercase tracking-tight">Assinatura & Acesso</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#FAF5EF]">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Plano</span>
                  <AdminBadge variant={selectedUser.profile.is_premium ? "success" : "default"}>
                    {selectedUser.profile.is_premium ? "Premium" : "Gratuito"}
                  </AdminBadge>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#FAF5EF]">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Origem</span>
                  <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D] bg-[#FAF5EF] px-2 py-1 rounded border border-[#C8A66A]/20">
                    {selectedUser.profile.premium_source || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#FAF5EF]">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Expiração</span>
                  <span className="text-xs font-bold text-[#5B1F3D]">
                    {selectedUser.profile.premium_until ? new Date(selectedUser.profile.premium_until).toLocaleDateString('pt-BR') : "Ilimitado/Nenhum"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[11px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/60">Membro Desde</span>
                  <div className="flex items-center gap-1.5 text-[#5B1F3D]/80">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{new Date(selectedUser.profile.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Audit Logs Hint */}
            <div className="bg-[#FAF5EF] rounded-[2rem] p-8 border-2 border-[#C8A66A]/10 shadow-inner flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-[#C8A66A]/20 flex items-center justify-center">
                <Info className="w-8 h-8 text-[#C8A66A]" />
              </div>
              <div className="space-y-2">
                <h5 className="font-heading font-black text-[#5B1F3D] uppercase text-sm tracking-widest">Modo Somente Leitura</h5>
                <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/60 leading-relaxed">
                  Esta visualização audita diretamente os campos do Supabase para garantir a integridade da jornada do aluno.
                </p>
              </div>
              <button 
                onClick={() => window.open(`https://supabase.com/dashboard/project/qgmafelvslfbwxrogslm/editor/8447/tables/user_progress?filter=user_id%3Deq.${selectedUser.profile.user_id}`, '_blank')}
                className="text-[9px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A] hover:underline"
              >
                Ver na Tabela Supabase ↗
              </button>
            </div>
          </div>

          {/* Detailed Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-[#C8A66A]/10 pb-4">
                <BookOpen className="w-5 h-5 text-[#5B1F3D]" />
                <h4 className="font-heading text-base font-black text-[#5B1F3D] uppercase tracking-tight">Lições Concluídas</h4>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {selectedUser.progress.completed_lessons.length > 0 ? (
                    selectedUser.progress.completed_lessons.map(l => (
                      <span key={l} className="text-[9px] font-heading font-black tracking-widest uppercase px-3 py-1 bg-[#FAF5EF] border border-[#C8A66A]/20 rounded-lg text-[#5B1F3D]">
                        {l}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs italic text-[#5B1F3D]/40">Nenhuma lição registrada.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-[#C8A66A]/10 pb-4">
                <Star className="w-5 h-5 text-[#C8A66A]" />
                <h4 className="font-heading text-base font-black text-[#5B1F3D] uppercase tracking-tight">Quizzes Concluídos</h4>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {selectedUser.progress.completed_quizzes.length > 0 ? (
                    selectedUser.progress.completed_quizzes.map(q => (
                      <span key={q} className="text-[9px] font-heading font-black tracking-widest uppercase px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
                        {q}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs italic text-[#5B1F3D]/40">Nenhum quiz registrado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Policy Note */}
      <div className="p-8 rounded-[2rem] bg-amber-50 border-2 border-amber-200 flex gap-4 items-start shadow-inner">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
        <div className="space-y-2">
          <h5 className="font-heading font-black text-amber-800 uppercase text-xs tracking-[0.2em]">Diretriz de Auditoria Administrativa</h5>
          <p className="text-[11px] font-body font-bold text-amber-700 leading-relaxed italic">
            Contas com permissão 'admin' ou 'moderator' operam exclusivamente em Modo Auditoria para preservar a integridade dos dados estatísticos da plataforma. 
            Isso significa que ações pedagógicas (lições/quizzes) executadas por estas contas não geram registros persistentes no Supabase e não poluem o XP geral da escola.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProgressAudit;
