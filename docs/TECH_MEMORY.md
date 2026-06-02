# Memória Técnica do Projeto - Tarô 78 Chaves

## Blocos Fechados

### 1. Linguagem sem XP
**Status:** FECHADO
**Data de Aprovação:** Junho de 2026

**Regras Consolidadas:**
- A palavra “XP” não pode aparecer em nenhuma página do app (cards, botões, toasts, modais, tooltips, header, perfil, painel, lições, quizzes, conclusão, admin ou auditor).
- “XP” pode permanecer apenas como identificador técnico interno no código/banco, sem exposição visual.
- A linguagem principal do app deve ser baseada nos termos:
  - **Chaves** (substitui XP visualmente)
  - **Jornada**
  - **Travessia**
  - **Arcanos**
  - **Lições**
  - **Rituais**
  - **Insígnias**
  - **Nível**
  - **Progresso**
- “Pontos” pode ser usado apenas como apoio numérico discreto, não como identidade principal.
- Lógica de progresso preservada.

---

### 2. Estratégia de Pagamento e Integração Stripe
**Status:** FECHADO PARA PWA
**Data de Aprovação:** Junho de 2026

**Resumo da Validação:**
- Teste manual real executado no preview com usuário premium real.
- Botão “Gerenciar assinatura” em `/perfil` validado.
- Chamada da Edge Function `stripe-customer-portal` retornando 200.
- Stripe Customer Portal abre corretamente no navegador com os dados do cliente e assinatura corretos.
- `return_url` redireciona corretamente para `/perfil`.
- Usuários gratuitos ou sem `stripe_customer_id` não têm acesso indevido ao portal.
- Admin e Auditor não são tratados como pagantes Stripe (acesso via role, sem portal).

**Regras Consolidadas:**
- **Stripe** é o canal principal de pagamento para a versão Web/PWA.
- **Hotmart** não será implementado nesta fase.
- **isWebCheckoutAllowed**: Flag preservada para controle de checkout externo conforme plataforma.
- **Admin**: Acesso total, mas sem portal de pagamento Stripe.
- **Auditor**: Papel especial para testes de conteúdo premium sem Stripe, sem acesso administrativo e sem gravação de progresso.
- **Segurança**: IDs Stripe mascarados em logs e relatórios.

---

## Blocos em Aberto / Próximos Passos
- (Aguardando definição do usuário)
