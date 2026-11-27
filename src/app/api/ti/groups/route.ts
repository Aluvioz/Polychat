import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import { applyRefreshedSessionCookies } from "@/auth/next-session-cookies.mjs";
import { GroupAdminError, listGroups } from "@/groups/group-admin.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = await authorizeNextRequest(request, {
    allowedRoles: ["ti"],
    enforceDeviceCompatibility: true,
    preserveSessionOnForbidden: true,
  });
  if (!authorization.authorized || !authorization.session) {
    const response = NextResponse.json({
      error: authorization.status === 401
        ? "Autenticação necessária."
        : authorization.status === 403
          ? authorization.message ?? "Acesso permitido somente ao perfil TI ativo."
          : "Não foi possível validar a autorização.",
    }, { status: authorization.status, headers: { "Cache-Control": "no-store" } });
    return applyRefreshedSessionCookies(response, authorization.session);
  }

  const params = request.nextUrl.searchParams;
  try {
    const result = await listGroups({
      page: params.get("page") ?? "1",
      limit: params.get("limit") ?? "25",
      search: params.get("search") ?? "",
      status: params.get("status") ?? "",
    });
    const response = NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    return applyRefreshedSessionCookies(response, authorization.session);
  } catch (error) {
    const known = error instanceof GroupAdminError;
    const response = NextResponse.json(
      { error: known ? error.message : "Não foi possível consultar os grupos." },
      { status: known ? error.status : 503, headers: { "Cache-Control": "no-store" } },
    );
    return applyRefreshedSessionCookies(response, authorization.session);
  }
}

export { POST, PATCH } from "@/groups/group-routes.mjs";
