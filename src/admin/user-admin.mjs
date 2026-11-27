/**
 * Server-only TI account listing.
 * Returns profile metadata only; credentials and Auth identities are never exposed.
 */
const MAX_PAGE_SIZE = 100;

export class UserAdminError extends Error {
  constructor(message, status = 503) {
    super(message);
    this.name = "UserAdminError";
    this.status = status;
  }
}

function config(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !secretKey) {
    throw new UserAdminError("Serviço de usuários indisponível.", 503);
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), secretKey };
}

function parsePagination({ page = "1", limit = "25" } = {}) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  if (!Number.isInteger(parsedPage) || parsedPage < 1 ||
      !Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_PAGE_SIZE) {
    throw new UserAdminError("Parâmetros de paginação inválidos.", 400);
  }
  return { page: parsedPage, limit: parsedLimit, offset: (parsedPage - 1) * parsedLimit };
}

export async function listUsers({
  page = "1",
  limit = "25",
  search = "",
  role = "",
  status = "",
  env = process.env,
  fetchImpl = fetch,
}) {
  const pagination = parsePagination({ page, limit });
  if (typeof search !== "string" || search.length > 128 ||
      !["", "user", "ti"].includes(role) ||
      !["", "active", "inactive"].includes(status)) {
    throw new UserAdminError("Filtros de usuários inválidos.", 400);
  }

  const cfg = config(env);
  const url = new URL(`${cfg.baseUrl}/rest/v1/profiles`);
  url.searchParams.set("select", "id,username,role,is_active,created_at,updated_at");
  url.searchParams.set("order", "created_at.desc,id.asc");
  url.searchParams.set("limit", String(pagination.limit));
  url.searchParams.set("offset", String(pagination.offset));
  if (search.trim()) url.searchParams.set("username", `ilike.*${search.trim().replace(/[%,]/g, "")}*`);
  if (role) url.searchParams.set("role", `eq.${role}`);
  if (status) url.searchParams.set("is_active", `eq.${status === "active"}`);

  let response;
  try {
    response = await fetchImpl(url, {
      headers: {
        apikey: cfg.secretKey,
        Authorization: `Bearer ${cfg.secretKey}`,
        Prefer: "count=exact",
      },
      cache: "no-store",
    });
  } catch {
    throw new UserAdminError("Não foi possível consultar os usuários.", 503);
  }

  if (!response.ok) throw new UserAdminError("Não foi possível consultar os usuários.", 503);
  let users;
  try {
    users = await response.json();
  } catch {
    throw new UserAdminError("Resposta inválida do serviço de usuários.", 503);
  }
  if (!Array.isArray(users)) throw new UserAdminError("Resposta inválida do serviço de usuários.", 503);

  const contentRange = response.headers?.get?.("content-range") ?? "";
  const totalText = contentRange.split("/")[1];
  const total = totalText && totalText !== "*" ? Number(totalText) : null;
  return { users, page: pagination.page, limit: pagination.limit, total: Number.isFinite(total) ? total : null };
}
