import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Diagnostics = {
  action?: string;
  target_user_id?: string | null;
  error_stage?: string;
  http_status?: number;
  warnings_count?: number;
};

const respond = (ok: boolean, payload: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ ok, ...payload }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const fail = (error: string, diagnostics: Diagnostics = {}) =>
  respond(false, { error, diagnostics });

const isAllowedResetRedirect = (value: unknown) => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.pathname === "/reset-password";
  } catch {
    return false;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const action = typeof body.action === "string" ? body.action : undefined;
  const target_user_id = typeof body.target_user_id === "string" ? body.target_user_id : null;

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(SUPABASE_URL, SERVICE);

    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();

    if (userErr || !user) {
      return fail("Sessão administrativa ausente ou expirada.", {
        action,
        target_user_id,
        error_stage: "auth.getUser",
        http_status: 401,
      });
    }

    const { data: callerRoles, error: rolesError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (rolesError) {
      return fail("Não foi possível validar a permissão administrativa.", {
        action,
        target_user_id,
        error_stage: "load_caller_roles",
        http_status: 500,
      });
    }

    const roleSet = new Set((callerRoles ?? []).map((r) => r.role));
    if (!roleSet.has("admin")) {
      return fail("Acesso restrito a administradores.", {
        action,
        target_user_id,
        error_stage: "admin_guard",
        http_status: 403,
      });
    }

    const email = typeof body.email === "string" ? body.email : undefined;
    const days = Number(body.days);
    const source = body.source;
    const gift_code_id = body.gift_code_id;
    const requestedRole: "admin" | "moderator" = body.role === "moderator" ? "moderator" : "admin";

    if (action === "list") {
      const { data: roles, error } = await admin
        .from("user_roles")
        .select("id, user_id, role")
        .in("role", ["admin", "moderator"]);
      if (error) return fail(error.message, { action, error_stage: "list_roles", http_status: 500 });

      const ids = (roles ?? []).map((r) => r.user_id);
      const { data: profiles, error: profilesError } = await admin
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      if (profilesError) return fail(profilesError.message, { action, error_stage: "list_profiles", http_status: 500 });

      const enriched = await Promise.all(
        (roles ?? []).map(async (r) => {
          const { data: authData } = await admin.auth.admin.getUserById(r.user_id);
          const profile = profiles?.find((p) => p.user_id === r.user_id);
          return {
            id: r.id,
            user_id: r.user_id,
            role: r.role,
            email: authData?.user?.email ?? null,
            display_name: profile?.display_name ?? null,
            created_at: authData?.user?.created_at ?? null,
            is_principal: r.user_id === user.id,
          };
        })
      );

      return respond(true, { admins: enriched, current_user_id: user.id });
    }

    if (action === "search") {
      if (!email) return fail("Email obrigatório", { action, error_stage: "validate_email", http_status: 400 });
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return fail(error.message, { action, error_stage: "search_users", http_status: 500 });

      const q = email.toLowerCase().trim();
      const matches = (data?.users ?? [])
        .filter((u) => (u.email ?? "").toLowerCase().includes(q))
        .slice(0, 10)
        .map((u) => ({ id: u.id, email: u.email, created_at: u.created_at }));

      return respond(true, { users: matches });
    }

    if (action === "promote") {
      if (!target_user_id) return fail("Usuário obrigatório", { action, error_stage: "validate_target", http_status: 400 });
      const { error } = await admin.from("user_roles").insert({ user_id: target_user_id, role: requestedRole });
      if (error && !error.message.includes("duplicate")) {
        return fail(error.message, { action, target_user_id, error_stage: "promote_role", http_status: 500 });
      }
      return respond(true, { success: true, role: requestedRole });
    }

    if (action === "demote") {
      if (!target_user_id) return fail("Usuário obrigatório", { action, error_stage: "validate_target", http_status: 400 });
      if (target_user_id === user.id && requestedRole === "admin") {
        return fail("Você não pode remover a si mesmo como admin", { action, target_user_id, error_stage: "self_demote", http_status: 400 });
      }
      const { error } = await admin.from("user_roles").delete().eq("user_id", target_user_id).eq("role", requestedRole);
      if (error) return fail(error.message, { action, target_user_id, error_stage: "demote_role", http_status: 500 });
      return respond(true, { success: true, role: requestedRole });
    }

    if (action === "list_users") {
      const page = typeof body.page === "number" ? body.page : 1;
      const perPage = typeof body.perPage === "number" ? body.perPage : 200;
      const { data: authList, error: authErr } = await admin.auth.admin.listUsers({ page, perPage });
      if (authErr) return fail(authErr.message, { action, error_stage: "list_users", http_status: 500 });
      const users = (authList?.users ?? []).map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
      }));
      return respond(true, { users });
    }

    if (action === "user_detail") {
      if (!target_user_id) return fail("Usuário obrigatório", { action, error_stage: "validate_target", http_status: 400 });

      const warnings: { source: string; message: string }[] = [];
      const safe = async <T,>(sourceName: string, fn: () => PromiseLike<{ data: T | null; error: { message: string } | null }>) => {
        try {
          const { data, error } = await fn();
          if (error) {
            warnings.push({ source: sourceName, message: error.message });
            return null;
          }
          return data;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          warnings.push({ source: sourceName, message });
          return null;
        }
      };

      const [authUser, profile, progress, rolesRows, redemptions] = await Promise.all([
        safe("auth", async () => {
          const res = await admin.auth.admin.getUserById(target_user_id);
          return { data: res.data?.user ?? null, error: res.error ? { message: res.error.message } : null };
        }),
        safe("profile", () => admin.from("profiles").select("*").eq("user_id", target_user_id).maybeSingle()),
        safe("progress", () => admin.from("user_progress").select("*").eq("user_id", target_user_id).maybeSingle()),
        safe("roles", () => admin.from("user_roles").select("role").eq("user_id", target_user_id)),
        safe("redemptions", () => admin.from("gift_redemptions").select("redeemed_at, gift_code_id").eq("user_id", target_user_id)),
      ]);

      const nowIso = new Date().toISOString();
      const fallbackProfile = {
        user_id: target_user_id,
        display_name: null,
        is_premium: false,
        premium_until: null,
        premium_source: null,
        created_at: authUser?.created_at ?? nowIso,
        updated_at: nowIso,
      };
      const fallbackProgress = {
        user_id: target_user_id,
        completed_lessons: [],
        completed_modules: [],
        completed_quizzes: [],
        completed_exercises: [],
        last_active: authUser?.last_sign_in_at ?? authUser?.created_at ?? nowIso,
        streak: 0,
        xp: 0,
        level: 1,
        onboarding_completed: false,
        created_at: authUser?.created_at ?? nowIso,
        updated_at: nowIso,
        id: null,
      };

      if (!profile) warnings.push({ source: "profile", message: "Perfil ausente; usando valores padrão." });
      if (!progress) warnings.push({ source: "progress", message: "Progresso ausente; usando valores padrão." });

      return respond(true, {
        auth: authUser
          ? {
              email: authUser.email ?? null,
              created_at: authUser.created_at ?? null,
              last_sign_in_at: authUser.last_sign_in_at ?? null,
            }
          : null,
        profile: profile ?? fallbackProfile,
        progress: progress ?? fallbackProgress,
        roles: Array.isArray(rolesRows) ? rolesRows.map((r: { role: string }) => r.role) : [],
        redemptions: redemptions ?? [],
        warnings,
        diagnostics: { action, target_user_id, warnings_count: warnings.length },
      });
    }

    if (action === "grant_premium") {
      if (!target_user_id) return fail("Usuário obrigatório", { action, error_stage: "validate_target", http_status: 400 });
      const d = Number.isFinite(days) && days > 0 ? days : 30;
      const src = source || "admin";
      const { data: cur, error: currentError } = await admin.from("profiles").select("premium_until").eq("user_id", target_user_id).maybeSingle();
      if (currentError) return fail(currentError.message, { action, target_user_id, error_stage: "load_profile_for_premium", http_status: 500 });

      const base = cur?.premium_until && new Date(cur.premium_until) > new Date() ? new Date(cur.premium_until) : new Date();
      base.setDate(base.getDate() + d);
      const { error } = await admin
        .from("profiles")
        .update({ is_premium: true, premium_source: src, premium_until: base.toISOString() })
        .eq("user_id", target_user_id);
      if (error) return fail(error.message, { action, target_user_id, error_stage: "grant_premium", http_status: 500 });
      return respond(true, { success: true, premium_until: base.toISOString() });
    }

    if (action === "revoke_premium") {
      if (!target_user_id) return fail("Usuário obrigatório", { action, error_stage: "validate_target", http_status: 400 });
      const { error } = await admin
        .from("profiles")
        .update({ is_premium: false, premium_source: null, premium_until: null })
        .eq("user_id", target_user_id);
      if (error) return fail(error.message, { action, target_user_id, error_stage: "revoke_premium", http_status: 500 });
      return respond(true, { success: true });
    }

    if (action === "reset_progress") {
      if (!target_user_id) return fail("Usuário obrigatório", { action, error_stage: "validate_target", http_status: 400 });
      const { error } = await admin
        .from("user_progress")
        .update({
          completed_lessons: [],
          completed_modules: [],
          completed_quizzes: [],
          completed_exercises: [],
          xp: 0,
          level: 1,
          streak: 0,
        })
        .eq("user_id", target_user_id);
      if (error) return fail(error.message, { action, target_user_id, error_stage: "reset_progress", http_status: 500 });
      return respond(true, { success: true });
    }

    if (action === "generate_password_reset_link") {
      if (!target_user_id) return fail("Usuário obrigatório", { action, error_stage: "validate_target", http_status: 400 });
      const redirectTo = body.redirect_to;
      if (!isAllowedResetRedirect(redirectTo)) {
        return fail("URL de redefinição inválida", { action, target_user_id, error_stage: "validate_redirect", http_status: 400 });
      }

      const { data: targetUserData, error: targetUserError } = await admin.auth.admin.getUserById(target_user_id);
      const targetEmail = targetUserData?.user?.email;
      if (targetUserError || !targetEmail) {
        return fail("Usuário não encontrado para redefinição", { action, target_user_id, error_stage: "load_target_user", http_status: 404 });
      }

      const { data: generated, error } = await admin.auth.admin.generateLink({
        type: "recovery",
        email: targetEmail,
        options: { redirectTo: redirectTo as string },
      });
      if (error) return fail(error.message, { action, target_user_id, error_stage: "generate_recovery_link", http_status: 500 });

      const actionLink = (generated as any)?.properties?.action_link ?? (generated as any)?.action_link ?? null;
      if (!actionLink) {
        return fail("Não foi possível gerar o link de redefinição", { action, target_user_id, error_stage: "missing_action_link", http_status: 500 });
      }

      return respond(true, { success: true, action_link: actionLink, email: targetEmail });
    }

    if (gift_code_id) {
      console.log("gift_code_id received", gift_code_id);
    }

    return fail("Ação inválida", { action, target_user_id, error_stage: "invalid_action", http_status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("admin-manage crash", { action, target_user_id, message, stack: error instanceof Error ? error.stack : null });
    return fail(message, { action, target_user_id, error_stage: "unhandled_exception", http_status: 500 });
  }
});