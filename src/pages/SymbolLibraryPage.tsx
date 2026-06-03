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
    <div className="absolute inset-x-0 -top-8 flex justify-center pointer-events-none opacity-20 transition-opacity">
      <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 100C10 50.2944 50.2944 10 100 10C149.706 10 190 50.2944 190 100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="10" r="3" fill="currentColor" />
      </svg>
    </div>
    {children}
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
      <header className="relative z-20 border-b border-gold/10 bg-[#FDFCFB]/95 backdrop-blur-xl sticky top-0 shadow-sm">
        <div className="container max-w-3xl py-10 px-6">
          <div className="flex flex-col items-center text-center space-y-6 mb-8 relative">
            <ArchPortal className="w-full">
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-10 bg-gold/30" />
                  <span className="text-[10px] font-heading font-black tracking-[0.6em] text-gold uppercase">Sabedoria Ancestral</span>
                  <div className="h-px w-10 bg-gold/30" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-plum tracking-tight flex flex-col items-center">
                  <span className="text-xl md:text-2xl font-light italic text-plum/50 mb-1">Escola Digital de Tarô</span>
                  <span className="relative inline-block">
                    Biblioteca de Símbolos
                    <div className="absolute -right-8 -top-4 opacity-40">
                      <Star className="w-5 h-5 text-gold fill-gold/20" />
                    </div>
                  </span>
                </h1>
                
                <p className="text-sm md:text-base font-body italic text-plum/60 max-w-md mx-auto leading-relaxed">
                  Aprenda a reconhecer os sinais vivos nas cartas Rider-Waite-Smith.
                </p>
              </div>
            </ArchPortal>

            <button 
              onClick={() => navigate("/app")} 
              className="absolute left-0 top-0 p-3 rounded-full bg-white border border-gold/15 hover:border-gold/30 hover:bg-gold/5 transition-all text-plum/50 hover:text-plum shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative group max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gold/5 blur-xl group-focus-within:bg-gold/15 transition-all rounded-[2rem]" />
            <div className="relative flex items-center">
              <Search className="absolute left-6 w-5 h-5 text-plum/30 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                placeholder="Buscar símbolo, carta ou tema..."
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
                className="w-full pl-14 pr-14 py-6 rounded-[2rem] text-base font-body bg-white border border-gold/15 outline-none focus:border-gold/40 focus:ring-8 focus:ring-gold/5 transition-all shadow-md placeholder:text-plum/30"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="absolute right-6 p-1.5 rounded-full hover:bg-plum/5 text-plum/30 hover:text-plum transition-all"
                >
                  <X className="w-5 h-5" />
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
              <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8 group/cat relative">
                <div className="absolute -inset-4 bg-gold/5 blur-2xl rounded-full opacity-0 group-hover/cat:opacity-100 transition-opacity" />
                <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center text-4xl shadow-sm border border-gold/15 relative z-10 group-hover/cat:scale-105 transition-transform duration-500">
                  {cat.icone}
                </div>
                <div className="flex-1 relative z-10">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-plum tracking-tight flex items-center gap-4">
                    {cat.nome}
                    <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent hidden md:block" />
                  </h2>
                  <p className="text-base font-body italic text-plum/50 mt-1 leading-relaxed max-w-xl">
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
                      className={`group relative rounded-[2.5rem] md:rounded-[3rem] transition-all duration-500 border overflow-hidden shadow-sm hover:shadow-2xl ${
                        isExpanded
                          ? "bg-white border-gold/30 shadow-2xl shadow-plum/5 ring-1 ring-gold/10"
                          : "bg-white/80 border-gold/10 hover:border-gold/25 hover:bg-white hover:-translate-y-1"
                      }`}
                    >
                      {/* Interactive Header area */}
                      <div className="flex flex-col md:flex-row">
                        <button
                          onClick={() => setSelectedSymbol(isExpanded ? null : sym)}
                          className="flex-1 text-left p-8 md:p-12 focus:outline-none"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="space-y-4">
                              <h3 className="font-heading text-2xl md:text-4xl font-bold text-plum group-hover:text-plum/80 transition-colors tracking-tight">
                                {sym.nome}
                              </h3>
                              <p className="text-base md:text-xl font-body italic text-plum/50 leading-relaxed -mt-2">
                                {sym.leituras[0]}
                              </p>
                              <div className="h-0.5 w-16 bg-gold/30 rounded-full group-hover:w-32 transition-all duration-700" />
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                              isExpanded ? "bg-plum text-marfim rotate-180 shadow-lg" : "bg-gold/10 text-gold"
                            }`}>
                              <Info className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <p className={`text-lg md:text-xl font-body leading-relaxed text-plum/80 mb-10 ${isExpanded ? "" : "line-clamp-2"}`}>
                            {sym.explicacao}
                          </p>

                          {relatedCards.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="h-px w-8 bg-gold/30" />
                                <span className="text-[10px] font-heading font-black tracking-[0.5em] text-gold uppercase">Cartas relacionadas:</span>
                              </div>
                              <div className="flex flex-wrap gap-5">
                                {relatedCards.slice(0, isExpanded ? 99 : 3).map((card, idx) => (
                                  <div key={card?.id || idx} className="flex flex-col items-center gap-3 group/mini">
                                    <div 
                                      className={`relative rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-white ring-1 ring-gold/10 transition-all duration-500 group-hover/mini:scale-110 group-hover/mini:rotate-1 ${
                                        isExpanded ? "w-28 md:w-36 aspect-[2/3.2]" : "w-24 md:w-28 aspect-[2/3.2]"
                                      }`}
                                    >
                                      <img 
                                        src={card?.cardImage} 
                                        alt={card?.name} 
                                        className="w-full h-full object-cover" 
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </div>
                                    <span className={`text-[11px] font-heading font-black uppercase tracking-widest text-plum/40 group-hover/mini:text-gold transition-colors text-center max-w-[90px] md:max-w-[110px] leading-tight ${isExpanded ? "block" : "block"}`}>
                                      {card?.name}
                                    </span>
                                  </div>
                                ))}
                                {!isExpanded && relatedCards.length > 3 && (
                                  <div className="w-24 md:w-28 aspect-[2/3.2] rounded-2xl bg-gold/5 border-2 border-white flex flex-col items-center justify-center text-[13px] font-black text-gold shadow-md hover:bg-gold/10 transition-colors">
                                    <span className="text-2xl">+{relatedCards.length - 3}</span>
                                    <span className="text-[9px] uppercase tracking-widest">Cartas</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {!isExpanded && (
                            <div className="mt-10 flex items-center gap-3 text-gold group-hover:translate-x-3 transition-transform duration-700">
                              <span className="text-[11px] font-heading font-black tracking-[0.5em] uppercase">Estudar símbolo</span>
                              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                        isExpanded ? "max-h-[1500px] opacity-100 border-t border-gold/10" : "max-h-0 opacity-0"
                      }`}>
                        <div className="p-8 md:p-12 bg-[#FDFCFB] space-y-12">
                          {/* Readings Section */}
                          <div className="space-y-5">
                            <h4 className="flex items-center gap-4 text-[13px] font-heading font-black tracking-[0.5em] text-plum uppercase">
                              <Star className="w-5 h-5 text-gold fill-gold/10" />
                              Chaves de Interpretação
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {sym.leituras.map((r, i) => (
                                <div 
                                  key={i} 
                                  className="px-8 py-5 rounded-[2rem] text-base font-body bg-white border border-gold/10 text-plum shadow-sm flex items-center gap-4 hover:border-gold/30 hover:shadow-md transition-all"
                                >
                                  <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                                  {r}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Cards Section */}
                          {relatedCards.length > 0 && (
                            <div className="space-y-6">
                              <h4 className="flex items-center gap-4 text-[13px] font-heading font-black tracking-[0.5em] text-plum uppercase">
                                <BookOpen className="w-5 h-5 text-gold" />
                                Estudo Aplicado nas 78 Chaves
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                                    className="flex flex-col gap-4 p-5 rounded-[2rem] bg-white border border-gold/15 hover:border-gold/40 transition-all group/card shadow-lg hover:shadow-2xl hover:-translate-y-2 active:translate-y-0"
                                  >
                                    <div className="aspect-[2/3.2] rounded-[1rem] overflow-hidden relative shadow-xl">
                                      <img 
                                        src={card?.cardImage} 
                                        alt={card?.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" 
                                      />
                                      <div className="absolute inset-0 bg-plum/0 group-hover/card:bg-plum/20 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all scale-75 group-hover/card:scale-100">
                                          <ExternalLink className="w-6 h-6 text-marfim" />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center space-y-1">
                                      <span className="block text-[13px] font-heading font-bold text-plum group-hover/card:text-gold transition-colors">
                                        {card?.name}
                                      </span>
                                      <span className="block text-[10px] font-heading font-black tracking-widest text-plum/30 uppercase">Ver nas cartas</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Study CTA */}
                          <div className="pt-4">
                            <button
                              onClick={() => setSelectedSymbol(null)}
                              className="w-full py-6 rounded-[1.5rem] bg-plum text-white text-[12px] font-heading font-black uppercase tracking-[0.4em] hover:bg-[#45162D] transition-all shadow-xl active:scale-[0.98] border border-gold/20"
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
