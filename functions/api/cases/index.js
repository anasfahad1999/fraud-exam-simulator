import { json, requireDeveloperApi } from "../../_utils/auth.js";
import { auditLog, dbAll, dbFirst, dbRun, hasDB } from "../../_utils/db.js";

const ALLOWED_STATUS = new Set(["draft", "published", "hidden"]);

function cleanText(value, max = 200000) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizeStatus(value) {
  const status = cleanText(value || "draft", 30);
  return ALLOWED_STATUS.has(status) ? status : "draft";
}

function normalizePayload(body = {}) {
  const title = cleanText(body.title, 500);
  const slug = cleanText(body.slug, 220).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const category = cleanText(body.category || "قضايا", 200);
  const summary = cleanText(body.summary, 4000);
  const content = cleanText(body.content, 200000);
  const status = normalizeStatus(body.status);
  return {
    title,
    slug,
    category,
    summary,
    content,
    status,
    timeline: Array.isArray(body.timeline) ? body.timeline : [],
    indicators: Array.isArray(body.indicators) ? body.indicators : [],
    documents: Array.isArray(body.documents) ? body.documents : [],
    references: Array.isArray(body.references) ? body.references : [],
    questions: Array.isArray(body.questions) ? body.questions : [],
    professionalNotes: Array.isArray(body.professionalNotes) ? body.professionalNotes : [],
  };
}

function validateCase(payload) {
  if (!payload.title) return "عنوان القضية مطلوب.";
  if (!payload.slug) return "الرابط المختصر slug مطلوب.";
  if (!payload.category) return "التصنيف مطلوب.";
  return null;
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
    if (!dateLabel && !eventText) continue;
    await dbRun(env, `INSERT INTO case_timeline (case_id, date_label, event_text, sort_order) VALUES (?, ?, ?, ?)`, [caseId, dateLabel, eventText, i]);
  }

  for (let i = 0; i < payload.indicators.length; i++) {
    const item = payload.indicators[i] || {};
    const text = cleanText(item.text || item.indicator_text, 4000);
    if (!text) continue;
    await dbRun(env, `INSERT INTO case_indicators (case_id, indicator_text, sort_order) VALUES (?, ?, ?)`, [caseId, text, i]);
  }

  for (let i = 0; i < payload.documents.length; i++) {
    const item = payload.documents[i] || {};
    const title = cleanText(item.title, 500);
    const url = cleanText(item.url, 2000);
    const note = cleanText(item.note, 2000);
    if (!title && !url && !note) continue;
    await dbRun(env, `INSERT INTO case_documents (case_id, title, url, note, sort_order) VALUES (?, ?, ?, ?, ?)`, [caseId, title || "مستند", url, note, i]);
  }

  for (let i = 0; i < payload.references.length; i++) {
    const item = payload.references[i] || {};
    const name = cleanText(item.name, 500);
    const url = cleanText(item.url, 2000);
    const note = cleanText(item.note, 2000);
    if (!name && !url && !note) continue;
    await dbRun(env, `INSERT INTO case_references (case_id, name, url, note, sort_order) VALUES (?, ?, ?, ?, ?)`, [caseId, name || "مرجع", url, note, i]);
  }

  for (let i = 0; i < payload.questions.length; i++) {
    const item = payload.questions[i] || {};
    const question = cleanText(item.question, 8000);
    const options = Array.isArray(item.options) ? JSON.stringify(item.options.map((x) => cleanText(x, 2000)).filter(Boolean)) : "[]";
    const answer = cleanText(item.answer, 4000);
    const explanation = cleanText(item.explanation, 12000);
    if (!question) continue;
    await dbRun(env, `INSERT INTO case_questions (case_id, question, options, answer, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?)`, [caseId, question, options, answer, explanation, i]);
  }

  for (let i = 0; i < payload.professionalNotes.length; i++) {
    const item = payload.professionalNotes[i] || {};
    const text = cleanText(item.text || item.note_text, 4000);
    if (!text) continue;
    await dbRun(env, `INSERT INTO case_notes (case_id, note_text, sort_order) VALUES (?, ?, ?)`, [caseId, text, i]);
  }
}

export async function onRequestGet({ request, env }) {
  const access = await requireDeveloperApi(request, env);
  if (!access.ok) return access.response;
  if (!hasDB(env)) return json({ ok: true, dbReady: false, cases: [] }, { headers: access.session.headers });

  const rows = await dbAll(
    env,
    `SELECT id, title, slug, category, summary, content, status, created_at, updated_at
     FROM cases ORDER BY updated_at DESC, id DESC LIMIT 200`
  );
  return json({ ok: true, dbReady: true, cases: rows }, { headers: access.session.headers });
}

export async function onRequestPost({ request, env }) {
  const access = await requireDeveloperApi(request, env);
  if (!access.ok) return access.response;
  const headers = access.session.headers;
  const actor = access.session.user?.email || "unknown";

  if (!hasDB(env)) {
    return json({ ok: false, error: "قاعدة البيانات غير مربوطة بعد. أضف binding باسم DB في Cloudflare Pages." }, { status: 503, headers });
  }

  const payload = normalizePayload(await request.json().catch(() => ({})));
  const error = validateCase(payload);
  if (error) return json({ ok: false, error }, { status: 400, headers });

  const exists = await dbFirst(env, `SELECT id FROM cases WHERE slug = ?`, [payload.slug]);
  if (exists) return json({ ok: false, error: "الرابط المختصر مستخدم لقضية أخرى." }, { status: 409, headers });

  await dbRun(
    env,
    `INSERT INTO cases (title, slug, category, summary, content, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [payload.title, payload.slug, payload.category, payload.summary, payload.content, payload.status]
  );
  const row = await dbFirst(env, `SELECT id FROM cases WHERE slug = ?`, [payload.slug]);
  await replaceChildren(env, row.id, payload);
  await auditLog(env, { actorEmail: actor, action: "create", entityType: "case", entityId: row.id, after: { ...payload, id: row.id } });

  return json({ ok: true, id: row.id, slug: payload.slug }, { status: 201, headers });
}
