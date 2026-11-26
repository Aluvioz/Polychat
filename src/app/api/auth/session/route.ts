import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, validateSession } from "@/auth/supabase-session.mjs";

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
  try {
    const session = await validateSession({
      accessToken: request.cookies.get(AUTH_COOKIE_NAMES.access)?.value ?? null,
      refreshToken: request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value ?? null,
    });
    if (!session) {
      const response = NextResponse.json({ error: "Sessão inválida ou expirada." }, {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      });
      clearSession(response);
      return response;
    }

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
  } catch {
    const response = NextResponse.json({ error: "Não foi possível validar a sessão." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
    clearSession(response);
    return response;
  }
}
