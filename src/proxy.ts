import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/auth/supabase-session.mjs";
import { authorizeTIConsoleRequest } from "@/auth/ti-console.mjs";

export async function proxy(request: NextRequest) {
  const authorization = await authorizeTIConsoleRequest(request);

  if (!authorization.authorized || !authorization.session) {
    if (authorization.status === 401) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("motivo", "sessao-expirada");
      const response = NextResponse.redirect(loginUrl);
      clearSessionCookies(response);
      return response;
    }

    if (authorization.status === 403) {
      return NextResponse.redirect(
        new URL("/acesso-negado?area=ti", request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/indisponivel?area=ti", request.url),
    );
  }

  const response = NextResponse.next();
  if (authorization.session.refreshed) {
    setSessionCookies(response, authorization.session);
  }
  return response;
}

function clearSessionCookies(response: NextResponse) {
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

function setSessionCookies(
  response: NextResponse,
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number | null;
  },
) {
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

export const config = {
  matcher: ["/ti/:path*"],
};
