import React, { useState } from "react";

const sections = [
 {
  "id": "origin",
  "title": "نشأة النشاط وتحوّله",
  "content": "كانت إنرون توصف بأنها من أكثر الشركات نجاحًا في أمريكا. ثم انهارت في أسابيع.\n\nتأسست عام 1985 بدمج Houston Natural Gas و InterNorth بقيادة Kenneth Lay. مقرّها هيوستن. بدأت شركة أنابيب غاز طبيعي. ثم تحوّلت إلى شركة تداول في الطاقة والسلع والنطاق الترددي داخل أمريكا وخارجها.\n\nخلال خمسة عشر عامًا صارت سابع أكبر شركة في أمريكا. وخلال ستة عشر عامًا نمت أصولها من نحو عشرة مليارات دولار إلى خمسة وستين مليار دولار. بدت من الخارج قصة نجاح.\n\nلكن النمو لم يكن كله نشاطًا. كان جزء منه طريقة عرض."
 },
 {
  "id": "revenue",
  "title": "الاعتراف بالإيراد والقيمة السوقية",
  "content": "استخدمت إنرون المحاسبة بالقيمة السوقية. سجّلت بها أرباحًا متوقعة من صفقات طويلة الأجل يوم توقيعها. الربح يدخل القائمة قبل أن يدخل النقد.\n\nاتسعت المسافة بين قائمة الدخل وحركة النقد.\n\nثم جاءت الكيانات ذات الغرض الخاص. أنشأت إنرون منها مئات. نقلت إليها ديونًا وأصولًا ضعيفة الأداء. الميزانية ظهرت أخف. الالتزام بقي قريبًا."
 },
 {
  "id": "entities",
  "title": "الكيانات ذات الغرض الخاص",
  "content": "كانت الديون تختفي من الصفحة لا من الخطر.\n\nكثير من هذه الكيانات مموّل بأسهم إنرون أو مضمون منها. الطرف المقابل ليس بعيدًا. الخطر يدور في الدائرة نفسها.\n\nمن أبرزها LJM1 و LJM2. أنشأهما المدير المالي Andrew Fastow وسمّاهما على أسماء زوجته Lea وابنيه Jeffrey و Matthew. أُنشئت LJM1 في يونيو 1999. غرضها المعلن: شراء أصول إنرون ضعيفة الأداء وإخراجها من الميزانية.\n\nوظهرت كيانات أخرى: Chewco و JEDI. ثم مجموعة Raptors. أُنشئت Raptors لحماية إنرون من خسائر القيمة السوقية في بعض استثماراتها في الأسهم. ولمّا انخفضت قيمة الاستثمارات دعمت إنرون Raptors بأسهمها. ثم انكشف العجز.\n\nوظهرت صفقات الدفع المسبق. القرض يظهر كأنه تدفق تشغيلي. لم تعد المشكلة في الربح وحده. وصلت إلى النقد."
 },
 {
  "id": "cashflows",
  "title": "عرض التدفقات والديون",
  "content": "ومن أوضح الأمثلة صفقة الصنادل النيجيرية. اشترى Merrill Lynch صنادل نيجيرية من إنرون مع ضمان إعادة شراء قبل إعلان الأرباح. سُجّلت كأنها بيع. أعادت إنرون شراءها بعد أشهر.\n\nكان Andrew Fastow مديرًا ماليًا لإنرون ومسؤولًا عن كيانات تتعامل معها. يفاوض من جهتين. جنى 30.5 مليون دولار من أسهم إنرون ونحو 45 مليون دولار من شراكات LJM."
 },
 {
  "id": "conflict",
  "title": "تعارض المصالح والإدارة",
  "content": "في أغسطس 2000 بلغ السهم ذروته حول 90 دولارًا. كان السوق يراها قصة نجاح.\n\nفي أغسطس 2001 استقال Skilling فجأة لأسباب شخصية. عاد Lay إلى القيادة."
 },
 {
  "id": "collapse",
  "title": "الانكشاف والإفلاس",
  "content": "في 16 أكتوبر 2001 أعلنت إنرون نتائج الربع الثالث. ظهرت خسارة قدرها 544 مليون دولار بعد الأثر الضريبي لتغطية عجز Raptors.\n\nبعد ستة أيام في 22 أكتوبر 2001 فتحت SEC تحقيقًا. هبط السهم إلى 20 دولارًا. وفي 30 نوفمبر 2001 وصل إلى 0.26 دولار. وفي 2 ديسمبر 2001 تقدّمت إنرون بطلب إفلاس تحت الفصل الحادي عشر.\n\nقبل الانهيار كانت Sherron Watkins نائبة الرئيس في إنرون قد حذّرت Lay من مخالفات محاسبية. وفي مذكرتها خشيت أن تنفجر الشركة في موجة فضائح محاسبية. ثم تعرّضت لضغوط بعد التحذير. اسمها صار لاحقًا جزءًا من النقاش حول حماية المبلّغين.\n\nبعد الانهيار اتسعت التحقيقات. شملت لجانًا في الكونغرس ومسائل الاحتيال المحاسبي والتعاملات الذاتية والأجور التنفيذية وفشل التدقيق وسوء إدارة المعاشات والتلاعب بأسعار الطاقة.\n\nفي يناير 2006 بدأت محاكمة Lay و Skilling واستمرت قرابة أربعة أشهر. في 25 مايو 2006 أُدين Lay في التهم الست الموجهة إليه. وأُدين في محاكمة منفصلة بتهمة احتيال مصرفي وثلاث تهم بالإدلاء ببيانات كاذبة للبنوك. وأُدين Skilling في 19 من 28 تهمة. وبُرّئ من تسع تهم تداول داخلي."
 },
 {
  "id": "accountability",
  "title": "التدقيق والمساءلة",
  "content": "في 23 أكتوبر 2006 حُكم على Skilling بالسجن 292 شهرًا. وفي 6 يناير 2009 أيّدت محكمة الاستئناف الفيدرالية إداناته وألغت الحكم لإعادة النطق بسبب خطأ في رفع العقوبة. وفي عام 2013 خُفِّض الحكم بنحو عشر سنوات.\n\nأمّا Lay فقد توفي في 5 يوليو 2006 بنوبة قلبية بعد ستة أسابيع من إدانته بعشر تهم جنائية. ولأن وفاته سبقت استنفاد حقه في الاستئناف أُلغيت إداناته الجنائية وفق مبدأ الإبطال.\n\nوأمّا Fastow فوُجِّهت إليه في الأصل 98 تهمة شملت الاحتيال والتداول الداخلي وغسل الأموال. أقرّ بالذنب في تهمتي تآمر. اعترف بإدارة مخططات لإخفاء ديون إنرون وتضخيم الأرباح مع إثراء نفسه. وسلّم ما يقارب 30 مليون دولار نقدًا وممتلكات. في 26 سبتمبر 2006 حُكم عليه بالسجن ست سنوات مقابل تعاونه وشهادته ضد رؤسائه. وأقرّت زوجته Lea بالذنب عام 2004 في جنحة ضريبية وقضت سنة في السجن لمساعدته في إخفاء مكاسبه غير المشروعة.\n\nلم تكن إنرون وحدها في الدائرة.\n\nكانت Arthur Andersen من أكبر خمس شركات تدقيق في العالم. مدقّقة لإنرون ومستشارة لها في الوقت نفسه. شاركت في تصميم هياكل LJM و Raptor. ووافقت على معالجتها المحاسبية رغم أن جوهرها الاقتصادي كان محل إشكال.\n\nفي 9 أكتوبر 2001 دوّنت مستشارة Andersen القانونية Nancy Temple أن تحقيقًا من SEC محتمل جدًا. وأصدرت تذكيرات باتباع سياسة الاحتفاظ بالمستندات التي تنص على إتلاف غير المطلوب. تبع ذلك إتلاف واسع للمستندات الورقية والإلكترونية. الحكومة قدّرت ما أُتلف بنحو طنّين من أوراق عمل إنرون.\n\nفي يونيو 2002 أُدينت Andersen بعرقلة العدالة. غُرّمت 500 ألف دولار. وفُرضت عليها خمس سنوات مراقبة. وفي 31 مايو 2005 ألغت المحكمة العليا الأمريكية الإدانة بالإجماع لأن تعليمات هيئة المحلفين لم تغطِّ القصد الجنائي بشكل صحيح. أُلغي الحكم لاحقًا لكن أثر القضية بقي على Andersen. خسرت الشركة عملاءها وثقة السوق وخرجت عمليًا من المشهد. وانتهى عشرات الآلاف من موظفيها بلا وظائف.\n\nمحا انهيار إنرون أكثر من 60 مليار دولار من القيمة السوقية. وخسر آلاف الموظفين وظائفهم. وضاع أكثر من ملياري دولار من خطط المعاشات التقاعدية. وخسر ملايين المستثمرين ومنهم موظفون عملوا في إنرون سنوات طويلة مليارات الدولارات من مدخراتهم واستثماراتهم وخطط تقاعدهم.\n\nفي عام 2002 صدر قانون Sarbanes-Oxley. أُقرّ بتصويت 423 مقابل 3 في مجلس النواب و99 مقابل صفر في مجلس الشيوخ. ووقّعه الرئيس George W. Bush في 30 يوليو 2002. أنشأ القانون مجلس رقابة على مهنة المحاسبة (PCAOB). ومنع شركات التدقيق من ممارسة أعمال استشارية متزامنة للعميل نفسه. وألزم التنفيذيين بالتصديق الشخصي على صحة القوائم المالية. وأوجب الإفصاح عن العمليات خارج الميزانية. ومنع القروض الشخصية من الشركة لمديريها التنفيذيين. وشدّد العقوبات على إتلاف أو تغيير أو تزوير السجلات المالية. وحمى المبلّغين من الانتقام."
 },
 {
  "id": "indicators",
  "title": "المؤشرات المهنية",
  "content": "1. تسجيل أرباح متوقعة قبل تحقق النقد.\n2. نقل ديون وأصول ضعيفة الأداء إلى كيانات خارج الميزانية.\n3. كيانات يُفترض أنها مستقلة مموّلة بأسهم الشركة أو مضمونة منها.\n4. مدير مالي ينشئ كيانات تتعامل مع شركته ويكون مسؤولًا عن بعضها.\n5. قروض تظهر كتدفقات تشغيلية عبر صفقات الدفع المسبق.\n6. صفقة تُسجَّل كبيع وفيها ضمان إعادة شراء لاحق.\n7. مدقّق يجمع بين التدقيق والاستشارة لدى العميل نفسه.\n8. إتلاف مستندات في مرحلة تحتمل التحقيق.\n9. تنفيذيون يبيعون أسهمهم بينما يُشجَّع الموظفون على الاحتفاظ بها.\n10. تداولات ترتبط بمعلومات جوهرية غير معلنة.\n\nفي إنرون الرقم لم يكن وحده. خلفه أسلوب عرض وكيان قريب ومدقّق مزدوج الدور وصفقة بشكلين.\n\nالسؤال كان: هل وصل المال فعلًا؟ وأين ذهب الخطر؟"
 }
];

