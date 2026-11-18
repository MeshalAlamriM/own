import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJobBySlug, getAllJobs } from '@/data/store';
import SchemaJobPosting from '@/components/SchemaJobPosting';
import ShareButtons from '@/components/ShareButtons';
import BookmarkButton from '@/components/BookmarkButton';
import JobCountdown from '@/components/JobCountdown';
import JobCard from '@/components/JobCard';
import TelegramBanner from '@/components/TelegramBanner';
import AdBanner from '@/components/AdBanner';
import ViewCounter from '@/components/ViewCounter';
import {
  Building2,
  MapPin,
  GraduationCap,
  Users,
  Briefcase,
  CalendarRange,
  Banknote,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { sectorStyle } from '@/lib/ui';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const jobs = await getAllJobs();
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wadhaef-alyoum.sa';
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: 'الوظيفة غير موجودة',
      description: 'عذراً، الإعلان الوظيفي المطلوب غير موجود أو تم حذفه.',
    };
  }

  const cleanDescription = job.summary || job.description.replace(/<[^>]+>/g, '').slice(0, 160);

  return {
    title: `${job.title} | ${job.company}`,
    description: cleanDescription,
    keywords: [
      job.company,
      job.sectorLabel,
      job.city,
      ...job.qualifications,
      ...(job.tags || [])
    ],
    openGraph: {
      title: `${job.title} - ${job.company}`,
      description: cleanDescription,
      type: 'article',
      url: `${baseUrl}/jobs/${job.slug}`,
      images: [
        {
          url: job.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
          width: 1200,
          height: 630,
          alt: job.title,
        },
      ],
      publishedTime: job.publishDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} | ${job.company}`,
      description: cleanDescription,
    },
    alternates: {
      canonical: `${baseUrl}/jobs/${job.slug}`,
    },
    robots: job.status === 'expired' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const allJobs = await getAllJobs();
  const relatedJobs = allJobs
    .filter((j) => j.id !== job.id && (j.sector === job.sector || j.city === job.city))
    .slice(0, 3);

  const sector = sectorStyle[job.sector] ?? sectorStyle.government;
  const expired = job.status === 'expired';

  const facts = [
    { icon: GraduationCap, label: 'المؤهل المطلوب', value: job.qualifications.join('، ') },
    { icon: MapPin, label: 'مقر العمل', value: `${job.city} (${job.location})` },
    { icon: Users, label: 'الفئة المستهدفة', value: job.genderLabel },
    { icon: Briefcase, label: 'الخبرة', value: job.experience },
    { icon: Banknote, label: 'الراتب والحوافز', value: job.salary || 'بحسب اللوائح والأنظمة' },
    { icon: CalendarRange, label: 'فترة التقديم', value: `${job.startDate} ← ${job.endDate}` },
  ];

  return (
    <>
      <SchemaJobPosting job={job} />

      {/* ترويسة الإعلان */}
      <section className="relative isolate overflow-hidden bg-ink-950 text-white grain">
        <div className="absolute -z-10 -top-24 -left-16 w-[24rem] h-[24rem] rounded-full bg-saffron-400/20 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pb-14">
          <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-[13px] text-ink-300 overflow-x-auto scrollbar-none">
            <Link href="/" className="hover:text-white transition-colors shrink-0">الرئيسية</Link>
            <ChevronLeft className="w-3.5 h-3.5 shrink-0 text-ink-500" />
            <Link href={`/jobs?sector=${job.sector}`} className="hover:text-white transition-colors shrink-0">
              {job.sectorLabel}
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 shrink-0 text-ink-500" />
            <span className="text-white font-medium truncate">{job.company}</span>
          </nav>

          <div className="mt-8 flex items-start gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white flex items-center justify-center p-3 shrink-0 overflow-hidden shadow-lift">
              {job.companyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-9 h-9 text-ink-300" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[12.5px] font-semibold bg-white/10 ring-1 ring-white/15 text-white`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sector.dot}`} />
                  {job.sectorLabel}
                </span>
                <span className="inline-flex items-center h-7 px-3 rounded-full text-[12.5px] font-semibold bg-white/10 ring-1 ring-white/15 text-ink-200">
                  {job.genderLabel}
                </span>
                {job.urgent && (
                  <span className="inline-flex items-center h-7 px-3 rounded-full text-[12.5px] font-bold bg-rose-500 text-white">
                    إعلان عاجل
                  </span>
                )}
              </div>
              <p className="text-[14px] sm:text-[15px] font-semibold text-saffron-300">{job.company}</p>
              <h1 className="mt-1.5 text-[24px] sm:text-[36px] font-bold leading-[1.4] tracking-tight">{job.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-300">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  نُشر في {job.publishDate.split('T')[0]}
                </span>
                <ViewCounter jobId={job.id} initialViews={job.viewsCount} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
          {/* المحتوى الرئيسي */}
          <div className="space-y-10 min-w-0">
            <section aria-label="ملخص الإعلان" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facts.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-line">
                    <span className="w-10 h-10 rounded-xl bg-paper-2 text-ink-700 flex items-center justify-center shrink-0">
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-ink-400">{f.label}</p>
                      <p className="mt-1 text-[14.5px] font-bold text-ink-950 leading-[1.7] break-words">{f.value}</p>
                    </div>
                  </div>
                );
              })}
            </section>

            <article className="rounded-3xl bg-white border border-line p-6 sm:p-9 space-y-10">
              <div>
                <h2 className="text-[20px] font-bold text-ink-950 flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded-full bg-saffron-500" />
                  تفاصيل الإعلان والشواغر
                </h2>
                <div className="job-prose mt-5" dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h2 className="text-[20px] font-bold text-ink-950 flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-saffron-500" />
                    شروط التقديم
                  </h2>
                  <ul className="mt-5 grid gap-2.5">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-paper border border-line text-[14.5px] text-ink-800 leading-[1.9]">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h2 className="text-[20px] font-bold text-ink-950 flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-saffron-500" />
                    المزايا والحوافز
                  </h2>
                  <div className="mt-5 grid sm:grid-cols-2 gap-2.5">
                    {job.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-saffron-50 border border-saffron-100 text-[14.5px] text-ink-900">
                        <Sparkles className="w-[18px] h-[18px] text-saffron-600 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <AdBanner placement="job-detail" label="إعلان" />

            <ShareButtons title={job.title} />

            <div className="flex items-start gap-3.5 rounded-2xl bg-saffron-50 border border-saffron-200 p-5 text-[13.5px] leading-[1.95] text-ink-800">
              <ShieldCheck className="w-5 h-5 text-saffron-700 shrink-0 mt-1" />
              <p>
                <strong className="text-ink-950">تنبيه أمان:</strong> التقديم يتم حصرياً عبر الروابط الرسمية للجهات المعلنة.
                لا تحوّل أي مبالغ لأي شخص يدّعي توفير وظيفة، فجميع منصات التوظيف في المملكة مجانية.
              </p>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <aside className="space-y-4 lg:sticky lg:top-28" aria-label="التقديم">
            <JobCountdown endDate={job.endDate} startDate={job.startDate} />

            <div className="rounded-2xl bg-white border border-line p-5 space-y-3">
              {expired ? (
                <p className="text-[14px] text-ink-600 leading-[1.9]">
                  انتهت فترة التقديم لهذا الإعلان. يمكنك الاطلاع على الإعلانات المشابهة أدناه.
                </p>
              ) : (
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2.5 w-full min-h-[56px] px-5 rounded-xl bg-saffron-400 text-ink-950 text-[15.5px] font-bold hover:bg-saffron-300 transition-colors"
                >
                  <span>قدّم الآن على المنصة الرسمية</span>
                  <ExternalLink className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                </a>
              )}

              {job.sourceUrl && (
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-line bg-paper text-ink-800 text-[14px] font-semibold hover:border-ink-300 transition-colors"
                >
                  <span>المصدر الرسمي للإعلان</span>
                  <ExternalLink className="w-4 h-4 text-ink-400" />
                </a>
              )}

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[13px] text-ink-500">احفظ الإعلان للرجوع إليه</span>
                <BookmarkButton jobId={job.id} showText />
              </div>
            </div>
          </aside>
        </div>

        {/* وظائف مشابهة */}
        {relatedJobs.length > 0 && (
          <section className="mt-16" aria-labelledby="related-title">
            <div className="flex items-end justify-between gap-4 mb-7">
              <div>
                <p className="text-[12px] font-bold text-saffron-700 mb-1.5">قد تهمك أيضاً</p>
                <h2 id="related-title" className="text-[24px] sm:text-[28px] font-bold text-ink-950">
                  وظائف مشابهة
                </h2>
              </div>
              <Link href={`/jobs?sector=${job.sector}`} className="text-[14px] font-semibold text-ink-700 hover:text-ink-950 shrink-0">
                المزيد من {job.sectorLabel} ←
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedJobs.map((rJob) => (
                <JobCard key={rJob.id} job={rJob} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16">
          <TelegramBanner />
        </div>
      </div>

      {/* شريط التقديم السفلي للجوال */}
      {!expired && <div className="h-20 lg:hidden" aria-hidden="true" />}
      {!expired && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper/90 backdrop-blur-xl border-t border-line px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-ink-950 text-white text-[15px] font-bold"
          >
            <span>قدّم الآن</span>
            <ExternalLink className="w-4 h-4 text-saffron-400" />
          </a>
        </div>
      )}
    </>
  );
}
