-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    course_name TEXT DEFAULT 'Escola Digital Tarô 78 Chaves',
    workload_hours INTEGER DEFAULT 40,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    validation_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'issued',
    completion_percentage NUMERIC,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
-- Index for validation code lookups
CREATE INDEX IF NOT EXISTS idx_certificates_validation_code ON public.certificates(validation_code);

-- Grant permissions
GRANT SELECT, INSERT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
GRANT SELECT ON public.certificates TO anon;

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own certificates"
ON public.certificates
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates"
ON public.certificates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin policy (using user_roles table)
CREATE POLICY "Admins can view all certificates"
ON public.certificates
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

-- Validation page needs public access to valid certificates (minimal data)
CREATE POLICY "Public can view valid certificates by validation_code"
ON public.certificates
FOR SELECT
TO anon
USING (status = 'issued');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();