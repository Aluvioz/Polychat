import {
  AUTH_COOKIE_NAMES,
  validateSession,
} from "./supabase-session.mjs";
import { isRoleAllowed, normalizeAllowedRoles } from "./authorization.mjs";
import { evaluateDeviceCompatibility } from "./device-compatibility.mjs";

/**
 * Next.js App Router adapter for the existing session and role rules.
 * The session service remains the source of truth for JWT/profile/account state.
 */
export async function authorizeNextRequest(
  request,
  {
    allowedRoles = ["user", "ti"],
    validate = validateSession,
    enforceDeviceCompatibility = false,
    preserveSessionOnForbidden = false,
  } = {},
) {
  const roles = normalizeAllowedRoles(allowedRoles);
  if (typeof validate !== "function") {
    throw new TypeError("A função de validação de sessão é obrigatória.");
  }
  if (typeof enforceDeviceCompatibility !== "boolean") {
    throw new TypeError("A opção de compatibilidade de dispositivo deve ser booleana.");
  }
  if (typeof preserveSessionOnForbidden !== "boolean") {
    throw new TypeError("A opção de preservação de sessão deve ser booleana.");
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

    if (enforceDeviceCompatibility) {
      const deviceCompatibility = evaluateDeviceCompatibility({
        role: session.user.role,
        userAgent: request.headers?.get?.("user-agent") ?? "",
      });

      if (!deviceCompatibility.compatible) {
        return {
          authorized: false,
          status: 403,
          reason: "DEVICE_NOT_SUPPORTED",
          message: deviceCompatibility.message,
          deviceCompatibility,
          // Preserve the validated session for refreshed-cookie rotation on denial.
          session,
        };
      }

      return { authorized: true, status: 200, session, deviceCompatibility };
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
