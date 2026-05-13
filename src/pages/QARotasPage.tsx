import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Search, Shield, Globe, Lock, 
  BookOpen, Sparkles, AlertTriangle, ExternalLink, 
  Layout, Code, CheckCircle, XCircle, Info
} from "lucide-react";
import { DECK_REGISTRY, FULL_DECK } from "@/registry/deck-registry";
import { MODULES_SEED } from "@/lib/content/seed-modules";
import { NAIPES } from "@/registry/naipes";

const QARotasPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearch] = useState("");

  const groups = [
    {
      title: "Rotas Públicas",
      items: [
        { path: "/", name: "Landing Page", status: "Pública" },
        { path: "/auth", name: "Auth (Login/Signup)", status: "Pública" },
        { path: "/reset-password", name: "Redefinir Senha", status: "Pública" },
        { path: "/privacidade", name: "Privacidade", status: "Pública" },
        { path: "/termos", name: "Termos", status: "Pública" },
        { path: "/suporte", name: "Suporte", status: "Pública" },
        { path: "/excluir-conta", name: "Excluir Conta", status: "Pública" },
        { path: "/apresentacao", name: "Apresentação", status: "Pública" },
      ]
    },
    {
      title: "Rotas Principais (App Shell)",
      items: [
        { path: "/app", name: "Dashboard / Módulos", status: "Protegida" },
        { path: "/perfil", name: "Perfil do Usuário", status: "Protegida" },
        { path: "/premium", name: "Página Premium", status: "Protegida" },
        { path: "/feedback", name: "Página de Feedback", status: "Protegida" },
        { path: "/trilhas", name: "Trilhas de Estudo", status: "Protegida" },
        { path: "/minha-jornada", name: "Caderno da Jornada", status: "Protegida" },
        { path: "/admin", name: "Painel Admin", status: "Protegida", isStaff: true },
      ]
    },
    {
      title: "Módulos Reais",
      items: MODULES_SEED.map(m => ({
        path: m.route,
        name: m.name,
        status: "Protegida",
        id: m.id
      }))
    },
    {
      title: "Lições Arcanos Maiores",
      items: DECK_REGISTRY.map(a => ({
        path: `/lesson/${a.number}`,
        name: `${a.numeral} - ${a.name}`,
        status: "Protegida",
        id: `maior-${a.number}`
      }))
    },
    {
      title: "Arcanos Menores & Corte",
      items: FULL_DECK.filter(c => c.category !== "maior").map(c => ({
        path: `/arcano-menor/${c.id}`,
        name: c.name,
        status: "Protegida",
        id: c.id
      }))
    },
    {
      title: "Ritual Diário & Estudo",
      items: [
        { path: "/desafios", name: "Ritual Diário / Desafios", status: "Protegida" },
        { path: "/revisao", name: "Revisão Inteligente", status: "Protegida" },
        { path: "/certificados", name: "Certificados", status: "Protegida" },
        { path: "/biblioteca", name: "Biblioteca de Símbolos", status: "Protegida" },
        { path: "/rotina", name: "Rotina de Estudo", status: "Protegida" },
        { path: "/numerologia", name: "Numerologia Menores", status: "Protegida" },
        { path: "/cartas-corte", name: "Cartas da Corte (Intro)", status: "Protegida" },
        { path: "/jornada-do-louco", name: "Visão Geral Jornada", status: "Protegida" },
      ]
    },
    {
      title: "Rotas Dinâmicas / Legado (Auditoria)",
      items: [
        { path: "/:ordem", name: "Rota Raiz Dinâmica (PERIGOSA)", status: "Revisar", audit: { exists: "NÃO", needed: "NÃO", risky: "SIM", replace: "SIM" } },
        { path: "/amor/:ordem", name: "Lição Amor Dinâmica", status: "Dinâmica", audit: { exists: "SIM", needed: "SIM", risky: "NÃO", replace: "NÃO" } },
        { path: "/tiragens/:ordem", name: "Lição Tiragens Dinâmica", status: "Dinâmica", audit: { exists: "SIM", needed: "SIM", risky: "NÃO", replace: "NÃO" } },
        { path: "/pratica/:ordem", name: "Lição Prática Dinâmica", status: "Dinâmica", audit: { exists: "SIM", needed: "SIM", risky: "NÃO", replace: "NÃO" } },
        { path: "/fundamentos/:order", name: "Lição Fundamentos Dinâmica", status: "Dinâmica", audit: { exists: "SIM", needed: "SIM", risky: "NÃO", replace: "NÃO" } },
        { path: "/lição/:id", name: "Licao (Alias Antigo)", status: "Revisar", audit: { exists: "NÃO", needed: "NÃO", risky: "NÃO", replace: "SIM" } },
      ]
    },
    {
      title: "Estados de Erro (Testes)",
      items: [
        { path: "/rota-que-nao-existe", name: "404 - Rota Inválida", status: "Crítica" },
        { path: "/lesson/999", name: "Arcano Inexistente", status: "Crítica" },
        { path: "/null", name: "Alias /null", status: "Dinâmica" },
        { path: "/undefined", name: "Alias /undefined", status: "Dinâmica" },
      ]
    }
  ];

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    const term = searchTerm.toLowerCase();
    return groups.map(g => ({
      ...g,
      items: g.items.filter(i => 
        i.name.toLowerCase().includes(term) || 
        i.path.toLowerCase().includes(term)
      )
    })).filter(g => g.items.length > 0);
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pública": return "bg-green-100 text-green-700 border-green-200";
      case "Protegida": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Dinâmica": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Crítica": return "bg-red-100 text-red-700 border-red-200";
      case "Revisar": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-12 bg-[#FAF5EF]">
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
          opacity: 0.98,
        }} />
      </div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-[#C8A66A40] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/app")}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30] text-[#5B1F3D] hover:scale-110 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-xl font-black text-[#5B1F3D] tracking-tight">Auditoria de Rotas</h1>
              <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-[#C8A66A] font-black">Tarô 78 Chaves · QA</p>
            </div>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A66A]" />
            <input 
              type="text"
              placeholder="Buscar rota ou nome..."
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF5EF] border-2 border-[#DCCFC2]/60 focus:border-[#C8A66A] outline-none text-sm font-body font-bold transition-all"
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-8 space-y-12">
        {filteredGroups.map((group, gIdx) => (
          <section key={gIdx} className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="font-heading text-sm tracking-[0.3em] uppercase font-black text-[#5B1F3D]">
                {group.title}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#C8A66A]/40 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item, iIdx) => (
                <div 
                  key={iIdx}
                  className="rounded-2xl p-5 bg-white border-2 border-[#DCCFC2]/30 shadow-md hover:border-[#C8A66A] hover:shadow-xl transition-all group flex flex-col justify-between min-h-[140px]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-heading font-black tracking-widest uppercase border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      {item.path.includes(":") && <Code className="w-3.5 h-3.5 text-purple-400" title="Rota Dinâmica" />}
                    </div>
                    <h3 className="font-heading text-[15px] font-black text-[#5B1F3D] leading-tight group-hover:text-[#8B6A30] transition-colors">{item.name}</h3>
                    <p className="text-[11px] font-body font-bold text-[#5B1F3D]/60 break-all">{item.path}</p>
                  </div>

                  {item.audit && (
                    <div className="mt-3 pt-3 border-t border-[#DCCFC2]/20 grid grid-cols-2 gap-x-2 gap-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-heading font-black uppercase text-[#5B1F3D]/50">
                        {item.audit.exists === "SIM" ? <CheckCircle className="w-2.5 h-2.5 text-green-500" /> : <XCircle className="w-2.5 h-2.5 text-red-400" />}
                        App.tsx: {item.audit.exists}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-heading font-black uppercase text-[#5B1F3D]/50">
                        {item.audit.risky === "SIM" ? <AlertTriangle className="w-2.5 h-2.5 text-red-500" /> : <CheckCircle className="w-2.5 h-2.5 text-green-400" />}
                        Risco: {item.audit.risky}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-heading font-black uppercase text-[#5B1F3D]/50">
                        {item.audit.needed === "SIM" ? <Info className="w-2.5 h-2.5 text-blue-400" /> : <XCircle className="w-2.5 h-2.5 text-gray-300" />}
                        Necessária: {item.audit.needed}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(item.path)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#FAF5EF] text-[#5B1F3D] font-heading text-[10px] tracking-[0.2em] uppercase font-black border border-[#C8A66A40] hover:bg-[#5B1F3D] hover:text-white hover:border-[#5B1F3D] transition-all"
                  >
                    Abrir Rota <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto px-6 mt-16 pt-8 border-t border-[#C8A66A20] text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-[#C8A66A]">✦</span>
          <p className="font-accent italic text-sm text-[#5B1F3D]/40">Auditoria Interna · Somente para Equipe de Desenvolvimento</p>
          <span className="text-[#C8A66A]">✦</span>
        </div>
        <button 
          onClick={() => navigate("/app")}
          className="px-8 py-3 rounded-full bg-[#5B1F3D] text-white font-heading text-xs tracking-[0.2em] uppercase font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Voltar para /app
        </button>
      </footer>
    </div>
  );
};

export default QARotasPage;