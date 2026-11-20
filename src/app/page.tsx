import Link from 'next/link';
import { getAllJobs, getJobStats } from '@/data/store';
import HomeJobFeed from '@/components/HomeJobFeed';
import TelegramBanner from '@/components/TelegramBanner';
import AdBanner from '@/components/AdBanner';
import HeroSearch from '@/components/HeroSearch';
import { daysLeft, matchesSector, sectorStyle, initialsOf } from '@/lib/ui';
import type { JobSector } from '@/types/job';
import { getHomeStatsSettings } from '@/lib/home-stats-settings';

export const dynamic = 'force-dynamic';
import {
  ShieldCheck,
  Flame,
  Building2,
  GraduationCap,
  CheckCircle2,
  Laptop,
  ArrowUpLeft,
  ArrowLeft,
  Timer,
  MousePointerClick,
  BadgeCheck,
  Send,
  Plus,
  Radio,
} from 'lucide-react';

const categories: {
  sector: JobSector;
  href: string;
  title: string;
  desc: string;
  icon: typeof ShieldCheck;
}[] = [
  { sector: 'government', href: '/jobs?sector=government', title: 'الوظائف الحكومية', desc: 'الوزارات والهيئات وجدارات', icon: ShieldCheck },
  { sector: 'military', href: '/jobs?sector=military', title: 'الوظائف العسكرية', desc: 'الدفاع والحرس والداخلية', icon: Flame },
  { sector: 'corporate', href: '/jobs?sector=corporate', title: 'وظائف الشركات', desc: 'كبرى الشركات والبنوك', icon: Building2 },
  { sector: 'training', href: '/training', title: 'التدريب والتأهيل', desc: 'تدريب منتهٍ بالتوظيف', icon: GraduationCap },
  { sector: 'results', href: '/results', title: 'نتائج القبول', desc: 'الترشيح والمقابلات', icon: CheckCircle2 },
  { sector: 'remote', href: '/jobs?sector=remote', title: 'العمل عن بُعد', desc: 'من المنزل وبمرونة', icon: Laptop },
];

const steps = [
  {
    icon: MousePointerClick,
    title: 'اختر ما يناسبك',
    text: 'ابحث أو صفّ الإعلانات حسب القطاع والمؤهل والمنطقة، وخذ الصورة الكاملة في صفحة واحدة.',
  },
  {
    icon: BadgeCheck,
    title: 'تحقق من المصدر',
    text: 'كل إعلان يحمل الشروط والمواعيد ورابط المصدر الرسمي، دون وسطاء ودون رسوم.',
  },
  {
    icon: Timer,
    title: 'قدّم في الوقت المناسب',
    text: 'عدّاد تنازلي لكل إعلان وتنبيهات فورية على قنواتنا حتى لا يفوتك موعد التقديم.',
  },
];

const faqs = [
  {
    q: 'كيف أقدم على الوظائف المنشورة عبر الموقع؟',
    a: 'ادخل صفحة الإعلان المطلوب، وستجد زر «رابط التقديم المباشر» الذي ينقلك إلى بوابة التوظيف الرسمية للجهة المعلنة (مثل جدارات، التجنيد الموحد، أبشر توظيف، أو بوابة الشركة).',
  },
  {
    q: 'هل التقديم مجاني؟ وهل يطلب الموقع أي رسوم؟',
    a: 'التقديم مجاني بالكامل. «وظيفتك اليوم» منصة إخبارية لا تتقاضى أي مبالغ ولا تطلب بيانات بنكية إطلاقاً، وتتم عملية التوظيف مباشرة بين المتقدم والجهة المعلنة.',
  },
  {
    q: 'ما هي مواعيد إعلان الوظائف العسكرية ونتائج القبول؟',
    a: 'تفتح القطاعات العسكرية (الدفاع، الحرس الوطني، حرس الحدود، الجوازات، مكافحة المخدرات، الطوارئ) بواباتها دورياً على مدار العام. نرسل تنبيهات فورية عبر قنواتنا لحظة فتح البوابة أو إعلان أسماء المقبولين.',
  },
  {
    q: 'هل تتوفر وظائف لحملة الثانوية العامة بدون خبرة؟',
    a: 'نعم. اختر مؤهل «ثانوية عامة فما دون» من التصفية المتقدمة لاستعراض الوظائف العسكرية ووظائف خدمة العملاء والشركات وبرامج التدرج المهني.',
  },
];

