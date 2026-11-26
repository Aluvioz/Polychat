import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAMES,
  validateSession,
} from "@/auth/supabase-session.mjs";
import {
  MAX_ATTACHMENT_BYTES,
  validateAttachment,
} from "@/storage/attachment-validation.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "attachments";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function apiHeaders(apiKey: string, accessToken?: string) {
  return {
    apikey: apiKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function removeUploadedObject(
  storageUrl: string,
  secretKey: string,
) {
  try {
    await fetch(storageUrl, {
      method: "DELETE",
      headers: apiHeaders(secretKey),
      cache: "no-store",
    });
  } catch {
    // Do not expose provider details or credentials to the caller.
  }
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.access)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value;

  let session;
  try {
    session = await validateSession({ accessToken, refreshToken });
  } catch {
    return json(503, { error: "Não foi possível validar a sessão." });
  }
  if (!session) return json(401, { error: "Autenticação necessária." });

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !publishableKey || !secretKey) {
    return json(503, { error: "Armazenamento indisponível." });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: "Solicitação inválida." });
  }

  const messageId = form.get("messageId");
  const file = form.get("file");
  if (
    typeof messageId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(messageId) ||
    !(file instanceof File)
  ) {
    return json(400, { error: "Informe uma mensagem e um arquivo válidos." });
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return json(413, { error: "O arquivo excede o limite de 10 MB." });
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return json(400, { error: "Não foi possível ler o arquivo enviado." });
  }

  const validation = validateAttachment({
    filename: file.name,
    mimeType: file.type,
    bytes,
  });
  if (!validation.ok) {
    const message = validation.status === 413
      ? "O arquivo excede o limite de 10 MB."
      : validation.status === 415
        ? "Envie somente um PDF ou JPEG válido."
        : "O arquivo enviado é inválido.";
    return json(validation.status, { error: message });
  }

  // This read is performed with the caller's JWT. RLS hides messages the
  // caller cannot read; the sender check matches attachments_insert_member.
  const messageUrl = new URL(`${baseUrl}/rest/v1/messages`);
  messageUrl.searchParams.set("select", "id,sender_profile_id");
  messageUrl.searchParams.set("id", `eq.${messageId}`);
  messageUrl.searchParams.set("limit", "1");

  let messageResponse: Response;
  try {
    messageResponse = await fetch(messageUrl, {
      headers: {
        ...apiHeaders(publishableKey, session.accessToken),
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    return json(503, { error: "Não foi possível validar a mensagem." });
  }

  if (!messageResponse.ok) {
    return messageResponse.status >= 500
      ? json(503, { error: "Não foi possível validar a mensagem." })
      : json(404, { error: "Mensagem não encontrada." });
  }

  const messages = await messageResponse.json().catch(() => null);
  const message = Array.isArray(messages) ? messages[0] : null;
  if (!message) return json(404, { error: "Mensagem não encontrada." });
  if (message.sender_profile_id !== session.user.id) {
    return json(403, { error: "Você não pode anexar arquivos a esta mensagem." });
  }

  const objectPath = `${messageId}/${randomUUID()}.${validation.extension}`;
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  const storageUrl = `${baseUrl}/storage/v1/object/${BUCKET}/${encodedPath}`;

  let uploadResponse: Response;
  try {
    // The secret key is used only server-side. No Storage policy is opened to
    // browser roles; the bucket remains private and upload is mediated here.
    uploadResponse = await fetch(storageUrl, {
      method: "POST",
      headers: {
        ...apiHeaders(secretKey),
        "Content-Type": validation.mimeType,
        "x-upsert": "false",
        "cache-control": "max-age=0",
      },
      body: Buffer.from(bytes),
      cache: "no-store",
    });
  } catch {
    return json(503, { error: "Não foi possível armazenar o anexo." });
  }

  if (!uploadResponse.ok) {
    return json(503, { error: "Não foi possível armazenar o anexo." });
  }

  let attachmentResponse: Response;
  try {
    attachmentResponse = await fetch(`${baseUrl}/rest/v1/attachments`, {
      method: "POST",
      headers: {
        ...apiHeaders(publishableKey, session.accessToken),
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        message_id: messageId,
        storage_reference: objectPath,
        original_filename: validation.filename,
        mime_type: validation.mimeType,
        size_bytes: validation.sizeBytes,
      }),
      cache: "no-store",
    });
  } catch {
    await removeUploadedObject(storageUrl, secretKey);
    return json(503, { error: "Não foi possível registrar o anexo." });
  }

  if (!attachmentResponse.ok) {
    await removeUploadedObject(storageUrl, secretKey);
    return attachmentResponse.status === 401 || attachmentResponse.status === 403
      ? json(403, { error: "Você não tem permissão para anexar este arquivo." })
      : json(503, { error: "Não foi possível registrar o anexo." });
  }

  const inserted = await attachmentResponse.json().catch(() => null);
  const attachment = Array.isArray(inserted) ? inserted[0] : null;
  if (!attachment?.id) {
    await removeUploadedObject(storageUrl, secretKey);
    return json(503, { error: "Não foi possível confirmar o registro do anexo." });
  }

  return json(201, {
    attachment: {
      id: attachment.id,
      messageId,
      filename: validation.filename,
      mimeType: validation.mimeType,
      sizeBytes: validation.sizeBytes,
    },
  });
}
