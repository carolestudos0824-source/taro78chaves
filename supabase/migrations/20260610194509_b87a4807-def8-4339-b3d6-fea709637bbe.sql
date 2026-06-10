CREATE TABLE IF NOT EXISTS public.kirvano_events (
    id TEXT PRIMARY KEY, -- Usado para idempotência (Kirvano event id)
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' NOT NULL,
    error_message TEXT,
    customer_email TEXT,
    sale_id TEXT,
    event_type TEXT,
    transaction_id TEXT
);

-- Permissões
GRANT ALL ON public.kirvano_events TO service_role;
GRANT INSERT ON public.kirvano_events TO anon, authenticated; -- Permite que o webhook receba dados

-- RLS (Apenas para segurança, mas service_role manejará a lógica)
ALTER TABLE public.kirvano_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage kirvano_events" ON public.kirvano_events
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_kirvano_events_customer_email ON public.kirvano_events(customer_email);
CREATE INDEX IF NOT EXISTS idx_kirvano_events_status ON public.kirvano_events(status);
CREATE INDEX IF NOT EXISTS idx_kirvano_events_sale_id ON public.kirvano_events(sale_id);
