import { KeyRound } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useRole } from "@/hooks/use-role";
import { ARCANOS_MAIORES_CATALOG } from "@/lib/content";

export function ChaveProgress() {
  const { progress } = useProgress();
  const { isStaff } = useRole();
  
  const completedMaiores = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
  const completedMenores = progress.completedLessons.filter(l => 
    l.startsWith("copas-") || l.startsWith("paus-") || l.startsWith("espadas-") || l.startsWith("ouros-")
  ).length;
  
  const totalCompletedArcanos = completedMaiores + completedMenores;
  const totalArcanosCount = 78;
  const globalProgressPct = Math.round((totalCompletedArcanos / totalArcanosCount) * 100);

  const getHeaderArcanoAtual = () => {
    for (let i = 0; i <= 21; i++) {
      if (!progress.completedLessons.includes(`arcano-${i}`)) {
        return { 
          name: ARCANOS_MAIORES_CATALOG[i]?.name || "O Louco", 
          index: i + 1
        };
      }
    }
    
    const naipes = ["copas", "paus", "espadas", "ouros"] as const;
    const posicoes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "pajem", "cavaleiro", "rainha", "rei"] as const;
    
    let currentIndex = 23;
    for (const naipe of naipes) {
      for (const posicao of posicoes) {
        const id = `${naipe}-${posicao}`;
        if (!progress.completedLessons.includes(id)) {
          const name = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          return { 
            name: name, 
            index: currentIndex
          };
        }
        currentIndex++;
      }
    }
    
    return { 
      name: "Mestre do Tarô", 
      index: 78 
    };
  };

  const currentKeyInfo = getHeaderArcanoAtual();

  return (
    <div 
      className="flex items-center gap-4"
      title={`Sua Travessia: ${totalCompletedArcanos} de 78 ${totalCompletedArcanos === 1 ? "Chave" : "Chaves"}`}
      aria-label={`Sua Travessia: ${totalCompletedArcanos} de 78 ${totalCompletedArcanos === 1 ? "Chave" : "Chaves"}`}

    >
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105" style={{
          border: "2px solid #C8A66A4D",
          background: "linear-gradient(135deg, #FAF5EF, #F3E6E0)",
          boxShadow: "0 4px 15px rgba(91, 31, 61, 0.08)"
        }}>
          <KeyRound className="w-6 h-6" style={{ color: "#C8A66A" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] tracking-[0.2em] uppercase leading-none font-heading font-black" style={{
            color: "#5B1F3D"
          }}>{currentKeyInfo.index === 1 ? "Chave" : "Chaves"}</span>

          <span className="text-xl font-heading tracking-tighter leading-tight font-black" style={{
            color: "#5B1F3D"
          }}>{currentKeyInfo.index}</span>
        </div>
      </div>
      <div className="flex-1 relative space-y-1.5">
        <div className="flex justify-between items-end px-1">
            <span className="text-[11px] font-heading font-black tracking-widest text-[#5B1F3D]/80 uppercase">
              {isStaff ? (
                <span className="flex items-center gap-1">
                   {currentKeyInfo.name} <span className="text-[8px] px-1.5 py-0.5 bg-[#C8A66A]/20 rounded text-[#8B6A30] font-black" title="Progresso local da sessão. Não será salvo permanentemente.">Modo Auditoria</span>
                </span>
              ) : currentKeyInfo.name}
            </span>
          <span className="text-[11px] font-heading font-black text-[#5B1F3D]">{globalProgressPct}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden p-[1.5px]" style={{
          background: "#DCCFC240",
          border: "1px solid #DCCFC2",
        }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden shadow-[0_0_10px_rgba(200,166,106,0.5)]"
            style={{
              width: `${Math.max(globalProgressPct, 5)}%`,
              background: "linear-gradient(90deg, #5B1F3D, #C8A66A)",
            }}
          >
            <div
              className="absolute inset-0 w-1/3 h-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "progress-shine 3s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end tabular-nums shrink-0">
        <div className="flex items-baseline gap-0.5">
          <span className="text-base font-black text-[#5B1F3D]">{currentKeyInfo.index}</span>
          <span className="text-[10px] font-black text-[#5B1F3D]/30">/78</span>
        </div>
        <span className="text-[10px] font-heading font-black tracking-[0.2em] text-[#5B1F3D] uppercase leading-none">{currentKeyInfo.index === 1 ? "Chave" : "Chaves"}</span>
      </div>
    </div>
  );
}
