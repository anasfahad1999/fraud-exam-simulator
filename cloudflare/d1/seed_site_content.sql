-- cloudflare/d1/seed_site_content.sql
-- اختياري وللتجربة فقط.
--
-- ملاحظة مهمة: نظام EditableText لا يحتاج تعبئة مسبقة. أي نص لا يوجد له تعديل
-- محفوظ يعرض القيمة الافتراضية (fallback) المكتوبة في الكود. هذا السطر التالي
-- مجرد مثال لتتأكد أن الحفظ والقراءة يعملان. احذفه أو عدّله كما تشاء.
--
-- تحذير: أي صف هنا "سيتجاوز" النص الموجود في الكود لنفس المفتاح. فلا تُدخل
-- قيمًا إلا للمفاتيح التي تريد فعليًا التحكم بها من قاعدة البيانات.

INSERT INTO site_content (key, page, label, value, type) VALUES
  ('home.hero.tagline', 'home', 'شعار الصفحة الرئيسية',
   'ثغرة مساحة مهنية لقراءة الإشارات التي تختبئ داخل الأرقام', 'textarea')
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;
