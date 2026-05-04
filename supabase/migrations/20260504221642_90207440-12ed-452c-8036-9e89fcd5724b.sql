ALTER TABLE public.user_reflections 
ADD CONSTRAINT user_reflections_user_id_arcano_id_key UNIQUE (user_id, arcano_id);
