import { json, requireDeveloperApi } from "../../_utils/auth.js";
import { auditLog, dbAll, dbFirst, dbRun, hasDB } from "../../_utils/db.js";

const ALLOWED_STATUS = new Set(["draft", "published", "hidden"]);
const cleanText = (value, max = 200000) => String(value ?? "").trim().slice(0, max);
const normalizeStatus = (value) => ALLOWED_STATUS.has(String(value || "")) ? String(value) : "draft";

function normalizePayload(body = {}) {
  return {
    title: cleanText(body.title, 500),
    slug: cleanText(body.slug, 220).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    category: cleanText(body.category || "قضايا", 200),
    summary: cleanText(body.summary, 4000),
    content: cleanText(body.content, 200000),
    status: normalizeStatus(body.status),
    timeline: Array.isArray(body.timeline) ? body.timeline : [],
    indicators: Array.isArray(body.indicators) ? body.indicators : [],
    documents: Array.isArray(body.documents) ? body.documents : [],
    references: Array.isArray(body.references) ? body.references : [],
    questions: Array.isArray(body.questions) ? body.questions : [],
    professionalNotes: Array.isArray(body.professionalNotes) ? body.professionalNotes : [],
  };
}

async function readFullCase(env, id) {
  const item = await dbFirst(env, `SELECT * FROM cases WHERE id = ?`, [id]);
  if (!item) return null;
  const [timeline, indicators, documents, references, questions, professionalNotes] = await Promise.all([
    dbAll(env, `SELECT id, date_label AS dateLabel, event_text AS eventText FROM case_timeline WHERE case_id = ? ORDER BY sort_order, id`, [id]),
    dbAll(env, `SELECT id, indicator_text AS text FROM case_indicators WHERE case_id = ? ORDER BY sort_order, id`, [id]),
    dbAll(env, `SELECT id, title, url, note FROM case_documents WHERE case_id = ? ORDER BY sort_order, id`, [id]),
    dbAll(env, `SELECT id, name, url, note FROM case_references WHERE case_id = ? ORDER BY sort_order, id`, [id]),
    dbAll(env, `SELECT id, question, options, answer, explanation FROM case_questions WHERE case_id = ? ORDER BY sort_order, id`, [id]),
    dbAll(env, `SELECT id, note_text AS text FROM case_notes WHERE case_id = ? ORDER BY sort_order, id`, [id]),
  ]);
  return {
    ...item,
    timeline,
    indicators,
    documents,
    references,
    questions: questions.map((q) => ({ ...q, options: JSON.parse(q.options || "[]") })),
    professionalNotes,
  };
}

async function replaceChildren(env, caseId, payload) {
  await dbRun(env, `DELETE FROM case_timeline WHERE case_id = ?`, [caseId]);
  await dbRun(env, `DELETE FROM case_indicators WHERE case_id = ?`, [caseId]);
  await dbRun(env, `DELETE FROM case_documents WHERE case_id = ?`, [caseId]);
  await dbRun(env, `DELETE FROM case_references WHERE case_id = ?`, [caseId]);
  await dbRun(env, `DELETE FROM case_questions WHERE case_id = ?`, [caseId]);
  await dbRun(env, `DELETE FROM case_notes WHERE case_id = ?`, [caseId]);

  for (let i = 0; i < payload.timeline.length; i++) {
    const item = payload.timeline[i] || {};
    const dateLabel = cleanText(item.dateLabel || item.date_label, 200);
    const eventText = cleanText(item.eventText || item.event_text, 4000);
    if (dateLabel || eventText) await dbRun(env, `INSERT INTO case_timeline (case_id, date_label, event_text, sort_order) VALUES (?, ?, ?, ?)`, [caseId, dateLabel, eventText, i]);
  }
  for (let i = 0; i < payload.indicators.length; i++) {
    const text = cleanText((payload.indicators[i] || {}).text || (payload.indicators[i] || {}).indicator_text, 4000);
    if (text) await dbRun(env, `INSERT INTO case_indicators (case_id, indicator_text, sort_order) VALUES (?, ?, ?)`, [caseId, text, i]);
  }
  for (let i = 0; i < payload.documents.length; i++) {
    const item = payload.documents[i] || {};
    const title = cleanText(item.title, 500), url = cleanText(item.url, 2000), note = cleanText(item.note, 2000);
    if (title || url || note) await dbRun(env, `INSERT INTO case_documents (case_id, title, url, note, sort_order) VALUES (?, ?, ?, ?, ?)`, [caseId, title || "مستند", url, note, i]);
  }
  for (let i = 0; i < payload.references.length; i++) {
    const item = payload.references[i] || {};
    const name = cleanText(item.name, 500), url = cleanText(item.url, 2000), note = cleanText(item.note, 2000);
    if (name || url || note) await dbRun(env, `INSERT INTO case_references (case_id, name, url, note, sort_order) VALUES (?, ?, ?, ?, ?)`, [caseId, name || "مرجع", url, note, i]);
  }
  for (let i = 0; i < payload.questions.length; i++) {
    const item = payload.questions[i] || {};
    const question = cleanText(item.question, 8000);
    if (!question) continue;
    const options = JSON.stringify(Array.isArray(item.options) ? item.options.map((x) => cleanText(x, 2000)).filter(Boolean) : []);
    await dbRun(env, `INSERT INTO case_questions (case_id, question, options, answer, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?)`, [caseId, question, options, cleanText(item.answer, 4000), cleanText(item.explanation, 12000), i]);
  }
  for (let i = 0; i < payload.professionalNotes.length; i++) {
    const text = cleanText((payload.professionalNotes[i] || {}).text || (payload.professionalNotes[i] || {}).note_text, 4000);
    if (text) await dbRun(env, `INSERT INTO case_notes (case_id, note_text, sort_order) VALUES (?, ?, ?)`, [caseId, text, i]);
  }
}

