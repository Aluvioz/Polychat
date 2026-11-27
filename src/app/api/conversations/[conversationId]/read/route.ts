import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import { markConversationMessagesRead } from "@/conversations/conversation-messages-service.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ conversationId: string }> };

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
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

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json(400, { error: "Solicitação inválida." });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Solicitação inválida." });
  }

  const messageIds = payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as { messageIds?: unknown }).messageIds
    : null;
  if (!Array.isArray(messageIds) || messageIds.length > 100 ||
      !messageIds.every((id) => typeof id === "string")) {
    return json(400, { error: "Lista de mensagens inválida." });
  }

  const { conversationId } = await context.params;
  const result = await markConversationMessagesRead({
    accessToken: authorization.session.accessToken,
    conversationId,
    readerProfileId: authorization.session.user.id,
    messageIds,
  });

  if (!result.ok) {
    return json(result.status, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403 || result.status === 404
          ? "Conversa indisponível ou sem acesso autorizado."
          : result.status === 400
            ? "Lista de mensagens inválida."
            : "Não foi possível registrar as leituras.",
    });
  }

  return json(200, { recorded: result.recorded });
}
