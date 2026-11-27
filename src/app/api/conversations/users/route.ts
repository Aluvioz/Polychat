import { NextRequest, NextResponse } from "next/server";
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";
import {
  searchActiveProfiles,
  validateActiveProfileQuery,
} from "@/conversations/active-profile-search-service.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeNextRequest(request, { allowedRoles: ["user"] });
  if (!authorization.authorized || !authorization.session) {
    return json(authorization.status, {
      error: authorization.status === 401
        ? "Sessão inválida ou expirada."
        : authorization.status === 403
          ? "Esta busca está disponível somente para o perfil Usuário."
          : "Não foi possível validar a sessão.",
    });
  }

  const validated = validateActiveProfileQuery(request.nextUrl.searchParams.get("q") ?? "");
  if (!validated.ok) {
    return json(400, { error: "Informe ao menos 2 caracteres para pesquisar." });
  }

  const result = await searchActiveProfiles({
    query: validated.query,
    accessToken: authorization.session.accessToken,
  });

  if (!result.ok) {
    return json(result.status, {
      error: result.status === 401
        ? "Sessão inválida ou expirada."
        : result.status === 403
          ? "Você não tem autorização para pesquisar usuários."
          : "Não foi possível pesquisar usuários agora.",
    });
  }

  return json(200, { users: result.users });
}
