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
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-base sm:text-lg tracking-wider">{title}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-xs text-muted-foreground mb-6">Última atualização: {updatedAt}</p>
        <article className="prose prose-sm sm:prose-base max-w-none prose-headings:font-heading prose-headings:tracking-wide prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-p:leading-relaxed prose-p:text-foreground/85 prose-li:text-foreground/85 prose-strong:text-foreground">
          {children}
        </article>

        <nav className="mt-12 pt-6 border-t border-border/40 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <a href="https://taro78chaves.lovable.app/privacidade" className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline">Privacidade</a>
          <a href="https://taro78chaves.lovable.app/termos" className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline">Termos</a>
          <a href="https://taro78chaves.lovable.app/suporte" className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline">Suporte</a>
          <a href="https://taro78chaves.lovable.app/excluir-conta" className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline">Excluir conta</a>
          <Link to="/" className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline ml-auto">Início</Link>
        </nav>
      </main>
    </div>
  );
};

export default LegalLayout;