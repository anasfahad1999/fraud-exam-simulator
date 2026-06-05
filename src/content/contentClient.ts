// src/content/contentClient.ts
// عميل بسيط للتواصل مع مسارات /api/content من الواجهة.

export interface SiteContentMap {
  [key: string]: string;
}

export interface SiteContentItem {
  key: string;
  page: string;
  label: string;
  value: string;
  type: string;
  updated_at?: string;
  updated_by?: string;
}

async function readJsonSafe(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchSiteContent(): Promise<{ content: SiteContentMap; dbReady: boolean }> {
  try {
    const res = await fetch("/api/content", { credentials: "same-origin" });
    const data = await readJsonSafe(res);
    return { content: (data && data.content) || {}, dbReady: Boolean(data && data.dbReady) };
  } catch {
    return { content: {}, dbReady: false };
  }
}

export async function saveSiteContent(
  key: string,
  value: string,
  meta: { page?: string; label?: string; type?: string } = {}
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/content/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ value, ...meta }),
    });
    const data = await readJsonSafe(res);
    if (!res.ok || data?.ok === false) return { ok: false, error: data?.error || "تعذر الحفظ." };
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذر الاتصال بالخادم." };
  }
}

export async function deleteSiteContent(key: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/content/${encodeURIComponent(key)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    const data = await readJsonSafe(res);
    if (!res.ok || data?.ok === false) return { ok: false, error: data?.error || "تعذر الحذف." };
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذر الاتصال بالخادم." };
  }
}
