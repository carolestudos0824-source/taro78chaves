import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Layers, Eye, Brain, Flame,
  BookOpen, Star, Crown, Sparkles, ArrowRight, Heart,
  Compass, Award, Library, Check, X,
} from "lucide-react";
import { TarotAnimatedCard } from "@/components/tarot-motion/TarotAnimatedCard";
import { getArcanoFull } from "@/lib/content";
import { useAuth } from "@/hooks/use-auth";

/* ═══════════════ SLIDE DATA ═══════════════ */

const SLIDES = [
  { id: "cover" },
  { id: "problem" },
  { id: "solution" },
  { id: "method" },
  { id: "differentials" },
  { id: "inside" },
  { id: "modules" },
  { id: "journey" },
  { id: "plans" },
  { id: "value" },
  { id: "cta" },
];

/* ═══════════════ COMPONENT ═══════════════ */

const PresentationPage = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const total = SLIDES.length;

  const go = useCallback((dir: 1 | -1) => {
    setCurrent(c => Math.max(0, Math.min(total - 1, c + dir)));
  }, [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, navigate]);

  const slideId = SLIDES[current].id;

  const handleCTA = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none"
      style={{ background: "#FAF5EF" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4" style={{
        borderBottom: "1px solid #C8A66A40",
        background: "#FAF5EF",
        backdropFilter: "blur(12px)",
      }}>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1 text-[11px] font-heading tracking-[0.2em] uppercase font-bold transition-colors hover:text-[#C8A66A]" 
          style={{ color: "#5B1F3D" }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Voltar
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3" style={{ color: "#C8A66A" }} />
          <span className="text-[11px] font-heading tracking-[0.3em] uppercase font-bold" style={{ color: "#5B1F3D" }}>
            A Jornada do Louco
          </span>
          <Sparkles className="w-3 h-3" style={{ color: "#C8A66A" }} />
        </div>
        <span className="text-[11px] font-heading tracking-widest font-black tabular-nums" style={{ color: "#5B1F3D" }}>
          {current + 1} / {total}
        </span>
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
          <div key={slideId} className="w-full max-w-4xl" style={{
            animation: "fade-in 0.4s ease-out",
          }}>
            {slideId === "cover" && <SlideCover />}
            {slideId === "problem" && <SlideProblem />}
            {slideId === "solution" && <SlideSolution />}
            {slideId === "method" && <SlideMethod />}
            {slideId === "differentials" && <SlideDifferentials />}
            {slideId === "inside" && <SlideInside />}
            {slideId === "modules" && <SlideModules />}
            {slideId === "journey" && <SlideJourney />}
            {slideId === "plans" && <SlidePlans />}
            {slideId === "value" && <SlideValue />}
            {slideId === "cta" && <SlideCTA onStart={handleCTA} />}
          </div>
        </div>

        {/* Nav arrows */}
        {current > 0 && (
          <button
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
            style={{ 
              background: "#FAF5EF", 
              border: "1.5px solid #C8A66A40",
              boxShadow: "0 4px 12px rgba(91, 31, 61, 0.10)"
            }}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-6 h-6" style={{ color: "#5B1F3D" }} />
          </button>
        )}
        {current < total - 1 && (
          <button
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
            style={{ 
              background: "#FAF5EF", 
              border: "1.5px solid #C8A66A40",
              boxShadow: "0 4px 12px rgba(91, 31, 61, 0.10)"
            }}
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-6 h-6" style={{ color: "#5B1F3D" }} />
          </button>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 py-4 md:py-6" style={{
        borderTop: "1px solid #C8A66A30",
        background: "rgba(250, 245, 239, 0.5)"
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 7,
              height: 7,
              background: i === current
                ? "#5B1F3D"
                : i < current
                ? "#C8A66A80"
                : "#DCCFC2",
              border: i === current ? "none" : "1px solid rgba(91, 31, 61, 0.10)"
            }}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ═══════════════ SLIDE COMPONENTS ═══════════════ */

const SlideTitle = ({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) => (
  <div className="text-center mb-8">
    {kicker && (
      <p className="text-[9px] font-heading tracking-[0.5em] uppercase mb-3" style={{ color: "#C8A66A" }}>
        {kicker}
      </p>
    )}
    <h2 className="font-heading text-2xl md:text-4xl tracking-wide leading-tight" style={{ color: "#5B1F3D" }}>
      {title}
    </h2>
    {subtitle && (
      <p className="font-body text-sm md:text-base italic mt-3 max-w-lg mx-auto leading-relaxed" style={{ color: "#5B1F3D", opacity: 0.7 }}>
        {subtitle}
      </p>
    )}
  </div>
);

const SlideCover = () => (
  <div className="text-center space-y-6">
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="w-16 h-px" style={{ background: "linear-gradient(to right, transparent, #C8A66A80)" }} />
      <span className="text-lg" style={{ color: "#C8A66A" }}>✦</span>
      <div className="w-16 h-px" style={{ background: "linear-gradient(to left, transparent, #C8A66A80)" }} />
    </div>
    <h1 className="font-heading text-4xl md:text-6xl tracking-wide leading-tight" style={{ color: "#5B1F3D" }}>
      Tarô 78 Chaves
    </h1>
    <p className="font-body text-lg md:text-xl italic leading-relaxed max-w-md mx-auto" style={{ color: "#5B1F3D", opacity: 0.7 }}>
      Aprenda Tarô como uma jornada — arcano por arcano, com lições curtas, quizzes, XP e progresso real.
    </p>
    <div className="flex items-center justify-center gap-8 pt-4">
      {[
        { v: "78", l: "Arcanos" },
        { v: "16", l: "Módulos" },
        { v: "5", l: "Camadas" },
        { v: "RWS", l: "Tradição" },
      ].map(s => (
        <div key={s.l} className="text-center">
          <div className="font-heading text-xl md:text-2xl" style={{ color: "#5B1F3D" }}>{s.v}</div>
          <div className="text-[10px] tracking-[0.3em] uppercase font-heading mt-1 font-black" style={{ color: "#5B1F3D", opacity: 0.9 }}>{s.l}</div>
        </div>
      ))}
    </div>
  </div>
);

const SlideProblem = () => (
  <div>
    <SlideTitle
      kicker="O Problema"
      title="O estudo do tarô está fragmentado"
      subtitle="Quem busca aprender tarô com seriedade encontra um cenário disperso e frustrante."
    />
    <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
      {[
        "Conteúdo raso em redes sociais — listas de significados sem profundidade",
        "Livros densos sem método de fixação — leitura sem prática",
        "Cursos longos e caros que não respeitam o ritmo de quem estuda",
        "Falta de revisão — o que foi lido se perde em semanas",
        "Ausência de estrutura pedagógica — cada fonte diz algo diferente",
        "Nenhuma plataforma une profundidade, beleza e método em um só lugar",
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{
          background: "rgba(91, 31, 61, 0.04)",
          border: "1px solid rgba(91, 31, 61, 0.10)",
        }}>
          <X className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#5B1F3D", opacity: 0.5 }} />
          <span className="text-[12px] font-body leading-relaxed" style={{ color: "#5B1F3D", opacity: 0.85 }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const SlideSolution = () => (
  <div>
    <SlideTitle
      kicker="O Diferencial"
      title="Não é um app de tiragem automática"
      subtitle="O Tarô 78 Chaves é uma escola viva no seu bolso, focada no domínio real dos 78 arcanos."
    />
    <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
      {[
        { icon: BookOpen, title: "Tradição", desc: "Base Rider-Waite-Smith com leituras arquetípicas, psicológicas e esotéricas" },
        { icon: Layers, title: "Método", desc: "Pedagogia em 5 camadas — do essencial ao profundo, no seu ritmo" },
        { icon: Sparkles, title: "Experiência", desc: "Gamificação elegante, visual premium e uma jornada que respeita quem você é" },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="text-center p-5 rounded-xl" style={{
            background: "#FAF5EF",
            border: "1px solid #DCCFC2",
          }}>
            <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{
              background: "rgba(91, 31, 61, 0.06)",
              border: "1px solid rgba(91, 31, 61, 0.12)",
            }}>
              <Icon className="w-5 h-5" style={{ color: "#5B1F3D" }} />
            </div>
            <h3 className="font-heading text-sm tracking-wide mb-1" style={{ color: "#5B1F3D" }}>{item.title}</h3>
            <p className="text-[11px] font-body leading-relaxed" style={{ color: "#5B1F3D", opacity: 0.85 }}>{item.desc}</p>
          </div>
        );
      })}
    </div>
  </div>
);

const SlideMethod = () => (
  <div>
    <SlideTitle
      kicker="O Método"
      title="Cinco camadas de compreensão"
      subtitle="Cada arcano é estudado em profundidade progressiva — você escolhe até onde ir."
    />
    <div className="space-y-2 max-w-md mx-auto">
      {[
        { n: "01", label: "Essência", desc: "O coração vivo da carta — significado central, palavras-chave, arquétipo", color: "#5B1F3D" },
        { n: "02", label: "Luz & Sombra", desc: "Forças e desafios que cada arcano encarna — o que ativa e o que bloqueia", color: "#C8A66A" },
        { n: "03", label: "Simbolismo", desc: "Cada detalhe da imagem tem propósito — cores, objetos, posturas, paisagens", color: "#DCCFC2" },
        { n: "04", label: "Aplicações", desc: "Amor, trabalho, saúde, espiritualidade — a carta na vida real", color: "#E8DED3" },
        { n: "05", label: "Quiz & Prática", desc: "Exercícios e quizzes que integram o aprendizado no corpo e na mente", color: "#FAF5EF" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{
          background: "rgba(250, 245, 239, 0.7)",
          border: "1px solid #DCCFC2",
        }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{
            background: i === 4 ? "#5B1F3D10" : item.color,
            border: `1.5px solid ${i === 4 ? "#5B1F3D40" : "#C8A66A40"}`,
          }}>
            <span className="font-heading text-[11px] font-black" style={{ color: (i === 2 || i === 3 || i === 4) ? "#5B1F3D" : "#FAF5EF" }}>{item.n}</span>
          </div>
          <div>
            <h3 className="font-heading text-xs tracking-wide" style={{ color: "#5B1F3D" }}>{item.label}</h3>
            <p className="text-[10px] font-body leading-relaxed" style={{ color: "#5B1F3D", opacity: 0.85 }}>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SlideDifferentials = () => (
  <div>
    <SlideTitle
      kicker="Diferenciais"
      title="Por que esta jornada é diferente"
    />
    <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
      {[
        { icon: Eye, title: "Arcanos Vivos", desc: "As cartas aparecem em quizzes, desafios e revisões — você convive com elas, não apenas lê sobre elas." },
        { icon: Brain, title: "Memória Inteligente", desc: "Revisão espaçada e flashcards que fazem o conhecimento habitar você — não apenas passar por você." },
        { icon: Star, title: "Três Olhares", desc: "Cada carta é lida pelo prisma arquetípico, psicológico e esotérico — três verdades em uma." },
        { icon: Flame, title: "Ritual de Estudo", desc: "XP, streaks e conquistas transformam disciplina em prazer. Estudar vira um encontro diário consigo." },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{
            background: "rgba(250, 245, 239, 0.8)",
            border: "1px solid #DCCFC2",
          }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
              background: "rgba(91, 31, 61, 0.06)",
              border: "1px solid rgba(91, 31, 61, 0.12)",
            }}>
              <Icon className="w-4 h-4" style={{ color: "#5B1F3D" }} />
            </div>
            <div>
              <h3 className="font-heading text-[13px] tracking-wide" style={{ color: "#5B1F3D" }}>{item.title}</h3>
              <p className="text-[11px] font-body leading-relaxed mt-0.5" style={{ color: "#5B1F3D", opacity: 0.85 }}>{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const SlideInside = () => (
  <div>
    <SlideTitle
      kicker="Por Dentro"
      title="O que você encontra"
      subtitle="Uma formação completa com recursos que se complementam."
    />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
      {[
        "Lições em camadas",
        "Quizzes interativos",
        "Revisão Inteligente",
        "Cartas RWS Canônicas",
        "Desafios diários",
        "Rotina de estudo",
        "Biblioteca simbólica",
        "XP e conquistas",
        "Certificados",
        "Trilhas por nível",
        "Feedback nos Quizzes",
        "Painel de progresso",
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{
          background: "rgba(250, 245, 239, 0.7)",
          border: "1px solid #DCCFC2",
        }}>
          <Check className="w-3 h-3 shrink-0" style={{ color: "#14532D" }} />
          <span className="text-[11px] font-body" style={{ color: "#5B1F3D", fontWeight: "600" }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const SlideModules = () => (
  <div>
    <SlideTitle
      kicker="Conteúdo"
      title="Módulos progressivos de formação"
      subtitle="Do fundamento à prática — cada módulo constrói sobre o anterior."
    />
    <div className="grid md:grid-cols-2 gap-2 max-w-2xl mx-auto">
      {[
        { n: "01", name: "Fundamentos do Tarô", desc: "Estrutura, ética e história" },
        { n: "02", name: "Leitura Simbólica", desc: "O método visual de interpretação" },
        { n: "03", name: "Arcanos Maiores", desc: "Os 22 portais da alma" },
        { n: "04", name: "Arquitetura dos Menores", desc: "Elementos e lógica numérica" },
        { n: "05", name: "Naipes de Ação e Emoção", desc: "Copas, Paus, Espadas e Ouros" },
        { n: "06", name: "Cartas da Corte", desc: "Pessoas, posturas e energias" },
        { n: "07", name: "Combinações", desc: "A arte da síntese de cartas" },
        { n: "08", name: "Tiragens e Métodos", desc: "Layouts clássicos e intuitivos" },
        { n: "09", name: "Leitura Aplicada", desc: "Amor, trabalho e espiritualidade" },
        { n: "10", name: "Prática Profissional", desc: "Ética, mesa e atendimento" },
      ].map((mod, i) => (
        <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl" style={{
          background: "rgba(250, 245, 239, 0.7)",
          border: "1px solid #DCCFC2",
        }}>
          <span className="font-heading text-[10px] tracking-wider w-6 shrink-0" style={{ color: "#C8A66A", fontWeight: "bold" }}>{mod.n}</span>
          <div>
            <h3 className="font-heading text-[12px] tracking-wide" style={{ color: "#5B1F3D" }}>{mod.name}</h3>
            <p className="text-[10px] font-body italic" style={{ color: "#5B1F3D", opacity: 0.6 }}>{mod.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SlideJourney = () => (
  <div>
    <SlideTitle
      kicker="A Jornada"
      title="Do Louco ao Mundo"
      subtitle="Você percorre os 22 Arcanos Maiores como etapas de uma transformação interior."
    />
    <div className="grid grid-cols-6 md:grid-cols-11 gap-1.5 md:gap-2 max-w-3xl mx-auto overflow-y-auto max-h-[45vh] md:max-h-none py-2 px-1">
      {[
        "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador",
        "O Hierofante", "Os Enamorados", "O Carro", "A Força", "O Eremita",
        "A Roda da Fortuna", "A Justiça", "O Enforcado", "A Morte", "A Temperança",
        "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol",
        "O Julgamento", "O Mundo",
      ].map((name, i) => (
        <div key={i} className="flex flex-col items-center">
          <TarotAnimatedCard
            cardImage={getArcanoFull(i)?.cardImage || ""}
            cardName={name}
            arcanoId={i}
            arcanoSlug={name.toLowerCase().replace(/ /g, "-")}
            state={i === 0 ? "available" : "locked"}
            variant="portal"
            className="w-full scale-100 md:scale-95"
          />
          <span className="text-[6px] md:text-[8px] font-heading font-black mt-1 text-[#5B1F3D60] uppercase tracking-tighter text-center leading-none">
            {i === 10 ? "Roda" : name.split(" ").pop()}
          </span>
        </div>
      ))}
    </div>
    <p className="text-center text-[10px] font-body italic mt-4" style={{ color: "#5B1F3D", opacity: 0.7 }}>
      Cada carta com 5 camadas de significado · Três leituras · Quiz e prática
    </p>
  </div>
);

const SlidePlans = () => (
  <div>
    <SlideTitle
      kicker="Planos"
      title="Gratuito e Premium"
      subtitle="Comece sem custo. Aprofunde quando quiser."
    />
    <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">
      {/* Free */}
      <div className="rounded-xl p-5 space-y-3" style={{
        background: "rgba(250, 245, 239, 0.8)",
        border: "1px solid #DCCFC2",
      }}>
        <div className="text-center pb-2" style={{ borderBottom: "1px solid rgba(220, 207, 194, 0.4)" }}>
          <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "#5B1F3D", opacity: 0.6 }}>Acesso Básico</p>
          <p className="font-heading text-xl mt-1" style={{ color: "#5B1F3D" }}>Gratuito</p>
        </div>
        {["Onboarding iniciático", "Fundamentos do Tarô", "O Louco completo", "Desafios diários", "Quizzes e XP"].map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Check className="w-3 h-3 shrink-0" style={{ color: "#14532D" }} />
            <span className="text-[11px] font-body" style={{ color: "#5B1F3D", opacity: 0.85 }}>{f}</span>
          </div>
        ))}
      </div>
      {/* Premium */}
      <div className="rounded-xl p-5 space-y-3 relative" style={{
        background: "linear-gradient(170deg, #FAF5EF, rgba(91, 31, 61, 0.03))",
        border: "1.5px solid #C8A66A",
        boxShadow: "0 6px 30px rgba(91, 31, 61, 0.05)",
      }}>
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="text-[8px] font-heading tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full" style={{
            background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            color: "#FAF5EF",
          }}>✦ Premium</span>
        </div>
        <div className="text-center pb-2" style={{ borderBottom: "1px solid rgba(200, 166, 106, 0.18)" }}>
          <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "#5B1F3D" }}>Jornada Completa</p>
          <div className="flex items-center justify-center gap-2 mt-1">
             <div className="text-center">
               <p className="text-[9px] uppercase font-bold text-[#C8A66A]">Mensal</p>
               <p className="font-heading text-lg" style={{ color: "#5B1F3D" }}>R$ 29,90</p>
             </div>
             <div className="w-px h-6 bg-[#C8A66A40]" />
             <div className="text-center">
               <p className="text-[9px] uppercase font-bold text-[#C8A66A]">Anual</p>
               <p className="font-heading text-lg" style={{ color: "#5B1F3D" }}>R$ 197</p>
             </div>
          </div>
        </div>
        {["78 arcanos guiados", "Todos os módulos liberados", "Certificados de conclusão", "Tiragens e Combinações", "Mesa de Tarô e Ética"].map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 shrink-0" style={{ color: "#C8A66A" }} />
            <span className="text-[11px] font-body" style={{ color: "#5B1F3D", fontWeight: "600" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SlideValue = () => (
  <div className="text-center space-y-6">
    <span className="text-2xl block" style={{ color: "#C8A66A40" }}>✦</span>
    <blockquote className="font-body text-xl md:text-2xl italic leading-relaxed max-w-lg mx-auto" style={{ color: "#5B1F3D", fontWeight: "600" }}>
      "As cartas não preveem o futuro — elas iluminam o que já existe dentro de você."
    </blockquote>
    <div className="w-12 h-px mx-auto" style={{ background: "#C8A66A40" }} />
    <p className="font-body text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#5B1F3D", opacity: 0.85 }}>
      A Jornada do Louco não é mais um curso. É uma formação que une tradição milenar, pedagogia estruturada e uma experiência visual que faz jus à profundidade do que ensina. Cada detalhe foi pensado para que o estudo seja tão transformador quanto o próprio tarô.
    </p>
  </div>
);

const SlideCTA = ({ onStart }: { onStart: () => void }) => (
  <div className="text-center space-y-6">
    <span className="text-xl block" style={{ color: "#C8A66A30" }}>✧</span>
    <h2 className="font-heading text-3xl md:text-4xl tracking-wide" style={{ color: "#5B1F3D" }}>
      Sua jornada começa agora
    </h2>
    <p className="font-body text-base italic leading-relaxed max-w-sm mx-auto" style={{ color: "#5B1F3D", opacity: 0.75 }}>
      O Louco salta sem saber o destino — mas confiando na jornada. Você não precisa saber tudo. Só precisa começar.
    </p>
    <button
      onClick={onStart}
      className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-heading text-sm tracking-wide transition-all hover:scale-105"
      style={{
        background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
        color: "#FAF5EF",
        boxShadow: "0 6px 24px rgba(91, 31, 61, 0.18)",
      }}
    >
      <Sparkles className="w-4 h-4" />
      Iniciar Minha Jornada
      <ArrowRight className="w-4 h-4" />
    </button>
    <p className="text-[10px] font-body font-black" style={{ color: "#5B1F3D", opacity: 0.9 }}>
      Comece gratuitamente · No seu ritmo · Sem renovação automática no anual
    </p>
  </div>
);

export default PresentationPage;