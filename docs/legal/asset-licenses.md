# Manifesto de Licenças de Assets - Tarô 78 Chaves

Este documento detalha a origem e o status de licenciamento de todos os assets visuais utilizados no projeto para fins de conformidade com as políticas da Google Play Store.

## 1. Cartas Rider-Waite-Smith (RWS)

- **Caminho no projeto**: `src/assets/arcano-*.jpg`, `src/assets/menor-*.jpg`
- **Onde é usado**: Conteúdo central do deck de Tarô (78 cartas).
- **Tipo de asset**: Imagem (JPG).
- **Origem exata**: Original Rider-Waite Tarot Deck, publicado originalmente pela William Rider & Son em 1909.
- **URL da origem**: [Wikimedia Commons - Rider-Waite Tarot](https://commons.wikimedia.org/wiki/Category:Rider-Waite_Tarot)
- **Autor/criador**: Pamela Colman Smith (Artista); Arthur Edward Waite (Conceito).
- **Licença exata**: Domínio Público.
- **Se é domínio público**: SIM.
- **Evidência da licença**: A obra original de 1909 está em domínio público mundialmente. Pamela Colman Smith faleceu em 1951; no Reino Unido e UE, a obra entrou em domínio público 70 anos após sua morte (janeiro de 2022). Nos EUA, obras publicadas antes de 1929 estão em domínio público.
- **Risco**: BAIXO.
- **Precisa substituição**: NÃO.
- **Observação**: As imagens utilizadas são digitalizações fiéis à arte original, evitando edições modernas colorizadas que poderiam ter novos direitos autorais.

## 2. Ícones Lucide

- **Caminho no projeto**: Dependência `lucide-react`.
- **Onde é usado**: Interface de usuário (ícones de navegação, botões e ações).
- **Tipo de asset**: Vetorial (SVG via React).
- **Origem exata**: Repositório oficial do Projeto Lucide.
- **URL da origem**: [https://lucide.dev/license](https://lucide.dev/license)
- **Autor/criador**: Equipe de contribuidores do Lucide.
- **Licença exata**: ISC License.
- **Se é domínio público**: NÃO.
- **Evidência da licença**: [ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE).
- **Risco**: BAIXO.
- **Precisa substituição**: NÃO.

## 3. Brand Assets (Identidade Visual)

- **Caminho no projeto**: `src/assets/brand-icon.png`, `src/assets/brand-logo.png`, `public/icons/*.png`, `public/favicon.png`
- **Onde é usado**: Logo do app, ícone da tela inicial (PWA), favicon.
- **Tipo de asset**: Imagem (PNG).
- **Origem exata**: Design original criado para o projeto Tarô 78 Chaves.
- **URL da origem**: N/A (Produção interna).
- **Autor/criador**: Equipe de design do projeto.
- **Licença exata**: Propriedade Intelectual Exclusiva.
- **Se é domínio público**: NÃO.
- **Evidência da licença**: Assets criados especificamente para a marca do aplicativo.
- **Risco**: BAIXO (Assumindo autoria comprovada).
- **Precisa substituição**: NÃO.

## 4. Fundos e Ornamentos (Decorativos)

- **Caminho no projeto**: N/A (Removido)
- **Onde é usado**: N/A
- **Tipo de asset**: N/A
- **Origem exata**: Assets `mystic-bg.jpg` e `ornament-divider.png` foram removidos do projeto para eliminar riscos de licenciamento.
- **URL da origem**: N/A
- **Autor/criador**: N/A
- **Licença exata**: N/A
- **Se é domínio público**: N/A
- **Evidência da licença**: N/A
- **Risco**: BAIXO (Removido).
- **Precisa substituição**: CONCLUÍDO. Substituído por implementações procedurais em CSS e SVG inline nativos do projeto.
- **Observação**: O fundo da aplicação agora utiliza gradientes CSS e padrões de repetição geométricos definidos em `src/index.css`. Os divisores ornamentais foram substituídos por elementos flexbox com gradientes e formas geométricas (diamond) em CSS puro, garantindo 100% de autoria e eliminando dependências de arquivos externos de imagem.

## 5. Placeholders e Recursos Técnicos

- **Caminho no projeto**: `public/placeholder.svg`, `src/assets/arcano-placeholder.jpg`
- **Onde é usado**: Fallbacks visuais durante o carregamento de dados.
- **Tipo de asset**: Imagem (SVG/JPG).
- **Origem exata**: Gerado pelo ambiente de desenvolvimento / Projeto.
- **URL da origem**: N/A.
- **Autor/criador**: Equipe do projeto / Sistema.
- **Licença**: Domínio Público / Recurso Técnico.
- **Se é domínio público**: SIM.
- **Evidência da licença**: Arquivos de sistema para controle de interface.
- **Risco**: BAIXO.
- **Precisa substituição**: NÃO.
