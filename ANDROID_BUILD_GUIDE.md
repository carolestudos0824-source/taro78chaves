# Guia de Build Android - Tarô 78 Chaves

Este documento contém o passo a passo para gerar o binário de produção (.aab) do app Tarô 78 Chaves para a Google Play Store.

## 1. Pré-requisitos
- **Java Development Kit (JDK):** Versão 17 ou superior.
- **Android Studio:** Versão mais recente instalada.
- **Android SDK:** API 35 (Android 15) instalada via SDK Manager.
- **Node.js & npm/bun:** Para rodar o comando de build do frontend.

## 2. Preparação do Ambiente
Certifique-se de que o projeto Android está sincronizado com as últimas alterações do código:
```bash
# Na raiz do projeto
bun install
bun run build
npx cap sync android
```

## 3. Configuração de Assinatura (Importante)
Para produção, o app deve ser assinado. 
1. Gere uma keystore (se ainda não tiver):
   `keytool -genkey -v -keystore release-key.keystore -alias taro78 -keyalg RSA -keysize 2048 -validity 10000`
2. **AVISO:** Nunca versione o arquivo `.keystore` no GitHub.
3. Configure o arquivo `android/app/build.gradle` para apontar para sua chave ou use o Android Studio (Build > Generate Signed Bundle).

## 4. Comandos de Build
Execute os comandos abaixo dentro da pasta `android`:
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

## 5. Resultado Esperado
O arquivo final será gerado no caminho:
`android/app/build/outputs/bundle/release/app-release.aab`

## 6. Publicação no Play Console
1. Acesse o [Google Play Console](https://play.google.com/console).
2. Selecione o app **Tarô 78 Chaves** (br.com.taro78chaves.app).
3. Vá em **Teste Interno** e faça o upload do arquivo `.aab`.
4. Preencha os formulários de **Conteúdo do App** (Privacidade, Segurança de Dados, Exclusão de Conta).
5. URL de Política de Privacidade: `https://taro78chaves.lovable.app/privacidade`
6. URL de Exclusão de Conta: `https://taro78chaves.lovable.app/excluir-conta`
