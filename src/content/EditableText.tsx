// src/content/EditableText.tsx
// مكوّن نص قابل للتعديل المباشر.
//
// - للمستخدم العادي (أو خارج وضع التحرير): يعرض النص فقط، بلا أي فرق.
// - للمطوّر في وضع التحرير: يظهر إطار متقطّع، وبالضغط عليه يفتح محرّرًا صغيرًا
//   يحفظ مباشرة عبر /api/content. زر "إرجاع للأصل" يحذف التعديل فيعود نص الكود.
//
// مثال:
//   <EditableText id="home.hero.tagline" page="home" label="شعار الصفحة الرئيسية"
//     fallback="ثغرة مساحة مهنية لقراءة الإشارات التي تختبئ داخل الأرقام" as="h2" className="..." />

import React, { useEffect, useRef, useState } from "react";
import { useSiteContent } from "./SiteContentProvider";

type EditableTextProps = {
  /** مفتاح ثابت فريد مثل home.hero.tagline */
  id: string;
  /** النص الافتراضي الحالي الموجود في الكود (يظهر إذا لا يوجد تعديل محفوظ) */
  fallback: string;
  /** اسم الصفحة، للتنظيم داخل لوحة المطور */
  page?: string;
  /** وصف مقروء للحقل */
  label?: string;
  /** text لسطر واحد، textarea لفقرة */
  variant?: "text" | "textarea";
  /** الوسم الذي يُعرض به النص (span افتراضيًا) */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

export function EditableText({
  id,
  fallback,
  page,
  label,
  variant = "text",
  as = "span",
  className = "",
}: EditableTextProps) {
  const { get, save, revert, canEdit, editMode } = useSiteContent();
  const current = get(id, fallback);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(current);
  }, [current, editing]);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const Tag = as as any;

  // المستخدم العادي أو خارج وضع التحرير: نص فقط، بلا أي تغيير بصري.
  if (!canEdit || !editMode) {
    return <Tag className={className}>{current}</Tag>;
  }

  if (!editing) {
    return (
      <Tag
        className={`${className} cursor-text rounded-sm outline-dashed outline-1 outline-emerald-500/40 transition hover:outline-emerald-400/80`}
        title="اضغط للتعديل"
        onClick={() => {
          setError(null);
          setEditing(true);
        }}
      >
        {current}
      </Tag>
    );
  }

  const commit = async () => {
    if (draft === current) {
      setEditing(false);
      return;
    }
    setBusy(true);
    setError(null);
    const res = await save(id, draft, {
      page: page || id.split(".")[0],
      label: label || id,
      type: variant === "textarea" ? "textarea" : "text",
    });
    setBusy(false);
    if (res.ok) setEditing(false);
    else setError(res.error || "تعذر الحفظ.");
  };

  const onRevert = async () => {
    setBusy(true);
    setError(null);
    const res = await revert(id);
    setBusy(false);
    if (res.ok) setEditing(false);
    else setError(res.error || "تعذر الإرجاع.");
  };

  return (
    <span
      dir="rtl"
      className="inline-flex max-w-full flex-col gap-2 rounded-md border border-emerald-500/40 bg-zinc-900/95 p-3 align-top shadow-xl"
    >
      {variant === "textarea" ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className="min-w-[18rem] resize-y rounded bg-zinc-800 px-3 py-2 text-sm leading-relaxed text-zinc-100 outline-none ring-1 ring-zinc-700 focus:ring-emerald-500"
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="min-w-[18rem] rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-700 focus:ring-emerald-500"
        />
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
      <span className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={commit}
          className="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {busy ? "جارٍ الحفظ…" : "حفظ"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setEditing(false)}
          className="rounded bg-zinc-700 px-3 py-1 text-xs text-zinc-200 transition hover:bg-zinc-600 disabled:opacity-50"
        >
          إلغاء
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onRevert}
          className="mr-auto rounded px-3 py-1 text-xs text-zinc-400 transition hover:text-amber-300"
          title="حذف التعديل المحفوظ والرجوع للنص الأصلي الموجود في الكود"
        >
          إرجاع للأصل
        </button>
      </span>
      <span className="text-[10px] text-zinc-500">المفتاح: {id}</span>
    </span>
  );
}

export default EditableText;
