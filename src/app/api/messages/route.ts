import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import {
  persistTextMessage,
  validateTextMessageInput,
} from "@/messaging/message-service.mjs";

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

  const input = validateTextMessageInput(payload);
  if (!input.ok) {
    return json(400, {
      error: input.reason === "empty_message"
        ? "A mensagem não pode estar vazia."
        : "Informe uma conversa e uma mensagem válidas.",
    });
  }

  const result = await persistTextMessage({
    conversationId: input.conversationId,
    senderProfileId: authorization.session.user.id,
    body: input.body,
    accessToken: authorization.session.accessToken,
  });

  if (!result.ok) {
    return json(result.status, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403
          ? "Você não tem permissão para enviar mensagens nesta conversa."
          : result.status === 400
            ? "Não foi possível registrar a mensagem."
            : "Serviço de mensagens indisponível.",
    });
  }

  // A 201 is returned only after PostgREST confirms the persisted row.
  return json(201, { message: result.message });
}
