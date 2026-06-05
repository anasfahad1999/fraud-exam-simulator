import React from "react";

const articles = [
  {
    id: "preface",
    title: "المرسوم الملكي والقرار",
    content: `مرسوم ملكي رقم (م/79) وتاريخ 1442/9/10هـ

أولاً: الموافقة على نظام مكافحة الاحتيال المالي وخيانة الأمانة، بالصيغة المرافقة.

ثانياً: لا يسري النظام على أفعال الاحتيال المنصوص عليها في نظام السوق المالية -الصادر بالمرسوم الملكي رقم (م/30) بتاريخ 2/6/1424هـ- التي تسري عليها الأحكام الواردة في ذلك النظام.

ثالثاً: تعديل المادة (التسعين) من نظام التنفيذ لتكون بالنص الآتي: "يعاقب بالسجن مدة لا تزيد على خمس عشرة سنة كل مدين ثبت قيامه بتبديد أمواله إذا كانت الأموال كثيرة ولو ثبت إعساره. ويعد ذلك من الجرائم الكبيرة الموجبة للتوقيف".`,
  },
  {
    id: "1",
    title: "المادة الأولى — جريمة الاحتيال",
    content: `يعاقب بالسجن مدة لا تتجاوز (سبع) سنوات، وبغرامة مالية لا تزيد على (خمسة) ملايين ريال، أو بإحدى هاتين العقوبتين؛ كل من استولى على مال للغير دون وجه حق بارتكابه فعلاً (أو أكثر) ينطوي على استخدام أي من طرق الاحتيال، بما فيها الكذب، أو الخداع، أو الإيهام.`,
  },
  {
    id: "2",
    title: "المادة الثانية — جريمة خيانة الأمانة",
    content: `يعاقب بالسجن مدة لا تتجاوز (خمس) سنوات، وبغرامة مالية لا تزيد على (ثلاثة) ملايين ريال، أو بإحدى هاتين العقوبتين؛ كل من استولى دون وجه حق على مال سُلِّم إليه بحكم عمله أو على سبيل الأمانة، أو الشراكة، أو الوديعة، أو الإعارة، أو الإجارة، أو الرهن، أو الوكالة، أو تصرف فيه بسوء نية، أو أحدث به ضرراً عمداً، وذلك في غير المال العام.`,
  },
  {
    id: "3",
    title: "المادة الثالثة — التحريض والاتفاق والمساعدة",
    content: `يعاقب كل من حرض غيره، على ارتكاب أي من الجرائم المنصوص عليها في هذا النظام، أو اتفق معه، أو ساعده؛ إذا وقعت الجريمة بناء على هذا التحريض أو الاتفاق أو المساعدة، بما لا يتجاوز الحد الأعلى للعقوبة المقررة لها، ويعاقب بما لا يتجاوز نصف الحد الأعلى للعقوبة المقررة لها إذا لم تقع الجريمة الأصلية.`,
  },
  {
    id: "4",
    title: "المادة الرابعة — الشروع في الجريمة",
    content: `يعاقب كل من شرع في القيام بأي من الجرائم المنصوص عليها في هذا النظام بما لا يتجاوز نصف الحد الأعلى للعقوبة المقررة على الجريمة التامة.`,
  },
  {
    id: "5",
    title: "المادة الخامسة — الظروف المشددة",
    content: `لا تقل العقوبات المحكوم بها عن نصف حدها الأعلى -المقرر في هذا النظام- ولا تتجاوز ضعفه، وذلك في أي من الحالتين الآتيتين:

1. إذا ارتكبت الجريمة من خلال عصابة منظمة.
2. حالة العود.`,
  },
  {
    id: "6",
    title: "المادة السادسة — المصادرة",
    content: `دون إخلال بحق الغير حسن النية، تُصادر بحكم قضائي الأدوات والآلات المستخدمة في ارتكاب أي من الجرائم المنصوص عليها في هذا النظام، وكذلك المتحصلات المتحققة من ارتكابها.`,
  },
  {
    id: "7",
    title: "المادة السابعة — نشر الحكم",
    content: `يجوز تضمين الحكم الصادر بالعقوبة النص على نشر ملخصه على نفقة المحكوم عليه في صحيفة -أو أكثر- من الصحف التي تصدر في مقر إقامته، فإن لم تكن في مقر إقامته صحيفة ففي أقرب منطقة له، أو نشره في أي وسيلة أخرى مناسبة، وذلك بحسب نوع الجريمة المرتكبة وجسامتها وتأثيرها، على أن يكون النشر بعد أن يكتسب الحكم الصفة النهائية.`,
  },
  {
    id: "8",
    title: "المادة الثامنة — الإعفاء من العقوبة",
    content: `للمحكمة المختصة أن تعفي من العقوبات المنصوص عليها في هذا النظام كل من بادر من الجناة بإبلاغ السلطة المختصة بالجريمة قبل العلم بها وقبل وقوع الضرر، وإن كان الإبلاغ بعد العلم بالجريمة تعيّن للإعفاء أن يكون من شأن الإبلاغ ضبط باقي الجناة في حال تعددهم.`,
  },
  {
    id: "9",
    title: "المادة التاسعة — تطبيق العقوبة الأشد",
    content: `إذا شكل أي من الأفعال المشار إليها في المادتين (الأولى) و(الثانية) من هذا النظام؛ جريمة بموجب أنظمة أخرى؛ فتطبق العقوبة الأشد.`,
  },
  {
    id: "10",
    title: "المادة العاشرة — الاختصاص القضائي",
    content: `تتولى النيابة العامة التحقيق، والادعاء أمام المحكمة المختصة بالفصل في الجرائم الواردة في هذا النظام.`,
  },
  {
    id: "11",
    title: "المادة الحادية عشرة — النفاذ",
    content: `يعمل بهذا النظام بعد مضي (تسعين) يوماً من تاريخ نشره في الجريدة الرسمية.`,
  },
];

