import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  BookOpen,
  Clock,
  Database,
  Edit3,
  Eye,
  EyeOff,
  FileClock,
  FilePlus2,
  FolderKanban,
  Globe2,
  GripVertical,
  Layers,
  Link as LinkIcon,
  ListChecks,
  MessageSquareText,
  Pencil,
  Plus,
  Save,
  Search,
  Settings2,
  Tags,
  Trash2,
  X,
} from "lucide-react";

const CASE_CATEGORIES = [
  "قضايا",
  "غسل أموال",
  "تلاعب محاسبي",
  "مشتريات",
  "مؤشرات",
  "تحليل مالي جنائي",
  "احتيال المشتريات",
  "مؤشرات اشتباه",
];

type CaseStatus = "draft" | "published";
type ContentFieldType = "text" | "textarea" | "url" | "rich_text";

interface TimelineItem {
  id: string;
  dateLabel: string;
  eventText: string;
}

interface DocumentItem {
  id: string;
  title: string;
  url: string;
  note: string;
}

interface ReferenceItem {
  id: string;
  name: string;
  url: string;
  note: string;
}

interface TrainingQuestionItem {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface CaseDraft {
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
  timeline: TimelineItem[];
  indicators: { id: string; text: string }[];
  documents: DocumentItem[];
  references: ReferenceItem[];
  questions: TrainingQuestionItem[];
  professionalNotes: { id: string; text: string }[];
}

interface ContentField {
  id: string;
  key: string;
  page: string;
  label: string;
  value: string;
  type: ContentFieldType;
  updatedAt: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const emptyDraft = (): CaseDraft => ({
  title: "",
  slug: "",
  category: CASE_CATEGORIES[0],
  summary: "",
  content: "",
  status: "draft",
  created_at: today(),
  updated_at: today(),
  timeline: [],
  indicators: [],
  documents: [],
  references: [],
  questions: [],
  professionalNotes: [],
});

const existingCaseSeeds: CaseDraft[] = [
  {
    ...emptyDraft(),
    title: "إنرون وأزمة الثقة بالقوائم",
    slug: "enron",
    category: "قضايا",
    summary: "شركة كبرت قوائمها سريعًا وتراكمت خلف النمو كيانات والتزامات وصفقات جعلت الخطر أبعد عن عين القارئ.",
    content: "",
    status: "published",
    timeline: [
      { id: makeId(), dateLabel: "1990s", eventText: "توسع النشاط وبدأ الاعتماد على نماذج محاسبية أكثر تعقيدًا." },
      { id: makeId(), dateLabel: "2001", eventText: "بدأ الانكشاف وأصبحت الثقة في القوائم محل سؤال." },
    ],
    indicators: [
      { id: makeId(), text: "ربح ظاهر لا يوازيه نقد متحقق." },
      { id: makeId(), text: "التزامات تنتقل إلى كيانات بعيدة عن الصفحة الرئيسية للقوائم." },
    ],
  },
  {
    ...emptyDraft(),
    title: "وايركارد… نقد معلن وسؤال مفتوح",
    slug: "wirecard",
    category: "قضايا",
    summary: "رصيد نقدي ضخم بدا مركز القوة في القوائم، ثم صار موضع السؤال: أين يوجد ومن تحقق منه؟",
    content: "",
    status: "draft",
  },
  {
    ...emptyDraft(),
    title: "ليمان براذرز… Repo 105 قبل الإقفال",
    slug: "lehman-repo-105",
    category: "تلاعب محاسبي",
    summary: "عمليات إعادة شراء صُنفت كمبيعات أخرجت أصولًا من الميزانية مؤقتًا وخفّضت الرافعة المالية لحظة التقرير.",
    content: "",
    status: "draft",
  },
];

const initialContentFields: ContentField[] = [
  { id: "home.hero.title", key: "home.hero.title", page: "الرئيسية", label: "عنوان المنصة", value: "ثغرة", type: "text", updatedAt: "—" },
  { id: "home.hero.subtitle", key: "home.hero.subtitle", page: "الرئيسية", label: "الشعار النصي", value: "نقرأ ما خلف الأرقام", type: "text", updatedAt: "—" },
  { id: "home.hero.description", key: "home.hero.description", page: "الرئيسية", label: "العبارة التعريفية", value: "ثغرة مساحة تختزل المسافة بين رصد المؤشر وتفكيك الاشتباه والنضج المهني لما يحدث خلف السجلات.", type: "textarea", updatedAt: "—" },
  { id: "home.cards.training", key: "home.cards.training", page: "الرئيسية", label: "وصف بطاقة التدريب", value: "تدريب مهني يساعد المتدرب على قراءة الوقائع والمؤشرات داخل بيئة منظمة.", type: "textarea", updatedAt: "—" },
  { id: "social.telegram", key: "social.telegram", page: "روابط التواصل", label: "رابط تليجرام", value: "https://t.me/thughrah", type: "url", updatedAt: "—" },
  { id: "social.x", key: "social.x", page: "روابط التواصل", label: "رابط منصة X", value: "https://x.com/thaghrah_sa", type: "url", updatedAt: "—" },
  { id: "social.email", key: "social.email", page: "روابط التواصل", label: "البريد الإلكتروني", value: "mailto:contact@thughrah.sa", type: "url", updatedAt: "—" },
  { id: "footer.description", key: "footer.description", page: "الفوتر", label: "وصف ثغرة في الفوتر", value: "ثغرة مساحة مهنية لقراءة الإشارات التي تختبئ داخل الأرقام", type: "textarea", updatedAt: "—" },
  { id: "footer.copyright", key: "footer.copyright", page: "الفوتر", label: "حقوق النشر", value: "جميع الحقوق محفوظة لمنصة ثغرة", type: "text", updatedAt: "—" },
  { id: "about.intro", key: "about.intro", page: "من نحن", label: "مقدمة من نحن", value: "منصة معرفية للتدريب والتحليل في الاحتيال المالي والمحاسبة القضائية.", type: "textarea", updatedAt: "—" },
  { id: "partners.intro", key: "partners.intro", page: "الشركاء", label: "مقدمة الشركاء", value: "شراكات معرفية تحترم استقلال كل مشروع وحقوقه وهويته.", type: "textarea", updatedAt: "—" },
  { id: "library.intro", key: "library.intro", page: "المكتبة", label: "مقدمة المكتبة", value: "مراجع ومواد منظمة تساعد المتدرب على الوصول للمعلومة المهنية بسرعة.", type: "textarea", updatedAt: "—" },
  { id: "exams.intro", key: "exams.intro", page: "الاختبارات", label: "مقدمة الاختبارات", value: "اختبارات مهنية تساعد على قياس الفهم والتطبيق في بيئة تدريبية واضحة.", type: "textarea", updatedAt: "—" },
];

const actions = [
  { key: "case-form", title: "إضافة / تعديل قضية", desc: "بيانات القضية والأقسام الاختيارية.", icon: FilePlus2 },
  { key: "cases", title: "إدارة القضايا", desc: "تعديل، نشر، إخفاء، حذف.", icon: FolderKanban },
  { key: "site-content", title: "إدارة محتوى الموقع", desc: "النصوص والروابط الثابتة.", icon: Settings2 },
  { key: "edit-mode", title: "وضع التحرير", desc: "تحرير مباشر للعناصر المحددة.", icon: Pencil },
  { key: "categories", title: "إدارة التصنيفات", desc: "تصنيفات القضايا والتحليلات.", icon: Tags },
  { key: "library", title: "إدارة المكتبة", desc: "المراجع والمواد والروابط.", icon: Archive },
  { key: "exams", title: "إدارة الاختبارات", desc: "النماذج والأسئلة والنتائج.", icon: BookOpen },
  { key: "audit", title: "سجل التعديلات", desc: "تاريخ العمليات الإدارية.", icon: FileClock },
];

export default function DeveloperDashboard({ previewMode = false }: { previewMode?: boolean }) {
  const [active, setActive] = useState("case-form");
  const [draft, setDraft] = useState<CaseDraft>(emptyDraft());
  const [caseList, setCaseList] = useState<CaseDraft[]>(existingCaseSeeds);
  const [contentFields, setContentFields] = useState<ContentField[]>(initialContentFields);
  const [contentQuery, setContentQuery] = useState("");
  const [editingContentKey, setEditingContentKey] = useState<string | null>(null);
  const [previewCase, setPreviewCase] = useState(false);
  const [editModeEnabled, setEditModeEnabled] = useState(false);

  const activeTitle = useMemo(() => actions.find((item) => item.key === active)?.title ?? "لوحة المطور", [active]);

  function updateDraft<K extends keyof CaseDraft>(key: K, value: CaseDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value, updated_at: today() }));
  }

  function resetDraft() {
    setDraft(emptyDraft());
    setPreviewCase(false);
    setActive("case-form");
  }

  function loadCase(item: CaseDraft) {
    setDraft(JSON.parse(JSON.stringify(item)));
    setPreviewCase(false);
    setActive("case-form");
  }

  function stageDraftInList(nextStatus: CaseStatus) {
    const normalized = { ...draft, status: nextStatus, updated_at: today() };
    if (!normalized.title.trim()) return;
    setCaseList((items) => {
      const existing = items.findIndex((item) => item.slug === normalized.slug && normalized.slug);
      if (existing >= 0) {
        const copy = [...items];
        copy[existing] = normalized;
        return copy;
      }
      return [normalized, ...items];
    });
    setDraft(normalized);
  }

  const filteredContent = contentFields.filter((field) => {
    const query = contentQuery.trim().toLowerCase();
    if (!query) return true;
    return [field.key, field.page, field.label, field.value].some((part) => part.toLowerCase().includes(query));
  });

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0F16]/90 p-7 shadow-[0_32px_100px_rgba(0,0,0,0.25)] md:p-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-[#8FA9C4]/20 bg-[#8FA9C4]/10 px-3 py-1 text-xs text-[#8FA9C4]">
              <Database className="h-3.5 w-3.5" />
              إدارة المنصة
            </div>
            <h1 className="text-4xl font-semibold text-white md:text-6xl">لوحة المطور</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-zinc-500 md:text-base">
              مساحة عمل لإدارة القضايا ومحتوى الموقع والاختبارات وسجل التعديلات.
            </p>
          </div>
          <div className="grid gap-2 text-xs text-zinc-500 sm:grid-cols-2 lg:w-[380px]">
            <StatusCard title="الصلاحية" value="مطور / مسؤول" />
            <StatusCard title="الحالة" value="نشط" />
            <StatusCard title="القضايا" value="إدارة كاملة" />
            <StatusCard title="المحتوى" value="حقول منظمة" />
          </div>
        </div>
      </motion.div>


      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-3">
          {actions.map((item) => {
            const Icon = item.icon;
            const selected = active === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(item.key)}
                className={`flex w-full items-start gap-4 border p-4 text-right transition ${
                  selected
                    ? "border-[#8FA9C4]/35 bg-[#8FA9C4]/10 text-white"
                    : "border-white/10 bg-[#0B0F16]/75 text-zinc-400 hover:border-[#8FA9C4]/25 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#070B11] text-[#8FA9C4]">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className="mt-1 block text-xs leading-6 text-zinc-600">{item.desc}</span>
                </span>
              </button>
            );
          })}
        </aside>

        <div className="border border-white/10 bg-[#0B0F16]/80 p-5 md:p-7">
          <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs text-[#8FA9C4]">القسم الحالي</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">{activeTitle}</h2>
            </div>          </div>

          {active === "case-form" && (
            <CaseForm
              draft={draft}
              updateDraft={updateDraft}
              setDraft={setDraft}
              previewCase={previewCase}
              setPreviewCase={setPreviewCase}
              onReset={resetDraft}
              onStageDraft={stageDraftInList}
            />
          )}

          {active === "cases" && <CasesManager cases={caseList} onEdit={loadCase} />}

          {active === "site-content" && (
            <SiteContentManager
              fields={filteredContent}
              allFields={contentFields}
              query={contentQuery}
              setQuery={setContentQuery}
              editingKey={editingContentKey}
              setEditingKey={setEditingContentKey}
              setFields={setContentFields}
            />
          )}

          {active === "edit-mode" && (
            <InlineEditModePreview
              enabled={editModeEnabled}
              setEnabled={setEditModeEnabled}
              fields={contentFields}
              setFields={setContentFields}
            />
          )}

          {active === "categories" && <CategoriesPanel />}
          {active === "library" && <FuturePanel icon={Archive} title="إدارة المكتبة" text="إضافة المواد، ترتيبها، وتحديث روابطها." />}
          {active === "exams" && <FuturePanel icon={BookOpen} title="إدارة الاختبارات" text="إدارة النماذج، الأسئلة، المحاولات، والنتائج." />}
          {active === "audit" && <AuditPanel />}
        </div>
      </div>
    </section>
  );
}

function StatusCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[#8FA9C4]">{title}</div>
      <div className="mt-2 leading-6">{value}</div>
    </div>
  );
}

function CaseForm({
  draft,
  updateDraft,
  setDraft,
  previewCase,
  setPreviewCase,
  onReset,
  onStageDraft,
}: {
  draft: CaseDraft;
  updateDraft: <K extends keyof CaseDraft>(key: K, value: CaseDraft[K]) => void;
  setDraft: React.Dispatch<React.SetStateAction<CaseDraft>>;
  previewCase: boolean;
  setPreviewCase: (value: boolean) => void;
  onReset: () => void;
  onStageDraft: (status: CaseStatus) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="عنوان القضية" value={draft.title} onChange={(v) => updateDraft("title", v)} />
        <Input label="رابط مختصر slug" value={draft.slug} onChange={(v) => updateDraft("slug", v)} dir="ltr" placeholder="enron-case" />
        <Select label="التصنيف" value={draft.category} onChange={(v) => updateDraft("category", v)} options={CASE_CATEGORIES} />
        <Select label="الحالة" value={draft.status} onChange={(v) => updateDraft("status", v as CaseStatus)} options={["draft", "published"]} labels={{ draft: "مسودة", published: "منشورة" }} />
      </div>

      <TextArea label="ملخص قصير" value={draft.summary} onChange={(v) => updateDraft("summary", v)} rows={3} />
      <TextArea label="النص الرئيسي" value={draft.content} onChange={(v) => updateDraft("content", v)} rows={8} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="تاريخ الإضافة" value={draft.created_at} onChange={(v) => updateDraft("created_at", v)} type="date" />
        <Input label="آخر تعديل" value={draft.updated_at} onChange={(v) => updateDraft("updated_at", v)} type="date" />
      </div>

      <OptionalSections draft={draft} setDraft={setDraft} />

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => onStageDraft("draft")} className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8FA9C4]/35">
          <Save className="h-4 w-4" /> حفظ كمسودة
        </button>
        <button type="button" onClick={() => onStageDraft("published")} className="inline-flex items-center gap-2 border border-[#8FA9C4]/30 bg-[#8FA9C4]/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8FA9C4]/20">
          <Eye className="h-4 w-4" /> نشر
        </button>
        <button type="button" onClick={() => setPreviewCase(!previewCase)} className="inline-flex items-center gap-2 border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:text-white">
          <Eye className="h-4 w-4" /> معاينة
        </button>
        <button type="button" onClick={onReset} className="inline-flex items-center gap-2 border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-500 transition hover:text-white">
          <X className="h-4 w-4" /> إلغاء
        </button>
      </div>

      {previewCase && <CasePreview draft={draft} />}
    </div>
  );
}

function OptionalSections({ draft, setDraft }: { draft: CaseDraft; setDraft: React.Dispatch<React.SetStateAction<CaseDraft>> }) {
  const addTimeline = () => setDraft((current) => ({ ...current, timeline: [...current.timeline, { id: makeId(), dateLabel: "", eventText: "" }] }));
  const addIndicator = () => setDraft((current) => ({ ...current, indicators: [...current.indicators, { id: makeId(), text: "" }] }));
  const addDocument = () => setDraft((current) => ({ ...current, documents: [...current.documents, { id: makeId(), title: "", url: "", note: "" }] }));
  const addReference = () => setDraft((current) => ({ ...current, references: [...current.references, { id: makeId(), name: "", url: "", note: "" }] }));
  const addQuestion = () => setDraft((current) => ({ ...current, questions: [...current.questions, { id: makeId(), question: "", options: ["", "", "", ""], answer: "", explanation: "" }] }));
  const addNote = () => setDraft((current) => ({ ...current, professionalNotes: [...current.professionalNotes, { id: makeId(), text: "" }] }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <SectionAddButton label="إضافة خط زمني" onClick={addTimeline} />
        <SectionAddButton label="إضافة مؤشر اشتباه" onClick={addIndicator} />
        <SectionAddButton label="إضافة مستند أو مرفق" onClick={addDocument} />
        <SectionAddButton label="إضافة مرجع" onClick={addReference} />
        <SectionAddButton label="إضافة سؤال تدريبي" onClick={addQuestion} />
        <SectionAddButton label="إضافة ملاحظة مهنية" onClick={addNote} />
      </div>

      {draft.timeline.length > 0 && (
        <DynamicBlock title="الخط الزمني" onAdd={addTimeline} addLabel="إضافة حدث آخر">
          {draft.timeline.map((item, index) => (
            <RowCard key={item.id} onRemove={() => setDraft((c) => ({ ...c, timeline: c.timeline.filter((x) => x.id !== item.id) }))} index={index + 1}>
              <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                <Input label="تاريخ / سنة" value={item.dateLabel} onChange={(v) => setDraft((c) => ({ ...c, timeline: c.timeline.map((x) => x.id === item.id ? { ...x, dateLabel: v } : x) }))} />
                <Input label="حدث" value={item.eventText} onChange={(v) => setDraft((c) => ({ ...c, timeline: c.timeline.map((x) => x.id === item.id ? { ...x, eventText: v } : x) }))} />
              </div>
            </RowCard>
          ))}
        </DynamicBlock>
      )}

      {draft.indicators.length > 0 && (
        <DynamicBlock title="مؤشرات الاشتباه" onAdd={addIndicator} addLabel="إضافة مؤشر آخر">
          {draft.indicators.map((item, index) => (
            <RowCard key={item.id} onRemove={() => setDraft((c) => ({ ...c, indicators: c.indicators.filter((x) => x.id !== item.id) }))} index={index + 1}>
              <Input label="نص المؤشر" value={item.text} onChange={(v) => setDraft((c) => ({ ...c, indicators: c.indicators.map((x) => x.id === item.id ? { ...x, text: v } : x) }))} />
            </RowCard>
          ))}
        </DynamicBlock>
      )}

      {draft.documents.length > 0 && (
        <DynamicBlock title="المستندات أو المرفقات" onAdd={addDocument} addLabel="إضافة مستند آخر">
          {draft.documents.map((item, index) => (
            <RowCard key={item.id} onRemove={() => setDraft((c) => ({ ...c, documents: c.documents.filter((x) => x.id !== item.id) }))} index={index + 1}>
              <div className="grid gap-3 md:grid-cols-2">
                <Input label="اسم المستند" value={item.title} onChange={(v) => setDraft((c) => ({ ...c, documents: c.documents.map((x) => x.id === item.id ? { ...x, title: v } : x) }))} />
                <Input label="رابط المستند" value={item.url} onChange={(v) => setDraft((c) => ({ ...c, documents: c.documents.map((x) => x.id === item.id ? { ...x, url: v } : x) }))} dir="ltr" />
                <div className="md:col-span-2">
                  <Input label="ملاحظة مختصرة" value={item.note} onChange={(v) => setDraft((c) => ({ ...c, documents: c.documents.map((x) => x.id === item.id ? { ...x, note: v } : x) }))} />
                </div>
              </div>
            </RowCard>
          ))}
        </DynamicBlock>
      )}

      {draft.references.length > 0 && (
        <DynamicBlock title="المراجع" onAdd={addReference} addLabel="إضافة مرجع آخر">
          {draft.references.map((item, index) => (
            <RowCard key={item.id} onRemove={() => setDraft((c) => ({ ...c, references: c.references.filter((x) => x.id !== item.id) }))} index={index + 1}>
              <div className="grid gap-3 md:grid-cols-2">
                <Input label="اسم المرجع" value={item.name} onChange={(v) => setDraft((c) => ({ ...c, references: c.references.map((x) => x.id === item.id ? { ...x, name: v } : x) }))} />
                <Input label="رابط اختياري" value={item.url} onChange={(v) => setDraft((c) => ({ ...c, references: c.references.map((x) => x.id === item.id ? { ...x, url: v } : x) }))} dir="ltr" />
                <div className="md:col-span-2">
                  <Input label="ملاحظة مختصرة اختيارية" value={item.note} onChange={(v) => setDraft((c) => ({ ...c, references: c.references.map((x) => x.id === item.id ? { ...x, note: v } : x) }))} />
                </div>
              </div>
            </RowCard>
          ))}
        </DynamicBlock>
      )}

      {draft.questions.length > 0 && (
        <DynamicBlock title="الأسئلة التدريبية" onAdd={addQuestion} addLabel="إضافة سؤال آخر">
          {draft.questions.map((item, index) => (
            <RowCard key={item.id} onRemove={() => setDraft((c) => ({ ...c, questions: c.questions.filter((x) => x.id !== item.id) }))} index={index + 1}>
              <div className="space-y-3">
                <TextArea label="نص السؤال" value={item.question} rows={3} onChange={(v) => setDraft((c) => ({ ...c, questions: c.questions.map((x) => x.id === item.id ? { ...x, question: v } : x) }))} />
                <div className="grid gap-3 md:grid-cols-2">
                  {item.options.map((option, optionIndex) => (
                    <Input key={optionIndex} label={`خيار ${optionIndex + 1}`} value={option} onChange={(v) => setDraft((c) => ({ ...c, questions: c.questions.map((x) => x.id === item.id ? { ...x, options: x.options.map((o, i) => i === optionIndex ? v : o) } : x) }))} />
                  ))}
                </div>
                <Input label="الإجابة الصحيحة" value={item.answer} onChange={(v) => setDraft((c) => ({ ...c, questions: c.questions.map((x) => x.id === item.id ? { ...x, answer: v } : x) }))} />
                <TextArea label="التفسير" value={item.explanation} rows={3} onChange={(v) => setDraft((c) => ({ ...c, questions: c.questions.map((x) => x.id === item.id ? { ...x, explanation: v } : x) }))} />
              </div>
            </RowCard>
          ))}
        </DynamicBlock>
      )}

      {draft.professionalNotes.length > 0 && (
        <DynamicBlock title="الملاحظات المهنية" onAdd={addNote} addLabel="إضافة ملاحظة أخرى">
          {draft.professionalNotes.map((item, index) => (
            <RowCard key={item.id} onRemove={() => setDraft((c) => ({ ...c, professionalNotes: c.professionalNotes.filter((x) => x.id !== item.id) }))} index={index + 1}>
              <TextArea label="نص الملاحظة" value={item.text} rows={3} onChange={(v) => setDraft((c) => ({ ...c, professionalNotes: c.professionalNotes.map((x) => x.id === item.id ? { ...x, text: v } : x) }))} />
            </RowCard>
          ))}
        </DynamicBlock>
      )}
    </div>
  );
}

function SectionAddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-300 transition hover:border-[#8FA9C4]/30 hover:text-white">
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

function DynamicBlock({ title, onAdd, addLabel, children }: { title: string; onAdd: () => void; addLabel: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#070B11]/70 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>

        </div>
        <button type="button" onClick={onAdd} className="inline-flex w-fit items-center gap-2 border border-[#8FA9C4]/25 bg-[#8FA9C4]/10 px-4 py-2 text-xs font-semibold text-[#D8E4F2] transition hover:bg-[#8FA9C4]/20">
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function RowCard({ children, onRemove, index }: { children: React.ReactNode; onRemove: () => void; index: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <GripVertical className="h-4 w-4" /> عنصر {index}
        </div>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 text-xs text-zinc-500 transition hover:text-red-300">
          <Trash2 className="h-3.5 w-3.5" /> حذف
        </button>
      </div>
      {children}
    </div>
  );
}

function CasesManager({ cases, onEdit }: { cases: CaseDraft[]; onEdit: (item: CaseDraft) => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-8 text-zinc-500">
        قائمة القضايا
      </div>
      <div className="grid gap-4">
        {cases.map((item) => (
          <div key={`${item.slug}-${item.title}`} className="border border-white/10 bg-[#070B11]/75 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Tag>{item.category}</Tag>
                  <Tag muted>{item.status === "published" ? "منشورة" : "مسودة"}</Tag>
                  <Tag muted>{item.slug || "بدون slug"}</Tag>
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title || "قضية بدون عنوان"}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500">{item.summary || "لا يوجد ملخص."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => onEdit(item)} className="inline-flex items-center gap-2 border border-[#8FA9C4]/25 bg-[#8FA9C4]/10 px-4 py-2 text-xs font-semibold text-white">
                  <Edit3 className="h-3.5 w-3.5" /> تعديل
                </button>
                <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-2 border border-white/10 px-4 py-2 text-xs text-zinc-600">
                  <EyeOff className="h-3.5 w-3.5" /> إخفاء
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteContentManager({
  fields,
  allFields,
  query,
  setQuery,
  editingKey,
  setEditingKey,
  setFields,
}: {
  fields: ContentField[];
  allFields: ContentField[];
  query: string;
  setQuery: (value: string) => void;
  editingKey: string | null;
  setEditingKey: (value: string | null) => void;
  setFields: React.Dispatch<React.SetStateAction<ContentField[]>>;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالمفتاح أو الصفحة أو النص" className="w-full border border-white/10 bg-[#070B11] py-3 pl-4 pr-11 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-[#8FA9C4]/40" />
        </label>
        <div className="border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-500">{fields.length} من {allFields.length} حقل</div>
      </div>

      <div className="overflow-hidden border border-white/10">
        <div className="hidden grid-cols-[1fr_1.1fr_130px_110px] gap-px bg-white/10 text-xs text-zinc-500 md:grid">
          <div className="bg-[#070B11] p-3">المفتاح</div>
          <div className="bg-[#070B11] p-3">النص الحالي</div>
          <div className="bg-[#070B11] p-3">النوع</div>
          <div className="bg-[#070B11] p-3">الإجراء</div>
        </div>
        {fields.map((field) => {
          const editing = editingKey === field.key;
          return (
            <div key={field.key} className="grid gap-px border-t border-white/10 bg-white/10 md:grid-cols-[1fr_1.1fr_130px_110px]">
              <div className="bg-[#0B0F16] p-4">
                <div className="text-sm font-semibold text-white">{field.label}</div>
                <div className="mt-1 font-mono text-[11px] text-[#8FA9C4]" dir="ltr">{field.key}</div>
                <div className="mt-2 text-xs text-zinc-600">{field.page}</div>
              </div>
              <div className="bg-[#0B0F16] p-4">
                {editing ? (
                  field.type === "textarea" || field.type === "rich_text" ? (
                    <textarea value={field.value} onChange={(e) => setFields((items) => items.map((x) => x.key === field.key ? { ...x, value: e.target.value } : x))} rows={4} className="w-full resize-y border border-white/10 bg-[#070B11] p-3 text-sm leading-7 text-white outline-none focus:border-[#8FA9C4]/40" />
                  ) : (
                    <input value={field.value} onChange={(e) => setFields((items) => items.map((x) => x.key === field.key ? { ...x, value: e.target.value } : x))} dir={field.type === "url" ? "ltr" : "rtl"} className="w-full border border-white/10 bg-[#070B11] p-3 text-sm text-white outline-none focus:border-[#8FA9C4]/40" />
                  )
                ) : (
                  <p className="line-clamp-3 text-sm leading-7 text-zinc-400">{field.value}</p>
                )}
              </div>
              <div className="bg-[#0B0F16] p-4 text-xs text-zinc-500">{field.type}</div>
              <div className="bg-[#0B0F16] p-4">
                {editing ? (
                  <div className="flex gap-2">
                    <button type="button" disabled className="cursor-not-allowed text-xs text-zinc-600">حفظ</button>
                    <button type="button" onClick={() => setEditingKey(null)} className="text-xs text-zinc-400 hover:text-white">إلغاء</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setEditingKey(field.key)} className="inline-flex items-center gap-1 text-xs text-[#8FA9C4] hover:text-white">
                    <Edit3 className="h-3.5 w-3.5" /> تعديل
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InlineEditModePreview({ enabled, setEnabled, fields, setFields }: { enabled: boolean; setEnabled: (value: boolean) => void; fields: ContentField[]; setFields: React.Dispatch<React.SetStateAction<ContentField[]>> }) {
  const sampleKeys = ["home.hero.title", "home.hero.subtitle", "home.hero.description", "social.telegram", "footer.description"];
  const visible = fields.filter((field) => sampleKeys.includes(field.key));
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#070B11]/70 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">وضع التحرير المباشر</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-500">تحرير مباشر للعناصر المحددة في واجهة الموقع.</p>
        </div>
        <button type="button" onClick={() => setEnabled(!enabled)} className={`inline-flex items-center gap-2 border px-5 py-3 text-sm font-semibold transition ${enabled ? "border-[#8FA9C4]/35 bg-[#8FA9C4]/15 text-white" : "border-white/10 bg-white/[0.03] text-zinc-400"}`}>
          <Pencil className="h-4 w-4" /> {enabled ? "إيقاف وضع التحرير" : "تفعيل وضع التحرير"}
        </button>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#05070B] p-6 md:p-8">
        <div className="mb-6 text-xs text-[#8FA9C4]">العناصر القابلة للتحرير</div>
        <div className="space-y-4">
          {visible.map((field) => (
            <InlineEditableField key={field.key} field={field} enabled={enabled} setFields={setFields} />
          ))}
        </div>
      </div>
    </div>
  );
}

function InlineEditableField({ field, enabled, setFields }: { field: ContentField; enabled: boolean; setFields: React.Dispatch<React.SetStateAction<ContentField[]>> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border p-4 ${enabled ? "border-[#8FA9C4]/25 bg-[#8FA9C4]/5" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-600">{field.label} · <span dir="ltr" className="font-mono">{field.key}</span></div>
        {enabled && <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center gap-1 text-xs text-[#8FA9C4] hover:text-white"><Pencil className="h-3.5 w-3.5" /> تعديل</button>}
      </div>
      <div className="text-lg leading-8 text-white">{field.value}</div>
      {open && enabled && (
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <textarea value={field.value} onChange={(e) => setFields((items) => items.map((x) => x.key === field.key ? { ...x, value: e.target.value } : x))} rows={3} className="w-full resize-y border border-white/10 bg-[#070B11] p-3 text-sm leading-7 text-white outline-none focus:border-[#8FA9C4]/40" />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setOpen(false)} className="border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:text-white">حفظ</button>
            <button type="button" onClick={() => setOpen(false)} className="border border-white/10 px-4 py-2 text-xs text-zinc-400 hover:text-white">إلغاء</button>
            <button type="button" className="border border-[#8FA9C4]/25 bg-[#8FA9C4]/10 px-4 py-2 text-xs text-white">معاينة</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriesPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-8 text-zinc-500">تصنيفات الموقع الحالية.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CASE_CATEGORIES.map((category) => <div key={category} className="border border-white/10 bg-[#070B11]/80 p-4 text-sm text-white"><Tags className="mb-3 h-4 w-4 text-[#8FA9C4]" />{category}</div>)}
      </div>

    </div>
  );
}

function AuditPanel() {
  return (
    <div className="space-y-4">
      {["إنشاء قضية", "تعديل نص موقع", "نشر قضية", "إخفاء قضية"].map((item, index) => (
        <div key={item} className="flex items-center justify-between gap-3 border border-white/10 bg-[#070B11]/80 p-4">
          <div>
            <div className="text-sm font-semibold text-white">{item}</div>
            <div className="mt-1 text-xs text-zinc-600">عملية إدارية</div>
          </div>
          <div className="text-xs text-zinc-600">#{index + 1}</div>
        </div>
      ))}
    </div>
  );
}

function FuturePanel({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8FA9C4]/25 bg-[#8FA9C4]/10 text-[#8FA9C4]"><Icon className="h-6 w-6" /></div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-4 max-w-lg text-sm leading-8 text-zinc-500">{text}</p>
    </div>
  );
}

function CasePreview({ draft }: { draft: CaseDraft }) {
  const timeline = draft.timeline.filter((item) => item.dateLabel.trim() || item.eventText.trim());
  const indicators = draft.indicators.filter((item) => item.text.trim());
  const documents = draft.documents.filter((item) => item.title.trim() || item.url.trim() || item.note.trim());
  const references = draft.references.filter((item) => item.name.trim() || item.url.trim() || item.note.trim());
  const questions = draft.questions.filter((item) => item.question.trim());
  const notes = draft.professionalNotes.filter((item) => item.text.trim());

  return (
    <article className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#05070B] p-6 md:p-9">
      <div className="mb-6 flex flex-wrap gap-2"><Tag>{draft.category}</Tag><Tag muted>{draft.status === "published" ? "منشورة" : "مسودة"}</Tag></div>
      <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">{draft.title || "عنوان القضية"}</h1>
      {draft.summary.trim() && <p className="mt-6 max-w-3xl text-base leading-9 text-zinc-400">{draft.summary}</p>}
      {draft.content.trim() && <div className="mt-9 space-y-5 border-t border-white/10 pt-8 text-base leading-10 text-zinc-300">{draft.content.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}

      {timeline.length > 0 && <PreviewSection title="الخط الزمني"><div className="space-y-3">{timeline.map((item) => <div key={item.id} className="grid gap-3 border border-white/10 bg-white/[0.02] p-4 md:grid-cols-[160px_1fr]"><div className="text-sm font-semibold text-[#8FA9C4]">{item.dateLabel || "—"}</div><div className="text-sm leading-7 text-zinc-400">{item.eventText}</div></div>)}</div></PreviewSection>}
      {indicators.length > 0 && <PreviewSection title="مؤشرات لا ينبغي تجاهلها"><div className="grid gap-3 md:grid-cols-2">{indicators.map((item) => <div key={item.id} className="border border-white/10 bg-white/[0.02] p-4 text-sm leading-7 text-zinc-400">{item.text}</div>)}</div></PreviewSection>}
      {documents.length > 0 && <PreviewSection title="مستندات ومرفقات"><div className="space-y-3">{documents.map((item) => <div key={item.id} className="border border-white/10 bg-white/[0.02] p-4"><div className="text-sm font-semibold text-white">{item.title || "مستند"}</div>{item.url && <div className="mt-2 text-xs text-[#8FA9C4]" dir="ltr">{item.url}</div>}{item.note && <div className="mt-2 text-sm leading-7 text-zinc-500">{item.note}</div>}</div>)}</div></PreviewSection>}
      {references.length > 0 && <PreviewSection title="المراجع"><div className="space-y-3">{references.map((item) => <div key={item.id} className="border border-white/10 bg-white/[0.02] p-4"><div className="text-sm font-semibold text-white">{item.name || "مرجع"}</div>{item.url && <div className="mt-2 text-xs text-[#8FA9C4]" dir="ltr">{item.url}</div>}{item.note && <div className="mt-2 text-sm leading-7 text-zinc-500">{item.note}</div>}</div>)}</div></PreviewSection>}
      {questions.length > 0 && <PreviewSection title="أسئلة تدريبية"><div className="space-y-4">{questions.map((item) => <div key={item.id} className="border border-white/10 bg-white/[0.02] p-4"><div className="text-sm font-semibold leading-7 text-white">{item.question}</div>{item.options.filter(Boolean).length > 0 && <div className="mt-3 grid gap-2 md:grid-cols-2">{item.options.filter(Boolean).map((option, index) => <div key={index} className="border border-white/10 p-3 text-sm text-zinc-500">{option}</div>)}</div>}{item.answer && <div className="mt-3 text-sm text-[#8FA9C4]">الإجابة: {item.answer}</div>}{item.explanation && <div className="mt-2 text-sm leading-7 text-zinc-500">{item.explanation}</div>}</div>)}</div></PreviewSection>}
      {notes.length > 0 && <PreviewSection title="ملاحظات مهنية"><div className="space-y-3">{notes.map((item) => <div key={item.id} className="border border-white/10 bg-white/[0.02] p-4 text-sm leading-8 text-zinc-400">{item.text}</div>)}</div></PreviewSection>}
    </article>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-10 border-t border-white/10 pt-7"><h2 className="mb-5 text-xl font-semibold text-white">{title}</h2>{children}</section>;
}

function Input({ label, value, onChange, type = "text", dir = "rtl", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; dir?: "rtl" | "ltr"; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-zinc-500">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} dir={dir} placeholder={placeholder} className="w-full border border-white/10 bg-[#070B11] px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-[#8FA9C4]/40" />
    </label>
  );
}

function Select({ label, value, onChange, options, labels = {} }: { label: string; value: string; onChange: (value: string) => void; options: string[]; labels?: Record<string, string> }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-zinc-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-white/10 bg-[#070B11] px-4 py-3 text-sm text-white outline-none focus:border-[#8FA9C4]/40">
        {options.map((option) => <option key={option} value={option}>{labels[option] ?? option}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (value: string) => void; rows: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-zinc-500">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full resize-y border border-white/10 bg-[#070B11] px-4 py-3 text-sm leading-8 text-white placeholder:text-zinc-700 outline-none focus:border-[#8FA9C4]/40" />
    </label>
  );
}

function Tag({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return <span className={`inline-flex items-center border px-3 py-1 text-xs ${muted ? "border-white/10 bg-white/[0.03] text-zinc-500" : "border-[#415A77]/25 bg-[#415A77]/12 text-[#d8e4f2]"}`}>{children}</span>;
}
