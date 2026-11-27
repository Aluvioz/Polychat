import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import { searchPrivilegedAuditEventsRest } from "@/audit/privileged-audit-rest.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = await authorizeNextRequest(request, { allowedRoles: ["ti"] });
  if (!authorization.authorized || !authorization.session) {
    const message = authorization.status === 401
      ? "Autenticação necessária."
      : authorization.status === 403
        ? "Perfil sem autorização."
        : "Não foi possível validar a sessão.";
    return NextResponse.json({ error: message }, {
      status: authorization.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const result = await searchPrivilegedAuditEventsRest({
      params: request.nextUrl.searchParams,
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const invalidInput = error instanceof TypeError;
    return NextResponse.json({
      error: invalidInput
        ? error.message
        : "Não foi possível consultar a trilha de auditoria.",
    }, {
      status: invalidInput ? 400 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
