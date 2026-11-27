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
        : input.reason === "invalid_message_id"
          ? "Informe um identificador de mensagem válido."
          : "Informe uma conversa e uma mensagem válidas.",
    });
  }

  const result = await persistTextMessage({
    id: input.id,
    conversationId: input.conversationId,
    senderProfileId: authorization.session.user.id,
    body: input.body,
    accessToken: authorization.session.accessToken,
  });

  if (!("message" in result) || !("created" in result)) {
    return json(result.status ?? 503, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403
          ? "Você não tem permissão para enviar mensagens nesta conversa."
          : result.status === 409
            ? "O identificador desta mensagem já foi utilizado com outros dados."
            : result.status === 400
              ? "Não foi possível registrar a mensagem."
              : "Serviço de mensagens indisponível.",
    });
  }

  // A new row returns 201; an identical retry returns the original row as 200.
  return json(result.created ? 201 : 200, { message: result.message });
}