const timelineEvents = [
 {
  "year": "1985",
  "title": "البداية",
  "detail": "دمج Houston Natural Gas و InterNorth وبداية نشاط الغاز الطبيعي."
 },
 {
  "year": "1999",
  "title": "الكيانات الخاصة",
  "detail": "ظهور LJM واتساع الهياكل التي أبعدت الالتزامات عن القوائم."
 },
 {
  "year": "2000",
  "title": "ذروة السهم",
  "detail": "السهم يقترب من 90 دولارًا وصورة النجاح تبلغ ذروتها."
 },
 {
  "year": "أغسطس 2001",
  "title": "تغيّر القيادة",
  "detail": "استقالة Skilling وعودة Lay إلى الواجهة قبل الانكشاف."
 },
 {
  "year": "أكتوبر 2001",
  "title": "الانكشاف",
  "detail": "خسارة Raptors وتحقيق SEC وهبوط حاد في السهم."
 },
 {
  "year": "ديسمبر 2001",
  "title": "الإفلاس",
  "detail": "إنرون تدخل الفصل الحادي عشر بعد انهيار الثقة والسعر."
 }
];

function splitParagraphs(content: string) {
 return content
  .split(/\n\s*\n/g)
  .map((part) => part.trim())
  .filter(Boolean);
}

