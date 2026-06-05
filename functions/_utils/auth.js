const ACCESS_COOKIE = "thughrah_access_token";
const REFRESH_COOKIE = "thughrah_refresh_token";

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function readCookies(request) {
  const header = request.headers.get("Cookie") || "";
  const out = {};
  for (const part of header.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (!name) continue;
    out[name] = decodeURIComponent(value.join("="));
  }
  return out;
}

function cookie(name, value, maxAge) {
  const encoded = encodeURIComponent(value || "");
  return `${name}=${encoded}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function setSessionCookies(headers, session) {
  if (!session?.access_token) return;
  const accessMaxAge = Number(session.expires_in || 3600);
  headers.append("Set-Cookie", cookie(ACCESS_COOKIE, session.access_token, accessMaxAge));
  if (session.refresh_token) {
    headers.append("Set-Cookie", cookie(REFRESH_COOKIE, session.refresh_token, 60 * 60 * 24 * 30));
  }
}

function clearSessionCookies(headers) {
  headers.append("Set-Cookie", cookie(ACCESS_COOKIE, "", 0));
  headers.append("Set-Cookie", cookie(REFRESH_COOKIE, "", 0));
}

function requireEnv(env) {
  const supabaseUrl = String(env.SUPABASE_URL || "").replace(/\/+$/, "");
  const anonKey = String(env.SUPABASE_ANON_KEY || "");
  if (!supabaseUrl || !anonKey) {
    return { ok: false, error: "لم يتم ضبط SUPABASE_URL و SUPABASE_ANON_KEY في Cloudflare." };
  }
  return { ok: true, supabaseUrl, anonKey };
}

function developerEmails(env) {
  return String(env.DEVELOPER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isDeveloperEmail(env, email) {
  return developerEmails(env).includes(String(email || "").trim().toLowerCase());
}

function mapUser(env, user) {
  const email = String(user?.email || "").trim().toLowerCase();
  const developer = isDeveloperEmail(env, email);
  const metadataRole = String(user?.app_metadata?.role || user?.user_metadata?.role || "").trim().toLowerCase();
  return {
    id: user?.id,
    email,
    name: user?.user_metadata?.name,
    role: developer ? "developer" : metadataRole === "admin" ? "admin" : metadataRole === "developer" ? "developer" : metadataRole === "staff" ? "staff" : "trainee",
    createdAt: user?.created_at,
  };
}

async function supabaseAuthFetch(env, path, init = {}) {
  const config = requireEnv(env);
  if (!config.ok) return { ok: false, status: 500, data: { error: config.error } };

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("apikey", config.anonKey);

  const res = await fetch(`${config.supabaseUrl}/auth/v1/${path}`, {
    ...init,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function friendlyError(data, fallback) {
  const raw = String(data?.msg || data?.error_description || data?.error || data?.message || "");
  if (/already registered|already exists|user already/i.test(raw)) return "هذا البريد مسجّل مسبقًا.";
  if (/invalid login|invalid credentials|grant/i.test(raw)) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (/password should be at least|weak password|6 characters/i.test(raw)) return "كلمة المرور قصيرة جدًا.";
  if (/email/i.test(raw) && /valid|format/i.test(raw)) return "صيغة البريد الإلكتروني غير صحيحة.";
  return raw || fallback;
}

async function getUserByToken(env, accessToken) {
  if (!accessToken) return { ok: false, status: 401, data: { error: "لا توجد جلسة دخول." } };
  return supabaseAuthFetch(env, "user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function refreshByToken(env, refreshToken) {
  if (!refreshToken) return { ok: false, status: 401, data: { error: "لا توجد جلسة قابلة للتجديد." } };
  return supabaseAuthFetch(env, "token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

async function getSessionFromRequest(request, env) {
  const cookies = readCookies(request);
  const access = cookies[ACCESS_COOKIE];
  const refresh = cookies[REFRESH_COOKIE];
  const headers = new Headers();

  let userResult = await getUserByToken(env, access);
  if (userResult.ok) {
    const user = mapUser(env, userResult.data);
    return { ok: true, user, isDeveloper: isDeveloperEmail(env, user.email), headers };
  }

  const refreshed = await refreshByToken(env, refresh);
  if (!refreshed.ok || !refreshed.data?.access_token) {
    clearSessionCookies(headers);
    return { ok: false, status: 401, error: "انتهت الجلسة أو لم يتم تسجيل الدخول.", headers };
  }

  setSessionCookies(headers, refreshed.data);
  userResult = await getUserByToken(env, refreshed.data.access_token);
  if (!userResult.ok) {
    clearSessionCookies(headers);
    return { ok: false, status: 401, error: "تعذر التحقق من جلسة الدخول.", headers };
  }

  const user = mapUser(env, userResult.data);
  return { ok: true, user, isDeveloper: isDeveloperEmail(env, user.email), headers };
}

function mergeHeaders(base, extra) {
  const headers = new Headers(base || {});
  if (extra) {
    for (const [key, value] of extra.entries()) headers.append(key, value);
  }
  return headers;
}

async function serveIndex(context, extraHeaders) {
  const url = new URL(context.request.url);
  url.pathname = "/index.html";
  const res = await context.env.ASSETS.fetch(new Request(url.toString(), context.request));
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: mergeHeaders(res.headers, extraHeaders),
  });
}

async function guardPage(context, { developer = false } = {}) {
  const session = await getSessionFromRequest(context.request, context.env);
  if (!session.ok) {
    const url = new URL(context.request.url);
    const next = encodeURIComponent(url.pathname);
    const headers = mergeHeaders({ Location: `/login?next=${next}` }, session.headers);
    return new Response(null, { status: 302, headers });
  }
  if (developer && !session.isDeveloper) {
    return new Response(null, { status: 302, headers: { Location: "/" } });
  }
  return serveIndex(context, session.headers);
}

async function requireDeveloperApi(request, env) {
  const session = await getSessionFromRequest(request, env);
  if (!session.ok) return { ok: false, response: json({ ok: false, error: session.error }, { status: 401, headers: session.headers }) };
  if (!session.isDeveloper) return { ok: false, response: json({ ok: false, error: "غير مصرح لهذا الحساب." }, { status: 403, headers: session.headers }) };
  return { ok: true, session };
}

export {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearSessionCookies,
  friendlyError,
  getSessionFromRequest,
  guardPage,
  isDeveloperEmail,
  json,
  mapUser,
  requireDeveloperApi,
  setSessionCookies,
  supabaseAuthFetch,
};
