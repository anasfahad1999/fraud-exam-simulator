import React, { useEffect, useState } from "react";
import Simulator from "./Simulator";
import AMLLaw from "./AMLLaw";
import AntifraudLaw from "./AntifraudLaw";
import AntiCorruptionLaw from "./AntiCorruptionLaw";
import AntiBriberyLaw from "./AntiBriberyLaw";
import EvidenceLaw from "./EvidenceLaw";
import EvidenceElectronicLaw from "./EvidenceElectronicLaw";
import ExpertRegulations from "./ExpertRegulations";
import EnronCase from "./EnronCase";
import DeveloperDashboard from "./DeveloperDashboard";
import AuthPanel from "./auth/AuthPanel";
import { useAuth } from "./auth/AuthContext";
import EditableText from "./content/EditableText";
import { motion } from "framer-motion";
import { trainingQuizData, trainingTopics, type TrainingQuizModel } from "./trainingQuizData";
import { mockExamModels, type MockExamModel } from "./mockExamModels";

import {
  Archive,
  BookOpen,
  ChevronDown,
  FileSearch,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  FileText,
  Layers,
  LogOut,
  UserCircle,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const navItems = [
  { label: "الرئيسية", href: "/", icon: Home },
  { label: "التحليلات", href: "/insights", icon: FileSearch },
  { label: "مختبر المؤشرات", href: "/red-flags", icon: ShieldAlert },
  { label: "المكتبة", href: "/library", icon: Archive },
  { label: "الاختبارات المهنية", href: "/professional-exams", icon: BookOpen },
];

const latestInsights = [
  {
    title: "عندما يبدو النقد موجودًا لكنه غير قابل للتحقق",
    category: "تحليل مالي جنائي",
    desc: "كيف تتحول بعض الأرصدة النقدية إلى أرقام يصعب التحقق منها رغم ظهورها داخل القوائم المالية.",
  },
  {
    title: "تجاوز إجراءات الشراء: البداية الصامتة للاحتيال",
    category: "احتيال المشتريات",
    desc: "ليست كل التجاوزات واضحة، أحيانًا تبدأ الثغرة بقرار صغير لا يلاحظه أحد.",
  },
  {
    title: "القيود اليدوية في نهاية الفترة",
    category: "مؤشرات اشتباه",
    desc: "متى تصبح القيود اليدوية مؤشرًا مهنيًا يستحق التوقف والتحليل؟",
  },
];

const featuredCase = {
  title: "Wirecard — عندما يصبح التحقق مستحيلاً",
  tag: "قضية مميزة",
  summary:
    "كيف ساهمت الأطراف الخارجية والحسابات غير القابلة للتحقق في بناء واحدة من أكثر القضايا المحاسبية إثارة للجدل.",
  points: [
    "أرصدة نقدية يصعب التحقق منها",
    "اعتماد مفرط على أطراف خارجية",
    "فجوات بين الواقع والتقارير المنشورة",
  ],
};

const featuredSignals = [
  "ارتفاع الإيرادات دون نمو مماثل في التدفقات النقدية",
  "مورد جديد بعقود مرتفعة وغياب تاريخ تشغيلي واضح",
  "قيود محاسبية غير معتادة قرب الإقفال المالي",
  "مدفوعات متكررة دون مستندات داعمة كافية",
];

const insightCategories = [
  "الكل",
  "قضايا",
  "غسل أموال",
  "تلاعب محاسبي",
  "مشتريات",
  "مؤشرات",
];

const insightsLibrary = [
  {
    title: "إنرون وأزمة الثقة بالقوائم",
    type: "تحليل قضية",
    time: "35 دقيقة",
    desc: "شركة كبرت قوائمها سريعًا وتراكمت خلف النمو كيانات والتزامات وصفقات جعلت الخطر أبعد عن عين القارئ.",
    category: "قضايا",
    action: "enron",
  },
  {
    title: "وايركارد… نقد معلن وسؤال مفتوح",
    type: "تحليل قضية",
    time: "12 دقيقة",
    desc: "رصيد نقدي ضخم بدا مركز القوة في القوائم. ثم صار موضع السؤال: أين يوجد ومن تحقق منه وكيف مرّت الفجوة؟",
    category: "قضايا",
  },
  {
    title: "ليمان براذرز… Repo 105 قبل الإقفال",
    type: "قراءة تحليلية",
    time: "10 دقائق",
    desc: "عمليات إعادة شراء صُنفت كمبيعات أخرجت أصولًا من الميزانية مؤقتًا وخفّضت الرافعة المالية في لحظة التقرير.",
    category: "تلاعب محاسبي",
  },
  {
    title: "المشتريات… علاقة خلف العقد",
    type: "سيناريو عملي",
    time: "8 دقائق",
    desc: "مورد يدخل المشهد واعتماد يتسارع وعلاقة جانبية تمنح العملية معنى آخر.",
    category: "مشتريات",
  },
  {
    title: "إيرادات آخر الفترة… نمو يطلب التحقق",
    type: "مؤشر اشتباه",
    time: "6 دقائق",
    desc: "ارتفاع قريب من الإقفال يضع التوقيت والاكتمال والتحصيل تحت نظر الفاحص.",
    category: "مؤشرات",
  },
];

const socialLinks = [
  { label: "X", href: "https://x.com/thaghrah_sa", icon: XSocialIcon },
  { label: "WhatsApp", href: "https://wa.me/966559942772", icon: WhatsAppSocialIcon },
  { label: "Telegram", href: "#", icon: TelegramSocialIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInSocialIcon },
];

const megaLinks = [
  {
    title: "تحليل قضية",
    desc: "قراءات في قضايا الاحتيال والتلاعب المالي.",
    href: "/insights",
  },
  {
    title: "مختبر المؤشرات",
    desc: "مؤشرات تساعد على فهم الأنماط غير الطبيعية.",
    href: "/red-flags",
  },
  {
    title: "مرجع مرتبط",
    desc: "قوانين وأنظمة ومراجع وقضايا منظمة داخل مكتبة معرفية.",
    href: "/library",
  },
];


// ─── Shared UI Components ────────────────────────────────────────────────────

function BrandMark({ compactness = 0 }) {
  const height = 54 - compactness * 16;
  const maxWidth = 260 - compactness * 62;

  return (
    <div className="flex items-center transition-all duration-200 ease-out" style={{ opacity: 1 - compactness * 0.08 }}>
      <img
        src={`${import.meta.env.BASE_URL}logo-transparent.png`}
        alt="ثغرة — نقرأ ما خلف الأرقام"
        style={{ height: `${height}px`, width: 'auto', maxWidth: `${maxWidth}px`, objectFit: 'contain', transition: 'height 180ms ease, max-width 180ms ease, opacity 180ms ease' }}
      />
    </div>
  );
}

function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#05070B]" />
      <div className="thaghrah-orb thaghrah-orb-one" />
      <div className="thaghrah-orb thaghrah-orb-two" />
      <div className="thaghrah-orb thaghrah-orb-three" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(143,169,196,0.08),transparent_28%),linear-gradient(135deg,rgba(65,90,119,0.12),transparent_34%),linear-gradient(to_bottom,rgba(5,7,11,0.24),rgba(5,7,11,0.96))]" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0B1220]/70 to-transparent" />
    </div>
  );
}

function XSocialIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2H21.5l-7.11 8.126L22.75 22h-6.548l-5.13-6.704L5.205 22H1.947l7.604-8.69L1.5 2h6.714l4.637 6.13L18.244 2Zm-1.143 17.91h1.805L7.235 3.98H5.298L17.101 19.91Z" />
    </svg>
  );
}

function WhatsAppSocialIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.52 3.48A11.84 11.84 0 0 0 12.1 0C5.56 0 .25 5.3.25 11.83c0 2.08.55 4.12 1.6 5.91L0 24l6.42-1.68a11.8 11.8 0 0 0 5.67 1.44h.01c6.53 0 11.84-5.3 11.85-11.83 0-3.16-1.23-6.14-3.43-8.45ZM12.1 21.76h-.01a9.82 9.82 0 0 1-5-1.37l-.36-.22-3.8 1 1.01-3.7-.24-.38a9.8 9.8 0 0 1-1.5-5.26c0-5.43 4.43-9.84 9.9-9.84 2.64 0 5.13 1.03 7 2.9a9.78 9.78 0 0 1 2.9 7.03c0 5.43-4.44 9.84-9.9 9.84Zm5.43-7.36c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function TelegramSocialIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21.94 4.28c.32-1.39-.52-1.94-1.48-1.54L2.63 9.62c-1.22.48-1.2 1.16-.22 1.46l4.57 1.43 1.75 5.36c.22.61.11.85.76.85.5 0 .72-.23 1-.5l2.4-2.33 4.99 3.69c.92.5 1.58.24 1.81-.85L21.94 4.28ZM7.72 12.18l10.6-6.68c.5-.3.96-.14.58.2l-9.07 8.18-.35 3.77-1.76-5.47Z" />
    </svg>
  );
}

function LinkedInSocialIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function YouTubeSocialIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

