# قائمة نشر النسخة المحسنة

## 1. متغيرات Vercel

أضف القيم التالية إلى Production وPreview عند الحاجة:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — استخدم Service Role Key في الخادم فقط، ولا تضعه في متغير يبدأ بـ `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — اختياري للقراءة الاحتياطية.
- `ADMIN_PASSWORD` — كلمة مرور طويلة وفريدة للوحة الإدارة.
- `ADMIN_SESSION_SECRET` — قيمة عشوائية مختلفة عن كلمة المرور.
- `TELEGRAM_BOT_TOKEN` — اختياري للنشر في Telegram.
- `TELEGRAM_CHANNEL_ID` — اختياري للنشر في Telegram.
- `NEXT_PUBLIC_SITE_URL` — رابط الموقع النهائي.

بعد الحفظ، نفّذ Redeploy من Vercel.

## 2. ترقية Supabase

افتح Supabase SQL Editor ونفّذ كامل ملف `supabase-schema.sql`. الملف:

- يبقي القراءة العامة للوظائف.
- يلغي الكتابة العامة من anon.
- يضيف فهارس البحث والترتيب.
- ينشئ دالة ذرية لزيادة المشاهدات.

إذا كانت لديك سياسات قديمة بأسماء مختلفة، راجعها يدويًا من Supabase أو احذف سياسات الكتابة العامة من Table Editor.

## 3. اختبار ما بعد النشر

1. افتح `/admin` وسجّل الدخول بكلمة `ADMIN_PASSWORD`.
2. أضف وظيفة جديدة، ثم تحقق من ظهورها في جدول `jobs` داخل Supabase.
3. عدّل الوظيفة وتأكد من انعكاس التعديل في Supabase.
4. احذف وظيفة اختبار وتأكد من حذفها سحابيًا.
5. افتح الوظيفة كرابط عام وتحقق من زيادة `views_count`.
6. اختبر `/api/test-db` بعد تسجيل الدخول فقط.
7. إذا استخدمت Telegram، أضف البوت كمسؤول ثم اختبر النشر من لوحة الإدارة.

لا تضع أي Service Role Key أو Telegram Bot Token داخل Git أو `localStorage` أو متغير يبدأ بـ `NEXT_PUBLIC_`.
