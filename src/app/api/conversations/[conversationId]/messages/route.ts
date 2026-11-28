import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import {
  decodeMessageCursor,
  fetchMessagePage,
} from "@/messaging/message-history.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> },
) {
  const authorization = await authorizeNextRequest(request);
  if (!authorization.authorized || !authorization.session) {
    return json(authorization.status, {
      error: authorization.status === 401
        ? "Sessão inválida ou expirada."
        : authorization.status === 403
          ? "Perfil sem autorização."
          : "Não foi possível validar a sessão.",
    });
  }

  const { conversationId } = await context.params;
  const cursor = decodeMessageCursor(request.nextUrl.searchParams.get("cursor"));
  if (cursor === undefined) {
    return json(400, { error: "Cursor de paginação inválido." });
  }

  const result = await fetchMessagePage({
    conversationId,
    accessToken: authorization.session.accessToken,
    cursor,
  });

  if (!result.ok) {
    return json(result.status, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403
          ? "Você não tem permissão para consultar esta conversa."
          : result.status === 400
            ? "Solicitação inválida."
            : "Histórico temporariamente indisponível.",
    });
  }

  return json(200, {
    messages: result.messages,
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  });
}
