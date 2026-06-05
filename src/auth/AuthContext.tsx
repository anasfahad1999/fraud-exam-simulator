import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authClient } from "./authClient";
import type { AuthResult, AuthRole, AuthUser } from "./types";
import { logEvent } from "./analytics";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isDeveloper: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, name?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (roles: AuthRole | AuthRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isLocalDeveloperPreviewEnabled() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    import.meta.env.DEV === true &&
    import.meta.env.VITE_ENABLE_DEV_PREVIEW === "true" &&
    (host === "localhost" || host === "127.0.0.1")
  );
}

const previewUser: AuthUser = {
  id: "local-developer-preview",
  email: "preview@thughrah.local",
  name: "معاينة المطور",
  role: "developer",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyAuthResult = useCallback((result: AuthResult) => {
    if (result.ok && result.user) {
      setUser(result.user);
      setIsDeveloper(Boolean(result.isDeveloper));
    } else {
      setUser(null);
      setIsDeveloper(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const result = await authClient.getSession();
    applyAuthResult(result);
  }, [applyAuthResult]);

  useEffect(() => {
    if (isLocalDeveloperPreviewEnabled()) {
      setUser(previewUser);
      setIsDeveloper(true);
      setLoading(false);
      return;
    }

    let mounted = true;
    authClient
      .getSession()
      .then((result) => {
        if (mounted) applyAuthResult(result);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [applyAuthResult]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (isLocalDeveloperPreviewEnabled()) {
        setUser(previewUser);
        setIsDeveloper(true);
        return { ok: true, user: previewUser, isDeveloper: true };
      }

      const result = await authClient.signIn(email, password);
      if (result.ok && result.user) {
        setUser(result.user);
        setIsDeveloper(Boolean(result.isDeveloper));
        logEvent("login", { role: result.user.role, isDeveloper: Boolean(result.isDeveloper) });
      }
      return result;
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      if (isLocalDeveloperPreviewEnabled()) {
        setUser(previewUser);
        setIsDeveloper(true);
        return { ok: true, user: previewUser, isDeveloper: true };
      }

      const result = await authClient.signUp(email, password, name);
      if (result.ok && result.user && !result.message) {
        setUser(result.user);
        setIsDeveloper(Boolean(result.isDeveloper));
        logEvent("signup", { role: result.user.role, isDeveloper: Boolean(result.isDeveloper) });
      }
      return result;
    },
    []
  );

  const signOut = useCallback(async () => {
    if (isLocalDeveloperPreviewEnabled()) {
      setUser(previewUser);
      setIsDeveloper(true);
      return;
    }

    await authClient.signOut();
    logEvent("logout");
    setUser(null);
    setIsDeveloper(false);
  }, []);

  const hasRole = useCallback(
    (roles: AuthRole | AuthRole[]) => {
      if (!user) return false;
      const allowed = Array.isArray(roles) ? roles : [roles];
      return allowed.includes(user.role);
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isDeveloper,
      signIn,
      signUp,
      signOut,
      refreshSession,
      hasRole,
    }),
    [user, loading, isDeveloper, signIn, signUp, signOut, refreshSession, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
