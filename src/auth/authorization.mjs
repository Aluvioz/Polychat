/**
 * Server-side authorization for Polychat.
 *
 * The Supabase client passed here must be created on the server. Never expose
 * a service-role key to the browser.
 */

const ALLOWED_ROLES = new Set(["user", "ti"]);

function send(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * Express-compatible middleware. It validates the JWT with Supabase Auth and
 * loads role/status from the database; request body, query and client metadata
 * are never used as an authorization source.
 */
export function requireAuthenticatedUser({ supabase }) {
  if (!supabase?.auth?.getUser || !supabase?.from) {
    throw new TypeError("A valid server-side Supabase client is required.");
  }

  return async function authenticatedUser(req, res, next) {
    const authorization = req.headers?.authorization ?? "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (!match) return send(res, 401, "Autenticação necessária.");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser(match[1]);

      if (authError || !authData?.user) {
        return send(res, 401, "Sessão inválida ou expirada.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, is_active")
        .eq("id", authData.user.id)
        .maybeSingle();

      // Fail closed: database/profile errors must never grant access.
      if (profileError) {
        return send(res, 503, "Não foi possível validar as permissões.");
      }

      if (!profile || !ALLOWED_ROLES.has(profile.role)) {
        return send(res, 403, "Perfil sem autorização.");
      }

      if (profile.is_active !== true) {
        return send(res, 403, "Conta inativa. Contate a equipe de TI.");
      }

      req.authUser = {
        id: authData.user.id,
        email: authData.user.email ?? null,
        role: profile.role,
        isActive: true,
      };

      return next();
    } catch {
      return send(res, 503, "Não foi possível validar a autenticação.");
    }
  };
}

/** Restricts a route to one or more roles after authentication middleware. */
export function requireRole(...allowedRoles) {
  const roles = new Set(allowedRoles);

  if (roles.size === 0 || [...roles].some((role) => !ALLOWED_ROLES.has(role))) {
    throw new TypeError("Informe ao menos uma role válida: user ou ti.");
  }

  return function roleAuthorization(req, res, next) {
    if (!req.authUser) return send(res, 401, "Autenticação necessária.");
    if (!req.authUser.isActive) {
      return send(res, 403, "Conta inativa. Contate a equipe de TI.");
    }
    if (!roles.has(req.authUser.role)) {
      return send(res, 403, "Você não tem permissão para acessar este recurso.");
    }
    return next();
  };
}
