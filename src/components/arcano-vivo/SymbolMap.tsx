import { useState } from "react";
import { Info, HelpCircle, X, ChevronRight, ChevronLeft } from "lucide-react";
import { type ArcanoSymbolMapItem } from "@/lib/content/runtime-types";

interface SymbolMapProps {
  cardImage: string;
  cardName: string;
  symbols: ArcanoSymbolMapItem[];
  onComplete: () => void;
}

export function SymbolMap({ cardImage, cardName, symbols, onComplete }: SymbolMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectedSymbol = symbols.find(s => s.id === selectedId) || symbols[currentIndex];

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % symbols.length;
    setCurrentIndex(nextIdx);
    setSelectedId(symbols[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + symbols.length) % symbols.length;
    setCurrentIndex(prevIdx);
    setSelectedId(symbols[prevIdx].id);
  };

  const isLast = currentIndex === symbols.length - 1;

  return (
    <div className="space-y-6 pb-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: "hsl(36 40% 42%)" }} />
          <span className="text-[10px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
            Mapa de Símbolos
          </span>
        </div>
        <span className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 50%)" }}>
          {currentIndex + 1} / {symbols.length}
        </span>
      </div>

      <div className="relative aspect-[2/3] max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-2xl group">
        <img 
          src={cardImage} 
          alt={cardName} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay points */}
        <div className="absolute inset-0">
          {symbols.map((symbol, idx) => {
            const isActive = selectedSymbol?.id === symbol.id;
            return (
              <button
                key={symbol.id}
                onClick={() => {
                  setSelectedId(symbol.id);
                  setCurrentIndex(idx);
                }}
                className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-lg
                  ${isActive 
                    ? "bg-white border-gold-500 scale-125 z-20" 
                    : "bg-white/40 border-white/60 hover:bg-white/60 hover:scale-110 z-10"
                  }`}
                style={{ 
                  left: `${symbol.position.x}%`, 
                  top: `${symbol.position.y}%`,
                  boxShadow: isActive ? "0 0 15px hsl(36 45% 58% / 0.5)" : "none"
                }}
              >
                <div className={`w-2 h-2 rounded-full ${isActive ? "bg-gold-600 animate-pulse" : "bg-white"}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Symbol Content Card */}
      <div className="min-h-[220px] relative">
        <div 
          key={selectedSymbol?.id}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border shadow-sm animate-fade-up"
          style={{ borderColor: "hsl(36 45% 58% / 0.15)" }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>
              {selectedSymbol?.name}
            </h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "hsl(36 45% 58% / 0.1)" }}>
              <Info className="w-4 h-4" style={{ color: "hsl(36 40% 42%)" }} />
            </div>
          </div>
          
          <p className="text-sm leading-relaxed mb-5" style={{ color: "hsl(230 20% 25%)" }}>
            {selectedSymbol?.description}
          </p>

          <div className="rounded-xl p-4 space-y-2" style={{ background: "hsl(270 30% 35% / 0.04)", border: "1px solid hsl(270 30% 35% / 0.1)" }}>
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-3.5 h-3.5" style={{ color: "hsl(270 30% 35%)" }} />
              <span className="text-[9px] font-heading tracking-wider uppercase" style={{ color: "hsl(270 30% 35%)" }}>
                Para Refletir
              </span>
            </div>
            <p className="text-xs leading-relaxed italic" style={{ color: "hsl(230 20% 20% / 0.8)" }}>
              "{selectedSymbol?.reflectionQuestion}"
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all border active:scale-95"
            style={{ 
              background: "hsl(38 30% 95% / 0.5)",
              borderColor: "hsl(36 25% 82% / 0.3)",
              color: "hsl(230 10% 40%)"
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all border active:scale-95"
            style={{ 
              background: "hsl(38 30% 95% / 0.5)",
              borderColor: "hsl(36 25% 82% / 0.3)",
              color: "hsl(230 10% 40%)"
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={onComplete}
          className={`px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300
            ${isLast ? "bg-gold-600 text-white shadow-lg scale-105" : "text-gold-700 bg-gold-50"}`}
          style={{
            background: isLast ? "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))" : undefined,
            color: isLast ? "white" : "hsl(36 40% 42%)",
            border: isLast ? "none" : "1px solid hsl(36 45% 58% / 0.2)"
          }}
        >
          {isLast ? "Continuar ✦" : "Pular Mapa"}
        </button>
      </div>
    </div>
  );
}
