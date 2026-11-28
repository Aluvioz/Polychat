import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import { listRecentConversations } from "@/conversations/recent-conversations-service.mjs";
import { applyRefreshedSessionCookies } from "@/auth/next-session-cookies.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeNextRequest(request, { allowedRoles: ["user"] });
  if (!authorization.authorized || !authorization.session) {
    return json(authorization.status, {
      error: authorization.status === 401
        ? "Sessão inválida ou expirada."
        : authorization.status === 403
          ? "Esta área está disponível somente para o perfil Usuário."
          : "Não foi possível validar a sessão.",
    });
  }

  const result = await listRecentConversations({
    accessToken: authorization.session.accessToken,
  });

  if (!result.ok) {
    const status = result.status ?? 503;
    return json(status, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403
          ? "Você não tem acesso às conversas."
          : "Não foi possível carregar as conversas.",
    });
  }

  const response = json(200, {
    user: authorization.session.user,
    conversations: result.conversations,
  });
  return applyRefreshedSessionCookies(response, authorization.session);
}
