// functions/_utils/db.js
// مساعد التعامل مع Cloudflare D1 + سجل التدقيق (audit_log).
//
// مهم: هذا الملف آمن قبل ربط قاعدة البيانات. إذا لم يوجد binding باسم DB،
// فإن دوال القراءة تُرجع قيمًا فارغة بدل أن تكسر الموقع، ودوال الكتابة تُرجع skipped.
// بهذا الشكل يظل الموقع العام يعمل حتى قبل أن تربط D1، ويبدأ الحفظ بمجرد ربطها.

export function hasDB(env) {
  return Boolean(env && env.DB && typeof env.DB.prepare === "function");
}

export async function dbAll(env, sql, params = []) {
  if (!hasDB(env)) return [];
  const stmt = env.DB.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const res = await bound.all();
  return (res && res.results) || [];
}

export async function dbFirst(env, sql, params = []) {
  if (!hasDB(env)) return null;
  const stmt = env.DB.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  return (await bound.first()) || null;
}

export async function dbRun(env, sql, params = []) {
  if (!hasDB(env)) return { success: false, skipped: true };
  const stmt = env.DB.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const res = await bound.run();
  return { success: true, meta: res && res.meta };
}

// يكتب سطرًا في جدول audit_log لكل عملية تعديل/إنشاء/حذف.
// لا يُفشل العملية الأساسية إذا تعذّر تسجيل التدقيق.
export async function auditLog(env, { actorEmail, action, entityType, entityId = null, before = null, after = null }) {
  if (!hasDB(env)) return;
  const toText = (v) => (v == null ? null : typeof v === "string" ? v : JSON.stringify(v));
  try {
    await dbRun(
      env,
      `INSERT INTO audit_log (actor_email, action, entity_type, entity_id, before_value, after_value)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        String(actorEmail || "unknown"),
        String(action),
        String(entityType),
        entityId == null ? null : String(entityId),
        toText(before),
        toText(after),
      ]
    );
  } catch (_e) {
    // تجاهل: سجل التدقيق مساعد وليس حرجًا لإتمام العملية.
  }
}
