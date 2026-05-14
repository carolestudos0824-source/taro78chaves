import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Search, Filter, RotateCcw, ExternalLink, 
  Code, Info, ChevronRight
} from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
import { FULL_DECK } from "@/registry/deck-registry";
import { MODULES_SEED } from "@/lib/content/seed-modules";
import { ARCANOS_MAIORES_CATALOG } from "@/lib/content";

// ==========================================
// TYPES & INTERFACES
// ==========================================

type AuditStatus = 'Pendente' | 'Aprovada' | 'Reprovada' | 'Corrigir';

interface AuditEntry {
  status: AuditStatus;
  observation: string;
  updatedAt: string;
}

type AuditData = Record<string, AuditEntry>;

interface RouteItem {
  id: string; // Unique ID for storage
  path: string;
  name: string;
  group: string;
  type: 'Public' | 'App' | 'Module' | 'Lesson' | 'Quiz' | 'Legal' | 'State';
  instructions?: string;
}

// ==========================================
// CONSTANTS & DATA
// ==========================================

const STORAGE_KEY = "tarot-78-audit-v1";

const ROUTE_LIST: RouteItem[] = [
  // BLOCO 1 — PÁGINAS PÚBLICAS
  { id: "p01", path: "/", name: "Landing Page", group: "Públicas", type: "Public" },
  { id: "p02", path: "/auth", name: "Login/Cadastro", group: "Públicas", type: "Public" },
  { id: "p03", path: "/reset-password", name: "Recuperar Senha", group: "Públicas", type: "Public" },
  { id: "p04", path: "/apresentacao", name: "Apresentação", group: "Públicas", type: "Public" },
  { id: "p05", path: "/privacidade", name: "Política de Privacidade", group: "Públicas", type: "Legal" },
  { id: "p06", path: "/termos", name: "Termos de Uso", group: "Públicas", type: "Legal" },
  { id: "p07", path: "/suporte", name: "Suporte", group: "Públicas", type: "Public" },
  { id: "p08", path: "/excluir-conta", name: "Excluir Conta", group: "Públicas", type: "Legal" },

  // BLOCO 2 — APP PRINCIPAL
  { id: "a09", path: "/app", name: "Jornada Principal (Dashboard)", group: "App", type: "App" },
  { id: "a10", path: "/trilhas", name: "Trilhas de Formação (Mapa)", group: "Trilhas", type: "App" },
  { id: "a11", path: "/perfil", name: "Perfil", group: "App", type: "App" },
  { id: "a11", path: "/premium", name: "Premium", group: "App", type: "App" },
  { id: "a12", path: "/feedback", name: "Feedback", group: "App", type: "App" },

  // BLOCO 3 — RITUAL DIÁRIO
  { id: "r13", path: "/desafios", name: "Ritual Diário", group: "Ritual", type: "App" },
  { id: "r14", path: "/desafios", name: "Carta do Dia", group: "Ritual", type: "State", instructions: "Estado interno — acessar pelo Ritual Diário" },
  { id: "r15", path: "/revisao", name: "Revisão Rápida", group: "Ritual", type: "App" },
  { id: "r16", path: "/desafios", name: "3 Perguntas do Dia", group: "Ritual", type: "State", instructions: "Estado interno — acessar pelo Ritual Diário" },
  { id: "r17", path: "/desafios", name: "Símbolo do Dia", group: "Ritual", type: "State", instructions: "Estado interno — acessar pelo Ritual Diário" },
  { id: "r18", path: "/desafios", name: "Combinação do Dia", group: "Ritual", type: "State", instructions: "Estado interno — acessar pelo Ritual Diário" },
  { id: "r19", path: "/desafios", name: "Mini Interpretação", group: "Ritual", type: "State", instructions: "Estado interno — acessar pelo Ritual Diário" },

  // BLOCO 4 — MÓDULOS
  ...MODULES_SEED.map((m, idx) => ({
    id: `m${20 + idx}`,
    path: m.route,
    name: m.name,
    group: "Módulos",
    type: "Module" as const
  })),

  // BLOCO 5 — LIÇÕES DOS ARCANOS MAIORES
  ...ARCANOS_MAIORES_CATALOG.map((c, idx) => ({
    id: `l${36 + idx}`,
    path: `/lesson/${c.id}`,
    name: `${c.numeral || c.id} - ${c.name}`,
    group: "Lições (Maiores)",
    type: "Lesson" as const
  })),

  // BLOCO 6 — ARCANOS MENORES
  ...FULL_DECK.filter(c => c.category !== "maior").map((c, idx) => ({
    id: `menor-${c.id}`,
    path: `/arcano-menor/${c.id}`,
    name: c.name,
    group: `Menores (${c.naipe ? c.naipe.charAt(0).toUpperCase() + c.naipe.slice(1) : 'Outros'})`,
    type: "Lesson" as const
  })),

  // BLOCO 7 — ESTADOS ESPECIAIS
  { id: "s-jornada", path: "/jornada-do-louco", name: "Jornada do Louco (Intro)", group: "Introdução", type: "App" },
  { id: "s-quiz", path: "/lesson/0", name: "Quiz de lição", group: "Estados", type: "Quiz", instructions: "Acessar através de uma lição e avançar até o quiz" },
  { id: "s-concl", path: "/lesson/0", name: "Conclusão de lição", group: "Estados", type: "State", instructions: "Completar o quiz de uma lição" },
  { id: "s-load", path: "/qa-rotas", name: "Loading", group: "Estados", type: "State", instructions: "Simular carregamento ou observar transição de rota" },
  { id: "s-notfound-arc", path: "/lesson/999", name: "Arcano não encontrado", group: "Estados", type: "State" },
  { id: "s-notfound-page", path: "/rota-inexistente", name: "NotFound controlado", group: "Estados", type: "State" },
  { id: "s-premium", path: "/lesson/1", name: "Premium bloqueado", group: "Estados", type: "State", instructions: "Tentar acessar conteúdo premium com conta free" },
];

