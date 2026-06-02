ALTER TABLE public.google_play_subscriptions
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS acknowledged_at TIMESTAMP WITH TIME ZONE;

-- Ensure purchase_token is unique (already is, but double check)
-- ALTER TABLE public.google_play_subscriptions ADD CONSTRAINT unique_purchase_token UNIQUE (purchase_token);
