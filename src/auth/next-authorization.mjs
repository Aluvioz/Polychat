import {
  AUTH_COOKIE_NAMES,
  validateSession,
} from "./supabase-session.mjs";
import { isRoleAllowed, normalizeAllowedRoles } from "./authorization.mjs";

/**
 * Next.js App Router adapter for the existing session and role rules.
 * The session service remains the source of truth for JWT/profile/account state.
 */
export async function authorizeNextRequest(
  request,
  { allowedRoles = ["user", "ti"], validate = validateSession, preserveSessionOnForbidden = false } = {},
) {
  const roles = normalizeAllowedRoles(allowedRoles);
  if (typeof validate !== "function") {
    throw new TypeError("A função de validação de sessão é obrigatória.");
  }

  try {
    const session = await validate({
      accessToken: request.cookies.get(AUTH_COOKIE_NAMES.access)?.value ?? null,
      refreshToken: request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value ?? null,
    });

    if (!session) {
      return { authorized: false, status: 401, session: null };
    }

    if (!isRoleAllowed(session.user?.role, roles)) {
      return {
        authorized: false,
        status: 403,
        session: preserveSessionOnForbidden ? session : null,
      };
    }

    return { authorized: true, status: 200, session };
  } catch (error) {
    return {
      authorized: false,
      status: error?.status === 401 ? 401 : 503,
      session: null,
    };
  }
}
