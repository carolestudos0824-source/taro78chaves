import { Smartphone, MoreVertical, Share } from "lucide-react";

export const PWAInstructions = () => {
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-white/50 to-white/20 border-y border-gold/15 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-dark font-heading text-[11px] md:text-xs tracking-[0.25em] uppercase font-bold">
            <Smartphone className="w-3.5 h-3.5" />
            Acesso Rápido
          </div>
          <h2 className="font-heading text-[2.5rem] md:text-5xl text-plum font-black leading-tight">Use como aplicativo no celular</h2>
          <p className="font-body text-lg md:text-xl text-midnight/85 max-w-3xl mx-auto leading-relaxed">
            A Escola Digital Tarô 78 Chaves funciona online, pelo navegador do celular, tablet ou computador.
          </p>
          <p className="font-body text-base md:text-lg text-midnight/75 max-w-3xl mx-auto leading-relaxed">
            No celular, você pode salvar o acesso na tela inicial, como um aplicativo. Assim, basta tocar no ícone do Tarô 78 Chaves para entrar na sua área de estudos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card Android */}
          <div className="p-7 md:p-10 rounded-[2.5rem] bg-white border border-gold/20 shadow-[0_20px_60px_-30px_rgba(91,31,61,0.3)] space-y-7 transition-all hover:shadow-[0_30px_70px_-25px_rgba(91,31,61,0.4)] hover:-translate-y-1 hover:border-gold/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Smartphone className="w-24 h-24 text-midnight" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center border border-emerald-200/60 shadow-sm">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-heading text-[1.6rem] md:text-3xl text-plum font-black">Android</h3>
            </div>

            <ul className="space-y-5">
              {[
                "Abra pelo Chrome.",
                "Toque nos três pontinhos.",
                "Escolha “Adicionar à tela inicial” ou “Instalar app”.",
                "Confirme o nome Tarô 78 Chaves."
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-heading font-black text-gold-dark">{idx + 1}</span>
                  </div>
                  <span className="text-[15px] md:text-lg text-midnight/90 font-medium leading-snug">{step}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex items-center gap-2 text-gold-dark font-heading text-[11px] tracking-widest uppercase font-bold">
              <MoreVertical className="w-4 h-4" />
              Chrome: Menu de Opções
            </div>
          </div>

          {/* Card iPhone */}
          <div className="p-7 md:p-10 rounded-[2.5rem] bg-white border border-gold/20 shadow-[0_20px_60px_-30px_rgba(91,31,61,0.3)] space-y-7 transition-all hover:shadow-[0_30px_70px_-25px_rgba(91,31,61,0.4)] hover:-translate-y-1 hover:border-gold/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Smartphone className="w-24 h-24 text-midnight" />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl flex items-center justify-center border border-blue-200/60 shadow-sm">
                <span className="text-2xl">🍎</span>
              </div>
              <h3 className="font-heading text-[1.6rem] md:text-3xl text-plum font-black">iPhone</h3>
            </div>

            <ul className="space-y-5">
              {[
                "Abra pelo Safari.",
                "Toque no botão de compartilhar.",
                "Escolha “Adicionar à Tela de Início”.",
                "Confirme o nome Tarô 78 Chaves."
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-heading font-black text-gold-dark">{idx + 1}</span>
                  </div>
                  <span className="text-[15px] md:text-lg text-midnight/90 font-medium leading-snug">{step}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex items-center gap-2 text-gold-dark font-heading text-[11px] tracking-widest uppercase font-bold">
              <Share className="w-4 h-4" />
              Safari: Botão Compartilhar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
