# Próxima Etapa: Geração do Binário (AAB)

O app **Tarô 78 Chaves** atingiu o estado **Android Code-Ready**. Isso significa que o código-fonte está preparado para as políticas da Google Play, mas a etapa final de geração do arquivo de produção acontece **fora da sandbox**.

## 1. O que é o `app-release.aab`?
- **Android App Bundle:** É o formato oficial de publicação no Google Play.
- **Produção:** Ele transforma o código web (dist) e o wrapper Capacitor em um pacote Android otimizado.
- **Distribuição:** O Google Play usa esse arquivo para gerar APKs específicos para cada dispositivo de usuário.

## 2. O que significa "Assinado"?
- **Identidade:** O app deve ser assinado com uma `upload key` (keystore). Isso garante que futuras atualizações sejam legítimas.
- **Segurança:** A keystore e suas senhas **nunca** devem ser commitadas no repositório. Devem ser guardadas em local seguro pelo proprietário.
- **Requisito:** O Google Play não aceita arquivos AAB sem assinatura de release.

## 3. Por que fora da Sandbox?
A infraestrutura de nuvem/sandbox é focada em desenvolvimento web e lógica de backend. A geração de binários nativos Android exige:
- JDK (Java Development Kit)
- Android SDK e Build Tools
- Gradle configurado
- Acesso à chave de assinatura privada

## 4. Comandos para Geração Local
No seu terminal local (após clonar o projeto):

```bash
# 1. Preparar dependências e build web
npm install
npm run build

# 2. Sincronizar com o projeto Android
npx cap sync android

# 3. Gerar o bundle de produção
cd android
./gradlew clean
./gradlew bundleRelease
```

**Resultado esperado:**
`android/app/build/outputs/bundle/release/app-release.aab`

---

## Checklist Pós-Geração (Relatório de Evidência)
Após gerar o arquivo, preencha os dados abaixo para validar o estado **Build-Ready**:

- **AAB FOI REALMENTE GERADO:** [SIM/NÃO]
- **CAMINHO DO ARQUIVO .AAB:**
- **NOME DO ARQUIVO .AAB:**
- **TAMANHO DO ARQUIVO .AAB:**
- **AAB ESTÁ ASSINADO PARA RELEASE:** [SIM/NÃO]
- **VERSIONCODE:**
- **VERSIONNAME:**
- **PACKAGE NAME:** `br.com.taro78chaves.app`
- **TARGET SDK:** 36
- **MIN SDK:** 24

> **Importante:** O status **Play-Ready** só será atingido quando o AAB assinado for enviado ao Play Console, instalado via **Teste Interno** e o **Pre-launch Report** não apresentar erros críticos.
