import { authorizeNextRequest } from "./next-authorization.mjs";

/**
 * Restricts the TI console to the existing "ti" role.
 * Session validation, account status and role lookup remain centralized in
 * the Issue #105 adapter. Preserve refreshed cookies even when role is denied.
 */
export function authorizeTIConsoleRequest(request, options = {}) {
  return authorizeNextRequest(request, {
    ...options,
    allowedRoles: ["ti"],
    preserveSessionOnForbidden: true,
  });
}
