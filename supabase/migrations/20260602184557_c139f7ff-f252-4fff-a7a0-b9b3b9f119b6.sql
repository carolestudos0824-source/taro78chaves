-- Create a table for Google Play subscriptions
CREATE TABLE public.google_play_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    base_plan_id TEXT NOT NULL,
    purchase_token TEXT NOT NULL UNIQUE,
    subscription_status TEXT NOT NULL, -- 'active', 'expired', 'cancelled', 'on_hold', 'paused'
    expires_at TIMESTAMP WITH TIME ZONE,
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Use GRANT to set permissions for different roles
GRANT SELECT, INSERT, UPDATE ON public.google_play_subscriptions TO authenticated;
GRANT ALL ON public.google_play_subscriptions TO service_role;

-- Enable Row Level Security
ALTER TABLE public.google_play_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own google play subscriptions"
ON public.google_play_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own google play subscriptions"
ON public.google_play_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own google play subscriptions"
ON public.google_play_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_google_play_subscriptions_user_id ON public.google_play_subscriptions(user_id);
CREATE INDEX idx_google_play_subscriptions_purchase_token ON public.google_play_subscriptions(purchase_token);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_google_play_subscriptions_updated_at
BEFORE UPDATE ON public.google_play_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
