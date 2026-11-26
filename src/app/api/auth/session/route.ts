import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/auth/supabase-session.mjs";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clearSession(response: NextResponse) {
  const common = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  response.cookies.set(AUTH_COOKIE_NAMES.access, "", common);
  response.cookies.set(AUTH_COOKIE_NAMES.refresh, "", common);
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeNextRequest(request);
  if (!authorization.authorized || !authorization.session) {
    const response = NextResponse.json({
      error: authorization.status === 401
        ? "Sessão inválida ou expirada."
        : authorization.status === 403
          ? "Perfil sem autorização."
          : "Não foi possível validar a sessão.",
    }, {
      status: authorization.status,
      headers: { "Cache-Control": "no-store" },
    });
    if (authorization.status !== 403) clearSession(response);
    return response;
  }

  const session = authorization.session;
  const response = NextResponse.json({ user: session.user }, {
    headers: { "Cache-Control": "no-store" },
  });
  if (session.refreshed) {
    const common = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };
    response.cookies.set(AUTH_COOKIE_NAMES.access, session.accessToken, {
      ...common,
      ...(session.expiresIn ? { maxAge: session.expiresIn } : {}),
    });
    response.cookies.set(AUTH_COOKIE_NAMES.refresh, session.refreshToken, common);
  }
  return response;
}
