import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { type LessonSection } from "@/lib/content/runtime-types";

interface LessonSectionsProps {
  sections: LessonSection[];
}

const accentColors: Record<string, { border: string; bg: string; icon: string }> = {
  gold: {
    border: "hsl(36 45% 58% / 0.3)",
    bg: "hsl(36 45% 58% / 0.05)",
    icon: "hsl(36 40% 42%)",
  },
  wine: {
    border: "hsl(340 42% 30% / 0.25)",
    bg: "hsl(340 42% 30% / 0.04)",
    icon: "hsl(340 42% 30%)",
  },
  plum: {
    border: "hsl(325 35% 18% / 0.2)",
    bg: "hsl(325 35% 22% / 0.06)",
    icon: "hsl(325 35% 28%)",
  },
};

const defaultAccent = {
  border: "hsl(36 45% 58% / 0.2)",
  bg: "hsl(36 33% 97% / 0.6)",
  icon: "hsl(36 40% 42%)",
};

export function LessonSections({ sections }: LessonSectionsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        const isOpen = openSection === section.id;
        const colors = section.accent ? accentColors[section.accent] : defaultAccent;

        return (
          <div
            key={section.id}
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: isOpen ? colors.bg : "hsl(38 30% 95% / 0.7)",
              border: `1px solid ${isOpen ? colors.border : "hsl(36 25% 82% / 0.5)"}`,
              boxShadow: isOpen
                ? "0 4px 20px hsl(36 45% 58% / 0.06)"
                : "0 1px 4px hsl(36 45% 58% / 0.03)",
              animation: `fade-up 0.4s ease-out ${idx * 0.05}s both`,
            }}
          >
            <button
              onClick={() => setOpenSection(isOpen ? null : section.id)}
              className="w-full px-6 py-5 flex items-center gap-4 text-left transition-colors duration-200"
            >
              <span
                className="text-lg shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/50 border border-[#C8A66A30]"
                style={{ color: "#C8A66A" }}
              >
                {section.icon}
              </span>
              <span
                className="font-heading text-base font-bold tracking-tight flex-1 text-[#5B1F3D]"
              >
                {section.title}
              </span>
              <ChevronDown
                className="w-5 h-5 shrink-0 transition-transform duration-300"
                style={{
                  color: "#C8A66A",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-6" style={{ animation: "fade-up 0.3s ease-out" }}>
                <div
                  className="h-px mb-5"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(200, 166, 106, 0.2), transparent)",
                  }}
                />
                <p
                  className="text-[15px] leading-[1.75] text-[#5B1F3D]/80"
                >
                  {section.content}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
