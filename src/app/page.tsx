import Link from 'next/link';
import { getAllJobs, getJobStats } from '@/data/store';
import HomeJobFeed from '@/components/HomeJobFeed';
import TelegramBanner from '@/components/TelegramBanner';
import AdBanner from '@/components/AdBanner';
import { 
  ShieldCheck, 
  Flame, 
  Building2, 
  GraduationCap, 
  CheckCircle, 
  Laptop, 
  Search, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  FileCheck2,
  BellRing
} from 'lucide-react';

export default async function HomePage() {
  const jobs = await getAllJobs();
  const stats = await getJobStats();

  const resultsJobs = jobs.filter((j) => j.sector === 'results').slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Decorative Grid and glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>البوابة الموثوقة الأولى لمتابعة إعلانات التوظيف ونتائج القبول بالسعودية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            ابحث عن مستقبلك الوظيفي <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              بأسرع طريقة وأوثق مصدر
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            تغطية حصرية وفورية للوظائف الحكومية، العسكرية، الشركات الكبرى (أرامكو، نيوم، سابك)، برامج التدريب المنتهي بالتوظيف، وروابط التقديم المباشر على منصات جدارات وأبشر توظيف.
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-right">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5">
              <span className="block text-2xl font-black text-emerald-400">{stats.total}+</span>
              <span className="text-xs text-slate-300">وظيفة وإعلان نشط</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5">
              <span className="block text-2xl font-black text-amber-400">{stats.military}+</span>
              <span className="text-xs text-slate-300">قطاعات عسكرية</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5">
              <span className="block text-2xl font-black text-teal-400">{stats.training}+</span>
              <span className="text-xs text-slate-300">برامج تدريب وتأهيل</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5">
              <span className="block text-2xl font-black text-sky-400">100%</span>
              <span className="text-xs text-slate-300">روابط تقديم مباشرة</span>
            </div>
          </div>

          {/* Category Quick Navigation Cards */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/jobs?sector=government"
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-600/20 border border-white/10 hover:border-emerald-400/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-emerald-300">وظائف حكومية</span>
            </Link>

            <Link
              href="/jobs?sector=military"
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-amber-600/20 border border-white/10 hover:border-amber-400/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-amber-300">وظائف عسكرية</span>
            </Link>

            <Link
              href="/jobs?sector=corporate"
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-blue-300">وظائف شركات</span>
            </Link>

            <Link
              href="/training"
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-400/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-2">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-purple-300">تدريب وتأهيل</span>
            </Link>

            <Link
              href="/results"
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-rose-600/20 border border-white/10 hover:border-rose-400/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform mb-2">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-rose-300">نتائج القبول</span>
            </Link>

            <Link
              href="/jobs?sector=remote"
              className="group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-teal-600/20 border border-white/10 hover:border-teal-400/50 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform mb-2">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-teal-300">وظائف عن بُعد</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Interactive Filterable Feed */}
        <HomeJobFeed initialJobs={jobs} />

        {/* Telegram & WhatsApp Channel Community Banner */}
        <TelegramBanner />

        {/* Admission & Results News Box */}
        {resultsJobs.length > 0 && (
          <section className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl border border-rose-200/80 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">أحدث نتائج القبول والترشيح المبدئي والنهائي</h3>
                  <p className="text-xs text-gray-600">تابع أسماء ومواعيد المقابلات الشخصية ومطابقة البيانات في القطاعات الرسمية</p>
                </div>
              </div>

              <Link
                href="/results"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline shrink-0"
              >
                <span>عرض جميع نتائج القبول</span>
                <span>←</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resultsJobs.map((item) => (
                <Link
                  key={item.id}
                  href={`/jobs/${item.slug}`}
                  className="bg-white rounded-xl p-4 border border-rose-100 hover:border-rose-300 hover:shadow-md transition flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    نتيجة
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-rose-600">{item.company}</span>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* AdSense Banner Slot */}
        <AdBanner label="إعلان تجاري مدعوم (Google AdSense)" />

        {/* SEO FAQ & Guide Section for Search Engine Rankings */}
        <section className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>الأسئلة الأكثر شيوعاً</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900">دليلك للتقديم والبحث عن عمل في المملكة</h2>
              <p className="text-xs text-gray-500">إجابات مختصرة على أهم تساؤلات الباحثين والباحثات عن وظائف</p>
            </div>

            <div className="space-y-4 pt-4">
              <details className="group bg-gray-50 rounded-xl p-4 border border-gray-100 open:bg-white open:border-emerald-200 transition">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-sm">
                  <span>كيف أقدم على الوظائف المنشورة عبر الموقع؟</span>
                  <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  بمجرد الدخول على صفحة الإعلان الوظيفي المرغوب، ستجد في نهاية الصفحة زر <strong>«رابط التقديم الرسمي والمباشر»</strong> الذي ينقلك مباشرة إلى بوابة التوظيف الرسمية للجهة المعلنة (مثل منصة جدارات، بوابة التجنيد الموحد، منصة أبشر توظيف، أو بوابة التوظيف الرسمية للشركة).
                </p>
              </details>

              <details className="group bg-gray-50 rounded-xl p-4 border border-gray-100 open:bg-white open:border-emerald-200 transition">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-sm">
                  <span>هل التقديم مجاني؟ وهل يطلب الموقع أي رسوم؟</span>
                  <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  التقديم مجاني بنسبة 100%. موقع وظيفتك اليوم منصة إخبارية لا تتقاضى أي مبالغ مالية ولا نطلب أي بيانات بنكية إطلاقاً، وتتم عملية التوظيف مباشرة بين المتقدم والجهة المعلنة.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-xl p-4 border border-gray-100 open:bg-white open:border-emerald-200 transition">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-sm">
                  <span>ما هي مواعيد إعلان الوظائف العسكرية ونتائج القبول؟</span>
                  <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  تعلن القطاعات العسكرية (وزارة الدفاع، الحرس الوطني، حرس الحدود، الجوازات، مكافحة المخدرات، الطوارئ) فتح بوابات القبول دورياً على مدار العام. نحرص في موقعنا وقناتنا على التيليجرام على إرسال تنبيهات فورية للمشتركين لحظة فتح البوابة أو إعلان أسماء المقبولين.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-xl p-4 border border-gray-100 open:bg-white open:border-emerald-200 transition">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-sm">
                  <span>هل تتوفر وظائف لحملة الثانوية العامة بدون خبرة؟</span>
                  <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  نعم، يمكنك تخصيص الفلتر لاختيار مؤهل «ثانوية عامة فما دون» لاستعراض كافة الوظائف العسكرية، وظائف خدمة العملاء، وظائف الشركات، وبرامج التدرج المهني كبرنامج أرامكو لحديثي التخرج من الثانوية.
                </p>
              </details>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
