import LegalLayout from "@/components/LegalLayout";
import { businessInfo } from "@/config/business";

const SupportPage = () => (
  <LegalLayout title="Suporte">
    <p>
      Estamos aqui para ajudar. Para qualquer dúvida sobre o <strong>{businessInfo.productName}</strong>,
      escreva para <strong><a href={`mailto:${businessInfo.supportEmail}`}>{businessInfo.supportEmail}</a></strong>.
      Respondemos em até 3 dias úteis.
    </p>

    <div className="bg-plum/5 p-6 rounded-2xl border border-plum/10 my-8">
      <p className="text-sm text-plum font-bold mb-2">Dados Institucionais:</p>
      <p className="text-xs text-plum/70">
        Produto: {businessInfo.productName}<br />
        Empresa responsável: {businessInfo.companyName}<br />
        CNPJ: {businessInfo.cnpj}<br />
        E-mail: {businessInfo.supportEmail}
      </p>
    </div>

    <h2>Dúvidas sobre Compra e Acesso</h2>
    <p>
      Para dúvidas sobre acesso, compra, login, conteúdo ou suporte técnico, entre em contato pelo e-mail <strong>{businessInfo.supportEmail}</strong>.
    </p>

    <h2>Login e acesso</h2>
    <ul>
      <li>Esqueceu a senha? Use “Esqueci minha senha” na tela de login.</li>
      <li>Não recebeu o e-mail? Verifique a caixa de spam e o endereço digitado.</li>
      <li>Conta bloqueada? Escreva para o suporte com o e-mail cadastrado.</li>
    </ul>

    <h2>Acesso Comprado</h2>
    <ul>
      <li>Comprou na Hotmart mas não desbloqueou? Verifique se está usando o mesmo e-mail da compra.</li>
      <li>A liberação é automática assim que a Hotmart confirma o pagamento.</li>
    </ul>

    <h2>Exclusão de conta</h2>
    <p>
      Veja a página <a href="/excluir-conta">Excluir conta</a> para o passo a passo.
    </p>

    <h2>Problemas técnicos</h2>
    <ul>
      <li>Atualize a página para a versão mais recente.</li>
      <li>Limpe o cache do navegador.</li>
      <li>Se o erro persistir, envie um e-mail descrevendo o que aconteceu, com prints se possível.</li>
    </ul>
  </LegalLayout>
);

export default SupportPage;
