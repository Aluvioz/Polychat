const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateActiveProfileQuery(value) {
  if (typeof value !== "string") return { ok: false };
  const query = value.trim();
  if (query.length < 2 || query.length > 64) return { ok: false };
  return { ok: true, query };
}

function configuration(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !apiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

/** Calls the restricted SECURITY DEFINER RPC with the authenticated user's JWT. */
export async function searchActiveProfiles({
  query,
  accessToken,
  env = process.env,
  fetchImpl = fetch,
}) {
  const validated = validateActiveProfileQuery(query);
  if (!validated.ok) return { ok: false, status: 400, reason: "invalid_query" };
  if (!accessToken) return { ok: false, status: 401, reason: "unauthorized" };

  const cfg = configuration(env);
  if (!cfg) return { ok: false, status: 503, reason: "configuration_unavailable" };

  let response;
  try {
    response = await fetchImpl(cfg.baseUrl + "/rest/v1/rpc/search_active_profiles", {
      method: "POST",
      headers: {
        apikey: cfg.apiKey,
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_query: validated.query }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (!response.ok) {
    if (response.status === 401) return { ok: false, status: 401, reason: "session_invalid" };
    if (response.status === 403) return { ok: false, status: 403, reason: "forbidden" };
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  let rows;
  try {
    rows = await response.json();
  } catch {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  if (!Array.isArray(rows) || rows.length > 25 || !rows.every((row) =>
    row && typeof row === "object" &&
    typeof row.profile_id === "string" && UUID_PATTERN.test(row.profile_id) &&
    typeof row.username === "string" && row.username.length > 0 && row.username.length <= 128
  )) {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  return {
    ok: true,
    users: rows.map((row) => ({
      id: row.profile_id.toLowerCase(),
      username: row.username,
    })),
  };
}
