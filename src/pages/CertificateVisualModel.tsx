import React from "react";
import PremiumCertificate from "@/components/PremiumCertificate";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CertificateVisualModel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-plum/60 hover:text-plum transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm">Voltar</span>
        </button>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-gold/30 text-plum hover:bg-gold/5">
            <Download className="w-4 h-4" />
            Simular PDF
          </Button>
          <Button className="gap-2 bg-plum hover:bg-plum/90 text-ivory">
            <FileCheck className="w-4 h-4" />
            Aprovar Visual
          </Button>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-2xl text-plum">Modelo Visual Real</h2>
          <p className="font-body text-plum/60 italic">
            Visualização institucional do certificado de conclusão da Escola Digital Tarô 78 Chaves.
          </p>
        </div>

        {/* Desktop Preview */}
        <div className="bg-white rounded-[2rem] p-4 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gold/10 overflow-x-auto">
          <div className="min-w-[800px]">
            <PremiumCertificate 
              studentName="MARIA CLARA DE SOUZA"
              issueDate={new Date().toLocaleDateString("pt-BR")}
              validationCode="T78-A4B7-9K2P"
            />
          </div>
        </div>

        {/* Technical Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-ivory/50 rounded-2xl p-6 border border-gold/10">
            <h3 className="font-heading text-sm text-gold-dark tracking-widest uppercase mb-4">Critérios de Impressão</h3>
            <ul className="space-y-3 font-body text-sm text-plum/70">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                <span>Formato A4 Paisagem (proporção 1.414:1)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                <span>Fontes: Cinzel (Títulos) e Lora (Corpo)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                <span>Fundo: Ivory (#FDFBF7) com gradientes sutis</span>
              </li>
            </ul>
          </div>

          <div className="bg-ivory/50 rounded-2xl p-6 border border-gold/10">
            <h3 className="font-heading text-sm text-gold-dark tracking-widest uppercase mb-4">Elementos de Validação</h3>
            <ul className="space-y-3 font-body text-sm text-plum/70">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                <span>Código único T78-XXXX-XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                <span>Link para /validar-certificado no rodapé</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                <span>CNPJ da Lua de Kaya visível como emissora</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateVisualModel;