import React from "react";
import { cn } from "@/lib/utils";

interface PremiumCertificateProps {
  studentName: string;
  issueDate?: string;
  validationCode?: string;
  className?: string;
}

const PremiumCertificate: React.FC<PremiumCertificateProps> = ({
  studentName = "MARIA CLARA DE SOUZA",
  issueDate = "29/05/2026",
  validationCode = "T78-A4F7-9K2P",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative w-full aspect-[1.414/1] bg-[#FDFBF7] shadow-2xl flex flex-col items-center justify-between p-10 sm:p-16 overflow-hidden border-[12px] border-ivory",
        className
      )}
      style={{
        backgroundImage: "radial-gradient(circle at center, transparent 0%, rgba(212, 175, 55, 0.02) 100%)",
      }}
    >
      {/* Moldura Interna - Linha Fina */}
      <div className="absolute inset-4 border border-gold/20 pointer-events-none" />
      <div className="absolute inset-6 border border-gold/10 pointer-events-none" />

      {/* Ornamentos de Canto */}
      <div className="absolute top-8 left-8 text-gold/30 text-2xl">✧</div>
      <div className="absolute top-8 right-8 text-gold/30 text-2xl">✧</div>
      <div className="absolute bottom-8 left-8 text-gold/30 text-2xl">✧</div>
      <div className="absolute bottom-8 right-8 text-gold/30 text-2xl">✧</div>

      {/* Marcas d'água sutis / Textura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
        <div className="text-[200px] font-heading">T78</div>
      </div>

      {/* Cabeçalho */}
      <div className="relative z-10 text-center space-y-4">
        <div className="space-y-1">
          <p className="font-heading text-gold-dark/60 tracking-[0.5em] text-[10px] uppercase">
            Escola Digital
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl text-plum tracking-[0.1em] font-black uppercase">
            Certificado de Conclusão
          </h1>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-gold/30" />
          <div className="text-plum/80 space-y-1">
            <h2 className="font-heading text-lg sm:text-xl tracking-wide">Tarô 78 Chaves</h2>
            <p className="font-accent italic text-sm text-plum/60">A jornada viva pelos 78 arcanos</p>
          </div>
          <div className="h-px w-12 bg-gold/30" />
        </div>
      </div>

      {/* Corpo do Certificado */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <p className="font-accent italic text-lg text-plum/70">Certificamos que</p>
          <h3 className="font-heading text-3xl sm:text-5xl text-plum tracking-tight border-b-2 border-gold/20 pb-4 inline-block px-8">
            {studentName}
          </h3>
        </div>

        <p className="font-body text-sm sm:text-base text-plum/70 leading-relaxed text-balance">
          concluiu a jornada formativa da Escola Digital Tarô 78 Chaves, com estudo guiado dos 78 arcanos, progressão pedagógica, lições estruturadas, quizzes e validação dentro da plataforma.
        </p>

        <p className="font-body text-xs sm:text-sm text-plum/60 max-w-lg mx-auto italic">
          Este certificado reconhece a conclusão da jornada de aprendizagem proposta pela Escola Digital Tarô 78 Chaves.
        </p>
      </div>

      {/* Rodapé / Emissor */}
      <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-gold/20 items-end">
        {/* Lado Esquerdo: Validação */}
        <div className="text-left space-y-4 order-2 sm:order-1">
          <div className="space-y-1">
            <p className="font-heading text-[10px] tracking-widest text-gold-dark/70 uppercase">Data de emissão</p>
            <p className="font-body text-sm text-plum font-bold">{issueDate}</p>
          </div>
          <div className="space-y-1">
            <p className="font-heading text-[10px] tracking-widest text-gold-dark/70 uppercase">Código de validação</p>
            <p className="font-body text-[11px] text-plum font-bold tracking-wider">{validationCode}</p>
          </div>
        </div>

        {/* Centro: Link de Validação */}
        <div className="text-center space-y-2 order-3 sm:order-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-[10px] text-gold-dark font-heading">
              LK
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-heading text-[9px] tracking-widest text-gold-dark/70 uppercase">Validar em</p>
            <p className="font-body text-[11px] text-plum font-medium underline underline-offset-4 decoration-gold/30">
              /validar-certificado
            </p>
          </div>
        </div>

        {/* Lado Direito: Emissor */}
        <div className="text-right space-y-3 order-1 sm:order-3">
          <div className="space-y-1">
            <p className="font-accent italic text-plum/60 text-xs">Emitido por</p>
            <p className="font-heading text-xl text-plum tracking-wide font-black uppercase leading-tight">Lua de Kaya</p>
            <p className="font-body text-[11px] text-plum/80 font-bold mt-1">CNPJ 44.472.530/0001-08</p>
          </div>
        </div>
      </div>
      
      {/* Brilho sutil */}
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

export default PremiumCertificate;