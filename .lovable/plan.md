### Global Legibility Audit: "Ouro é detalhe. Ameixa é leitura."

Ensure all functional, pedagogical, and interface text uses **Ameixa Profundo (`#5B1F3D`)** instead of light gold or beige colors, while preserving **Ouro Antigo (`#C8A66A`)** for decorative elements (icons, borders, symbols).

#### Changes:

1. **`src/pages/LandingPage.tsx`**
   - Replace gold text in pricing section titles ("Plano Mensal") with Ameixa.
   - Audit any remaining slogan or informational text in gold.

2. **`src/pages/FoolsJourneyPage.tsx`**
   - Change label "✦ Visão Geral ✦" to Ameixa.
   - Change "meta.introSubtitulo" and "meta.subtitulo" to Ameixa.
   - Change "arcano.papel" (subtitle for each card) to Ameixa.
   - Change closing invitation text to Ameixa.

3. **`src/pages/NaipePage.tsx`**
   - Change "Conteúdo em breve" text to Ameixa.
   - Change "Trilha de Estudo" divider label to Ameixa.
   - Change "Voltar aos módulos" link text to Ameixa.

4. **`src/pages/FeedbackPage.tsx`**
   - Change functional labels ("Sobre o que quer falar?", "Sua mensagem", "Trocar", "Enviar outra mensagem") to Ameixa.

5. **`src/pages/FundamentosPage.tsx`**
   - Change "Base da Jornada" label to Ameixa.

6. **Verification**
   - Run `npx tsc --noEmit`
   - Run `npm run build`

#### Technical details:
- Standard color for Ameixa: `#5B1F3D`
- Standard color for Ouro (icons/details): `#C8A66A`
- Accessibility: Ensure contrast ratio exceeds 4.5:1 for small text and 3:1 for large text.
