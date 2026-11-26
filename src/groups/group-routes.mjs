import { NextResponse } from "next/server";
import { authorizeNextRequest } from "../auth/next-authorization.mjs";
import { applyRefreshedSessionCookies } from "../auth/next-session-cookies.mjs";
import {
  createGroup,
  GroupAdminError,
  updateGroupMetadata,
} from "./group-admin.mjs";

function jsonError(message, status, session = null) {
  const response = NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
  return applyRefreshedSessionCookies(response, session);
}

function isNameOnlyPayload(body) {
  return Boolean(
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    Object.prototype.hasOwnProperty.call(body, "name") &&
    Object.keys(body).length === 1
  );
}

/**
 * Creates testable App Router handlers. Dependencies are injectable so the
 * HTTP boundary can be tested without Supabase credentials or a live session.
 */
export function createGroupRouteHandlers({
  authorize = authorizeNextRequest,
  create = createGroup,
  update = updateGroupMetadata,
} = {}) {
  async function authorizeTi(request) {
    return authorize(request, {
      allowedRoles: ["ti"],
      preserveSessionOnForbidden: true,
    });
  }

  async function POST(request) {
    const authorization = await authorizeTi(request);
    if (!authorization.authorized) {
      return jsonError(
        authorization.status === 401
          ? "Autenticação necessária."
          : authorization.status === 403
            ? "Acesso permitido somente ao perfil TI ativo."
            : "Não foi possível validar a autorização.",
        authorization.status,
        authorization.session,
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError("Corpo da requisição inválido.", 400, authorization.session);
    }

    if (!isNameOnlyPayload(body)) {
      return jsonError("Informe somente o campo name.", 400, authorization.session);
    }

    try {
      const group = await create({
        actorProfileId: authorization.session.user.id,
        name: body.name,
      });
      const response = NextResponse.json(
        { group },
        { status: 201, headers: { "Cache-Control": "no-store" } },
      );
      return applyRefreshedSessionCookies(response, authorization.session);
    } catch (error) {
      if (error instanceof GroupAdminError) {
        return jsonError(error.message, error.status, authorization.session);
      }
      return jsonError("Não foi possível criar o grupo.", 503, authorization.session);
    }
  }

  async function PATCH(request, context) {
    const authorization = await authorizeTi(request);
    if (!authorization.authorized) {
      return jsonError(
        authorization.status === 401
          ? "Autenticação necessária."
          : authorization.status === 403
            ? "Acesso permitido somente ao perfil TI ativo."
            : "Não foi possível validar a autorização.",
        authorization.status,
        authorization.session,
      );
    }

    let groupId;
    try {
      ({ groupId } = await context.params);
    } catch {
      return jsonError("Identificador do grupo inválido.", 400, authorization.session);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError("Corpo da requisição inválido.", 400, authorization.session);
    }

    if (!isNameOnlyPayload(body)) {
      return jsonError("Informe somente o campo name.", 400, authorization.session);
    }

    try {
      const group = await update({
        actorProfileId: authorization.session.user.id,
        groupId,
        name: body.name,
      });
      const response = NextResponse.json(
        { group },
        { headers: { "Cache-Control": "no-store" } },
      );
      return applyRefreshedSessionCookies(response, authorization.session);
    } catch (error) {
      if (error instanceof GroupAdminError) {
        return jsonError(error.message, error.status, authorization.session);
      }
      return jsonError("Não foi possível atualizar o grupo.", 503, authorization.session);
    }
  }

  return { POST, PATCH };
}

const handlers = createGroupRouteHandlers();
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
