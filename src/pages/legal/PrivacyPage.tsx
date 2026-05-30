import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { businessInfo } from "@/config/business";

const PrivacyPage = () => (
  <LegalLayout title="Política de Privacidade">
    <p>
      Esta Política de Privacidade descreve como a plataforma <strong>{businessInfo.productName}</strong>{" "}
      (“a plataforma”, “nós”) coleta, usa, armazena e protege informações pessoais dos usuários,
      em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
    </p>

    <h2>1. Quem somos</h2>
    <p>
      O {businessInfo.productName} é uma plataforma educacional dedicada ao estudo simbólico e
      arquetípico do Tarô, com base no Método Arcano Vivo. Empresa responsável: <strong>{businessInfo.companyName}</strong>, CNPJ <strong>{businessInfo.cnpj}</strong>. Para dúvidas sobre privacidade,
      entre em contato pelo e-mail <strong>{businessInfo.supportEmail}</strong>.
    </p>

    <h2>2. Dados que coletamos</h2>
    <ul>
      <li><strong>Cadastro:</strong> nome de exibição e e-mail.</li>
      <li><strong>Autenticação:</strong> credenciais geridas pelo nosso provedor de backend.</li>
      <li><strong>Progresso de estudo:</strong> lições concluídas, XP, conquistas, respostas de quizzes.</li>
      <li><strong>Uso da plataforma:</strong> eventos anônimos de navegação e interação.</li>
      <li><strong>Analytics:</strong> métricas agregadas via Google Analytics 4 (GA4).</li>
      <li><strong>Acesso premium:</strong> status, plano e validade.</li>
    </ul>
    <p>Não coletamos dados sensíveis (saúde, religião, biometria, etc.).</p>

    <h2>3. Finalidade do uso</h2>
    <ul>
      <li>Permitir login e manter a conta do usuário.</li>
      <li>Salvar e sincronizar o progresso entre dispositivos.</li>
      <li>Habilitar recursos premium para compradores.</li>
      <li>Melhorar a experiência educacional com base em métricas agregadas.</li>
      <li>Enviar comunicações operacionais (recuperação de senha, mudanças relevantes).</li>
    </ul>

    <h2>4. Provedores e compartilhamento</h2>
    <ul>
      <li><strong>Backend e autenticação:</strong> provedor de banco de dados na nuvem (com criptografia em trânsito e em repouso).</li>
      <li><strong>Pagamentos:</strong> Hotmart — processa transações de compra. Não armazenamos dados de cartão.</li>
      <li><strong>Analytics:</strong> Google Analytics 4 — métricas de uso agregadas e pseudonimizadas.</li>
    </ul>
    <p>
      Não vendemos seus dados. Compartilhamos somente o necessário para operação dos
      serviços acima.
    </p>

    <h2>5. Retenção</h2>
    <p>
      Mantemos os dados enquanto a conta estiver ativa. Após exclusão, removemos os
      dados pessoais em até 30 dias, exceto quando houver obrigação legal de retenção
      (ex.: registros fiscais de pagamento por até 5 anos).
    </p>

    <h2>6. Direitos do titular (LGPD)</h2>
    <ul>
      <li>Confirmação da existência de tratamento.</li>
      <li>Acesso, correção e portabilidade dos dados.</li>
      <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
      <li>Revogação do consentimento.</li>
    </ul>
    <p>Para exercer esses direitos, escreva para <strong>{businessInfo.supportEmail}</strong>.</p>

    <h2>7. Exclusão de conta</h2>
    <p>
      Você pode solicitar a exclusão da sua conta a qualquer momento pela página{" "}
      <Link to="/excluir-conta" className="underline font-bold">/excluir-conta</Link> ou por e-mail.
    </p>

    <h2>8. Segurança</h2>
    <p>
      Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados
      contra acesso não autorizado, alteração ou destruição: criptografia, controle
      de acesso por papéis (RLS) e auditoria de operações administrativas.
    </p>

    <h2>9. Crianças</h2>
    <p>
      A plataforma não é direcionado a menores de 13 anos. Se identificarmos uma conta dessa
      faixa etária, ela será excluída.
    </p>

    <h2>10. Alterações</h2>
    <p>
      Esta política pode ser atualizada. Mudanças relevantes serão comunicadas na plataforma
      ou por e-mail.
    </p>

    <h2>11. Contato</h2>
    <p>
      Dúvidas, reclamações ou solicitações: <strong>{businessInfo.supportEmail}</strong>.
    </p>
  </LegalLayout>
);

export default PrivacyPage;
