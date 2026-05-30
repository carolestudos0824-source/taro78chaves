import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}

const LegalLayout = ({ title, updatedAt = "Abril de 2026", children }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-card/30 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#5B1F3D]/70 hover:text-[#5B1F3D] transition-colors" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-base sm:text-lg tracking-wider">{title}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-xs text-[#5B1F3D]/60 mb-6">Última atualização: {updatedAt}</p>
        <article className="prose prose-sm sm:prose-base max-w-none prose-headings:font-heading prose-headings:tracking-wide prose-headings:text-[#5B1F3D] prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-p:leading-relaxed prose-p:text-[#5B1F3D] prose-li:text-[#5B1F3D] prose-strong:text-[#5B1F3D] font-body font-medium">
          {children}
        </article>

        <nav className="mt-12 pt-6 border-t border-border/40 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link to="/privacidade" className="text-[#5B1F3D]/70 hover:text-[#5B1F3D] underline-offset-2 hover:underline">Privacidade</Link>
          <Link to="/termos" className="text-[#5B1F3D]/70 hover:text-[#5B1F3D] underline-offset-2 hover:underline">Termos</Link>
          <Link to="/suporte" className="text-[#5B1F3D]/70 hover:text-[#5B1F3D] underline-offset-2 hover:underline">Suporte</Link>
          <Link to="/excluir-conta" className="text-[#5B1F3D]/70 hover:text-[#5B1F3D] underline-offset-2 hover:underline">Excluir conta</Link>
          <Link to="/" className="text-[#5B1F3D]/70 hover:text-[#5B1F3D] underline-offset-2 hover:underline ml-auto">Início</Link>
        </nav>
        <div className="mt-8 pt-8 border-t border-border/20 text-center">
          <p className="text-[10px] text-[#5B1F3D]/60 font-body tracking-wider space-y-1">
            <span className="block">© 2026 Tarô 78 Chaves</span>
            <span className="block">Uma escola digital da Lua de Kaya</span>
            <span className="block font-bold">CNPJ 44.472.530/0001-08</span>
            <span className="block">Todos os direitos reservados.</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LegalLayout;