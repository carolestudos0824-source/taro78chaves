import { Smartphone, MoreVertical, Share, Check } from "lucide-react";

export const PWAInstructions = () => {
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-white/50 to-white/20 border-y border-gold/15 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-dark font-heading text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold">
            <Smartphone className="w-3.5 h-3.5" />
            Acesso Rápido
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-plum font-black">Use como aplicativo no celular</h2>
          <p className="font-body text-lg md:text-xl text-midnight/75 max-w-3xl mx-auto leading-relaxed">
            A Escola Digital Tarô 78 Chaves funciona online, pelo navegador do celular, tablet ou computador.
          </p>
          <p className="font-body text-base md:text-lg text-midnight/65 max-w-3xl mx-auto leading-relaxed">
            No celular, você pode salvar o acesso na tela inicial, como um aplicativo. Assim, basta tocar no ícone do Tarô 78 Chaves para entrar na sua área de estudos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card Android */}
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-gold/10 shadow-sm space-y-8 transition-all hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Smartphone className="w-24 h-24 text-midnight" />
            </div>
            
            <div className="space-y-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-heading text-2xl text-midnight">Android</h3>
            </div>

            <ul className="space-y-4">
              {[
                "Abra pelo Chrome.",
                "Toque nos três pontinhos.",
                "Escolha “Adicionar à tela inicial” ou “Instalar app”.",
                "Confirme o nome Tarô 78 Chaves."
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-[10px] font-heading font-black text-gold-dark">{idx + 1}</span>
                  </div>
                  <span className="text-base md:text-lg text-midnight/80 font-medium leading-snug">{step}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex items-center gap-2 text-gold-dark font-heading text-[10px] tracking-widest uppercase font-bold">
              <MoreVertical className="w-4 h-4" />
              Chrome: Menu de Opções
            </div>
          </div>

          {/* Card iPhone */}
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-gold/10 shadow-sm space-y-8 transition-all hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Smartphone className="w-24 h-24 text-midnight" />
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                <span className="text-2xl">🍎</span>
              </div>
              <h3 className="font-heading text-2xl text-midnight">iPhone</h3>
            </div>

            <ul className="space-y-4">
              {[
                "Abra pelo Safari.",
                "Toque no botão de compartilhar.",
                "Escolha “Adicionar à Tela de Início”.",
                "Confirme o nome Tarô 78 Chaves."
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-[10px] font-heading font-black text-gold-dark">{idx + 1}</span>
                  </div>
                  <span className="text-base md:text-lg text-midnight/80 font-medium leading-snug">{step}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex items-center gap-2 text-gold-dark font-heading text-[10px] tracking-widest uppercase font-bold">
              <Share className="w-4 h-4" />
              Safari: Botão Compartilhar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
