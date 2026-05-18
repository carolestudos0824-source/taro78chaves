import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useResolvedArcanosMaiores } from "@/hooks/use-resolved-arcanos-maiores";
import { useJourneyContent } from "@/hooks/use-content";
import { CORES_FASE, JOURNEY_MOTION } from "@/config/journey-visual";
import { EDITORIAL_REGISTRY } from "@/content/arcanos-maiores";

const FoolsJourneyPage = () => {
  const navigate = useNavigate();
  const { progress, isArcanoUnlocked, isArcanoCompleted } = useProgress();

  // Fase 2C: lista agregada dos 22 Arcanos Maiores também passa pelo adaptador
  const resolvedMaiores = useResolvedArcanosMaiores();
  void resolvedMaiores;

  // Fase 5D: estrutura editorial da Jornada vem do CMS via adapter.
  const { data: journey, isLoading } = useJourneyContent();

  const isStudied = (arcanoId: number) => isArcanoUnlocked(arcanoId);
  const isComplete = (arcanoId: number) => isArcanoCompleted(arcanoId);

  if (isLoading || !journey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-accent italic text-sm" style={{ color: "hsl(36 42% 45% / 0.60)" }}>
          Preparando a travessia…
        </div>
      </div>
    );
  }

  const { meta, fases, arcanos } = journey;

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Marfim suave e atmosfera premium */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{
          backgroundColor: "#FAF5EF",
          opacity: 1
        }} />
        {/* Clean Marfim Background */}
      </div>

      {/* Header */}
      <header className="relative z-20" style={{
        borderBottom: "1px solid rgba(200,166,106,0.18)",
        background: "linear-gradient(180deg, rgba(250,245,239,0.96) 0%, rgba(245,235,222,0.94) 100%)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 4px 24px rgba(61,20,41,0.05)"
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(200,166,106,0.08)",
                border: "1px solid rgba(200,166,106,0.18)",
              }}
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "#5B1F3D" }} />
            </button>
            <div>
              <span className="text-[11px] tracking-[0.35em] uppercase font-heading font-semibold block mb-0.5" style={{ color: "#5B1F3D" }}>
                ✦ Visão Geral ✦
              </span>
              <h1 className="font-heading text-xl tracking-wide" style={{
                background: "linear-gradient(135deg, #3D1429 0%, #5B1F3D 50%, #8B6A30 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {meta.introTitulo}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Hero Visual Guide - O Louco */}
        <section className="relative z-10 mb-12 text-center flex flex-col items-center animate-fade-in">
          <div className="relative mb-8 group">
            {/* Soft halo behind the card */}
            <div className="absolute inset-0 bg-[#C8A66A] opacity-20 blur-3xl rounded-full scale-150 animate-pulse" />
            
            {/* Guided mini-trio visual */}
            <div className="flex items-end justify-center -space-x-8 md:-space-x-12 relative z-10">
              <div className="w-16 md:w-20 aspect-[2/3.5] rounded-lg overflow-hidden border-2 border-[#C8A66A]/50 shadow-xl rotate-[-12deg] transition-all hover:rotate-0 hover:z-20 hover:scale-110">
                <img src={EDITORIAL_REGISTRY[1]?.cardImage || "/assets/cards/the-magician.jpg"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-28 md:w-36 aspect-[2/3.5] rounded-xl overflow-hidden border-4 border-[#C8A66A] shadow-2xl z-10 relative transform hover:scale-110 transition-transform duration-500">
                <img src={EDITORIAL_REGISTRY[0]?.cardImage || "/assets/cards/the-fool.jpg"} alt="O Louco" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="w-16 md:w-20 aspect-[2/3.5] rounded-lg overflow-hidden border-2 border-[#C8A66A]/50 shadow-xl rotate-[12deg] transition-all hover:rotate-0 hover:z-20 hover:scale-110">
                <img src={EDITORIAL_REGISTRY[21]?.cardImage || "/assets/cards/the-world.jpg"} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Sparkle ornaments */}
            <div className="absolute -top-6 -right-6 text-[#C8A66A] text-2xl animate-bounce">✦</div>
            <div className="absolute -bottom-4 -left-6 text-[#C8A66A] text-2xl animate-pulse">✨</div>
          </div>

          <div className="flex flex-col items-center max-w-lg mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl tracking-tight mb-4" style={{ color: "#3D1429" }}>
              {meta.introTitulo}
            </h1>
            <p className="font-accent text-xl md:text-2xl italic leading-relaxed mb-4 px-4" style={{ color: "#5B1F3D", fontWeight: 700 }}>
              "{meta.introEpigrafe}"
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-[#C8A66A]/40" />
              <span className="font-heading text-[11px] tracking-[0.4em] uppercase font-bold" style={{ color: "#C8A66A" }}>
                {meta.introSubtitulo}
              </span>
              <span className="h-px w-8 bg-[#C8A66A]/40" />
            </div>
          </div>
        </section>

        {/* Introduction Editorial Card */}
        <section className="mb-14" style={{ animation: "fade-up 0.6s ease-out" }}>
          <div className="relative rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden" style={{
            background: "#FAF5EF",
            border: "2px solid rgba(200, 166, 106, 0.4)",
            boxShadow: "0 25px 60px rgba(91, 31, 61, 0.1)"
          }}>
            {/* Corner ornaments - stronger presence */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#C8A66A]/30 rounded-tl-[2rem]" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#C8A66A]/30 rounded-br-[2rem]" />
            
            <div className="space-y-5 relative z-10">
              {meta.introCorpo.map((para, i) => (
                <p key={i} className="font-body text-[15px] md:text-[16px] leading-[1.8] font-medium" style={{ color: "#3D1429" }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Synthesis Block - 3 Key Points */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {[
            { label: "Início", title: "O Salto da Jornada", text: "O Louco e o potencial puro de quem ousa começar.", icon: "0" },
            { label: "Travessia", title: "Provas e Espelhos", text: "Encontros com mestres e abismos da alma.", icon: "◈" },
            { label: "Integração", title: "Consciência Plena", text: "O Mundo e a união final de todo aprendizado.", icon: "XXI" }
          ].map((point, i) => (
            <div key={i} className="rounded-2xl p-6 text-center bg-[#FAF5EF] border-2 border-[#C8A66A]/50 shadow-md transition-all hover:shadow-xl hover:border-[#C8A66A]/80 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#C8A66A]/60 bg-white group-hover:scale-110 transition-transform shadow-sm">
                <span className="font-heading text-[13px] font-bold" style={{ color: "#3D1429" }}>{point.icon}</span>
              </div>
              <span className="text-[11px] font-heading tracking-[0.25em] uppercase font-bold block mb-2" style={{ color: "#8B6A30" }}>{point.label}</span>
              <h4 className="font-heading text-base font-bold mb-2" style={{ color: "#3D1429" }}>{point.title}</h4>
              <p className="font-body text-[13px] leading-relaxed font-semibold" style={{ color: "#5B1F3D" }}>{point.text}</p>
            </div>
          ))}
        </section>

        {/* Journey Phases */}
        {fases.map((phase, phaseIndex) => {
          const colors = CORES_FASE[phase.theme];
          const phaseArcanos = arcanos.filter((a) => a.faseSlug === phase.slug);

          return (
            <section
              key={phase.id}
              className="mb-14"
              style={{ animation: `fade-up 0.5s ease-out both`, animationDelay: `${phaseIndex * 100}ms` }}
            >
              {/* Phase header */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent" style={{ backgroundColor: `${colors.main}20` }} />
                  <span className="text-[#C8A66A] text-sm">✦</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent" style={{ backgroundColor: `${colors.main}20` }} />
                </div>
              </div>

              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-md"
                  style={{
                    background: "#FAF5EF",
                    border: `2px solid ${colors.main}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-2xl" style={{ color: colors.main }}>{phase.simbolo}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] font-heading font-bold tracking-[0.3em] uppercase" style={{ color: colors.main }}>
                    Fase {phaseIndex + 1}
                  </span>
                </div>
                <h2 className="font-heading text-xl tracking-wide mb-2" style={{ color: "#3D1429" }}>
                  {phase.titulo}
                </h2>
                <p className="font-accent text-base italic" style={{ color: "#5B1F3D" }}>
                  {phase.subtitulo}
                </p>
              </div>

              {/* Phase description */}
              <div className="rounded-2xl p-6 mb-8 shadow-md" style={{
                background: "#FAF5EF",
                border: `2px solid ${colors.border}`,
                boxShadow: "0 8px 30px rgba(91, 31, 61, 0.08)"
              }}>
                <p className="font-body text-sm leading-[1.85] font-semibold" style={{ color: "#3D1429" }}>
                  {phase.descricao}
                </p>
              </div>

              {/* Arcano cards within this phase */}
              <div className="space-y-4">
                {phaseArcanos.map((arcano, idx) => {
                  const studied = isStudied(arcano.arcanoNumero);
                  // Alternar lado da imagem na trilha
                  const isEven = idx % 2 === 0;
                  
                  return (
                    <button
                      key={arcano.id}
                      onClick={() => studied ? navigate(`/lesson/${arcano.arcanoNumero}`) : undefined}
                      disabled={!studied}
                      className="w-full text-left group transition-all duration-300 active:scale-[0.98]"
                      style={{ opacity: 1 }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:border-[#C8A66A]/80"
                        style={{
                          background: "#FFFFFF",
                          border: `1px solid rgba(200, 166, 106, 0.6)`,
                        }}
                      >
                        <div className={`p-4 flex gap-5 ${!isEven ? 'flex-row-reverse' : ''} items-center`}>
                          {/* Arcano Visual / Card Image */}
                          <div 
                            className="w-24 h-36 rounded-lg shrink-0 overflow-hidden relative shadow-lg border-2 border-[#C8A66A]/40 group-hover:scale-105 transition-transform duration-500"
                            style={{ 
                              background: "#3D1429",
                              filter: "none"
                            }}
                          >
                            <img 
                              src={(() => {
                                // Ajuste de mapeamento para clareza visual:
                                // Algumas tradições invertem 8 e 11. O Registry segue uma, a Jornada outra.
                                // Corrigimos aqui para que a imagem combine com o nome do arcano.
                                let imgNum = arcano.arcanoNumero;
                                if (imgNum === 8) imgNum = 11;
                                else if (imgNum === 11) imgNum = 8;
                                return EDITORIAL_REGISTRY[imgNum]?.cardImage || "/src/assets/arcano-placeholder.jpg";
                              })()}
                              alt={arcano.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200';
                              }}
                            />
                          </div>

                          {/* Content */}
                          <div className={`flex-1 min-w-0 flex flex-col justify-center ${!isEven ? 'text-right' : 'text-left'} py-1`}>
                            <div className={`flex items-center gap-2 mb-1 ${!isEven ? 'justify-end' : 'justify-start'}`}>
                              <span 
                                className="font-heading text-[10px] md:text-[11px] tracking-[0.2em] font-bold"
                                style={{ color: "#8B6A30" }}
                              >
                                {arcano.numeral}
                              </span>
                              <div className="w-1 h-1 rounded-full bg-[#C8A66A]/40" />
                              <h3
                                className="font-heading text-base md:text-lg tracking-wide font-bold leading-tight"
                                style={{ color: "#3D1429" }}
                              >
                                {arcano.nome}
                              </h3>
                              {studied && (isEven ? (
                                <ChevronRight className="w-4 h-4 shrink-0 text-[#C8A66A]/60 group-hover:translate-x-1 transition-transform" />
                              ) : (
                                <ChevronRight className="w-4 h-4 shrink-0 text-[#C8A66A]/60 group-hover:-translate-x-1 transition-transform rotate-180" />
                              ))}
                            </div>
                            <p
                              className="font-accent text-[13px] md:text-[15px] italic mb-2 font-bold leading-tight"
                              style={{ color: "#5B1F3D" }}
                            >
                              {arcano.papel}
                            </p>
                            <p
                              className="font-body text-[12px] md:text-[13px] leading-relaxed line-clamp-2 md:line-clamp-3 font-semibold"
                              style={{ color: "#3D1429" }}
                            >
                              {arcano.textoNarrativo}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Closing */}
        <section className="mb-12 mt-8" style={{ animation: "fade-up 0.6s ease-out" }}>
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8A66A]/40" />
              <span className="text-[#C8A66A] text-lg">✶◈✶</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8A66A]/40" />
            </div>
          </div>
          <div className="text-center px-4">
            <Sparkles className="w-6 h-6 mx-auto mb-4" style={{ color: "#C8A66A" }} />
            <h2 className="font-heading text-xl tracking-wide mb-4" style={{
              background: "linear-gradient(135deg, #3D1429 0%, #5B1F3D 50%, #8B6A30 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {meta.encerramentoTitulo}
            </h2>
            <p className="font-body text-sm leading-[1.85] max-w-lg mx-auto mb-6" style={{ color: "#3D1429" }}>
              {meta.encerramentoCorpo}
            </p>
            <p className="font-accent text-xl italic font-bold" style={{ color: "#5B1F3D" }}>
              {meta.encerramentoConvite}
            </p>
          </div>
        </section>

        {/* Action buttons - Final CTA */}
        <div className="flex flex-col items-center gap-4 pb-16 pt-8 relative z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/lesson/0");
            }}
            className="group relative w-full max-w-xs px-10 py-5 rounded-full font-heading text-[12px] tracking-[0.3em] uppercase transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl"
            style={{
              background: "linear-gradient(135deg, #5B1F3D 0%, #3D1429 100%)",
              color: "#FAF5EF",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C8A66A] group-hover:rotate-12 transition-transform" />
              Começar pelo Louco
            </span>
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button
            onClick={() => navigate("/module/arcanos-maiores")}
            className="w-full max-w-xs px-10 py-4 rounded-full font-heading text-[11px] tracking-[0.2em] uppercase transition-all hover:bg-white/60 border-2 border-[#C8A66A30] font-bold"
            style={{ color: "#5B1F3D" }}
          >
            Voltar à Trilha dos Arcanos
          </button>
        </div>
      </main>
    </div>
  );
};

export default FoolsJourneyPage;