// ==========================================
// COMPONENT
// ==========================================

const QARotasPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("Todas");
  const [auditData, setAuditData] = useState<AuditData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage when auditData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auditData));
  }, [auditData]);

  const updateAudit = (id: string, status: AuditStatus, observation?: string) => {
    setAuditData(prev => ({
      ...prev,
      [id]: {
        status,
        observation: observation ?? (prev[id]?.observation || ""),
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const updateObservation = (id: string, text: string) => {
    setAuditData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        observation: text,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const filteredRoutes = useMemo(() => {
    let result = ROUTE_LIST;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(term) || 
        r.path.toLowerCase().includes(term) ||
        r.group.toLowerCase().includes(term)
      );
    }

    if (filterType !== "Todas") {
      if (['Pendente', 'Aprovada', 'Reprovada', 'Corrigir'].includes(filterType)) {
        result = result.filter(r => {
          const status = auditData[r.id]?.status || 'Pendente';
          return status === filterType;
        });
      } else {
        result = result.filter(r => r.type === filterType || r.group.includes(filterType));
      }
    }

    return result;
  }, [searchTerm, filterType, auditData]);

  const stats = useMemo(() => {
    const total = ROUTE_LIST.length;
    const approved = Object.values(auditData).filter(a => a.status === 'Aprovada').length;
    const rejected = Object.values(auditData).filter(a => a.status === 'Reprovada').length;
    const correcting = Object.values(auditData).filter(a => a.status === 'Corrigir').length;
    const pending = total - approved - rejected - correcting;

    return { total, approved, rejected, correcting, pending };
  }, [auditData]);

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case 'Aprovada': return 'text-[#8B6914] bg-[#C8A66A]/10 border-[#C8A66A]/30';
      case 'Reprovada': return 'text-red-600 bg-red-50 border-red-200';
      case 'Corrigir': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const handleNext = (currentIndex: number) => {
    if (currentIndex < filteredRoutes.length - 1) {
      const nextRoute = filteredRoutes[currentIndex + 1];
      window.open(nextRoute.path, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#5B1F3D] font-body">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b-2 border-[#C8A66A40] px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate("/app")}
              className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FAF5EF] border-2 border-[#C8A66A30] text-[#5B1F3D] hover:scale-110 hover:border-[#C8A66A] transition-all shadow-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-heading text-2xl font-black tracking-tight leading-tight">Auditoria Tarô 78 Chaves</h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A]">Validação tela por tela</p>
                {Object.values(auditData).length > 0 && (
                  <>
                    <span className="text-[#C8A66A]/40 text-[10px]">•</span>
                    <p className="text-[10px] font-heading font-black text-[#5B1F3D]/40 uppercase tracking-widest">
                      Última ação: {new Date(Math.max(...Object.values(auditData).map(a => new Date(a.updatedAt).getTime()))).toLocaleDateString('pt-BR')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatCard label="Total" value={stats.total} color="text-[#5B1F3D]" />
            <StatCard label="Aprovadas" value={stats.approved} color="text-[#C8A66A]" />
            <StatCard label="Reprovadas" value={stats.rejected} color="text-red-600" />
            <StatCard label="Pendentes" value={stats.pending} color="text-slate-400" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 pb-28">
        {/* Filters & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A66A]" />
            <input 
              type="text"
              placeholder="Buscar por nome, rota ou grupo..."
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border-2 border-[#DCCFC2]/60 focus:border-[#C8A66A] outline-none font-bold transition-all shadow-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A66A]" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border-2 border-[#DCCFC2]/60 focus:border-[#C8A66A] outline-none font-bold transition-all shadow-sm appearance-none"
            >
              <option value="Todas">Todos os Tipos</option>
              <optgroup label="Status">
                <option value="Pendente">Pendentes</option>
                <option value="Aprovada">Aprovadas</option>
                <option value="Reprovada">Reprovadas</option>
                <option value="Corrigir">Para Corrigir</option>
              </optgroup>
              <optgroup label="Categorias">
                <option value="Public">Públicas</option>
                <option value="App">App Principal</option>
                <option value="Module">Módulos</option>
                <option value="Lesson">Lições</option>
                <option value="Quiz">Quizzes</option>
                <option value="Legal">Jurídico</option>
              </optgroup>
            </select>
          </div>

          <button 
            onClick={() => {
              if (confirm("Deseja resetar toda a auditoria local?")) {
                setAuditData({});
                localStorage.removeItem(STORAGE_KEY);
              }
            }}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-red-100 text-red-400 font-heading text-[10px] tracking-widest uppercase font-black hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Limpar Tudo
          </button>
        </div>

        {/* Evaluation Rubric Nudge */}
        <div className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-[#5B1F3D] to-[#3D1429] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A66A] opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-heading text-lg font-black tracking-widest uppercase mb-6 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#C8A66A]" /> Régua de Auditoria Premium
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
              {[
                "Abre sem erros ou tela branca",
                "Identidade Visual: Ameixa, Ouro e Marfim",
                "Mobile 390px: Perfeita legibilidade",
                "Continuidade: Parece parte da /app",
                "Pedagogia: Conteúdo claro e fluido",
                "CTA: Próximo passo evidente",
                "Sem imagens quebradas ou pálidas"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px] font-heading font-black tracking-wider uppercase opacity-80">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8A66A]" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route List */}
        <div className="space-y-6">
          {filteredRoutes.map((route, index) => {
            const audit = auditData[route.id] || { status: 'Pendente' as AuditStatus, observation: '', updatedAt: '' };
            
            return (
              <div 
                key={route.id}
                className="group relative bg-white rounded-[2.5rem] border-2 border-[#DCCFC2]/40 shadow-sm hover:shadow-xl hover:border-[#C8A66A40] transition-all p-8 md:p-10"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  {/* Info Section */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[12px] font-heading font-black text-[#C8A66A] tracking-[0.2em]">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-heading font-black tracking-widest uppercase border ${getStatusColor(audit.status)}`}>
                        {audit.status}
                      </span>
                      <span className="px-4 py-1 rounded-full text-[10px] font-heading font-black tracking-widest uppercase bg-[#FAF5EF] text-[#5B1F3D]/60 border border-[#DCCFC2]/40">
                        {route.group}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading text-2xl font-black tracking-tight mb-2">{route.name}</h3>
                      <div className="flex items-center gap-2 font-body font-bold text-[#5B1F3D]/40 text-sm">
                        <Code className="w-4 h-4" />
                        {route.path}
                      </div>
                    </div>

                    {route.instructions && (
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF5EF] border border-[#C8A66A20]">
                        <Info className="w-5 h-5 text-[#C8A66A] shrink-0 mt-0.5" />
                        <p className="text-xs font-bold leading-relaxed">{route.instructions}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
                    <a 
                      href={route.path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#FAF5EF] text-[#5B1F3D] font-heading text-[10px] tracking-widest uppercase font-black border-2 border-[#C8A66A20] hover:bg-[#5B1F3D] hover:text-white hover:border-[#5B1F3D] transition-all shadow-sm"
                    >
                      Abrir Tela <ExternalLink className="w-4 h-4" />
                    </a>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateAudit(route.id, 'Aprovada')}
                        className={`flex-1 flex items-center justify-center py-4 rounded-2xl border-2 transition-all shadow-sm ${
                          audit.status === 'Aprovada' 
                            ? 'bg-[#C8A66A] border-[#C8A66A] text-white' 
                            : 'bg-white border-[#C8A66A]/30 text-[#C8A66A] hover:bg-[#C8A66A]/10'
                        }`}
                        title="Aprovar"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => updateAudit(route.id, 'Reprovada')}
                        className={`flex-1 flex items-center justify-center py-4 rounded-2xl border-2 transition-all shadow-sm ${
                          audit.status === 'Reprovada' 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'bg-white border-red-100 text-red-500 hover:bg-red-50'
                        }`}
                        title="Reprovar"
                      >
                        <XCircle2 className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => updateAudit(route.id, 'Corrigir')}
                        className={`flex-1 flex items-center justify-center py-4 rounded-2xl border-2 transition-all shadow-sm ${
                          audit.status === 'Corrigir' 
                            ? 'bg-amber-600 border-amber-600 text-white' 
                            : 'bg-white border-amber-100 text-amber-500 hover:bg-amber-50'
                        }`}
                        title="Sinalizar Correção"
                      >
                        <AlertTriangle className="w-6 h-6" />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleNext(index)}
                      className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border-2 border-[#DCCFC2] text-[#5B1F3D] font-heading text-[10px] tracking-widest uppercase font-black hover:border-[#C8A66A] transition-all"
                    >
                      Próxima <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Observation Area */}
                <div className="mt-8 pt-8 border-t border-[#DCCFC2]/20">
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#C8A66A]/40" />
                    <textarea 
                      placeholder="Adicione observações sobre esta tela..."
                      value={audit.observation}
                      onChange={(e) => updateObservation(route.id, e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#FAF5EF]/50 border-2 border-transparent focus:border-[#C8A66A20] focus:bg-white outline-none font-bold text-sm min-h-[100px] transition-all resize-none"
                    />
                  </div>
                  {audit.updatedAt && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-heading font-black text-[#5B1F3D]/30 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Última atualização: {new Date(audit.updatedAt).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRoutes.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-[#DCCFC2]">
              <HelpCircle className="w-16 h-16 text-[#C8A66A]/20 mx-auto mb-6" />
              <h3 className="font-heading text-xl font-black mb-2">Nenhuma rota encontrada</h3>
              <p className="font-body text-[#5B1F3D]/60 font-bold">Tente ajustar seus filtros ou busca.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="h-[2px] w-24 bg-[#C8A66A40] mx-auto mb-10" />
        <p className="font-accent italic text-[#5B1F3D]/40 mb-8">Tarô 78 Chaves · Sistema de Auditoria Interna</p>
        <button 
          onClick={() => navigate("/app")}
          className="px-10 py-5 rounded-full bg-[#5B1F3D] text-white font-heading text-[11px] tracking-[0.3em] uppercase font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Finalizar Sessão
        </button>
      </footer>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

const StatCard = ({ label, value, color }: StatCardProps) => (
  <div className="px-5 py-3 rounded-2xl bg-white border-2 border-[#DCCFC2]/40 flex flex-col items-center min-w-[100px] shadow-sm">
    <span className="text-[9px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/40 mb-1">{label}</span>
    <span className={`text-xl font-heading font-black ${color}`}>{value}</span>
  </div>
);

export default QARotasPage;