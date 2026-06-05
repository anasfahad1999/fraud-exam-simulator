import { guardPage } from "./_utils/auth.js";
export function onRequest(context) {
  return guardPage(context, { developer: true });
}
