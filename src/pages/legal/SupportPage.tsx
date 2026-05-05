import LegalLayout from "@/components/LegalLayout";

const SUPPORT_EMAIL = "suporte@taro78chaves.com.br";

const SupportPage = () => (
  <LegalLayout title="Suporte">
    <p>
      Estamos aqui para ajudar. Para qualquer dúvida sobre o <strong>Tarô 78 Chaves</strong>,
      escreva para <strong><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></strong>.
      Respondemos em até 3 dias úteis.
    </p>

    <h2>Login e acesso</h2>
    <ul>
      <li>Esqueceu a senha? Use “Esqueci minha senha” na tela de login.</li>
      <li>Não recebeu o e-mail? Verifique a caixa de spam e o domínio digitado.</li>
      <li>Conta bloqueada? Escreva para o suporte com o e-mail cadastrado.</li>
    </ul>

    <h2>Acesso Premium</h2>
    <ul>
      <li>Comprou no site mas não desbloqueou? Aguarde alguns minutos e atualize o app.</li>
      <li><strong>Plano Mensal:</strong> Use o portal do assinante (na tela de Perfil) para gerenciar pagamento, nota fiscal ou cancelar a renovação.</li>
      <li><strong>Plano Anual:</strong> Por ser um pagamento único sem renovação automática, não requer cancelamento. Seu acesso será válido por 12 meses.</li>
    </ul>

    <h2>Cancelamento (Plano Mensal)</h2>
    <p>
      O cancelamento da recorrência pode ser feito no portal do assinante. O acesso premium permanece
      até o fim do período mensal pago.
    </p>

    <h2>Exclusão de conta</h2>
    <p>
      Veja a página <a href="/excluir-conta">/excluir-conta</a> para o passo a passo.
    </p>

    <h2>Problemas técnicos</h2>
    <ul>
      <li>Atualize a página/app para a versão mais recente.</li>
      <li>Limpe o cache do navegador.</li>
      <li>Se o erro persistir, envie um e-mail descrevendo o que aconteceu, com prints se possível.</li>
    </ul>
  </LegalLayout>
);

export default SupportPage;
