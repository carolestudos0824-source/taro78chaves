import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { businessInfo } from "@/config/business";

const TermsPage = () => (
  <LegalLayout title="Termos de Serviço">
    <p>
      Bem-vindo ao <strong>{businessInfo.productName}</strong>. Ao criar uma conta ou usar a plataforma,
      você concorda com estes Termos de Serviço. Empresa responsável: <strong>{businessInfo.companyName}</strong>, CNPJ <strong>{businessInfo.cnpj}</strong>.
    </p>

    <h2>1. Natureza do conteúdo</h2>
    <p>
      O {businessInfo.productName} é uma plataforma <strong>educacional e simbólica</strong>. O
      conteúdo é oferecido para fins de estudo, autoconhecimento e desenvolvimento
      cultural. Não constitui aconselhamento médico, psicológico, jurídico, financeiro
      ou previsão de fatos futuros, e não substitui profissionais habilitados.
    </p>

    <h2>2. Conta do usuário</h2>
    <ul>
      <li>Você é responsável pelas credenciais e pela atividade na sua conta.</li>
      <li>Forneça informações verdadeiras e mantenha-as atualizadas.</li>
      <li>É proibido criar contas em nome de terceiros sem autorização.</li>
    </ul>

    <h2>3. Acesso e Pagamento</h2>
    <p>
      A plataforma oferece acesso completo ao programa através de assinatura mensal recorrente disponibilizada via plataforma segura (Web/PWA). O acesso permanece ativo enquanto a assinatura estiver em dia.
    </p>

    <h2>4. Cancelamento e Reembolso</h2>
    <p>
      O cancelamento da assinatura pode ser feito a qualquer momento pelo portal de gerenciamento no Perfil do usuário. Reembolsos seguem a legislação consumerista vigente (direito de arrependimento de 7 dias para a primeira transação) e as regras do processador de pagamento utilizado (Stripe).
    </p>

    <h2>5. Propriedade intelectual</h2>
    <p>
      Todo o conteúdo (textos, lições, ilustrações, marca, layout, código) é protegido
      por direitos autorais e pertence à <strong>{businessInfo.companyName}</strong> ou a seus licenciantes. É
      proibido copiar, redistribuir, revender, traduzir ou criar obras derivadas sem
      autorização expressa.
    </p>

    <h2>6. Conduta do usuário</h2>
    <ul>
      <li>Não usar a plataforma para fins ilícitos.</li>
      <li>Não tentar contornar mecanismos de segurança ou de cobrança.</li>
      <li>Não automatizar acessos (scrapers, bots) sem permissão.</li>
    </ul>
    <p>O descumprimento pode resultar em suspensão ou encerramento da conta.</p>

    <h2>7. Limitação de responsabilidade</h2>
    <p>
      A plataforma é fornecida “como está”. Não garantimos disponibilidade ininterrupta nem
      adequação a propósitos específicos. Na máxima extensão permitida por lei, não
      somos responsáveis por danos indiretos, lucros cessantes ou decisões tomadas com
      base no conteúdo simbólico.
    </p>

    <h2>8. Suporte</h2>
    <p>
      Suporte por e-mail em <strong>{businessInfo.supportEmail}</strong>. Se precisar de ajuda técnica, pedagógica ou sobre seu acesso, use nossa{" "}
      <Link to="/suporte" className="underline font-bold">Central de Suporte</Link>.
    </p>

    <h2>9. Alterações</h2>
    <p>
      Podemos atualizar estes Termos. Mudanças relevantes serão comunicadas na plataforma ou
      por e-mail. O uso continuado após a atualização implica concordância.
    </p>

    <h2>10. Lei aplicável</h2>
    <p>
      Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica
      eleito o foro do domicílio do usuário para dirimir controvérsias.
    </p>
  </LegalLayout>
);

export default TermsPage;
