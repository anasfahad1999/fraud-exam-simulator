import { json } from "../_utils/auth.js";

export async function onRequestPost() {
  return json({ ok: true, message: "تم استلام الحدث. اربط هذا المسار بجدول أحداث عند الحاجة." });
}
