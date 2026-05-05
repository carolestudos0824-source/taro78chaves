import LegalLayout from "@/components/LegalLayout";

const SUPPORT_EMAIL = "suporte@taro78chaves.com.br";

const TermsPage = () => (
  <LegalLayout title="Termos de Serviço">
    <p>
      Bem-vindo ao <strong>Tarô 78 Chaves</strong>. Ao criar uma conta ou usar o App,
      você concorda com estes Termos de Serviço.
    </p>

    <h2>1. Natureza do conteúdo</h2>
    <p>
      O Tarô 78 Chaves é uma plataforma <strong>educacional e simbólica</strong>. O
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

    <h2>3. Assinatura e Planos</h2>
    <p>
      O App oferece dois modelos de acesso premium:
    </p>
    <ul>
      <li><strong>Plano Mensal:</strong> assinatura recorrente com renovação automática a cada 30 dias. O cancelamento pode ser feito a qualquer momento pelo portal do assinante.</li>
      <li><strong>Plano Anual:</strong> pagamento único para 12 meses de acesso, sem renovação automática. Ao final do período, o acesso premium expira e uma nova compra manual é necessária para renovação.</li>
    </ul>

    <h2>4. Cancelamento e Reembolso</h2>
    <p>
      Para o plano mensal, o cancelamento encerra a renovação futura; o acesso premium permanece até o fim do período já pago. Para o plano anual de pagamento único, não há renovação a ser cancelada, e o acesso é garantido pelo período contratado.
    </p>
    <p>
      Reembolsos seguem a legislação consumerista vigente (direito de arrependimento de 7 dias para compras online) e as regras da plataforma de pagamento utilizada.
    </p>

    <h2>5. Propriedade intelectual</h2>
    <p>
      Todo o conteúdo (textos, lições, ilustrações, marca, layout, código) é protegido
      por direitos autorais e pertence ao Tarô 78 Chaves ou a seus licenciantes. É
      proibido copiar, redistribuir, revender, traduzir ou criar obras derivadas sem
      autorização expressa.
    </p>

    <h2>6. Conduta do usuário</h2>
    <ul>
      <li>Não usar o App para fins ilícitos.</li>
      <li>Não tentar contornar mecanismos de segurança ou de cobrança.</li>
      <li>Não automatizar acessos (scrapers, bots) sem permissão.</li>
    </ul>
    <p>O descumprimento pode resultar em suspensão ou encerramento da conta.</p>

    <h2>7. Limitação de responsabilidade</h2>
    <p>
      O App é fornecido “como está”. Não garantimos disponibilidade ininterrupta nem
      adequação a propósitos específicos. Na máxima extensão permitida por lei, não
      somos responsáveis por danos indiretos, lucros cessantes ou decisões tomadas com
      base no conteúdo simbólico.
    </p>

    <h2>8. Suporte</h2>
    <p>
      Suporte por e-mail em <strong>{SUPPORT_EMAIL}</strong>. Veja também{" "}
      <a href="/suporte">/suporte</a>.
    </p>

    <h2>9. Alterações</h2>
    <p>
      Podemos atualizar estes Termos. Mudanças relevantes serão comunicadas no app ou
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
