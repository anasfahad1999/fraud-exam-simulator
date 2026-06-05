// functions/api/content/[key].js
// يحل محل النسخة القديمة التي كانت تُرجع 501.
//
// PUT  (للمطوّر فقط): حفظ/تحديث نص الموقع لهذا المفتاح + تسجيل تدقيق.
// DELETE (للمطوّر فقط): حذف التعديل المحفوظ، فيرجع النص للقيمة الافتراضية في الكود (fallback).

import { json, requireDeveloperApi } from "../../_utils/auth.js";
import { dbFirst, dbRun, auditLog, hasDB } from "../../_utils/db.js";

const ALLOWED_TYPES = new Set(["text", "textarea", "url", "rich_text"]);

export async function onRequestPut({ request, env, params }) {
  const access = await requireDeveloperApi(request, env);
  if (!access.ok) return access.response;
  const headers = access.session.headers;
  const actor = (access.session.user && access.session.user.email) || "unknown";

  if (!hasDB(env)) {
    return json(
      { ok: false, error: "قاعدة البيانات غير مربوطة بعد. أضف binding باسم DB في إعدادات Cloudflare Pages." },
      { status: 503, headers }
    );
  }

  const key = String(params.key || "").trim();
  if (!key) return json({ ok: false, error: "مفتاح المحتوى مفقود." }, { status: 400, headers });

  const body = await request.json().catch(() => ({}));
  const value = typeof body.value === "string" ? body.value : "";
  const page = String(body.page || key.split(".")[0] || "general").trim();
  const label = String(body.label || key).trim();
  const type = ALLOWED_TYPES.has(String(body.type)) ? String(body.type) : "text";

  const existing = await dbFirst(env, `SELECT value FROM site_content WHERE key = ?`, [key]);

  await dbRun(
    env,
    `INSERT INTO site_content (key, page, label, value, type, updated_at, updated_by)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       page = excluded.page,
       label = excluded.label,
       type = excluded.type,
       updated_at = CURRENT_TIMESTAMP,
       updated_by = excluded.updated_by`,
    [key, page, label, value, type, actor]
  );

  await auditLog(env, {
    actorEmail: actor,
    action: existing ? "update" : "create",
    entityType: "site_content",
    entityId: key,
    before: existing ? existing.value : null,
    after: value,
  });

  return json({ ok: true, key, value }, { headers });
}

export async function onRequestDelete({ request, env, params }) {
  const access = await requireDeveloperApi(request, env);
  if (!access.ok) return access.response;
  const headers = access.session.headers;
  const actor = (access.session.user && access.session.user.email) || "unknown";

  if (!hasDB(env)) {
    return json({ ok: false, error: "قاعدة البيانات غير مربوطة بعد." }, { status: 503, headers });
  }

  const key = String(params.key || "").trim();
  if (!key) return json({ ok: false, error: "مفتاح المحتوى مفقود." }, { status: 400, headers });

  const existing = await dbFirst(env, `SELECT value FROM site_content WHERE key = ?`, [key]);
  await dbRun(env, `DELETE FROM site_content WHERE key = ?`, [key]);

  await auditLog(env, {
    actorEmail: actor,
    action: "delete",
    entityType: "site_content",
    entityId: key,
    before: existing ? existing.value : null,
    after: null,
  });

  return json({ ok: true, key, reverted: true }, { headers });
}
