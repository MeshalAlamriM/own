import Link from 'next/link';
import { Briefcase, Send, MessageSquare, ShieldAlert, ShieldCheck, FileText, Info, Mail } from 'lucide-react';

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const popularKeywords = [
    'وظائف أرامكو',
    'وظائف الحرس الوطني',
    'أبشر توظيف',
    'منصة جدارات',
    'وظائف بشهادة الثانوية',
    'وظائف نسائية عن بعد',
    'وظائف وزارة الدفاع',
    'وظائف بنوك الرياض',
    'وظائف نيوم 2026',
    'تدريب منتهي بالتوظيف',
    'نتائج القبول المبدئي',
    'وظائف شركات الاتصالات',
    'وظائف صحية تشغيل ذاتي',
    'وظائف سائقين وحراس أمن'
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-14 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">وظيفتك <span className="text-emerald-400">اليوم</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              المنصة السعودية الرائدة لمتابعة أحدث أخبار الوظائف الحكومية والعسكرية والشركات الكبرى وبرامج التدريب ونتائج القبول لحظة بلحظة.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 hover:text-sky-400 flex items-center justify-center text-slate-400 transition"
                title="تيليجرام"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-emerald-400 flex items-center justify-center text-slate-400 transition"
                title="واتساب"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-neutral-400 hover:text-white flex items-center justify-center text-slate-400 transition"
                title="منصة X"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">أقسام الوظائف</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/jobs?sector=government" className="hover:text-emerald-400 transition">وظائف القطاع الحكومي والمدني</Link>
              </li>
              <li>
                <Link href="/jobs?sector=military" className="hover:text-emerald-400 transition">وظائف وزارة الدفاع والحرس والداخلية</Link>
              </li>
              <li>
                <Link href="/jobs?sector=corporate" className="hover:text-emerald-400 transition">وظائف كبرى الشركات والبنوك</Link>
              </li>
              <li>
                <Link href="/training" className="hover:text-emerald-400 transition">برامج التدريب المنتهي بالتوظيف</Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-emerald-400 transition">نتائج القبول والترشيح المبدئي والنهائي</Link>
              </li>
              <li>
                <Link href="/jobs?sector=remote" className="hover:text-emerald-400 transition">وظائف العمل عن بُعد (من المنزل)</Link>
              </li>
            </ul>
          </div>

          {/* Quick Qualifications */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">الوظائف حسب المؤهل</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/jobs?qualification=ثانوية" className="hover:text-emerald-400 transition">وظائف لحملة الثانوية العامة فما دون</Link>
              </li>
              <li>
                <Link href="/jobs?qualification=دبلوم" className="hover:text-emerald-400 transition">وظائف الكليات التقنية والدبلومات</Link>
              </li>
              <li>
                <Link href="/jobs?qualification=بكالوريوس" className="hover:text-emerald-400 transition">وظائف لحملة البكالوريوس لكافة التخصصات</Link>
              </li>
              <li>
                <Link href="/jobs?gender=female" className="hover:text-emerald-400 transition">وظائف نسائية شاغرة</Link>
              </li>
              <li>
                <Link href="/jobs?city=الرياض" className="hover:text-emerald-400 transition">وظائف منطقة الرياض</Link>
              </li>
              <li>
                <Link href="/jobs?city=الشرقية" className="hover:text-emerald-400 transition">وظائف المنطقة الشرقية</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Mandatory Policy Pages for Google AdSense */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>السياسات ومعلومات الموقع</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition font-medium">
                  سياسة الخصوصية (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition font-medium">
                  الشروط والأحكام وإخلاء المسؤولية
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition font-medium">
                  من نحن والسياسة التحريرية
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition font-medium">
                  اتصل بنا (خدمة المستفيدين)
                </Link>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
              الموقع منصة إخبارية مستقلة تنقل إعلانات التوظيف الرسمية بدون أي رسوم أو وساطة.
            </div>
          </div>
        </div>

        {/* Popular Tags cloud for SEO */}
        <div className="py-6 border-b border-slate-800">
          <div className="text-xs font-bold text-slate-400 mb-3">الكلمات الأكثر بحثاً في المملكة:</div>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((kw, i) => (
              <Link
                key={i}
                href={`/jobs?q=${encodeURIComponent(kw)}`}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-600 transition"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom copyright & Policy bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 وظيفتك اليوم. جميع الحقوق محفوظة للمملكة العربية السعودية.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="hover:text-slate-300">الخصوصية</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300">الشروط</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-300">عن الموقع</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-300">تواصل معنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
