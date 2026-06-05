// functions/api/content/index.js
// يحل محل النسخة القديمة التي كانت تُرجع 501.
//
// GET عام (بدون تسجيل دخول): يُرجع خريطة { key: value } لكل نصوص الموقع.
//   تستخدمها الصفحات العامة لعرض النصوص القابلة للتعديل. آمن قبل ربط D1 (يُرجع خريطة فارغة).
// GET ?meta=1 (للمطوّر فقط): يُرجع تفاصيل كاملة لكل حقل لاستخدامها في لوحة المطور.

import { json, requireDeveloperApi } from "../../_utils/auth.js";
import { dbAll, hasDB } from "../../_utils/db.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const wantsMeta = url.searchParams.get("meta") === "1";

  // وضع المحرّر: تفاصيل كاملة، محمي بصلاحية المطوّر.
  if (wantsMeta) {
    const access = await requireDeveloperApi(request, env);
    if (!access.ok) return access.response;
    const items = await dbAll(
      env,
      `SELECT key, page, label, value, type, updated_at, updated_by
       FROM site_content ORDER BY page, key`
    );
    return json({ ok: true, items, dbReady: hasDB(env) }, { headers: access.session.headers });
  }

  // الوضع العام: خريطة مبسطة فقط.
  const rows = await dbAll(env, `SELECT key, value FROM site_content`);
  const content = {};
  for (const row of rows) content[row.key] = row.value;
  return json({ ok: true, content, dbReady: hasDB(env) });
}
