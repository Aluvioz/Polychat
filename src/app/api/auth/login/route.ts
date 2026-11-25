import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, loginWithUsername } from "@/auth/supabase-session.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function setSessionCookies(response: NextResponse, session: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number | null;
}) {
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
  // A session cookie avoids inventing a refresh-token lifetime; Supabase Auth
  // remains the authority for refresh-token validity and rotation.
  response.cookies.set(AUTH_COOKIE_NAMES.refresh, session.refreshToken, common);
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Solicitação inválida." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitação inválida." }, { status: 400 });
  }

  const credentials = body && typeof body === "object"
    ? body as { username?: unknown; password?: unknown }
    : {};
  try {
    const session = await loginWithUsername({
      username: typeof credentials.username === "string" ? credentials.username : "",
      password: typeof credentials.password === "string" ? credentials.password : "",
    });
    const response = NextResponse.json({ user: session.user }, {
      headers: { "Cache-Control": "no-store" },
    });
    setSessionCookies(response, session);
    return response;
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error
      ? Number((error as { status: number }).status)
      : 503;
    return NextResponse.json({
      error: status === 401 ? "Usuário ou senha inválidos." : "Não foi possível iniciar a sessão.",
    }, {
      status: status === 401 ? 401 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
