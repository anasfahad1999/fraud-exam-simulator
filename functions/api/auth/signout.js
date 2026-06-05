import { clearSessionCookies, json } from "../../_utils/auth.js";

export async function onRequestPost() {
  const headers = new Headers();
  clearSessionCookies(headers);
  return json({ ok: true }, { headers });
}
