# Guia de Build Android - Tarô 78 Chaves

Este documento contém o passo a passo para gerar o binário de produção (.aab) do app Tarô 78 Chaves para a Google Play Store. O app está atualmente em estado **Build-Ready (Configuração 1.0.3)**.

## 1. Nomenclatura de Prontidão
1. **Code-Ready:** Código Android preparado (Estado Atual).
2. **Build-Ready:** AAB real gerado e assinado localmente.
3. **Play-Test-Ready:** AAB enviado e instalado via Play Internal Testing.
4. **Review-Ready:** Formulários preenchidos + Pre-launch Report sem erro crítico.
5. **Production-Ready:** Aprovado ou pronto para rollout público.

## 2. Pré-requisitos
- **Java Development Kit (JDK):** Versão 17 ou superior.
- **Android Studio:** Versão mais recente instalada.
- **Android SDK:** API 35 ou 36 (Android 15) instalada via SDK Manager.
- **Keystore:** Arquivo de chave (.jks ou .keystore) para assinatura de release.

## 3. Preparação do Ambiente
Execute na raiz do projeto:
```bash
npm install
npm run build
npx cap sync android
```

## 4. Comandos de Build (Local)
Execute os comandos abaixo dentro da pasta `android`:
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

## 5. Resultado Esperado
O arquivo final será gerado no caminho:
`android/app/build/outputs/bundle/release/app-release.aab`

## 6. Checklist de Validação do AAB
- [ ] AAB FOI REALMENTE GERADO: SIM/NÃO
- [ ] CAMINHO: `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] AAB ESTÁ ASSINADO PARA RELEASE: SIM/NÃO
- [x] VERSIONCODE: 4
- [x] VERSIONNAME: 1.0.3
- [ ] PACKAGE NAME: br.com.taro78chaves.app
- [ ] TARGET SDK: 36
- [ ] MIN SDK: 24

## 7. Próximas Etapas (Play Console)
1. Criar app no Play Console com package name `br.com.taro78chaves.app`.
2. Criar faixa de **Teste Interno** e enviar o AAB.
3. Adicionar testadores e instalar via link da Play Store interna.
4. Validar fluxos críticos: Login, /app, lição do Louco, progresso, botões de pagamento bloqueados.
5. Preencher formulários: App Access, Data Safety, Account Deletion, Content Rating.
6. URL de Política de Privacidade: `https://taro78chaves.lovable.app/privacidade`
7. URL de Exclusão de Conta: `https://taro78chaves.lovable.app/excluir-conta`

