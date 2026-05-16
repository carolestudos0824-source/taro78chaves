# Registro de Correção: Bug Visual Landing Page

**Data:** 16 de Maio de 2026
**Status:** APROVADO

## Descrição do Problema
Na seção “Explore a Trilha do Conhecimento” da landing pública, a primeira carta do carrossel (O Louco) aparecia cortada à esquerda, prejudicando a estética premium do projeto.

## Correção Aplicada (Hotfix)
- **Container Pai:** Ajustado de `px-6` para `px-0 md:px-6` em mobile para permitir scroll lateral sangrado.
- **Títulos:** Receberam `px-6` individualmente para manter o alinhamento com o grid.
- **Carrossel:** Ajuste de padding interno (`px-6` no mobile e `px-8` no desktop) para garantir que nenhuma carta encoste nas bordas.
- **Snap:** Mantido `snap-x` para navegação fluida.

## Validação de Runtime
- **Desktop:** O Louco aparece 100% inteiro: SIM
- **Mobile 390px:** O Louco aparece 100% inteiro: SIM
- **Nenhuma carta cortada:** SIM
- **Respiro lateral adequado:** SIM
- **Badges e nomes legíveis:** SIM
- **Funcionalidade mantida:** CTA "Começar pelo Louco — Grátis" redireciona corretamente.

## Veredito de Segurança
- **Alteração em Deck/Progresso/XP:** NÃO
- **Alteração em Stripe:** NÃO
- **Alteração em Android/Capacitor:** NÃO
- **Alteração em Supabase:** NÃO

A correção foi considerada pontual e necessária para a imagem pública do produto antes da build final. O congelamento de produto permanece vigente.
