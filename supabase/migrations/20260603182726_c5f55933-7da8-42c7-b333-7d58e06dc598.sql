INSERT INTO public.cms_symbols (id, name, slug, category_slug, explanation, readings, cards, order_index, status)
VALUES (
  gen_random_uuid(),
  'Coroa',
  'coroa',
  'objetos',
  'Símbolo de autoridade, soberania e domínio sobre a própria vida ou reino. No Tarô, representa o poder temporal ou espiritual alcançado através da responsabilidade.',
  ARRAY['Autoridade e liderança', 'Conquista de soberania pessoal', 'Responsabilidade pelo próprio destino'],
  ARRAY['A Imperatriz', 'O Imperador', 'Quatro de Ouros'],
  5,
  'published'
);