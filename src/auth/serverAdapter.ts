import type { AuthAdapter, AuthResult } from "./types";

async function readJsonSafe(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function requestAuth(path: string, body?: Record<string, unknown>): Promise<AuthResult> {
  try {
    const res = await fetch(path, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      credentials: "same-origin",
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await readJsonSafe(res);

    if (!res.ok || data?.ok === false) {
      return {
        ok: false,
        error:
          data?.error ||
          "تعذر تسجيل الدخول حاليًا. يرجى المحاولة لاحقًا.",
      };
    }

    return {
      ok: true,
      message: data?.message,
      user: data?.user,
      isDeveloper: Boolean(data?.isDeveloper),
    };
  } catch {
    return {
      ok: false,
      error:
        "تعذر تسجيل الدخول حاليًا. يرجى المحاولة لاحقًا.",
    };
  }
}

export const serverAdapter: AuthAdapter = {
  signUp(email, password, name) {
    return requestAuth("/api/auth/signup", { email, password, name });
  },

  signIn(email, password) {
    return requestAuth("/api/auth/signin", { email, password });
  },

  async signOut() {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // لا نمنع تنظيف الجلسة من الواجهة عند تعذر الاتصال.
    }
  },

  getSession() {
    return requestAuth("/api/auth/me");
  },
};
