-- Revogar permissões públicas para funções SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.complete_lesson_v2(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.complete_module_v2(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.redeem_gift_code(TEXT, UUID) FROM PUBLIC;

-- Garantir que apenas authenticated e service_role possam executar
GRANT EXECUTE ON FUNCTION public.complete_lesson_v2(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.complete_module_v2(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.redeem_gift_code(TEXT, UUID) TO authenticated, service_role;
