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
        "relative w-full aspect-[1.414/1] bg-[#FDFBF7] shadow-2xl flex flex-col items-center justify-between p-10 sm:p-14 overflow-hidden border-[12px] border-ivory",
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
      <div className="relative z-10 text-center space-y-3">
        {/* Logo Tarô 78 Chaves - Refinada e compacta */}
        <div className="flex flex-col items-center mb-1">
          <img 
            src="https://qtbkvshbmqlszncxlcuc.supabase.co/storage/v1/object/public/dsl-uploads/FKxI2UX5GWafusX2CZ1rulDlY5n1/3bcbd5aa-d679-42a1-ba4f-ead1fd91995e.png" 
            alt="Logo Tarô 78 Chaves" 
            className="h-24 sm:h-28 w-auto object-contain mix-blend-multiply opacity-80"
          />
        </div>

        <div className="space-y-1">
          <p className="font-heading text-gold-dark/60 tracking-[0.5em] text-[9px] uppercase">
            Escola Digital
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl text-plum tracking-[0.1em] font-black uppercase">
            Certificado de Conclusão
          </h1>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-gold/30" />
          <div className="text-plum/80 space-y-0.5">
            <h2 className="font-heading text-lg sm:text-xl tracking-wide uppercase">Tarô 78 Chaves</h2>
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
      <div className="relative z-10 w-full grid grid-cols-3 gap-4 pt-8 border-t border-gold/30 items-end mt-4">
        {/* Lado Esquerdo: Validação */}
        <div className="text-left space-y-4">
          <div className="space-y-0.5">
            <p className="font-heading text-[9px] tracking-[0.2em] text-gold-dark font-bold uppercase">Data de emissão</p>
            <p className="font-body text-[13px] text-plum font-bold">{issueDate}</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-heading text-[9px] tracking-[0.2em] text-gold-dark font-bold uppercase">Código de validação</p>
            <p className="font-body text-[12px] text-plum font-bold tracking-widest">{validationCode}</p>
          </div>
        </div>

        {/* Centro: Link de Validação */}
        <div className="text-center flex flex-col items-center justify-center pb-1">
          <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center mb-3">
            <div className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-[9px] text-gold-dark font-heading">
              T78
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="font-heading text-[9px] tracking-[0.2em] text-gold-dark font-bold uppercase">Validar em</p>
            <p className="font-body text-[12px] text-plum font-bold border-b border-plum/20">
              /validar-certificado
            </p>
          </div>
        </div>

        {/* Lado Direito: Emissor */}
        <div className="text-right space-y-1">
          <p className="font-accent italic text-plum/60 text-xs">Emitido por</p>
          <div className="space-y-0">
            <p className="font-heading text-xl text-plum tracking-widest font-black uppercase leading-tight">Lua de Kaya</p>
            <p className="font-body text-[12px] text-plum font-bold mt-1">CNPJ 44.472.530/0001-08</p>
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