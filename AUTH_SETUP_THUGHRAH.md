# إعداد الدخول والصلاحيات في ثغرة

تم تعديل المشروع بحيث لا يعتمد على تسجيل دخول وهمي داخل الواجهة. تسجيل الدخول الحقيقي يتم عبر Cloudflare Pages Functions، والجلسة تحفظ في Cookies من نوع HttpOnly.

## المطلوب ضبطه في Cloudflare Pages

أضف متغيرات البيئة التالية من لوحة Cloudflare Pages:

```txt
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
DEVELOPER_EMAILS=dev1@example.com,dev2@example.com
```

لا تستخدم متغيرات `VITE_` للأيميلات المصرح لها، حتى لا تظهر داخل JavaScript في الواجهة.

## طريقة العمل

1. صفحة تسجيل الدخول ترسل بيانات الدخول إلى `/api/auth/signin`.
2. Cloudflare Pages Function يتحقق من Supabase.
3. عند نجاح الدخول يتم إنشاء جلسة HttpOnly Cookie.
4. الواجهة تستعلم عن الجلسة من `/api/auth/me`.
5. إيميل المطور يتحقق من جهة الخادم عبر `DEVELOPER_EMAILS`.
6. المسارات `/library` و `/professional-exams` محمية خلف تسجيل الدخول.
7. المسارات `/developer` و `/dashboard` محمية للمطور فقط.

## لوحة المطور

المسار:

```txt
/developer
```

الصفحة الحالية تجهز الواجهة والهيكل فقط. وظائف الإضافة والتعديل والحذف لا تحفظ بيانات بعد، حتى لا تكون هناك حماية شكلية أو وظيفة وهمية.

## قاعدة البيانات المستقبلية

تم تجهيز ملف أولي لجدول القضايا:

```txt
cloudflare/d1/schema.sql
```

عند تفعيل Cloudflare D1، اربط API القضايا بجداول D1، ثم فعّل الحفظ والتعديل والحذف من لوحة المطور.

## ملاحظة أمنية

- لا توجد إيميلات مطور داخل كود الواجهة.
- لا توجد كلمات مرور داخل JavaScript.
- حماية لوحة المطور تعتمد على Cloudflare Pages Functions من جهة الخادم.
- يفضّل إضافة Cloudflare Access على مسار `/developer` لاحقًا كطبقة حماية إضافية للإدارة.
