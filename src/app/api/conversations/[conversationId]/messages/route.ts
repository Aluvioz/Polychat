import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import { listConversationMessages } from "@/conversations/conversation-messages-service.mjs";
import { applyRefreshedSessionCookies } from "@/auth/next-session-cookies.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ conversationId: string }> };

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
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

  const { conversationId } = await context.params;
  const beforeCreatedAt = request.nextUrl.searchParams.get("beforeCreatedAt");
  const beforeMessageId = request.nextUrl.searchParams.get("beforeMessageId");
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const limit = rawLimit === null ? 50 : Number(rawLimit);

  const result = await listConversationMessages({
    accessToken: authorization.session.accessToken,
    conversationId,
    beforeCreatedAt,
    beforeMessageId,
    limit,
  });

  if (!result.ok) {
    return json(result.status, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403 || result.status === 404
          ? "Conversa indisponível ou sem acesso autorizado."
          : result.status === 400
            ? "Parâmetros de consulta inválidos."
            : "Não foi possível carregar as mensagens.",
    });
  }

  const response = json(200, {
    user: authorization.session.user,
    messages: result.messages,
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  });
  return applyRefreshedSessionCookies(response, authorization.session);
}