export async function onRequestGet({ request, env, params }) {
  const access = await requireDeveloperApi(request, env);
  if (!access.ok) return access.response;
  if (!hasDB(env)) return json({ ok: false, error: "قاعدة البيانات غير مربوطة بعد." }, { status: 503, headers: access.session.headers });
  const item = await readFullCase(env, params.id);
  if (!item) return json({ ok: false, error: "القضية غير موجودة." }, { status: 404, headers: access.session.headers });
  return json({ ok: true, case: item }, { headers: access.session.headers });
}

export async function onRequestPut({ request, env, params }) {
  const access = await requireDeveloperApi(request, env);
  if (!access.ok) return access.response;
  const headers = access.session.headers;
  const actor = access.session.user?.email || "unknown";
  if (!hasDB(env)) return json({ ok: false, error: "قاعدة البيانات غير مربوطة بعد." }, { status: 503, headers });

  const id = params.id;
  const before = await readFullCase(env, id);
  if (!before) return json({ ok: false, error: "القضية غير موجودة." }, { status: 404, headers });

  const payload = normalizePayload(await request.json().catch(() => ({})));
  if (!payload.title || !payload.slug || !payload.category) return json({ ok: false, error: "العنوان والـ slug والتصنيف مطلوبة." }, { status: 400, headers });

  const conflict = await dbFirst(env, `SELECT id FROM cases WHERE slug = ? AND id <> ?`, [payload.slug, id]);
  if (conflict) return json({ ok: false, error: "الرابط المختصر مستخدم لقضية أخرى." }, { status: 409, headers });

  await dbRun(env, `UPDATE cases SET title=?, slug=?, category=?, summary=?, content=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [payload.title, payload.slug, payload.category, payload.summary, payload.content, payload.status, id]);
  await replaceChildren(env, id, payload);
  const after = await readFullCase(env, id);
  await auditLog(env, { actorEmail: actor, action: "update", entityType: "case", entityId: id, before, after });
  return json({ ok: true, id, slug: payload.slug }, { headers });
}

export async function onRequestDelete({ request, env, params }) {
  const access = await requireDeveloperApi(request, env);
  if (!access.ok) return access.response;
  const headers = access.session.headers;
  const actor = access.session.user?.email || "unknown";
  if (!hasDB(env)) return json({ ok: false, error: "قاعدة البيانات غير مربوطة بعد." }, { status: 503, headers });

  const before = await readFullCase(env, params.id);
  if (!before) return json({ ok: false, error: "القضية غير موجودة." }, { status: 404, headers });
  await dbRun(env, `DELETE FROM cases WHERE id = ?`, [params.id]);
  await auditLog(env, { actorEmail: actor, action: "delete", entityType: "case", entityId: params.id, before });
  return json({ ok: true }, { headers });
}
