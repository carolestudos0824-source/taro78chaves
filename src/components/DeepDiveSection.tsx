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
          <div key={section.id} className="card-mystic overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : section.id)}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <span className="font-heading text-sm text-foreground flex-1">{section.title}</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 animate-fade-up">
                <p className="text-foreground/75 leading-relaxed text-sm">{section.content}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
