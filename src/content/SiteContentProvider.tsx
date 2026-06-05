// src/content/SiteContentProvider.tsx
// يحمّل نصوص الموقع مرة واحدة، ويوفّر دوال القراءة/الحفظ/الإرجاع لكامل التطبيق.
// يضيف زرًا عائمًا "وضع تحرير المحتوى" يظهر للمطوّر فقط.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { deleteSiteContent, fetchSiteContent, saveSiteContent, type SiteContentMap } from "./contentClient";
import { useAuth } from "../auth/AuthContext";

interface SiteContentValue {
  ready: boolean;
  dbReady: boolean;
  editMode: boolean;
  canEdit: boolean; // المطوّر فقط
  setEditMode: (on: boolean) => void;
  get: (key: string, fallback: string) => string;
  save: (
    key: string,
    value: string,
    meta?: { page?: string; label?: string; type?: string }
  ) => Promise<{ ok: boolean; error?: string }>;
  revert: (key: string) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<SiteContentValue | null>(null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const { isDeveloper } = useAuth();
  const [content, setContent] = useState<SiteContentMap>({});
  const [ready, setReady] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const refresh = useCallback(async () => {
    const { content: map, dbReady: ready2 } = await fetchSiteContent();
    setContent(map);
    setDbReady(ready2);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchSiteContent()
      .then(({ content: map, dbReady: ready2 }) => {
        if (!mounted) return;
        setContent(map);
        setDbReady(ready2);
      })
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // إيقاف وضع التحرير تلقائيًا لو لم يعد المستخدم مطوّرًا.
  useEffect(() => {
    if (!isDeveloper) setEditMode(false);
  }, [isDeveloper]);

  const get = useCallback(
    (key: string, fallback: string) => {
      const v = content[key];
      return v === undefined || v === null ? fallback : v;
    },
    [content]
  );

  const save = useCallback(
    async (key: string, value: string, meta: { page?: string; label?: string; type?: string } = {}) => {
      const res = await saveSiteContent(key, value, meta);
      if (res.ok) setContent((prev) => ({ ...prev, [key]: value }));
      return res;
    },
    []
  );

  const revert = useCallback(async (key: string) => {
    const res = await deleteSiteContent(key);
    if (res.ok)
      setContent((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    return res;
  }, []);

  const value = useMemo<SiteContentValue>(
    () => ({ ready, dbReady, editMode, canEdit: isDeveloper, setEditMode, get, save, revert, refresh }),
    [ready, dbReady, editMode, isDeveloper, get, save, revert, refresh]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {isDeveloper && <EditModeToggle editMode={editMode} setEditMode={setEditMode} dbReady={dbReady} />}
    </Ctx.Provider>
  );
}

function EditModeToggle({
  editMode,
  setEditMode,
  dbReady,
}: {
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  dbReady: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => setEditMode(!editMode)}
      dir="rtl"
      className={`fixed bottom-5 left-5 z-[60] flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur transition ${
        editMode ? "bg-emerald-500/90 text-white" : "bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700/90"
      }`}
      title={dbReady ? "" : "تنبيه: قاعدة البيانات غير مربوطة بعد، الحفظ لن ينجح حتى تربطها."}
    >
      {editMode ? "إنهاء وضع التحرير" : "وضع تحرير المحتوى"}
      {!dbReady && <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />}
    </button>
  );
}

export function useSiteContent(): SiteContentValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSiteContent must be used within <SiteContentProvider>");
  return ctx;
}
