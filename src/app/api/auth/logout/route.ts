import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, logoutSession } from "@/auth/supabase-session.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.access)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value;
  try {
    await logoutSession({ accessToken, refreshToken });
  } catch {
    // Always clear the browser session, even if the provider is unavailable.
  }

  const response = NextResponse.json({ success: true }, {
    headers: { "Cache-Control": "no-store" },
  });
  const common = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  response.cookies.set(AUTH_COOKIE_NAMES.access, "", common);
  response.cookies.set(AUTH_COOKIE_NAMES.refresh, "", common);
  return response;
}