function normalizeParagraph(part: string) {
 return part
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .join(" ");
}

export default function EnronCase({ onBack }: { onBack: () => void }) {
 const [isTimelineOpen, setIsTimelineOpen] = useState(true);

 return (
  <div dir="rtl" className="min-h-screen bg-[#05070B] text-[#E0E1DD]">
   <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070B]/88 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
     <button
      onClick={onBack}
      className="border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-400 transition hover:border-[#8FA9C4]/30 hover:text-white"
     >
      ← العودة للتحليلات
     </button>
     <div className="hidden text-sm text-zinc-500 sm:block">Enron Corporation</div>
    </div>
   </header>

   <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <section className="overflow-hidden border border-white/10 bg-[#0B0F16]">
     <div className="grid gap-px bg-white/10 lg:grid-cols-[1fr_320px]">
      <div className="bg-[#0B0F16] p-7 sm:p-10 lg:p-12">
       <div className="mb-6 flex flex-wrap items-center gap-3 text-xs">
        <span className="border border-[#415A77]/40 bg-[#415A77]/12 px-3 py-1 text-[#d8e4f2]">تحليل قضية</span>
        <span className="text-zinc-600">Enron Corporation</span>
        <span className="text-zinc-700">·</span>
        <span className="text-zinc-600">قراءة مالية جنائية</span>
       </div>

       <h1 className="max-w-3xl text-3xl font-semibold leading-[1.35] text-white sm:text-4xl lg:text-5xl">
        إنرون وأزمة الثقة بالقوائم
       </h1>

       <p className="mt-7 max-w-3xl text-base leading-9 text-zinc-400 sm:text-lg">
        قصة صعود بدت مكتملة في القوائم بينما كانت الأرباح والديون والتدفقات ترسم صورة أخف من الخطر الحقيقي.
       </p>
      </div>

      <aside className="bg-[#0E141D] p-7 sm:p-10 lg:p-8">
       <div className="text-xs text-[#8FA9C4]">ملخص القراءة</div>
       <div className="mt-5 space-y-5">
        <div>
         <div className="text-2xl font-semibold text-white">{sections.length}</div>
         <div className="mt-1 text-sm text-zinc-500">محاور مهنية</div>
        </div>
        <div className="border-t border-white/10 pt-5">
         <div className="text-2xl font-semibold text-white">2001</div>
         <div className="mt-1 text-sm text-zinc-500">عام الانكشاف</div>
        </div>
        <div className="border-t border-white/10 pt-5">
         <div className="text-sm leading-7 text-zinc-400">
          تبدأ القراءة من شركة غاز تحولت إلى لاعب واسع في الطاقة والتداول. ثم تتتبع كيف سبق الربح النقد وكيف خرجت الالتزامات من الصفحة وبقي الخطر داخل الدائرة نفسها.
         </div>
        </div>
       </div>
      </aside>
     </div>
    </section>

    <section className="mt-5 overflow-hidden border border-white/10 bg-[#0B0F16]">
     <button
      onClick={() => setIsTimelineOpen(!isTimelineOpen)}
      className="flex w-full items-center justify-between gap-5 px-6 py-5 text-right transition hover:bg-white/[0.02] sm:px-8"
     >
      <div>
       <div className="text-xs text-[#8FA9C4]">المسار الزمني</div>
       <h2 className="mt-1 text-lg font-semibold text-white">أبرز المحطات من الصعود إلى الانكشاف.</h2>
      </div>
      <span className="shrink-0 border border-white/10 px-3 py-1 text-xs text-zinc-500">
       {isTimelineOpen ? "طي المسار" : "عرض المسار"}
      </span>
     </button>

     {isTimelineOpen && (
      <div className="border-t border-white/10 p-5 sm:p-7">
       <div className="flex gap-3 overflow-x-auto pb-2 xl:grid xl:grid-cols-6 xl:overflow-visible">
        {timelineEvents.map((item, idx) => (
         <div
          key={`${item.year}-${idx}`}
          className="min-w-[220px] border border-white/10 bg-[#05070B] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#8FA9C4]/40 hover:bg-[#0E141D] hover:shadow-[0_18px_55px_rgba(143,169,196,0.08)]"
         >
          <div className="mb-4 flex items-center justify-between gap-4">
           <span className="text-base font-semibold text-white">{item.year}</span>
           <span className="text-xs text-zinc-700">{String(idx + 1).padStart(2, "0")}</span>
          </div>
          <div className="text-sm font-medium text-[#8FA9C4]">{item.title}</div>
          <p className="mt-3 text-sm leading-7 text-zinc-500">{item.detail}</p>
         </div>
        ))}
       </div>
      </div>
     )}
    </section>

    <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
     <aside className="hidden lg:block lg:sticky lg:top-24">
      <div className="border border-white/10 bg-[#0B0F16] p-5">
       <div className="mb-4 text-xs text-[#8FA9C4]">فهرس القراءة</div>
       <nav className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
        {sections.map((section, idx) => (
         <a
          key={section.id}
          href={`#${section.id}`}
          className="block border border-transparent px-3 py-2.5 text-sm leading-7 text-zinc-500 transition hover:border-white/10 hover:bg-white/[0.02] hover:text-white"
         >
          <span className="ml-2 text-[11px] text-[#415A77]">{String(idx + 1).padStart(2, "0")}</span>
          {section.title}
         </a>
        ))}
       </nav>
      </div>
     </aside>

     <article className="space-y-5">
      {sections.map((section, idx) => (
       <section id={section.id} key={section.id} className="scroll-mt-24 border border-white/10 bg-[#0B0F16] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <div className="mx-auto max-w-3xl">
         <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-[#415A77]/35 bg-[#415A77]/10 text-xs text-[#8FA9C4]">
           {String(idx + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-white/10" />
         </div>

         <h2 className="text-2xl font-semibold leading-[1.55] text-white sm:text-3xl">
          {section.title}
         </h2>

         <div className="mt-7 space-y-5 text-[17px] leading-[2.15] text-zinc-300 sm:text-[18px]">
          {splitParagraphs(section.content).map((paragraph, paragraphIdx) => (
           <p key={paragraphIdx} className="text-pretty">
            {normalizeParagraph(paragraph)}
           </p>
          ))}
         </div>
        </div>
       </section>
      ))}
     </article>
    </div>
   </main>
  </div>
 );
}
