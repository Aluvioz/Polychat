import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/auth/supabase-session.mjs";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import {
  MAX_ATTACHMENT_BYTES,
  validateAttachment,
} from "@/storage/attachment-validation.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "attachments";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

type Session = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number | null;
  user: { id: string };
  refreshed: boolean;
};

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

function setSessionCookies(
  response: NextResponse,
  session: Session,
) {
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

function cleanFilename(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
}

function parseAttachmentMetadata(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }
  const value = payload as Record<string, unknown>;
  const filename = cleanFilename(value.filename);
  const extension = filename.includes(".")
    ? filename.split(".").pop()!.toLowerCase()
    : "";
  const mimeType = MIME_BY_EXTENSION[extension];
  const sizeBytes = value.sizeBytes;
  const messageId = value.messageId;
  if (
    !filename ||
    !mimeType ||
    value.mimeType !== mimeType ||
    typeof sizeBytes !== "number" ||
    !Number.isSafeInteger(sizeBytes) ||
    sizeBytes < 1 ||
    sizeBytes > MAX_ATTACHMENT_BYTES ||
    typeof messageId !== "string" ||
    !UUID_PATTERN.test(messageId)
  ) {
    return null;
  }
  return { filename, extension, mimeType, sizeBytes, messageId };
}

function storagePathUrl(baseUrl: string, path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/storage/v1/object/${BUCKET}/${encodedPath}`;
}

async function removeUploadedObject(baseUrl: string, path: string, secretKey: string) {
  try {
    await fetch(storagePathUrl(baseUrl, path), {
      method: "DELETE",
      headers: apiHeaders(secretKey),
      cache: "no-store",
    });
  } catch {
    // Keep provider details and credentials out of the caller response.
  }
}

async function findOwnedMessage(
  baseUrl: string,
  publishableKey: string,
  session: Session,
  messageId: string,
) {
  const url = new URL(`${baseUrl}/rest/v1/messages`);
  url.searchParams.set("select", "id,sender_profile_id");
  url.searchParams.set("id", `eq.${messageId}`);
  url.searchParams.set("limit", "1");
  const response = await fetch(url, {
    headers: {
      ...apiHeaders(publishableKey, session.accessToken),
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) return { ok: false as const, status: response.status };
  const rows = await response.json().catch(() => null);
  const message = Array.isArray(rows) ? rows[0] : null;
  if (!message) return { ok: false as const, status: 404 };
  if (message.sender_profile_id !== session.user.id) {
    return { ok: false as const, status: 403 };
  }
  return { ok: true as const };
}

function respond(status: number, body: Record<string, unknown>, session: Session) {
  const response = json(status, body);
  if (session.refreshed) setSessionCookies(response, session);
  return response;
}

async function getConfiguration() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !publishableKey || !secretKey) return null;
  return { baseUrl, publishableKey, secretKey };
}

/**
 * Phase 1: authorize the message and issue a one-object signed upload URL.
 * The browser sends file bytes directly to Supabase Storage, not through Vercel.
 */
export async function POST(request: NextRequest) {
  const authorization = await authorizeNextRequest(request, {
    enforceDeviceCompatibility: true,
  });
  if (!authorization.authorized || !authorization.session) {
    return json(authorization.status, {
      error: authorization.message ?? "Autenticação necessária.",
      ...(authorization.reason ? { code: authorization.reason } : {}),
    });
  }
  const session = authorization.session as Session;
  const respondWithSession = (status: number, body: Record<string, unknown>) =>
    respond(status, body, session);

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return respondWithSession(400, { error: "Solicitação inválida." });
  }

  const payload = await request.json().catch(() => null);
  const metadata = parseAttachmentMetadata(payload);
  if (!metadata) {
    return respondWithSession(400, {
      error: "Informe mensagem, nome, formato e tamanho válidos (até 10 MiB).",
    });
  }

  const config = await getConfiguration();
  if (!config) {
    return respondWithSession(503, { error: "Armazenamento indisponível." });
  }

  let ownedMessage;
  try {
    ownedMessage = await findOwnedMessage(
      config.baseUrl,
      config.publishableKey,
      session,
      metadata.messageId,
    );
  } catch {
    return respondWithSession(503, { error: "Não foi possível validar a mensagem." });
  }
  if (!ownedMessage.ok) {
    return respondWithSession(
      ownedMessage.status === 403 ? 403 : ownedMessage.status === 404 ? 404 : 503,
      { error: ownedMessage.status === 403
        ? "Você não pode anexar arquivos a esta mensagem."
        : ownedMessage.status === 404
          ? "Mensagem não encontrada."
          : "Não foi possível validar a mensagem." },
    );
  }

  const path = `${metadata.messageId}/${randomUUID()}.${metadata.extension}`;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  let signedResponse: Response;
  try {
    signedResponse = await fetch(
      `${config.baseUrl}/storage/v1/object/upload/sign/${BUCKET}/${encodedPath}`,
      {
        method: "POST",
        headers: {
          ...apiHeaders(config.secretKey),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        cache: "no-store",
      },
    );
  } catch {
    return respondWithSession(503, { error: "Não foi possível preparar o upload." });
  }
  if (!signedResponse.ok) {
    return respondWithSession(503, { error: "Não foi possível preparar o upload." });
  }

  const signedPayload = await signedResponse.json().catch(() => null);
  if (!signedPayload || typeof signedPayload.url !== "string") {
    return respondWithSession(503, { error: "Não foi possível preparar o upload." });
  }
  let signedUrl: URL;
  try {
    signedUrl = new URL(signedPayload.url, `${config.baseUrl}/storage/v1/`);
  } catch {
    return respondWithSession(503, { error: "Não foi possível preparar o upload." });
  }
  const token = signedUrl.searchParams.get("token");
  if (!token || signedUrl.origin !== new URL(config.baseUrl).origin) {
    return respondWithSession(503, { error: "Não foi possível preparar o upload." });
  }

  return respondWithSession(201, {
    upload: {
      path,
      signedUrl: signedUrl.toString(),
      token,
      expiresInSeconds: 7200,
      method: "PUT",
      contentType: metadata.mimeType,
    },
  });
}

/**
 * Phase 2: read the uploaded object server-side, validate the actual bytes,
 * then register metadata with the caller JWT so RLS remains authoritative.
 */
export async function PUT(request: NextRequest) {
  const authorization = await authorizeNextRequest(request, {
    enforceDeviceCompatibility: true,
  });
  if (!authorization.authorized || !authorization.session) {
    return json(authorization.status, {
      error: authorization.message ?? "Autenticação necessária.",
      ...(authorization.reason ? { code: authorization.reason } : {}),
    });
  }
  const session = authorization.session as Session;
  const respondWithSession = (status: number, body: Record<string, unknown>) =>
    respond(status, body, session);

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return respondWithSession(400, { error: "Solicitação inválida." });
  }
  const payload = await request.json().catch(() => null);
  const metadata = parseAttachmentMetadata(payload);
  const path = payload && typeof payload === "object"
    ? (payload as Record<string, unknown>).path
    : null;
  if (
    !metadata ||
    typeof path !== "string" ||
    !path.startsWith(`${metadata.messageId}/`) ||
    !new RegExp(`^${metadata.messageId}/[0-9a-f-]{36}\\.${metadata.extension}$`, "i").test(path)
  ) {
    return respondWithSession(400, { error: "Referência de upload inválida." });
  }

  const config = await getConfiguration();
  if (!config) {
    return respondWithSession(503, { error: "Armazenamento indisponível." });
  }

  let ownedMessage;
  try {
    ownedMessage = await findOwnedMessage(
      config.baseUrl,
      config.publishableKey,
      session,
      metadata.messageId,
    );
  } catch {
    return respondWithSession(503, { error: "Não foi possível validar a mensagem." });
  }
  if (!ownedMessage.ok) {
    return respondWithSession(
      ownedMessage.status === 403 ? 403 : ownedMessage.status === 404 ? 404 : 503,
      { error: ownedMessage.status === 403
        ? "Você não pode anexar arquivos a esta mensagem."
        : ownedMessage.status === 404
          ? "Mensagem não encontrada."
          : "Não foi possível validar a mensagem." },
    );
  }

  const objectUrl = storagePathUrl(config.baseUrl, path);
  let objectResponse: Response;
  try {
    objectResponse = await fetch(objectUrl, {
      headers: apiHeaders(config.secretKey),
      cache: "no-store",
    });
  } catch {
    return respondWithSession(503, { error: "Não foi possível validar o arquivo armazenado." });
  }
  if (!objectResponse.ok) {
    return respondWithSession(objectResponse.status === 404 ? 409 : 503, {
      error: objectResponse.status === 404
        ? "O upload ainda não foi concluído."
        : "Não foi possível validar o arquivo armazenado.",
    });
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await objectResponse.arrayBuffer());
  } catch {
    await removeUploadedObject(config.baseUrl, path, config.secretKey);
    return respondWithSession(503, { error: "Não foi possível validar o arquivo armazenado." });
  }

  const validation = validateAttachment({
    filename: metadata.filename,
    mimeType: metadata.mimeType,
    bytes,
  });
  if (!validation.ok || bytes.length !== metadata.sizeBytes) {
    await removeUploadedObject(config.baseUrl, path, config.secretKey);
    return respondWithSession(
      validation.status === 413 ? 413 : 415,
      { error: "O conteúdo armazenado não corresponde a um PDF/JPEG válido ou ao tamanho informado." },
    );
  }

  let attachmentResponse: Response;
  try {
    attachmentResponse = await fetch(`${config.baseUrl}/rest/v1/attachments`, {
      method: "POST",
      headers: {
        ...apiHeaders(config.publishableKey, session.accessToken),
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        message_id: metadata.messageId,
        storage_reference: path,
        original_filename: validation.filename,
        mime_type: validation.mimeType,
        size_bytes: validation.sizeBytes,
      }),
      cache: "no-store",
    });
  } catch {
    await removeUploadedObject(config.baseUrl, path, config.secretKey);
    return respondWithSession(503, { error: "Não foi possível registrar o anexo." });
  }
  if (!attachmentResponse.ok) {
    await removeUploadedObject(config.baseUrl, path, config.secretKey);
    return respondWithSession(
      attachmentResponse.status === 401 || attachmentResponse.status === 403 ? 403 : 503,
      { error: "Não foi possível registrar o anexo." },
    );
  }

  const inserted = await attachmentResponse.json().catch(() => null);
  const attachment = Array.isArray(inserted) ? inserted[0] : null;
  if (!attachment?.id) {
    await removeUploadedObject(config.baseUrl, path, config.secretKey);
    return respondWithSession(503, { error: "Não foi possível confirmar o registro do anexo." });
  }

  return respondWithSession(201, {
    attachment: {
      id: attachment.id,
      messageId: metadata.messageId,
      filename: validation.filename,
      mimeType: validation.mimeType,
      sizeBytes: validation.sizeBytes,
      storageReference: path,
    },
  });
}
