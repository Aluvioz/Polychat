import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import {
  openDirectConversation,
  validateDirectConversationInput,
} from "@/conversations/direct-conversation-service.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
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

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json(400, { error: "Solicitação inválida." });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Solicitação inválida." });
  }

  const input = validateDirectConversationInput(payload);
  if (!input.ok) {
    return json(400, { error: "Informe um destinatário válido." });
  }

  const result = await openDirectConversation({
    otherProfileId: input.otherProfileId,
    actorProfileId: authorization.session.user.id,
    accessToken: authorization.session.accessToken,
  });

  if ("status" in result) {
    return json(result.status, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403
          ? "Destinatário indisponível ou conversa sem acesso autorizado."
          : result.status === 400
            ? "Não foi possível abrir uma conversa com esse destinatário."
            : "Serviço de conversas indisponível.",
    });
  }

  return json(200, { conversationId: result.conversationId });
}
