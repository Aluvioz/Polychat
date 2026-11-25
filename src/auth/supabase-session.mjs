const GENERIC_LOGIN_ERROR = "Usuário ou senha inválidos.";
const GENERIC_SESSION_ERROR = "Não foi possível validar a sessão.";
const ACCESS_COOKIE = "polychat_access_token";
const REFRESH_COOKIE = "polychat_refresh_token";

function config(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !anonKey || !serviceKey) {
    throw new Error("Supabase server configuration is incomplete.");
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), anonKey, serviceKey };
}

function headers(apiKey, bearer = apiKey) {
  return {
    apikey: apiKey,
    Authorization: `Bearer ${bearer}`,
    "Content-Type": "application/json",
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function findProfileByUsername(username, cfg, fetchImpl) {
  const url = new URL(`${cfg.baseUrl}/rest/v1/profiles`);
  url.searchParams.set("select", "id,username,role,is_active");
  url.searchParams.set("username", `eq.${username}`);
  url.searchParams.set("limit", "2");
  const response = await fetchImpl(url, {
    headers: headers(cfg.serviceKey),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Profile lookup failed.");
  const profiles = await readJson(response);
  if (!Array.isArray(profiles) || profiles.length !== 1) return null;
  return profiles[0];
}

async function findAuthEmail(userId, cfg, fetchImpl) {
  const response = await fetchImpl(
    `${cfg.baseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    { headers: headers(cfg.serviceKey), cache: "no-store" },
  );
  if (!response.ok) throw new Error("Auth identity lookup failed.");
  const result = await readJson(response);
  return typeof result?.email === "string" && result.email.length > 0
    ? result.email
    : null;
}

async function getProfileById(userId, cfg, fetchImpl) {
  const url = new URL(`${cfg.baseUrl}/rest/v1/profiles`);
  url.searchParams.set("select", "id,username,role,is_active");
  url.searchParams.set("id", `eq.${userId}`);
  url.searchParams.set("limit", "1");
  const response = await fetchImpl(url, {
    headers: headers(cfg.serviceKey),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Profile lookup failed.");
  const profiles = await readJson(response);
  return Array.isArray(profiles) && profiles.length === 1 ? profiles[0] : null;
}

async function revokeSession(accessToken, cfg, fetchImpl) {
  if (!accessToken) return;
  try {
    await fetchImpl(`${cfg.baseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: headers(cfg.anonKey, accessToken),
      cache: "no-store",
    });
  } catch {
    // The caller still clears the local cookies; no token or provider error is exposed.
  }
}

export async function loginWithUsername({
  username,
  password,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (typeof username !== "string" || typeof password !== "string" ||
      username.trim().length === 0 || password.length === 0 ||
      username.length > 128 || password.length > 1024) {
    const error = new Error(GENERIC_LOGIN_ERROR);
    error.status = 401;
    throw error;
  }

  let cfg;
  try {
    cfg = config(env);
  } catch {
    const error = new Error(GENERIC_SESSION_ERROR);
    error.status = 503;
    throw error;
  }

  try {
    const profile = await findProfileByUsername(username, cfg, fetchImpl);
    if (!profile || profile.is_active !== true ||
        !["user", "ti"].includes(profile.role)) {
      const error = new Error(GENERIC_LOGIN_ERROR);
      error.status = 401;
      throw error;
    }

    const email = await findAuthEmail(profile.id, cfg, fetchImpl);
    if (!email) {
      const error = new Error(GENERIC_LOGIN_ERROR);
      error.status = 401;
      throw error;
    }

    const tokenResponse = await fetchImpl(
      `${cfg.baseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: { apikey: cfg.anonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      },
    );
    const tokens = await readJson(tokenResponse);
    if (!tokenResponse.ok || !tokens?.access_token ||
        !tokens?.refresh_token || !tokens?.user?.id ||
        tokens.user.id !== profile.id) {
      const error = new Error(GENERIC_LOGIN_ERROR);
      error.status = 401;
      throw error;
    }

    const currentProfile = await getProfileById(tokens.user.id, cfg, fetchImpl);
    if (!currentProfile || currentProfile.is_active !== true ||
        !["user", "ti"].includes(currentProfile.role)) {
      await revokeSession(tokens.access_token, cfg, fetchImpl);
      const error = new Error(GENERIC_LOGIN_ERROR);
      error.status = 401;
      throw error;
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: Number.isInteger(tokens.expires_in) && tokens.expires_in > 0
        ? tokens.expires_in
        : null,
      user: {
        id: currentProfile.id,
        username: currentProfile.username,
        role: currentProfile.role,
      },
    };
  } catch (error) {
    if (error?.status) throw error;
    const failure = new Error(GENERIC_SESSION_ERROR);
    failure.status = 503;
    throw failure;
  }
}

async function fetchAuthUser(accessToken, cfg, fetchImpl) {
  const response = await fetchImpl(`${cfg.baseUrl}/auth/v1/user`, {
    headers: headers(cfg.anonKey, accessToken),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const user = await readJson(response);
  return user?.id ? user : null;
}

async function refreshSession(refreshToken, cfg, fetchImpl) {
  const response = await fetchImpl(
    `${cfg.baseUrl}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: { apikey: cfg.anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    },
  );
  const tokens = await readJson(response);
  if (!response.ok || !tokens?.access_token || !tokens?.refresh_token ||
      !tokens?.user?.id) return null;
  return tokens;
}

export async function validateSession({
  accessToken,
  refreshToken,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!accessToken && !refreshToken) return null;
  let cfg;
  try {
    cfg = config(env);
  } catch {
    const error = new Error(GENERIC_SESSION_ERROR);
    error.status = 503;
    throw error;
  }

  try {
    let tokens = null;
    let user = accessToken ? await fetchAuthUser(accessToken, cfg, fetchImpl) : null;
    if (!user && refreshToken) {
      tokens = await refreshSession(refreshToken, cfg, fetchImpl);
      if (tokens) user = tokens.user;
    }
    if (!user) return null;

    const profile = await getProfileById(user.id, cfg, fetchImpl);
    if (!profile || profile.is_active !== true ||
        !["user", "ti"].includes(profile.role)) {
      await revokeSession(tokens?.access_token ?? accessToken, cfg, fetchImpl);
      return null;
    }

    return {
      accessToken: tokens?.access_token ?? accessToken,
      refreshToken: tokens?.refresh_token ?? refreshToken,
      expiresIn: tokens && Number.isInteger(tokens.expires_in) && tokens.expires_in > 0
        ? tokens.expires_in
        : null,
      refreshed: Boolean(tokens),
      user: { id: profile.id, username: profile.username, role: profile.role },
    };
  } catch (error) {
    if (error?.status) throw error;
    const failure = new Error(GENERIC_SESSION_ERROR);
    failure.status = 503;
    throw failure;
  }
}

export async function logoutSession({
  accessToken,
  refreshToken,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!accessToken && !refreshToken) return;
  let cfg;
  try {
    cfg = config(env);
  } catch {
    return;
  }
  if (accessToken) {
    const response = await fetchImpl(`${cfg.baseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: headers(cfg.anonKey, accessToken),
      cache: "no-store",
    });
    if (response.ok || !refreshToken) return;
  }
  if (refreshToken) {
    const tokens = await refreshSession(refreshToken, cfg, fetchImpl);
    if (tokens?.access_token) await revokeSession(tokens.access_token, cfg, fetchImpl);
  }
}

export const AUTH_COOKIE_NAMES = Object.freeze({
  access: ACCESS_COOKIE,
  refresh: REFRESH_COOKIE,
});
