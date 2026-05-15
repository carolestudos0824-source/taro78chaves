# Checklist de Envio - Google Play Store

## BLOCO A: Play Console (Configuração)
- [ ] **App Access:** "All functionality is available without special access". Caso o revisor precise de login, fornecer e-mail e senha de teste.
- [ ] **Data Safety:**
  - Declarar: E-mail (Identificação), Progresso (App Functionality), Eventos de Uso (Analytics).
- [ ] **Account Deletion:**
  - Informar link web: `https://taro78chaves.lovable.app/excluir-conta`
  - Informar que a opção está disponível In-App em: Perfil > Excluir conta.
- [ ] **Content Rating:** Preencher o questionário (Classificação indicativa livre/educacional).
- [ ] **Privacy Policy:** URL `https://taro78chaves.lovable.app/privacidade`.

## BLOCO B: Store Listing (Marketing)
- [ ] **Descrição Curta:** "Aprenda Tarô de forma prática e profunda com a jornada dos 78 arcanos."
- [ ] **Descrição Completa:** "O Tarô 78 Chaves é seu guia místico para o domínio dos arcanos. Através do método Arcano Vivo, você percorre uma trilha progressiva de aprendizado, com quizzes, práticas rituais e aprofundamento simbólico. Ideal para iniciantes e buscadores."
- [ ] **Ícone:** 512x512px (PNG/WebP).
- [ ] **Feature Graphic:** 1024x500px.
- [ ] **Screenshots:** No mínimo 4 capturas de tela do celular.

## BLOCO C: Validação Técnica (Pós-Build)
- [ ] **Target SDK:** 36 (Confirmado em variables.gradle).
- [ ] **Billing Policy:** Confirmar que Stripe NÃO abre no Android (Botão de Upgrade deve mostrar mensagem informativa).
- [ ] **Back Button:** O botão voltar do Android deve fechar modais ou navegar para a página anterior.
- [ ] **Pre-launch Report:** Verificar se o Google gerou erros críticos de acessibilidade ou crashes em modelos específicos.
