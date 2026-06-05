import { friendlyError, isDeveloperEmail, json, mapUser, setSessionCookies, supabaseAuthFetch } from "../../_utils/auth.js";

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();

  if (!email || !password) return json({ ok: false, error: "أدخل البريد الإلكتروني وكلمة المرور." }, { status: 400 });
  if (password.length < 8) return json({ ok: false, error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." }, { status: 400 });

  const result = await supabaseAuthFetch(env, "signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      data: { name, role: "trainee" },
    }),
  });

  if (!result.ok) {
    return json({ ok: false, error: friendlyError(result.data, "تعذر إنشاء الحساب.") }, { status: result.status });
  }

  if (result.data?.access_token) {
    const headers = new Headers();
    setSessionCookies(headers, result.data);
    const user = mapUser(env, result.data.user);
    return json({ ok: true, user, isDeveloper: isDeveloperEmail(env, user.email) }, { headers });
  }

  return json({
    ok: true,
    message: "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتفعيل الدخول ثم سجّل الدخول.",
  });
}
