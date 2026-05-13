import { useState } from "react";
import { BookOpen, Scroll, Star, History, ChevronDown, ChevronUp } from "lucide-react";

interface DeepDiveSectionProps {
  text: string;
  symbolism?: string;
  cabala?: string;
  history?: string;
}

export function DeepDiveSection({ text, symbolism, cabala, history }: DeepDiveSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const sections = [
    { id: "text", title: "Texto Aprofundado", content: text, icon: Scroll },
    symbolism ? { id: "symbolism", title: "Simbolismo", content: symbolism, icon: Star } : null,
    cabala ? { id: "cabala", title: "Cabala", content: cabala, icon: BookOpen } : null,
    history ? { id: "history", title: "Contexto Histórico", content: history, icon: History } : null,
  ].filter(Boolean) as { id: string; title: string; content: string; icon: typeof Scroll }[];

  return (
    <div className="space-y-3 animate-fade-up">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-heading text-muted-foreground tracking-widest uppercase">
          Aprofundamento (opcional)
        </span>
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        const isOpen = expanded === section.id;

        return (
          <div key={section.id} className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: isOpen ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.4)",
              border: `1px solid ${isOpen ? "rgba(200, 166, 106, 0.3)" : "rgba(200, 166, 106, 0.15)"}`,
              boxShadow: isOpen ? "0 4px 15px rgba(91, 31, 61, 0.04)" : "none",
            }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : section.id)}
              className="w-full p-5 flex items-center gap-4 hover:bg-white/40 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#C8A66A10] border border-[#C8A66A30]">
                <Icon className="w-4 h-4 text-[#C8A66A] shrink-0" />
              </div>
              <span className="font-heading text-sm font-bold tracking-wide flex-1 text-[#5B1F3D]">{section.title}</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-[#C8A66A]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#C8A66A]" />
              )}
            </button>
            {isOpen && (
              <div className="px-6 pb-6 animate-fade-up">
                <p className="text-[#5B1F3D]/80 leading-[1.75] text-[15px]">{section.content}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