export default async function HomePage() {
  const jobs = await getAllJobs();
  const stats = await getJobStats();
  const homeStatsSettings = await getHomeStatsSettings();

  const latest = [...jobs]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 4);

  const closingSoon = jobs
    .map((j) => ({ job: j, left: daysLeft(j.endDate) }))
    .filter((x) => x.left >= 0 && x.left <= 7)
    .sort((a, b) => a.left - b.left)
    .slice(0, 8);

  const resultsJobs = jobs.filter((j) => matchesSector(j, 'results')).slice(0, 4);

  const numbers = [
    { key: 'total', value: stats.total, label: 'إعلان في المنصة' },
    { key: 'active', value: stats.active, label: 'مفتوح للتقديم الآن' },
    { key: 'expiringSoon', value: stats.expiringSoon, label: 'ينتهي خلال أسبوع' },
    { key: 'totalViews', value: stats.totalViews, label: 'مشاهدة للإعلانات' },
  ].filter((item) => homeStatsSettings[item.key as keyof typeof homeStatsSettings]);

  const visibleNumbersCount = numbers.length;

  return (
    <div className="pb-24">
      {/* ======================= HERO ======================= */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 dots [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="absolute -z-10 -top-32 -right-24 w-[34rem] h-[34rem] rounded-full bg-saffron-200/50 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 h-9 ps-2 pe-4 rounded-full bg-white border border-line shadow-soft text-[13px] font-semibold text-ink-700">
              <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-ink-950 text-saffron-300 text-[12px]">
                <Radio className="w-3 h-3" />
                مباشر
              </span>
              <span className="tabular-nums">{stats.active}</span> فرصة مفتوحة للتقديم الآن
            </div>

            <h1 className="mt-6 text-[36px] sm:text-[52px] lg:text-[60px] font-bold leading-[1.25] tracking-tight text-ink-950">
              فرصتك القادمة،
              <br />
              <span className="marker">من مصدرها الرسمي</span>
            </h1>

            <p className="mt-6 text-[15px] sm:text-[17px] text-ink-600 leading-[2] max-w-xl">
              نجمع لك إعلانات الوظائف الحكومية والعسكرية والشركات والتدريب ونتائج القبول في مكان واحد،
              مع عدّاد للمواعيد ورابط التقديم الرسمي المباشر.
            </p>

            <div className="mt-8 max-w-xl">
              <HeroSearch />
            </div>
          </div>

          {/* اللوحة الحيّة */}
          <div className="relative lg:ps-6">
            <div className="absolute inset-x-6 -bottom-3 h-full rounded-3xl bg-ink-950/90 -rotate-2 hidden sm:block" aria-hidden="true" />
            <div className="relative rounded-3xl bg-white border border-line shadow-lift overflow-hidden">
              <div className="flex items-center justify-between px-5 h-14 border-b border-line bg-paper/70">
                <div className="flex items-center gap-2 text-[14px] font-bold text-ink-900">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-70 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-500" />
                  </span>
                  آخر الإعلانات
                </div>
                <Link href="/jobs" className="text-[12.5px] font-semibold text-ink-500 hover:text-ink-950 inline-flex items-center gap-1">
                  عرض الكل <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ul className="divide-y divide-line">
                {latest.map((job) => {
                  const s = sectorStyle[job.sector];
                  const left = daysLeft(job.endDate);
                  return (
                    <li key={job.id}>
                      <Link href={`/jobs/${job.slug}`} className="flex items-center gap-3.5 px-5 py-4 hover:bg-paper/70 transition-colors group">
                        <span className="w-11 h-11 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0 overflow-hidden p-1.5 text-[16px] font-bold text-ink-500">
                          {job.companyLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={job.companyLogo} alt="" className="w-full h-full object-contain" loading="lazy" />
                          ) : (
                            initialsOf(job.company)
                          )}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[14px] font-bold text-ink-950 truncate group-hover:text-saffron-700 transition-colors">
                            {job.title}
                          </span>
                          <span className="mt-1 flex items-center gap-2 text-[12px] text-ink-500">
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            <span className="truncate">{job.company}</span>
                          </span>
                        </span>
                        <span
                          className={`shrink-0 h-7 px-2.5 inline-flex items-center rounded-full text-[12px] font-semibold ${
                            left < 0
                              ? 'bg-ink-100 text-ink-500'
                              : left <= 3
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-ink-50 text-ink-700'
                          }`}
                        >
                          {left < 0 ? 'منتهٍ' : left === 0 ? 'اليوم' : `${left} يوم`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/jobs"
                className="flex items-center justify-center gap-2 h-12 bg-ink-950 text-white text-[13.5px] font-semibold hover:bg-ink-800 transition-colors"
              >
                تصفّح جميع الإعلانات
                <ArrowUpLeft className="w-4 h-4 text-saffron-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= الأرقام ======================= */}
      {visibleNumbersCount > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl
            className={`-mt-8 relative z-10 grid ${
              visibleNumbersCount === 1
                ? 'grid-cols-1 lg:grid-cols-1'
                : visibleNumbersCount === 2
                  ? 'grid-cols-2 lg:grid-cols-2'
                  : visibleNumbersCount === 3
                    ? 'grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 lg:grid-cols-4'
            } rounded-3xl bg-ink-950 text-white overflow-hidden shadow-lift grain`}
          >
            {numbers.map((n, i) => (
              <div
                key={n.label}
                className={`px-6 py-6 sm:py-7 ${
                  i % 2 === 1 ? 'border-s border-white/10' : ''
                } ${
                  i >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''
                } ${
                  i > 0 ? 'lg:border-s lg:border-white/10' : ''
                }`}
              >
                <dd className="text-[30px] sm:text-[38px] font-bold leading-none tabular-nums text-saffron-300">
                  {n.value.toLocaleString('en-US')}
                </dd>
                <dt className="mt-2.5 text-[13px] text-ink-300">{n.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-24">
        {/* ======================= الأقسام ======================= */}
        <section aria-labelledby="cats-title">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-[12px] font-bold text-saffron-700 mb-1.5">ابدأ من هنا</p>
              <h2 id="cats-title" className="text-[24px] sm:text-[30px] font-bold text-ink-950">
                اختر مسارك الوظيفي
              </h2>
            </div>
            <Link href="/jobs" className="hidden sm:inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink-700 hover:text-ink-950">
              كل الوظائف <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const s = sectorStyle[c.sector];
              const Icon = c.icon;
              const count = jobs.filter((j) => matchesSector(j, c.sector)).length;
              return (
                <Link
                  key={c.sector}
                  href={c.href}
                  className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white border border-line hover:border-ink-950 hover:bg-ink-950 transition-all duration-300"
                >
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${s.soft} ${s.text} group-hover:bg-saffron-400 group-hover:text-ink-950 transition-colors`}>
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[17px] font-bold text-ink-950 group-hover:text-white transition-colors">{c.title}</span>
                    <span className="block mt-1 text-[13px] text-ink-500 group-hover:text-ink-300 transition-colors">{c.desc}</span>
                  </span>
                  <span className="text-end shrink-0">
                    <span className="block text-[22px] font-bold tabular-nums text-ink-950 group-hover:text-saffron-300 leading-none transition-colors">{count}</span>
                    <span className="block mt-1 text-[11px] text-ink-400">إعلان</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ======================= تنتهي قريباً ======================= */}
        {closingSoon.length > 0 && (
          <section aria-labelledby="closing-title">
            <div className="flex items-end justify-between gap-4 mb-7">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-rose-600 mb-1.5">
                  <Timer className="w-3.5 h-3.5" />
                  لا تتأخر
                </p>
                <h2 id="closing-title" className="text-[24px] sm:text-[30px] font-bold text-ink-950">
                  تنتهي خلال أسبوع
                </h2>
              </div>
            </div>

            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
              {closingSoon.map(({ job, left }) => {
                const s = sectorStyle[job.sector];
                return (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="snap-start shrink-0 w-[270px] sm:w-[300px] group rounded-2xl bg-white border border-line hover:border-ink-300 hover:shadow-lift transition-all p-5 flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-semibold ring-1 ${s.chip}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {job.sectorLabel}
                      </span>
                      <span className={`text-[12px] font-bold ${left <= 1 ? 'text-rose-600' : 'text-ink-600'}`}>
                        {left === 0 ? 'آخر يوم' : left === 1 ? 'يوم واحد' : `${left} أيام`}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[16px] font-bold leading-[1.65] text-ink-950 line-clamp-2 group-hover:text-saffron-700 transition-colors">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-ink-500 truncate">{job.company}</p>
                    <div className="mt-5 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${left <= 1 ? 'bg-rose-500' : 'bg-saffron-500'}`}
                        style={{ width: `${Math.max(8, 100 - left * 13)}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ======================= القائمة ======================= */}
        <AdBanner placement="home-top" label="إعلان" />
        <HomeJobFeed initialJobs={jobs} />

        {/* ======================= كيف نعمل ======================= */}
        <section aria-labelledby="how-title" className="rounded-3xl bg-paper-2 border border-line p-7 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-[12px] font-bold text-saffron-700 mb-1.5">كيف تعمل المنصة</p>
            <h2 id="how-title" className="text-[24px] sm:text-[30px] font-bold text-ink-950 leading-snug">
              ثلاث خطوات بين الإعلان والتقديم
            </h2>
          </div>
          <ol className="mt-9 grid md:grid-cols-3 gap-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="relative rounded-2xl bg-white border border-line p-6">
                  <span className="absolute top-5 end-5 text-[44px] font-bold leading-none text-ink-100 tabular-nums" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="w-12 h-12 rounded-xl bg-ink-950 text-saffron-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold text-ink-950">{s.title}</h3>
                  <p className="mt-2 text-[14px] text-ink-500 leading-[1.95]">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ======================= نتائج القبول ======================= */}
        {resultsJobs.length > 0 && (
          <section aria-labelledby="results-title">
            <div className="flex items-end justify-between gap-4 mb-7">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-rose-600 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  آخر المستجدات
                </p>
                <h2 id="results-title" className="text-[24px] sm:text-[30px] font-bold text-ink-950">
                  نتائج القبول والترشيح
                </h2>
              </div>
              <Link href="/results" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink-700 hover:text-ink-950 shrink-0">
                كل النتائج <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <ul className="grid md:grid-cols-2 gap-4">
              {resultsJobs.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/jobs/${item.slug}`}
                    className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-line hover:border-rose-300 hover:shadow-soft transition-all"
                  >
                    <span className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12px] font-bold text-rose-600">{item.company}</span>
                      <span className="block mt-1 text-[15.5px] font-bold text-ink-950 leading-[1.6] line-clamp-2 group-hover:text-rose-700 transition-colors">
                        {item.title}
                      </span>
                      <span className="block mt-1.5 text-[13px] text-ink-500 line-clamp-1">{item.summary}</span>
                    </span>
                    <ArrowUpLeft className="w-5 h-5 text-ink-300 group-hover:text-rose-600 transition-colors shrink-0 mt-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <AdBanner placement="home-bottom" label="إعلان" />

        <TelegramBanner />

        {/* ======================= الأسئلة الشائعة ======================= */}
        <section aria-labelledby="faq-title" className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <div className="lg:sticky lg:top-32 self-start">
            <p className="text-[12px] font-bold text-saffron-700 mb-1.5">الأسئلة الشائعة</p>
            <h2 id="faq-title" className="text-[24px] sm:text-[30px] font-bold text-ink-950 leading-snug">
              دليلك للتقديم والبحث عن عمل في المملكة
            </h2>
            <p className="mt-4 text-[14.5px] text-ink-500 leading-[1.95]">
              إجابات مختصرة على أكثر ما يسأل عنه الباحثون والباحثات عن عمل. لم تجد سؤالك؟
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-ink-950 text-ink-950 text-[14px] font-semibold hover:bg-ink-950 hover:text-white transition-colors"
            >
              <Send className="w-4 h-4" />
              راسلنا
            </Link>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl bg-white border border-line open:border-ink-300 open:shadow-soft transition-all"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-[15.5px] font-bold text-ink-950 [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <span className="w-8 h-8 rounded-full bg-paper-2 text-ink-700 flex items-center justify-center shrink-0 group-open:rotate-45 group-open:bg-saffron-400 transition-all">
                    <Plus className="w-4 h-4" />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[14.5px] text-ink-600 leading-[2]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
