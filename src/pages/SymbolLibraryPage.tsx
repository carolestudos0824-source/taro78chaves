import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, BookOpen, Star, Info, ExternalLink } from "lucide-react";
import { useSymbolsContent } from "@/hooks/use-content";
import type { SymbolItemContent } from "@/lib/content";
import { FULL_DECK } from "@/registry/deck-registry";
import BottomNav from "@/components/BottomNav";

// Decorative components for the premium feel
const ArchPortal = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-x-0 -top-12 flex justify-center pointer-events-none opacity-30 transition-opacity">
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 120C10 60.2944 59.2944 10 120 10C180.706 10 230 60.2944 230 120" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="4 6" />
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="0.5" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="10" r="4" fill="#D4AF37" className="animate-pulse" />
        <path d="M120 0V20M110 10H130" stroke="#D4AF37" strokeWidth="0.5" />
      </svg>
    </div>
    {children}
  </div>
);

const ChapterHeader = ({ 
  title, 
  description, 
  icon, 
  isExpanded, 
  onToggle 
}: { 
  title: string, 
  description: string, 
  icon: string, 
  isExpanded: boolean, 
  onToggle: () => void 
}) => (
  <button 
    onClick={onToggle}
    className="w-full flex flex-col items-center text-center space-y-4 mb-8 relative py-10 px-6 rounded-[2rem] bg-white border border-gold/15 shadow-sm hover:shadow-md hover:border-gold/30 transition-all group"
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-b from-transparent to-gold/20" />
    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl border border-gold/15 relative z-10 mb-2 transition-all duration-500 ${isExpanded ? "bg-plum text-white rotate-[360deg] scale-110" : "bg-white text-plum group-hover:scale-105"}`}>
      <span className="drop-shadow-sm">{icon}</span>
    </div>
    <div className="space-y-3 relative z-10 w-full max-w-lg">
      <div className="flex items-center justify-center gap-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gold/20" />
        <h2 className="font-heading text-2xl md:text-4xl font-bold text-plum tracking-tight uppercase group-hover:text-gold transition-colors">
          {title}
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gold/20" />
      </div>
      <p className="text-sm md:text-base font-body italic text-plum/50 leading-relaxed px-4">
        {description}
      </p>
    </div>
    
    <div className={`mt-6 flex items-center gap-2 px-6 py-2 rounded-full border border-gold/20 text-[10px] font-heading font-black uppercase tracking-[0.3em] transition-all duration-500 ${isExpanded ? "bg-plum text-white border-plum" : "text-gold group-hover:bg-gold/5"}`}>
      {isExpanded ? "Recolher Capítulo" : "Abrir Capítulo"}
      <div className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>

    {/* Ornamental corners */}
    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/20 rounded-tl-lg" />
    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/20 rounded-tr-lg" />
    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/20 rounded-bl-lg" />
    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/20 rounded-br-lg" />
  </button>
);

const SymbolLibraryPage = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItemContent | null>(null);
  const [search, setSearch] = useState("");

  const { data: symbolsContent, isLoading } = useSymbolsContent();
  const categorias = symbolsContent?.categorias ?? [];

  const categoryDescriptions: Record<string, string> = {
    "luas": "Mistério, ciclos e percepção intuitiva.",
    "sois": "Vitalidade, consciência e clareza espiritual.",
    "aguas": "Fluxo emocional, purificação e passagem.",
    "flores": "Crescimento, beleza e florescimento da alma.",
    "montanhas": "Desafios, elevação e estabilidade.",
    "animais": "Instintos, forças internas e mensageiros simbólicos.",
    "cores": "Vibrações energéticas e estados de espírito.",
    "vestes": "Identidade, proteção e manifestação social.",
    "objetos": "Ferramentas simbólicas de ação, escolha e poder.",
    "elementos-astrologicos": "Influências cósmicas e ciclos universais.",
    "numeros": "Estruturas arquetípicas da jornada.",
    "gestos-e-posturas": "Linguagem corporal e atitudes perante a vida."
  };

  const term = search.toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!search) return categorias;
    
    return categorias.map((cat) => ({
      ...cat,
      simbolos: cat.simbolos.filter(
        (s) =>
          s.nome.toLowerCase().includes(term) ||
          s.explicacao.toLowerCase().includes(term),
      ),
    })).filter((cat) => cat.simbolos.length > 0);
  }, [categorias, search, term]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const getCardsForSymbol = (symbolName: string) => {
    const mapping: Record<string, string[]> = {
      // LUA / LUAS
      "Lua Crescente": ["maior-2"],
      "Lua Cheia": ["maior-18"],
      "Lua Minguante": ["maior-18", "maior-9"],
      
      // SÓIS
      "Sol Radiante": ["maior-19"],
      "Sol Nascente": ["maior-0", "maior-19"],
      
      // ÁGUAS
      "Rio ou Corrente": ["maior-17", "maior-14", "maior-18"],
      "Mar ou Oceano": ["maior-18", "copas-2", "espadas-6"],
      "Chuva": ["maior-16", "copas-5"],
      
      // FLORES
      "Rosa Branca": ["maior-0"],
      "Rosa Vermelha": ["maior-1", "maior-3"],
      "Lírio": ["maior-14", "maior-2"],
      
      // MONTANHAS
      "Montanha Nevada": ["maior-0", "maior-9"],
      "Colina ou Morro": ["maior-0", "maior-21"],
      
      // ANIMAIS
      "Cachorro": ["maior-0", "maior-18"],
      "Leão": ["maior-8", "maior-21"],
      "Águia": ["maior-21", "espadas-king"],
      "Cavalo": ["maior-19", "paus-knight", "copas-knight", "espadas-knight", "ouros-knight", "maior-13"],
      
      // CORES
      "Dourado / Ouro": ["maior-19", "ouros-1", "ouros-10"],
      "Vermelho": ["maior-1", "maior-4", "maior-8"],
      "Azul": ["maior-2", "maior-17", "copas-queen"],
      "Branco": ["maior-0", "maior-2", "maior-14"],
      
      // VESTES
      "Manto Azul": ["maior-2", "maior-17"],
      "Armadura": ["maior-7", "espadas-knight"],
      "Nudez": ["maior-21", "maior-17", "maior-15"],
      
      // OBJETOS
      "Varinha / Bastão": ["maior-1", "paus-1"],
      "Cálice / Taça": ["copas-1", "copas-2", "copas-queen"],
      "Espada": ["espadas-1", "espadas-2", "maior-11"],
      "Chave": ["maior-2", "maior-5"],
      "Pentáculo / Ouro": ["ouros-1", "ouros-10"],
      "Coroa": ["maior-3", "maior-4", "ouros-4"],
      "Livro / Pergaminho": ["maior-2", "maior-5"],
      "Balança": ["maior-11"],
      
      // ELEMENTOS ASTROLÓGICOS
      "Estrela de seis pontas": ["maior-17", "maior-7"],
      "Estrela de oito pontas": ["maior-17"],
      "Roda Zodiacal": ["maior-10", "maior-21"],
      "Lemniscata": ["maior-1", "maior-8"],
      "Lua": ["maior-18", "maior-2"],
      "Sol": ["maior-19"],
      "Círculo / Mandala": ["maior-21", "maior-10"],
      
      // NÚMEROS
      "Zero (0)": ["maior-0"],
      "Um (1)": ["maior-1", "paus-1", "copas-1", "espadas-1", "ouros-1"],
      "Dois (2)": ["maior-2", "copas-2", "espadas-2"],
      "Três (3)": ["maior-3", "copas-3", "espadas-3"],
      "Quatro (4)": ["maior-4", "ouros-4", "paus-4"],
      "Cinco (5)": ["maior-5", "copas-5", "ouros-5"],
      "Seis (6)": ["maior-6", "copas-6", "espadas-6"],
      "Sete (7)": ["maior-7", "copas-7", "paus-7"],
      "Oito (8)": ["maior-8", "espadas-8", "ouros-8"],
      "Nove (9)": ["maior-9", "copas-9", "espadas-9"],
      "Dez (10)": ["maior-10", "copas-10", "ouros-10"],
      
      // GESTOS E POSTURAS
      "Mão erguida ao céu": ["maior-1"],
      "Mão apontando para baixo": ["maior-1"],
      "Olhos fechados": ["espadas-2", "espadas-4"],
      "Postura sentada / trono": ["maior-2", "maior-3", "maior-4", "maior-11"],
      "Figura em pé no precipício": ["maior-0"],
      "Figura caminhando": ["maior-0", "maior-9", "copas-8"],
      "Braços abertos": ["maior-21", "maior-12"],
      "Mãos unidas / bênção": ["maior-5", "copas-2"],
      "Cabeça baixa / luto": ["copas-5"],
      "Contemplação / espera": ["ouros-7", "copas-4"]
    };

    const ids = mapping[symbolName] || [];
    if (ids.length === 0) {
      // Fallback: try to find cards based on keywords in symbolName
      const lowerName = symbolName.toLowerCase();
      if (lowerName.includes("lua")) return [FULL_DECK.find(c => c.id === "maior-18")].filter(Boolean);
      if (lowerName.includes("sol")) return [FULL_DECK.find(c => c.id === "maior-19")].filter(Boolean);
      if (lowerName.includes("água")) return [FULL_DECK.find(c => c.id === "maior-17")].filter(Boolean);
      if (lowerName.includes("fogo")) return [FULL_DECK.find(c => c.id === "maior-16")].filter(Boolean);
      if (lowerName.includes("terra")) return [FULL_DECK.find(c => c.id === "ouros-1")].filter(Boolean);
      if (lowerName.includes("ar")) return [FULL_DECK.find(c => c.id === "espadas-1")].filter(Boolean);
      // Absolute fallback to avoid empty related cards
      return [FULL_DECK.find(c => c.category === "maior")].filter(Boolean);
    }
    return ids.map(id => FULL_DECK.find(c => c.id === id)).filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="font-accent italic text-base text-plum/60 animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          Abrindo a Biblioteca de Símbolos…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-100/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-gold/5 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-mystic-bg-procedural pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-gold/10 bg-[#FDFCFB]/95 backdrop-blur-3xl sticky top-0 shadow-sm">
        <div className="container max-w-4xl py-10 px-6 md:py-14">
          <div className="flex flex-col items-center text-center space-y-6 mb-10 relative">
            <ArchPortal className="w-full">
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-[10px] md:text-[11px] font-heading font-black tracking-[0.8em] text-gold uppercase drop-shadow-sm">Escola de Tarô</span>
                  <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
                
                <div className="relative inline-block">
                  <h1 className="text-4xl md:text-6xl font-heading font-bold text-plum tracking-tight flex flex-col items-center">
                    <span className="relative">
                      Biblioteca de Símbolos
                      <div className="absolute -right-10 -top-4 animate-stars">
                        <Star className="w-6 h-6 text-gold fill-gold/20" />
                      </div>
                    </span>
                  </h1>
                </div>
                
                <p className="text-base md:text-xl font-body italic text-plum/60 max-w-xl mx-auto leading-relaxed px-4">
                  Aprenda os sinais vivos escondidos nas cartas Rider-Waite-Smith.
                </p>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mt-2" />
              </div>
            </ArchPortal>

            <button 
              onClick={() => navigate("/app")} 
              className="absolute left-0 top-0 p-4 rounded-full bg-white border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all text-plum/60 hover:text-plum shadow-xl group/back"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Search */}
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gold/10 blur-2xl group-focus-within:bg-gold/20 transition-all rounded-[2.5rem]" />
            <div className="relative flex items-center">
              <Search className="absolute left-8 w-6 h-6 text-plum/30 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                placeholder="Ex: Lua, Água, Sol, A Sacerdotisa..."
                value={search}
                onChange={e => { setSearch(e.target.value); }}
                className="w-full pl-20 pr-20 py-8 rounded-[2.5rem] text-xl font-body bg-white/80 border border-gold/20 outline-none focus:border-gold/50 focus:bg-white focus:ring-12 focus:ring-gold/5 transition-all shadow-xl placeholder:text-plum/20 backdrop-blur-sm"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="absolute right-8 p-2 rounded-full hover:bg-plum/5 text-plum/30 hover:text-plum transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6 py-8">
        {/* Chapters Navigation - Only show if not searching */}
        {!search && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {categorias.map(cat => (
              <button
                key={cat.slug}
                onClick={() => {
                  toggleCategory(cat.slug);
                  // Scroll to the category if we are expanding it
                  if (!expandedCategories.has(cat.slug)) {
                    document.getElementById(`chapter-${cat.slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`px-4 py-3 rounded-2xl text-[10px] font-heading font-black tracking-widest uppercase transition-all duration-300 border flex items-center justify-center gap-2 ${
                  expandedCategories.has(cat.slug)
                    ? "bg-plum text-white border-plum shadow-md" 
                    : "bg-white text-plum/50 border-gold/15 hover:border-gold/30 hover:bg-gold/5"
                }`}
              >
                <span>{cat.icone}</span>
                <span className="truncate">{cat.nome}</span>
              </button>
            ))}
          </div>
        )}

        {/* Categories and symbols */}
        <div className="space-y-12">
          {filteredCategories.map(cat => {
            const isExpanded = expandedCategories.has(cat.slug) || !!search;
            const displaySimbolos = cat.simbolos;

            return (
              <section 
                key={cat.slug} 
                id={`chapter-${cat.slug}`}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 scroll-mt-32"
              >
                <ChapterHeader 
                  title={cat.nome} 
                  description={categoryDescriptions[cat.slug] || cat.descricao} 
                  icon={cat.icone}
                  isExpanded={isExpanded}
                  onToggle={() => toggleCategory(cat.slug)}
                />

                <div className={`grid grid-cols-1 gap-8 md:gap-12 transition-all duration-700 overflow-hidden ${isExpanded ? "max-h-[10000px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}>
                  {displaySimbolos.map(sym => {
                    const relatedCards = getCardsForSymbol(sym.nome);
                    const isExpandedSymbol = selectedSymbol?.id === sym.id;
                    
                    return (
                      <div
                        key={sym.id}
                        className={`group relative rounded-[2.5rem] transition-all duration-500 border overflow-hidden shadow-sm ${
                          isExpandedSymbol
                            ? "bg-white border-gold/40 shadow-xl ring-1 ring-gold/10"
                            : "bg-white/80 border-gold/10 hover:border-gold/20 hover:bg-white hover:shadow-md"
                        }`}
                      >
                        {/* Premium Card Ornament */}
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                          <Star className="w-20 h-20 text-gold" />
                        </div>

                        {/* Interactive Header area */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => setSelectedSymbol(isExpanded ? null : sym)}
                            className="flex-1 text-left p-10 md:p-14 focus:outline-none"
                          >
                            <div className="flex justify-between items-start mb-10">
                              <div className="space-y-3 flex-1 pr-4">
                                <h3 className="font-heading text-2xl md:text-4xl font-bold text-plum group-hover:text-gold transition-colors tracking-tight">
                                  {sym.nome}
                                </h3>
                                <div className="flex items-center gap-3">
                                  <div className="h-px w-8 bg-gold/40" />
                                  <p className="text-base md:text-xl font-body italic text-plum/40 leading-relaxed uppercase tracking-widest font-black text-[10px] md:text-xs">
                                    {sym.leituras[0]}
                                  </p>
                                </div>
                              </div>
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 shadow-sm border border-gold/20 ${
                                isExpanded ? "bg-plum text-white rotate-180" : "bg-white text-gold hover:bg-gold hover:text-white"
                              }`}>
                                {isExpanded ? <X className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                              </div>
                            </div>
                            
                            <p className={`text-lg md:text-xl font-body leading-relaxed text-plum/70 mb-10 italic border-l-2 border-rose-100 pl-6 ${isExpanded ? "" : "line-clamp-2"}`}>
                              {sym.explicacao}
                            </p>

                            {relatedCards.length > 0 && (
                              <div className="space-y-8 mt-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-px w-6 bg-gold/30" />
                                  <span className="text-[10px] md:text-[11px] font-heading font-black tracking-[0.4em] text-gold uppercase">Estudo nas Cartas</span>
                                </div>
                                <div className="grid grid-cols-2 xs:grid-cols-3 md:flex md:flex-wrap gap-4 md:gap-6">
                                  {relatedCards.slice(0, 4).map((card, idx) => (
                                    <div key={card?.id || idx} className="flex flex-col items-center gap-3 group/mini animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                      <div 
                                        className="relative w-full md:w-32 aspect-[2/3.2] rounded-2xl border border-gold/10 shadow-lg overflow-hidden bg-white group-hover/mini:scale-105 group-hover/mini:border-gold/40 transition-all duration-500"
                                      >
                                        <img 
                                          src={card?.cardImage} 
                                          alt={card?.name} 
                                          className="w-full h-full object-cover" 
                                        />
                                        <div className="absolute inset-0 bg-plum/10 opacity-0 group-hover/mini:opacity-100 transition-opacity" />
                                      </div>
                                      <span className="text-[10px] md:text-[11px] font-heading font-bold uppercase tracking-widest text-plum/50 group-hover/mini:text-gold transition-colors text-center leading-tight px-1">
                                        {card?.name}
                                      </span>
                                    </div>
                                  ))}
                                  {relatedCards.length > 4 && (
                                    <div className="w-full xs:w-auto flex items-center justify-center px-4 py-2 rounded-xl bg-gold/5 border border-gold/10 text-[10px] font-heading font-black uppercase tracking-widest text-gold italic">
                                      +{relatedCards.length - 4} mais
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {!isExpanded && (
                              <div className="mt-12 flex items-center justify-center py-4 border-t border-gold/5 group-hover:border-gold/20 transition-colors">
                                <div className="flex items-center gap-3 text-gold">
                                  <span className="text-[10px] md:text-[11px] font-heading font-black tracking-[0.6em] uppercase">Estudar Símbolo</span>
                                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                              </div>
                            )}
                          </button>
                        </div>

                        {/* Expanded Content */}
                        <div className={`overflow-hidden transition-all duration-1000 ease-in-out ${
                          isExpanded ? "max-h-[2000px] opacity-100 border-t border-gold/10" : "max-h-0 opacity-0"
                        }`}>
                          <div className="p-10 md:p-14 bg-rose-50/20 backdrop-blur-sm space-y-12">
                            {/* Readings Section */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <Star className="w-5 h-5 text-gold fill-gold/20" />
                                <h4 className="text-[12px] md:text-[13px] font-heading font-black tracking-[0.4em] text-plum uppercase">
                                  Chaves de Interpretação
                                </h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sym.leituras.map((r, i) => (
                                  <div 
                                    key={i} 
                                    className="px-8 py-5 rounded-2xl text-base md:text-lg font-body bg-white border border-gold/10 text-plum shadow-sm flex items-center gap-5 hover:border-gold/30 hover:shadow-md transition-all duration-500"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-gold" />
                                    <span className="flex-1 italic">{r}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Detailed Cards Section */}
                            <div className="space-y-8">
                              <div className="flex items-center gap-4">
                                <BookOpen className="w-5 h-5 text-gold" />
                                <h4 className="text-[12px] md:text-[13px] font-heading font-black tracking-[0.4em] text-plum uppercase">
                                  Aplicações no Rider-Waite
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                {relatedCards.map((card) => (
                                  <button
                                    key={card?.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const route = card?.category === "maior" 
                                        ? `/lesson/${card.number}` 
                                        : `/arcano-menor/${card?.id}`;
                                      navigate(route);
                                    }}
                                    className="flex flex-col gap-4 p-4 rounded-3xl bg-white border border-gold/10 hover:border-gold/40 transition-all group/card shadow-md hover:shadow-xl hover:-translate-y-2 duration-500"
                                  >
                                    <div className="aspect-[2/3.2] rounded-2xl overflow-hidden relative shadow-lg">
                                      <img 
                                        src={card?.cardImage} 
                                        alt={card?.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" 
                                      />
                                      <div className="absolute inset-0 bg-plum/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                                        <ExternalLink className="w-8 h-8 text-white scale-50 group-hover/card:scale-100 transition-transform duration-500" />
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <span className="block text-xs md:text-sm font-heading font-bold text-plum group-hover/card:text-gold transition-colors">
                                        {card?.name}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedSymbol(null)}
                              className="w-full py-6 rounded-2xl bg-plum text-white text-[12px] font-heading font-black uppercase tracking-[0.4em] hover:bg-[#3d1328] transition-all duration-500 shadow-xl border border-gold/20"
                            >
                              Recolher Estudo
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                </div>
              </section>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-24 px-6">
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-gold/10">
              <Search className="w-10 h-10 text-gold/40" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-plum mb-3">
              Mistério não encontrado
            </h3>
            <p className="font-body text-base text-plum/50 italic max-w-sm mx-auto mb-10 leading-relaxed">
              Nenhum símbolo ou carta corresponde à busca "{search}". Experimente outro termo ou tema ancestral.
            </p>
            <button 
              onClick={() => setSearch("")}
              className="px-10 py-4 rounded-full border-2 border-gold/30 text-[11px] font-heading font-black uppercase tracking-[0.3em] text-gold hover:bg-gold/5 transition-all active:scale-95"
            >
              Limpar busca
            </button>
          </div>
        )}

        {/* Bottom Ornament */}
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-6">
            <div className="h-px w-20 bg-gold/20" />
            <div className="w-3 h-3 rounded-full border-2 border-gold/40 rotate-45" />
            <div className="h-px w-20 bg-gold/20" />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SymbolLibraryPage;
