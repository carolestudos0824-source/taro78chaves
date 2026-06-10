import type { ExtraMaterial } from "@/lib/content";
import { FileText, Headphones, File, Video, ExternalLink, ChevronRight } from "lucide-react";

interface LibrarySectionProps {
  materials: ExtraMaterial[];
  cardName: string;
}

const typeConfig = {
  text: { icon: FileText, label: "Texto", color: "text-primary" },
  audio: { icon: Headphones, label: "Áudio", color: "text-crimson" },
  pdf: { icon: File, label: "PDF", color: "text-accent" },
  video: { icon: Video, label: "Vídeo", color: "text-secondary" },
  link: { icon: ExternalLink, label: "Link", color: "text-primary" },
};

export function LibrarySection({ materials, cardName }: LibrarySectionProps) {
  if (materials.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-heading text-muted-foreground tracking-widest uppercase">
          Biblioteca — {cardName}
        </span>
      </div>

      <div className="grid gap-3">
        {materials.map((material) => {
          const config = typeConfig[material.type];
          const Icon = config.icon;

          return (
            <button
              key={material.id}
              className="w-full card-mystic p-4 flex items-center gap-4 hover:glow-gold transition-all duration-300 group text-left"
              onClick={() => {
                if (material.type === "text" && material.content) {
                  // Could open a modal or expand inline
                }
              }}
            >
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h4 className="font-heading text-sm text-foreground group-hover:text-primary transition-colors break-words leading-tight">
                  {material.title}
                </h4>
                <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{material.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {material.duration && (
                  <span className="text-xs text-muted-foreground">{material.duration}</span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {config.label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
