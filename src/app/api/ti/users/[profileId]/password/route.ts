import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import { AUTH_COOKIE_NAMES } from "@/auth/supabase-session.mjs";
import { resetUserPassword } from "@/auth/admin-credentials.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ profileId: string }>;
};

function json(status: number, body: Record<string, unknown>, session?: {
  refreshed?: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number | null;
}) {
  const response = NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
  if (session?.refreshed && session.accessToken && session.refreshToken) {
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

export async function POST(request: NextRequest, context: RouteContext) {
  const authorization = await authorizeNextRequest(request, {
    allowedRoles: ["ti"],
  });
  if (!authorization.authorized || !authorization.session) {
    return json(authorization.status, {
      error: authorization.status === 401
        ? "Autenticação necessária."
        : authorization.status === 403
          ? "Operação restrita à TI."
          : "Não foi possível validar a sessão.",
    });
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json(400, { error: "Solicitação inválida." }, authorization.session);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Solicitação inválida." }, authorization.session);
  }

  const password = body && typeof body === "object"
    ? (body as { password?: unknown }).password
    : undefined;

  let profileId: string;
  try {
    ({ profileId } = await context.params);
  } catch {
    return json(400, { error: "Identificador de conta inválido." }, authorization.session);
  }

  try {
    const result = await resetUserPassword({
      actor: {
        id: authorization.session.user.id,
        role: authorization.session.user.role,
        isActive: true,
      },
      profileId,
      password,
    });
    return json(200, { success: true, user: result }, authorization.session);
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error
      ? Number((error as { status: number }).status)
      : 503;
    return json([400, 403, 404, 503].includes(status) ? status : 503, {
      error: error instanceof Error ? error.message : "Não foi possível redefinir a senha.",
    }, authorization.session);
  }
}
