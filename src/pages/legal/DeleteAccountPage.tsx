import LegalLayout from "@/components/LegalLayout";
import { businessInfo } from "@/config/business";

const DeleteAccountPage = () => (
  <LegalLayout title="Excluir conta">
    <p>
      Você pode solicitar a exclusão completa da sua conta no <strong>{businessInfo.productName}</strong>{" "}
      a qualquer momento.
    </p>

    <h2>Como solicitar</h2>
    <ol>
      <li>
        Envie um e-mail para <strong><a href={`mailto:${businessInfo.supportEmail}?subject=Excluir%20conta`}>{businessInfo.supportEmail}</a></strong>{" "}
        a partir do endereço cadastrado, com o assunto <em>“Excluir conta”</em>.
      </li>
      <li>Confirmaremos a solicitação em até 3 dias úteis.</li>
      <li>A exclusão é concluída em até 30 dias.</li>
    </ol>

    <h2>O que é apagado</h2>
    <ul>
      <li>Perfil, nome de exibição, e-mail e credenciais.</li>
      <li>Progresso de estudo, Chaves, conquistas e respostas de quizzes.</li>
      <li>Eventos de uso vinculados à sua conta.</li>
    </ul>

    <h2>O que pode ser mantido</h2>
    <p>
      Por obrigação legal, fiscal ou contábil, podemos manter pelo prazo previsto em lei:
    </p>
    <ul>
      <li>Registros de transações de pagamento (até 5 anos).</li>
      <li>Logs de auditoria mínimos exigidos por segurança da informação.</li>
    </ul>
    <p>
      Esses registros ficam segregados e não são usados para finalidades comerciais.
    </p>

    <h2>Dúvidas</h2>
    <p>
      Em caso de dúvida, escreva para <strong>{businessInfo.supportEmail}</strong>.
    </p>
  </LegalLayout>
);

export default DeleteAccountPage;
