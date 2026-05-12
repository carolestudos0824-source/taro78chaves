import { useNavigate } from "react-router-dom";
import { 
  Check, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Key, 
  Eye, 
  Moon, 
  Droplets, 
  Gem, 
  Swords, 
  Crown, 
  Layers, 
  Compass,
  SquareStack,
  Briefcase,
  Stars,
  Layout
} from "lucide-react";
import { 
  MODULES_CATALOG as MODULES, 
  DEFAULT_PROGRESS,
  type LearningModule, 
  type ModuleCategory 
} from "@/lib/content";
import { Header } from "@/components/Header";
import imgLouco from "@/assets/arcano-0-louco.jpg";
import imgSacerdotisa from "@/assets/arcano-2-sacerdotisa.jpg";
import imgEstrela from "@/assets/arcano-17-estrela.jpg";
import { useEffect } from "react";

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  "foundation": "Trilha 1 · Fundamentos",
  "major-arcana": "Trilha 2 · Arcanos Maiores",
  "minor-arcana": "Trilha 3 · Arcanos Menores",
  "advanced": "Trilha 4 · Métodos e Combinações",
  "practice": "Trilha 5 · Prática Guiada",
  "professional": "Trilha 6 · Formação Profissional",
};

const MODULE_ICON_MAP: Record<string, any> = {
  "fundamentos": Compass,
  "leitura-simbolica": Eye,
  "arcanos-maiores": Stars,
  "arquitetura-menores": Layers,
  "copas": Droplets,
  "paus": Flame,
  "espadas": Swords,
  "ouros": Gem,
  "cartas-corte": Crown,
  "combinacoes": GitBranch,
  "tiragens": Layout,
  "espiritualidade": Moon,
  "mesa-taro": SquareStack,
  "leitura-aplicada": Target,
  "pratica": Sparkles,
  "trabalhar-taro": Briefcase,
};

// Mock components to avoid hook issues
const SmartReviewCard = () => <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-[#C8A66A]">Review Card Shell</div>;
const ProgressCelebration = () => null;
const ContinuityCard = () => null;
const GitBranch = (props: any) => <div {...props}>Y</div>;
const Target = (props: any) => <div {...props}>O</div>;

const ModulesPageSafe = () => {
  const navigate = useNavigate();
  const progress = DEFAULT_PROGRESS;
  
  useEffect(() => {
    const marker = document.getElementById("boot-marker");
    if (marker) {
      marker.innerText = "TEST C4: MODULES SHELL OK";
    }
  }, []);

  const grouped = MODULES.reduce<Record<ModuleCategory, LearningModule[]>>((acc, mod) => {
    if (!acc[mod.category]) acc[mod.category] = [];
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<ModuleCategory, LearningModule[]>);

  const categoryOrder: ModuleCategory[] = ["foundation", "major-arcana", "minor-arcana", "advanced", "practice", "professional"];

  return (
    <div className="min-h-screen bg-[#FAF5EF]">
      <Header streak={0} xp={0} level={1} />

      <main className="container max-w-lg px-6 pt-10 pb-24 space-y-12">
        <div className="bg-[#5B1F3D] text-white p-4 rounded-xl text-center font-bold">
           TEST C4: MODULES SHELL OK
        </div>

        {/* ─── Global Training Progress ─── */}
        <div className="bg-white border-2 border-[#C8A66A]/20 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5B1F3D] flex items-center justify-center border border-[#C8A66A]/30">
                <SquareStack className="w-5 h-5 text-[#C8A66A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-heading font-black tracking-[0.2em] text-[#5B1F3D] uppercase">Sua Formação</span>
                <span className="text-sm font-heading font-black text-[#5B1F3D]">Mapa dos 78 Arcanos</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-heading font-black text-[#5B1F3D]">0</span>
              <span className="text-[10px] font-black text-[#5B1F3D]/30 ml-1">/78</span>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-[#E8DED3] overflow-hidden p-[1.5px] border border-[#D1C4B5]/30">
            <div className="h-full rounded-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] w-[2%]" />
          </div>
        </div>

        <SmartReviewCard />
        
        {/* ─── Hero Visuals ─── */}
        <div className="flex justify-center -space-x-4 py-4 opacity-90">
          <img src={imgLouco} alt="" className="w-24 rounded-2xl shadow-xl -rotate-12 border-2 border-white/50" />
          <img src={imgSacerdotisa} alt="" className="w-24 rounded-2xl shadow-xl z-10 border-2 border-white" />
          <img src={imgEstrela} alt="" className="w-24 rounded-2xl shadow-xl rotate-12 border-2 border-white/50" />
        </div>

        {/* ─── Modules Grid ─── */}
        <div className="space-y-12">
          {categoryOrder.map(cat => {
            const mods = grouped[cat];
            if (!mods || mods.length === 0) return null;

            return (
              <section key={cat} className="space-y-6">
                <div className="flex items-center gap-6">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A66A]/30" />
                  <h2 className="font-heading text-[11px] tracking-[0.4em] uppercase font-black text-[#5B1F3D]/80">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A66A]/30" />
                </div>

                <div className="grid gap-6">
                  {mods.map((mod) => {
                    const IconComponent = MODULE_ICON_MAP[mod.id] || Sparkles;
                    return (
                      <div
                        key={mod.id}
                        className="w-full text-left p-7 rounded-[2.5rem] border-2 bg-white border-[#DCCFC2]/60 shadow-lg flex items-center gap-7"
                      >
                        <div className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 border-2 bg-[#FAF5EF] border-[#DCCFC2]/40 text-[#5B1F3D]">
                           <IconComponent className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-xl font-bold text-[#5B1F3D]">
                            {mod.name}
                          </h3>
                        </div>
                        <ChevronRight className="text-[#C8A66A]" />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ModulesPageSafe;