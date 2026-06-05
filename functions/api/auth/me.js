import { getSessionFromRequest, json } from "../../_utils/auth.js";

export async function onRequestGet({ request, env }) {
  const session = await getSessionFromRequest(request, env);
  if (!session.ok) {
    return json({ ok: false, error: session.error }, { status: 401, headers: session.headers });
  }
  return json({ ok: true, user: session.user, isDeveloper: session.isDeveloper }, { headers: session.headers });
}
