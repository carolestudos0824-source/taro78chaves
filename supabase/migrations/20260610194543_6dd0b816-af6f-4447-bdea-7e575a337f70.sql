CREATE OR REPLACE FUNCTION public.get_user_id_by_email(p_email TEXT)
RETURNS TABLE (id UUID) AS $$
BEGIN
    RETURN QUERY SELECT u.id FROM auth.users u WHERE u.email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) TO service_role;
