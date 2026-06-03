import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, BookOpen, Star, Info, ExternalLink } from "lucide-react";
import { useSymbolsContent } from "@/hooks/use-content";
import type { SymbolItemContent } from "@/lib/content";
import { FULL_DECK } from "@/registry/deck-registry";
import BottomNav from "@/components/BottomNav";

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
      "Lua Crescente": ["maior-2", "maior-18"],
      "Lua Cheia": ["maior-18"],
      "Sol Radiante": ["maior-19", "maior-0"],
      "Água/Rio": ["maior-17", "maior-14", "maior-18"],
      "Rio ou Corrente": ["maior-14", "maior-17", "maior-18"],
      "Cachorro": ["maior-0", "maior-18"],
      "Leão": ["maior-8"],
      "Rosa Branca": ["maior-0", "maior-13"],
      "Rosa Vermelha": ["maior-1", "maior-3"],
      "Lírio": ["maior-1", "maior-14"],
      "Montanha": ["maior-9", "maior-0"],
      "Montanha Nevada": ["maior-9", "maior-0"],
      "Coroa": ["maior-4", "maior-3"],
      "Varinha / Bastão": ["maior-1", "paus-1"],
      "Cálice / Taça": ["copas-1"],
      "Espada": ["espadas-1"],
      "Pentáculo / Ouro": ["ouros-1"],
      "Zero (0)": ["maior-0"],
      "Um (I)": ["maior-1"],
      "Dois (II)": ["maior-2"],
      "Mão Erguida ao Céu": ["maior-1"],
      "Olhos Fechados": ["espadas-2"],
      "Dourado / Ouro": ["maior-19", "maior-4", "maior-10"],
      "Sol Nascente": ["maior-20", "maior-17"],
      "Colina ou Morro": ["maior-7", "espadas-6"],
      "Águia": ["maior-21", "maior-10"],
      "Chave": ["maior-5", "maior-2"],
      "Lemniscata (∞)": ["maior-1", "maior-8"],
      "Três (III)": ["maior-3"],
      "Mão Apontando para Baixo": ["maior-1"],
      "Postura Sentada / Trono": ["maior-2", "maior-3", "maior-4", "maior-11"],
      "Mar ou Oceano": ["maior-18", "copas-2"],
    };

    const ids = mapping[symbolName] || [];
    return ids.map(id => FULL_DECK.find(c => c.id === id)).filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
        <div className="font-accent italic text-sm text-plum/60 animate-pulse">
          Abrindo a biblioteca ancestral…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] relative overflow-hidden pb-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-rose-200/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-48 h-48 bg-gold/10 blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-gold/20 bg-[#FAF5EF]/95 backdrop-blur-xl sticky top-0 shadow-sm">
        <div className="absolute inset-x-0 -bottom-8 flex justify-center pointer-events-none opacity-20">
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 100C10 50.2944 50.2944 10 100 10C149.706 10 190 50.2944 190 100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
        <div className="container max-w-3xl py-8 px-6">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate("/app")} 
              className="p-2 rounded-full hover:bg-gold/10 transition-colors text-plum/60 hover:text-plum"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-gold/40" />
                <span className="text-[10px] font-heading font-black tracking-[0.4em] text-gold uppercase">Biblioteca Ancestral</span>
                <div className="h-px w-6 bg-gold/40" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-plum tracking-tight">
                Biblioteca de Símbolos
              </h1>
              <p className="text-sm font-body italic text-plum/50">
                Aprenda a reconhecer os sinais vivos nas cartas Rider-Waite-Smith.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gold/10 blur-xl group-focus-within:bg-gold/20 transition-all rounded-2xl" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-plum/30 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                placeholder="Buscar símbolo, carta ou tema..."
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
                className="w-full pl-11 pr-12 py-4 rounded-2xl text-sm font-body bg-white border border-gold/20 outline-none focus:border-gold/50 focus:ring-4 focus:ring-gold/5 transition-all shadow-sm placeholder:text-plum/30"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="absolute right-4 p-1 rounded-full hover:bg-plum/5 text-plum/30 hover:text-plum transition-all"
                >
                  <X className="w-4 h-4" />
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
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[11px] font-heading font-black tracking-[0.2em] uppercase transition-all duration-300 border ${
                !activeCategory 
                  ? "bg-plum text-marfim border-plum shadow-lg shadow-plum/20" 
                  : "bg-white text-plum/60 border-gold/20 hover:border-gold/40 hover:bg-ivory"
              }`}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[11px] font-heading font-black tracking-[0.2em] uppercase transition-all duration-300 border flex items-center gap-2.5 ${
                  activeCategory === cat.slug 
                    ? "bg-plum text-marfim border-plum shadow-lg shadow-plum/20" 
                    : "bg-white text-plum/60 border-gold/20 hover:border-gold/40 hover:bg-ivory"
                }`}
              >
                <span className="text-sm opacity-80">{cat.icone}</span>
                {cat.nome}
              </button>
            ))}
          </div>
        )}

        {/* Categories and symbols */}
        <div className="space-y-12">
          {filteredCategories.map(cat => (
            <section key={cat.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-lg shadow-inner">
                  {cat.icone}
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold text-plum tracking-tight">
                    {cat.nome}
                  </h2>
                  <div className="h-0.5 w-12 bg-gold/30 rounded-full" />
                </div>
              </div>
              <p className="text-xs font-body italic text-plum/50 mb-6 pl-11">
                {cat.descricao}
              </p>

              <div className="grid grid-cols-1 gap-4">
                {cat.simbolos.map(sym => {
                  const relatedCards = getCardsForSymbol(sym.nome);
                  const isExpanded = selectedSymbol?.id === sym.id;
                  
                  return (
                    <div
                      key={sym.id}
                      className={`group relative rounded-2xl transition-all duration-500 border overflow-hidden ${
                        isExpanded
                          ? "bg-white border-gold/40 shadow-xl shadow-gold/5 ring-1 ring-gold/10"
                          : "bg-white/60 border-gold/10 hover:border-gold/30 hover:bg-white shadow-sm"
                      }`}
                    >
                      {/* Interactive Header area */}
                      <button
                        onClick={() => setSelectedSymbol(isExpanded ? null : sym)}
                        className="w-full text-left p-5 focus:outline-none"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-heading text-base font-bold text-plum group-hover:text-gold transition-colors">
                            {sym.nome}
                          </h3>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isExpanded ? "bg-plum text-marfim rotate-180" : "bg-gold/10 text-gold"
                          }`}>
                            <Info className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        
                        <p className={`text-sm font-body leading-relaxed text-plum/70 ${isExpanded ? "" : "line-clamp-2"}`}>
                          {sym.explicacao}
                        </p>

                        {!isExpanded && relatedCards.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-[9px] font-heading font-black tracking-widest text-gold uppercase">Presente em:</span>
                            <div className="flex -space-x-2">
                              {relatedCards.slice(0, 3).map((card, idx) => (
                                <div 
                                  key={card?.id || idx} 
                                  className="w-6 h-6 rounded-md border border-white shadow-sm overflow-hidden bg-marfim ring-1 ring-gold/5"
                                >
                                  <img 
                                    src={card?.cardImage} 
                                    alt={card?.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              ))}
                              {relatedCards.length > 3 && (
                                <div className="w-6 h-6 rounded-md bg-gold/10 border border-white flex items-center justify-center text-[8px] font-bold text-gold">
                                  +{relatedCards.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </button>

                      {/* Expanded Content */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isExpanded ? "max-h-[800px] opacity-100 border-t border-gold/10" : "max-h-0 opacity-0"
                      }`}>
                        <div className="p-5 bg-gold/[0.02] space-y-6">
                          {/* Readings Section */}
                          <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-[10px] font-heading font-black tracking-[0.2em] uppercase text-gold">
                              <Star className="w-3 h-3 fill-gold/20" />
                              Chaves de Leitura
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {sym.leituras.map((r, i) => (
                                <span 
                                  key={i} 
                                  className="px-3 py-1.5 rounded-lg text-xs font-body bg-marfim border border-gold/10 text-plum/80 shadow-sm"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Cards Section */}
                          {relatedCards.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-[10px] font-heading font-black tracking-[0.2em] uppercase text-gold">
                                <BookOpen className="w-3 h-3 text-gold" />
                                Estudar nas Cartas
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                                    className="flex flex-col gap-2 p-2 rounded-xl bg-white border border-gold/10 hover:border-gold/40 transition-all group/card shadow-sm hover:shadow-md"
                                  >
                                    <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
                                      <img 
                                        src={card?.cardImage} 
                                        alt={card?.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" 
                                      />
                                      <div className="absolute inset-0 bg-plum/0 group-hover/card:bg-plum/10 transition-colors flex items-center justify-center">
                                        <ExternalLink className="w-5 h-5 text-marfim opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-heading font-bold text-plum/80 text-center truncate px-1">
                                      {card?.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Study CTA */}
                          <div className="pt-2">
                            <button
                              onClick={() => setSelectedSymbol(null)}
                              className="w-full py-2.5 rounded-xl border border-gold/20 text-[10px] font-heading font-bold uppercase tracking-widest text-gold hover:bg-gold/5 transition-colors"
                            >
                              Fechar detalhamento
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
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gold/40" />
            </div>
            <h3 className="font-heading text-lg font-bold text-plum mb-2">
              Mistério não encontrado
            </h3>
            <p className="font-body text-sm text-plum/50 italic max-w-xs mx-auto">
              Nenhum símbolo ou carta corresponde à busca "{search}". Experimente outro termo.
            </p>
            <button 
              onClick={() => setSearch("")}
              className="mt-6 px-6 py-2 rounded-full border border-gold/30 text-xs font-heading font-bold uppercase tracking-widest text-gold hover:bg-gold/5 transition-all"
            >
              Limpar busca
            </button>
          </div>
        )}

        {/* Bottom Ornament */}
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-gold/20" />
            <div className="w-2 h-2 rounded-full border border-gold/40 rotate-45" />
            <div className="h-px w-12 bg-gold/20" />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SymbolLibraryPage;
