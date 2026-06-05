import { friendlyError, isDeveloperEmail, json, mapUser, setSessionCookies, supabaseAuthFetch } from "../../_utils/auth.js";

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) return json({ ok: false, error: "أدخل البريد الإلكتروني وكلمة المرور." }, { status: 400 });

  const result = await supabaseAuthFetch(env, "token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!result.ok) {
    return json({ ok: false, error: friendlyError(result.data, "تعذر تسجيل الدخول.") }, { status: result.status });
  }

  const headers = new Headers();
  setSessionCookies(headers, result.data);
  const user = mapUser(env, result.data.user);
  return json({ ok: true, user, isDeveloper: isDeveloperEmail(env, user.email) }, { headers });
}