function Tag({ children, tone = "blue" }) {
  const toneClass =
    tone === "red"
      ? "border-[#B3261E]/25 bg-[#B3261E]/10 text-[#D7A29E]"
      : tone === "muted"
      ? "border-white/10 bg-white/[0.03] text-zinc-400"
      : "border-[#415A77]/25 bg-[#415A77]/12 text-[#d8e4f2]";

  return (
    <span className={`inline-flex items-center border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

function Surface({ children, className = "" }) {
  return (
    <div className={`border border-white/10 bg-[#0B0F16]/90 shadow-[0_24px_80px_rgba(0,0,0,0.22)] ${className}`}>
      {children}
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────

function TopNavigation({ currentPage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navCompactness, setNavCompactness] = useState(0);
  const { user, signOut, isDeveloper } = useAuth();

  useEffect(() => {
    let frame = 0;

    const calculateCompactness = () => {
      const start = window.innerHeight * 0.5;
      const distance = Math.min(420, Math.max(240, window.innerHeight * 0.35));
      const nextValue = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      setNavCompactness(Number(nextValue.toFixed(3)));
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        calculateCompactness();
      });
    };

    calculateCompactness();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateCompactness);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateCompactness);
    };
  }, []);

  const handleNavigate = (href) => {
    onNavigate(href);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    handleNavigate("/");
  };

  const visibleNavItems = isDeveloper
    ? [...navItems, { label: "لوحة المطور", href: "/developer", icon: ShieldCheck }]
    : navItems;

  const searchSuggestions = [
    ["تحليل", "Wirecard — النقد غير القابل للتحقق"],
    ["مؤشر", "قيود يدوية آخر الفترة"],
    ["مرجع", "ISA 240 — مسؤوليات المراجع تجاه الغش"],
    ["اختبار مهني", "نماذج تدريبية — غسل الأموال"],
  ];

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter(([, value]) =>
        value.includes(searchQuery)
      )
    : searchSuggestions;

  const navHeight = 112 - navCompactness * 42;
  const controlSize = 44 - navCompactness * 6;

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-200 ease-out"
      style={{
        backgroundColor: `rgba(5, 7, 11, ${0.88 + navCompactness * 0.08})`,
        borderColor: `rgba(255,255,255,${0.1 - navCompactness * 0.025})`,
        boxShadow: navCompactness > 0.02 ? `0 ${10 + navCompactness * 8}px ${34 + navCompactness * 22}px rgba(0,0,0,${0.18 + navCompactness * 0.12})` : "none",
      }}
    >
      <div
        className="mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-200 ease-out lg:px-8"
        style={{ height: `${navHeight}px` }}
      >
        <button onClick={() => handleNavigate("/")} className="focus:outline-none">
          <BrandMark compactness={navCompactness} />
        </button>

        <nav className="hidden items-center lg:flex" style={{ gap: `${32 - navCompactness * 10}px` }}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavigate(item.href); }}
                className={`group flex items-center gap-2 border-b text-sm transition ${
                  isActive
                    ? "border-[#415A77] text-white"
                    : "border-transparent text-zinc-500 hover:border-white/20 hover:text-white"
                }`}
                style={{ paddingTop: `${8 - navCompactness * 2}px`, paddingBottom: `${8 - navCompactness * 2}px`, fontSize: `${14 - navCompactness}px` }}
              >
                <Icon className="h-4 w-4 text-[#415A77] opacity-70 transition group-hover:opacity-100" />
                {item.label}
              </a>
            );
          })}

          <div className="group relative">
            <button
              className="flex items-center gap-2 border-b border-transparent text-sm text-zinc-500 transition hover:border-white/20 hover:text-white"
              style={{ paddingTop: `${8 - navCompactness * 2}px`, paddingBottom: `${8 - navCompactness * 2}px`, fontSize: `${14 - navCompactness}px` }}
            >
              المزيد
              <ChevronDown className="h-4 w-4 text-zinc-600" />
            </button>
            <div className="invisible absolute left-0 top-full w-[520px] translate-y-4 border border-white/10 bg-[#0B0F16]/96 p-5 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-xl transition group-hover:visible group-hover:translate-y-3 group-hover:opacity-100">
              <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
                <Sparkles className="h-3.5 w-3.5 text-[#415A77]" />
                مسارات المعرفة داخل ثغرة
              </div>
              <div className="grid gap-2">
                {megaLinks.map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavigate(link.href); }}
                    className="border border-transparent p-4 transition hover:border-[#415A77]/25 hover:bg-[#415A77]/10"
                  >
                    <div className="font-medium text-white">{link.title}</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-500">{link.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-[#415A77]/40 hover:text-white"
            style={{ height: `${controlSize}px`, width: `${controlSize}px` }}
          >
            <Search className="h-4 w-4" />
          </button>

          {user ? (
            <div className="flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400">
              <UserCircle className="h-4 w-4 text-[#8FA9C4]" />
              <span className="max-w-[150px] truncate" dir="ltr">{user.email}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="mr-2 flex items-center gap-1 text-zinc-500 transition hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                خروج
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigate("/login")}
              className="border border-[#8FA9C4]/30 bg-[#8FA9C4]/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20"
            >
              تسجيل الدخول
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center border border-white/10 bg-white/[0.03] text-zinc-300 lg:hidden"
          style={{ height: `${controlSize}px`, width: `${controlSize}px` }}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[380px] border-l border-white/10 bg-[#05070B] p-5 shadow-2xl shadow-black/50">
            <div className="mb-8 flex items-center justify-between">
              <BrandMark />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.href;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.href)}
                    className={`flex items-center gap-3 border px-4 py-4 text-right transition ${
                      isActive
                        ? "border-[#415A77]/30 bg-[#415A77]/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-[#415A77]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border border-white/10 bg-white/[0.02] p-4">
              {user ? (
                <div className="space-y-3 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-[#8FA9C4]" />
                    <span className="truncate" dir="ltr">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 border border-white/10 px-4 py-3 text-zinc-400 transition hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavigate("/login")}
                  className="w-full border border-[#8FA9C4]/30 bg-[#8FA9C4]/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/75 px-5 pt-24 backdrop-blur-sm">
          <Surface className="w-full max-w-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">البحث داخل ثغرة</div>
                <div className="mt-1 text-sm text-zinc-500">
                  ابحث عن تحليل أو مؤشر أو مرجع أو اختبار مهني
                </div>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابدأ بكتابة كلمة بحث..."
              className="w-full border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#415A77]/50"
            />

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {filteredSuggestions.map(([type, value]) => (
                <div key={value} className="border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-xs text-[#415A77]">{type}</div>
                  <div className="mt-2 text-sm leading-7 text-zinc-300">{value}</div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      )}
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ onNavigate }) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05070B]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.05fr_0.65fr_1fr_0.7fr] lg:px-8">
        <div>
          <BrandMark />
          <EditableText
            id="footer.description"
            page="الفوتر"
            label="وصف ثغرة في الفوتر"
            as="p"
            className="mt-7 max-w-md leading-8 text-zinc-500"
            variant="textarea"
            fallback="ثغرة مساحة مهنية لقراءة الإشارات التي تختبئ داخل الأرقام"
          />
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-white">المنصة</h3>
          <div className="grid gap-3 text-sm text-zinc-500">
            {navItems.slice(1).map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => { e.preventDefault(); onNavigate(item.href); }}
                className="transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-white">حقوق النشر</h3>
          <div className="space-y-4 text-sm leading-8 text-zinc-500">
            <EditableText
              id="footer.rights.notice"
              page="الفوتر"
              label="تنبيه حقوق النشر"
              as="p"
              variant="textarea"
              fallback="جميع المواد والتحليلات والمحتوى المنشور على منصة ثغرة مخصص للأغراض التعليمية والتثقيفية فقط ويهدف إلى رفع الوعي المالي وتنمية مهارات قراءة الأرقام والبيانات."
            />
            <EditableText
              id="footer.rights.republish"
              page="الفوتر"
              label="منع إعادة النشر"
              as="p"
              variant="textarea"
              fallback="يُحظر نقل أي مواد أو تحليلات أو محتوى من المنصة أو إعادة نشره أو توزيعه أو استخدامه لأغراض تجارية دون الحصول على إذن مسبق من إدارة ثغرة."
            />
            <EditableText id="footer.copyright" page="الفوتر" label="عبارة الحقوق" as="p" className="text-zinc-400" variant="text" fallback="ثغرة — جميع الحقوق محفوظة" />
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-white">منصات التواصل</h3>
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              const disabled = item.href === "#";
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={disabled ? undefined : "_blank"}
                  rel={disabled ? undefined : "noreferrer"}
                  aria-label={item.label}
                  title={item.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-transparent text-[#8FA9C4] transition hover:border-[#8FA9C4]/50 hover:bg-white/[0.04] hover:text-white"
                  onClick={(e) => { if (disabled) e.preventDefault(); }}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-zinc-600 md:flex-row">
          <EditableText id="footer.bottom.brand" page="الفوتر" label="النص السفلي الأيمن" as="span" variant="text" fallback="ثغرة — نقرأ ما خلف الأرقام" />
          <EditableText id="footer.bottom.description" page="الفوتر" label="النص السفلي الأيسر" as="span" variant="text" fallback="منصة معرفية للجرائم المالية والاحتيال" />
        </div>
      </div>
    </footer>
  );
}

// ─── Page Shell ──────────────────────────────────────────────────────────────

function PageFrame({ children, currentPage, onNavigate }) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#05070B] text-[#F5F5F5] selection:bg-[#415A77]/30">
      <GlobalBackground />
      <TopNavigation currentPage={currentPage} onNavigate={onNavigate} />
      <main className="relative z-10">{children}</main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function PageHero({ eyebrow, title, gradient, desc }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-4xl"
      >
        <div className="mb-7 inline-flex items-center gap-3 border-r border-[#415A77] pr-4 text-sm text-zinc-400">
          <span className="h-2 w-2 bg-[#415A77]" />
          {eyebrow}
        </div>
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-[#E0E1DD] md:text-7xl">
          {title}
          <span className="mt-3 block text-[#8FA9C4]">{gradient}</span>
        </h1>
        <p className="mt-9 max-w-3xl text-lg leading-9 text-zinc-400">{desc}</p>
      </motion.div>
    </section>
  );
}

function PreviewCards({ cards }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
        {cards.map(([title, desc]) => (
          <div key={title} className="bg-[#0B0F16] p-8 transition hover:bg-[#0E141D]">
            <div className="mb-8 h-px w-14 bg-[#415A77]" />
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-5 leading-8 text-zinc-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onNavigate }) {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="absolute left-10 top-24 h-40 w-40 rounded-full bg-[#8FA9C4]/10 blur-3xl" />
        <div className="absolute right-10 bottom-16 h-52 w-52 rounded-full bg-[#41B8AC]/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(14,20,29,0.80),rgba(7,11,17,0.48))] px-6 py-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.32)] backdrop-blur md:px-12 md:py-16 lg:px-20 lg:py-20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(143,169,196,0.15),transparent_32%),radial-gradient(circle_at_18%_82%,rgba(65,184,172,0.10),transparent_34%)]" />
          <div className="relative mx-auto max-w-5xl">
            <div className="select-none">
              <img
                src={`${import.meta.env.BASE_URL}logo-transparent.png`}
                alt="ثغرة — نقرأ ما خلف الأرقام"
                className="mx-auto h-auto w-[min(620px,86vw)] opacity-[0.66] drop-shadow-[0_24px_70px_rgba(143,169,196,0.10)]"
              />
            </div>

            <div className="mx-auto mt-11 max-w-4xl space-y-5 text-lg leading-9 text-zinc-400 md:text-xl md:leading-10">
              <EditableText id="home.hero.statement" page="الرئيسية" label="جملة بداية الصفحة الرئيسية" as="p" className="text-[#E0E1DD]/85" variant="text" fallback="هنا تُقرأ الأرقام كوقائع لا كقيم." />
              <EditableText
                id="home.hero.description"
                page="الرئيسية"
                label="العبارة التعريفية الرئيسية"
                as="p"
                variant="textarea"
                fallback={'"ثغرة" مساحة تختزل المسافة بين رصد المؤشر وتفكيك الاشتباه والنضج المهني لما يحدث خلف السجلات.'}
              />
              <EditableText
                id="home.hero.supportingText"
                page="الرئيسية"
                label="النص الداعم في الصفحة الرئيسية"
                as="p"
                className="text-zinc-500"
                variant="textarea"
                fallback="محتوى يجمع بين التدريب والمؤشرات والتحليلات المهنية المرتبطة بواقع الاحتيال المالي."
              />
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button onClick={() => onNavigate("/professional-exams")} className="border border-[#8FA9C4]/40 bg-[#8FA9C4]/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20">
                ابدأ التدريب
              </button>
              <button onClick={() => onNavigate("/red-flags")} className="border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white">
                استعرض المؤشرات
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <PreviewCards
        cards={[
          ["تدريب مهني", "نماذج وأسئلة تفاعلية مبنية على قراءة الواقعة لا على الحفظ أو التعريفات المجردة."],
          ["دليل المؤشرات", "إشارات عملية تساعدك على تحديد موضع الفحص والحساب والمستند والعلاقة والتوقيت."],
          ["مكتبة مرجعية", "مواد نظامية ومهنية مرتبة للرجوع السريع وربط الفكرة بسياقها الصحيح."],
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/[0.08] bg-[#0B0F16]/78 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur md:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm text-[#8FA9C4]">الرعاة</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">شركاء في بناء الوعي المهني</h2>
              <p className="mt-5 leading-8 text-zinc-500">
                ترحب ثغرة بالرعايات التي تدعم إنتاج محتوى مهني رصين وتساعد على إيصال المعرفة المتخصصة إلى جمهور أوسع.
              </p>
            </div>

            <div>
              <p className="text-sm text-[#8FA9C4]">الشركاء</p>

              <button
                type="button"
                onClick={() => onNavigate("/partner-crook")}
                className="group mt-4 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-right transition hover:border-[#8FA9C4]/35 hover:bg-white/[0.045]"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#05070B]">
                  <img
                    src={`${import.meta.env.BASE_URL}partner-crook.webp`}
                    alt="من المحتال؟"
                    className="h-full w-full object-cover grayscale opacity-85 transition group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-semibold text-white">من المحتال؟</span>
                  <span className="mt-2 block text-sm leading-7 text-zinc-500">
                    شريك معرفي في المحاسبة القضائية ورفع الوعي بمخاطر الاحتيال المالي.
                  </span>
                </span>
                <span className="hidden shrink-0 text-sm font-semibold text-[#8FA9C4] transition group-hover:text-white sm:inline">
                  عرض الشريك ←
                </span>
              </button>

              <h2 className="mt-7 text-3xl font-semibold text-white">مساحة تعاون للمهنيين والمبادرات</h2>
              <p className="mt-5 leading-8 text-zinc-500">
                لديك مبادرة أو محتوى مهني أو رغبة في دعم الوعي بمخاطر الاحتيال المالي؟ يسعدنا أن تكون جزءاً من ثغرة.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="leading-8 text-zinc-500">
              تواصل معنا لبحث فرص الرعاية أو الشراكة بما يناسب هوية ثغرة وجودة محتواها.
            </p>
            <a
              href="https://wa.me/966559942772"
              target="_blank"
              rel="noreferrer"
              className="w-fit border border-[#8FA9C4]/40 bg-[#8FA9C4]/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20"
            >
              تواصل للشراكة
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Insights Page ────────────────────────────────────────────────────────────


function InsightsFullPage({ onOpenEnronCase }: { onOpenEnronCase?: () => void }) {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered =
    activeCategory === "الكل"
      ? insightsLibrary
      : insightsLibrary.filter((item) => item.category === activeCategory);

  return (
    <>
      <PageHero
        eyebrow="التحليلات"
        title="ما خلف"
        gradient="الأرقام"
        desc="هنا تُقرأ القضايا المالية من أثرها داخل القوائم: رقم يظهر وخطر ينتقل وعلاقة تختبئ."
      />

      <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
        <div className="border border-white/10 bg-[#0B0F16] p-6 sm:p-8 lg:p-10">
          <div className="mb-7 flex flex-wrap items-center gap-3 text-xs">
            <Tag>مسار القراءة</Tag>
            <span className="text-zinc-600">قضايا ومؤشرات وسلوكيات مالية تُقرأ</span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-7">
              <h2 className="max-w-xl text-3xl font-semibold leading-[1.45] text-white sm:text-4xl">
                هنا يبدأ التحليل من أثر الرقم.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-9 text-zinc-400">
                قراءة تربط ما ظهر في القوائم بما تركته العملية في الوثائق والسجلات.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { no: "01", title: "الأثر", desc: "ما الذي تغيّر في الرقم؟" },
                { no: "02", title: "السياق", desc: "ما الوثيقة وما العلاقة؟" },
                { no: "03", title: "التوقيت", desc: "متى ظهر الخلل؟" },
              ].map((step) => (
                <div key={step.no} className="group border border-white/10 bg-[#0E141D] p-5 transition hover:border-[#8FA9C4]/30 hover:bg-[#111A25]">
                  <div className="mb-8 flex items-center justify-between gap-3">
                    <span className="text-xs text-[#8FA9C4]">{step.no}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="text-2xl font-semibold text-white">{step.title}</div>
                  <p className="mt-4 text-sm leading-7 text-zinc-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8">
        <div className="flex flex-col gap-4 border border-white/10 bg-[#0B0F16] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {insightCategories.map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`border px-4 py-2 text-sm transition ${
                  activeCategory === item
                    ? "border-[#8FA9C4]/35 bg-[#415A77]/15 text-white"
                    : "border-white/10 bg-white/[0.02] text-zinc-500 hover:border-white/20 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="text-sm text-zinc-500">
            {filtered.length === 1 ? "مادة واحدة" : `${filtered.length} مواد`}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        {filtered.length === 0 ? (
          <div className="border border-white/10 bg-[#0B0F16] p-16 text-center text-zinc-500">
            هذا التصنيف قيد الإعداد.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {filtered.map((item, idx) => {
              const isClickable = ("action" in item) && (item as { action?: string }).action === "enron" && onOpenEnronCase;
              const isFeatured = idx === 0 && activeCategory === "الكل";
              return (
                <article
                  key={item.title}
                  onClick={isClickable ? onOpenEnronCase : undefined}
                  className={`group relative overflow-hidden border border-white/10 bg-[#0B0F16] p-7 transition hover:border-[#8FA9C4]/25 hover:bg-[#0E141D] ${
                    isClickable ? "cursor-pointer" : ""
                  } ${isFeatured ? "lg:col-span-2 lg:p-9" : ""}`}
                >
                  <div className="mb-6 flex flex-wrap items-center gap-3 text-xs">
                    <Tag>{item.type}</Tag>
                    <span className="text-zinc-600">{item.time}</span>
                    {isClickable ? (
                      <span className="border border-[#8FA9C4]/30 bg-[#415A77]/12 px-2.5 py-1 text-[11px] text-[#d8e4f2]">متاح للقراءة</span>
                    ) : (
                      <span className="border border-white/10 px-2.5 py-1 text-[11px] text-zinc-600">قيد الإعداد</span>
                    )}
                  </div>

                  <h3 className={`${isFeatured ? "text-3xl sm:text-4xl" : "text-2xl"} font-semibold leading-[1.5] text-white transition group-hover:text-[#E0E1DD]`}>
                    {item.title}
                  </h3>

                  <p className={`${isFeatured ? "mt-7 text-base leading-9" : "mt-5 leading-8"} text-zinc-500`}>
                    {item.desc}
                  </p>

                  {isFeatured && (
                    <div className="mt-8 border border-white/10 bg-white/[0.02] p-5">
                      <div className="text-xs text-[#8FA9C4]">من زاوية ثغرة</div>
                      <p className="mt-3 text-sm leading-8 text-zinc-400">
                        نقرأ إنرون كمسار مهني يبدأ من الربح قبل النقد ويمر بالكيانات خارج الميزانية وينتهي بالمؤشرات التي كان ينبغي التوقف عندها.
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                    <span className="text-zinc-600">{item.category}</span>
                    <span className={`${isClickable ? "text-[#8FA9C4]" : "text-zinc-700"}`}>
                      {isClickable ? "فتح التحليل ←" : "قيد الإعداد"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

// ─── Red Flags Page ───────────────────────────────────────────────────────────

function RedFlagsFullPage() {
  const [activeCategory, setActiveCategory] = React.useState("الكل");

  const categories = [
    { key: "الكل", color: "#8FA9C4" },
    { key: "كشف التلاعب", color: "#42A66A" },
    { key: "تحليل القوائم", color: "#5B8DEF" },
    { key: "تتبع الأموال", color: "#41B8AC" },
    { key: "أنماط البيانات", color: "#B2A132" },
  ];

  const tools = [
    // ── كشف التلاعب ──
    {
      id: "beneish",
      category: "كشف التلاعب",
      name: "Beneish M-Score",
      nameAr: "مؤشر بينيش",
      oneLiner: "يقيس احتمال وجود تلاعب في القوائم المالية.",
      what: "نموذج إحصائي يعتمد على 8 متغيرات مالية لتحديد ما إذا كانت المنشأة تتلاعب بأرباحها المعلنة.",
      variables: ["مؤشر أيام المبيعات في الذمم DSRI", "مؤشر هامش الربح GMI", "مؤشر جودة الأصول AQI", "مؤشر نمو المبيعات SGI", "مؤشر الاستهلاك DEPI", "مؤشر المصاريف البيعية والإدارية SGAI", "مؤشر الرافعة LVGI", "مؤشر إجمالي الاستحقاقات TATA"],
      interpretation: "M-Score أعلى من -1.78 → احتمال تلاعب مرتفع.",
      chapter: "الفصل الثاني — احتيال القوائم المالية",
      type: "نموذج إحصائي",
    },
    {
      id: "altman",
      category: "كشف التلاعب",
      name: "Altman Z-Score",
      nameAr: "مؤشر التمان",
      oneLiner: "يتنبأ باحتمال إفلاس المنشأة خلال سنتين.",
      what: "نموذج يجمع 5 نسب مالية مرجّحة لتقييم الصحة المالية وقدرة المنشأة على الاستمرار.",
      variables: ["رأس المال العامل / إجمالي الأصول", "الأرباح المحتجزة / إجمالي الأصول", "الأرباح قبل الفوائد والضرائب / إجمالي الأصول", "القيمة السوقية / إجمالي الالتزامات", "المبيعات / إجمالي الأصول"],
      interpretation: "Z < 1.81 → منطقة خطر  |  Z بين 1.81–2.99 → منطقة رمادية  |  Z > 2.99 → منطقة آمنة",
      chapter: "الفصل الثاني — احتيال القوائم المالية",
      type: "نموذج تنبؤي",
    },

    // ── تحليل القوائم ──
    {
      id: "horizontal",
      category: "تحليل القوائم",
      name: "Horizontal Analysis",
      nameAr: "التحليل الأفقي",
      oneLiner: "يقارن البنود المالية عبر فترات زمنية متعددة.",
      what: "يحسب التغيّر في كل بند مالي بين فترتين أو أكثر (بالقيمة المطلقة والنسبة المئوية) لكشف الانحرافات غير المعتادة.",
      variables: ["التغيّر = قيمة الفترة الحالية − قيمة فترة الأساس", "نسبة التغيّر = (التغيّر ÷ فترة الأساس) × 100"],
      interpretation: "ابحث عن: قفزات مفاجئة في الإيرادات أو المصروفات، تغيرات لا تتسق مع نمو النشاط، اتجاه معاكس بين بنود مرتبطة.",
      chapter: "الفصل الثاني — احتيال القوائم المالية",
      type: "أداة مقارنة",
    },
    {
      id: "vertical",
      category: "تحليل القوائم",
      name: "Vertical Analysis",
      nameAr: "التحليل الرأسي",
      oneLiner: "يُظهر نسبة كل بند من إجمالي القائمة.",
      what: "يحوّل كل بند في القائمة المالية إلى نسبة مئوية من قاعدة واحدة (إجمالي الأصول أو إجمالي المبيعات) لتسهيل المقارنة.",
      variables: ["في قائمة الدخل: كل بند ÷ صافي المبيعات × 100", "في الميزانية: كل بند ÷ إجمالي الأصول × 100"],
      interpretation: "ابحث عن: بنود تنحرف عن متوسط الصناعة، تحوّل مفاجئ في هيكل التكاليف، عدم تناسب بين الإيرادات والمصروفات المرتبطة.",
      chapter: "الفصل الثاني — احتيال القوائم المالية",
      type: "أداة هيكلية",
    },
    {
      id: "ratios",
      category: "تحليل القوائم",
      name: "Ratio Analysis",
      nameAr: "تحليل النسب المالية",
      oneLiner: "نسب مختارة تكشف التناقضات بين البنود المالية.",
      what: "مجموعة من النسب المالية تُستخدم لاكتشاف العلاقات غير الطبيعية بين عناصر القوائم المالية.",
      variables: ["نسبة التداول ونسبة السيولة السريعة", "هامش الربح الإجمالي والصافي", "معدل دوران المخزون والذمم", "نسبة المصروفات التشغيلية للإيرادات", "نسبة الديون إلى حقوق الملكية"],
      interpretation: "ابحث عن: تغيّر حاد في نسبة مستقرة تاريخياً، تناقض بين نسبتين مرتبطتين، انحراف واضح عن الصناعة.",
      chapter: "الفصل الثاني — احتيال القوائم المالية + الفصل الثامن — التحقيق المتقدم",
      type: "مجموعة أدوات",
    },

    // ── تتبع الأموال ──
    {
      id: "net-worth",
      category: "تتبع الأموال",
      name: "Net Worth Method",
      nameAr: "تحليل صافي الثروة",
      oneLiner: "يقارن التغيّر في ثروة الشخص بدخله المعلن.",
      what: "يحسب صافي ثروة الشخص المشتبه به في بداية الفترة ونهايتها. إذا كان النمو أعلى من مصادر الدخل المعروفة، فهناك دخل غير مفسَّر.",
      variables: ["صافي الثروة = الأصول − الالتزامات", "الزيادة في الثروة = صافي الثروة (نهاية) − صافي الثروة (بداية)", "الدخل غير المفسَّر = الزيادة + المصاريف المعيشية − الدخل المعلن"],
      interpretation: "فائض إيجابي كبير يشير إلى مصدر دخل مخفي — مؤشر اختلاس أو رشوة.",
      chapter: "الفصل الثالث — اختلاس الأصول + الفصل الرابع — الفساد",
      type: "أداة تحقيق",
    },
    {
      id: "bank-deposit",
      category: "تتبع الأموال",
      name: "Bank Deposit Method",
      nameAr: "تحليل الإيداعات المصرفية",
      oneLiner: "يقارن الإيداعات الفعلية بمصادر الدخل المعروفة.",
      what: "يفحص إيداعات الحسابات المصرفية ويُطابقها مع مصادر الدخل الموثقة. الفارق يدل على أموال غير مبررة.",
      variables: ["إجمالي الإيداعات خلال الفترة", "ناقصاً: التحويلات بين الحسابات", "ناقصاً: القروض والمبالغ المستردة", "= صافي الإيداعات مقابل مصادر الدخل المعلن"],
      interpretation: "فائض الإيداعات عن الدخل المعلن → أموال مشبوهة تستدعي تتبعاً أعمق.",
      chapter: "الفصل الثالث — اختلاس الأصول + الفصل الخامس — غسل الأموال",
      type: "أداة تحقيق",
    },
    {
      id: "source-use",
      category: "تتبع الأموال",
      name: "Source & Use of Funds",
      nameAr: "مصادر واستخدامات الأموال",
      oneLiner: "يقارن من أين أتت الأموال وأين ذهبت.",
      what: "يرصد جميع مصادر الأموال (دخل، قروض، بيع أصول) ويقارنها بجميع الاستخدامات (مصروفات، شراء أصول، سداد ديون). الفارق يكشف الدخل المخفي.",
      variables: ["المصادر: الراتب، العوائد، القروض، بيع أصول", "الاستخدامات: الإنفاق، شراء أصول، سداد ديون، مدخرات", "الفارق = الاستخدامات − المصادر المعلومة"],
      interpretation: "إذا تجاوزت الاستخدامات المصادر بمبلغ جوهري → دخل غير مفسَّر.",
      chapter: "الفصل الثامن — التحقيق المتقدم",
      type: "أداة تحقيق",
    },

    // ── أنماط البيانات ──
    {
      id: "benford",
      category: "أنماط البيانات",
      name: "Benford's Law",
      nameAr: "قانون بنفورد",
      oneLiner: "يكشف الأرقام المفبركة بتحليل تكرار الأرقام الأولى.",
      what: "في البيانات الطبيعية (فواتير، قيود، مدفوعات)، الرقم 1 يظهر كرقم أول بنسبة ≈30%، ثم تنخفض النسبة تدريجياً. البيانات المفبركة تنحرف عن هذا التوزيع.",
      variables: ["الرقم 1 يظهر أولاً بنسبة 30.1%", "الرقم 2 بنسبة 17.6%", "الرقم 3 بنسبة 12.5%", "... تنخفض تدريجياً حتى الرقم 9 بنسبة 4.6%"],
      interpretation: "انحراف كبير عن التوزيع المتوقع في بيانات المدفوعات أو المصروفات → دليل على أرقام مصطنعة.",
      chapter: "الفصل الثامن — التحقيق المتقدم",
      type: "أداة إحصائية",
    },
    {
      id: "trend",
      category: "أنماط البيانات",
      name: "Trend Analysis",
      nameAr: "تحليل الاتجاهات",
      oneLiner: "يرصد الانحرافات عن النمط التاريخي.",
      what: "يتتبع حركة البنود المالية أو التشغيلية على مدى عدة فترات لتحديد الأنماط الطبيعية ورصد أي انحراف مفاجئ.",
      variables: ["قراءة البند عبر 3–5 سنوات كحد أدنى", "حساب معدل النمو السنوي المركب", "رصد الانحرافات عن خط الاتجاه", "مقارنة الاتجاه بالصناعة والاقتصاد"],
      interpretation: "كسر مفاجئ في الاتجاه دون سبب تشغيلي واضح → يستدعي التحقق.",
      chapter: "الفصل الثاني — احتيال القوائم المالية + الفصل الثامن — التحقيق المتقدم",
      type: "أداة مقارنة",
    },
  ];

  const colorOf = (cat: string) =>
    categories.find((c) => c.key === cat)?.color ?? "#8FA9C4";

  const filtered = activeCategory === "الكل"
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  return (
    <>
      <PageHero
        eyebrow="مختبر المؤشرات"
        title="اكتشف ما وراء"
        gradient="الأرقام"
        desc="لأن كل مؤشر يروي قصة، صممنا هذه المساحة لتمنحك نظرة فاحصة للبيانات. اختر الفصل الآن وابدأ رحلة التحليل الذكي."
      />

      {/* Category filter */}
      <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
        <div className="flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = cat.key === "الكل"
              ? tools.length
              : tools.filter((t) => t.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="group flex items-center gap-2.5 border px-4 py-2.5 text-sm transition"
                style={{
                  borderColor: isActive ? `${cat.color}88` : "rgba(255,255,255,0.08)",
                  backgroundColor: isActive ? `${cat.color}1A` : "rgba(255,255,255,0.015)",
                  color: isActive ? "#fff" : "#7d8794",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: isActive ? cat.color : "#3a4250" }}
                />
                {cat.key}
                <span className="text-xs tabular-nums" style={{ color: isActive ? cat.color : "#4a5360" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tools grid */}
      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((tool) => {
            const c = colorOf(tool.category);
            return (
              <article
                key={tool.id}
                className="group relative flex flex-col overflow-hidden border border-white/10 bg-[#0B0F16] transition hover:border-white/20"
              >
                {/* top accent */}
                <div className="h-[3px]" style={{ backgroundColor: c }} />

                {/* hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
                  style={{ background: `radial-gradient(100% 60% at 50% 0%, ${c}0F, transparent 50%)` }}
                />

                <div className="relative flex flex-1 flex-col p-7">
                  {/* header */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs tracking-wide" style={{ color: c }}>{tool.category}</span>
                      <span className="mx-2 text-zinc-700">·</span>
                      <span className="text-xs text-zinc-600">{tool.type}</span>
                    </div>
                    <span className="shrink-0 border px-2 py-0.5 text-[11px] font-mono text-zinc-400" style={{ borderColor: `${c}44` }}>
                      {tool.name}
                    </span>
                  </div>

                  {/* title */}
                  <h3 className="text-2xl font-semibold leading-tight text-white">{tool.nameAr}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{tool.oneLiner}</p>

                  {/* what */}
                  <div className="mt-6">
                    <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">ما هو</div>
                    <p className="text-sm leading-8 text-zinc-300">{tool.what}</p>
                  </div>

                  {/* variables / formula */}
                  <div className="mt-5">
                    <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">المكونات</div>
                    <div className="grid gap-px border border-white/[0.06] bg-white/[0.06]">
                      {tool.variables.map((v, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-[#070B11] px-4 py-2.5 text-sm leading-7 text-zinc-300">
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: c }} />
                          <span className="font-mono text-xs leading-7">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* interpretation */}
                  <div className="mt-5">
                    <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">كيف تقرأ النتيجة</div>
                    <div className="border-r-2 pr-4 text-sm leading-8 text-zinc-400" style={{ borderColor: c }}>
                      {tool.interpretation}
                    </div>
                  </div>

                  {/* chapter link */}
                  <div className="mt-auto flex items-center gap-2 pt-6 text-xs text-zinc-600">
                    <span className="h-px w-4" style={{ backgroundColor: c }} />
                    {tool.chapter}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}


// ─── Library Page ─────────────────────────────────────────────────────────────

function LibraryFullPage({ onOpenAMLLaw, onOpenAntifraudLaw, onOpenAntiCorruptionLaw, onOpenAntiBriberyLaw, onOpenEvidenceLaw, onOpenEvidenceElectronicLaw, onOpenExpertRegulations }: {
  onOpenAMLLaw?: () => void;
  onOpenAntifraudLaw?: () => void;
  onOpenAntiCorruptionLaw?: () => void;
  onOpenAntiBriberyLaw?: () => void;
  onOpenEvidenceLaw?: () => void;
  onOpenEvidenceElectronicLaw?: () => void;
  onOpenExpertRegulations?: () => void;
}) {
  const libraryCategories = [
    {
      title: "الأنظمة والتشريعات",
      laws: [
        { label: "نظام مكافحة غسل الأموال", action: onOpenAMLLaw },
        { label: "نظام مكافحة الاحتيال المالي وخيانة الأمانة", action: onOpenAntifraudLaw },
        { label: "نظام مكافحة الرشوة", action: onOpenAntiBriberyLaw },
        { label: "نظام هيئة الرقابة ومكافحة الفساد", action: onOpenAntiCorruptionLaw },
        { label: "نظام الإثبات — منظور فاحص الاحتيال", action: onOpenEvidenceLaw },
        { label: "ضوابط إجراءات الإثبات إلكترونياً", action: onOpenEvidenceElectronicLaw },
      ],
      items: [],
    },
    {
      title: "المعايير والمراجع المهنية",
      laws: [
        { label: "القواعد المهنية للخبير القضائي", action: onOpenExpertRegulations },
      ],
      items: [
        "ISA 240 — مسؤوليات المراجع تجاه الغش",
        "ACFE — أطر فحص الاحتيال",
        "أدلة مهنية وأطر رقابية",
        "مراجع متخصصة في الفحص والتحقيق",
      ],
    },
    {
      title: "القضايا والأحكام",
      laws: [],
      items: [
        "قضايا واقعية قابلة للدراسة",
        "أحكام مختارة لأغراض التحليل",
        "ربط الوقائع بالمؤشرات والسياق النظامي",
      ],
    },
    {
      title: "المجلات والدوريات",
      laws: [],
      items: [
        "مجلات مهنية متخصصة في الاحتيال المالي",
        "تقارير في التحقيق والامتثال",
        "مواد حول الممارسات الحديثة",
      ],
    },
  ];

  const featuredLibrary = [
    {
      type: "نظام",
      title: "نظام مكافحة غسل الأموال",
      level: "مرجع أساسي",
      desc: "مواد النظام واللائحة التنفيذية والإرشادات المرتبطة بالاشتباه والإبلاغ والامتثال.",
      action: onOpenAMLLaw,
      draft: false,
    },
    {
      type: "نظام",
      title: "نظام مكافحة الاحتيال المالي وخيانة الأمانة",
      level: "مرجع أساسي",
      desc: "أحكام جريمة الاحتيال وخيانة الأمانة والعقوبات المقررة والظروف المشددة.",
      action: onOpenAntifraudLaw,
      draft: false,
    },
    {
      type: "نظام",
      title: "نظام الإثبات — منظور فاحص الاحتيال",
      level: "مرجع إجرائي",
      desc: "الأدلة المقبولة: المحررات، الدليل الرقمي، الخبرة الفنية، القرائن — مُختارة لما يعنى به فاحص الاحتيال.",
      action: onOpenEvidenceLaw,
      draft: false,
    },
    {
      type: "ضوابط",
      title: "ضوابط إجراءات الإثبات إلكترونياً",
      level: "إجرائي",
      desc: "كيف تُتَّخذ إجراءات الإثبات عبر الأنظمة المعتمدة: الخبرة، الشهادة، الاستجواب، الأدلة الرقمية — كلها تجري إلكترونياً بذات الحجية.",
      action: onOpenEvidenceElectronicLaw,
      draft: false,
    },
    {
      type: "معيار",
      title: "ISA 240 — مسؤوليات المراجع تجاه الغش",
      level: "مهني",
      desc: "مراجع مهنية تساعد على فهم مسؤوليات المراجع تجاه الغش والمخاطر والتجاوزات المحتملة.",
      action: undefined,
      draft: true,
    },
    {
      type: "قواعد مهنية",
      title: "الخبير القضائي — الترخيص والأخلاقيات والتأديب",
      level: "مرجع مهني",
      desc: "القواعد الخاصة بتنظيم شؤون الخبرة أمام المحاكم: شروط الترخيص، الالتزامات، المحظورات، إجراءات التأديب، والعقوبات.",
      action: onOpenExpertRegulations,
      draft: false,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="مكتبة ثغرة"
        title="مكتبة"
        gradient="مراجع مهنية في مكان واحد"
        desc="مساحة معرفية تجمع الأنظمة والمعايير والقضايا والأحكام والمجلات المهنية المرتبطة بالاحتيال المالي وغسل الأموال والامتثال والتحليل المالي الجنائي."
      />

      <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
        <Surface className="p-9 md:p-12">
          <Tag>فلسفة المكتبة</Tag>
          <h2 className="mt-7 max-w-3xl text-4xl font-semibold leading-tight text-white">
            مراجع مهنية في مكان واحد.
          </h2>
          <p className="mt-7 max-w-3xl text-lg leading-9 text-zinc-400">
            تنظم المكتبة المصادر المهمة في مجالات ثغرة. يجد القارئ فيها الأنظمة والمعايير والأحكام والقضايا والمراجع المهنية دون تشتيت.
          </p>
        </Surface>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
        <div className="mb-8">
          <div className="text-sm text-[#8FA9C4]">رفوف المكتبة</div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            تصنيفات واضحة تسهّل الوصول إلى المصادر المهنية.
          </h2>
        </div>
        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
          {libraryCategories.map((category) => (
            <div key={category.title} className="bg-[#0B0F16] p-7">
              <div className="mb-6 text-lg font-semibold text-white">{category.title}</div>
              <div className="grid gap-px border border-white/10 bg-white/10">
                {category.laws && category.laws.map((law) => (
                  <button
                    key={law.label}
                    onClick={law.action}
                    className="bg-[#070B11] px-4 py-4 text-sm leading-7 text-[#8FA9C4] hover:bg-[#0E141D] hover:text-white transition text-right flex items-center justify-between group"
                  >
                    <span>{law.label}</span>
                    <span className="text-[#415A77] opacity-0 group-hover:opacity-100 transition text-xs">← قراءة</span>
                  </button>
                ))}
                {category.items.map((item) => (
                  <div key={item} className="bg-[#070B11] px-4 py-4 text-sm leading-7 text-zinc-400">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="mb-8">
          <div className="text-sm text-[#8FA9C4]">مواد مميزة</div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            مواد مرجعية أساسية داخل ثغرة.
          </h2>
        </div>
        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          {featuredLibrary.map((item) => (
            <div
              key={item.title}
              className={`group bg-[#0B0F16] p-8 transition hover:bg-[#0E141D] ${item.draft ? "border border-dashed border-white/10" : ""}`}
            >
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
                <Tag>{item.type}</Tag>
                <Tag tone={item.draft ? "muted" : "muted"}>{item.level}</Tag>
                {item.draft && (
                  <span className="text-[10px] text-amber-500/70 border border-amber-500/20 px-2 py-0.5">
                    مسودة
                  </span>
                )}
              </div>
              <h3 className={`text-2xl font-semibold leading-tight transition group-hover:text-[#E0E1DD] ${item.draft ? "text-zinc-400" : "text-white"}`}>
                {item.title}
              </h3>
              <p className="mt-5 leading-8 text-zinc-500">{item.desc}</p>
              {item.action && (
                <button
                  onClick={item.action}
                  className="mt-6 border border-[#415A77]/40 bg-[#415A77]/10 hover:bg-[#415A77]/20 px-5 py-2.5 text-sm text-white transition"
                >
                  قراءة النظام كاملاً ←
                </button>
              )}
              {item.draft && (
                <div className="mt-6 text-xs text-zinc-600">
                  سيُضاف قيد الإعداد ←
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Professional Exams Page ──────────────────────────────────────────────────


function TrainingModelRunner({ model, onClose, onGoStudy, onGoHome }: { model: TrainingQuizModel; onClose: () => void; onGoStudy?: () => void; onGoHome?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [reportView, setReportView] = useState<"summary" | "wrong" | "all">("summary");

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setChecked({});
    setFinished(false);
    setReportView("summary");
  }, [model.id]);

  const currentQuestion = model.questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const isChecked = Boolean(checked[currentIndex]);
  const answeredCount = Object.keys(answers).length;
  const score = model.questions.reduce((total, question, index) => {
    return answers[index] === question.correct ? total + 1 : total;
  }, 0);
  const pct = Math.round((score / model.questions.length) * 100);
  const passed = pct >= 75;
  const wrongQuestions = model.questions.filter((question, index) => answers[index] !== question.correct);
  const unansweredCount = model.questions.length - answeredCount;
  const progress = Math.round(((currentIndex + 1) / model.questions.length) * 100);

  const axisStats = model.questions.reduce<Record<string, { name: string; total: number; correct: number; wrong: number; numbers: number[] }>>((acc, question, index) => {
    const name = question.reviewFocus || question.axis || "مراجعة عامة";
    if (!acc[name]) acc[name] = { name, total: 0, correct: 0, wrong: 0, numbers: [] };
    acc[name].total += 1;
    if (answers[index] === question.correct) {
      acc[name].correct += 1;
    } else {
      acc[name].wrong += 1;
      acc[name].numbers.push(question.originalNumber);
    }
    return acc;
  }, {});
  const axisRows = Object.values(axisStats).sort((a, b) => b.wrong - a.wrong || b.total - a.total);
  const weakAxes = axisRows.filter((axis) => axis.wrong > 0);
  const completedAxes = axisRows.filter((axis) => axis.wrong === 0);

  const chooseAnswer = (key: string) => {
    if (isChecked || finished) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: key }));
    setChecked((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const resetModel = () => {
    setCurrentIndex(0);
    setAnswers({});
    setChecked({});
    setFinished(false);
    setReportView("summary");
  };

  const optionText = (question: TrainingQuizModel["questions"][number], key?: string) => {
    if (!key) return "لم تتم الإجابة";
    return question.options.find((option) => option.key === key)?.text ?? key;
  };

  const optionClassName = (key: string) => {
    if (!isChecked) {
      return selectedAnswer === key
        ? "border-[#8FA9C4]/70 bg-[#415A77]/20 text-white"
        : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-[#415A77]/40 hover:bg-[#415A77]/10 hover:text-white";
    }

    if (key === currentQuestion.correct) {
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
    }

    if (selectedAnswer === key && key !== currentQuestion.correct) {
      return "border-red-500/40 bg-red-500/10 text-red-100";
    }

    return "border-white/10 bg-white/[0.02] text-zinc-500";
  };

  const reportQuestions = reportView === "wrong" ? wrongQuestions : model.questions;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#020407]/90 px-4 py-5 backdrop-blur-md">
      <div className="mx-auto max-w-6xl">
        <Surface className="overflow-hidden rounded-[1.5rem] border-[#415A77]/30">
          <div className="sticky top-0 z-10 border-b border-white/10 bg-[#070B11]/95 p-5 backdrop-blur-xl md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="blue">نموذج تفاعلي</Tag>
                  <Tag tone="muted">{model.topic}</Tag>
                  <Tag tone="muted">{model.questions.length} سؤال</Tag>
                </div>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-white">
                  {finished ? "تقرير نهاية النموذج" : model.title}
                </h3>
                <p className="mt-3 max-w-3xl leading-7 text-zinc-500">
                  {finished
                    ? "لا يكتفي هذا التقرير بعرض الدرجة النهائية، بل يوضح لك أين كان الفهم دقيقًا، وأين ظهرت فجوات تحتاج إلى مراجعة. راجع الملاحظات المرتبطة بالأخطاء، ثم أعد التدريب على الجوانب التي تحتاج إلى تثبيت."
                    : "اختر الإجابة، ثم راجع التصحيح والشرح بعد كل سؤال. عند إنهاء النموذج سيظهر لك تقرير يوضح نقاط القوة والجوانب التي تحتاج إلى مراجعة."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onClose}
                  className="border border-[#8FA9C4]/35 bg-[#8FA9C4]/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20"
                >
                  العودة إلى نماذج التدريب
                </button>
                {onGoStudy && (
                  <button
                    onClick={onGoStudy}
                    className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
                  >
                    العودة إلى الدراسة
                  </button>
                )}
                <button
                  onClick={resetModel}
                  className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
                >
                  إعادة النموذج
                </button>
              </div>
            </div>

            {!finished && (
              <>
                <div className="mt-7 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
                  <div className="bg-[#0B0F16] p-4">
                    <div className="text-2xl font-semibold text-white">{currentIndex + 1} / {model.questions.length}</div>
                    <div className="mt-1 text-xs text-zinc-500">السؤال الحالي</div>
                  </div>
                  <div className="bg-[#0B0F16] p-4">
                    <div className="text-2xl font-semibold text-white">{answeredCount}</div>
                    <div className="mt-1 text-xs text-zinc-500">اخترت إجابتها</div>
                  </div>
                  <div className="bg-[#0B0F16] p-4">
                    <div className="text-2xl font-semibold text-white">{score} / {answeredCount || 0}</div>
                    <div className="mt-1 text-xs text-zinc-500">النتيجة الحالية</div>
                  </div>
                </div>

                <div className="mt-6 h-1.5 overflow-hidden bg-white/10">
                  <div className="h-full bg-[#415A77] transition-all" style={{ width: `${progress}%` }} />
                </div>
              </>
            )}
          </div>

          {!finished ? (
            <div className="p-6 md:p-8">
              <div className="mb-5 text-sm text-[#8FA9C4]">السؤال {currentIndex + 1}</div>
              <h4 className="text-2xl font-semibold leading-10 text-white whitespace-pre-line">{currentQuestion.question}</h4>

              <div className="mt-8 grid gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => chooseAnswer(option.key)}
                    className={`flex items-start gap-4 border p-4 text-right text-sm leading-7 transition ${optionClassName(option.key)}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-black/20 text-xs font-semibold">
                      {option.key}
                    </span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>

              {isChecked && (
                <div className={`mt-7 border p-5 ${selectedAnswer === currentQuestion.correct ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {selectedAnswer === currentQuestion.correct ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                    {selectedAnswer === currentQuestion.correct ? "إجابتك صحيحة" : `الإجابة الصحيحة: ${currentQuestion.correct}`}
                  </div>
                  {currentQuestion.explanation?.trim() && (
                    <p className="mt-3 leading-8 text-zinc-300">{currentQuestion.explanation}</p>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                    disabled={currentIndex === 0}
                    className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => setCurrentIndex((index) => Math.min(model.questions.length - 1, index + 1))}
                    disabled={currentIndex === model.questions.length - 1}
                    className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    التالي
                  </button>
                </div>
                <button
                  onClick={() => setFinished(true)}
                  className="border border-[#415A77]/50 bg-[#415A77]/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#415A77]/30"
                >
                  إنهاء النموذج وإظهار التقرير
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-4">
                <div className="bg-[#070B11] p-5">
                  <div className="text-3xl font-semibold text-white">{score} / {model.questions.length}</div>
                  <div className="mt-1 text-sm text-zinc-500">الدرجة النهائية</div>
                </div>
                <div className="bg-[#070B11] p-5">
                  <div className={`text-3xl font-semibold ${passed ? "text-emerald-300" : "text-red-300"}`}>{pct}%</div>
                  <div className="mt-1 text-sm text-zinc-500">النسبة</div>
                </div>
                <div className="bg-[#070B11] p-5">
                  <div className="text-3xl font-semibold text-white">{wrongQuestions.length}</div>
                  <div className="mt-1 text-sm text-zinc-500">أخطاء أو غير مجاب</div>
                </div>
                <div className="bg-[#070B11] p-5">
                  <div className="text-3xl font-semibold text-white">{completedAxes.length}</div>
                  <div className="mt-1 text-sm text-zinc-500">محاور أُنجزت بلا خطأ</div>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="mt-5 border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100/90">
                  يوجد {unansweredCount} سؤال لم تتم الإجابة عنه، وتم احتسابه ضمن الأخطاء في التقرير.
                </div>
              )}

              <div className={`mt-7 border p-6 ${passed ? "border-emerald-500/25 bg-emerald-500/10" : "border-red-500/25 bg-red-500/10"}`}>
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  {passed ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-red-400" />}
                  {passed ? "اجتزت النموذج" : "النموذج يحتاج مراجعة قبل الاعتماد"}
                </div>
                <p className="mt-3 leading-8 text-zinc-300">
                  {passed
                    ? "التقرير أدناه يوضح المحاور التي أتممتها، وأي نقاط جزئية بقيت تحتاج مراجعة إن وجدت."
                    : "ركز أولًا على المحاور التي ظهرت فيها أخطاء متكررة، ثم ارجع للأسئلة الخاطئة وراجع شرح كل سؤال."}
                </p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="border border-white/10 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#8FA9C4]">
                    <Target className="h-4 w-4" />
                    {weakAxes.length ? "محاور تحتاج مراجعة" : "المحاور المنجزة"}
                  </div>
                  <div className="grid gap-3">
                    {(weakAxes.length ? weakAxes : completedAxes).map((axis) => (
                      <div key={axis.name} className="border border-white/10 bg-[#070B11] p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="font-semibold leading-7 text-white">{axis.name}</div>
                          <div className="text-xs text-zinc-500">{axis.correct} / {axis.total}</div>
                        </div>
                        {axis.wrong > 0 && (
                          <div className="mt-2 text-xs leading-6 text-red-200/80">
                            راجع الأسئلة: {axis.numbers.join("، ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/10 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#8FA9C4]">
                    <Layers className="h-4 w-4" />
                    محاور مكتملة بلا خطأ
                  </div>
                  <div className="grid gap-3">
                    {completedAxes.length ? completedAxes.map((axis) => (
                      <div key={axis.name} className="border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="font-semibold leading-7 text-emerald-100">{axis.name}</div>
                        <div className="mt-1 text-xs text-emerald-200/70">أُنجزت {axis.total} أسئلة في هذا المحور بدون خطأ.</div>
                      </div>
                    )) : (
                      <div className="border border-white/10 bg-[#070B11] p-4 text-sm leading-7 text-zinc-500">
                        لم يكتمل أي محور بلا خطأ في هذا النموذج. ابدأ بالمحاور الأعلى تكرارًا في الأخطاء.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  ["summary", "ملخص التقرير"],
                  ["wrong", `الأسئلة الخاطئة (${wrongQuestions.length})`],
                  ["all", "كل الأسئلة"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setReportView(key as "summary" | "wrong" | "all")}
                    className={`border px-4 py-2 text-sm transition ${reportView === key ? "border-[#8FA9C4]/40 bg-[#415A77]/20 text-white" : "border-white/10 text-zinc-500 hover:text-white"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {reportView !== "summary" && (
                <div className="mt-6 grid gap-4">
                  {reportQuestions.length ? reportQuestions.map((question, index) => {
                    const originalIndex = model.questions.findIndex((item) => item.number === question.number);
                    const selected = answers[originalIndex];
                    const isCorrect = selected === question.correct;
                    return (
                      <div key={question.number} className={`border p-5 ${isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                          <Tag tone={isCorrect ? "blue" : "muted"}>السؤال {question.originalNumber}</Tag>
                        </div>
                        <div className="text-lg font-semibold leading-9 text-white whitespace-pre-line">{question.question}</div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="border border-white/10 bg-black/10 p-3 text-sm leading-7 text-zinc-300">
                            <span className="text-zinc-500">إجابتك: </span>{selected ? `${selected} - ${optionText(question, selected)}` : "لم تتم الإجابة"}
                          </div>
                          <div className="border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm leading-7 text-emerald-100">
                            <span className="text-emerald-200/70">الصحيح: </span>{question.correct} - {optionText(question, question.correct)}
                          </div>
                        </div>
                        <p className="mt-4 leading-8 text-zinc-300">{question.explanation}</p>
                      </div>
                    );
                  }) : (
                    <div className="border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm leading-7 text-emerald-100">
                      لا توجد أسئلة خاطئة في هذا النموذج.
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                <button
                  onClick={resetModel}
                  className="border border-[#8FA9C4]/35 bg-[#8FA9C4]/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20"
                >
                  إعادة النموذج
                </button>
                <button
                  onClick={onClose}
                  className="border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition hover:text-white"
                >
                  العودة إلى نماذج التدريب
                </button>
                {onGoStudy && (
                  <button
                    onClick={onGoStudy}
                    className="border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition hover:text-white"
                  >
                    العودة إلى الدراسة
                  </button>
                )}
                {onGoHome && (
                  <button
                    onClick={onGoHome}
                    className="border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition hover:text-white"
                  >
                    العودة إلى صفحة الاختبارات المهنية
                  </button>
                )}
              </div>
            </div>
          )}
        </Surface>
      </div>
    </div>
  );
}


function ProfessionalExamsFullPage({ onStartSimulator, onOpenAMLLaw, onOpenAntifraudLaw, onOpenAntiCorruptionLaw, onOpenAntiBriberyLaw, onOpenEvidenceLaw, onOpenEvidenceElectronicLaw, onOpenExpertRegulations, onNavigate }: {
  onStartSimulator?: (modelId?: string) => void;
  onOpenAMLLaw?: () => void;
  onOpenAntifraudLaw?: () => void;
  onOpenAntiCorruptionLaw?: () => void;
  onOpenAntiBriberyLaw?: () => void;
  onOpenEvidenceLaw?: () => void;
  onOpenEvidenceElectronicLaw?: () => void;
  onOpenExpertRegulations?: () => void;
  onNavigate?: (href: string) => void;
}) {
  const [activeMode, setActiveMode] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeStudyTab, setActiveStudyTab] = useState<"content"|"laws"|"video">("content");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeTrainingModelId, setActiveTrainingModelId] = useState<string | null>(null);

  const activeTrainingModel = activeTrainingModelId ? trainingQuizData[activeTrainingModelId] : null;
  const availableTrainingModels = trainingTopics.flatMap((topic) =>
    topic.models.filter((model) => model.quizId && trainingQuizData[model.quizId])
  );
  const trainingModelsCount = availableTrainingModels.length;
  const trainingQuestionsCount = availableTrainingModels.reduce((total, model) => {
    return total + (model.quizId ? trainingQuizData[model.quizId]?.questions.length ?? 0 : 0);
  }, 0);

  const examModes = [
    {
      title: "الدراسة",
      icon: BookOpen,
      desc: "محتوى مراجعة مرتب حسب موضوعات الاختبار الرسمية. يساعد على فهم المفاهيم وربطها بالأمثلة المهنية.",
      meta: "موضوعات الدراسة",
    },
    {
      title: "التدريب",
      icon: Target,
      desc: "نماذج تدريبية مستقلة لكل موضوع. تساعد على تثبيت الفهم وقياس الاستيعاب.",
      meta: "نماذج تفاعلية",
    },
    {
      title: "اختبار محاكي",
      icon: Clock,
      desc: "تجارب محاكية كاملة بشروط الاختبار الرسمي. تقيس مستوى الجاهزية وتحدد مناطق الضعف.",
      meta: `${mockExamModels.length} محاكيات`,
    },
  ];

  const studyTopics = [
    {
      title: "الفصل الأول والثاني: مقدمة في الاحتيال + الاحتيال في القوائم المالية",
      subtopics: [
        "تعريف الاحتيال وأنواعه",
        "مثلث الاحتيال: الدافع، الفرصة، التبرير",
        "الفرق بين الاحتيال والخطأ",
        "أنواع الاحتيال الوظيفي",
        "احتيال الإدارة عبر القوائم المالية",
        "تسجيل إيرادات وهمية",
        "التلاعب بالتقييمات وتأجيل المصروفات",
        "اكتشاف الاحتيال بالتحليل المالي",
      ],
      summary: "يغطي أساسيات الاحتيال وعناصر مثلث الاحتيال، ثم ينتقل لاحتيال الإدارة عبر التلاعب بالقوائم المالية وكيفية اكتشافه.",
      videoUrl: "https://www.youtube.com/watch?v=2jUddghP15s",
      videoEmbed: "https://www.youtube.com/embed/2jUddghP15s",
      objectives: [
        "تعريف الاحتيال وتمييزه عن الخطأ غير المقصود",
        "فهم مثلث الاحتيال وعناصره الثلاثة",
        "التعرف على أنواع الاحتيال الوظيفي الرئيسية",
        "تحديد أساليب التلاعب بالقوائم المالية",
        "استخدام التحليل المالي لاكتشاف مؤشرات الاحتيال",
      ],
      transcript: [
        {
          heading: "تعريف الاحتيال",
          body: "الاحتيال هو فعل متعمد يقوم به شخص أو مجموعة من خلال خداع أو تضليل لتحقيق منفعة غير مشروعة على حساب الغير. يختلف الاحتيال عن الخطأ في عنصر النية؛ فالخطأ يفتقر للقصد الجنائي، بينما الاحتيال يستلزمه.",
        },
        {
          heading: "مثلث الاحتيال (Fraud Triangle)",
          body: "طوّر دونالد كريسي نموذج مثلث الاحتيال ليشرح لماذا يقدم الشخص الأمين على الاحتيال. يتكون من ثلاثة عناصر: (1) الدافع أو الضغط — الحاجة المالية أو الضغط الاجتماعي. (2) الفرصة — وجود ضعف في الرقابة يُمكّن من تنفيذ الجريمة. (3) التبرير — إقناع الشخص نفسه بأن فعله مقبول أو مؤقت.",
        },
        {
          heading: "أنواع الاحتيال الوظيفي",
          body: "تصنف ACFE الاحتيال الوظيفي في ثلاث فئات رئيسية: اختلاس الأصول (الأكثر شيوعاً بأكثر من 80%)، والفساد، واحتيال القوائم المالية (الأعلى تكلفةً). كل فئة تضم أساليب متعددة وتحتاج أدوات كشف مختلفة.",
        },
        {
          heading: "احتيال القوائم المالية",
          body: "يمارسه عادةً مسؤولو الإدارة العليا. أبرز أساليبه: تسجيل إيرادات وهمية أو مبكرة، تضخيم قيمة الأصول أو إخفاء الالتزامات، تأجيل المصروفات لزيادة الربح الظاهر. الهدف غالباً تحسين صورة المنشأة لدى المستثمرين أو تحقيق مكافآت الأداء.",
        },
        {
          heading: "الكشف بالتحليل المالي",
          body: "يُستخدم تحليل النسب المالية والتحليل الأفقي والرأسي لاكتشاف الانحرافات غير المعتادة. من أبرز المؤشرات: ارتفاع الإيرادات دون نمو موازٍ في التدفقات النقدية، تذبذب هوامش الربح بشكل مفاجئ، أو تغيرات مفاجئة في السياسات المحاسبية.",
        },
      ],
      laws: [
        { label: "نظام مكافحة الاحتيال المالي وخيانة الأمانة", action: "onOpenAntifraudLaw", relevance: "يُجرّم أفعال الاحتيال والتضليل واستخدام الكذب والخداع للاستيلاء على أموال الغير — وهو الإطار الجنائي المباشر لمفاهيم هذا الفصل." },
        { label: "نظام الإثبات — منظور فاحص الاحتيال", action: "onOpenEvidenceLaw", relevance: "يُحدد كيف تُثبت وقائع الاحتيال أمام الجهات القضائية، وما هي الأدلة المقبولة." },
      ],
    },
    {
      title: "الفصل الثالث والرابع: اختلاس الأصول + الفساد",
      subtopics: [
        "اختلاس النقدية (سرقة مباشرة، مدفوعات وهمية)",
        "التلاعب في الرواتب",
        "اختلاس المخزون والأصول غير النقدية",
        "تضارب المصالح",
        "الرشوة واستغلال النفوذ",
        "تمرير المناقصات لتحقيق مصالح شخصية",
      ],
      summary: "يغطي الاحتيال الوظيفي بشقيه: كيف يختلس الموظفون أصول المنشأة، وكيف يُمارَس الفساد الإداري عبر الرشوة واستغلال السلطة.",
      videoUrl: "https://www.youtube.com/watch?v=e9x_iZH8wpY",
      videoEmbed: "https://www.youtube.com/embed/e9x_iZH8wpY",
      objectives: [
        "التمييز بين أساليب اختلاس النقدية المختلفة",
        "فهم أساليب اختلاس الأصول غير النقدية",
        "التعرف على أشكال الفساد الإداري وعلاماته",
        "فهم مفهوم تضارب المصالح وكيف يُفضي للفساد",
        "معرفة الضوابط الرقابية لمنع الاختلاس والفساد",
      ],
      transcript: [
        {
          heading: "اختلاس النقدية",
          body: "أكثر أشكال الاختلاس شيوعاً. يشمل: السرقة المباشرة من الصندوق أو الحسابات المصرفية، وإنشاء مدفوعات وهمية لموردين أو موظفين غير حقيقيين، والتلاعب في سجلات الرواتب بإضافة موظفين وهميين أو تضخيم المكافآت.",
        },
        {
          heading: "اختلاس الأصول غير النقدية",
          body: "يشمل سرقة المخزون أو الأصول الثابتة، وإساءة استخدام موارد المنشأة (السيارات، الأجهزة، العقارات) لأغراض شخصية. اكتشافه يستلزم جرد دوري وتحليل حركة المخزون.",
        },
        {
          heading: "الفساد الإداري",
          body: "يحدث حين يستغل الموظف موقعه لتحقيق منفعة شخصية على حساب المنشأة. أبرز أشكاله: قبول الرشوة مقابل منح عقود أو تمرير فواتير، وتضارب المصالح حين يكون للموظف مصلحة شخصية في طرف يتعامل معه.",
        },
        {
          heading: "تضارب المصالح",
          body: "ينشأ حين يكون للموظف مصلحة شخصية تؤثر على حياديته في قرارات العمل. قد يكون خفياً (امتلاك أسهم في شركة مورّد) أو صريحاً (تعيين قريب في وظيفة). الكشف يكون عبر سياسات الإفصاح والمراجعة الدورية للعقود.",
        },
        {
          heading: "الاحتيال في المناقصات",
          body: "تشمل أساليبه: تسريب معلومات العروض لأطراف بعينها، تفصيل شروط المناقصة لمورد محدد، أو التواطؤ بين الموردين لرفع الأسعار. يُعدّ من أخطر أشكال الفساد في القطاع الحكومي.",
        },
      ],
      laws: [
        { label: "نظام مكافحة الرشوة", action: "onOpenAntiBriberyLaw", relevance: "يُحدد جرائم الرشوة وعقوباتها، وهو النظام الأساسي لفصل الفساد." },
        { label: "نظام هيئة الرقابة ومكافحة الفساد", action: "onOpenAntiCorruptionLaw", relevance: "يُنظّم اختصاصات هيئة نزاهة في التحقيق بجرائم الفساد والاختلاس." },
        { label: "نظام مكافحة الاحتيال المالي وخيانة الأمانة", action: "onOpenAntifraudLaw", relevance: "يشمل جريمة خيانة الأمانة المرتبطة مباشرةً باختلاس ما يُسلَّم للموظف بحكم وظيفته." },
      ],
    },
    {
      title: "الفصل الخامس: أنواع أخرى من الاحتيال المالي",
      subtopics: [
        "غسيل الأموال والمراحل الثلاث",
        "شركات الظل والهياكل المعقدة",
        "التهرب الضريبي",
        "الاحتيال الإلكتروني والتجاري",
        "الاحتيال في التأمين",
        "الممارسات الحديثة في غسيل الأموال",
      ],
      summary: "يتناول الجرائم المالية المتشعبة خارج نطاق الاختلاس المباشر: غسيل الأموال، والتهرب الضريبي، والاحتيال الإلكتروني والتجاري.",
      videoUrl: "https://www.youtube.com/watch?v=Dekjq7RFznI",
      videoEmbed: "https://www.youtube.com/embed/Dekjq7RFznI",
      objectives: [
        "فهم مراحل غسيل الأموال الثلاث (الإيداع، التمويه، الدمج)",
        "التعرف على مؤشرات الاشتباه في معاملات غسيل الأموال",
        "معرفة التزامات الإبلاغ عن المعاملات المشبوهة",
        "فهم أساليب الاحتيال الإلكتروني والتجاري",
        "التمييز بين التهرب الضريبي والتخطيط الضريبي المشروع",
      ],
      transcript: [
        {
          heading: "غسيل الأموال والمراحل الثلاث",
          body: "غسيل الأموال هو إخفاء المصدر غير المشروع للأموال لإضفاء شرعية عليها. يمر بثلاث مراحل: (1) الإيداع (Placement) — إدخال الأموال في النظام المالي. (2) التمويه (Layering) — إجراء سلسلة من المعاملات لإخفاء الأثر. (3) الدمج (Integration) — إعادة الأموال مغسولة في صورة مشروعة.",
        },
        {
          heading: "شركات الظل والهياكل المعقدة",
          body: "تُستخدم كيانات قانونية متعددة (شركات وهمية، حسابات خارجية، وسطاء) لإخفاء هوية المستفيد الحقيقي. اكتشافها يستلزم تتبع هيكل الملكية ومراجعة المعاملات بين الأطراف ذوي العلاقة.",
        },
        {
          heading: "مؤشرات الاشتباه",
          body: "تشمل: معاملات نقدية كبيرة غير معتادة، تقسيم المبالغ الكبيرة (Structuring)، إيداعات متكررة دون مصدر واضح، معاملات مع دول ذات رقابة ضعيفة، وتغيير مفاجئ في أنماط المعاملات.",
        },
        {
          heading: "الاحتيال الإلكتروني والتجاري",
          body: "يشمل: التصيد الاحتيالي (Phishing)، والاحتيال في الفواتير بإرسال فواتير مزوّرة، واختراق البريد الإلكتروني التجاري (BEC) لتحويل مدفوعات. الوقاية تستلزم ضوابط تحقق مزدوجة في المدفوعات.",
        },
      ],
      laws: [
        { label: "نظام مكافحة غسل الأموال", action: "onOpenAMLLaw", relevance: "النظام الأساسي لهذا الفصل: يُجرّم غسيل الأموال ويُلزم بالإبلاغ عن المعاملات المشبوهة." },
        { label: "نظام مكافحة الاحتيال المالي وخيانة الأمانة", action: "onOpenAntifraudLaw", relevance: "يغطي أشكال الاحتيال التجاري والإلكتروني كجرائم احتيال." },
      ],
    },
    {
      title: "الفصل السادس والسابع: تضارب المصالح ومكافحة الاحتيال المالي",
      subtopics: [
        "أنواع تضارب المصالح: الفعلي والظاهري والمحتمل",
        "مخططات التضارب: التعامل الذاتي والعمولات والمشتريات",
        "التحيزات الأخلاقية وأسباب الانخراط",
        "تقييم مخاطر تضارب المصالح وسياسته",
        "الحوكمة الرشيدة ومبادئ OECD",
        "نظام الرقابة الداخلية ولجنة المراجعة و Tone at the Top",
        "تقييم وإدارة مخاطر الاحتيال",
        "دور المحاسب القانوني في مكافحة الاحتيال",
      ],
      summary: "محاضرة مدمجة تجمع الفصلين السادس (تضارب المصالح) والسابع (مكافحة الاحتيال): من تعريف التضارب وأنواعه وأسبابه السلوكية وتقييم مخاطره، إلى الحوكمة الرشيدة والرقابة الداخلية وأطر مكافحة الاحتيال على مستوى المنشأة.",
      videoUrl: "https://www.youtube.com/watch?v=O9lLhvTe3ek",
      videoEmbed: "https://www.youtube.com/embed/O9lLhvTe3ek",
      objectives: [
        "فهم مفهوم تضارب المصالح وأنواعه الثلاثة (الفعلي، الظاهري، المحتمل)",
        "التعرف على مخططات تضارب المصالح وأساليب الاحتيال المرتبطة به",
        "إدراك التحيزات الأخلاقية وأسباب انخراط الأشخاص في التضارب",
        "إتقان منهجية تقييم مخاطر تضارب المصالح ومحتويات سياسته وإجراءات التحقيق فيه",
        "تحديد مفهوم الحوكمة الرشيدة ومبادئها وفق منظمة التعاون الاقتصادي والتنمية",
        "فهم العلاقة بين الحوكمة والامتثال ودورها في مكافحة الاحتيال",
        "معرفة أهداف نظام الرقابة الداخلية ودور المحاسب القانوني في مكافحة الاحتيال",
        "إتقان خطوات تقييم وإدارة مخاطر الاحتيال على مستوى المنشأة",
      ],
      transcript: [
        {
          heading: "المحور الأول — تضارب المصالح: المفهوم والإطار النظامي",
          body: "تضارب المصالح حالة يكون فيها للموظف أو المسؤول مصلحة خاصة — مالية أو غير مالية — تؤثر أو يُحتمل أن تؤثر في قدرته على أداء واجباته بموضوعية وتجرّد. ينظّمه في السعودية نظام الشركات في المادة (71) التي تمنع عضو مجلس الإدارة أو العضو المنتدب من أن تكون له مصلحة مباشرة أو غير مباشرة في الأعمال والعقود التي تتم لحساب الشركة إلا بترخيص من الجمعية العامة، كما تتناوله لائحة حوكمة الشركات الصادرة عن هيئة السوق المالية بإيجاب الإفصاح والامتناع عن التصويت. الفكرة المحورية: العبرة بوجود المصلحة المؤثِّرة لا بتحقُّق الضرر فعلاً.",
        },
        {
          heading: "الأنواع الثلاثة لتضارب المصالح",
          body: "يصنّف الكتاب التضارب إلى ثلاثة أنواع: (1) التضارب الفعلي — حالة متحقّقة توجد فيها مصلحة خاصة تؤثر فعلاً في الحياد. (2) التضارب الظاهري — حالة يبدو فيها للمراقب الخارجي أنه قد توجد مصلحة خاصة يمكن أن تؤثر في الحياد، حتى لو لم تتحقق بعد. (3) التضارب المحتمل — حالة قد تنشأ فيها مستقبلاً مصلحة خاصة تؤثر في القرار. التمييز بينها مفصلي في الاختبار، وكثير من الأسئلة تختبر الفرق بين (الظاهري) و(المحتمل).",
        },
        {
          heading: "مخططات تضارب المصالح وصوره في المنشأة",
          body: "أبرز الصور العملية: مخطط التعامل الذاتي (Self-Dealing) حيث يستغل الموظف منصبه لإبرام صفقة يحقق منها مكسباً شخصياً؛ مخطط العمولات (Kickbacks) بتلقّي مبالغ مقابل توجيه التعاقد لمورد بعينه؛ ومخطط المشتريات بتفصيل شروط المنافسة أو تسريب العروض لطرف محدد. ويدخل ضمنه أيضاً العلاقات مع الموردين والشركات المنافسة، والعلاقات الشخصية بين الموظفين، وقبول الهدايا والإكراميات والأشياء ذات القيمة.",
        },
        {
          heading: "التحيزات الأخلاقية وأسباب الانخراط",
          body: "يشرح الفصل أسباباً سلوكية تجعل أشخاصاً نزيهين ينزلقون للتضارب: محدودية الأخلاق (Bounded Ethicality) باتخاذ قرارات غير أخلاقية دون إدراك؛ كراهية الخسارة (Loss Aversion) وميل الناس لتجنّب الخسارة على حساب الحياد؛ قِصَر النظر الأخلاقي (Moral Myopia) وصعوبة إدراك وجود مشكلة أخلاقية؛ الانحياز لخدمة الذات (Self-Serving Bias) في تفسير المعلومات؛ وخفوت الأخلاق (Ethical Fading) حين تغيب الأبعاد الأخلاقية تدريجياً عن القرار.",
        },
        {
          heading: "منهجية تقييم مخاطر تضارب المصالح",
          body: "يمرّ تقييم المخاطر بأربع مراحل: (1) تحديد المخاطر، (2) تقييمها وترتيب أولوياتها، (3) تحديد وتقييم الرقابة الحالية، (4) الاستجابة للمخاطر باستراتيجيات: التجنّب، أو النقل، أو التخفيف، أو القبول/الافتراض. وتُقسَّم المخاطر إلى ثلاث فئات: تنظيمية (غياب أو ضعف السياسة)، ووظيفية (طبيعة المهام والعلاقات)، وشخصية (مصالح الموظف الخاصة). ومن العوامل المؤثرة: طبيعة عمل المنشأة، وبيئتها، وفعالية رقابتها الداخلية، وقيمها الأخلاقية.",
        },
        {
          heading: "سياسة تضارب المصالح وإجراءات التحقيق",
          body: "ينبغي أن تتضمن سياسة التضارب: التعاريف والإيضاحات، وتحديد الحالات، والفئات الخاضعة لها، وآلية الإبلاغ والإفصاح. أما التحقيق فيمرّ عادةً بخمس مراحل: خطة التحقيق، ثم منهجية فحص الاحتيال، ثم التحقيق، ثم تقرير التحقيق، ثم المتابعة — مع ضرورة الحصول على الإذن المناسب قبل البدء وتوثيق كل خطوة. ويُحظر على عضو مجلس الإدارة التصويت على قرار له فيه مصلحة، واستغلال أصول المنشأة لمصلحته الشخصية.",
        },
        {
          heading: "النقاط المتوقعة في الاختبار — تضارب المصالح",
          body: "ركّز على: الفرق الدقيق بين الأنواع الثلاثة (الفعلي/الظاهري/المحتمل)؛ ومضمون المادة (71) من نظام الشركات وشرط الترخيص؛ وتعريف كل تحيّز أخلاقي ومثاله؛ ومراحل تقييم المخاطر الأربع واستراتيجيات الاستجابة؛ وفئات المخاطر الثلاث؛ ومكوّنات سياسة التضارب. الأسئلة كثيراً ما تعطيك سيناريو وتطلب تصنيف نوع التضارب أو تحديد الاستجابة الصحيحة له.",
        },
        {
          heading: "مؤشرات الفهم والاشتباه — تضارب المصالح",
          body: "تكون فاهماً إذا استطعت — انطلاقاً من سيناريو — أن تحدّد: هل المصلحة مالية أم غير مالية؟ وهل التضارب فعلي أم ظاهري أم محتمل؟ وما استراتيجية الاستجابة المناسبة؟ أما مؤشرات الاشتباه عملياً فهي: علاقة قرابة أو مصلحة بين الموظف والطرف المتعاقد، وإصرار موظف على مورد بعينه دون مبرر، والامتناع عن الإفصاح، والهدايا أو الإكراميات المتكررة، أو تفصيل شروط منافسة تناسب جهة واحدة.",
        },
        {
          heading: "أمثلة تطبيقية مختصرة — تضارب المصالح",
          body: "مثال (1): موظف مشتريات يمنح عقداً لشركة يملك فيها أقاربه حصة دون إفصاح ← تضارب فعلي ومخطط تعامل ذاتي. مثال (2): مدير في لجنة ترسية تربطه صداقة معروفة بأحد المتنافسين دون أن يؤثر ذلك بعد في القرار ← تضارب ظاهري يستوجب الإفصاح والتنحّي. مثال (3): محاسب قد يُكلَّف مستقبلاً بمراجعة شركة يملك أسهماً فيها ← تضارب محتمل يُدار مسبقاً بالإفصاح.",
        },
        {
          heading: "أخطاء شائعة يجب الانتباه لها — تضارب المصالح",
          body: "الخلط بين التضارب الظاهري والمحتمل (الأول يتعلق بما يبدو للمراقب الآن، والثاني بما قد ينشأ لاحقاً)؛ والظن بأن التضارب لا يقوم إلا بتحقّق ضرر فعلي (والصواب أن العبرة بالتأثير المحتمل)؛ وحصر التضارب في المصالح المالية وإغفال غير المالية؛ والاعتقاد بأن الإفصاح وحده يكفي دون تنحٍّ أو ترخيص عند الاقتضاء.",
        },
        {
          heading: "الربط بنموذج التدريب — تضارب المصالح",
          body: "هذا المحور يقابل مباشرةً موضوع التدريب رقم (06) «تضارب المصالح» بنماذجه الأربعة، بوزن تقديري 6%–14% من الاختبار. راجع نماذجه بعد إتقان: الأنواع، والأسباب السلوكية، وعناصر التقييم، والسياسة والإفصاح، والتحقيق ومؤشرات الاشتباه.",
        },
        {
          heading: "المحور الثاني — مكافحة الاحتيال: الحوكمة الرشيدة",
          body: "ينتقل الفصل السابع من معالجة حالة فردية إلى بناء منظومة وقائية على مستوى المنشأة. جوهر مكافحة الاحتيال هو الحوكمة الرشيدة: نظام يوازن مصالح الإدارة والمساهمين وأصحاب المصلحة، ويضع ضوابط تمنع الاحتيال وتكشفه مبكراً. ودور المحاسب القانوني محوري في تصميم هذه المنظومة ومراجعة فاعليتها.",
        },
        {
          heading: "مبادئ الحوكمة وفق OECD وحقوق المساهمين",
          body: "وفق منظمة التعاون الاقتصادي والتنمية (OECD) ترتكز الحوكمة على عدة مبادئ، منها: ضمان وجود أساس لإطار فعّال لحوكمة الشركات يدعم أسواقاً شفافة وعادلة وتخصيصاً كفؤاً للموارد وامتثالاً لسيادة النظام؛ وحماية حقوق المساهمين عبر تأمين تسجيل الملكية ونقلها، والحصول على المعلومات في وقتها بانتظام، والمشاركة والتصويت في الجمعيات العامة، والإفصاح عن الهياكل الرأسمالية. وتقوم الحوكمة على الشفافية والمساءلة والعدالة والمسؤولية.",
        },
        {
          heading: "المحددات الخارجية والداخلية ومسؤوليات مجلس الإدارة",
          body: "تنقسم محددات الحوكمة إلى: محددات خارجية (البيئة والسوق وقوانين المنافسة والجهات الرقابية)، ومحددات داخلية (القوانين واللوائح والسياسات التي تنظّم اتخاذ القرار داخل المنشأة). ويقع على مجلس الإدارة مسؤولية وضع نظام فعّال لمكافحة الاحتيال وكشفه، وإنشاء قنوات آمنة للإبلاغ، والتأكد من تطبيق الضوابط، إضافةً إلى رعاية حقوق المساهمين وأصحاب المصلحة.",
        },
        {
          heading: "نظام الرقابة الداخلية ودور المحاسب القانوني",
          body: "تتمثل أهداف نظام الرقابة الداخلية في: تشجيع الالتزام بالسياسات والقرارات الإدارية، ورفع الكفاءة التشغيلية، وضمان دقة بيانات المعاملات، وكشف ومنع التلاعب والأخطاء في وقتها، وحماية الأصول والموارد، والالتزام بالأنظمة واللوائح. ويقع على المحاسب القانوني ومحاسب الإدارة التحقق من فاعلية هذه الضوابط، والتأكد من أن المعاملات تُعتمد وفق سلطة محددة قبل تسجيلها.",
        },
        {
          heading: "لجنة المراجعة والقدوة العليا (Tone at the Top)",
          body: "من أدوات الحوكمة في مكافحة الاحتيال: لجنة المراجعة المنبثقة عن مجلس الإدارة، ودور المجلس في إرساء نظام محكم للإبلاغ والكشف، وفي مقدّمة ذلك مبدأ القدوة العليا (Tone at the Top) — أي أن تكون الإدارة العليا نموذجاً للنزاهة، إذ تنبع ثقافة المنشأة الأخلاقية من القمة وتنعكس على سلوك العاملين. ويكمل ذلك دور المراجع الخارجي في تعزيز الثقة.",
        },
        {
          heading: "تقييم وإدارة مخاطر الاحتيال",
          body: "تتطلب الإدارة الفعّالة لمخاطر الاحتيال: وضع سياسة شاملة لإدارة المخاطر، وتحديد الأدوار والمسؤوليات (مدير مخاطر الاحتيال وموظفو الإدارة وبقية العاملين)، والتواصل الدوري بشأنها، وتنظيم فعاليات توعية وبرامج تدريب دورية، وتقييم الرقابة الداخلية بانتظام. ويُعنى التقييم بمؤشرات مخاطر الاحتيال خصوصاً في المشتريات والعقود.",
        },
        {
          heading: "النقاط المتوقعة في الاختبار — مكافحة الاحتيال",
          body: "ركّز على: مبادئ الحوكمة وفق OECD (خصوصاً مبدأ إطار الحوكمة الفعّال ومبدأ حقوق المساهمين)؛ والفرق بين المحددات الخارجية والداخلية؛ وأهداف نظام الرقابة الداخلية؛ ومفهوم Tone at the Top ودور لجنة المراجعة والمراجع الخارجي؛ وخطوات إدارة مخاطر الاحتيال. وتُطرح أسئلة عن دور المحاسب القانوني وعن الفرق بين الضوابط الوقائية والكاشفة.",
        },
        {
          heading: "مؤشرات الفهم والاشتباه — مكافحة الاحتيال",
          body: "تكون فاهماً إذا ميّزت بين الضوابط الوقائية (تمنع الحدوث) والضوابط الكاشفة (تكتشف بعد الحدوث)، وعرفت أين يقع دور كل من المجلس واللجان والمراجع. أما مؤشرات ضعف المنظومة فهي: غياب سياسة احتيال أو ضعفها، وعدم وجود قناة إبلاغ آمنة، وضعف نبرة القيادة الأخلاقية، وتركّز السلطة دون فصلٍ بين المهام، وغياب التدريب والتوعية الدورية.",
        },
        {
          heading: "أمثلة تطبيقية مختصرة — مكافحة الاحتيال",
          body: "مثال (1): منشأة تنشئ خط إبلاغ سرياً وتدرّب موظفيها على رصد المؤشرات ← ضابط وقائي وكاشف يعزّز الحوكمة. مثال (2): مجلس إدارة يفصل بين مهام الإذن والتسجيل والحفظ ← تطبيق لمبدأ الفصل بين الواجبات في الرقابة الداخلية. مثال (3): إدارة عليا تلتزم علناً بسياسة عدم التسامح مع الاحتيال ← تجسيد لمبدأ القدوة العليا (Tone at the Top).",
        },
        {
          heading: "أخطاء شائعة يجب الانتباه لها — مكافحة الاحتيال",
          body: "الخلط بين الضوابط الوقائية والكاشفة؛ واختزال الحوكمة في مجرّد وجود مجلس إدارة دون نظام رقابة فعّال؛ وتجاهل أثر نبرة القيادة (Tone at the Top) على الثقافة؛ والظن بأن مسؤولية مكافحة الاحتيال تقع على المراجع الخارجي وحده دون مجلس الإدارة والإدارة التنفيذية والمحاسب القانوني.",
        },
        {
          heading: "الربط بنموذج التدريب — مكافحة الاحتيال",
          body: "هذا المحور يقابل موضوع التدريب رقم (07) «مكافحة الاحتيال المالي» بنماذجه الأربعة، بوزن تقديري 10%–16% من الاختبار. راجع نماذجه بعد إتقان: مبادئ الحوكمة، والمحددات الخارجية والداخلية، وأنظمة الرقابة الداخلية، ولجان المجلس والمراجع الخارجي، وتقييم وإدارة مخاطر الاحتيال.",
        },
      ],
      laws: [
        { label: "نظام الشركات — المادة 71 (تضارب المصالح)", action: "", relevance: "يمنع عضو مجلس الإدارة أو العضو المنتدب من أن تكون له مصلحة مباشرة أو غير مباشرة في أعمال الشركة وعقودها إلا بترخيص من الجمعية العامة — الإطار النظامي المباشر لتضارب المصالح." },
        { label: "لائحة حوكمة الشركات — هيئة السوق المالية", action: "", relevance: "تُلزم أعضاء المجلس بتجنّب تضارب المصالح والإفصاح عنه والامتناع عن التصويت، وترسي مبادئ الحوكمة الرشيدة التي تُبنى عليها مكافحة الاحتيال." },
        { label: "نظام مكافحة الرشوة", action: "onOpenAntiBriberyLaw", relevance: "يُجرّم العمولات واستغلال النفوذ التي كثيراً ما تتقاطع مع مخططات تضارب المصالح." },
        { label: "نظام هيئة الرقابة ومكافحة الفساد", action: "onOpenAntiCorruptionLaw", relevance: "يضع تضارب المصالح ضمن منظومة مكافحة الفساد وينظّم التحقيق فيه." },
        { label: "نظام مكافحة الاحتيال المالي وخيانة الأمانة", action: "onOpenAntifraudLaw", relevance: "الإطار الجنائي المباشر لأفعال الاحتيال الذي تستهدف الحوكمة والرقابة الداخلية الوقاية منه وكشفه." },
      ],
    },
    {
      title: "الفصل الثامن: التحقيق المتقدم في الاحتيال",
      subtopics: [
        "تقنيات التحقيق المتقدمة",
        "تتبع التدفقات النقدية",
        "جمع وتحليل البيانات المالية",
        "الأثر المالي للمخططات المعقدة",
        "المقابلات والاستجواب",
        "توثيق نتائج التحقيق",
      ],
      summary: "يُركّز على الجانب العملي للمحقق الجنائي: أدوات التحقيق المتقدمة، تتبع التدفقات النقدية، وجمع وتحليل الأدلة للكشف عن المخططات المعقدة.",
      videoUrl: "https://www.youtube.com/watch?v=cbeX8y53kcA",
      videoEmbed: "https://www.youtube.com/embed/cbeX8y53kcA",
      objectives: [
        "إتقان تقنيات تتبع الأثر النقدي في المخططات المعقدة",
        "فهم منهجية جمع البيانات المالية وتحليلها",
        "معرفة أساليب المقابلة والاستجواب المهنية",
        "توثيق نتائج التحقيق بصورة صحيحة قانونياً",
        "ربط الأدلة المالية ببناء ملف الاتهام",
      ],
      transcript: [
        {
          heading: "منهجية التحقيق",
          body: "يبدأ التحقيق المتقدم بتحديد نطاقه وأهدافه، ثم جمع المستندات والبيانات ذات الصلة. تحليل البيانات يشمل مراجعة السجلات المالية والقيود المحاسبية والمعاملات غير الاعتيادية. على المحقق توثيق كل خطوة لضمان قبول الأدلة.",
        },
        {
          heading: "تتبع التدفقات النقدية",
          body: "أداة جوهرية في كشف الاحتيال المالي. تشمل: تتبع حركة الأموال بين الحسابات، مقارنة الإيداعات بالإيرادات المعلنة، وتحليل نمط المدفوعات للكشف عن المستفيدين الحقيقيين. يُستخدم مبدأ 'تتبع الأموال' كأساس للتحليل.",
        },
        {
          heading: "تحليل البيانات المالية",
          body: "يشمل تحليل النسب المالية المقارن، ومراجعة القيود اليدوية في نهاية الفترة، والبحث عن الأنماط غير الاعتيادية في بيانات المعاملات. أدوات تحليل البيانات الكمية (مثل قانون بنفورد) تساعد في تحديد الانحرافات.",
        },
        {
          heading: "المقابلات والاستجواب",
          body: "المقابلة أداة جمع معلومات، والاستجواب أداة اختبار روايات. المحقق يستخدم أسلوب السؤال المفتوح أولاً، ثم يضيّق نطاقه تدريجياً. الاستماع الفعّال ورصد التناقضات في الروايات من أهم مهارات المحقق.",
        },
      ],
      laws: [
        { label: "نظام الإثبات — منظور فاحص الاحتيال", action: "onOpenEvidenceLaw", relevance: "يُحدد الأدلة المقبولة ومتطلبات توثيقها، وهو الإطار القانوني لعمل المحقق." },
        { label: "ضوابط إجراءات الإثبات إلكترونياً", action: "onOpenEvidenceElectronicLaw", relevance: "يُنظّم كيفية جمع الأدلة الرقمية وقبولها في الإجراءات القضائية." },
        { label: "القواعد المهنية للخبير القضائي", action: "onOpenExpertRegulations", relevance: "يُحدد التزامات الخبير القضائي عند تقديم رأيه أمام المحاكم." },
      ],
    },
    {
      title: "الفصل التاسع: نظام الإثبات",
      subtopics: [
        "أنواع الأدلة وحجيتها القانونية",
        "المحررات والوثائق كأدلة",
        "الدليل الرقمي وقبوله",
        "الخبرة الفنية أمام المحاكم",
        "بناء ملف الاتهام",
        "توثيق الأدلة بطريقة نظامية",
      ],
      summary: "يُغطّي الجانب القانوني والإجرائي: كيف يجمع المحقق الأدلة الجنائية ويوثقها بطريقة مقبولة قانونياً لبناء ملف اتهام متين.",
      videoUrl: "https://www.youtube.com/watch?v=uiFZM9_GFIM",
      videoEmbed: "https://www.youtube.com/embed/uiFZM9_GFIM",
      objectives: [
        "فهم أنواع الأدلة وتسلسلها في نظام الإثبات",
        "معرفة متطلبات قبول الدليل الرقمي قانونياً",
        "إتقان توثيق الأدلة بصورة تحمي سلسلة الحيازة",
        "فهم دور الخبير القضائي وكيفية تقديم شهادته",
        "بناء ملف اتهام متكامل يصمد أمام الجهات القضائية",
      ],
      transcript: [
        {
          heading: "نظام الإثبات وأنواع الأدلة",
          body: "نظام الإثبات يُحدد القواعد التي تحكم قبول الأدلة أمام القضاء. الأدلة تشمل: المحررات (الوثائق المكتوبة وحجيتها)، الأدلة المادية، شهادة الشهود، والقرائن. لكل نوع شروط قبول محددة ودرجة من الحجية.",
        },
        {
          heading: "الدليل الرقمي",
          body: "يشمل: سجلات البريد الإلكتروني، بيانات المعاملات الإلكترونية، السجلات المحاسبية الرقمية. لقبوله قانونياً يجب: الحفاظ على سلامة الدليل (Hash verification)، توثيق سلسلة الحيازة (Chain of Custody)، وضمان عدم التعديل.",
        },
        {
          heading: "سلسلة الحيازة (Chain of Custody)",
          body: "مفهوم جوهري في الإثبات الجنائي. يعني توثيق كل من تعامل مع الدليل من لحظة جمعه حتى تقديمه في المحكمة. أي انقطاع في هذه السلسلة قد يُفقد الدليل قيمته القانونية.",
        },
        {
          heading: "الخبير القضائي ودوره",
          body: "الخبير القضائي يُقدّم رأياً مهنياً متخصصاً يُعين القضاء على الفصل في المسائل الفنية. شهادته تستلزم: ترخيصاً معتمداً، محافظة على الحياد والاستقلالية، وتقديم تقرير مكتوب يوضح المنهجية والنتائج.",
        },
        {
          heading: "بناء ملف الاتهام",
          body: "ملف الاتهام المتكامل يشمل: الأدلة المادية والرقمية، تقارير التحليل المالي، وثائق توثيق سلسلة الحيازة، شهادات الخبراء، والسيناريو المتكامل الذي يربط الأدلة بعضها ببعض في قصة واضحة ومتسقة.",
        },
      ],
      laws: [
        { label: "نظام الإثبات — منظور فاحص الاحتيال", action: "onOpenEvidenceLaw", relevance: "النظام المحوري لهذا الفصل: يُغطّي أنواع الأدلة وحجيتها ومتطلبات قبولها." },
        { label: "ضوابط إجراءات الإثبات إلكترونياً", action: "onOpenEvidenceElectronicLaw", relevance: "يُكمل نظام الإثبات في الجانب الرقمي ويُحدد كيف تُتَّخذ إجراءاته إلكترونياً." },
        { label: "القواعد المهنية للخبير القضائي", action: "onOpenExpertRegulations", relevance: "يُنظّم عمل الخبير الذي يُقدّم الأدلة الفنية أمام المحكمة." },
        { label: "نظام مكافحة غسل الأموال", action: "onOpenAMLLaw", relevance: "يتضمن أحكاماً خاصة بجمع الأدلة في قضايا غسيل الأموال." },
      ],
    },
  ];

  const practiceQuestions = [
    {
      id: 1,
      question: "أي من التالي يُعدّ من مكونات مثلث الاحتيال؟",
      options: ["الدافع والفرصة والتبرير", "الضغط والجشع والإهمال", "القدرة والنية والتنفيذ", "الخطأ والإغفال والتدليس"],
      correct: 0,
      explanation: "مثلث الاحتيال لـ Donald Cressey يتكون من ثلاثة عناصر: الدافع (الضغط)، الفرصة، والتبرير.",
    },
    {
      id: 2,
      question: "ما أكثر أنواع الاحتيال شيوعاً وفق تقارير ACFE؟",
      options: ["احتيال القوائم المالية", "اختلاس الأصول", "الفساد والرشوة", "الاحتيال الضريبي"],
      correct: 1,
      explanation: "وفق تقارير ACFE، يُمثل اختلاس الأصول أكثر من 80% من حالات الاحتيال المُبلَّغ عنها.",
    },
    {
      id: 3,
      question: "ما الفرق الرئيسي بين الاحتيال والخطأ في المعايير المهنية؟",
      options: [
        "حجم المبلغ المالي المتأثر",
        "النية والقصد الجنائي",
        "نوع القوائم المالية المتأثرة",
        "مستوى الشخص المسؤول",
      ],
      correct: 1,
      explanation: "الاحتيال يتطلب نية وقصداً مسبقاً للتضليل، بينما الخطأ يكون غير مقصود.",
    },
  ];

  const examTopics = [
    { title: "احتيال القوائم المالية", questions: 32, weight: "32%" },
    { title: "الفساد والرشوة", questions: 24, weight: "24%" },
    { title: "اختلاس الأصول", questions: 24, weight: "24%" },
    { title: "إجراءات التحقيق", questions: 12, weight: "12%" },
    { title: "القانون والإجراءات القانونية", questions: 8, weight: "8%" },
  ];

  const handleQuizAnswer = (qId, optionIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < practiceQuestions.length) return;
    setQuizSubmitted(true);
  };

  const correctCount = quizSubmitted
    ? practiceQuestions.filter((q) => quizAnswers[q.id] === q.correct).length
    : 0;

  return (
    <>
      <PageHero
        eyebrow="الاختبارات المهنية"
        title="اختبار فاحص"
        gradient="الاحتيال المالي"
        desc="مسار مخصص لدارسي اختبار فاحص الاحتيال المالي FFE. يبدأ بالمراجعة ثم التدريب على كل موضوع ثم تجربة محاكية لقياس الجاهزية."
      />

      {/* Mode Selection */}
      {!activeMode && (
        <>
          <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
            <div className="grid gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
              {examModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.title}
                    onClick={() => setActiveMode(mode.title)}
                    className="group bg-[#0B0F16] p-9 text-right transition hover:bg-[#0E141D]"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#415A77]/30 bg-[#415A77]/10">
                      <Icon className="h-5 w-5 text-[#415A77]" />
                    </div>
                    <div className="mb-2 text-xs text-[#8FA9C4]">{mode.meta}</div>
                    <h3 className="text-2xl font-semibold text-white transition group-hover:text-[#E0E1DD]">
                      {mode.title}
                    </h3>
                    <p className="mt-4 leading-8 text-zinc-500">{mode.desc}</p>
                    <div className="mt-7 text-sm text-[#415A77] transition group-hover:text-[#8FA9C4]">
                      ← ابدأ
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Exam Overview */}
          <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
            <div className="mb-8">
              <div className="text-sm text-[#8FA9C4]">هيكل الاختبار</div>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                توزيع موضوعات اختبار فاحص الاحتيال المالي.
              </h2>
            </div>
            <div className="grid gap-px border border-white/10 bg-white/10">
              {examTopics.map((topic) => (
                <div key={topic.title} className="flex items-center justify-between bg-[#0B0F16] px-7 py-5 transition hover:bg-[#0E141D]">
                  <h3 className="font-medium text-white">{topic.title}</h3>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-zinc-500">{topic.questions} سؤال</span>
                    <Tag tone="muted">{topic.weight}</Tag>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Knowledge Partners */}
          <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
            <div className="mb-8 border-b border-white/10 pb-5">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">الشراكات المعرفية</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8FA9C4]">
                جهات نتعاون معها في إثراء المحتوى المهني ورفع الوعي بالجرائم المالية.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate?.("/partner-crook")}
              className="group relative block w-full overflow-hidden border border-white/10 text-right transition hover:border-[#5B8DEF]/40"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${import.meta.env.BASE_URL}partner-crook-banner.jpeg)` }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(270deg, rgba(5,7,11,0.96) 0%, rgba(5,7,11,0.88) 34%, rgba(7,16,33,0.46) 64%, rgba(7,16,33,0.18) 100%)" }}
              />
              <div className="relative flex min-h-[300px] flex-col justify-end p-8 md:p-12 md:max-w-[58%]">
                <h3 className="text-3xl font-semibold leading-tight text-white md:text-4xl">من المحتال؟</h3>
                <p className="mt-4 text-sm leading-loose text-zinc-300 md:text-base">
                  مشروع متخصص في المحاسبة القضائية يهدف إلى رفع الوعي بمخاطر الاحتيال والجرائم المالية وتمكين الآخرين من حماية أنفسهم.
                </p>
                <span className="mt-7 inline-flex items-center gap-2 self-start border border-[#5B8DEF]/45 bg-[#5B8DEF]/10 px-6 py-3 text-sm font-medium text-white transition-all group-hover:gap-4 group-hover:bg-[#5B8DEF]/25">
                  اعرف أكثر <span aria-hidden="true">←</span>
                </span>
              </div>
            </button>
          </section>
        </>
      )}

      {/* Study Mode */}
      {activeMode === "الدراسة" && (
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">موضوعات الدراسة</h2>
            <button
              onClick={() => { setActiveMode(null); setActiveTopicIndex(0); setActiveStudyTab("content"); }}
              className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
            >
              ← العودة
            </button>
          </div>

          <div className="grid gap-px border border-white/10 bg-white/10 lg:grid-cols-[0.38fr_1fr]">
            {/* Sidebar */}
            <div className="bg-[#0B0F16]">
              {studyTopics.map((topic, index) => (
                <button
                  key={topic.title}
                  onClick={() => { setActiveTopicIndex(index); setActiveStudyTab("content"); }}
                  className={`w-full border-b border-white/5 px-5 py-5 text-right transition ${
                    activeTopicIndex === index
                      ? "bg-[#415A77]/15 text-white"
                      : "text-zinc-500 hover:bg-white/[0.02] hover:text-white"
                  }`}
                >
                  <div className="text-xs text-[#8FA9C4]">الفصل {index + 1}</div>
                  <div className="mt-1 text-sm font-medium leading-6">{topic.title}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {topic.laws.map((l) => (
                      <span key={l.label} className="text-[10px] text-[#415A77] border border-[#415A77]/30 px-1.5 py-0.5 leading-4">
                        {l.label.length > 18 ? l.label.slice(0, 18) + "…" : l.label}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Content Panel */}
            <div className="bg-[#0B0F16]">
              {/* Header */}
              <div className="border-b border-white/10 px-8 py-7 md:px-10">
                <div className="text-xs text-[#8FA9C4]">الفصل {activeTopicIndex + 1} من {studyTopics.length}</div>
                <h3 className="mt-2 text-2xl font-semibold leading-snug text-white">
                  {studyTopics[activeTopicIndex].title}
                </h3>
                <p className="mt-3 leading-8 text-zinc-400 text-sm">
                  {studyTopics[activeTopicIndex].summary}
                </p>
                {/* Tabs */}
                <div className="mt-6 flex gap-1 border border-white/10 bg-[#070B11] p-1">
                  {([
                    { id: "content", label: "المحتوى والأهداف" },
                    { id: "laws", label: `الأنظمة المرتبطة (${studyTopics[activeTopicIndex].laws.length})` },
                    { id: "video", label: "الفيديو التعليمي" },
                  ] as { id: "content"|"laws"|"video"; label: string }[]).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveStudyTab(tab.id)}
                      className={`flex-1 px-3 py-2 text-sm transition ${
                        activeStudyTab === tab.id
                          ? "bg-[#415A77]/25 text-white"
                          : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab: Content + Objectives */}
              {activeStudyTab === "content" && (
                <div className="px-8 py-7 md:px-10">
                  {/* Objectives */}
                  <div className="mb-8">
                    <div className="mb-4 text-sm font-medium text-[#8FA9C4]">الأهداف التعليمية</div>
                    <div className="grid gap-px border border-white/10 bg-white/10">
                      {studyTopics[activeTopicIndex].objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-3 bg-[#070B11] px-5 py-4 text-sm leading-7 text-zinc-300">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#5B8DEF]" />
                          {obj}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transcript */}
                  <div className="mb-4 text-sm font-medium text-[#8FA9C4]">المحتوى التعليمي</div>
                  <div className="grid gap-px border border-white/10 bg-white/10">
                    {studyTopics[activeTopicIndex].transcript.map((section, i) => (
                      <div key={i} className="bg-[#070B11] px-6 py-6">
                        <div className="mb-3 text-sm font-semibold text-white">{section.heading}</div>
                        <p className="leading-9 text-zinc-400 text-sm">{section.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Subtopics */}
                  <div className="mt-8">
                    <div className="mb-4 text-sm font-medium text-[#8FA9C4]">المحاور الرئيسية</div>
                    <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                      {studyTopics[activeTopicIndex].subtopics.map((sub) => (
                        <div key={sub} className="flex items-center gap-3 bg-[#070B11] px-5 py-3.5 text-sm text-zinc-300">
                          <span className="h-1.5 w-1.5 flex-shrink-0 bg-[#415A77]" />
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Related Laws */}
              {activeStudyTab === "laws" && (
                <div className="px-8 py-7 md:px-10">
                  <div className="mb-6 text-sm text-zinc-500 leading-8">
                    الأنظمة التالية مرتبطة بمحتوى هذا الفصل. اضغط على أي نظام لقراءة نصه الكامل ومعرفة كيف يرتبط بالموضوع.
                  </div>
                  <div className="grid gap-px border border-white/10 bg-white/10">
                    {studyTopics[activeTopicIndex].laws.map((law) => {
                      const actionMap: Record<string, (() => void) | undefined> = {
                        onOpenAMLLaw,
                        onOpenAntifraudLaw,
                        onOpenAntiCorruptionLaw,
                        onOpenAntiBriberyLaw,
                        onOpenEvidenceLaw,
                        onOpenEvidenceElectronicLaw,
                        onOpenExpertRegulations,
                      };
                      const handler = actionMap[law.action];
                      return (
                        <div key={law.label} className="bg-[#070B11] px-6 py-6">
                          <div className="mb-2 flex items-center justify-between gap-4 flex-wrap">
                            <div className="text-sm font-semibold text-white">{law.label}</div>
                            {handler && (
                              <button
                                onClick={handler}
                                className="border border-[#415A77]/40 bg-[#415A77]/10 hover:bg-[#415A77]/20 px-4 py-1.5 text-xs text-white transition"
                              >
                                قراءة النظام ←
                              </button>
                            )}
                          </div>
                          <p className="mt-3 text-sm leading-8 text-zinc-500">{law.relevance}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab: Video */}
              {activeStudyTab === "video" && (
                <div className="px-8 py-7 md:px-10">
                  <div className="mb-4 text-sm text-zinc-500 leading-8">
                    المقطع التعليمي المرتبط بهذا الفصل. يُعرض هنا مباشرةً لمراجعته دون مغادرة الموقع.
                  </div>
                  <div className="relative w-full overflow-hidden border border-white/10" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      src={studyTopics[activeTopicIndex].videoEmbed}
                      title={studyTopics[activeTopicIndex].title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="text-sm text-zinc-500">
                      يمكن فتح المقطع في يوتيوب للمشاهدة بجودة أعلى أو تنزيله.
                    </div>
                    <a
                      href={studyTopics[activeTopicIndex].videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#415A77]/40 bg-[#415A77]/10 hover:bg-[#415A77]/20 px-4 py-2 text-xs text-white transition"
                    >
                      فتح في يوتيوب ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Practice Mode */}
      {activeMode === "التدريب" && (
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-[#8FA9C4]">التدريب حسب الموضوع</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">نماذج التدريب حسب موضوعات الاختبار</h2>
            </div>
            <button
              onClick={() => { setActiveMode(null); setQuizAnswers({}); setQuizSubmitted(false); setActiveTrainingModelId(null); }}
              className="w-fit border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
            >
              ← العودة
            </button>
          </div>

          <Surface className="mb-8 p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Tag>{trainingTopics.length} بطاقات</Tag>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-white">
                  كل بطاقة مرتبطة بموضوع رسمي من موضوعات الاختبار.
                </h3>
                <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
النماذج تظهر كتدريب تفاعلي داخل الموقع: تختار الإجابة، فتظهر النتيجة والشرح تلقائياً، مع إمكانية الرجوع إلى صفحة التدريب في أي وقت.
                </p>
              </div>
              <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:min-w-[360px]">
                <div className="bg-[#070B11] p-5">
                  <div className="text-3xl font-semibold text-white">{trainingModelsCount}</div>
                  <div className="mt-1 text-sm text-zinc-500">نموذج تفاعلي</div>
                </div>
                <div className="bg-[#070B11] p-5">
                  <div className="text-3xl font-semibold text-white">{trainingQuestionsCount}</div>
                  <div className="mt-1 text-sm text-zinc-500">سؤال تدريبي داخل الموقع</div>
                </div>
              </div>
            </div>
          </Surface>

          {activeTrainingModel && (
            <TrainingModelRunner
              model={activeTrainingModel}
              onClose={() => setActiveTrainingModelId(null)}
              onGoStudy={() => {
                setActiveTrainingModelId(null);
                setActiveMode("الدراسة");
              }}
              onGoHome={() => {
                setActiveTrainingModelId(null);
                setActiveMode(null);
              }}
            />
          )}

          <div className="grid gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
            {trainingTopics.map((topic) => (
              <div key={topic.no} className="group bg-[#0B0F16] p-7 transition hover:bg-[#0E141D]">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center border text-sm font-semibold text-white"
                      style={{ borderColor: `${topic.accent}66`, backgroundColor: `${topic.accent}1A` }}
                    >
                      {topic.no}
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">وزن الاختبار</div>
                      <div className="mt-1 text-sm text-[#8FA9C4]">{topic.weight}</div>
                    </div>
                  </div>
                  <Tag tone={topic.models.length ? "blue" : "muted"}>
                    {topic.models.length ? `${topic.models.length} نماذج` : "قيد الإعداد"}
                  </Tag>
                </div>

                <h3 className="text-2xl font-semibold leading-tight text-white transition group-hover:text-[#E0E1DD]">
                  {topic.title}
                </h3>
                <p className="mt-4 min-h-[64px] leading-8 text-zinc-500">{topic.summary}</p>

                <div className="mt-6 grid gap-px border border-white/10 bg-white/10">
                  {topic.points.map((point) => (
                    <div key={point} className="flex items-center gap-3 bg-[#070B11] px-4 py-3 text-sm text-zinc-400">
                      <span className="h-1.5 w-1.5 flex-shrink-0" style={{ backgroundColor: topic.accent }} />
                      {point}
                    </div>
                  ))}
                </div>

                <div className="mt-7 border-t border-white/10 pt-6">
                  <div className="mb-4 flex items-center gap-2 text-sm text-[#8FA9C4]">
                    <Layers className="h-4 w-4" />
                    نماذج التدريب المتاحة
                  </div>

                  {topic.models.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {topic.models.map((model) => (
                        model.unavailable ? (
                          <div
                            key={model.label}
                            className="border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-600"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {model.label}
                            </div>
                            <div className="mt-2 text-xs leading-6 text-zinc-700">{model.note}</div>
                          </div>
                        ) : (
                          <button
                            key={model.label}
                            onClick={() => model.quizId && setActiveTrainingModelId(model.quizId)}
                            className="flex items-center justify-between gap-3 border border-white/10 bg-white/[0.02] px-4 py-3 text-right text-sm text-zinc-300 transition hover:border-[#415A77]/40 hover:bg-[#415A77]/10 hover:text-white"
                          >
                            <span className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[#8FA9C4]" />
                              <span>
                                <span className="block">{model.label}</span>
                                <span className="mt-1 block text-xs text-zinc-600">
                                  {model.quizId ? `${trainingQuizData[model.quizId]?.questions.length ?? 0} سؤال` : "غير متاح"}
                                </span>
                              </span>
                            </span>
                            <span className="text-xs text-[#8FA9C4]">ابدأ التدريب</span>
                          </button>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-white/10 bg-white/[0.02] px-5 py-4 text-sm leading-7 text-zinc-600">
                      سيضاف التدريب التفاعلي لهذا الموضوع لاحقاً.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exam Simulation Mode */}
      {activeMode === "اختبار محاكي" && (
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">الاختبار المحاكي</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-500">اختر أحد المحاكيات الأربعة. كل نموذج يحتوي على 100 سؤال ويعمل بوضع الاختبار أو التدريب.</p>
            </div>
            <button
              onClick={() => setActiveMode(null)}
              className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
            >
              ← العودة
            </button>
          </div>

          <div className="mb-8 grid gap-px border border-white/10 bg-white/10 md:grid-cols-4">
            {[
              [String(mockExamModels.length), "محاكيات"],
              ["100", "سؤال لكل نموذج"],
              ["150", "دقيقة للاختبار"],
              ["230", "دقيقة للتدريب"],
            ].map(([val, label]) => (
              <div key={label} className="bg-[#0B0F16] p-6 text-center">
                <div className="text-3xl font-black text-[#8FA9C4]">{val}</div>
                <div className="mt-2 text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mockExamModels.map((model, index) => (
              <button
                key={model.id}
                onClick={() => onStartSimulator?.(model.id)}
                className="group border border-white/10 bg-[#0B0F16]/80 p-6 text-right transition hover:border-[#8FA9C4]/35 hover:bg-[#101722]"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <Tag tone="blue">محاكي</Tag>
                  <span className="text-xs text-zinc-600">{model.questions.length} سؤال</span>
                </div>
                <h3 className="text-xl font-semibold text-white transition group-hover:text-[#E0E1DD]">{model.shortTitle}</h3>
                <p className="mt-4 min-h-[72px] text-sm leading-7 text-zinc-500">{model.description}</p>
                <div className="mt-5 grid gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#8FA9C4]" />
                    اختبار 150 دقيقة · تدريب 230 دقيقة
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-[#8FA9C4]" />
                    {model.balance}
                  </div>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-sm font-semibold text-[#8FA9C4]">
                  فتح المحاكي ←
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// ─── Router / App ─────────────────────────────────────────────────────────────

function PartnerCrookPage({ onNavigate }: { onNavigate?: (href: string) => void }) {
  const socials = [
    { label: "X", href: "https://twitter.com/thecrookcase/", icon: XSocialIcon },
    { label: "Telegram", href: "https://t.me/FFE_SOCPA", icon: TelegramSocialIcon },
    { label: "YouTube", href: "https://www.youtube.com/@Thecrookcas", icon: YouTubeSocialIcon },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/basmahalkurdi", icon: LinkedInSocialIcon },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <button
        type="button"
        onClick={() => onNavigate?.("/professional-exams")}
        className="mb-9 inline-flex items-center gap-2 text-sm text-[#8FA9C4] transition hover:text-white"
      >
        <span aria-hidden="true">→</span> العودة إلى ثغرة
      </button>

      {/* Partner banner */}
      <div className="relative mb-11 overflow-hidden border border-white/10 bg-[#071426]">
        <img
          src={`${import.meta.env.BASE_URL}partner-crook-banner.jpeg`}
          alt="من المحتال؟"
          className="h-auto w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(5,7,11,0.10), rgba(5,7,11,0.24))" }}
        />
      </div>

      {/* Text */}
      <div className="max-w-3xl">
        <h1 className="mb-7 text-4xl font-semibold text-white md:text-5xl">من المحتال؟</h1>
        <p className="mb-6 text-base leading-loose text-zinc-300 md:text-lg">
          مشروع متخصص في المحاسبة القضائية يهدف إلى رفع الوعي بمخاطر الاحتيال والجرائم المالية وتمكين الآخرين من حماية أنفسهم عبر تبسيط مفاهيم التحقيق المحاسبي وتقديم محتوى معرفي موثوق وسهل الفهم.
        </p>
        <p className="mb-9 text-base leading-loose text-zinc-300 md:text-lg">
          تلتقي ثغرة مع من المحتال؟ في بناء معرفة مهنية تقرّب مفاهيم الاحتيال وتوضح ما يختبئ خلف الأرقام.
        </p>

        {/* Social icons */}
        <div className="flex gap-3.5">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#8FA9C4] transition hover:border-[#8FA9C4]/50 hover:bg-white/[0.04] hover:text-white"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AccessDeniedPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-800/30 bg-red-900/10 text-red-300">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-semibold text-white">الوصول غير مصرح</h1>
      <p className="mt-5 max-w-xl text-sm leading-8 text-zinc-500">
        لوحة المطور مخصصة للحسابات الرسمية المصرح لها فقط. لا يكفي معرفة الرابط للوصول إلى هذه الصفحة.
      </p>
      <button
        type="button"
        onClick={() => onNavigate("/")}
        className="mt-8 border border-[#8FA9C4]/30 bg-[#8FA9C4]/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20"
      >
        العودة للرئيسية
      </button>
    </section>
  );
}

function AuthLoadingScreen() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      <div className="mb-5 h-10 w-10 animate-spin rounded-full border border-[#8FA9C4]/20 border-t-[#8FA9C4]" />
      <h2 className="text-xl font-semibold text-white">جاري التحقق من حالة الدخول</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-500">يتم التحقق من الجلسة قبل فتح المحتوى التدريبي.</p>
    </section>
  );
}

const protectedPages = new Set(["/library", "/professional-exams"]);
const developerPages = new Set(["/developer", "/dashboard"]);

const pageMap = {
  "/": HomePage,
  "/insights": InsightsFullPage,
  "/red-flags": RedFlagsFullPage,
  "/library": LibraryFullPage,
  "/professional-exams": ProfessionalExamsFullPage,
  "/partner-crook": PartnerCrookPage,
};

function initialRoute() {
  const path = window.location.pathname || "/";
  return path === "/index.html" ? "/" : path;
}

function nextAfterLogin(fallback = "/professional-exams") {
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return fallback;
}

function isLocalDeveloperPreviewEnabled() {
  const host = window.location.hostname;
  return (
    import.meta.env.DEV === true &&
    import.meta.env.VITE_ENABLE_DEV_PREVIEW === "true" &&
    (host === "localhost" || host === "127.0.0.1")
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(initialRoute);
  const [showSimulator, setShowSimulator] = useState(false);
  const [activeSimulatorModelId, setActiveSimulatorModelId] = useState("current");
  const [showAMLLaw, setShowAMLLaw] = useState(false);
  const [showAntifraudLaw, setShowAntifraudLaw] = useState(false);
  const [showAntiCorruptionLaw, setShowAntiCorruptionLaw] = useState(false);
  const [showAntiBriberyLaw, setShowAntiBriberyLaw] = useState(false);
  const [showEvidenceLaw, setShowEvidenceLaw] = useState(false);
  const [showEvidenceElectronicLaw, setShowEvidenceElectronicLaw] = useState(false);
  const [showExpertRegulations, setShowExpertRegulations] = useState(false);
  const [showEnronCase, setShowEnronCase] = useState(false);
  const { user, loading, isDeveloper } = useAuth();

  const navigateTo = React.useCallback((href: string) => {
    const next = href || "/";
    setCurrentPage(next);
    if (window.location.pathname !== next) {
      window.history.pushState({}, "", next);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => setCurrentPage(initialRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, showSimulator, showAMLLaw, showAntifraudLaw, showAntiCorruptionLaw, showAntiBriberyLaw, showEvidenceLaw, showEvidenceElectronicLaw, showExpertRegulations, showEnronCase]);

  const isProtectedPage = protectedPages.has(currentPage);
  const isDeveloperPage = developerPages.has(currentPage);
  const localDeveloperPreview = isDeveloperPage && isLocalDeveloperPreviewEnabled();

  if (localDeveloperPreview) {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <DeveloperDashboard previewMode />
      </PageFrame>
    );
  }

  if (isProtectedPage && loading) {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <AuthLoadingScreen />
      </PageFrame>
    );
  }

  if (isProtectedPage && !user) {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <AuthPanel onAuthenticated={() => navigateTo(currentPage)} />
      </PageFrame>
    );
  }

  if (currentPage === "/login") {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <AuthPanel onAuthenticated={() => navigateTo(nextAfterLogin())} />
      </PageFrame>
    );
  }

  if (isDeveloperPage && loading) {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <AuthLoadingScreen />
      </PageFrame>
    );
  }

  if (isDeveloperPage && !user) {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <AuthPanel onAuthenticated={() => navigateTo(currentPage)} />
      </PageFrame>
    );
  }

  if (isDeveloperPage && !isDeveloper) {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <AccessDeniedPage onNavigate={navigateTo} />
      </PageFrame>
    );
  }

  if (isDeveloperPage && isDeveloper) {
    return (
      <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
        <DeveloperDashboard />
      </PageFrame>
    );
  }

  if (showSimulator) {
    const selectedSimulatorModel = mockExamModels.find((model) => model.id === activeSimulatorModelId) ?? mockExamModels[0];
    return <Simulator model={selectedSimulatorModel} onBack={() => setShowSimulator(false)} />;
  }
  if (showAMLLaw) return <AMLLaw onBack={() => setShowAMLLaw(false)} />;
  if (showAntifraudLaw) return <AntifraudLaw onBack={() => setShowAntifraudLaw(false)} />;
  if (showAntiCorruptionLaw) return <AntiCorruptionLaw onBack={() => setShowAntiCorruptionLaw(false)} />;
  if (showAntiBriberyLaw) return <AntiBriberyLaw onBack={() => setShowAntiBriberyLaw(false)} />;
  if (showEvidenceLaw) return <EvidenceLaw onBack={() => setShowEvidenceLaw(false)} />;
  if (showEvidenceElectronicLaw) return <EvidenceElectronicLaw onBack={() => setShowEvidenceElectronicLaw(false)} />;
  if (showExpertRegulations) return <ExpertRegulations onBack={() => setShowExpertRegulations(false)} />;
  if (showEnronCase) return <EnronCase onBack={() => setShowEnronCase(false)} />;

  const PageComponent = pageMap[currentPage] ?? HomePage;

  return (
    <PageFrame currentPage={currentPage} onNavigate={navigateTo}>
      <PageComponent
        onStartSimulator={(modelId?: string) => { setActiveSimulatorModelId(modelId ?? "current"); setShowSimulator(true); }}
        onOpenAMLLaw={() => setShowAMLLaw(true)}
        onOpenAntifraudLaw={() => setShowAntifraudLaw(true)}
        onOpenAntiCorruptionLaw={() => setShowAntiCorruptionLaw(true)}
        onOpenAntiBriberyLaw={() => setShowAntiBriberyLaw(true)}
        onOpenEvidenceLaw={() => setShowEvidenceLaw(true)}
        onOpenEvidenceElectronicLaw={() => setShowEvidenceElectronicLaw(true)}
        onOpenExpertRegulations={() => setShowExpertRegulations(true)}
        onOpenEnronCase={() => setShowEnronCase(true)}
        onNavigate={navigateTo}
      />
    </PageFrame>
  );
}
