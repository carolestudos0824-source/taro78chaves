import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import { useSymbolsContent } from "@/hooks/use-content";
import type { SymbolItemContent } from "@/lib/content";
// import mysticBg from "@/assets/mystic-bg.jpg";
// import ornamentDivider from "@/assets/ornament-divider.png";

const SymbolLibraryPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItemContent | null>(null);
  const [search, setSearch] = useState("");

  // Fase 6.1 — Biblioteca de Símbolos vem do CMS via adapter.
  const { data: symbolsContent, isLoading } = useSymbolsContent();
  const categorias = symbolsContent?.categorias ?? [];

  const term = search.toLowerCase();
  const filteredCategories = search
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-accent italic text-sm" style={{ color: "hsl(36 42% 45% / 0.60)" }}>
          Abrindo a biblioteca…
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.06), hsl(36 33% 97% / 0.04), hsl(36 33% 97% / 0.18))"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: "1px solid hsl(36 45% 50% / 0.30)",
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94), hsl(38 28% 93% / 0.92))",
        backdropFilter: "blur(28px)",
      }}>
        <div className="container max-w-3xl py-4 px-6">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate("/app")} className="transition-all hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[9px] tracking-[0.4em] uppercase font-body flex items-center gap-1.5" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
                <span style={{ color: "hsl(36 40% 42%)" }}>◎</span> Referência <span style={{ color: "hsl(36 40% 42%)" }}>◎</span>
              </span>
              <h1 className="font-heading text-xl md:text-2xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Biblioteca de Símbolos
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(230 10% 45% / 0.50)" }} />
            <input
              type="text"
              placeholder="Buscar símbolo..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm font-body outline-none transition-all"
              style={{
                background: "hsl(38 28% 93% / 0.80)",
                border: "1px solid hsl(36 45% 50% / 0.20)",
                color: "hsl(230 20% 15%)",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(230 10% 45% / 0.50)" }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-6 py-6">
        {/* Category chips */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory(null)}
              className="px-3.5 py-1.5 rounded-full text-[10px] font-heading tracking-wider uppercase transition-all duration-300"
              style={!activeCategory ? {
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                color: "hsl(36 33% 97%)",
                boxShadow: "0 3px 12px hsl(340 42% 28% / 0.18)"
              } : {
                background: "hsl(38 28% 93% / 0.75)",
                border: "1px solid hsl(36 45% 50% / 0.20)",
                color: "hsl(230 20% 15% / 0.60)"
              }}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className="px-3.5 py-1.5 rounded-full text-[10px] font-heading tracking-wider uppercase transition-all duration-300"
                style={activeCategory === cat.slug ? {
                  background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 3px 12px hsl(340 42% 28% / 0.18)"
                } : {
                  background: "hsl(38 28% 93% / 0.75)",
                  border: "1px solid hsl(36 45% 50% / 0.20)",
                  color: "hsl(230 20% 15% / 0.60)"
                }}
              >
                {cat.icone} {cat.nome}
              </button>
            ))}
          </div>
        )}

        {/* Categories and symbols */}
        {filteredCategories.map(cat => (
          <section key={cat.slug} className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{cat.icone}</span>
              <h2 className="font-heading text-base tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                {cat.nome}
              </h2>
            </div>
            <p className="text-[11px] font-accent italic mb-4" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              {cat.descricao}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.simbolos.map(sym => (
                <button
                  key={sym.id}
                  onClick={() => setSelectedSymbol(selectedSymbol?.id === sym.id ? null : sym)}
                  className="w-full text-left transition-all duration-300"
                >
                  <div className="rounded-xl overflow-hidden transition-all duration-300" style={{
                    background: selectedSymbol?.id === sym.id
                      ? "linear-gradient(145deg, hsl(38 28% 93% / 0.96), hsl(36 33% 95% / 0.92))"
                      : "hsl(38 28% 93% / 0.75)",
                    backdropFilter: "blur(12px)",
                    border: selectedSymbol?.id === sym.id
                      ? "1.5px solid hsl(340 42% 28% / 0.30)"
                      : "1px solid hsl(36 45% 50% / 0.18)",
                    boxShadow: selectedSymbol?.id === sym.id
                      ? "0 6px 24px hsl(340 42% 28% / 0.08)"
                      : "none",
                  }}>
                    <div className="p-4">
                      <h3 className="font-heading text-sm tracking-wide mb-1.5" style={{ color: "hsl(230 20% 12%)" }}>
                        {sym.nome}
                      </h3>
                      <p className="text-xs font-body leading-relaxed mb-0" style={{
                        color: "hsl(230 20% 15% / 0.60)",
                        display: selectedSymbol?.id === sym.id ? "block" : "-webkit-box",
                        WebkitLineClamp: selectedSymbol?.id === sym.id ? undefined : 2,
                        WebkitBoxOrient: "vertical",
                        overflow: selectedSymbol?.id === sym.id ? "visible" : "hidden",
                      }}>
                        {sym.explicacao}
                      </p>

                      {/* Expanded content */}
                      {selectedSymbol?.id === sym.id && (
                        <div className="mt-4 space-y-3" style={{ animation: "fade-up 0.3s ease-out" }}>
                          {/* Readings */}
                          <div>
                            <h4 className="text-[9px] font-heading tracking-[0.25em] uppercase mb-2" style={{ color: "hsl(36 42% 40%)" }}>
                              Possíveis Leituras
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {sym.leituras.map((r, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-body" style={{
                                  background: "hsl(36 45% 55% / 0.10)",
                                  border: "1px solid hsl(36 45% 50% / 0.18)",
                                  color: "hsl(230 20% 15% / 0.70)"
                                }}>
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Cards */}
                          <div>
                            <h4 className="text-[9px] font-heading tracking-[0.25em] uppercase mb-2" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
                              Aparece em
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {sym.cartas.map((c, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-heading tracking-wider" style={{
                                  background: "hsl(340 42% 28% / 0.08)",
                                  border: "1px solid hsl(340 42% 28% / 0.18)",
                                  color: "hsl(340 42% 22%)"
                                }}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <span className="text-2xl block mb-3" style={{ color: "hsl(36 42% 45% / 0.40)" }}>◎</span>
            <p className="font-accent italic text-sm" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
              Nenhum símbolo encontrado para "{search}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-center pt-4 pb-10">
          <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
        </div>
      </main>

      {/* Symbol detail overlay for mobile - could be enhanced later */}
    </div>
  );
};

export default SymbolLibraryPage;
