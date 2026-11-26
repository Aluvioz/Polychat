import { authorizeNextRequest } from "./next-authorization.mjs";

/**
 * Restricts the TI console to the existing "ti" role.
 * Session validation, account status and role lookup remain centralized in
 * the Issue #105 adapter; this function does not introduce a new auth flow.
 */
export function authorizeTIConsoleRequest(request, options = {}) {
  return authorizeNextRequest(request, {
    ...options,
    allowedRoles: ["ti"],
  });
}
