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

const ChapterHeader = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
  <div className="flex flex-col items-center text-center space-y-4 mb-16 relative py-8">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-xl border border-gold/15 relative z-10 mb-2">
      <span className="drop-shadow-sm">{icon}</span>
    </div>
    <div className="space-y-2 relative z-10">
      <h2 className="font-heading text-3xl md:text-5xl font-bold text-plum tracking-tight uppercase">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-4">
        <div className="h-[1px] w-8 bg-gold/20" />
        <p className="text-sm md:text-base font-body italic text-plum/50 max-w-md">
          {description}
        </p>
        <div className="h-[1px] w-8 bg-gold/20" />
      </div>
    </div>
    <div className="w-48 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-6" />
  </div>
);

const SymbolLibraryPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItemContent | null>(null);
  const [search, setSearch] = useState("");

  const { data: symbolsContent, isLoading } = useSymbolsContent();
  const categorias = symbolsContent?.categorias ?? [];

  const term = search.toLowerCase();

  const filteredCategories = useMemo(() => {
    const cats = search
      ? categorias.map((cat) => ({
          ...cat,
          simbolos: cat.simbolos.filter(
            (s) =>
              s.nome.toLowerCase().includes(term) ||
              s.explicacao.toLowerCase().includes(term),
          ),
        })).filter((cat) => cat.simbolos.length > 0)
      : activeCategory
      ? categorias.filter((c) => c.slug === activeCategory)
      : categorias;
    return cats;
  }, [categorias, search, term, activeCategory]);

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
    return ids.map(id => FULL_DECK.find(c => c.id === id)).filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="font-accent italic text-sm text-plum/60 animate-pulse">
          Abrindo o compêndio sagrado…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden pb-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-100/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-gold/5 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-mystic-bg-procedural pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-gold/10 bg-[#FDFCFB]/95 backdrop-blur-3xl sticky top-0 shadow-sm">
        <div className="container max-w-4xl py-12 px-6 md:py-16">
          <div className="flex flex-col items-center text-center space-y-8 mb-12 relative">
            <ArchPortal className="w-full">
              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-[11px] md:text-[12px] font-heading font-black tracking-[0.8em] text-gold uppercase drop-shadow-sm">Compêndio Sagrado</span>
                  <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
                
                <div className="relative inline-block">
                  <h1 className="text-5xl md:text-7xl font-heading font-bold text-plum tracking-tight flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-light italic text-plum/40 mb-2">A Linguagem Visual do Tarô</span>
                    <span className="relative">
                      Biblioteca de Símbolos
                      <div className="absolute -right-12 -top-6 animate-pulse">
                        <Star className="w-8 h-8 text-gold fill-gold/20" />
                      </div>
                      <div className="absolute -left-12 bottom-0 opacity-20 rotate-12">
                        <Star className="w-6 h-6 text-gold" />
                      </div>
                    </span>
                  </h1>
                </div>
                
                <p className="text-lg md:text-2xl font-body italic text-plum/60 max-w-2xl mx-auto leading-relaxed px-4">
                  Descubra os mistérios ocultos nas 78 Chaves e aprenda a ler os sinais ancestrais do Tarô.
                </p>
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
                onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
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
        {/* Category chips */}
        {!search && (
          <div className="flex overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar gap-2 mb-4">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-8 py-3 rounded-full text-[11px] font-heading font-black tracking-[0.2em] uppercase transition-all duration-300 border ${
                !activeCategory 
                  ? "bg-plum text-white border-plum shadow-lg shadow-plum/20" 
                  : "bg-white text-plum/50 border-gold/15 hover:border-gold/30 hover:bg-[#FDFCFB]"
              }`}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className={`flex-shrink-0 px-8 py-3 rounded-full text-[11px] font-heading font-black tracking-[0.2em] uppercase transition-all duration-300 border flex items-center gap-2.5 ${
                  activeCategory === cat.slug 
                    ? "bg-plum text-white border-plum shadow-lg shadow-plum/20" 
                    : "bg-white text-plum/50 border-gold/15 hover:border-gold/30 hover:bg-[#FDFCFB]"
                }`}
              >
                <span className="text-sm opacity-80">{cat.icone}</span>
                {cat.nome}
              </button>
            ))}
          </div>
        )}

        {/* Categories and symbols */}
        <div className="space-y-16">
          {filteredCategories.map(cat => (
            <section key={cat.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 group/cat relative">
                <div className="absolute -inset-10 bg-gold/5 blur-[80px] rounded-full opacity-0 group-hover/cat:opacity-100 transition-opacity pointer-events-none" />
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2.5rem] bg-white flex items-center justify-center text-5xl shadow-xl border border-gold/15 relative z-10 group-hover/cat:scale-105 group-hover/cat:rotate-3 transition-all duration-700">
                  {cat.icone}
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-plum tracking-tight">
                      {cat.nome}
                    </h2>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gold/30 via-gold/10 to-transparent hidden md:block" />
                  </div>
                  <p className="text-lg md:text-xl font-body italic text-plum/60 leading-relaxed max-w-2xl">
                    {cat.descricao}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {cat.simbolos.map(sym => {
                  const relatedCards = getCardsForSymbol(sym.nome);
                  const isExpanded = selectedSymbol?.id === sym.id;
                  
                  return (
                    <div
                      key={sym.id}
                      className={`group relative rounded-[3rem] transition-all duration-700 border overflow-hidden shadow-sm hover:shadow-2xl ${
                        isExpanded
                          ? "bg-white border-gold/40 shadow-2xl shadow-plum/10 ring-1 ring-gold/20"
                          : "bg-white/90 border-gold/10 hover:border-gold/30 hover:bg-white hover:-translate-y-2"
                      }`}
                    >
                      {/* Interactive Header area */}
                      <div className="flex flex-col md:flex-row">
                        <button
                          onClick={() => setSelectedSymbol(isExpanded ? null : sym)}
                          className="flex-1 text-left p-10 md:p-14 focus:outline-none"
                        >
                          <div className="flex justify-between items-start mb-8">
                            <div className="space-y-4 flex-1 pr-4">
                              <h3 className="font-heading text-3xl md:text-5xl font-bold text-plum group-hover:text-plum/80 transition-colors tracking-tight">
                                {sym.nome}
                              </h3>
                              <p className="text-lg md:text-2xl font-body italic text-plum/50 leading-relaxed -mt-1">
                                {sym.leituras[0]}
                              </p>
                              <div className="h-1 w-20 bg-gold/40 rounded-full group-hover:w-40 transition-all duration-1000" />
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border border-gold/20 ${
                              isExpanded ? "bg-plum text-marfim rotate-180 shadow-plum/20" : "bg-gold/10 text-gold"
                            }`}>
                              <Info className="w-6 h-6" />
                            </div>
                          </div>
                          
                          <p className={`text-xl md:text-2xl font-body leading-relaxed text-plum/80 mb-12 ${isExpanded ? "" : "line-clamp-2"}`}>
                            {sym.explicacao}
                          </p>

                          {relatedCards.length > 0 && (
                            <div className="space-y-6">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="h-px w-10 bg-gold/40" />
                                <span className="text-[12px] md:text-[13px] font-heading font-black tracking-[0.6em] text-gold uppercase">Cartas relacionadas:</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-6 md:gap-8">
                                {relatedCards.slice(0, isExpanded ? 99 : 3).map((card, idx) => (
                                  <div key={card?.id || idx} className="flex flex-col items-center gap-4 group/mini">
                                    <div 
                                      className={`relative rounded-2xl md:rounded-[1.5rem] border-2 border-white shadow-2xl overflow-hidden bg-white ring-1 ring-gold/20 transition-all duration-700 group-hover/mini:scale-110 group-hover/mini:rotate-1 ${
                                        isExpanded ? "w-full md:w-44 aspect-[2/3.2]" : "w-full md:w-36 aspect-[2/3.2]"
                                      }`}
                                    >
                                      <img 
                                        src={card?.cardImage} 
                                        alt={card?.name} 
                                        className="w-full h-full object-cover" 
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none opacity-0 group-hover/mini:opacity-100 transition-opacity" />
                                    </div>
                                    <span className={`text-[12px] md:text-[13px] font-heading font-bold uppercase tracking-widest text-plum/50 group-hover/mini:text-gold transition-colors text-center max-w-[140px] leading-tight`}>
                                      {card?.name}
                                    </span>
                                  </div>
                                ))}
                                {!isExpanded && relatedCards.length > 3 && (
                                  <div className="w-full md:w-36 aspect-[2/3.2] rounded-2xl md:rounded-[1.5rem] bg-gold/5 border-2 border-white flex flex-col items-center justify-center text-gold shadow-xl hover:bg-gold/10 transition-all duration-500 hover:-translate-y-1">
                                    <span className="text-3xl font-heading font-black">+{relatedCards.length - 3}</span>
                                    <span className="text-[10px] font-heading font-black uppercase tracking-[0.2em]">Chaves</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {!isExpanded && (
                            <div className="mt-14 flex items-center gap-4 text-gold group-hover:translate-x-4 transition-transform duration-1000">
                              <span className="text-[12px] md:text-[13px] font-heading font-black tracking-[0.6em] uppercase">Estudar símbolo</span>
                              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 shadow-sm group-hover:bg-gold/20 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                        isExpanded ? "max-h-[1500px] opacity-100 border-t border-gold/10" : "max-h-0 opacity-0"
                      }`}>
                        <div className="p-10 md:p-14 bg-[#FDFCFB]/50 backdrop-blur-sm space-y-14">
                          {/* Readings Section */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Star className="w-6 h-6 text-gold fill-gold/20" />
                              <h4 className="text-[14px] md:text-[15px] font-heading font-black tracking-[0.5em] text-plum uppercase">
                                Chaves de Interpretação
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {sym.leituras.map((r, i) => (
                                <div 
                                  key={i} 
                                  className="px-10 py-6 rounded-[2.5rem] text-lg font-body bg-white border border-gold/15 text-plum shadow-sm flex items-center gap-6 hover:border-gold/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                                >
                                  <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
                                  <span className="flex-1">{r}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Cards Section */}
                          {relatedCards.length > 0 && (
                            <div className="space-y-8">
                              <div className="flex items-center gap-4">
                                <BookOpen className="w-6 h-6 text-gold" />
                                <h4 className="text-[14px] md:text-[15px] font-heading font-black tracking-[0.5em] text-plum uppercase">
                                  Estudo Aplicado nas 78 Chaves
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
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
                                    className="flex flex-col gap-6 p-6 rounded-[2.5rem] bg-white border border-gold/15 hover:border-gold/50 transition-all group/card shadow-xl hover:shadow-2xl hover:-translate-y-3 active:translate-y-0 duration-700"
                                  >
                                    <div className="aspect-[2/3.2] rounded-[1.5rem] overflow-hidden relative shadow-2xl">
                                      <img 
                                        src={card?.cardImage} 
                                        alt={card?.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" 
                                      />
                                      <div className="absolute inset-0 bg-plum/0 group-hover/card:bg-plum/30 transition-all duration-700 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-700 scale-50 group-hover/card:scale-100">
                                          <ExternalLink className="w-8 h-8 text-white" />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                      <span className="block text-lg md:text-xl font-heading font-bold text-plum group-hover/card:text-gold transition-colors duration-500">
                                        {card?.name}
                                      </span>
                                      <div className="flex justify-center">
                                        <span className="inline-block px-4 py-1 rounded-full bg-gold/5 text-[10px] font-heading font-black tracking-widest text-gold uppercase border border-gold/10 group-hover/card:bg-gold/20 transition-all duration-500">
                                          Ver lição completa
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Study CTA */}
                          <div className="pt-6">
                            <button
                              onClick={() => setSelectedSymbol(null)}
                              className="w-full py-8 rounded-[2rem] bg-plum text-marfim text-[14px] font-heading font-black uppercase tracking-[0.5em] hover:bg-[#3d1328] transition-all duration-700 shadow-2xl shadow-plum/20 active:scale-[0.98] border border-gold/30 relative overflow-hidden group/btn"
                            >
                              Concluir Estudo do Símbolo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
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