export default function AntifraudLaw({ onBack }: { onBack: () => void }) {
  const [activeArticle, setActiveArticle] = React.useState(0);

  return (
    <div dir="rtl" className="min-h-screen bg-[#05070B] text-[#E0E1DD]">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A1128]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
          <button onClick={onBack} className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white">
            ← العودة للمكتبة
          </button>
          <div className="text-sm text-zinc-400">نظام مكافحة الاحتيال المالي وخيانة الأمانة</div>
          <div className="text-xs text-zinc-600">م/79 — 1442هـ</div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-white/10 bg-[#0B0F16] overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <div className="text-xs text-[#8FA9C4] mb-1">المواد</div>
              <div className="text-sm text-white font-semibold">{articles.length} مادة</div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {articles.map((article, i) => (
                <button
                  key={i}
                  onClick={() => setActiveArticle(i)}
                  className={`w-full text-right px-5 py-3 text-xs border-b border-white/5 transition ${
                    activeArticle === i
                      ? "bg-[#415A77]/15 text-white"
                      : "text-zinc-500 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  {article.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border border-white/10 bg-[#0B0F16] p-8 md:p-10 mb-4">
            <h1 className="text-2xl font-semibold text-white mb-8 leading-tight">
              {articles[activeArticle].title}
            </h1>
            <div className="text-zinc-300 leading-[2.2] whitespace-pre-line text-[15px]">
              {articles[activeArticle].content}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveArticle(Math.max(0, activeArticle - 1))}
              disabled={activeArticle === 0}
              className="px-5 py-3 text-sm border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition"
            >
              ← السابق
            </button>
            <button
              onClick={() => setActiveArticle(Math.min(articles.length - 1, activeArticle + 1))}
              disabled={activeArticle === articles.length - 1}
              className="px-5 py-3 text-sm border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition flex-1 text-center"
            >
              التالي →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
