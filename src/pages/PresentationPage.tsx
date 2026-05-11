import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Layers, Eye, Brain, Flame,
  BookOpen, Star, Crown, Sparkles, ArrowRight, Heart,
  Compass, Award, Library, Check, X,
} from "lucide-react";
import { TarotAnimatedCard } from "@/components/tarot-motion/TarotAnimatedCard";
import { getArcanoFull } from "@/lib/content";

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

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none"
      style={{ background: "hsl(36 33% 97%)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4" style={{
        borderBottom: "1px solid hsl(36 45% 58% / 0.20)",
        background: "hsl(38 28% 95% / 0.98)",
        backdropFilter: "blur(12px)",
      }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[11px] font-heading tracking-[0.2em] uppercase font-bold transition-colors hover:text-gold-dark" style={{ color: "hsl(340 42% 28%)" }}>
          <ChevronLeft className="w-3.5 h-3.5" />
          Voltar
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-gold-dark opacity-60" />
          <span className="text-[11px] font-heading tracking-[0.3em] uppercase font-bold" style={{ color: "hsl(340 42% 20%)" }}>
            A Jornada do Louco
          </span>
          <Sparkles className="w-3 h-3 text-gold-dark opacity-60" />
        </div>
        <span className="text-[11px] font-heading tracking-widest font-black tabular-nums" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
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
            {slideId === "cta" && <SlideCTA onStart={() => navigate("/auth")} />}
          </div>
        </div>

        {/* Nav arrows */}
        {current > 0 && (
          <button
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "hsl(36 45% 58% / 0.10)", border: "1px solid hsl(36 45% 58% / 0.20)" }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: "hsl(340 42% 28%)" }} />
          </button>
        )}
        {current < total - 1 && (
          <button
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "hsl(36 45% 58% / 0.10)", border: "1px solid hsl(36 45% 58% / 0.20)" }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: "hsl(340 42% 28%)" }} />
          </button>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-3" style={{
        borderTop: "1px solid hsl(36 25% 82% / 0.40)",
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 5,
              height: 5,
              background: i === current
                ? "hsl(340 42% 28%)"
                : i < current
                ? "hsl(36 45% 58% / 0.50)"
                : "hsl(36 25% 82% / 0.60)",
            }}
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
      <p className="text-[9px] font-heading tracking-[0.5em] uppercase mb-3" style={{ color: "hsl(36 45% 50%)" }}>
        {kicker}
      </p>
    )}
    <h2 className="font-heading text-2xl md:text-4xl tracking-wide leading-tight" style={{
      background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {title}
    </h2>
    {subtitle && (
      <p className="font-accent text-sm md:text-base italic mt-3 max-w-lg mx-auto leading-relaxed" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
        {subtitle}
      </p>
    )}
  </div>
);

const SlideCover = () => (
  <div className="text-center space-y-6">
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="w-16 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
      <span className="text-lg" style={{ color: "hsl(36 45% 58% / 0.40)" }}>✦</span>
      <div className="w-16 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
    </div>
    <h1 className="font-heading text-4xl md:text-6xl tracking-wide leading-tight" style={{
      background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      Tarô 78 Chaves
    </h1>
    <p className="font-accent text-lg md:text-xl italic leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
      Aprenda Tarô como uma jornada — arcano por arcano, com lições curtas, quizzes, XP e progresso real.
    </p>
    <div className="flex items-center justify-center gap-8 pt-4">
      {[
        { v: "78", l: "Arcanos" },
        { v: "10", l: "Módulos" },
        { v: "5", l: "Camadas" },
        { v: "RWS", l: "Tradição" },
      ].map(s => (
        <div key={s.l} className="text-center">
          <div className="font-heading text-xl md:text-2xl" style={{ color: "hsl(340 42% 22%)" }}>{s.v}</div>
          <div className="text-[8px] tracking-[0.3em] uppercase font-heading mt-0.5" style={{ color: "hsl(230 15% 30% / 0.40)" }}>{s.l}</div>
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
          background: "hsl(340 42% 28% / 0.04)",
          border: "1px solid hsl(340 42% 28% / 0.10)",
        }}>
          <X className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "hsl(340 42% 35% / 0.50)" }} />
          <span className="text-[12px] font-body leading-relaxed" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{item}</span>
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
            background: "hsl(38 28% 95% / 0.80)",
            border: "1px solid hsl(36 25% 82% / 0.60)",
          }}>
            <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{
              background: "hsl(340 42% 28% / 0.06)",
              border: "1px solid hsl(340 42% 28% / 0.12)",
            }}>
              <Icon className="w-5 h-5" style={{ color: "hsl(340 42% 26%)" }} />
            </div>
            <h3 className="font-heading text-sm tracking-wide mb-1" style={{ color: "hsl(340 42% 20%)" }}>{item.title}</h3>
            <p className="text-[11px] font-body leading-relaxed" style={{ color: "hsl(230 15% 25% / 0.50)" }}>{item.desc}</p>
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
        { n: "01", label: "Essência", desc: "O coração vivo da carta — significado central, palavras-chave, arquétipo", color: "hsl(36 45% 50%)" },
        { n: "02", label: "Luz & Sombra", desc: "Forças e desafios que cada arcano encarna — o que ativa e o que bloqueia", color: "hsl(340 42% 30%)" },
        { n: "03", label: "Simbolismo", desc: "Cada detalhe da imagem tem propósito — cores, objetos, posturas, paisagens", color: "hsl(280 30% 35%)" },
        { n: "04", label: "Aplicações", desc: "Amor, trabalho, saúde, espiritualidade — a carta na vida real", color: "hsl(210 35% 40%)" },
        { n: "05", label: "Quiz & Prática", desc: "Exercícios e quizzes que integram o aprendizado no corpo e na mente", color: "hsl(140 35% 40%)" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{
          background: "hsl(38 28% 95% / 0.70)",
          border: "1px solid hsl(36 25% 82% / 0.50)",
        }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
            background: `${item.color}10`,
            border: `1.5px solid ${item.color}30`,
          }}>
            <span className="font-heading text-[10px] tracking-wider" style={{ color: item.color }}>{item.n}</span>
          </div>
          <div>
            <h3 className="font-heading text-xs tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>{item.label}</h3>
            <p className="text-[10px] font-body leading-relaxed" style={{ color: "hsl(230 15% 25% / 0.50)" }}>{item.desc}</p>
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
            background: "hsl(38 28% 95% / 0.80)",
            border: "1px solid hsl(36 25% 82% / 0.50)",
          }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
              background: "hsl(340 42% 28% / 0.06)",
              border: "1px solid hsl(340 42% 28% / 0.12)",
            }}>
              <Icon className="w-4 h-4" style={{ color: "hsl(340 42% 26%)" }} />
            </div>
            <div>
              <h3 className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(340 42% 20%)" }}>{item.title}</h3>
              <p className="text-[11px] font-body leading-relaxed mt-0.5" style={{ color: "hsl(230 15% 25% / 0.50)" }}>{item.desc}</p>
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
        "Revisão espaçada",
        "Flashcards",
        "Desafios diários",
        "Rotina de estudo",
        "Biblioteca simbólica",
        "XP e conquistas",
        "Certificados",
        "Trilhas por nível",
        "Feedback integrado",
        "Painel de progresso",
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{
          background: "hsl(38 28% 95% / 0.70)",
          border: "1px solid hsl(36 25% 82% / 0.50)",
        }}>
          <Check className="w-3 h-3 shrink-0" style={{ color: "hsl(140 35% 45%)" }} />
          <span className="text-[11px] font-body" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const SlideModules = () => (
  <div>
    <SlideTitle
      kicker="Conteúdo"
      title="10 módulos de formação"
      subtitle="Do fundamento à prática — cada módulo constrói sobre o anterior."
    />
    <div className="grid md:grid-cols-2 gap-2 max-w-2xl mx-auto">
      {[
        { n: "01", name: "Fundamentos do Tarô", desc: "História, estrutura e princípios" },
        { n: "02", name: "Arcanos Maiores", desc: "22 portais de sabedoria" },
        { n: "03", name: "Copas", desc: "Emoções, relacionamentos, intuição" },
        { n: "04", name: "Ouros", desc: "Matéria, trabalho, corpo" },
        { n: "05", name: "Espadas", desc: "Mente, conflito, verdade" },
        { n: "06", name: "Paus", desc: "Ação, criatividade, vontade" },
        { n: "07", name: "Combinações", desc: "A arte da leitura cruzada" },
        { n: "08", name: "Tiragens", desc: "Métodos clássicos e intuitivos" },
        { n: "09", name: "Tarô e Amor", desc: "Leituras do coração" },
        { n: "10", name: "Prática Guiada", desc: "Interpretação com feedback" },
      ].map((mod, i) => (
        <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl" style={{
          background: "hsl(38 28% 95% / 0.70)",
          border: "1px solid hsl(36 25% 82% / 0.50)",
        }}>
          <span className="font-heading text-[10px] tracking-wider w-6 shrink-0" style={{ color: "hsl(36 45% 50%)" }}>{mod.n}</span>
          <div>
            <h3 className="font-heading text-[12px] tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>{mod.name}</h3>
            <p className="text-[10px] font-accent italic" style={{ color: "hsl(230 15% 25% / 0.40)" }}>{mod.desc}</p>
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
    <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
      {[
        "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador",
        "O Hierofante", "Os Enamorados", "O Carro", "A Justiça", "O Eremita",
        "A Roda", "A Força", "O Enforcado", "A Morte", "A Temperança",
        "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol",
        "O Julgamento", "O Mundo",
      ].map((name, i) => (
        <TarotAnimatedCard
          key={i}
          cardImage={getArcanoFull(i)?.cardImage || ""}
          cardName={name}
          arcanoId={i}
          arcanoSlug={name.toLowerCase().replace(/ /g, "-")}
          state={i === 0 ? "available" : i === 1 ? "active" : "locked"}
          variant="portal"
          className="w-full scale-75 md:scale-90"
        />
      ))}
    </div>
    <p className="text-center text-[10px] font-accent italic mt-4" style={{ color: "hsl(230 15% 40% / 0.40)" }}>
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
        background: "hsl(38 28% 95% / 0.80)",
        border: "1px solid hsl(36 25% 82% / 0.60)",
      }}>
        <div className="text-center pb-2" style={{ borderBottom: "1px solid hsl(36 25% 82% / 0.40)" }}>
          <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(230 15% 40% / 0.50)" }}>Gratuito</p>
          <p className="font-heading text-xl mt-1" style={{ color: "hsl(230 25% 15%)" }}>R$ 0</p>
        </div>
        {["Onboarding iniciático", "Fundamentos do Tarô", "O Louco completo", "Desafios diários", "Quizzes e XP"].map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Check className="w-3 h-3 shrink-0" style={{ color: "hsl(140 35% 45%)" }} />
            <span className="text-[11px] font-body" style={{ color: "hsl(230 15% 25% / 0.55)" }}>{f}</span>
          </div>
        ))}
      </div>
      {/* Premium */}
      <div className="rounded-xl p-5 space-y-3 relative" style={{
        background: "linear-gradient(170deg, hsl(38 28% 95%), hsl(340 42% 28% / 0.03))",
        border: "1.5px solid hsl(36 45% 58% / 0.30)",
        boxShadow: "0 6px 30px hsl(340 42% 28% / 0.05)",
      }}>
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="text-[8px] font-heading tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full" style={{
            background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
            color: "hsl(36 33% 97%)",
          }}>✦ Completo</span>
        </div>
        <div className="text-center pb-2" style={{ borderBottom: "1px solid hsl(36 45% 58% / 0.18)" }}>
          <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28%)" }}>Jornada Completa</p>
          <p className="font-heading text-xl mt-1" style={{ color: "hsl(340 42% 20%)" }}>R$ 197</p>
        </div>
        {["78 arcanos em profundidade", "10 módulos completos", "Certificados", "Tiragens e Combinações", "Tarô e Amor"].map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 shrink-0" style={{ color: "hsl(36 45% 50%)" }} />
            <span className="text-[11px] font-body" style={{ color: "hsl(230 15% 25% / 0.60)" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SlideValue = () => (
  <div className="text-center space-y-6">
    <span className="text-2xl block" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>
    <blockquote className="font-accent text-xl md:text-2xl italic leading-relaxed max-w-lg mx-auto" style={{ color: "hsl(340 42% 20%)" }}>
      "As cartas não preveem o futuro — elas iluminam o que já existe dentro de você."
    </blockquote>
    <div className="w-12 h-px mx-auto" style={{ background: "hsl(36 45% 58% / 0.30)" }} />
    <p className="font-body text-sm leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
      A Jornada do Louco não é mais um curso. É uma formação que une tradição milenar, pedagogia estruturada e uma experiência visual que faz jus à profundidade do que ensina. Cada detalhe foi pensado para que o estudo seja tão transformador quanto o próprio tarô.
    </p>
  </div>
);

const SlideCTA = ({ onStart }: { onStart: () => void }) => (
  <div className="text-center space-y-6">
    <span className="text-xl block" style={{ color: "hsl(36 45% 58% / 0.25)" }}>✧</span>
    <h2 className="font-heading text-3xl md:text-4xl tracking-wide" style={{
      background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      Sua jornada começa agora
    </h2>
    <p className="font-accent text-base italic leading-relaxed max-w-sm mx-auto" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
      O Louco salta sem saber o destino — mas confiando na jornada. Você não precisa saber tudo. Só precisa começar.
    </p>
    <button
      onClick={onStart}
      className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-heading text-sm tracking-wide transition-all hover:scale-105"
      style={{
        background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
        color: "hsl(36 33% 97%)",
        boxShadow: "0 6px 24px hsl(340 42% 28% / 0.18)",
      }}
    >
      <Sparkles className="w-4 h-4" />
      Iniciar Minha Jornada
      <ArrowRight className="w-4 h-4" />
    </button>
    <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
      Comece gratuitamente · Sem compromisso · No seu ritmo
    </p>
  </div>
);

export default PresentationPage;
