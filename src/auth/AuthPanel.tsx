import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import { useAuth } from "./AuthContext";

type Tab = "login" | "register";

export default function AuthPanel({
  title = "تسجيل الدخول",
  subtitle = "للدخول إلى الموقع التدريبي والاستفادة من الاختبارات والمكتبة يلزم تسجيل الدخول",
  notice = "",
  onAuthenticated,
}: {
  title?: string;
  subtitle?: string;
  notice?: string;
  onAuthenticated?: () => void;
}) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit() {
    if (busy) return;
    setError(null);
    setInfo(null);

    if (!email.trim() || !password) {
      setError("أدخل البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setBusy(true);
    const result = tab === "login" ? await signIn(email, password) : await signUp(email, password, name);
    setBusy(false);

    if (!result.ok) {
      setError(result.error || "حدث خطأ غير متوقع. حاول مرة أخرى.");
      return;
    }

    if (result.message) {
      setInfo(result.message);
      setTab("login");
      setPassword("");
      return;
    }

    onAuthenticated?.();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0B0F16] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.30)] sm:p-9"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(65,90,119,0.22),transparent_45%)]" />
        <div className="relative">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#415A77]/30 bg-[#415A77]/10">
            <ShieldCheck className="h-5 w-5 text-[#8FA9C4]" />
          </div>

          <h2 className="text-3xl font-semibold leading-snug text-white">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{subtitle}</p>

          <div className="mt-7 flex gap-1 rounded-2xl border border-white/10 bg-[#070B11] p-1">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                tab === "login" ? "bg-[#415A77]/25 text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              <LogIn className="h-4 w-4" /> تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                tab === "register" ? "bg-[#415A77]/25 text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              <UserPlus className="h-4 w-4" /> إنشاء حساب
            </button>
          </div>

          <div className="mt-6 space-y-4" onKeyDown={onKeyDown}>
            {tab === "register" && (
              <Field
                icon={<UserIcon className="h-4 w-4 text-[#8FA9C4]" />}
                placeholder="الاسم"
                value={name}
                onChange={setName}
                type="text"
                autoComplete="name"
              />
            )}
            <Field
              icon={<Mail className="h-4 w-4 text-[#8FA9C4]" />}
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={setEmail}
              type="email"
              autoComplete="email"
              dir="ltr"
            />
            <Field
              icon={<Lock className="h-4 w-4 text-[#8FA9C4]" />}
              placeholder="كلمة المرور"
              value={password}
              onChange={setPassword}
              type="password"
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              dir="ltr"
            />
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-800/40 bg-red-900/10 px-4 py-3 text-sm leading-6 text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-800/40 bg-emerald-900/10 px-4 py-3 text-sm leading-6 text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{info}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#8FA9C4]/40 bg-[#8FA9C4]/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {tab === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
          </button>
        </div>
      </motion.div>

      {notice && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-xs leading-7 text-zinc-500">
          {notice}
        </div>
      )}
    </section>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
  type,
  autoComplete,
  dir,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B11] px-4 transition focus-within:border-[#415A77]/50">
      <span className="flex-shrink-0">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        dir={dir}
        className="w-full bg-transparent py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
      />
    </div>
  );
}
