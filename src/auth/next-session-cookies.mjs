import { AUTH_COOKIE_NAMES } from "./supabase-session.mjs";

/**
 * Persists rotated HttpOnly cookies when the shared session validator refreshed
 * a session while authorizing a Next.js route.
 */
export function applyRefreshedSessionCookies(response, session, env = process.env) {
  if (!session?.refreshed) return response;

  const common = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  response.cookies.set(AUTH_COOKIE_NAMES.access, session.accessToken, {
    ...common,
    ...(session.expiresIn ? { maxAge: session.expiresIn } : {}),
  });
  response.cookies.set(AUTH_COOKIE_NAMES.refresh, session.refreshToken, common);
  return response;
}
